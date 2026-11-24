// lib/email.ts
// Sends the "your card has arrived" email to a card's recipient via Resend.
// Safe to call more than once: it skips cards that were already emailed.

import { Resend } from "resend";
import prisma from "@/lib/prisma";
import { getGreeting, getOccasionEmoji } from "@/lib/helpers/greeting";
import { getTheme } from "@/lib/theme";

const resend = new Resend(process.env.RESEND_API_KEY);

// Must be on a domain verified in Resend (e.g. togathercards.com).
const FROM = process.env.EMAIL_FROM ?? "Togather <cards@togathercards.com>";
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://www.togathercards.com";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type DeliveryEmailResult = "sent" | "skipped" | "failed";

export async function sendDeliveryEmailForCard(
  cardId: string,
): Promise<DeliveryEmailResult> {
  try {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: {
        id: true,
        occasion: true,
        recipientName: true,
        recipientEmail: true,
        openingMessage: true,
        theme: true,
        status: true,
        signerCount: true,
        deliveryToken: true,
        deliveryEmailSentAt: true,
        creator: { select: { name: true } },
      },
    });

    // Nothing to do: not delivered yet, no address, or already emailed.
    if (
      !card ||
      card.status !== "delivered" ||
      !card.recipientEmail ||
      card.deliveryEmailSentAt
    ) {
      return "skipped";
    }

    const theme = getTheme(card.theme);
    const heading = getGreeting(card.occasion, card.recipientName);
    const emoji = getOccasionEmoji(card.occasion);
    const creator = card.creator.name;
    const cardUrl = `${APP_URL}/card/${card.deliveryToken}`;
    const messageCount = `${card.signerCount} ${
      card.signerCount === 1 ? "message is" : "messages are"
    }`;

    const openingBlock = card.openingMessage
      ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.7;font-style:italic;color:#3A2F27;">&ldquo;${escapeHtml(card.openingMessage)}&rdquo;</p>`
      : "";

    const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#FDF8F2;font-family:Helvetica,Arial,sans-serif;color:#1A1208;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FDF8F2;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #E8DDD0;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:${theme.to};padding:36px 32px;text-align:center;">
                <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${theme.accent};margin-bottom:12px;">${emoji} ${escapeHtml(card.occasion)}</div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;color:${theme.heading};">${escapeHtml(heading)}</div>
                <div style="font-size:14px;margin-top:12px;color:${theme.muted};">A card from ${escapeHtml(creator)} and friends</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;text-align:center;">
                ${openingBlock}
                <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#3A2F27;">${messageCount} waiting for you.</p>
                <a href="${cardUrl}" style="display:inline-block;background:#D4845A;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 32px;border-radius:999px;">Open your card</a>
                <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#8C7B6B;">Or paste this link into your browser:<br>${cardUrl}</p>
              </td>
            </tr>
          </table>
          <p style="max-width:520px;margin:16px 0 0;font-size:12px;line-height:1.6;color:#8C7B6B;">${escapeHtml(creator)} sent you this card using Togather. If it wasn&rsquo;t meant for you, you can ignore this email.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    const text = [
      heading,
      "",
      `A card from ${creator} and friends.`,
      card.openingMessage ? `\n"${card.openingMessage}"\n` : "",
      `${messageCount} waiting for you.`,
      "",
      `Open your card: ${cardUrl}`,
      "",
      `${creator} sent you this card using Togather. If it wasn't meant for you, you can ignore this email.`,
    ].join("\n");

    const { error } = await resend.emails.send({
      from: FROM,
      to: [card.recipientEmail],
      subject: heading,
      html,
      text,
    });

    if (error) {
      throw new Error(`${error.name}: ${error.message}`);
    }

    // Mark as sent. The null guard means two overlapping runs can't both
    // record it, and a failed send above leaves it null so the cron retries.
    await prisma.card.updateMany({
      where: { id: card.id, deliveryEmailSentAt: null },
      data: { deliveryEmailSentAt: new Date() },
    });

    return "sent";
  } catch (err) {
    console.error(`❌ Delivery email failed for card ${cardId}:`, err);
    return "failed";
  }
}

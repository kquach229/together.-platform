import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid webhook", { status: 400 });
  }

  try {
    console.log(`Clerk webhook ${evt.type} (${evt.data.id})`);

    if (evt.type === "user.created") {
      const {
        id,
        email_addresses,
        primary_email_address_id,
        first_name,
        last_name,
      } = evt.data;

      const primary =
        email_addresses?.find((e) => e.id === primary_email_address_id) ??
        email_addresses?.[0];
      const email = primary?.email_address;

      if (!email) {
        // Nothing we can store; don't make Clerk retry forever.
        console.error(`user.created for ${id} has no email, skipping`);
        return new Response("No email", { status: 200 });
      }

      const name =
        [first_name, last_name].filter(Boolean).join(" ").trim() ||
        email.split("@")[0];

      // A leftover row with this email but a different clerkId: link it
      // instead of failing on the unique constraint.
      const byEmail = await prisma.user.findUnique({ where: { email } });

      if (byEmail && byEmail.clerkId !== id) {
        await prisma.user.update({
          where: { id: byEmail.id },
          data: { clerkId: id },
        });
      } else {
        await prisma.user.upsert({
          where: { clerkId: id },
          update: {},
          create: { clerkId: id, email, name }, // cardsRemaining defaults to 1
        });
      }
    }

    if (evt.type === "user.deleted" && evt.data.id) {
      // deleteMany: no error if the row is already gone.
      // Note: this cascades to the user's cards, signatures and notifications.
      await prisma.user.deleteMany({ where: { clerkId: evt.data.id } });
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Webhook handler failed:", err);
    // 500 so Clerk retries; the real error is in the logs.
    return new Response("Handler error", { status: 500 });
  }
}

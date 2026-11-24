// app/api/cron/deliver-scheduled/route.ts
// Runs once a day (see vercel.json). Two jobs:
//   1. Deliver collecting cards whose scheduled delivery date has arrived.
//   2. Email recipients of recently delivered cards that haven't been emailed
//      yet. This also retries any email that failed earlier (for up to 3 days).

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendDeliveryEmailForCard } from "@/lib/email";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BATCH_SIZE = 50;
const RETRY_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;
const EMAIL_DELAY_MS = 600; // stay under Resend's rate limit
const EMAIL_TIME_BUDGET_MS = 50_000; // leave headroom under maxDuration

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET(req: NextRequest) {
  // Vercel sends "Authorization: Bearer <CRON_SECRET>". Reject everything else,
  // including the case where CRON_SECRET isn't configured.
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const now = new Date();
  const summary = { delivered: 0, emailed: 0, failed: 0, skipped: 0 };

  try {
    // ── 1. Deliver cards that are due ──────────────────────────
    // Cards with no signatures stay in "collecting", matching the dashboard,
    // which doesn't let you deliver an empty card.
    const due = await prisma.card.findMany({
      where: {
        status: "collecting",
        scheduledDeliveryAt: { lte: now },
        signerCount: { gt: 0 },
      },
      select: {
        id: true,
        creatorId: true,
        occasion: true,
        recipientName: true,
      },
      orderBy: { scheduledDeliveryAt: "asc" },
      take: BATCH_SIZE,
    });

    const emailStart = Date.now();

    for (const { id } of pending) {
      if (Date.now() - emailStart > EMAIL_TIME_BUDGET_MS) break; // rest go next run

      const result = await sendDeliveryEmailForCard(id);
      if (result === "sent") summary.emailed++;
      else if (result === "failed") summary.failed++;
      else summary.skipped++;

      await sleep(EMAIL_DELAY_MS);
    }

    // ── 2. Email recipients (new deliveries + retries) ─────────
    // The window keeps cards delivered long before this feature existed from
    // being emailed by surprise.
    const pending = await prisma.card.findMany({
      where: {
        status: "delivered",
        recipientEmail: { not: null },
        deliveryEmailSentAt: null,
        deliveredAt: { gte: new Date(now.getTime() - RETRY_WINDOW_MS) },
      },
      select: { id: true },
      orderBy: { deliveredAt: "asc" },
      take: BATCH_SIZE,
    });

    for (const { id } of pending) {
      const result = await sendDeliveryEmailForCard(id);
      if (result === "sent") summary.emailed++;
      else if (result === "failed") summary.failed++;
      else summary.skipped++;
    }

    console.log("📬 deliver-scheduled:", summary);
    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    console.error("❌ deliver-scheduled crashed:", err);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}

import prisma from "../lib/prisma";

const prices = [
  {
    plan: "plus",
    billingInterval: "monthly",
    stripePriceId: "price_1TGV8KAcAupqeU1Vs1YIYKNE",
    amountCents: 600,
  },
  {
    plan: "plus_annual",
    billingInterval: "annual",
    stripePriceId: "price_1TGV9zAcAupqeU1VLSZl40Ma",
    amountCents: 5800,
  },
  {
    plan: "team",
    billingInterval: "monthly",
    stripePriceId: "price_1TGV9DAcAupqeU1VKetdiivR",
    amountCents: 1800,
  },
  {
    plan: "team_annual",
    billingInterval: "annual",
    stripePriceId: "price_1TGVBrAcAupqeU1V2bR8SQqt",
    amountCents: 17300,
  },
];

async function main() {
  for (const p of prices) {
    await prisma.price.upsert({
      where: { stripePriceId: p.stripePriceId },
      update: {},
      create: p,
    });
  }
  console.log("Prices seeded");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

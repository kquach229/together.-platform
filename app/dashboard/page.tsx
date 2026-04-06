// app/dashboard/page.tsx
import { getUser } from "@/lib/helpers/getUser";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await getUser({
    cards: true,
    signatures: true,
    notifications: true,
  });

  // map + format
  const formattedUser = {
    ...user,
    cards: user?.cards.map((card) => ({
      ...card,
      createdAt: card.createdAt.toISOString(),
      ...("signingDeadline" in card && {
        signingDeadline: card.signingDeadline?.toISOString() ?? null,
      }),

      ...("deliveredAt" in card && {
        deliveredAt: card.deliveredAt?.toISOString() || null,
      }),
    })),
  };

  return <DashboardClient user={formattedUser} />;
}

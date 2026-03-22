// app/dashboard/page.tsx
import { getUser } from "@/lib/helpers/getUser";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await getUser({
    subscription: true,
    cards: true,
    notifications: true,
    signatures: true,
  });

  return <DashboardClient user={user} />;
}

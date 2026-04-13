import { NextResponse } from "next/server";
import { getUser } from "@/lib/helpers/getUser";

export async function GET() {
  const user = await getUser({
    cards: true,
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(user);
}

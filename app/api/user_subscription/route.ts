import { getUser } from "@/lib/helpers/getUser";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  try {
    const subscriptionData = await prisma.userSubscription.findUnique({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(subscriptionData);
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch user subscription" },
      { status: 500 },
    );
  }
}

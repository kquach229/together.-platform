import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

type IncludeOptions = {
  subscription?: boolean;
  cards?: boolean;
  notifications?: boolean;
  signatures?: boolean;
  userSubscription?: boolean;
};

export async function getUser(include: IncludeOptions = {}) {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const includeObj: Record<string, boolean> = {};
  if (include.subscription) includeObj.subscription = true;
  if (include.cards) includeObj.cards = true;
  if (include.notifications) includeObj.notifications = true;
  if (include.signatures) includeObj.signatures = true;
  if (include.userSubscription) includeObj.userSubscription = true;

  // Fetch from Prisma
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: includeObj,
  });

  if (!user) return null;

  // Merge Clerk fields
  return {
    ...user,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    email: clerkUser.emailAddresses[0]?.emailAddress || "",
  };
}

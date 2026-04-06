import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

type IncludeOptions = {
  subscription?: boolean;
  cards?: boolean;
  notifications?: boolean;
  signatures?: boolean;
};

export async function getUser(include: IncludeOptions = {}) {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const includeObj: Record<string, boolean> = {};
  if (include.subscription) includeObj.subscription = true;
  if (include.cards) includeObj.cards = true;
  if (include.notifications) includeObj.notifications = true;
  if (include.signatures) includeObj.signatures = true;

  // Get the user record from Prisma
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: includeObj,
  });

  if (!user) return null;

  // Merge in Clerk fields for firstName, lastName, email
  // redeploy
  return {
    ...user,
  };
}

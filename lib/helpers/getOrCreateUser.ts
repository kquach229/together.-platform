import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function getOrCreateUser() {
  const user = await currentUser();

  if (!user) return null;

  const existingUser = await prisma?.user?.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!existingUser) {
    const newUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName || "No Name",
      },
    });

    return newUser;
  }

  return existingUser;
}

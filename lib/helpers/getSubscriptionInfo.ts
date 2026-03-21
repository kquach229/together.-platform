import { currentUser } from "@clerk/nextjs/server";
import prisma from "../prisma";

const getSubscriptionInfo = async () => {
  const user = await currentUser();
  if (!user) return null;

  const planInfo = prisma.userSubscription.findUnique({
    where: {
      userId: user.id,
    },
  });

  return planInfo;
};

export { getSubscriptionInfo };

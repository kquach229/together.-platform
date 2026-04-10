// import { verifyWebhook } from "@clerk/nextjs/webhooks";
// import { NextRequest } from "next/server";
// import prisma from "@/lib/prisma";

// export async function POST(req: NextRequest) {
//   try {
//     console.log("Received Clerk webhook, verifying...");
//     const evt = await verifyWebhook(req);
//     const { id } = evt.data;
//     const eventType = evt.type;
//     console.log(
//       `Received webhook with ID ${id} and event type of ${eventType}`,
//     );

//     if (eventType === "user.created") {
//       const { id, email_addresses, first_name, last_name } = evt.data;
//       const user = await prisma.user.upsert({
//         where: { clerkId: id },
//         update: {},
//         create: {
//           clerkId: id,
//           email: email_addresses[0].email_address,
//           name: `${first_name} ${last_name}`,
//         },
//       });

//       await prisma.userSubscription.create({
//         data: {
//           userId: user.id,
//           stripeSubscriptionId: "temp-id", // optional place
//           stripePriceId: "price_free", //
//           plan: "free",
//           billingInterval: "monthly",
//           status: "active",
//         },
//       });
//     }

//     return new Response("Webhook received", { status: 200 });
//   } catch (err) {
//     console.error("Error verifying webhook:", err);
//     return new Response("Error verifying webhook", { status: 400 });
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     const evt = await verifyWebhook(req);
//     const { id } = evt.data;
//     const eventType = evt.type;
//     console.log(
//       `Received webhook with ID ${id} and event type of ${eventType}`,
//     );

//     if (eventType === "user.deleted") {
//       const user = await prisma.user.findUnique({
//         where: { clerkId: id },
//       });

//       if (user) {
//         await prisma.userSubscription.deleteMany({
//           where: { userId: user.id },
//         });

//         await prisma.user.delete({
//           where: { id: user.id },
//         });
//       }
//     }

//     return new Response("Webhook received", { status: 200 });
//   } catch (err) {
//     console.error("Error verifying webhook:", err);
//     return new Response("Error verifying webhook", { status: 400 });
//   }
// }

import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    console.log("Received Clerk webhook, verifying...");
    const evt = await verifyWebhook(req);

    console.log("Event type:", evt.type);

    if (evt.type === "user.created") {
      const { id, email_addresses, first_name, last_name } = evt.data;

      const email = email_addresses?.[0]?.email_address;
      if (!email) throw new Error("No email found");

      const name = [first_name, last_name].filter(Boolean).join(" ");

      const user = await prisma.user.upsert({
        where: { clerkId: id },
        update: {},
        create: {
          clerkId: id,
          email,
          name,
        },
      });

      await prisma.userSubscription.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          stripeSubscriptionId: "temp-id",
          stripePriceId: "price_free",
          plan: "free",
          billingInterval: "monthly",
          status: "active",
        },
      });

      console.log("User + subscription created:", user.id);
    }

    if (evt.type === "user.deleted") {
      const { id } = evt.data;

      const user = await prisma.user.findUnique({
        where: { clerkId: id },
      });

      if (user) {
        await prisma.userSubscription.deleteMany({
          where: { userId: user.id },
        });

        await prisma.user.delete({
          where: { id: user.id },
        });

        console.log("User deleted:", id);
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}

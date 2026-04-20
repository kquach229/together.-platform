"use client";

import Image from "next/image";
import ReusableButton from "./components/ReusableButton";
import { ArrowRight, Link, ImagePlus, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const steps = [
  {
    icon: <ImagePlus className="text-terracotta w-6 h-6" />,
    title: "Create a Card",
    description:
      "Pick an occasion, add a cover, and personalize your card in seconds.",
  },
  {
    icon: <Link className="text-terracotta w-6 h-6" />,
    title: "Share a Link",
    description:
      "Send a single link to everyone — no app downloads, no sign-ups needed.",
  },
  {
    icon: <Send className="text-terracotta w-6 h-6" />,
    title: "Deliver It",
    description:
      "Send the finished card to the recipient at just the right moment.",
  },
];

const occasions = [
  "🎂 Birthdays",
  "💍 Weddings",
  "👋 Farewells",
  "🎉 Retirements",
  "🍼 Baby Showers",
  "💼 New Jobs",
];

// Reusable animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15 },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function Home() {
  const router = useRouter();

  const handleCreateCard = () => {
    router.push("/create");
  };
  return (
    <div className="font-dm-sans">
      {/* Hero */}
      <section className="flex min-h-[80vh] items-center justify-center px-10">
        <div className="max-w-5xl w-full flex items-center gap-16">
          {/* Left — text */}
          <div className="flex-1 flex flex-col">
            <div className="mb-4 w-fit overflow-hidden">
              <motion.h1
                className="text-foreground text-3xl"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                GROUP GREETING CARDS,
              </motion.h1>
              <motion.h1
                className="text-terracotta text-5xl font-bold italic text-right"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                REIMAGINED.
              </motion.h1>
            </div>

            <motion.h5
              className="text-muted-taupe max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              Create a card for any occasion. Share a link. Watch everyone's
              messages and photos come together in one beautiful place.
            </motion.h5>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
            >
              <ReusableButton
                onClick={handleCreateCard}
                style={{ marginTop: 28, padding: 24 }}
              >
                Create Your First Card. It's on Us!
                <ArrowRight />
              </ReusableButton>
            </motion.div>
          </div>

          {/* Right — image collage */}
          <div className="flex-1 relative h-120 hidden md:block">
            <motion.div
              className="absolute top-0 left-4 w-64 h-72 rounded-2xl overflow-hidden shadow-md"
              initial={{ opacity: 0, y: 40, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <Image
                src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400"
                alt="People celebrating"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              className="absolute top-0 right-0 w-44 h-44 rounded-2xl overflow-hidden shadow-md"
              initial={{ opacity: 0, y: -30, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 2 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <Image
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300"
                alt="Birthday card"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              className="absolute bottom-0 right-0 w-52 h-52 rounded-2xl overflow-hidden shadow-md"
              initial={{ opacity: 0, y: 40, rotate: 1 }}
              animate={{ opacity: 1, y: 0, rotate: 1 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <Image
                src="https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=300"
                alt="Group signing card"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              className="absolute bottom-10 left-0 w-36 h-36 rounded-2xl overflow-hidden shadow-md"
              initial={{ opacity: 0, x: -30, rotate: -1 }}
              animate={{ opacity: 1, x: 0, rotate: -1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200"
                alt="Celebration"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-warm-sand py-20 px-10">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-center text-foreground mb-2"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            How it Works
          </motion.h2>
          <motion.p
            className="text-center text-muted-taupe mb-12"
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Three simple steps to a card everyone will love.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="bg-background rounded-2xl p-6 flex flex-col gap-3 shadow-sm"
                variants={scaleIn}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 },
                }}
              >
                <div className="bg-warm-sand rounded-full w-10 h-10 flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="text-foreground">{step.title}</h3>
                <p className="text-muted-taupe text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="py-20 px-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-foreground mb-2"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            A Card for Every Occasion
          </motion.h2>
          <motion.p
            className="text-muted-taupe mb-10"
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Whatever the moment, make it memorable.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-3">
            {occasions.map((occasion, i) => (
              <motion.span
                key={i}
                className="bg-warm-sand text-foreground text-sm font-medium px-5 py-2 rounded-full border border-warm-border cursor-default"
                variants={fadeUp}
                custom={i * 0.5}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                whileHover={{
                  scale: 1.08,
                  backgroundColor: "#D4845A",
                  color: "#fff",
                  transition: { duration: 0.15 },
                }}
              >
                {occasion}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <motion.section
        className="bg-terracotta py-20 px-10 text-center"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-white mb-3"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Ready to make someone's day?
        </motion.h2>
        <motion.p
          className="text-white/80 mb-8"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          It only takes a minute to create something they'll never forget.
        </motion.p>
        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <ReusableButton onClick={handleCreateCard}>
            Get Started Free. First Card is on Us!
            <ArrowRight />
          </ReusableButton>
        </motion.div>
      </motion.section>
    </div>
  );
}

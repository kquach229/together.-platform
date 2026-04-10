// app/about/page.tsx

import Link from "next/link";

const values = [
  {
    emoji: "💌",
    title: "Moments deserve more than a mass email",
    body: "A group card isn't just a formality — it's a record of who showed up. We built Together to make that easy, not an afterthought.",
  },
  {
    emoji: "🔒",
    title: "Private until it lands",
    body: "Messages stay completely hidden from the recipient until you choose to deliver. No accidental spoilers. No peeking.",
  },
  {
    emoji: "✨",
    title: "Simple on purpose",
    body: "No accounts needed to sign. No apps to install. Just a link, a message, and the people who matter.",
  },
  {
    emoji: "🌍",
    title: "Built for distributed teams",
    body: "When your team is across six time zones, 'passing the card around' doesn't work. Together does.",
  },
];

const team = [
  {
    initials: "AK",
    name: "Alex Kim",
    role: "Co-founder & CEO",
    color: { bg: "#F5EAD8", text: "#C4734A" },
  },
  {
    initials: "SP",
    name: "Sofia Patel",
    role: "Co-founder & Design",
    color: { bg: "#EEF3EE", text: "#5A7D66" },
  },
  {
    initials: "MR",
    name: "Marcus Reid",
    role: "Engineering",
    color: { bg: "#F0EBF8", text: "#6B5A9E" },
  },
  {
    initials: "JL",
    name: "Jamie Lee",
    role: "Growth",
    color: { bg: "#E6F1FB", text: "#185FA5" },
  },
];

const timeline = [
  {
    year: "2022",
    event:
      "Started as an internal tool at a remote-first startup. The team used it to send their first group farewell card.",
  },
  {
    year: "2023",
    event: "Opened to the public. 10,000 cards sent in the first three months.",
  },
  {
    year: "2024",
    event: "Launched Team plan. Slack integration. 500,000 messages delivered.",
  },
  {
    year: "2025",
    event:
      "Photo uploads, scheduled delivery, and a new design. Still just a small, focused team.",
  },
];

export default function About() {
  return (
    <div className="font-dm-sans bg-[#FDF8F2] text-[#1A1208] overflow-x-hidden">
      {/* HERO */}
      <section className="max-w-[720px] mx-auto px-8 pt-20 pb-16 text-center">
        <h1 className="font-playfair text-[clamp(36px,6vw,64px)] leading-[1.05] tracking-[-2px] mb-6">
          We believe every goodbye,
          <br />
          <em className="text-terracotta">every milestone</em>,
          <br />
          deserves a real moment.
        </h1>
        <p className="text-[17px] text-[#8C7B6B] font-light leading-[1.75]">
          Together started with one question: why is it so hard to do something
          thoughtful for the people you work with?
        </p>
      </section>

      {/* ORIGIN STORY */}
      <section className="max-w-[1060px] mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Decorative card stack */}
          <div className="relative h-[320px] hidden md:block">
            {[
              {
                theme: { from: "#FEF3ED", to: "#F5EAD8" },
                rotate: "-6deg",
                z: 1,
                text: "Happy retirement, Susan! 🎉",
              },
              {
                theme: { from: "#EEF3EE", to: "#D4E8D4" },
                rotate: "2deg",
                z: 2,
                text: "Congrats on the new role, James 🚀",
              },
              {
                theme: { from: "#F0EBF8", to: "#E2D4F0" },
                rotate: "8deg",
                z: 3,
                text: "We'll miss you, María 💐",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-2xl border border-[#E8DDD0] flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${card.theme.from}, ${card.theme.to})`,
                  transform: `rotate(${card.rotate})`,
                  zIndex: card.z,
                  top: `${i * 12}px`,
                  left: `${i * 8}px`,
                  right: `${i * 8}px`,
                }}
              >
                <p className="font-playfair text-[18px] tracking-tight text-[#1A1208] px-8 text-center">
                  {card.text}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-playfair text-[32px] tracking-tight mb-5">
              Built to make group cards simple for teams and personal moments.
            </h2>

            <p className="text-[15px] text-[#8C7B6B] font-light leading-[1.85] mb-5">
              The idea came from a common problem in both remote teams and
              personal groups: creating a meaningful farewell, birthday, or
              celebration card often turns into a messy coordination process.
              People end up using Google Docs, email threads, and chat messages,
              which can lead to missed contributions and a rushed final result.
            </p>

            <p className="text-[15px] text-[#8C7B6B] font-light leading-[1.85]">
              Together brings everything into one place so anyone can collect
              messages and photos, collaborate easily, and deliver a shared
              digital card at the right time. It works for workplace moments
              like team farewells and promotions, as well as personal occasions
              like birthdays, weddings, and celebrations with friends and
              family.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-[#F5EAD8] py-24 px-8">
        <div className="max-w-[1060px] mx-auto">
          <p className="text-[11px] font-medium tracking-[2px] uppercase text-terracotta mb-3 text-center">
            What we believe
          </p>
          <h2 className="font-playfair text-[clamp(28px,3vw,42px)] tracking-tight text-center mb-14">
            Our principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl border border-[#E8DDD0] p-6"
              >
                <div className="text-2xl mb-4">{v.emoji}</div>
                <h3 className="font-playfair text-[20px] tracking-tight mb-3">
                  {v.title}
                </h3>
                <p className="text-sm text-[#8C7B6B] font-light leading-[1.75]">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

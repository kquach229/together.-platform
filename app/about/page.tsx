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
              It started with a farewell card that almost didn't happen.
            </h2>
            <p className="text-[15px] text-[#8C7B6B] font-light leading-[1.85] mb-5">
              In 2022, a team of remote workers scrambled to put together
              something meaningful for a colleague who was leaving. They tried
              Google Docs, shared folders, email chains. It was chaotic, someone
              spoiled the surprise, and the final result felt like an
              afterthought.
            </p>
            <p className="text-[15px] text-[#8C7B6B] font-light leading-[1.85]">
              So they built the tool they wished existed — something that makes
              it genuinely easy to organise a group card, collect real messages
              from real people, and deliver it at just the right moment. That
              tool became Together.
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

      {/* TIMELINE */}
      <section className="max-w-[680px] mx-auto px-8 py-24">
        <p className="text-[11px] font-medium tracking-[2px] uppercase text-terracotta mb-3 text-center">
          How we got here
        </p>
        <h2 className="font-playfair text-[clamp(28px,3vw,42px)] tracking-tight text-center mb-14">
          A brief history
        </h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[52px] top-0 bottom-0 w-px bg-[#E8DDD0]" />
          <div className="flex flex-col gap-10">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="shrink-0 w-[52px] text-right">
                  <span className="text-sm font-medium text-terracotta">
                    {item.year}
                  </span>
                </div>
                {/* Dot */}
                <div className="shrink-0 w-3 h-3 rounded-full bg-terracotta border-2 border-[#FDF8F2] mt-1 relative z-10" />
                <p className="text-[15px] text-[#8C7B6B] font-light leading-[1.75] flex-1">
                  {item.event}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-white border-t border-[#E8DDD0] py-24 px-8">
        <div className="max-w-[1060px] mx-auto">
          <p className="text-[11px] font-medium tracking-[2px] uppercase text-terracotta mb-3 text-center">
            The people behind it
          </p>
          <h2 className="font-playfair text-[clamp(28px,3vw,42px)] tracking-tight text-center mb-14">
            Our team
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl border border-[#E8DDD0]"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-medium font-dm-sans"
                  style={{
                    background: member.color.bg,
                    color: member.color.text,
                  }}
                >
                  {member.initials}
                </div>
                <div>
                  <div className="font-medium text-sm">{member.name}</div>
                  <div className="text-xs text-[#8C7B6B] font-light mt-1">
                    {member.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[#8C7B6B] font-light mt-10 max-w-[480px] mx-auto leading-[1.75]">
            We're a small, remote-first team. We use Together for our own
            milestones — which means we feel every bug and every improvement
            personally.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#1A1208] py-20 px-8">
        <div className="max-w-[1060px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#2E2820] rounded-2xl overflow-hidden">
            {[
              { number: "500K+", label: "Messages delivered" },
              { number: "80K+", label: "Cards created" },
              { number: "150+", label: "Countries" },
              { number: "4.9★", label: "Average rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#1A1208] px-8 py-10 text-center"
              >
                <div className="font-playfair text-[clamp(28px,3vw,40px)] tracking-tight text-[#FDF8F2] mb-2">
                  {stat.number}
                </div>
                <div className="text-xs text-[#8C7B6B] font-light tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FDF8F2] border-t border-[#E8DDD0] py-24 px-8 text-center">
        <h2 className="font-playfair text-[clamp(28px,4vw,48px)] tracking-tight mb-4">
          Want to work with us?
        </h2>
        <p className="text-[16px] text-[#8C7B6B] font-light leading-[1.75] max-w-[420px] mx-auto mb-10">
          We're always open to meeting people who care about the same things we
          do. Drop us a line.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="mailto:hello@together.so"
            className="bg-terracotta text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-[#C4734A] transition-colors no-underline"
          >
            Say hello →
          </Link>
          <Link
            href="/create"
            className="border border-[#E8DDD0] text-[#1A1208] px-8 py-3.5 rounded-full text-sm font-medium hover:border-terracotta hover:text-terracotta transition-all no-underline"
          >
            Try Together free
          </Link>
        </div>
      </section>
    </div>
  );
}

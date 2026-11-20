"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const steps = [
  {
    num: "01",
    label: "Create",
    title: "Create your card in 60 seconds",
    desc: "Pick an occasion, give the card a recipient name, and choose a theme. That's it — your card is ready to share before you've finished your coffee.",
    detail: [
      "18 occasions to choose from — birthdays, weddings, graduations, and more",
      "6 built-in themes, 40+ premium themes with Plus",
      "Optional opening message that appears at the top of the card",
      "Set a signing deadline so nobody misses it",
    ],
    emoji: "✏️",
    color: { from: "#FEF3ED", to: "#F5EAD8" },
    accentBg: "bg-[#FEF3ED]",
    accentText: "text-[#D4845A]",
    mockup: "create",
  },
  {
    num: "02",
    label: "Invite",
    title: "Share a link",
    desc: "Copy your private signing link and drop it anywhere. Anyone who clicks it can sign.",
    detail: [
      "One private link, shareable anywhere",
      "Signers add text messages and optional photos",
      "You get notified every time someone signs",
      "Signers can see who else has signed, but not their messages",
    ],
    emoji: "🔗",
    color: { from: "#EEF3EE", to: "#D4E8D4" },
    accentBg: "bg-[#EEF3EE]",
    accentText: "text-[#5A7D66]",
    mockup: "invite",
  },
  {
    num: "03",
    label: "Collect",
    title: "Watch the messages roll in",
    desc: "Your dashboard shows who's signed in real time. Messages stay completely hidden from the recipient until you're ready to deliver. No spoilers.",
    detail: [
      "Live dashboard with signer count and previews",
      "All messages private until you hit deliver",
      "Send reminders to people who haven't signed yet",
      "Edit or delete messages before delivery (Plus)",
    ],
    emoji: "📬",
    color: { from: "#F0EBF8", to: "#E2D4F0" },
    accentBg: "bg-[#F0EBF8]",
    accentText: "text-[#6B5A9E]",
    mockup: "collect",
  },
  {
    num: "04",
    label: "Deliver",
    title: "Send it when the moment is right",
    desc: "When you're ready, deliver the card with one click — or schedule it to arrive at the perfect time, like exactly on their birthday morning.",
    detail: [
      "Deliver instantly or schedule for a specific date and time",
      "Send via email directly or share the card link yourself",
      "Recipient sees all messages together in one beautiful page",
      "Recipients can download the card as a PDF keepsake",
    ],
    emoji: "🎁",
    color: { from: "#E6F1FB", to: "#C8DFF5" },
    accentBg: "bg-[#E6F1FB]",
    accentText: "text-[#185FA5]",
    mockup: "deliver",
  },
];

const faqs = [
  {
    q: "Do signers need to create an account?",
    a: "No. Anyone with the signing link can add their message and photo without signing up. Only the card creator needs an account.",
  },
  {
    q: "Can the recipient see the card before I send it?",
    a: "Never. All messages are completely hidden until you choose to deliver the card. You're in full control of the timing.",
  },
  {
    q: "How many people can sign one card?",
    a: "On the free plan, up to 10 signers per card. Plus and Team plans support unlimited signers.",
  },
  {
    q: "What happens after I deliver the card?",
    a: "The recipient gets a link to their card page, where they can read every message, view photos, and download a PDF keepsake.",
  },
  {
    q: "Can I edit a card after it's been delivered?",
    a: "Delivered cards are locked to preserve the moment. But you can always create a new one!",
  },
];

function CreateMockup() {
  const [selected, setSelected] = useState("Birthday");
  const occasions = [
    { emoji: "🎂", label: "Birthday" },
    { emoji: "👋", label: "Farewell" },
    { emoji: "🎊", label: "Congratulations" },
    { emoji: "💍", label: "Wedding" },
    { emoji: "🍼", label: "New Baby" },
    { emoji: "❤️‍🩹", label: "Get Well Soon" },
    { emoji: "🎓", label: "Graduation" },
    { emoji: "🙏", label: "Thank You" },
    { emoji: "🎄", label: "Holiday" },
    { emoji: "🏆", label: "Work Anniversary" },
    { emoji: "🌟", label: "Just Because" },
    { emoji: "🕊️", label: "Sympathy" },
    { emoji: "💖", label: "Anniversary" },
    { emoji: "🏡", label: "Housewarming" },
    { emoji: "👶", label: "Baby Shower" },
    { emoji: "🎖️", label: "Retirement" },
    { emoji: "💪", label: "Encouragement" },
    { emoji: "❤️", label: "Love & Appreciation" },
  ];
  return (
    <div className="bg-white rounded-2xl border border-[#E8DDD0] p-5 shadow-[0_8px_32px_rgba(26,18,8,0.07)]">
      <div className="text-[10px] font-medium tracking-[1.5px] uppercase text-muted-taupe mb-3">
        Choose occasion
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {occasions.map((o) => (
          <button
            key={o.label}
            onClick={() => setSelected(o.label)}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all font-dm-sans cursor-pointer ${selected === o.label ? "border-terracotta bg-[#FEF3ED]" : "border-[#E8DDD0] bg-[#FAFAFA] hover:border-[#C5B8AD]"}`}
          >
            <span className="text-xl">{o.emoji}</span>
            <span className="text-[10px] font-medium text-[#1A1208]">
              {o.label}
            </span>
          </button>
        ))}
      </div>
      <div className="text-[10px] font-medium tracking-[1.5px] uppercase text-muted-taupe mb-2">
        Recipient
      </div>
      <div className="w-full px-3 py-2 border border-[#E8DDD0] rounded-lg text-sm text-[#1A1208] bg-white mb-3">
        Sarah Chen
      </div>
      <button className="w-full py-2.5 rounded-full text-xs font-medium bg-terracotta text-white font-dm-sans border-none cursor-pointer">
        Create card →
      </button>
    </div>
  );
}

function InviteMockup() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#E8DDD0] p-5 shadow-[0_8px_32px_rgba(26,18,8,0.07)]">
      <div className="text-[10px] font-medium tracking-[1.5px] uppercase text-muted-taupe mb-3">
        Signing link
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1 px-3 py-2 border border-[#E8DDD0] rounded-lg text-xs font-mono text-muted-taupe bg-[#FAFAFA] truncate">
          togather.co/sign/abc-xyz
        </div>
        <button
          onClick={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all font-dm-sans border-none cursor-pointer ${copied ? "bg-[#7B9E87] text-white" : "bg-terracotta text-white hover:bg-[#C4734A]"}`}
        >
          {copied ? "✓" : "Copy"}
        </button>
      </div>
      <div className="text-[10px] font-medium tracking-[1.5px] uppercase text-muted-taupe mb-2">
        Share via
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { icon: "💬", label: "Slack" },
          { icon: "✉️", label: "Email" },
          { icon: "📱", label: "WhatsApp" },
        ].map((s) => (
          <button
            key={s.label}
            className="flex-1 min-w-[70px] flex items-center justify-center gap-1.5 px-2 py-2 border border-[#E8DDD0] rounded-lg text-xs font-medium hover:border-terracotta hover:text-terracotta transition-all font-dm-sans bg-white cursor-pointer"
          >
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-[#F5EAD8] rounded-xl px-3 py-2.5">
        <span className="text-sm">🔒</span>
        <span className="text-[11px] text-muted-taupe font-light">
          Only people with this link can sign
        </span>
      </div>
    </div>
  );
}

function CollectMockup() {
  const signers = [
    {
      initials: "JM",
      name: "James M.",
      preview: "So glad to have you...",
      time: "2h ago",
      bg: "#F5EAD8",
      color: "#C4734A",
    },
    {
      initials: "PR",
      name: "Priya R.",
      preview: "Happy birthday! 🥂",
      time: "5h ago",
      bg: "#EEF3EE",
      color: "#5A7D66",
    },
    {
      initials: "TK",
      name: "Tom K.",
      preview: "You make every day...",
      time: "1d ago",
      bg: "#F0EBF8",
      color: "#6B5A9E",
    },
    {
      initials: "AL",
      name: "Amy L.",
      preview: "Wishing you all the...",
      time: "1d ago",
      bg: "#E6F1FB",
      color: "#185FA5",
    },
  ];
  return (
    <div className="bg-white rounded-2xl border border-[#E8DDD0] p-5 shadow-[0_8px_32px_rgba(26,18,8,0.07)]">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="text-[10px] font-medium tracking-[1.5px] uppercase text-muted-taupe">
          Signed so far
        </div>
        <div className="text-xs font-medium text-terracotta bg-[#FEF3ED] px-2.5 py-1 rounded-full">
          4 of ~12
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-3">
        {signers.map((s) => (
          <div
            key={s.name}
            className="flex items-center gap-2.5 bg-[#FAFAFA] border border-[#E8DDD0] rounded-xl p-2.5"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-medium shrink-0"
              style={{ background: s.bg, color: s.color }}
            >
              {s.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium">{s.name}</div>
              <div className="text-[10px] text-muted-taupe truncate">
                {s.preview}
              </div>
            </div>
            <div className="text-[9px] text-muted-taupe shrink-0">{s.time}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-[#FEF3ED] border border-[#EDD5C5] rounded-xl px-3 py-2">
        <span className="text-sm">⏰</span>
        <span className="text-xs text-[#D4845A] font-medium">
          Deadline: Mar 20 · 4 days left
        </span>
      </div>
    </div>
  );
}

function DeliverMockup() {
  const [delivered, setDelivered] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-[#E8DDD0] p-5 shadow-[0_8px_32px_rgba(26,18,8,0.07)]">
      {!delivered ? (
        <>
          <div className="text-[10px] font-medium tracking-[1.5px] uppercase text-muted-taupe mb-3">
            Deliver card
          </div>
          <div className="rounded-xl overflow-hidden border border-[#E8DDD0] mb-4">
            <div
              className="h-14 flex items-end px-4 pb-2"
              style={{ background: "linear-gradient(135deg,#FEF3ED,#F5EAD8)" }}
            >
              <span className="font-playfair text-base tracking-tight text-[#1A1208]">
                Happy Birthday, Sarah!
              </span>
            </div>
            <div className="px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs text-muted-taupe">
                8 signatures · 2 photos
              </span>
              <span className="text-xs font-medium text-[#7B9E87]">
                Ready ✓
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setDelivered(true)}
              className="w-full py-2.5 rounded-full text-xs font-medium bg-terracotta text-white hover:bg-[#C4734A] transition-colors font-dm-sans border-none cursor-pointer"
            >
              Send now 🎉
            </button>
            <button className="w-full py-2.5 rounded-full text-xs font-medium border border-[#E8DDD0] text-[#1A1208] hover:border-terracotta hover:text-terracotta transition-all font-dm-sans cursor-pointer bg-white">
              Schedule delivery
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="text-4xl mb-3">🎉</div>
          <div className="font-playfair text-lg tracking-tight mb-1">
            Card delivered!
          </div>
          <div className="text-xs text-muted-taupe font-light mb-4">
            Sarah Chen just received her card.
          </div>
          <button
            onClick={() => setDelivered(false)}
            className="text-xs text-terracotta font-medium hover:underline bg-transparent border-none cursor-pointer"
          >
            Reset demo
          </button>
        </div>
      )}
    </div>
  );
}

const mockupMap = {
  create: CreateMockup,
  invite: InviteMockup,
  collect: CollectMockup,
  deliver: DeliverMockup,
};

export default function HowItWorks() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const router = useRouter();

  const handleCreateCard = () => {
    router.push("/create");
  };

  return (
    <div className="font-dm-sans bg-[#FDF8F2] text-[#1A1208] min-h-screen overflow-x-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden px-4 sm:px-8 md:px-12 py-16 sm:py-20 md:py-24 text-center">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,#F5EAD8_0%,transparent_70%)] -top-32 -left-40 opacity-70 pointer-events-none" />
        <div className="absolute w-100 h-100 rounded-full bg-[radial-gradient(circle,#EEF3EE_0%,transparent_70%)] -bottom-20 -right-24 opacity-60 pointer-events-none" />
        <div className="relative z-10 max-w-[680px] mx-auto">
          <h1 className="font-playfair text-[clamp(44px,6vw,72px)] leading-[1.03] tracking-[-2.5px] mb-5">
            From idea to <em className="text-terracotta">delivered</em>
            <br />
            in minutes.
          </h1>
          <p className="text-[16px] sm:text-[18px] text-muted-taupe font-light leading-[1.75] max-w-[500px] mx-auto mb-8 sm:mb-10">
            Togather. makes group cards effortless — for the person organising
            and the people signing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={handleCreateCard}
              className="bg-terracotta text-white px-6 sm:px-8 py-3.5 rounded-full text-sm font-medium shadow-[0_6px_20px_rgba(212,132,90,0.3)] hover:bg-[#C4734A] transition-all border-none cursor-pointer font-dm-sans w-full sm:w-auto"
            >
              Create Your First Card. It's on Us!
            </button>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="max-w-[1060px] mx-auto px-4 sm:px-8 md:px-12 pb-8">
        {steps.map((step, i) => {
          const Mockup = mockupMap[step.mockup as keyof typeof mockupMap];
          const isEven = i % 2 === 0;
          return (
            <div
              key={step.num}
              className="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-16 items-center mb-16 md:mb-28"
            >
              {/* Text */}
              <div
                className={isEven ? "lg:order-1 order-1" : "lg:order-2 order-1"}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`text-[11px] font-medium tracking-[2px] uppercase px-3 py-1 rounded-full ${step.accentBg} ${step.accentText}`}
                  >
                    Step {step.num}
                  </div>
                  <div className="text-[11px] font-medium tracking-[2px] uppercase text-muted-taupe">
                    {step.label}
                  </div>
                </div>
                <h2 className="font-playfair text-[clamp(28px,3vw,40px)] leading-[1.1] tracking-[-1.5px] mb-4">
                  {step.title}
                </h2>
                <p className="text-[15px] sm:text-[16px] text-muted-taupe font-light leading-[1.75] mb-6">
                  {step.desc}
                </p>
                <ul className="flex flex-col gap-3">
                  {step.detail.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-sm">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium shrink-0 mt-0.5 ${step.accentBg} ${step.accentText}`}
                      >
                        ✓
                      </span>
                      <span className="text-[#1A1208] leading-[1.6] text-sm sm:text-base">
                        {d}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Mockup */}
              <div
                className={`relative w-full ${isEven ? "lg:order-2 order-2" : "lg:order-1 order-2"}`}
              >
                <div
                  className="absolute -top-6 -left-4 font-playfair text-[80px] sm:text-[100px] md:text-[120px] leading-none pointer-events-none select-none z-0 font-bold"
                  style={{ color: step.color.from }}
                >
                  {step.num}
                </div>
                <div className="relative z-10">
                  <Mockup />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* OVERVIEW STRIP */}
      <div className="bg-[#1A1208] py-12 sm:py-16 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1060px] mx-auto">
          <p className="text-center text-[11px] font-medium tracking-[2px] uppercase text-[#8A7F74] mb-8 sm:mb-10">
            The full picture
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 relative">
            <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#2E2820] via-terracotta to-[#2E2820]" />
            {steps.map((s) => (
              <div
                key={s.num}
                className="text-center relative z-10 px-2 md:px-4"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#2E2820] flex items-center justify-center mx-auto mb-3 md:mb-4 bg-[#1A1208] text-xl md:text-2xl">
                  {s.emoji}
                </div>
                <div className="text-[9px] md:text-[10px] font-medium tracking-[1.5px] uppercase text-[#8A7F74] mb-1">
                  {s.num}
                </div>
                <div className="font-playfair text-base md:text-lg text-[#FDF8F2] mb-2">
                  {s.label}
                </div>
                <p className="text-[11px] md:text-xs text-[#6A635D] font-light leading-[1.7]">
                  {s.desc.split("—")[0].trim()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOR WHO */}
      <section className="max-w-[1060px] mx-auto px-4 sm:px-8 md:px-12 py-16 sm:py-20 md:py-24">
        <p className="text-center text-[11px] font-medium tracking-[2px] uppercase text-terracotta mb-3">
          Who it's for
        </p>
        <h2 className="font-playfair text-[clamp(28px,3vw,42px)] tracking-tight text-center mb-8 sm:mb-12">
          Perfect for every kind of team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              emoji: "🏢",
              title: "Workplace teams",
              desc: "HR managers and team leads sending farewell, birthday, and work anniversary cards. No more chasing people down with a paper card.",
              tags: ["Farewells", "Birthdays", "Work anniversaries"],
              bg: "#FEF3ED",
            },
            {
              emoji: "👯",
              title: "Friend groups",
              desc: "Getting the whole crew to sign without a single awkward chase-up. Drop the link in the group chat and you're done.",
              tags: ["Birthdays", "Weddings", "New babies"],
              bg: "#EEF3EE",
            },
            {
              emoji: "🎓",
              title: "Schools & clubs",
              desc: "Teachers, coaches, and club organisers coordinating cards for students, players, and members — all from one link.",
              tags: ["Graduations", "Thank yous", "Retirements"],
              bg: "#F0EBF8",
            },
          ].map((w) => (
            <div
              key={w.title}
              className="bg-white border border-[#E8DDD0] rounded-2xl p-6 hover:border-terracotta transition-colors"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: w.bg }}
              >
                {w.emoji}
              </div>
              <h3 className="font-playfair text-[20px] tracking-tight mb-2">
                {w.title}
              </h3>
              <p className="text-sm text-muted-taupe font-light leading-[1.75] mb-4">
                {w.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {w.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-[#F5F4F2] text-muted-taupe"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <div className="bg-[#F5EAD8] py-16 sm:py-20 px-4 sm:px-8 md:px-12">
        <div className="max-w-[640px] mx-auto">
          <p className="text-center text-[11px] font-medium tracking-[2px] uppercase text-terracotta mb-3">
            Questions
          </p>
          <h2 className="font-playfair text-[clamp(28px,3vw,42px)] tracking-tight text-center mb-8 sm:mb-10">
            Good to know
          </h2>
          <div className="flex flex-col">
            {faqs.map((faq, i) => (
              <div key={i} className="border-t border-[#D8CEBE] last:border-b">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center py-4 sm:py-5 text-left bg-transparent border-none cursor-pointer"
                >
                  <span className="text-[14px] sm:text-[15px] font-medium text-[#1A1208] pr-6 font-dm-sans">
                    {faq.q}
                  </span>
                  <span
                    className={`text-muted-taupe text-sm transition-transform duration-200 shrink-0 ${openFaq === i ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>
                {openFaq === i && (
                  <p className="text-sm text-muted-taupe leading-[1.75] font-light pb-4 sm:pb-5">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-terracotta relative overflow-hidden py-16 sm:py-20 md:py-24 px-4 sm:px-8 md:px-12 text-center">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/10 -top-28 -left-24 pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/10 -bottom-16 -right-14 pointer-events-none" />
        <div className="relative z-10 max-w-[520px] mx-auto">
          <h2 className="font-playfair text-[clamp(32px,4vw,52px)] text-white tracking-[-2px] mb-4">
            Ready to make
            <br />
            someone's day?
          </h2>
          <p className="text-[16px] sm:text-[17px] text-white/75 mb-7 sm:mb-9 font-light">
            Create your first card in 60 seconds — it's free.
          </p>
          <button
            onClick={handleCreateCard}
            className="bg-[#FDF8F2] text-terracotta px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-[14px] sm:text-[15px] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:opacity-90 transition-opacity font-dm-sans border-none cursor-pointer w-full sm:w-auto"
          >
            Create your first card. It's on Us! →
          </button>
        </div>
      </div>
    </div>
  );
}

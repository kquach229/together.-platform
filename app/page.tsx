import Image from "next/image";
import ReusableButton from "./components/ReusableButton";
import { ArrowRight, Link, ImagePlus, Send } from "lucide-react";

const steps = [
  {
    icon: <ImagePlus className="text-terracotta w-6 h-6" />,
    title: "Create a Card",
    description: "Pick an occasion, add a cover, and personalize your card in seconds.",
  },
  {
    icon: <Link className="text-terracotta w-6 h-6" />,
    title: "Share a Link",
    description: "Send a single link to everyone — no app downloads, no sign-ups needed.",
  },
  {
    icon: <Send className="text-terracotta w-6 h-6" />,
    title: "Deliver It",
    description: "Send the finished card to the recipient at just the right moment.",
  },
];

const occasions = ["🎂 Birthdays", "💍 Weddings", "👋 Farewells", "🎉 Retirements", "🍼 Baby Showers", "💼 New Jobs"];

export default function Home() {
  return (
    <div className="font-dm-sans">

     {/* Hero */}
<section className="flex min-h-[80vh] items-center justify-center px-10">
  <div className="max-w-5xl w-full flex items-center gap-16">

    {/* Left — text */}
    <div className="flex-1 flex flex-col">
      <div className="mb-4 w-fit">
        <h1 className="text-foreground text-3xl">GROUP GREETING CARDS,</h1>
        <h1 className="text-terracotta text-5xl font-bold italic text-right">REIMAGINED.</h1>
      </div>
      <h5 className="text-muted-taupe max-w-sm">
        Create a card for any occasion. Share a link. Watch everyone's messages
        and photos come together in one beautiful place.
      </h5>
      <ReusableButton className="mt-8 w-fit">
        Create Your First Card
        <ArrowRight />
      </ReusableButton>
    </div>

    {/* Right — image collage */}
    <div className="flex-1 relative h-[480px] hidden md:block">
      {/* Main large image */}
      <div className="absolute top-0 left-4 w-64 h-72 rounded-2xl overflow-hidden shadow-md">
        <Image
          src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400"
          alt="People celebrating"
          fill
          className="object-cover"
        />
      </div>
      {/* Top right image */}
      <div className="absolute top-0 right-0 w-44 h-44 rounded-2xl overflow-hidden shadow-md">
        <Image
          src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300"
          alt="Birthday card"
          fill
          className="object-cover"
        />
      </div>
      {/* Bottom right image */}
      <div className="absolute bottom-0 right-0 w-52 h-52 rounded-2xl overflow-hidden shadow-md">
        <Image
          src="https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=300"
          alt="Group signing card"
          fill
          className="object-cover"
        />
      </div>
      {/* Small accent image */}
      <div className="absolute bottom-10 left-0 w-36 h-36 rounded-2xl overflow-hidden shadow-md">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200"
          alt="Celebration"
          fill
          className="object-cover"
        />
      </div>
    </div>

  </div>
</section>

      {/* How it Works */}
      <section className="bg-warm-sand py-20 px-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-foreground mb-2">How it Works</h2>
          <p className="text-center text-muted-taupe mb-12">Three simple steps to a card everyone will love.</p>
          <div className="grid grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="bg-background rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
                <div className="bg-warm-sand rounded-full w-10 h-10 flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="text-foreground">{step.title}</h3>
                <p className="text-muted-taupe text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="py-20 px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-foreground mb-2">A Card for Every Occasion</h2>
          <p className="text-muted-taupe mb-10">Whatever the moment, make it memorable.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {occasions.map((occasion, i) => (
              <span
                key={i}
                className="bg-warm-sand text-foreground text-sm font-medium px-5 py-2 rounded-full border border-warm-border"
              >
                {occasion}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-terracotta py-20 px-10 text-center">
        <h2 className="text-white mb-3">Ready to make someone's day?</h2>
        <p className="text-white/80 mb-8">It only takes a minute to create something they'll never forget.</p>
        <ReusableButton style={{ marginTop: "2rem" }}>
          Create Your First Card
          <ArrowRight />
        </ReusableButton>
      </section>

    </div>
  );
}
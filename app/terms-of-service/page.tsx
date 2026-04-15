// app/terms/page.tsx

import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Together",
  description:
    "Terms of Service for Together, the group digital greeting card platform.",
};

const LAST_UPDATED = "April 13, 2025";
const CONTACT_EMAIL = "legal@together.so";

export default function TermsOfService() {
  return (
    <div className="font-dm-sans bg-[#FDF8F2] text-[#1A1208] min-h-screen">
      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-12 h-16 bg-[rgba(253,248,242,0.92)] backdrop-blur-md border-b border-[#E8DDD0]">
        <Link
          href="/"
          className="font-playfair text-[22px] tracking-tight no-underline text-[#1A1208]"
        >
          together<span className="text-terracotta">.</span>
        </Link>
        <Link
          href="/create"
          className="text-sm bg-terracotta text-white px-5 py-2 rounded-full hover:bg-[#C4734A] transition-colors no-underline"
        >
          Create a card
        </Link>
      </nav>

      {/* HERO */}
      <div className="max-w-[720px] mx-auto px-8 pt-16 pb-8">
        <div className="text-[11px] font-medium tracking-[2px] uppercase text-terracotta mb-4">
          Legal
        </div>
        <h1 className="font-playfair text-[clamp(32px,5vw,52px)] tracking-tight mb-3">
          Terms of Service
        </h1>
        <p className="text-sm text-[#8C7B6B] font-light">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-[720px] mx-auto px-8 pb-24">
        <div className="bg-[#F5EAD8] border border-[#EDD5C5] rounded-2xl p-5 mb-10 text-sm text-[#8C7B6B] font-light leading-[1.75]">
          Please read these Terms carefully before using Together. By creating
          an account or using our service, you agree to be bound by these Terms.
          If you don't agree, please don't use Together.
        </div>

        <div className="flex flex-col gap-10">
          <Section title="1. Who we are">
            <p>
              Together ("we", "us", "our") is a digital greeting card platform
              that lets people create group cards, collect messages, and deliver
              them to recipients. These Terms govern your use of our website and
              services at together.so.
            </p>
          </Section>

          <Section title="2. Eligibility">
            <p>
              You must be at least 13 years old to use Together. By using our
              service, you confirm that you meet this requirement. If you are
              under 18, you confirm that you have your parent or guardian's
              permission.
            </p>
          </Section>

          <Section title="3. Accounts">
            <p>
              You need an account to create cards. You're responsible for
              keeping your account secure and for any activity that happens
              under your account. Let us know immediately if you suspect
              unauthorised access.
            </p>
            <p>
              Signers — people who add messages to cards — do not need an
              account. They access cards via signing links shared by card
              creators.
            </p>
          </Section>

          <Section title="4. Card packs and payments">
            <p>
              Together operates on a pay-as-you-go basis. Your first card is
              free. After that, cards are available in packs of 1, 5, or 10. You
              purchase packs using a valid payment method through our payment
              processor, Stripe.
            </p>
            <p>
              Cards in a pack never expire. Once purchased, they remain in your
              account until used.
            </p>
            <p>
              All prices are shown in USD and include any applicable taxes where
              required by law.
            </p>
            <p>
              We offer refunds for unused cards within 30 days of purchase. Once
              a card has been created and its signing link shared, it is
              considered used and is not eligible for refund. To request a
              refund, contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-terracotta hover:underline no-underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="5. Your content">
            <p>
              You retain ownership of any content you submit to Together —
              including messages, photos, and opening notes ("Your Content"). By
              submitting content, you grant us a limited, non-exclusive licence
              to store, display, and deliver that content as part of the
              service.
            </p>
            <p>
              You are solely responsible for Your Content. By submitting
              content, you confirm that:
            </p>
            <ul>
              <li>You own it or have the right to use it</li>
              <li>
                It does not infringe anyone else's intellectual property rights
              </li>
              <li>It does not violate any applicable law</li>
              <li>
                It is not harmful, offensive, or otherwise in breach of these
                Terms
              </li>
            </ul>
            <p>
              We reserve the right to remove any content that violates these
              Terms without notice.
            </p>
          </Section>

          <Section title="6. Prohibited conduct">
            <p>You agree not to use Together to:</p>
            <ul>
              <li>Harass, threaten, or harm any person</li>
              <li>
                Submit content that is defamatory, obscene, or sexually explicit
              </li>
              <li>Impersonate any person or entity</li>
              <li>Violate any applicable law or regulation</li>
              <li>
                Attempt to gain unauthorised access to any part of our systems
              </li>
              <li>
                Use automated tools to scrape, crawl, or extract data from
                Together
              </li>
              <li>
                Use Together for any commercial purpose other than as expressly
                permitted
              </li>
            </ul>
            <p>
              We may suspend or terminate your account if you breach these
              Terms.
            </p>
          </Section>

          <Section title="7. Privacy">
            <p>
              Our collection and use of personal information is described in our{" "}
              <Link
                href="/privacy"
                className="text-terracotta hover:underline no-underline"
              >
                Privacy Policy
              </Link>
              , which forms part of these Terms.
            </p>
          </Section>

          <Section title="8. Intellectual property">
            <p>
              The Together name, logo, design, and all associated intellectual
              property are owned by us. Nothing in these Terms grants you any
              right to use our branding or intellectual property without our
              prior written consent.
            </p>
          </Section>

          <Section title="9. Availability and changes">
            <p>
              We aim to keep Together available at all times but cannot
              guarantee uninterrupted access. We may update, modify, or
              discontinue features at any time.
            </p>
            <p>
              We may update these Terms from time to time. If we make material
              changes, we'll notify you by email or by displaying a notice in
              the service. Your continued use of Together after changes take
              effect means you accept the updated Terms.
            </p>
          </Section>

          <Section title="10. Disclaimers">
            <p>
              Together is provided "as is" and "as available" without warranties
              of any kind, express or implied. We do not warrant that the
              service will be error-free, secure, or uninterrupted.
            </p>
          </Section>

          <Section title="11. Limitation of liability">
            <p>
              To the fullest extent permitted by law, Together's liability to
              you for any claim arising out of or related to these Terms or the
              service is limited to the amount you paid us in the 12 months
              preceding the claim.
            </p>
            <p>
              In no event will we be liable for indirect, incidental, special,
              consequential, or punitive damages, even if we have been advised
              of the possibility of such damages.
            </p>
          </Section>

          <Section title="12. Governing law">
            <p>
              These Terms are governed by the laws of the State of Delaware,
              United States, without regard to its conflict of law provisions.
              Any disputes shall be resolved in the courts of Delaware.
            </p>
          </Section>

          <Section title="13. Contact">
            <p>
              If you have questions about these Terms, please contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-terracotta hover:underline no-underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-playfair text-[22px] tracking-tight mb-4">{title}</h2>
      <div className="flex flex-col gap-3 text-[15px] text-[#3A2F27] font-light leading-[1.85] [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:marker:text-terracotta [&_a]:text-terracotta [&_a]:no-underline [&_a:hover]:underline">
        {children}
      </div>
    </div>
  );
}

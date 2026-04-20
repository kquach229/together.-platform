// app/privacy/page.tsx

import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Togather",
  description:
    "Privacy Policy for Togather, the group digital greeting card platform.",
};

const LAST_UPDATED = "April 13, 2025";
const CONTACT_EMAIL = "privacy@togather.so";

export default function PrivacyPolicy() {
  return (
    <div className="font-dm-sans bg-[#FDF8F2] text-[#1A1208] min-h-screen">
      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-12 h-16 bg-[rgba(253,248,242,0.92)] backdrop-blur-md border-b border-[#E8DDD0]">
        <Link
          href="/"
          className="font-playfair text-[22px] tracking-tight no-underline text-[#1A1208]"
        >
          Togather<span className="text-terracotta">.</span>
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
          Privacy Policy
        </h1>
        <p className="text-sm text-[#8C7B6B] font-light">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-[720px] mx-auto px-8 pb-24">
        <div className="bg-[#F5EAD8] border border-[#EDD5C5] rounded-2xl p-5 mb-10 text-sm text-[#8C7B6B] font-light leading-[1.75]">
          We wrote this policy to be readable, not just legally defensible. If
          something is unclear, please email us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-terracotta hover:underline no-underline"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          and we'll explain it plainly.
        </div>

        <div className="flex flex-col gap-10">
          <Section title="1. Who we are">
            <p>
              Togather is a digital greeting card platform. When we say
              "Togather", "we", "us", or "our" in this policy, we mean the
              company that operates togathercards.com. This policy explains how
              we collect, use, and protect information about people who use our
              service — including card creators, signers, and recipients.
            </p>
          </Section>

          <Section title="2. Information we collect">
            <Subsection title="Account holders (card creators)">
              <p>When you create an account, we collect:</p>
              <ul>
                <li>
                  Your name and email address (via Clerk, our authentication
                  provider)
                </li>
                <li>
                  Your payment information — we don't store card numbers; Stripe
                  handles all payment data
                </li>
                <li>
                  Your Stripe customer ID, used to link your account to your
                  purchase history
                </li>
              </ul>
            </Subsection>
            <Subsection title="Signers">
              <p>
                When someone signs a card, they must be signed in with a
                Togather account. We collect the name and email address
                associated with their account. These are stored as a snapshot on
                the signature at the time of signing.
              </p>
            </Subsection>
            <Subsection title="Recipients">
              <p>
                Recipients open cards via a private delivery link. We may log
                their IP address and user agent when they view the card, for
                security and analytics purposes. Recipients don't need an
                account.
              </p>
            </Subsection>
            <Subsection title="Content">
              <p>
                We store the messages, photos, and notes that users submit as
                part of cards. This content is private until the card creator
                chooses to deliver it.
              </p>
            </Subsection>
            <Subsection title="Usage data">
              <p>
                We collect standard server logs including IP addresses, browser
                types, pages visited, and timestamps. We use this for debugging,
                security, and understanding how people use the product.
              </p>
            </Subsection>
          </Section>

          <Section title="3. How we use your information">
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and operate the Togather service</li>
              <li>Process payments and manage your card balance</li>
              <li>
                Send transactional emails — card notifications, delivery
                confirmations, and receipts
              </li>
              <li>Respond to support requests</li>
              <li>Detect and prevent fraud and abuse</li>
              <li>Improve the product based on usage patterns</li>
            </ul>
            <p>
              We do not sell your personal information. We do not use your
              information to serve third-party advertising.
            </p>
          </Section>

          <Section title="4. How we share your information">
            <p>We share your information only in these circumstances:</p>
            <ul>
              <li>
                <strong className="font-medium">Service providers</strong> — we
                use Clerk (authentication), Stripe (payments), and AWS (file
                storage and infrastructure). Each processes data on our behalf
                under their own privacy policies.
              </li>
              <li>
                <strong className="font-medium">Card delivery</strong> — when a
                card is delivered, the recipient can see the messages and names
                of everyone who signed. Recipients cannot see signers' email
                addresses.
              </li>
              <li>
                <strong className="font-medium">Legal requirements</strong> — we
                may disclose information if required by law, subpoena, or to
                protect the rights and safety of Togather or its users.
              </li>
              <li>
                <strong className="font-medium">Business transfers</strong> — if
                Togather is acquired or merges with another company, your
                information may be transferred as part of that transaction.
                We'll notify you before this happens.
              </li>
            </ul>
          </Section>

          <Section title="5. Photos and uploaded content">
            <p>
              Photos uploaded as part of card signatures or cover images are
              stored in AWS S3. They are private by default and accessible only
              to the card creator and, after delivery, the recipient.
            </p>
            <p>
              We do not use uploaded photos for any purpose other than
              displaying them within the card experience.
            </p>
          </Section>

          <Section title="6. Data retention">
            <p>
              We retain your account information for as long as your account is
              active. If you delete your account, we delete your personal
              information within 30 days, except where we are required to retain
              it for legal or financial purposes (such as payment records, which
              we retain for 7 years).
            </p>
            <p>
              Cards and their contents are retained indefinitely after purchase
              — they don't expire. If you want a specific card deleted, contact
              us and we'll remove it.
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              We use cookies and similar technologies to keep you logged in and
              to understand how people use Togather. We do not use third-party
              advertising cookies.
            </p>
            <p>
              You can control cookies through your browser settings. Disabling
              cookies may affect your ability to use parts of the service.
            </p>
          </Section>

          <Section title="8. Your rights">
            <p>Depending on where you live, you may have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to or restrict how we process your information</li>
              <li>Export your information in a portable format</li>
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-terracotta hover:underline no-underline"
              >
                {CONTACT_EMAIL}
              </a>
              . We'll respond within 30 days.
            </p>
            <p>
              If you're in the European Economic Area or the UK, you have the
              right to lodge a complaint with your local data protection
              authority.
            </p>
          </Section>

          <Section title="9. Children's privacy">
            <p>
              Togather is not directed at children under 13. We do not knowingly
              collect personal information from children under 13. If we learn
              that we have, we'll delete it promptly. If you believe a child has
              provided us with personal information, please contact us.
            </p>
          </Section>

          <Section title="10. Security">
            <p>
              We take reasonable technical and organisational measures to
              protect your information — including encryption in transit (TLS)
              and at rest, access controls, and regular security reviews.
            </p>
            <p>
              No method of transmission or storage is 100% secure. If you
              discover a security vulnerability, please report it responsibly to{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-terracotta hover:underline no-underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="11. Third-party services">
            <p>
              Togather integrates with the following third-party services, each
              with their own privacy policies:
            </p>
            <ul>
              <li>
                <a
                  href="https://clerk.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Clerk
                </a>{" "}
                — authentication and user management
              </li>
              <li>
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Stripe
                </a>{" "}
                — payment processing
              </li>
              <li>
                <a
                  href="https://aws.amazon.com/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Amazon Web Services
                </a>{" "}
                — file storage and infrastructure
              </li>
            </ul>
          </Section>

          <Section title="12. Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. If we make
              material changes, we'll notify you by email or by displaying a
              notice in the service before the changes take effect.
            </p>
          </Section>

          <Section title="13. Contact us">
            <p>
              Questions, concerns, or requests about your privacy can be sent to{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-terracotta hover:underline no-underline"
              >
                {CONTACT_EMAIL}
              </a>
              . We aim to respond within 5 business days.
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

function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[15px] font-medium text-[#1A1208] mb-2">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

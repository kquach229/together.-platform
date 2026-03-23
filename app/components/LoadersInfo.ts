// ─────────────────────────────────────────────────────────────
// 1. ADD TO tailwind.config.ts → theme.extend
// ─────────────────────────────────────────────────────────────

// extend: {
//   animation: {
//     'orbit':      'orbit 1.6s ease-in-out infinite',
//     'bounce-dot': 'bounceDot 1.2s ease-in-out infinite',
//   },
//   keyframes: {
//     orbit: {
//       '0%, 100%': { opacity: '0.25', transform: 'scale(0.7)' },
//       '50%':      { opacity: '1',    transform: 'scale(1)'   },
//     },
//     bounceDot: {
//       '0%, 80%, 100%': { transform: 'translateY(0)',   opacity: '0.3' },
//       '40%':           { transform: 'translateY(-8px)', opacity: '1'  },
//     },
//   },
// }

// ─────────────────────────────────────────────────────────────
// 2. app/loading.tsx  — root loading state (all routes)
// ─────────────────────────────────────────────────────────────

// import { PageLoader } from "@/components/loaders";
// export default function Loading() {
//   return <PageLoader label="Loading…" />;
// }

// ─────────────────────────────────────────────────────────────
// 3. app/sign/[signingToken]/loading.tsx
// ─────────────────────────────────────────────────────────────

// import { PageLoader } from "@/components/loaders";
// export default function Loading() {
//   return <PageLoader label="Loading your signing page…" />;
// }

// ─────────────────────────────────────────────────────────────
// 4. app/card/[deliveryToken]/loading.tsx
// ─────────────────────────────────────────────────────────────

// import { PageLoader } from "@/components/loaders";
// export default function Loading() {
//   return <PageLoader label="Opening your card…" />;
// }

// ─────────────────────────────────────────────────────────────
// 5. app/dashboard/loading.tsx
// ─────────────────────────────────────────────────────────────

// import { PageLoader } from "@/components/loaders";
// export default function Loading() {
//   return <PageLoader label="Loading your cards…" />;
// }

// ─────────────────────────────────────────────────────────────
// USAGE EXAMPLES
// ─────────────────────────────────────────────────────────────

// In a button (create.tsx):
// <button disabled={isSubmitting}>
//   {isSubmitting ? <DotsLoader label="Creating…" /> : "Continue →"}
// </button>

// In a button (SignView.tsx):
// <button disabled={isSubmitting}>
//   {isSubmitting ? <DotsLoader label="Signing…" /> : "Sign the card →"}
// </button>

// In a data-fetching section:
// {isLoading && <SpinnerLoader label="Fetching signatures…" size="md" />}

// SpinnerLoader sizes:
// size="sm" → 32px ring, good for inline/small cards
// size="md" → 48px ring, default, good for section loading
// size="lg" → 64px ring, good for large empty states

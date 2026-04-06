// app/success/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchParams.session_id) return;

    const verifySession = async () => {
      try {
        const res = await fetch(`/api/verify-checkout-session`, {
          method: "POST",
          body: JSON.stringify({ sessionId: searchParams.session_id }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (data.success) {
          router.push("/dashboard");
        } else {
          router.push("/pricing");
        }
      } catch (err) {
        router.push("/pricing");
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [searchParams.session_id, router]);

  return <div>{loading ? "Verifying your payment..." : null}</div>;
}

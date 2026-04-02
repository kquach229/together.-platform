export default async function IndexPage({
  searchParams,
}: {
  searchParams: { canceled?: string };
}) {
  const { canceled } = searchParams || {};

  if (canceled) {
    console.log(
      "Order canceled -- continue to shop around and checkout when you’re ready.",
    );
  }

  const handleCheckout = async (priceId: string, mode: string) => {
    "use server";
    const req = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_id: priceId,
        mode,
      }),
    });

    const data = await req.json();
    return data;
  };
  return (
    <form action="/api/checkout_sessions" method="POST">
      <section>
        <button type="submit" role="link">
          Checkout
        </button>
      </section>
    </form>
  );
}

export default async function IndexPage({ searchParams }) {
  const { canceled } = await searchParams;

  if (canceled) {
    console.log(
      "Order canceled -- continue to shop around and checkout when you’re ready.",
    );
  }

  const handleCheckout = async (priceId, mode) => {
    "use server";
    const req = await fetch("/api/checkout_sessions", {
      method: "POST",
      body: {
        price_id: priceId,
        mode,
      },
    });

    const data = req.json();
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

const deleteCard = async (cardId) => {
  const res = await fetch(`/api/card/${cardId}`, { method: "DELETE" });
  const data = await res.json();
  return data;
};

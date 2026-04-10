import ReusableDialog from "./ReusableDialog";
import ReusableButton from "./ReusableButton";
import { useRouter } from "next/navigation";

interface Card {
  id: string;
  status: "draft" | "collecting" | "delivered" | "archived";
}

interface DeliverCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: Card;
  onDelivered?: () => void; // optional UI refresh hook
}

const handleDeliver = async (cardId: string) => {
  const res = await fetch(`/api/cards/${cardId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "delivered" }),
  });

  if (!res.ok) {
    throw new Error("Failed to deliver card");
  }

  return res.json();
};

const DeliverCardDialog = ({
  open,
  onOpenChange,
  card,
  onDelivered,
}: DeliverCardDialogProps) => {
  const router = useRouter();

  const onConfirm = async () => {
    try {
      await handleDeliver(card.id);

      onDelivered?.(); // refresh parent state if needed

      onOpenChange(false);

      router.refresh(); // ensure UI sync
    } catch (err) {
      console.error(err);
    }
  };

  const isDelivered = card.status === "delivered";

  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Deliver Card?"
      description="Once delivered, this cannot be undone."
    >
      <div className="flex justify-end gap-2">
        <ReusableButton onClick={() => onOpenChange(false)}>
          Cancel
        </ReusableButton>

        <ReusableButton
          style={{ backgroundColor: "#d4845a", color: "white" }}
          onClick={onConfirm}
          disabled={isDelivered}
        >
          {isDelivered ? "Already Delivered" : "Deliver Card"}
        </ReusableButton>
      </div>
    </ReusableDialog>
  );
};

export default DeliverCardDialog;

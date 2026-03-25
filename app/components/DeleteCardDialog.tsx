import ReusableDialog from "./ReusableDialog";
import ReusableButton from "./ReusableButton";
import { useRouter } from "next/navigation";

const handleDelete = async (cardId, router, onOpenChange) => {
  const res = await fetch(`/api/cards/${cardId}`, {
    method: "DELETE",
  });
  const data = await res.json();

  if (!res.ok) return;
  onOpenChange(false);
  router.push("/dashboard");
};

const DeleteCardDialog = ({ open, onOpenChange, cardId }) => {
  const router = useRouter();
  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Card?"
      description={"This action cannot be undone."}
    >
      <div className="flex justify-end gap-2">
        <ReusableButton onClick={() => onOpenChange(false)}>
          Cancel
        </ReusableButton>
        <ReusableButton
          onClick={() => handleDelete(cardId, router, onOpenChange)}
        >
          Delete
        </ReusableButton>
      </div>
    </ReusableDialog>
  );
};

export default DeleteCardDialog;

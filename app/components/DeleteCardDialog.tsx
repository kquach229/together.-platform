import ReusableDialog from "./ReusableDialog";
import ReusableButton from "./ReusableButton";
import { useRouter } from "next/navigation";

const handleDelete = async (
  cardId: string,
  router: ReturnType<typeof useRouter>,
  onOpenChange: (open: boolean) => void,
) => {
  const res = await fetch(`/api/cards/${cardId}`, {
    method: "DELETE",
  });
  const data = await res.json();

  if (!res.ok) return;
  onOpenChange(false);
  router.push("/dashboard");
};

interface DeleteCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardId: string;
}

const DeleteCardDialog = ({
  open,
  onOpenChange,
  cardId,
}: DeleteCardDialogProps) => {
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
          style={{ backgroundColor: "#EF4444", color: "white" }}
          onClick={() => handleDelete(cardId, router, onOpenChange)}
        >
          Delete
        </ReusableButton>
      </div>
    </ReusableDialog>
  );
};

export default DeleteCardDialog;

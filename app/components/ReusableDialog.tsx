// components/ReusableDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReusableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const ReusableDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
}: ReusableDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          font-dm-sans
          bg-[#FDF8F2]
          border border-[#E8DDD0]
          rounded-2xl
          shadow-[0_24px_60px_rgba(26,18,8,0.12)]
          p-0
          overflow-hidden
          max-w-120
          w-full
          gap-0
        "
      >
        {(title || description) && (
          <DialogHeader
            className="
              px-6 pt-6 pb-5
              border-b border-[#E8DDD0]
            "
          >
            {title && (
              <DialogTitle
                className="
                  font-playfair
                  text-[22px]
                  tracking-tight
                  leading-tight
                  text-[#1A1208]
                  font-normal
                "
              >
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription
                className="
                  text-sm
                  text-[#8C7B6B]
                  font-light
                  leading-[1.7]
                  mt-1.5
                  font-dm-sans
                "
              >
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default ReusableDialog;

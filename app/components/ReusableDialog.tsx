import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ReusableDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 gap-4">
        {(title || description) && (
          <DialogHeader className="space-y-2 text-left">
            {title && (
              <DialogTitle className="text-lg font-semibold tracking-tight">
                {title}
              </DialogTitle>
            )}

            {description && (
              <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        {/* Content */}
        <div className="pt-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default ReusableDialog;

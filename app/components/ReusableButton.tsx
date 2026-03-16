import { Button } from "@/components/ui/button";

const ReusableButton = ({ children, style }) => {
  return (
    <Button style={style} className="bg-foreground p-2">
      {children}
    </Button>
  );
};

export default ReusableButton;

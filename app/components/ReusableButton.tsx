import { Button } from "@/components/ui/button";

const ReusableButton = ({ children, style }) => {
  return (
    <Button style={style} className="bg-foreground">
      {children}
    </Button>
  );
};

export default ReusableButton;

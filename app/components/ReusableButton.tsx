import { Button } from "@/components/ui/button";

const ReusableButton = ({ children, style, onClick }) => {
  return (
    <Button onClick={onClick} style={style} className="bg-foreground">
      {children}
    </Button>
  );
};

export default ReusableButton;

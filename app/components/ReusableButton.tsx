interface ReusableButtonProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

import { Button } from "@/components/ui/button";

const ReusableButton = ({ children, style, onClick }: ReusableButtonProps) => {
  return (
    <Button onClick={onClick} style={style} className="bg-foreground">
      {children}
    </Button>
  );
};

export default ReusableButton;

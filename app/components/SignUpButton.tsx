import { SignUpButton } from "@clerk/nextjs";
import ReusableButton from "./ReusableButton";

const ReusableSignUpButton = () => {
  return (
    <ReusableButton
      style={{ padding: "0.5rem 1rem", borderRadius: "1.375rem" }}
    >
      <SignUpButton />
    </ReusableButton>
  );
};

export default ReusableSignUpButton;

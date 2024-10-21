import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

type BackProps = {
  to?: string;
};

const Back = ({ to }: BackProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className="rounded-full"
      onClick={handleClick}
    >
      <ChevronLeft size={24} />
    </Button>
  );
};

export default Back;

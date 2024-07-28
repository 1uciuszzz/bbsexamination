import { ArrowBackIosNew } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
    <IconButton onClick={handleClick}>
      <ArrowBackIosNew />
    </IconButton>
  );
};

export default Back;

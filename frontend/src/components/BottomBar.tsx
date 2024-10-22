import { LayoutGrid, SquareUserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

const BottomBar = () => {
  const location = useLocation();

  return (
    <div className="w-full flex bg-white">
      <Button
        className="flex-1"
        variant={location.pathname == `/` ? "secondary" : "ghost"}
        asChild
      >
        <Link to="/">
          <LayoutGrid />
          首页
        </Link>
      </Button>
      <Button
        className="flex-1"
        variant={location.pathname == `/me` ? "secondary" : "ghost"}
        asChild
      >
        <Link to="/me">
          <SquareUserRound />
          用户
        </Link>
      </Button>
    </div>
  );
};

export default BottomBar;

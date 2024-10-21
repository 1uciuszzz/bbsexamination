import FeatureCard from "./FeatureCard";
import SavingSvg from "./SavingSvg";
import LoveSvg from "./LoveSvg";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        <p className="text-2xl">首页</p>

        <FeatureCard
          media={<SavingSvg />}
          title="账单记录"
          description="记录你的每一笔支出"
          to="/billing"
        />

        <LoveSvg />

        <div className="flex justify-center">
          <small>
            made with <span className="animate-pulse">❤️</span> by{" "}
            <Link
              to="https://github.com/1uciuszzz"
              className="underline text-blue-600"
              target="_blank"
            >
              B1g Ben
            </Link>{" "}
            with the help of Leehao
          </small>
        </div>
      </div>
    </>
  );
};

export default HomePage;

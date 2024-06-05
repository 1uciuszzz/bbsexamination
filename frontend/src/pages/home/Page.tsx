import { Typography } from "@mui/material";
import VStack from "../../components/VStack";
import FeatureCard from "./FeatureCard";
import SavingSvg from "./SavingSvg";
import LoveSvg from "./LoveSvg";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <div className="p-4">
        <VStack>
          <Typography variant="h5">Home</Typography>

          <FeatureCard
            media={<SavingSvg />}
            title="Billing Record"
            description="Record your billing data."
            to="/billing"
          />

          <LoveSvg />

          <div className="flex justify-center">
            <Typography variant="caption">
              Made with <span className="animate-pulse">❤️</span> by{" "}
              <Link
                to="https://github.com/1uciuszzz"
                className="underline text-blue-600"
                target="_blank"
              >
                Lucius
              </Link>{" "}
              with the help of Leehao
            </Typography>
          </div>
        </VStack>
      </div>
    </>
  );
};

export default HomePage;

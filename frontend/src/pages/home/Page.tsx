import { Typography } from "@mui/material";
import VStack from "../../components/VStack";
import FeatureCard from "./FeatureCard";
import SavingSvg from "./SavingSvg";

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
        </VStack>
      </div>
    </>
  );
};

export default HomePage;

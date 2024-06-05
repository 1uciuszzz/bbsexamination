import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { ReactNode } from "react";
import HStack from "../../components/HStack";
import VStack from "../../components/VStack";
import { useNavigate } from "react-router-dom";

type FeatureCardProps = {
  media: ReactNode;
  title: string;
  description: string;
  to?: string;
};

const FeatureCard = ({ media, title, description, to }: FeatureCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  return (
    <Card>
      <CardActionArea onClick={handleClick}>
        <HStack>
          <div className="w-32">{media}</div>
          <CardContent className="flex-1">
            <VStack>
              <Typography variant="h5">{title}</Typography>
              <Typography
                variant="body1"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {description}
              </Typography>
            </VStack>
          </CardContent>
        </HStack>
      </CardActionArea>
    </Card>
  );
};

export default FeatureCard;

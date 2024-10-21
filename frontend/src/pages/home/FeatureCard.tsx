import { ReactNode } from "react";
import { Link } from "react-router-dom";

type FeatureCardProps = {
  media: ReactNode;
  title: string;
  description: string;
  to: string;
};

const FeatureCard = ({ media, title, description, to }: FeatureCardProps) => {
  return (
    <Link
      to={to}
      className="flex gap-6 p-6 select-none rounded-md bg-gradient-to-b from-muted/50 to-muted no-underline outline-none"
    >
      <div className="w-32">{media}</div>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl">{title}</h2>
        <p className="text-slate-500">{description}</p>
      </div>
    </Link>
  );
};

export default FeatureCard;

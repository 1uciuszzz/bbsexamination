import { PropsWithChildren } from "react";

const HStack = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full h-full flex space-x-8 items-center">{children}</div>
  );
};

export default HStack;

import { PropsWithChildren } from "react";

const VStack = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full h-full flex flex-col space-y-8">{children}</div>
  );
};

export default VStack;

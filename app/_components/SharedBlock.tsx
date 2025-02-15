import { ReactNode } from "react";

interface SharedBlockProps {
  children: ReactNode;
}

export const SharedBlock = ({ children }: { children: SharedBlockProps }) => {
  return (
    <>
      <h1>Shared Block</h1>
      {children}
    </>
  );
};

"use client";

import { ReactNode } from "react";

interface ChatsBlockProps {
  children: ReactNode;
}

export const ChatsBlock = ({ children }: { children: ChatsBlockProps }) => {
  return <>{children}</>;
};

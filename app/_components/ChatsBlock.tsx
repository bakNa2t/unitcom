"use client";

import { FC, ReactNode } from "react";
import { SharedBlock } from "./SharedBlock";

type ChatsBlockProps = {
  children: ReactNode;
};

export const ChatsBlock: FC<ChatsBlockProps> = ({ children }) => {
  return <SharedBlock SidebarComponent={() => <></>}>{children}</SharedBlock>;
};

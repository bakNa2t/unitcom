"use client";

import { FC, ReactNode } from "react";
import { SharedBlock } from "./SharedBlock";
import ChatSidebar from "./ChatSidebar";

type ChatsBlockProps = {
  children: ReactNode;
};

export const ChatsBlock: FC<ChatsBlockProps> = ({ children }) => {
  return (
    <SharedBlock SidebarComponent={() => <ChatSidebar />}>
      {children}
    </SharedBlock>
  );
};

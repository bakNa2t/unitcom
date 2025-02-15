import { ReactNode } from "react";

import { ChatsBlock } from "../_components/ChatsBlock";

interface ChatLayoutProps {
  children: ReactNode;
}

const ChatLayout = ({ children }: { children: ChatLayoutProps }) => {
  return (
    <>
      <div className="hidden md:flex md:ml-24 px-2 md:px-0 h-dvh">
        <ChatsBlock>{children}</ChatsBlock>
      </div>

      <div className="md:hidden my-20 md:px-2 bg-slate-200">{children}</div>
    </>
  );
};

export default ChatLayout;

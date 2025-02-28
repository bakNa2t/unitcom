import { FC, ReactNode } from "react";

import { ChatsBlock } from "./_components/ChatsBlock";

type ChatLayoutProps = {
  children: ReactNode;
};

const ChatLayout: FC<ChatLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="hidden md:flex md:ml-24 px-2 md:px-0 h-dvh">
        <ChatsBlock>{children}</ChatsBlock>
      </div>

      <div className="md:hidden my-20 md:px-2">{children}</div>
    </>
  );
};

export default ChatLayout;

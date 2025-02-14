import { ReactNode } from "react";

interface ChatLayoutProps {
  children: ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <>
      <div className="hidden md:flex md:ml-24 px-2 md:px-0 h-dvh">
        {children}
      </div>

      <div className="md:hidden my-20 md:px-2 bg-slate-200">{children}</div>
    </>
  );
};

export default ChatLayout;

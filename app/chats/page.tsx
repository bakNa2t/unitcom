"use client";

import { FaSignalMessenger } from "react-icons/fa6";

import { ChatNewGroup } from "./_components/ChatNewGroup";
import { NavigationBar } from "./_components/NavigationBar";
import { ChatMobileContent } from "./_components/ChatMobileContent";

const ChatPage = () => {
  return (
    <>
      <NavigationBar trigger={<ChatNewGroup />} />

      <div className="hidden md:grid max-w-56 text-center mx-auto place-content-center">
        <FaSignalMessenger size={200} className="text-6xl text-primary-main" />
        <p className="text-sm mt-5 text-primary-main">
          Welcome to Unitcom messenger! Select or create a chat to start
          messaging
        </p>
      </div>

      <div className="md:hidden flex flex-col space-y-2">
        <ChatMobileContent />
      </div>
    </>
  );
};

export default ChatPage;

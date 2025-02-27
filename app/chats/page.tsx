"use client";

import { FaSignalMessenger } from "react-icons/fa6";

import { ChatNewGroup } from "./_components/ChatNewGroup";
import { NavigationBar } from "./_components/NavigationBar";

const ChatPage = () => {
  return (
    <>
      <NavigationBar trigger={<ChatNewGroup />} />

      <div className="hidden md:grid max-w-56 text-center mx-auto place-content-center">
        <FaSignalMessenger className="text-6xl text-gray-400" />
      </div>
    </>
  );
};

export default ChatPage;

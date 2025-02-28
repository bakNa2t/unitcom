"use client";

import { ChatNewGroup } from "../_components/ChatNewGroup";
import { NavigationBar } from "../_components/NavigationBar";

const ChatId = () => {
  return (
    <>
      <div className="hidden md:block">
        <NavigationBar trigger={<ChatNewGroup />} />
      </div>
    </>
  );
};

export default ChatId;

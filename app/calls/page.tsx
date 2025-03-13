"use client";

import { NavigationBar } from "../chats/_components/NavigationBar";
import { ChatNewGroup } from "../chats/_components/ChatNewGroup";

const CallsPage = () => {
  return (
    <>
      <NavigationBar trigger={<ChatNewGroup />} />
    </>
  );
};

export default CallsPage;

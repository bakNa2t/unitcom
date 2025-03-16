"use client";

import { NavigationBar } from "@/app/chats/_components/NavigationBar";
import { ChatNewGroup } from "@/app/chats/_components/ChatNewGroup";
import { CallContent } from "@/app/calls/_components/CallContent";

const CallsPage = () => {
  return (
    <>
      <NavigationBar trigger={<ChatNewGroup />} />
      <CallContent />
    </>
  );
};

export default CallsPage;

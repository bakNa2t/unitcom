"use client";

import { ChatNewGroup } from "../_components/ChatNewGroup";
import { NavigationBar } from "../_components/NavigationBar";
import { ChatContent } from "../_components/ChatContent";

import { Id } from "@/convex/_generated/dataModel";

const ChatId = ({
  params: { chatId },
}: {
  params: { chatId: Id<"conversations"> };
}) => {
  return (
    <>
      <div className="hidden md:block">
        <NavigationBar trigger={<ChatNewGroup />} />
      </div>

      <ChatContent chatId={chatId} />
    </>
  );
};

export default ChatId;

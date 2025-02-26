import { FC } from "react";

type ChatListItemProps = {
  name: string;
  lastMessageContent: string | undefined;
  lastMessageSender: string | undefined;
  timestamp: string | undefined;
  avatarUrl?: string | undefined;
  isActive: boolean;
  chatId: string;
  unseenMessageCount: number | undefined;
};

export const ChatListItem: FC<ChatListItemProps> = () => {
  return <div>ChatListItem</div>;
};

import { FC, ReactNode } from "react";

type ChatMessageItemProps = {
  createdAt: number;
  fromCurrentUser: boolean;
  senderImage: string;
  senderName: string;
  lastByUser: boolean;
  content: string[];
  type: string;
  seen?: ReactNode;
};

export const ChatMessageItem: FC<ChatMessageItemProps> = () => {
  return <div>ChatMessageItem</div>;
};

import { FC } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn, getFormatedTimestamp } from "@/lib/utils";

type ChatListItemProps = {
  name: string;
  lastMessageContent: string | string[];
  lastMessageSender: string | undefined;
  timestamp: number | undefined;
  avatarUrl?: string | undefined;
  isActive: boolean;
  chatId: string;
  unseenMessageCount: number | undefined;
};

export const ChatListItem: FC<ChatListItemProps> = ({
  name,
  lastMessageContent,
  //   lastMessageSender,
  timestamp,
  avatarUrl,
  isActive,
  chatId,
  unseenMessageCount,
}) => {
  return (
    <Link
      href={`/chats/${chatId}`}
      className={cn("flex justify-between p-3 rounded-2xl", {
        "bg-slate-300 dark:bg-slate-900 text-gray-700 dark:text-gray-300":
          isActive,
      })}
    >
      <div className="flex space-x-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex items-center space-y-1">
          <h2 className="font-bold text-sm">{name}</h2>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            {lastMessageContent}
          </p>
        </div>

        <div className="flex flex-col items-end justify-between">
          <p className="text-sm text-muted-foreground">
            {timestamp && getFormatedTimestamp(timestamp)}
          </p>
          {unseenMessageCount && unseenMessageCount > 0 ? (
            <Badge variant="secondary" className="text-gray-500">
              {unseenMessageCount}
            </Badge>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

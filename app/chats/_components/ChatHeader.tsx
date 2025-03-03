"use client";

import { FC } from "react";
import { useQuery } from "convex/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useSidebarWidth } from "@/hooks/useSidebarWidth";

type ChatHeaderProps = {
  chatAvatar: string;
  username: string;
  chatId: string;
  status: string;
  isGroup: boolean;
};

export const ChatHeader: FC<ChatHeaderProps> = ({
  chatAvatar,
  username,
  chatId,
  status,
  isGroup,
}) => {
  const isDesktop = useIsDesktop();
  const { sidebarWidth } = useSidebarWidth();

  const conversations = useQuery(api.conversations.get);

  const groupIsCommon = conversations?.filter(
    ({ conversation }) => conversation.isGroup
  );

  return (
    <div
      className={cn(
        "fixed flex items-center justify-between w-full h-20 top-0 bg-white dark:bg-gray-800 px-3 md:pr-10 space-x-3 x-30"
      )}
      style={isDesktop ? { width: `calc(100% - ${sidebarWidth + 3}%)` } : {}}
    >
      <div className="flex space-x-3">
        <div className="md:hidden">
          <Button variant="outline" size="icon" asChild>
            <Link href="/chats">
              <ChevronLeft />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

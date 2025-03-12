"use client";

import { FC } from "react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Phone, Video } from "lucide-react";
import Link from "next/link";

import { ChatProfileSheet } from "./ChatProfileSheet";
import { ChatGroupSheet } from "./ChatGroupSheet";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const { sidebarWidth } = useSidebarWidth();

  const conversations = useQuery(api.conversations.get);

  const groupsInCommon = conversations?.filter(
    ({ conversation }) => conversation.isGroup
  );

  const handleVideoOrPhoneCall = () => {
    router.push(`/calls/${chatId}`);
  };

  return (
    <div
      className={cn(
        "fixed flex items-center justify-between w-full h-20 top-0 bg-slate-50 dark:bg-slate-900 px-3 md:pr-10 space-x-3 x-30"
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

        <Sheet>
          <SheetTrigger className="flex items-center space-x-4 cursor-pointer">
            <Avatar>
              <AvatarImage src={chatAvatar} />
              <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
            <h2 className="font-bold text-lg">{username}</h2>
          </SheetTrigger>

          <SheetContent className="w-80 md:w-96 bg-white dark:bg-slate-900 dark:text-white">
            {isGroup ? (
              <ChatGroupSheet chatId={chatId} groupName={username} />
            ) : (
              <ChatProfileSheet
                chatId={chatId}
                username={username}
                status={status}
                groupsInCommon={groupsInCommon}
                chatAvatar={chatAvatar}
              />
            )}
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center space-x-6 px-4">
        <Video
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={handleVideoOrPhoneCall}
        />
        <Phone
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleVideoOrPhoneCall}
        />
      </div>
    </div>
  );
};

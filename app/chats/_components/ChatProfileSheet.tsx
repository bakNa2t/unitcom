import { FC } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetTitle } from "@/components/ui/sheet";

type ActionButtonProps = {
  Icon: FC;
  label: string;
};

const ActionButton: FC<ActionButtonProps> = ({ Icon, label }) => (
  <div className="flex flex-col items-center w-fit space-y-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800">
    <Icon />
    <p className="text-sm">{label}</p>
  </div>
);

type ChatProfileSheetProps = {
  chatId: string;
  username: string;
  status: string;
  groupsInCommon:
    | {
        conversation: {
          isGroup: boolean;
          name?: string;
          _creationTime: number;
          _id: string;
        };
        unseenCount: number;
      }[]
    | undefined;
  chatAvatar: string;
};

export const ChatProfileSheet: FC<ChatProfileSheetProps> = ({
  chatId,
  username,
  status,
  groupsInCommon,
  chatAvatar,
}) => {
  return (
    <ScrollArea className="h-full">
      <Avatar className="w-20 h-20 mx-auto mt-10">
        <AvatarImage src={chatAvatar} />
        <AvatarFallback className="md:text-3xl">{username[0]}</AvatarFallback>
      </Avatar>

      <SheetTitle className="text-2xl text-center mt-2">{username}</SheetTitle>
    </ScrollArea>
  );
};

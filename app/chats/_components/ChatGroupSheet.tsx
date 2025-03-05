import { FC, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { Ban, Phone, Video } from "lucide-react";

import { ChatTypeContent } from "./ChatTypeContent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getFormattedToPluralize } from "@/lib/utils";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { toast } from "sonner";
import { ConvexError } from "convex/values";

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

type ChatGroupSheetProps = {
  chatId: string;
  groupName: string;
};

export const ChatGroupSheet: FC<ChatGroupSheetProps> = ({
  chatId,
  groupName,
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [leaveConfirmation, setLeaveConfirmation] = useState(false);

  const { mutate: leaveGroup, state: leaveGroupState } = useMutationHandler(
    api.conversation.leaveGroup
  );

  const { mutate: blockGroup, state: blockGroupState } = useMutationHandler(
    api.conversation.deleteGroup
  );

  const groupMembers = useQuery(api.conversation.getConversationMember, {
    conversationId: chatId as Id<"conversations">,
  });

  const messages = useQuery(api.messages.get, {
    id: chatId as Id<"conversations">,
  });

  const chatFiles = messages?.filter(({ type }) => type !== "file");

  const handleDeleteGroup = async () => {
    try {
      await blockGroup({ conversationId: chatId });

      toast.success("Group deleted successfully");
      setDeleteConfirmation(false);
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof ConvexError ? error.data : "An error occured"
      );
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup({ conversationId: chatId });

      toast.success("Group left successfully");
      setLeaveConfirmation(false);
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof ConvexError ? error.data : "An error occured"
      );
    }
  };

  return (
    <ScrollArea className="h-full">
      <Avatar className="w-20 h-20 mx-auto mt-10">
        <AvatarFallback className="md:text-3xl">
          {groupName.slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <SheetTitle className="text-2xl text-center mt-2">{groupName}</SheetTitle>

      <div className="flex justify-center space-x-4 mt-5">
        <ActionButton Icon={Video} label="Video" />
        <ActionButton Icon={Phone} label="Call" />
      </div>

      <Separator className="my-5 border border-slate-200 dark:border-slate-800" />

      <p className="font-bold text-lg">
        {groupMembers?.members.length} members
      </p>

      <div>
        {groupMembers?.members &&
          groupMembers.members.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between space-x-3 my-3"
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={member.imageUrl} />
                  <AvatarFallback>{member.username[0]}</AvatarFallback>
                </Avatar>
                <p>{member.username}</p>
              </div>
            </div>
          ))}
      </div>

      <Separator className="my-5 border border-slate-200 dark:border-slate-800" />

      <div className="mt-5">
        <p className="my-5 font-bold text-lg">Shared Media</p>
        {chatFiles?.length ? (
          <ScrollArea className="max-w-80 rounded-md border">
            <div className="flex space-x-4 p-4">
              {chatFiles?.map(({ _id, type, content }) => (
                <div key={_id} className="w-[200px] rounded-xl overflow-hidden">
                  <ChatTypeContent type={type} content={content} />
                </div>
              ))}
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <p>No shared media</p>
        )}
      </div>
    </ScrollArea>
  );
};

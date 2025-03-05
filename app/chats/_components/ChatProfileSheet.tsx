import { FC, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
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
  const [blockConfirmation, setBlockConfirmation] = useState(false);

  const messages = useQuery(api.messages.get, {
    id: chatId as Id<"conversations">,
  });

  const { mutate: blockContact, state: blockContactState } = useMutationHandler(
    api.contact.block
  );

  const chatFiles = messages?.filter(({ type }) => type !== "file");

  const handleBlockContact = async () => {
    try {
      await blockContact({ conversationId: chatId });

      toast.success("Contact blocked successfully");
      setBlockConfirmation(false);
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
        <AvatarImage src={chatAvatar} />
        <AvatarFallback className="md:text-3xl">{username[0]}</AvatarFallback>
      </Avatar>

      <SheetTitle className="text-2xl text-center mt-2">{username}</SheetTitle>
      <p className="text-center">{status}</p>

      <div className="flex justify-center space-x-4 mt-5">
        <ActionButton Icon={Video} label="Video" />
        <ActionButton Icon={Phone} label="Call" />
      </div>

      <Separator className="my-5 border border-slate-200 dark:border-slate-800" />

      <Dialog
        open={blockConfirmation}
        onOpenChange={() => setBlockConfirmation(!blockConfirmation)}
      >
        <DialogTrigger
          className="w-full"
          onClick={() => setBlockConfirmation(true)}
        >
          <div className="flex justify-center items-center w-full space-x-3 text-red-600">
            <Ban />
            <p>Block</p>
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-5">
              <p>Are you sure you want to block {username}?</p>
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center space-x-3 justify-end">
            <Button
              variant="link"
              onClick={() => setBlockConfirmation(false)}
              disabled={blockContactState === "loading"}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlockContact}
              disabled={blockContactState === "loading"}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Separator className="my-5 border border-slate-200 dark:border-slate-800" />

      <div>
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

      <Separator className="my-5 border border-slate-200 dark:border-slate-800" />

      <div className="flex flex-col gap-y-2">
        <p className="font-bold text-lg">
          {groupsInCommon?.length || 0}{" "}
          {getFormattedToPluralize("group", groupsInCommon?.length || 0)} in
          common
        </p>

        <div>
          {groupsInCommon?.length &&
            groupsInCommon.map(({ conversation }) => (
              <Link
                href={`/chats/${conversation._id}`}
                key={conversation._id}
                className="flex items-center space-x-3 hover:bg-slate-400 px-3 py-2 rounded-md"
              >
                <Avatar>
                  <AvatarFallback>
                    {conversation?.name?.slice(0, 2) || "G"}
                  </AvatarFallback>
                </Avatar>
                <p>{conversation.name}</p>
              </Link>
            ))}
        </div>
      </div>
    </ScrollArea>
  );
};

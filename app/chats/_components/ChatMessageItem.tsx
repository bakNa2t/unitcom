import { FC, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { api } from "@/convex/_generated/api";

type ChatMessageItemProps = {
  createdAt: number;
  fromCurrentUser: boolean;
  senderImage?: string;
  senderName: string;
  lastByUser: boolean;
  content: string[];
  type: string;
  seen?: ReactNode;
  messageId: string;
};

export const ChatMessageItem: FC<ChatMessageItemProps> = ({
  createdAt,
  fromCurrentUser,
  senderImage,
  senderName,
  lastByUser,
  content,
  type,
  seen,
  messageId,
}) => {
  const { mutate: deleteMessage } = useMutationHandler(
    api.message.deleteMessage
  );

  const handleDeleteMessage = async () => {
    try {
      await deleteMessage({ messageId });
      toast.success("Message deleted successfully");
    } catch (error) {
      console.log("Error deleting message", error);
      toast.error(
        error instanceof ConvexError ? error.data : "An error occurred"
      );
    }
  };

  const formatTime = (timestamp: number) => format(timestamp, "HH:mm");

  return (
    <div
      className={cn("flex items-end", {
        "justify-end": fromCurrentUser,
      })}
    >
      <div
        className={cn("flex flex-col w-full mx-2", {
          "order-1 items-end": fromCurrentUser,
          "order-2 items-start": !fromCurrentUser,
        })}
      >
        <div
          className={cn(
            "relative flex flex-col items-center justify-between py-1 px-3 space-x-2 rounded-lg max-w-[80%] group",
            {
              "bg-blue-400/80 dark:bg-blue-700/80 text-primary":
                fromCurrentUser && type === "text",
              "bg-secondary text-secondary-foreground":
                !fromCurrentUser && type === "text",
              "rounded-br-none": !lastByUser && fromCurrentUser,
              "rounded-bl-none": !lastByUser && !fromCurrentUser,
            }
          )}
        >
          {type === "text" && (
            <>
              {fromCurrentUser && (
                <Dialog>
                  <DialogTrigger className="absolute top-0 -right-6 items-center opacity-0 group-hover:opacity-100 cursor-pointer">
                    <Trash2 width={16} height={16} />
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      This message will be deleted permanently
                    </DialogDescription>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDeleteMessage}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <p className="text-wrap break-words whitespace-pre-wrap break-all">
                {content}
              </p>
            </>
          )}

          {type === "audio" && (
            <audio className="max-w-64 md:max-w-full" controls>
              <source src={content[0]} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}

          {type === "image" && (
            <Link
              href={content[0]}
              passHref
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={content[0]}
                alt="file"
                width={240}
                height={112}
                className="w-60 h-28 object-cover rounded-lg"
              />
            </Link>
          )}

          {type === "pdf" && (
            <Link href={content[0]} target="_blank" rel="noopener noreferrer">
              <p className="text-blue-700 dark:text-blue-400 underline">
                PDF Document
              </p>
            </Link>
          )}

          <p
            className={cn("text-[8px] flex w-full my-1", {
              "text-primary-foreground justify-end": fromCurrentUser,
              "text-secondary-foreground justify-end": !fromCurrentUser,
              "dark:text-white text-black":
                type === "audio" || type === "image" || type === "pdf",
            })}
          >
            {formatTime(createdAt)}
          </p>
        </div>

        <span className="text-sm italic">{seen}</span>
      </div>

      <Avatar
        className={cn("w-8 h-8 relative", {
          "order-2": fromCurrentUser,
          "order-1": !fromCurrentUser,
          invisible: lastByUser,
        })}
      >
        <AvatarImage src={senderImage} alt={senderName} />
        <AvatarFallback>{senderName.slice(0, 2)}</AvatarFallback>
      </Avatar>
    </div>
  );
};

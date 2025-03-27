import { FC, ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { format } from "date-fns";
import { Pencil, Save, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { cn, linkFromStorage } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { client as supabase } from "@/lib/supabase/client";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { ChatMessageSchema } from "./ChatFooter";

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
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { mutate: deleteMessage } = useMutationHandler(
    api.message.deleteMessage
  );

  const { mutate: editMessage } = useMutationHandler(api.message.editMessage);

  const form = useForm<z.infer<typeof ChatMessageSchema>>({
    resolver: zodResolver(ChatMessageSchema),
    defaultValues: { content: content[0] },
  });

  const handleDeleteMessage = async () => {
    try {
      await deleteMessage({ messageId });
      toast.success("Message deleted successfully");
      setOpenDeleteModal(false);
    } catch (error) {
      console.log("Error deleting message", error);
      toast.error(
        error instanceof ConvexError ? error.data : "An error occurred"
      );
    }
  };

  const handleEditMessage = async ({
    content,
  }: z.infer<typeof ChatMessageSchema>) => {
    if (!content || content.length < 1) return;

    try {
      await editMessage({ messageId, content: [form.getValues("content")] });
      toast.success("Message edited successfully");
      setShowEditModal(false);
    } catch (error) {
      console.log("Error editing message", error);
      toast.error(
        error instanceof ConvexError ? error.data : "An error occurred"
      );
    }
  };

  const handleDeleteMessageMedia = async () => {
    const mediaUrl = linkFromStorage(content[0]);

    if (!mediaUrl) return;

    try {
      const { error } = await supabase.storage
        .from("unitcom-files")
        .remove([`chat/${mediaUrl}`]);

      if (error) {
        console.log(
          "Error deleting image from Supabase storage:",
          error.message
        );
      }

      await deleteMessage({ messageId });

      toast.success("Image deleted successfully");
    } catch (error) {
      console.log("Error deleting image message", error);
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
                <>
                  <Dialog
                    open={openDeleteModal}
                    onOpenChange={() => setOpenDeleteModal(!openDeleteModal)}
                  >
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
                        <Button
                          variant="outline"
                          onClick={() => setOpenDeleteModal(false)}
                        >
                          Cancel
                        </Button>
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

                  <Dialog
                    open={showEditModal}
                    onOpenChange={() => setShowEditModal(!showEditModal)}
                  >
                    <DialogTrigger>
                      <Pencil
                        width={16}
                        height={16}
                        className="absolute top-8 -right-6 items-center opacity-0 group-hover:opacity-100 cursor-pointer"
                      />
                    </DialogTrigger>

                    <DialogContent className="w-72 md:w-96 bg-slate-100 dark:bg-slate-950">
                      <DialogHeader>
                        <DialogTitle>Edit Message</DialogTitle>
                      </DialogHeader>

                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(handleEditMessage)}
                          className="flex items-center gap-4"
                        >
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormControl>
                                <Input
                                  {...field}
                                  value={form.watch("content")}
                                  onKeyDown={async (e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      await form.handleSubmit(
                                        handleEditMessage
                                      )();
                                    }
                                  }}
                                  className="flex-grow bg-slate-200 dark:bg-slate-800 rounded-2xl py-2 px-4 ring-0 focus:ring-0 focus:outline-none outline-none"
                                />
                              </FormControl>
                            )}
                          />

                          <div className="cursor-pointer p-2 hover:bg-primary-main hover:text-indigo-950 transition rounded-lg">
                            <Save
                              className="cursor-pointer"
                              onClick={async () =>
                                await form.handleSubmit(handleEditMessage)()
                              }
                            />
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </>
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
            <>
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

              <Dialog
                open={openDeleteModal}
                onOpenChange={() => setOpenDeleteModal(!openDeleteModal)}
              >
                <DialogTrigger className="absolute top-2 right-4 items-center p-2 opacity-0 group-hover:opacity-100 text-primary-main hover:bg-slate-200/40 rounded-full transition cursor-pointer">
                  <Trash2 width={16} height={16} />
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    This image will be deleted permanently
                  </DialogDescription>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setOpenDeleteModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDeleteMessageMedia}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
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

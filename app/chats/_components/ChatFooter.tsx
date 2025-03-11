import { ChangeEvent, FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "next-themes";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip, Send, Smile } from "lucide-react";
import { FilePond, registerPlugin } from "react-filepond";
import { v4 as uuid } from "uuid";
import { client as supabase } from "@/lib/supabase/client";
import { AudioRecorder } from "react-audio-voice-recorder";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import TextareaAutoSize from "react-textarea-autosize";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import Pusher from "pusher-js";
import axios from "axios";

import { Form, FormControl, FormField } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { api } from "@/convex/_generated/api";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useSidebarWidth } from "@/hooks/useSidebarWidth";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import { Button } from "@/components/ui/button";

type ChatFooterProps = {
  chatId: string;
  currentUserId?: string;
};

const ChatMessageSchema = z.object({
  content: z.string().min(1, {
    message: "Message must not be empty",
  }),
});

export const ChatFooter: FC<ChatFooterProps> = ({ chatId, currentUserId }) => {
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [fileImageOrPdf, setFileImageOrPdf] = useState<Blob | null>(null);
  const [isFileSend, setIsFileSend] = useState(false);
  const [isFileImageOrPdfModalOpen, setIsFileImageOrPdfModalOpen] =
    useState(false);

  const { mutate: createMessage, state: createMessageState } =
    useMutationHandler(api.message.create);

  const isDesktop = useIsDesktop();
  const { sidebarWidth } = useSidebarWidth();
  const { resolvedTheme } = useTheme();

  registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

  const form = useForm<z.infer<typeof ChatMessageSchema>>({
    resolver: zodResolver(ChatMessageSchema),
    defaultValues: { content: "" },
  });

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(chatId);

    channel.bind("typing", (data: { isTyping: boolean; userId: string }) => {
      if (data.userId !== currentUserId) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      pusher.unsubscribe(chatId);
    };
  }, [chatId, currentUserId]);

  const handleCreateMessage = async ({
    content,
  }: z.infer<typeof ChatMessageSchema>) => {
    if (!content || content.length < 1) return;

    try {
      await createMessage({
        conversationId: chatId,
        type: "text",
        content: [content],
      });
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof ConvexError ? error.data : "An error occurred"
      );
    }
  };

  const handleInputChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value, selectionStart } = e.target;

    if (selectionStart !== null) form.setValue("content", value);

    if (!typing) {
      setTyping(true);
      await axios.post("/api/type-indicator", {
        channelId: chatId,
        event: "typing",
        data: { isTyping: true, userId: currentUserId },
      });
    }

    setTimeout(() => {
      setTyping(true);
      axios.post("/api/type-indicator", {
        channelId: chatId,
        event: "typing",
        data: { isTyping: false, userId: currentUserId },
      });
    }, 2000);
  };

  const handleImageUpload = async () => {
    const uniqeId = uuid();

    if (!fileImageOrPdf) return;

    setIsFileSend(true);

    try {
      let fileName;

      if (fileImageOrPdf.type.startsWith("image/")) {
        fileName = `chat/image-${uniqeId}.jpg`;
      } else if (fileImageOrPdf.type.startsWith("application/pdf")) {
        fileName = `chat/pdf-${uniqeId}.pdf`;
      } else {
        console.error("Invalid file type");
        setIsFileSend(false);
        return;
      }

      const file = new File([fileImageOrPdf], fileName, {
        type: fileImageOrPdf.type,
      });

      const { data, error } = await supabase.storage
        .from("unitcom-files")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.log("Error uploading file to Supabase storage:", error.message);
        setIsFileSend(false);
        return;
      }

      const {
        data: { publicUrl },
      } = await supabase.storage.from("unitcom-files").getPublicUrl(data.path);

      await createMessage({
        conversationId: chatId,
        type: fileImageOrPdf.type.startsWith("image/") ? "image" : "pdf",
        content: [publicUrl],
      });

      setIsFileSend(false);
      setIsFileImageOrPdfModalOpen(false);
    } catch (error) {
      setIsFileSend(false);
      setIsFileImageOrPdfModalOpen(false);

      console.log(error);
      toast.error("Failed to upload image. Please try later");
    }
  };

  const handleAudioUpload = async (blob: Blob) => {
    try {
      const uniqeId = uuid();

      const file = new File([blob], "audio.webm", { type: blob.type });
      const fileName = `chat/audio-${uniqeId}`;

      const { data, error } = await supabase.storage
        .from("unitcom-files")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.log(
          "Error uploading audio to Supabase storage:",
          error.message
        );
        toast.error("Failed to upload audio. Please try later");
        return;
      }

      const {
        data: { publicUrl },
      } = await supabase.storage.from("unitcom-files").getPublicUrl(data.path);

      await createMessage({
        conversationId: chatId,
        type: "audio",
        content: [publicUrl],
      });
    } catch (error) {
      console.log("Failed to upload audio", error);
      toast.error("Failed to upload audio. Please try later");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateMessage)}
        style={isDesktop ? { width: `calc(100% - ${sidebarWidth + 3}%)` } : {}}
        className="fixed bottom-0 flex items-center justify-between w-full h-20 space-x-3 px-3 md:pr-16 z-30 bg-slate-50 dark:bg-slate-900"
      >
        <Popover>
          <PopoverTrigger className="flex items-center">
            <button type="submit">
              <Smile size={20} />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-fit p-0">
            <Picker
              theme={resolvedTheme}
              data={data}
              onEmojiSelect={(emoji: any) =>
                form.setValue(
                  "content",
                  `${form.getValues("content")}${emoji.native}`
                )
              }
            />
          </PopoverContent>
        </Popover>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormControl>
              <>
                <TextareaAutoSize
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      await form.handleSubmit(handleCreateMessage)();
                    }
                  }}
                  onChange={handleInputChange}
                  rows={1}
                  maxRows={2}
                  disabled={createMessageState === "loading"}
                  placeholder="Type a message"
                  className="flex-grow bg-slate-200 dark:bg-slate-800 rounded-2xl resize-none py-2 px-4 ring-0 focus:ring-0 focus:outline-none outline-none"
                  {...field}
                />
                {isTyping && (
                  <p className="text-xs text-slate-800 dark:text-slate-300 ml-1">
                    typing...
                  </p>
                )}
              </>
            </FormControl>
          )}
        />

        <Send
          className="cursor-pointer"
          onClick={async () => await form.handleSubmit(handleCreateMessage)()}
        />

        <Dialog
          open={isFileImageOrPdfModalOpen}
          onOpenChange={() =>
            setIsFileImageOrPdfModalOpen(!isFileImageOrPdfModalOpen)
          }
        >
          <DialogTrigger>
            <Paperclip size={20} className="cursor-pointer" />
          </DialogTrigger>

          <DialogContent className="min-w-80">
            <DialogHeader className="flex flex-col space-y-1.5 items-center justify-center">
              <DialogTitle>Upload PDF / IMG</DialogTitle>
              <DialogDescription>🗂 Upload</DialogDescription>
            </DialogHeader>

            <FilePond
              className="cursor-pointer"
              files={fileImageOrPdf ? [fileImageOrPdf] : []}
              allowMultiple={false}
              acceptedFileTypes={["image/*", "application/pdf"]}
              labelIdle="Drag & Drop your files or <span class='filepond--label-action'>Browse</span>"
              onupdatefiles={(fileItems) => {
                setFileImageOrPdf(fileItems[0]?.file ?? null);
              }}
            />

            <DialogFooter>
              <Button
                type="button"
                onClick={handleImageUpload}
                disabled={isFileSend}
              >
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isDesktop && (
          <AudioRecorder
            onRecordingComplete={handleAudioUpload}
            audioTrackConstraints={{
              noiseSuppression: true,
              echoCancellation: true,
            }}
            downloadFileExtension="webm"
          />
        )}
      </form>
    </Form>
  );
};

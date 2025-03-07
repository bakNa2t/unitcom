import { FC } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "next-themes";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Smile } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import TextareaAutoSize from "react-textarea-autosize";

import { Form, FormControl, FormField } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { api } from "@/convex/_generated/api";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useSidebarWidth } from "@/hooks/useSidebarWidth";

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
  const { mutate: createMessage, state: createMessageState } =
    useMutationHandler(api.message.create);

  const isDesktop = useIsDesktop();
  const { sidebarWidth } = useSidebarWidth();
  const { resolvedTheme } = useTheme();

  const form = useForm<z.infer<typeof ChatMessageSchema>>({
    resolver: zodResolver(ChatMessageSchema),
    defaultValues: { content: "" },
  });

  const handleCreateMessage = async ({
    content,
  }: z.infer<typeof ChatMessageSchema>) => {
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateMessage)}
        style={isDesktop ? { width: `calc(100% - ${sidebarWidth + 3}%)` } : {}}
        className="fixed bottom-0 flex items-center justify-between w-full h-20 space-x-3 px-3 md:pr-10 z-30 bg-white dark:bg-slate-900"
      >
        <Popover>
          <PopoverTrigger>
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
                  rows={1}
                  maxRows={2}
                  disabled={createMessageState === "loading"}
                  placeholder="Type a message"
                  {...field}
                />
              </>
            </FormControl>
          )}
        />
      </form>
    </Form>
  );
};

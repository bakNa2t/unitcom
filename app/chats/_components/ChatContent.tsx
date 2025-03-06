import { FC } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";

import { ChatHeader } from "./ChatHeader";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { ChatMessageItem } from "./ChatMessageItem";

export const ChatContent: FC<{ chatId: Id<"conversations"> }> = ({
  chatId,
}) => {
  const conversation = useQuery(api.conversation.get, { id: chatId });

  const messages = useQuery(api.messages.get, {
    id: chatId as Id<"conversations">,
  });

  const members = conversation?.isGroup
    ? (conversation?.otherMembers ?? [])
    : conversation?.otherMember
      ? [conversation.otherMember]
      : [];

  const { mutate: markAsReed, state } = useMutationHandler(
    api.conversation.markAsRead
  );

  const { user } = useUser();

  const getSeenMessage = (messageId: Id<"messages">) => {
    const seenUsers = members
      .filter((member) => member.lastSeenMessageId === messageId)
      .map((member) => member.username?.split(" ")[0]);

    if (seenUsers.length === 0) return undefined;

    return formatSeenBy(seenUsers);
  };

  if (!conversation) return null;

  const chatAvatar = conversation?.otherMember?.imageUrl ?? "";
  const name = conversation?.isGroup
    ? conversation?.name
    : (conversation?.otherMember?.username ?? "");
  const status = conversation?.otherMember?.status || "";

  return (
    <div className="flex w-full">
      <ChatHeader
        username={name!}
        chatAvatar={chatAvatar}
        isGroup={conversation?.isGroup}
        chatId={chatId}
        status={status}
      />

      <div className="flex flex-col-reverse gap-2 p-3">
        {messages?.map((message, index) => (
          <ChatMessageItem
            key={message._id}
            content={message.content}
            createdAt={message._creationTime}
            lastByUser={messages[index - 1]?.senderId === message.senderId}
            fromCurrentUser={message.isCurrentUser}
            senderImage={message.senderImage}
            senderName={message.senderName}
            type={message.type}
            seen={
              message.isCurrentUser ? getSeenMessage(message._id) : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

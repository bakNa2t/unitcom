import { FC } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";

import { ChatHeader } from "./ChatHeader";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationHandler } from "@/hooks/useMutationHandler";

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

  if (!conversation) return null;

  const chatAvatar = conversation?.otherMember?.imageUrl || "";
  const name = conversation?.isGroup
    ? conversation.name
    : conversation?.otherMember?.username || "";
  const status = conversation?.otherMember?.status || "";

  return (
    <div className="flex w-full">
      <h1 className="text-3xl font-bold">Welcome to {chatId}</h1>
      <ChatHeader
        username={name}
        chatAvatr={chatAvatar}
        isGruop={conversation?.isGroup}
        chatId={chatId}
        status={status}
      />
    </div>
  );
};

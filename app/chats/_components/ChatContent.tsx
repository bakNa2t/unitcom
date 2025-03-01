import { FC } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";

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

  return (
    <>
      <h1 className="text-3xl font-bold">Welcome to {chatId}</h1>
    </>
  );
};

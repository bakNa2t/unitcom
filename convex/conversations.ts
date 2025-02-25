import { Id } from "./_generated/dataModel";
import { MutationCtx, QueryCtx } from "./_generated/server";

const getLastMessageDetails = async ({
  ctx,
  conversationId,
}: {
  ctx: QueryCtx | MutationCtx;
  conversationId: Id<"messages"> | undefined;
}) => {
  if (!conversationId) {
    return null;
  }

  const message = await ctx.db.get(conversationId);

  if (!message) {
    return null;
  }

  const sender = await ctx.db.get(message.senderId);

  if (!sender) {
    return null;
  }

  const content = getMessageContent(message.type, message.content);

  return {
    lastMessageSender: sender.username,
    lastMessageContent: content,
    lastMessageTimestamp: message._creationTime,
  };
};

const getMessageContent = (type: string, content: any) => {
  switch (type) {
    case "text":
      return content;
    case "image":
      return "📷 image";
    case "pdf":
      return "📎 Attached";
    case "audio":
      return "🎵 audio";
    default:
      return "Unsupported message type";
  }
};

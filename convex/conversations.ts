import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";
import { MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUserDataById } from "./_utils";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new ConvexError("Not authenticated");

    const currentUser = await getUserDataById({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) throw new ConvexError("User not found");

    const conversationMemberships = await ctx.db
      .query("conversation_members")
      .withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id))
      .collect();

    const conversations = await Promise.all(
      conversationMemberships?.map(async (conversationMembership) => {
        const conversation = await ctx.db.get(
          conversationMembership.conversationId
        );

        if (!conversation) {
          throw new ConvexError("Conversation not found");
        }

        return conversation;
      })
    );

    const conversationWithDetails = await Promise.all(
      conversations.map(async (conversation, index) => {
        const allConversationMemberships = await ctx.db
          .query("conversation_members")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conversation?._id)
          )
          .collect();

        const lastMessage = await getLastMessageDetails({
          ctx,
          conversationId: conversation?.lastMessage,
        });

        const lastSeenMessage = conversationMemberships[index].lastSeenMessage
          ? await ctx.db.get(conversationMemberships[index].lastSeenMessage)
          : null;

        const lastSeenMessageTime = lastSeenMessage
          ? lastSeenMessage._creationTime
          : -1;

        const unreadMessages = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .filter((q) => q.gt(q.field("_creationTime"), lastSeenMessageTime))
          .filter((q) => q.neq(q.field("senderId"), currentUser._id))
          .collect();

        if (conversation.isGroup) {
          return {
            conversation,
            unseenCount: unreadMessages.length,
            ...lastMessage,
          };
        } else {
          const otherMember = allConversationMemberships.filter(
            (membership) => membership.memberId !== currentUser._id
          )[0];

          const otherMemberData = await ctx.db.get(otherMember.memberId);

          return {
            conversation,
            otherMember: otherMemberData,
            unseenCount: unreadMessages.length,
            lastMessage,
          };
        }
      })
    );

    return conversationWithDetails;
  },
});

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

const getMessageContent = (type: string, content: string[]) => {
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

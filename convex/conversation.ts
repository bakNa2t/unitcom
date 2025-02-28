import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserDataById } from "./_utils/utils";

export const get = query({
  args: {
    id: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new ConvexError("Not authenticated");

    const currentUser = await getUserDataById({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) throw new ConvexError("User not found");

    const conversation = await ctx.db.get(args.id);

    if (!conversation) throw new ConvexError("Conversation not found");

    const membership = await ctx.db
      .query("conversation_members")
      .withIndex("by_memberId_conversationId", (q) =>
        q.eq("memberId", currentUser._id).eq("conversationId", conversation._id)
      )
      .unique();

    if (!membership) throw new ConvexError("Not a member of conversation");

    const allConversationMembers = await ctx.db
      .query("conversation_members")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .collect();

    if (!conversation.isGroup) {
      const otherMembership = allConversationMembers.filter(
        (membership) => membership.memberId !== currentUser._id
      )[0];

      const otherMember = await ctx.db.get(otherMembership?.memberId);

      return {
        ...conversation,
        otherMember: {
          ...otherMember,
          lastSeenMessageId: otherMembership?.lastSeenMessage,
        },
        otherMembers: null,
      };
    } else {
      const otherMembers = await Promise.all(
        allConversationMembers
          .filter((membership) => membership.memberId !== currentUser._id)
          .map(async (membership) => {
            const member = await ctx.db.get(membership.memberId);

            if (!member) throw new ConvexError("Member not found");

            return {
              username: member.username,
              lastSeenMessageId: membership.lastSeenMessage,
              _id: member._id,
            };
          })
      );

      return {
        ...conversation,
        otherMember: null,
        otherMembers,
      };
    }
  },
});

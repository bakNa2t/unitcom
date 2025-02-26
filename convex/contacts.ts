import { ConvexError, v } from "convex/values";

import { mutation } from "./_generated/server";
import { getUserDataById } from "./_utils/utils";

export const createGroup = mutation({
  args: {
    name: v.string(),
    members: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new ConvexError("Not authenticated");

    const currentUser = await getUserDataById({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) throw new ConvexError("User not found");

    const conversationId = await ctx.db.insert("conversations", {
      name: args.name,
      isGroup: true,
    });

    await Promise.all(
      [...args.members, currentUser._id].map(async (memberId) =>
        ctx.db.insert("conversation_members", {
          conversationId,
          memberId,
        })
      )
    );
  },
});

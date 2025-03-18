import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
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

    const friendRequests = await ctx.db
      .query("friend_requests")
      .withIndex("by_receiver", (q) => q.eq("receiver", currentUser._id))
      .collect();

    const requestsWithSender = await Promise.all(
      friendRequests.map(async (friendRequest) => {
        const sender = await ctx.db.get(friendRequest.sender);

        if (!sender) throw new ConvexError("Sender not found");

        return { ...friendRequest, sender };
      })
    );

    return requestsWithSender;
  },
});

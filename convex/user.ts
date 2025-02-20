import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const create = internalMutation({
  args: {
    username: v.string(),
    status: v.optional(v.string()),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.insert("users", args);

    return user;
  },
});

export const get = internalQuery({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

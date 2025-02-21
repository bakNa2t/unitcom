import { QueryCtx } from "../_generated/server";

export const getUserDataById = async ({
  ctx,
  clerkId,
}: {
  ctx: QueryCtx;
  clerkId: string;
}) =>
  ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .unique();

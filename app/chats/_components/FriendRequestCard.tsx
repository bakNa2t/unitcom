import { Id } from "@/convex/_generated/dataModel";
import { FC } from "react";

type FriendRequestCardProps = {
  id: Id<"friend_requests">;
  imageUrl?: string;
  username: string;
  email: string;
};

export const FriendRequestCard: FC<FriendRequestCardProps> = ({}) => {
  return <></>;
};

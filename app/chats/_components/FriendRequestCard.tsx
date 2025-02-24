import { FC } from "react";
import { ConvexError } from "convex/values";
import { toast } from "sonner";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutationHandler } from "@/hooks/useMutationHandler";

type FriendRequestCardProps = {
  id: Id<"friend_requests">;
  imageUrl?: string;
  username: string;
  email: string;
};

export const FriendRequestCard: FC<FriendRequestCardProps> = ({
  id,
  imageUrl,
  username,
  email,
}) => {
  const { mutate: acceptRequest, state: acceptRequestState } =
    useMutationHandler(api.friend_request.accept);
  const { mutate: declineRequest, state: declineRequestState } =
    useMutationHandler(api.friend_request.decline);

  const handleDenyRequest = async (id: string) => {
    try {
      await declineRequest({ id });
      toast.success("Friend request declined");
    } catch (error) {
      console.log("Error declining friend request", error);
      toast.error(
        error instanceof ConvexError ? error.data : "An error occurred"
      );
    }
  };

  const handleAcceptRequest = async (id: string) => {
    try {
      await acceptRequest({ id });
      toast.success("Friend request accepted");
    } catch (error) {
      console.log("Error accepting friend request", error);
      toast.error(
        error instanceof ConvexError ? error.data : "An error occured"
      );
    }
  };

  return <></>;
};

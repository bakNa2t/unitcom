import { FC } from "react";
import { ConvexError } from "convex/values";
import { Handshake } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  return (
    <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
      <div className="flex items-center space-x-3">
        <Handshake />
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{username.slice(0, 1)}</AvatarFallback>
        </Avatar>

        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{username}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

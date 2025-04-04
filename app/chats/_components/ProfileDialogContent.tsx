import { useState } from "react";
import { useTheme } from "next-themes";
import { useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
  Handshake,
  LaptopMinimal,
  Loader2,
  Pencil,
  Sun,
  SunMoon,
  UserRound,
  UserRoundSearch,
} from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FriendRequestCard } from "./FriendRequestCard";
import { Card, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/spinner";

import { api } from "@/convex/_generated/api";
import { useMutationHandler } from "@/hooks/useMutationHandler";

const statuses = [
  "😎 Speak Freely",
  "🔐 Encrypted",
  "💬 Free to chat",
  "💾 Coding",
  "⌛ Taking a break",
];

const requestFriendFormSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
});

const ProfileDialogContent = () => {
  const [updateStatusDialog, setUpdateStatusDialog] = useState(false);
  const [status, setStatus] = useState("");
  const [friendRequestModal, setFriendRequestModal] = useState(false);
  const { setTheme } = useTheme();

  const { mutate: createFriendRequest, state: createFriendRequestState } =
    useMutationHandler(api.friend_request.create);
  const friendRequests = useQuery(api.friend_requests.get);

  const { user } = useUser();
  const userDetails = useQuery(api.status.get, { clerkId: user?.id ?? "" });
  const { mutate: updateStatus, state: updateStatusState } = useMutationHandler(
    api.status.update
  );

  const name =
    userDetails?.username !== "null null"
      ? userDetails?.username
      : "Unknown User";

  const form = useForm<z.infer<typeof requestFriendFormSchema>>({
    resolver: zodResolver(requestFriendFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onFriendRequest({
    email,
  }: z.infer<typeof requestFriendFormSchema>) {
    try {
      await createFriendRequest({ email });

      form.reset();
      toast.success("Friend request sent successfully");

      setFriendRequestModal(false);
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.data : "An error occurred"
      );
      console.log("Error creating friend request", error);
    }
  }

  async function onUpdateStaus() {
    try {
      await updateStatus({ clerkId: user?.id ?? "", status });
      toast.success("Status updated successfully");
      setStatus("");
      setUpdateStatusDialog(false);
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.data : "An error occurred"
      );
      console.log("Error updating status", error);
    }
  }

  return (
    <div>
      <Card className="flex flex-col space-y-4 border-0 shadow-none">
        <CardTitle>Profile Details</CardTitle>

        <div>
          <Avatar className="w-16 h-16 mx-auto">
            <AvatarImage src={userDetails?.imageUrl} />
            <AvatarFallback className="md:text-2xl">{name?.[0]}</AvatarFallback>
          </Avatar>
        </div>
      </Card>

      <div className="flex flex-col gap-y-6 mt-4">
        <div className="flex items-center space-x-4">
          <UserRound />
          <Input
            value={name}
            placeholder="Name"
            disabled
            className="border-none outline-none ring-0"
          />
        </div>

        <Separator />

        <div className="flex items-center justify-center space-x-6">
          <p>Manage your profile</p>
          <UserButton
            appearance={{
              elements: {
                userButtonPopoverCard: {
                  pointerEvents: "initial",
                },
              },
            }}
          />
        </div>

        <Separator />

        <Dialog
          open={friendRequestModal}
          onOpenChange={() => setFriendRequestModal(!friendRequestModal)}
        >
          <DialogTrigger>
            <div className="flex items-center space-x-2">
              <UserRoundSearch />
              <p>Send friend request</p>
            </div>
          </DialogTrigger>

          <DialogContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onFriendRequest)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="guest@mail.com"
                          disabled={createFriendRequestState === "loading"}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your friend&apos;s email to send an invite
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="text-primary-main hover:text-primary bg-primary hover:bg-primary-main"
                  disabled={createFriendRequestState === "loading"}
                >
                  Submit
                  {updateStatusState === "loading" ? (
                    <Spinner size="lg" className="!text-slate-950" />
                  ) : (
                    ""
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Separator />

        <Dialog>
          <DialogTrigger>
            <div className="flex items-center space-x-2">
              <Handshake />
              <p>View friend requests</p>
              {friendRequests && friendRequests.length > 0 && (
                <Badge variant="outline">{friendRequests.length}</Badge>
              )}
            </div>
          </DialogTrigger>

          <DialogContent>
            {friendRequests ? (
              friendRequests.length === 0 ? (
                <p className="text-xl text-center font-bold">
                  No friend requests yet
                </p>
              ) : (
                <ScrollArea className="h-[400px] rounded-md">
                  {friendRequests.map((request) => (
                    <FriendRequestCard
                      key={request.sender._id}
                      email={request.sender.email}
                      username={request.sender.username}
                      id={request._id}
                      imageUrl={request?.sender.imageUrl}
                    />
                  ))}
                </ScrollArea>
              )
            ) : (
              <Loader2 />
            )}
          </DialogContent>
        </Dialog>

        <Separator />

        <Dialog open={updateStatusDialog} onOpenChange={setUpdateStatusDialog}>
          <DialogTrigger>
            <div className="flex items-center space-x-2">
              <Pencil />
              <p>{userDetails?.status}</p>
            </div>
          </DialogTrigger>
          <DialogContent className="pt-8">
            <Textarea
              value={status}
              placeholder={userDetails?.status}
              className="resize-none h-48"
              onChange={(e) => setStatus(e.target.value)}
              disabled={updateStatusState === "loading"}
            />

            <div>
              {statuses.map((status) => (
                <p
                  key={status}
                  onClick={() => setStatus(status)}
                  className="px-2 py-3 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-md transition-shadow duration-300 hover:shadow-sm hover:shadow-slate-400 cursor-pointer"
                >
                  {status}
                </p>
              ))}
            </div>

            <Button
              type="button"
              onClick={onUpdateStaus}
              className="ml-auto w-fit hover:bg-primary-main text-primary-main hover:text-primary"
              disabled={updateStatusState === "loading"}
            >
              Update Status
              {updateStatusState === "loading" ? (
                <Spinner size="lg" className="!text-slate-950" />
              ) : (
                ""
              )}
            </Button>
          </DialogContent>
        </Dialog>

        <Separator />

        <ToggleGroup type="single" variant="outline">
          <ToggleGroupItem
            value="light"
            onClick={() => setTheme("light")}
            className="flex space-x-3"
          >
            <Sun className="h-4 w-4" />
            <p>Light</p>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="dark"
            onClick={() => setTheme("dark")}
            className="flex space-x-3"
          >
            <SunMoon className="h-4 w-4" />
            <p>Dark</p>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="system"
            onClick={() => setTheme("system")}
            className="flex space-x-3"
          >
            <LaptopMinimal className="h-4 w-4" />
            <p>System</p>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default ProfileDialogContent;

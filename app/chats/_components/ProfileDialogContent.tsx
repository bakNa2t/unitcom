import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Handshake,
  LaptopMinimal,
  Pencil,
  Sun,
  SunMoon,
  UserRound,
  UserRoundSearch,
} from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const { setTheme } = useTheme();

  const form = useForm<z.infer<typeof requestFriendFormSchema>>({
    resolver: zodResolver(requestFriendFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit({ email }: z.infer<typeof requestFriendFormSchema>) {
    console.log(email);
  }

  return (
    <div>
      <Card className="flex flex-col space-y-4 border-0">
        <CardTitle>Profile</CardTitle>

        <div>
          <Avatar className="w-16 h-16 mx-auto">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
        </div>
      </Card>

      <div className="flex flex-col gap-y-6 mt-4">
        <div className="flex items-center space-x-4">
          <UserRound />
          <Input
            value={"Username"}
            placeholder="Name"
            disabled
            className="border-none outline-none ring-0"
          />
        </div>

        <Separator />

        <div className="flex items-center justify-center space-x-6">
          <p>Manage your profile</p>
          <button>User Button</button>
        </div>

        <Separator />

        <Dialog>
          <DialogTrigger>
            <div className="flex items-center space-x-2">
              <UserRoundSearch />
              <p>Send friend request</p>
            </div>
          </DialogTrigger>

          <DialogContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
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
                          disabled={true}
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

                <Button type="submit" disabled={true}>
                  Submit
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
            </div>
          </DialogTrigger>

          <DialogContent>
            <p className="text-xl text-center font-bold">
              No friend requests yet
            </p>
          </DialogContent>
        </Dialog>

        <Separator />

        <Dialog open={updateStatusDialog} onOpenChange={setUpdateStatusDialog}>
          <DialogTrigger>
            <div className="flex items-center space-x-2">
              <Pencil />
              <p>{"Display current status"}</p>
            </div>
          </DialogTrigger>
          <DialogContent>
            <Textarea
              value={status}
              placeholder="Dispaly current status"
              className="resize-none h-48"
              onChange={(e) => setStatus(e.target.value)}
            />

            <div>
              {statuses.map((status) => (
                <p
                  key={status}
                  onClick={() => setStatus(status)}
                  className="px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                >
                  {status}
                </p>
              ))}
            </div>

            <Button
              type="button"
              className="ml-auto w-fit bg-primary-main"
              disabled
            >
              Update Status
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

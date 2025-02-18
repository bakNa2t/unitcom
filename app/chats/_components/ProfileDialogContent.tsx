import { useTheme } from "next-themes";
import { UserRound } from "lucide-react";

import { Card, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const statuses = [
  "😎 Speak Freely",
  "🔐 Encrypted",
  "💬 Free to chat",
  "💾 Coding",
  "⌛ Taking a break",
];

const ProfileDialogContent = () => {
  const { setTheme } = useTheme();

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
      </div>
    </div>
  );
};

export default ProfileDialogContent;

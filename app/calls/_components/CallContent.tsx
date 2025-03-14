import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const CallContent = () => {
  const router = useRouter();
  const [meetingCode, setMeetingCode] = useState("");

  const generateMeetingLink = () => {
    const code = uuid();

    navigator.clipboard.writeText(code);
    toast.success("Link copied to clipboard");
  };

  const joinMeeting = () => router.push(`/calls/${meetingCode}`);

  return (
    <div className="grid md:grid-cols-2 p-2 md:p-10 gap-10 w-full place-content-center">
      <div className="flex items-center">
        <div className="flex flex-col gap-10 md:w-96 mx-auto">
          <div className="flex flex-col gap-y-7">
            <h1 className="text-4xl font-bold">Create a meeting</h1>

            <div className="flex flex-col md:flex-row gap-2 ">
              <p className="mt-2 text-muted-foreground">
                Share this code with your friends so they can join the call
              </p>

              <Button onClick={generateMeetingLink} className="md:mt-2">
                Generate code
                <RefreshCcw className="ml-2" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-y-5">
            <Input
              type="text"
              placeholder="Input meeting link"
              onChange={(e) => setMeetingCode(e.target.value)}
              className="h-14"
            />
            <Button
              onClick={joinMeeting}
              className="w-full h-14"
              disabled={!meetingCode.length}
            >
              Join meeting
            </Button>
          </div>
        </div>
      </div>

      <div className="w-72 h-72 md:w-[300px] md:h-[300px] lg:w-96 lg:h-96 mx-auto rounded-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1654277041050-d8f56bf61b62?q=80&w=1462&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          width={500}
          height={500}
          alt="meet"
          className="w-full h-full object-cover hover:scale-110 transition-transform"
        />
      </div>
    </div>
  );
};

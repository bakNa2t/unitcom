import { useState } from "react";
import { v4 as uuid } from "uuid";
import Image from "next/image";

export const CallContent = () => {
  const [meetingCode, setMeetingCode] = useState("");

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
            </div>
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

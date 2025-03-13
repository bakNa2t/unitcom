import { FC, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
} from "@livekit/components-react";

import "@livekit/components-styles";

export const MeetingRoom: FC<{ chatId: string }> = ({ chatId }) => {
  const [token, setToken] = useState("");
  const { user } = useUser();

  const email = user?.emailAddresses[0].emailAddress;

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${email}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [chatId, email]);

  console.log(token);

  if (token === "") {
    return (
      <div className="flex items-center justify-center">Getting token...</div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      connect={true}
      serverUrl={process.env.LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: "100dvh" }}
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

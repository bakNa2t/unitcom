"use client";

import { FC } from "react";

import { NavigationBar } from "@/app/chats/_components/NavigationBar";
import { MeetingRoom } from "@/app/calls/_components/MeetingRoom";

const Room: FC<{ params: { room: string } }> = ({ params: { room } }) => {
  return (
    <>
      <NavigationBar trigger={null} />

      <MeetingRoom chatId={room} />
    </>
  );
};

export default Room;

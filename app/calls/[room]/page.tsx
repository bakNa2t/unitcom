import { FC } from "react";

import { NavigationBar } from "@/app/chats/_components/NavigationBar";

const Room: FC<{ params: { room: string } }> = ({ params: { room } }) => {
  return (
    <>
      <NavigationBar trigger={null} />
    </>
  );
};

export default Room;

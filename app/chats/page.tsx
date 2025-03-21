"use client";

import Image from "next/image";

import { ChatNewGroup } from "./_components/ChatNewGroup";
import { NavigationBar } from "./_components/NavigationBar";
import { ChatMobileContent } from "./_components/ChatMobileContent";

const ChatPage = () => {
  return (
    <>
      <NavigationBar trigger={<ChatNewGroup />} />

      <div className="hidden md:grid max-w-96 text-center mx-auto place-content-center">
        <Image
          src="/logo-title-light.svg"
          width="600"
          height="250"
          alt="logo-title"
          className="dark:hidden"
        />
        <Image
          src="/logo-title-dark.svg"
          width="600"
          height="250"
          alt="logo-title"
          className="hidden dark:block"
        />

        <h2 className="text-2xl font-semibold text-primary-main mt-5">
          Welcome friend!
        </h2>
        <p className="text-sm mt-2 text-primary-main/70">
          Glad you joined us to Unitcom messenger. Select or create a chat to
          start messaging
        </p>
      </div>

      <div className="md:hidden flex flex-col space-y-2">
        <ChatMobileContent />
      </div>
    </>
  );
};

export default ChatPage;

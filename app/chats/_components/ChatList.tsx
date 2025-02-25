import { FC } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

// type ChatListProps = {
//   children: ReactNode;
// };

export const ChatList: FC<> = () => {
  const pathname = usePathname();
  const chatId = pathname.split("/").pop();

  const conversations = useQuery(api.conversations.get);

  const groupMessages = conversations?.filter(
    (msg) => msg.conversation.isGroup
  );

  const directMessages = conversations?.filter(
    (msg) => !msg.conversation.isGroup
  );

  const hasConversations =
    (groupMessages && groupMessages.length > 0) ||
    (directMessages && directMessages.length > 0);

  return (
    <div className="flex flex-col space-y-2">
      {!hasConversations ? (
        <div className="text-center text-gray-500">No conversations found</div>
      ) : (
        <>
          {directMessages && directMessages.length > 0 ? <></> : null}
          {groupMessages && groupMessages.length > 0 ? <></> : null}
        </>
      )}
    </div>
  );
};

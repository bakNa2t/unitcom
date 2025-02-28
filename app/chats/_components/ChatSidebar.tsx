import { SidebarContainer } from "@/app/chats/_components/SidebarContainer";
import { ChatList } from "./ChatList";
import { ChatNewGroup } from "./ChatNewGroup";

const ChatSidebar = () => {
  return (
    <SidebarContainer title="Chats" trigger={<ChatNewGroup />}>
      <ChatList />
    </SidebarContainer>
  );
};

export default ChatSidebar;

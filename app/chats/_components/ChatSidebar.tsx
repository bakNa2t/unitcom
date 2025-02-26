import { SidebarContainer } from "@/app/chats/_components/SidebarContainer";
import { ChatList } from "./ChatList";

const ChatSidebar = () => {
  return (
    <SidebarContainer title="Chats" trigger={<></>}>
      <ChatList />
    </SidebarContainer>
  );
};

export default ChatSidebar;

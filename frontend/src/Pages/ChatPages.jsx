import { ChatList } from "./../components/ChatList";
import { ActiveTabSwitch } from "./../components/ActiveTabSwitch";
import { ProfileHeader } from "./../components/ProfileHeader";
import { ContactList } from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversation from "../components/NoConversation";
import { useChatStore } from "../store/useChatStore";
import { Menu } from "lucide-react";
const ChatPages = () => {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="drawer lg:drawer-open min-h-screen w-full bg-fuchsia-300">
      {/* CONTROL BUTTON (mobile) */}
      <input id="chat-drawer" type="checkbox" className="drawer-toggle" />

      {/* RIGHT SIDE - Main content */}
      <div className="drawer-content  ">
        {/* Mobile Menu Button */}
        <div className="p-2 lg:hidden ">
          <label
            htmlFor="chat-drawer"
            className="btn btn-sm bg-fuchsia-950 text-fuchsia-50"
          >
            <Menu size={12} />
          </label>
        </div>

        {selectedUser ? <ChatContainer /> : <NoConversation />}
      </div>

      {/* LEFT SIDE - Sidebar */}
      <div className="drawer-side">
        <label htmlFor="chat-drawer" className="drawer-overlay"></label>

        <div className="bg-fuchsia-200 w-80 min-h-full  flex flex-col gap-2 shadow-xl">
          <ProfileHeader />
          <ActiveTabSwitch />

          {activeTab === "chats" ? <ChatList /> : <ContactList />}
        </div>
      </div>
    </div>
  );
};

export default ChatPages;

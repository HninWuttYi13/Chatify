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
      <div className="drawer-content  flex">
        {/* Mobile Menu Button */}
        <div className="lg:hidden bg-fuchsia-800 w-14 min-h-screen text-fuchsia-50 p-1">
          <label htmlFor="chat-drawer" className="">
            <div className="p-1 border w-12 h-12 rounded-xl flex items-center justify-center">
              <Menu size={28} />
            </div>
          </label>
        </div>

        <div className="flex-1">
          {selectedUser ? <ChatContainer /> : <NoConversation />}
        </div>
      </div>

      {/* LEFT SIDE - Sidebar */}
      <div className="drawer-side transition-all duration-300 ease-in-out">
        <label htmlFor="chat-drawer" className="drawer-overlay "></label>

        <div className="bg-fuchsia-200 w-80 min-h-full flex flex-col gap-2 shadow-xl transform transition-transform duration-300 ease-in-out">
          <ProfileHeader />
          <ActiveTabSwitch />

          {activeTab === "chats" ? <ChatList /> : <ContactList />}
        </div>
      </div>
    </div>
  );
};

export default ChatPages;

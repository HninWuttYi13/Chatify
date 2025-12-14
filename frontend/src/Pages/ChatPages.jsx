import { ChatList } from "./../components/ChatList";
import { ActiveTabSwitch } from "./../components/ActiveTabSwitch";
import { ProfileHeader } from "./../components/ProfileHeader";
import { ContactList } from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversation from "../components/NoConversation";
import { useChatStore } from "../store/useChatStore";

const ChatPages = () => {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="flex min-h-screen w-full bg-fuchsia-300">
      {/* SIDEBAR */}
      <aside
        className={`
          bg-fuchsia-200
          w-full md:w-72 lg:w-80
          min-h-screen
          flex flex-col gap-2
          shadow-xl
          shrink-0
           ${selectedUser ? "responsive-layout" : ""}
        `}
      >
        <ProfileHeader />
        <ActiveTabSwitch />
        {activeTab === "chats" ? <ChatList /> : <ContactList />}
      </aside>

      {/* CHAT AREA */}
      <main
        className={`
          flex-1 min-h-screen flex flex-col
          ${selectedUser ? "" : " responsive-layout"}
        `}
      >
        {selectedUser ? <ChatContainer /> : <NoConversation />}
      </main>
    </div>
  );
};


export default ChatPages;

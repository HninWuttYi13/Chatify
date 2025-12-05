import { ChatList } from './../components/ChatList';
import { ActiveTabSwitch } from './../components/ActiveTabSwitch';
import { ProfileHeader } from './../components/ProfileHeader';
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from '../store/useChatStore';
import { ContactList } from '../components/ContactList';
import ChatContainer from "../components/ChatContainer";
import NoConversation from '../components/NoConversation';
const ChatPages = () => {
  const { authUser, logout } = useAuthStore();
 const {activeTab, selectedUser} = useChatStore();
  return (
    <div className=" w-full  flex">
      {/* left side */}
      <div className="bg-fuchsia-200 flex flex-col min-h-screen sm:w-90 w-70 gap-2 shadow-lg ">
        <ProfileHeader authUser={authUser} logout={logout} />

        <ActiveTabSwitch />
        {activeTab === "chats" ? <ChatList /> : <ContactList />}
      </div>
      {/* right side */}
      <div className="flex-1 flex flex-col backdrop-blur-sm   bg-fuchsia-300">
        {selectedUser ? <ChatContainer /> : <NoConversation />}
      </div>
    </div>
  );
};

export default ChatPages;

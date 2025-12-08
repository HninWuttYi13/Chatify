import NoConversation  from "../image/NoConversationFound.png"
import { useChatStore } from "../store/useChatStore"
const NoChatFound = () => {
    const {setActiveTab } = useChatStore();
  return (
    <div className='flex flex-col items-center justify-center p-10 space-y-3'>
        <img src={NoConversation} className="w-18 h-18" />
        <p className="text-fuchsia-950 text-lg font-bold text-center">No conversation yet</p>
        <p className="text-center text-fuchsia-600 text-sm">Start a new chat by selecting a contact from the contacts</p>
        <button onClick={()=>setActiveTab("contacts")} className="bg-fuchsia-950 text-fuchsia-50 px-3 py-2 rounded-full shadow-2xl hover:bg-fuchsia-500" >Find Contacts</button>
    </div>
  )
}

export default NoChatFound
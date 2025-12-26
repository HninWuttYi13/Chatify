import NoConversationImage from "../image/NoConversationFound.png"

const NoChatContainer = ({name}) => {
  return (
    <div className="flex items-center justify-center flex-col space-y-3 h-full px-10">
      <img src={NoConversationImage} className="w-20" />
      <p className="text-fuchsia-900 text-md  text-center">
        No chats with <span className="text-xl text-fuchsia-500 font-semibold">{name}</span> yet
      </p>
      <p className="text-fuchsia-700 text-center">
        💜 “It’s quiet here… send a message to break the silence 💜”
      </p>
     
    </div>
  );
}

export default NoChatContainer
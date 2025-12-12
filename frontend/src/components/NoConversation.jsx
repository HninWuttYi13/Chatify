import NoConversationImage from "../image/NoConversationFound.png";
const NoConversation = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-5 space-y-3">
      <img src={NoConversationImage} className="w-20 h-20" />
      <p className="text-fuchsia-950 text-xl font-semibold text-center">
        No conversations yet
      </p>
      <p className="text-center text-fuchsia-600 text-md">
        How's your day? <br/>
        Start a new conversation and connect with someone special today.
      </p>
    </div>
  );
};

export default NoConversation;

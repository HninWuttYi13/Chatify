import { ChatHeader } from "./ChatHeader";
import AvatarProfile from "../image/avatar_profile.jpg";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import NoChatContainer from "./NoChatContainer";
import { useEffect, useRef } from "react";
import MessageInputBox from "./MessageInputBox";
import MessageLoading from "./MessageLoading";
import ViewImage from "./ViewImage";
import { clickSound } from "./mouseClickSound";
import { normalizeDate, getDateLabel } from "./timeStamps";
const ChatContainer = () => {
  const {
    selectedUser,
    messages,
    getMessageByUserId,
    isMessageLoading,
    viewImage,
    setViewImage,
    SoundEnabled,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const bottomRef = useRef();
  useEffect(() => {
    getMessageByUserId(selectedUser._id);
  }, [selectedUser, getMessageByUserId]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  if (viewImage) return <ViewImage />;
  return (
    <div className="flex flex-col">
      {/* Header user name*/}
      <ChatHeader />
      {/* Body chat message*/}
      <div className="px-3 py-2 overflow-y-auto h-[calc(100vh-10rem)]">
        {messages.length > 0 && !isMessageLoading ? (
          <div>
            {messages.map((msg, index) => {
              const prevMessage = messages[index - 1];
              const showDate =
                !prevMessage ||
                normalizeDate(new Date(prevMessage.createdAt)).getTime() !==
                  normalizeDate(new Date(msg.createdAt)).getTime();

              return (
                <div>
                  {showDate && (
                    <div className="text-md text-fuchsia-950 text-center font-bold">
                      {getDateLabel(msg.createdAt)}
                    </div>
                  )}
                  <div
                    key={msg._id}
                    className={`chat ${
                      msg.senderId === authUser._id ? "chat-end" : "chat-start"
                    }`}
                  >
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          src={
                            msg.senderId === authUser._id
                              ? authUser.profilePic || AvatarProfile
                              : selectedUser.profilePic || AvatarProfile
                          }
                        />
                      </div>
                    </div>
                    <div className="chat-header">
                      <time className="text-xs opacity-50">
                        {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>

                    <div
                      className={`chat-bubble ${
                        authUser._id === msg.senderId
                          ? "bg-fuchsia-50 text-fuchsia-950"
                          : "bg-fuchsia-900 text-fuchsia-50"
                      }`}
                    >
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Shared"
                          className="rounded-lg h-48 object-cover cursor-pointer"
                          onClick={() => {
                            if (SoundEnabled) clickSound();
                            setViewImage(msg.image);
                          }}
                        />
                      )}
                      {msg.text && <p className="mt-2">{msg.text}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef}></div>
          </div>
        ) : isMessageLoading ? (
          <MessageLoading />
        ) : (
          <NoChatContainer name={selectedUser.fullName} />
        )}
      </div>
      {/* footer  text message*/}

      <MessageInputBox />
    </div>
  );
};

export default ChatContainer;

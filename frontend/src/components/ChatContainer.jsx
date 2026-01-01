import { ChatHeader } from "./ChatHeader";
import AvatarProfile from "../image/avatar_profile.jpg";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import NoChatContainer from "./NoChatContainer";
import { useEffect } from "react";
import MessageInputBox from "./MessageInputBox";
import MessageLoading from "./MessageLoading";
import ViewImage from "./ViewImage";
import { clickSound } from "./mouseClickSound";
import { normalizeDate, getDateLabel } from "./timeStamps.js";
import { useContextMenu } from "./useContextMenu.js";
import { Trash } from "lucide-react";
import ConfirmationDeleteMessage from "./ConfirmationDeleteMessage.jsx";
import { TouchScreenContextMenu } from "./TouchScreenContextMenu.js";
const ChatContainer = () => {
  const {
    selectedUser,
    messages,
    getMessageByUserId,
    isMessageLoading,
    viewImage,
    setViewImage,
    SoundEnabled,
    confirmMessageDelete,
    setConfirmMessageDelete,
    realTimeDeletingMessage,
    unsubscribeDeletingMessage,
  } = useChatStore();
  const { openMenu, closeMenu, menu } = useContextMenu();
  const { handleTouchStart, handleTouchEnd } = TouchScreenContextMenu();
  const { authUser } = useAuthStore();
  useEffect(() => {
    if (!selectedUser) return;
    getMessageByUserId(selectedUser._id);
    realTimeDeletingMessage();
    return () => {
      unsubscribeDeletingMessage();
    };
  }, [
    selectedUser,
    getMessageByUserId,
    realTimeDeletingMessage,
    unsubscribeDeletingMessage,
  ]);

  if (viewImage) return <ViewImage />;
  const reverseMessages = [...messages].reverse();

  return (
    <div className="flex flex-col relative h-full">
      {confirmMessageDelete && (
        <div className="fixed inset-0 z-50 backdrop-blur-xs flex items-center justify-center">
          <ConfirmationDeleteMessage />
        </div>
      )}
      {menu && (
        <div
          className="fixed z-50 bg-white text-fuchsia-950  rounded-md shadow-lg"
          style={{
            top: menu.y,
            left: menu.x,
            transform: `translate(
              ${menu.x > window.innerWidth - 160 ? "-100%" : "0"},
              ${menu.y > window.innerHeight - 160 ? "0" : "-100%"} 
             )`,
          }}
        >
          <ul className="px-2 py-1">
            <li>
              <button
                className="flex items-center gap-2 px-4 py-2 text-red-500 w-full cursor-pointer hover:text-red-800"
                onClick={() => {
                  if (SoundEnabled) clickSound();
                  setConfirmMessageDelete(menu.payload);
                  closeMenu();
                }}
              >
                <Trash size={18} />
                Delete
              </button>
            </li>
          </ul>
        </div>
      )}
      {/* Header user name*/}
      <ChatHeader />
      {/* Body chat message*/}
      <div className="px-3 py-2 overflow-y-auto h-[calc(100vh-10rem)] flex flex-col-reverse">
        {reverseMessages.length > 0 && !isMessageLoading ? (
          <>
            {reverseMessages.map((msg, index) => {
              const prevMessage = reverseMessages[index + 1];

              const showDate =
                !prevMessage ||
                normalizeDate(new Date(prevMessage.createdAt)).getTime() !==
                  normalizeDate(new Date(msg.createdAt)).getTime();

              return (
                <div key={msg._id}>
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
                      <div className="w-10 rounded-full responsive-layout">
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
                      onContextMenu={(e) => {
                        if (SoundEnabled) clickSound();
                        openMenu(e, msg);
                      }}
                      onTouchStart={(e) => handleTouchStart(e, msg)}
                      onTouchEnd={handleTouchEnd}
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
          </>
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

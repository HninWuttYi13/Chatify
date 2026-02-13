import { ChatHeader } from "./ChatHeader";
import AvatarProfile from "../image/avatar_profile.jpg";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import NoChatContainer from "./NoChatContainer";
import { useEffect, useRef, useState } from "react";
import MessageInputBox from "./MessageInputBox";
import MessageLoading from "./MessageLoading";
import ViewImage from "./ViewImage";
import { clickSound } from "./mouseClickSound";
import { normalizeDate, getDateLabel } from "./timeStamps.js";
import { useContextMenu } from "./useContextMenu.js";
import { ArrowBigDown, Check, CheckCheck, Trash } from "lucide-react";
import ConfirmationDeleteMessage from "./ConfirmationDeleteMessage.jsx";
import { TouchScreenContextMenu } from "./TouchScreenContextMenu.js";
import getCallIcon from "./getCallIcon.jsx";
import { formatCallDuration, getCallStatusText } from "./audioCallHistory.js";
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
    firstUnreadMessage,
    setFirstUnreadMessage,
    markUnreadMessage,
    realTimeUnreadMessage,
    unsubscribeRealTimeUnreadMessage,
    isTyping,
    displayTyping,
    stopDisplayTyping,
    unsubscribeDisplayTyping,
  } = useChatStore();
  const { openMenu, closeMenu, menu } = useContextMenu();
  const { handleTouchStart, handleTouchEnd } = TouchScreenContextMenu();
  const { authUser } = useAuthStore();
  const firstUnreadMessageRef = useRef();
  const chatBodyRef = useRef(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const hasScrolledToUnread = useRef(false);
  useEffect(() => {
    hasScrolledToUnread.current = false;
  }, [selectedUser]);
  useEffect(() => {
    if (!selectedUser) return;
    getMessageByUserId(selectedUser._id);
    realTimeUnreadMessage();
    realTimeDeletingMessage();
    displayTyping();
    stopDisplayTyping();
    return () => {
      unsubscribeRealTimeUnreadMessage();
      unsubscribeDeletingMessage();
      unsubscribeDisplayTyping();
    };
  }, [selectedUser]);

  useEffect(() => {
    if (
      !isMessageLoading &&
      messages.length > 0 &&
      !hasScrolledToUnread.current
    ) {
      setFirstUnreadMessage();
    }

    if (firstUnreadMessageRef.current) {
      firstUnreadMessageRef.current.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
      hasScrolledToUnread.current = true;
    }
  }, [isMessageLoading, setFirstUnreadMessage, firstUnreadMessage]);

  useEffect(() => {
    const element = chatBodyRef.current;
    if (!element) return;

    const handleScroll = () => {
      const isAwayFromBottom = element.scrollTop < -20;

      setShowScrollDown(isAwayFromBottom);
    };

    element.addEventListener("scroll", handleScroll);

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const scrollToLatest = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const unreadCount = messages.filter(
    (msg) => !msg.isRead && msg.senderId !== authUser._id
  ).length;

  useEffect(() => {
    if (isMessageLoading || !messages.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            const msgId = entry.target.getAttribute("data-id");
            if (msgId) {
              markUnreadMessage(msgId);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        root: chatBodyRef.current,
        threshold: 0.25,
        rootMargin: "-20% 0px 0px 0px",
      }
    );

    const unreadElements = document.querySelectorAll(".unread-hook");
    unreadElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [messages, isMessageLoading, markUnreadMessage]);
  // React will recalculate unreadCount when messages change
  if (viewImage) return <ViewImage />;
  const reverseMessages = [...messages].reverse();

  return (
    <div className="flex flex-col relative h-full ">
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
      {showScrollDown && (
        <div
          onClick={() => {
            if (SoundEnabled) clickSound();
            scrollToLatest();
          }}
          className="absolute flex items-center justify-center  z-50 bottom-23 right-5 w-12 h-12 bg-fuchsia-950 rounded-full cursor-pointer"
        >
          <ArrowBigDown className="text-fuchsia-50" size={25} />
          {unreadCount > 0 && (
            <div className="absolute -top-5 bg-fuchsia-700 text-white text-sm font-bold px-4 py-1 rounded-full border-2 border-white  animate-in zoom-in">
              {unreadCount}
            </div>
          )}
        </div>
      )}

      {/* Body chat message*/}
      <div
        ref={chatBodyRef}
        className="px-3 py-2 overflow-y-auto h-[calc(100vh-10rem)] flex flex-col-reverse "
      >
        {reverseMessages.length > 0 && !isMessageLoading ? (
          <>
            {reverseMessages.map((msg, index) => {
              const prevMessage = reverseMessages[index + 1];

              const showDate =
                !prevMessage ||
                normalizeDate(new Date(prevMessage.createdAt)).getTime() !==
                  normalizeDate(new Date(msg.createdAt)).getTime();
              const showUnreadMessageDivider = firstUnreadMessage === msg._id;
              const isUnread = !msg.isRead && msg.senderId !== authUser._id;
              return (
                <div key={msg._id}>
                  {showDate && (
                    <div className="text-md text-fuchsia-950 text-center font-bold">
                      {getDateLabel(msg.createdAt)}
                    </div>
                  )}

                  {showUnreadMessageDivider && (
                    <div
                      ref={firstUnreadMessageRef}
                      className="divider text-fuchsia-700 my-4 font-semibold italic"
                    >
                      Unread Messages
                    </div>
                  )}

                  <div
                    data-id={msg._id}
                    key={msg._id}
                    className={`chat  ${
                      msg.senderId === authUser._id ? "chat-end" : "chat-start"
                    } ${isUnread ? "unread-hook" : ""}`}
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

                    <div
                      className={`chat-bubble relative  min-h-0 flex flex-col rounded-t-3xl  ${
                        authUser._id === msg.senderId
                          ? "bg-fuchsia-100 text-fuchsia-950 rounded-bl-3xl" // Lighter background for better contrast
                          : "bg-fuchsia-800 text-fuchsia-50 rounded-br-3xl"
                      } `}
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
                          className="rounded-lg h-48 object-cover cursor-pointer mb-1"
                          onClick={() => {
                            if (SoundEnabled) clickSound();
                            setViewImage(msg.image);
                          }}
                        />
                      )}
                      {msg.callLog?.callStatus &&
                        (() => {
                          const isOutgoing = msg.senderId === authUser._id;
                          const { callStatus, callDuration } = msg.callLog;

                          return (
                            <div className="flex items-center gap-3 px-3 py-2 rounded-3xl bg-fuchsia-200 text-fuchsia-950">
                              {/* Call Icon */}
                              <div className="shrink-0">
                                {getCallIcon(callStatus, isOutgoing)}
                              </div>

                              {/* Call Details */}
                              <div className="flex flex-col">
                                {/* Status */}
                                <span
                                  className={`text-[14px] font-semibold ${
                                    callStatus === "missed" ||
                                    callStatus === "rejected"
                                      ? "text-red-500"
                                      : ""
                                  }`}
                                >
                                  {getCallStatusText(callStatus, isOutgoing)}
                                </span>

                                {/* Duration ONLY when completed */}
                                {callStatus === "completed" &&
                                  callDuration > 0 && (
                                    <span className="text-xs opacity-70">
                                      {formatCallDuration(callDuration)}
                                    </span>
                                  )}
                              </div>
                            </div>
                          );
                        })()}

                      <div className="flex flex-col justify-end">
                        {msg.text && (
                          <p className="max-w-xl  whitespace-pre-wrap break-all  text-[15px] leading-tight">
                            {msg.text}
                          </p>
                        )}

                        {/* Metadata: Time + Ticks */}
                        <div className=" flex items-center justify-end gap-1 mt-2">
                          <span
                            className={`text-[11px] opacity-70 ${
                              authUser._id === msg.senderId
                                ? "text-fuchsia-950"
                                : "text-fuchsia-50"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString(
                              undefined,
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>

                          {msg.senderId === authUser._id && (
                            <div
                              className={
                                msg.isRead
                                  ? "text-fuchsia-700"
                                  : "text-fuchsia-500"
                              }
                            >
                              {msg.isRead ? (
                                <CheckCheck size={14} strokeWidth={3} />
                              ) : (
                                <Check size={14} strokeWidth={3} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
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
        {isTyping && (
          <div className="chat chat-start absolute flex items-center gap-1 animate-in fade-in duration-300 bottom-17 z-50">
           
            <div className=" bg-fuchsia-100 flex items-center gap-1 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm">
              {/* The Three Dots Wave */}
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-fuchsia-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-fuchsia-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-fuchsia-600 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* footer  text message*/}

      <MessageInputBox />
    </div>
  );
};

export default ChatContainer;

import { ChatHeader } from './ChatHeader';

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from '../store/useAuthStore';
import NoChatContainer from './NoChatContainer';
import { useEffect } from 'react';
import MessageInputBox from './MessageInputBox';
import MessageLoading from './MessageLoading';
const ChatContainer = () => {
  const {selectedUser, messages, getMessageByUserId,   isMessageLoading} = useChatStore();
  const {authUser} = useAuthStore();
  useEffect(()=> {
    getMessageByUserId(selectedUser._id)
  }, [selectedUser, getMessageByUserId])
  return (
    <div className="flex flex-col">
      {/* Header user name*/}
      <ChatHeader />
      {/* Body chat message*/}
      <div className="px-3 overflow-y-auto h-[calc(100vh-9rem)]">
        {messages.length > 0 && !isMessageLoading ? (
          <div >
            {messages.map((msg) => (
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
                          ? authUser.profilePic
                          : selectedUser.profilePic
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
                      className="rounded-lg h-48 object-cover"
                    />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : isMessageLoading ? (
          <MessageLoading/>
        ):(
          <NoChatContainer name={selectedUser.fullName} />
        )}
      </div>
      {/* footer  text message*/}
      
        <MessageInputBox />
     
    </div>
  );
}

export default ChatContainer
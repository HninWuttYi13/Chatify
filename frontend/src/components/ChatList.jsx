import React, { useEffect } from "react";
import ProfilePhoto from "../image/avatar_profile.jpg";
import { useChatStore } from "../store/useChatStore";
import UserLoadingState from "./UserLoadingState";
import NoChatFound from "./NoChatFound";
export function ChatList() {
  const { getMyChatPartners, chatUsers, isUserLoading, setSelectedUser } =
    useChatStore();
  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);
  if (isUserLoading) return <UserLoadingState />;
  if (chatUsers.length === 0) return <NoChatFound />;
  return (
    <div className="flex-1 overflow-y-auto px-2 space-y-2">
      {chatUsers.map((chatUser) => (
        <div
          key={chatUser._id}
          className="flex gap-2 items-center p-3 bg-fuchsia-950/10 rounded-lg cursor-pointer hover:bg-fuchsia-300 transition-colors"
          onClick={() => setSelectedUser(chatUser)}
        >
          <div className="avatar avatar-online">
            <div className="w-12 rounded-full">
              <img
                src={chatUser.profilePic || ProfilePhoto}
                alt={chatUser.fullName}
              />
            </div>
          </div>
          <p className="text-fuchsia-950 text-lg font-bold ">
            {chatUser.fullName}
          </p>
        </div>
      ))}
    </div>
  );
}

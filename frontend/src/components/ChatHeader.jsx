import { useEffect } from "react";
import AvatarProfile from "../image/avatar_profile.jpg";
import { useChatStore } from "../store/useChatStore";
import { ArrowLeft, Phone } from "lucide-react";
import { clickSound } from "./mouseClickSound";
import { useAuthStore } from "../store/useAuthStore";
import { formatTime } from "./formatTime.js";
import { useCallStore } from "../store/useCallStore.js";
export function ChatHeader() {
  const { selectedUser, setSelectedUser, SoundEnabled } = useChatStore();
  const { onlineUsers, lastOnlineUsers } = useAuthStore();
  const { startCall } = useCallStore();
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscKey);
    //clean up function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);
  const isOnline = onlineUsers.includes(selectedUser._id);
  const isLastOnline =
    lastOnlineUsers[selectedUser._id] || selectedUser.lastOnline;
  const handleStartCall = () => {
    if (selectedUser) {
      startCall(selectedUser._id);
    }
    if(SoundEnabled) clickSound();
  };
  return (
    <div className="bg-fuchsia-900 h-18 shadow-lg flex justify-between  items-center">
      <div className="flex items-center gap-4 p-3 ">
        <ArrowLeft
          className="text-fuchsia-50 cursor-pointer"
          size={28}
          onClick={() => {
            if (SoundEnabled) clickSound();
            setSelectedUser(null);
          }}
        />
        <div className="flex items-center gap-3">
          <div
            className={`avatar ${
              onlineUsers.includes(selectedUser._id)
                ? "avatar-online"
                : "avatar-offline"
            }`}
          >
            <div className="w-12 rounded-full">
              <img
                src={selectedUser?.profilePic || AvatarProfile}
                alt={selectedUser.fullName}
              />
            </div>
          </div>
          <div className="text-fuchsia-50">
            <p className="text-lg font-semibold">{selectedUser.fullName}</p>
            <p className="text-sm">
              {isOnline
                ? "online"
                : isLastOnline
                  ? `last seen ${formatTime(isLastOnline)}`
                  : "Offline"}
            </p>
          </div>
        </div>
      </div>
      <div className="mr-5">
        <Phone
        size={22}
          onClick={handleStartCall}
          className="text-fuchsia-50  cursor-pointer hover:text-fuchsia-400"
        />
      </div>
    </div>
  );
}

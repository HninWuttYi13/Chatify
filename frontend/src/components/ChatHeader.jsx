import { useEffect } from "react";
import AvatarProfile from "../image/avatar_profile.jpg";
import { useChatStore } from "../store/useChatStore";
import { ArrowLeft, WindArrowDown } from "lucide-react";
export function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscKey);
    //clean up function
  return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);
  return (
    <div className="bg-fuchsia-900 h-18 flex items-center gap-4 p-3 shadow-lg">
      <ArrowLeft
        className="text-fuchsia-50 cursor-pointer"
        size={28}
        onClick={() => setSelectedUser(null)}
      />
      <div className="flex items-center gap-3">
        <div className="avatar avatar-online">
          <div className="w-12 rounded-full">
            <img
              src={selectedUser?.profilePic || AvatarProfile}
              alt={selectedUser.fullName}
            />
          </div>
        </div>
        <div className="text-fuchsia-50">
          <p className="text-lg font-semibold">{selectedUser.fullName}</p>
          <p className="text-sm">Online</p>
        </div>
      </div>
    </div>
  );
}

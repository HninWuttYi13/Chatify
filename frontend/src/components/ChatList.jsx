import { useEffect } from "react";
import ProfilePhoto from "../image/avatar_profile.jpg";
import { useChatStore } from "../store/useChatStore";
import UserLoadingState from "./UserLoadingState";
import NoChatFound from "./NoChatFound";
import { clickSound } from "./mouseClickSound";
import { Trash, Shield } from "lucide-react";
import Confirmation from "./Confirmation";
import { useContextMenu } from "./useContextMenu";
import { TouchScreenContextMenu } from "./TouchScreenContextMenu";
export function ChatList() {
  const {
    getMyChatPartners,
    chatUsers,
    isUserLoading,
    setSelectedUser,
    SoundEnabled,
    confirmDelete,
    setConfirmDelete,
  } = useChatStore();
  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);
  const { menu, openMenu, closeMenu } = useContextMenu();
  const { handleTouchStart, handleTouchEnd } = TouchScreenContextMenu();
  if (isUserLoading) return <UserLoadingState />;
  if (chatUsers.length === 0) return <NoChatFound />;

  if (confirmDelete) return <Confirmation />;

  return (
    <div className="flex-1 overflow-y-auto px-2 space-y-2">
      {menu && (
        <div
          className="fixed z-50 bg-fuchsia-100 text-fuchsia-950  rounded-md shadow-lg"
          style={{
            top: menu.y,
            left: menu.x,
          }}
        >
          <ul className="py-1">
            <li>
              <button
                className="flex items-center gap-2 px-4 py-2 text-red-500 w-full cursor-pointer hover:text-red-800"
                onClick={() => {
                  if (SoundEnabled) clickSound();
                  setConfirmDelete(menu.payload);
                  closeMenu();
                }}
              >
                <Trash size={18} />
                Delete Chat
              </button>
            </li>
            <hr className="border-fuchsia-300" />
            <li>
              <button className="flex items-center gap-2 px-4 py-2 text-fuchsia-950 hover:text-fuchsia-500 w-full cursor-pointer">
                <Shield size={18} />
                Block
              </button>
            </li>
          </ul>
        </div>
      )}

      {chatUsers.map((chatUser) => (
        <div
          key={chatUser._id}
          className="flex gap-2 items-center p-3 bg-fuchsia-950/10 rounded-lg cursor-pointer hover:bg-fuchsia-300 transition-colors"
          onClick={() => {
            if (SoundEnabled) clickSound();
            setSelectedUser(chatUser);
          }}
          onContextMenu={(e) => {
            if (SoundEnabled) clickSound();
            openMenu(e, chatUser);
          }}
          onTouchStart={(e) => handleTouchStart(e, chatUser)}
          onTouchEnd={handleTouchEnd}
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

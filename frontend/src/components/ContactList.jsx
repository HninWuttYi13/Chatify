import { useEffect } from "react";
import ProfilePhoto from "../image/avatar_profile.jpg";
import { useChatStore } from "../store/useChatStore";
import UserLoadingState from "./UserLoadingState";
import { clickSound } from "./mouseClickSound";
export function ContactList() {
  const { isUserLoading, setSelectedUser, allContacts, getAllContacts, SoundEnabled } =
    useChatStore();
  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);
  if (isUserLoading) return <UserLoadingState />;
  return (
    <div className="flex-1 overflow-y-auto px-2 space-y-2">
      {allContacts.map((contactUser) => (
        <div
          key={contactUser._id}
          className="flex gap-2 items-center p-3 bg-fuchsia-900/10 rounded-sm cursor-pointer hover:bg-fuchsia-300 transition-colors"
          onClick={() => {
            if(SoundEnabled) clickSound();
            setSelectedUser(contactUser)
          }}
        >
          <div className="avatar avatar-online">
            <div className="w-12 rounded-full">
              <img
                src={contactUser.profilePic || ProfilePhoto}
                alt={contactUser.fullName}
              />
            </div>
          </div>
          <p className="text-fuchsia-950 text-lg font-bold ">
            {contactUser.fullName}
          </p>
        </div>
      ))}
    </div>
  );
}

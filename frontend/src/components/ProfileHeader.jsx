import { LogOut, VolumeOff, Volume2 } from "lucide-react";
import ProfilePhoto from "../image/avatar_profile.jpg"
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useRef, useState } from "react";
import clickSoundEffect from "/Sounds/computer-mouse-click.mp3"
const mouseClickSound = new Audio(clickSoundEffect)
export function ProfileHeader() {
   const { authUser, logout, updateProfile } = useAuthStore();
   const {  SoundEnabled, toggleSound } = useChatStore();
   const [selectedProfile, setSelectedProfile ] = useState(null);
   const fileInputRef = useRef(null);
   const handleSubmit = (e)=> {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (async()=> {
      const base64Image = reader.result;
      setSelectedProfile(base64Image);
      await updateProfile({profilePic: base64Image})
    })
   }
  return (
    <div className="flex items-center justify-between bg-fuchsia-950 py-8 px-4 rounded-br-4xl  h-30">
      <div className="flex items-center gap-2 relative group">
        <div className="avatar avatar-online">
          <button
            className="overflow-hidden size-14 relative rounded-full"
            onClick={() => fileInputRef.current.click()}
          >
            <img
              src={selectedProfile || authUser.profilePic || ProfilePhoto}
              alt="user profile photo"
              className="size-full object-cover"
            />
            <div className="absolute inset-0  flex items-center opacity-0 justify-center group-hover:opacity-100 transition-opacity">
              <span className="text-sm text-fuchsia-950 font-bold cursor-pointer">
                Change
              </span>
            </div>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleSubmit}
            className="hidden"
          />
        </div>

        <div className="text-fuchsia-50">
          <p className="font-bold text-lg">{authUser.fullName}</p>
          <p className="text-xs">Online</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-fuchsia-50">
        <LogOut
          size={20}
          className="cursor-pointer hover:text-fuchsia-300 transition-colors"
          onClick={logout}
        />
        <button className="cursor-pointer hover:text-fuchsia-300 transition-colors"
        onClick={()=> {
          mouseClickSound.currentTime = 0;
          mouseClickSound
            .play()
            .catch((error) => console.log("Audio play failed", error));
          toggleSound()
          }}
        >
          {SoundEnabled ? <Volume2 size={20}/> : <VolumeOff size={20}/> }
        </button>
      </div>
    </div>
  );
}
  
import { useCallStore } from "../store/useCallStore";
import { useChatStore } from "../store/useChatStore";
import { PhoneOff } from "lucide-react";
import ProfilePhoto from "../image/avatar_profile.jpg";
import { useEffect, useRef } from "react";
import { clickSound } from "./mouseClickSound";

const OutgoingAudioCallModal = () => {
  const { selectedUser, SoundEnabled} = useChatStore();
  const { callState, endCall } = useCallStore();
  const ringtoneRef = useRef(null);
  const callingTimerRef = useRef(null);
  useEffect(()=> {
    if(callState === "calling"){
      ringtoneRef.current = new Audio("/Sounds/outgoingringtone.mp3");
      ringtoneRef.current.loop = true;
      ringtoneRef.current?.play().catch(err=> console.log(err));
      callingTimerRef.current = setTimeout(()=>endCall(), 30000)
    }
  return()=> {
   clearTimeout(callingTimerRef.current);
   ringtoneRef.current?.pause();
   ringtoneRef.current = null;
  }
  }, [callState])
  if (callState !== "calling") return;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fuchsia-900/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-8">
        {/* Avatar Area */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-fuchsia-400 p-1 animate-pulse">
            <img
              src={selectedUser?.profilePic || ProfilePhoto}
              className="w-full h-full rounded-full object-cover"
              alt="calling"
            />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-fuchsia-400 text-white text-xs px-3 py-1 rounded-full uppercase tracking-widest">
            Calling...
          </div>
        </div>

        <div className="text-center text-white">
          <h2 className="text-2xl font-bold">{selectedUser?.fullName}</h2>
          <p className="text-fuchsia-200 mt-2">Waiting for answer...</p>
        </div>

        {/* End Call Button */}
        <button
          onClick={()=> {
            if(SoundEnabled) clickSound();
            endCall();
          }}
          className="p-6 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-90 cursor-pointer"
        >
          <PhoneOff size={32} />
        </button>
      </div>
    </div>
  );
};

export default OutgoingAudioCallModal;

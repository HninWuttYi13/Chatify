import { useState } from "react";
import { useCallStore } from "../store/useCallStore";
import { Mic, MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
import ProfilePhoto from "../image/avatar_profile.jpg";
import { clickSound, phoneEndCall } from "./mouseClickSound";
import { useChatStore } from "../store/useChatStore";
const ActiveCallModal = () => {
  const { callState, endCall, caller, callDuration, isMute, setIsMute } = useCallStore();
  const {SoundEnabled} = useChatStore();
  const [isSpeaker, setIsSpeaker] = useState(true);
  // Format time (00:00)
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (callState !== "in-call") return null;

 return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fuchsia-200 ">
      <div className="flex flex-col items-center justify-between w-full h-full max-w-md py-20 px-6">
        
        {/* Top Section: User Info */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            {/* Pulsing "Voice" Rings */}
            <div className="absolute inset-0 rounded-full bg-fuchsia-500/20 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-fuchsia-500/10 animate-pulse delay-75" />
            
            <div className="relative w-40 h-40 rounded-full border-4 border-fuchsia-600 p-1 overflow-hidden bg-slate-800">
              <img
                src={caller?.profilePic || ProfilePhoto}
                className="w-full h-full rounded-full object-cover"
                alt="Active Call"
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-fuchsia-950 tracking-tight">
              {caller?.fullName}
            </h2>
            <p className="tracking-tight font-mono text-xl mt-2">
              {formatTime(callDuration)}
            </p>
          </div>
        </div>

        {/* Middle Section: Connection Status */}
        <div className="bg-white/5 px-4 py-2 rounded-full border border-fuchsia-300 shadow-md">
          <span className="flex items-center gap-2 text-green-400 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Secure Connection
          </span>
        </div>

        {/* Bottom Section: Controls */}
        <div className="flex items-center justify-between w-full px-8">
          {/* Mute Button */}
          <button 
            onClick={() => {
              if(SoundEnabled) clickSound();
              setIsMute(!isMute)
            }}
            className={`p-5 rounded-full transition-all cursor-pointer ${
              isMute? "bg-white text-slate-900" : "bg-fuchsia-950 text-white hover:bg-fuchsia-900"
            }`}
          >
            {isMute ? <MicOff size={28} /> : <Mic size={28} />}
          </button>

          {/* End Call Button */}
          <button
            onClick={()=> {
              if(SoundEnabled) phoneEndCall();
              endCall();
            }}
            className="p-7 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-transform hover:scale-110 active:scale-90 cursor-pointer"
          >
            <PhoneOff size={36} fill="currentColor" />
          </button>

          {/* Speaker/Volume Button */}
          <button 
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-5 rounded-full transition-all ${
              !isSpeaker ? "bg-white text-fuchsia-900" : "bg-fuchsia-950 text-white hover:bg-fuchsia-900 cursor-pointer"
            }`}
          >
            {isSpeaker ? <Volume2 size={28} /> : <VolumeX size={28} />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ActiveCallModal;
import { useCallStore } from "../store/useCallStore";
import { Phone, PhoneOff } from "lucide-react";
import ProfilePhoto from "../image/avatar_profile.jpg";
import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { clickSound, phoneEndCall } from "./mouseClickSound";
const IncomingAudioCallModal = () => {
  const { callState, caller, acceptCall, rejectCall } = useCallStore();
  const {SoundEnabled} = useChatStore();
  const incomingRingtoneRef = useRef(null);
  useEffect(()=> {
   if(callState === "ringing"){
    incomingRingtoneRef.current = new Audio("/Sounds/incomingRingtone.mp3");
    incomingRingtoneRef.current.loop = true;
    incomingRingtoneRef.current?.play().catch((err) => console.log(err));
   }
    return(()=> {
      incomingRingtoneRef.current?.pause();
      incomingRingtoneRef.current = null;
    })
  }, [callState])
  if (callState !== "ringing") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ">
      <div className="bg-white p-8 md:rounded-2xl rounded-none shadow-2xl flex flex-col  items-center justify-between  sm:w-full md:w-xl w-full h-full sm:h-full md:h-3/4 space-y-6">
        {/* Profile Image with Fallback */}
        <div className="mt-5 space-y-4">
          <div className=" w-40 h-40 rounded-full bg-fuchsia-100 overflow-hidden flex items-center justify-center border-4 border-fuchsia-950 animate-pulse">
            {caller.profilePic ? (
              <img
                src={caller.profilePic || ProfilePhoto}
                alt="caller"
                className="w-full h-full object-cover"
              />
            ) : (
              <Phone className="text-fuchsia-600" size={48} />
            )}
          </div>

          <div className="text-center">
            <h3 className="text-sm text-gray-400 uppercase tracking-widest font-semibold">
              Incoming Call
            </h3>
            <p className="text-2xl font-bold text-fuchsia-900 mt-1">
              {/* Display the name, or the ID if name isn't found, or "Unknown" */}
              {caller.fullName}
            </p>
          </div>
        </div>
        <div className="flex gap-8 ">
          <button
            onClick={()=> {
              if(SoundEnabled) phoneEndCall();
              rejectCall();
            }}
            className="p-4 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg"
          >
            <PhoneOff size={28} />
          </button>

          <button
            onClick={()=> {
              if(SoundEnabled) clickSound();
              acceptCall(caller);
            }}
            className="p-4 cursor-pointer bg-green-500 hover:bg-green-600 text-white rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg "
          >
            <Phone size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingAudioCallModal;

import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
export const useCallStore = create((set, get) => ({
  callState: "idle",
  caller: null,
  incomingOffer: null,
  callDuration: 0,
  callMessageId: null,
  callStartTime: null,
  timerId: null,
  isMute: false,
  setIsMute: () => set((state) => ({ isMute: !state.isMute })),
  incomingCall: ({ callerUser, offer, messageId }) => {
    set({
      callState: "ringing",
      caller: callerUser,
      incomingOffer: offer,
      callMessageId: messageId,
    });
  },
  startCall: (receiverUser) => {
    set({ callState: "calling", caller: receiverUser });
  },
  acceptCall: (userData) => {
    const startTime = Date.now();
    const id = setInterval(() => {
      set((state) => ({ callDuration: state.callDuration + 1 }));
    }, 1000);
    set({
      callState: "in-call",
      timerId: id,
      callDuration: 0,
      caller: userData,
      callStartTime: startTime,
    });
  },

  endCall: () => {
    const socket = useAuthStore.getState().socket;
    const { caller, timerId, callMessageId, callDuration } = get();
    if (timerId) clearInterval(timerId);
    if (socket && caller) {
      const receiverId = caller._id || caller;
      socket.emit("call:end", { receiverId, messageId: callMessageId, duration: callDuration  });
    }
    set({
      callState: "idle",
      caller: null,
      incomingOffer: null,
      timerId: null,
      callDuration: 0,
      callMessageId: null
    });
  },
  remoteEndCall: () => {
    const { timerId } = get();
    if (timerId) clearInterval(timerId);
    set({
      callState: "idle",
      caller: null,
      incomingOffer: null,
      timerId: null,
      callDuration: 0,
      callMessageId: null
    });
  },
  rejectCall : ()=> {
    const socket = useAuthStore.getState().socket;
    const {caller, callMessageId, remoteEndCall} = get();
    if(socket && caller && callMessageId){
      socket.emit("call:reject", {
        receiverId: caller._id,
        messageId: callMessageId
      })
    }
    remoteEndCall()
  }
}));

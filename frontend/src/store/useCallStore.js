import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
export const useCallStore = create((set, get) => ({
  callState: "idle",
  caller: null,
  incomingOffer: null,
  callDuration: 0,
  timerId: null,
  incomingCall: ({ callerUser, offer }) => {
    set({
      callState: "ringing",
      caller:callerUser,
      incomingOffer: offer,
    });
  },
  startCall: (receiverUser) => {
    set({ callState: "calling", caller: receiverUser});
  },
  acceptCall: (userData) => {
    const currentTimer = get().timerId;
    if (currentTimer) clearInterval(currentTimer);
    const id = setInterval(() => {
      set((state) => ({ callDuration: state.callDuration + 1 }));
    }, 1000);
    set({ callState: "in-call", timerId: id, callDuration: 0, caller: userData});
  },

  endCall: () => {
    const socket = useAuthStore.getState().socket;
    const { caller, timerId } = get();
    if (timerId) clearInterval(timerId);
    if (socket && caller) {
      const receiverId = caller._id || caller;
      socket.emit("call:end", { receiverId });
    }
    set({
      callState: "idle",
      caller: null,
      incomingOffer: null,
      timerId: null,
      callDuration: 0,
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
    });
  },
}));

import { create } from "zustand";
import { axiosConstant } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isChecking: true,
  isSigningUp: false,
  isLogin: false,
  isUpdatingProfile: false,
  socket: null,
  onlineUsers: [],
  lastOnlineUsers: {},
  checkAuth: async () => {
    try {
      const res = await axiosConstant.get("api/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isChecking: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosConstant.post("api/auth/signup", data);

      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    try {
      set({ isLogin: true });
      const res = await axiosConstant.post("api/auth/login", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Login Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isLogin: false });
    }
  },
  logout: async () => {
    try {
      set({ authUser: null });
      await axiosConstant.post("/api/auth/logout");
      toast.success("Logout Successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("error in logging out");
      console.log("Logout error:", error);
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosConstant.put("/api/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Update Profile Successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(import.meta.env.VITE_API, {
      withCredentials: true,
    });
    socket.connect();
    set({ socket });
    socket.on("getOnlineUsers", (userId) => {
      set({ onlineUsers: userId });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
  getLastOnlineUsers: ()=> {
    const {socket} = get();
    if(!socket) return;
    socket.on("offlineUser", ({ userId, lastOnline }) => {
      set((state) => ({
        lastOnlineUsers: {
          ...state.lastOnlineUsers,
          [userId]: lastOnline,
        },
      }));
    });
  },
  unsubscribeLastOnlineUsers: ()=> {
    const {socket} = get();
   if(socket) {
    socket.off("offlineUser");
   }
  }
}));

import { create } from "zustand";
import { axiosConstant } from "../lib/axios";
import toast from "react-hot-toast";
export const useChatStore = create((set, get) => ({
  allContacts: [],
  chatUsers: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  SoundEnabled: JSON.parse(localStorage.getItem("SoundEnabled")) === true,
  toggleSound: ()=> {
    localStorage.setItem("SoundEnabled", !get().SoundEnabled);
    set({SoundEnabled: !get().SoundEnabled})
  },
  setActiveTab: (tab)=> set({activeTab: tab}),
  setSelectedUser: (selectedUser)=> set({selectedUser}),
  getAllContacts: async()=> {
    set({ isUserLoading: true });
   try {
    const res = await axiosConstant.get("/api/messages/contacts");
    set({ allContacts: res.data });
    
   } catch (error) {
     toast.error(error.response.data.message)
   } finally{
    set({isUserLoading: false})
   }
  },
  getMyChatPartners: async()=> {
    set({ isUserLoading: true });
     try {
      const res = await axiosConstant.get("api/messages/chats");
      set({chats: res.data})
     } catch (error) {
      toast.error(error.response.data.message)
     } finally{
      set({isUserLoading: false})
     }
  }
}));

import { create } from "zustand";
import { axiosConstant } from "../lib/axios";
import toast from "react-hot-toast";
export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,
  SoundEnabled: JSON.parse(localStorage.getItem("SoundEnabled")) === true,
  toggleSound: ()=> {
    localStorage.setItem("SoundEnabled", !get().SoundEnabled);
    set({SoundEnabled: !get().SoundEnabled})
  },
  setActiveTab: (tab)=> set({activeTab: tab}),
  setSelectedUser: (selectedUser)=> set({selectedUser}),
  getAllContacts: async()=> {
   try {
    set({ isUsersLoading: true });
    const res = await axiosConstant.get("api/messages/contacts");
    set({ allContacts: res.data });
    
   } catch (error) {
     toast.error(error.response.data.message)
   } finally{
    set({isUsersLoading: false})
   }
  },
  getMyChatPartners: async()=> {
     try {
      set({isUsersLoading: true});
      const res = await axiosConstant.get("api/messages/chats");
      set({chats: res.data})
     } catch (error) {
      toast.error(error.response.data.message)
     } finally{
      set({isUsersLoading: false})
     }
  }
}));

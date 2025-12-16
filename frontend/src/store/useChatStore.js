import { create } from "zustand";
import { axiosConstant } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
export const useChatStore = create((set, get) => ({
  allContacts: [],
  chatUsers: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  confirmDelete: null,
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
      const res = await axiosConstant.get("/api/messages/chats");
      set({chatUsers: res.data})
     } catch (error) {
      toast.error(error.response.data.message)
     } finally{
      set({isUserLoading: false})
     }
  },
  getMessageByUserId: async(userId)=> {
    set({isMessageLoading: true});
    try {
      const res = await axiosConstant.get(`/api/messages/${userId}`);
      set({messages: res.data})
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }finally{
      set({isMessageLoading: false})
    }
  },
  sendMessage: async(messageData)=> {
    const {selectedUser, messages}=get();
    const {authUser } = useAuthStore.getState();
    const tempId = `temp-${Date.now()}`;
    const newMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    }
    set({messages:[...messages, newMessage]})
    try {
      const res = await axiosConstant.post(`/api/messages/send/${selectedUser._id}`, messageData);
      set({messages: [...messages, res.data]})
    } catch (error) {
      set({messages});
      toast.error(error?.response?.data?.message)
    }
  },
  deleteChatMessageForMe : async(chatPartnerId)=> {
    const {chatUsers, selectedUser, messages} = get()
   try {
      await axiosConstant.delete(`/api/messages/chat/${chatPartnerId}`);
    const remainChatPartners = chatUsers.filter(chatUser=> chatUser._id !== chatPartnerId);
     set({
      chatUsers: remainChatPartners,
      messages: selectedUser?._id === chatPartnerId ? [] : messages,
      selectedUser: selectedUser?._id === chatPartnerId ? null : selectedUser
     })
    toast.success("Chat is deleted successfully")
   } catch (error) {
    set({chatUsers});
    toast.error(error?.response?.data?.message || "Failed to delete chat")
   }
  },
  setConfirmDelete: (chatUser)=>set({confirmDelete: chatUser})
}));

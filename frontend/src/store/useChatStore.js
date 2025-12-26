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
  viewImage: null,
  confirmMessageDelete: null,
  setViewImage: (img) => set({ viewImage: img }),
  SoundEnabled: JSON.parse(localStorage.getItem("SoundEnabled")) === true,
  toggleSound: () => {
    localStorage.setItem("SoundEnabled", !get().SoundEnabled);
    set({ SoundEnabled: !get().SoundEnabled });
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  getAllContacts: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosConstant.get("/api/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosConstant.get("/api/messages/chats");
      set({ chatUsers: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessageByUserId: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosConstant.get(`/api/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();
    const tempId = `temp-${Date.now()}`;
    const newMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
    try {
      const res = await axiosConstant.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      set(state=> ({
        messages: state.messages.map(m=> m._id === tempId ? res.data : m)
      }))
    } catch (error) {
      set({ messages });
      toast.error(error?.response?.data?.message);
    }
  },
  deleteChatConversationForMe: async (chatPartnerId) => {
    const { chatUsers, selectedUser, messages } = get();
    try {
      await axiosConstant.delete(`/api/messages/chat/${chatPartnerId}`);
      const remainChatPartners = chatUsers.filter(
        (chatUser) => chatUser._id !== chatPartnerId
      );
      set({
        chatUsers: remainChatPartners,
        messages: selectedUser?._id === chatPartnerId ? [] : messages,
        selectedUser: selectedUser?._id === chatPartnerId ? null : selectedUser,
      });
      toast.success("Chat is deleted successfully");
    } catch (error) {
      set({ chatUsers });
      toast.error(error?.response?.data?.message || "Failed to delete chat");
    }
  },
  setConfirmDelete: (chatUser) => set({ confirmDelete: chatUser }),
  subscribeNewMessages: () => {
    const { selectedUser, SoundEnabled } = get();
    const socket = useAuthStore.getState().socket;
    socket.on("newMessages", (newMessages) => {
      const MessageSentFromSelectedUser =
        newMessages.senderId === selectedUser._id;
      if (!MessageSentFromSelectedUser) return;
      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessages] });
      const notificationSound = new Audio("/Sounds/notificationSound.mp3");
      notificationSound.currentTime = 0;
      if (SoundEnabled) notificationSound.play();
    });
  },
  unsubscribeNewMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessages");
  },
  setConfirmMessageDelete: (msg) => set({ confirmMessageDelete: msg }),
  deleteChatMessageForme: async (messageId) => {
    try {
      await axiosConstant.delete(`/api/messages/message/me/${messageId}`);
      if (messageId.startsWith("temp-")) {
        set((state) => ({
          messages: state.messages.filter((m) => m._id !== messageId),
        }));
        return;
      }
      
      toast.success("Message is deleted successfully");
    } catch (error) {
      
      toast.error(error?.response?.data?.message || "error in delete message");
    }
  },
  deleteChatMessageForBothUser: async (messageId) => {
    try {
      await axiosConstant.delete(`/api/messages/message/${messageId}`);
      if (messageId.startsWith("temp-")) {
        set((state) => ({
          messages: state.messages.filter((m) => m._id !== messageId),
        }));
        return;
      }
      
      toast.success("Message is deleted successfully for both users");
    } catch (error) {
      toast.error(error?.response?.data?.message || "error in delete message");
    }
  },
  realTimeDeletingMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.on("messageDeleted", (messageId) => {
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
    });
  },
  unsubscribeDeletingMessage: ()=> {
    const socket = useAuthStore.getState().socket;
    socket.off("messageDeleted")
  }
}));

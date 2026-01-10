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
  firstUnreadMessage: null,
  isTyping: false,
  setFirstUnreadMessage: () => {
    set((state) => {
      const authUser = useAuthStore.getState().authUser;
      const firstUnread = state.messages.find(
        (m) => !m.isRead && m.senderId !== authUser._id
      );
      return {
        firstUnreadMessage: firstUnread ? firstUnread._id : null,
      };
    });
  },
  setViewImage: (img) => set({ viewImage: img }),
  SoundEnabled: JSON.parse(localStorage.getItem("SoundEnabled")) === true,
  toggleSound: () => {
    localStorage.setItem("SoundEnabled", !get().SoundEnabled);
    set({ SoundEnabled: !get().SoundEnabled });
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: async (selectedUser) => {
    set({ selectedUser });
    set((state) => {
      return {
        chatUsers: state.chatUsers.map((u) =>
          u._id === selectedUser._id ? { ...u, unreadCountMessage: 0 } : u
        ),
      };
    });
  },

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
      set({ chatUsers: res.data.chatPartners });
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
      set((state) => ({
        messages: state.messages.map((m) => (m._id === tempId ? res.data : m)),
      }));
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
    const { SoundEnabled } = get();
    const socket = useAuthStore.getState().socket;
    socket.on("newMessages", (newMessages) => {
      set((state) => {
        const isChatOpen =
          state.selectedUser && state.selectedUser._id === newMessages.senderId;
        if (isChatOpen) {
          return {
            messages: [...state.messages, newMessages],
          };
        }
        const exists = state.chatUsers.some(
          (u) => u._id === newMessages.senderId
        );
        return {
          chatUsers: exists
            ? state.chatUsers.map((u) =>
                u._id === newMessages.senderId
                  ? {
                      ...u,
                      unreadCountMessage: (u.unreadCountMessage || 0) + 1,
                    }
                  : u
              )
            : [
                {
                  _id: newMessages.senderId,
                  fullName: newMessages.senderName,
                  profilePic: newMessages.senderProfilePic,
                  unreadCountMessage: 1,
                },
                ...state.chatUsers,
              ],
        };
      });

      if (SoundEnabled) {
        const audio = new Audio("/Sounds/notificationSound.mp3");

        audio.play();
      }
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
  unsubscribeDeletingMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("messageDeleted");
  },
  markUnreadMessage: async (msgId) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m._id === msgId ? { ...m, isRead: true } : m
      ),
    }));
    try {
      await axiosConstant.put(`api/messages/mark-read/${msgId}`);
    } catch (error) {
      console.log(error);
    }
  },
  realTimeUnreadMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.on("readMessage", ({ messageIds }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          messageIds.includes(msg._id) ? { ...msg, isRead: true } : msg
        ),
      }));
    });
  },
  unsubscribeRealTimeUnreadMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("readMessage");
  },
  displayTyping : ()=> {
      const socket = useAuthStore.getState().socket;
      const {SoundEnabled} = get();
     socket.on("displayTyping", ({senderId})=> {
      if (SoundEnabled) {
        const audio = new Audio("/Sounds/bubbleSound.mp3");
        audio.currentTime = 0;
        audio.play();
      }
      set((state)=> {
        if(senderId !== state.selectedUser._id) return state;
        return {isTyping: true}
      })
      
     })
  },
  stopDisplayTyping: ()=> {
    const socket = useAuthStore.getState().socket;
    socket.on("hideTyping", ({senderId})=> {
      set((state)=> {
        if(senderId !== state.selectedUser._id)return state;
        return {isTyping: false}
      })
    });
  },
  unsubscribeDisplayTyping: ()=> {
    const socket = useAuthStore.getState().socket;
    socket.off("displayTyping");
    socket.off("hideTyping");
  },

}));

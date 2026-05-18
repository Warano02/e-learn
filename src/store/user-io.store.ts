import axiosInstance from "@/lib/axios";
import { User } from "@/types";
import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface UserSocket {
  users: User[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  selectedUser: User | null;

  fetchUsers: () => Promise<void>;
  initSocket: (token: string) => void;
  disconnectSocket: () => void;
  sendMessage: (
    receiverId: string,
    content: string,
  ) => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  addMessage: (message: Message) => void;
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const useUserSocket = create<UserSocket>((set, get) => ({
  users: [],
  messages: [],
  isLoading: false,
  error: null,
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  selectedUser: null,

  setSelectedUser: (user) => {
    set({
      selectedUser: user,
      messages: [],
    });
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  fetchUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("/users");

      set({
        users: response.data,
      });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to fetch users",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  initSocket: (token) => {
    const existingSocket = get().socket;

    if (existingSocket?.connected) return;

    const socket = io(baseURL, {
      autoConnect: true,
      withCredentials: true,
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      set({
        isConnected: true,
      });
    });

    socket.on("disconnect", () => {
      set({
        isConnected: false,
      });
    });

    socket.on("users_online", (users: string[]) => {
      set({
        onlineUsers: new Set(users),
      });
    });

    socket.on("user_connected", (userId: string) => {
      set((state) => ({
        onlineUsers: new Set([
          ...state.onlineUsers,
          userId,
        ]),
      }));
    });

    socket.on("user_disconnected", (userId: string) => {
      set((state) => {
        const updatedUsers = new Set(
          state.onlineUsers,
        );

        updatedUsers.delete(userId);

        return {
          onlineUsers: updatedUsers,
        };
      });
    });

    socket.on(
      "activity_updated",
      ({
        userId,
        activity,
      }: {
        userId: string;
        activity: string;
      }) => {
        set((state) => {
          const updatedActivities = new Map(
            state.userActivities,
          );

          updatedActivities.set(userId, activity);

          return {
            userActivities: updatedActivities,
          };
        });
      },
    );

    socket.on("receive_message", (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on("new_notification", (notification) => {
      console.log(notification);
      alert("You have receive notification")
    });

    set({
      socket,
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;

    if (!socket) return;

    socket.removeAllListeners();
    socket.disconnect();

    set({
      socket: null,
      isConnected: false,
      onlineUsers: new Set(),
      userActivities: new Map(),
    });
  },

  sendMessage: async (
    receiverId: string,
    content: string,
  ) => {
    const socket = get().socket;

    if (!socket) return;

    socket.emit("send_message", {
      receiverId,
      content,
    });
  },

  fetchMessages: async (userId: string) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.get(
        `/users/messages/${userId}`,
      );

      set({
        messages: response.data,
      });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to fetch messages",
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },
}));
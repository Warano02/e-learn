import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import { AxiosResponse } from "axios";

type Role = "student" | "teacher";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string | null;
  onboarding: number;
  isActive: boolean;
  isEmailConfirmed: boolean;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface ActionResult {
  success: boolean;
  msg?: string;
  user?: User;
  level?: number;
  role?: Role;
}

interface UserStore {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  fetchMe: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<ActionResult>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<UserStore>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) =>
    set({
      user,
      loading: false,
      initialized: true,
    }),

  clearUser: () =>
    set({
      user: null,
      loading: false,
      initialized: true,
    }),

  fetchMe: async () => {
    if (get().loading && get().initialized) return;

    set({ loading: true });

    try {
      const { data } = await axiosInstance.get<{ user: User }>("/auth/me");

      set({
        user: data.user,
        loading: false,
        initialized: true,
      });
    } catch {
      set({
        user: null,
        loading: false,
        initialized: true,
      });
    }
  },

  login: async (payload) => {
    set({ loading: true });

    try {
      const response = await axiosInstance.post<AxiosResponse>(
        "/auth/login",
        payload,
      );
      const data: ActionResult = response.data.data;
      console.log("data from api ", data);

      set({
        user: data.user,
        loading: false,
        initialized: true,
      });

      return {
        success: true,
        user: data.user,
        role: data.role,
      };
    } catch (error: any) {
      set({ loading: false });

      return {
        success: false,
        msg: error?.response?.data?.msg || "Login failed",
      };
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      window.location.href="/auth/login"
    } catch {}

    set({
      user: null,
      loading: false,
      initialized: true,
    });
  },
}));

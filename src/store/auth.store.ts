import { create } from "zustand";
import axiosInstance from "@/lib/axios";

type Role = "student" | "teacher";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string | null;
  onboarding?: number;
}

interface LoginPayload {
  email: string;
  password: string;
  role?: string;
}

interface SignupPayload {
  email: string;
  password: string;
  role?: string;
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
  register: (payload: SignupPayload) => Promise<ActionResult>;
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
     const user=JSON.parse(localStorage.getItem("user") || "null");
      set({
        user,
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
      const { data } = await axiosInstance.post<ActionResult>(
        payload.role ? "/auth/login_a" : "/auth/login",
        payload,
      );
      const { user } = data;
      console.log("data from api ", user);
      localStorage.setItem("user",JSON.stringify(user));
      set({
        user,
        loading: false,
        initialized: true,
      });

      return {
        success: true,
        user: data.user,
        role: data.role,
      };
    } catch (error: any) {
      console.log(error);
      set({ loading: false });

      return {
        success: false,
        msg: error?.response?.data?.msg || "Login failed",
      };
    }
  },
  register: async (payload) => {
    set({ loading: true });

    try {
      const { data } = await axiosInstance.post<ActionResult>(
        "/auth/register",
        payload,
      );
      const { user } = data;
      console.log("data from api ", data);

      set({
        user,
        loading: false,
        initialized: true,
      });

      return {
        success: true,
        user: data.user,
        role: data.role,
      };
    } catch (error: any) {
      console.log(error);
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
      window.location.href = "/auth/login";
    } catch {}

    set({
      user: null,
      loading: false,
      initialized: true,
    });
  },
}));

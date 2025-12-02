import { create } from "zustand";
import { axiosConstant } from "../lib/axios.js";
import toast from "react-hot-toast"
export const useAuthStore = create((set) => ({
  authUser: null,
  isChecking: true,
  isSigningUp: false,
  isLogin: false,
  checkAuth: async () => {
    try {
      const res = await axiosConstant.get("api/auth/check");
      console.log(res);
      set({ authUser: res.data });
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isChecking: false });
    }
  },
  signup: async (data) => {
    try {
      set({ isSigningUp: true });

      const res = await axiosConstant.post("api/auth/signup", data);

      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
     toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async(data)=>{
    try {
      set({isLogin: true})
      const res = await axiosConstant.post("api/auth/login", data);
      set({authUser: res.data})
      toast.success("Login Successfully")
    } catch (error) {
      toast.error(error.response.data.message)
    } finally{
      set({isLogin: false})
    }
  },
  logout: async()=> {
    try {
      set({ authUser: null });
      await axiosConstant.post("/api/auth/logout");
      toast.success("Logout Successfully");
    } catch (error) {
      toast.error("error in logging out");
      console.log("Logout error:", error);
    }
  }
}));

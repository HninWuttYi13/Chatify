import { create } from "zustand";
export const useAuthStore = create((set)=> ( {
    authUser: {name: "John", age :25},
    isLoggedIn: false,
    login: ()=> {
    set({isLoggedIn: true})
        
    }
}))
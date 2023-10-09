import { create } from "zustand";

interface User {
  isLoggedIn: boolean;
  user: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
  setUser: (user: any, isLoggedIn: boolean) => void;
}

const useAuthData = create<User>((set) => ({
  isLoggedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "",
  },
  setUser: (
    user: {
      id: string;
      name: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    },
    isLoggedIn: boolean
  ) =>
    set((state) => {
      if (user?.id) {
        return {
          isLoggedIn,
          user,
        };
      } else {
        return {
          isLoggedIn: false,
          user: {
            id: "",
            name: "",
            email: "",
            firstName: "",
            lastName: "",
            role: "",
          },
        };
      }
    }),
}));

export default useAuthData;

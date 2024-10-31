import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStoreProps {
  token: string;
  setAccount: (user: Models.User, token: string) => void;
  dismiss: () => void;
  currentAccount?: Models.User;
}

const useAuthStore = create<AuthStoreProps>()(
  persist(
    (set) => ({
      token: "",
      setAccount: (user, token) => {
        set({ currentAccount: user, token: token });
      },
      dismiss: () => {
        set({ currentAccount: undefined });
      },
    }),
    {
      name: "account",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;

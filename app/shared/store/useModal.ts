import { create } from "zustand";
import { ReactNode } from "react";

interface AppModalProps {
  content?: ReactNode;
  title: string;
}

interface ModalStoreProps {
  properties?: AppModalProps;
  isOpen: boolean;
  dismiss: () => void;
  openModal: (options: AppModalProps) => void;
}

const useModalStore = create<ModalStoreProps>()((set) => ({
  isOpen: false,
  openModal: (options: AppModalProps) => {
    set({
      properties: options,
      isOpen: true,
    });
  },
  dismiss: () => {
    set({
      properties: undefined,
      isOpen: false,
    });
  },
}));

export default useModalStore;

import { create } from "zustand";
import { ReactNode } from "react";

interface AppModalProps {
  size: "sm" | "lg" | "xl";
  fullscreen?:
    | true
    | string
    | "sm-down"
    | "md-down"
    | "lg-down"
    | "xl-down"
    | "xxl-down";
  content?: ReactNode;
  title: string;
}

const defaultProps: AppModalProps = {
  fullscreen: undefined,
  size: "lg",
  content: "no content",
  title: "no title",
};

interface ModalStoreProps {
  size: "sm" | "lg" | "xl";
  fullscreen?:
    | true
    | string
    | "sm-down"
    | "md-down"
    | "lg-down"
    | "xl-down"
    | "xxl-down";
  properties?: AppModalProps;
  isOpen: boolean;
  dismiss: () => void;
  openModal: (options: AppModalProps) => void;
}

const useModalStore = create<ModalStoreProps>()((set) => ({
  isOpen: false,
  size: "lg",
  fullScreen: false,
  openModal: (options: AppModalProps = defaultProps) => {
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

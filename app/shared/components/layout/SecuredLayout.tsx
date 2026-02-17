import useAuthStore from "@/shared/store/useAuthStore";
import AppBar from "./AppBar";
import { ReactNode } from "react";

import ModalProvider from "./ModalProvider";
import AuthVerify from "@/shared/auth/AuthVerify";
import OnLoadAnimator from "@/shared/components/layout/OnLoadAnimator";
import LoginForm from "@/shared/auth/LoginForm";
import { SWRConfig } from "swr";
import ErrorBoundary from "./ErrorBoundary";

interface SecuredLayoutProps {
  children: ReactNode;
}

/// Place your layout definitions here
const SecuredLayout: React.FC<SecuredLayoutProps> = ({ children }) => {
  const { currentAccount } = useAuthStore();

  if (!currentAccount) return <LoginForm />;

  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <div className="min-vh-100 d-flex flex-column w-100">
        <AppBar />
        <div className="main-content-container mt-3 mb-4 flex-grow-1 d-flex px-2 px-md-3">
          <ErrorBoundary>
            <OnLoadAnimator>
              <div className="page-shell w-100 h-100">{children}</div>
            </OnLoadAnimator>
          </ErrorBoundary>
        </div>
        <AuthVerify />
        <ModalProvider />
      </div>
    </SWRConfig>
  );
};

export default SecuredLayout;

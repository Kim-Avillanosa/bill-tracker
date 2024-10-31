import useAuthStore from "@/shared/store/useAuthStore";
import AppBar from "./AppBar";
import { ReactNode } from "react";

import { Container } from "react-bootstrap";
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
      <AppBar />
      <Container className="mt-3">
        <ErrorBoundary>
          <OnLoadAnimator>{children}</OnLoadAnimator>
        </ErrorBoundary>
      </Container>
      <AuthVerify />
      <ModalProvider />
    </SWRConfig>
  );
};

export default SecuredLayout;

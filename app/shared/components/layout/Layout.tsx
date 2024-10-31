import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import ErrorBoundary from "./ErrorBoundary";
import OnLoadAnimator from "./OnLoadAnimator";

interface LayoutProps {
    children: ReactNode;
}

/// Place your layout definitions here
const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <ErrorBoundary>
            <OnLoadAnimator>{children}</OnLoadAnimator>
        </ErrorBoundary>
    );
};

export default Layout;

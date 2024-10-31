import Head from "next/head";
import { Ubuntu } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface PageProps {
    title: string;
    children: ReactNode;
}
const ubuntu = Ubuntu({
    weight: "400",
    subsets: ["latin"],
});

/// Place your layout definitions here
const Page: React.FC<PageProps> = ({ children, title }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className={ubuntu.className}>{children}</div>
            <Toaster position="bottom-right" reverseOrder={false} />
        </>
    );
};
export default Page;

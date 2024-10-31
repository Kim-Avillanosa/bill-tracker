import dynamic from "next/dynamic";

const register = dynamic(() => import("@/modules/register"), { ssr: false });

export default register;

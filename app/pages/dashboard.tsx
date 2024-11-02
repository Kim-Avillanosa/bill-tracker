import dynamic from "next/dynamic";

const dashboard = dynamic(() => import("@/modules/dashboard/dashboard"), {
  ssr: false,
});

export default dashboard;

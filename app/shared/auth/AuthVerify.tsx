import { useRouter } from "next/router";
import React, { useEffect } from "react";

const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
};


const AuthVerify: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("account") || "{}");

        if (user) {
            const decodedJwt = parseJwt(user.state.token);

            if (decodedJwt && decodedJwt.exp * 1000 < Date.now()) {
                localStorage.removeItem("account");
                router.push("/");
            }
        }
    });

    return <div></div>;
};

export default AuthVerify;

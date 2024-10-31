import { motion } from "framer-motion";
import React, { ReactNode } from "react";

interface OnLoadAnimatorProps {
    children: ReactNode;
}

const OnLoadAnimator: React.FC<OnLoadAnimatorProps> = ({ children }) => {
    return (
        <motion.div
            className="content-spacer"
            initial={{ y: 2, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
        >
            {children}
        </motion.div>
    );
};

export default OnLoadAnimator;
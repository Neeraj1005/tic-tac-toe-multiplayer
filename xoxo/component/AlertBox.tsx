import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export type AlertTypeMessage = {
  message?: string | null;
};

function AlertBox({ message }: AlertTypeMessage) {
  return (
    <AnimatePresence>
      <motion.div
        key={"parent-box"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="winner"
      >
        <motion.div
          key={"child-box"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="text"
        >
          <motion.h2
            initial={{ scale: 0, y: 100 }}
            animate={{
              scale: 1,
              y: 0,
              transition: {
                y: { delay: 0.7 },
                duration: 0.7,
              },
            }}
          >
            {message ? message : "OOPS! Not Your Turn"}
          </motion.h2>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AlertBox;

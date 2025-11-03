"use client";
 
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Spinner } from "./Spinner";
import { Button } from "./ui/button";
import { Check, Trash2 } from "lucide-react";

 
const buttonCopy = {
  idle: (
    <div className="flex items-center gap-2 ">
    <Trash2 size={16} />
    Delete
  </div>
  ),
  loading: <Spinner size={16} color="black" />,
  success: (
    <div className="flex items-center gap-2">
      <Check size={16} />
      Deleted
    </div>
  ),
};
interface SmoothButtonProps {
    onClick?: () => void;
  }
 
export default function SmoothButton2({ onClick }: SmoothButtonProps) {
    const [buttonState, setButtonState] = useState<"idle" | "loading" | "success">("idle");
    const handleClick = () => {
        if (buttonState === "success") return;
        
        setButtonState("loading");
        
        onClick?.(); // Call the passed onClick handler
        
        setTimeout(() => {
          setButtonState("success");
        }, 1750);
        
        setTimeout(() => {
          setButtonState("idle");
        }, 3500);
      };
  return (
    // <div className="outer-wrapper">
      <Button
       className="bg-red-600"
        size={'lg'}
        disabled={buttonState === "loading"}
       onClick={handleClick}
      >
         <div style={{ width: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            key={buttonState}
          >
            {buttonCopy[buttonState]}
          </motion.span>
        </AnimatePresence>
        </div>
      </Button>
    // </div>
  );
}
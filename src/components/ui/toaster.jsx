import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cn } from "../../lib/utils";

export const Toaster = () => (
  <ToastPrimitive.Provider>
    <ToastPrimitive.Viewport
      className={cn(
        "fixed bottom-0 right-0 flex flex-col p-4 gap-2 w-[350px] max-w-full z-50 outline-none"
      )}
    />
  </ToastPrimitive.Provider>
);

export const toast = (options) => {
  const event = new CustomEvent("radix-toast", { detail: options });
  window.dispatchEvent(event);
};

import { useCallback } from "react";
import { toast as radixToast } from "../components/ui/toaster";

export const useToast = () => {
  const toast = useCallback(
    ({ title, description, variant }) => {
      // Call the actual toast function from the toaster
      radixToast({ title, description, variant });
    },
    []
  );

  return { toast };
};

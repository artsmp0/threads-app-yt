import { UseToastOptions, useToast } from "@chakra-ui/react";
import { useCallback } from "react";

const useShowToast = () => {
  const toast = useToast();
  const showToast = useCallback(
    (options: UseToastOptions) => {
      toast({
        duration: 3000,
        isClosable: true,
        ...options,
      });
    },
    [toast]
  );
  return showToast;
};

export default useShowToast;

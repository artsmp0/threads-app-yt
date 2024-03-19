import { UseToastOptions, useToast } from "@chakra-ui/react";

const useShowToast = () => {
  const toast = useToast();
  const showToast = (options: UseToastOptions) => {
    toast({
      duration: 3000,
      isClosable: true,
      ...options,
    });
  };
  return showToast;
};

export default useShowToast;

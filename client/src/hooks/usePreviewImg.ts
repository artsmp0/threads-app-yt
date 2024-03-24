import { ChangeEvent, useRef, useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const showToast = useShowToast();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      showToast({ description: "Please select an image file", title: "Invalid file type", status: "error" });
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      setImgUrl(reader.result as string);
    });
    reader.readAsDataURL(file);
  };

  return {
    fileRef,
    imgUrl,
    handleImageChange,
  };
};

export default usePreviewImg;

import { useState } from "react";
import useShowToast from "./useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { User } from "../types";

export const useFollow = (user: User) => {
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(user?.followers.includes(currentUser?._id ?? ""));
  const [updating, setUpdating] = useState(false);
  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast({ description: "Please login to follow", status: "error" });
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast({ description: data.error, status: "error" });
        return;
      }
      if (following) {
        showToast({ description: `Unfollowed ${user?.name} successfully`, status: "success" });
        user?.followers.pop();
      } else {
        showToast({ description: `Followed ${user?.name} successfully`, status: "success" });
        user?.followers.push(currentUser._id);
      }
      setFollowing(!following);
    } catch (error: any) {
      showToast({ description: error, status: "error" });
    } finally {
      setUpdating(false);
    }
  };

  return { updating, following, handleFollowUnfollow };
};

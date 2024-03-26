import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../types";
import useShowToast from "./useShowToast";

export const useGetUserProfile = () => {
  const [user, setUser] = useState<User>();
  const { username } = useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast({ description: data.error, status: "error" });
        }
        setUser(data);
      } catch (error: any) {
        showToast({ description: error, status: "error" });
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  return {
    user,
    loading,
  };
};

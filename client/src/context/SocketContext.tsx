import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io, { Socket } from "socket.io-client";
import userAtom from "../atoms/userAtom";

export type SocketContextType = {
  socket: Socket | null;
  onlineUsers: string[];
};

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  return useContext(SocketContext) as SocketContextType;
};

export const SocketContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    console.log("user?._id: ", user?._id);
    // 为什么退出登录的时候 onlineUsers 的状态也变了是因为 退出登录 user._id 变了
    // 这个 effect 重新运行导致重新创建了一个 socket，原先的 socket 被关闭了
    const socket = io("http://localhost:3333", {
      query: {
        userId: user?._id,
      },
    });
    setSocket(socket);
    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket && socket.close();
    };
  }, [user?._id]);

  return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};

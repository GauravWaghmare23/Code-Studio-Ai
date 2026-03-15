import { io } from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectId) => {
  socketInstance = io(import.meta.env.VITE_API_URL || "http://localhost:4000", {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectId,
    },
  });

  return socketInstance;
};

export const sendMessage = (eventName, data) => {
    socketInstance.emit(eventName, data);
};

export const recieveMessage = (eventName, callBack) => {
    socketInstance.on(eventName, callBack);
}
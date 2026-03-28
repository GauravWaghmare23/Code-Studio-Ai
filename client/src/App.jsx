import React, { useContext, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { UserContext, UserProvider } from "./context/UserContext";
import axiosInstance from "./config/axios";

function App() {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (user !== undefined) return;

    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/users/profile");
        setUser(res.data.data);
      } catch {
        setUser(null);
      }
    };

    checkAuth();
  }, [setUser, user]);

  if (user === undefined) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Initializing Faber...
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;

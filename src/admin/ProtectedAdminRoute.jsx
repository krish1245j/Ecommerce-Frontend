import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

// Gate for everything under /admin. Confirms the current access token
// belongs to an admin before rendering any admin UI, so a normal user
// (or a logged-out visitor) can never reach admin routes/screens, even
// briefly.
const ProtectedAdminRoute = ({ children }) => {
  const [status, setStatus] = useState("checking"); // checking | ok | unauth | forbidden

  useEffect(() => {
    let mounted = true;

    axiosInstance
      .get("/auth/getMe")
      .then((res) => {
        if (!mounted) return;
        setStatus(res.data.user?.role === "admin" ? "ok" : "forbidden");
      })
      .catch(() => {
        if (mounted) setStatus("unauth");
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f7f7f7]">
        <Loader2 className="animate-spin text-neutral-400" size={26} />
      </div>
    );
  }

  if (status === "unauth") {
    return <Navigate to="/login" replace />;
  }

  if (status === "forbidden") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;

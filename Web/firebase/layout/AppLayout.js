import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";

export default function AppLayout({ children }) {
  const auth = getAuth();
  const router = useRouter();
  if (router.pathname !== "/login") {
    return (
      <div>
        <span>{auth.user?.displayName}</span>
        {children}
      </div>
    );
  } else {
    return children;
  }
}

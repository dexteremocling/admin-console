import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import UserPool from "@/lib/cognito";
import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";

function MyApp({ Component, pageProps }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const hiddenSidebarPaths = ["/", "/register", "/confirm", "/resend"];

  useEffect(() => {
    const user: CognitoUser | null = UserPool.getCurrentUser();
    if (user) {
      user.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (!err && session && session.isValid()) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    const user = UserPool.getCurrentUser();
    if (user) {
      user.signOut();
    }
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div style={{ display: "flex" }}>
      {isLoggedIn && !hiddenSidebarPaths.includes(router.pathname) && <Sidebar onLogout={handleLogout} />}
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
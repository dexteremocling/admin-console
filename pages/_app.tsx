import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import "@/styles/Home.module.css";
import UserPool from "@/lib/cognito";
import { CognitoUser, CognitoUserSession, CognitoUserAttribute } from "amazon-cognito-identity-js";

function MyApp({ Component, pageProps }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("User"); // Default to "User"
  const router = useRouter();

  useEffect(() => {
    const user: CognitoUser | null = UserPool.getCurrentUser();
    if (user) {
      user.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (!err && session && session.isValid()) {
          setIsLoggedIn(true);
          
          // Fetch the user's attributes to get the full name
          user.getUserAttributes((attrErr, attributes) => {
            if (!attrErr && attributes) {
              const fullName = attributes.find((attr: CognitoUserAttribute) => attr.getName() === "name")?.getValue() || "User";
              setUserName(fullName);
            }
          });
        } else {
          setIsLoggedIn(false);
        }
      });
    } else {
      setIsLoggedIn(false);
    }
  }, [router.pathname]); // Ensures username updates when the route changes

  const handleLogout = () => {
    const user = UserPool.getCurrentUser();
    if (user) {
      user.signOut();
    }
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div className="container">
      {isLoggedIn && !["/", "/register", "/confirm", "/resend"].includes(router.pathname) && (
        <Sidebar onLogout={handleLogout} userName={userName} />
      )}
      <Component {...pageProps} userName={userName} />
    </div>
  );
}

export default MyApp;

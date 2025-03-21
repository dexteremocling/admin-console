import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import UserPool from "@/lib/cognito";
import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user: CognitoUser | null = UserPool.getCurrentUser();
    if (user) {
      user.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (!err && session && session.isValid()) {
          setIsLoggedIn(true);
        } else {
          router.push("/");
        }
      });
    } else {
      router.push("/");
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

  return isLoggedIn ? (
    <div>
      <Sidebar onLogout={handleLogout} />
      <div style={{ marginLeft: "260px", padding: "20px" }}>
        <h2>Welcome to EVCare Administration Console</h2>
      </div>
    </div>
  ) : null;
}

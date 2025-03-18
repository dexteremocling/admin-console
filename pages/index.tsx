import { useState } from "react";
import styles from "@/styles/Auth.module.css";
import UserPool from "@/lib/cognito";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log("Login successful", result);
        setIsLoggedIn(true);
      },
      onFailure: (err) => {
        setMessage(err.message || "Login failed");
      },
    });
  };

  return (
    <div className={styles.container}>
      {!isLoggedIn ? (
        <div className={styles.authContainer}>
          <h1 className={styles.adminTitle}>Administration Console</h1>
          <div className={styles.formWrapper}>
            <h2 className={styles.title}>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email Address"
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className={styles.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className={styles.button}>
                Login
              </button>
            </form>
            <p style={{ color: "red" }}>{message}</p>
            <p>
              Don't have an account? <a href="/register">Sign Up</a>
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h2>Welcome to EVCare Admin Panel</h2>
        </div>
      )}
    </div>
  );
};

export default Home;

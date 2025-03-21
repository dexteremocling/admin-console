import { useState } from "react";
import styles from "@/styles/Auth.module.css";
import UserPool from "@/lib/cognito";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { useRouter } from "next/router";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

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
      onSuccess: () => {
        router.push("/home"); // Redirect to Home page
      },
      onFailure: (err) => {
        setMessage(err.message || "Login failed");
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.authContainer}>
        <img src="/images/evcare_logo.png" alt="EVCare Logo" className={styles.logo} />

        <div className={styles.formWrapper}>
          <h2 className={styles.title} style={{ textAlign: "center", width: "100%" }}>
            Login
          </h2>

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

          <p style={{ textAlign: "center", width: "100%", margin: "8px 0" }}>
            Don't have an account? <a href="/register" style={{ fontWeight: "bold" }}>Sign Up</a>
          </p>

          <img src="/images/volterras_logo.png" alt="Volterras Logo" className={styles.logo} />
        </div>
      </div>
    </div>
  );
};

export default Home;
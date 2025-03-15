import { useState } from "react";
// import styles from "../styles/Auth.module.css"; // Importing CSS Module
import styles from "@/styles/Auth.module.css";


export default function Home() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isRegistering ? "Registering User" : "Logging in", { fullName, email, password });
  };

  return (
    <div className={styles.container}>
      {/* Administration Console Title */}
      <h1 className={styles.adminTitle}>Administration Console</h1>

      <div className={styles.formWrapper}>
        {/* Login / Sign-up Title */}
        <h2 className={styles.title}>{isRegistering ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <input
              type="text"
              placeholder="Full Name"
              className={styles.inputField}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
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
            {isRegistering ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className={styles.toggleLink} onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useRouter } from "next/router";
import UserPool from "@/lib/cognito";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import styles from "@/styles/Auth.module.css";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = () => {
    if (!fullName || !email || !password) {
      setMessage("Please fill out all the fields.");
      return;
    }
    const attributeList = [
      new CognitoUserAttribute({ Name: "name", Value: fullName }),
      new CognitoUserAttribute({ Name: "email", Value: email }),
    ];

    UserPool.signUp(email, password, attributeList, [], (err) => {
      if (err) {
        setMessage(err.message || "Error registering user");
      } else {
        setMessage("Sign-up successful! Please check your email to confirm.");
        setTimeout(() => router.push("/confirm"), 2000); // Redirect to confirmation page
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.authContainer}>
        <img src="/images/evcare_logo.png" alt="EVCare Logo" className={styles.logo} />
        
        <div className={styles.formWrapper}>
          <h2 className={styles.title} style={{ textAlign: "center", width: "100%" }}>
            Sign Up
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            className={styles.inputField}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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
          <button onClick={handleRegister} className={styles.button}>
            Register
          </button>
          <p style={{ color: "red" }}>{message}</p>

          <p style={{ textAlign: "center", width: "100%", margin: "8px 0" }}>
            Already have an account? <a href="/" style={{ fontWeight: "bold" }}>Login here</a>
          </p>

          <img src="/images/volterras_logo.png" alt="Volterras Logo" className={styles.logo} />
        </div>
      </div>
    </div>
  );
}

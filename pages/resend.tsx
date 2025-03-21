import { useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "@/lib/cognito";
import styles from "@/styles/Auth.module.css";

export default function ResendConfirmation() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResend = () => {
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    user.resendConfirmationCode((err, result) => {
      if (err) {
        setMessage(err.message || "Error resending confirmation code");
      } else {
        setMessage("Confirmation code sent! Check your email.");
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.authContainer}>
        <h2 className={styles.title}>Resend Confirmation Code</h2>
        <input
          type="email"
          placeholder="Email Address"
          className={styles.inputField}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleResend} className={styles.button}>
          Resend Code
        </button>
        <p style={{ color: "red" }}>{message}</p>
      </div>
    </div>
  );
}

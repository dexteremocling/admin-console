import { useState } from "react";
import { useRouter } from "next/router";
import UserPool from "@/lib/cognito";
import { CognitoUser } from "amazon-cognito-identity-js";
import styles from "@/styles/Auth.module.css";

export default function ConfirmAccount() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleConfirm = () => {
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    user.confirmRegistration(code, true, (err, result) => {
      if (err) {
        setMessage(err.message || "Error confirming account");
      } else {
        setMessage("Account confirmed! You can now log in.");
        setTimeout(() => router.push("/"), 2000);
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.authContainer}>
        <h2 className={styles.title}>Confirm Your Account</h2>

        <input
          type="email"
          placeholder="Email Address"
          className={styles.inputField}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Confirmation Code"
          className={styles.inputField}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={handleConfirm} className={styles.button}>
          Confirm Account
        </button>
        <p style={{ color: "red" }}>{message}</p>

        <p className={styles.toggleLink}>
          Didn't get a code? <a href="/resend">Resend Code</a>
        </p>
      </div>
    </div>
  );
}

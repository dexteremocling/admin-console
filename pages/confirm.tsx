import { useState } from "react";
import { useRouter } from "next/router";
import UserPool from "@/lib/cognito";
import { CognitoUser } from "amazon-cognito-identity-js";

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
        setTimeout(() => router.push("/"), 2000); // Redirect to login page
      }
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Confirm Your Account</h1>
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Confirmation Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <br />
      <button onClick={handleConfirm}>Confirm Account</button>
      <p style={{ color: "red" }}>{message}</p>
      <p>
        Didn't get a code? <a href="/resend">Resend Code</a>
      </p>
    </div>
  );
}

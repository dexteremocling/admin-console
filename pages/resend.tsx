import { useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "@/lib/cognito";

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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Resend Confirmation Code</h1>
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <button onClick={handleResend}>Resend Code</button>
      <p style={{ color: "red" }}>{message}</p>
    </div>
  );
}

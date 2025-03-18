import { useState } from "react";
import { useRouter } from "next/router";
import UserPool from "@/lib/cognito";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = () => {
    const attributeList = [
      new CognitoUserAttribute({ Name: "name", Value: fullName }),
      new CognitoUserAttribute({ Name: "email", Value: email }),
    ];

    UserPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
        setMessage(err.message || "Error registering user");
      } else {
        setMessage("Sign-up successful! Please check your email to confirm.");
        setTimeout(() => router.push("/"), 2000); // Redirect to login page
      }
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Sign Up</h1>
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <br />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleRegister}>Register</button>
      <p style={{ color: "red" }}>{message}</p>
      <p>
        Already have an account? <a href="/">Login here</a>
      </p>
    </div>
  );
}

import React from "react";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}></h2>
      <LoginForm />
    </div>
  );
}

export default LoginPage;

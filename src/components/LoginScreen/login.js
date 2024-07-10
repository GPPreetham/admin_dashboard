// src/components/LoginScreen/login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import CompanyImage from "../../images/comviva_logo.png";
import appEndpoint from "../../appEndpoint.js";

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = { identifier, password };

    try {
      const response = await appEndpoint.post("auth/login", loginData);
      if (response.status === 200) {
        setMessage("Login successful!");
        setMessageType("success");
        console.log(">>>>>>>>>>>>", response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("email", response.data.email);
        await updateLastLogin(response.data.username);
        navigate("/dashboard"); // Navigate to the dashboard or another page
      } else {
        setMessage("Failed to login.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to login.");
      setMessageType("error");
    }
  };

  const updateLastLogin = async (username) => {
    const lastLogin = new Date();
    try {
      const response = await appEndpoint.put(`users/${username}`, {
        lastlogin: lastLogin,
      });
      console.log("Last login updated:", response.data);
    } catch (error) {
      console.error("Failed to update last login:", error);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <img
        src={CompanyImage}
        alt="Company Logo"
        className="company-logo"
        onClick={handleLogoClick}
      />
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="username" className="login-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={identifier}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="password" className="login-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      {message && <p className={`login-message ${messageType}`}>{message}</p>}
      <p className="register-link">
        Don't have an account?{" "}
        <span className="register-text" onClick={handleRegisterClick}>
          Register
        </span>
      </p>
    </div>
  );
};

export default Login;

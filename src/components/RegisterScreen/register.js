import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";
import CompanyImage from "../../images/comviva_logo.png";
import appEndpoint from "../../appEndpoint.js";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const registerData = { username, email, password };

    try {
      const response = await appEndpoint.post("auth/register", registerData);
      if (response.data.statusCode === 200) {
        setMessage("Registration successful!");
        setMessageType("success");
        navigate("/login"); // Navigate to the login page
      } else if (response.data.statusCode === 201) {
        setMessage("Email already exists.");
        setMessageType("error");
      } else if (response.data.statusCode === 202) {
        setMessage("Username already exists.");
        setMessageType("error");
      } else {
        setMessage("Failed to register.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to register.");
      setMessageType("error");
    }
  };

  return (
    <div className="register-container">
      <img
        src={CompanyImage}
        alt="Company Logo"
        className="company-logo"
        onClick={handleLogoClick}
      />
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="username" className="register-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="email" className="register-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="password" className="register-label">
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
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      {message && (
        <p className={`register-message ${messageType}`}>{message}</p>
      )}
      <p className="login-link">
        Already have an account?{" "}
        <span className="register-text" onClick={handleLoginClick}>
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;

import React, { useState, useEffect, useRef } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./LoginModal.css";
import { signin } from "../../utils/Api.jsx";

const LoginModal = ({ isOpen, onClose, onLoginSuccess, onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const emailRef = useRef(null);

  useEffect(() => {
    if (isOpen && emailRef.current) {
      emailRef.current.focus();
    }
  }, [isOpen]);

  const isButtonDisabled = !email || !password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Both fields are required.");
      return;
    }
    try {
      const data = await signin({ email, password }); 
      if (!data?.token) throw new Error("Invalid response from server.");

      localStorage.setItem("token", data.token);
      setErrorMessage("");
      
      if (onLoginSuccess) onLoginSuccess(data.email);
      onClose();
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <ModalWithForm
      title="Log In"
      buttonText="Log In"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonDisabled={isButtonDisabled}
    >
      {errorMessage && <div className="modal__error-text">{errorMessage}</div>}

      <label className="modal__label">
        Email
        <input
          type="email"
          name="email"
          className={`modal__input${errorMessage ? " modal__input_error" : ""}`}
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          ref={emailRef}
        />
      </label>

      <label className="modal__label">
        Password
        <input
          type="password"
          name="password"
          className={`modal__input${errorMessage ? " modal__input_error" : ""}`}
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <div className="modal__footer-row">
        <button
          type="submit"
          className="modal__button"
          disabled={isButtonDisabled}
          style={{ background: isButtonDisabled ? "#D3D3D3" : "#000", color: "#fff" }}
        >
          Log In
        </button>
        <button
          type="button"
          className="modal__switch-link"
          onClick={onSwitch}
        >
          or Sign Up
        </button>
      </div>
    </ModalWithForm>
  );
};

export default LoginModal;

import React, { useState, useEffect, useRef } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./LoginModal.css";
import { signin } from "../../utils/Api.js";

const LoginModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
  setIsLoginModalOpen,
  setIsSignUpModalOpen,
}) => {
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

  const handleSwitch = () => {
    setIsLoginModalOpen(false);
    setIsSignUpModalOpen(true);
  };

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
      setErrorMessage(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
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

      <div className="modal__fields">
        <label className="modal__label">
          Email*
          <input
            type="email"
            name="email"
            className="modal__input"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ref={emailRef}
          />
        </label>

        <label className="modal__label">
          Password*
          <input
            type="password"
            name="password"
            className="modal__input"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>

      <div className="modal__switch-container">
        <button
          type="button"
          className="modal__switch-link"
          onClick={handleSwitch}
        >
          or <span>Sign up</span>
        </button>
      </div>
    </ModalWithForm>
  );
};

export default LoginModal;

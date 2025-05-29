import React, { useState, useEffect, useRef } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./LoginModal.css";

const LoginModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
  handleSignIn, 
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
    const userData = await handleSignIn(email, password); 
    onLoginSuccess(userData); 
  } catch (error) {
    setErrorMessage("Login failed. Please check your credentials.");
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

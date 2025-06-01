import React, { useState, useEffect, useRef } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useNavigate } from 'react-router-dom';

import "./LoginModal.css";

const LoginModal = ({
  isOpen,
  onClose,
  handleSignIn,
  setIsSignUpModalOpen,
   setCurrentUser,
  setIsLoggedIn,
}) => {
  console.log("LoginModal props:", {
    handleSignIn,
    handleSignInType: typeof handleSignIn,
  });


  if (!handleSignIn || typeof handleSignIn !== "function") {
    console.error("Error: handleSignIn is not a valid function!", handleSignIn);
  }

   const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const emailRef = useRef(null);

  useEffect(() => {
    if (isOpen && emailRef.current) {
      emailRef.current.focus();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isButtonDisabled = () => {
    return !formData.email || !formData.password;
  };

  const handleSwitch = () => {
    onClose(); 
    setIsSignUpModalOpen("signup"); 
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Attempting to call handleSignIn with:", formData);
      const userData = await handleSignIn(formData);
      console.log("About to call onLoginSuccess with:", userData);

      if (userData) {
        setCurrentUser(userData);
        setIsLoggedIn(true);
        onClose();
        navigate("/profile"); 
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(error.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <ModalWithForm
      title="Log In"
      buttonText="Log In"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonDisabled={isButtonDisabled()}
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
            value={formData.email}
            onChange={handleInputChange}
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
            value={formData.password}
            onChange={handleInputChange}
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



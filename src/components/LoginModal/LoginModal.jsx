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
  console.log("LoginModal props:", { 
    handleSignIn, 
    handleSignInType: typeof handleSignIn 
  }); 

  if (!handleSignIn || typeof handleSignIn !== "function") {
    console.error("Error: handleSignIn is not a valid function!", handleSignIn);
  }

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

  const isButtonDisabled = (dataToCheck = {}) => {
    return !dataToCheck.email || !dataToCheck.password;
  };
const handleSwitch = () => {
  setIsLoginModalOpen(""); // Corrected to reset modal state properly
  setIsSignUpModalOpen("signup"); // Opens the signup modal
};

  const handleSubmit = async (formData) => {
    console.log("LoginModal received formData:", formData);

    if (!formData || isButtonDisabled(formData)) { 
      setErrorMessage("Both fields are required.");
      return;
    }

    try {
      console.log("Attempting to call handleSignIn with:", formData);
      const userData = await handleSignIn(formData.email, formData.password);
      onLoginSuccess(userData);
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
      buttonDisabled={isButtonDisabled(formData)} // Ensure button disables correctly
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
        <button type="button" className="modal__switch-link" onClick={handleSwitch}>
          or <span>Sign up</span>
        </button>
      </div>
    </ModalWithForm>
  );
};

export default LoginModal;

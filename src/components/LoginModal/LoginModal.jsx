import { useState, useEffect, useRef } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useNavigate } from "react-router-dom";

import "./LoginModal.css";

const LoginModal = ({
  isOpen,
  onClose,
  handleSignIn,
  setCurrentUser,
  setIsLoggedIn,
  setIsSignUpModalOpen,
  setIsLoginModalOpen,
}) => {
  console.log("LoginModal props:", { handleSignIn });

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

  const isButtonDisabled = () => !formData.email || !formData.password;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Attempting to call handleSignIn with:", formData);
      const userData = await handleSignIn(formData);
      console.log("About to update current user:", userData);

      if (userData) {
        setCurrentUser(userData);
        setIsLoggedIn(true);
        onClose();
        navigate("/profile");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(
        error.message || "Login failed. Please check your credentials."
      );
    }
  };

  const handleSwitch = () => {
    setIsLoginModalOpen(false);
    setIsSignUpModalOpen(true);
  };

  return (
    <ModalWithForm
      title="Log In"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit} 
      onSwitch={handleSwitch}
      switchText="Sign Up"
      buttonText="Log In"
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
    </ModalWithForm>
  );
};

export default LoginModal;

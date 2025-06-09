import React, { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./SignUpModal.css";

const SignUpModal = ({
  isOpen,
  onClose,
  onSubmit,
  setIsSignUpModalOpen,
  setIsLoginModalOpen,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    avatar: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isButtonDisabled = () => {
    return (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.avatar
    );
  };

  const handleSwitch = () => {
    setIsSignUpModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isButtonDisabled()) {
      setError("All fields are required.");
      return;
    }

    if (!onSubmit || typeof onSubmit !== "function") {
      console.error("onSubmit is not a function in SignUpModal!");
      return;
    }

    onSubmit(formData);
  };

  return (
    <ModalWithForm
      title="Sign Up"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onSwitch={handleSwitch}
      switchText="Log In"
      buttonText="Sign Up"
      buttonDisabled={isButtonDisabled()}
    >
      {error && <p className="modal__error">{error}</p>}

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

        <label className="modal__label">
          Name*
          <input
            type="text"
            name="name"
            className="modal__input"
            placeholder="Name"
            required
            value={formData.name}
            onChange={handleInputChange}
          />
        </label>

        <label className="modal__label">
          Avatar URL*
          <input
            type="url"
            name="avatar"
            className="modal__input"
            placeholder="Avatar URL"
            required
            value={formData.avatar}
            onChange={handleInputChange}
          />
        </label>
      </div>
    </ModalWithForm>
  );
};

export default SignUpModal;

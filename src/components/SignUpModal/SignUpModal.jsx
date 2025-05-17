import React, { useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./SignUpModal.css";

const SignUpModal = ({
  isOpen,
  onClose,
  onSubmit,
  setIsSignUpModalOpen,
  setIsLoginModalOpen,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [styleState, setStyleState] = useState(false);

  const changeModal = () => {
    setIsSignUpModalOpen(false);
    setIsLoginModalOpen(true);
  };

  useEffect(() => {
    setStyleState(email && password && avatar && name);
  }, [email, password, avatar, name]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password || !name || !avatar) {
      setError("All fields are required.");
      return;
    }

    onSubmit({ email, password, avatar, name });
  };

  return (
    <ModalWithForm
      title="Sign Up"
      buttonText="Sign Up"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      styleState={styleState}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <label className="modal__label">
          Name*
          <input
            type="text"
            name="name"
            className="modal__input"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        </label>
      </div>

      <div className="modal__footer-row">
        <button
          type="submit"
          className="modal__button"
          disabled={!styleState}
          style={{ background: styleState ? "#000" : "#D3D3D3", color: "#fff" }}
        >
          Sign Up
        </button>
        <button
          type="button"
          className="modal__switch-link"
          onClick={changeModal}
        >
          or <strong>Log In</strong>
        </button>
      </div>
    </ModalWithForm>
  );
};

export default SignUpModal;

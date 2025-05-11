import React, { useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

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
    setStyleState(!!(email && password && avatar && name));
  }, [email, password, avatar, name]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password || !name || !avatar) {
      setError("All fields are required.");
      return;
    }

    onSubmit({ email, password, avatar, name });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setError("Please select an image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
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
        Avatar*
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          required
        />
      </label>

      <p className="signup-link">
        <a href="#" onClick={changeModal}>
          or Log In
        </a>
      </p>
    </ModalWithForm>
  );
};

export default SignUpModal;

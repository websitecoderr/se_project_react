import React, { useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./style.css";

const ChangeProfileModal = ({
  isOpen,
  onClose,
  onSubmit,
  avatar,
  setAvatar,
  name,
  setName,
}) => {
  const [styleState, setStyleState] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setStyleState(avatar?.trim() !== "" && name?.trim() !== "");
  }, [avatar, name]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedAvatar = avatar?.trim();
    const trimmedName = name?.trim();

    if (!trimmedAvatar || !trimmedName) {
      setError("Both fields are required.");
      return;
    }

    setError("");
    onSubmit({ avatar: trimmedAvatar, name: trimmedName });
  };

  return (
    <ModalWithForm
      title="Change Profile Data"
      buttonText="Save Changes"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      styleState={styleState}
    >
      {error && <p className="modal__error">{error}</p>}

      <label className="modal__label">
        Name*
        <input
          type="text"
          name="name"
          className="modal__input"
          placeholder="Name"
          required
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="modal__label">
        Avatar URL*
        <input
          type="text"
          name="avatar"
          className="modal__input"
          placeholder="Enter image URL"
          value={avatar || ""}
          onChange={(e) => setAvatar(e.target.value)}
        />
      </label>

      {avatar && (
        <div className="avatar-preview">
          <img src={avatar} alt="Profile Preview" className="avatar-image" />
        </div>
      )}
    </ModalWithForm>
  );
};

export default ChangeProfileModal;

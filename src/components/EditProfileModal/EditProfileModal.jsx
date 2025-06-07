import React, { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./EditProfileModal.css";

const EditProfileModal = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [name, setName] = useState(currentUser?.name || "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setAvatar(currentUser.avatar || "");
    }
  }, [currentUser]);

  useEffect(() => {
    setIsFormValid(name.trim() !== "" && avatar.trim() !== "");
  }, [name, avatar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) return;

    try {
      await onSubmit({ name: name.trim(), avatar: avatar.trim() });
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <ModalWithForm
      title="Edit Profile"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText="Save"
      buttonDisabled={!isFormValid}
    >
      {error && <p className="modal__error">{error}</p>}

      <label className="modal__label">
        Name*
        <input
          type="text"
          className="modal__input"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="modal__label">
        Avatar URL*
        <input
          type="url"
          className="modal__input"
          placeholder="Enter image URL"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
      </label>

      {avatar && (
        <div className="avatar-preview">
          <img
            src={avatar}
            alt="Profile Preview"
            className="avatar-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/assets/avatar-placeholder.png";
            }}
          />
        </div>
      )}
    </ModalWithForm>
  );
};

export default EditProfileModal;

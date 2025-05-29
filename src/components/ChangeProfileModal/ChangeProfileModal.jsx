import React, { useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./style.css";

const ChangeProfileModal = ({
  isOpen,
  onClose,
  onSubmit,
  avatar = "",
  setAvatar,
  name = "",
  setName,
}) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsFormValid(name.trim() !== "" && avatar.trim() !== "");
  }, [avatar, name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedAvatar = avatar.trim();

    if (!trimmedName) {
      setError("Name is required");
      return;
    }

    if (!trimmedAvatar) {
      setError("Avatar URL is required");
      return;
    }

    try {
      await onSubmit({ name: trimmedName, avatar: trimmedAvatar });
      setError("");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <ModalWithForm
      title="Change Profile Data"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText="Save Changes" 
      buttonDisabled={!isFormValid} 
    >
      {error && <p className="modal__error">{error}</p>}

      <label className="modal__label">
        Name*
        <input
          type="text"
          name="name"
          className="modal__input"
          placeholder="Enter your name"
          required
          value={name}
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
          required
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

export default ChangeProfileModal;

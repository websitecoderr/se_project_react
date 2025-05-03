import { useState, useEffect, useCallback } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./EditProfileModal.css";

const EditProfileModal = ({ isOpen, onClose, onUpdateUser, currentUser }) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setAvatar(currentUser.avatar || "");
    }
  }, [currentUser]);

  const handleNameChange = useCallback((e) => setName(e.target.value), []);
  const handleAvatarChange = useCallback((e) => setAvatar(e.target.value), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!name.trim()) {
      setErrorMessage("Name cannot be empty");
      return;
    }
    onUpdateUser({ name, avatar });
  };

  return (
    <ModalWithForm
      title="Edit Profile"
      buttonText="Save Changes"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="modal__label">
        Name*
        <input
          type="text"
          className="modal__input"
          placeholder="Enter Name"
          required
          value={name}
          onChange={handleNameChange}
        />
        {errorMessage && <span className="modal__error">{errorMessage}</span>}
      </label>
      <label className="modal__label">
        Avatar URL
        <input
          type="url"
          className="modal__input"
          placeholder="Enter Avatar URL"
          value={avatar}
          onChange={handleAvatarChange}
        />
      </label>
    </ModalWithForm>
  );
};

export default EditProfileModal;

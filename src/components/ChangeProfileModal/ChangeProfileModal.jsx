import React, { useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./style.css"
const ChangeProfileModal = ({ isOpen, onClose, onSubmit, imgurl, avatar, setAvatar, name, setName }) => {
  const [img, setImg] = useState(imgurl)
  const [styleState, setStyleState] = useState(false);
  const [error] = useState("");

  useEffect(() => {
    if (avatar !== "" && name !== "") {
      setStyleState(true)
    } else {
      setStyleState(false)
    }
  }, [avatar, name])
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ avatar, name });
  };

  const someConditionFails = true; 
if (someConditionFails) {
  console.log("Condition failed.");
}



  return (
    <ModalWithForm
      title="Change profile data"
      buttonText="Save changes"
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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      {
        img != "" ? <label className="modal__label">
          Avatar URL*
          <input
            type="text"
            name="name"
            className="modal__input"
            placeholder="Name"
            required
            value={img}
            onChange={(e) => setImg(e.target.value)}
          />
        </label> : <label className="modal__label">
          Avatar URL*
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setAvatar(e.target.files[0]);
            }}
          />
        </label>
      }
    </ModalWithForm>
  );
};

export default ChangeProfileModal;

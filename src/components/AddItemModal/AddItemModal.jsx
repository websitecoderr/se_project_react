import { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./AddItemModal.css";

const AddItemModal = ({ isOpen, onSubmit, onClose }) => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [weather, setWeather] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setImageUrl("");
      setWeather("");
    }
  }, [isOpen]);

  useEffect(() => {
    setIsFormValid(
      name.trim() !== "" && imageUrl.trim() !== "" && weather !== ""
    );
  }, [name, imageUrl, weather]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting with values:", {
      name: name,
      weather: weather,
      imageUrl: imageUrl,
    });
    onSubmit({ name, weather, imageUrl });
    onClose();
  }; 

  return (
    <ModalWithForm
      title="New garment"
      buttonText="Add garment"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonDisabled={!isFormValid}
    >
      <label htmlFor="name" className="modal__label">
        Name
        <input
          type="text"
          className="modal__input"
          id="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label htmlFor="image" className="modal__label">
        Image
        <input
          type="url"
          className="modal__input"
          id="image"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
      </label>

      <label htmlFor="weather" className="modal__label">
        Select the weather type:
        <div className="modal__radio-group">
          {["hot", "warm", "cold"].map((type) => (
            <label key={type} className="modal__radio-label">
              <input
                type="radio"
                name="weather"
                value={type}
                onChange={(e) => setWeather(e.target.value)}
              />
              <div className="modal__radio-button">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
            </label>
          ))}
        </div>
      </label>

      {imageUrl && (
        <div className="modal__preview">
          <img src={imageUrl} alt="Preview" className="modal__preview-image" />
        </div>
      )}
      
    </ModalWithForm>
  );
};

export default AddItemModal;
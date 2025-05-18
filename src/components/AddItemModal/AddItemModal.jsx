import { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

const AddItemModal = ({ isOpen, onAddItem, onCloseModal, onClose }) => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState(""); 
  const [weather, setWeather] = useState("");
  const [styleState, setStyleState] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setImageUrl("");
      setWeather("");
    }
  }, [isOpen]);

  useEffect(() => {
    setStyleState(name.trim() !== "" && imageUrl.trim() !== "" && weather !== "");
  }, [name, imageUrl, weather]);

  const handleNameChange = (e) => setName(e.target.value);
  const handleImageChange = (e) => setImageUrl(e.target.value);
  const handleWeatherChange = (e) => setWeather(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddItem({ name, weather, image: imageUrl });
    setName("");
    setWeather("");
    setImageUrl("");
  };

  return (
    <ModalWithForm
      title="New garment"
      buttonText="Add garment"
      isOpen={isOpen}
      onClose={onClose}
      closeActiveModal={onCloseModal}
      onSubmit={handleSubmit}
      styleState={styleState}
    >
      <label htmlFor="name" className="modal__label">
        Name
        <input
          type="text"
          className="modal__input"
          id="name"
          placeholder="Name"
          value={name}
          onChange={handleNameChange}
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
          onChange={handleImageChange}
          required
        />
      </label>
      <label htmlFor="weather" className="modal__label">
        Select the weather type:
        <label style={{ display: "flex", gap: "5px" }}>
          <input type="radio" name="weather" value="hot" style={{ width: "10px" }} onChange={handleWeatherChange} />
          <span>Hot</span>
        </label>
        <label style={{ display: "flex", gap: "5px" }}>
          <input type="radio" name="weather" value="warm" style={{ width: "10px" }} onChange={handleWeatherChange} />
          <span>Warm</span>
        </label>
        <label style={{ display: "flex", gap: "5px" }}>
          <input type="radio" name="weather" value="cold" style={{ width: "10px" }} onChange={handleWeatherChange} />
          <span>Cold</span>
        </label>
      </label>
      {imageUrl && (
        <div className="modal__preview">
          <img
            src={imageUrl}
            alt="Preview"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </ModalWithForm>
  );
};

export default AddItemModal;

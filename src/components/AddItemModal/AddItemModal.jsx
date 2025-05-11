import { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

const AddItemModal = ({ isOpen, onAddItem, onCloseModal, onClose }) => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null); // New state for file
  const [imagePreview, setImagePreview] = useState(""); // New state for preview
  const [weather, setWeather] = useState("");
  const [styleState, setStyleState] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setName("");
      setImageFile(null);
      setImagePreview("");
      setWeather("");
    }
  }, [isOpen]);
  useEffect(() => {
    if (name !== "" && imageFile !== "" && weather) {
      setStyleState(true)
    } else {
      setStyleState(false)
    }
  }, [name, imageFile, weather])
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // New image handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleWeatherChange = (e) => {
    setWeather(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create FormData object to send file
    const formData = new FormData();
    formData.append("name", name);
    setName("")
    formData.append("weather", weather);
    setWeather("")
    formData.append("image", imageFile);
    setImageFile(null)
    onAddItem(formData);
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
          type="file"
          className="modal__input"
          id="image"
          accept="image/*"
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
      {imagePreview && (
        <div className="modal__preview">
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              objectFit: "contain",
            }}
          />
        </div>
      )}
      {/* Rest of your weather fieldset remains the same */}
      <fieldset className="modal__radio-buttons">
        {/* ... your existing weather radio buttons ... */}
      </fieldset>
    </ModalWithForm>
  );
};

export default AddItemModal;

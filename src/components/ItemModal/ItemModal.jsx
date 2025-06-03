import "./ItemModal.css";
import { useContext } from "react";
import { CurrentUserContext } from "../../Context/CurrentUserContext";

function ItemModal({ isOpen, onClose, item, onDelete }) {
  const { currentUser } = useContext(CurrentUserContext);

  console.log("Item data:", item);
  console.log("Image URL:", item?.imageUrl || "No image available");

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "https://picsum.photos/150/150";

    return imageUrl.startsWith("http")
      ? imageUrl
      : `http://localhost:3001${imageUrl}`;
  };

  const isOwner = currentUser && item?.owner === currentUser._id;
  console.log("Current user:", currentUser);
  console.log("Item owner:", item?.owner);
  console.log("Current user ID:", currentUser?._id);
  console.log("Is owner:", isOwner);

  if (!isOpen || !item) return null;

  return (
    <div className={`modal ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__content modal__content_type_image">
        <button type="button" className="modal__close" onClick={onClose}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 6.58579L13.2929 1.29289L14.7071 2.70711L9.41421 8L14.7071 13.2929L13.2929 14.7071L8 9.41421L2.70711 14.7071L1.29289 13.29289L6.58579 8L1.29289 2.70711L2.70711 1.29289L8 6.58579Z"
              fill="white"
            />
          </svg>
        </button>

        <img
          src={getImageUrl(item?.imageUrl)}
          alt={item?.name || "No name available"}
          className="modal__image"
          onError={(e) => {
            console.error("Image failed to load:", e.target.src);
            e.target.src = "https://picsum.photos/150/150";
          }}
        />

        <div className="modal__footer">
          <div className="modal__info">
            <h2 className="modal__caption">
              {item?.name || "No name available"}
            </h2>
            <p className="modal__weather">
              Weather: {item?.weather || "Unknown"}
            </p>
          </div>

          {isOwner && (
            <div className="modal__actions">
              <button
                type="button"
                className="modal__delete-button"
                onClick={() => onDelete(item)}
                style={{
                  cursor: "pointer",
                  border: "none",
                  background: "transparent",
                  color: "red",
                }}
              >
                🗑️ Delete item
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemModal;

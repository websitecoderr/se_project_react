import React, { useContext } from "react";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import "./ItemCard.css";

function ItemCard({ item, onCardClick, onCardLike, onCardDelete }) {
  const { currentUser } = useContext(CurrentUserContext); 

  console.log("Current user in ItemCard:", currentUser);
  console.log("Item data:", item);

  const isLiked = item.likes?.some((likeId) => currentUser?._id === likeId);
  const isOwner = currentUser?._id === item.userId;

  console.log("Debug owner check:", {
    currentUserId: currentUser?._id,
    itemOwnerId: item.userId,
    isOwner: isOwner,
  });

  const handleDeleteClick = () => {
    if (isOwner) {
      onCardDelete(item);
    }
  };

  return (
    <div className="cards__item">
      <div className="image-container">
        <img
          onClick={() => onCardClick?.(item)}
          src={item.imageUrl}
          alt={item.name}
          className="cards__image"
        />

        <div className="overlay">
          <span className="item-name">{item.name}</span>

          <button
            className={`like-button ${isLiked ? "liked" : ""}`}
            onClick={() => onCardLike(item)}
            style={{
              cursor: "pointer",
              border: "none",
              background: "transparent",
            }}
          >
            {isLiked ? "❤️" : "🤍"}
          </button>
        </div>
      </div>

      <div className="cards__info">
        {currentUser && isOwner && (
          <div className="modal">
            <button
              type="button"
              className="modal__delete-button"
              onClick={handleDeleteClick}
            >
              Delete item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemCard;



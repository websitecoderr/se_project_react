import React, { useContext, useEffect } from "react";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import "./ItemCard.css";

function ItemCard({ item, onCardClick, onCardLike, onCardDelete }) {
  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    if (!currentUser) {
      console.warn(
        "No current user detected! Make sure authentication is working."
      );
    }
  }, [currentUser]);

  console.log("Current user in ItemCard:", currentUser);
  console.log("Item data:", item);

  const isLiked = item.likes?.some((likeId) => currentUser?._id === likeId);
  const isOwner = currentUser && currentUser._id === item.owner;

  console.log("Debug owner check:", {
    currentUserId: currentUser?._id || "No user logged in",
    itemOwnerId: item.owner,
    isOwner: isOwner,
  });

  const handleDeleteClick = () => {
    if (!currentUser) {
      console.warn("Cannot delete item - no user logged in!");
      return;
    }

    console.log(`Attempting to delete item: ${item._id}`);
    if (isOwner) {
      onCardDelete(item._id);
    } else {
      console.warn("Delete button clicked, but user is not the owner!");
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
          {isOwner && (
            <div className="cards__info">
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
    </div>
  );
}

export default ItemCard;

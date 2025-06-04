import React, { useContext, useEffect } from "react";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import "./ItemCard.css";

function ItemCard({ item, onCardClick, onCardLike, onCardDelete }) {
  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    console.log("🌀 ItemCard Mounted");

    if (!currentUser) {
      console.warn("No current user detected! Check authentication.");
    } else {
      console.log(" Current user loaded:", currentUser);
    }
  }, [currentUser]);

  console.log("🔍 Current user in ItemCard:", currentUser);
  console.log("📌 Item data:", item);

  const isLiked = item.likes?.some((likeId) => currentUser?._id === likeId);

  const isOwner = currentUser && currentUser._id === item.userId;

  console.log("🛠️ Debug Owner Check:", {
    currentUserId: currentUser?._id || "No user logged in",
    itemOwnerId: item.userId,
    isOwner: isOwner,
  });

  const handleDeleteClick = () => {
    if (!currentUser) {
      console.warn("❌ Cannot delete item - no user logged in!");
      return;
    }

    console.log(`🗑️ Attempting to delete item:`, item);
    if (isOwner) {
      onCardDelete(item);
    } else {
      console.warn("🚫 Delete button clicked, but user is not the owner!");
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
          ></button>

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
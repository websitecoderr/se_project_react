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
      console.log("✅ Current user loaded:", currentUser);
    }
  }, [currentUser]);

  console.log("🔍 Current user in ItemCard:", currentUser);
  console.log("📌 Item data:", item);

  console.log("🔍 Item likes array:", item.likes);

  const isLiked =
    currentUser?._id &&
    item.likes?.filter(Boolean).some((likeId) => likeId === currentUser._id);

  console.log("🔍 Is liked result:", isLiked);

  const isOwner = currentUser && currentUser._id === item.owner;

  console.log("🛠️ Debug Owner Check:", {
    currentUserId: currentUser?._id || "No user logged in",
    itemOwnerId: item.owner,
    isOwner: isOwner,
  });

  const handleDeleteClick = () => {
    if (!currentUser) {
      console.warn("❌ Cannot delete item - no user logged in!");
      return;
    }

    console.log("🗑️ Attempting to delete item:", item);
    if (isOwner) {
      onCardDelete(item);
    } else {
      console.warn("🚫 Delete button clicked, but user is not the owner!");
    }
  };

  const handleLikeClick = () => {
    console.log("🔥 Like button clicked!");
    console.log("🔥 About to call onCardLike with:", item);
    onCardLike(item);
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
            onClick={handleLikeClick}
          ></button>

          {isOwner && <div className="cards__info"></div>}
        </div>
      </div>
    </div>
  );
}

export default ItemCard;

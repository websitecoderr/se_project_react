import React, { useContext, useEffect } from "react";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import "./ItemCard.css";

function ItemCard({ item, onCardClick, onCardLike }) {
  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    console.log("🌀 ItemCard Mounted");

    if (!currentUser) {
      console.warn("No current user detected! Check authentication.");
    } else {
      console.log("✅ Current user loaded:", currentUser);
    }
  }, [currentUser]);

  const isLiked =
    currentUser?._id &&
    item.likes?.filter(Boolean).some((likeId) => likeId === currentUser._id);


  const handleLikeClick = () => {
    console.log("🔥 Like button clicked!");
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

          {currentUser && (
            <button
              className={`like-button ${isLiked ? "liked" : ""}`}
              onClick={handleLikeClick}
              aria-label="Like this item"
            >
              
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemCard;

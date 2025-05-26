import React, { useState, useContext } from "react";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import { jwtDecode } from "jwt-decode";
import { checkResponse } from "../../utils/Api";
import "./ItemCard.css";

const API_BASE_URL = "http://localhost:3001";

function ItemCard({ item, onCardClick, setClothingItems, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);
  console.log("Current user in ItemCard:", currentUser); 

  const token = localStorage.getItem("jwt");
  const decodedToken = token ? jwtDecode(token) : null;
  const isLiked = item.likes?.some((likeId) => decodedToken?._id === likeId);
  const isOwner = decodedToken?._id === item.owner;

  console.log("Debug owner check:", {
    decodedTokenId: decodedToken?._id,
    itemOwnerId: item.owner,
    isOwner: isOwner,
  });

  const [liked, setLiked] = useState(isLiked);

  const onCardLike = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    const method = newLikedState ? "PUT" : "DELETE";

    try {
      const response = await fetch(`${API_BASE_URL}/items/${item._id}/likes`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedItem = await checkResponse(response);
      setClothingItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem._id === item._id ? updatedItem : prevItem
        )
      );
    } catch (error) {
      console.error("Error liking item:", error);
    }
  };

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
        <div className="overlay">{item.name}</div>
      </div>

      <div className="cards__info">
        {currentUser?.currentUser && (
          <div className="button-container">
            <span
              className={`like-button ${liked ? "liked" : ""}`}
              onClick={onCardLike}
              style={{ cursor: "pointer" }}
            >
              {liked ? "❤️" : "🤍"}
            </span>

            {isOwner && (
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
        )}
      </div>
    </div>
  );
}

export default ItemCard;

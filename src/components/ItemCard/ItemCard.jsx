const API_BASE_URL = "http://localhost:3001";
import React, { useState, useContext } from "react";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import { jwtDecode } from "jwt-decode";
import { checkResponse } from "../../utils/Api";
import "./ItemCard.css";

function ItemCard({ item, onCardClick, setClothingItems }) {
  const currentUser = useContext(CurrentUserContext);
  const token = localStorage.getItem("jwt");
  const decodedToken = token ? jwtDecode(token) : null;
  const isLiked = item.likes.some((likeId) => decodedToken?._id === likeId);
  
  const [liked, setLiked] = useState(isLiked);

  const onCardLike = async () => {
    setLiked((prevLiked) => !prevLiked);

    const method = liked ? "DELETE" : "PUT";

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
        prevItems.map((prevItem) => (prevItem._id === item._id ? updatedItem : prevItem))
      );
    } catch (error) {
      console.error("Error liking item:", error);
    }
  };

  return (
    <div className="cards__item">
      <img
        onClick={() => onCardClick?.(item)}
        src={`${item.imageUrl}`}
        alt={item.name}
        className="cards__image"
      />
      <p className="cards__name">
        <span>{item.name}</span>
        {currentUser.currentUser && (
          <span
            className={`like-button ${liked ? "liked" : ""}`}
            onClick={onCardLike}
            style={{ cursor: "pointer" }}
          >
            {liked ? "❤️" : "🤍"}
          </span>
        )}
      </p>
      <p className="cards__weather">Weather: {item.weather}</p>
    </div>
  );
}

export default ItemCard;

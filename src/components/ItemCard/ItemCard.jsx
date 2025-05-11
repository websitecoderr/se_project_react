const API_BASE_URL = "http://localhost:3001";
import React, {useState} from "react";
import { useContext } from "react";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import { jwtDecode } from "jwt-decode";
import { checkResponse } from "../../utils/Api";
import "./ItemCard.css"
function ItemCard({ item, onCardClick,setClothingItems }) {
  const [state,setState] = useState(true)
  const currentUser = useContext(CurrentUserContext);
  let tokens = localStorage.getItem("jwt") ? jwtDecode(localStorage.getItem("jwt")) : "";
  
  let isLiked = item.likes.map((items) => {
    return tokens._id == items
  })
  const onCardLike = async (card) => {
    let red = document.getElementById(`${item._id}like`).innerHTML
    red=="🤍"?document.getElementById(`${item._id}like`).innerHTML="❤️":document.getElementById(`${item._id}like`).innerHTML="🤍"
state?setState(false):setState;
    let token = localStorage.getItem("jwt");
    const method = isLiked[0]==true ? "DELETE" : "PUT";
    const response = await fetch(`${API_BASE_URL}/items/${item._id}/likes`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return checkResponse(response);
 

  }
  return (
    <li className="cards__item">
      <img
        onClick={() => onCardClick?.(item)}
        src={`http://localhost:3001${item.imageUrl}`}
        alt={item.name}
        className="cards__image"
      />
      <p className="cards__name">
        <span>{item.name}</span>
        {currentUser.currentUser?(
        <span
          className={`like-button ${isLiked==true ? "liked" : ""}`}
          onClick={() => onCardLike(item)}
          style={{cursor:"pointer"}}
          id={`${item._id}like`}
        >
          {isLiked[0]==true ? "❤️" : "🤍"}
        </span>
      ):""}
      </p>
      <p className="cards__weather">Weather: {item.weather}</p>
    </li>
  );
}

export default ItemCard;

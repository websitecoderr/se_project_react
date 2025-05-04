import { useContext } from "react";
import { CurrentUserContext } from "../../Context/CurrentUserContext";

function ItemCard({ item, onCardClick, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);

  const isLiked = item.likes?.some((like) => like === currentUser?._id);

  return (
    <li className="cards__item">
      <img
        onClick={() => onCardClick?.(item)}
        src={item.imageUrl || item.link}
        alt={item.name}
        className="cards__image"
      />

      <p className="cards__name">
        <span>{item.name}</span>
      </p>
      <p className="cards__weather">Weather: {item.weather}</p>

      {currentUser && (
        <button
          className={`like-button ${isLiked ? "liked" : ""}`}
          onClick={() => onCardLike?.(item)}
        >
          {isLiked ? "❤️" : "🤍"}
        </button>
      )}
    </li>
  );
}

export default ItemCard;

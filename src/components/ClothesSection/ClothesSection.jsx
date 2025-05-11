import { useContext, useMemo } from "react";
import ItemCard from "../ItemCard/ItemCard";
import { checkResponse } from "../../utils/Api";
import { jwtDecode } from "jwt-decode";
import "./style.css";
function ClothesSection({ onSelectCard, onCardDelete, filteredClothingItems,onCreateModal,handleAddClick }) {
  
let currentUser =jwtDecode(localStorage.getItem("jwt"))
  const userCards = useMemo(
    () => filteredClothingItems.filter((card) => card.owner === currentUser._id),
    [filteredClothingItems, currentUser]
  );
  return (
    <div className="clothes-section">
      <div className="clothes-section__headers" style={{display:"flex"}}>
        <h2 className="clothes-section__title">Your Items</h2>
        <button
              onClick={handleAddClick}
              type="button"
              className="header__add-clothes-btn"
            >
              + Add New
            </button>
      </div>
      <div className="clothes-section__cards">
        {userCards.length > 0 ? (
          userCards.map((card) => (
            <ItemCard
              key={card._id}
              item={card}
              onSelectCard={onSelectCard}
              onCardDelete={onCardDelete}
              checkResponse={checkResponse}
            />
          ))
        ) : (
          <p className="clothes-section__empty">
            You don't have any items yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default ClothesSection;

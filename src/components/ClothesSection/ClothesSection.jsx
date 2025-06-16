import React from "react";
import ItemCard from "../ItemCard/ItemCard";
import "./ClothesSection.css";
import { useCurrentUser } from "../../Context/CurrentUserContext";

function ClothesSection({
  onCardClick,
  onCardDelete,
  filteredClothingItems,
  handleAddClick,
  onCardLike,
}) {
  const { currentUser } = useCurrentUser();

  return (
    <div className="clothes-section">
      <div className="clothes-section__headers" style={{ display: "flex" }}>
        <h2 className="clothes-section__title">Your Items</h2>
        <button
          onClick={handleAddClick}
          type="button"
          className="clothes-section__add-button"
        >
          + Add New
        </button>
      </div>
      <div className="clothes-section__cards">
        {filteredClothingItems.length > 0 ? (
          filteredClothingItems
            .filter((item) => item.owner === currentUser?._id)
            .map((card) => (
              <ItemCard
                key={card._id}
                item={card}
                onCardClick={onCardClick}
                onCardDelete={onCardDelete}
                onCardLike={onCardLike}
              />
            ))
        ) : (
          <p className="clothes-section__empty">
            You don&apos;t have any items yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default ClothesSection;

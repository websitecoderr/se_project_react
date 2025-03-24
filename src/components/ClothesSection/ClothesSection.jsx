import React from "react";
import "./ClothesSection.css";
import ItemCard from "../ItemCard/ItemCard";

const ClothesSection = ({
  clothingItems,
  onSelectCard,
  onCreateModal,
  onCardDelete,
}) => {
  return (
    <div className="clothes-section">
      <div className="clothes-section__header">
        <h2 className="clothes-section__title">Your items</h2>
        <button className="clothes-section__add-button" onClick={onCreateModal}>
          + Add new
        </button>
      </div>
      <ul className="clothes-section__cards">
        {clothingItems.map((item) => (
          <ItemCard
            key={item._id}
            item={item}
            onCardClick={onSelectCard}
            onCardDelete={onCardDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export default ClothesSection;

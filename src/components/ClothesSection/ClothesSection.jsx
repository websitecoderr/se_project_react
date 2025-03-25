import React from "react";
import "./ClothesSection.css";
import ItemCard from "../ItemCard/ItemCard";

const ClothesSection = ({
  clothingItems,
  onSelectCard,
  onCreateModal,
  onCardDelete,
}) => {
  // Log the full `clothingItems` array for debugging
  console.log("clothingItems (full array):", clothingItems);

  // Log the keys to ensure each item has a valid `key` property
  console.log(
    "clothingItems (keys):",
    clothingItems.map((item) => item._id || item.id || "MISSING KEY")
  );

  // Log the properties of the first item (if it exists)
  if (clothingItems.length > 0) {
    console.log("First item properties:", Object.keys(clothingItems[0]));
  }

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
            key={item._id || item.id} // Fallback to `id` if `_id` is missing
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

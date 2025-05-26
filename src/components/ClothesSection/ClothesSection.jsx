import ItemCard from "../ItemCard/ItemCard";
import "./ClothesSection.css";

function ClothesSection({
  onCardClick, 
  onCardDelete,
  filteredClothingItems,
  handleAddClick,
}) {
  return (
    <div className="clothes-section">
      <div className="clothes-section__headers" style={{ display: "flex" }}>
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
        {filteredClothingItems.length > 0 ? (
          filteredClothingItems.map((card) => (
            <ItemCard
              key={card._id}
              item={card}
              onCardClick={onCardClick} 
              onCardDelete={onCardDelete}
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

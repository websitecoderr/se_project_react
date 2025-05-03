import { useContext, useMemo } from "react";
import { CurrentUserContext } from "../../App/App";
import ItemCard from "../ItemCard/ItemCard";

function ClothesSection({ cards, onSelectCard, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);

  const userCards = useMemo(
    () => cards.filter((card) => card.owner === currentUser?._id),
    [cards, currentUser]
  );

  return (
    <div className="clothes-section">
      <div className="clothes-section__header">
        <h2 className="clothes-section__title">Your Items</h2>
      </div>
      <div className="clothes-section__cards">
        {userCards.length > 0 ? (
          userCards.map((card) => (
            <ItemCard
              key={card._id}
              item={card}
              onSelectCard={onSelectCard}
              onCardDelete={onCardDelete}
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

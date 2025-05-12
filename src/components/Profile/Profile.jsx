import React, { useMemo } from "react";
import "./Profile.css";
import SideBar from "../SideBar/SideBar";
import ClothesSection from "../ClothesSection/ClothesSection";

const Profile = ({
  clothingItems = [], 
  onSelectCard, 
  onCreateModal,
  onCardDelete,
  weatherData = {},
  handleAddClick,
  handleSignOut,
}) => {
  
  const filteredClothingItems = useMemo(() => {
    const temperatureF = weatherData.temp?.F || 0;
    return clothingItems.filter((item) =>
      (temperatureF > 75 && item.weather === "hot") ||
      (temperatureF <= 75 && temperatureF >= 59 && item.weather === "warm") ||
      (temperatureF < 59 && item.weather === "cold")
    );
  }, [weatherData.temp, clothingItems]);

  return (
    <div className="profile">
      <SideBar handleSignOut={handleSignOut} />
      <ClothesSection
        onSelectCard={onSelectCard} 
        onCreateModal={onCreateModal}
        onCardDelete={onCardDelete}
        filteredClothingItems={filteredClothingItems}
        handleAddClick={handleAddClick}
      />
    </div>
  );
};

export default Profile;

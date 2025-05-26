import React, { useMemo } from "react";
import "./Profile.css";
import SideBar from "../SideBar/SideBar";
import ClothesSection from "../ClothesSection/ClothesSection";

const Profile = ({
  clothingItems = [], 
  onCreateModal,
  onCardDelete,
  weatherData = {},
  handleAddClick,
  handleSignOut,
  setActiveModal,
  onCardClick  

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
      <SideBar handleSignOut={handleSignOut} setActiveModal={setActiveModal}/>
      <ClothesSection
        onCreateModal={onCreateModal}
        onCardDelete={onCardDelete}
        filteredClothingItems={filteredClothingItems}
        handleAddClick={handleAddClick}
        onCardClick={onCardClick}

      />
    </div>
  );
};

export default Profile;
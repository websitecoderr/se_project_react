import React, { useState } from "react";
import "./Profile.css";
import SideBar from "../SideBar/SideBar";
import ClothesSection from "../ClothesSection/ClothesSection";
import { useCurrentTemperatureUnit } from "../../Context/CurrentTemperatureUnitContext";

const Profile = ({ clothingItems, onSelectCard, onCreateModal, onCardDelete, weatherData, handleAddClick, handleSignOut }) => {
  const { currentTemperatureUnit } = useCurrentTemperatureUnit()

  const TEMP_UNIT_C = "°C";
  const TEMP_UNIT_F = "°F";
  
  const displayTemperature =
    currentTemperatureUnit === "C"
    ? `${Math.round(weatherData.temp?.C || 0)} ${TEMP_UNIT_C}`
    : `${Math.round(weatherData.temp?.F || 0)} ${TEMP_UNIT_F}`;
    const filteredClothingItems = clothingItems.filter((item) => {
      const temperatureF = weatherData.temp?.F || 0;
      return (
        (temperatureF > 75 && item.weather === "hot") ||
        (temperatureF <= 75 && temperatureF >= 59 && item.weather === "warm") ||
        (temperatureF < 59 && item.weather === "cold")
      );
    });
    
  return (
    <div className="profile">
      <SideBar 
      handleSignOut={handleSignOut}
      />
      <ClothesSection 
        onSelectCard={onSelectCard} 
        onCreateModal={onCreateModal}
        onCardDelete={onCardDelete}
        filteredClothingItems = {filteredClothingItems}
        handleAddClick = {handleAddClick}
      />
            
    </div>
  );
};

export default Profile;
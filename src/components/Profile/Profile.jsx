import React from "react";
import "./Profile.css";
import SideBar from "../SideBar/SideBar";
import ClothesSection from "../ClothesSection/ClothesSection";

const Profile = ({ clothingItems, onSelectCard, onCreateModal, onCardDelete }) => {
  return (
    <div className="profile">
      <SideBar />
      <ClothesSection 
        clothingItems={clothingItems} 
        onSelectCard={onSelectCard} 
        onCreateModal={onCreateModal}
        onCardDelete={onCardDelete}
      />
    </div>
  );
};

export default Profile;
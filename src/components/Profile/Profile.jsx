import React from "react";
import "./Profile.css";
import SideBar from "../SideBar/SideBar";
import ClothesSection from "../ClothesSection/ClothesSection";

const Profile = ({
  clothingItems = [],
  onCreateModal,
  onCardDelete,
  handleAddClick,
  handleSignOut,
  setActiveModal,
  onCardClick,
  onCardLike,
}) => {
  return (
    <div className="profile">
      <SideBar handleSignOut={handleSignOut} setActiveModal={setActiveModal} />
      <ClothesSection
        title="Your Items"
        filteredClothingItems={clothingItems} 
        onCreateModal={onCreateModal}
        onCardDelete={onCardDelete}
        handleAddClick={handleAddClick}
        onCardClick={onCardClick}
        onCardLike={onCardLike}
      />
    </div>
  );
};

export default Profile;

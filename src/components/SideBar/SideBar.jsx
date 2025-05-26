import React, { useState } from "react";
import "./SideBar.css";
import avatarDefault from "../../assets/avatar.svg";
import { jwtDecode } from "jwt-decode";
import ChangeProfileModal from "../ChangeProfileModal/ChangeProfileModal";

const SideBar = ({ handleSignOut, handleAddClick }) => { 
  const [userData, setUserData] = useState(
    localStorage.getItem("jwt") ? jwtDecode(localStorage.getItem("jwt")) : ""
  );
  let token = localStorage.getItem("jwt");

  const [changeProfile, setChangeProfile] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState(userData.name || "");
  const [errorMessage, setErrorMessage] = useState("");

 const updateUser = async (userData) => {
  try {
    // Create a regular JSON object instead of FormData since we're sending text data
    const requestBody = {
      name: userData.name,
      avatar: userData.avatar // This should be the URL string
    };

    const response = await fetch("http://localhost:3001/users/me", {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedData = await response.json();
    setUserData(updatedData);
    if (updatedData.token) {
      localStorage.setItem("jwt", updatedData.token);
    }
    
    setChangeProfile(false);
    setErrorMessage("");
    alert("Profile updated successfully!");
  } catch (error) {
    setErrorMessage(error.message);
    console.error("Update error:", error);
  }
};

  return (
    <div className="sidebar">
      <div className="sidebar__user">
        <img
          src={userData.avatar || avatarDefault}
          alt="User avatar"
          className="sidebar__avatar"
        />
        <p className="sidebar__username">{userData?.name || "User"}</p>
      </div>

      {errorMessage && <p className="sidebar__error">{errorMessage}</p>}

     

      <button
        onClick={() => setChangeProfile(true)}
        type="button"
        className="header__add-clothes-btn change"
      >
        Change profile data
      </button>
      
      <button
        onClick={handleSignOut}
        type="button"
        className="header__button sign-out"
      >
        Sign Out
      </button>

      <ChangeProfileModal
        isOpen={changeProfile}
        onClose={() => setChangeProfile(false)}
        onSubmit={updateUser}
        avatar={avatar}
        setAvatar={setAvatar}
        name={name}
        setName={setName}
      />
    </div>
  );
};

export default SideBar;
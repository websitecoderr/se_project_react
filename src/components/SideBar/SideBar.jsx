import React, { useContext, useState } from "react";
import "./SideBar.css";
import avatarDefault from "../../assets/avatar.svg";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import ChangeProfileModal from "../ChangeProfileModal/ChangeProfileModal";

const SideBar = ({ handleSignOut }) => { 
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const [changeProfile, setChangeProfile] = useState(false);
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");
  const [name, setName] = useState(currentUser?.name || "");
  const [errorMessage, setErrorMessage] = useState("");

  const updateUser = async (userData) => {
    try {
      const requestBody = {
        name: userData.name,
        avatar: userData.avatar,
      };

      const response = await fetch("http://localhost:3001/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedData = await response.json();
      setCurrentUser(updatedData);
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
          src={currentUser?.avatar || avatarDefault}
          alt="User avatar"
          className="sidebar__avatar"
        />
        <p className="sidebar__username">{currentUser?.name || "User"}</p>
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

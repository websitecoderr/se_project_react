import React, { useState } from "react";
import "./SideBar.css";
import avatarDefault from "../../assets/avatar.svg";
import { jwtDecode } from "jwt-decode";
import ChangeProfileModal from "../ChangeProfileModal/ChangeProfileModal";

const SideBar = ({ handleSignOut }) => {
  let data = localStorage.getItem("jwt") ? jwtDecode(localStorage.getItem("jwt")) : "";
  let token = localStorage.getItem("jwt");

  const [changeProfile, setChangeProfile] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState(data.name);
  const [errorMessage, setErrorMessage] = useState("");

  const updateUser = async (userData) => {
    try {
      const formData = new FormData();
      formData.append("image", userData.avatar);
      formData.append("name", userData.name);
      const response = await fetch("http://localhost:3001/users/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Update failed.");
      }

      alert("Profile updated successfully!");
      setAvatar("");
      setName("");
      setErrorMessage(""); 
    } catch (error) {
      setErrorMessage(error.message); 
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__user">
        <img
          src={data.avatar ? `http://localhost:3001${data.avatar}` : avatarDefault} 
          alt="User avatar"
          className="sidebar__avatar"
        />
        <p className="sidebar__username">{data?.name || "User"}</p>
      </div>

      {errorMessage && <p className="sidebar__error">{errorMessage}</p>}

      <div>
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
      </div>

      <ChangeProfileModal
        isOpen={changeProfile}
        onClose={() => setChangeProfile(false)}
        onSubmit={updateUser}
        imgurl={`http://localhost:3001${data.avatar}`}
        avatar={avatar}
        setAvatar={setAvatar}
        name={name}
        setName={setName}
      />
    </div>
  );
};

export default SideBar;

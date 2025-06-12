import React, { useContext, useState, useEffect } from "react";
import "./SideBar.css";
import avatarDefault from "../../assets/avatar.svg";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import ChangeProfileModal from "../ChangeProfileModal/ChangeProfileModal";
import { updateProfile } from "../../utils/Api"; // ✅ Correct import

const SideBar = ({ handleSignOut }) => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const [changeProfile, setChangeProfile] = useState(false);
  const [avatar, setAvatar] = useState(currentUser?.avatar || avatarDefault);
  const [name, setName] = useState(currentUser?.name || "User");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      setAvatar(currentUser.avatar || avatarDefault);
      setName(currentUser.name || "User");
    }
  }, [currentUser]);

  const handleUpdateUser = async ({ name, avatar }) => {
    try {
      const updatedData = await updateProfile({ name, avatarUrl: avatar });
      setCurrentUser(updatedData);
      setChangeProfile(false);
      setErrorMessage("");
      alert("Profile updated successfully!");
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong.");
      console.error("Update error:", error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__user">
        <img src={avatar} alt="User avatar" className="sidebar__avatar" />
        <p className="sidebar__username">{name}</p>
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
        Log out
      </button>

      <ChangeProfileModal
        isOpen={changeProfile}
        onClose={() => setChangeProfile(false)}
        onSubmit={handleUpdateUser}
        avatar={avatar}
        setAvatar={setAvatar}
        name={name}
        setName={setName}
      />
    </div>
  );
};

export default SideBar;

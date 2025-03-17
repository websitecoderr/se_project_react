import React from "react";
import "./SideBar.css";
import avatarDefault from "../../assets/avatar.svg";

const SideBar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__user">
        <img 
          src={avatarDefault} 
          alt="User avatar" 
          className="sidebar__avatar" 
        />
        <p className="sidebar__username">User Name</p>
      </div>
    </div>
  );
};

export default SideBar;
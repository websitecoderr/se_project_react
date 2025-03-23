import "./Header.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import avatar from "../../assets/avatar.svg";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";

function Header({ handleAddClick, city, isLoading }) {
  const [date, setDate] = useState("");

  useEffect(() => {
    const options = { month: "long", day: "numeric" };
    setDate(new Date().toLocaleDateString("en-US", options));
  }, []);

  const displayLocation = isLoading ? "Loading..." : city || "Unknown Location";

  return (
    <header className="header">
      <Link to="/">
        <img className="header__logo" src={logo} alt="logo" />
      </Link>
      <p className="header__date-location">{`${date}, ${displayLocation}`}</p>
      <ToggleSwitch />
      <button
        onClick={handleAddClick}
        type="button"
        className="header__add-clothes-btn"
      >
        + Add Clothes
      </button>
      <Link to="/profile" className="header__profile-link">
        <div className="header__user-container">
          <p className="header__username">Terrence Tegegine</p>
          <img
            src={avatar}
            alt="Terrence Tegegine"
            className="header__avatar"
          />
        </div>
      </Link>
    </header>
  );
}

export default Header;

import "./Header.css";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../../utils/Api.js";

function Header({ handleAddClick, setActiveModal, city, isLoading }) {
  const displayLocation = isLoading ? "Loading..." : city || "Unknown Location";

  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const options = { month: "long", day: "numeric" };
      setDate(new Date().toLocaleDateString("en-US", options));
    };

    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  const token = getToken();
  if (!token) {
    setCurrentUser(null);
  }
}, [setCurrentUser]);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img className="header__logo" src={logo} alt="App logo" />
        </Link>
        <p className="header__date-location">{`${date}, ${displayLocation}`}</p>
      </div>

      {currentUser ? (
        <div className="header__user-container">
          <ToggleSwitch />
          <button
            onClick={handleAddClick}
            type="button"
            className="header__add-clothes-btn"
          >
            + Add Clothes
          </button>
          <div className="header__profile-container">
            <Link to="/profile" className="header__profile-link">
              <span className="header__username">
                {currentUser.name || "Profile"}
              </span>
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="User Avatar"
                  className="header__avatar"
                />
              ) : (
                <span className="header__avatar-placeholder">No Avatar</span>
              )}
            </Link>
          </div>
        </div>
      ) : (
        <div className="header__right-container">
          <ToggleSwitch />
          <div className="header__auth-buttons">
            <button
              type="button"
              className="header__button"
              onClick={() => setActiveModal("signup")}
            >
              Sign Up
            </button>

            <button
              type="button"
              className="header__button"
              onClick={() => setActiveModal("login")}
            >
              Log In
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

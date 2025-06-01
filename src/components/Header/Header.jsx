import "./Header.css";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import Avatar from "../Avatar/Avatar"; 

function Header({ handleAddClick, setActiveModal, city, isLoading, currentUser }) {
  const displayLocation = useMemo(() => {
    return isLoading ? "Loading..." : city || "Unknown Location";
  }, [isLoading, city]);

  const [date, setDate] = useState("");

  useEffect(() => {
    const options = { month: "long", day: "numeric" };
    setDate(new Date().toLocaleDateString("en-US", options));

    const interval = setInterval(() => {
      setDate(new Date().toLocaleDateString("en-US", options));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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
                {currentUser.name || "Terrence Tegegne"}
              </span>
              <Avatar avatarUrl={currentUser?.avatar} name={currentUser?.name} /> 
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

import "./Header.css";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import Avatar from "../Avatar/Avatar";
import { useCurrentUser } from "../../Context/CurrentUserContext";


function Header({ handleAddClick, setActiveModal, city, isLoggedIn }) {
  const { currentUser: contextCurrentUser } = useCurrentUser();

  useEffect(() => {
    console.log("Header - isLoggedIn:", isLoggedIn);
    console.log("Header - currentUser from context:", contextCurrentUser);
  }, [isLoggedIn, contextCurrentUser]);

  const displayLocation = useMemo(() => city || "Unknown Location", [city]);

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

      {isLoggedIn && contextCurrentUser ? (
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
                {contextCurrentUser.name || "Guest"}
              </span>
              <Avatar
                avatarUrl={contextCurrentUser.avatar}
                name={contextCurrentUser.name}
              />
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

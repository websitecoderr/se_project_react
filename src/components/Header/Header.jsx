import "./Header.css";
import { useState, useContext, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import LoginModal from "../LoginModal/LoginModal";
import SignUpModal from "../SignUpModal/SignUpModal";

function Header({
  handleAddClick,
  handleSignOut,
  handleLogin,
  handleSignUp,
  city,
  isLoading,
}) {
  const currentUser = useContext(CurrentUserContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
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

  const displayLocation = useMemo(
    () => (isLoading ? "Loading..." : city || "Unknown Location"),
    [isLoading, city]
  );

  return (
    <>
      <header className="header">
        <Link to="/">
          <img className="header__logo" src={logo} alt="App logo" />
        </Link>
        <p className="header__date-location">{`${date}, ${displayLocation}`}</p>

        {currentUser ? (
          <div className="header__user-container">
            <button
              onClick={handleAddClick}
              type="button"
              className="header__add-clothes-btn"
            >
              + Add Clothes
            </button>
            <Link to="/profile" className="header__profile-link">
              <p className="header__username">{currentUser.name}</p>
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={`Avatar of ${currentUser.name}`}
                  className="header__avatar"
                />
              ) : (
                <div className="header__avatar-placeholder">
                  {currentUser.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
            <button
              onClick={handleSignOut}
              type="button"
              className="header__button"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="header__right-container">
            <ToggleSwitch />
            <div className="header__auth-buttons">
              <button
                type="button"
                className="header__button"
                onClick={() => setIsSignUpModalOpen(true)}
              >
                Sign Up
              </button>
              <button
                type="button"
                className="header__button"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Log In
              </button>
            </div>
          </div>
        )}
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSubmit={handleLogin}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSubmit={handleSignUp}
      />
    </>
  );
}

export default Header;

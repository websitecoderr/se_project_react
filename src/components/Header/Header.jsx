import "./Header.css";
import { useState, useContext, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import LoginModal from "../LoginModal/LoginModal";
import SignUpModal from "../SignUpModal/SignUpModal";
import { jwtDecode } from "jwt-decode";

function Header({
  handleAddClick,
  handleSignOut,
  handleLogin,
  handleSignUp,
  city,
  isLoading,
  isLoginModalOpen,
  setIsLoginModalOpen,
  isSignUpModalOpen,
  setIsSignUpModalOpen,
  passwordColor,
  setPasswordColor,
}) {
  const User = useContext(CurrentUserContext);
  const currentUser = User.currentUser;

  let data = localStorage.getItem("jwt")
    ? jwtDecode(localStorage.getItem("jwt"))
    : "";

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
        <div className="logo">
          {" "}
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
            <Link to="/profile" className="header__profile-link">
              <p className="header__username">{data ? data.name : ""}</p>
              {data.avatar ? (
                <img
                  src={`http://localhost:3001${data.avatar}`}
                  alt={`Avatar of ${data ? data.avatar : ""}`}
                  className="header__avatar header__avatar-placeholder"
                />
              ) : (
                <div className="header__avatar-placeholder">
                  {data ? data.name : ""?.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
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
        passwordColor={passwordColor}
        setPasswordColor={setPasswordColor}
        setIsSignUpModalOpen={setIsSignUpModalOpen}
        setIsLoginModalOpen={setIsLoginModalOpen}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSubmit={handleSignUp}
        setIsSignUpModalOpen={setIsSignUpModalOpen}
        setIsLoginModalOpen={setIsLoginModalOpen}
      />
    </>
  );
}

export default Header;

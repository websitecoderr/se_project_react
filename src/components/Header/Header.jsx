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
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const storedUser = useMemo(() => {
    const token = localStorage.getItem("jwt");
    return token ? jwtDecode(token) : null;
  }, [isLoginModalOpen, isSignUpModalOpen]);

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
    const token = localStorage.getItem("jwt");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUser(decoded);
    }
  }, [setCurrentUser]);

  const displayLocation = useMemo(
    () => (isLoading ? "Loading..." : city || "Unknown Location"),
    [isLoading, city]
  );

  return (
    <>
      <header className="header">
        <div className="logo">
          <Link to="/">
            <img className="header__logo" src={logo} alt="App logo" />
          </Link>
          <p className="header__date-location">{`${date}, ${displayLocation}`}</p>
        </div>

        {currentUser || storedUser ? (
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
                  {currentUser?.name || storedUser?.name || "Profile"}
                </span>
                {currentUser?.avatar || storedUser?.avatar ? (
                  <img
                    src={currentUser?.avatar || storedUser?.avatar}
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

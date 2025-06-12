import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrentUserProvider } from "../../Context/CurrentUserContext";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute.jsx";
import { CurrentTemperatureUnitProvider } from "../../Context/CurrentTemperatureUnitContext.jsx";

import {
  fetchItemsFromApi,
  likeItem,
  deleteItemFromApi,
  addItemToApi,
  removeToken,
  setToken,
  updateProfile,
} from "../../utils/Api";
import { getWeather } from "../../utils/weatherApi";
import Header from "../Header/Header";
import Footer from "../Footer/Footer.jsx";
import Profile from "../Profile/Profile";
import Main from "../Main/Main";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import AddItemModal from "../AddItemModal/AddItemModal";
import ItemModal from "../ItemModal/ItemModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SignUpModal from "../SignUpModal/SignUpModal";
import LoginModal from "../LoginModal/LoginModal";
import { checkToken, signup} from "../../utils/auth.js";


function App() {
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clothingItems, setClothingItems] = useState([]);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [weatherData, setWeatherData] = useState({ temp: 0, city: "Unknown" });

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const data = await getWeather(lat, lon);
        setWeatherData({
          temp: data.temp,
          type: data.temp >= 86 ? "hot" : data.temp >= 59 ? "warm" : "cold",
          city: data.name,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          fetchWeather(position.coords.latitude, position.coords.longitude),
        (error) => {
          console.error("Error getting user location:", error.message);
          setIsLoading(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await fetchItemsFromApi();
        setClothingItems(
          items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      } catch (error) {
        console.error("Error fetching items:", error.message);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    console.log("useEffect is running");

    const checkUserSession = async () => {
      console.log("checkUserSession function is running");

      const token = localStorage.getItem("jwt");
      console.log("Token from localStorage:", token);

      if (!token) {
        console.log("🚫 No token found, returning early");
        return;
      }

      console.log("🔍 About to call checkToken() with token:", token);

      try {
        const response = await checkToken(token);
        console.log("✅ SUCCESS - API Response:", response);

        setCurrentUser(response);
        setIsLoggedIn(true);

        console.log("🔄 Updated currentUser state:", response);
      } catch (error) {
        console.error("❌ ERROR - Failed to verify token:", error);
        removeToken();
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    };

    checkUserSession();
  }, [setCurrentUser, setIsLoggedIn]);

  const handleSignOut = () => {
    removeToken();
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveModal("");
    window.location.href = "/";
  };

  const handleUpdateProfile = async (userData) => {
    setIsLoading(true);
    try {
      const updatedUser = await updateProfile(userData);
      setCurrentUser(updatedUser);
      setActiveModal("");
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardDelete = (card) => {
    if (!isLoggedIn) {
      setErrorMessage("You must be logged in to delete an item.");
      return;
    }
    setCardToDelete(card);
    setActiveModal("confirm-delete");
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteItemFromApi(cardToDelete._id);
      setClothingItems((prevItems) =>
        prevItems.filter((item) => item._id !== cardToDelete._id)
      );
      setActiveModal("");
    } catch (error) {
      console.error("Error deleting item:", error.message);
      setErrorMessage("Failed to delete item. Please try again.");
    }
  };

  const handleCardLike = async (card) => {
    console.log("🔍 handleCardLike called with:", card);
    console.log("🔍 Current user in handleCardLike:", currentUser);
    console.log("🔍 Card likes array:", card.likes);

    if (!currentUser || !currentUser._id) {
      setErrorMessage("User is not logged in.");
      setActiveModal("error");
      return;
    }

    const isLiked = card.likes.some((id) => id === currentUser._id);

    try {
      await likeItem(card._id, isLiked);

      const updatedCard = {
        ...card,
        likes: isLiked
          ? card.likes.filter((id) => id !== currentUser._id)
          : [...card.likes, currentUser._id],
      };

      setClothingItems((prevItems) =>
        prevItems.map((item) => (item._id === card._id ? updatedCard : item))
      );
    } catch (error) {
      console.error("Error liking item:", error);
    }
  };

  const handleAddClick = () => {
    console.log("Add button clicked in App");
    console.log("Current activeModal value:", activeModal);
    setActiveModal("add-garment");
    console.log("New activeModal value should be 'add-garment'");
  };

  const handleModalSwitch = () => {
    setActiveModal((prevModal) =>
      prevModal === "signup" ? "login" : "signup"
    );
  };

  const handleCardClick = (item) => {
    console.log("handleCardClick called with:", item);
    console.log("Setting activeModal to preview");
    setSelectedCard(item);
    setActiveModal("preview");
  };

  const handleSignUp = async (userData) => {
    setIsLoading(true);

    try {
      const newUser = await signup(userData);
      setToken(newUser.token);
      setCurrentUser(newUser.user);
      setIsLoggedIn(true);
      setActiveModal("");
    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage("Signup failed. Please try again.");
    }

    setIsLoading(false);
  };

  const handleAddItem = async (itemData) => {
    setIsLoading(true);

    try {
      const newItem = await addItemToApi(itemData);
      setClothingItems((prevItems) => [newItem, ...prevItems]);
      setActiveModal("");
    } catch (error) {
      console.error("Error adding item:", error);
      setErrorMessage("Failed to add item. Please try again.");
    }

    setIsLoading(false);
  };
  const handleSignIn = async (userData) => {
    setIsLoading(true);
    let loggedInUser = null;

    try {
      loggedInUser = await signin(userData);

      console.log("🔍 What signin returned:", loggedInUser);
      console.log("🔍 loggedInUser.token:", loggedInUser.token);
      console.log("🔍 loggedInUser.user:", loggedInUser.user);

      setToken(loggedInUser.token);
      setCurrentUser(loggedInUser.user);
      setIsLoggedIn(true);
      setErrorMessage("");

      console.log("SUCCESS - Login completed, user set:", loggedInUser.user);
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage(
        error.response?.data?.error || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
      console.log("ℹ️ Final check - loggedInUser:", loggedInUser);
    }

    return loggedInUser;
  };

  return (
    <div className="app">
      <BrowserRouter>
        <CurrentUserProvider
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        >
          <CurrentTemperatureUnitProvider>
            <Header
              handleAddClick={handleAddClick}
              handleSignOut={handleSignOut}
              onSignUpClick={handleSignUp}
              city={weatherData?.city}
              temperature={weatherData?.temp}
              isLoggedIn={isLoggedIn}
              setActiveModal={setActiveModal}
              handleModalSwitch={handleModalSwitch}
            />

            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    weatherData={weatherData}
                    clothingItems={clothingItems}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    setClothingItems={setClothingItems}
                  />
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Profile
                      clothingItems={clothingItems}
                      onCardClick={handleCardClick}
                      onCardLike={handleCardLike}
                      onCardDelete={handleCardDelete}
                      weatherData={weatherData}
                      handleSignOut={handleSignOut}
                      setActiveModal={setActiveModal}
                      handleAddClick={handleAddClick}
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>

            <Footer />
            <SignUpModal
              isOpen={activeModal === "signup"}
              onClose={() => setActiveModal("")}
              onSubmit={handleSignUp}
              onSwitch={handleModalSwitch}
              setIsLoginModalOpen={() => setActiveModal("login")}
              setIsSignUpModalOpen={() => setActiveModal("signup")}
            />
            <LoginModal
              isOpen={activeModal === "login"}
              onClose={() => setActiveModal("")}
              setCurrentUser={setCurrentUser}
              setIsLoggedIn={setIsLoggedIn}
              setIsLoginModalOpen={setActiveModal}
              setIsSignUpModalOpen={() => setActiveModal("signup")}
              handleSignIn={handleSignIn}
              handleLoginModalSwitch={handleModalSwitch}
            />

            <AddItemModal
              isOpen={activeModal === "add-garment"}
              onClose={() => setActiveModal("")}
              onSubmit={handleAddItem}
            />
            <EditProfileModal
              isOpen={activeModal === "edit-profile"}
              onClose={() => setActiveModal("")}
              onSubmit={handleUpdateProfile}
              isLoading={isLoading}
            />
            <ItemModal
              isOpen={activeModal === "preview"}
              onClose={() => setActiveModal("")}
              item={selectedCard}
              onDelete={handleCardDelete}
            />
            <DeleteConfirmationModal
              isOpen={activeModal === "confirm-delete"}
              onClose={() => setActiveModal("")}
              onConfirm={handleConfirmDelete}
            />

            <ErrorMessage message={errorMessage} />
          </CurrentTemperatureUnitProvider>
        </CurrentUserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

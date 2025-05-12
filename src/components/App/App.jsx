import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrentUserProvider } from "../../Context/CurrentUserContext";
import { CurrentTemperatureUnitProvider } from "../../Context/CurrentTemperatureUnitContext.jsx";
import {
  fetchItemsFromApi,
  likeItem,
  deleteItemFromApi,
  addItemToApi,
  getToken,
  checkToken,
  removeToken,
  registerUser,
  setToken, 
  signin,  
} from "../../utils/api";
import { getWeather } from "../../utils/weatherApi";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Profile from "../Profile/Profile";
import Main from "../Main/Main";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import AddItemModal from "../AddItemModal/AddItemModal";
import ItemModal from "../ItemModal/ItemModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SignUpModal from "../SignUpModal/SignUpModal";
import LoginModal from "../LoginModal/LoginModal";

function App() {
  const [passwordColor, setPasswordColor] = useState(false);  
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clothingItems, setClothingItems] = useState([]);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [weatherData, setWeatherData] = useState({ temp: 0, city: "Unknown" });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);




  const getWeatherType = (temp) =>
    temp >= 86 ? "hot" : temp >= 59 ? "warm" : "cold";

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const data = await getWeather(lat, lon);
        setWeatherData({
          temp: data.temp,
          type: getWeatherType(data.temp.F),
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
    const checkUserSession = async () => {
      const token = getToken();
      try {
        if (token) {
          const userData = await checkToken();
          setCurrentUser(userData);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking user session:", error);
        removeToken();
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    };
    checkUserSession();
  }, []);

  const handleSignOut = () => {
    removeToken();
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const handleCardClick = (item) => {
    setSelectedCard(item);
    setActiveModal("preview");
  };

  const handleCardLike = async (card) => {
    try {
      const isLiked = card.likes?.some((id) => id === currentUser?._id);
      const updatedCard = await likeItem(card._id, isLiked);
      setClothingItems((prevItems) =>
        prevItems.map((item) => (item._id === card._id ? updatedCard : item))
      );
    } catch (error) {
      console.error("Error liking item:", error.message);
      setErrorMessage("Error updating like status.");
    }
  };

  const handleCardDelete = (card) => {
    setCardToDelete(card);
    setActiveModal("confirm-delete");
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteItemFromApi(cardToDelete._id);
      setClothingItems((prevItems) =>
        prevItems.filter((item) => item._id !== cardToDelete._id)
      );
      setCardToDelete(null);
      setActiveModal("");
    } catch (error) {
      console.error("Error deleting item:", error.message);
      setErrorMessage("Error deleting item. Please try again.");
    }
  };

  const handleAddItemSubmit = async (formData) => {
    try {
      const addedItem = await addItemToApi(formData);
      setClothingItems((prevItems) => [addedItem, ...prevItems]);
      setActiveModal("");
    } catch (error) {
      console.error("Error adding item:", error.message);
      setErrorMessage("Error adding item. Please try again.");
    }
  };

  const handleSignUp = async (data) => {
    try {
      const response = await registerUser(data);

      if (response && response.user) {
        setCurrentUser(response.user);
        setIsLoggedIn(true);
        setIsSignUpModalOpen(false);
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      console.error("Error signing up:", error.message || error);

      setErrorMessage(
        error.response?.data?.message || "Error signing up. Please try again."
      );
    }
  };

  const handleSignIn = async (data) => {
  try {
    const response = await signin(data);
    
    if (!response || !response.token) {
      throw new Error("Invalid response from server.");
    }

    setToken(response.token);

    const userData = await checkToken();
    if (!userData) {
      throw new Error("Failed to retrieve user data.");
    }

    setCurrentUser(userData);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    setErrorMessage(""); 

  } catch (error) {
    console.error("❌ Error signing in:", error.message || error);

    setErrorMessage(
      error.response?.data?.message || "Sign-in failed. Please check your credentials and try again."
    );
  }
};

return (
    <div className="app">
      <BrowserRouter>
        <CurrentUserProvider value={{ currentUser, setCurrentUser }}>
          <CurrentTemperatureUnitProvider>
            <Header
              handleAddClick={() => setActiveModal("add-garment")}
              handleSignOut={handleSignOut}
              city={weatherData?.city}
              isLoading={isLoading}
              passwordColor={passwordColor}
              setPasswordColor={setPasswordColor}
              isLoginModalOpen={isLoginModalOpen}
              setIsLoginModalOpen={setIsLoginModalOpen}
              isSignUpModalOpen={isSignUpModalOpen}
              setIsSignUpModalOpen={setIsSignUpModalOpen}
              isLoggedIn={isLoggedIn}
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
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <Profile
                    clothingItems={clothingItems}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    weatherData={weatherData}
                    handleSignOut={handleSignOut}
                  />
                }
              />
            </Routes>

            <Footer />

            {isSignUpModalOpen && (
  <SignUpModal
    isOpen={isSignUpModalOpen}
    onClose={() => setIsSignUpModalOpen(false)}
    onSubmit={handleSignUp}
    setIsSignUpModalOpen={setIsSignUpModalOpen}
    setIsLoginModalOpen={setIsLoginModalOpen}
  />
)}

            {activeModal === "edit-profile" && (
              <EditProfileModal isOpen onClose={() => setActiveModal("")} />
            )}

            {activeModal === "add-garment" && (
              <AddItemModal
                isOpen
                onAddItem={handleAddItemSubmit}
                onClose={() => setActiveModal("")}
              />
            )}

            {activeModal === "preview" && (
              <ItemModal
                isOpen
                card={selectedCard}
                onClose={() => setActiveModal("")}
                onDelete={handleCardDelete}
              />
            )}

            {activeModal === "confirm-delete" && (
              <DeleteConfirmationModal
                isOpen
                onConfirm={handleConfirmDelete}
                onClose={() => setActiveModal("")}
              />
            )}

            {errorMessage && (
              <ErrorMessage
                message={errorMessage}
                onClose={() => setErrorMessage("")}
              />
            )}

            {isLoginModalOpen && (
               <LoginModal
    isOpen={isLoginModalOpen}
    onClose={() => setIsLoginModalOpen(false)}
    onSubmit={handleSignIn}
    passwordColor={passwordColor}
    setPasswordColor={setPasswordColor}
    setIsLoginModalOpen={setIsLoginModalOpen}
    setIsSignUpModalOpen={setIsSignUpModalOpen}
  />
)}
            
          </CurrentTemperatureUnitProvider>
        </CurrentUserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

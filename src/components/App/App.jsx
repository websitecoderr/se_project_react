import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Main from "../Main/Main";
import Profile from "../Profile/Profile";
import AddItemModal from "../AddItemModal/AddItemModal";
import ItemModal from "../ItemModal/ItemModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import { getWeather } from "../../utils/weatherApi";
import { CurrentTemperatureUnitProvider } from "../../Context/CurrentTemperatureUnitContext";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import {
  fetchItemsFromApi,
  addItemToApi,
  deleteItemFromApi,
  likeItem,
  setToken,
  getToken,
  removeToken,
  checkToken,
  signin,
  signup,
  updateUserProfile,
} from "../../utils/Api";

function App() {
  const [weatherData, setWeatherData] = useState({
    temp: { F: 0 },
    city: "Unknown",
  });
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clothingItems, setClothingItems] = useState([]);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await fetchItemsFromApi();
        setClothingItems(
          items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      } catch (error) {
        console.error("Error fetching items:", error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const data = await getWeather(lat, lon);
        if (data) {
          setWeatherData({
            ...data,
            type: getWeatherType(data.temp.F),
            city: data.name,
          });
        }
      } catch (error) {
        console.error("Error fetching weather data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting user location:", error.message);
          setIsLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const token = getToken();
        if (token) {
          const userData = await checkToken();
          setCurrentUser({ ...userData, token });
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

  const getWeatherType = (temp) =>
    temp >= 86 ? "hot" : temp >= 59 ? "warm" : "cold";

  const handleSignOut = () => {
    removeToken();
    setCurrentUser(null);
    setIsLoggedIn(false);
    console.log("User has been signed out successfully!");
  };

  const handleAddItemSubmit = async (item) => {
    if (!currentUser?.token) {
      setErrorMessage("Please log in to add items");
      return;
    }

    try {
      const addedItem = await addItemToApi(item, currentUser.token);
      setClothingItems((prevItems) => [addedItem, ...prevItems]);
      closeActiveModal();
    } catch (error) {
      console.error("Error adding item:", error.message);
      setErrorMessage("Error adding item. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!currentUser?.token) {
      setErrorMessage("Please log in to delete items");
      return;
    }

    try {
      await deleteItemFromApi(cardToDelete._id, currentUser.token);
      setClothingItems((prevItems) =>
        prevItems.filter((item) => item._id !== cardToDelete._id)
      );
      setCardToDelete(null);
      closeActiveModal();
    } catch (error) {
      console.error("Error deleting item:", error.message);
      setErrorMessage("Error deleting item. Please try again.");
    }
  };

  const handleCardLike = async (card) => {
    if (!currentUser?.token) {
      setErrorMessage("Please log in to like items");
      return;
    }

    try {
      const isLiked = card.likes?.some((id) => id === currentUser._id);

      const updatedCard = await likeItem(card._id, isLiked, currentUser.token);

      setClothingItems((prevItems) =>
        prevItems.map((item) => (item._id === card._id ? updatedCard : item))
      );
    } catch (error) {
      console.error("Error liking item:", error.message);
      setErrorMessage("Error updating like status");
    }
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  const handleCardDelete = (card) => {
    setCardToDelete(card);
    setActiveModal("confirm-delete");
  };

  return (
    <BrowserRouter>
      <CurrentUserContext.Provider value={currentUser}>
        <CurrentTemperatureUnitProvider>
          <Header
            handleAddClick={() => setActiveModal("add-garment")}
            handleSignOut={handleSignOut}
            city={weatherData.city}
            isLoading={isLoading}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  weatherData={weatherData}
                  clothingItems={clothingItems}
                  onCardLike={handleCardLike}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  clothingItems={clothingItems}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
              }
            />
          </Routes>
          <Footer />
          <EditProfileModal
            isOpen={activeModal === "edit-profile"}
            onClose={closeActiveModal}
          />
          <AddItemModal
            isOpen={activeModal === "add-garment"}
            onAddItem={handleAddItemSubmit}
            onClose={closeActiveModal}
          />
          <ItemModal
            isOpen={activeModal === "preview"}
            card={selectedCard}
            onClose={closeActiveModal}
          />
          <DeleteConfirmationModal
            isOpen={activeModal === "confirm-delete"}
            onConfirm={handleConfirmDelete}
            onClose={closeActiveModal}
          />
        </CurrentTemperatureUnitProvider>
      </CurrentUserContext.Provider>
    </BrowserRouter>
  );
}

export default App;

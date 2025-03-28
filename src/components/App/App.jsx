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
import { getWeather } from "../../utils/weatherApi";
import { CurrentTemperatureUnitProvider } from "../../Context/CurrentTemperatureUnitContext";
import {
  fetchItemsFromApi,
  addItemToApi,
  deleteItemFromApi,
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

  const handleConfirmDelete = async () => {
    if (!cardToDelete) {
      console.error("No card selected for deletion");
      return;
    }

    const itemId = cardToDelete.id;
    console.log("Attempting to delete item with id:", itemId);

    if (!itemId) {
      console.error("No id found on card to delete");
      return;
    }

    try {
      await deleteItemFromApi(itemId);
      setClothingItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
      setCardToDelete(null);
      closeActiveModal();
    } catch (error) {
      console.error("Error deleting item:", error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await fetchItemsFromApi();
        const sortedItems = items.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setClothingItems(sortedItems);
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
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
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

  const getWeatherType = (temp) => {
    if (temp >= 86) return "hot";
    if (temp >= 59) return "warm";
    return "cold";
  };

  const handleAddItemSubmit = async (item) => {
    const newItem = {
      name: item.name,
      weather: item.weather,
      imageUrl: item.imageUrl,
    };

    try {
      const addedItem = await addItemToApi(newItem);
      setClothingItems((prevItems) => [addedItem, ...prevItems]);
      closeActiveModal();
    } catch (error) {
      console.error("Error adding item:", error.message);
    }
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActiveModal("preview");
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
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
      <CurrentTemperatureUnitProvider>
        <div className="page">
          <div className="page__content">
            <Header
              handleAddClick={handleAddClick}
              city={weatherData.city}
              isLoading={isLoading}
            />
            {isLoading ? (
              <p>Loading weather data...</p>
            ) : (
              <Routes>
                <Route
                  path="/"
                  element={
                    <Main
                      weatherData={weatherData}
                      handleCardClick={handleCardClick}
                      clothingItems={clothingItems}
                      onCreateModal={handleAddClick}
                    />
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <Profile
                      clothingItems={clothingItems}
                      onSelectCard={handleCardClick}
                      onCreateModal={handleAddClick}
                      onCardDelete={handleCardDelete}
                    />
                  }
                />
              </Routes>
            )}
            <Footer />
          </div>
          <AddItemModal
            isOpen={activeModal === "add-garment"}
            onAddItem={handleAddItemSubmit}
            onCloseModal={closeActiveModal}
          />
          <ItemModal
            isOpen={activeModal === "preview"}
            card={selectedCard}
            onClose={closeActiveModal}
            onDelete={handleCardDelete}
          />
          <DeleteConfirmationModal
            isOpen={activeModal === "confirm-delete"}
            onClose={closeActiveModal}
            onConfirm={handleConfirmDelete}
          />
        </div>
      </CurrentTemperatureUnitProvider>
    </BrowserRouter>
  );
}

export default App;

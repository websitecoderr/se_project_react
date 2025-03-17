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
import { CurrentTemperatureUnitProvider } from "../Context/CurrentTemperatureUnitContext";
import { defaultClothingItems } from "../../utils/constants";

function App() {
  const [weatherData, setWeatherData] = useState({});
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [clothingItems, setClothingItems] = useState(defaultClothingItems);
  const [cardToDelete, setCardToDelete] = useState(null);

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
        console.error("Error fetching weather data:", error);
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
          console.error("Error getting user location:", error);
          setIsLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  }, []);

  const getWeatherType = (temp) => {
    if (temp >= 86) {
      return "hot";
    } else if (temp >= 59 && temp < 86) {
      return "warm";
    } else {
      return "cold";
    }
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  const handleAddItemSubmit = (item) => {
    const newItem = {
      _id: Date.now(), // Generate a temporary ID
      name: item.name,
      weather: item.weather,
      link: item.imageUrl,
    };

    setClothingItems([newItem, ...clothingItems]);
    closeActiveModal();
  };

  const handleCardDelete = (card) => {
    setCardToDelete(card);
    setActiveModal("confirm-delete");
  };

  const handleConfirmDelete = () => {
    const updatedClothingItems = clothingItems.filter(
      (item) => item._id !== cardToDelete._id
    );
    setClothingItems(updatedClothingItems);
    setCardToDelete(null);
    closeActiveModal();
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
                      isLoading={isLoading}
                      clothingItems={clothingItems}
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

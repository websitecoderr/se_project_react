import "./Main.css";
import WeatherCard from "../WeatherCard/WeatherCard";
import ItemCard from "../ItemCard/ItemCard";
import { useCurrentTemperatureUnit } from "../../Context/CurrentTemperatureUnitContext";

function Main({ weatherData, handleCardClick, isLoading, clothingItems }) {
  const { currentTemperatureUnit } = useCurrentTemperatureUnit();

  const displayTemperature =
    currentTemperatureUnit === "C"
      ? `${Math.round(weatherData?.temp?.C)} °C`
      : `${Math.round(weatherData?.temp?.F)} °F`;

  return (
    <main>
      <WeatherCard weatherData={weatherData} isLoading={isLoading} />
      <section className="cards">
        <p className="cards__text">
          Today is {weatherData?.temp ? displayTemperature : "..."} / You may
          want to wear:
        </p>
        <ul className="cards__list">
          {clothingItems.map((item) => (
            <ItemCard
              key={item._id || item.id}
              item={item}
              onCardClick={handleCardClick}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;

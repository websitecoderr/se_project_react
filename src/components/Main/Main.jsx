import "./Main.css";
import WeatherCard from "../WeatherCard/WeatherCard";
import ItemCard from "../ItemCard/ItemCard";
import { useCurrentTemperatureUnit } from "../../Context/CurrentTemperatureUnitContext";

function Main({
  weatherData = {},
  handleCardClick,
  isLoading,
  clothingItems = [],
}) {
  const { currentTemperatureUnit } = useCurrentTemperatureUnit();

  const TEMP_UNIT_C = "°C";
  const TEMP_UNIT_F = "°F";

  const displayTemperature =
    currentTemperatureUnit === "C"
      ? `${Math.round(weatherData.temp?.C || 0)} ${TEMP_UNIT_C}`
      : `${Math.round(weatherData.temp?.F || 0)} ${TEMP_UNIT_F}`;

  const filteredClothingItems = clothingItems.filter((item) => {
    const temperatureF = weatherData.temp?.F || 0;
    return (
      (temperatureF > 75 && item.weather === "hot") ||
      (temperatureF <= 75 && temperatureF >= 59 && item.weather === "warm") ||
      (temperatureF < 59 && item.weather === "cold")
    );
  });

  return (
    <main>
      <WeatherCard weatherData={weatherData} isLoading={isLoading} />

      <section className="cards">
        <p className="cards__text">
          Today is{" "}
          {weatherData.temp ? displayTemperature : "temperature unavailable"} /
          You may want to wear:
        </p>
        <ul className="cards__list">
          {filteredClothingItems.length > 0 ? (
            filteredClothingItems.map((item) => (
              <ItemCard
                key={item._id || item.id}
                item={item}
                onCardClick={handleCardClick}
              />
            ))
          ) : (
            <p className="cards__empty-text">
              No clothing suggestions available for this weather.
            </p>
          )}
        </ul>
      </section>
    </main>
  );
}

export default Main;

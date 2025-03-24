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

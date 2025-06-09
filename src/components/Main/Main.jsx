import "./Main.css";
import WeatherCard from "../WeatherCard/WeatherCard";
import ItemCard from "../ItemCard/ItemCard";
import { useCurrentTemperatureUnit } from "../../Context/CurrentTemperatureUnitContext";
import { useMemo } from "react";

function Main({
  weatherData = {},
  onCardClick,
  onCardLike,
  onCardDelete,
  isLoading,
  clothingItems = [],
  setClothingItems,
}) {
  const { currentTemperatureUnit } = useCurrentTemperatureUnit();

  const TEMP_UNIT_C = "°C";
  const TEMP_UNIT_F = "°F";

  const displayTemperature = useMemo(() => {
    if (!weatherData?.temp) return "Temperature unavailable";
    return currentTemperatureUnit === "C"
      ? `${Math.round(weatherData.temp?.C || 0)} ${TEMP_UNIT_C}`
      : `${Math.round(weatherData.temp?.F || 0)} ${TEMP_UNIT_F}`;
  }, [currentTemperatureUnit, weatherData]);

  return (
    <main>
      <WeatherCard weatherData={weatherData} isLoading={isLoading} />
      <section className="cards">
        <p className="cards__text">
          Today is {displayTemperature} / You may want to wear:
        </p>
        <ul className="cards__list">
          {clothingItems.length > 0 ? (
            clothingItems.map((item) => (
              <li key={item._id || item.id}>
                <ItemCard
                  item={item}
                  onCardClick={onCardClick}
                  onCardLike={onCardLike}
                  onCardDelete={onCardDelete}
                  setClothingItems={setClothingItems}
                />
              </li>
            ))
          ) : (
            <li className="cards__empty-text">
              No clothing suggestions available for this weather.
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}

export default Main;

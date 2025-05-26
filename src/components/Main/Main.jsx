import "./Main.css";
import WeatherCard from "../WeatherCard/WeatherCard";
import ItemCard from "../ItemCard/ItemCard";
import { useCurrentTemperatureUnit } from "../../Context/CurrentTemperatureUnitContext";
import { useMemo } from "react";

function Main({
  weatherData = {},
  onCardClick,
  isLoading,
  clothingItems = [], 
  setClothingItems,
}) {
  const { currentTemperatureUnit } = useCurrentTemperatureUnit();

  const TEMP_UNIT_C = "°C";
  const TEMP_UNIT_F = "°F";

  const displayTemperature = useMemo(() => {
    if (!weatherData?.temp) return "temperature unavailable";
    return currentTemperatureUnit === "C"
      ? `${Math.round(weatherData.temp?.C || 0)} ${TEMP_UNIT_C}`
      : `${Math.round(weatherData.temp?.F || 0)} ${TEMP_UNIT_F}`;
  }, [currentTemperatureUnit, weatherData]);

  const filteredClothingItems = useMemo(() => {
    console.log("Weather Data:", weatherData);
    console.log("Is Loading:", isLoading);
    console.log("All Clothing Items:", clothingItems);

    if (isLoading || !weatherData?.temp?.F) {
      console.warn("Loading or missing temperature data");
      return []; 
    }

    const temperatureF = weatherData.temp.F;
    console.log("Current temperature (F):", temperatureF);

    console.log("Clothing items with weather properties:", 
      clothingItems.map(item => ({
        name: item.name,
        weather: item.weather,
        _id: item._id
      }))
    );

    const filtered = clothingItems.filter((item) => {
      if (!item.weather) {
        console.warn("Item missing weather property:", item);
        return false;
      }

      const isHot = temperatureF > 75 && item.weather === "hot";
      const isWarm = temperatureF <= 75 && temperatureF >= 59 && item.weather === "warm";
      const isCold = temperatureF < 59 && item.weather === "cold";

      console.log(`Item ${item.name}: hot=${isHot}, warm=${isWarm}, cold=${isCold}`);

      return isHot || isWarm || isCold;
    });

    console.log("Filtered items:", filtered);
    return filtered;

  }, [weatherData?.temp?.F, clothingItems, isLoading]);

  return (
    <main>
      <WeatherCard weatherData={weatherData} isLoading={isLoading} />
      <section className="cards">
        <p className="cards__text">
          Today is {displayTemperature} / You may want to wear:
        </p>
        <ul className="cards__list">
          {filteredClothingItems.length > 0 ? (
            filteredClothingItems.map((item) => (
              <li key={item._id || item.id}> 
                <ItemCard
                  item={item}
                  onCardClick={onCardClick}
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
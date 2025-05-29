import React, { useMemo } from "react";
import "./WeatherCard.css";
import sunnyDay from "../../assets/sunny-day.svg";
import sunnyNight from "../../assets/sunny-night.svg";
import cloudyDay from "../../assets/cloudy-day.svg";
import cloudyNight from "../../assets/cloudy-night.svg";
import rainDay from "../../assets/rain-day.svg";
import rainNight from "../../assets/rain-night.svg";
import stormDay from "../../assets/storm-day.svg";
import stormNight from "../../assets/storm-night.svg";
import snowDay from "../../assets/snow-day.svg";
import snowNight from "../../assets/snow-night.svg";
import fogDay from "../../assets/fog-day.svg";
import fogNight from "../../assets/fog-night.svg";
import { useCurrentTemperatureUnit } from "../../Context/CurrentTemperatureUnitContext";

const WeatherCard = ({ weatherData, isLoading }) => {
  const { currentTemperatureUnit } = useCurrentTemperatureUnit();

  const TEMP_UNIT_C = "°C";
  const TEMP_UNIT_F = "°F";

  const isNight = useMemo(() => {
    const currentHour = new Date().getHours();
    return currentHour >= 18 || currentHour < 6;
  }, []);

  const getWeatherIcon = useMemo(() => {
    if (!weatherData?.weather?.[0]?.main) return sunnyDay;

    switch (weatherData.weather[0].main) {
      case "Clear":
        return isNight ? sunnyNight : sunnyDay;
      case "Clouds":
        return isNight ? cloudyNight : cloudyDay;
      case "Rain":
      case "Drizzle":
        return isNight ? rainNight : rainDay;
      case "Thunderstorm":
        return isNight ? stormNight : stormDay;
      case "Snow":
        return isNight ? snowNight : snowDay;
      case "Fog":
      case "Mist":
      case "Haze":
        return isNight ? fogNight : fogDay;
      default:
        return isNight ? cloudyNight : cloudyDay;
    }
  }, [isNight, weatherData]);

  const displayTemperature = useMemo(() => {
    if (
      !weatherData?.temp ||
      typeof weatherData.temp !== "object" ||
      (!("C" in weatherData.temp) && !("F" in weatherData.temp))
    ) {
      return "Temperature unavailable"; // ✅ Return only when data is invalid
    }

    return currentTemperatureUnit === "C"
      ? `${Math.round(weatherData.temp.C)} ${TEMP_UNIT_C}`
      : `${Math.round(weatherData.temp.F)} ${TEMP_UNIT_F}`;
  }, [currentTemperatureUnit, weatherData]); // ✅ Correct placement of dependencies

  console.log("Weather data:", weatherData);

  return (
    <section className="weather-card">
      {isLoading ? (
        <p>Loading weather...</p>
      ) : (
        <>
          <p className="weather-card__temp">{displayTemperature}</p>
          <img
            src={getWeatherIcon}
            alt="Weather icon"
            className="weather-card__image"
          />
        </>
      )}
    </section>
  );
};

export default WeatherCard;

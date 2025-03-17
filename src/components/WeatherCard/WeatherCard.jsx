import React from "react";
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
import { useCurrentTemperatureUnit } from "../Context/CurrentTemperatureUnitContext";

function WeatherCard({ weatherData, isLoading }) {
  const { currentTemperatureUnit } = useCurrentTemperatureUnit();

  const getWeatherIcon = () => {
    if (!weatherData?.weather?.[0]?.main) return sunnyDay;

    const isNight =
      weatherData.dt < weatherData.sys.sunrise ||
      weatherData.dt > weatherData.sys.sunset;

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
  };

  const temperature = weatherData?.temp?.[currentTemperatureUnit] || weatherData?.main?.temp;
  const displayTemperature =
    currentTemperatureUnit === "C"
      ? `${Math.round(weatherData?.temp?.C)} °C`
      : `${Math.round(temperature)} °F`;

  return (
    <section className="weather-card">
      {isLoading ? (
        <p>Loading weather...</p>
      ) : (
        <>
          <p className="weather-card__temp">
            {temperature ? displayTemperature : "..."}
          </p>
          <img
            src={getWeatherIcon()}
            alt="Weather icon"
            className="weather-card__image"
          />
        </>
      )}
    </section>
  );
}

export default WeatherCard;

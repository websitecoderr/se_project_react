import axios from "axios";

const API_KEY = "4bf2120c57e16767ae7bcba262afdc0c";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const TIMEOUT_MS = 10000; 

/**
 * 
 * @param {number} lat 
 * @param {number} lon 
 * @returns {Promise<Object|null>} 
 */
export const getWeather = async (lat, lon) => {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), TIMEOUT_MS)
  );

  const weatherRequest = axios.get(BASE_URL, {
    params: {
      lat,
      lon,
      units: "imperial",
      appid: API_KEY,
    },
  });

  try {
    const response = await Promise.race([weatherRequest, timeoutPromise]);

    const tempFahrenheit = response.data.main.temp;
    const tempCelsius = ((tempFahrenheit - 32) * 5) / 9;

    return {
      ...response.data,
      temp: {
        F: tempFahrenheit,
        C: tempCelsius,
      },
    };
  } catch (error) {
    console.error("Error fetching weather:", error.message);
    return null;
  }
};

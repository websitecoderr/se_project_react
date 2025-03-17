import axios from "axios";

const API_KEY = "4bf2120c57e16767ae7bcba262afdc0c";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

/**
 *
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>}
 */
export const getWeather = async (lat, lon) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat,
        lon,
        units: "imperial",
        appid: API_KEY,
      },
    });

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
    console.error("Error fetching weather:", error);
    return null;
  }
};

const lat = 25.7617;
const lon = -80.1918;

getWeather(lat, lon).then((data) => {
  if (data) {
    console.log(
      `Temperature in Miami: ${data.temp.F}°F / ${data.temp.C.toFixed(2)}°C`
    );
  }
});

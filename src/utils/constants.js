console.log("NODE_ENV", process.env.NODE_ENV)
export const BASE_URL = process.env.NODE_ENV === "production" ? "https://api.codecave.pakasak.com" : "http://localhost:3001";

export const checkResponse = (response) => {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(`Error: ${response.status}`);
};


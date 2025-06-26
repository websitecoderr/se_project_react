export const BASE_URL = "https://wtwr.codecave.pakasak.org/api";

export const checkResponse = (response) => {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(`Error: ${response.status}`);
};

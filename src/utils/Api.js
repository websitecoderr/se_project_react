// api.js
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "./constants";

// Token Utilities
export const setToken = (token) => localStorage.setItem("jwt", token);
export const removeToken = () => localStorage.removeItem("jwt");

export const getToken = () => {
  const token = localStorage.getItem("jwt")?.trim();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.warn("Token expired, removing...");
      removeToken();
      return null;
    }
    return token;
  } catch (error) {
    console.error("Invalid token:", error.message);
    removeToken();
    return null;
  }
};

// Handle API response
export const checkResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return data;

  throw new Error(
    `Error: ${response.status} ${response.statusText} | URL: ${
      response.url
    } | Details: ${JSON.stringify(data)}`
  );
};

// Auth: Validate Token
export const checkToken = async () => {
  const token = getToken();
  if (!token) return Promise.reject("No token provided.");

  try {
    const response = await fetch(`${BASE_URL}/api/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return await checkResponse(response);
  } catch (error) {
    console.error("Token validation failed:", error.message);
    return Promise.reject("Invalid or expired token.");
  }
};

// Auth: Signup
export const signup = async ({ name, email, password, avatar }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, avatar }),
    });

    const data = await checkResponse(response);
    if (data.token) setToken(data.token);

    return { success: true, ...data };
  } catch (error) {
    console.error("Signup error:", error.message);
    return { success: false, message: error.message };
  }
};

// Auth: Signin
export const signin = async ({ email, password }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await checkResponse(response);
    if (data.token) setToken(data.token);

    return { success: true, ...data };
  } catch (error) {
    console.error("Signin error:", error.message);
    return { success: false, message: error.message };
  }
};

// User Profile
export const updateProfile = async ({ name, avatarUrl }) => {
  const token = getToken();
  if (!token) return Promise.reject("No token provided.");

  try {
    const response = await fetch(`${BASE_URL}/api/users/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, avatar: avatarUrl }),
    });

    return await checkResponse(response);
  } catch (error) {
    console.error("Profile update error:", error.message);
    return Promise.reject(error.message);
  }
};

// Items: Fetch All
export const fetchItemsFromApi = async () => {
  const token = getToken();
  if (!token) return { success: false, message: "No token provided." };

  try {
    const response = await fetch(`${BASE_URL}/api/items`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return await checkResponse(response);
  } catch (error) {
    console.error("Error fetching items:", error.message);
    return { success: false, message: error.message };
  }
};

// Items: Add New
export const addItemToApi = async ({ name, weather, imageUrl }) => {
  const token = getToken();
  if (!token) return Promise.reject("No token provided.");

  try {
    const response = await fetch(`${BASE_URL}/api/items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, weather, imageUrl }),
    });

    return await checkResponse(response);
  } catch (error) {
    console.error("Add item error:", error.message);
    return Promise.reject(error.message);
  }
};

// Items: Delete
export const deleteItemFromApi = async (id) => {
  const token = getToken();
  if (!token) return Promise.reject("No token provided.");

  try {
    const response = await fetch(`${BASE_URL}/api/items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return await checkResponse(response);
  } catch (error) {
    console.error("Delete item error:", error.message);
    return Promise.reject(error.message);
  }
};

// Items: Like / Unlike
export const likeItem = async (id, isLiked) => {
  const token = getToken();
  if (!token) return Promise.reject("No token provided.");

  try {
    const method = isLiked ? "DELETE" : "PUT";

    const response = await fetch(`${BASE_URL}/api/items/${id}/likes`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return await checkResponse(response);
  } catch (error) {
    console.error("Like/unlike error:", error.message);
    return Promise.reject(error.message);
  }
};

// Items: Update Weather Tag
export const updateItemWeather = async (itemId, weatherType) => {
  const token = getToken();
  if (!token) return Promise.reject("No token provided.");

  try {
    const response = await fetch(`${BASE_URL}/api/items/${itemId}/weather`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ weather: weatherType }),
    });

    return await checkResponse(response);
  } catch (error) {
    console.error("Weather update error:", error.message);
    return Promise.reject(error.message);
  }
};

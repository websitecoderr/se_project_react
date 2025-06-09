const API_BASE_URL = "http://localhost:3001";
import { jwtDecode } from "jwt-decode";

export const checkResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return data;

  throw new Error(
    `Error: ${response.status} ${response.statusText} | URL: ${
      response.url
    } | Details: ${JSON.stringify(data)}`
  );
};

export const getToken = () => {
  const token = localStorage.getItem("jwt")?.trim() || null;
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

export const setToken = (token) => localStorage.setItem("jwt", token);
export const removeToken = () => localStorage.removeItem("jwt");

export const fetchItemsFromApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/items`);
    return checkResponse(response);
  } catch (error) {
    console.error("Error fetching items:", error.message);
    return { success: false, message: error.message };
  }
};

export const addItemToApi = async ({ name, weather, imageUrl }) => {
  const token = getToken();
  if (!token) return Promise.reject("Unauthorized: No token provided.");

  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        weather,
        imageUrl,
      }),
    });

    return checkResponse(response);
  } catch (error) {
    console.error("Error adding item:", error);
    return Promise.reject(error);
  }
};

export const deleteItemFromApi = async (id) => {
  const token = getToken();
  if (!token)
    return { success: false, message: "Unauthorized: No token provided." };

  try {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return checkResponse(response);
  } catch (error) {
    console.error("Error deleting item:", error.message);
    return { success: false, message: error.message };
  }
};

export const likeItem = async (id, isLiked) => {
  const token = getToken();
  if (!token)
    return { success: false, message: "Unauthorized: No token provided." };

  try {
    const method = isLiked ? "DELETE" : "PUT";
    const response = await fetch(`${API_BASE_URL}/items/${id}/likes`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return checkResponse(response);
  } catch (error) {
    console.error("Error liking item:", error.message);
    return { success: false, message: error.message };
  }
};

export const updateItemWeather = async (itemId, weatherType) => {
  const token = getToken();
  if (!token)
    return { success: false, message: "Unauthorized: No token provided." };

  try {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}/weather`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ weather: weatherType }),
    });

    return checkResponse(response);
  } catch (error) {
    console.error("Error updating item weather:", error.message);
    return { success: false, message: error.message };
  }
};

export const signin = async ({ email, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await checkResponse(response);
    if (data.token) setToken(data.token);

    return { success: true, ...data };
  } catch (error) {
    console.error("❌ Login request failed:", error.message);
    return {
      success: false,
      message: error.message || "Unexpected error occurred.",
    };
  }
};

export const registerUser = async ({ name, email, password, avatar }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, avatar, email, password }),
    });

    const data = await checkResponse(response);
    if (data.token) setToken(data.token);

    return { success: true, ...data };
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    return {
      success: false,
      message: error.message || "Unexpected error occurred.",
    };
  }
};

export const updateProfile = async ({ name, avatarUrl }) => {
  const token = getToken();
  if (!token) return Promise.reject("Unauthorized: No token provided.");

  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, avatar: avatarUrl }),
    });

    return checkResponse(response);
  } catch (error) {
    console.error("Error updating profile:", error);
    return Promise.reject(error);
  }
};

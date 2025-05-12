const API_BASE_URL = "http://localhost:3001";
import { jwtDecode } from "jwt-decode";

// ✅ Improved response validation to catch API errors properly
export const checkResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return data;

  throw new Error(`Error: ${response.status} ${response.statusText} - ${data.message || "Unknown error"}`);
};

// ✅ Fetch items from API
export const fetchItemsFromApi = async () => {
  const response = await fetch(`${API_BASE_URL}/items`);
  return checkResponse(response);
};

// ✅ Add new item to API
export const addItemToApi = async (newCard) => {
  const token = localStorage.getItem("jwt");
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCard),
  });
  return checkResponse(response);
};

// ✅ Delete item from API
export const deleteItemFromApi = async (id) => {
  const token = localStorage.getItem("jwt");
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return checkResponse(response);
};

// ✅ Like or dislike an item
export const likeItem = async (id, isLiked) => {
  const token = localStorage.getItem("jwt");
  const method = isLiked ? "DELETE" : "PUT";
  const response = await fetch(`${API_BASE_URL}/items/${id}/likes`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return checkResponse(response);
};

// ✅ Sign in user
export const signin = async ({ email, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await checkResponse(response);
    if (data.token) setToken(data.token); // ✅ Stores token only if available

    return data;
  } catch (error) {
    console.error("❌ Login request failed:", error.message);
    return { success: false, message: error.message || "Unexpected error occurred." };
  }
};

// ✅ Token management functions
export const setToken = (token) => localStorage.setItem("jwt", token);

export const getToken = () => {
  const token = localStorage.getItem("jwt");
  if (!token || !token.trim()) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const removeToken = () => localStorage.removeItem("jwt");

// ✅ Check token validity
export const checkToken = async () => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  return checkResponse(response);
};

// ✅ Update item weather
export const updateItemWeather = async (itemId, weatherType) => {
  const token = localStorage.getItem("jwt");
  const response = await fetch(`${API_BASE_URL}/items/${itemId}/weather`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ weather: weatherType }),
  });

  return checkResponse(response);
};

export const registerUser = async ({ name, email, password, avatar }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        avatar,
        email,
        password
      }),
    });

    const data = await checkResponse(response);
    if (data.token) {
      localStorage.setItem("jwt", data.token);
    }
    return data;
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    throw error;
  }
};
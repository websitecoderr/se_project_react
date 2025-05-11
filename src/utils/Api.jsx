const API_BASE_URL = "http://localhost:3001";
import { jwtDecode } from "jwt-decode";

export const checkResponse = (response) => {
  if (response.ok) {
    return response.json();
  }
  throw new Error(`Error: ${response.status} ${response.statusText}`);
};

export const fetchItemsFromApi = async () => {
  const response = await fetch(`${API_BASE_URL}/items`);
  return checkResponse(response);
};

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

export const signin = async ({ email, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // ✅ Ensure response handling is correct
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed.");
    }

    return checkResponse(response); // ✅ Ensure this function is properly defined

  } catch (error) {
    console.error("❌ Login request failed:", error.message);
    return { success: false, message: error.message || "Unexpected error occurred." };
  }
};


export const setToken = (token) => {
  localStorage.setItem("jwt", token);
};

export const getToken = () => {
  const token = localStorage.getItem("jwt");
  if (typeof token === "string" && token.trim() !== "") {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  } else {
    console.warn("Token is missing or invalid");
    return null;
  }
};

export const removeToken = () => {
  localStorage.removeItem("jwt");
};

export const checkToken = async () => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  return checkResponse(response);
};

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
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  if (avatar) {
    formData.append("avatar", avatar);
  }

  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    body: formData, // Don't set Content-Type header - browser will set it automatically with boundary
  });

  const data = await checkResponse(response);

  if (data.token) {
    setToken(data.token); // Use your existing setToken function
  }

  return data;
};

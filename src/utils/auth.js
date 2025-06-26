import { BASE_URL } from "./constants";

export const checkResponse = (response) => {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(`Error: ${response.status}`);
};

export const setToken = (token) => {
  localStorage.setItem("jwt", token);
};

export const getToken = () => {
  return localStorage.getItem("jwt");
};

export const checkToken = (token) => {
  console.log("🔍 checkToken function started with token:", token);

  if (!token) {
    console.warn("⚠️ No token provided to checkToken");
    return Promise.reject("No token found");
  }

  return fetch(`${BASE_URL}/api/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("❌ Token validation error:", error.message || error);
      return Promise.reject("Invalid or expired token.");
    });
};

export const signup = async ({ name, email, password, avatar }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/signup`, {
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
    console.error("❌ Signup error:", error.message || error);
    return {
      success: false,
      message: error.message || "Unexpected error occurred.",
    };
  }
};

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
    console.error("❌ Login error:", error.message || error);
    return {
      success: false,
      message: error.message || "Unexpected error occurred.",
    };
  }
};

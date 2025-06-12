import { API_BASE_URL, checkResponse, setToken } from "./Api";


export const checkToken = (token) => {
  console.log("🔍 checkToken function started with token:", token);

  if (!token) {
    console.warn("⚠️ No token provided to checkToken");
    return Promise.reject("No token found");
  }

  return fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => {
      console.log("🔍 About to return from checkToken");
      return await checkResponse(response);
    })
    .catch((error) => {
      console.error("❌ Token validation error:", error.message);
      return Promise.reject("Invalid or expired token.");
    });
};


export const signup = async ({ name, email, password, avatar }) => {
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
    console.error("❌ Signup error:", error.message);
    return {
      success: false,
      message: error.message || "Unexpected error occurred.",
    };
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
    console.error("❌ Login error:", error.message);
    return {
      success: false,
      message: error.message || "Unexpected error occurred.",
    };
  }
};


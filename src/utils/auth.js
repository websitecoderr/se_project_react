import { API_BASE_URL, checkResponse } from "./Api"; 

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



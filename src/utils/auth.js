const BASE_URL = "http://localhost:3001";

const checkResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
};

export const checkToken = async () => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    return Promise.reject("No token found");
  }

  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await checkResponse(response);
  } catch (error) {
    console.error("Token validation error:", error.message);
    return Promise.reject("Invalid or expired token.");
  }
};

const checkResponse = (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

export const signup = ({ name, avatar, email, password }) => {
  const baseUrl = "http://localhost:3001";

  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, avatar, email, password }),
  })
    .then(checkResponse)
    .catch((err) => console.error("Signup error:", err));
};

export const signin = ({ email, password }) => {
  const baseUrl = "http://localhost:3001";

  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then(checkResponse)
    .then((data) => {
      if (data.token) {
        localStorage.setItem("jwt", data.token);
      }
      return data;
    })
    .catch((err) => console.error("Signin error:", err));
};

export const checkToken = (token) => {
  const baseUrl = "http://localhost:3001";

  return fetch(`${baseUrl}/check-token`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Token validation failed! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Token validation error:", error.message);
    });
};

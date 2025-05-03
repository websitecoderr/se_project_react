const baseUrl = "http://localhost:3001";

export const checkResponse = (response) => {
  if (response.ok) {
    return response.json();
  }
  throw new Error(`Error: ${response.status} ${response.statusText}`);
};

export const fetchItemsFromApi = async () => {
  const response = await fetch(`${baseUrl}/items`);
  return checkResponse(response);
};

export const addItemToApi = async (newCard, token) => {
  const response = await fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCard),
  });
  return checkResponse(response);
};

export const deleteItemFromApi = async (id, token) => {
  const response = await fetch(`${baseUrl}/items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return checkResponse(response);
};

export const likeItem = async (id, isLiked, token) => {
  const method = isLiked ? "DELETE" : "PUT";
  const response = await fetch(`${baseUrl}/items/${id}/likes`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return checkResponse(response);
};
export const signin = async ({ email, password }) => {
  const response = await fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return checkResponse(response);
};

export const signup = async ({ name, email, password }) => {
  const response = await fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
  return checkResponse(response);
};

export const setToken = (token) => {
  localStorage.setItem("jwt", token);
};

export const getToken = () => {
  return localStorage.getItem("jwt");
};

export const removeToken = () => {
  localStorage.removeItem("jwt");
};

export const checkToken = async () => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(`${baseUrl}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return checkResponse(response);
};

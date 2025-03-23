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

export const addItemToApi = async (newCard) => {
  const response = await fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCard),
  });
  return checkResponse(response);
};

export const deleteItemFromApi = async (id) => {
  const response = await fetch(`${baseUrl}/items/${id}`, {
    method: "DELETE",
  });
  return checkResponse(response);
};

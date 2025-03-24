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

export const addItemToApi = async (newItem) => {
  const response = await fetch(`${baseUrl}/items`);
  const items = await checkResponse(response);

  const highestId = Math.max(...items.map((item) => item._id || 0), 0);
  const newId = highestId + 1;

  const modifiedItem = {
    ...newItem,
    _id: newId,
    id: Math.random().toString(36).substring(2, 6),
  };

  const addResponse = await fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(modifiedItem),
  });
  return checkResponse(addResponse);
};

export const deleteItemFromApi = async (itemId) => {
  try {
    const response = await fetch(`${baseUrl}/items`);
    const items = await checkResponse(response);
    const item = items.find((item) => item._id === itemId);

    if (!item) {
      throw new Error(`Item with _id ${itemId} not found`);
    }

    const deleteResponse = await fetch(`${baseUrl}/items/${item.id}`, {
      method: "DELETE",
    });

    if (!deleteResponse.ok) {
      throw new Error(`${deleteResponse.status} ${deleteResponse.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

const baseUrl = "http://localhost:3000";

export const checkResponse = (response) => {
  if (response.ok) {
    return response.json();
  }
  throw new Error(`Error: ${response.status} ${response.statusText}`);
};

export const fetchItemsFromApi = async () => {
  const response = await fetch(`${baseUrl}/items`);
  return checkResponse(response).then((items) => {
    console.log("Items from server:", items);
    return items;
  });
};

export const addItemToApi = async (newItem) => {
  const response = await fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  });

  return checkResponse(response).then((item) => {
    console.log("Added item response:", item);
    return item;
  });
};

export const deleteItemFromApi = async (itemId) => {
  console.log("Attempting to delete item with ID:", itemId);

  try {
    const response = await fetch(`${baseUrl}/items/${itemId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Error deleting item: ${response.status} ${response.statusText}`
      );
    }

    console.log(`Successfully deleted item with ID: ${itemId}`);
    return true;
  } catch (error) {
    console.error("Error deleting item:", error.message);
    throw error;
  }
};

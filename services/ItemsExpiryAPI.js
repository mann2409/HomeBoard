import axios from 'axios';
import { ITESM_EXPIRY_API } from '../utils/config';

export async function fetchItems() {
  try {
    const response = await fetch(`${ITESM_EXPIRY_API}/GetItems`);
    const data = await response.json(); // This will be an array directly

    // console.log('API Response:', data);  // Log to verify the structure

    if (!Array.isArray(data) || data.length === 0) {
      // throw new Error('No Fridge items found');
    }
    console.log('Items expiry API:',data);
    return data;  // Directly return the array

  } catch (error) {
    console.error('Error fetching fridge list:', error);
    throw error;
  }
}

// Save fridge Item
export async function saveItem(item) {
  try {
    const response = await fetch(`${ITESM_EXPIRY_API}/CreateItem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to save grocery item');
    }

    return response;
  } catch (error) {
    console.error('Error saving grocery item:', error);
    throw error;
  }
}

// Update fridge Item
export async function updateItem(item) {
  try {
    const response = await fetch(`${ITESM_EXPIRY_API}/DeleteItem`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const data = JSON.stringify(item);
      throw new Error('Failed to update fridge item');
    }
    return response;
  } catch (error) {
    console.error('Error updating fridge item:', error);
    throw error;
  }
}


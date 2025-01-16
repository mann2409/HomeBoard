import axios from 'axios';
import { GROCERIES_API_URL } from '../utils/config';

export async function fetchgroceries() {
  try {
    const response = await fetch(`${GROCERIES_API_URL}/GetShoppingList`);
    const data = await response.json(); // This will be an array directly

    // console.log('API Response:', data);  // Log to verify the structure

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No to-do items found');
    }

    return data;  // Directly return the array
  } catch (error) {
    console.error('Error fetching groceries list:', error);
    throw error;
  }
}

// Save To-Do Item
export async function savegroceries(item) {
  try {
    const response = await fetch(`${GROCERIES_API_URL}/SaveShopping`, {
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

// Update To-Do Item
export async function updategroceries(item) {
  try {
    const response = await fetch(`${GROCERIES_API_URL}/UpdateShopping`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const data = JSON.stringify(item);
      throw new Error('Failed to update to-do item');
    }
    return response;
  } catch (error) {
    console.error('Error updating to-do item:', error);
    throw error;
  }
}


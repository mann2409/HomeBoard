import axios from 'axios';
import { FINANCES_API_URL } from '../utils/config';

export async function getTransactions() {
  try {
    const response = await fetch(`${FINANCES_API_URL}/GetTransactions`);
    const data = await response.json(); // This will be an array directly

    // console.log('API Response:', data);  // Log to verify the structure

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No to-do items found');
    }
    // console.log('Response received from API:', data);
    return data;  // Directly return the array
  } catch (error) {
    console.error('Error fetching to-do list:', error);
    throw error;
  }
}

// Save To-Do Item
export async function saveTransaction(item) {
  try {
    // Ensure the amount has the correct prefix
    const formattedItem = {
      ...item,
      amount: item.amount.startsWith('-$') ? item.amount : `-$${item.amount}`, // Add '-$' if not already present
    };
    const response = await fetch(`${FINANCES_API_URL}/CreateTransaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedItem),
    });

    if (!response.ok) {
      throw new Error('Failed to save to-do item');
    }

    return response;
  } catch (error) {
    console.error('Error saving to-do item:', error);
    throw error;
  }
}

// Update To-Do Item
export async function UpdateTransaction(item) {
  try {
    const response = await fetch(`${FINANCES_API_URL}/UpdateTransaction`, {
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

// Delete To-Do Item
export async function deleteTransaction(item) {
  try {
    const response = await fetch(`${FINANCES_API_URL}/UpdateTransaction`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const data = JSON.stringify(item);
      throw new Error('Delete API-Failed to delete to-do item', data);
    }
    return response;
  } catch (error) {
    console.error('Error deleting to-do item API response:', error);
    throw error;
  }
}

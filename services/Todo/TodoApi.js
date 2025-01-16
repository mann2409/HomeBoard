import axios from 'axios';
import { TODOLIST_API_URL } from '../../utils/config';

export async function fetchtodo() {
  try {
    const response = await fetch(`${TODOLIST_API_URL}/GetToDoList`);
    const data = await response.json(); // This will be an array directly

    // console.log('API Response:', data);  // Log to verify the structure

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No to-do items found');
    }

    return data;  // Directly return the array
  } catch (error) {
    console.error('Error fetching to-do list:', error);
    throw error;
  }
}

// Save To-Do Item
export async function savetodo(item) {
  try {
    const response = await fetch(`${TODOLIST_API_URL}/CreateToDoList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
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
export async function updatetodo(item) {
  try {
    const response = await fetch(`${TODOLIST_API_URL}/UpdateToDoList`, {
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
export async function deletetodo(item) {
  try {
    const response = await fetch(`${TODOLIST_API_URL}/UpdateToDoList `, {
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

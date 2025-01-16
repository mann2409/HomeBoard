import axios from 'axios';
import { EVENTS_API_URL } from '../utils/config';

export async function fetchEvents() {
  try {
    const response = await fetch(`${EVENTS_API_URL}/GetCalendarEvent`);
    const data = await response.json(); // This will be an array directly

    //console.log('API Response:', data);  // Log to verify the structure

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No Calendar events found');
    }

    return data;  // Directly return the array
  } catch (error) {
    console.error('Error fetching Events list:', error);
    throw error;
  }
}

// Save Calendar Event
export async function saveEvents(item) {
  console.log('Save event received in API', item);
  try {
    const response = await fetch(`${EVENTS_API_URL}/SaveCalendarEvent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    // console.log('Save API Response:', response);  
    if (!response.ok) {
      throw new Error('Failed to save event ');
    }
    return response;
  } catch (error) {
    console.error('Error saving event :', error);
    throw error;
  }
}

// Update Calendar Event
export async function updateEvent(item) {  
  // const updatedRequest = { ...item, Status: 'U'};
  console.log('Edit event API request:', item);
  try {
    const response = await fetch(`${EVENTS_API_URL}/DeleteCalendarEvent`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    console.log('Edit event API response:', response);
    if (!response.ok) {
      // const data = JSON.stringify(item);
      throw new Error('Failed to update event');
    }
    return response;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}


// Delete Calendar Event 
export async function deleteEvent(item) {
  try {
    const updatedItem = { ...item, Status: 'D'};
    console.log('Delete API request:', updatedItem);
    const response = await fetch(`${EVENTS_API_URL}/DeleteCalendarEvent`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedItem),
    });

    if (!response.ok) {
      const data = JSON.stringify(item);
      throw new Error('Failed to update event');
    }
    return response;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}


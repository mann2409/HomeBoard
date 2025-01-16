import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
// import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AddEventModal from './AddEventModal';
import EditEventModal from './EditEventModal';
import { fetchEvents, saveEvents, deleteEvent, updateEvent } from '../services/CalendarAPI';
import { formatDate, formatTime, getEventIcon } from '../utils/helper'; // Utility functions
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { showDeleteConfirmation } from '../components/DeleteConfirmation';
import { ActivityIndicator } from 'react-native'; // Import ActivityIndicator
import { useRef } from 'react'; // Import useRef
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

// Utility to generate date range
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(formatDate(new Date(currentDate))); // Format as YYYY-MM-DD
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// Predefined pool of colors
const colorPool = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', '#955251', '#B565A7', '#009B77'];

const CalendarScreen = () => {
  const [selectedEvent, setSelectedEvent] = useState(null); // Event being edited
  const [editModalVisible, setEditModalVisible] = useState(false); // State for edit modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize ref for Swipeable
  const swipeableRefs = useRef({});

  // Close all swipeables function
  const closeAllSwipeables = () => {
    if (swipeableRefs.current) {
      Object.values(swipeableRefs.current).forEach((swipeable) => {
        swipeable?.close();
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const events = await fetchEvents(); // Fetch events from API
        setCalendarEvents(events);
        updateMarkedDates(events); // Update marked dates
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchData();
  }, []);

  const updateMarkedDates = (events) => {
    const marks = {};
    events.forEach((event, index) => {
      // Assign specific colors based on the title
      let color;
      // Convert EventName to uppercase for case-insensitive comparison and remove special characters
      const eventNameUpper = event.EventName?.toUpperCase().replace(/[^A-Z0-9\s]/g, '') || ''; // Remove special characters

      // Assign colors based on event title
      if (eventNameUpper.includes("BIRTHDAY") || eventNameUpper.includes("BDAY")) {
        color = 'rgba(245, 118, 7, 0.94)'; // Yellow for Birthday
        // console.log(`Set color to Yellow for: ${eventNameUpper}`);
      } else if (eventNameUpper.includes('DANIKA')) {
        color = '#FFC0CB'; // Pink for Danika
      } else if (eventNameUpper.includes('MANISH')) {
        color = '#ADD8E6'; // Blue for Manish
      } else if (eventNameUpper.includes('KINDY')) {
        color = 'rgba(246, 47, 143, 0.96)'; // Custom color for Kindy
      } else {
        color = colorPool[index % colorPool.length]; // Default color from the pool
      }

      // Generate the date range for the event
      const range = generateDateRange(event.StartDate, event.EndDate);
      range.forEach((date) => {
        // Ensure continuous background color for multi-day events
        marks[date] = {
          selected: true, // Ensures the date's background is colored
          selectedColor: color, // Use the assigned color for the event
        };
      });
    });

    // Update the marked dates
    setMarkedDates(marks);
  };


  const handleMonthChange = (month) => {
    setSelectedDate(''); // Clear the selected date
    setFilteredEvents([]); // Clear the event list
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    const eventsForDate = calendarEvents.filter(
      (event) =>
        generateDateRange(event.StartDate, event.EndDate).includes(day.dateString)
    );
    setFilteredEvents(eventsForDate);
  };

  const handleUpdateEvent = async (updatedEvent) => {
    setIsProcessing(true);
    try {
      const response = await updateEvent(updatedEvent); // Update event API call
      if (response.ok) {
        const updatedData = await fetchEvents();
        setCalendarEvents(updatedData);
        updateMarkedDates(updatedData); // Update marked dates after editing
        setFilteredEvents(updatedData.filter(event => event.StartDate === selectedDate));
        setEditModalVisible(false); // Close the modal
        setIsProcessing(false);
      } else {
        console.error('Failed to update event');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Error updating event:', err);
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  //Save Event
  const handleSaveEvent = async (newEvent) => {
    console.log('New Event:', newEvent);
    const formattedStartDate = formatDate(newEvent.startDate);
    const formattedEndDate = formatDate(newEvent.endDate);

    const newId =
      calendarEvents.length > 0
        ? Math.max(...calendarEvents.map((item) => item.Id)) + 1
        : 1;

    const formattedEvent = {
      Id: newId,
      EventName: newEvent.title,
      StartDate: formattedStartDate,
      StartTime: formatTime(newEvent.startDate),
      EndDate: formattedEndDate,
      EndTime: formatTime(newEvent.endDate),
    };

    setModalVisible(false);
    setIsProcessing(true);
    try {
      const response = await saveEvents(formattedEvent);
      if (response.ok) {
        const updatedData = await fetchEvents();
        setCalendarEvents(updatedData);
        updateMarkedDates(updatedData); // Update marked dates
        setFilteredEvents(updatedData.filter(event => event.StartDate === selectedDate));
      } else {
        console.error('Failed to save event');
      }
    } catch (err) {
      console.error('Error during save or fetch:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  //Delete Event 
  const handleDelete = async (eventId) => {
    closeAllSwipeables(); // Close all swipeables before action

    const confirmed = await showDeleteConfirmation();
    if (confirmed) {
      setIsProcessing(true);
      try {
        const response = await deleteEvent({ Id: eventId });
        if (response.ok) {
          const updatedData = await fetchEvents();
          setCalendarEvents(updatedData);
          updateMarkedDates(updatedData); // Update marked dates after deletion
          setFilteredEvents(updatedData.filter(event => event.StartDate === selectedDate));
        } else {
          console.error('Failed to delete event');
        }
      } catch (err) {
        console.error('Error deleting event:', err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle Edit Event
  const handleEdit = (event) => {
    // Close the current swipeable
    swipeableRefs.current[event.Id]?.close();

    // Set the event to be edited
    const updateEventData = { ...event, Status: 'U', Id: event.Id };
    setSelectedEvent(updateEventData);
    setEditModalVisible(true); // Open edit modal
  };


  // Render right actions for swipeable
  const renderRightActions = (item, closeSwipe) => (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          handleEdit(item); // Trigger edit handler
          closeSwipe(); // Close swipe manually
        }}
      >
        <MaterialIcons name="edit" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          handleDelete(item.Id); // Trigger delete handler
          closeSwipe(); // Close swipe manually
        }}
      >
        <MaterialIcons name="delete" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );


  return (
    <LinearGradient
      colors={['#220b4e', '#81e9e6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.background}
    >
      <GestureHandlerRootView style={styles.container}>
        {/* Busy Indicator */}
        {isProcessing && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#4845d2" />
          </View>
        )}

        {/* Calendar */}
        <Calendar
          onDayPress={handleDayPress} onMonthChange={handleMonthChange}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#4845d2' },
            ...markedDates,
          }}
        />

        <ScrollView style={styles.eventList}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              // Inside Swipeable render
              <Swipeable
                key={event.Id}
                ref={(ref) => {
                  if (swipeableRefs.current) {
                    swipeableRefs.current[event.Id] = ref; // Store the reference
                  }
                }}
                renderRightActions={(progress, dragX) =>
                  renderRightActions(event, () => swipeableRefs.current[event.Id]?.close())
                }
              >
                <View style={styles.eventCard}>
                  <View style={styles.eventIcon}>
                    {getEventIcon(event.EventName)}
                  </View>
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventTitle}>{event.EventName}</Text>
                    <Text style={styles.eventMeta}>
                      {event.StartTime} - {event.EndTime}
                    </Text>
                  </View>
                </View>
              </Swipeable>

            ))
          ) : (
            <Text style={styles.noEvents}>No events for this day</Text>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>

        <AddEventModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveEvent}
          selectedDate={selectedDate} // Pass selected date to the modal
        />
        <EditEventModal
          visible={editModalVisible} // Toggle visibility
          onClose={() => setEditModalVisible(false)} // Close the modal
          onSave={handleUpdateEvent} // Handle saving updated event
          event={selectedEvent} // Pass the selected event for editing
        />

      </GestureHandlerRootView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  eventList: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  eventCard: {
    backgroundColor: '#bbd4ce',
    padding: 20,
    // height: '100%',
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventIcon: {
    marginRight: 15,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  eventMeta: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noEvents: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#264e70',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    // height: '100%',
    borderRadius: 10,
  },
  editButton: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    // height: '100%',
    borderRadius: 10,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
    zIndex: 10, // Ensure it overlays other content
  },


});

export default CalendarScreen;

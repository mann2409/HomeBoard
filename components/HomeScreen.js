import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import WeatherWidget from './WeatherWidget';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
// import styles from '../styles/styles';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchtodo } from '../services/Todo/TodoApi';
import { fetchEvents } from '../services/CalendarAPI';
import { fetchgroceries } from '../services/GroceriesApi';
import { getEmojiForItem } from '../utils/emojiUtils';  // Import utility function
import { formatEventDate, trimToDate, formatTimeToHHMM } from '../utils/helper';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [todoItems, setTodoItems] = useState([]);
    const [latestGroceriesItems, setGroceryItems] = useState([]);
    const [calEvents, setCalendarEvents] = useState([]);

    // Fetch to-do items on screen focus
    useFocusEffect(
        useCallback(() => {
            const getTodos = async () => {
                try {
                    const todos = await fetchtodo();
                    setTodoItems(todos.slice(0, 5));  // Get only the latest 5 items
                } catch (error) {
                    console.error('Error fetching todos:', error);
                }
            };

            const getGroceries = async () => {
                try {
                    const groceries = await fetchgroceries();
                    setGroceryItems(groceries.slice(0, 3));  // Get only the latest 3 items
                } catch (error) {
                    console.error('Error fetching groceries:', error);
                }
            };

            const getCalendarEvents = async () => {
                try {
                    const calendarEvents = await fetchEvents();
                    const sortedFilteredEvents = calendarEvents
                        .filter(event => trimToDate(event.StartDate) >= trimToDate(new Date()))
                        .sort((a, b) => new Date(a.StartDate) - new Date(b.StartDate));
                    setCalendarEvents(sortedFilteredEvents.slice(0, 3)); // Get only the latest 3 events
                } catch (error) {
                    console.error('Error fetching calendar events:', error);
                }
            };

            getTodos();
            getGroceries();
            getCalendarEvents();
        }, [])
    );

    return (
        <LinearGradient
            colors={['#220b4e', '#81e9e6']} // Same gradient as login screen
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.background} // Background gradient styling
        >
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Greeting Section */}
                    <Text style={styles.greeting}>Welcome back, Manish!</Text>

                    {/* Weather Section */}
                    <TouchableOpacity>
                        <View style={styles.section}>
                            <WeatherWidget />
                        </View>
                    </TouchableOpacity>

                    {/* Expiring Soon Section */}
                    <TouchableOpacity onPress={() => navigation.navigate('Items in my Fridge')}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Expiring Soon (2 Items)</Text>
                            <View style={styles.row}>
                                <Text style={styles.item}>🥬 Lettuce - 2 days</Text>
                                <Text style={styles.item}>🍗 Chicken - 1 day</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Grocery List Section */}
                    <TouchableOpacity onPress={() => navigation.navigate('Groceries')}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Grocery List</Text>
                            <View style={styles.row}>
                                {latestGroceriesItems.length > 0 ? (
                                    latestGroceriesItems.map((item, index) => (
                                        <Text key={index} style={styles.item}>
                                            {getEmojiForItem(item.ItemName)} {item.ItemName}
                                        </Text>
                                    ))
                                ) : (
                                    <Text style={styles.item}>No groceries added</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Weekly Meal Planner Section */}
                    <TouchableOpacity onPress={() => navigation.navigate('Meals')}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Weekly Meal Planner</Text>
                            <View style={styles.row}>
                                <Text style={styles.item}>Monday - Pasta 🍝</Text>
                                <Text style={styles.item}>Tuesday - Curry 🍛</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Upcoming Events Section */}
                    <TouchableOpacity onPress={() => navigation.navigate('Events')}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Upcoming Events</Text>
                            {calEvents.length > 0 ? (
                                calEvents.map((event, index) => (
                                    <Text key={index} style={styles.item}>
                                        {'☐'} {formatEventDate(event.StartDate)}: {event.EventName}
                                        <Text style={{ fontSize: 12 }}>
                                            [{formatTimeToHHMM(event.StartTime)} - {formatTimeToHHMM(event.EndTime)}]
                                        </Text>
                                    </Text>
                                ))
                            ) : (
                                <Text style={styles.item}>No upcoming events</Text>
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* To-Do List Section */}
                    <TouchableOpacity onPress={() => navigation.navigate('To-Do List')}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>To-Do List</Text>
                            {todoItems.map((todo, index) => (
                                <Text key={index} style={styles.item}>
                                    {todo.Status === 'U' ? '✔️' : '☐'} {todo.ItemName}
                                </Text>
                            ))}
                        </View>
                    </TouchableOpacity>
                </ScrollView>

                {/* Bottom Tab Bar */}
                <View style={styles.tabBar}>
                    <TouchableOpacity>
                        <MaterialIcons name="home" size={30} color="#4845d2" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Events')}>
                        <MaterialIcons name="event" size={30} color="gray" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Finances')}>
                        <MaterialIcons name="paid" size={30} color="gray" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome name="bar-chart-o" size={24} color="gray" />
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>

    );
}
const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
    },
    container: {
        padding: 20,
        flexGrow: 1,
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginVertical: 20,
    },
    section: {
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#008080',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    item: {
        marginRight: 10,
        color: '#333',
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 80, // Ensures content doesn't overlap with the tab bar
    },
});

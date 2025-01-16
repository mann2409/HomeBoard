import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWeatherData } from '../services/WeatherApi';
import styles from '../styles/styles';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [day, setDay] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const today = new Date();
        const todayDateKey = today.toISOString().split('T')[0]; // YYYY-MM-DD format

        // Check if data exists in AsyncStorage
        const storedData = await AsyncStorage.getItem('weatherData');
        const parsedData = storedData ? JSON.parse(storedData) : null;

        if (parsedData && parsedData.date === todayDateKey) {
          // Load from AsyncStorage
          setWeather(parsedData.data.DailyForecasts[0]); // Today's weather
        } else {
          // Fetch from API
          const data = await fetchWeatherData();

          // Store in AsyncStorage
          await AsyncStorage.setItem(
            'weatherData',
            JSON.stringify({ date: todayDateKey, data })
          );

          setWeather(data.DailyForecasts[0]); // Today's weather
        }
      } catch (error) {
        setError('Failed to fetch weather');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Get Current Date
    const today = new Date();
    const dayFormatted = today.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dateFormatted = today.getDate();

    setDay(dayFormatted);
    setDate(dateFormatted);
  }, []);

  if (loading) {
    return <Text>Loading weather...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const weatherIcon = weather.Day.Icon;
  const weatherIconPhrase = weather.Day.IconPhrase;
  const temperature = weather.Temperature.Maximum.Value;

  const iconUrl = `https://developer.accuweather.com/sites/default/files/${weatherIcon
    .toString()
    .padStart(2, '0')}-s.png`;

  return (
    <View style={styles.widgetContainer}>
      <View style={styles.dateContainer}>
        <Text style={styles.day}>{day}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View>
        <Text style={styles.temp}>{temperature}°C</Text>
        <Text style={styles.condition}>{weatherIconPhrase}</Text>
        <Image source={{ uri: iconUrl }} style={styles.icon} />
      </View>
    </View>
  );
};

export default WeatherWidget;

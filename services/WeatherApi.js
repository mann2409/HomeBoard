import axios from 'axios';

// AccuWeather API Config
const LOCATION_KEY = '24741'; // Brisbane
const ACCUWEATHER_API_KEY = 'YBPFozEzDGN2GeezXOjLIYAKTm6hSEUc';
const ACCUWEATHER_URL = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${LOCATION_KEY}?apikey=${ACCUWEATHER_API_KEY}&metric=true`;

export const fetchWeatherData = async () => {
  try {
    const response = await axios.get(ACCUWEATHER_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
};

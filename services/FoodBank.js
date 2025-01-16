import axios from 'axios';

// // AccuWeather API Config
// const LOCATION_KEY = '24741'; // Brisbane
// const CALORIENINJA_API_KEY = 'coq98/lGgjxewlomgLTD/Q==sFKibZ1dqcb1cRdO';
// const ACCUWEATHER_URL = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${LOCATION_KEY}?apikey=${ACCUWEATHER_API_KEY}&metric=true`;

// export const fetchWeatherData = async () => {
//   try {
//     const response = await axios.get(ACCUWEATHER_URL);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching weather data:', error);
//     throw new Error('Failed to fetch weather data');
//   }
// };

var query = '3lb carrots and a chicken sandwich'
$.ajax({
    method: 'GET',
    url: 'https://api.calorieninjas.com/v1/nutrition?query=' + query,
    headers: { 'X-Api-Key': 'coq98/lGgjxewlomgLTD/Q==sFKibZ1dqcb1cRdO'},
    contentType: 'application/json',
    success: function(result) {
        console.log(result);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
});
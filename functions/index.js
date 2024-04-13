const functions = require('firebase-functions');
const axios = require('axios'); // Ensure axios is installed using npm

exports.fetchWeatherData = functions.https.onCall(async (data, context) => {
  const apiKey = functions.config().weather.api_key; // Use environment config to store API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(data.city)}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(apiUrl);
    return response.data; // Send back the weather data directly
  } catch (error) {
    throw new functions.https.HttpsError('unknown', error.message);
  }
});
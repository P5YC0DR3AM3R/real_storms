// This assumes you are inside the functions/index.js file of your Firebase project
const functions = require('firebase-functions');
const axios = require('axios'); // Make sure you have axios installed

exports.fetchWeatherData = functions.https.onCall(async (data, context) => {
  try {
    // Construct the API URL you need to fetch from the weather API
    const response = await axios.get(`Your weather API endpoint with necessary parameters`);
    return response.data; // Assuming the response data is the format you want to return
  } catch (error) {
    // Log the error to Firebase console
    functions.logger.error("Error fetching weather data:", error);
    // Respond with a 'callable' friendly error
    throw new functions.https.HttpsError('unknown', `Error fetching weather data: ${error.message}`);
  }
});
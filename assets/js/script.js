let searchList = JSON.parse(localStorage.getItem("searches")); 
let nextSearch = JSON.parse(localStorage.getItem("new-search")); 
let urlweb = "https://api.openweathermap.org";

// Fix the syntax for querying DOM elements
const cityCardTemplate = document.querySelector("[data-city-template]");
const cityCardContainer = document.querySelector("[data-city-cards-container]");
const searchInput = document.querySelector("[data-search]");
const searchBarInput = document.querySelector("#search"); // Assume it's an ID
const searchCity = document.querySelector("#city"); // Assuming 'city' is the ID of an element

let cities = [];
// Assuming this is part of your script.js
document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('exampleInputCity').value;
    const fetchWeatherData = firebase.functions().httpsCallable('fetchWeatherData');
  
    fetchWeatherData({ city })
      .then((result) => {
        displayWeather(result.data); // Function to update your UI with weather data
      })
      .catch((error) => {
        console.error('Error fetching weather:', error);
      });
  });
  
  function displayWeather(data) {
    const weatherContainer = document.querySelector('.border-box');
    weatherContainer.innerHTML = `
      <p>City: ${data.name}</p>
      <p>Temperature: ${data.main.temp} °C</p>
      <p>Weather: ${data.weather[0].main}</p>
    `;
  }
  
// Function to handle search
function search() {
    // Retrieve the value correctly and fix typos
    let input = document.getElementById("search").value; 
    let resultsDiv = document.getElementById("results");

    // Correct the API key and the API URL
    let myApiKey = "your-api-key-here";
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(input) + "&appid=" + myApiKey;

    // Make an API request using fetch
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Process the API data
            if (data.results && data.results.length > 0) {
                // Display the results
                resultsDiv.innerHTML = "Display your search results here"; // Example placeholder
            } else {
                // Handle no results
                resultsDiv.innerHTML = "No results found.";
            }
        })
        .catch(error => {
            // Handle errors
            console.error('Error fetching data:', error);
            resultsDiv.innerHTML = "Error loading results.";
        });
}
let searchList = JSON.parse(localStorage.getItem("searches")); 
let nextSearch = JSON.parse(localStorage.getItem("new-search")); 
let urlweb = "https://api.openweathermap.org";

// Fix the syntax for querying DOM elements
const cityCardTemplate = document.querySelector("[data-city-template]");
const cityCardContainer = document.querySelector("[data-city-cards-container]");
const searchInput = document.querySelector("[data-search]");
const searchBarInput = document.querySelector("#search"); 
const searchCity = document.querySelector("#city");

let cities = [];

document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('exampleInputCity').value;
    const fetchWeatherData = firebase.functions().httpsCallable('fetchWeatherData');
  
    fetchWeatherData({ city })
      .then((result) => {
        displayWeather(result.data); 
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

function search() {
    let input = document.getElementById("search").value; 
    let resultsDiv = document.getElementById("results");

    let myApiKey = "your-api-key-here";
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(input) + "&appid=" + myApiKey;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                resultsDiv.innerHTML = "Display your search results here"; 
            } else {
                resultsDiv.innerHTML = "No results found.";
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultsDiv.innerHTML = "Error loading results.";
        });
}
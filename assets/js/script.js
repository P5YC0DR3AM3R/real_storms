
let searchList = JSON.parse(localStorage.getItem("searches")); 
let nextSearch = JSON.parse(localStorage.getItem("new-search"));
let myApiKey = "4fda26b59cdc8f39454c721dd831bde9";
let urlweb = "https://api.openweathermap.org";

// Fix the syntax for querying DOM elements
const cityCardTemplate = document.querySelector("[data-city-template]");
const cityCardContainer = document.querySelector("[data-city-cards-container]");
const forecastCardContainer = document.querySelector("#forecast-weather");
const searchInput = document.querySelector("[data-search]");
const searchBarInput = document.querySelector("#search"); 
const searchCity = document.querySelector("#city");
const resultsDiv = document.getElementById("sr");

let pastCities = JSON.parse(localStorage.getItem('cities')) || [];
let cities = [];

// past cities recall 
const pastCitiesArray = function (city) {
  let weatherHistory = JSON.parse(localStorage.getItem('cities')) || [];
  weatherHistory.push(city);

  localStorage.setItem('pastCities', JSON.stringify(weatherHistory));
};

function search() {
  
  let input = document.getElementById("search").value; 
  let resultsDiv = document.getElementById("results");
  forecastSearch(input);
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${myApiKey}&units=imperial`;

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        displayWeather(data);
        document.getElementById("search").value = '';
      })
      .catch(error => {
          console.error('Error fetching data:', error);
          resultsDiv.innerHTML = "Error loading results.";
          document.getElementById("search").value = '';
      });
};

//fetch forecast
const forecastSearch = function (city) {
  const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${myApiKey}&units=imperial`;

  fetch(queryURL)
      .then(function (response) {
          if (response.ok) {
            return response.json();
          }
          else {
            throw new Error('Network response was not ok.');
          }
          })
      .then(function (data) {
        console.log(data);
        displayForecast(data);
        // const lat = data.coord.lat;
        // console.log(lat);
        // const lon = data.coord.lon;
        // console.log(lon);
        // const cityName = data.name;
        // console.log(cityName);
        // getForecast(lat, lon, cityName);
        // localStorage.setItem('forecast', (JSON.stringify(data)));
      })
      .catch(function (error) {
          console.error('There was a problem with the fetch operation:', error);
      });
  };

//display search history
const savedCities = function () {
  let historyInput = cityInput.value;
  let cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];
  cityHistory.push(historyInput);
  localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
  displayPastCities(cityHistory);
  console.log(cityHistory);
};

function displayWeather(data) {
    const weatherContainer = document.querySelector('.border-box');
    weatherContainer.innerHTML = `
      <h1>${data.name}</h1>
      <p>Temperature: ${data.main.temp}°F</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind: ${data.wind.speed}mph</p>
    `;
};

// on click - prevent event default
// call search function on click
document.getElementById("button").addEventListener("click", function(event){
  event.preventDefault();
  search()
});

const displayForecast = function (data) {
  for (let i = 0; i <= 4; i++) {
      //create div
      const forecastCard = document.createElement('div');
      forecastCard.setAttribute('class', 'forecast-card d-flex flex-column m-1');

      //create elements
      const cityDateEl = document.createElement('h4');
      const iconEl = document.createElement('h5');
      const cityTempEl = document.createElement('h5');
      const cityHumidityEl = document.createElement('h5');
      const cityWindEl = document.createElement('h5');

      //get date
      const date = forecastDate(i);

      //add text to each element
      cityDateEl.textContent = `${date}`;
      iconEl.textContent = weatherIcon(data.list[i]); // Pass data for each day to weatherIcon
      const cityTemp = (data.list[i].main.temp);
      cityTempEl.textContent = `Temp: ${cityTemp.toFixed(2)} °F` + ` `;
      cityWindEl.textContent = `Wind: ${data.list[i].wind.speed} MPH` + ` `;
      cityHumidityEl.textContent = `Humidity: ${data.list[i].main.humidity} %`;

      //append all elements to card
      forecastCard.appendChild(cityDateEl);
      forecastCard.appendChild(iconEl);
      forecastCard.appendChild(cityTempEl);
      forecastCard.appendChild(cityWindEl);
      forecastCard.appendChild(cityHumidityEl);
      
      
      //append the card to html
      forecastCardContainer.appendChild(forecastCard);
  }
};

//dayjs calendar
const forecastDate = function (i) {
  let today = dayjs();

  let forecastDay = today.add(i + 0, 'day').format('MM/DD/YYYY');
  return forecastDay;
};

//weather icons
const weatherIcon = function (data) {
  if (data.weather && data.weather.length > 0) {
      const iconCode = data.weather[0].icon;

      switch (iconCode) {
          case '01d':
              return '☀️'; // clear sky day
          case '01n':
              return '🌙'; // clear sky night
          case '02d':
              return '🌤️'; // few clouds day
          case '02n':
              return '🌥️'; // few clouds night
          case '03d':
          case '03n':
              return '🌥️'; // scattered clouds
          case '04d':
          case '04n':
              return '☁️'; // broken clouds
          case '09d':
          case '09n':
              return '🌧️'; // shower rain
          case '10d':
              return '🌦️'; // rain day
          case '10n':
              return '🌧️'; // rain night
          case '11d':
          case '11n':
              return '⛈️'; // thunderstorm
          case '13d':
          case '13n':
              return '❄️'; // snow
          case '50d':
          case '50n':
              return '🌫️'; // mist
          default:
              return '❓'; // default icon for unknown conditions
      }
  } else {
      return '❓'; // default icon if weather data is not available
  }
};

const displayPastCities = function (cityHistory) {
  const historyContainer = document.querySelector("#city-history");
  historyContainer.innerHTML = "";
// weather for city that was stored
  cityHistory.forEach(city => {
      const historyButton = document.createElement("button");
      historyButton.textContent = city;
      historyButton.setAttribute('class', 'btn btn-info d-flex text-center flex-column my-1');
      historyButton.classList.add("past"); // Use classList.add instead of += for adding classes
      historyContainer.appendChild(historyButton);

      historyButton.addEventListener("click", (event) => {
          event.preventDefault();
          let pastCity = historyButton.textContent;
          weatherSearch(pastCity);
          clearDiv();
      });
  });
};
// Select the elements
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const historyList = document.querySelector("#history");
const todayContainer = document.querySelector("#today");
const forecastContainer = document.querySelector("#forecast");

// OpenWeatherMap API key
const API_KEY = "ddf1883421a3125faedf18a9a05ab33e";

// Variables to store the weather data
let cities = [];

// Listen for form submit event
searchForm.addEventListener("submit", e => {
  e.preventDefault();

  // Get the city name from the input
  const city = searchInput.value;

  // Call the API
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  )
    .then(response => response.json())
    .then(data => {
      // Store the city data in localStorage
      cities.push(data);
      localStorage.setItem("cities", JSON.stringify(cities));

      // Render the city data
      renderToday(data);
      renderForecast(data);

      // Clear the input value
      searchInput.value = "";

      // Render the history list
      renderHistory();
    });
});

// Render the today weather
const renderToday = data => {
  // Create the HTML for the today weather
  const todayHTML = `
    <div class="card">
      <h2 class="card-header">${data.name} (${moment().format("L")}) <i class="wi wi-owm-${data.weather[0].id}"></i></h2>
      <div class="card-body">
        <p class="temperature">Temperature: ${data.main.temp} &#8451;</p>
        <p class="humidity">Humidity: ${data.main.humidity} %</p>
        <p class="wind">Wind Speed: ${data.wind.speed} m/s</p>
      </div>
    </div>
  `;

  // Update the todayContainer with the HTML
  todayContainer.innerHTML = todayHTML;
};

// Render the forecast weather
const renderForecast = data => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&units=metric&appid=${API_KEY}`
    )
      .then(response => response.json())
      .then(forecastData => {
        let forecastHTML = "";
        for (let i = 0; i < 5; i++) {
          let forecast = forecastData.list[i];
          let date = moment.unix(forecast.dt).format("MM/DD/YYYY");
          let icon = forecast.weather[0].icon;
          let temperature = forecast.main.temp;
          let humidity = forecast.main.humidity;
          forecastHTML += `
            <div class="col-lg-2">
              <div class="card p-2">
                <h5>${date}</h5>
                <img src="http://openweathermap.org/img/wn/${icon}@2x.png"/>
                <p>Temp: ${temperature}°C</p>
                <p>Humidity: ${humidity}%</p>
              </div>
            </div>
          `;
        }
        forecastContainer.innerHTML = forecastHTML;
      });
  }
  
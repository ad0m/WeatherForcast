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

const searchCity = name => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${name}&units=metric&appid=${API_KEY}`
  )
    .then(response => response.json())
    .then(data => {
      const index = cities.findIndex(
        c => c.name.toLowerCase() === data.name.toLowerCase()
      );
      if (index !== -1) {
        cities[index] = data;
      } else {
        cities.push(data);
      }

      localStorage.setItem("cities", JSON.stringify(cities));

      renderToday(data);
      renderForecast(data);
      renderHistory();
    });
};

// Listen for form submit event
searchForm.addEventListener("submit", e => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (!city) return;
  searchCity(city);
  searchInput.value = "";
});

// Check if there's already data in local storage
if (localStorage.getItem("cities")) {
  const stored = JSON.parse(localStorage.getItem("cities"));
  const seen = {};
  stored.forEach(city => {
    const key = city.name.toLowerCase();
    if (!seen[key]) {
      seen[key] = city;
    }
  });
  cities = Object.values(seen);
  localStorage.setItem("cities", JSON.stringify(cities));
}

// Render the history list
const renderHistory = () => {
  // Clear the history list
  historyList.innerHTML = "";

  // Render the buttons for each city
  cities.forEach(city => {
    const button = document.createElement("button");
    button.innerHTML = city.name;
    button.classList.add("btn", "btn-secondary", "w-100", "mt-2");
    button.addEventListener("click", () => {
      searchCity(city.name);
    });
    historyList.appendChild(button);
  });
};

// Call the renderHistory function for the first time
renderHistory();

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
        // Show one forecast per day. Each day is 8 items apart in the API
        // response (3 hour intervals). Limit the display to five days.
        for (let i = 0, day = 0; i < forecastData.list.length && day < 5; i += 8, day++) {
          let forecast = forecastData.list[i];
          let date = moment.unix(forecast.dt).format("MM/DD/YYYY");
          let icon = forecast.weather[0].icon;
          let temperature = forecast.main.temp;
          let humidity = forecast.main.humidity;
          forecastHTML += `
            <div class="col-lg-2">
              <div class="card p-2">
                <h5>${date}</h5>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png"/>
                <p>Temp: ${temperature}°C</p>
                <p>Humidity: ${humidity}%</p>
              </div>
            </div>
          `;
        }
        forecastContainer.innerHTML = forecastHTML;
      });
  };

function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[currentTime.getDay()];
  let currentHour = currentTime.getHours();
  let currentMinute = currentTime.getMinutes();
  if (currentMinute < 10) {
    currentMinute = `0${currentMinute}`;
  }

  return `${currentDay} ${currentHour}:${currentMinute}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div style="text-align: center" class="row forecast-icons">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
            <p class="col text forecast-day">${formatDay(forecastDay.time)}</p>
            <p class="forecast-temp text">${Math.round(
              forecastDay.temperature.minimum
            )}°| ${Math.round(forecastDay.temperature.maximum)}°</p>
          </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "ef3b002ff573fa014c1eft26f3o5f207";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.lon}&lat=${coordinates.lat}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  document.querySelector("#current-city").innerHTML = response.data.name;
  document.querySelector("#current-temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  let celciusTemperature = response.data.main.temp;
  document.querySelector("#condition").innerHTML =
    response.data.weather[0].description;
  document.querySelector(
    "#humidity"
  ).innerHTML = `Humidity: ${response.data.main.humidity}%`;

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "13d37f99d7d22bcec711c4374b82b348";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeather);
}

function handleSearch(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  let fahrenheitTemperature = (celciusTemperature * 9) / 5 + 32;
  currentTemperature.innerHTML = Math.round(fahrenheitTemperature);
}

function convertToCelcius(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = 18;
}

function handleLocation(position) {
  let apiKey = "13d37f99d7d22bcec711c4374b82b348";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(displayWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handleLocation);
}

let celciusTemperature = null;

let dateElement = document.querySelector("#current-day-time");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

let searchForm = document.querySelector("form");
searchForm.addEventListener("submit", handleSearch);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", convertToCelcius);

let currentButton = document.querySelector("#current-location-button");
currentButton.addEventListener("click", getCurrentLocation);

searchCity("Tokyo");

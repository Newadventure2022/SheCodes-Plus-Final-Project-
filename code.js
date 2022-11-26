function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function displayForecast(response) {
  console.log(response.data);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        ` 
                        <div class="col-2">
                            <div class="weather-forecast-date">${formatDay(
                              forecastDay.time
                            )}</div>
                            
                            <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                              forecastDay.condition.icon
                            }.png"
                                alt="" />
                            <div class="weather-forecast-temperature">
                                <span class="weather-forecast-temperature-high"> ${Math.round(
                                  forecastDay.temperature.maximum
                                )}° </span>
                                <span class="weather-forecast-temperature-low"> ${Math.round(
                                  forecastDay.temperature.minimum
                                )}° </span>
                            </div> 
                        </div>  
                         
              
                `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  let apiKey = "o8145f06881d09401ad03t8b0f09e589";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  let currentTemp = document.querySelector("#temperature");
  let currentLocation = document.querySelector("#current-city");
  let temperature = Math.round(response.data.temperature.current);
  let weatherElement = document.querySelector("#weather");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  currentLocation.innerHTML = `${response.data.city}`;
  currentTemp.innerHTML = `${temperature}`;
  weatherElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);
}

function searchLocation(position) {
  let apiKey = "o8145f06881d09401ad03t8b0f09e589";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lat=${lat}&lon=${lon}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input-result");
  let currentCity = document.querySelector("#current-city");
  if (searchInput.value) {
    currentCity.innerHTML = `${searchInput.value}`;
    search(searchInput.value);
  } else {
    currentCity.innerHTML = null;
    alert("Please type a city");
  }
}

function showTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let city = document.querySelector("#current-city");
  let weatherElement = document.querySelector("#weather");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.temperature.current;

  temperatureElement.innerHTML = Math.round(response.data.temperature.current);
  city.innerHTML = response.data.city;
  weatherElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = response.data.wind.speed;
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );

  getForecast(response.data.coordinates);
}
function search(city) {
  let apiKey = "o8145f06881d09401ad03t8b0f09e589";
  let units = "metric";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
function handleCity(e) {
  e.preventDefault();
  let searchInput = document.querySelector("#search-input-result");
  search(searchInput.value);
}
function fahrenheitTemp(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function celsiusTemp(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", fahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", celsiusTemp);

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleCity);

search("Paris");

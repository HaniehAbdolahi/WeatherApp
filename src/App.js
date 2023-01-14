/************************************************************************/
// Change units of current temperature
/************************************************************************/
let degree = document.querySelector("#current-temp");
let flag = "c";

function showTempAsFahrenheit(temp) {
  if (flag !== "f") {
    flag = "f";
    return temp * 1.8;
  } else {
    return temp;
  }
}
function showTempAsCelsius(temp) {
  if (flag !== "c") {
    flag = "c";
    return temp / 1.8;
  } else {
    return temp;
  }
}
function changeTempurature(temp) {
  degree.innerHTML = temp;
}

let celsiusLink = document.querySelector("#celsius");
if (celsiusLink !== null) {
  celsiusLink.addEventListener("click", function (event) {
    event.preventDefault();

    changeTempurature(showTempAsCelsius(degree.innerHTML));
  });
}

let fahrenheitLink = document.querySelector("#fahrenheit");
if (fahrenheitLink != null) {
  fahrenheitLink.addEventListener("click", function (event) {
    event.preventDefault();
    changeTempurature(showTempAsFahrenheit(degree.innerHTML));
  });
}
/************************************************************************/
// Show current date and time
/************************************************************************/
function formatDate(date) {
  return `${date.getMonth() + 1}/${date.getUTCDay() + 1}/${date.getFullYear()}`;
}
function formatTime(date) {
  return `${date.getHours()}:${date.getMinutes()}`;
}
function showDayAndTime(timestamp) {
  let currentDate = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[currentDate.getDay()];
  let headerTime = document.querySelector(".realTime");
  if (headerTime != null) {
    headerTime.innerHTML = `${day} ${formatTime(currentDate)}`;
  }
  let realDate = document.querySelector(".realDate");
  realDate.innerHTML = formatDate(currentDate);
}

/************************************************************************/
// Show temperature and call api by city name
/************************************************************************/
function changeWindSpeed(speed) {
  let windDiv = document.querySelector("#wind-speed");
  windDiv.innerHTML = `${Math.round(speed)} m/s`;
}
function changePressure(pressure) {
  let pressureDiv = document.querySelector("#pressure");
  pressureDiv.innerHTML = pressure + " hPa";
}
function changeHumidity(humidity) {
  let humidityDiv = document.querySelector("#humidity");
  humidityDiv.innerHTML = humidity + " %";
}
function changeSunParameter(sunrise, sunset) {
  let date = new Date(sunrise * 1000);
  let sunriseTime = date.toLocaleTimeString();
  let sunriseDiv = document.querySelector("#sunrise");
  sunriseDiv.innerHTML = sunriseTime;

  date = new Date(sunset * 1000);
  let sunsetTime = date.toLocaleTimeString();
  let sunsetDiv = document.querySelector("#sunset");
  sunsetDiv.innerHTML = sunsetTime;
}
function showDescription(currentDescription) {
  let description = document.querySelector("#description");
  description.innerHTML = currentDescription;
}
function showCity(cityName) {
  let cityLable = document.querySelector("#city-name");
  cityLable.innerHTML = cityName;
}

function showTemperature(response) {
  console.log(response);
  let temperature = response.data.main.temp;
  temperature = Math.round(temperature);
  changeTempurature(temperature);
  changeWindSpeed(response.data.wind.speed);
  changePressure(response.data.main.pressure);
  changeHumidity(response.data.main.humidity);
  changeSunParameter(response.data.sys.sunrise, response.data.sys.sunset);
  showDayAndTime(response.dt);
  showDescription(response.data.weather[0].description);
  showCity(response.name);
}
function showCurrentWeatherWithCityName(event) {
  event.preventDefault();
  let cityName = document.querySelector("#search-box").value;
  showCity(cityName);

  let apiKey = "b1d29bbfe9e2b56beb480695b0af6622";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);
}
let tForm = document.querySelector("#temp-form");
if (tForm != null) {
  tForm.addEventListener("submit", showCurrentWeatherWithCityName);
}

/************************************************************************/
// Show temperature and call api by current location
/************************************************************************/
function showCurrentWeather(lat, lon) {
  let apiKey = "b1d29bbfe9e2b56beb480695b0af6622";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);
}

function findLocation() {
  function handlePosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    showCurrentWeather(lat, lon);
  }

  navigator.geolocation.getCurrentPosition(handlePosition);
}

let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", findLocation);
/************************************************************************/

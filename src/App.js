let currentDate = new Date();
let header = document.querySelector(".RealDay");
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
if (header != null) {
  header.innerHTML = day;
}
function formatDate(date) {
  return `${date.getMonth() + 1}/${date.getUTCDay() + 1}/${date.getFullYear()}
          ${date.getHours()}:${date.getMinutes()} `;
}
let headerTime = document.querySelector(".RealTime");
if (headerTime != null) {
  headerTime.innerHTML = formatDate(currentDate);
}

function findLocation() {
  function handlePosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    showCurrentWeather(lat, lon);
  }

  navigator.geolocation.getCurrentPosition(handlePosition);
}
function showCurrentWeather(lat, lon) {
  let apiKey = "b1d29bbfe9e2b56beb480695b0af6622";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);
}

let currentButton = document.querySelector("#current");
currentButton.addEventListener("click", findLocation);

let tForm = document.querySelector("#temp-form");
//alert(1);
if (tForm != null) {
  tForm.addEventListener("submit", showCity);
}
//challenge 3
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
function changeWindSpeed(speed) {
  let windDiv = document.querySelector("#wind-speed");
  windDiv.innerHTML = speed;
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
function showTemperature(response) {
  let temperature = response.data.main.temp;
  temperature = Math.round(temperature);
  changeTempurature(temperature);
  changeWindSpeed(response.data.wind.speed);
  changePressure(response.data.main.pressure);
  changeHumidity(response.data.main.humidity);
  changeSunParameter(response.data.sys.sunrise, response.data.sys.sunset);
}
function showCity(event) {
  event.preventDefault();
  let cityName = document.querySelector("#search-box").value;
  let cityLable = document.querySelector("#city-name");
  cityLable.innerHTML = cityName;
  let apiKey = "b1d29bbfe9e2b56beb480695b0af6622";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);
}

/************************************************************************/
// Change units of current temperature
/************************************************************************/
let degree = document.querySelector("#current-temp");
let flag = "c";

function changeUnit(unit, cls) {
  let weatherfields = document.querySelectorAll(`${cls}`);
  if (unit == "f") {
    weatherfields.forEach(function (field) {
      let temp = field.innerHTML;
      field.innerHTML = cilsiusToFahrenheit(temp);
    });
  } else if (unit == "c") {
    weatherfields.forEach(function (field) {
      let temp = field.innerHTML;
      field.innerHTML = FahrenheitToCilsius(temp);
    });
  }
}
function cilsiusToFahrenheit(c) {
  return Math.round((c * 9) / 5 + 32);
}

function FahrenheitToCilsius(f) {
  return Math.round(((f - 32) * 5) / 9);
}

function showTempAsFahrenheit(temp) {
  if (flag !== "f") {
    flag = "f";
    changeUnit("f", ".weather-forcast-temp-max");
    changeUnit("f", ".weather-forcast-temp-min");
    return cilsiusToFahrenheit(temp);
  } else {
    return temp;
  }
}
function showTempAsCelsius(temp) {
  if (flag !== "c") {
    flag = "c";
    changeUnit("c", ".weather-forcast-temp-max");
    changeUnit("c", ".weather-forcast-temp-min");
    return FahrenheitToCilsius(temp);
  } else {
    return temp;
  }
}
function changeTempurature(temp) {
  degree.innerHTML = temp;
}

let celsiusLink = document.querySelector("#celsius");
let fahrenheitLink = document.querySelector("#fahrenheit");

if (celsiusLink !== null) {
  celsiusLink.addEventListener("click", function (event) {
    event.preventDefault();
    celsiusLink.classList.add("activeLink");
    fahrenheitLink.classList.remove("activeLink");
    changeTempurature(showTempAsCelsius(degree.innerHTML));
  });
}

if (fahrenheitLink != null) {
  fahrenheitLink.addEventListener("click", function (event) {
    event.preventDefault();
    fahrenheitLink.classList.add("activeLink");
    celsiusLink.classList.remove("activeLink");
    changeTempurature(showTempAsFahrenheit(degree.innerHTML));
  });
}
/************************************************************************/
// Show current date and time
/************************************************************************/
function formatDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}
function formatTime(date) {
  return `${date.getHours()}:${date.getMinutes()}`;
}

function showDayAndTime(timestamp) {
  let currentDate = new Date(timestamp * 1000);
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
  let cityNameSearchBox = document.querySelector("#search-box");
  cityNameSearchBox.value = cityName;
}
function ChangeImage(code, description) {
  let image = document.querySelector("#img-icon");
  let iconUrl = `http://openweathermap.org/img/wn/${code}@2x.png`;
  image.setAttribute("src", iconUrl);
  image.setAttribute("alt", description);
}

function showTemperature(response) {
  let temperature = response.data.main.temp;
  temperature = Math.round(temperature);
  changeTempurature(temperature);
  changeWindSpeed(response.data.wind.speed);
  changePressure(response.data.main.pressure);
  changeHumidity(response.data.main.humidity);
  changeSunParameter(response.data.sys.sunrise, response.data.sys.sunset);
  showDayAndTime(response.data.dt);
  showDescription(response.data.weather[0].description);
  showCity(response.data.name);
  ChangeImage(response.data.weather[0].icon, response.data.weather[0].value);
  getForcast(response.data.coord);
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
//display forcast

function displayForcast(response) {
  let forcastArray = response.data.daily;

  let forcastTemperature = document.querySelector("#weather-forcast");
  forcastTemperature.innerHTML = ``;
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  forcastArray.forEach(function (forcastDay, index) {
    if (index < 4) {
      let currentDate = new Date(forcastDay.dt * 1000);
      let day = days[currentDate.getDay()];
      let forcastHTML = `
              <div class="row p-1 g-1 weather-forcast-card ">
                  <div class="card">
                    <div class="weather-forcast-date p-1 g-1">${day}</div>
                    <img src="http://openweathermap.org/img/wn/${
                      forcastDay.weather[0].icon
                    }@2x.png" class="card-img-top weather-forcast-img" alt="...">
                    <div class="weather-forcast-temp">
                    <span class="weather-forcast-temp-max">${Math.round(
                      forcastDay.temp.max
                    )}</span><span>°</span>
                    <span class="weather-forcast-temp-min">${Math.round(
                      forcastDay.temp.min
                    )}</span><span>°</span>   
                  </div>
                </div>
              </div>`;
      forcastTemperature.innerHTML += forcastHTML;
    }
  });
}
function getForcast(coordinate) {
  let apiKey = "cb286bad3607984b41ed10c8de5cf00e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinate.lat}&lon=${coordinate.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForcast);
}

import { API_kEY } from "../private/keys.js";

const BASE_URL = `https://api.weatherapi.com/v1`;
const searchEl = document.getElementsByClassName("search-form")[0];
const inputEl = document.getElementsByClassName("search")[0];
const popupEl = document.getElementsByClassName("popup")[0];
const popupListEl = document.getElementsByClassName("search-list")[0];
const conditionEl = document.getElementsByClassName("weather-condition")[0];
const temperatureEl = document.getElementsByClassName("temperature")[0];
const locationEl = document.getElementsByClassName("location")[0];
const lastUpdatedTime = document.getElementsByClassName("last-updated-time")[0];
const getCurrentLocationEl =
  document.getElementsByClassName("current-location")[0];
const forecastContainerEl = document.getElementsByClassName("forecast-container")[0];
let searchResponseList;

async function getRequest(url = "") {
  const response = await fetch(url);
  return response.json();
}

let timeout;
function debounce(func, params, delay) {
  clearTimeout(timeout);
  timeout = setTimeout(func.bind(params), delay);
}

function showLoader() {
  inputEl.classList.toggle("loader", true);
}

function removeLoader() {
  inputEl.classList.toggle("loader", false);
}

function getWeatherData(param) {
  showLoader();
  clearTimeout(timeout);
  const conditionIcon = document.createElement("img");
  const conditionText = document.createElement("div");
  popupEl.classList.toggle("show", false);
  popupListEl.innerHTML = null;
  forecastContainerEl.innerHTML = null;
  getRequest(param).then((response) => {
    console.log(response);
    conditionEl.innerHTML = null;
    conditionIcon.src = `${response.current?.condition?.icon}`;
    conditionEl.appendChild(conditionIcon);
    conditionText.innerHTML = `${response.current?.condition?.text} | Feels like ${response.current?.feelslike_c}°C`;
    conditionText.className = `condition-text`;
    conditionEl.appendChild(conditionText);
    temperatureEl.innerHTML = `${response?.current?.temp_c}<sup>°C</sup>`;
    locationEl.innerHTML = `${response?.location?.name}, ${response?.location?.country}`;
    const updatedTime = new Date(response?.current?.last_updated);
    lastUpdatedTime.innerHTML = `${updatedTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    response.forecast?.forecastday?.forEach((forecastObj) => {
      let forecastItem = document.createElement('div');
      forecastItem.className = `forecast-item`;
      let leftContent = document.createElement('div');
      leftContent.className = `left-content`;
      let rightContent = document.createElement('div');
      rightContent.className = `right-content`;
      let day = document.createElement('div');
      day.className = `day`;
      let weatherText = document.createElement('div');
      weatherText.className = `weather-text`;

      day.innerHTML = new Date(forecastObj.date).getDate() === new Date().getDate() ? 'Today' : new Date(forecastObj.date).toDateString();
      weatherText.innerHTML = forecastObj.day?.condition?.text;

      leftContent.appendChild(day);
      leftContent.appendChild(weatherText);

      let minMaxTemp = document.createElement('div');
      minMaxTemp.className = `min-max-temp`;

      let maxTempSpan = document.createElement('p');
      let minTempSpan = document.createElement('p');
      let weatherIcon = document.createElement('img');
      maxTempSpan.innerHTML = `↑ ${parseInt(forecastObj.day.maxtemp_c)}°C`;
      minTempSpan.innerHTML = `↓ ${parseInt(forecastObj.day.mintemp_c)}°C`;
      maxTempSpan.classList.toggle('min-max-temp-text', true);
      minTempSpan.classList.toggle('min-max-temp-text', true);
      weatherIcon.src = `${forecastObj.day?.condition?.icon}`;
      minMaxTemp.appendChild(maxTempSpan);
      minMaxTemp.appendChild(minTempSpan);

      rightContent.appendChild(weatherIcon);
      rightContent.appendChild(minMaxTemp);

      forecastItem.appendChild(leftContent);
      forecastItem.appendChild(rightContent);

      forecastContainerEl.appendChild(forecastItem);
      forecastContainerEl.classList.toggle('show', true);
    })
    removeLoader();
  });
}

function getCurrentLocation() {
  showLoader();
  inputEl.value = "";
  temperatureEl.innerHTML = null;
  lastUpdatedTime.innerHTML = null;
  conditionEl.innerHTML = null;
  locationEl.innerHTML = null;
  navigator.geolocation.getCurrentPosition((location) => {
    console.log(location);
    removeLoader();
    getWeatherData(
      `${BASE_URL}/forecast.json?key=${API_kEY}&q=${location.coords.latitude},${location.coords.longitude}&days=10&aqi=no&alerts=no`
    );
  });
}

searchEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchStr = document.getElementById("search");
  temperatureEl.innerHTML = null;
  lastUpdatedTime.innerHTML = null;
  conditionEl.innerHTML = null;
  forecastContainerEl.classList.toggle('show', false);
  if (searchStr.value) {
    getWeatherData(
      // `${BASE_URL}/current.json?key=${API_kEY}&q=${searchStr.value}`,
      `${BASE_URL}/forecast.json?key=${API_kEY}&q=${searchStr.value}&days=10&aqi=no&alerts=no`
    );
  } else {

    locationEl.innerHTML = `Please enter a city name in search bar (or [cityName, countryName])`;
  }
});

function onSearch() {
  const searchStr = document.getElementById("search");
  popupListEl.innerHTML = null;
  if (searchStr.value?.length < 3) {
    popupEl.classList.toggle("show", false);
    return;
  }
  showLoader();
  getRequest(
    `${BASE_URL}/search.json?key=${API_kEY}&q=${searchStr.value}`
  ).then((response) => {
    if (response.length) {
      response.forEach((element) => {
        searchResponseList = response;
        const searchedResult = document.createElement("li");
        searchedResult.id = element.id;
        searchedResult.addEventListener("click", (event) =>
          searchItemClicked(event)
        );
        searchedResult.classList = "search-result-item";
        searchedResult.innerHTML = `${element.name}, ${element.region}, ${element.country}`;
        popupListEl.appendChild(searchedResult);
      });
    } else {
      const searchedResult = document.createElement("li");
      searchedResult.innerHTML = `No result found`;
      popupListEl.appendChild(searchedResult);
    }
    popupEl.classList.toggle("show", true);
    removeLoader();
  });
}

function searchItemClicked(event) {
  const [clickedItem, ...rest] = searchResponseList.filter((item) => {
    return parseInt(event.target.id) === parseInt(item.id);
  });
  const searchInputEl = document.getElementById("search");
  searchInputEl.value = clickedItem.name;
  getWeatherData(
    `${BASE_URL}/forecast.json?key=${API_kEY}&q=${searchInputEl.value}&days=10&aqi=no&alerts=no`
  );
}

searchEl.addEventListener("input", (event) => {
  debounce(onSearch, event, 500);
});

getCurrentLocationEl.addEventListener("click", getCurrentLocation);

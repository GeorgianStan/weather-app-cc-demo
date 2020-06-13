window.onload = function () {
  const OPEN_CAGE_API_KEY = ""; //"<your_opencage_api_key>"
  const CC_API_KEY = ""; //"<your_climacell_api_key>"

  if (!OPEN_CAGE_API_KEY || !CC_API_KEY) {
    throw new Error("Provide ClimaCell and OpenCagi Keys");
  }

  const getOpenCageUrl = (location) =>
    `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${OPEN_CAGE_API_KEY}`;

  const getClimaCellUrl = (lat, lon) =>
    `https://api.climacell.co/v3/weather/forecast/daily?lat=${lat}&lon=${lon}&unit_system=si&fields=weather_code&fields=temp&fields=wind_speed&fields=humidity&apikey=${CC_API_KEY}`;

  /**
   * * Get geocode for a given location
   */
  async function getCityGeoCode(location) {
    const openCageUrl = getOpenCageUrl(location);

    const openCageRes = await fetch(openCageUrl);
    const openCageData = await openCageRes.json();

    let min = Math.min();
    let bestCityResult;

    openCageData.results.forEach((r) => {
      if (r.confidence < min) {
        bestCityResult = r;
        min = r.confidence;
      }
    });

    return bestCityResult;
  }

  /**
   * * Get weather data for a given location
   */
  async function getWeatherData(lat, lng) {
    const climaCellUrl = getClimaCellUrl(lat, lng);

    const climaCellRes = await fetch(climaCellUrl);
    const climaCellData = await climaCellRes.json();

    return climaCellData;
  }

  /**
   * * Show the current city in toolbar
   */
  function showFoundLocation(formattedLocation) {
    document.querySelector("#formatted-location").innerHTML = formattedLocation;
  }

  /**
   * * Build the weater cards
   */
  function buildWeatherCards(weatherData) {
    document.querySelector("main").innerHTML = "";

    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    weatherData.forEach((data) => {
      const weatherCardDemo = document
        .querySelector("#weather-card-demo")
        .cloneNode(true);

      // ? set date
      const dateWrapper = weatherCardDemo.querySelector("header").children[0];

      const datOfTheWeek =
        weekDays[new Date(data.observation_time.value).getDay()];
      dateWrapper.querySelectorAll("span")[0].innerHTML = datOfTheWeek;

      dateWrapper.querySelectorAll("span")[1].innerHTML =
        data.observation_time.value;

      // ? set weather code image
      const weatherCodeImg = weatherCardDemo
        .querySelector("header")
        .children[1].querySelector("img");

      weatherCodeImg.setAttribute(
        "src",
        `/assets/images/summary-icons/${data.weather_code.value}.svg`
      );

      // ? set temperature
      const temperatureValuesElements = weatherCardDemo
        .querySelector("section")
        .children[0].querySelectorAll("span");

      temperatureValuesElements[0].innerHTML = `Min: ${data.temp[0].min.value} ${data.temp[0].min.units}`;
      temperatureValuesElements[1].innerHTML = `Max: ${data.temp[1].max.value} ${data.temp[1].max.units}`;

      // ? set wind speed
      const windSpeedElements = weatherCardDemo
        .querySelector("section")
        .children[1].querySelectorAll("span");

      windSpeedElements[0].innerHTML = `Min: ${data.wind_speed[0].min.value} ${data.wind_speed[0].min.units}`;
      windSpeedElements[1].innerHTML = `Max: ${data.wind_speed[1].max.value} ${data.wind_speed[1].max.units}`;

      // ? set humidity
      const humidityElements = weatherCardDemo
        .querySelector("section")
        .children[2].querySelectorAll("span");

      humidityElements[0].innerHTML = `Min: ${data.humidity[0].min.value} ${data.humidity[0].min.units}`;
      humidityElements[1].innerHTML = `Max: ${data.humidity[1].max.value} ${data.humidity[1].max.units}`;

      // ? show it
      weatherCardDemo.classList.remove("hidden");
      document.querySelector("main").append(weatherCardDemo);
    });
  }

  /**
   * * On fetch data
   */
  async function onFetchData() {
    const inputElement = document.querySelector("#location-name-input");
    const inputLocation = inputElement.value;

    if (!inputLocation) {
      return;
    }

    const foundLocation = await getCityGeoCode(inputLocation);

    if (!foundLocation) {
      alert("No location found");
      return;
    }

    showFoundLocation(foundLocation.formatted);

    const weatherData = await getWeatherData(
      foundLocation.geometry.lat,
      foundLocation.geometry.lng
    );

    buildWeatherCards(weatherData);
    inputElement.value = "";
  }

  /**
   * * Main
   */
  (async function () {
    document
      .querySelector("#fetch-data-btn")
      .addEventListener("click", onFetchData);

    document
      .querySelector("#location-name-input")
      .addEventListener("keyup", () => {
        if (event.keyCode === 13) {
          onFetchData();
        }
      });
  })();
};

"use strict";
let cityLat = "";
let cityLong = "";

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
    /*$("#btn").click(function(){*/
    const searchTerm = $("#js-search-term").val();

    getLatLon(searchTerm);
  });
}
/*====================
MAPQUEST API - CONVERTS USER INPUT INTO LAT/LONG COORDINATES
====================*/
function getLatLon(searchTerm) {
  const geoApiKey = "x2dT9Njrrg5OJdEj9jYpAaglaf2AYdR5";

  const geoURL = "https://www.mapquestapi.com/geocoding/v1/address";

  const params = {
    key: geoApiKey,
    location: searchTerm
  };

  const queryString = formatQueryParams(params);

  const searchURL = geoURL + "?" + queryString;

  console.log(searchURL);

  fetch(searchURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}
/*Creates object keys*/
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key =>
      `${encodeURIComponent(key)}=${encodeURIComponent(params[key]).replace(
        /%2C/g,
        ","
      )}`
  );
  return queryItems.join("&");
}
/* Displays Results to page */
function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();

  let i = 0;
  $("#results-list").append(`<li><h3>Results</h3>
      <p>Latitude = ${
        responseJson.results[i].locations[0].displayLatLng.lat
      }</p>
      <p>Longitude = ${
        responseJson.results[i].locations[0].displayLatLng.lng
      }</p>`);

  //remove hidden &display the results section
  $("#results").removeClass("hidden");
  cityLat = `${responseJson.results[i].locations[0].displayLatLng.lat}`;

  cityLong = `${responseJson.results[i].locations[0].displayLatLng.lng}`;
  //CALL REST OF API's
  consolePrint();
  getHikingTrails();
  getWeatherForecast();
}

//confirms cityLat & cityLong have been changed
function consolePrint() {
  console.log(cityLat);
  console.log(cityLong);
}
/*===================
HIKING PROJECT API - takes GPS Coordinates & returns city trails
=================== */
function getHikingTrails() {
  const trailApiKey = "200533548-26ee95d93063384ab58050efb99c71e4";

  const trailURL = "https://www.hikingproject.com/data/get-trails";

  const params = {
    key: trailApiKey,
    lat: cityLat,
    lon: cityLong
  };

  const queryString = formatQueryParams(params);

  const searchURL = trailURL + "?" + queryString;

  console.log(searchURL);

  fetch(searchURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayTrailResults(responseJson))
    .catch(err => {
      $("#js-error-message2").text(
        `Something went wrong in the Trails API: ${err.message}`
      );
    });
}

function displayTrailResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-getTrails").empty();

  for (let i = 0; i < responseJson.trails.length; i++) {
    $("#results-getTrails").append(`<li><a href= "${
      responseJson.trails[i].url
    }"><h3>${responseJson.trails[i].name}</h3></a>
  <img src= "${responseJson.trails[i].imgSmallMed}"
      <p>${responseJson.trails[i].stars}</p>
      <p>${responseJson.trails[i].summary}</p>
      <p>${responseJson.trails[i].location}</p>
      <p>${responseJson.trails[i].length}</p>`);
  }
  //remove hidden &display the trails section
  $("#getTrails").removeClass("hidden");
  cityLat = `${responseJson.results[i].locations[0].displayLatLng.lat}`;
}

/*===================
WEATHER UNLOCKED API - takes GPS Coordinates, shortens to 3 decimals & returns weather forcast
=================== */
function getWeatherForecast() {
  const weatherApiKey = "81b3b90d03c810c1e29fb17d3c6c3b96";

  const weatherAppID = "b484ec7e";

  const weatherURL = "http://api.weatherunlocked.com/api/forecast";

  const params = {
    app_id: weatherAppID,
    app_key: weatherApiKey
  };

  const queryString = formatQueryParams(params);

  //round to fixed 3 decimal place
  const newCityLat = Math.round(cityLat * 1000) / 1000;

  const newCityLong = Math.round(cityLong * 1000) / 1000;

  console.log(newCityLat);

  console.log(newCityLong);

  const searchURL =
    weatherURL + "/" + newCityLat + "," + newCityLong + "?" + queryString;

  console.log(searchURL);

  fetch(searchURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayWeatherResults(responseJson))
    .catch(err => {
      $("#js-error-message3").text(
        `Something went wrong, Weather API: ${err.message}`
      );
    });
}

function displayWeatherResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-getWeather").empty();

  for (let i = 0; i < responseJson.Days.length; i++) {
    $("#results-getWeather").append(`<li><h3>${responseJson.Days[i].date}</h3>
        <img src="https://github.com/cssteffen/Go-Be_Active-API/blob/master/Images/setgif/${
          responseJson.Days[i].Timeframes[2].wx_icon
        }">
        <p>${responseJson.Days[i].Timeframes[2].wx_desc}</p>
        <p>High: ${responseJson.Days[i].temp_max_f}&#8457;</p>
        <p>Low: ${responseJson.Days[i].temp_min_f}&#8457;</p>`);
  }
  //remove hidden &display the weather section
  $("#getWeather").removeClass("hidden");
}

$(watchForm);

/*=========================
CODE SNIPPET from previous News API assignment example
===========================
     <img src="${responseJson.Days[i].Timeframes[4].wx_icon}">
 changes 

function getNews(query, maxResults=10) {
  const params = {
    q: query,
    language: "en",
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  const options = {
    headers: new Headers({
      "X-Api-Key": apiKey})
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

*/

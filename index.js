"use strict";
let cityLat = "";
let cityLong = "";

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
    /*$("#btn").click(function(){*/
    const searchTerm = $("#js-search-term").val();
    $(".js-cityWeather").text(`${searchTerm} Weather`);

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
  //$("#results").removeClass("hidden");
  $(".Title").removeClass("hidden");
  $(".resultsBox").removeClass("hidden");
  $(".shareSection").removeClass("positionAbsolute");

  cityLat = `${responseJson.results[i].locations[0].displayLatLng.lat}`;
  cityLong = `${responseJson.results[i].locations[0].displayLatLng.lng}`;

  //////////CALL REST OF API's/////////////
  consolePrint();
  getHikingTrails();
  getWeatherForecast();
  getSports();
  getMusic();
  getPlays();
  getMusic();
  getPlays();

  ////////////////////////////////////////
}

//confirms cityLat & cityLong have been changed
function consolePrint() {
  console.log(cityLat);
  console.log(cityLong);
}

/*==============================================================
HIKING PROJECT API - takes GPS Coordinates & returns city trails
=============================================================== */

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
    <p>${responseJson.trails[i].summary}</p>
  <img src= "${responseJson.trails[i].imgSmallMed}" class="apiImage"<br>
      <p>${responseJson.trails[i].location} | ${
      responseJson.trails[i].length
    } mi.</p>
      <p>${responseJson.trails[i].stars} Stars</p>`);
  }
  //remove hidden &display the trails section
  $("#getTrails").removeClass("hidden");
  cityLat = `${responseJson.results[i].locations[0].displayLatLng.lat}`;
}

/*====================================================================
WEATHER UNLOCKED API - takes GPS Coordinates, shortens to 3 decimals & returns weather forcast
====================================================================== */
function getWeatherForecast() {
  const weatherApiKey = "81b3b90d03c810c1e29fb17d3c6c3b96";

  const weatherAppID = "b484ec7e";

  const weatherURL =
    "https://cors-anywhere.herokuapp.com/api.weatherunlocked.com/api/forecast";

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
    $("#results-getWeather").append(`<div class="days"><li><h3>${
      responseJson.Days[i].date
    }</h3>
        <img src="./Images/setpng/${
          responseJson.Days[i].Timeframes[0].wx_icon
        }">
        <p>${responseJson.Days[i].Timeframes[0].wx_desc}</p>
        <p>High: ${responseJson.Days[i].temp_max_f}&#8457;</p>
        <p>Low: ${responseJson.Days[i].temp_min_f}&#8457;</p></div>`);
  }
  //remove hidden &display the weather section
  $("#getWeather").removeClass("hidden");
}

/*=========================================================================
SPORTS - EVENTS API - takes GPS Coordinates, returns events within 20 miles
========================================================================== */
function getSports() {
  const eventsApiKey = "3DAh6jhPsiI5KiAPITc9gcjuXJx5aE9R";
  const eventGeoLocation = cityLat + "," + cityLong;

  const eventsURL = "https://app.ticketmaster.com/discovery/v2/events.json";

  const params = {
    geoPoint: eventGeoLocation,
    apikey: eventsApiKey,
    radius: 20,
    unit: "miles",
    /*includeFamily: "yes",*/
    keyword: "sports"
  };

  const queryString = formatQueryParams(params);

  const searchURL = eventsURL + "?" + queryString;

  console.log(searchURL);

  fetch(searchURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displaySportsResults(responseJson))
    .catch(err => {
      $("#js-error-message4").text(
        `Something went wrong, Sports API: ${err.message}`
      );
    });
}

function displaySportsResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-getSports").empty();

  for (let i = 0; i < responseJson._embedded.events.length; i++) {
    $("#results-getSports").append(`<li><h3><a href="${
      responseJson._embedded.events[i].url
    }" target="_blank">${responseJson._embedded.events[i].name}</a></h3>
    <p>${responseJson._embedded.events[i].dates.start.localDate}</p>
    <img src="${
      responseJson._embedded.events[i].images[0].url
    }" class="apiImage">`);
  }
  //remove hidden & display the Sports section
  $("#getSports").removeClass("hidden");
}

/*=========================================================================
MUSIC - EVENTS API - takes GPS Coordinates, returns musical events within 20 miles
=========================================================================== */
function getMusic() {
  const eventsApiKey = "3DAh6jhPsiI5KiAPITc9gcjuXJx5aE9R";

  const eventGeoLocation = cityLat + "," + cityLong;

  const eventsURL =
    "https://cors-anywhere.herokuapp.com/app.ticketmaster.com/discovery/v2/events.json";

  const params = {
    geoPoint: eventGeoLocation,
    apikey: eventsApiKey,
    radius: "20",
    unit: "miles",
    /*includeFamily: "yes",*/
    keyword: "music"
  };

  const queryString = formatQueryParams(params);

  const searchURL = eventsURL + "?" + queryString;

  console.log(searchURL);

  fetch(searchURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayMusicResults(responseJson))
    .catch(err => {
      $("#js-error-message5").text(
        `Something went wrong, Music API: ${err.message}`
      );
    });
}

function displayMusicResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-getMusic").empty();

  for (let i = 0; i < responseJson._embedded.events.length; i++) {
    /*remove https: from image url to display image 
    let imageSrc = `${responseJson._embedded.events[i].images[0].url}`;
    let removeHttp = function(imageSrc) {
      return imageSrc.replace(/^(https?:|)\/\//, "");
    };
    let findSrc = removeHttp(imageSrc);
    */

    $("#results-getMusic").append(`<li><h3><a href="${
      responseJson._embedded.events[i].url
    }" target="_blank">${responseJson._embedded.events[i].name}</a></h3>
    <p>${responseJson._embedded.events[i].dates.start.localDate}</p>
      <img src="${
        responseJson._embedded.events[i].images[0].url
      }" class="apiImage">`);
  }
  //remove hidden & display the Sports section
  $("#getMusic").removeClass("hidden");
}

/*=========================================================================
PLAYS - EVENTS API - takes GPS Coordinates, returns musical events within 20 miles
=========================================================================== */
function getPlays() {
  const eventsApiKey = "3DAh6jhPsiI5KiAPITc9gcjuXJx5aE9R";

  const eventGeoLocation = cityLat + "," + cityLong;

  const eventsURL =
    "https://cors-anywhere.herokuapp.com/app.ticketmaster.com/discovery/v2/events.json";

  const params = {
    geoPoint: eventGeoLocation,
    apikey: eventsApiKey,
    radius: "20",
    unit: "miles",
    includeFamily: "yes",
    keyword: "theatre"
  };

  const queryString = formatQueryParams(params);

  const searchURL = eventsURL + "?" + queryString;

  console.log(searchURL);

  fetch(searchURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayPlaysResults(responseJson))
    .catch(err => {
      $("#js-error-message3").text(
        `Something went wrong, Plays API: ${err.message}`
      );
    });
}

function displayPlaysResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-getPlays").empty();

  for (let i = 0; i < responseJson._embedded.events.length; i++) {
    $("#results-getPlays").append(`<li><h3><a href="${
      responseJson._embedded.events[i].url
    }" target="_blank">${responseJson._embedded.events[i].name}</a></h3>
      <p>${responseJson._embedded.events[i].dates.start.localDate}</p>
        <img src="${
          responseJson._embedded.events[i].images[0].url
        }" class="apiImage">`);
  }
  //remove hidden & display the Events section
  $("#getPlays").removeClass("hidden");
}

$(watchForm);

/*=========================
CODE SNIPPET from previous News API assignment example
===========================
    <img src="${responseJson.events[i]._embedded.events.images[i].url}">

     <img src="${responseJson.Days[i].Timeframes[4].wx_icon}">
 changes 

function getEvents() {
  const eventsApiKey = "3DAh6jhPsiI5KiAPITc9gcjuXJx5aE9R";

  const eventGeoLocation = cityLat + "," + cityLong;

  const eventsURL = "https://app.ticketmaster.com/discovery/v2/events.json";

  const params = {
    geoPoint: eventGeoLocation,
    apikey: eventsApiKey
  };

 function displayEventResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-getEvents").empty();

  for (let i = 0; i < responseJson._embedded.events.length; i++) {
    $("#results-getEvents").append(`<li><h3><a href="${
      responseJson._embedded.events[i].url
    }" target="_blank">${responseJson._embedded.events[i].name}</a></h3>
    <p>${responseJson._embedded.events[i].dates.start.localDate}</p>
      <p>${responseJson._embedded.events[i].info}</p>
      <img src="${responseJson._embedded.events[i].images.url}">`);
  }

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

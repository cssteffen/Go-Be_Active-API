"use strict";

let cityLat = "";
let cityLong = "";

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
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
  //scroll_to_anchor($("#scrollDownResults"));
  $(".Title").removeClass("hidden");
  $(".resultsBox").removeClass("hidden");
  $(".sectionBox").removeClass("hidden");
  $(".shareSection").removeClass("positionAbsolute");

  cityLat = `${responseJson.results[i].locations[0].displayLatLng.lat}`;
  cityLong = `${responseJson.results[i].locations[0].displayLatLng.lng}`;

  //////////CALL REST OF API's/////////////
  getWeatherForecast();
  getSports();
  getMusic();
  getPlays();
  consolePrint();
  getHikingTrails();
  ////////////////////////////////////////
}

//confirms cityLat & cityLong have been changed
function consolePrint() {
  console.log(cityLat);
  console.log(cityLong);
}

//scolls to results once loaded when submit button is pushed
function scroll_to_anchor(tag) {
  $("html,body").animate({ scrollTop: tag.offset().top }, "slow");
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
      $("#results-getTrails")
        .append(`<li class="unit"><h3>Unable to find Trails at this time</h3>
        <p>Try another city or</p><a href="https://www.alltrails.com/ target="_blank""><button class="sorry-btn">Search All-Trails</button></a>
`);
    });
}

function displayTrailResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-getTrails").empty();

  for (let i = 0; i < responseJson.trails.length; i++) {
    $("#results-getTrails").append(`<li class="unit"><a href= "${
      responseJson.trails[i].url
    }" target="_blank"><h3>${responseJson.trails[i].name}</h3></a>
    <p>${responseJson.trails[i].summary}</p>
  <img src= "${responseJson.trails[i].imgSmallMed}" class="apiImage"<br>
      <p>${responseJson.trails[i].location} | ${
      responseJson.trails[i].length
    } mi.</p>
      <p>${responseJson.trails[i].stars} Stars</p>`);
  }
  if ($("#results-getTrails") === "") {
    $("results-getTrails").append(
      `<li class="unit"><h3>No Trails found</h3>
      <p>Try another city or</p>
      <a href="https://www.alltrails.com/ target="_blank""><button class="sorry-btn">Search All-Trails</button></a>`
    );
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

  for (let i = 1; i < responseJson.Days.length; i++) {
    let apiDate = responseJson.Days[i].date;
    let day = getWeatherDay(apiDate);
    $("#results-getWeather").append(`<div class="days"><li>
        <img src="https://cssteffen.github.io/Go-Be_Active-API/Images/setgif/${
          responseJson.Days[i].Timeframes[1].wx_icon
        }"><h4>${day}</h4>
        <p>${responseJson.Days[i].Timeframes[1].wx_desc}<br>High: ${
      responseJson.Days[i].temp_max_f
    }&#8457;<br>Low: ${responseJson.Days[i].temp_min_f}&#8457;</p></div>`);
  }
  //remove hidden &display the weather section
  $("#getWeather").removeClass("hidden");
  scroll_to_anchor($("#scrollDownResults"));
}

/*=========================
WEATHER - DATE LABEL SCRIPT
===========================*/
function getWeatherDay(date) {
  let dateArr = date.split("/");
  let monthPart = dateArr[1];
  let dayPart = dateArr[0];
  let yearPart = dateArr[2];
  dateArr[0] = yearPart;
  dateArr[1] = monthPart;
  dateArr[2] = dayPart;

  return moment(dateArr.join("-")).format("dddd"); // ex. Wednesday
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
      $("#results-getSports")
        .append(`<li class="unit"><h3>Unable to find Sporting Events at this time</h3>
        <p>Try another location or</p>
        <a href="https://www.stubhub.com/" target="_blank"><button class="sorry-btn">Search Stubhub</button></a>`);
    });
}

function displaySportsResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-getSports").empty();

  for (let i = 0; i < responseJson._embedded.events.length; i++) {
    let findDate = `${responseJson._embedded.events[i].dates.start.localDate}`;
    let readableDate = getDate(findDate);
    $("#results-getSports").append(`<li class="unit"><a href="${
      responseJson._embedded.events[i].url
    }" target="_blank"><h3>${responseJson._embedded.events[i].name}</h3></a>
    <p>${readableDate}</p>
    <img src="${
      responseJson._embedded.events[i].images[0].url
    }" class="apiImage">`);
  }
  if (responseJson._embedded.events.length === 0) {
    $("#results-getSports").append(
      `<li class="unit"><h3>No Sporting Events found</h3>
      <p>Try another location or</p>
      <a href="https://www.stubhub.com/" target="_blank"><button class="sorry-btn">Search StubHub</button></a>`
    );
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
      $("#results-getMusic")
        .append(`<li class="unit"><h3>Unable to find Music Events at this time</h3>
        <p>Try another location or</p>
        <a href="https://www.stubhub.com/" target="_blank"><button class="sorry-btn">Search Stubhub</button></a>`);
    });
}

function displayMusicResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-getMusic").empty();

  if (responseJson._embedded.events.length === 0) {
    $("#results-getMusic").append(
      `<li class="unit"><h3>No Music Events found</h3>
<p>Try another location or</p><a href="https://www.stubhub.com/" target="_blank"><button class="sorry-btn">Search StubHub</button></a>
        `
    );
    $("#getMusic").removeClass("hidden");
  } else {
    for (let i = 0; i < responseJson._embedded.events.length; i++) {
      let findDate = `${
        responseJson._embedded.events[i].dates.start.localDate
      }`;
      let readableDate = getDate(findDate);
      $("#results-getMusic").append(`<li class="unit"><a href="${
        responseJson._embedded.events[i].url
      }" target="_blank"><h3>${responseJson._embedded.events[i].name}</h3></a>
    <p>${readableDate}</p>
      <img src="${
        responseJson._embedded.events[i].images[0].url
      }" class="apiImage">`);
    }
    //remove hidden & display the Sports section
    $("#getMusic").removeClass("hidden");
  }
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
      $("#results-getPlays")
        .append(`<li class="unit"><h3>Unable to find Theatre Events at this time</h3>
        <p>Try another location or</p>
        <a href="https://www.stubhub.com/" target="_blank"><button class="sorry-btn">Search StubHub</button></a>`);
    });
}

function displayPlaysResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-getPlays").empty();

  if (responseJson._embedded.events.length === 0) {
    $("#results-getPlays")
      .append(`<li class="unit"><h3>No Theatre Events found</h3>
<p>Try another location or</p><a href="https://www.stubhub.com/" target="_blank"><button class="sorry-btn">Search StubHub</button></a>
        `);
    $("#getPlays").removeClass("hidden");
  } else {
    for (let i = 0; i < responseJson._embedded.events.length; i++) {
      let findDate = `${
        responseJson._embedded.events[i].dates.start.localDate
      }`;
      let readableDate = getDate(findDate);
      $("#results-getPlays").append(`<li class="unit"><a href="${
        responseJson._embedded.events[i].url
      }" target="_blank"><h3>${responseJson._embedded.events[i].name}</h3></a>
      <p>${readableDate}</p>
        <img src="${
          responseJson._embedded.events[i].images[0].url
        }" class="apiImage">`);
    }
    //remove hidden & display the Events section
    $("#getPlays").removeClass("hidden");
  }
}

/*=========================
DATE LABEL SCRIPT
===========================*/
function getDate(date) {
  let dateFormat = new Date("2019-10-24");
  new Date(date);
  let result = "";

  result += moment(date).format("l"); // ex. 7/31/2019
  //result += moment().format("LL"); // ex. July 31, 2019
  //result += moment().format("MMM Do YY"); // July 31st 19
  return result;
}

$(watchForm);

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

  consolePrint();
}

//confirms cityLat & cityLong have been changed
function consolePrint() {
  console.log(cityLat);
  console.log(cityLong);
}
/*===================
NEXT FUNCTIONING API
=================== */

$(watchForm);

/*=========================
CODE SNIPPET from previous News API assignment example
===========================


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

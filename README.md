Go-Be Active
https://cssteffen.github.io/Go-Be_Active-API/

Web app that allows users to input a city and state and returns information for local events, hiking trails and weather. Utilizes Mapquest API, TicketMaster API, Hiking Project API and WeatherUnlocked API.

Motivation:
Living in Colorado, we have a lot of company between friends and family coming to visit our beautiful state. I am constantly searching for local evennts and new trails to take them to. However, this resource would be great for those visiting a new location and wanting to explore like a local.

Screen Schots:

Home Screen/Landing Page:
<img src="https://user-images.githubusercontent.com/30050423/62484557-f76d4400-b7a9-11e9-92c7-23efa5be14f4.png">

Result Page:
<img src="https://user-images.githubusercontent.com/30050423/62484642-2aafd300-b7aa-11e9-9e47-b8c36b8c6f82.png">

Summary
The user inputs a city and state into the form input.
Once the form is submitted, the City, State input is converted into geographical points using the MapQuest API.

    The returned latitude and longitude points are then used in calling the Hiking Project API, TicketMaster API and WeatherUnlocked API the local weather, trails and events in that location.

Built with:
HTML/CSS/JavaScript/jQuery

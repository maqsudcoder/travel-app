/*
Project: TRAVEL APP
Author: Maqsud
Starter date: 07/12/2021
Bootcamp: Udacity
*/

// Setup empty Js object to act as an endpoint for the server
projectData = {
  isWorking: true,
};

// dotenv
require('dotenv').config();

const fetch = require('cross-fetch');

// Setup express server
const express = require('express');
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors for cross origin resource sharing
const cors = require('cors');
app.use(cors());

// initialize the main project folder
app.use(express.static('dist'));

// Setup server
const server = app.listen(9090, () => {
  console.log(`🏃‍♂️- server is running on port http://localhost:9090`);
});

// GET raute
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

app.get('/all', (req, res) => {
  res.send(projectData);
});

// POST route
app.post('/data', (req, res) => {
  // city name from user
  projectData.city = req.body.city;
  projectData.date = req.body.date;

  console.log('🌠 - something come from user', projectData.city);

  // setup geonames API
  fetch(`http://api.geonames.org/searchJSON?q=${projectData.city}&maxRows=1&username=${process.env.GEONAMES_USERNAME}`)
    .then((response) => response.json())
    .then((geonames) => {
      console.log('🌍 - geonames is rolling');
      projectData.countryName = geonames.geonames[0].countryName;

      // setup weatherbit API
      fetch(`https://api.weatherbit.io/v2.0/current?lat=${geonames.geonames[0].lat}&lon=${geonames.geonames[0].lng}&key=${process.env.WEATHERBIT_API_KEY}`)
        .then((response) => response.json())
        .then((weatherbit) => {
          console.log('🥵 - weather is reported');
          projectData.weather = weatherbit.data[0].weather.description;
          projectData.temp = weatherbit.data[0].temp;
          projectData.realFeel = weatherbit.data[0].app_temp;

          // setup openweathermap API
          fetch(`https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${projectData.city}&image_type=photo&pretty=true`)
            .then((response) => response.json())
            .then((pixabay) => {
              console.log('🖼️ - pixabay img is ready');
              projectData.img = pixabay.hits[Math.floor(Math.random() * 20)].webformatURL;

              // final response
              res.send(projectData);
              console.log('🏁 - all data is sent');
            });
        });
    });
});

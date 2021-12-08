console.log('❤️‍🩹 - Welcome to the weather app');

// global variables
let trips = []; // all the trips are stored in the trips array
let latestTrip = []; // the latest trip is stored in the latestTrip array

// if user refreshes the page, the UI will be updated with the latest trip (if any)
window.onload = () => {
  if (trips == '' && JSON.parse(localStorage.getItem('trips')) != null) {
    // set trips array to the value of the localStorage that helps to update the UI
    trips = JSON.parse(localStorage.getItem('trips'));
    updateUI();

    console.log('👏 - trips came from local storage and updated UI');
  }
};

// select submit button
document.getElementById('submit').addEventListener('click', performAction);

function performAction(e) {
  e.preventDefault();
  console.log('👟 - button clicked');

  // select input field
  const cityVl = document.getElementById('city').value;
  const dateVl = document.getElementById('date').value;

  // send data to server
  fetch('http://localhost:9090/data', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      city: cityVl,
      date: dateVl,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('👟 - data received from server: ', data);

      // select result div


      seeTrip(data);

      // add the latest trip to the search history and we can get the latest from this array
      latestTrip.push(data);

      console.log('user saved trips', trips);

      updateUI();
    })
    .catch((error) => console.error('😭 - moom! help me!', error));

  console.log('🏁 - button done');
}

// Add trip
document.getElementById('add').addEventListener('click', addTrip);

function addTrip(e) {
  e.preventDefault();
  console.log('💎 - adding trip');

  trips.push(latestTrip[latestTrip.length - 1]);
  localStorage.setItem('trips', JSON.stringify(trips));

  console.log('🍀 - done adding trip');

  updateUI();
}

// update UI function
function updateUI() {
  console.log('💎 - updating UI');

  // in case the is no trips in local storage it creates an empty array
  localStorage.setItem('trips', JSON.stringify(trips));

  const storedTrips = JSON.parse(localStorage.getItem('trips'));
  const tripsEl = document.querySelector('.trips__list');

  // removes all the trips from the UI
  while (tripsEl.firstChild) {
    tripsEl.removeChild(tripsEl.firstChild);
  }

  // add the latest trip to the UI
  for (let i = 0; i < storedTrips.length; i++) {
    tripsEl.innerHTML += `<div class="trip-card">
          <img src="${trips[i].img}" alt="city image" />
          <div class="trip-card__content">
            <h3>${trips[i].city}, ${trips[i].countryName}</h3>
            <p>Your trip starts in ${Client.getDate(trips[i].date)} days</p>
            <div class="trips-card__weather">
              <p>Weather report</p>
              <div class="trips-card__weather-list">
                <p><ion-icon name="thermometer-outline"></ion-icon> Temprature - <span>${trips[i].temp}</span>&deg;C</p>
                <p><ion-icon name="accessibility-outline"></ion-icon> Feels - <span>${trips[i].realFeel}</span>&deg;C</p>
                <p><ion-icon name="earth-outline"></ion-icon> Sky - <span>${trips[i].weather}</span></p>
              </div>
            </div>
          </div>
        </div>`;
  }

  console.log('🍀 - done updating UI');
}

// refresh qigandan keyin ishlamayabdi

function seeTrip(data) {
  // I bet you cannot understand this code
  document.getElementById('city-name').innerHTML = data.city;
  document.getElementById('city-name-mini').innerHTML = data.city;
  document.getElementById('country-name').innerHTML = data.countryName;
  document.getElementById('country-name-mini').innerHTML = data.countryName;
  document.getElementById('starting-date').innerHTML = data.date;
  document.getElementById('days-left').innerHTML = Client.getDate(data.date);
  document.getElementById('temp').innerHTML = data.temp;
  document.getElementById('realFeel').innerHTML = data.realFeel;
  document.getElementById('sky').innerHTML = data.weather;
  document.getElementById('info').style.backgroundImage = 'url(' + data.img + ')';
}

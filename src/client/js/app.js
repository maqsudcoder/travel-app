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
      document.getElementById('report').innerHTML = `${data.city}, ${data.countryName} is ${Client.getDate(dateVl)} days away, weather is ${data.weather}`;
      document.getElementById('img').src = data.img;
      document.getElementById('info').style.backgroundImage = 'url(' + data.img + ')';
      console.log(document.getElementById('info'));

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
  const tripsEl = document.getElementById('trips');

  // removes all the trips from the UI
  while (tripsEl.firstChild) {
    tripsEl.removeChild(tripsEl.firstChild);
  }

  // add the latest trip to the UI
  for (let i = 0; i < storedTrips.length; i++) {
    tripsEl.innerHTML += `<li>City: ${storedTrips[i].city}</li>`;
  }

  console.log('🍀 - done updating UI');
}

// refresh qigandan keyin ishlamayabdi

function seeTrip(data) {
  document.getElementById('city-name').innerHTML = data.city;
  document.getElementById('city-name-mini').innerHTML = data.city;
  document.getElementById('country-name').innerHTML = data.countryName;
  document.getElementById('country-name-mini').innerHTML = data.countryName;
  document.getElementById('starting-date').innerHTML = data.date;
  document.getElementById('days-left').innerHTML = Client.getDate(data.date);
  document.getElementById('temp').innerHTML = data.temp;
  document.getElementById('realFeel').innerHTML = data.realFeel;
  document.getElementById('sky').innerHTML = data.weather;
}

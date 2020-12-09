
//displays Today date
let todayDate = document.getElementById("date");
const option = { weekday: "long", month: "short", day: "numeric" };
const today = new Date();
todayDate.innerHTML = today.toLocaleDateString("en-US", option);

// limit values in calendar
var now = new Date();
var minDate = new Date(now.toUTCString().slice(0, -4));
var maxDate = new Date(now.toUTCString().slice(0, -4));
minDate.setTime(minDate.getTime()-(7 * 24 * 60 * 60 * 1000));
maxDate.setTime(maxDate.getTime()+(7 * 24 * 60 * 60 * 1000));
var minDateStr = minDate.toISOString().split('T')[0];
var maxDateStr = maxDate.toISOString().split('T')[0];
document.getElementById("bookingDate").setAttribute('min', minDateStr);
document.getElementById("bookingDate").setAttribute('max', maxDateStr);

function clearSessionField(){
  let bookSession = document.getElementById("bookingSession");
  bookSession.value = "";
  seatsBooked.innerHTML = ""; 
  seatsAvalaible.innerHTML = "";
}

function dateChange() {
  clearSessionField();
  let bookDate = document.getElementById("bookingDate");
  var myDate = bookDate.valueAsDate;
  if (myDate == null) {
    setAllowSessionInput(false);
    return;
  }
  var currentDate = new Date();
  currentDate.setHours(0,0,0,0);
  var maxDate = currentDate.getTime() + (7 * 24 * 60 * 60 * 1000);
  var minDate = currentDate.getTime() - (7 * 24 * 60 * 60 * 1000);

  //jen dvoji kontrola omezeni limitu na zobrazeni datumu, kdyby neco
  if (myDate < minDate) {
    alert = "Only 7 days are available for booking.";
    setAllowSessionInput(false);
    return;
  }

  if (myDate > maxDate) {
    alert = "Only 7 days are available for booking.";
    setAllowSessionInput(false);
    return;
  }
  setAllowSessionInput(true);
}

function setAllowSessionInput(enable) {
  document.getElementById("bookingSession").disabled = !enable;
  if (!enable) {
    setBookButtonState(false);
  }
}

function sessionChange() {
  let bookDate = document.getElementById("bookingDate");
  console.log(bookDate.valueAsDate)
  let storageKey = getStorageKey();
  let session = retreiveOrCreate(storageKey);
  displayAvailableSeats(session);
  setAllowBookButton(session);
}

function getStorageKey() {
  let bookDate = document.getElementById("bookingDate");
  let bookTime = document.getElementById("bookingSession");
  return bookDate.value + "_" + bookTime.value;
}

function setAllowBookButton(session) {
  let disabled = session.numberOfSeatsAvailable === 0;
  let bookDate = document.getElementById("bookingDate");
  var currentDate = new Date();
  currentDate.setHours(0,0,0,0);
  if (bookDate.valueAsDate < currentDate) {
    disabled = true;
  }
  setBookButtonState(!disabled);
}

function setBookButtonState(enable) {
  let button = document.getElementById("submitFormButton");
  button.disabled = !enable;
  
}

function retreiveOrCreate(storageKey) {
  let json = localStorage.getItem(storageKey);
  let session;
  if (json != null) {
    session = JSON.parse(json);
  } else {
    session = {};
    session.numberOfSeats = 20;
    session.numberOfSeatsBooked = 0; //saving every time i book a session
    session.numberOfSeatsAvailable = session.numberOfSeats - session.numberOfSeatsBooked;
  }
  return session;
}

function storeSession(storageKey, session) {
  let json = JSON.stringify(session);
  localStorage.setItem(storageKey, json);
}

let seatsBooked = document.getElementById("seatsBooked");
let seatsAvalaible = document.getElementById("seatsAvailable");
let bookedOut = document.getElementById("bookedOut");

function displayAvailableSeats(session) {
  // console.log("Seats available: " + allSeats.numberOfSeats);
  seatsBooked.innerHTML = JSON.stringify(session.numberOfSeatsBooked);
  seatsAvalaible.innerHTML = JSON.stringify(session.numberOfSeatsAvailable);
}

// let displayAlert = window.alert("sometext");
function submitForm(e) {
  // prevent on submit page refresh
  e.preventDefault();

  let storageKey = getStorageKey();
  let session = retreiveOrCreate(storageKey);
  if (session.numberOfSeatsAvailable <= 0) {
    alert("SOLD OUT");
    return;
  }
  
  session.numberOfSeatsBooked += 1;
  session.numberOfSeatsAvailable -= 1;

  storeSession(storageKey, session);
  displayAvailableSeats(session);
  setAllowBookButton(session);
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-analytics.js";

// Very dump way to share API Information on Website, anyway doesn't matter because data not important
// TODO Restrict to only Read
const firebaseConfig = {
    apiKey: "AIzaSyAPj1Oaze3sBsp6FQGSg6snlTawVxOyEPI",
    authDomain: "air-quality-sensor-19a88.firebaseapp.com",
    projectId: "air-quality-sensor-19a88",
    storageBucket: "air-quality-sensor-19a88.appspot.com",
    messagingSenderId: "580001762929",
    appId: "1:580001762929:web:823b54ae81efc77f3e15d0",
    measurementId: "G-FQK03J9M2E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
updateAllParameters();

// Updates The Parameters as well as the progressbar
function updateAllParameters() {
  var mainText = document.getElementById("mainText");
  var submitBtn = document.getElementById("submitBtn");

  var co2 = document.getElementById("CO2");
  var humidity = document.getElementById("humidity");
  var temp = document.getElementById("temp");
  var humidity_pb = document.getElementById("humidity_progressbar");
  var temp_pb = document.getElementById("temp_progressbar");


  const dbRef = ref(getDatabase());
  get(child(dbRef, 'values')).then((snapshot) => {
      if (snapshot.exists()) {
          console.log(snapshot.val());
          co2.innerHTML = "CO2 (ppm): " + snapshot.val()["CO2"];
          humidity.innerHTML = "Humidity: " + snapshot.val()["humidity"] + " %";
          temp.innerHTML = "Temperature: " + snapshot.val()["temp"] + " °C"
          humidity_pb.setAttribute("style", `width: ${snapshot.val()["humidity"]}%`)
          temp_pb.setAttribute("style", `width: ${snapshot.val()["temp"]}%`)
      } else {
          console.log("No data available");
      }
  }).catch((error) => {
      console.error(error);
  })
}
// Update every 10 sec all Parameters
// TODO Last Sync Timestamp on Website
setInterval(updateAllParameters, 10000);

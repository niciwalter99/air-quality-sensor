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


//Sets values for the Progressbar and animates it
function setProgressBarValue(txt, pb, value_txt, value_pb, animation_name) {
  txt.innerHTML = value_txt;
  document.styleSheets[0].insertRule(`@keyframes ${animation_name} {from {width: 0%;}
  to {width: ${value_pb}%;}}`);
  pb.setAttribute("style", `width: ${value_pb}%`)
  pb.style.animation= `${animation_name} 3s ease-in-out`
}

// Updates The Parameters as well as the progressbar
function updateAllParameters() {
  var mainText = document.getElementById("mainText");
  var submitBtn = document.getElementById("submitBtn");

  var co2 = document.getElementById("CO2");
  var co2_pb = document.getElementById("co2_progressbar");
  var humidity = document.getElementById("humidity");
  var temp = document.getElementById("temp");
  var humidity_pb = document.getElementById("humidity_progressbar");
  var temp_pb = document.getElementById("temp_progressbar");


  const dbRef = ref(getDatabase());
  get(child(dbRef, 'values')).then((snapshot) => {
      if (snapshot.exists()) {
          console.log(snapshot.val());
          co2.innerHTML = "CO2 (ppm): " + snapshot.val()["CO2"];

          setProgressBarValue(co2, co2_pb, "CO2 (ppm): " + snapshot.val()["CO2"],
          snapshot.val()["CO2"] / 8, "co2")

          setProgressBarValue(humidity, humidity_pb, "Humidity: " + snapshot.val()["humidity"] + " %",
          snapshot.val()["humidity"], "hum")

          setProgressBarValue(temp, temp_pb, "Temperature: " + snapshot.val()["temp"] + " °C",
          snapshot.val()["temp"]*2, "temp")

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

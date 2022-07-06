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

// Cache Last values
var hum_c = 0
var temp_c = 0
var co2_c = 0

function rgbToHex(rgb_value) {
  var c = rgb_value.split("(")[1].split(")")[0];
  c = c.split(",");
  var b = c.map(function(x){             //For each array element
    x = parseInt(x).toString(16);      //Convert to a base16 string
    return (x.length==1) ? "0"+x : x;  //Add zero if we get only one character
  })

  return "#"+b.join("");
}

//Sets values for the Progressbar and animates it
function setProgressBarValue(txt, pb, value_txt, value_pb, animation_name, critical, cached_value) {
  var color;
  if (critical) {
    color = "#E46962"
  } else {
    color = "#5DBFB3"
  }
  console.log(cached_value)
  txt.innerHTML = value_txt;
  pb.style.animation = 'none';
  pb.offsetHeight; /* trigger reflow */

  // Remove any CSS rules inserted by a previous call to this method
  let ss = document.styleSheets; // all stylesheets
    for (let i = 0; i < ss.length; ++i) { // for each stylesheet...
        for (let j = ss[i].cssRules.length - 1; j > 0; j--) { // for each rule...
            if (ss[i].cssRules[j].name === animation_name) { // does the name match?
                ss[i].deleteRule(j);
            }
        }
    }

  document.styleSheets[0].insertRule(`@keyframes ${animation_name} {from {width: ${cached_value}%;}
  to {width: ${value_pb}%;}}`);

  pb.setAttribute("style", `width: ${value_pb}%;background-color: ${color}`)

  pb.style.animation= `${animation_name} 3s ease-in-out`;
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

          var co2_critical = snapshot.val()["CO2"] > 300
          var hum_critical = snapshot.val()["humidity"] > 55
          var temp_critical = snapshot.val()["temp"] > 28

          console.log(hum_c)
          setProgressBarValue(co2, co2_pb, "CO2 (ppm): " + snapshot.val()["CO2"],
          snapshot.val()["CO2"] / 8, "co2", co2_critical, co2_c / 8)

          setProgressBarValue(humidity, humidity_pb, "Humidity: " + snapshot.val()["humidity"] + " %",
          snapshot.val()["humidity"], "hum", hum_critical, hum_c)

          setProgressBarValue(temp, temp_pb, "Temperature: " + snapshot.val()["temp"] + " °C",
          snapshot.val()["temp"]*2, "temp", temp_critical, temp_c*2)

          hum_c = snapshot.val()["humidity"]
          temp_c = snapshot.val()["temp"]
          co2_c = snapshot.val()["CO2"]

          console.log("color");
          var bgColor = rgbToHex(window.getComputedStyle(document.body, null).getPropertyValue('background-color'));


          if ((co2_critical || hum_critical || temp_critical) && bgColor != "#9A82DB") {
            console.log("Critical Air Quality");
            document.body.style.backgroundColor = "#9A82DB";

            document.styleSheets[0].insertRule(`@keyframes color_shift {from {background-color: #355778;}
            to {background-color: #9A82DB;}}`);
            document.getElementById("body2").style.backgroundColor = "#9A82DB";
            document.getElementById("body2").style.animation= `color_shift 3s ease-in-out`

          } else if (bgColor != "#355778"){
            console.log("go to normal");
            document.body.style.backgroundColor = "#355778";

            document.styleSheets[0].insertRule(`@keyframes color_shift_back {from {background-color: #9A82DB;}
            to {background-color: #355778;}}`);
            document.getElementById("body2").style.backgroundColor = "#355778";
            document.getElementById("body2").style.animation= `color_shift_back 3s ease-in-out`
          }

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

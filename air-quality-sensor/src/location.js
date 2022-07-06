var city
var pm10
var o3
var temp_outside
var weather_icon

  if (navigator.geolocation) {
    console.log("get location");
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  }


const getJSON = async url => {
  const response = await fetch(url);
  return response.json(); // get JSON from the response
}

function setProgressBarValue(txt, pb, value_txt, value_pb, animation_name) {
  txt.innerHTML = value_txt;
  document.styleSheets[0].insertRule(`@keyframes ${animation_name} {from {width: 0%;}
  to {width: ${value_pb}%;}}`);
  pb.setAttribute("style", `width: ${value_pb}%`)
  pb.style.animation= `${animation_name} 3s ease-in-out`
}


function writeValue(data){

  city = data.location.name
  pm10 = Math.round(data.current.air_quality.pm10)
  o3 = Math.round(data.current.air_quality.o3)
  temp_outside = data.current.temp_c
  weather_icon = data.current.condition.icon
  weather_icon = weather_icon.slice(2, weather_icon.length)

  console.log(data.location.name)
  console.log(temp_outside)
  console.log(o3)
  console.log(pm10)
  console.log(weather_icon)

  var o3_o = document.getElementById("o3_outside");
  var o3_pb = document.getElementById("o3_outside_progressbar");
  var pm10_o = document.getElementById("pm10_outside");
  var pm10_pb = document.getElementById("pm10_outside_progressbar");

  setProgressBarValue(o3_o, o3_pb, "O3 (ppm): " +  o3, Math.round(o3 / 2), "o3")
  setProgressBarValue(pm10_o, pm10_pb, "PM10 (ppm): " +  pm10, pm10, "pm10")

  var rulename = "pm10_animation"
  //pm10_pb.style.animation-name = `${rulename}`;
  //pm10_pb.parentNode.replaceChild(pm10_pb.cloneNode(true), pm10_pb);

  //o3_o.innerHTML = "PM10 Outside (ppm): " +  o3;
  //o3_pb.setAttribute("style", `width: ${Math.round(o3 / 2)}%; animation-name: pm10_animation`)

  //pm10_o.innerHTML = "PM10 Outside (ppm): " +  Math.round(pm10 * 10) / 10;
  //pm10_pb.setAttribute("style", `width: ${Math.round(pm10 * 10) / 10}%;
  //animation-name: pm10_animation`)
  weather_icon = "https://" + weather_icon
  document.getElementById('weather').src=weather_icon
  console.log(data)




}

//Get the latitude and the longitude;
function successFunction(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    console.log("Fetching data...");
    var loc = lat + ',' + lng
    getJSON("https://api.weatherapi.com/v1/current.json?key=98f626c91ec048c78ab181846220507&q="+loc+"&aqi=yes")
      .then(data => writeValue(data));
}

function errorFunction(error){
  switch(error.code) {
   case error.PERMISSION_DENIED:
     alert("User denied the request for Geolocation.")
     break;
   case error.POSITION_UNAVAILABLE:
     alert("Location information is unavailable.")
     break;
   case error.TIMEOUT:
     alert("The request to get user location timed out.")
     break;
   case error.UNKNOWN_ERROR:
     alert("An unknown error occurred.")
     break;
 }
}

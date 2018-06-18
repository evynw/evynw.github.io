window.addEventListener("load", function() { 
   document.body.style.width='100%';
   document.body.style.height='100%';
}, false);

function updateClock() { 
var currentTime = new Date();
var currentHours = currentTime.getHours();
var currentMinutes = currentTime.getMinutes() < 10 ? '0' + currentTime.getMinutes() : currentTime.getMinutes();
var currentSeconds = currentTime.getSeconds() < 10 ? '0' + currentTime.getSeconds() : currentTime.getSeconds();
var currentDate = currentTime.getDate() < 10 ? '0' + currentTime.getDate() : currentTime.getDate();
var currentMonth = currentTime.getMonth() + 1;
var currentMonth1 = currentMonth < 10 ? '0' + currentMonth : currentMonth;
timeOfDay = ( currentHours < 12 ) ? "am" : "pm";

if (Clock == "24h"){
	timeOfDay = "";
	currentHours = ( currentHours < 10 ? "0" : "" ) + currentHours;
	currentTimeString = currentHours + ":" + currentMinutes;
}
if (Clock == "12h"){
	currentHours = ( currentHours < 10 ? "0" : "" ) + currentHours;
	currentHours = ( currentHours == 0 ) ? "00" : currentHours;
	currentHours = ( currentHours == 13 ) ? "01" : currentHours;
	currentHours = ( currentHours == 14 ) ? "02" : currentHours;
	currentHours = ( currentHours == 15 ) ? "03" : currentHours;
	currentHours = ( currentHours == 16 ) ? "04" : currentHours;
	currentHours = ( currentHours == 17 ) ? "05" : currentHours;
	currentHours = ( currentHours == 18 ) ? "06" : currentHours;
	currentHours = ( currentHours == 19 ) ? "07" : currentHours;
	currentHours = ( currentHours == 20 ) ? "08" : currentHours;
	currentHours = ( currentHours == 21 ) ? "09" : currentHours;
	currentHours = ( currentHours == 22 ) ? "10" : currentHours;
	currentHours = ( currentHours == 23 ) ? "11" : currentHours;
	currentHours = ( currentHours == 24 ) ? "12" : currentHours;
	currentTimeString = currentHours + ":" + currentMinutes;
}

document.getElementById("hour").innerHTML = currentHours;
document.getElementById("minute").innerHTML = currentMinutes;
document.getElementById("ampm").innerHTML = timeOfDay;
document.getElementById("weekday").innerHTML = days[currentTime.getDay()];
document.getElementById("date").innerHTML = currentDate;
document.getElementById("month").innerHTML = currentMonth1;
}

function init(){
updateClock();
setInterval("updateClock();", 1000);
}
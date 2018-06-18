var Level = "";
var State = "";

$.ajaxSetup({
cache: false,
headers: {'Cache-Control': 'no-cache'}
});

function init(){
refreshLocationTimer = setTimeout(init, 10*1000);
jQuery.get('file:///private/var/mobile/Library/BatteryStats.txt', function(appdata) {

var myvar = appdata;
var substr = appdata.split('\n');
var Level=substr[0].split(':')[1];
var State=substr[1].split(':')[1];

document.getElementById("StateDisplay").innerHTML = State;
document.getElementById("LevelDisplay").innerHTML = Level + '%';

});
}
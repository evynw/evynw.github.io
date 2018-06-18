function miniWeather(options) {
    'use strict';
    if (options.gps) {
        var url = 'file:///var/mobile/Documents/widgetweather.xml',
            callAjax = function (url) {
                var xmlhttp;
                xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState === 4) {
                        var weather = {},
                            wwxml = xmlhttp.responseXML.documentElement,
                            cc = wwxml.getElementsByTagName('currentcondition')[0],
                            d = wwxml.getElementsByTagName('day')[0],
                            date = new Date();
                        weather.city = cc.getElementsByTagName('city')[0].textContent;
                        weather.country = cc.getElementsByTagName('extraLocCountry')[0].textContent;
                        weather.lat = cc.getElementsByTagName('latitude')[0].textContent;
                        weather.long = cc.getElementsByTagName('longitude')[0].textContent;
                        weather.temp = cc.getElementsByTagName('temp')[0].textContent;
                        weather.dew = cc.getElementsByTagName('dewpt')[0].textContent;
                        weather.feelslike = cc.getElementsByTagName('chill')[0].textContent;
                        weather.humid = cc.getElementsByTagName('humidity')[0].textContent;
                        weather.icon = cc.getElementsByTagName('code')[0].textContent;
                        weather.uv = cc.getElementsByTagName('uvindex')[0].textContent;
                        weather.condition = cc.getElementsByTagName('description')[0].textContent;
                        weather.winddir = cc.getElementsByTagName('cardinal')[0].textContent;
                        weather.windspd = cc.getElementsByTagName('speed')[0].textContent;
                        weather.high = (d.getElementsByTagName('high')[0].textContent === '') ? cc.getElementsByTagName('temp')[0].textContent : d.getElementsByTagName('high')[0].textContent;
                        weather.low = d.getElementsByTagName('low')[0].textContent;
                        weather.update = date;
                        options.success(weather);
                        //console.log(cc)
                    }
                };
                xmlhttp.open("GET", url, true);
                xmlhttp.send();
                setTimeout(function () {
                    callAjax(url);
                }, 60000 * options.refresh);
            };
        callAjax(url);
    } else {
        var url = 'http://wxdata.weather.com/wxdata/mobile/mobagg/' + options.code + '.js?key=2227ef4c-dfa4-11e0-80d5-0022198344f4&units=' + (options.temp ? 'c' : 'f') + '&locale=' + options.lang,
            callAjax = function (url) {
                var xmlhttp;
                xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState === 4) {
                        var weather = {},
                            x = JSON.parse(xmlhttp.responseText)[0],
                            tday = x.HourlyForecasts[0],
                            dday = x.DailyForecasts[0],
                            date = new Date();
                        weather.city = x.Location.city;
                        weather.country = x.Location.country;
                        weather.lat = x.Location.lat;
                        weather.long = x.Location.lng;
                        weather.dew = tday.dew;
                        weather.feelslike = tday.feelsLike;
                        weather.humid = tday.humid;
                        weather.icon = tday.icon;
                        weather.uv = tday.uv;
                        weather.condition = tday.wDesc;
                        weather.winddir = tday.wDirText;
                        weather.windspd = tday.wSpeed;
                        if (options.temp === true) {
                            weather.temp = Math.round((Number(tday.temp) - 32) * 5 / 9);
                            weather.low = Math.round((Number(dday.minTemp) - 32) * 5 / 9);
                            weather.high = Math.round((Number(dday.maxTemp || tday.temp) - 32) * 5 / 9);
                            temp.unit = "C";
                        } else {
                            weather.temp = tday.temp;
                            weather.low = dday.minTemp;
                            weather.high = dday.maxTemp || tday.temp;
                            temp.unit = "F";
                        }
                        weather.update = date;
                        options.success(weather);
                        //console.log(x);
                    }
                };
                xmlhttp.open("GET", url, true);
                xmlhttp.send();
                setTimeout(function () {
                    callAjax(url);
                }, 60000 * options.refresh);
            };
        callAjax(url);
    }
}

miniWeather({
    code : weathercode,
    temp : celsius,
    lang : Lang,
    gps : gpsswitch, //must use widget weather xml if set to true
    refresh : refreshrate, // in minutes
    success: function(w){
        document.getElementById('weatherIcon').src = 'Stuff/' + IconSet + '/' + w.icon + '.png';
        document.getElementById('desc').innerHTML = weatherdesc[w.icon];
    }
});

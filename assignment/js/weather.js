
/**
 * weather.js
 * fetch weather from openwethermap.org and render chaneges to the weather element at the top of the page.
 *  * @author Tom Hegarty
 */


/**
 * get the weahter forcast for a specified geoloaction
 * @param {STRING} lat 
 * @param {STRING} lon 
 */
function updateWeather(lat, lon){
    let url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "REMOVED API KEY FOR GITHUB"
    $.getJSON(url, function(result){
        var mainWeather = result.main;
        var weather = result.weather;
        var wind = result.wind;
        $("#loac").text((result.name) + ", " + (result.sys.country));
        $("#desc").text(weather[0].description);
        $("#mainIcon").attr("src","icons/" + (weather[0].icon) + ".png");
        $('#mainIcon').attr("alt", weather[0].description); //set correct alt tag for icon
        $("#temp").text((Math.round(mainWeather.temp - 273.15) + "°C")); //OpenWeatherMap returns temp in Kelvin
        $("#feelsLike").text((Math.round(mainWeather.feels_like - 273.15) + "°C"));
        $("#windspeed").text((Math.round(wind.speed * 2.23694) + " mph"));
        $("#winddirec").text(degreesToDirection(wind.deg));
        $("#windArrow").css("transform", " rotate(" + (wind.deg - 90) + "deg)");
        dailyWeather(lat,lon);
    }) 
}

/**
 * gets hourly weather for next 10 hours, adds elements to the .weatherSection2 elemet 
 * @param {Float} lat - latitude
 * @param {Float} lon - longitude 
 */
function dailyWeather(lat, lon){
    let url = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,daily,alerts&appid=0ba649ccedc7da6c7e37b60b5eb32957"
    $( ".weatherSection2" ).html("");
    $.getJSON(url, function(result){
        result.hourly.slice(0, 10).forEach(element => {
            let timestamp = element.dt;
            let date = new Date(timestamp * 1000);
            let hours = date.getHours();
            let minutes = date.getMinutes();
            $( ".weatherSection2" ).append('<div class="hourWeather"><p><b>' + ('0' + hours).slice(-2) + ":" + ('0' + minutes).slice(-2) + '</b></p><div class="mainIconCont"><img id="mainIcon" src="icons/' + element.weather[0].icon + '.png" alt="Loading Weather Icon"></div><p> Temp: <b>' + (Math.round(element.temp - 273.15))  +  '°C</b></p><p>' + element.weather[0].description  +  '</p></div>'); 
        });
    });
}


/**
 * converts wind degree value into direction name 
 * @param {INT} deg - degree directon 
 * @returns {String} - direction name
 */
function degreesToDirection(deg){
    if(deg < 22.5 || deg > 337.5){
            return "North";
        }else if(deg < 67.5){
            return"North East";
        }else if(deg < 112.5){
            return "East";
        }else if(deg < 157.5){
            return "South East";
        }else if(deg < 202.5){
            return "South";
        }else if(deg < 247.5){
            return "South West";
        }else if(deg < 292.5){
            return "West";
        }else if(deg < 337.5){
            return "North West";
        }
}

//set inital display to newcastle 
updateWeather(54.9737001, -1.615140);




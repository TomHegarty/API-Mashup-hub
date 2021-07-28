/**
 * tweetsLoactions
 * gets tweets containing "@NU_ICS", "NULibrary", "@NorthumbriaUni", and "NorthumbriaSU" and pins them on map
 * calculate directiosn to campus when each amrker is clicked
 * 
 * @author Tom Hegarty
 */

//click event handler on "show tweets" button
$("#submit").click(function(){
    geocodeAddress(geocoder, map);
});


/**
 * makes AJAX request to get public tweets, gathers the users account location
 * then makes geocode request to get co-ords from string
 * then pins data to map
 * @param {instance} geocoder 
 * @param {element} resultsMap 
 */
function geocodeAddress(geocoder, resultsMap) {

    $.ajax({
        url: "php/getTweetMentions.php",
        type: 'GET',
        success: function(response){
            tweets = JSON.parse(response);

            //array of all rendered markers
            var newTweetMarkers = [];//some array

            //remove tweets with same address, prevent double markers
            var locations = [];
            var uniqueLoacations = [];
            for(i=0; i < tweets.statuses.length; i++){
                if(tweets.statuses[i].user.location != ""){
                    locations.push((tweets.statuses[i].user.location).replace(/ /g,"_"));
                }
            }
            $.each(locations, function(i, comp){
                if($.inArray(comp, uniqueLoacations) === -1) uniqueLoacations.push(comp);
            });

            //google geoCode only allows up to 10 requests at a time
            for(i=0; i < 10; i++){
                if(uniqueLoacations[i] != ""){
                    const address = uniqueLoacations[i];
                    const tweet = tweets.statuses[i].full_text;
                    const user = tweets.statuses[i].user.name;
                    const handle = tweets.statuses[i].user.screen_name;
                    const profilePic = tweets.statuses[i].user.profile_image_url;

                    //get conetent for each info window
                    const infoContent = "<div class='infoWindowOuter'>" +
                                            "<div class='markerTweetheader'>" + 
                                            "<p><b>Tweet From: 📍</b> " + address + "</p>" +
                                            "<div class='profielarea'>" +
                                                "<img class='profilePic' src='" + profilePic + "'>" + 
                                                "<p class='markerHeadertext'><b>" + user + "</b><br>@" + handle + "</p></div>"  +
                                            "</div>" + 
                                            "<div class='InfoWindowTweetArea'><p>" + tweet + "</p>" +
                                            "<div class='markerInfoLower'><b>Click the Marker to get directions to Newcastle Campus</b></div>"
                                            "</div>"
                                        "</div>";

                    //make request to geocode api                     
                    geocoder.geocode({ address: address }, (results, status) => {
                        if (status === "OK") {

                            const marker = new google.maps.Marker({
                                map: resultsMap,
                                position: results[0].geometry.location,
                                icon: "icons/tweetIcon.png",
                            });

                            const infowindow = new google.maps.InfoWindow({
                                content: infoContent
                            });

                            //open and clsoe info window on mouse over
                            marker.addListener('mouseover', function() {
                                infowindow.open(map, this);
                            });

                            marker.addListener('mouseout', function() {
                                infowindow.close();
                            });

                            marker.addListener('click', function() {
                                calcRoute(results[0].geometry.location, {lat: 54.9781598, lng: -1.6085715 }, "DRIVING")
                            });
                            

                            //zoom map put to accomodate all new markers
                            newTweetMarkers.push(results[0].geometry.location);
                            var bounds = new google.maps.LatLngBounds();
                                for (var i = 0; i < newTweetMarkers.length; i++) {
                                bounds.extend(newTweetMarkers[i]);
                            }
                            map.fitBounds(bounds);

                            } else if (status == "ZERO_RESULTS") {
                                console.log("Could not get geocode data for tweet" + uniqueLoacations[i]);
                            } else {
                                console.log("Geocode was not successful for the following reason: " + status);
                            }
                        });
                }
            }

        }
    });
}

/**
 * fucntion to get directions from tweet marker and draw poly line on map
 * @param {latlng} start 
 * @param {latlng} destination 
 * @param {STRING} mode 
 */
function calcRoute(start, destination, mode) {
    var request = {
        origin: start,
        destination: destination,
        travelMode: mode
    };

    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
            directionsRenderer.setMap(map);
            directionsRenderer.setPanel(document.getElementById("panel"));
        }else{
            alert("unable to get directions, distance too far. Try a marker closer to Newcastle campus")
        }
    });
}

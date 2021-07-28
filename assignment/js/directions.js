/**
 * directions.js
 * functions to get directions and draw polyline on the map using Google matrix API
 * 
 * @author Tom Hegarty
 */

$(document).ready(function(){

    var origin = "Haymarket, Newcastle upon Tyne";
    var destination = "Central Station, Newcastle upon Tyne";
    var service = new google.maps.DistanceMatrixService();

    /**
     * get journy distance and estmmated time, and redner it to the durections window
     * @param {LAT LNG} origin - coords  
     * @param {LAT LNG} destination - cords 
     * @param {STRING} mode - driving, wallking, cycling, or public_transport
     */
    function getDistance(origin, destination, mode){
        service.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: mode,
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                avoidHighways: false,
                avoidTolls: false
            }, callback);

        function callback(response, status){
            if(status == "OK"){
                var to = response.destinationAddresses[0];
                var from = response.originAddresses[0];
                var distance = response.rows[0].elements[0].distance.text;
                var duration = response.rows[0].elements[0].duration.text;
                if( to && from && distance && duration){
                    $("#to").html(to);
                    $("#from").html(from);
                    $("#distance").html(distance);
                    $("#duration").html(duration);
                    $("#status").html(status);
                }else{
                    alert("unable to get distance, please try differnt address");
                }

            }else{
                console.log("error making matrix request: " + status);
                $("#status").html(status);
            }
        }
    }


    /**
     * Draw polyline on map of specifed route
     * @param {LAT LNG} origin - coords  
     * @param {LAT LNG} destination - cords 
     * @param {STRING} mode - driving, wallking, cycling, or public_transport 
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
                alert("unable to get directions, please try a different address")
            }
        });

    }

    //event handler for clicking diretions button
    $("#directionsButton").click(function(){
        if($("#origin").val() != "" & $("#destination").val() != ""){
            var origin = $("#origin").val();
            var end = $("#destination").val();
            let mode = $("#mode").val();

            //get state of direction check box
            if($("#markerDirections").is(":checked")){
                if(selectedLoaction  == null){
                    alert("click on the map to add a maker");
                }else{
                    origin = selectedLoaction;
                }
            }

            //set values for static locations on map
            if(end == "campus"){
                destination =  {lat: 54.9781598, lng: -1.6085715 };
            }else if(end == "cis"){
                destination = { lat: 54.9766446, lng: -1.606981 };
            }else if (end == "studentsUnion"){
                destination = { lat: 54.9779632, lng: -1.6070677 };
            }else if (end == "library"){
                destination =  { lat: 54.9786437, lng: -1.6087124 };
            }else{
                alert("unable to find destination");
                destination =  {lat: 54.979071, lng: -1.6103249 };
            }

            var service = new google.maps.DistanceMatrixService();
            getDistance(origin, destination, mode)
            calcRoute(origin, destination, mode);
        }else{
            alert("please enter adresses");
        }
    });

    //gets mode value from DOM, sets values Google needs
    function setMode(mode){
        if(mode == "walking"){
            directionMode = "";
            matrixMode = "";
        }else if(mode == "cycling"){
            directionMode = "";
            matrixMode = "";
        }else if(mode == "driving"){
            directionMode = "DRIVING";
            matrixMode = google.maps.TravelMode.DRIVING;
        }
    }

    //show/hide address input option
    $("#markerDirections").click(function(event) {
        if ($(this).is(":checked"))
            $(".addressInput").hide('slow');
        else
            $(".addressInput").show('slow');
    });

});
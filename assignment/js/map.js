/**
 * functions relating to the Map object and local contect veiw API
 * @author Tom Hegarty 
 */

//global map varibles 
var marker; //user slected pin
var map; //instance of map
var infowindow; //global infowindow
var selectedLoaction; //latlng of user selected pin

//set deafault info window values for offical tweet markers 
var librayInfo = "Unable to fetch twitter data at this time, please refresh the page to try again" ;
var SUInfo = "Unable to fetch twitter data at this time, please refresh the page to try again";
var CampusInfo = "Unable to fetch twitter data at this time, please refresh the page to try again";
var CISInfo = "Unable to fetch twitter data at this time, please refresh the page to try again" ;

//variables for local places in Google local context map
var places = 0;
var placeToShow = [
    { type: "restaurant" },
    { type: "cafe" },
    { type: "tourist_attraction" },
    { type: "bar"},
    { type: "clothing_store"},
    { type: "shopping_mall"},
    { type: "movie_theater"},
];

//direction servies 
var directionsService = new google.maps.DirectionsService();
var directionsRenderer = new google.maps.DirectionsRenderer();

//geocoding service 
const geocoder = new google.maps.Geocoder();


/**
 * main constructor for map api
 */
function initMap() {

    var localContextMapView = new google.maps.localContext.LocalContextMapView({
        element: document.getElementById("map"),
        placeTypePreferences: placeToShow,
        maxPlaceCount: places,
    });

    map = localContextMapView.map; //this uses the local conext veiw map instead of the default
    //map = new google.maps.Map(document.getElementById("map"));

    map.setOptions({
        center: {lat: 54.9784144, lng: -1.6082035 },
        zoom: 17,
        mapId: '1ecaef5fde9e1cbd',
    });

    //@NorthumbriaUni campus location
    addMarker({
        coords:{lat: 54.9781598, lng: -1.6085715 },
        iconImage: "icons/Campus.png",
        title: "campus",
        info: CampusInfo
    })

    //@CIS building marker
    addMarker({
        coords:{ lat: 54.9766446, lng: -1.606981 },
        iconImage: "icons/CIS.png",
        title: "cis",
        info: CISInfo
    })

    //@NULibrary building marker
    addMarker({
        coords: { lat: 54.9786437, lng: -1.6087124 },
        iconImage: "icons/LIB2.png",
        title: "library",
        info: librayInfo
    })

    //@NorthumbriaSU building marker
    addMarker({
        coords: { lat: 54.9779632, lng: -1.6070677 },
        iconImage: "icons/SU.png",
        title: "Students Union",
        info: SUInfo
    })

    //function add static markers 
    function addMarker(props){
        var marker = new google.maps.Marker({
            position: props.coords,
            map: map,
            title: props.title,
        })

        var infowindow = new google.maps.InfoWindow({
            content: props.info,
        });

        //check if icon is defined 
        if(props.iconImage){
            marker.setIcon(props.iconImage);
        }

        //open info window on mouse over
        marker.addListener('mouseover', function() {
            infowindow.open(map, this);
        });
        
        // manually close info window too
        marker.addListener('mouseout', function() {
            infowindow.close();
        });
    }

    //updates weather forecast on where the user clicks on the map
    google.maps.event.addListener(map, 'click', function(event){
        updateWeather((event.latLng.lat()), (event.latLng.lng()));
    });

    google.maps.event.addListener(map, 'click', function(event) {
        //call function to create marker
            if (marker) {
                marker.setMap(null);
                marker = null;
            }
        marker = createMarker(event.latLng);
    });

    // A function to create the marker and set up the event window function 
    function createMarker(latlng) {
        var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                zIndex: Math.round(latlng.lat()*-100000)<<5
            });    
        selectedLoaction = latlng;    

        google.maps.event.trigger(marker, 'click');    
        return marker;
    }

}//init map


//toggle to show/hide local places from the map
$(document).ready(function(){
    //show/hide address input option
    $("#localPlacesButton").click(function(event) {
        if(places == 0){
            places = 6;
            $(this).html("hide local places");
            initMap();
            document.getElementById("map").scrollIntoView();
        }else{
            places = 0;
            initMap();
            $(this).html("show local places");
        }
    });

    $("#NewPlacesButton").click(function(event) {
        var placesElement = document.getElementById("placesOuter"); 
        inputs = placesElement.getElementsByTagName("input");
        $("#localPlacesButton").html("hide local places");
        document.getElementById("map").scrollIntoView();
        placeToShow = [];
        places = 6;

        for (var i = 0, max = inputs.length; i < max; i += 1) {
            // Take only those inputs which are checkbox
            if (inputs[i].type === "checkbox" && inputs[i].checked) {
                placeToShow.push({type: inputs[i].value });
            }
        }
        $(this).html("Update Filters");
        initMap();
    });

});







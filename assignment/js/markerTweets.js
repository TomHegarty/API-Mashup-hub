/**
 * Scipts to aysnc fetch the latest tweet from each of the speciifed Northumbria accounts, and return the data to the map
 * @author Tom Hegarty 
 * 
 */

//call fucntion for all current services 
setMarkerContent("Library");
setMarkerContent("CIS");
setMarkerContent("SU");
setMarkerContent("Campus");


/**
 * get latest tweet from specified account and place makrer with info window on map
 * @param {STRING} service 
 */
function setMarkerContent(service){

    let phpURL = "";

    if(service == "Library"){
        phpURL = "php/officalMarkerFetches/getLibraryTweet.php";
    }else if (service == "CIS"){
        phpURL = "php/officalMarkerFetches/getCISTweet.php";
    }else if (service == "SU"){
        phpURL = "php/officalMarkerFetches/getSUTweet.php";
    }else if (service == "Campus"){
        phpURL = "php/officalMarkerFetches/getCampusTweet.php";
    }

    $.ajax({
        url: phpURL,
        type: 'GET',
        success: function(response){
            tweets = JSON.parse(response);
            time = relTime(tweets[0].created_at);

            infoContent = "<div class='infoWindowOuter'>" +
                            "<div class='markerTweetheader'>" + 
                            "<p> Latest Tweet From:  </p>" +
                            "<div class='profielarea'>" +
                                "<img class='profilePic' src='" + tweets[0].user.profile_image_url + "'>" + 
                                "<p class='markerHeadertext'><b>" + tweets[0].user.name + "</b><br>@" + tweets[0].user.screen_name + "</p></div>"  +
                            "</div>" + 
                            "<div class='InfoWindowTweetArea'><p>" + tweets[0].full_text + "</p>" +
                            "<p>"+ time + "</p>" +
                            "</div>"
                        "</div>"

            if(service == "Library"){
                librayInfo = infoContent;
            }else if (service == "CIS"){
                CISInfo = infoContent;
            }else if (service == "SU"){
                SUInfo = infoContent;
            }else{
                CampusInfo = infoContent;
            }            
            
            initMap();
        }
    });
}


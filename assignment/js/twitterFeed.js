/**
 * makes ajax call to twitter API PHP script, returning tweets in JSON
 * @param {ARRAY} filterArray - array of twitter handles to fitler by
 */
function twitterCall(filterArray){

    //show loading icon when tweets are loading
    $("#tweetsarea").empty();
    $("#tweetsarea").append('<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');

    //AJAX used instead of "getJson" to allow filter values to be posted to PHP
    $.ajax({
        url: "php/apiAccess.php",
        type: 'POST', 
        data: { filterArray: filterArray },
        success: function(response){
            tweets = JSON.parse(response);

            $("#tweetsarea").empty();
            $.each(tweets.statuses, function(i, objTweet){
                let image = "";
                let profilePic = "";
                let location = "";

                //check if tweet has image content 
                if (typeof objTweet.user.profile_image_url !== 'undefined') {
                    profilePic = ("<img class='profilePic' src='" + objTweet.user.profile_image_url + "'><br>");
                }
                //check if user has set a profiel picture
                if (typeof objTweet.entities.media !== 'undefined') {
                    image = ("<img class='tweetmedia' alt='twitter profile picture' src='" + objTweet.entities.media[0].media_url + "'><br>");
                }
                //if check if user has allowed thier profile location 
                if(objTweet.user.location != ""){
                    location = objTweet.user.location = ("<br>📌" + objTweet.user.location);
                }

                let username = (objTweet.user.name);
                let screename = (objTweet.user.screen_name);
                let text = (objTweet.full_text);
                let time = relTime(objTweet.created_at); 
                $("#tweetsarea")
                    .append(
                        "<div class='tweet'>" + 
                            '<a href="https://twitter.com/' + screename + ' " target="_blank">' +
                            '<div class="tweetHeader">' +
                                profilePic + 
                                '<div class="twitterName"><b class="feedUsername">' +
                                    username + "<br></b> @" + 
                                    screename + "<br>" + 
                                '</div>' +
                            '</div></a>' +
                            text + "<br>" + 
                            image +
                            "<b>" + time + 
                            location + "</b>" + 
                        "</div>"
                    );
            });
        }
    });
}


//make inital request with no filters 
twitterCall(["NU_CISdept", "NorthumbriaSU", "NULibrary", "NorthumbriaUni" ]);

/**
 * handles DOM interaction for twitter elemetns 
 */
$(document).ready(function(){
    $("#filterArea").hide();
    $("#tweetFilterButton").click(function(){
        $("#filterArea").slideToggle();
        if($("#tweetFilterButton").html() == " Show Filters ▼"){
            $("#tweetFilterButton").html(" Hide Filters &#9650;");
        }else{
            $("#tweetFilterButton").html(" Show Filters &#9660;");
        }
    });

    $("#tweetSelectionButton").click(function(){
        $("#filterArea").slideUp();
        let inputs =  document.getElementById("filterArea").getElementsByTagName("input");
        filters = [];

        for (var i = 0, max = inputs.length; i < max; i += 1) {
            if (inputs[i].type === "checkbox" && inputs[i].checked) {
                filters.push(inputs[i].value);
            }
        }
        console.log(filters);
        twitterCall(filters);
    });

});


/**
 * take tweet timestamp and say how long ago it was
 * @author Ian Devlin 
 * //https://www.alphr.com/blogs/2010/09/13/adding-your-twitter-feed-to-your-website-with-jquery/
 * @param {TimeStamp} time_value 
 * @returns {String} human readable Time
 */
 function relTime(time_value) {
    time_value = time_value.replace(/(\+[0-9]{4}\s)/ig,"");

    var parsed_date = Date.parse(time_value);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
    var timeago = parseInt((relative_to.getTime() - parsed_date) / 1000);

    if (timeago < 60){ 
        return 'less than a minute ago';
    } else if(timeago < 120){ 
        return 'about a minute ago';
    }else if(timeago < (45*60)){
        return (parseInt(timeago / 60)).toString() + 'minutes ago';
    }else if(timeago < (90*60)){
         return 'about an hour ago';
    }else if(timeago < (24*60*60)){
        return 'about ' + (parseInt(timeago / 3600)).toString() + ' hours ago';
    } else if(timeago < (48*60*60)){
         return '1 day ago';
    }else{
         return (parseInt(timeago / 86400)).toString() + ' days ago';
    }
}
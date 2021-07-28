/**
 * Scritps to handle the client side of postign a tweet and displayign it on the page.
 * @author Tom Hegarty
 */

//array of sent tweets times (UTC timestamps)
var SentTweetTimes = [];



//check session data for any new tweets
setInterval(function(){ 
    $.ajax({
            url: "php/getSentTweet.php",
            type: 'GET',
            success: function(response){
                SentTweet = JSON.parse(response);
                if(SentTweet.status = "200"){
                    if(!SentTweetTimes.includes(SentTweet.time)){
                        SentTweetTimes.push(SentTweet.time);
                        displaySentTweet(SentTweet);
                    }
                }
            }
        });
}, 1000);

/**
 * render tweet data to the DOM
 * 
 * @param {JSON} SentTweet 
 */
function displaySentTweet(SentTweet){

    document.getElementById("tweetOutput").innerHTML += 
        '<div class="sentTweet">' +
            '<div class="sentTweetHeader">' +
                '<img class="sentPorfilePic" alt="twitter porfile picture" src="' + SentTweet.user[2]  + '">' +
                '<div class="sentTweetUser">' +
                    '<p><b>' + SentTweet.user[0]  + '</b></p>' +
                    '<p>@' + SentTweet.user[1]  + '</p>' +
                '</div>' +
            '</div>' +
            '<div class="sentTweetBody">' +
                '<p>' + SentTweet.text + '. #KF6013_Assignment_Task</p>' +
            '</div>' +
            '<p>at: ' + formatTime(SentTweet.time)  + '</p>' +
        '</div>' 

}

/**
 * fortamts tiemstamp as human readable time
 * @param {TIMESTAMP} time 
 * @returns {String} 
 */
function formatTime(time){

    let unix_timestamp = time
    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var formattedTime = hours + ':' + minutes.substr(-2);

    return(formattedTime);
}
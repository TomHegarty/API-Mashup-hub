/**
 * functions and scripts for general page layout 
 * @author Tom Hegarty 
 */

$(document).ready(function(){

    //initialise Tweet Message form
	$("#tweetMessage").submit(function( event ) {
		window.open("php/twitterLogin.php?tweetText=" + $("#tweetInput").val());
		event.preventDefault();
	});	

    //sets timeout for tweet button
    $("#submit").click(function(){
        $("#submit").prop('disabled', true);
        $("#timeoutBar").width("100%");
        $("#timeoutBar").css({transition : "width linear 10s"});
        document.getElementById("map").scrollIntoView();
        setTimeout(function(){
            $("#submit").prop('disabled', false);
            $("#timeoutBar").width("0%");
            $("#timeoutBar").css({transition : "width linear 0s"});
        }, 10000);
    });

    //toggle between mobile and desktop navigation menus 
    $("#mobileNavigationbar").children("a").hide();
    $("#mobileNavigationbar").click(function(){
        $("#mobileNavigationbar").children("a").slideToggle();
    });

});



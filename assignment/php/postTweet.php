<?php
/** 
 *  script to authenticate as logged in twitter user and post a tweet to their account
 *  @author Tom Hegarty 
 * 
 *  this file makes use of twitteroauth for PHP;
 *  Title: twitteroauth
 *  Author: Abraham Williams
 *  Availability: https://github.com/abraham/twitteroauth
*/


require "../twitteroauth/vendor/autoload.php";
require "config.php";
use Abraham\TwitterOAuth\TwitterOAuth;

session_start();

//twitter oauth part
$request_token = [];
$request_token['oauth_token'] = $_SESSION['oauth_token'];
$request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];
$tweetText = $_SESSION['tweetText'];
$index = "index.html#twitterPost";

//if token is usent, go back to login script
if (isset($_REQUEST['oauth_token']) && 
    $request_token['oauth_token'] !== $_REQUEST['oauth_token']) {
    header('Location: php/twitterLogin.php');    
}


$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $request_token['oauth_token'], $request_token['oauth_token_secret']);

//getting toekn for users account and save it to the session
$access_token = $connection->oauth("oauth/access_token", array("oauth_verifier" => $_REQUEST['oauth_verifier']));
$_SESSION['access_token'] = $access_token;

//getting user credatentials for the authenticated user
$access_token = $_SESSION['access_token'];
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
$user = $connection->get('account/verify_credentials', ['tweet_mode' => 'extended', 'include_entities' => 'true']);
$loggedInUser = array($user->name, $user->screen_name, $user->profile_image_url );
$_SESSION['senderUser'] = $loggedInUser;


//Now we make a TwitterOAuth instance with the users access_token
$twitterInstance = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);

//post status update on belhaf of logged in user
$status = $twitterInstance->post(
    "statuses/update", [
        "status" => "$tweetText . #KF6013_Assignment_Task"
    ]
);

//save tweet data to session to read from DOM 
$_SESSION['tweetTextLocal'] =  $tweetText;
$_SESSION['tweetTime'] =  time();

//close tab once authentication has been made 
echo "<script>window.close();</script>";

?>


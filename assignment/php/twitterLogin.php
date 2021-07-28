<?php
//this file makes use of twitteroauth for PHP;
/***********************************************************
*    Title: twitteroauth
*    Author: Abraham Williams
*    Date: 22/03/2021
*    Code version: 2.0.1
*    Availability: https://github.com/abraham/twitteroauth
***********************************************************/


require "../twitteroauth/vendor/autoload.php";
require "config.php";
use Abraham\TwitterOAuth\TwitterOAuth;

session_start();

$tweetText= $_GET['tweetText'];
$_SESSION['tweetText'] = $tweetText;


$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);

$request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => OAUTH_CALLBACK));

//saving temporay tokens into PHP session
$_SESSION['oauth_token'] = $request_token['oauth_token'];
$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

//if requesting tokens was successful
if ($connection->getLastHttpCode()==200){
	//create Callback URL using users auth token
	$url = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));
	$url = $url ."&tweetText=".$tweetText;
	header('Location: '. $url) ;
} else {
  	die('Something wrong happened.' . " HTTP Error Code " .  $connection->getLastHttpCode());
}

?>
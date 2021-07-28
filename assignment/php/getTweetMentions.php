<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require "../twitteroauth/vendor/autoload.php";
require "config.php";

use Abraham\TwitterOAuth\TwitterOAuth;

// The TwitterOAuth instance
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);

$content = $connection->get("account/verify_credentials");

$tweets = $connection->get("search/tweets", array("q" => "@NU_CISdept%20OR%20@NULibrary%20OR%20@NorthumbriaUni%20OR%20@NorthumbriaSU", "exclude" => "retweets", "tweet_mode" => "extended", "count"=>"40"));

echo json_encode($tweets);

?>
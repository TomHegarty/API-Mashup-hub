<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/***************************************************************************************
*    Title: twitteroauth
*    Author: Abraham Williams
*    Date: 22/03/2021
*    Code version: 2.0.1
*    Availability: https://github.com/abraham/twitteroauth
***************************************************************************************/

require "../twitteroauth/vendor/autoload.php";
require "config.php";

use Abraham\TwitterOAuth\TwitterOAuth;

// The TwitterOAuth instance
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);

$content = $connection->get("account/verify_credentials");

$filterArray = $_POST['filterArray'];
$queryString = "&";


for ($i = 0; $i < count($filterArray); $i++) {
    $queryString.= ("from%3A" . $filterArray[$i]);
    if($i < (count($filterArray) - 1)){
        $queryString.= ("%20OR%20");
    }
}

$tweets= $connection->get("search/tweets", array("q" => $queryString, "exclude" => "retweets", "tweet_mode" => "extended", "count"=>"40"));

echo json_encode($tweets);

?>
<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require "../../twitteroauth/vendor/autoload.php";
require "../config.php";

use Abraham\TwitterOAuth\TwitterOAuth;

// The TwitterOAuth instance
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);

$content = $connection->get("account/verify_credentials");

$SUTweet = $connection->get("statuses/user_timeline", array('count' => 1, 'exclude_replies' => true, "tweet_mode" => "extended", 'screen_name' => "@NorthumbriaSU"));

echo json_encode($SUTweet);

?>
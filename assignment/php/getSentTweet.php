<?php
/**
 * simple script that the client can poll to get sent tweet data
 * @author Tom Hegarty
 */

session_start();
    if (isset($_SESSION['tweetText'])) {
        $tweetText = array("status" => "200", "text" => $_SESSION['tweetText'], "time" => $_SESSION['tweetTime'], "user" => $_SESSION['senderUser']);
    } else {
        $tweetText = array("status" => "204");
    }
    echo json_encode($tweetText);
?>
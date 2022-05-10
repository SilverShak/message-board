<?php

$con = new mysqli("localhost", "message_editor", "pass1234", "messageboard");

if ($con->connect_error) {
  die("Connection failed: " . $con->connect_error);
}

$con->set_charset("utf8mb4");

?>

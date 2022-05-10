<?php

$con = new mysqli("localhost", "messageboard", "pass1234", "message_editor");

if ($con->connect_error) {
  die("Connection failed: " . $con->connect_error);
}

$con->set_charset("utf8mb4");

?>

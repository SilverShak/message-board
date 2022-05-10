<?php

$con = new mysqli("localhost", "messages", "password", "user");

if ($con->connect_error) {
  die("Connection failed: " . $con->connect_error);
}

$con->set_charset("utf8mb4");

?>
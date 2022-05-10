<?php

include('connect_db.php');
header("Content-Type: application/json");

$data= json_decode(stripslashes(file_get_contents("php://input")));
$sql = "DELETE FROM messages WHERE DATEDIFF(CURDATE(),expiration) > 90";

//send response
if ($con->query($sql) === TRUE) {
  echo TRUE;
} else {
  echo "Error deleting record: " . $con->error;
}

mysqli_close($con);
?>
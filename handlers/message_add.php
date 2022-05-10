<?php

include('connect_db.php');
header("Content-Type: application/json");

$data= json_decode(file_get_contents("php://input"));

$category = strip_tags($data->category);
$message = strip_tags($data->message);
$author = strip_tags($data->author);
$expiration = strip_tags($data->expiration);

$regex = '/<\>#\\$;/i';

//replace /n in <br> - must come AFTER preg_match
$message = nl2br($message);

$stmt = $con->prepare("INSERT INTO messages (category, message, author, expiration) VALUES (?,?,?,?)");

if (false ===$stmt) {
	die('failed prepare: ' . htmlspecialchars($con->error));
}

$resultBind = $stmt->bind_param("ssss", $category, $message, $author, $expiration);

if (false ===$resultBind) {
	die('failed binding' . htmlspecialchars($stmt->error));
}

$resultExecute = $stmt->execute();

if (false ===$resultExecute) {
	die('failed execute: ' . htmlspecialchars($stmt->error));
} else {
	echo "record added successfully";
}

$stmt->close();


?>
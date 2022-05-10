<?php

include('connect_db.php');
header("Content-Type: application/json");

$data= json_decode(file_get_contents("php://input"));

$id = ($data->id);
$category = strip_tags($data->category);
$message = strip_tags($data->message);
$author = strip_tags($data->author);
$expiration = strip_tags($data->expiration);

//replace /n in <br> - must come AFTER preg_match
$message = nl2br($message);

$stmt = $con->prepare("UPDATE messages SET category=?, message=?, author=?, expiration=? WHERE id=?");

if (false ===$stmt) {
	die('failed prepare: ' . htmlspecialchars($con->error));
}

$resultBind = $stmt->bind_param("ssssi", $category, $message, $author, $expiration, $id);

if (false ===$resultBind) {
	die('failed binding' . htmlspecialchars($stmt->error));
}

$resultExecute = $stmt->execute();

if (false ===$resultExecute) {
	die('failed execute: ' . htmlspecialchars($stmt->error));
} else {
	echo "record edited successfully";
}

$stmt->close();

?>
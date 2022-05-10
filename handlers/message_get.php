<?php

include('connect_db.php');

$query_active = "SELECT id, category, message, author, timestamp, expiration FROM messages WHERE DATEDIFF(CURDATE(),expiration) <= 0 ORDER BY id DESC";
$query_all = "SELECT id, category, message, author, timestamp, expiration FROM messages ORDER BY id DESC";

$inputJSON = file_get_contents('php://input');
$request_arr = json_decode($inputJSON, TRUE); //convert JSON into array
$reqests_type = $request_arr['type'];

switch ($reqests_type) {
	
	case "active":
	  $query = $query_active;
	  break;
  
	case "all":
	  $query = $query_all;
	  break;
	 
  default: $query = $query_active;
}

$result = mysqli_query($con,$query);

echo '<script type="text/javascript">console.log("fetching")</script>';
		  
while($row = mysqli_fetch_array($result))
	
	{

	//parsing	
	$id = $row['id'];
	$category = $row['category'];
	$message = $row['message'];
	$author = $row['author'];
	$timestamp = date('d/m H:i', strtotime($row['timestamp']));
	$expiration = date('d/m/Y', strtotime($row['expiration']));
	
	
	$now = date('d/m/Y', strtotime('now'));
	
	//set category class
	if($expiration < $now) {
		$categoryClass = "categoryExpired";
	}
	else {
		switch ($category) {
		  
			case "כללי":
			  $categoryClass = "categoryGeneral";
			  break;
		  
			case "UptimeRobot":
			  $categoryClass = "categorUptimeRobot";
			  break;
			 
			 case "SIEM":
			  $categoryClass = "categorySIEM";
			  break;
			  
			  case "Cacti":
			  $categoryClass = "categoryCacti";
			  break;
			  
			  case "EPP":
			  $categoryClass = "CategoryEPP";
			  break;
		  
		  default: $categoryClass = null;
		}
	}
	
	echo '<div name="messageContainer" class="messageContainer ' . $categoryClass . '" data-id=' . $id . '>';

	echo "<br>";
	echo "<br>";
	
		echo '<span name="category" class="category">' . $category . '</span>';
		echo "<br>";
		echo '<span name="message" class="message">' . $message . '</span>';
		echo "<br>";
		echo "<br>";
		echo '<div class="messageMetaData">';
			echo '<span name="category" class="category">' . $category . '</span>';
			echo ' | ';
			echo 'על ידי: <span name="author" class="author">' . $author . '</span>';
			echo ' | ';
			echo 'פורסם ב- <span name="timestamp" class="timestamp">' . $timestamp . '</span>';
			echo ' | ';
			echo 'תוקף עד <span name="expiration" class="expiration">' .date('d/m', strtotime($row['expiration'])) . '</span>';
		echo "</div>";
		echo '<div class="editButtons">';
			//echo '<button class="btnMarkAsRead"></button>';
			echo '<button class="btnEdit"></button>';
			echo '<button class="btnDelete"></button>';
		echo "</div>";
		
	echo "</div>";
	
	}


mysqli_close($con);

?>
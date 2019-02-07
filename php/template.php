<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
if (isset($_REQUEST['pretty'])) {
	echo("<style>body, html{background:#222;color:green;font-family:monospace;font-size:18px;padding:0;margin:0;}body{padding:20px}</style>");
}else{
	header('Content-type: application/json; charset=utf-8');
}

/* */
include('../db.php');
/* Replace with

$servername = "localhost"; // server
$username = "root"; // login
$password = "password"; // password
$db = "database" // database
*/
$conn = new mysqli($servername, $username, $password);
$conn->set_charset("utf8");
mysqli_select_db($conn,$db);
if (!$conn){
	$data['status'] = "error";
	$data['message'] = "connection lost";
	die(json_encode($data, JSON_PRETTY_PRINT));
}
?>

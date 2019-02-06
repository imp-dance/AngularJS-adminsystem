<?php
include('template.php');
$token = $_REQUEST['token'];

$query = $conn->prepare("SELECT * FROM imp_users WHERE token = ? AND permission = 'root'");
$query->bind_param("s", $token);
$query->execute();
$results = $query->get_result();
if ($results->num_rows > 0){
    // ok
    $query = $conn->query("SELECT * FROM imp_users");
    $data = array();
    while ($row = $query->fetch_assoc()){
        array_push($data, array(
            "email" => $row['email'],
            "name" => $row['nick'],
            "validated" => $row['validated'],
            "permission" => $row['permission'],
            "id" => $row['id']
        ));
    }
    die(json_encode($data, JSON_PRETTY_PRINT));
}else{
    $data['status'] = 'error';
    $data['error'] = "Du har ikke tillatelse til å gjøre det.";
    die(json_encode($data, JSON_PRETTY_PRINT));
}
?>
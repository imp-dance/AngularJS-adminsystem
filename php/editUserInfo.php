<?php
include('template.php');
$token = $_REQUEST['token'];
$query = $conn->prepare("SELECT * FROM imp_users WHERE token = ? AND permission = 'root'");
$query->bind_param("s", $token);
$query->execute();
$results = $query->get_result();
if ($results->num_rows <= 0){
    $data['status'] = 'error';
    $data['error'] = "Du har ikke tillatelse til å gjøre det.";
    die(json_encode($data, JSON_PRETTY_PRINT));
}

$id = $_REQUEST['id'];
$name = $_REQUEST['name'];
$email = $_REQUEST['email'];
$permission = $_REQUEST['permission'];
$id = $_REQUEST['id'];
if (!is_numeric($id)){
    $data['status'] = 'error';
    $data['error'] = "Invalid ID.";
    die(json_encode($data, JSON_PRETTY_PRINT));
}
$querys = $conn->prepare("UPDATE imp_users SET email = ?, nick = ?, permission = ? WHERE id = ".$id);
$querys->bind_param("sss", $email, $name, $permission);
$status = $querys->execute();
if ($status === true){
    $data['status'] = 'success';
    die(json_encode($data, JSON_PRETTY_PRINT));
}else{
    $data['status'] = 'error';
    $data['error'] = $querys->error;
    die(json_encode($data, JSON_PRETTY_PRINT));
}
?>
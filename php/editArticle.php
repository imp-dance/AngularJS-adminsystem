<?php
include('template.php');
$token = $_REQUEST['token'];
$query = $conn->prepare("SELECT * FROM imp_users WHERE token = ?");
$query->bind_param("s", $token);
$query->execute();
$results = $query->get_result();
if ($results->num_rows <= 0){
    $data['status'] = 'error';
    $data['error'] = "Du har ikke tillatelse til å gjøre det.";
    die(json_encode($data, JSON_PRETTY_PRINT));
}

$title = $_REQUEST['title'];
$content = $_REQUEST['content'];
$published = $_REQUEST['published'];
$id = $_REQUEST['id'];
if (!is_numeric($id)){
    $data['status'] = 'error';
    $data['error'] = "Invalid ID.";
    die(json_encode($data, JSON_PRETTY_PRINT));
}
$querys = $conn->prepare("UPDATE imp_articles SET title = ?, content = ?, published = ? WHERE id = ".$id);
$querys->bind_param("sss", $title, $content, $published);
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
<?php
include('template.php');
$token = $_REQUEST['token'];
$query = $conn->prepare("SELECT * FROM imp_users WHERE token = ?");
$query->bind_param("s", $token);
$query->execute();
$results = $query->get_result();
if ($results->num_rows <= 0){
    // user exists
    $query->close();
    $data['status'] = 'error';
    $data['error'] = "Du har ikke tillatelse til å gjøre det";
    die(json_encode($data, JSON_PRETTY_PRINT));
}
$assoc = $results->fetch_assoc();
$author = $assoc['nick'];
$title = $_REQUEST['title'];
$content = $_REQUEST['content'];
$published = $_REQUEST['published'];
$querys = $conn->prepare("INSERT INTO imp_articles (title, content, published, author) VALUES (?, ?, ?, ?)");
$querys->bind_param("ssss", $title, $content, $published, $author);
if ($querys->execute()){
    $data['status'] = "success";
}else{
    $data['status'] = "error";
    $data['error'] = $querys->error;
}
die(json_encode($data, JSON_PRETTY_PRINT));
?>
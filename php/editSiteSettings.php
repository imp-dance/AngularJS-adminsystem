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

$domain = $_REQUEST['domain'];
$domain = strtolower($domain);
$domain = preg_replace('#^https?://#', '', $domain);
if (substr($domain, 0, 4) == "www."){
    $domain = substr($domain, 4);
}
$title = $_REQUEST['name'];
$description = $_REQUEST['description'];
$querys = $conn->prepare("UPDATE imp_sitesettings SET domain = ?, title = ?, description = ? WHERE current = 'abc'");
$querys->bind_param("sss", $domain, $title, $description);
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
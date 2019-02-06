<?php
include('template.php');
$name = $_REQUEST['name'];
$domain = $_REQUEST['domain'];
$domain = strtolower($domain);
$domain = preg_replace('#^https?://#', '', $domain);
if (substr($domain, 0, 4) == "www."){
    $domain = substr($domain, 4);
}
$description = $_REQUEST['description'];
$token = $_REQUEST['token'];
$query = $conn->prepare("SELECT * FROM imp_users WHERE token = ? AND permission = 'root'");
$query->bind_param("s", $token);
$query->execute();
$results = $query->get_result();
if ($results->num_rows > 0){
    // ok
}else{
    $data['status'] = 'error';
    $data['error'] = "Du har ikke tillatelse til å gjøre det.";
    die(json_encode($data, JSON_PRETTY_PRINT));
}
$qZ = $conn->prepare("SELECT * FROM imp_sitesettings");
$qZ->bind_param("s", $token);
$qZ->execute();
$results = $qZ->get_result();
if ($results->num_rows > 0){
    $data['status'] = 'error';
    $data['error'] = "Sideinstillinger allerede lagt til.";
    die(json_encode($data, JSON_PRETTY_PRINT));
}else{
    // ok
}
$querys = $conn->prepare("INSERT INTO imp_sitesettings (domain, title, description) VALUES (?, ?, ?)");
    $querys->bind_param("sss", $domain, $name, $description);
    if ($querys->execute()){
        $data['status'] = 'success';
    }else{
        // query failed
        $data['status'] = 'error';
        $data['error'] = $querys->error;
    }

die(json_encode($data, JSON_PRETTY_PRINT));
?>
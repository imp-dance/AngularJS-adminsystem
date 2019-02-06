<?php
include('template.php');

$username = $_REQUEST['email'];
$name = $_REQUEST['name'];
$token = $_REQUEST['token'];
$permission = $_REQUEST['permission'];
$textmessage = $_REQUEST['message'];
$textmessage = strip_tags($textmessage, "<br>");
$textmessage = nl2br($textmessage);
$password = substr(md5(uniqid($username, true)), 0, 7);
$plainpassword = $password;
$password = password_hash($password, PASSWORD_DEFAULT);
$query = $conn->prepare("SELECT * FROM imp_users WHERE email = ?");
$query->bind_param("s", $username);
$query->execute();
$results = $query->get_result();
if ($results->num_rows > 0){
    // user exists
    $query->close();
    $data['status'] = 'error';
    $data['error'] = "Bruker med emailen eksisterer allerede";
}else{
    // user doesn't exist
    $query->close();
    // insert new user
    if (filter_var($username, FILTER_VALIDATE_EMAIL)){
        // email is ok
    }else{
        $data['status'] = 'error';
        $data['error'] = "Ikke en valid email-addresse";
        die(json_encode($data, JSON_PRETTY_PRINT));
    }
    if (empty($name)){
        $data['status'] = 'error';
        $data['error'] = "Vennligst legg inn navn";
        die(json_encode($data, JSON_PRETTY_PRINT));
    }
    if ( !in_array($permission, array('1','2', '3'), true ) ) {
        $data['status'] = 'error';
        $data['error'] = "Vennligst velg tillatelsesnivå";
        die(json_encode($data, JSON_PRETTY_PRINT));
    }
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
    $token = md5(uniqid($password, true));
    $token = str_replace('"', "", $token);
    $token = str_replace("'", "", $token);
    $vertification = md5(uniqid($username, true));
    $vertification = str_replace('"', "", $vertification);
    $vertification = str_replace("'", "", $vertification);
    $querys = $conn->prepare("INSERT INTO imp_users (email, password, token, vertification, permission, nick) VALUES (?, ?, '".$token."', '".$vertification."', '".$permission."', ?)");
    $querys->bind_param("sss", $username, $password, $name);
    if ($querys->execute()){
        $subject = "Du har blitt invitert til administering av nettsted";
        $message = "Lag brukeren din ved å besøke denne linken: https://impedans.me/ang/auth/?k=".$vertification."<br />";
        $message .= "Midlertidig passord:  '".$plainpassword."'. Dette må du endre når du logger inn.";
        if (!empty($textmessage)){
            $message .= "<br /><br />Melding fra administrator:<br /><hr />  ".$textmessage;
        }
        // Always set content-type when sending HTML email
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

        // More headers
        $headers .= 'From: impedans.me <impedans.me@gmail.com>' . "\r\n";
        mail($username,$subject,$message,$headers);
        $data['loginToken'] = $token;
        $data['status'] = 'success';
    }else{
        // query failed
        $data['status'] = 'error';
        $data['error'] = $querys->error;
    }
}
die(json_encode($data, JSON_PRETTY_PRINT));
?>
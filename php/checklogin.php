<?php
include('template.php');
$method = $_REQUEST['method'];


if ($method == "password"){
    $username = $_REQUEST['username'];
    $password = $_REQUEST['password'];

    $query = $conn->prepare("SELECT * FROM imp_users WHERE email = ?");
    $query->bind_param("s", $username);
    $query->execute();
    $results = $query->get_result();
    $udata = $results->fetch_assoc();
    if (password_verify($password, $udata['password'])){
        $query->close();
        // user exists...
        // generate new token
        $token = md5(uniqid($password, true));
        $token = str_replace('"', "", $token);
        $token = str_replace("'", "", $token);
        $querys = $conn->prepare("UPDATE imp_users SET token = '".$token."' WHERE email = ?");
        $querys->bind_param("s", $username);
        if ($querys->execute()){
            // ...return success and token
            $data['loginToken'] = $token;
            $data['status'] = 'success';
        }else{
            $data['status'] = 'error';
            $data['error'] = $querys->error;
        }

    }else{
        // return error
        $data['status'] = 'error';
        $data['error'] = "Bruker eksisterer ikke.";
    }

    die(json_encode($data, JSON_PRETTY_PRINT));

}else if ($method == "token"){
    $token = $_REQUEST['token'];
    $query = $conn->prepare("SELECT * FROM imp_users WHERE token = ?");
    $query->bind_param("s", $token);
    $query->execute();
    $results = $query->get_result();
    if ($results->num_rows > 0){
        $data['status'] = 'success';
    }else{
        $data['status'] = 'error';
        $data['error'] = "invalid token";
    }
    die(json_encode($data, JSON_PRETTY_PRINT));
}
?>
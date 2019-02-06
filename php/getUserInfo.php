<?php
include('template.php');

$token = $_REQUEST['token'];
if (!empty($_REQUEST['id'])){
    $id = $_REQUEST['id'];
    $query = $conn->prepare("SELECT * FROM imp_users WHERE token = ?");
    $query->bind_param("s", $token);
    if ($query->execute()){
        $results = $query->get_result();
        if ($results->num_rows > 0){
            $queryZ = $conn->prepare("SELECT * FROM imp_users WHERE id = ?");
            $queryZ->bind_param("s", $id);
            if ($queryZ->execute()){
                $resultsZ = $queryZ->get_result();
                if ($resultsZ->num_rows > 0){
                    $userinfo = $resultsZ->fetch_assoc();
                    $data['status'] = "success";
                    $data['nick'] = $userinfo['nick'];
                    $data['email'] = $userinfo['email'];
                    $data['validated'] = $userinfo['validated'];
                    $data['permission'] = $userinfo['permission'];
                }else{
                    $data['status'] = "error";
                    $data['error'] = "couldn't find user";
                }
            }else{
                $data['status'] = "error";
                $data['error'] = $queryZ->error;
            }
        }else{
            $data['status'] = "error";
            $data['error'] = "invalid token";
        }
    }else{
        $data['status'] = "error";
        $data['error'] = $query->error;
    }
}else{
    $query = $conn->prepare("SELECT * FROM imp_users WHERE token = ?");
    $query->bind_param("s", $token);
    if ($query->execute()){
        $results = $query->get_result();
        if ($results->num_rows > 0){
            $userinfo = $results->fetch_assoc();
            $data['status'] = "success";
            $data['nick'] = $userinfo['nick'];
            $data['email'] = $userinfo['email'];
            $data['validated'] = $userinfo['validated'];
            $data['permission'] = $userinfo['permission'];
        }else{
            $data['status'] = "error";
            $data['error'] = "invalid token";
        }
    }else{
        $data['status'] = "error";
        $data['error'] = $query->error;
    }
}
die(json_encode($data, JSON_PRETTY_PRINT));
?>
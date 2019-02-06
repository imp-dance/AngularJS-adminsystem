<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include('template.php');
$token = $_REQUEST['token'];

$query = $conn->prepare("SELECT * FROM imp_users WHERE token = ?");
$query->bind_param("s", $token);

if ($query->execute()){
    $results = $query->get_result();
    if ($results->num_rows > 0){

        $id = $_REQUEST['id'];
        if (is_numeric($id)){

        }else{
            $data['status'] = "error";
            $data['error'] = "Feil ID";
            die(json_encode($data, JSON_PRETTY_PRINT));
        }
        $articleInfo = $conn->query("SELECT * FROM imp_articles WHERE id = ".$id);
        if ($articleInfo->num_rows > 0){
            $as = $articleInfo->fetch_assoc();
            $data['title'] = $as['title'];
            $data['id'] = $as['id'];
            $data['content'] = $as['content'];
            $data['author'] = $as['author'];
            $data['published'] = $as['published'];
            $prettydate = substr($as['date'],0,10);
            $y = substr($prettydate, 0, 4);
            $m = substr($prettydate, 5, 2);
            $d = substr($prettydate, 8, 2);
            $prettydate = $d."/".$m."/".$y;
            $data['date'] = $prettydate;
            $data['status'] = "success";
        }else{
            $data['status'] = "error";
            $data['error'] = "Fant ikke artikkel";
        }
    }else{
        $data['status'] = "error";
        $data['error'] = "Du har ikke tillatelse til å gjøre det.";
    }
}else{
    $data['status'] = "error";
    $data['error'] = "Feil på server-siden.";
}
die(json_encode($data, JSON_PRETTY_PRINT));
?>
<?php
include('template.php');
// Count total files
$countfiles = count($_FILES['files']['name']);
// Looping all files
$data['status'] = "error";
if ($_SERVER['SERVER_PORT']  == 443 || $_SERVER['SERVER_PROTOCOL'] == 'https'){
    $protocol = "https://";
}else{
    $protocol =="http://";
}
$token = $_REQUEST['token'];
$query = $conn->prepare("SELECT * FROM imp_users WHERE token = ?");
$query->bind_param("s", $token);
$query->execute();
$results = $query->get_result();
if ($results->num_rows > 0){
    // ok
    $results = $results->fetch_assoc();
    if ($results['permission'] == "1" || $results['permission'] == "2"){
        $data['status'] = 'error';
        $data['error'] = "Du har ikke tillatelse til å gjøre det.";
        header("Location: ".$protocol.dirname(dirname($_SERVER[HTTP_HOST].$_SERVER[REQUEST_URI]))."/#!/no-permission");
        die(json_encode($data, JSON_PRETTY_PRINT));
    }
}else{
    $data['status'] = 'error';
    $data['error'] = "Du har ikke tillatelse til å gjøre det.";
    die(json_encode($data, JSON_PRETTY_PRINT));
}
for($i=0;$i<$countfiles;$i++){
    $ranstring = "test";
    $filename = substr(md5(uniqid($ranstring, true)), 0, 5)."-".$_FILES['files']['name'][$i];
    switch ($_FILES['files']['error'][$i]) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            $data[$i]['status'] = "error";
            $data[$i]['message'] = "no file sent";
            die(json_encode($data, JSON_PRETTY_PRINT));
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            $data[$i]['status'] = "error";
            $data[$i]['message'] = "exceeded file size limit";
            die(json_encode($data, JSON_PRETTY_PRINT));
        default:
            $data[$i]['status'] = "error";
            $data[$i]['message'] = "unknown error";
            die(json_encode($data, JSON_PRETTY_PRINT));
    }
    if ($_FILES['files']['size'][$i] > 5000000) {
        $data[$i]['status'] = "error";
        $data[$i]['message'] = "exceeded file size limit";
        die(json_encode($data, JSON_PRETTY_PRINT));
    }
    $data['ran'] = "true";
    // Upload file
    $target = $_SERVER['DOCUMENT_ROOT'] . '/imp/files/';
    $target = $target . basename($filename);
    if (move_uploaded_file($_FILES['files']['tmp_name'][$i],$target)){
        $data['status'] = "success";
        $data[$i]['status'] = "success";
        $data[$i]['fileurl'] = $target;
        header("Location: ".$protocol.dirname(dirname($_SERVER[HTTP_HOST].$_SERVER[REQUEST_URI]))."/#!/upload");
    }else{
        $data[$i]['status'] = "error";
        $data[$i]['filename'] = $filename;
        $data[$i]['error'] = "Error moving file to ".$target;
    }
}
echo json_encode($data, JSON_PRETTY_PRINT);
?>
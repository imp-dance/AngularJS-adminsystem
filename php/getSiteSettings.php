<?php
include('template.php');
    // ok
    $querys = $conn->prepare("SELECT * FROM imp_sitesettings");
    $querys->execute();
    $settings = $querys->get_result();
    if ($settings->num_rows > 0){
        $settings = $settings->fetch_assoc();

        $data['status'] = "success";
        $data['domain'] = $settings['domain'];
        $data['title'] = $settings['title'];
        $data['description'] = $settings['description'];
        die(json_encode($data, JSON_PRETTY_PRINT));
    }else{

        $data['status'] = "error";
        $data['errorCode'] = "2";
        $data['error'] = "Vennligst legg inn sideinstillinger";
        die(json_encode($data, JSON_PRETTY_PRINT));
    }

?>
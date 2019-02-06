<?php
include('template.php');
$data["status"] = "error";
$protocol = "http://";
function formatSizeUnits($bytes)
    {
        if ($bytes >= 1073741824)
        {
            $bytes = number_format($bytes / 1073741824, 2) . ' GB';
        }
        elseif ($bytes >= 1048576)
        {
            $bytes = number_format($bytes / 1048576, 2) . ' MB';
        }
        elseif ($bytes >= 1024)
        {
            $bytes = number_format($bytes / 1024, 2) . ' KB';
        }
        elseif ($bytes > 1)
        {
            $bytes = $bytes . ' bytes';
        }
        elseif ($bytes == 1)
        {
            $bytes = $bytes . ' byte';
        }
        else
        {
            $bytes = '0 bytes';
        }

        return $bytes;
}
if ($_SERVER['SERVER_PORT']  == 443 || $_SERVER['SERVER_PROTOCOL'] == 'https'){
    $protocol = "https://";
}else{
    $protocol =="http://";
}
if ($handle = opendir('../files/')) {
    $data['status'] = "success";
    $data['dir'] = array();
    while (false !== ($entry = readdir($handle))) {

        if ($entry != "." && $entry != "..") {
            $fileurl = $protocol.dirname(dirname($_SERVER[HTTP_HOST].$_SERVER[REQUEST_URI]))."/files/".$entry;
            array_push($data['dir'], array(
                "name" => substr(preg_replace('/\\.[^.\\s]{3,4}$/', '', $entry), 6),
                "url" => $fileurl,
                "size" => formatSizeUnits(filesize("../files/".$entry)),
                "ext" => ".".pathinfo($entry, PATHINFO_EXTENSION)
            ));
        }
    }

    closedir($handle);
}
die(json_encode($data, JSON_PRETTY_PRINT));
?>
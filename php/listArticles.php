<?php
include('template.php');
$token = $_REQUEST['token'];

$query = $conn->prepare("SELECT * FROM imp_users WHERE token = ?");
$query->bind_param("s", $token);
$query->execute();
$results = $query->get_result();
if ($results->num_rows > 0){
    // ok
    $query = $conn->query("SELECT * FROM imp_articles ORDER BY date DESC");
    $data = array();
    while ($row = $query->fetch_assoc()){
        $prettydate = substr($row['date'],0,10);
        $y = substr($prettydate, 0, 4);
        $m = substr($prettydate, 5, 2);
        $d = substr($prettydate, 8, 2);
        $prettydate = $d."/".$m."/".$y;
        array_push($data, array(
            "id" => $row['id'],
            "title" => $row['title'],
            "author" => $row['author'],
            "date" => $prettydate,
            "published" => $row['published']
        ));
    }
    die(json_encode($data, JSON_PRETTY_PRINT));
}else{
    $data['status'] = 'error';
    $data['error'] = "Du har ikke tillatelse til å gjøre det.";
    die(json_encode($data, JSON_PRETTY_PRINT));
}
?>
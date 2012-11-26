<?php
if(!empty($_POST['id'])) {
  $filename = './stats.json';
  if(is_writable($filename)) {
    $new_stats = array('id' => $_POST['id'], 'userAgent' => $_POST['userAgent'], 'platform' => $_POST['platform']);
    $h = fopen($filename, 'a+');
    $old_stats = json_decode(fread($h, filesize($filename)),true);
    print_r($old_stats);
    if(!is_array($old_stats)){
      ftruncate($h, 0);
      fwrite($h, "[".json_encode($new_stats)."]");
    } else if(!in_array($_POST['id'], $old_stats)){
      echo "in array";
      print_r($new_stats);
      array_push($old_stats,$new_stats);
      print_r($old_stats);
      ftruncate($h, 0);
      fwrite($h, json_encode($old_stats));
    }
    fclose($h);
    exit;
  }
}
?>  
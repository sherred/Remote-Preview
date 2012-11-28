<?php
$filename = './stats.json';
$msg['nodevices'] = "<p>No devices connected</p>";
$msg['connecteddevices'] = "<p>Connected devices: %s</p>";
$msg['devicenum'] = "<p>Device %s</p>";
$msg['devicedetails'] = "<ul><li>User Agent: %s</li><li>Platform: %s</li></ul>";

function err($msg) {
  header('HTTP/1.0 400 Bad Request');
  echo $msg;
  exit( E_ERROR );
}

if (!is_writable($filename)) {
  err('Error: cannot get stats.');
}

$h = fopen($filename, 'a+');
$old_stats = json_decode(fread($h, filesize($filename)),true);
if(!is_array($old_stats)){
  ftruncate($h, 0);
  echo $msg['nodevices'];
} else {
  $message = "";
  $i = 1;
  $new_stats = array();
  foreach ($old_stats as $key => $data) {
    $devicedate = new DateTime($data['expires'], new DateTimeZone('Europe/London'));
    $currentdate = new DateTime("now", new DateTimeZone('Europe/London'));
    //echo $devicedate->diff($currentdate)->i;
    if($devicedate->diff($currentdate)->i > 0) {
      $new_stats[] = $data;
      $message .= sprintf($msg['devicenum'],$i).sprintf($msg['devicedetails'],$data['userAgent'],$data['platform']);
      $i++;
    }
  }
  ftruncate($h, 0);
  if(!empty($new_stats)) fwrite($h, json_encode($new_stats));

  echo sprintf($msg['connecteddevices'],count($new_stats)).$message;
}
fclose($h);
exit;
?>
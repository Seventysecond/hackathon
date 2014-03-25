<?php


require_once("config.php");	
header("Content-Type:text/html;charset=utf-8");

$user=$_POST['user'];
$activity=$_POST['activity'];
$time=$_POST['time'];
$isAttend=$_POST['isAttend'];

if(strcmp ($isAttend,"false") ==0) {
  mysql_query("delete from attend where user = '".$user."' AND activityname = '".$activity."'");
  echo "{isAttend:false}";
} else {
	mysql_query("INSERT into `attend` (user,activityname,time) VALUES('".$user."','".$activity."','".$time."')");
  echo "{isAttend:true}";
}
?>


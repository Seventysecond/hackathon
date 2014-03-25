<?php

require_once("config.php");	
header("Content-Type:text/html;charset=utf-8");

$user=$_POST['user'];
$count=$_POST['count'];

		
$result = mysql_query("Select * from `login` where user = '".$user."'");
if(mysql_num_rows($result) > 0){
	echo 'non-first';
}else{
	mysql_query("INSERT into `login` (user,count) VALUES('".$user."','".$count."')");
	echo 'first';
}
?>
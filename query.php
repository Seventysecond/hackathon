<?php
    require_once '/facebook/src/facebook.php';
	require_once("config.php");	
	header("Content-Type:text/html;charset=utf-8");
/**
 * Create an application instance on Facebook developers.
 * Replace with your own values.
 */
		$facebook = new Facebook(array(
		'appId'  => '601657683254901',
		'secret' => '2fb21c4a953cad80c43e2ae62c9d1d0e',
		'cookie' => true,
		));

	//Create Query
	$params = array(
	    'method' => 'fql.query',
	    'query' => "select uid, name, is_app_user, pic_small from user where (uid in (select uid2 from friend where uid1=me()) or uid=me()) and is_app_user=1",
	);

	//Run Query
	$user = $facebook->api($params);
	//print_r($user);
	$stack = array();
	$photo = array();
	foreach($user as $i => $value){		
		$result = mysql_query("Select * from `attend` where user = '".$user[$i]["uid"]."'");		
		$photo[$user[$i]["uid"]] = $user[$i]["pic_small"];
		while($row = mysql_fetch_array($result)){
			$actname = $row['activityname'];
			$uid = $row['user'];
			if(!array_key_exists($actname, $stack))
				$stack[$actname] = array($uid);
			else
			{
				array_push($stack[$actname],$uid);			
			}
		}
	}
	$result = array( "stack" => $stack, "photo" => $photo );
	echo json_encode($result);
?>
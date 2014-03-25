<?php
    require '/src/facebook.php';

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
	    'query' => "select uid, name, is_app_user from user where uid in (select uid2 from friend where uid1=me()) and is_app_user=1",
	);

	//Run Query
	$result = $facebook->api($params);
	print_r($result);
?>
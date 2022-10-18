<?php
	
	$arrContextOptions=array(
		"ssl"=>array(
			"verify_peer"=>false,
			"verify_peer_name"=>false,
		),
	);  
	
	$x1 = $_COOKIE['cookie1'];
	$x2 = $_COOKIE['cookie2'];
	$y1 = $_COOKIE['cookie3'];
	$y2 = $_COOKIE['cookie4'];
	
	
	$left = $_COOKIE['left'];
	$right = $_COOKIE['right'];
	$up = $_COOKIE['up'];
	$down = $_COOKIE['down'];
	
	$xdim = strval(20);
	$ydim = strval(20);
	$resolution = strval(20);
	
	//$url = 'https://data.geodac.tw/geoinfo_api/api/geodac/gis/demquery?xmin='.$NewString[0]."&xmax=".$NewString[1]."&ymin=".$NewString[2]."&ymax="..$NewString[3]."&xdim=".$xdim."&ydim=".$ydim."&resolution=".$resolution;
	//$url = 'https://data.geodac.tw/geoinfo_api/api/geodac/gis/demquery?xmin='.$NewString[0].'&xmax='.$NewString[1].'&ymin='.$NewString[2].'&ymax='.$NewString[3].'&xdim=20&ydim=20&resolution=20m';
	$url = 'https://data.geodac.tw/geoinfo_api/api/geodac/gis/demquery?xmin='.$x1.'&xmax='.$x2.'&ymin='.$y1.'&ymax='.$y2.'&xdim=50&ydim=50&resolution=20m';
	
	$crl = curl_init();
	
	curl_setopt($crl, CURLOPT_URL, $url);
	curl_setopt($crl, CURLOPT_FRESH_CONNECT, true);
	curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
	
	$output = curl_exec($crl);
	curl_close($crl);

	$response = file_get_contents($url , false, stream_context_create($arrContextOptions));
	//echo "callback(" . json_encode($response) . ");";
	//echo $response;
	echo json_encode($response); 
	
		ob_start();
	if (isset($_COOKIE['cookie1'])) {
		unset($_COOKIE['cookie1']);
		setcookie('cookie1', null, -1, '/');
	}
	if (isset($_COOKIE['cookie2'])) {
		unset($_COOKIE['cookie2']);
		setcookie('cookie2', null, -1, '/');
	}
	if (isset($_COOKIE['cookie3'])) {
		unset($_COOKIE['cookie3']);
		setcookie('cookie3', null, -1, '/');
	}
	if (isset($_COOKIE['cookie4'])) {
		unset($_COOKIE['cookie4']);
		setcookie('cookie4', null, -1, '/');
	}
	ob_end_flush();

?>

<?php
	
	$arrContextOptions=array(
		"ssl"=>array(
			"verify_peer"=>false,
			"verify_peer_name"=>false,
		),
	);  
	
	$x1 = $_GET['x1'];
	$x2 = $_GET['x2'];
	$y1 = $_GET['y1'];
	$y2 = $_GET['y2'];
	
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


?>

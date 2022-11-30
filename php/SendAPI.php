<?php



$ch = curl_init();
// echo $_GET["u"];
curl_setopt($ch, CURLOPT_URL, $_GET["u"]); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); //這個是重點,規避ssl的證書檢查。
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE); // 跳過host驗證
$return = curl_exec($ch);   
curl_close($ch);
echo $return;
// return $_GET["u"];

?>
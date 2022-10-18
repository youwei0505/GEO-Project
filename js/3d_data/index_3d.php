<?php header('Access-Control-Allow-Origin: *'); ?>
<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>Terrain</title>
<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
<link rel="stylesheet" type="text/css" href="./Qgis2threejs.css">
<link rel="stylesheet" type="text/css" href="../../codebase/dhtmlx.css">

</head>
<body onLoad="onLoad()">
<div id="webgl"></div>
<script src="./threejs/three.min.js"></script>
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r120/three.min.js"></script> -->
<script src="./lib/stats.min.js"></script>
<script src="./threejs/OrbitControls.js"></script>
<script src="./threejs/EventsControls.js"></script>


<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<!-- <script src='http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'></script> -->
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">



<script src="../../codebase/dhtmlx.js"></script>

<script type="text/javascript" src="./tool3d.js"></script>
<script type="text/javascript" src="./map3d.js"></script>
<script type="text/javascript" src="./build3d.js"></script>
<script type="text/javascript" src="./index_3d.js"></script>
<script type="text/javascript" src="./earthquake3d.js"></script>
<script type="text/javascript" src="./wall3d.js"></script>
<script type="text/javascript" src="./plane3d.js"></script>
<script type="text/javascript" src="./event_listener3d.js"></script>

	<div id="tooltip">"123"</div>
	
	<div id="popup" style="display:none;">
		<div id="popupbar">
			<span id="closebtn">X</span>
		</div>
		<div id="popupcontent">
			<button id = "wf_btn">wireframe on</button>
			<button id = "side_btn">side off</button>
			<button id = "url_btn">get terrian data</button>
			<button id = "model_btn">bulid model</button>
			<p class="text">Replace me!!</p>
			<div id="queryresult"></div>
			<div id="pageinfo">
				<hr>
				<h1>Infomation:</h1>
				<div id="info"></div>
				<hr>
				<h1>Help:</h1>
				<div id="usage"></div>
				<hr>
			</div>
		</div>
	</div>

	<div id="Cursor_Coord" style="bottom:5px;left:50px; height:20px;width:200px;text-align:center; "></div>
	<div id="footer"><div id="infobtn">i</div></div>
	<div id="floatingCirclesG">
		<div class="f_circleG" id="frotateG_01"></div>
		<div class="f_circleG" id="frotateG_02"></div>
		<div class="f_circleG" id="frotateG_03"></div>
		<div class="f_circleG" id="frotateG_04"></div>
		<div class="f_circleG" id="frotateG_05"></div>
		<div class="f_circleG" id="frotateG_06"></div>
		<div class="f_circleG" id="frotateG_07"></div>
		<div class="f_circleG" id="frotateG_08"></div>
	</div>
		<div id="menu_slider_scroll">
		<div id="menu_tab">
			<span>◄</span>
			<span>輔</span>
			<span>助</span>     
			<span>選</span>
			<span>單</span>  	
		</div>
		<div id="menu_slider_content">
			<div class='content'> 
				<div class = "field">
				
					<font size="5" color="black">&nbsp;&ensp;鑽井資料</font>
					<button id="wall_data_button" class = "ui button">開啟鑽探資料</button>
					<button id="mountain_wall_data_button" class = "ui button">開啟山區水文鑽探資料</button>
					<button id="plane_wall_data_button" class = "ui button">開啟平原區水文鑽探資料</button>
					
					<font size="5" color="black">&nbsp;&ensp;地震資料</font>
					<button id="earthquake_data_button" class = "ui button" >開啟地震資料</button>

					<div id="earthquake_info_block" style="display:none; color:black; font-size:15px; left:10px;">
						<label><input type="checkbox" id="show_earthquake_center" checked="checked"> 震央顯示 </label>
						<label><input type="checkbox" id="center_source_line" checked="checked"> 震央震源連線 </label>
						<label><input type="checkbox" id="show_earthquake_source" checked="checked"> 震源顯示 </label>
						
						<p id="bidirection_slider_mag3d">
						規模大小  Min: <span id="3dhslider_mag_L">  </span>
						Max: <span id="3dhslider_mag_H">  </span>
						</p>
						<div id="hslider_mag3d" style="width:200px; left:20px;"></div>
						<br>
						<p id="bidirection_slider_depth3d">
						地震深度  Min: <span id="3dhslider_depth_L">  </span>
						Max: <span id="3dhslider_depth_H">  </span>
						</p>
						<div id="hslider_depth3d" style="width:200px; left:20px;"></div>
						<br>
						<p id="bidirection_slider_time3d">
						時間  From: <span id="3dhslider_time_L">  </span>
							To: <span id="3dhslider_time_H">  </span>
						</p>
						<div id="hslider_time3d" style="width:200px; left:20px;"></div>
					</div>
					
					<hr>
					<font size="5" color="black" >&nbsp;&ensp;視覺效果</font>
					<font size="2" color="black">&nbsp;&ensp;(請先關閉底座，再調整地形高度倍率)</font>
					<button id="side_button" class = "ui button">關閉底座</button>
					<input type="range" min="0" max="5" value="1" step = "0.1" class="slider" id="myRange">
					<font size="3" color="black" id = "val_z">&nbsp;&ensp;高度倍率：1.0</font>
					<button id="wireframe_button" class = "ui button">開啟網格</button>
				</div>
			</div>
		</div>
	</div>
	</body>
	
</html>


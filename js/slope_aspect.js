var slope_layer;
var slope_draw;
var slope_draw_type = "none";
var left_slope;
var up_slope;
var right_slope;
var down_slope;

var SlopeClassify_area_ulim = 50.0;
var SlopeClassify_area_dlim = 4.0;
var ImageFileLV7_area_ulim = 50.0;
var ImageFileLV7_area_dlim = 4.0;
var ImageLV7_area_ulim = 50.0;
var ImageLV7_area_dlim = 4.0;
var ImageFileLV6_area_ulim = 50.0;
var ImageFileLV6_area_dlim = 4.0;
var ImageLV6_area_ulim = 50.0;
var ImageLV6_area_dlim = 4.0;
var ImageFile30Percent_area_ulim = 50.0;
var ImageFile30Percent_area_dlim = 4.0;
var SlopeRange_area_ulim = 50.0;
var SlopeRange_area_dlim = 4.0;
var ImageDPLV6_area_ulim = 50.0;
var ImageDPLV6_area_dlim = 4.0;

var AspectClassify_area_ulim = 50.0;
var AspectClassify_area_dlim = 4.0;
var AspectImageFile_area_ulim = 50.0;
var AspectImageFile_area_dlim = 4.0;
var AspectImage_area_ulim = 50.0;
var AspectImage_area_dlim = 4.0;

var slope_area;
var aspect_area;

$(document).ready(function () {
	slope_layer = new ol.layer.Vector({source: new ol.source.Vector()});
    slope_layer.set('name', 'slope_layer');
    maps[map_ind].addLayer(slope_layer);
	
	/*** add 1015 ***/
	slope_layer.setZIndex(draw_box_zindex);
	/****************/
});

function slope_function_show(isLandslideDam){
	btn_disable();
	if(isLandslideDam == 1)
	{
		//show at LandslideDam
//		$('#Analysis_1_4')[0].style.display = "none";
		if($('#Analysis_1_4')[0].classList.contains("active"))
		{
			console.log("Active, inactive the function");
			$('#Analysis_1_4')[0].classList.toggle("active");
			$('#original_slope')[0].classList.toggle("active");
		}
		$('#original_slope').html(``);
		$('#original_slope')[0].style.display = "none";
		$('#landslidedam_slope').html(` 
			<div id='slope_tool'> 
                <!-- 20190515 fixed -->
				<div class='ui secondary menu'>
					<a class='item' id = 'slope_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'slope_paint06'><img src='img/paint06.png'></a>
					<br>
				</div> 
                <!-- 20190515 fixed -->
			</div> 
			<select id='slope_select' onchange='slope_tool_show()' class='select-control'> 
                <!-- 20190515 fixed -->
				<!--<option value='坡度分析' selected='selected'>坡度分析</option>-->
                <!-- 20190515 fixed -->
				<option value='getSlopeValue'>單點坡度資訊(getSlopeValue)</option>
				<!--option value='getSlopeClassify'>坡度分級分析(getSlopeClassify)</option-->
				<option value='getImageFileLV7' >坡度分級影像地圖(7級)(getImageFileLV7)</option>
				<!--option value='getImageLV7'>套疊坡度分級WMS(7級)(getImageLV7)</option-->
				<option value='getImageFileLV6'>坡度分級影像地圖(6級)(getImageFileLV6)</option>
				<!--option value='getImageLV6'>套疊坡度分級WMS(6級)(getImageLV6)</option-->
				<!--option value='getImageFile30Percent'>坡度大於30%分級影像地圖(getImageFile30Percent)</option-->
				<!--option value='getSlopeRange'>坡度統計值(getSlopeRange)</option-->
				<option value='getImageDPLV6' selected='selected'>災害潛勢坡度分級圖檔(getImageDPLV6)</option>
		   </select> 
		   <br><br>
		   點位<br><br>
		   <input type='text' id='slope_locate' placeholder='請從地圖上點位' class='disable-control' disabled><br><br>
		   數值資料<br><br>
		   <select id='slope_data' class='select-control'> 
				<option value='TW_DLA_20010814_20061226_20M_3826'>20M TW DLA DTM (92-94年)</option>
				<option value='TW_DLA_20110101_20161101_20M_3826' selected='selected'>20M TW DLA DTM (99-104年)</option>
				<!-- 20190513 fixed -->
				<!--<option value='TW_DLA_20010814_20061226_5M_3826'>5M TW DLA DTM (92-94年)</option>-->
				<!-- 20190513 fixed -->
		   </select> 
		   <br><br>
		   <button class='ui button' id="slope_execute" onclick = 'slope_execute()'>執行</button>
			<!-- 20190513 fixed -->
		   <div id='tree_slope' style='width:100%;height:200;'></div> 
		   <div id='slope_result'></div>
			<!-- 20190513 fixed -->
			`);

		btn_enable();
		clear_map();
		createMeasureTooltip(); 

		null_slope_Tree = new dhtmlXTreeObject("tree_slope", "100%", "100%", 0);
		drawer_win_call();
		draw_slope_Tree.moveItem("0","item_child","0",null_slope_Tree);
	}
	else
	{
		//show at LandAPIs
//		$('#Analysis_1_4')[0].style.display = "";
		$('#landslidedam_slope').html(``);
		if(Landslidedam_w1_Acc.cells('a3_1').isOpened())
		{
			//console.log("Cell open, closed");
			Landslidedam_w1_Acc.cells('a3_0').open();
		}
		$('#original_slope')[0].style.display = "";
		$('#original_slope').html(` 
			<div id='slope_tool'> 
                <!-- 20190515 fixed -->
				<div class='ui secondary menu'>
					<a class='item' id = 'slope_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'slope_paint06'><img src='img/paint06.png'></a>
					<br>
				</div> 
                <!-- 20190515 fixed -->
			</div> 
			<select id='slope_select' onchange='slope_tool_show()' class='select-control'> 
                <!-- 20190515 fixed -->
				<!--<option value='坡度分析' selected='selected'>坡度分析</option>-->
                <!-- 20190515 fixed -->
				<option value='getSlopeValue'>單點坡度資訊(getSlopeValue)</option>
				<!--option value='getSlopeClassify'>坡度分級分析(getSlopeClassify)</option-->
				<option value='getImageFileLV7' >坡度分級影像地圖(7級)(getImageFileLV7)</option>
				<!--option value='getImageLV7'>套疊坡度分級WMS(7級)(getImageLV7)</option-->
				<option value='getImageFileLV6'>坡度分級影像地圖(6級)(getImageFileLV6)</option>
				<!--option value='getImageLV6'>套疊坡度分級WMS(6級)(getImageLV6)</option-->
				<!--option value='getImageFile30Percent'>坡度大於30%分級影像地圖(getImageFile30Percent)</option-->
				<!--option value='getSlopeRange'>坡度統計值(getSlopeRange)</option-->
				<option value='getImageDPLV6' selected='selected'>災害潛勢坡度分級圖檔(getImageDPLV6)</option>
		   </select> 
		   <br><br>
		   點位<br><br>
		   <input type='text' id='slope_locate' placeholder='請從地圖上點位' class='disable-control' disabled><br><br>
		   數值資料<br><br>
		   <select id='slope_data' class='select-control'> 
				<option value='TW_DLA_20010814_20061226_20M_3826'>20M TW DLA DTM (92-94年)</option>
				<option value='TW_DLA_20110101_20161101_20M_3826' selected='selected'>20M TW DLA DTM (99-104年)</option>
				<!-- 20190513 fixed -->
				<!--<option value='TW_DLA_20010814_20061226_5M_3826'>5M TW DLA DTM (92-94年)</option>-->
				<!-- 20190513 fixed -->
		   </select> 
		   <br><br>
		   <button class='ui button' id="slope_execute" onclick = 'slope_execute()'>執行</button>
			<!-- 20190513 fixed -->
		   <div id='tree_slope' style='width:100%;height:200;'></div> 
		   <div id='slope_result'></div>
			<!-- 20190513 fixed -->
			`);

		btn_enable();
		clear_map();
		createMeasureTooltip(); 

		null_slope_Tree = new dhtmlXTreeObject("tree_slope", "100%", "100%", 0);
		drawer_win_call();
		draw_slope_Tree.moveItem("0","item_child","0",null_slope_Tree);
	}
	 if (Login_ID != "")
	  $("#slope_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
      $("#slope_data").append(new Option("1M TW DLA DTM (99-104年)", 'TW_DLA_20110101_20161101_1M_3826_DEM'));
}

function slope_tool_show(){ //坡度工具圖示設定
	$('#slope_locate').val('');
	//$("#slope_data option[value = 'TW_DLA_20110101_20161101_1M_3826_DEM']").remove();
	//$("#slope_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
	
	switch($('#slope_select').val())
	{
		/**  20190515 fixed **/
		/*case '坡度分析':
			$('#slope_tool').html('');
			btn_enable();
			break;*/
		/**  20190515 fixed **/
		case 'getSlopeValue':
			$('#slope_tool').html(`
				<div class='ui secondary menu'>
					<a class='item' id = 'slope_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'slope_paint02'><img src='img/paint02.png'></a>
					<br>
				</div> 
			`);
            $("#slope_data option[value = 'TW_DLA_20110101_20161101_1M_3826']").remove();
			btn_enable();
			break;
		case 'getSlopeClassify':
			$('#slope_tool').html(`
				<div class='ui secondary menu'>
					<a class='item' id = 'slope_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'slope_paint04'><img src='img/paint04.png'></a>
					<a class='item' id = 'slope_paint03'><img src='img/paint03.png'></a>
					<a class='item' id = 'slope_paint06'><img src='img/paint06.png'></a>
					<br>
				</div> 
			`);
            $("#slope_data option[value = 'TW_DLA_20110101_20161101_1M_3826']").remove();
			btn_enable();
			break;
		case 'getImageFileLV7':
			$('#slope_tool').html(`
				<div class='ui secondary menu'>
					<a class='item' id = 'slope_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'slope_paint06'><img src='img/paint06.png'></a>
					<br>
				</div> 
			`);
            $("#slope_data option[value = 'TW_DLA_20110101_20161101_1M_3826']").remove();
			btn_enable();
			break;
		case 'getImageLV7':
			$('#slope_tool').html(`
				<div class='ui secondary menu'>
					<a class='item' id = 'slope_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'slope_paint06'><img src='img/paint06.png'></a>
					<br>
				</div> 
			`);
            $("#slope_data option[value = 'TW_DLA_20110101_20161101_1M_3826']").remove();
			btn_enable();
			break;
		case 'getImageFileLV6':
			$('#slope_tool').html(`
				<div class='ui secondary menu'>
					<a class='item' id = 'slope_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'slope_paint06'><img src='img/paint06.png'></a>
					<br>
				</div> 
			`);
            $("#slope_data option[value = 'TW_DLA_20110101_20161101_1M_3826']").remove();
			btn_enable();
			break;
		case 'getImageLV6':
			$('#slope_tool').html(`
				<div class='ui secondary menu'>
					<a class='item' id = 'slope_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'slope_paint06'><img src='img/paint06.png'></a>
					<br>
				</div> 
			`);
            $("#slope_data option[value = 'TW_DLA_20110101_20161101_1M_3826']").remove();
			btn_enable();
			break;
		case 'getImageFile30Percent':
			$('#slope_tool').html(`
				<div class='ui secondary menu'>
					<a class='item' id = 'slope_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'slope_paint06'><img src='img/paint06.png'></a>
					<br>
				</div> 
			`);
            $("#slope_data option[value = 'TW_DLA_20110101_20161101_1M_3826']").remove();
			btn_enable();
			break;
		case 'getSlopeRange':
			$('#slope_tool').html(`
				<div class='ui secondary menu'>
					<a class='item' id = 'slope_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'slope_paint04'><img src='img/paint04.png'></a>
					<a class='item' id = 'slope_paint03'><img src='img/paint03.png'></a>
					<a class='item' id = 'slope_paint06'><img src='img/paint06.png'></a>
					<br>
				</div> 
			`);
            $("#slope_data option[value = 'TW_DLA_20110101_20161101_1M_3826']").remove();
			btn_enable();
			break;
		case 'getImageDPLV6':
			$('#slope_tool').html(`
				<div class='ui secondary menu'>
					<a class='item' id = 'slope_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'slope_paint06'><img src='img/paint06.png'></a>
					<br>
				</div> 
			`);
           $("#slope_data option[value = 'TW_DLA_20110101_20161101_1M_3826']").remove();
			btn_enable();
			break;
	}
	// if (Login_ID != "")
	  //$("#slope_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
      //$("#slope_data").append(new Option("1M TW DLA DTM (99-104年)", 'TW_DLA_20110101_20161101_1M_3826_DEM'));
}

function slope_add_point(){ //抓取point經緯度，point的設定
    /*** 20190515 fixed ***/
	/*if(slope_draw_type != "point")
	{*/
    /*** 20190515 fixed ***/
		$('#slope_locate').val('');
		
		clear_map();
		
		slope_draw = new ol.interaction.Draw({
	        type: 'Point',
	        source: slope_layer.getSource(),
	        maxPoints: 1
	    });
		slope_draw.on('drawend', function(event){
	    	slope_layer.getSource().clear();
	        var s = new ol.style.Style({
	            image: new ol.style.Circle({
	                radius: 5,
	                fill: new ol.style.Fill({color: '#ff8000'}),
	                stroke: new ol.style.Stroke({color: '#0072e3', width: 1})
	            })
	        });
	        event.feature.setStyle(s);
	        // console.log(event.feature.getGeometry().getCoordinates());
	        var coor = ol.proj.transform(event.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
	        // console.log(coor);
	        $('#slope_locate').val('POINT('+coor[0]+' '+coor[1]+')');
			maps[map_ind].removeInteraction(slope_draw);
	    });
		maps[map_ind].addInteraction(slope_draw);
		slope_draw_type = "point";
		
    /*** 20190515 fixed ***/
	//}
    /*** 20190515 fixed ***/
}


function slope_add_linestring(){ //抓取line經緯度，line的設定
	
    /*** 20190515 fixed ***/
	//if(slope_draw_type != "linestring")
	//{	
    /*** 20190515 fixed ***/
		$('#slope_locate').val('');
		clear_map();
		slope_draw = new ol.interaction.Draw({
	        type: 'LineString',
	        source: slope_layer.getSource(),
	    });

		maps[map_ind].addInteraction(slope_draw);	
		slope_draw.on('drawstart',
	        function (evt) {
	            slope_layer.getSource().clear();

				btn_disable();
				
	            createMeasureTooltip();
	            // set sketch
	            sketch = evt.feature;

	            var tooltipCoord = evt.coordinate;

	            listener = sketch.getGeometry().on('change', function (evt) {
	                var geom = evt.target;
	                var output;
	                output = formatLength(geom);
	                tooltipCoord = geom.getLastCoordinate();
					
	                measureTooltipElement.innerHTML = output;
	                measureTooltip.setPosition(tooltipCoord);
	            });
	        }, this);
		
		slope_draw.on('drawend',
	        function (e) {
				var input = "";
				for(var i = 0 ; i < e.target.sketchCoords_.length ; i++)
				{
					var coor = ol.proj.transform(e.target.sketchCoords_[i], 'EPSG:3857', 'EPSG:4326');
					if(i == 0) input += "LINESTRING(";
					input += coor[0] + " " + coor[1];
					if(i != (e.target.sketchCoords_.length - 1)) input += ",";
					else input += ")";
				}
				$('#slope_locate').val(input);
				btn_enable();
				maps[map_ind].removeInteraction(slope_draw);
	        }, this);
		slope_draw_type = "linestring";
		
    /*** 20190515 fixed ***/
	//}
    /*** 20190515 fixed ***/
}


function slope_add_polygon(){ //抓取polygon經緯度，polygon的設定
    /*** 20190515 fixed ***/
	//if(slope_draw_type != "polygon")
	//{
    /*** 20190515 fixed ***/
		$('#slope_locate').val('');
		clear_map();
		slope_draw = new ol.interaction.Draw({
	        type: 'Polygon',
	        source: slope_layer.getSource(),
	    });

		maps[map_ind].addInteraction(slope_draw);	
		slope_draw.on('drawstart',
	        function (evt) {
	            slope_layer.getSource().clear();
				btn_disable();
	            createMeasureTooltip();
	            // set sketch
	            sketch = evt.feature;

	            var tooltipCoord = evt.coordinate;

	            listener = sketch.getGeometry().on('change', function (evt) {
	                var geom = evt.target;
	                var output;
	                output = formatArea(geom);
                  	tooltipCoord = geom.getInteriorPoint().getCoordinates();
					
					var sourceProj = maps[map_ind].getView().getProjection();
					var geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
					var coordinates = geom_t.getLinearRing(0).getCoordinates();
					slope_area = Math.abs(wgs84Sphere.geodesicArea(coordinates)) / 1000000;
					
	                measureTooltipElement.innerHTML = output;
	                measureTooltip.setPosition(tooltipCoord);
	            });
				
				
	        }, this);
		
		slope_draw.on('drawend',
	        function (e) {
				//console.log(e.feature.getGeometry().getCoordinates()[0][0]);
				// $('#slope_locate').val(e.target.D);
				var input = "";
				var tmpcoor;
				for(var i = 0 ; i < e.feature.getGeometry().getCoordinates()[0].length ; i++)
				{
					if(i==0) tmpcoor = ol.proj.transform(e.feature.getGeometry().getCoordinates()[0][i], 'EPSG:3857', 'EPSG:4326');
					var coor = ol.proj.transform(e.feature.getGeometry().getCoordinates()[0][i], 'EPSG:3857', 'EPSG:4326');
					if(i == 0) input += "POLYGON((";
					input += coor[0] + " " + coor[1];
					if(i != (e.feature.getGeometry().getCoordinates()[0].length - 1)) input += ",";
					else input += ","+tmpcoor[0] + " " + tmpcoor[1]+"))";
				}
				$('#slope_locate').val(input);
				btn_enable();
				maps[map_ind].removeInteraction(slope_draw);
	        }, this);
		slope_draw_type = "polygon";
    /*** 20190515 fixed ***/
	//}
    /*** 20190515 fixed ***/
}


function slope_add_rectangle(){ //抓取rectangle經緯度，rectangle的設定
	
    /*** 20190515 fixed ***/
	//if(slope_draw_type != "rectangle")
	//{
    /*** 20190515 fixed ***/
		$('#slope_locate').val('');
		clear_map();
		geometryFunction = function(coordinates, geometry) {
	        if (!geometry) {
				geometry = new ol.geom.Polygon(null);
	        }
	        var start = coordinates[0];
	        var end = coordinates[1];
			
	        geometry.setCoordinates([
				[start, [start[0], end[1]], end, [end[0], start[1]], start]
	        ]);
	        return geometry;
		};
		slope_draw = new ol.interaction.Draw({
			type: 'LineString',
		    source: slope_layer.getSource(),
			geometryFunction: geometryFunction,
			maxPoints: 2
		});
		maps[map_ind].addInteraction(slope_draw);


		slope_draw.on('drawstart',
	        function (evt) {
	            slope_layer.getSource().clear();
				btn_disable();
	            createMeasureTooltip();
	            // set sketch
	            sketch = evt.feature;

	            var tooltipCoord = evt.coordinate;

	            listener = sketch.getGeometry().on('change', function (evt) {
	                var geom = evt.target;
	                var output;
	                output = formatArea(geom);
                  	tooltipCoord = geom.getInteriorPoint().getCoordinates();
					
					var sourceProj = maps[map_ind].getView().getProjection();
					var geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
					var coordinates = geom_t.getLinearRing(0).getCoordinates();
					slope_area = Math.abs(wgs84Sphere.geodesicArea(coordinates)) / 1000000;
					
	                measureTooltipElement.innerHTML = output;
	                measureTooltip.setPosition(tooltipCoord);
	            });
	        }, this);
		slope_draw.on('drawend',
	        function (e) {
				// console.log(e.target.sketchCoords_);
				// $('#slope_locate').val(e.target.sketchCoords_);
				var input = "";
				box_array=(String(e.feature.getGeometry().getExtent())).split(",");  // return [minx, miny, maxx, maxy]
				var coor0=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');												
				var coor1=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');											
				//var coor0 = ol.proj.transform(e.target.sketchCoords_[0], 'EPSG:3857', 'EPSG:4326');
				//var coor1= ol.proj.transform(e.target.sketchCoords_[1], 'EPSG:3857', 'EPSG:4326');
				left_slope = Math.min(coor0[0],coor1[0]);
				right_slope = Math.max(coor0[0],coor1[0]);
				down_slope = Math.min(coor0[1],coor1[1]);
				up_slope = Math.max(coor0[1],coor1[1]);
				input += "POLYGON(("+coor0[0]+" "+coor0[1]+","+coor1[0]+" "+coor0[1]+","+coor1[0]+" "+coor1[1]+","+coor0[0]+" "+coor1[1]+","+coor0[0]+" "+coor0[1]+"))";
	        	$('#slope_locate').val(input);
				btn_enable();
				maps[map_ind].removeInteraction(slope_draw);
	        }, this);

		slope_draw_type = "rectangle";
		
    /*** 20190515 fixed ***/
	//}
    /*** 20190515 fixed ***/
}

function slope_remove_interaction(){ //增加tooltip，並加在圖層上層
	createMeasureTooltip();
	$('#slope_locate').val('');
	slope_layer.getSource().clear();
	maps[map_ind].removeInteraction(slope_draw);
	slope_draw_type = "none";
}

function slope_execute(){ //坡度分析API抓取資料
	var select = $('#slope_select').val();
	var wkt = $('#slope_locate').val();
	var data = $('#slope_data').val();
	
    /*** 20190515 fixed ***/
	/*
	if(select == "坡度分析")
	{
		alert("請選擇一項分析");
		return;
	}
	*/
    /*** 20190515 fixed ***/
	
	if(wkt == "")
	{
		alert("請從地圖上點位");
		return;
	}
	btn_disable();

	$.ajax({
        url: "php/get_slope_detail.php",
        type: 'post',
        dataType:'text',
        data: {
            select: select,
            wkt: wkt,
            data: data,
            left: left_slope,
            up: up_slope,
            right: right_slope,
            down: down_slope,
			/*** add 20190515 ***/
			l: (slope_num + 1)
			/*** add 20190515 ***/
        },
        success: function(data) { //坡度分析型態的資料顯示和設定
            if(data == "WKT未包含任何縣市,或此縣市資料，系統尚未支援" || data == "API KEY 錯誤" || data == "您沒有權限使用此資料類型")
            {
            	alert(data);
            }
            else{
            	switch($('#slope_select').val())
				{
					case 'getSlopeValue': //getSlopeValue型態的資料顯示和設定
						var obj;
						try {
							obj = JSON.parse(data);
							$('#slope_result').html('');
					    	$('#slope_result').width("auto");
					    	$('#slope_result').height("auto");
							$('#slope_result').html(`
								<table class="ui fixed single line celled table">
								  <tbody>
								    <tr>
								      <td>坡度</td>
								      <td>`+obj.slope_degree+`</td>
								    </tr>
								    <tr>
								      <td>坡度上升百分比</td>
								      <td>`+obj.slope_percent+`</td>
								    </tr>
								    <tr>
								      <td>坡度分級</td>
								      <td>`+obj.classid+`</td>
								    </tr>
								    <tr>
								      <td>說明文字</td>
								      <td>`+obj.desc+`</td>
								    </tr>
								  </tbody>
								</table>
            				`);
						} catch(e) {
					        alert('發生不明錯誤'); // error in the above string (in this case, yes)!
					    }
						break;
					case 'getSlopeClassify': //未知功能
						if ( slope_draw_type === "linestring" || (( slope_draw_type === "polygon" || slope_draw_type === "rectangle" ) && slope_area >= SlopeClassify_area_dlim && slope_area <= SlopeClassify_area_ulim ) ) {
						
							var obj;
							try {
								obj = JSON.parse(data);
								// console.log(obj);
								$('#slope_result').html('');
								$('#slope_result').width("100%");
								$('#slope_result').height("300px");
								var valueAxex_title = "單位("+obj.areaUnit+")";
                                
								/*** 20190515 fixed ***/
								am4core.ready(function() {

									// Themes begin
									am4core.useTheme(am4themes_animated);
									// Themes end

									var chart = am4core.create("slope_result", am4charts.RadarChart);
									chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

									let data = []
									
									data.push({slope:"一級坡", 'area(公頃)':obj.classifyArray[0].cellArea})
									data.push({slope:"二級坡", 'area(公頃)':obj.classifyArray[1].cellArea})
									data.push({slope:"三級坡", 'area(公頃)':obj.classifyArray[2].cellArea})
									data.push({slope:"四級坡", 'area(公頃)':obj.classifyArray[3].cellArea})
									data.push({slope:"五級坡", 'area(公頃)':obj.classifyArray[4].cellArea})
									data.push({slope:"六級坡", 'area(公頃)':obj.classifyArray[5].cellArea})
									data.push({slope:"七級坡", 'area(公頃)':obj.classifyArray[6].cellArea})
									
									console.log(data)

									chart.data = data;
									//chart.radius = am4core.percent(100);

									var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
									categoryAxis.dataFields.category = "slope";
									categoryAxis.renderer.labels.template.location = 0.1;
									categoryAxis.renderer.tooltipLocation = 0.1;
                                    
                                    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
									valueAxis.tooltip.disabled = true;
									valueAxis.renderer.labels.template.horizontalCenter = "center";
                                    valueAxis.min = 0;

									var series1 = chart.series.push(new am4charts.RadarColumnSeries());
                                    series1.name = "面積";
                                    series1.columns.template.tooltipText = "{name}: {valueY.value}公頃";
									series1.columns.template.width = am4core.percent(60);
									series1.dataFields.categoryX = "slope";
									series1.dataFields.valueY = "area(公頃)";
									series1.stacked = true;

									chart.seriesContainer.zIndex = -1;

									chart.scrollbarX = new am4core.Scrollbar();
									chart.scrollbarX.exportable = false;
									chart.scrollbarY = new am4core.Scrollbar();
									chart.scrollbarY.exportable = false;

									chart.cursor = new am4charts.RadarCursor();
									chart.cursor.xAxis = categoryAxis;
									chart.cursor.fullWidthXLine = true;
									chart.cursor.lineX.strokeOpacity = 0;
									chart.cursor.lineX.fillOpacity = 0.1;
									chart.cursor.lineX.fill = am4core.color("#ffffff");
                                    /*
									var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
									categoryAxis.dataFields.category = "slope";
									categoryAxis.renderer.labels.template.location = 0.5;
									categoryAxis.renderer.tooltipLocation = 0.5;
									categoryAxis.renderer.grid.template.disabled = true;
									categoryAxis.renderer.labels.template.disabled = true;
                                    
									var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
									valueAxis.tooltip.disabled = true;
									valueAxis.renderer.labels.template.horizontalCenter = "left";
									valueAxis.renderer.grid.template.disabled = true;

									var series1 = chart.series.push(new am4charts.RadarColumnSeries());
									series1.name = "Series 1";
									series1.dataFields.categoryX = "slope";
									series1.dataFields.valueY = "area(m2)";
									series1.stroke = am4core.color("#ffffff");
									series1.columns.template.strokeOpacity = 0.2;
									series1.stacked = true;
									series1.sequencedInterpolation = true;
									series1.columns.template.width = am4core.percent(100);
									series1.columns.template.tooltipText = "{valueY}";

									chart.seriesContainer.zIndex = -1;

									chart.scrollbarX = new am4core.Scrollbar();
									chart.scrollbarX.exportable = false;
									chart.scrollbarY = new am4core.Scrollbar();
									chart.scrollbarY.exportable = false;

									chart.cursor = new am4charts.RadarCursor();
									chart.cursor.xAxis = categoryAxis;
									chart.cursor.fullWidthXLine = true;
									chart.cursor.lineX.strokeOpacity = 0;
									chart.cursor.lineX.fillOpacity = 0.1;
									chart.cursor.lineX.fill = am4core.color("#000000");
                                    */
									// Enable export
									
									chart.exporting.menu = new am4core.ExportMenu();
								}); // end am4core.ready()
								
								/*
								var chart = AmCharts.makeChart( "slope_result", {
									"type": "serial",
									"theme": "light",
									"dataProvider": [ {
									  "slope": "一級坡",
									  "area(m2)": obj.classifyArray[0].cellArea
									}, {
									  "slope": "二級坡",
									  "area(m2)": obj.classifyArray[1].cellArea
									}, {
									  "slope": "三級坡",
									  "area(m2)": obj.classifyArray[2].cellArea
									}, {
									  "slope": "四級坡",
									  "area(m2)": obj.classifyArray[3].cellArea
									}, {
									  "slope": "五級坡",
									  "area(m2)": obj.classifyArray[4].cellArea
									}, {
									  "slope": "六級坡",
									  "area(m2)": obj.classifyArray[5].cellArea
									}, {
									  "slope": "七級坡",
									  "area(m2)": obj.classifyArray[6].cellArea
									} ],
									"valueAxes": [{
									  "axisAlpha": 0,
									  "position": "left",
									  "title": valueAxex_title
									}],
									"gridAboveGraphs": true,
									"startDuration": 1,
									"graphs": [ {
									  "balloonText": "[[category]]: <b>[[value]]</b>",
									  "fillAlphas": 0.8,
									  "lineAlpha": 0.2,
									  "type": "column",
									  "valueField": "area(m2)"
									} ],
									"chartCursor": {
									  "categoryBalloonEnabled": false,
									  "cursorAlpha": 0,
									  "zoomable": false
									},
									"categoryField": "slope",
									"categoryAxis": {
									  "gridPosition": "start",
									  "gridAlpha": 0,
									  "tickPosition": "start",
									  "tickLength": 20
									},
									"export": {
									  "enabled": true
									}

								});
								*/
								/*** 20190515 fixed ***/
							} catch(e) {
								alert('發生不明錯誤'); // error in the above string (in this case, yes)!
							}
						} else if ( ( slope_draw_type === "polygon" || slope_draw_type === "rectangle" ) && slope_area > SlopeClassify_area_ulim ) {
							
							alert("請選擇面積小於 " + SlopeClassify_area_ulim + " 平方公里範圍進行分析!");
						} else if ( ( slope_draw_type === "polygon" || slope_draw_type === "rectangle" ) && slope_area < SlopeClassify_area_dlim ) {
							
							alert("請選擇面積大於 " + SlopeClassify_area_dlim + " 平方公里範圍進行分析!");
						} else {
							
							alert('發生不明錯誤');
						}
						
						
						break;
							
					case 'getImageFileLV7':  //getImageFileLV7型態的資料顯示和設定
						if ( slope_area >= ImageFileLV7_area_dlim && slope_area <= ImageFileLV7_area_ulim  ) {
							
							try {
								var json;
								json = JSON.parse(data);
								loading_id = "l"+slope_num.toString();
								draw_slope_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								draw_slope_Tree.enableCheckBoxes(false, false);
								// get .kmz file url

								slope_kmz_link_arr.push(json.kmz[0].url);

								// debug
								console.log(json.imgFilePath);
								console.log("Width : " + json.imageWidth);
								console.log("Height : " + json.imageHeight);
								//alert("img url : " + json.data.link);
								
								slope_num = slope_num + 1;
								
								new_node_id = `{
									"PosInfo":"${((up_slope + down_slope) / 2.0).toString() + ";" + 
												 ((left_slope + right_slope) / 2.0).toString() + ";563426;8;" + 
												 json.imageWidth.toString() + ";" + 
												 json.imageHeight.toString() + ";" + 
												 left_slope.toString() + ";" + 
												 down_slope.toString() + ";" + 
												 right_slope.toString() + ";" + 
												 up_slope.toString()}",
									"Type":"ImageOverlay",
									"Url":"${json.imgFilePath}",
									"ID":"slope${slope_num.toString()}",
									"FileName":"坡度分析${slope_num.toString()}-坡度分級影像地圖(7級)"
								}`.replace(/\n|\t/g, "").trim();
																	
								// delete loading signal

								draw_slope_Tree.deleteItem(loading_id, false);
								draw_slope_Tree.enableCheckBoxes(true, true);
									
								// layer item
								
								draw_slope_Tree.insertNewChild("0", new_node_id, "坡度分析" + slope_num.toString() + "-坡度分級影像地圖(7級)", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								/*** add 20190515 ***/
								slope_legend_link_arr.push(json.legendFilePath);
								draw_slope_Tree.insertNewChild(new_node_id, "slope_legend" + slope_num.toString(), "開啟圖例", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								var legend_win = dhxWins.createWindow("slope_legwin" + slope_num.toString(), 600, 600, json.LegendImgWidth / 3, (json.LegendImgHeight / 3 + 120));
								legend_win.setText("");
								
								legend_win.attachEvent("onClose", function(win){
									var n = parseInt(this.getId().split("slope_legwin")[1])
									draw_slope_Tree.setCheck("slope_legend" + n.toString(), false);
									//this.close();
									this.hide();
								});
								
								dhxWins.window("slope_legwin" + slope_num.toString()).button("minmax").hide();
								dhxWins.window("slope_legwin" + slope_num.toString()).button("park").hide();
								
								legend_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
											  "<div style='align: center; height:100%;width:100%;'>" + 
											  "<p style='text-align: center; font-size:8px;width:100%;' >坡度分析" + slope_num.toString() + "-坡度分級影像地圖(7級)</p>" + 
											  "<br><img src='" + json.legendFilePath + "' style='display:block; margin-left: auto; margin-right: auto; max-height:100%; align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
								legend_win.attachHTMLString(legend_html)
								
								legend_win.hide()
								draw_slope_Tree.showItemCheckbox("slope_legwin" + slope_num.toString(), false);
								slope_legwin_link_arr.push(legend_win);
								/*** add 20190515 ***/	
								
								// download item
								
								draw_slope_Tree.insertNewItem(new_node_id, "d" + slope_num.toString(), "下載 .kmz 檔", 
															function(){ 
																var idn = this.id.split("d");
																document.getElementById("download_iframe").src = slope_kmz_link_arr[idn[1] - 1];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
															
										
								/*** add 20190515 ***/	
								//draw_slope_Tree.showItemCheckbox("d" + slope_num.toString(), false);
								draw_slope_Tree.disableCheckbox("d" + slope_num.toString(), true);
								/*** add 20190515 ***/	
								
								// Download button Default : closed
								
								draw_slope_Tree.closeItem(new_node_id);
									
								// enable button
								
							} catch(e) {
								alert('發生不明錯誤'); // error in the above string (in this case, yes)!
							}
						} else if ( slope_area > ImageFileLV7_area_ulim ) {
							
							alert("請選擇面積小於 " + ImageFileLV7_area_ulim + " 平方公里範圍進行分析!");
						} else if ( slope_area < ImageFileLV7_area_dlim ) {
							
							alert("請選擇面積大於 " + ImageFileLV7_area_dlim + " 平方公里範圍進行分析!");
						} else {
							
							alert('發生不明錯誤');
						}
						
						break;
					case 'getImageLV7':
						if ( slope_area >= ImageLV7_area_dlim && slope_area <= ImageLV7_area_ulim ) {
							
							try {
								var json;
								json = JSON.parse(data);
								loading_id = "l"+slope_num.toString();
								draw_slope_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								draw_slope_Tree.enableCheckBoxes(false, false);
								// get .kmz file url

								slope_kmz_link_arr.push(json.kmz);

								// debug
								// console.log(json.imgFilePath);
								// console.log("Width : " + json.imageWidth);
								// console.log("Height : " + json.imageHeight);
								//alert("img url : " + json.data.link);
								
								slope_num = slope_num + 1;
								
								new_node_id = `{
									"PosInfo":"${((up_slope + down_slope) / 2.0).toString() + ";" + 
												 ((left_slope + right_slope) / 2.0).toString() + ";563426;8;" + 
												 json.imageWidth.toString() + ";" + 
												 json.imageHeight.toString() + ";" + 
												 left_slope.toString() + ";" + 
												 down_slope.toString() + ";" + 
												 right_slope.toString() + ";" + 
												 up_slope.toString()}",
									"Type":"ImageOverlay",
									"Url":"${json.imgFilePath}",
									"ID":"slope${slope_num.toString()}",
									"FileName":"坡度分析${slope_num.toString()}-套疊坡度分級WMS(7級)"
								}`.replace(/\n|\t/g, "").trim();
									
								// delete loading signal

								draw_slope_Tree.deleteItem(loading_id, false);
								draw_slope_Tree.enableCheckBoxes(true, true);
									
								// layer item
								
								draw_slope_Tree.insertNewChild("0", new_node_id, "坡度分析" + slope_num.toString() + "-套疊坡度分級WMS(7級)", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								// download item
								
								draw_slope_Tree.insertNewItem(new_node_id, "d" + slope_num.toString(), "下載 .kmz 檔", 
															function(){ 
																var idn = this.id.split("d");
																document.getElementById("download_iframe").src = slope_kmz_link_arr[idn[1] - 1];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
															
								draw_slope_Tree.showItemCheckbox("d" + slope_num.toString(), false);
								
								
								// Download button Default : closed
								
								draw_slope_Tree.closeItem(new_node_id);
									
								// enable button
								
							} catch(e) {
								alert('發生不明錯誤'); // error in the above string (in this case, yes)!
							}
						} else if ( slope_area > ImageLV7_area_ulim ) {
							
							alert("請選擇面積小於 " + ImageLV7_area_ulim + " 平方公里範圍進行分析!");
						} else if ( slope_area < ImageLV7_area_dlim ) {
							
							alert("請選擇面積大於 " + ImageLV7_area_dlim + " 平方公里範圍進行分析!");
						} else {
							
							alert('發生不明錯誤');
						}
						break;
					case 'getImageFileLV6': 
					
						if ( slope_area >= ImageFileLV6_area_dlim && slope_area <= ImageFileLV6_area_ulim ) {
						
							try {
								var json;
								json = JSON.parse(data);
								loading_id = "l"+slope_num.toString();
								draw_slope_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								draw_slope_Tree.enableCheckBoxes(false, false);
								// get .kmz file url

								slope_kmz_link_arr.push(json.kmz[0].url);

								// debug
								// console.log(json.imgFilePath);
								// console.log("Width : " + json.imageWidth);
								// console.log("Height : " + json.imageHeight);
								//alert("img url : " + json.data.link);
								
								slope_num = slope_num + 1;
								
								new_node_id = `{
									"PosInfo":"${((up_slope + down_slope) / 2.0).toString() + ";" + 
												 ((left_slope + right_slope) / 2.0).toString() + ";563426;8;" + 
												 json.imageWidth.toString() + ";" + 
												 json.imageHeight.toString() + ";" + 
												 left_slope.toString() + ";" + 
												 down_slope.toString() + ";" + 
												 right_slope.toString() + ";" + 
												 up_slope.toString()}",
									"Type":"ImageOverlay",
									"Url":"${json.imgFilePath}",
									"ID":"slope${slope_num.toString()}",
									"FileName":"坡度分析${slope_num.toString()}-坡度分級影像地圖(6級)"
								}`.replace(/\n|\t/g, "").trim();
									
								// delete loading signal

								draw_slope_Tree.deleteItem(loading_id, false);
								draw_slope_Tree.enableCheckBoxes(true, true);
									
								// layer item
								
								draw_slope_Tree.insertNewChild("0", new_node_id, "坡度分析" + slope_num.toString() + "-坡度分級影像地圖(6級)", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								/*** add 20190515 ***/
								slope_legend_link_arr.push(json.legendFilePath);
								draw_slope_Tree.insertNewChild(new_node_id, "slope_legend" + slope_num.toString(), "開啟圖例", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								var legend_win = dhxWins.createWindow("slope_legwin" + slope_num.toString(), 600, 600, json.LegendImgWidth / 3, (json.LegendImgHeight / 3 + 120));
								legend_win.setText("");
								
								legend_win.attachEvent("onClose", function(win){
									var n = parseInt(this.getId().split("slope_legwin")[1])
									draw_slope_Tree.setCheck("slope_legend" + n.toString(), false);
									//this.close();
									this.hide();
								});
								
								dhxWins.window("slope_legwin" + slope_num.toString()).button("minmax").hide();
								dhxWins.window("slope_legwin" + slope_num.toString()).button("park").hide();
								
								legend_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
											  "<div style='align: center; height:100%;width:100%;'>" + 
											  "<p style='text-align: center; font-size:8px;width:100%;' >坡度分析" + slope_num.toString() + "-坡度分級影像地圖(6級)</p>" + 
											  "<br><img src='" + json.legendFilePath + "' style='display:block; margin-left: auto; margin-right: auto; max-height:100%; align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
								legend_win.attachHTMLString(legend_html)
								
								legend_win.hide()
								draw_slope_Tree.showItemCheckbox("slope_legwin" + slope_num.toString(), false);
								slope_legwin_link_arr.push(legend_win);
								/*** add 20190515 ***/	
								
								// download item
								
								draw_slope_Tree.insertNewItem(new_node_id, "d" + slope_num.toString(), "下載 .kmz 檔", 
															function(){ 
																var idn = this.id.split("d");
																document.getElementById("download_iframe").src = slope_kmz_link_arr[idn[1] - 1];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
															
															
								/*** add 20190515 ***/	
								//draw_slope_Tree.showItemCheckbox("d" + slope_num.toString(), false);
								draw_slope_Tree.disableCheckbox("d" + slope_num.toString(), true);
								/*** add 20190515 ***/	
								
								
								// Download button Default : closed
								
								draw_slope_Tree.closeItem(new_node_id);
									
								// enable button
								
							} catch(e) {
								alert('發生不明錯誤'); // error in the above string (in this case, yes)!
							}
						} else if ( slope_area > ImageFileLV6_area_ulim ) {
							
							alert("請選擇面積小於 " + ImageFileLV6_area_ulim + " 平方公里範圍進行分析!");
						} else if ( slope_area < ImageFileLV6_area_dlim ) {
							
							alert("請選擇面積大於 " + ImageFileLV6_area_dlim + " 平方公里範圍進行分析!");
						} else {
							
							alert('發生不明錯誤');
						}
						break;
					case 'getImageLV6':
					
						if ( slope_area >= ImageLV6_area_dlim && slope_area <= ImageLV6_area_ulim ) {
						
							try {
								var json;
								json = JSON.parse(data);
								loading_id = "l"+slope_num.toString();
								draw_slope_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								draw_slope_Tree.enableCheckBoxes(false, false);
								// get .kmz file url

								slope_kmz_link_arr.push(json.kmz);

								// debug
								// console.log(json.imgFilePath);
								// console.log("Width : " + json.imageWidth);
								// console.log("Height : " + json.imageHeight);
								//alert("img url : " + json.data.link);
								
								slope_num = slope_num + 1;
								
								new_node_id = `{
									"PosInfo":"${((up_slope + down_slope) / 2.0).toString() + ";" + 
												 ((left_slope + right_slope) / 2.0).toString() + ";563426;8;" + 
												 json.imageWidth.toString() + ";" + 
												 json.imageHeight.toString() + ";" + 
												 left_slope.toString() + ";" + 
												 down_slope.toString() + ";" + 
												 right_slope.toString() + ";" + 
												 up_slope.toString()}",
									"Type":"ImageOverlay",
									"Url":"${json.imgFilePath}",
									"ID":"slope${slope_num.toString()}",
									"FileName":"坡度分析${slope_num.toString()}-套疊坡度分級WMS(7級)"
								}`.replace(/\n|\t/g, "").trim();
									
								// delete loading signal

								draw_slope_Tree.deleteItem(loading_id, false);
								draw_slope_Tree.enableCheckBoxes(true, true);
									
								// layer item
								
								draw_slope_Tree.insertNewChild("0", new_node_id, "坡度分析" + slope_num.toString() + "-套疊坡度分級WMS(7級)", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								// download item
								
								draw_slope_Tree.insertNewItem(new_node_id, "d" + slope_num.toString(), "下載 .kmz 檔", 
															function(){ 
																var idn = this.id.split("d");
																document.getElementById("download_iframe").src = slope_kmz_link_arr[idn[1] - 1];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
															
										
								/*** add 20190515 ***/	
								//draw_slope_Tree.showItemCheckbox("d" + slope_num.toString(), false);
								draw_slope_Tree.disableCheckbox("d" + slope_num.toString(), true);
								/*** add 20190515 ***/	
								
								// Download button Default : closed
								
								draw_slope_Tree.closeItem(new_node_id);
									
								// enable button
								
							} catch(e) {
								alert('發生不明錯誤'); // error in the above string (in this case, yes)!
							}
						} else if ( slope_area > ImageLV6_area_ulim ) {
							
							alert("請選擇面積小於 " + ImageLV6_area_ulim + " 平方公里範圍進行分析!");
						} else if ( slope_area < ImageLV6_area_dlim ) {
							
							alert("請選擇面積大於 " + ImageLV6_area_dlim + " 平方公里範圍進行分析!");
						} else {
							
							alert('發生不明錯誤');
						}
						break;
					case 'getImageFile30Percent':
					
						if ( slope_area >= ImageFile30Percent_area_dlim && slope_area <= ImageFile30Percent_area_ulim ) {
						
							try {
								var json;
								json = JSON.parse(data);
								loading_id = "l"+slope_num.toString();
								draw_slope_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								draw_slope_Tree.enableCheckBoxes(false, false);
								// get .kmz file url

								slope_kmz_link_arr.push(json.kmz[0].url);

								// debug
								// console.log(json.imgFilePath);
								// console.log("Width : " + json.imageWidth);
								// console.log("Height : " + json.imageHeight);
								//alert("img url : " + json.data.link);
								
								slope_num = slope_num + 1;
								
								new_node_id = `{
									"PosInfo":"${((up_slope + down_slope) / 2.0).toString() + ";" + 
												 ((left_slope + right_slope) / 2.0).toString() + ";563426;8;" + 
												 json.imageWidth.toString() + ";" + 
												 json.imageHeight.toString() + ";" + 
												 left_slope.toString() + ";" + 
												 down_slope.toString() + ";" + 
												 right_slope.toString() + ";" + 
												 up_slope.toString()}",
									"Type":"ImageOverlay",
									"Url":"${json.imgFilePath}",
									"ID":"slope${slope_num.toString()}",
									"FileName":"坡度分析${slope_num.toString()}-坡度大於30%分級影像地圖"
								}`.replace(/\n|\t/g, "").trim();
									
								// delete loading signal

								draw_slope_Tree.deleteItem(loading_id, false);
								draw_slope_Tree.enableCheckBoxes(true, true);
									
								// layer item
								
								draw_slope_Tree.insertNewChild("0", new_node_id, "坡度分析" + slope_num.toString() + "-坡度大於30%分級影像地圖", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								/*** add 20190515 ***/
								slope_legend_link_arr.push(json.legendFilePath);
								draw_slope_Tree.insertNewChild(new_node_id, "slope_legend" + slope_num.toString(), "開啟圖例", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								var legend_win = dhxWins.createWindow("slope_legwin" + slope_num.toString(), 600, 600, json.LegendImgWidth / 3, (json.LegendImgHeight / 3 + 120));
								legend_win.setText("");
								
								legend_win.attachEvent("onClose", function(win){
									var n = parseInt(this.getId().split("slope_legwin")[1])
									draw_slope_Tree.setCheck("slope_legend" + n.toString(), false);
									//this.close();
									this.hide();
								});
								
								dhxWins.window("slope_legwin" + slope_num.toString()).button("minmax").hide();
								dhxWins.window("slope_legwin" + slope_num.toString()).button("park").hide();
								
								legend_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
											  "<div style='align: center; height:100%;width:100%;'>" + 
											  "<p style='text-align: center; font-size:8px;width:100%;' >坡度分析" + slope_num.toString() + "-坡度大於30%分級影像地圖</p>" + 
											  "<br><img src='" + json.legendFilePath + "' style='display:block; margin-left: auto; margin-right: auto; max-height:100%; align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
								legend_win.attachHTMLString(legend_html)
								
								legend_win.hide()
								draw_slope_Tree.showItemCheckbox("slope_legwin" + slope_num.toString(), false);
								slope_legwin_link_arr.push(legend_win);
								/*** add 20190515 ***/	
								
								// download item
								
								draw_slope_Tree.insertNewItem(new_node_id, "d" + slope_num.toString(), "下載 .kmz 檔", 
															function(){ 
																var idn = this.id.split("d");
																document.getElementById("download_iframe").src = slope_kmz_link_arr[idn[1] - 1];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
															
								/*** add 20190515 ***/	
								//draw_slope_Tree.showItemCheckbox("d" + slope_num.toString(), false);
								draw_slope_Tree.disableCheckbox("d" + slope_num.toString(), true);
								/*** add 20190515 ***/	
								
								
								// Download button Default : closed
								
								draw_slope_Tree.closeItem(new_node_id);
									
								// enable button
								
							} catch(e) {
								alert('發生不明錯誤'); // error in the above string (in this case, yes)!
							}
						} else if ( slope_area > ImageFile30Percent_area_ulim ) {
							
							alert("請選擇面積小於 " + ImageFile30Percent_area_ulim + " 平方公里範圍進行分析!");
						} else if ( slope_area < ImageFile30Percent_area_dlim ) {
							
							alert("請選擇面積大於 " + ImageFile30Percent_area_dlim + " 平方公里範圍進行分析!");
						} else {
							
							alert('發生不明錯誤');
						}
						break;
					case 'getSlopeRange':
						if ( slope_draw_type === "linestring" || (( slope_draw_type === "polygon" || slope_draw_type === "rectangle" ) && slope_area >= SlopeRange_area_dlim && slope_area <= SlopeRange_area_ulim ) ) {
							
							var obj;
							try {
								obj = JSON.parse(data);
								$('#slope_result').html('');
								$('#slope_result').width("auto");
								$('#slope_result').height("auto");
								$('#slope_result').html(`
									<table class="ui fixed single line celled table">
									  <tbody>
										<tr>
										  <td>面積</td>
										  <td>`+obj.area+`</td>
										</tr>
										<tr>
										  <td>格點面積</td>
										  <td>`+obj.cellArea+`</td>
										</tr>
										<tr>
										  <td>平均坡度</td>
										  <td>`+obj.avgSlope_degree+`</td>
										</tr>
										<tr>
										  <td>最小坡度值</td>
										  <td>`+obj.minSlope_degree+`</td>
										</tr>
										<tr>
										  <td>最大坡度值</td>
										  <td>`+obj.maxSlope_degree+`</td>
										</tr>
										<tr>
										  <td>平均坡度上升百分比</td>
										  <td>`+obj.avgSlope_percent+`</td>
										</tr>
										<tr>
										  <td>最小坡度上升百分比</td>
										  <td>`+obj.minSlope_percent+`</td>
										</tr>
										<tr>
										  <td>最大坡度上升百分比</td>
										  <td>`+obj.maxSlope_percent+`</td>
										</tr>
										<tr>
										  <td>單位</td>
										  <td>`+obj.areaUnit+`</td>
										</tr>
									  </tbody>
									</table>
								`);
							} catch(e) {
								alert('API進行調整中!'); // error in the above string (in this case, yes)!
							}
						} else if ( ( slope_draw_type === "polygon" || slope_draw_type === "rectangle" ) && slope_area > SlopeRange_area_ulim ) {
							
							alert("請選擇面積小於 " + SlopeRange_area_ulim + " 平方公里範圍進行分析!");
						} else if ( ( slope_draw_type === "polygon" || slope_draw_type === "rectangle" ) && slope_area < SlopeRange_area_dlim ) {
							
							alert("請選擇面積大於 " + SlopeRange_area_dlim + " 平方公里範圍進行分析!");
						} else {
							
							alert('API進行調整中!');
						}
						
						break;
                        case 'getImageDPLV6':
						if ( slope_area >= ImageDPLV6_area_dlim && slope_area <= ImageDPLV6_area_ulim ) {
							
							try {
								var json;
								json = JSON.parse(data);
								loading_id = "l"+slope_num.toString();
								draw_slope_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								draw_slope_Tree.enableCheckBoxes(false, false);
								// get .kmz file url

								slope_kmz_link_arr.push(json.kmz);
								
								slope_num = slope_num + 1;
								
								new_node_id = `{
									"PosInfo":"${((up_slope + down_slope) / 2.0).toString() + ";" + 
												 ((left_slope + right_slope) / 2.0).toString() + ";563426;8;" + 
												 json.imageWidth.toString() + ";" + 
												 json.imageHeight.toString() + ";" + 
												 left_slope.toString() + ";" + 
												 down_slope.toString() + ";" + 
												 right_slope.toString() + ";" + 
												 up_slope.toString()}",
									"Type":"ImageOverlay",
									"Url":"${json.imgFilePath}",
									"ID":"slope${slope_num.toString()}",
									"FileName":"坡度分析${slope_num.toString()}-災害潛勢坡度分級圖檔"
								}`.replace(/\n|\t/g, "").trim();
									
								// delete loading signal

								draw_slope_Tree.deleteItem(loading_id, false);
								draw_slope_Tree.enableCheckBoxes(true, true);
									
								// layer item
								
								draw_slope_Tree.insertNewChild("0", new_node_id, "坡度分析" + slope_num.toString() + "-災害潛勢坡度分級圖檔", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
                                
                                
                                slope_legend_link_arr.push('img/slope_legend_default.jpg');
								draw_slope_Tree.insertNewChild(new_node_id, "slope_legend" + slope_num.toString(), "開啟圖例", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								var legend_win = dhxWins.createWindow("slope_legwin" + slope_num.toString(), 600, 600, json.LegendImgWidth / 3, (json.LegendImgHeight / 3 + 120));
								legend_win.setText("");
								
								legend_win.attachEvent("onClose", function(win){
									var n = parseInt(this.getId().split("slope_legwin")[1])
									draw_slope_Tree.setCheck("slope_legend" + n.toString(), false);
									//this.close();
									this.hide();
								});
								
								dhxWins.window("slope_legwin" + slope_num.toString()).button("minmax").hide();
								dhxWins.window("slope_legwin" + slope_num.toString()).button("park").hide();
								
								legend_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
											  "<div style='align: center; height:100%;width:100%;'>" + 
											  "<p style='text-align: center; font-size:8px;width:100%;' >坡度分析" + slope_num.toString() + "-災害潛勢坡度分級圖檔</p>" + 
											  "<br><img src='img/slope_legend_default.jpg' style='display:block; margin-left: auto; margin-right: auto; max-height:100%; align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
								legend_win.attachHTMLString(legend_html)
								
								legend_win.hide()
								draw_slope_Tree.showItemCheckbox("slope_legwin" + slope_num.toString(), false);
								slope_legwin_link_arr.push(legend_win);
								
                                // download item
								
								draw_slope_Tree.insertNewItem(new_node_id, "d" + slope_num.toString(), "下載 .kmz 檔", 
															function(){ 
																var idn = this.id.split("d");
																document.getElementById("download_iframe").src = slope_kmz_link_arr[idn[1] - 1];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
															
								draw_slope_Tree.showItemCheckbox("d" + slope_num.toString(), false);
								
								
								// Download button Default : closed
								
								draw_slope_Tree.closeItem(new_node_id);
									
								// enable button
								
							} catch(e) {
								alert('API進行調整中!'); // error in the above string (in this case, yes)!
							}
						} else if ( slope_area > ImageDPLV6_area_ulim ) {
							
							alert("請選擇面積小於 " + ImageDPLV6_area_ulim + " 平方公里範圍進行分析!");
						} else if ( slope_area < ImageDPLV6_area_dlim ) {
							
							alert("請選擇面積大於 " + ImageDPLV6_area_dlim + " 平方公里範圍進行分析!");
						} else {
							
							alert('API進行調整中!');
						}
						break;
				}
            }
			
			btn_enable();
        },
        error: function(jqXHR) {
            alert("發生錯誤: " + jqXHR.status);
			btn_enable();
        }
    });
}

function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}


// ========================================aspect========================================

var aspect_layer;
var aspect_draw;
var aspect_draw_type = "none";
var left_aspect;
var up_aspect;
var right_aspect;
var down_aspect;
$(document).ready(function () {
	aspect_layer = new ol.layer.Vector({source: new ol.source.Vector()});
    aspect_layer.set('name', 'aspect_layer');
    maps[map_ind].addLayer(aspect_layer);
});

function aspect_function_show(isLandslideDam){
	btn_disable();
	if(isLandslideDam == 1)
	{
		//show at LandslideDam
//		$('#Analysis_1_4')[0].style.display = "none";
		if($('#Analysis_1_5')[0].classList.contains("active"))
		{
		//	console.log("Active, inactive the function");
			$('#Analysis_1_5')[0].classList.toggle("active");
			$('#original_aspect')[0].classList.toggle("active");
		}
		$('#original_aspect').html(``);
		$('#original_aspect')[0].style.display = "none";
		$('#landslidedam_aspect').html(` 
			<div id='aspect_tool'> 
                <!-- 20190515 fixed -->
				<div class='ui secondary menu'>
					<a class='item' id = 'aspect_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'aspect_paint06'><img src='img/paint06.png'></a>
					<br>
				</div> 
                <!-- 20190515 fixed -->
			</div> 
			<select id='aspect_select' onchange='aspect_tool_show()' class='select-control'> 
			
                <!-- 20190515 fixed -->
				<!--<option value='坡向分析' selected='selected'>坡向分析</option>-->
                <!-- 20190515 fixed -->
				<option value='getImageFile'>取得坡向分級影像(getImageFile)</option>
				<option value='getAspectValue'>取得單點坡向值(getAspectValue)</option>
				<option value='getAspectClassify'>取得坡向分級分析結果(getAspectClassify)</option>
				<!--option value='getImage'>取得坡向分級圖檔(getImage)</option-->
		   </select> 
		   <br><br>
		   WKT<br><br>
		   <input type='text' id='aspect_locate' placeholder='請從地圖上點位' class='disable-control' disabled><br><br>
		   數值資料<br><br>
		   <select id='aspect_data' class='select-control'> 
				<option value='TW_DLA_20010814_20061226_20M_3826'>20M TW DLA DTM (92-94年)</option>
				<option value='TW_DLA_20110101_20161101_20M_3826' selected='selected'>20M TW DLA DTM (99-104年)</option>
				<!-- 20190513 fixed -->
				<!--<option value='TW_DLA_20010814_20061226_5M_3826'>5M TW DLA DTM (92-94年)</option>-->
				<!-- 20190513 fixed -->
		   </select> 
		   <br><br>
		   <button class='ui button' id="aspect_execute" onclick = 'aspect_execute()'>執行</button>
			<!-- 20190513 fixed -->
		   <div id='tree_aspect' style='width:100%;height:200;'></div> 
		   <div id='aspect_result'></div>
			<!-- 20190513 fixed -->
			`);
		
		btn_enable();
		clear_map();
		createMeasureTooltip(); 

		null_aspect_Tree = new dhtmlXTreeObject("tree_aspect", "100%", "100%", 0);
		drawer_win_call();
		draw_aspect_Tree.moveItem("0","item_child","0",null_aspect_Tree);
		
	}
	else
	{
		//show at LandAPIs
//	$('#Analysis_1_4')[0].style.display = "";
		$('#landslidedam_aspect').html(``);
		if(Landslidedam_w1_Acc.cells('a3_2').isOpened())
		{
	//		console.log("Cell open, closed");
			Landslidedam_w1_Acc.cells('a3_0').open();
		}
		$('#original_aspect')[0].style.display = "";
		$('#original_aspect').html(` 
			<div id='aspect_tool'> 
                <!-- 20190515 fixed -->
				<div class='ui secondary menu'>
					<a class='item' id = 'aspect_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'aspect_paint06'><img src='img/paint06.png'></a>
					<br>
				</div> 
                <!-- 20190515 fixed -->
			</div> 
			<select id='aspect_select' onchange='aspect_tool_show()' class='select-control'> 
			
                <!-- 20190515 fixed -->
				<!--<option value='坡向分析' selected='selected'>坡向分析</option>-->
                <!-- 20190515 fixed -->
				<option value='getImageFile'>取得坡向分級影像(getImageFile)</option>
				<option value='getAspectValue'>取得單點坡向值(getAspectValue)</option>
				<option value='getAspectClassify'>取得坡向分級分析結果(getAspectClassify)</option>
				<!--option value='getImage'>取得坡向分級圖檔(getImage)</option-->
		   </select> 
		   <br><br>
		   WKT<br><br>
		   <input type='text' id='aspect_locate' placeholder='請從地圖上點位' class='disable-control' disabled><br><br>
		   數值資料<br><br>
		   <select id='aspect_data' class='select-control'> 
				<option value='TW_DLA_20010814_20061226_20M_3826'>20M TW DLA DTM (92-94年)</option>
				<option value='TW_DLA_20110101_20161101_20M_3826' selected='selected'>20M TW DLA DTM (99-104年)</option>
				<!-- 20190513 fixed -->
				<!--<option value='TW_DLA_20010814_20061226_5M_3826'>5M TW DLA DTM (92-94年)</option>-->
				<!-- 20190513 fixed -->
		   </select> 
		   <br><br>
		   <button class='ui button' id="aspect_execute" onclick = 'aspect_execute()'>執行</button>
			<!-- 20190513 fixed -->
		   <div id='tree_aspect' style='width:100%;height:200;'></div> 
		   <div id='aspect_result'></div>
			<!-- 20190513 fixed -->
			`);
		btn_enable();
		clear_map();
		createMeasureTooltip(); 
		
		null_aspect_Tree = new dhtmlXTreeObject("tree_aspect", "100%", "100%", 0);
		drawer_win_call();
		draw_aspect_Tree.moveItem("0","item_child","0",null_aspect_Tree);
		
	}
}

function aspect_tool_show(){ //坡級工具圖示設定
	$('#aspect_locate').val('');
	switch($('#aspect_select').val())
	{
		
		/*** 20190515 fixed ***/
		/*
		case '坡向分析':
			$('#aspect_tool').html('');
			break;
		*/
		/*** 20190515 fixed ***/
		case 'getAspectValue':
			$('#aspect_tool').html(`
				<div class='ui secondary menu'>
					<a class='item' id = 'aspect_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'aspect_paint02'><img src='img/paint02.png'></a>
					<br>
				</div> 
			`);
			btn_enable();
			break;
		case 'getAspectClassify':
			$('#aspect_tool').html(`
				<div class='ui secondary menu'>
					<a class='item' id = 'aspect_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'aspect_paint04'><img src='img/paint04.png'></a>
					<a class='item' id = 'aspect_paint03'><img src='img/paint03.png'></a>
					<a class='item' id = 'aspect_paint06'><img src='img/paint06.png'></a>
					<br>
				</div> 
			`);
			btn_enable();
			break;
		case 'getImageFile':
			$('#aspect_tool').html(`
				<div class='ui secondary menu'>
					<a class='item' id = 'aspect_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'aspect_paint06'><img src='img/paint06.png'></a>
					<br>
				</div> 
			`);
			btn_enable();
			break;
		case 'getImage':
			$('#aspect_tool').html(`
				<div class='ui secondary menu'>
					<a class='item' id = 'aspect_paint01'><img src='img/paint01.png'></a> 
					<a class='item' id = 'aspect_paint06'><img src='img/paint06.png'></a>
					<br>
				</div> 
			`);
			btn_enable();
			break;
	}
}

function aspect_add_point(){ //抓取point的經緯度，point的設定
	
    /*** 20190515 fixed ***/
	//if(aspect_draw_type != "point")
	//{
    /*** 20190515 fixed ***/
		$('#aspect_locate').val('');
		clear_map();
		aspect_draw = new ol.interaction.Draw({
	        type: 'Point',
	        source: aspect_layer.getSource(),
	        maxPoints: 1
	    });
		aspect_draw.on('drawend', function(event){
	    	aspect_layer.getSource().clear();
	        var s = new ol.style.Style({
	            image: new ol.style.Circle({
	                radius: 5,
	                fill: new ol.style.Fill({color: '#ff8000'}),
	                stroke: new ol.style.Stroke({color: '#0072e3', width: 1})
	            })
	        });
	        event.feature.setStyle(s);
	        var coor = ol.proj.transform(event.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
	        //console.log(coor);
	        $('#aspect_locate').val('POINT('+coor[0]+' '+coor[1]+')');
			maps[map_ind].removeInteraction(aspect_draw);
	    });
		maps[map_ind].addInteraction(aspect_draw);
		aspect_draw_type = "point";
		
    /*** 20190515 fixed ***/
	//}
    /*** 20190515 fixed ***/
}


function aspect_add_linestring(){ //抓取linestring的經緯度，linestring的設定
    /*** 20190515 fixed ***/
	//if(aspect_draw_type != "linestring")
	//{
    /*** 20190515 fixed ***/
		$('#aspect_locate').val('');
		clear_map();
		aspect_draw = new ol.interaction.Draw({
	        type: 'LineString',
	        source: aspect_layer.getSource(),
	    });

		maps[map_ind].addInteraction(aspect_draw);	
		aspect_draw.on('drawstart',
	        function (evt) {
	            aspect_layer.getSource().clear();
				btn_disable();

	            createMeasureTooltip();
	            // set sketch
	            sketch = evt.feature;

	            var tooltipCoord = evt.coordinate;

	            listener = sketch.getGeometry().on('change', function (evt) {
	                var geom = evt.target;
	                var output;
	                output = formatLength(geom);
	                tooltipCoord = geom.getLastCoordinate();
					
	                measureTooltipElement.innerHTML = output;
	                measureTooltip.setPosition(tooltipCoord);
	            });
	        }, this);
		
		aspect_draw.on('drawend',
	        function (e) {
				var input = "";
				for(var i = 0 ; i < e.target.sketchCoords_.length ; i++)
				{
					var coor = ol.proj.transform(e.target.sketchCoords_[i], 'EPSG:3857', 'EPSG:4326');
					if(i == 0) input += "LINESTRING(";
					input += coor[0] + " " + coor[1];
					if(i != (e.target.sketchCoords_.length - 1)) input += ",";
					else input += ")";
				}
				$('#aspect_locate').val(input);
				btn_enable();
				maps[map_ind].removeInteraction(aspect_draw);
	        }, this);
		aspect_draw_type = "linestring";
    /*** 20190515 fixed ***/
	//}
    /*** 20190515 fixed ***/
}


function aspect_add_polygon(){ //抓取polygon的經緯度，polygon的設定
    /*** 20190515 fixed ***/
	//if(aspect_draw_type != "polygon")
	//{
    /*** 20190515 fixed ***/
		$('#aspect_locate').val('');
		clear_map();
		aspect_draw = new ol.interaction.Draw({
	        type: 'Polygon',
	        source: aspect_layer.getSource(),
	    });
		
		maps[map_ind].addInteraction(aspect_draw);	
		aspect_draw.on('drawstart',
	        function (evt) {
	            aspect_layer.getSource().clear();
				btn_disable();

	            createMeasureTooltip();
	            // set sketch
	            sketch = evt.feature;

	            var tooltipCoord = evt.coordinate;

	            listener = sketch.getGeometry().on('change', function (evt) {
	                var geom = evt.target;
	                var output;
	                output = formatArea(geom);
                  	tooltipCoord = geom.getInteriorPoint().getCoordinates();
					
					var sourceProj = maps[map_ind].getView().getProjection();
					var geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
					var coordinates = geom_t.getLinearRing(0).getCoordinates();
					aspect_area = Math.abs(wgs84Sphere.geodesicArea(coordinates)) / 1000000;
					
	                measureTooltipElement.innerHTML = output;
	                measureTooltip.setPosition(tooltipCoord);
	            });
	        }, this);
		
		aspect_draw.on('drawend',
	        function (e) {
				// console.log(e.target.D);
				// $('#aspect_locate').val(e.target.D);
				var input = "";
				var tmpcoor;
				for(var i = 0 ; i < e.feature.getGeometry().getCoordinates()[0].length ; i++)
				{
					if(i==0) tmpcoor = ol.proj.transform(e.feature.getGeometry().getCoordinates()[0][i], 'EPSG:3857', 'EPSG:4326');
					var coor = ol.proj.transform(e.feature.getGeometry().getCoordinates()[0][i], 'EPSG:3857', 'EPSG:4326');
					if(i == 0) input += "POLYGON((";
					input += coor[0] + " " + coor[1];
					if(i != (e.feature.getGeometry().getCoordinates()[0].length - 1)) input += ",";
					else input += ","+tmpcoor[0] + " " + tmpcoor[1]+"))";
				}
				$('#aspect_locate').val(input);
				btn_enable();
				maps[map_ind].removeInteraction(aspect_draw);
	        }, this);
		aspect_draw_type = "polygon";
    /*** 20190515 fixed ***/
	//}
    /*** 20190515 fixed ***/
}


function aspect_add_rectangle(){ //抓取rectangle的經緯度，rectangle的設定
    /*** 20190515 fixed ***/
	//if(aspect_draw_type != "rectangle")
	//{
    /*** 20190515 fixed ***/
		$('#aspect_locate').val('');
		clear_map();
		geometryFunction = function(coordinates, geometry) {
	        if (!geometry) {
				geometry = new ol.geom.Polygon(null);
	        }
	        var start = coordinates[0];
	        var end = coordinates[1];
			
	        geometry.setCoordinates([
				[start, [start[0], end[1]], end, [end[0], start[1]], start]
	        ]);
	        return geometry;
		};
		aspect_draw = new ol.interaction.Draw({
			type: 'LineString',
		    source: aspect_layer.getSource(),
			geometryFunction: geometryFunction,
			maxPoints: 2
		});
		maps[map_ind].addInteraction(aspect_draw);


		aspect_draw.on('drawstart',
	        function (evt) {
	            aspect_layer.getSource().clear();
				btn_disable();

	            createMeasureTooltip();
	            // set sketch
	            sketch = evt.feature;

	            var tooltipCoord = evt.coordinate;

	            listener = sketch.getGeometry().on('change', function (evt) {
	                var geom = evt.target;
	                var output;
	                output = formatArea(geom);
                  	tooltipCoord = geom.getInteriorPoint().getCoordinates();
					
					var sourceProj = maps[map_ind].getView().getProjection();
					var geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
					var coordinates = geom_t.getLinearRing(0).getCoordinates();
					aspect_area = Math.abs(wgs84Sphere.geodesicArea(coordinates)) / 1000000;
					
	                measureTooltipElement.innerHTML = output;
	                measureTooltip.setPosition(tooltipCoord);
	            });
	        }, this);
		aspect_draw.on('drawend',
	        function (e) {
				// console.log(e.target.sketchCoords_);
				// $('#aspect_locate').val(e.target.sketchCoords_);
				var input = "";
				box_array=(String(e.feature.getGeometry().getExtent())).split(",");  // return [minx, miny, maxx, maxy]
				var coor0=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');												
				var coor1=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');											
				//var coor0 = ol.proj.transform(e.target.sketchCoords_[0], 'EPSG:3857', 'EPSG:4326');
				//var coor1= ol.proj.transform(e.target.sketchCoords_[1], 'EPSG:3857', 'EPSG:4326');
				
				left_aspect = Math.min(coor0[0],coor1[0]);
				right_aspect = Math.max(coor0[0],coor1[0]);
				down_aspect = Math.min(coor0[1],coor1[1]);
				up_aspect = Math.max(coor0[1],coor1[1]);
				input += "POLYGON(("+coor0[0]+" "+coor0[1]+","+coor1[0]+" "+coor0[1]+","+coor1[0]+" "+coor1[1]+","+coor0[0]+" "+coor1[1]+","+coor0[0]+" "+coor0[1]+"))";
	        	$('#aspect_locate').val(input);
				btn_enable();
				maps[map_ind].removeInteraction(aspect_draw);
	        }, this);

		aspect_draw_type = "rectangle";
    /*** 20190515 fixed ***/
	//}
    /*** 20190515 fixed ***/
}

function aspect_remove_interaction(){ //增加tooltip小圖示並在map圖層上
	createMeasureTooltip();
	$('#aspect_locate').val('');
	aspect_layer.getSource().clear();
	maps[map_ind].removeInteraction(aspect_draw);
	aspect_draw_type = "none";
}

function aspect_execute(){ //坡向分析型態的資料顯示和設定
	var select = $('#aspect_select').val();
	var wkt = $('#aspect_locate').val();
	var data = $('#aspect_data').val();
	var aspect_t = $('#aspect_select').val().toString()
    /*** 20190515 fixed ***/
	/*if(select == "坡向分析")
	{
		alert("請選擇一項分析");
		return;
	}*/
    /*** 20190515 fixed ***/
	if(wkt == "")
	{
		alert("請從地圖上點位");
		return;
	}
	btn_disable();
	
	console.log(aspect_area)
	console.log(aspect_t)
	
	if ( aspect_t === "getAspectClassify" && ( aspect_draw_type === "rectangle" || aspect_draw_type == "polygon" ) && ( aspect_area > AspectClassify_area_ulim || aspect_area < AspectClassify_area_dlim ) ) {
		
		if ( aspect_area > AspectClassify_area_ulim ) {
			alert("請選擇面積小於 " + AspectClassify_area_ulim + " 平方公里範圍進行分析!")
		} else if ( aspect_area < AspectClassify_area_dlim ) {
			alert("請選擇面積大於 " + AspectClassify_area_dlim + " 平方公里範圍進行分析!")
		}
		btn_enable();
	} else if ( aspect_t === "getImageFile" && (aspect_area > AspectImageFile_area_ulim || aspect_area < AspectImageFile_area_dlim) ) {
		if ( aspect_area > AspectImageFile_area_ulim ) {
			alert("請選擇面積小於 " + AspectImageFile_area_ulim + " 平方公里範圍進行分析!")
		} else if ( aspect_area < AspectImageFile_area_dlim ) {
			alert("請選擇面積大於 " + AspectImageFile_area_dlim + " 平方公里範圍進行分析!")
		}
		btn_enable();
	} else if ( aspect_t === "getImage" && (aspect_area > AspectImage_area_ulim || aspect_area < AspectImage_area_dlim) ) {
		if ( aspect_area > AspectImage_area_ulim ) {
			alert("請選擇面積小於 " + AspectImage_area_ulim + " 平方公里範圍進行分析!")
		} else if ( aspect_area < AspectImage_area_dlim ) {
			alert("請選擇面積大於 " + AspectImage_area_dlim + " 平方公里範圍進行分析!")
		}
		btn_enable();
	} else {
		$.ajax({
			url: "php/get_aspect_detail.php",
			type: 'post',
			dataType:'text',
			data: {
				select: select,
				wkt: wkt,
				data: data,
				left: left_aspect,
				up: up_aspect,
				right: right_aspect,
				down: down_aspect,
				/*** add 20190529 ***/
				l: (aspect_num + 1).toString()
				/*** add 20190529 ***/
			},
			success: function(data) {
				if(data == "WKT未包含任何縣市,或此縣市資料，系統尚未支援" || data == "API KEY 錯誤" || data == "您沒有權限使用此資料類型")
				{
					alert(data);
				}
				else{
					switch($('#aspect_select').val())
					{
						case 'getAspectValue':
						
							var obj;
							try {
								obj = JSON.parse(data);
								$('#aspect_result').html('');
								$('#aspect_result').width("auto");
								$('#aspect_result').height("auto");
								$('#aspect_result').html(`
									<table class="ui fixed single line celled table">
									  <tbody>
										<tr>
										  <td>坡向</td>
										  <td>`+obj.aspect_direction+`</td>
										</tr>
										<tr>
										  <td>說明文字</td>
										  <td>`+obj.desc+`</td>
										</tr>
										<tr>
										  <td>坡向數值</td>
										  <td>`+obj.aspect_angle+`</td>
										</tr>
									  </tbody>
									</table>
								`);
							} catch(e) {
								alert('API進行調整中!'); // error in the above string (in this case, yes)!
							}
							break;
						case 'getAspectClassify':
							try {
								obj = JSON.parse(data);
								// console.log(obj);
								$('#aspect_result').html('');
								$('#aspect_result').width("100%");
								$('#aspect_result').height("300px");
								var valueAxex_title = "單位("+obj.Unit+")";
								/*** 20190515 fixed ***/
								am4core.ready(function() {

									// Themes begin
									am4core.useTheme(am4themes_animated);
									// Themes end

									var chart = am4core.create("aspect_result", am4charts.RadarChart);
									chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

									let data = []
									
									
                                    /*** 20190529 fixed ***/
									data.push({aspect:"平地", 'area(公頃)':obj.classify[0].cellArea / 10000})
									data.push({aspect:"北", 'area(公頃)':obj.classify[1].cellArea / 10000})
									data.push({aspect:"東北", 'area(公頃)':obj.classify[2].cellArea / 10000})
									data.push({aspect:"東", 'area(公頃)':obj.classify[3].cellArea / 10000})
									data.push({aspect:"東南", 'area(公頃)':obj.classify[4].cellArea / 10000})
									data.push({aspect:"南", 'area(公頃)':obj.classify[5].cellArea / 10000})
									data.push({aspect:"西南", 'area(公頃)':obj.classify[6].cellArea / 10000})
									data.push({aspect:"西", 'area(公頃)':obj.classify[7].cellArea / 10000})
									data.push({aspect:"西北", 'area(公頃)':obj.classify[8].cellArea / 10000})
									
									console.log(data)

									chart.data = data;

									var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
									categoryAxis.dataFields.category = "aspect";
									categoryAxis.renderer.labels.template.location = 0.1;
									categoryAxis.renderer.tooltipLocation = 0.1;

									var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
									valueAxis.tooltip.disabled = true;
									valueAxis.renderer.labels.template.horizontalCenter = "center";
                                    valueAxis.min = 0;

									var series1 = chart.series.push(new am4charts.RadarColumnSeries());
                                    series1.name = "面積";
                                    series1.columns.template.tooltipText = "{name}: {valueY.value}公頃";
									series1.columns.template.width = am4core.percent(100);
									series1.dataFields.categoryX = "aspect";
									series1.dataFields.valueY = "area(公頃)";
									series1.stacked = true;

									chart.seriesContainer.zIndex = -1;

									chart.scrollbarX = new am4core.Scrollbar();
                                    chart.scrollbarX.start = 0.11111;
									chart.scrollbarX.exportable = false;
									chart.scrollbarY = new am4core.Scrollbar();
									chart.scrollbarY.exportable = false;

									chart.cursor = new am4charts.RadarCursor();
									chart.cursor.xAxis = categoryAxis;
									chart.cursor.fullWidthXLine = true;
									chart.cursor.lineX.strokeOpacity = 0;
									chart.cursor.lineX.fillOpacity = 0.1;
									chart.cursor.lineX.fill = am4core.color("#ffffff");

									// Enable export
									
									chart.exporting.menu = new am4core.ExportMenu();
                                    /*** 20190529 fixed ***/
								}); // end am4core.ready()
								
								
								/*
								var chart = AmCharts.makeChart( "aspect_result", {
									"type": "serial",
									"theme": "light",
									"dataProvider": [ {
									  "aspect": "平地",
									  "area(m2)": obj.classify[0].cellArea
									}, {
									  "aspect": "北",
									  "area(m2)": obj.classify[1].cellArea
									}, {
									  "aspect": "東北",
									  "area(m2)": obj.classify[2].cellArea
									}, {
									  "aspect": "東",
									  "area(m2)": obj.classify[3].cellArea
									}, {
									  "aspect": "東南",
									  "area(m2)": obj.classify[4].cellArea
									}, {
									  "aspect": "南",
									  "area(m2)": obj.classify[5].cellArea
									}, {
									  "aspect": "西南",
									  "area(m2)": obj.classify[6].cellArea
									}, {
									  "aspect": "西",
									  "area(m2)": obj.classify[7].cellArea
									}, {
									  "aspect": "西北",
									  "area(m2)": obj.classify[8].cellArea
									} ],
									"valueAxes": [{
									  "axisAlpha": 0,
									  "position": "left",
									  "title": valueAxex_title
									}],
									"gridAboveGraphs": true,
									"startDuration": 1,
									"graphs": [ {
									  "balloonText": "[[category]]: <b>[[value]]</b>",
									  "fillAlphas": 0.8,
									  "lineAlpha": 0.2,
									  "type": "column",
									  "valueField": "area(m2)"
									} ],
									"chartCursor": {
									  "categoryBalloonEnabled": false,
									  "cursorAlpha": 0,
									  "zoomable": false
									},
									"categoryField": "aspect",
									"categoryAxis": {
									  "gridPosition": "start",
									  "gridAlpha": 0,
									  "tickPosition": "start",
									  "tickLength": 20
									},
									"export": {
									  "enabled": true
									}

								});*/
								/*** 20190515 fixed ***/
							} catch(e) {
								alert('API進行調整中!'); // error in the above string (in this case, yes)!
							}
							break;
						case 'getImageFile':
							try {
								var json;
								json = JSON.parse(data);
								loading_id = "l"+aspect_num.toString();
								draw_aspect_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								draw_aspect_Tree.enableCheckBoxes(false, false);
								// get .kmz file url
								aspect_kmz_link_arr.push(json.kmz[0].url);

								// debug

								// console.log(json.imgFilePath);
								// console.log("Width : " + json.imageWidth);
								// console.log("Height : " + json.imageHeight);
								//alert("img url : " + json.data.link);
								
								aspect_num = aspect_num + 1;
								
								new_node_id = `{
									"PosInfo":"${((up_aspect + down_aspect) / 2.0).toString() + ";" + 
												 ((left_aspect + right_aspect) / 2.0).toString() + ";563426;8;" + 
												json.imageWidth.toString() + ";" + 
												json.imageHeight.toString() + ";" + 
												left_aspect.toString() + ";" + 
												down_aspect.toString() + ";" + 
												right_aspect.toString() + ";" + 
												up_aspect.toString()}",
									"Type":"ImageOverlay",
									"Url":"${json.imgFilePath}",
									"ID":"aspect${aspect_num.toString()}",
									"FileName":"坡向分析${aspect_num.toString()}-坡向分級影像"
								}`.replace(/\n|\t/g, "").trim();
								
									
								// delete loading signal

								draw_aspect_Tree.deleteItem(loading_id, false);
								draw_aspect_Tree.enableCheckBoxes(true, true);
									
								// layer item
								
								draw_aspect_Tree.insertNewChild("0", new_node_id, "坡向分析" + aspect_num.toString() + "-坡向分級影像", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								/*** add 20190515 ***/
								aspect_legend_link_arr.push(json.legendFilePath);
								draw_aspect_Tree.insertNewChild(new_node_id, "aspect_legend" + aspect_num.toString(), "開啟圖例", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								var legend_win = dhxWins.createWindow("aspect_legwin" + aspect_num.toString(), 600, 600, json.LegendImgWidth / 3, (json.LegendImgHeight / 3 + 250));
								legend_win.setText("");
								
								legend_win.attachEvent("onClose", function(win){
									var n = parseInt(this.getId().split("aspect_legwin")[1])
									draw_aspect_Tree.setCheck("aspect_legend" + n.toString(), false);
									//this.close();
									this.hide();
								});
								
								dhxWins.window("aspect_legwin" + aspect_num.toString()).button("minmax").hide();
								dhxWins.window("aspect_legwin" + aspect_num.toString()).button("park").hide();
								
								legend_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
											  "<div style='align: center; height:100%;width:100%;'>" + 
											  "<p style='text-align: center; font-size:8px;width:100%;' >坡向分析" + aspect_num.toString() + "-坡向分級影像</p>" + 
											  "<br><img src='" + json.legendFilePath + "' style='display:block; margin-left: auto; margin-right: auto; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
								legend_win.attachHTMLString(legend_html)
								
								legend_win.hide()
								draw_aspect_Tree.showItemCheckbox("aspect_legwin" + aspect_num.toString(), false);
								aspect_legwin_link_arr.push(legend_win);
								/*** add 20190515 ***/
								
								// download item
								
								draw_aspect_Tree.insertNewItem(new_node_id, "d" + aspect_num.toString(), "下載 .kmz 檔", 
															function(){ 
																var idn = this.id.split("d");
																document.getElementById("download_iframe").src = aspect_kmz_link_arr[idn[1] - 1];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
															
								/*** add 20190515 ***/	
								//draw_aspect_Tree.showItemCheckbox("d" + aspect_num.toString(), false);
								draw_aspect_Tree.disableCheckbox("d" + aspect_num.toString(), true);
								/*** add 20190515 ***/
								
								
								// Download button Default : closed
								
								draw_aspect_Tree.closeItem(new_node_id);
									
								// enable button
								
							} catch(e) {
								alert('API進行調整中!'); // error in the above string (in this case, yes)!
							}
							break;
						case 'getImage':
							try {
								
								var json;
								json = JSON.parse(data);
								loading_id = "l"+aspect_num.toString();
								draw_aspect_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								draw_aspect_Tree.enableCheckBoxes(false, false);
								// get .kmz file url

								aspect_kmz_link_arr.push(json.kmz);

								// debug
								// console.log(json.imgFilePath);
								// console.log("Width : " + json.imageWidth);
								// console.log("Height : " + json.imageHeight);
								//alert("img url : " + json.data.link);
								
								aspect_num = aspect_num + 1;
								
								new_node_id = `{
									"PosInfo":"${((up_aspect + down_aspect) / 2.0).toString() + ";" + 
												 ((left_aspect + right_aspect) / 2.0).toString() + ";563426;8;" + 
												json.imageWidth.toString() + ";" + 
												json.imageHeight.toString() + ";" + 
												left_aspect.toString() + ";" + 
												down_aspect.toString() + ";" + 
												right_aspect.toString() + ";" + 
												up_aspect.toString()}",
									"Type":"ImageOverlay",
									"Url":"${json.imgFilePath}",
									"ID":"aspect${aspect_num.toString()}",
									"FileName":"坡向分析${aspect_num.toString()}-坡向分級圖檔"
								}`.replace(/\n|\t/g, "").trim();
								// delete loading signal

								draw_aspect_Tree.deleteItem(loading_id, false);
								draw_aspect_Tree.enableCheckBoxes(true, true);
									
								// layer item
								
								draw_aspect_Tree.insertNewChild("0", new_node_id, "坡向分析" + aspect_num.toString() + "-坡向分級圖檔", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								// download item
								
								draw_aspect_Tree.insertNewItem(new_node_id, "d" + aspect_num.toString(), "下載 .kmz 檔", 
															function(){ 
																var idn = this.id.split("d");
																document.getElementById("download_iframe").src = aspect_kmz_link_arr[idn[1] - 1];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
															
								draw_aspect_Tree.showItemCheckbox("d" + aspect_num.toString(), false);
								
								
								// Download button Default : closed
								
								draw_aspect_Tree.closeItem(new_node_id);
									
							} catch(e) {
								alert('API進行調整中!'); // error in the above string (in this case, yes)!
							}
							break;
					}
				}
				
				btn_enable();
			},
			error: function(jqXHR) {
				alert("發生錯誤: " + jqXHR.status);
				btn_enable();
			}
		});
	}
}
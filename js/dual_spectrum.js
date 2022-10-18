var spectrum_arr = []
var curr_spectrum_layer1;
var curr_spectrum_layer2;
var curr_spectrum_layer1_ind=1;
var curr_spectrum_layer2_ind=1;

var spectrum_source1;
var spectrum_vector1;
var spectrum_source2;
var spectrum_vector2;
var spectrum_region = "";

var avg_lat = 0;
var avg_lng = 0;

// 選取範圍上下限
var spectrum_area_up_limit = 10.0;  
var spectrum_area_down_limit = 0.0;

var spec_url = "";
var spec_area = 0;

// 取得衛星影像並加到下拉式選單
$(document).ready(function () {	
	// php/BL_A01_T02.php
	$.ajax({
		type: 	"GET",
		url:	"php/BL_A01_T02.php",
		dataType:	"xml",
		//jsonpCallback: 'callback',
		success: function(xml) {
			spectrum_arr = $(xml).children().children()
			// add to list
			for (var i = 0; i < $(xml).children().children().length; i++) {
				var str = $(xml).children().children()[i].getAttribute('text')

				// add to left
				var o1 = new Option(str, str);
				$(o1).html(str)
				$("#spectrum_list1").append(o1);

				// add to right
				var o2 = new Option(str, str);
				$(o2).html(str)
				$("#spectrum_list2").append(o2);
			}
			// set the default layer
			curr_spectrum_layer1 = spectrum_arr[0]
			$("#spectrum_list1").on("change", spectrum_onchange1);
			curr_spectrum_layer2 = spectrum_arr[0]
			$("#spectrum_list2").on("change", spectrum_onchange2);
		},
		error: function(jqXHR) {
			$("#dual_spectrum_block").css("display","none");
		}
	});

	if ( !$('#spectrum_checked').is(":checked") ) {
		$("#spectrum_button").off('click');
	} else {
		$("#spectrum_button").on('click', function(e){spectrum_getPoly()});
	}

	spec_url = "";
	spec_area = 0;
});

// 清除原本的衛星影像圖層
function clear_spectrum(map)
{
	$("#spectrum_button").off('click');
	spec_url = "";
	// 左視窗
	if (map == "left" ) {
		if (spectrum_vector1) {
			maps[map_ind].removeLayer(spectrum_vector1);
			spectrum_vector1 = "";
			spectrum_source1 = "";
		}
	}
	// 右視窗
	else if ( map == "right" ) {
		if (spectrum_vector2) {
			maps[map_ind ^ 0x1].removeLayer(spectrum_vector2);
			spectrum_vector2 = "";
			spectrum_source2 = "";		
		}
	}
}
// 清除所選的區域
function clear_spectrum_region()
{
	spec_area = 0;
	spec_url = ""
	spectrum_region = ""
	clear_map()
}
// 更改左圖層選擇的選項時改變左視窗要顯示的衛星影像
function spectrum_onchange1()
{
	for (var i = 0; i < spectrum_arr.length; i++) {
		if ( spectrum_arr[i].getAttribute('text') === $("#spectrum_list1").val() ) {
			curr_spectrum_layer1_ind=i;
			curr_spectrum_layer1 = spectrum_arr[i]
		}
	}
	
	spec_url = "";

	if ( $('#spectrum_checked').is(":checked") ) {
		clear_spectrum("left")
		set_spectrum("left")
	}
}
// 5.更改右圖層選擇的選項時改變右視窗要顯示的衛星影像
function spectrum_onchange2()
{
	for (var i = 0; i < spectrum_arr.length; i++) {
		if ( spectrum_arr[i].getAttribute('text') === $("#spectrum_list2").val() ) {
			curr_spectrum_layer2_ind=i;
			curr_spectrum_layer2 = spectrum_arr[i]
		}
	}
	
	spec_url = "";

	if ( $('#spectrum_checked').is(":checked") ) {		
		clear_spectrum("right")
		set_spectrum("right")
	}
}
// 顯示衛星影像
function set_spectrum(map)
{
	if ( map === "left" ) {
		$("#spectrum_button").on('click', function(e){spectrum_getPoly()});
		
		//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016

		let curr_layer = JSON.parse(curr_spectrum_layer1.getAttribute('id'));
			
		spectrum_source1 = new ol.source.TileImage({
			tileUrlFunction: function(tileCoord){

				var z = tileCoord[0];
				var x = tileCoord[1]-1;
				var y = -tileCoord[2]-1;					
				return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
			},
			crossOrigin:'anonymous'
		})
		
		spectrum_vector1 = new ol.layer.Tile({
			source: spectrum_source1
		});
		
		spectrum_vector1.setZIndex(1);
		
		maps[map_ind].addLayer(spectrum_vector1);
	} else if ( map === "right" ) {
		$("#spectrum_button").on('click', function(e){spectrum_getPoly()});
		
		//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016

		let curr_layer = JSON.parse(curr_spectrum_layer2.getAttribute('id'));
			
		spectrum_source2 = new ol.source.TileImage({
			tileUrlFunction: function(tileCoord){

				var z = tileCoord[0];
				var x = tileCoord[1]-1;
				var y = -tileCoord[2]-1;					
				return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
			},
			crossOrigin:'anonymous'
		})
		
		spectrum_vector2 = new ol.layer.Tile({
			source: spectrum_source2
		});
		
		spectrum_vector2.setZIndex(1);
		
		maps[map_ind ^ 0x1].addLayer(spectrum_vector2);
	}
}
// 6.畫出選取範圍
function spectrum_getPoly(){
	document.getElementById("space_lonlat").checked = true;
	
	clear_spectrum_region(); // clear the selected region
 
	createMeasureTooltip();  
 
    // create box
    source_box = new ol.source.Vector({wrapX: false});
	vector_box = new ol.layer.Vector({
		source: source_box,
		style: new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255, 255, 255, 0.2)'
			}),
			stroke: new ol.style.Stroke({
				color: '#ffcc33',
				width: 2
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: '#ffcc33'
				})
			})
		})
	});
	
	maps[map_ind].addLayer(vector_box);
	value = 'LineString';
    var maxPoints = 2;
	
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

	draw_box = new ol.interaction.Draw({
		source: source_box,
		type: /** @type {ol.geom.GeometryType} */ (value),
		geometryFunction: geometryFunction,
		maxPoints: maxPoints
	});

	vector_box.setZIndex(draw_box_zindex);
	maps[map_ind].addInteraction(draw_box);
	
	// create listener for start drawing
	draw_box.on('drawstart',
	function (evt) {

		btn_disable();
		
		sketch = evt.feature;

		var tooltipCoord = evt.coordinate;
		// listener for mouse event(changing the position)
		listener = sketch.getGeometry().on('change', function (evt) {
			var geom = evt.target;
			var output;
			output = formatArea(geom);
			tooltipCoord = geom.getInteriorPoint().getCoordinates();
			// convert the coordinate
			var sourceProj = maps[map_ind].getView().getProjection();
			var geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
			var coordinates = geom_t.getLinearRing(0).getCoordinates();
			spec_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
			
			measureTooltipElement.innerHTML = output;
			measureTooltip.setPosition(tooltipCoord);
		});
	}, this);	
		
	// listener for the end of drawing
	draw_box.on('drawend',
        function (e) {
			clear_map();
		 
			createMeasureTooltip();
			//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/searcharchiveexport?
			//satellite_band=1,2,3,4
			//&start_date=20170501
			//&end_date=20170831
			//&lefttop_x=121.03157043457031
			//&rightbottom_x=121.19430541992188
			//&lefttop_y=22.816061209792952
			//&rightbottom_y=22.72299043351299
			
			box_array=(String(e.feature.getGeometry().getExtent())).split(",");  // return [minx, miny, maxx, maxy]

			loc_84=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');
			lefttop_x=loc_84[0]
			lefttop_y=loc_84[1]

			loc_84=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');
			rightbottom_x=loc_84[0]
			rightbottom_y=loc_84[1]

			spectrum_region = "&lefttop_x=" + lefttop_x +
							  "&rightbottom_x=" + rightbottom_x +
							  "&lefttop_y=" + lefttop_y +
							  "&rightbottom_y=" + rightbottom_y

			console.log("spectrum_region : " + spectrum_region)
			avg_lat = (lefttop_x + rightbottom_x) / 2
			avg_lng = (lefttop_y + rightbottom_y) / 2

			maps[map_ind].removeInteraction(draw_box);
			
			btn_enable();
			
        }, this);	   
}
// 7.傳送資料給後端抓取圖片
function spectrum_getKml()
{
	fun_access_log("Func_Use_Analysis_1_9");
	//satellite_band=1,2,3,4
	var satellite_band = "satellite_band=";
	var selected = 0;
	for(var i=1;i<14;i++)
	{
		var band = "band_" + i.toString();
		var checkBox = document.getElementById(band);
		
		if(checkBox.checked == true){
			var val = checkBox.value;
			selected = i
			satellite_band = satellite_band + val + ",";
		}		
	}
	satellite_band = satellite_band.slice(0,satellite_band.length-1)
	if(selected == 0)
	{
		alert("尚未選擇波段");
		retrun;
	}
	console.log(satellite_band)
	//&start_date=20170501
	//&end_date=20170831
	var before = curr_spectrum_layer1.getAttribute('text').split("_")[0]
	var after = curr_spectrum_layer2.getAttribute('text').split("_")[0]
	var date = "&start_date=" + before +
			   "&end_date=" + after

	//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/searcharchiveexport?satellite_band=1,2,3,4&start_date=20170501&end_date=20170831&lefttop_x=121.03157043457031&rightbottom_x=121.19430541992188&lefttop_y=22.816061209792952&rightbottom_y=22.72299043351299
	// check the size of selected area
	if ( spec_area / 1000000 <= spectrum_area_up_limit && spec_area / 1000000 > spectrum_area_down_limit ) {
		spec_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/searcharchiveexport?" + satellite_band + date + spectrum_region
	} else if ( spec_area / 1000000 > spectrum_area_up_limit ) {
		spec_url = "over";
	} else if ( spec_area / 1000000 < spectrum_area_down_limit ) {
		//spec_url = "under";
	} else if ( spectrum_region == "" ) {
		spec_url = "";
	}
	// check the order (left < right)
	if ( before === after ) {
		spec_url = "same"
	} else if ( parseInt(before) > parseInt(after) ) {
		spec_url = "bigB"
	}
	if(curr_spectrum_layer1_ind-curr_spectrum_layer2_ind>5){
		spec_url = "range_limit"
	}
	console.log("send url : " + spec_url)
	if ( spec_url != "under" && spec_url != "over" && spec_url != "same" && spec_url != "bigB"&& spec_url != "range_limit"  && spec_url != "" ) {
		
		btn_disable();
		
		loading_id = "l"+spec_num.toString();
		draw_w9_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
		draw_w9_Tree.enableCheckBoxes(false, false);
		
		//send data
		$.ajax({
			type: 	"GET",
			url:	"php/get_spectrum.php",
			dataType:	"json",
			data: {
				u: spec_url
			},
			//jsonpCallback: 'callback',
			success: function(json) {
				console.log("result : " + json.images)
				
				if ( json.result != false ) {
					
					spec_kml_link_arr.push(json.kmlFilePath);
					
					spec_num = spec_num + 1;
							
					new_node_id = avg_lat + ";" + avg_lng + ";563426;8;#FFFF00;;;;;@Kml@" + json.kmlFilePath;

					draw_w9_Tree.enableCheckBoxes(true, true);
						
					// layer item
					draw_w9_Tree.insertNewChild("0", new_node_id, "Spectrum-" + spec_num.toString() + "_" + before + "_" + after + "(展開點擊下載)"
												, function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					draw_w9_Tree.showItemCheckbox(new_node_id, false);
					// download item
					draw_w9_Tree.insertNewItem(new_node_id, "sk" + spec_num.toString(), "下載 .zip 檔", 
												function(){ 
													var idn = this.id.split("sk");
													document.getElementById("download_iframe").src = spec_kml_link_arr[idn[1] - 1];
												}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					draw_w9_Tree.showItemCheckbox("sk" + spec_num.toString(), false);

					// Download button Default : closed
					draw_w9_Tree.closeItem(new_node_id);
				} else {
					alert("回傳檔案發生問題");
				}
				// delete loading signal
				draw_w9_Tree.deleteItem(loading_id, false);
				
				btn_enable();
			},
			error: function(jqXHR) {
				console.log("error")
				alert("發生不明錯誤或尚未選擇區域")
				draw_w9_Tree.deleteItem(loading_id, false);
				btn_enable();
			}
		});
	} else if ( spec_url == "over" ) {
		alert("請選取範圍小於 " + spectrum_area_up_limit + " 平方公里範圍進行分析!")
		clear_spectrum_region();
	} else if ( spec_url == "under" ) {
		alert("請選取範圍大於 " + spectrum_area_down_limit + " 平方公里範圍進行分析!")
		clear_spectrum_region();
	} else if ( spec_url == "same" ) {
		alert("無法比對相同日期影像")
		clear_spectrum_region();
	} else if ( spec_url == "bigB" ) {
		alert("日期順序錯誤")
		clear_spectrum_region();
	} else if ( spec_url == "range_limit" ) {
		alert("日期區間請選擇一個月內")
		clear_spectrum_region();
	}else {
		alert("尚未設定選擇區域")
		clear_spectrum_region();
	}
}
//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/searcharchiveexport?
//satellite_band=1,2,3,4
//&start_date=20170501
//&end_date=20170831
//&lefttop_x=121.03157043457031
//&rightbottom_x=121.19430541992188
//&lefttop_y=22.816061209792952
//&rightbottom_y=22.72299043351299


//{
//	"result":{
//		"images":"http:\/\/storage.geodac.tw\/Compute\/GEONET_Search_Archive_Export\/20191119105640_5dd359e86972a\/5dd359e86972a.zip"
//	}
//}

//{
//	"result":"http:\/\/storage.geodac.tw\/Compute\/ElsaDsCdS2\/Sentinel2_20190411_20191107_20191119211601.kml"
//}

//{
//	"result":"http:\/\/storage.geodac.tw\/Compute\/ElsaDsCdS2\/Sentinel2_20190411_20191107_20191119175807.kml",
//	"kmlFilePath":"storage\/temp_sentinel\/Sentinel2_20190411_20191107_20191119175807.kml"
//}

//{
//	"imageURL":"https:\/\/dtm.moi.gov.tw\/services\/hillshade\/WMSImages\/a871b9e9-aa20-4cd8-b33b-da8d642d65a5.png",
//	"worldFileURL":"https:\/\/dtm.moi.gov.tw\/services\/hillshade\/ImageFile\/a871b9e9-aa20-4cd8-b33b-da8d642d65a5.pgw",
//	"kmz":
//		{
//			"url":"https:\/\/dtm.moi.gov.tw\/services\/hillshade\/ImageFile\/5b0f05f1-680e-4efa-8c4a-9f1dfa3528fe.kmz"
//		},
//	"bbox":"121.261597,23.687918,121.301422,23.726898",
//	"legendGraphURL":"https:\/\/dtm.moi.gov.tw\/services\/hillshade\/ImageFile\/LegendGraph\/LegendGraph.png",
//	"legendDescription":"\u5716\u4f8b\u8aaa\u660e",
//	"getData":true,
//	"imgFilePath":"storage\/temp_LandAPI\/a871b9e9-aa20-4cd8-b33b-da8d642d65a5.png",
//	"legendFilePath":"storage\/temp_LandAPI\/legend1.png",
//	"LegendImgWidth":1008,
//	"LegendImgHeight":449,
//	"imageWidth":800,
//	"imageHeight":783
//}
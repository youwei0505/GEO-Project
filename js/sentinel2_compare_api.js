/*
 *  Sentinel-2兩期影像變異比對
 */
var sentinel2_compare_arr = []
var curr_sentinel_layer1;
var curr_sentinel_layer2;

var sentinel2_compare_source1;
var sentinel2_compare_vector1;
var sentinel2_compare_source2;
var sentinel2_compare_vector2;

var sentinel2_compare_region;

//var tou_icon_source;
//var tou_icon_box;
//var tou_loc;
var sen_modifyInteraction;

var c_avg_lat = 0;
var c_avg_lng = 0;

// 選取範圍上下限
var compare_area_up_limit = 50.0;  
var compare_area_down_limit = 4.0;

var c_sen_url;
var sentinel2_compare_area;

// 1.取得衛星影像並加到下拉式選單
$(document).ready(function () {
	
	// php/BL_A01_T02.php
	$.ajax({
		type: 	"GET",
		url:	"php/BL_A01_T02.php",
		dataType:	"xml",
		//jsonpCallback: 'callback',
		success: function(xml) {
			sentinel2_compare_arr = $(xml).children().children()
			// add to list
			for (var i = 0; i < $(xml).children().children().length; i++) {
				var str = $(xml).children().children()[i].getAttribute('text')

				// add to left
				var o1 = new Option(str, str);
				$(o1).html(str)
				$("#sentinel2_compare_list1").append(o1);

				// add to right
				var o2 = new Option(str, str);
				$(o2).html(str)
				$("#sentinel2_compare_list2").append(o2);
				//console.log($(xml).children().children()[i].getAttribute('id'))
			}
			// set the default layer
			curr_sentinel_layer1 = sentinel2_compare_arr[0]
			$("#sentinel2_compare_list1").on("change", sentinel2_compare_onchange1);
			curr_sentinel_layer2 = sentinel2_compare_arr[0]
			$("#sentinel2_compare_list2").on("change", sentinel2_compare_onchange2);
		},
		error: function(jqXHR) {
			$("#sentinel_compare_block").css("display","none");
		}
	});

	if ( !$('#sentinel_compare_checked').is(":checked") ) {
		$("#sentinel_polyCompare_button").off('click');
	} else {
		$("#sentinel_polyCompare_button").on('click', function(e){Sentinel2_compare_getPoly()});
	}

	c_sen_url = "";
	sentinel2_compare_area = 0;
});
// 2.清除原本的衛星影像圖層
function clear_sentinel2_compare(map)
{
	
	$("#sentinel_polyCompare_button").off('click');
	c_sen_url = "";
	// 左視窗
	if (map == "left" ) {
		if (sentinel2_compare_vector1) {
			maps[map_ind].removeLayer(sentinel2_compare_vector1);
			sentinel2_compare_vector1 = "";
			sentinel2_compare_source1 = "";
			//maps[map_ind].addLayer(sentinel2_compare_vector);
		}
	}
	// 右視窗
	else if ( map == "right" ) {
		if (sentinel2_compare_vector2) {
			maps[map_ind ^ 0x1].removeLayer(sentinel2_compare_vector2);
			sentinel2_compare_vector2 = "";
			sentinel2_compare_source2 = "";		
		}
	}
}
// 3.清除所選的區域
function clear_sentinel2_compare_region()
{
	sentinel2_compare_area = 0
	c_sen_url = ""
	sentinel2_compare_region = ""
	clear_map()
}
// 4.更改左圖層選擇的選項時改變左視窗要顯示的衛星影像
function sentinel2_compare_onchange1()
{
	for (var i = 0; i < sentinel2_compare_arr.length; i++) {
		if ( sentinel2_compare_arr[i].getAttribute('text') === $("#sentinel2_compare_list1").val() ) {
			curr_sentinel_layer1 = sentinel2_compare_arr[i]
		}
	}
	
	c_sen_url = "";

	if ( $('#sentinel_compare_checked').is(":checked") ) {
		clear_sentinel2_compare("left")
		set_sentinel2_compare("left")
	}
}
// 5.更改右圖層選擇的選項時改變右視窗要顯示的衛星影像
function sentinel2_compare_onchange2()
{
	for (var i = 0; i < sentinel2_compare_arr.length; i++) {
		if ( sentinel2_compare_arr[i].getAttribute('text') === $("#sentinel2_compare_list2").val() ) {
			curr_sentinel_layer2 = sentinel2_compare_arr[i]
		}
	}
	
	c_sen_url = "";

	if ( $('#sentinel_compare_checked').is(":checked") ) {		
		clear_sentinel2_compare("right")
		set_sentinel2_compare("right")
	}
}
// 6.顯示衛星影像
function set_sentinel2_compare(map)
{
	if ( map === "left" ) {
		$("#sentinel_polyCompare_button").on('click', function(e){Sentinel2_getComparePoly()});
		
		//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016

		let curr_layer = JSON.parse(curr_sentinel_layer1.getAttribute('id'));
			
		sentinel2_compare_source1 = new ol.source.TileImage({
			tileUrlFunction: function(tileCoord){

				var z = tileCoord[0];
				var x = tileCoord[1]-1;
				var y = -tileCoord[2]-1;					
				return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
			},
			crossOrigin:'anonymous'
		})
		
		sentinel2_compare_vector1 = new ol.layer.Tile({
			source: sentinel2_compare_source1
		});
		
		sentinel2_compare_vector1.setZIndex(1);
		
		maps[map_ind].addLayer(sentinel2_compare_vector1);
	} else if ( map === "right" ) {
		$("#sentinel_polyCompare_button").on('click', function(e){Sentinel2_getComparePoly()});
		
		//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016

		let curr_layer = JSON.parse(curr_sentinel_layer2.getAttribute('id'));
			
		sentinel2_compare_source2 = new ol.source.TileImage({
			tileUrlFunction: function(tileCoord){

				var z = tileCoord[0];
				var x = tileCoord[1]-1;
				var y = -tileCoord[2]-1;					
				return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
			},
			crossOrigin:'anonymous'
		})
		
		sentinel2_compare_vector2 = new ol.layer.Tile({
			source: sentinel2_compare_source2
		});
		
		sentinel2_compare_vector2.setZIndex(1);
		
		maps[map_ind ^ 0x1].addLayer(sentinel2_compare_vector2);
	}
}
// 7.畫出選取範圍
function Sentinel2_getComparePoly(){
	document.getElementById("space_lonlat").checked = true;
	
	clear_sentinel2_compare_region();
 
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
	value = 'Polygon';
    var maxPoints;
	draw_box = new ol.interaction.Draw({
		source: source_box,
		type: /** @type {ol.geom.GeometryType} */ (value),
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
			sentinel2_compare_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
			
			measureTooltipElement.innerHTML = output;
			measureTooltip.setPosition(tooltipCoord);
		});
	}, this);

	// listener for the end of drawing
	draw_box.on('drawend',
        function (e) {
        	clear_map();
			
			//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsasd?
			//date=20180526&
			//sentinel2_compare_region=120.7258760671514%2C24.11023190418376%3B120.7425065966939%2C24.07755520679549%3B120.7972651666654%2C24.07795616672053%3B120.8060511576072%2C24.11258739313845%3B120.7931073286575%2C24.12840319631653%3B120.7602521139275%2C24.13013827730786%3B120.7258760671514%2C24.11023190418376
				
			coor = e.feature.getGeometry().getCoordinates()[0];
			
			//var before = curr_sentinel_layer1.getAttribute('text').split("_")[0]
			//var after = curr_sentinel_layer2.getAttribute('text').split("_")[0]
			//var date = "before=" + before
			//date = date + "&after=" + after
			
			sentinel2_compare_region = "&region="
			/*
			up = 0;
			down = 1000;
			left = 1000;
			right = 0;
			*/
			
			var coor_00;  // start point
			
			for (var i = 0 ; i < coor.length; i++)
			{
				// convert the coordinate
				var coor_84 = ol.proj.transform([coor[i][0],coor[i][1]], 'EPSG:3857', 'EPSG:4326');
				
				if (i == 0)  // start point
					coor_00 = coor_84;

				sentinel2_compare_region = sentinel2_compare_region + coor_84[0] + "," + coor_84[1] + ";";
				
				c_avg_lng = c_avg_lng + coor_84[0]
				c_avg_lat = c_avg_lat + coor_84[1]
				
				/*
				if (coor_84[0] > right)
					right = coor_84[0];
				if (coor_84[0] < left)
					left = coor_84[0];
				if (coor_84[1] > up)
					up = coor_84[1];
				if (coor_84[1] < down)
					down = coor_84[1];
				*/
			}
			
			c_avg_lat /= coor.length
			c_avg_lng /= coor.length
			
			sentinel2_compare_region = sentinel2_compare_region + coor_00[0] + "," + coor_00[1];
			
			/* check the size of the selected area
			if ( sentinel2_compare_area / 1000000 <= compare_area_up_limit ) {
				c_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?" + date + sentinel2_compare_region
			} else {
				c_sen_url = "over";
			}
			// check the order of left and right 
			if ( before === after ) {
				c_sen_url = "same"
			} else if ( parseInt(before) > parseInt(after) ) {
				c_sen_url = "bigB"
			}
			*/
			
			maps[map_ind].removeInteraction(draw_box);
			
			btn_enable();
			
        }, this);
	  //Layer_Grid_Oncheck(ch_lay_root_name,ch_id,0,document.getElementById(ch_id).checked);
 }
// 8.傳送資料給後端抓取圖片
function Sentinel2_getCompareKml()
{
	// false
	//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20180401&after=20180416&sentinel2_compare_region=121.05791856764648%2C23.472071219430262%3B121.06381455922852%2C23.47116986237836%3B121.05944715805664%2C23.468666060484367%3B121.05791856764648%2C23.472071219430262%3B121.05791856764648%2C23.472071219430262
	//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20180401%26after=20180426%26region=121.21850967407228%2C23.731985247786838%3B121.23606204986574%2C23.72821370461088%3B121.22009754180908%2C23.713558652272837%3B121.21850967407228%2C23.731985247786838%3B121.21850967407228%2C23.731985247786838
	// good
	//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20170720&after=20180215&sentinel2_compare_region=120.8567532193329,23.44596794215077;120.8544248505181,23.44398906434632;120.8571331157023,23.43952378142274;120.8568156585571,23.42394034620056;120.8645144837861,23.41276606561682;120.8808192243636,23.41144157211883;120.8991404716364,23.40942189935453;120.9184096891597,23.41383678688257;120.9135910841748,23.42499799183454;120.9053071990364,23.43399841091956;120.9095216000687,23.43628025052095;120.9099051855738,23.4379326384103;120.9102833774821,23.443878444641;120.8990782494477,23.44899108355424;120.8796324875291,23.44922327790944;120.8782378022941,23.44467160253231;120.8688457630732,23.44387630455463;120.8606020017506,23.44685268235575;120.8567532193329,23.44596794215077
	
	var before = curr_sentinel_layer1.getAttribute('text').split("_")[0]
	var after = curr_sentinel_layer2.getAttribute('text').split("_")[0]
	var date = "before=" + before
	date = date + "&after=" + after
	// check the size of selected area
	if ( sentinel2_compare_area / 1000000 <= compare_area_up_limit && sentinel2_compare_area / 1000000 >= compare_area_down_limit ) {
		//c_sen_url = "https://apis.geodac.tw:31343/geoinfo_api/api/geodac/compute/elsadscd?" + date + sentinel2_compare_region
		c_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?" + date + sentinel2_compare_region
		//before=20170720&after=20180215&region=120.8567532193329,23.44596794215077;120.8544248505181,23.44398906434632;120.8571331157023,23.43952378142274;120.8568156585571,23.42394034620056;120.8645144837861,23.41276606561682;120.8808192243636,23.41144157211883;120.8991404716364,23.40942189935453;120.9184096891597,23.41383678688257;120.9135910841748,23.42499799183454;120.9053071990364,23.43399841091956;120.9095216000687,23.43628025052095;120.9099051855738,23.4379326384103;120.9102833774821,23.443878444641;120.8990782494477,23.44899108355424;120.8796324875291,23.44922327790944;120.8782378022941,23.44467160253231;120.8688457630732,23.44387630455463;120.8606020017506,23.44685268235575;120.8567532193329,23.44596794215077";
		//c_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?" + date + sentinel2_compare_region
	} else if ( sentinel2_compare_area / 1000000 > compare_area_up_limit ) {
		c_sen_url = "over";
	} else if ( sentinel2_compare_area / 1000000 < compare_area_down_limit ) {
		c_sen_url = "under";
	} else if ( sentinel2_compare_region == "" ) {
		c_sen_url = "";
	}
	// check the order (left < right)
	if ( before === after ) {
		c_sen_url = "same"
	} else if ( parseInt(before) > parseInt(after) ) {
		c_sen_url = "bigB"
	}

	console.log(c_sen_url)
	
	if ( c_sen_url != "under" && c_sen_url != "over" && c_sen_url != "same" && c_sen_url != "bigB" && c_sen_url != "" ) {
		
		btn_disable();
		
		loading_id = "l"+sentinel2_compare_num.toString();		
		draw_w7_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');		
		draw_w7_Tree.enableCheckBoxes(false, false);
		// send the data
		$.ajax({
			type: 	"GET",
			url:	"php/get_elsadscd.php",
			dataType:	"json",
			data: {
				u: c_sen_url
			},
			//jsonpCallback: 'callback',
			success: function(json) {
				console.log(json.result)				
				if ( json.result != false ) {
					console.log(json.diskmlFilePath);
					
					tmp_compare_kml_arr = [];
					tmp_compare_kml_arr.push(json.diskmlFilePath);
					tmp_compare_kml_arr.push(json.newkmlFilePath);
					console.log("tmp_arr : " + tmp_compare_kml_arr);
					sentinel2_compare_kml_link_arr.push(tmp_compare_kml_arr);

					sentinel2_compare_num = sentinel2_compare_num + 1;
							
					new_node_id_dis = `{
						"PosInfo":"${c_avg_lat + ";" + c_avg_lng + ";563427;8;#FFFF00;;;;;"}",
						"Type":"Kml",
						"Url":"${json.diskmlFilePath}",
						"ID":"Sentinel2_Compare${sentinel2_compare_num.toString()+"dis"}",
						"FileName":"Sentinel2_Compare-${sentinel2_compare_num.toString()}_${before}_${after}_Disappear"
					}`.replace(/\n|\t/g, "").trim();
					
					
					new_node_id_new = `{
						"PosInfo":"${c_avg_lat + ";" + c_avg_lng + ";563426;8;#FFFF00;;;;;"}",
						"Type":"Kml",
						"Url":"${json.newkmlFilePath}",
						"ID":"Sentinel2_Compare${sentinel2_compare_num.toString()+"new"}",
						"FileName":"Sentinel2_Compare-${sentinel2_compare_num.toString()}_${before}_${after}_New"
					}`.replace(/\n|\t/g, "").trim();
					
					
					draw_w7_Tree.enableCheckBoxes(true, true);
						
					// layer item (Disappear)
					var TotalArea=0;
					var xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
							TotalArea=xmlread_Function(this);//從kml取得總面積	
					draw_w7_Tree.insertNewChild("0", new_node_id_dis, "Sentinel2_Compare-" + sentinel2_compare_num.toString() + "_" + before + "_" + after + "_Disappear_"+TotalArea , function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					// add download item	
					draw_w7_Tree.insertNewItem(new_node_id_dis, "skc_dis" + sentinel2_compare_num.toString(), "下載 .kml 檔", 
												function(){ 
													var idn = this.id.split("skc_dis");
													document.getElementById("download_iframe").src = sentinel2_compare_kml_link_arr[idn[1] - 1][0];
												}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					draw_w7_Tree.showItemCheckbox("skc_dis" + sentinel2_compare_num.toString(), false);
					};
					}
					xhttp.open("GET", json.diskmlFilePath, true);
					xhttp.send();
					
					// layer item (New)
					var TotalArea=0;
					var xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
							TotalArea=xmlread_Function(this);//從kml取得總面積	
					draw_w7_Tree.insertNewChild("0", new_node_id_new, "Sentinel2_Compare-" + sentinel2_compare_num.toString() + "_" + before + "_" + after + "_New_"+TotalArea  , function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					// add download item 
					draw_w7_Tree.insertNewItem(new_node_id_new, "skc_new" + sentinel2_compare_num.toString(), "下載 .kml 檔", 
												function(){ 
													var idn = this.id.split("skc_new");
													document.getElementById("download_iframe").src = sentinel2_compare_kml_link_arr[idn[1] - 1][1];
												}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					draw_w7_Tree.showItemCheckbox("skc_new" + sentinel2_compare_num.toString(), false);
					};
					}
					xhttp.open("GET", json.newkmlFilePath, true);
					xhttp.send();
					// Download button Default : closed
					draw_w7_Tree.closeItem(new_node_id_dis);
					draw_w7_Tree.closeItem(new_node_id_new);
				} else {
					alert("回傳檔案發生問題、框選範圍包含海域或雲覆區域太多的部分，請重新框選分析範圍!");
				}
				// delete loading signal
				draw_w7_Tree.deleteItem(loading_id, false);
				
				btn_enable();
			},
			error: function(jqXHR) {
				console.log("error")
				alert("發生不明錯誤")
				draw_w7_Tree.deleteItem(loading_id, false);
				btn_enable();
			}
		});
	} else if ( c_sen_url == "over" ) {
		alert("請選取範圍小於 " + compare_area_up_limit + " 平方公里範圍進行分析!")
		clear_sentinel2_compare_region();
	} else if ( c_sen_url == "under" ) {
		alert("請選取範圍大於 " + compare_area_down_limit + " 平方公里範圍進行分析!")
		clear_sentinel2_compare_region();
	} else if ( c_sen_url == "same" ) {
		alert("無法比對相同日期影像")
		clear_sentinel2_compare_region();
	} else if ( c_sen_url == "bigB" ) {
		alert("日期順序錯誤")
		clear_sentinel2_compare_region();
	} else {
		alert("尚未設定選擇區域")
		clear_sentinel2_compare_region();
	}
}
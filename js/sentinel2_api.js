/*
 *  Sentinel-2單期影像數化分析
 */
var sentinel2_arr = []
var curr_sentinel_layer;

var sentinel2_source;
var sentinel2_vector;
var sentinel2_region = "";
//var tou_icon_source;
//var tou_icon_box;
//var tou_loc;
var sen_modifyInteraction;

var avg_lat = 0;
var avg_lng = 0;

//選取範圍上限
var area_limit = 50.0;

var sen_url = "";
var sentinel2_area;

// 1.取得衛星影像並加到下拉式選單
$(document).ready(function () {

	// php/BL_A01_T02.php
	$.ajax({
		type: "GET",
		url: "php/BL_A01_T02.php",
		dataType: "xml",
		//jsonpCallback: 'callback',
		success: function (xml) {
			sentinel2_arr = $(xml).children().children()
			// add to list
			for (var i = 0; i < $(xml).children().children().length; i++) {
				var str = $(xml).children().children()[i].getAttribute('text')
				var o = new Option(str, str);
				$(o).html(str)
				$("#sentinel2_list").append(o);
				//console.log($(xml).children().children()[i].getAttribute('id'))
			}
			// set the default layer
			curr_sentinel_layer = sentinel2_arr[0]
			// add the event 'change', change the image when the selection change
			$("#sentinel2_list").on("change", sentinel2_onchange);
		},
		error: function (jqXHR) {
			$("#sentinel_block").css("display", "none");
		}
	});

	if (!$('#sentinel_checked').is(":checked")) {
		
		$("#sentinel_poly_button").off('click');
	} else {
		$("#sentinel_poly_button").on('click', function (e) { Sentinel2_getPoly() });
	}

	sen_url = "";
	sentinel2_area = 10000000000;
});
// 2.清除原本的衛星影像圖層
function clear_sentinel2() {
	$("#sentinel_poly_button").off('click');
	sen_url = "";

	if (sentinel2_vector) {
		maps[map_ind].removeLayer(sentinel2_vector);
		sentinel2_vector = "";
		sentinel2_source = "";
		//maps[map_ind].addLayer(sentinel2_vector);
	}
}
// 3.清除所選的區域
function clear_sentinel2_region() {
	sentinel2_area = 10000000000;
	sen_url = ""
	sentinel2_region = ""
	clear_map()
}
// 4.更改選擇的選項時改變要顯示的衛星影像
function sentinel2_onchange() {
	for (var i = 0; i < sentinel2_arr.length; i++) {
		if (sentinel2_arr[i].getAttribute('text') === $("#sentinel2_list").val()) {
			
			curr_sentinel_layer = sentinel2_arr[i]
		}
	}

	sen_url = "";

	if ($('#sentinel_checked').is(":checked")) {

		clear_sentinel2()
		set_sentinel2()
	}
}
// 5.顯示衛星影像
function set_sentinel2() {
	$("#sentinel_poly_button").on('click', function (e) { Sentinel2_getPoly() });

	//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016

	let curr_layer = JSON.parse(curr_sentinel_layer.getAttribute('id'))

	sentinel2_source = new ol.source.TileImage({
		tileUrlFunction: function (tileCoord) {

			var z = tileCoord[0];
			var x = tileCoord[1] - 1;
			var y = -tileCoord[2] - 1;
			return curr_layer.Url + z + '/' + y + '/' + x + '.jpg';
		},
		crossOrigin: 'anonymous'
	})

	sentinel2_vector = new ol.layer.Tile({
		source: sentinel2_source
	});

	sentinel2_vector.setZIndex(1);

	maps[map_ind].addLayer(sentinel2_vector);


}
// 6.畫出選取範圍
function Sentinel2_getPoly() {
	document.getElementById("space_lonlat").checked = true;

	clear_sentinel2_region(); // clear the selected region

	createMeasureTooltip();

	// create box
	source_box = new ol.source.Vector({ wrapX: false });
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
				sentinel2_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));

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
			//sentinel2_region=120.7258760671514%2C24.11023190418376%3B120.7425065966939%2C24.07755520679549%3B120.7972651666654%2C24.07795616672053%3B120.8060511576072%2C24.11258739313845%3B120.7931073286575%2C24.12840319631653%3B120.7602521139275%2C24.13013827730786%3B120.7258760671514%2C24.11023190418376

			coor = e.feature.getGeometry().getCoordinates()[0];

			//date = "date=" + curr_sentinel_layer.getAttribute('text').split("_")[0]
			sentinel2_region = "&region="
			/*
			up = 0;
			down = 1000;
			left = 1000;
			right = 0;
			*/

			var coor_00;  // start point

			for (var i = 0; i < coor.length; i++) {
				// convert the coordinate
				var coor_84 = ol.proj.transform([coor[i][0], coor[i][1]], 'EPSG:3857', 'EPSG:4326');

				if (i == 0)  // start point
					coor_00 = coor_84;

				sentinel2_region = sentinel2_region + coor_84[0] + "%2C" + coor_84[1] + "%3B";

				avg_lng = avg_lng + coor_84[0]
				avg_lat = avg_lat + coor_84[1]
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
			avg_lat /= coor.length
			avg_lng /= coor.length

			sentinel2_region = sentinel2_region + coor_00[0] + "%2C" + coor_00[1];

			maps[map_ind].removeInteraction(draw_box);

			btn_enable();

		}, this);
	//Layer_Grid_Oncheck(ch_lay_root_name,ch_id,0,document.getElementById(ch_id).checked);
}
// 7.傳送資料給後端抓取圖片
function Sentinel2_getKml() {
    fun_access_log("Func_Use_Analysis_1_1");
	var date = "date=" + curr_sentinel_layer.getAttribute('text').split("_")[0]

	if (sentinel2_area / 1000000 <= area_limit) {
		sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsasd?" + date + sentinel2_region
	} else if (sentinel2_region == "") {
		sen_url = "";
	} else {
		sen_url = "over";
	}

	if (sen_url != "over" && sen_url != "") {
		console.log(sen_url);
		btn_disable();

		loading_id = "l" + sentinel2_num.toString();
		draw_w6_Tree.insertNewItem("0", loading_id, "loading...", function () { }, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
		draw_w6_Tree.enableCheckBoxes(false, false);

		//send data
		$.ajax({
			type: "GET",
			url: "php/get_elsasd.php",
			dataType: "json",
			data: {
				u: sen_url
			},
			//jsonpCallback: 'callback',
			success: function (json) {
				console.log(json.result)
				if (json.result != false) {
				var TotalArea=0;
			    var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
							TotalArea=xmlread_Function(this);//從kml取得總面積					
				
							sentinel2_kml_link_arr.push(json.kmlFilePath);
							sentinel2_num = sentinel2_num + 1;
							new_node_id =  `{
								"PosInfo":"${avg_lat + ";" + avg_lng + ";563426;8;#FFFF00;;;;;"}",
								"Type":"Kml",
								"Url":"${json.kmlFilePath}",
								"ID":"Sentinel2${sentinel2_num.toString()}",
								"FileName":"Sentinel2-${sentinel2_num.toString()}_${curr_sentinel_layer.getAttribute('text').split("_")[0]}"
							}`.replace(/\n|\t/g, "").trim();
							
							
							draw_w6_Tree.enableCheckBoxes(true, true);

							// layer item
							draw_w6_Tree.insertNewChild("0", new_node_id, "Sentinel2-" + sentinel2_num.toString() + "_" + curr_sentinel_layer.getAttribute('text').split("_")[0]
								+"_"+TotalArea, function () { }, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
							// download item
							draw_w6_Tree.insertNewItem(new_node_id, "sk" + sentinel2_num.toString(), "下載 .kml 檔",
								function () {
									var idn = this.id.split("sk");
									document.getElementById("download_iframe").src = sentinel2_kml_link_arr[idn[1] - 1];
								}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
							draw_w6_Tree.showItemCheckbox("sk" + sentinel2_num.toString(), false);

							// Download button Default : closed
							draw_w6_Tree.closeItem(new_node_id);
						};
					}
					xhttp.open("GET", json.kmlFilePath, true);
					xhttp.send();
					
				} else {
					alert("回傳檔案發生問題");
				}
				// delete loading signal
				draw_w6_Tree.deleteItem(loading_id, false);

				btn_enable();
				
			
			},
			error: function (jqXHR) {
				console.log("error")
				alert("發生不明錯誤")
				draw_w6_Tree.deleteItem(loading_id, false);
				btn_enable();
			}
		});
	} else if (sen_url == "over") {
		alert("選取範圍請小於 50 平方公里")
		clear_sentinel2_region();
	} else {
		alert("尚未設定選擇區域")
		clear_sentinel2_region();
	}
}
function xmlread_Function(xml) {
    var xmlDoc = xml.responseXML;
	if(xmlDoc!=null){
	 x=xmlDoc.getElementsByTagName('name')[xmlDoc.getElementsByTagName('name').length-1];
	y=x.childNodes[0].nodeValue;
	}else{
		y="";
	}
	
	return y;

}

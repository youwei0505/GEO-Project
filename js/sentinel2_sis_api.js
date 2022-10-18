//  Sentinel-2頻譜指標分析
var sentinel2_sis_arr = []
var curr_sis_sentinel_layer;
var curr_sis_sentinel_layer1;
var curr_sis_sentinel_layer2;

var sentinel2_sis_source;
var sentinel2_sis_vector;
var sentinel2_sis_source1;
var sentinel2_sis_vector1;
var sentinel2_sis_source2;
var sentinel2_sis_vector2;

var sentinel2_sis_region = "";

//var tou_icon_source;
//var tou_icon_box;
//var tou_loc;
var sen_modifyInteraction;

var s_avg_lat = 0;
var s_avg_lng = 0;

//選取範圍上限
var area_limit = 50.0;  // not used ,1001 modified

var s_sen_url = "";
var sentinel2_sis_area;
var sis_up = 0;
var sis_down = 1000;
var sis_left = 1000;
var sis_right = 0;

// 1.取得衛星影像並加到下拉式選單
$(document).ready(function () {

	// php/BL_A01_T02.php
	$.ajax({
		type: 	"GET",
		url:	"php/BL_A01_T02.php",
		dataType:	"xml",
		//jsonpCallback: 'callback',
		success: function(xml) {
			sentinel2_sis_arr = $(xml).children().children()
			// add to list
			for (var i = 0; i < $(xml).children().children().length; i++) {
				var str = $(xml).children().children()[i].getAttribute('text')

				var o = new Option(str, str);
				$(o).html(str)
				$("#sentinel2_sis_list").append(o);
				//console.log($(xml).children().children()[i].getAttribute('id'))

				//***** Add for DNBR *****
				// add to left
				var o1 = new Option(str, str);
				$(o1).html(str)
				$("#sentinel2_sis_list1").append(o1);

				// add to right
				var o2 = new Option(str, str);
				$(o2).html(str)
				$("#sentinel2_sis_list2").append(o2);
				//***** Add for DNBR *****
			}
			// set the default layer
			curr_sis_sentinel_layer = sentinel2_sis_arr[0]
			// add the event 'change', change the image when the selection change
			$("#sentinel2_sis_list").on("change", sentinel2_sis_onchange);

			//***** Add for DNBR *****
			curr_sis_sentinel_layer1 = sentinel2_sis_arr[0]
			$("#sentinel2_sis_list1").on("change", sentinel2_sis_onchange1);
			curr_sis_sentinel_layer2 = sentinel2_sis_arr[0]
			$("#sentinel2_sis_list2").on("change", sentinel2_sis_onchange2);			
			//***** Add for DNBR *****
		},
		error: function(jqXHR) {
			$("#sentinel_sis_block").css("display","none");
		}
	});

	if ( !$('#sentinel_sis_checked').is(":checked") ) {
		$("#sentinel_polySis_button").off('click');
	} else {
		$("#sentinel_polySis_button").on('click', function(e){Sentinel2_sis_getPoly()});
	}
	
	s_sen_url = "";
	sentinel2_sis_area = 10000000000;	
});
// 2.清除原本的衛星影像圖層
function clear_sentinel2_sis(map)
{
	$("#sentinel_polySis_button").off('click');  // remove the event 'click' on the button
	s_sen_url = "";	
	
	//all
	if(map == "all")
	{
		if (sentinel2_sis_vector) {
			maps[map_ind].removeLayer(sentinel2_sis_vector);
			sentinel2_sis_vector = "";
			sentinel2_sis_source = "";
			//maps[map_ind].addLayer(sentinel2_compare_vector);
		}
	}
	//***** Add DNBR *****
	//left
	else if(map == "left")
	{
		if (sentinel2_sis_vector1) {
			maps[map_ind].removeLayer(sentinel2_sis_vector1);
			sentinel2_sis_vector1 = "";
			sentinel2_sis_source1 = "";
			//maps[map_ind].addLayer(sentinel2_compare_vector);
		}
	}
	//right
	else if(map == "right")
	{
		if (sentinel2_sis_vector2) {
			maps[map_ind ^ 0x1].removeLayer(sentinel2_sis_vector2);
			sentinel2_sis_vector2 = "";
			sentinel2_sis_source2 = "";
			//maps[map_ind].addLayer(sentinel2_compare_vector);
		}
	}
	//***** Add DNBR *****
}
// 3.清除所選的區域
function clear_sentinel2_sis_region()
{
	sentinel2_sis_area = 10000000000
	s_sen_url = ""
	sentinel2_sis_region = ""
	clear_map()
}

// 4.更改選擇的選項時改變要顯示的衛星影像
function sentinel2_sis_onchange()
{
	for (var i = 0; i < sentinel2_sis_arr.length; i++) {
		if ( sentinel2_sis_arr[i].getAttribute('text') === $("#sentinel2_sis_list").val() ) {
			curr_sis_sentinel_layer = sentinel2_sis_arr[i]
		}
	}

	s_sen_url = "";

	if ( $('#sentinel_sis_checked').is(":checked") ) {		
		clear_sentinel2_sis("all")
		set_sentinel2_sis("all")
	}
}
//***** Add for DNBR *****
// left
function sentinel2_sis_onchange1()
{
	for (var i = 0; i < sentinel2_sis_arr.length; i++) {
		if ( sentinel2_sis_arr[i].getAttribute('text') === $("#sentinel2_sis_list1").val() ) {
			curr_sis_sentinel_layer1 = sentinel2_sis_arr[i]
		}
	}

	s_sen_url = "";

	if ( $('#sentinel_sis_checked').is(":checked") ) {		
		clear_sentinel2_sis("left")
		set_sentinel2_sis("left")
	}
}
//right
function sentinel2_sis_onchange2()
{
	for (var i = 0; i < sentinel2_sis_arr.length; i++) {
		if ( sentinel2_sis_arr[i].getAttribute('text') === $("#sentinel2_sis_list2").val() ) {
			curr_sis_sentinel_layer2 = sentinel2_sis_arr[i]
		}
	}

	s_sen_url = "";

	if ( $('#sentinel_sis_checked').is(":checked") ) {		
		clear_sentinel2_sis("right")
		set_sentinel2_sis("right")
	}
}
//***** Add for DNBR *****

// 5.顯示衛星影像
function set_sentinel2_sis(map)
{
	if(map === "all") {
		// add event 'click' to the button
		$("#sentinel_polySis_button").on('click', function(e){Sentinel2_getSisPoly()});
		
		//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016
	
		let curr_layer = JSON.parse(curr_sis_sentinel_layer.getAttribute('id'));
			
		sentinel2_sis_source = new ol.source.TileImage({
			tileUrlFunction: function(tileCoord){
	
				var z = tileCoord[0];
				var x = tileCoord[1]-1;
				var y = -tileCoord[2]-1;
				return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
			},
			crossOrigin:'anonymous'
		})
		
		sentinel2_sis_vector = new ol.layer.Tile({
			source: sentinel2_sis_source
		});
		
		sentinel2_sis_vector.setZIndex(1);
		
		maps[map_ind].addLayer(sentinel2_sis_vector);
	} else if(map === "left") {
		$("#sentinel_polySis_button").on('click', function(e){Sentinel2_getSisPoly()});
		

		let curr_layer = JSON.parse(curr_sis_sentinel_layer1.getAttribute('id'));
			
		sentinel2_sis_source1 = new ol.source.TileImage({
			tileUrlFunction: function(tileCoord){

				var z = tileCoord[0];
				var x = tileCoord[1]-1;
				var y = -tileCoord[2]-1;					
				return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
			},
			crossOrigin:'anonymous'
		})
		
		sentinel2_sis_vector1 = new ol.layer.Tile({
			source: sentinel2_sis_source1
		});
		
		sentinel2_sis_vector1.setZIndex(1);
		
		maps[map_ind].addLayer(sentinel2_sis_vector1);		
	} else if(map === "right") {
		$("#sentinel_polySis_button").on('click', function(e){Sentinel2_getSisPoly()});
		

		let curr_layer = JSON.parse(curr_sis_sentinel_layer2.getAttribute('id'));
			
		sentinel2_sis_source2 = new ol.source.TileImage({
			tileUrlFunction: function(tileCoord){

				var z = tileCoord[0];
				var x = tileCoord[1]-1;
				var y = -tileCoord[2]-1;					
				return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
			},
			crossOrigin:'anonymous'
		})
		
		sentinel2_sis_vector2 = new ol.layer.Tile({
			source: sentinel2_sis_source2
		});
		
		sentinel2_sis_vector2.setZIndex(1);
		
		maps[map_ind ^ 0x1].addLayer(sentinel2_sis_vector2);		
	}
}
// 6.畫出選取範圍
function Sentinel2_getSisPoly(){
	document.getElementById("space_lonlat").checked = true;
	
	clear_sentinel2_sis_region(); // clear the selected region
 
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
	//value = 'Polygon';
    //var maxPoints;
	value = 'LineString';
	var maxPoints = 2
	
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
			var geom_t = (geom.clone().transform(sourceProj, 'EPSG:4326'));
			var coordinates = geom_t.getLinearRing(0).getCoordinates();
			sentinel2_sis_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));  // calculate the area after convert the coordinate
			
			measureTooltipElement.innerHTML = output;
			measureTooltip.setPosition(tooltipCoord);
		});		
	}, this);	
		
	// listener for the end of drawing
	draw_box.on('drawend',
        function (e) {
			clear_map();
		 
			createMeasureTooltip();
			//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsasd?
			//date=20180526&
			//sentinel2_sis_region=120.7258760671514%2C24.11023190418376%3B120.7425065966939%2C24.07755520679549%3B120.7972651666654%2C24.07795616672053%3B120.8060511576072%2C24.11258739313845%3B120.7931073286575%2C24.12840319631653%3B120.7602521139275%2C24.13013827730786%3B120.7258760671514%2C24.11023190418376
						
			box_array=(String(e.feature.getGeometry().getExtent())).split(",");  // return [minx, miny, maxx, maxy]
			//convert the coordinate
			loc_84=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');
			sis_left = loc_84[0];
			sis_up = loc_84[1];
			
			loc_84=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');
			sis_right = loc_84[0];
			sis_down = loc_84[1];
			
			//date = "date=" + curr_sis_sentinel_layer.getAttribute('text').split("_")[0]
			//spectral = "&spectral=" + $("#sentinel2_sis_spectral").val().toString()
			
			sentinel2_sis_region = "&region="			
			sentinel2_sis_region = sentinel2_sis_region + sis_left + "," + sis_up + ";" +
							  sis_right + "," + sis_up + ";" +
							  sis_right + "," + sis_down + ";" +
							  sis_left + "," + sis_down + ";" +
							  sis_left + "," + sis_up;
			
			s_avg_lat = (sis_left + sis_right) / 2
			s_avg_lng = (sis_up + sis_down) / 2

			/* check the size of the selected area 
			if ( sentinel2_sis_area / 1000000 <= area_limit ) {
				s_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/sis2?" + date + sentinel2_sis_region + spectral
			} else {
				s_sen_url = "over";
			}
			*/
			
			maps[map_ind].removeInteraction(draw_box);
			
			btn_enable();
			
        }, this);
	  //Layer_Grid_Oncheck(ch_lay_root_name,ch_id,0,document.getElementById(ch_id).checked);
 }
// 7.傳送資料給後端抓取圖片
function Sentinel2_getSisKml()
{
	// false
	//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20180401&after=20180416&sentinel2_sis_region=121.05791856764648%2C23.472071219430262%3B121.06381455922852%2C23.47116986237836%3B121.05944715805664%2C23.468666060484367%3B121.05791856764648%2C23.472071219430262%3B121.05791856764648%2C23.472071219430262
	//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20180401%26after=20180426%26region=121.21850967407228%2C23.731985247786838%3B121.23606204986574%2C23.72821370461088%3B121.22009754180908%2C23.713558652272837%3B121.21850967407228%2C23.731985247786838%3B121.21850967407228%2C23.731985247786838
	// good
	//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20170720&after=20180215&sentinel2_sis_region=120.8567532193329,23.44596794215077;120.8544248505181,23.44398906434632;120.8571331157023,23.43952378142274;120.8568156585571,23.42394034620056;120.8645144837861,23.41276606561682;120.8808192243636,23.41144157211883;120.8991404716364,23.40942189935453;120.9184096891597,23.41383678688257;120.9135910841748,23.42499799183454;120.9053071990364,23.43399841091956;120.9095216000687,23.43628025052095;120.9099051855738,23.4379326384103;120.9102833774821,23.443878444641;120.8990782494477,23.44899108355424;120.8796324875291,23.44922327790944;120.8782378022941,23.44467160253231;120.8688457630732,23.44387630455463;120.8606020017506,23.44685268235575;120.8567532193329,23.44596794215077
	var date = "date="
	var before = "date1="
	var after = "&date2="
	if($("#sentinel2_sis_spectral").val() == "DNBR")
	{
		var before = before + curr_sis_sentinel_layer1.getAttribute('text').split("_")[0]
		var after = after + curr_sis_sentinel_layer2.getAttribute('text').split("_")[0]
	}
	else
	{
		date = "date=" + curr_sis_sentinel_layer.getAttribute('text').split("_")[0]
	}

	var spectral = "&spectral=" + $("#sentinel2_sis_spectral").val().toString()
	// 20191001 add the area limit check
	if ( sentinel2_sis_region != "" ) {
		if ( sentinel2_sis_area / 1000000 <= area_limit ) {
			//s_sen_url = "https://apis.geodac.tw:31343/geoinfo_api/api/geodac/compute/sis2?" + date + sentinel2_sis_region + spectral;
			if($("#sentinel2_sis_spectral").val() == "DNBR")
			{
				s_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/sis2diff?type=Sentinel2&" + before + after + sentinel2_sis_region + spectral;
			}
			else
			{
				s_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/sis2?" + date + sentinel2_sis_region + spectral;
			}
			//date=20180215&region=120.89355468749997,23.843137735416278;120.96496582031246,23.843137735416278;120.96496582031246,23.797910674481983;120.89355468749997,23.797910674481983;120.89355468749997,23.843137735416278&spectral=NBR"
			//"https://compute.geodac.tw/geoinfo_api/api/geodac/compute/sis2?" + date + sentinel2_sis_region + spectral;
		} else {
			s_sen_url = "over";
		}
	} else if ( sentinel2_sis_region == "" ) {
		s_sen_url = "";
	}
	
	console.log(s_sen_url)
	
	if ( s_sen_url != "over" && s_sen_url != "" ) {
		
		btn_disable();
		
		loading_id = "l"+sentinel2_sis_num.toString();
		draw_w8_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
		draw_w8_Tree.enableCheckBoxes(false, false);
		
		//send data
		$.ajax({
			type: 	"GET",
			url:	"php/get_sis.php",
			dataType:	"json",
			data: {
				u: s_sen_url,
				n: sentinel2_sis_num,
				s: $("#sentinel2_sis_spectral").val()
			},
			//jsonpCallback: 'callback',
			success: function(json) {
				console.log(json.imgFilePath)
				console.log(json.kmlFilePath)
				if ( json.result != false ) {
				
					//***** Add for DNBR *****
					if ($("#sentinel2_sis_spectral").val() == "DNBR")
					{
						sentinel2_sis_kml_link_arr.push(json.kmlFilePath)
					}//***** Add for DNBR *****
					else
					{
						tmp_kml_link_arr = []
						tmp_kml_link_arr.push(json.kmlFilePath)
						tmp_kml_link_arr.push(json.kml1FilePath)
						tmp_kml_link_arr.push(json.kml2FilePath)
						tmp_kml_link_arr.push(json.kml3FilePath)
						tmp_kml_link_arr.push(json.kml4FilePath)
						tmp_kml_link_arr.push(json.kml5FilePath)
						sentinel2_sis_kml_link_arr.push(tmp_kml_link_arr);
					}

					sentinel2_sis_num = sentinel2_sis_num + 1;
							
					new_node_id = `{
						"PosInfo":"${s_avg_lat + ";" + 
									 s_avg_lng + ";563426;8;" + 
									 json.imageWidth.toString() + ";" + 
									 json.imageHeight.toString() + ";" +
									 sis_left.toString() + ";" + 
									 sis_down.toString() + ";" + 
									 sis_right.toString() + ";" + 
									 sis_up.toString()}",
						"Type":"ImageOverlay",
						"Url":"${json.imgFilePath}",
						"ID":"Sentinel2_sis2${sentinel2_sis_num.toString()}",
						"FileName":"Sentinel2_sis2-${sentinel2_sis_num.toString()}_${$("#sentinel2_sis_spectral").val().toString()}_${curr_sis_sentinel_layer.getAttribute('text').split("_")[0]}"
					}`.replace(/\n|\t/g, "").trim();				

					draw_w8_Tree.enableCheckBoxes(true, true);
						
					// layer item					
					draw_w8_Tree.insertNewChild("0", new_node_id, "Sentinel2_sis2-" + sentinel2_sis_num.toString() + "_" + $("#sentinel2_sis_spectral").val().toString() + "_" + curr_sis_sentinel_layer.getAttribute('text').split("_")[0]
												, function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');

					//create new node (legend)
					sis_legend_arr.push(json.legendFilePath);
					draw_w8_Tree.insertNewChild(new_node_id,"sis_legend" + sentinel2_sis_num.toString(),"開啟圖例", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					var legend_win = dhxWins.createWindow("sis_legwin"+sentinel2_sis_num.toString(),600,600,json.LegendImgWidth, (json.LegendImgHeight+200));
					legend_win.setText("");

					legend_win.attachEvent("onClose",function(win){
						var n = parseInt(this.getId().split("sis_legwin")[1])
						draw_w8_Tree.setCheck("sis_legend" + n.toString(), false);
						this.hide();
					});
					dhxWins.window("sis_legwin"+sentinel2_sis_num.toString()).button("minmax").hide();
					dhxWins.window("sis_legwin"+sentinel2_sis_num.toString()).button("park").hide();

					legend_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
								  "<div style='align: center; height:100%;width:100%;'>" + 
								  "<p style='text-align: center; font-size:8px;width:100%;' >頻譜指標" + sentinel2_sis_num.toString() + "</p>" + 
								  "<br><img src='" + json.legendFilePath + "' style='align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
					legend_win.attachHTMLString(legend_html)
					
					legend_win.hide()
					draw_w8_Tree.showItemCheckbox("sis_legwin"+sentinel2_sis_num.toString(), false);
					sis_legwin_arr.push(legend_win);

					// download item
					//***** Add for DNBR *****
					if($("#sentinel2_sis_spectral").val() == "DNBR")
					{
						draw_w8_Tree.insertNewItem(new_node_id, "ss" + sentinel2_sis_num.toString(), "下載分析成果 kmz 檔", 
													function(){ 
														var idn = this.id.split("ss");
														document.getElementById("download_iframe").src = sentinel2_sis_kml_link_arr[idn[1] - 1];
													}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
						draw_w8_Tree.showItemCheckbox("ss" + sentinel2_sis_num.toString(), false);
					}//***** Add for DNBR *****
					else
					{
						draw_w8_Tree.insertNewItem(new_node_id, "ss" + sentinel2_sis_num.toString(), "下載分析成果 kmz 檔", 
													function(){ 
														var idn = this.id.split("ss");
														document.getElementById("download_iframe").src = sentinel2_sis_kml_link_arr[idn[1] - 1][0];
													}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
						draw_w8_Tree.showItemCheckbox("ss" + sentinel2_sis_num.toString(), false);
						// download item 1											
						draw_w8_Tree.insertNewItem(new_node_id, "s1" + sentinel2_sis_num.toString(), "下載自適門檻1級區域範圍檔", 
													function(){ 
														var idn = this.id.split("s1");
														document.getElementById("download_iframe").src = sentinel2_sis_kml_link_arr[idn[1] - 1][1];
													}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
						draw_w8_Tree.showItemCheckbox("s1" + sentinel2_sis_num.toString(), false);
						// download item 2											
						draw_w8_Tree.insertNewItem(new_node_id, "s2" + sentinel2_sis_num.toString(), "下載自適門檻2級區域範圍檔", 
													function(){ 
														var idn = this.id.split("s2");
														document.getElementById("download_iframe").src = sentinel2_sis_kml_link_arr[idn[1] - 1][2];
													}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
						draw_w8_Tree.showItemCheckbox("s2" + sentinel2_sis_num.toString(), false);
						// download item 3											
						draw_w8_Tree.insertNewItem(new_node_id, "s3" + sentinel2_sis_num.toString(), "下載自適門檻3級區域範圍檔", 
													function(){ 
														var idn = this.id.split("s3");
														document.getElementById("download_iframe").src = sentinel2_sis_kml_link_arr[idn[1] - 1][3];
													}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
						draw_w8_Tree.showItemCheckbox("s3" + sentinel2_sis_num.toString(), false);
						// download item 4											
						draw_w8_Tree.insertNewItem(new_node_id, "s4" + sentinel2_sis_num.toString(), "下載自適門檻4級區域範圍檔", 
													function(){ 
														var idn = this.id.split("s4");
														document.getElementById("download_iframe").src = sentinel2_sis_kml_link_arr[idn[1] - 1][4];
													}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
						draw_w8_Tree.showItemCheckbox("s4" + sentinel2_sis_num.toString(), false);
						// download item 5											
						draw_w8_Tree.insertNewItem(new_node_id, "s5" + sentinel2_sis_num.toString(), "下載自適門檻5級區域範圍檔", 
													function(){ 
														var idn = this.id.split("s5");
														document.getElementById("download_iframe").src = sentinel2_sis_kml_link_arr[idn[1] - 1][5];
													}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
						draw_w8_Tree.showItemCheckbox("s5" + sentinel2_sis_num.toString(), false);
					}
					
					// Download button Default : closed					
					draw_w8_Tree.closeItem(new_node_id);
				} else {
					alert("回傳檔案發生問題");
				}
				// delete loading signal
				draw_w8_Tree.deleteItem(loading_id, false);
				
				btn_enable();
			},
			error: function(jqXHR) {
				console.log("error")
				alert("發生不明錯誤")
				draw_w8_Tree.deleteItem(loading_id, false);
				btn_enable();
			}
		});
	} else if ( s_sen_url == "over" ) {
		alert("選取範圍請小於 50 平方公里")
		clear_sentinel2_region();
	} else {
		alert("尚未設定選擇區域")
		clear_sentinel2_sis_region();
	}
}

//********************** add DNBR *********************
function DNBR_interface()
{
	if($("#sentinel2_sis_spectral").val() == 'DNBR')
	{
		document.getElementById("sentinel2_sis_list_field").style.display = "none";
		document.getElementById("sentinel2_sis_list_cmp_field").style.display = "inline";

			console.log("check : " + $('#sentinel_sis_checked').is(":checked") )
		if($('#sentinel_sis_checked').is(":checked"))
		{		
			clear_sentinel2_sis("left")
			clear_sentinel2_sis("right")
			clear_sentinel2_sis("all")
			set_sentinel2_sis("left")
			set_sentinel2_sis("right")
			map_win_double()
		}
		else
		{
			map_win_single()
			clear_sentinel2_sis("left")
			clear_sentinel2_sis("right")
			clear_sentinel2_sis("all")
		}
		

	}
	else
	{
		document.getElementById("sentinel2_sis_list_field").style.display = "inline";
		document.getElementById("sentinel2_sis_list_cmp_field").style.display = "none";

			console.log("check : " + $('#sentinel_sis_checked').is(":checked") )
		if($('#sentinel_sis_checked').is(":checked"))
		{
			clear_sentinel2_sis("left")
			clear_sentinel2_sis("right")
			clear_sentinel2_sis("all")
			set_sentinel2_sis("all")
			map_win_single()
		}
		else
		{
			map_win_single()			
			clear_sentinel2_sis("left")
			clear_sentinel2_sis("right")
			clear_sentinel2_sis("all")
		}
	}
}
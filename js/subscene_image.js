
			

				


var subscene_arr = []
var curr_subscene_layer1;
var curr_subscene_layer2;

var curr_subscene_layer1_ind=1;
var curr_subscene_layer2_ind=1;

var subscene_source1;
var subscene_vector1;
var subscene_source2;
var subscene_vector2;

var subscene_region;

//var tou_icon_source;
//var tou_icon_box;
//var tou_loc;

var subs_avg_lat = 0;
var subs_avg_lng = 0;

var subscene_area_up_limit = 10.0;
var subscene_area_down_limit = 0.0;

var subs_sen_url;
var subscene_area;

var subs_left;
var subs_right;
var subs_up;
var subs_down;

var subscene_year1;
var subscene_month1;
var subscene_day1;
var subscene_year2;
var subscene_month2;
var subscene_day2;

var subscene_start_x;
var subscene_start_y;
var subscene_end_x;
var subscene_end_y;


$(document).ready(function () {
	
	
	// default : Sentinel2
	
	$.ajax({
		type: 	"GET",
		url:	"php/BL_A01_T02.php",
		dataType:	"xml",
		//jsonpCallback: 'callback',
		success: function(xml) {
				
				
			subscene_arr = $(xml).children().children()
				
			for (var i = 0; i < $(xml).children().children().length; i++) {
				var str = $(xml).children().children()[i].getAttribute('text')
				var o1 = new Option(str, str);
				var o2 = new Option(str, str);
				subscene_year1 = str.substr(0, 4)
				subscene_month1 = str.substr(4, 2)
				subscene_day1 = str.substr(6, 2)
				subscene_year2 = str.substr(0, 4)
				subscene_month2 = str.substr(4, 2)
				subscene_day2 = str.substr(6, 2)
				$(o1).html(str)
				$(o2).html(str)
				$("#subscene_list1").append(o1);
				$("#subscene_list2").append(o2);
				//console.log($(xml).children().children()[i].getAttribute('id'))
			}
			
			curr_subscene_layer1 = subscene_arr[0]
			subscene_year1 = curr_subscene_layer1.getAttribute('text').substr(0, 4)
			subscene_month1 = curr_subscene_layer1.getAttribute('text').substr(4, 2)
			subscene_day1 = curr_subscene_layer1.getAttribute('text').substr(6, 2)
			$("#subscene_list1").on("change", subscene_onchange1);
			curr_subscene_layer2 = subscene_arr[0]
			subscene_year2 = curr_subscene_layer2.getAttribute('text').substr(0, 4)
			subscene_month2 = curr_subscene_layer2.getAttribute('text').substr(4, 2)
			subscene_day2 = curr_subscene_layer2.getAttribute('text').substr(6, 2)
			$("#subscene_list2").on("change", subscene_onchange2);
		},
		error: function(jqXHR) {
			$("#subscene_block").css("display","none");
		}
	});

	if ( !$('#subscene_checked').is(":checked") ) {
		$("#subscene_button").off('click');
	} else {
		$("#subscene_button").on('click', function(e){subscene_getPoly()});
	}
	
	subs_sen_url = "";
	subscene_area = 0;

	
});


function SubsceneBaseOnChange()
{
	clear_subscene("left")
	clear_subscene("right")
	subscene_arr = []
	
	if ( $("#subscene_classcode").val().toString() === "sentinel2" ) {
		
		/*
		var length1 = $("#subscene_list1").options.length;
		var length2 = $("#subscene_list2").options.length;
		
		for (var i = 0; i < length1; i++) {
			$("#subscene_list1").remove(i)
		}
		
		for (var i = 0; i < length2; i++) {
			$("#subscene_list2").remove(i)
		}
		*/
		$("#subscene_list1").empty();
		$("#subscene_list2").empty();
		
		// php/BL_A01_T02.php
		$.ajax({
			type: 	"GET",
			url:	"php/BL_A01_T02.php",
			dataType:	"xml",
			//jsonpCallback: 'callback',
			success: function(xml) {
					
				console.log("sentinel2")
					
				subscene_arr = $(xml).children().children()
					
				for (var i = 0; i < $(xml).children().children().length; i++) {
					var str = $(xml).children().children()[i].getAttribute('text')
					var o1 = new Option(str, str);
					var o2 = new Option(str, str);
					subscene_year1 = str.substr(0, 4)
					subscene_month1 = str.substr(4, 2)
					subscene_day1 = str.substr(6, 2)
					subscene_year2 = str.substr(0, 4)
					subscene_month2 = str.substr(4, 2)
					subscene_day2 = str.substr(6, 2)
					$(o1).html(str)
					$(o2).html(str)
					$("#subscene_list1").append(o1);
					$("#subscene_list2").append(o2);
					//console.log($(xml).children().children()[i].getAttribute('id'))
				}
				
				curr_subscene_layer1 = subscene_arr[0]
				subscene_year1 = curr_subscene_layer1.getAttribute('text').substr(0, 4)
				subscene_month1 = curr_subscene_layer1.getAttribute('text').substr(4, 2)
				subscene_day1 = curr_subscene_layer1.getAttribute('text').substr(6, 2)
				$("#subscene_list1").on("change", subscene_onchange1);
				curr_subscene_layer2 = subscene_arr[0]
				subscene_year2 = curr_subscene_layer2.getAttribute('text').substr(0, 4)
				subscene_month2 = curr_subscene_layer2.getAttribute('text').substr(4, 2)
				subscene_day2 = curr_subscene_layer2.getAttribute('text').substr(6, 2)
				$("#subscene_list2").on("change", subscene_onchange2);
				
				set_subscene("left")
				set_subscene("right")
			},
			error: function(jqXHR) {
				$("#subscene_block").css("display","none");
			}
		});
		
		
	} else if ( $("#subscene_classcode").val().toString() === "sentinel1" ) {
		/*
		var length1 = $("#subscene_list1").options.length;
		var length2 = $("#subscene_list2").options.length;
		
		for (var i = 0; i < length1; i++) {
			$("#subscene_list1").remove(i)
		}
		
		for (var i = 0; i < length2; i++) {
			$("#subscene_list2").remove(i)
		}
		*/
		$("#subscene_list1").empty();
		$("#subscene_list2").empty();
		
		// php/BL_A01_T05.php
		$.ajax({
			type: 	"GET",
			url:	"php/BL_A01_T05.php",
			dataType:	"xml",
			//jsonpCallback: 'callback',
			success: function(xml) {
					
					
				subscene_arr = $(xml).children().children()
					
				for (var i = 0; i < $(xml).children().children().length; i++) {
					var str = $(xml).children().children()[i].getAttribute('text')
					var o1 = new Option(str, str);
					var o2 = new Option(str, str);
					subscene_year1 = str.substr(0, 4)
					subscene_month1 = str.substr(4, 2)
					subscene_day1 = str.substr(6, 2)
					subscene_year2 = str.substr(0, 4)
					subscene_month2 = str.substr(4, 2)
					subscene_day2 = str.substr(6, 2)
					$(o1).html(str)
					$(o2).html(str)
					$("#subscene_list1").append(o1);
					$("#subscene_list2").append(o2);
					//console.log($(xml).children().children()[i].getAttribute('id'))
				}
				
				curr_subscene_layer1 = subscene_arr[0]
				subscene_year1 = curr_subscene_layer1.getAttribute('text').substr(0, 4)
				subscene_month1 = curr_subscene_layer1.getAttribute('text').substr(4, 2)
				subscene_day1 = curr_subscene_layer1.getAttribute('text').substr(6, 2)
				$("#subscene_list1").on("change", subscene_onchange1);
				curr_subscene_layer2 = subscene_arr[0]
				subscene_year2 = curr_subscene_layer2.getAttribute('text').substr(0, 4)
				subscene_month2 = curr_subscene_layer2.getAttribute('text').substr(4, 2)
				subscene_day2 = curr_subscene_layer2.getAttribute('text').substr(6, 2)
				$("#subscene_list2").on("change", subscene_onchange2);
				
				set_subscene("left")
				set_subscene("right")
			},
			error: function(jqXHR) {
				$("#subscene_block").css("display","none");
			}
			
		});
		
	} else if ( $("#subscene_classcode").val().toString() === "landset8" ) {
		
		/*
		var length1 = $("#subscene_list1").options.length;
		var length2 = $("#subscene_list2").options.length;
		
		for (var i = 0; i < length1; i++) {
			$("#subscene_list1").remove(i)
		}
		
		for (var i = 0; i < length2; i++) {
			$("#subscene_list2").remove(i)
		}
		*/
		$("#subscene_list1").empty();
		$("#subscene_list2").empty();
		
		$.ajax({
			type: 	"GET",
			url:	"php/BL_A01_T03_L.php",
			dataType:	"xml",
			//jsonpCallback: 'callback',
			success: function(xml) {
					
				console.log("sentinel1")
					
				subscene_arr = $(xml).children().children()
					
				for (var i = 0; i < $(xml).children().children().length; i++) {
					var str = $(xml).children().children()[i].getAttribute('text')
					var o1 = new Option(str, str);
					var o2 = new Option(str, str);
					$(o1).html(str)
					$(o2).html(str)
					$("#subscene_list1").append(o1);
					$("#subscene_list2").append(o2);
					//console.log($(xml).children().children()[i].getAttribute('id'))
				}
				
				curr_subscene_layer1 = subscene_arr[0]
				subscene_year1 = curr_subscene_layer1.getAttribute('text').substr(0, 4)
				subscene_month1 = curr_subscene_layer1.getAttribute('text').substr(4, 2)
				subscene_day1 = curr_subscene_layer1.getAttribute('text').substr(6, 2)
				$("#subscene_list1").on("change", subscene_onchange1);
				curr_subscene_layer2 = subscene_arr[0]
				subscene_year2 = curr_subscene_layer2.getAttribute('text').substr(0, 4)
				subscene_month2 = curr_subscene_layer2.getAttribute('text').substr(4, 2)
				subscene_day2 = curr_subscene_layer2.getAttribute('text').substr(6, 2)
				$("#subscene_list2").on("change", subscene_onchange2);
				
				set_subscene("left")
				set_subscene("right")
			},
			error: function(jqXHR) {
				$("#subscene_block").css("display","none");
			}
		});
	}
	
	
}

function clear_subscene(map)
{
	
	$("#subscene_button").off('click');
	subs_sen_url = "";
	
	if (map == "left" ) {
	
		if (subscene_vector1) {
			maps[0].removeLayer(subscene_vector1);
			subscene_vector1 = "";
			subscene_source1 = "";

			//maps[map_ind].addLayer(subscene_vector);
		}
	} else if ( map == "right" ) {
		
		if (subscene_vector2) {
			maps[1].removeLayer(subscene_vector2);
			subscene_vector2 = "";
			subscene_source2 = "";		
		}
	}
	
}


function clear_subscene_region()
{
	subscene_area = 0
	subs_sen_url = ""
	subscene_region = ""
	clear_map()
}

function subscene_onchange1()
{
	for (var i = 0; i < subscene_arr.length; i++) {
		if ( subscene_arr[i].getAttribute('text') === $("#subscene_list1").val() ) {
			curr_subscene_layer1_ind=i;
			curr_subscene_layer1 = subscene_arr[i]
			curr_id1 = curr_subscene_layer1.getAttribute('text').toString()
			subscene_year1 = curr_id1.substr(0, 4)
			subscene_month1 = curr_id1.substr(4, 2)
			subscene_day1 = curr_id1.substr(6, 2)
		}
	}
	
	subs_sen_url = "";

	if ( $('#subscene_checked').is(":checked") ) {
		
		clear_subscene("left")
		set_subscene("left")
	}
}

function subscene_onchange2()
{
	for (var i = 0; i < subscene_arr.length; i++) {
		if ( subscene_arr[i].getAttribute('text') === $("#subscene_list2").val() ) {
			curr_subscene_layer2_ind=i;
			curr_subscene_layer2 = subscene_arr[i]
			curr_id2 = curr_subscene_layer2.getAttribute('text').toString()
			subscene_year2 = curr_id2.substr(0, 4)
			subscene_month2 = curr_id2.substr(4, 2)
			subscene_day2 = curr_id2.substr(6, 2)
		}
	}
	
	subs_sen_url = "";

	if ( $('#subscene_checked').is(":checked") ) {
		
		clear_subscene("right")
		set_subscene("right")
	}
}

function set_subscene(map)
{
	if ( map === "left" ) {
		$("#subscene_button").on('click', function(e){subscene_getPoly()});
		
		//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016

		let curr_layer = JSON.parse(curr_subscene_layer1.getAttribute('id'));
			
		subscene_source1 = new ol.source.TileImage({
			tileUrlFunction: function(tileCoord){

				var z = tileCoord[0];
				var x = tileCoord[1]-1;
				var y = -tileCoord[2]-1;					
				return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
			},
			crossOrigin:'anonymous'
		})
		
		subscene_vector1 = new ol.layer.Tile({
			source: subscene_source1
		});
		
		subscene_vector1.setZIndex(1);
		
		maps[map_ind].addLayer(subscene_vector1);
		
		
		
	} else if ( map === "right" ) {
		$("#subscene_button").on('click', function(e){subscene_getPoly()});
		
		//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016

		let curr_layer = JSON.parse(curr_subscene_layer2.getAttribute('id'));

		subscene_source2 = new ol.source.TileImage({
			tileUrlFunction: function(tileCoord){

				var z = tileCoord[0];
				var x = tileCoord[1]-1;
				var y = -tileCoord[2]-1;					
				return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
			},
			crossOrigin:'anonymous'
		})
		
		subscene_vector2 = new ol.layer.Tile({
			source: subscene_source2
		});
		
		subscene_vector2.setZIndex(1);
		
		maps[map_ind ^ 0x1].addLayer(subscene_vector2);
	}
	
}

function subscene_getPoly(){
	document.getElementById("space_lonlat").checked = true;
	
	clear_subscene_region();
 
	createMeasureTooltip();  
 
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
		

    var mouse_x;
    var mouse_y;
    
	onmousemove = function(e){mouse_x=e.clientX;mouse_y = e.clientY;}

	draw_box.on('drawstart',
	function (evt) {
		subscene_start_x = mouse_x;
		subscene_start_y = mouse_y;

		btn_disable();
		
		sketch = evt.feature;

		console.log(evt);

		var tooltipCoord = evt.coordinate;

		listener = sketch.getGeometry().on('change', function (evt) {
			var geom = evt.target;
			var output;
			output = formatArea(geom);
			tooltipCoord = geom.getInteriorPoint().getCoordinates();
			
			var sourceProj = maps[map_ind].getView().getProjection();
			var geom_t = (geom.clone().transform(sourceProj, 'EPSG:4326'));
			var coordinates = geom_t.getLinearRing(0).getCoordinates();
			subscene_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
			
			measureTooltipElement.innerHTML = output;
			measureTooltip.setPosition(tooltipCoord);
		});
		
		
	}, this);	
		
	draw_box.on('drawend',
        function (e) {
			
			subscene_end_x = mouse_x;
			subscene_end_y = mouse_y;
			//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsasd?
			//date=20180526&
			//subscene_region=120.7258760671514%2C24.11023190418376%3B120.7425065966939%2C24.07755520679549%3B120.7972651666654%2C24.07795616672053%3B120.8060511576072%2C24.11258739313845%3B120.7931073286575%2C24.12840319631653%3B120.7602521139275%2C24.13013827730786%3B120.7258760671514%2C24.11023190418376
				
			console.log(e);

			coor = e.feature.getGeometry().getCoordinates()[0];
			
			box_array=(String(e.feature.getGeometry().getExtent())).split(",");
		
			loc_84=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');
			
			subs_left = loc_84[0];
			subs_up = loc_84[1];
			
			loc_84=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');
			
			subs_right = loc_84[0];
			subs_down = loc_84[1];
			
			subscene_region = "&lefttop_x=" + subs_left + "&rightbottom_x=" + subs_right + "&lefttop_y=" + subs_up + "&rightbottom_y=" + subs_down;
			
			/*
			if ( subscene_area / 1000000 <= subscene_area_up_limit ) {
				subs_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?" + date + subscene_region
			} else {
				subs_sen_url = "over";
			}
			
			if ( before === after ) {
				subs_sen_url = "same"
			} else if ( parseInt(before) > parseInt(after) ) {
				subs_sen_url = "bigB"
			}
			*/
			
			maps[map_ind].removeInteraction(draw_box);
			
			btn_enable();
			
        }, this);
		
	   
	  //Layer_Grid_Oncheck(ch_lay_root_name,ch_id,0,document.getElementById(ch_id).checked);
 }
 
function subscene_getKml()
{
	fun_access_log("Func_Use_Analysis_1_8");
	// false
	//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20180401&after=20180416&subscene_region=121.05791856764648%2C23.472071219430262%3B121.06381455922852%2C23.47116986237836%3B121.05944715805664%2C23.468666060484367%3B121.05791856764648%2C23.472071219430262%3B121.05791856764648%2C23.472071219430262
	//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20180401%26after=20180426%26region=121.21850967407228%2C23.731985247786838%3B121.23606204986574%2C23.72821370461088%3B121.22009754180908%2C23.713558652272837%3B121.21850967407228%2C23.731985247786838%3B121.21850967407228%2C23.731985247786838
	// good
	//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20170720&after=20180215&subscene_region=120.8567532193329,23.44596794215077;120.8544248505181,23.44398906434632;120.8571331157023,23.43952378142274;120.8568156585571,23.42394034620056;120.8645144837861,23.41276606561682;120.8808192243636,23.41144157211883;120.8991404716364,23.40942189935453;120.9184096891597,23.41383678688257;120.9135910841748,23.42499799183454;120.9053071990364,23.43399841091956;120.9095216000687,23.43628025052095;120.9099051855738,23.4379326384103;120.9102833774821,23.443878444641;120.8990782494477,23.44899108355424;120.8796324875291,23.44922327790944;120.8782378022941,23.44467160253231;120.8688457630732,23.44387630455463;120.8606020017506,23.44685268235575;120.8567532193329,23.44596794215077
	var subscene_width = Math.round(Math.abs(subscene_end_x - subscene_start_x));
	var subscene_height = Math.round(Math.abs(subscene_end_y - subscene_start_y));
	
	var before = curr_subscene_layer1.getAttribute('text').split("_")[0]
	var after = curr_subscene_layer2.getAttribute('text').split("_")[0]

	console.log(before)
	console.log(after)
	
	var subscene_method ='byquery';//var subscene_method = $("#subscene_method").val().toString()
	var subscene_classcode ='sentinel2';//var subscene_classcode = $("#subscene_classcode").val().toString()
	var subscene_PixelSize ="&pixel_size="+ $("#subscene_PixelSize").val().toString();
	//var subscene_maxCloud = $("#subscene_maxCloud").val().toString();
	var subscene_time = "&date1=" + subscene_year1 + "-" + subscene_month1 + "-" + subscene_day1 + "&date2=" + subscene_year2 + "-" + subscene_month2 + "-" + subscene_day2;
	
	if ( subscene_area / 1000000 <= subscene_area_up_limit && subscene_area / 1000000 >= subscene_area_down_limit ) {
		subs_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/subsceneimage/" + subscene_method + "?classcode[]=" + subscene_classcode + 
					   subscene_time + subscene_region + subscene_PixelSize
	} else if ( subscene_area / 1000000 > subscene_area_up_limit ) {
		subs_sen_url = "over";
	} else if ( subscene_area / 1000000 < subscene_area_down_limit ) {
		subs_sen_url = "under";
	} else if ( subscene_region == "" ) {
		subs_sen_url = "";
	}
	
	if ( before === after ) {
		subs_sen_url = "same"
	} else if ( parseInt(before) > parseInt(after) ) {
		subs_sen_url = "bigB"
	}
	
    if(curr_subscene_layer1_ind-curr_subscene_layer2_ind>5){
		subs_sen_url = "range_limit"
	}
	console.log(subs_sen_url)
	
	if ( subs_sen_url != "under" && subs_sen_url != "over" && subs_sen_url != "same" && subs_sen_url != "bigB" &&subs_sen_url != "range_limit"&& subs_sen_url != "" ) {
		
		btn_disable();
		
		loading_id = "l"+subscene_num.toString();
		
		subscene_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
		
		subscene_Tree.enableCheckBoxes(false, false);
		
		$.ajax({
			type: 	"GET",
			url:	"php/get_subscene.php",
			dataType:	"json",
			data: {
				u: subs_sen_url,
				n: (subscene_num + 1)
			},
			//jsonpCallback: 'callback',
			success: function(json) {
				console.log(json.result)
				
				if ( json.result != false ) {
					
					subscene_zip_link_arr.push(json.imgZipPath);
					
					subscene_num = subscene_num + 1;
							
					new_node_id = `{
						"PosInfo":"${((subs_up + subs_down) / 2.0).toString() + ";" + 
									 ((subs_left + subs_right) / 2.0).toString() + ";563426;8;" + 
									 subscene_width.toString() + ";" + 
									 subscene_height.toString() + ";" +
									 subs_left.toString() + ";" + 
									 subs_up.toString() + ";" + 
									 subs_right.toString() + ";" + 
									 subs_down.toString()}",
						"Type":"GifOverlay",
						"Url":"${json.imgFilePath}",
						"ID":"Sentinel2_sis2${subscene_num.toString()}",
						"FileName":"Sentinel2_sis2-${subscene_num.toString()}_${before}_${after}"
					}`.replace(/\n|\t/g, "").trim();
					
					
					// delete loading signal

					subscene_Tree.enableCheckBoxes(true, true);
						
					// layer item
					
					subscene_Tree.insertNewChild("0", new_node_id, "subscene-" + subscene_num.toString() + "_" + before + "_" + after , function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					
					// download item
												
					subscene_Tree.insertNewItem(new_node_id, "subs" + subscene_num.toString(), "下載 .zip 檔", 
												function(){ 
													var idn = this.id.split("subs");
													document.getElementById("download_iframe").src = subscene_zip_link_arr[idn[1] - 1];
												}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
											
					subscene_Tree.showItemCheckbox("subs" + subscene_num.toString(), false);
										
					
					// Download button Default : closed
					
					subscene_Tree.closeItem(new_node_id);
					
				} else {
					alert("回傳檔案發生問題");
				}
				
				subscene_Tree.deleteItem(loading_id, false);
				
				btn_enable();
			},
			error: function(jqXHR) {
				console.log("error")
				alert("發生不明錯誤或尚未選擇區域")
				subscene_Tree.deleteItem(loading_id, false);
				btn_enable();
			}
		});
	} else if ( subs_sen_url == "over" ) {
		alert("請選取範圍小於 " + subscene_area_up_limit + " 平方公里範圍進行分析!")
		clear_subscene_region();
	} else if ( subs_sen_url == "under" ) {
		alert("請選取範圍大於 " + subscene_area_down_limit + " 平方公里範圍進行分析!")
		clear_subscene_region();
	} else if ( subs_sen_url == "same" ) {
		alert("無法比對相同日期影像")
		clear_subscene_region();
	} else if ( subs_sen_url == "bigB" ) {
		alert("日期順序錯誤")
		clear_subscene_region();
	}else if ( subs_sen_url == "range_limit" ) {
		alert("日期區間請選擇一個月內")
		clear_subscene_region();
	} else {
		alert("尚未設定選擇區域")
		clear_subscene_region();
	}
}
 
 
 
var coor;
var coor_lat;
var coor_lng;

function baselayer_win_call() {
	Baselayer_w1.show();
	Baselayer_w1.bringToTop();

}
function model_win_call() {
	Model_w1.show();
	Model_w1.bringToTop();
}
function project_win_call() {
	Project_w1.show();
	Project_w1.bringToTop();
}
function exdata_win_call() {
	Exdata_w1.show();
	Exdata_w1.bringToTop();
}
function search_in_win_call() {

	Search_In_w1.show();
	Search_In_w1.bringToTop();
}
function landslidedam_win_call() {
	Landslidedam_w1.show();
	Landslidedam_w1.bringToTop();
}
function locationTool_win_call() {
	Location_w1.show();
	Location_w1.bringToTop();

}
function drawer_win_call() {
	//$('.ui.accordion').toggle();
	draw_w1.show();
	draw_w1.bringToTop();
	/*** 20190531 fixed ***/
	if (response_s == "") {
		logout_remove_option()
	} else if (response_s == "empty_session") {

	} else {
		logout_remove_option();
		login_add_option();
	}
	/*** 20190531 fixed ***/
}

/**
 * Add Layer of both undermap 
 *
 */
function Undermap_Add_Layer() {
	for (let i = 0; i < 2; ++i) {
		const undermap_layer = base_map_array[window[`map0${i}_layer_ind`]];
		maps[i].addLayer(undermap_layer);
	}
}

/**
 * Remove Layer of both undermap
 *
 */
function Undermap_Remove_Layer() {
	for (let i = 0; i < 2; ++i) {
		const undermap_layer = base_map_array[window[`map0${i}_layer_ind`]];
		maps[i].removeLayer(undermap_layer);
	}
}

/* 
	Index for window mode: 
		0 - map_win_single (default)
				1 - map_win_double
				2 - map_win_slide
*/
var map_win_change_index = 0;


/**
 * Add Layer of both undermap 
 *
 */
function Undermap_Add_Layer() {
	for (let i = 0; i < 2; ++i) {
		const undermap_layer = base_map_array[window[`map0${i}_layer_ind`]];
		maps[i].addLayer(undermap_layer);
	}
}

/**
 * Remove Layer of both undermap
 *
 */
function Undermap_Remove_Layer() {
	for (let i = 0; i < 2; ++i) {
		const undermap_layer = base_map_array[window[`map0${i}_layer_ind`]];
		maps[i].removeLayer(undermap_layer);
	}
}

/**
 * For initializing the map while first time loading into page
 */
function map_win_init() {
	$(document).ready(function () {
		Undermap_Remove_Layer();
		Undermap_Add_Layer();
		switch (map_win_change_index) {
			case 0:
				map_win_single();
				break;
			case 1:
				map_win_double();
				break;
			case 2:
				map_win_slide();
				break;
		}
	});
}

/**  
 * For hover on map_win_option button 
 */
function map_win_select_enter() {
	$("#map_win_option").css("display", "inline")
}

/**  
 * For hover off map_win_option button 
 */
function map_win_select_leave() {
	$("#map_win_option").css("display", "none")
}

/**  
 * - Change map display to single map
 * - Change left/right window display in single map mode
 */
function map_win_single() {
	/* If changed from other window mode, default set to left window, otherwise switch between left/right window */
	if (map_win_change_index != 0) {
		map_ind = 0;
		mymainwin_switch.checked = false;
	}

	$("#swipeSlider").css("display", "none");
	$('#two_maps').css("overflow", "")
	$('#map0').css("z-index", "");
	$('#map1').css("z-index", "");
	$('#map0').css("position", "");

	$("#canvas_title").css("display", "")
	$("#canvas_content").css("display", "")

	/////// Cesium 3D ///////
	if (model_3Dchange_index == 1) {
		$('#map0').width((map_ind == 0) ? '100%' : '0%');
		$('#map1').width((map_ind == 1) ? '0%' : '0%');
		$('#map2').width((map_ind == 1) ? '100%' : '0%');
	}
	else {
		$('#map0').width((map_ind == 0) ? '100%' : '0%');
		$('#map1').width((map_ind == 1) ? '100%' : '0%');
		$('#map2').width((map_ind == 1) ? '0%' : '0%');
	}
	// document.getElementById('map0').style.width = (map_ind == 0) ? '100%' : '0%';
	// document.getElementById('map1').style.width = (map_ind == 1) ? '100%' : '0%';

	maps[0].updateSize();
	maps[1].updateSize();

	$("#map_win_change_id").attr("src", "icons/LLGIS_LOGO/win_single.png");
	$(l_c_center).css({
		"position": "absolute",
		"border": "solid 0px black"
	});
	$(r_c_center).css({
		"position": "absolute",
		"border": "solid 0px #FF4500",
	});

	map_win_change_index = 0;
}

/**  
 * Change map display to double fixed inline map
 */
function map_win_double() {
	$("#swipeSlider").css("display", "none");
	$('#two_maps').css("overflow", "")
	$('#map0').css("z-index", "");
	$('#map1').css("z-index", "");
	$('#map0').css("position", "");

	$("#canvas_title").css("display", "")
	$("#canvas_content").css("display", "")

	/////// Cesium 3D ///////
	if (model_3Dchange_index == 1) {
		$('#map0').width('50%');
		$('#map1').width('0%');
		$('#map2').width('50%');
	}
	else {
		$('#map0').width('50%');
		$('#map1').width('50%');
		$('#map2').width('0%');
	}
	// document.getElementById('map0').style.width = '50%';
	// document.getElementById('map1').style.width = '50%';

	maps[0].updateSize();
	maps[1].updateSize();
	map_win_change_index = 1;

	$("#map_win_change_id").attr("src", "icons/LLGIS_LOGO/win_double.png");
	$(l_c_center).css({
		"position": "absolute",
		"border": "solid 1px black",
		"top": "50%",
		"left": "25%",
		"width": "20px",
		"height": "20px"
	});
	$(r_c_center).css({
		"position": "absolute",
		"border": "solid 1px #FF4500",
		"top": "50%",
		"left": "75%",
		"width": "20px",
		"height": "20px"
	});
}

/**
 * Change map display to double slidable inline map
 */
function map_win_slide() {
	$('#map0').width('100%');
	$('#map1').width('0%');
	maps[0].updateSize();
	maps[1].updateSize();

	$('#two_maps').css("overflow", "hidden");

	var screen_w = $("#map0").width();
	var screen_h = $("#map0").height();

	var map0_w = parseInt(screen_w * (0.006 * document.getElementById("swipeSlider").value + 0.2) - 0.32 * document.getElementById("swipeSlider").value + 17);
	var map1_w = screen_w * ((-0.006) * document.getElementById("swipeSlider").value + 0.8);

	$("#map0").css("clip", "rect(0px," + (map0_w - 1).toString() + "px," + screen_h + "px," + "0px)")
	$("#map1").css("clip", "rect(0px," + screen_w + "px," + screen_h + "px," + (map0_w).toString() + "px)")

	$("#swipeSlider").css("display", "inline");
	$("#map_win_change_id").attr("src", "icons/LLGIS_LOGO/win_slide.png");

	$('#map1').width('100%');
	$('#map1').height('100%');
	$('#map0').css("z-index", "20");
	$('#map1').css("z-index", "10");
	$('#map0').css("position", "fixed");
	maps[0].updateSize();
	maps[1].updateSize();

	$("#canvas_title").css("display", "none")
	$("#canvas_content").css("display", "none")
	map_win_change_index = 2;
}


//浮動視窗檢視
function showWindow(id, mode) {
	if (mode == true) {
		dhxWins.window(id).show();
	} else {
		dhxWins.window(id).hide();
	}
}
/////////191105	
//------------- 190820 for 2D/3D ------------------//
function model_change_select_enter() {
	$("#model_change_option").css("display", "inline");
}

function model_change_select_leave() {
	$("#model_change_option").css("display", "none");
}

var model_3Dchange_index = 0;
var model_3D_init = 0;

function set_3Dmodel() {
	if (model_3D_init == 0) {

		// init_3Dmodel();
		model_3D_init = 1;
	}
	// ol3d.setEnabled(!ol3d.getEnabled());
	if (model_3Dchange_index == 0) {
		model_3Dchange_index = 1;

		$("#model_3Dchange_btn").attr("src", "icons/LLGIS_LOGO/set_2D_new.png");

		$('#map0').width('0%');
		$('#map1').width('0%');
		$('#map2').width('100%');

		maps[0].updateSize();
		maps[1].updateSize();

		map_ind = 1;

		mymainwin_switch.checked = true;
	} else if (model_3Dchange_index == 1) {
		model_3Dchange_index = 0;

		$("#model_3Dchange_btn").attr("src", "icons/LLGIS_LOGO/set_3D_new.png");

		$('#map0').width('100%');
		$('#map1').width('0%');
		$('#map2').width('0%');

		maps[0].updateSize();
		maps[1].updateSize();

		map_ind = 0;

		mymainwin_switch.checked = false;
	}
	window_select();
}

function terrain_win_call() {
	//if (Login_ID == "") {
	//alert("功能開發與資料準備中，測試請從EIP登入!");
	//} else {
	terrain_w1.show();
	terrain_w1.bringToTop();
	/*if (response_s == "") {
		logout_remove_option();
	} else if (response_s == "empty_session") {

	} else {
		logout_remove_option();
		login_add_option();
	}*/
	//}
	//191021
	/*
	document.getElementById("button_png_v2").click();
	setTimeout(function(){
		document.getElementById("button_go_v2").click();
	}, 10000); 
	*/

}



var street_view_index = 0;
function get_street_view() {
	if (model_3D_init == 0) {

		/////// Cesium 3D///////
		// init_3Dmodel();
		model_3D_init = 1;
	}
	// ol3d.setEnabled(!ol3d.getEnabled());

	if (street_view_index == 0) {

		// if (model_3Dchange_index == 1) {
		// 	set_3Dmodel();
		// }
		set_3Dmodel();
		$('#map0').width('50%');
		$('#map2').width('50%');
		maps[0].updateSize();
		maps[1].updateSize();
		map_win_change_index = 1;
		street_view_index = 1;
		model_3Dchange_index = 1;
		document.getElementById("map_win_change_id").src = "icons/LLGIS_LOGO/win_single.png";
		//document.getElementById("model_3Dchange_btn").src = "icons/LLGIS_LOGO/set_2D_new.png"; 

		street_view_win.show();

		var taiwan = { lat: 22.98860494930799, lng: 120.2346535669484 };
		sv = new google.maps.StreetViewService();

		panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
		sv.getPanorama({ location: street_view_position, radius: 50 }, processSVData);

		panorama.addListener('position_changed', function () {
			//console.log("position change: " + panorama.getPosition());
			coor = panorama.getPosition();
			coor_lat = coor.lat();
			coor_lng = coor.lng();
			street_view_position = coor;
			var test_coor = ol.proj.transform([coor.lng(), coor.lat()], 'EPSG:4326', 'EPSG:3857');

			var plot_coor = [test_coor[0], test_coor[1]];

			plot_street_icon(plot_coor);
			plot_street_icon_3d(panorama.getPosition().lng(), panorama.getPosition().lat());

			if (not_map_click_change == 0) {
				if (prev_route_item != "") {
					prev_route_item.css('background-color', '#FFFFFF')
					prev_route_item = ""
				}
				if (prev_route_marker != "") {
					prev_route_marker.setStyle(prev_route_iconStyle)
					prev_route_iconStyle = ""
					prev_route_marker = ""
				}
			}

			not_map_click_change = 0;

		});

		panorama.addListener('pov_changed', function () {
			// console.log("Pov heading : " + panorama.getPov().heading);
			if (!alt_shift_press) {		
				if (panorama.getPosition()) {
					//plot_street_icon_3d(panorama.getPosition().lng(),  panorama.getPosition().lat());
					if (panorama.getPov().pitch * Math.PI / 180 <= 0) {
						street_view_rotate(panorama.getPosition().lng(), panorama.getPosition().lat(), Cesium.Math.toRadians(panorama.getPov().heading), -1.553343);
					}
					else {
						street_view_rotate(panorama.getPosition().lng(), panorama.getPosition().lat(), Cesium.Math.toRadians(panorama.getPov().heading), panorama.getPov().pitch / 90 * -1.553343);
					}
					
					//street_view_rotate(panorama.getPosition().lng(), panorama.getPosition().lat(), (panorama.getPov().heading - street_view_heading) * Math.PI / 180, Cesium.Math.toRadians(panorama.getPov().pitch));
					street_view_heading = panorama.getPov().heading;
				}
				else {
					if (panorama.getPov().pitch * Math.PI / 180 <= 0) {
						street_view_rotate(120.2346535669484, 22.98860494930799, Cesium.Math.toRadians(panorama.getPov().heading), -1.553343);
					}
					else {
						street_view_rotate(120.2346535669484, 22.98860494930799, Cesium.Math.toRadians(panorama.getPov().heading), panorama.getPov().pitch / 90 * -1.553343);
					}
					street_view_heading = panorama.getPov().heading;
				}
			}
		});

	} else if (street_view_index == 1) {

		// if (model_3Dchange_index == 0) {
		// 	set_3Dmodel();
		// }

		document.getElementById('map0').style.width = '100%';
		document.getElementById('map2').style.width = '0%';
		maps[0].updateSize();
		maps[1].updateSize();
		map_win_change_index = 0;
		model_3Dchange_index = 0;
		street_view_index = 0;
		document.getElementById("map_win_change_id").src = "icons/LLGIS_LOGO/win_double.png";
		//document.getElementById("model_3Dchange_id").src = "icons/LLGIS_LOGO/set_3Dmodel.png";
		if (draw_box) {
			maps[0].removeInteraction(draw_box);
			maps[1].removeInteraction(draw_box);
		}

		if (vector_box) {
			maps[0].removeLayer(vector_box);
			maps[1].removeLayer(vector_box);
			vector_box.getSource().clear();
			source_box.clear();
			maps[0].addLayer(vector_box);
			maps[1].addLayer(vector_box);
		}

		if (icon_box) {
			maps[0].removeLayer(icon_box);
			maps[1].removeLayer(icon_box);
			icon_box.getSource().clear();
			icon_source.clear();
			maps[0].addLayer(icon_box);
			maps[1].addLayer(icon_box);
		}
		street_view_win.hide();
	}

}


function location_taiwan() {
	if (map_ind == 1 && model_3Dchange_index == 1 && map_win_change_index == 0) {
		Locate(23.804110, 121.079187, 1);
		
	}
	else {
		Locate(23.804110, 121.079187, 8);
	}

}


//undermap_list.setOptionWidth(300);
undermap_list.setImagePath("icons/");
undermap_list.load('<complete>' +
	'<option value="source_gm_m" img="google.png" selected="1">Google 電子地圖</option>' +
	'<option value="source_nlsc_EMAP" img="nlsc.png">通用版電子地圖</option>' +
	'<option value="source_gm_s" img="google.png" >Google 衛星地圖</option>' +
	'<option value="source_gm_y" img="google.png" >Google 混合地圖</option>' +
	'<option value="source_nlsc_PHOTO2" img="nlsc.png" >通用版正射影像圖</option>' +
	'<option value="source_gm_p" img="google.png"  >Google 地形圖</option>' +
	'<option value="source_swcb_r" img="swcb.png"  >水保局HOST地圖(20m)</option>' +
	//'<option value="source_swcb_r_5m" img="swcb.png"  >水保局HOST地圖(5m)</option>'+
	'<option value="source_swcb_CS" img="swcb.png"  >水保局CS地圖(20m)</option>' +
	//'<option value="source_swcb_CS_5m" img="swcb.png"  >水保局CS地圖(5m)</option>'+
	'<option value="source_aso_ATIS" img="aso.png" >農航所航照圖(WMS)</option>' +
	'<option value="source_gwh_geo4" img="CGS.png" >地調所地質圖(WMS)</option>' +
	'</complete>');



undermap_list.attachEvent("onChange", function (value, text) {
	if (map_ind == 1) {
		maps[1].removeLayer(base_map_array[map01_layer_ind]);
		if (value == "source_gm_m") {
			maps[1].addLayer(map_layer_gm_m);
			map01_layer_ind = 0;
		} else if (value == "source_nlsc_EMAP") {
			maps[1].addLayer(map_layer_nlsc_EMAP);
			map01_layer_ind = 1;
		} else if (value == "source_gm_s") {
			maps[1].addLayer(map_layer_gm_s);
			map01_layer_ind = 2;
		} else if (value == "source_gm_y") {
			maps[1].addLayer(map_layer_gm_y);
			map01_layer_ind = 3;
		} else if (value == "source_nlsc_PHOTO2") {
			maps[1].addLayer(map_layer_nlsc_PHOTO2);
			map01_layer_ind = 4;
		} else if (value == "source_gm_p") {
			maps[1].addLayer(map_layer_gm_p);
			map01_layer_ind = 5;
		} else if (value == "source_swcb_r") {
			maps[1].addLayer(map_layer_swcb_r);
			map01_layer_ind = 6;
		} else if (value == "source_swcb_r_5m") {
			maps[1].addLayer(map_layer_swcb_r_5m);
			map01_layer_ind = 7;
		} else if (value == "source_swcb_CS") {
			maps[1].addLayer(map_layer_swcb_CS);
			map01_layer_ind = 8;
		} else if (value == "source_swcb_CS_5m") {
			maps[1].addLayer(map_layer_swcb_CS_5m);
			map01_layer_ind = 9;
		} else if (value == "source_aso_ATIS") {
			alert("此底圖解析度較高且為WMS介接，讀取時間較為長，請耐心等候!");
			maps[1].addLayer(map_layer_aso_ATIS);
			map01_layer_ind = 10;
		} else if (value == "source_gwh_geo4") {
			alert("此底圖為WMS介接，讀取時間較為長，請耐心等候!");
			maps[1].addLayer(map_layer_gwh_geo4);
			map01_layer_ind = 11;
		}
	}
	if (map_ind == 0) {
		maps[0].removeLayer(base_map_array[map00_layer_ind]);
		if (value == "source_gm_m") {
			maps[0].addLayer(map_layer_gm_m);
			map00_layer_ind = 0;
		} else if (value == "source_nlsc_EMAP") {
			maps[0].addLayer(map_layer_nlsc_EMAP);
			map00_layer_ind = 1;
		} else if (value == "source_gm_s") {
			maps[0].addLayer(map_layer_gm_s);
			map00_layer_ind = 2;
		} else if (value == "source_gm_y") {
			maps[0].addLayer(map_layer_gm_y);
			map00_layer_ind = 3;
		} else if (value == "source_nlsc_PHOTO2") {
			maps[0].addLayer(map_layer_nlsc_PHOTO2);
			map00_layer_ind = 4;
		} else if (value == "source_gm_p") {
			maps[0].addLayer(map_layer_gm_p);
			map00_layer_ind = 5;
		} else if (value == "source_swcb_r") {
			maps[0].addLayer(map_layer_swcb_r);
			map00_layer_ind = 6;
		} else if (value == "source_swcb_r_5m") {
			maps[0].addLayer(map_layer_swcb_r_5m);
			map00_layer_ind = 7;
		} else if (value == "source_swcb_CS") {
			maps[0].addLayer(map_layer_swcb_CS);
			map00_layer_ind = 8;
		} else if (value == "source_swcb_CS_5m") {
			maps[0].addLayer(map_layer_swcb_CS_5m);
			map00_layer_ind = 9;
		} else if (value == "source_aso_ATIS") {
			alert("此底圖解析度較高且為WMS介接，讀取時間較為長，請耐心等候!");
			maps[0].addLayer(map_layer_aso_ATIS);
			map00_layer_ind = 10;
		} else if (value == "source_gwh_geo4") {
			alert("此底圖為WMS介接，讀取時間較為長，請耐心等候!");
			maps[0].addLayer(map_layer_gwh_geo4);
			map00_layer_ind = 11;
		}
	}
});
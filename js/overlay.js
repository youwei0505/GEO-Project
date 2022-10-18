///////Cesium 3D///////
var map_ind = 0;
var dataSources_url_3DCesium = []
var imageryLayers_url_3DCesium = []
var tilesets_url_3DCesium = []
var BaseLayer = [];
var HTML = [];

var W0_B_00_00, W0_B_00_01, W0_B_00_02, W0_B_00_03, W0_B_00_04, W0_B_00_05;
var W1_B_00_00, W1_B_00_01, W1_B_00_02, W1_B_00_03, W1_B_00_04, W1_B_00_05;
var W0_B_01_00, W0_B_01_01, W0_B_01_02, W0_B_01_03, W0_B_01_04;
var W1_B_01_00, W1_B_01_01, W1_B_01_02, W1_B_01_03, W1_B_01_04;
var W0_B_02_00;
var W1_B_02_00;
var W0_B_03_00, W0_B_03_01, W0_B_03_02;
var W1_B_03_00, W1_B_03_01, W1_B_03_02;

var W0_M_00, W0_M_01, W0_M_02, W0_M_03, W1_M_00, W1_M_01, W1_M_02, W1_M_03;
var W0_P_01, W0_P_02, W0_P_03, W0_P_04, W0_P_05, W0_P_06, W0_P_07, W1_P_01, W1_P_02, W1_P_03, W1_P_04, W1_P_05, W1_P_06, W1_P_07;
var W0_E_00, W1_E_00;
var W0_S_00, W1_S_00;


/* Json Overlay */
var jsonImage = [];
var progress = [];
var ThisURL = [];
var jsonImage_MapTile_num = [0, 0];
var jsonImage_MapTile = new Array();
var jsonToBeRemoved_num = [0, 0];
var jsonToBeRemoved = new Array();
for (var i = 0; i < 2; i++) {
	jsonImage_MapTile[i] = new Array();
	jsonToBeRemoved[i] = new Array();
}
function JsonOverlay(state, layer_content, map_ind) {
	let present_layer_data = window[`All_Check_List_W${map_ind}`];

	if (state == 0) {
		for (i = 0; i < jsonToBeRemoved_num[map_ind]; i++) {
			if (layer_content.ID == jsonImage_MapTile[map_ind][i].ID) {
				maps[map_ind].removeLayer(jsonToBeRemoved[map_ind][i]);

				jsonImage_MapTile[map_ind].splice(i, 1)
				jsonToBeRemoved[map_ind].splice(i, 1);
				jsonToBeRemoved_num[map_ind]--;
				jsonImage_MapTile_num[map_ind]--;
			}
		}
		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			for (i = 0; i < dataSources_url_3DCesium.length; i++) {
				if (layer_content.Url == dataSources_url_3DCesium[i]) {
					console.log(i)
					console.log(viewer.dataSources.get(i).name)
					viewer.dataSources.remove(viewer.dataSources.get(i), true)
					dataSources_url_3DCesium.splice(i, 1)
					console.log(dataSources_url_3DCesium)
					break
				}
			}
		}
	}
	else {
		var now_vector_id = layer_content.ID;

		var temp_color, temp_fill_color;
		var temp_thickness;
		var temp_opacity, temp_fill_opacity;
		var z_idx;

		for (var i = 0; i < present_layer_data.length; i++) {
			if (present_layer_data[i].ID == now_vector_id) {
				temp_color = present_layer_data[i].Color.toString();
				temp_fill_color = present_layer_data[i].FillColor.toString();
				temp_thickness = present_layer_data[i].Thickness;
				temp_opacity = present_layer_data[i].Opacity;
				z_idx = present_layer_data[i].ZIndex;
				temp_fill_opacity = present_layer_data[i].FillOpacity;
				layer_legend_add(now_vector_id, present_layer_data[i].FileName, temp_color, "", temp_thickness, temp_opacity);
			}
		}

		var json_style = new ol.style.Style({

			fill: new ol.style.Fill({
				color: HextoRGBA(temp_fill_color)
			}),
			stroke: new ol.style.Stroke({
				color: temp_color,
				width: temp_thickness
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: '#ffcc33'
				})
			})

		});
		jsonImage[map_ind] = new ol.layer.Vector({
			source: new ol.source.Vector({
				url: layer_content.Url,
				format: new ol.format.GeoJSON()
			}),
			altitudeMode: "clampToGround"
		});


		jsonToBeRemoved_num[map_ind]++;
		jsonToBeRemoved[map_ind].push(jsonImage[map_ind]);
		jsonImage_MapTile[map_ind][jsonImage_MapTile_num[map_ind]] = layer_content;
		jsonToBeRemoved[map_ind][jsonImage_MapTile_num[map_ind]].setStyle(json_style);
		jsonImage_MapTile_num[map_ind]++;
		jsonImage[map_ind].setOpacity(temp_opacity / 100);
		jsonImage[map_ind].setZIndex(z_idx);
		maps[map_ind].addLayer(jsonImage[map_ind]);

		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			// console.log("Cesium 3D")
			var stroke_color = '0xff' + temp_color.split('#')[1][4] + temp_color.split('#')[1][5] + temp_color.split('#')[1][2] + temp_color.split('#')[1][3] + temp_color.split('#')[1][0] + temp_color.split('#')[1][1]
			var fill_color = '0x67' + temp_fill_color.split('#')[1][4] + temp_fill_color.split('#')[1][5] + temp_fill_color.split('#')[1][2] + temp_fill_color.split('#')[1][3] + temp_fill_color.split('#')[1][0] + temp_fill_color.split('#')[1][1]
			console.log(temp_color, temp_fill_color)
			console.log(stroke_color, fill_color)
			var Cesium_3D_jsonStyle = {
				stroke: Cesium.Color.fromRgba(stroke_color),
				fill: Cesium.Color.fromRgba(fill_color),
				strokeWidth: temp_thickness,
				markerColor: Cesium.Color.fromRgba(0xff33ccff),
				markerSize: 70,
				markerSymbol: '',
				clampToGround: true
			};
			var dataSource = Cesium.GeoJsonDataSource.load(
				layer_content.Url,
				Cesium_3D_jsonStyle,
			);
			viewer.dataSources.add(dataSource);
			dataSources_url_3DCesium.push(layer_content.Url)
		}

	}
}
function json_color_picker_onChange(layer_id, prev_layer_color, prev_layer_fillcolor, thickness, opacity, fill_opacity, z_idx) {
	console.log((prev_layer_fillcolor + OpatoHex(fill_opacity)).toString())
	console.log(prev_layer_color)
	console.log(thickness)
	for (var i = 0; i < jsonImage_MapTile_num[map_ind]; i++) {
		var temp_id = Id_Replace_Illegal_Char(jsonImage_MapTile[map_ind][i]);

		if (layer_id.localeCompare("layer_color_picker" + temp_id) == 0 || layer_id.localeCompare("layer_fillcolor_picker" + temp_id) == 0) {
			var json_style = new ol.style.Style({
				fill: new ol.style.Fill({
					color: (prev_layer_fillcolor + OpatoHex(fill_opacity)).toString()
				}),
				stroke: new ol.style.Stroke({
					color: prev_layer_color,
					width: thickness
				})
			});


			jsonToBeRemoved[map_ind][i].setStyle(json_style);

		}
	}
}
function JsonOverlay_change_zIndex(layer_id, z_idx) {
	for (var i = 0; i < jsonImage_MapTile_num[map_ind]; i++) {
		if (layer_id.localeCompare(jsonImage_MapTile[map_ind][i].ID) === 0) {
			jsonToBeRemoved[map_ind][i].setZIndex(z_idx);
		}
	}
}

/* Gif Overlay */
var linkurl_GifOverlay = [];
var GifLayer = [];
var GifLayer_GifOverlay_num = [0, 0];
var GifLayer_GifOverlay = new Array();
var GifOverlayToBeRemoved_num = [0, 0];
var GifOverlayToBeRemoved = new Array();
var Gif_currZoom = 0;
var temp_pos;
var temp_overlay;
var Gif_layer_position = new Array();
for (var i = 0; i < 2; i++) {
	GifLayer_GifOverlay[i] = new Array();
	GifOverlayToBeRemoved[i] = new Array();
	Gif_layer_position[i] = new Array();
}
function GifOverlay(state, layer_content, map_ind) {
	let lonlat_pos = layer_content.PosInfo.split(';');
	let LU_X = lonlat_pos[6];
	let LU_Y = lonlat_pos[7];
	let RD_X = lonlat_pos[8];
	let RD_Y = lonlat_pos[9];

	let present_layer_data = window[`All_Check_List_W${map_ind}`];

	if (state == 0) {
		for (i = 0; i < GifLayer_GifOverlay[map_ind].length; i++) {
			if (GifLayer_GifOverlay[map_ind][i].ID == layer_content.ID) {

				maps[map_ind].removeOverlay(GifOverlayToBeRemoved[map_ind][i]);

				/*** add ***/
				for (var j = i; j < GifLayer_GifOverlay[map_ind].length; j++) {
					GifOverlayToBeRemoved[map_ind][j] = GifOverlayToBeRemoved[map_ind][j + 1];
					GifLayer_GifOverlay[map_ind][j] = GifLayer_GifOverlay[map_ind][j + 1];
					Gif_layer_position[map_ind][j] = Gif_layer_position[map_ind][j + 1];
				}
				GifLayer_GifOverlay_num[map_ind]--;
				/***********/
			}

		}
	}
	else {

		/*** add ***/

		var z_idx;

		for (var i = 0; i < present_layer_data.length; i++) {
			if (present_layer_data[i].ID.localeCompare(layer_content.ID) === 0) {
				z_idx = present_layer_data[i].ZIndex;
			}
		}

		var pixelLU = [parseFloat(LU_X), parseFloat(LU_Y)]
		var pixelRD = [parseFloat(RD_X), parseFloat(RD_Y)]
		var map_res = maps[map_ind].getView().getResolution()


		var width_str = ((pixelRD[0] - pixelLU[0]) / map_res * (111319.49079321003836745952888988)).toString() + 'px';
		var height_str = ((pixelLU[1] - pixelRD[1]) / map_res * (121428.22533079758266192213130883)).toString() + 'px';

		var div_element = document.createElement('div')
		var new_div_id = 'gif_element' + GifLayer_GifOverlay_num[map_ind].toString();
		div_element.id = new_div_id;
		div_element.title = 'Gif_element' + GifLayer_GifOverlay_num[map_ind].toString();

		document.getElementById('gif_container').appendChild(div_element)


		$("#" + new_div_id + "").css('width', width_str) // width_str
		$("#" + new_div_id + "").css('height', height_str) // height_str
		$("#" + new_div_id + "").css('background', 'url("' + layer_content.Url + '")')
		$("#" + new_div_id + "").css('background-size', '100% 100%')
		$("#" + new_div_id + "").css('background-repeat', 'no-repeat')

		var pos = ol.proj.fromLonLat([parseFloat(LU_X), parseFloat(LU_Y)]);

		console.log([parseFloat(LU_X), parseFloat(LU_Y)])
		console.log([parseFloat(RD_X), parseFloat(RD_Y)])
		Gif_layer_position[map_ind][GifLayer_GifOverlay_num[map_ind]] = ([parseFloat(LU_X), parseFloat(LU_Y), parseFloat(RD_X), parseFloat(RD_Y)])

		GifOverlayToBeRemoved[map_ind][GifLayer_GifOverlay_num[map_ind]] = new ol.Overlay({
			position: pos,
			positioning: 'top-left',
			element: document.getElementById(new_div_id),
			stopEvent: false
		});
		maps[map_ind].addOverlay(GifOverlayToBeRemoved[map_ind][GifLayer_GifOverlay_num[map_ind]]);
		GifLayer_GifOverlay[map_ind][GifLayer_GifOverlay_num[map_ind]] = layer_content;
		GifLayer_GifOverlay_num[map_ind]++;

		Gif_currZoom = map.getView().getZoom();
		maps[map_ind].on('moveend', Gif_overlay_onMoveEnd);

	}
}
function Gif_overlay_onMoveStart(event) {

	var newZoom = map.getView().getZoom();

	temp_pos = Gif_layer_position;
	temp_overlay = GifLayer_GifOverlay;

	if (Gif_currZoom != newZoom) {

		for (var m = 0; m < 2; m++) {
			for (var i = 0; i < temp_overlay[m].length; i++) {

				maps[m].removeOverlay(GifOverlayToBeRemoved[m][i]);
			}
		}

		GifLayer_GifOverlay_num = [0, 0];
		GifLayer_GifOverlay = new Array();
		for (var i = 0; i < 2; i++) {
			GifLayer_GifOverlay[i] = new Array();
		}

		Gif_layer_position = new Array();
		for (var i = 0; i < 2; i++) {
			Gif_layer_position[i] = new Array();
		}

		GifOverlayToBeRemoved_num = [0, 0];
		GifOverlayToBeRemoved = new Array();
		for (var i = 0; i < 2; i++) {
			GifOverlayToBeRemoved[i] = new Array();
		}
	}
}
function Gif_overlay_onMoveEnd(event) {
	var newZoom = map.getView().getZoom();

	temp_pos = Gif_layer_position;
	temp_overlay = GifLayer_GifOverlay;

	if (Gif_currZoom != newZoom) {

		for (var m = 0; m < 2; m++) {
			for (var i = 0; i < temp_overlay[m].length; i++) {

				maps[m].removeOverlay(GifOverlayToBeRemoved[m][i]);
			}
		}
	}


	var map_res = maps[map_ind].getView().getResolution()

	if (Gif_currZoom != newZoom) {
		for (var m = 0; m < 2; m++) {
			for (var i = 0; i < GifLayer_GifOverlay_num[m]; i++) {


				var LU_X = temp_pos[m][i][0]
				var LU_Y = temp_pos[m][i][1]
				var RD_X = temp_pos[m][i][2]
				var RD_Y = temp_pos[m][i][3]

				var pixelLU = [LU_X, LU_Y]
				var pixelRD = [RD_X, RD_Y]

				var width_str = ((pixelRD[0] - pixelLU[0]) / map_res * (111319.49079321003836745952888988)).toString() + 'px';
				var height_str = ((pixelLU[1] - pixelRD[1]) / map_res * (121428.22533079758266192213130883)).toString() + 'px';

				var div_element = document.createElement('div')
				var new_div_id = 'gif_element' + i.toString();
				div_element.id = new_div_id;
				div_element.title = 'Gif_element' + i.toString();

				document.getElementById('gif_container').appendChild(div_element)


				$("#" + new_div_id + "").css('width', width_str) // width_str
				$("#" + new_div_id + "").css('height', height_str) // height_str
				$("#" + new_div_id + "").css('background', 'url("' + temp_overlay[m][i].Url + '")')
				$("#" + new_div_id + "").css('background-size', '100% 100%')
				$("#" + new_div_id + "").css('background-repeat', 'no-repeat')

				var pos = ol.proj.fromLonLat([LU_X, LU_Y]);

				Gif_layer_position[m][i].push([LU_X, LU_Y, RD_X, RD_Y])

				GifOverlayToBeRemoved[m][i] = new ol.Overlay({
					position: pos,
					positioning: 'top-left',
					element: document.getElementById(new_div_id),
					stopEvent: false
				});
				//GifOverlayToBeRemoved[m][GifLayer_GifOverlay_num[m]].setZIndex(z_idx);
				maps[m].addOverlay(GifOverlayToBeRemoved[m][i]);
				GifLayer_GifOverlay[m][i] = temp_overlay[m][i];
				//GifLayer_GifOverlay_num[m] ++;

			}
		}

		Gif_currZoom = newZoom;
	}
}


/* MapTiles overlay */
var progress = [];
var ThisURL = [];
var MapTile_num = [0, 0];
var MapTile = new Array();
var format_type;
var MapTileToBeRemoved_num = [0, 0];
var MapTileToBeRemoved = new Array();
for (var i = 0; i < 2; i++) {
	MapTile[i] = new Array();
	MapTileToBeRemoved[i] = new Array();
}
function MapTiles2(state, layer_content, map_ind) {
	let present_data = window[`All_Check_List_W${map_ind}`];
	if (state == 0) {
		for (i = 0; i < MapTile_num[map_ind]; i++) {

			if (MapTile[map_ind][i].ID == layer_content.ID) {


				maps[map_ind].removeLayer(MapTileToBeRemoved[map_ind][i]);


				/*** add ***/
				for (j = i; j < MapTile_num[map_ind]; j++) {
					MapTile[map_ind][j] = MapTile[map_ind][j + 1];
					MapTileToBeRemoved[map_ind][j] = MapTileToBeRemoved[map_ind][j + 1];
				}
				MapTile_num[map_ind]--;
				/***********/
				break;
			}
		}
		///////Cesium 3D///////
		console.log("layer_content", layer_content)
		if (model_3Dchange_index == 1 && map_ind == 1) {
			for (var i = 0; i < imageryLayers_url_3DCesium.length; i++) {
				if (imageryLayers_url_3DCesium[i] != null && imageryLayers_url_3DCesium[i].indexOf(layer_content.Url) != -1) {
					viewer.imageryLayers.remove(viewer.imageryLayers.get(i));

					imageryLayers_url_3DCesium.splice(i, 1);
					break;
				}
			}
		}
	}
	else {
		MapTileToBeRemoved[map_ind][MapTile_num[map_ind]] = new ol.layer.Tile({
			source: new ol.source.TileImage({
				tileUrlFunction: function (tileCoord) {

					var z = tileCoord[0];
					var x = tileCoord[1] - 1;
					var y = -tileCoord[2] - 1;
					return layer_content.Url + z + '/' + y + '/' + x + '.jpg';
				},
				crossOrigin: 'anonymous'
			})
		});
		//}

		/*** add ***/
		var layer_opacity = 100;

		for (var i = 0; i < present_data.length; i++) {
			if (present_data[i].ID == layer_content.ID) {
				MapTileToBeRemoved[map_ind][MapTile_num[map_ind]].setZIndex(present_data[i].ZIndex);
				layer_opacity = present_data[i].Opacity;
			}
		}
		MapTileToBeRemoved[map_ind][MapTile_num[map_ind]].setOpacity(layer_opacity / 100);
		/***********/

		maps[map_ind].addLayer(MapTileToBeRemoved[map_ind][MapTile_num[map_ind]]);
		sel_Opacity_layer[0] = MapTileToBeRemoved[map_ind][MapTile_num[map_ind]];
		MapTile[map_ind][MapTile_num[map_ind]] = layer_content;
		//MapTileToBeRemoved[map_ind][MapTile_num[map_ind]]=RSImage[map_ind];
		MapTile_num[map_ind]++;

		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			var index = viewer.imageryLayers.length;

			var imageryLayer = viewer.imageryLayers.addImageryProvider(
				new Cesium.WebMapTileServiceImageryProvider_M({
					url: layer_content.Url + "{TileMatrix}/{TileRow}/{TileCol}.jpg",
					layer: '',
					style: 'default',
					format: 'image/jpg',
					tileMatrixSetID: 'default028mm',
					minimumLevel: 1,
					maximumLevel: 19,
				}),
				index
			);

			imageryLayers_url_3DCesium[index] = layer_content.Url;
		}



	}

}
function MapTiles2_change_zIndex(layer_id, z_idx) {
	for (var i = 0; i < MapTile_num[map_ind]; i++) {
		if (layer_id.localeCompare(MapTile[map_ind][i].ID) == 0) {
			MapTileToBeRemoved[map_ind][i].setZIndex(z_idx);
		}
	}
}
function MapTiles_Planet(state, layer_content, map_ind) {
	let present_data = window[`All_Check_List_W${map_ind}`];

	if (state == 0) {
		for (i = 0; i < MapTile[map_ind].length; i++) {
			if (MapTile[map_ind][i].ID == layer_content.ID) {
				maps[map_ind].removeLayer(MapTileToBeRemoved[map_ind][i]);

				/*** add ***/
				for (j = i; j < MapTile_num[map_ind]; j++) {
					MapTile[map_ind][j] = MapTile[map_ind][j + 1];
					MapTileToBeRemoved[map_ind][j] = MapTileToBeRemoved[map_ind][j + 1];
				}
				MapTile_num[map_ind]--;
				/***********/
			}
		}
	}
	else {
		MapTileToBeRemoved[map_ind][MapTile_num[map_ind]] = new ol.layer.Tile({
			source: new ol.source.TileImage({
				url:
					layer_content.Url + '{z}/{x}/{y}.png',
				crossOrigin: 'anonymous'
			})
		});

		/*** add ***/
		var layer_opacity = 100;

		for (var i = 0; i < present_data.length; i++) {
			if (present_data[i].ID == layer_content.ID) {
				MapTileToBeRemoved[map_ind][MapTile_num[map_ind]].setZIndex(present_data[i].ZIndex);
				layer_opacity = present_data[i].Opacity;
			}
		}
		MapTileToBeRemoved[map_ind][MapTile_num[map_ind]].setOpacity(layer_opacity / 100);
		/***********/
		maps[map_ind].addLayer(MapTileToBeRemoved[map_ind][MapTile_num[map_ind]]);
		sel_Opacity_layer[0] = MapTileToBeRemoved[map_ind][MapTile_num[map_ind]];
		MapTile[map_ind][MapTile_num[map_ind]] = layer_content;
		MapTile_num[map_ind]++;
	}

}
function MapTiles_SINICA_WMTS(state, layer_content, map_ind) {
	let present_data = window[`All_Check_List_W${map_ind}`];
	WMTS_id = layer_content.Url.split("@")[0];
	format_type = layer_content.Url.split("@")[1];

	if (state == 0) {

		for (i = 0; i < MapTile[map_ind].length; i++) {
			if (MapTile[map_ind][i].ID == layer_content.ID) {
				maps[map_ind].removeLayer(MapTileToBeRemoved[map_ind][i]);
			}
		}
		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			for (var i = 0; i < imageryLayers_url_3DCesium.length; i++) {
				if (imageryLayers_url_3DCesium[i] != null && imageryLayers_url_3DCesium[i].indexOf(WMTS_id) != -1) {
					viewer.imageryLayers.remove(viewer.imageryLayers.get(i));

					imageryLayers_url_3DCesium.splice(i, 1);
					break;
				}
			}
		}
	}
	else {
		//alert(format_type);
		if (format_type == "jpg") {
			// alert(WMTS_id);
			MapTileToBeRemoved[map_ind][MapTile_num[map_ind]] = new ol.layer.Tile({
				source: new ol.source.TileImage({
					tileUrlFunction: function (tileCoord) {
						var z = tileCoord[0];
						var x = tileCoord[1];
						var y = -tileCoord[2] - 1;

						//return "php/WMTS_Tile_Get_jpg.php?TILEMATRIX=" + z + "&TILEROW=" + y + "&TILECOL=" + x + "&LAYER=" + WMTS_id;
						return "https://gis.sinica.edu.tw/tileserver/file-exists.php?img=" + WMTS_id + "-jpg-" + z + "-" + x + "-" + y;


					},
					crossOrigin: 'anonymous'
				})
			});
		} else if (format_type == "png") {
			MapTileToBeRemoved[map_ind][MapTile_num[map_ind]] = new ol.layer.Tile({
				source: new ol.source.TileImage({
					tileUrlFunction: function (tileCoord) {
						var z = tileCoord[0];
						var x = tileCoord[1];
						var y = -tileCoord[2] - 1;



						//return "php/WMTS_Tile_Get_png.php?TILEMATRIX=" + z + "&TILEROW=" + y + "&TILECOL=" + x + "&LAYER=" + WMTS_id;
						return "https://gis.sinica.edu.tw/tileserver/file-exists.php?img=" + WMTS_id + "-png-" + z + "-" + x + "-" + y;
					},
					crossOrigin: 'anonymous'
				})
			});
		}
		//}

		//MapTileToBeRemoved[map_ind][MapTile_num[map_ind]].setZIndex(1);
		/*** add ***/
		var layer_opacity = 100;

		for (var i = 0; i < present_data.length; i++) {
			if (present_data[i].ID == layer_content.ID) {
				MapTileToBeRemoved[map_ind][MapTile_num[map_ind]].setZIndex(present_data[i].ZIndex);
				layer_opacity = present_data[i].Opacity;
			}
		}
		MapTileToBeRemoved[map_ind][MapTile_num[map_ind]].setOpacity(layer_opacity / 100);
		/***********/
		maps[map_ind].addLayer(MapTileToBeRemoved[map_ind][MapTile_num[map_ind]]);
		sel_Opacity_layer[0] = MapTileToBeRemoved[map_ind][MapTile_num[map_ind]];
		MapTile[map_ind][MapTile_num[map_ind]] = layer_content;
		MapTile_num[map_ind]++;

		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			var index = viewer.imageryLayers.length;

			var url_SINICA = "https://gis.sinica.edu.tw/tileserver/file-exists.php?img=" + WMTS_id + "-" + format_type + "-" + "{TileMatrix}-{TileCol}-{TileRow}";
			// var url_SINICA = "php/WMTS_Tile_Get_" + format_type + ".php?TILEMATRIX=" + "{TileMatrix}" + "&TILEROW=" + "{TileRow}" + "&TILECOL=" + "{TileCol}" + "&LAYER=" + WMTS_id;
			var imageryLayer = viewer.imageryLayers.addImageryProvider(
				new Cesium.WebMapTileServiceImageryProvider_SINICA({
					url: url_SINICA,
					layer: '',
					style: 'default',
					format: 'image/' + format_type,
					tileMatrixSetID: 'default028mm',
					minimumLevel: 1,
					maximumLevel: 19,
				}),
				index
			);

			imageryLayers_url_3DCesium[index] = WMTS_id;
		}

	}

}
function MapTiles_GSW(state, layer_content, map_ind) {
	let present_data = window[`All_Check_List_W${map_ind}`];

	if (state == 0) {
		for (i = 0; i < MapTile[map_ind].length; i++) {
			if (MapTile[map_ind][i].ID == layer_content.ID) {
				maps[map_ind].removeLayer(MapTileToBeRemoved[map_ind][i]);

				/*** add ***/
				for (j = i; j < MapTile_num[map_ind]; j++) {
					MapTile[map_ind][j] = MapTile[map_ind][j + 1];
					MapTileToBeRemoved[map_ind][j] = MapTileToBeRemoved[map_ind][j + 1];
				}
				MapTile_num[map_ind]--;
				/***********/
			}
		}

		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			for (var i = 0; i < imageryLayers_url_3DCesium.length; i++) {
				if (imageryLayers_url_3DCesium[i] != null && imageryLayers_url_3DCesium[i].indexOf(layer_content.Url) != -1) {
					viewer.imageryLayers.remove(viewer.imageryLayers.get(i));

					imageryLayers_url_3DCesium.splice(i, 1);
					break;
				}
			}
		}
	}
	else {
		MapTileToBeRemoved[map_ind][MapTile_num[map_ind]] = new ol.layer.Tile({
			source: new ol.source.TileImage({
				tileUrlFunction: function (tileCoord) {

					var z = tileCoord[0];
					var x = -tileCoord[2] - 1;
					var y = tileCoord[1];
					return layer_content.Url + z + '/' + y + '/' + x + '.png';
				},
				crossOrigin: 'anonymous'
			}
			)
		});

		/*** add ***/
		var layer_opacity = 100;

		for (var i = 0; i < present_data.length; i++) {
			if (present_data[i].ID == layer_content.ID) {
				MapTileToBeRemoved[map_ind][MapTile_num[map_ind]].setZIndex(present_data[i].ZIndex);
				layer_opacity = present_data[i].Opacity;
			}
		}
		MapTileToBeRemoved[map_ind][MapTile_num[map_ind]].setOpacity(layer_opacity / 100);
		/***********/
		maps[map_ind].addLayer(MapTileToBeRemoved[map_ind][MapTile_num[map_ind]]);
		sel_Opacity_layer[0] = MapTileToBeRemoved[map_ind][MapTile_num[map_ind]];
		MapTile[map_ind][MapTile_num[map_ind]] = layer_content;
		MapTile_num[map_ind]++;

		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			var index = viewer.imageryLayers.length;

			var imageryLayer = viewer.imageryLayers.addImageryProvider(
				new Cesium.WebMapTileServiceImageryProvider_GSW({
					url: layer_content.Url + "{TileMatrix}/{TileRow}/{TileCol}.png",
					layer: '',
					style: 'default',
					format: 'image/png',
					tileMatrixSetID: 'default028mm',
					minimumLevel: 1,
					maximumLevel: 19,
				}),
				index
			);

			imageryLayers_url_3DCesium[index] = layer_content.Url;
		}
	}

}
function MapTiles_M(state, layer_content, map_ind) {
	let url_array = layer_content.Url.split(';');
	for (let i = 0; i < url_array.length; ++i) {
		layer_content.Url = url_array[i];
		MapTiles2(state, layer_content, map_ind);
	}

}

/* MapTiles_nlsc overlay */
var MapTile_nlsc_num = [0, 0];
var MapTile_nlsc = new Array();
var MapTile_nlscToBeRemoved = new Array();
for (var i = 0; i < 2; i++) {
	MapTile_nlsc[i] = new Array();
	MapTile_nlscToBeRemoved[i] = new Array();
}
function MapTiles_nlsc(state, layer_content, map_ind) {
	let present_data = window[`All_Check_List_W${map_ind}`];

	if (state == 0) {
		for (i = 0; i < MapTile_nlsc_num[map_ind]; i++) {
			if (MapTile_nlsc[map_ind][i].ID == layer_content.ID) {
				maps[map_ind].removeLayer(MapTile_nlscToBeRemoved[map_ind][i]);

				/*** add ***/
				for (j = i; j < MapTile_nlsc_num[map_ind]; j++) {
					MapTile_nlsc[map_ind][j] = MapTile_nlsc[map_ind][j + 1];
					MapTile_nlscToBeRemoved[map_ind][j] = MapTile_nlscToBeRemoved[map_ind][j + 1];
				}
				MapTile_nlsc_num[map_ind]--;
				/***********/
			}
		}

		///////Cesium 3D///////
		if (/*model_3Dchange_index == 1 &&*/ map_ind == 1) {
			for (var i = 0; i < imageryLayers_url_3DCesium.length; i++) {
				if (imageryLayers_url_3DCesium[i] != null && imageryLayers_url_3DCesium[i].indexOf(layer_content.Url) != -1) {
					viewer.imageryLayers.remove(viewer.imageryLayers.get(i));

					imageryLayers_url_3DCesium.splice(i, 1);
					break;
				}
			}
		}
	}
	else {

		MapTile_nlscToBeRemoved[map_ind][MapTile_nlsc_num[map_ind]] = new ol.layer.Tile({
			source: new ol.source.TileImage({
				url: layer_content.Url + '{z}/{y}/{x}',
				crossOrigin: 'anonymous'
			})
		});

		/*** add ***/

		var layer_opacity;

		for (var i = 0; i < present_data.length; i++) {
			if (present_data[i].ID == layer_content.ID) {
				MapTile_nlscToBeRemoved[map_ind][MapTile_nlsc_num[map_ind]].setZIndex(present_data[i].ZIndex);
				layer_opacity = present_data[i].Opacity;
			}
		}

		/***********/


		/*** add ***/
		MapTile_nlscToBeRemoved[map_ind][MapTile_nlsc_num[map_ind]].setOpacity(layer_opacity / 100);
		/***********/

		maps[map_ind].addLayer(MapTile_nlscToBeRemoved[map_ind][MapTile_nlsc_num[map_ind]]);
		sel_Opacity_layer[0] = MapTile_nlscToBeRemoved[map_ind][MapTile_nlsc_num[map_ind]];
		MapTile_nlsc[map_ind][MapTile_nlsc_num[map_ind]] = layer_content;
		//MapTileToBeRemoved[map_ind][MapTile_num[map_ind]]=RSImage[map_ind];
		MapTile_nlsc_num[map_ind]++;
		///////Cesium 3D///////
		if (/*model_3Dchange_index == 1 &&*/ map_ind == 1) {
			var index = viewer.imageryLayers.length;

			var imageryLayer = viewer.imageryLayers.addImageryProvider(
				new Cesium.WebMapTileServiceImageryProvider_GSW({
					url: layer_content.Url + "{TileMatrix}/{TileCol}/{TileRow}",
					layer: '',
					style: 'default',
					format: 'image/png',
					tileMatrixSetID: 'default028mm',
					minimumLevel: 1,
					maximumLevel: 19,
				}),
				index
			);

			imageryLayers_url_3DCesium[index] = layer_content.Url;
		}

	}

}
function MapTiles_nlsc_change_zIndex(layer_id, z_idx) {
	for (var i = 0; i < MapTile_num[map_ind]; i++) {
		if (layer_id.localeCompare(MapTile[map_ind][i].ID) === 0) {
			MapTileToBeRemoved[map_ind][i].setZIndex(z_idx);
		}
	}
}

function MapTiles_spot(state, layer_content, map_ind) {
	if (state == 0) {
		for (i = 0; i < MapTile[map_ind].length; i++) {
			if (MapTile[map_ind][i].ID == layer_content.ID) {
				maps[map_ind].removeLayer(MapTileToBeRemoved[map_ind][i]);
			}
		}
	}
	else {
		z_level = layer_content.PosInfo.split(";")[2];
		MapTileToBeRemoved[map_ind][MapTile_num[map_ind]] = new ol.layer.Tile({
			source: new ol.source.TileImage({
				tileUrlFunction: function (tileCoord) {
					var z = tileCoord[0];
					var x = tileCoord[1];
					var y = -tileCoord[2] - 1;
					if (z < z_level) {
						return layer_content.Url + z + '/' + x + '/' + y + '.png';
					} else {
						return "https://noserver/" + z + '/' + x + '/' + y + '.png';
					}
				},
				crossOrigin: 'anonymous'
			})
		});

		//}	
		MapTileToBeRemoved[map_ind][MapTile_num[map_ind]].setZIndex(1);
		maps[map_ind].addLayer(MapTileToBeRemoved[map_ind][MapTile_num[map_ind]]);
		sel_Opacity_layer[0] = MapTileToBeRemoved[map_ind][MapTile_num[map_ind]];
		MapTile[map_ind][MapTile_num[map_ind]] = layer_content;
		//MapTileToBeRemoved[map_ind][MapTile_num[map_ind]]=RSImage[map_ind];
		MapTile_num[map_ind]++;
	}
}

function MapTiles_WMS_moeacgs(state, layer_content, map_ind) {
	if (state == 0) {
		for (i = 0; i < MapTile[map_ind].length; i++) {
			if (MapTile[map_ind][i].ID == layer_content.ID) {
				maps[map_ind].removeLayer(MapTileToBeRemoved[map_ind][i]);
			}
		}
	}
	else {
		alert("此圖層為WMS介接，讀取時間較為長，請耐心等候!")
		z_level = layer_content.PosInfo.split(";")[2];
		MapTileToBeRemoved[map_ind][MapTile_num[map_ind]] = new ol.layer.Image({
			source: new ol.source.ImageWMS({
			url: 'php/wms_moeacgs.php',
			params: { 'LAYERS': layer_content.Url },
			projection: 'EPSG:4326',
			serverType: 'geoserver',
			crossOrigin: 'anonymous'
			})
		});

		//}	
		MapTileToBeRemoved[map_ind][MapTile_num[map_ind]].setZIndex(1000);
		maps[map_ind].addLayer(MapTileToBeRemoved[map_ind][MapTile_num[map_ind]]);
		sel_Opacity_layer[0] = MapTileToBeRemoved[map_ind][MapTile_num[map_ind]];
		MapTile[map_ind][MapTile_num[map_ind]] = layer_content;
		//MapTileToBeRemoved[map_ind][MapTile_num[map_ind]]=RSImage[map_ind];
		MapTile_num[map_ind]++;
	}
}

/* 3D model overlay */
var Model_Map3DModel_num = [0, 0];
var Model_Map3DModel = new Array();
var Map3DModelToBeRemoved_num = [0, 0];
var Map3DModelToBeRemoved = new Array();
var Opacity3DModel = new Array();
var Opacity3DModelId = new Array();
var model_show_ind = 0;
for (var i = 0; i < 2; i++) {
	Model_Map3DModel[i] = new Array();
	Map3DModelToBeRemoved[i] = new Array();
	Opacity3DModel[i] = new Array();
	Opacity3DModelId[i] = new Array();
}
function Map3DModel(state, layer_content, map_ind) {
	if (state == 0) {
		// for (i = 0; i < Model_Map3DModel[map_ind].length; i++) {
		// 	if (Model_Map3DModel[map_ind][i].ID == layer_content.ID) {
		// 		Map3DModelToBeRemoved[map_ind][i].show = false;
		// 	}
		// }
		///////Cesium 3D///////
		for (var i = 0; i < tilesets_url_3DCesium.length; i++) {
			if (tilesets_url_3DCesium[i]['_url'].indexOf(layer_content.Url) != -1) {
				viewer.scene.primitives.remove(tilesets_url_3DCesium[i])
				tilesets_url_3DCesium.splice(i, 1)
				break;
			}
		}
	}
	else {
		// for (i = 0; i < Model_Map3DModel[map_ind].length; i++) {
		// 	if (Model_Map3DModel[map_ind][i].ID == layer_content.ID) {

		// 		Map3DModelToBeRemoved[map_ind][i].show = true;
		// 		model_show_ind = 1;
		// 		break;
		// 	}
		// }
		// if (model_show_ind == 0) {
		// 	swal("3D模型初始化", "首次載入此模型，需較久處理時間，請稍後...", "warning");
		// 	Map3DModelToBeRemoved[map_ind][Model_Map3DModel_num[map_ind]] = new Cesium.Cesium3DTileset({
		// 		url: layer_content.Url
		// 	});
		// 	scene.primitives.add(Map3DModelToBeRemoved[map_ind][Model_Map3DModel_num[map_ind]]);
		// 	Model_Map3DModel[map_ind][Model_Map3DModel_num[map_ind]] = layer_content;
		// 	Model_Map3DModel_num[map_ind]++;
		// }
		// model_show_ind = 0;
		///////Cesium 3D///////
		for (var i = 0; i < tilesets_url_3DCesium.length; i++) {
			if (tilesets_url_3DCesium[i]['_url'].indexOf(layer_content.ID) != -1) {
				console.log("exist!")
				model_show_ind = 1;
				break;
			}
		}
		if (model_show_ind == 0) {
			var Map3DModel = new Cesium.Cesium3DTileset({
				url: layer_content.Url + "/tileset.json",
			});
			viewer.scene.primitives.add(Map3DModel);
			tilesets_url_3DCesium.push(Map3DModel);
		}
		model_show_ind = 0;
	}

}
function Map3DModel_change_zIndex(layer_id, z_idx) {

	for (var i = 0; i < Model_Map3DModel_num[map_ind]; i++) {
		if (layer_id.localeCompare(Model_Map3DModel[map_ind][i].ID) === 0) {
			Map3DModelToBeRemoved[map_ind][i].setZIndex(z_idx);
		}
	}
}

/* DKML */
var KmlTile_Present_Color_Vector = new Array();
var KmlTile_Present_Thickness_Vector = new Array();
var KmlTile_Present_Opacity_Vector = new Array();
var OpacityKmlTile = new Array();
var OpacityKmlTileId = new Array();
var linkurl_DKML = [];
var VectorToBeRemoved_num = [0, 0];
var VectorToBeRemoved = new Array();
var BaseLayer_Vector_num = [0, 0];
var BaseLayer_Vector = new Array();
for (var i = 0; i < 2; i++) {
	KmlTile_Present_Color_Vector[i] = new Array();
	KmlTile_Present_Thickness_Vector[i] = new Array();
	KmlTile_Present_Opacity_Vector[i] = new Array();
	OpacityKmlTile[i] = new Array();
	OpacityKmlTileId[i] = new Array();
	VectorToBeRemoved[i] = new Array();
	BaseLayer_Vector[i] = new Array();
}
function toggleDKML(state, layer_content, map_ind) {
	linkurl_DKML[map_ind] = layer_content;

	let present_layer_data = window[`All_Check_List_W${map_ind}`];

	if (state == 0) {
		for (var i = 0; i < BaseLayer_Vector_num[map_ind]; i++) {
			if (linkurl_DKML[map_ind].ID.localeCompare(BaseLayer_Vector[map_ind][i].ID) == 0) {
				for (var r = 0; r < VectorToBeRemoved_num[map_ind]; r++) {
					if (OpacityKmlTileId[map_ind][r].localeCompare(linkurl_DKML[map_ind].ID) == 0) {
						maps[map_ind].removeLayer(VectorToBeRemoved[map_ind][r]);
						VectorToBeRemoved[map_ind].splice(r, 1);
						OpacityKmlTile[map_ind].splice(r, 1);
						OpacityKmlTileId[map_ind].splice(r, 1);
						r--;
						VectorToBeRemoved_num[map_ind]--;

					}
				}

				BaseLayer_Vector[map_ind].splice(i, 1);
				KmlTile_Present_Color_Vector[map_ind].splice(i, 1);
				KmlTile_Present_Thickness_Vector[map_ind].splice(i, 1);
				KmlTile_Present_Opacity_Vector[map_ind].splice(i, 1);
				BaseLayer_Vector_num[map_ind]--;

				layer_legend_delete(linkurl_DKML[map_ind].ID);
			}
		}
	}
	else {
		var Zoom = maps[map_ind].getView().getZoom();
		var extent = maps[map_ind].getView().calculateExtent(maps[map_ind].getSize());
		var bottomLeft = ol.extent.getBottomLeft(extent);
		var bottomLeftGeo = ol.proj.transform(bottomLeft, 'EPSG:3857', 'EPSG:4326');
		var bottomLeftTile = Geo2Tile(bottomLeftGeo, map_ind);
		var bottom = parseInt(Math.floor(bottomLeftTile[1])) + 1;
		var left = parseInt(Math.floor(bottomLeftTile[0]));
		var topRight = ol.extent.getTopRight(extent);
		var topRightGeo = ol.proj.transform(topRight, 'EPSG:3857', 'EPSG:4326');
		var topRightTile = Geo2Tile(topRightGeo, map_ind);
		var top = parseInt(Math.floor(topRightTile[1])) + 1;
		var right = parseInt(Math.floor(topRightTile[0]));

		/*** add ***/
		var now_vector_id = linkurl_DKML[map_ind].ID;

		var temp_color;
		var thickness;
		var opacity;
		var z_idx;

		for (var i = 0; i < present_layer_data.length; i++) {
			if (present_layer_data[i].ID == now_vector_id) {
				temp_color = present_layer_data[i].Color.toString().replace("#", "");
				thickness = present_layer_data[i].Thickness;
				opacity = present_layer_data[i].Opacity;
				z_idx = present_layer_data[i].ZIndex;
				/*** add ***/
				layer_legend_add(now_vector_id, present_layer_data[i].FileName, present_layer_data[i].Color.toString(), "", thickness, opacity);
				/**********/
			}
		}

		prev_layer_color = Color6to8(temp_color)

		sel_Opacity_layer = [];

		for (var j = top; j <= bottom; j++) {
			for (var i = left; i <= right; i++) {
				/****** add ******/
				var layer_source = new ol.source.Vector({
					format: new ol.format.KML(),
					loader: (function (i_, j_) {
						return function (extent, resolution, projection) {
							$.ajax({
								url: linkurl_DKML[map_ind].Url + Zoom + '/' + j_ + '/' + i_ + '.kml',
								type: 'GET',
								dataType: 'xml',
								timeout: 1000,
								async: false,
								success: function (xml) {
									$(xml).find("Style").each(function (i) {
										if ($(this).attr('id') == 'polyline_n') {
											$(this).children("LineStyle").children("color").text(prev_layer_color)
											$(this).children("LineStyle").children("width").text(thickness)
										}
									})
									var features = new ol.format.KML().readFeatures(xml, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
									layer_source.addFeatures(features)
								},
								error: function (xml) {
									//console.log('讀取kml錯誤' + xml);
								}
							});
						};
					}(i, j)),
					crossOrigin: 'anonymous'
				});


				BaseLayer[map_ind] = new ol.layer.Vector({
					source: layer_source
				});

				/*****************/

				BaseLayer[map_ind].setZIndex(z_idx);
				BaseLayer[map_ind].setOpacity(opacity / 100);

				maps[map_ind].addLayer(BaseLayer[map_ind]);

				VectorToBeRemoved_num[map_ind]++;
				VectorToBeRemoved[map_ind].push(BaseLayer[map_ind]);
				sel_Opacity_layer.push(BaseLayer[map_ind]);
				OpacityKmlTile[map_ind].push(BaseLayer[map_ind]);
				OpacityKmlTileId[map_ind].push(linkurl_DKML[map_ind].ID);
			}

		}

		BaseLayer_Vector[map_ind][BaseLayer_Vector_num[map_ind]] = linkurl_DKML[map_ind];
		KmlTile_Present_Color_Vector[map_ind][BaseLayer_Vector_num[map_ind]] = prev_layer_color;
		KmlTile_Present_Thickness_Vector[map_ind][BaseLayer_Vector_num[map_ind]] = thickness;
		KmlTile_Present_Opacity_Vector[map_ind][BaseLayer_Vector_num[map_ind]] = opacity;
		BaseLayer_Vector_num[map_ind]++;


		maps[map_ind].on('moveend', KmlTile_on_map_moveend);
	}

}
function KmlTile_on_map_moveend() {
	let present_layer_data = window[`All_Check_List_W${map_ind}`];

	sel_Opacity_layer = [];
	for (var i = 0; i < VectorToBeRemoved_num[map_ind]; i++) {
		maps[map_ind].removeLayer(VectorToBeRemoved[map_ind][i]);
	}

	var Zoom = maps[map_ind].getView().getZoom();
	var extent = maps[map_ind].getView().calculateExtent(maps[map_ind].getSize());
	var bottomLeft = ol.extent.getBottomLeft(extent);
	var bottomLeftGeo = ol.proj.transform(bottomLeft, 'EPSG:3857', 'EPSG:4326');
	var bottomLeftTile = Geo2Tile(bottomLeftGeo, map_ind);
	var bottom = parseInt(Math.floor(bottomLeftTile[1])) + 1;
	var left = parseInt(Math.floor(bottomLeftTile[0]));
	var topRight = ol.extent.getTopRight(extent);
	var topRightGeo = ol.proj.transform(topRight, 'EPSG:3857', 'EPSG:4326');
	var topRightTile = Geo2Tile(topRightGeo, map_ind);
	var top = parseInt(Math.floor(topRightTile[1])) + 1;
	var right = parseInt(Math.floor(topRightTile[0]));

	//alert(BaseLayer_Vector_num[map_ind]);
	VectorToBeRemoved_num[map_ind] = 0;
	VectorToBeRemoved[map_ind] = [];
	/*** add ***/
	OpacityKmlTile[map_ind] = [];
	OpacityKmlTileId[map_ind] = [];
	/***********/
	HTML[map_ind] = '';



	for (var k = 0; k < BaseLayer_Vector_num[map_ind]; k++) {

		var now_vector_id = BaseLayer_Vector[map_ind][k].ID;
		var z_idx;

		for (var i = 0; i < present_layer_data.length; i++) {
			if (present_layer_data[i].ID.localeCompare(now_vector_id) == 0) {
				z_idx = present_layer_data[i].ZIndex
			}
		}

		moveend_draw_layer(BaseLayer_Vector[map_ind][k], k, top, bottom, left, right, Zoom, z_idx);

	}

}
function KmlTile_color_picker_onChange(layer_id, prev_layer_color, thickness, opacity, z_idx) {
	for (var i = 0; i < BaseLayer_Vector_num[map_ind]; i++) {
		var now_vector_id = BaseLayer_Vector[map_ind][i].ID;

		if (layer_id.localeCompare("layer_color_picker" + now_vector_id) == 0) {
			linkurl_DKML[map_ind] = BaseLayer_Vector[map_ind][i];

			console.log("clear = " + now_vector_id);

			for (var r = 0; r < VectorToBeRemoved_num[map_ind]; r++) {
				if (OpacityKmlTileId[map_ind][r].localeCompare(linkurl_DKML[map_ind].ID) == 0) {
					maps[map_ind].removeLayer(VectorToBeRemoved[map_ind][r]);
					VectorToBeRemoved[map_ind].splice(r, 1);
					OpacityKmlTileId[map_ind].splice(r, 1);
					r--;
					VectorToBeRemoved_num[map_ind]--;

				}
			}

			for (var j = i; j < BaseLayer_Vector_num[map_ind]; j++) {
				BaseLayer_Vector[map_ind][j] = BaseLayer_Vector[map_ind][j + 1];
				KmlTile_Present_Color_Vector[map_ind][j] = KmlTile_Present_Color_Vector[map_ind][j + 1];
				KmlTile_Present_Thickness_Vector[map_ind][j] = KmlTile_Present_Thickness_Vector[map_ind][j + 1];
				KmlTile_Present_Opacity_Vector[map_ind][j] = KmlTile_Present_Opacity_Vector[map_ind][j + 1];
			}
			BaseLayer_Vector_num[map_ind]--;
		}
	}



	var Zoom = maps[map_ind].getView().getZoom();
	var extent = maps[map_ind].getView().calculateExtent(maps[map_ind].getSize());
	var bottomLeft = ol.extent.getBottomLeft(extent);
	var bottomLeftGeo = ol.proj.transform(bottomLeft, 'EPSG:3857', 'EPSG:4326');
	var bottomLeftTile = Geo2Tile(bottomLeftGeo, map_ind);
	var bottom = parseInt(Math.floor(bottomLeftTile[1])) + 1;
	var left = parseInt(Math.floor(bottomLeftTile[0]));
	var topRight = ol.extent.getTopRight(extent);
	var topRightGeo = ol.proj.transform(topRight, 'EPSG:3857', 'EPSG:4326');
	var topRightTile = Geo2Tile(topRightGeo, map_ind);
	var top = parseInt(Math.floor(topRightTile[1])) + 1;
	var right = parseInt(Math.floor(topRightTile[0]));

	HTML[map_ind] = '';

	for (var j = top; j <= bottom; j++) {
		for (var i = left; i <= right; i++) {

			ThisURL[map_ind] = linkurl_DKML[map_ind].Url + Zoom + '/' + j + '/' + i + '.kml';
			HTML[map_ind] += ThisURL[map_ind];
			HTML[map_ind] += '</br>';

			/****** add ******/
			var layer_source = new ol.source.Vector({
				format: new ol.format.KML(),
				loader: (function (i_, j_, linkurl_DKML_, prev_layer_color_, thickness_) {
					return function (extent, resolution, projection) {

						$.ajax({
							url: linkurl_DKML_ + Zoom + '/' + j_ + '/' + i_ + '.kml',
							type: 'GET',
							dataType: 'xml',
							timeout: 1000,
							async: false,
							success: function (xml) {
								$(xml).find("Style").each(function (i) {
									if ($(this).attr('id') == 'polyline_n') {
										$(this).children("LineStyle").children("color").text(prev_layer_color_)
										$(this).children("LineStyle").children("width").text(thickness_)
									}
								})
								var features = new ol.format.KML().readFeatures(xml, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
								layer_source.addFeatures(features)
							},
							error: function (xml) {
								//console.log('讀取kml錯誤' + xml);
							}
						});

					};
				}(i, j, linkurl_DKML[map_ind].Url, prev_layer_color, thickness)),
				crossOrigin: 'anonymous'
			});


			BaseLayer[map_ind] = new ol.layer.Vector({
				source: layer_source
			});

			BaseLayer[map_ind].setZIndex(z_idx);
			BaseLayer[map_ind].setOpacity(opacity / 100);
			/*****************/



			maps[map_ind].addLayer(BaseLayer[map_ind]);
			VectorToBeRemoved_num[map_ind]++;
			VectorToBeRemoved[map_ind].push(BaseLayer[map_ind]);
			/*** add ***/
			OpacityKmlTile[map_ind].push(BaseLayer[map_ind]);
			OpacityKmlTileId[map_ind].push(linkurl_DKML[map_ind].ID);

			/***********/
		}

	}

	BaseLayer_Vector[map_ind][BaseLayer_Vector_num[map_ind]] = linkurl_DKML[map_ind];
	KmlTile_Present_Color_Vector[map_ind][BaseLayer_Vector_num[map_ind]] = prev_layer_color;
	KmlTile_Present_Thickness_Vector[map_ind][BaseLayer_Vector_num[map_ind]] = thickness;
	KmlTile_Present_Opacity_Vector[map_ind][BaseLayer_Vector_num[map_ind]] = opacity;
	BaseLayer_Vector_num[map_ind]++;

}
function moveend_draw_layer(BaseLayer_Link, k, top, bottom, left, right, Zoom, z_idx) {
	linkurl_DKML[map_ind] = BaseLayer_Link;

	console.log(linkurl_DKML[map_ind]);


	for (var j = top; j <= bottom; j++) {
		for (var i = left; i <= right; i++) {

			/****** add ******/

			var layer_source = new ol.source.Vector({
				format: new ol.format.KML(),
				loader: (function (i_, j_, k_, linkurl_DKML_) {
					return function (extent, resolution, projection) {
						$.ajax({
							url: linkurl_DKML_ + Zoom + '/' + j_ + '/' + i_ + '.kml',
							type: 'GET',
							dataType: 'xml',
							timeout: 1000,
							async: false,
							success: function (xml) {
								$(xml).find("Style").each(function (i) {
									if ($(this).attr('id') == 'polyline_n') {
										$(this).children("LineStyle").children("color").text(KmlTile_Present_Color_Vector[map_ind][k_])
										$(this).children("LineStyle").children("width").text(KmlTile_Present_Thickness_Vector[map_ind][k_])
									}
								})
								var features = new ol.format.KML().readFeatures(xml, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
								layer_source.addFeatures(features)
							},
							error: function (xml) {
								//console.log('讀取kml錯誤' + xml);
							}
						});
					};
				}(i, j, k, linkurl_DKML[map_ind].Url)),
				crossOrigin: 'anonymous'
			});

			BaseLayer[map_ind] = new ol.layer.Vector({
				source: layer_source
			});

			BaseLayer[map_ind].setZIndex(z_idx);
			BaseLayer[map_ind].setOpacity(KmlTile_Present_Opacity_Vector[map_ind][k] / 100);
			maps[map_ind].addLayer(BaseLayer[map_ind]);
			VectorToBeRemoved[map_ind].push(BaseLayer[map_ind]);
			VectorToBeRemoved_num[map_ind]++;
			OpacityKmlTile[map_ind].push(BaseLayer[map_ind]);
			OpacityKmlTileId[map_ind].push(linkurl_DKML[map_ind].ID);
		}
	}


}
function DKML_change_zIndex(layer_id, z_idx) {
	for (var i = 0; i < OpacityKmlTileId[map_ind].length; i++) {
		if (layer_id.localeCompare(OpacityKmlTileId[map_ind][i].ID) === 0) {
			VectorToBeRemoved[map_ind][i].setZIndex(z_idx);
		}
	}
}

/* KML */
var linkurl_KML = [];
var BaseLayer_KML_num = [0, 0];
var BaseLayer_KML = new Array();
var KMLToBeRemoved_num = [0, 0];
var KMLToBeRemoved = new Array();
var Kml_Present_Color_Vector = new Array();
var Kml_Present_FillColor_Vector = new Array();
var Kml_Present_Thickness_Vector = new Array();
var Kml_Present_Opacity_Vector = new Array();
var OpacityKml = new Array();
var OpacityKmlId = new Array();
for (var i = 0; i < 2; i++) {
	BaseLayer_KML[i] = new Array();
	KMLToBeRemoved[i] = new Array();
	Kml_Present_Color_Vector[i] = new Array();
	Kml_Present_FillColor_Vector[i] = new Array();
	Kml_Present_Thickness_Vector[i] = new Array();
	Kml_Present_Opacity_Vector[i] = new Array();
	OpacityKml[i] = new Array();
	OpacityKmlId[i] = new Array();
}
function toggleKML(state, layer_content, map_ind) {
	//linkurl_KML[map_ind] = layer_content;

	let present_layer_data = window[`All_Check_List_W${map_ind}`];

	if (state == 0) {
		for (var i = 0; i < KMLToBeRemoved_num[map_ind]; i++) {
			if (layer_content.ID == BaseLayer_KML[map_ind][i].ID) {

				maps[map_ind].removeLayer(KMLToBeRemoved[map_ind][i]);
				KMLToBeRemoved_num[map_ind]--;
				KMLToBeRemoved[map_ind].splice(i, 1);
				BaseLayer_KML[map_ind].splice(i, 1);
				Kml_Present_FillColor_Vector[map_ind].splice(i, 1);
				Kml_Present_Color_Vector[map_ind].splice(i, 1);
				Kml_Present_Thickness_Vector[map_ind].splice(i, 1);
				Kml_Present_Opacity_Vector[map_ind].splice(i, 1);

				BaseLayer_KML_num[map_ind]--;

				OpacityKml[map_ind].splice(i, 1);
				OpacityKmlId[map_ind].splice(i, 1);

				layer_legend_delete(layer_content.ID);
			}
		}

		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			for (i = 0; i < dataSources_url_3DCesium.length; i++) {
				if (layer_content.Url == dataSources_url_3DCesium[i]) {
					console.log(i)
					console.log(dataSources_url_3DCesium[i])
					viewer.dataSources.remove(viewer.dataSources.get(i), true)
					dataSources_url_3DCesium.splice(i, 1)
					console.log(dataSources_url_3DCesium)
					break
				}
			}

		}
	}
	else {
		let now_vector_id = layer_content.ID;
		let temp_color;
		let temp_fill_color;
		let thickness;
		let opacity;
		let z_idx;

		for (let i = 0; i < present_layer_data.length; i++) {
			if (present_layer_data[i].ID == now_vector_id) {
				temp_color = present_layer_data[i].Color.toString().replace("#", "");
				thickness = present_layer_data[i].Thickness;
				opacity = present_layer_data[i].Opacity;
				temp_fill_color = present_layer_data[i].FillColor.toString().replace("#", "");
				z_idx = present_layer_data[i].ZIndex;

				layer_legend_add(now_vector_id, present_layer_data[i].FileName, present_layer_data[i].Color.toString(),
					present_layer_data[i].FillColor.toString(), thickness, opacity);

			}
		}
		let prev_layer_color = Color6to8(temp_color)
		let prev_layer_fillcolor = Color6to8(temp_fill_color)

		var layer_source = new ol.source.Vector({
			format: new ol.format.KML(),
			loader: (function () {
				return function (extent, resolution, projection) {
					$.ajax({
						url: layer_content.Url,
						type: 'GET',
						dataType: 'xml',
						timeout: 1000,
						async: false,
						success: function (xml) {
							$(xml).find("Style").each(function (i) {
								$(this).children("LineStyle").children("color").text(prev_layer_color)
								$(this).children("PolyStyle").children("color").text(prev_layer_fillcolor)
								$(this).children("LineStyle").children("width").text(thickness)/*** fixed ***/
							})
							var features = new ol.format.KML().readFeatures(xml, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
							layer_source.addFeatures(features)
						},
						error: function (xml) {
							//console.log('讀取kml錯誤' + xml);
						}
					});
				};
			}()),
			crossOrigin: 'anonymous'
		});

		BaseLayer[map_ind] = new ol.layer.Vector({
			source: layer_source
			//declutter: true
		});



		/***********/
		BaseLayer[map_ind].set('altitudeMode', 'clampToGround');
		maps[map_ind].addLayer(BaseLayer[map_ind]);
		KMLToBeRemoved_num[map_ind]++;
		KMLToBeRemoved[map_ind].push(BaseLayer[map_ind]);

		/*** add ***/
		OpacityKml[map_ind].push(BaseLayer[map_ind]);
		OpacityKmlId[map_ind].push(layer_content.ID);
		BaseLayer[map_ind].setZIndex(z_idx);
		BaseLayer[map_ind].setOpacity(opacity / 100)
		/***********/
		BaseLayer_KML[map_ind][BaseLayer_KML_num[map_ind]] = layer_content;
		/*** add ***/
		Kml_Present_FillColor_Vector[map_ind][BaseLayer_KML_num[map_ind]] = prev_layer_fillcolor;
		Kml_Present_Color_Vector[map_ind][BaseLayer_KML_num[map_ind]] = prev_layer_color;
		Kml_Present_Thickness_Vector[map_ind][BaseLayer_KML_num[map_ind]] = thickness;
		Kml_Present_Opacity_Vector[map_ind][BaseLayer_KML_num[map_ind]] = opacity;
		BaseLayer_KML_num[map_ind]++;

		////////Cesium 3D/////////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			var dataSource = Cesium.KmlDataSource.load(
				layer_content.Url,
				{
					camera: viewer.scene.camera,
					canvas: viewer.scene.canvas,
					clampToGround: true,
				}
			);
			viewer.dataSources.add(dataSource);
			//   linkurl_3DCesium_KML.splice(0, 0, linkurl_KML[map_ind])
			dataSources_url_3DCesium.push(layer_content.Url)
		}
	}
}
function Kml_color_picker_onChange(layer_id, prev_layer_fillcolor, prev_layer_color, thickness, opacity, z_idx) {

	for (var i = 0; i < KMLToBeRemoved_num[map_ind]; i++) {

		let temp_id = BaseLayer_KML[map_ind][i].ID;

		if (layer_id.localeCompare("layer_color_picker" + temp_id) == 0 || layer_id.localeCompare("layer_fillcolor_picker" + temp_id) == 0) {

			maps[map_ind].removeLayer(KMLToBeRemoved[map_ind][i]);
			KMLToBeRemoved[map_ind].splice(i, 1);
			/*** add ***/
			OpacityKml[map_ind].splice(i, 1);
			OpacityKmlId[map_ind].splice(i, 1);
			/***********/
			KMLToBeRemoved_num[map_ind]--;

			ThisURL[map_ind] = BaseLayer_KML[map_ind][i];

			for (var j = i; j < BaseLayer_KML_num[map_ind]; j++) {
				BaseLayer_KML[map_ind][j] = BaseLayer_KML[map_ind][j + 1];
				Kml_Present_Color_Vector[map_ind][j] = Kml_Present_Color_Vector[map_ind][j + 1];
				Kml_Present_FillColor_Vector[map_ind][j] = Kml_Present_FillColor_Vector[map_ind][j + 1];
				Kml_Present_Thickness_Vector[map_ind][j] = Kml_Present_Thickness_Vector[map_ind][j + 1];
				Kml_Present_Opacity_Vector[map_ind][j] = Kml_Present_Opacity_Vector[map_ind][j + 1];
			}
			BaseLayer_KML_num[map_ind]--;

			var layer_source = new ol.source.Vector({
				format: new ol.format.KML(),
				loader: (function () {
					return function (extent, resolution, projection) {
						$.ajax({
							url: ThisURL[map_ind].Url,
							type: 'GET',
							dataType: 'xml',
							timeout: 1000,
							async: false,
							success: function (xml) {
								$(xml).find("Style").each(function (i) {
									$(this).children("LineStyle").children("color").text(prev_layer_color)
									$(this).children("PolyStyle").children("color").text(prev_layer_fillcolor)
									$(this).children("LineStyle").children("width").text(thickness)/*** add ***/
								})
								var features = new ol.format.KML().readFeatures(xml, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
								layer_source.addFeatures(features)
							},
							error: function (xml) {
								//console.log('讀取kml錯誤' + xml);
							}
						});
					};
				}()),
				crossOrigin: 'anonymous'
			});

			BaseLayer[map_ind] = new ol.layer.Vector({
				source: layer_source
			});

			BaseLayer[map_ind].setZIndex(z_idx);
			maps[map_ind].addLayer(BaseLayer[map_ind]);
			KMLToBeRemoved_num[map_ind]++;
			KMLToBeRemoved[map_ind].push(BaseLayer[map_ind]);
			/*** add ***/
			OpacityKml[map_ind].push(BaseLayer[map_ind]);
			console.log('BaseLayer_KML[map_ind][i].ID', BaseLayer_KML[map_ind][i])
			OpacityKmlId[map_ind].push(ThisURL[map_ind].ID);
			BaseLayer[map_ind].setOpacity(opacity / 100);
			/***********/

			BaseLayer_KML[map_ind][BaseLayer_KML_num[map_ind]] = ThisURL[map_ind];
			Kml_Present_FillColor_Vector[map_ind][BaseLayer_KML_num[map_ind]] = prev_layer_fillcolor;
			Kml_Present_Color_Vector[map_ind][BaseLayer_KML_num[map_ind]] = prev_layer_color;
			Kml_Present_Thickness_Vector[map_ind][BaseLayer_KML_num[map_ind]] = thickness;
			Kml_Present_Opacity_Vector[map_ind][BaseLayer_KML_num[map_ind]] = opacity;
			BaseLayer_KML_num[map_ind]++;

		}
	}

}
function KML_change_zIndex(layer_id, z_idx) {
	for (var i = 0; i < BaseLayer_KML_num[map_ind]; i++) {
		if (layer_id.localeCompare(BaseLayer_KML[map_ind][i].ID) === 0) {
			KMLToBeRemoved[map_ind][i].setZIndex(z_idx);
		}
	}
}



/* KML Color */
var linkurl_KMLC = [];
var BaseLayer_KMLC_num = [0, 0];
var BaseLayer_KMLC = new Array();
var KMLCToBeRemoved_num = [0, 0];
var KMLCToBeRemoved = new Array();
var BaseLayer_KMLC_style = new Array();
var KmlC_Present_Color_Vector = new Array();
var KmlC_Present_Thickness_Vector = new Array();
var KmlC_Present_Opacity_Vector = new Array();
for (var i = 0; i < 2; i++) {
	BaseLayer_KMLC[i] = new Array();
	KMLCToBeRemoved[i] = new Array();
	BaseLayer_KMLC_style[i] = new Array();
	KmlC_Present_Color_Vector[i] = new Array();
	KmlC_Present_Thickness_Vector[i] = new Array();
	KmlC_Present_Opacity_Vector[i] = new Array();
}
function toggleKml_color(state, layer_content, map_ind) {
	//alert(id);

	let present_layer_data = window[`All_Check_List_W${map_ind}`];
	var prev_kml_color;
	var prev_fill_color;
	var thickness;
	var opacity, fill_opacity;
	var z_idx;
	//var now_vector_id = layer_content.ID;

	for (var i = 0; i < present_layer_data.length; i++) {
		if (present_layer_data[i].ID == layer_content.ID) {
			prev_kml_color = present_layer_data[i].Color;
			thickness = present_layer_data[i].Thickness;
			opacity = present_layer_data[i].Opacity;
			prev_fill_color = present_layer_data[i].FillColor;
			z_idx = present_layer_data[i].ZIndex;
			fill_opacity = present_layer_data[i].FillOpacity;

			layer_legend_add(layer_content.ID, present_layer_data[i].FileName, present_layer_data[i].Color.toString(),
				present_layer_data[i].FillColor.toString(), thickness, opacity);

		}
	}
	
	//linkurl_KMLC[map_ind] = id;
	var getText = function (feature, resolution) {
		var maxResolution = 15;
		var text = feature.get('name');

		if (resolution > maxResolution) {
			text = '';
		}
		return text;
	};
	var Kml_style = function (feature, resolution) {
		return new ol.style.Style({
			/*** add 20190522 ***/
			fill: new ol.style.Fill({
				color: prev_fill_color + OpatoHex(fill_opacity)
			}),
			stroke: new ol.style.Stroke({
				color: prev_kml_color,
				width: thickness
			}),
			text: new ol.style.Text({
				textAlign: 'center',
				textBaseline: 'middle',
				font: 'normal 16px 微軟正黑體',
				text: getText(feature, resolution),
				fill: new ol.style.Fill({ color: '#AA0000', width: 4 }),
				stroke: new ol.style.Stroke({ color: '#FFFFFF', width: 3 }),
				offsetX: 0,
				offsetY: 12,
				placement: 'Line',
				maxAngle: '0.7853981633974483',
				rotation: 0.0
			})
		});
	}




	if (state == 0) {

		for (i = 0; i < KMLCToBeRemoved_num[map_ind]; i++) {
			//alert(BaseLayer_KMLC[map_ind][i].ID);
			if (layer_content.ID == BaseLayer_KMLC[map_ind][i].ID) {
				//alert(987);
				maps[map_ind].removeLayer(KMLCToBeRemoved[map_ind][i]);
				//alert(985);
				KMLCToBeRemoved_num[map_ind]--;
				KMLCToBeRemoved[map_ind].splice(i, 1);
				BaseLayer_KMLC[map_ind].splice(i, 1);
				KmlC_Present_Color_Vector[map_ind].splice(i, 1);
				KmlC_Present_Thickness_Vector[map_ind].splice(i, 1);
				KmlC_Present_Opacity_Vector[map_ind].splice(i, 1);

				BaseLayer_KMLC_num[map_ind]--;

			}
		}

		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			for (i = 0; i < dataSources_url_3DCesium.length; i++) {
				if (layer_content.Url == dataSources_url_3DCesium[i]) {
					console.log(i)
					console.log(dataSources_url_3DCesium[i])
					viewer.dataSources.remove(viewer.dataSources.get(i), true)
					dataSources_url_3DCesium.splice(i, 1)
					console.log(dataSources_url_3DCesium)
					break
				}
			}

		}
	}
	else {

		BaseLayer[map_ind] = new ol.layer.Vector({
			//declutter: true,
			source: new ol.source.Vector({
				url: layer_content.Url,
				format: new ol.format.KML({
					extractStyles: false
				})
			})
			//declutter: true

		});

		BaseLayer_KMLC_style[map_ind] = Kml_style;
		BaseLayer[map_ind].setStyle(BaseLayer_KMLC_style[map_ind]);
		BaseLayer[map_ind].setZIndex(z_idx);
		BaseLayer[map_ind].setOpacity(opacity / 100);
		BaseLayer[map_ind].set('altitudeMode', 'clampToGround');
		maps[map_ind].addLayer(BaseLayer[map_ind]);
		KMLCToBeRemoved_num[map_ind]++;
		KMLCToBeRemoved[map_ind].push(BaseLayer[map_ind]);
		sel_Opacity_layer[0] = BaseLayer[map_ind];
		BaseLayer_KMLC[map_ind][BaseLayer_KMLC_num[map_ind]] = layer_content;


		KmlC_Present_Color_Vector[map_ind][BaseLayer_KMLC_num[map_ind]] = prev_kml_color;
		KmlC_Present_Thickness_Vector[map_ind][BaseLayer_KMLC_num[map_ind]] = thickness;
		KmlC_Present_Opacity_Vector[map_ind][BaseLayer_KMLC_num[map_ind]] = opacity;

		BaseLayer_KMLC_num[map_ind]++;

		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			var dataSource = Cesium.KmlDataSource.load(
				layer_content.Url,
				{
					camera: viewer.scene.camera,
					canvas: viewer.scene.canvas,
					clampToGround: true,
				}
			);
			viewer.dataSources.add(dataSource);
			//   linkurl_3DCesium_KML.splice(0, 0, linkurl_KML[map_ind])
			dataSources_url_3DCesium.push(layer_content.Url)
		}
	}
	//alert(KMLToBeRemoved_num+KMLToBeRemoved);	
}
function KmlC_color_picker_onChange(layer_id, prev_layer_color, prev_fill_color, thickness, opacity, z_idx) {

	for (var i = 0; i < KMLCToBeRemoved_num[map_ind]; i++) {

		var temp_id = BaseLayer_KMLC[map_ind][i].ID;

		if (layer_id.localeCompare("layer_color_picker" + temp_id) == 0 || layer_id.localeCompare("layer_fillcolor_picker" + temp_id) == 0) {

			console.log("fill : " + prev_fill_color)
			var getText = function (feature, resolution) {
				var maxResolution = 100;
				var text = feature.get('name');

				if (resolution > maxResolution) {
					text = '';
				}
				return text;
			};
			var Kml_style = function (feature, resolution) {
				return new ol.style.Style({
					fill: new ol.style.Fill({
						color: prev_fill_color
					}),
					stroke: new ol.style.Stroke({
						color: prev_layer_color,
						width: thickness
					}),
					text: new ol.style.Text({
						textAlign: 'center',
						textBaseline: 'middle',
						font: 'normal 16px 微軟正黑體',
						text: getText(feature, resolution),
						fill: new ol.style.Fill({ color: '#AA0000', width: 4 }),
						stroke: new ol.style.Stroke({ color: '#FFFFFF', width: 3 }),
						offsetX: 0,
						offsetY: 12,
						placement: 'Line',
						maxAngle: '0.7853981633974483',
						rotation: 0.0
					})
				});
			}
			/*** add ***/
			KMLCToBeRemoved[map_ind][i].setOpacity(opacity / 100);
			KMLCToBeRemoved[map_ind][i].setStyle(Kml_style);

			/***********/
			KmlC_Present_Color_Vector[map_ind][i] = prev_layer_color;
			KmlC_Present_Thickness_Vector[map_ind][i] = thickness;
			KmlC_Present_Opacity_Vector[map_ind][i] = opacity;

		}
	}
}

/* Kml_Orcolor */
var linkurl_Kml_Orcolor = [];
var BaseLayer_Kml_Orcolor_num = [0, 0];
var BaseLayer_Kml_Orcolor = new Array();
var Kml_OrcolorToBeRemoved_num = [0, 0];
var Kml_OrcolorToBeRemoved = new Array();
var Kml_Orcolor_Present_Opacity_Vector = new Array();
var OpacityKml_Orcolor = new Array();
var OpacityKml_OrcolorId = new Array();
for (var i = 0; i < 2; i++) {
	Kml_OrcolorToBeRemoved[i] = new Array();
	Kml_Orcolor_Present_Opacity_Vector[i] = new Array();
	OpacityKml_Orcolor[i] = new Array();
	BaseLayer_Kml_Orcolor[i] = new Array();
	OpacityKml_OrcolorId[i] = new Array();
}
function toggleKml_Orcolor(state, layer_content, map_ind) {
	//linkurl_Kml_Orcolor[map_ind] = id;

	let present_layer_data = window[`All_Check_List_W${map_ind}`];

	if (state == 0) {
		for (var i = 0; i < Kml_OrcolorToBeRemoved_num[map_ind]; i++) {

			if (layer_content.ID == BaseLayer_Kml_Orcolor[map_ind][i].ID) {

				maps[map_ind].removeLayer(Kml_OrcolorToBeRemoved[map_ind][i]);
				Kml_OrcolorToBeRemoved_num[map_ind]--;

				Kml_OrcolorToBeRemoved[map_ind].splice(i, 1);
				BaseLayer_Kml_Orcolor[map_ind].splice(i, 1);

				Kml_Orcolor_Present_Opacity_Vector[map_ind].splice(i, 1);

				BaseLayer_Kml_Orcolor_num[map_ind]--;

				OpacityKml_Orcolor[map_ind].splice(i, 1);
				OpacityKml_OrcolorId[map_ind].splice(i, 1);
			}
		}

		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			for (i = 0; i < dataSources_url_3DCesium.length; i++) {
				if (layer_content.Url == dataSources_url_3DCesium[i]) {
					viewer.dataSources.remove(viewer.dataSources.get(i), true)
					dataSources_url_3DCesium.splice(i, 1)
					break
				}
			}

		}
	}
	else {
		var now_vector_id = layer_content.ID;

		var opacity;
		var z_idx;

		for (var i = 0; i < present_layer_data.length; i++) {
			if (present_layer_data.ID == now_vector_id) {
				opacity = present_layer_data[i].Opacity;
				z_idx = present_layer_data[i].ZIndex;
			}
		}

		var layer_source = new ol.source.Vector({
			format: new ol.format.KML(),
			url: layer_content.Url,
			crossOrigin: 'anonymous'
		});

		BaseLayer[map_ind] = new ol.layer.Vector({
			source: layer_source
			//declutter: true
		});



		/***********/

		maps[map_ind].addLayer(BaseLayer[map_ind]);
		Kml_OrcolorToBeRemoved_num[map_ind]++;
		Kml_OrcolorToBeRemoved[map_ind].push(BaseLayer[map_ind]);
		/*** add ***/
		OpacityKml_Orcolor[map_ind].push(BaseLayer[map_ind]);
		OpacityKml_OrcolorId[map_ind].push(layer_content.ID);
		BaseLayer[map_ind].setZIndex(z_idx);
		BaseLayer[map_ind].setOpacity(opacity / 100)
		/***********/
		BaseLayer_Kml_Orcolor[map_ind][BaseLayer_Kml_Orcolor_num[map_ind]] = layer_content;
		/*** add ***/

		Kml_Orcolor_Present_Opacity_Vector[map_ind][BaseLayer_Kml_Orcolor_num[map_ind]] = opacity;
		BaseLayer_Kml_Orcolor_num[map_ind]++;

		/***********/

		///////Cesium 3D///////
		console.log(linkurl_Kml_Orcolor[map_ind])
		if (model_3Dchange_index == 1 && map_ind == 1) {
			var dataSource = Cesium.KmlDataSource.load(
				layer_content.Url,
				{
					camera: viewer.scene.camera,
					canvas: viewer.scene.canvas,
					clampToGround: true,
				}
			);
			viewer.dataSources.add(dataSource);
			//   linkurl_3DCesium_KML.splice(0, 0, linkurl_KML[map_ind])
			dataSources_url_3DCesium.push(layer_content.Url)
		}

	}
	//alert(KMLToBeRemoved_num+KMLToBeRemoved);	
}
function Kml_Orcolor_change_zIndex(layer_id, z_idx) {
	for (var i = 0; i < BaseLayer_Kml_Orcolor_num[map_ind]; i++) {
		if (layer_id.localeCompare(BaseLayer_Kml_Orcolor[map_ind][i].ID) === 0) {
			Kml_OrcolorToBeRemoved[map_ind][i].setZIndex(z_idx);
		}
	}
}

/* Kml_Pos */
var linkurl_Kml_Pos = [];
var BaseLayer_Kml_Pos_num = [0, 0];
var BaseLayer_Kml_Pos = new Array();
var Kml_PosToBeRemoved_num = [0, 0];
var Kml_PosToBeRemoved = new Array();
var BaseLayer_Kml_Pos_style = new Array();
var Kml_Pos_Present_Color_Vector = new Array();
var Kml_Pos_Present_Thickness_Vector = new Array();
var Kml_Pos_Present_Opacity_Vector = new Array();
for (var i = 0; i < 2; i++) {
	Kml_PosToBeRemoved[i] = new Array();
	Kml_Pos_Present_Color_Vector[i] = new Array();
	Kml_Pos_Present_Thickness_Vector[i] = new Array();
	Kml_Pos_Present_Opacity_Vector[i] = new Array();
	BaseLayer_Kml_Pos[i] = new Array();
	BaseLayer_Kml_Pos_style[i] = new Array();
}
function toggleKml_Pos(state, layer_content, map_ind) {
	let present_layer_data = window[`All_Check_List_W${map_ind}`];
	var prev_color;
	var prev_fill_color;
	var thickness;
	var opacity, fill_opacity;
	var z_idx;

	for (var i = 0; i < present_layer_data.length; i++) {
		if (present_layer_data[i].ID == layer_content.ID) {
			prev_color = present_layer_data[i].Color;
			thickness = present_layer_data[i].Thickness;
			opacity = present_layer_data[i].Opacity;
			prev_fill_color = present_layer_data[i].FillColor;
			z_idx = present_layer_data[i].ZIndex;
			fill_opacity = present_layer_data[i].FillOpacity;

			layer_legend_add(layer_content.ID, present_layer_data[i].FileName, present_layer_data[i].Color.toString(),
				present_layer_data[i].FillColor.toString(), thickness, opacity);
		}
	}

	var getText = function (feature, resolution) {
		var maxResolution = 15;
		var text = feature.get('direction');

		if (resolution > maxResolution) {
			text = '';
		}
		return text;
	};
	var getangle = function (feature) {
		
		var text = feature.get('angle');

		
		return text;
	};
	var Kml_style = function (feature, resolution) {
		return new ol.style.Style({
          image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 0.96],
            crossOrigin: 'anonymous',
            src: 'https://geodac.ncku.edu.tw/SWCB_LLGIS/kml_pos_icon.png',
            imgSize: [28,11],
			rotation:getangle(feature)*Math.PI/180,
			text:"10"
          })),
			text: new ol.style.Text({
				textAlign: 'center',
				textBaseline: 'middle',
				font: 'normal 16px 微軟正黑體',
				text: getText(feature, resolution),				
				fill: new ol.style.Fill({ color: '#AA0000', width: 4 }),
				stroke: new ol.style.Stroke({ color: '#FFFFFF', width: 3 }),
				offsetX: 0,
				offsetY: 12,
				placement: 'Line',
				maxAngle: '0.7853981633974483',
				rotation: 0.0
			})
        });
	}

	if (state == 0) {
		for (i = 0; i < Kml_PosToBeRemoved_num[map_ind]; i++) {
			if (layer_content.ID == BaseLayer_Kml_Pos[map_ind][i].ID) {
				maps[map_ind].removeLayer(Kml_PosToBeRemoved[map_ind][i]);
				Kml_PosToBeRemoved_num[map_ind]--;
				Kml_PosToBeRemoved[map_ind].splice(i, 1);
				BaseLayer_Kml_Pos[map_ind].splice(i, 1);
				Kml_Pos_Present_Color_Vector[map_ind].splice(i, 1);
				Kml_Pos_Present_Thickness_Vector[map_ind].splice(i, 1);
				Kml_Pos_Present_Opacity_Vector[map_ind].splice(i, 1);
				BaseLayer_Kml_Pos_num[map_ind]--;
			}
		}

		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			for (i = 0; i < dataSources_url_3DCesium.length; i++) {
				if (layer_content.Url == dataSources_url_3DCesium[i]) {
					console.log(i)
					console.log(dataSources_url_3DCesium[i])
					viewer.dataSources.remove(viewer.dataSources.get(i), true)
					dataSources_url_3DCesium.splice(i, 1)
					console.log(dataSources_url_3DCesium)
					break
				}
			}
		}
	}
	else {
		BaseLayer[map_ind] = new ol.layer.Vector({
			source: new ol.source.Vector({
				url: layer_content.Url,
				format: new ol.format.KML({
					extractStyles: false
				})
			})
		});

		BaseLayer_Kml_Pos_style[map_ind] = Kml_style;
		BaseLayer[map_ind].setStyle(BaseLayer_Kml_Pos_style[map_ind]);
		BaseLayer[map_ind].setZIndex(z_idx);
		BaseLayer[map_ind].setOpacity(opacity / 100);
		BaseLayer[map_ind].set('altitudeMode', 'clampToGround');
		maps[map_ind].addLayer(BaseLayer[map_ind]);
		Kml_PosToBeRemoved_num[map_ind]++;
		Kml_PosToBeRemoved[map_ind].push(BaseLayer[map_ind]);
		sel_Opacity_layer[0] = BaseLayer[map_ind];
		BaseLayer_Kml_Pos[map_ind][BaseLayer_Kml_Pos_num[map_ind]] = layer_content;


		Kml_Pos_Present_Color_Vector[map_ind][BaseLayer_Kml_Pos_num[map_ind]] = prev_color;
		Kml_Pos_Present_Thickness_Vector[map_ind][BaseLayer_Kml_Pos_num[map_ind]] = thickness;
		Kml_Pos_Present_Opacity_Vector[map_ind][BaseLayer_Kml_Pos_num[map_ind]] = opacity;

		BaseLayer_Kml_Pos_num[map_ind]++;

		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			var dataSource = Cesium.KmlDataSource.load(
				layer_content.Url,
				{
					camera: viewer.scene.camera,
					canvas: viewer.scene.canvas,
					clampToGround: true,
				}
			);
			viewer.dataSources.add(dataSource);
			dataSources_url_3DCesium.push(layer_content.Url)
		}
	}
}
function Kml_Pos_change_zIndex(layer_id, z_idx) {
	for (var i = 0; i < BaseLayer_Kml_Pos_num[map_ind]; i++) {
		if (layer_id.localeCompare(BaseLayer_Kml_Pos[map_ind][i].ID) === 0) {
			Kml_PosToBeRemoved[map_ind][i].setZIndex(z_idx);
		}
	}
}


/* MVTTiles */
var Vector_MVTTile_num = [0, 0];
var Vector_MVTTile = new Array();
var MVTTileToBeRemoved_num = [0, 0];
var MVTTileToBeRemoved = new Array();
var MVT_Present_Color_Vector = new Array();
var MVT_Present_Thickness_Vector = new Array();
var MVT_Present_Opacity_Vector = new Array();
for (var i = 0; i < 2; i++) {
	Vector_MVTTile[i] = new Array();
	MVTTileToBeRemoved[i] = new Array();
	MVT_Present_Color_Vector[i] = new Array();
	MVT_Present_Thickness_Vector[i] = new Array();
	MVT_Present_Opacity_Vector[i] = new Array();
}
var mvt_log = "";
function MVTTiles(state, layer_content, map_ind) {


	let present_layer_data = window[`All_Check_List_W${map_ind}`];
	if (state == 0) {
		for (var i = 0; i < Vector_MVTTile_num[map_ind]; i++) {
			if (Vector_MVTTile[map_ind][i].ID == layer_content.ID) {

				maps[map_ind].removeLayer(MVTTileToBeRemoved[map_ind][i]);

				MVTTileToBeRemoved[map_ind].splice(i, 1);

				for (var j = i; j < Vector_MVTTile_num[map_ind]; j++) {
					Vector_MVTTile[map_ind][j] = Vector_MVTTile[map_ind][j + 1];
					MVT_Present_Color_Vector[map_ind][j] = MVT_Present_Color_Vector[map_ind][j + 1];
				}
				Vector_MVTTile_num[map_ind]--;

				layer_legend_delete(layer_content.ID);
			}
		}

		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			for (var i = 0; i < imageryLayers_url_3DCesium.length; i++) {
				if (imageryLayers_url_3DCesium[i] != null && imageryLayers_url_3DCesium[i].indexOf(layer_content.Url) != -1) {
					viewer.imageryLayers.remove(viewer.imageryLayers.get(i));

					imageryLayers_url_3DCesium.splice(i, 1);
					break;
				}
			}
		}
	}
	else {
		var temp_color, temp_fill_color;
		var temp_thickness;
		var temp_opacity, temp_fill_opacity;
		var z_idx;

		for (var i = 0; i < present_layer_data.length; i++) {
			if (present_layer_data[i].ID == layer_content.ID) {
				temp_color = present_layer_data[i].Color.toString();
				temp_fill_color = present_layer_data[i].FillColor.toString();
				temp_thickness = present_layer_data[i].Thickness;
				temp_opacity = present_layer_data[i].Opacity;
				z_idx = present_layer_data[i].ZIndex;
				temp_fill_opacity = present_layer_data[i].FillOpacity;

				layer_legend_add(layer_content.ID, present_layer_data[i].FileName, temp_color, "", temp_thickness, temp_opacity);
			}
		}

		var getText = function (feature, resolution) {
			var maxResolution = 15;
			var text = feature.get('debrisno');

			if (resolution > maxResolution) {
				text = '';
			}
			return text;
		};
		var MVT_style = function (feature, resolution) {
			return new ol.style.Style({
				image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
					anchor: [0.5, 0.5],
					anchorXUnits: 'fraction',
					anchorYUnits: 'pixels',
					src: 'https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Marker-16.png',
					crossOrigin: 'anonymous'
				})),
				fill: new ol.style.Fill({
					color: temp_fill_color + OpatoHex(temp_fill_opacity)
				}),
				stroke: new ol.style.Stroke({
					color: temp_color,
					width: temp_thickness
				}),
				text: new ol.style.Text({
					textAlign: 'center',
					textBaseline: 'middle',
					font: 'normal 16px 微軟正黑體',
					text: getText(feature, resolution),
					fill: new ol.style.Fill({ color: '#AA0000', width: 4 }),
					stroke: new ol.style.Stroke({ color: '#FFFFFF', width: 3 }),
					offsetX: 0,
					offsetY: 12,
					placement: 'Line',
					maxAngle: '0.7853981633974483',
					rotation: 0.0
				})
			});
		}
		var tileSource = new ol.source.VectorTile({

			tilePixelRatio: 1, // oversampling when > 1
			tileGrid: ol.tilegrid.createXYZ({ maxZoom: 19 }),
			format: new ol.format.MVT(),
			urls: [layer_content.Url],
			tileUrlFunction: function (tileCoord) {
				mvt_log = tileCoord[0] + "," + tileCoord[1] + "," + tileCoord[2];
				var z = tileCoord[0];
				var x = tileCoord[1];
				var y = -tileCoord[2] - 1;
				return layer_content.Url + z + '/' + y + '/' + x + '.pbf';
			},
			crossOrigin: 'anonymous'
		});

		/////// Cesium 3D ///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			var options = {
				url: layer_content.Url + "{z}/{y}/{x}.pbf",
				key: "",
				style: {
					stroke_color: temp_color,
					fill: temp_fill_color + OpatoHex(temp_fill_opacity),
					stroke_width: temp_thickness
				}
			}

			// console.log(options)
			var mvtLayer = createMVTWithStyle(Cesium, ol4mvt, simpleStyle, options);
			var mvtLayer_index = viewer.imageryLayers.length;
			viewer.imageryLayers.addImageryProvider(mvtLayer, mvtLayer_index);

			// console.log(mvtLayer, mvtLayer_index)
			// console.log(viewer.imageryLayers)

			imageryLayers_url_3DCesium[mvtLayer_index] = layer_content.Url;
		}

		MVTTileToBeRemoved[map_ind][Vector_MVTTile_num[map_ind]] = new ol.layer.VectorTile({
			source: tileSource
		});

		MVTTileToBeRemoved[map_ind][Vector_MVTTile_num[map_ind]].setStyle(MVT_style);
		MVTTileToBeRemoved[map_ind][Vector_MVTTile_num[map_ind]].setZIndex(z_idx);

		sel_Opacity_layer[0] = MVTTileToBeRemoved[map_ind][Vector_MVTTile_num[map_ind]];
		Vector_MVTTile[map_ind][Vector_MVTTile_num[map_ind]] = layer_content;
		MVTTileToBeRemoved[map_ind][Vector_MVTTile_num[map_ind]].setOpacity(temp_opacity / 100);
		MVT_Present_Color_Vector[map_ind][Vector_MVTTile_num[map_ind]] = temp_color;
		MVT_Present_Thickness_Vector[map_ind][Vector_MVTTile_num[map_ind]] = temp_thickness;
		MVT_Present_Opacity_Vector[map_ind][Vector_MVTTile_num[map_ind]] = temp_opacity;
		Vector_MVTTile_num[map_ind]++;
		maps[map_ind].addLayer(MVTTileToBeRemoved[map_ind][Vector_MVTTile_num[map_ind] - 1]);

	}

}
function MVT_color_picker_onChange(layer_id, prev_layer_color, prev_layer_fillcolor, thickness, opacity, fill_opacity, z_idx) {
	console.log(prev_layer_fillcolor)
	for (var i = 0; i < Vector_MVTTile_num[map_ind]; i++) {
		var temp_id = Vector_MVTTile[map_ind][i].ID;

		if (layer_id.localeCompare("layer_color_picker" + temp_id) == 0 || layer_id.localeCompare("layer_fillcolor_picker" + temp_id) == 0) {
			var getText = function (feature, resolution) {
				var maxResolution = 15;
				var text = feature.get('debrisno');

				if (resolution > maxResolution) {
					text = '';
				}
				return text;
			};
			var MVT_style = function (feature, resolution) {
				return new ol.style.Style({
					image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
						anchor: [0.5, 0.5],
						anchorXUnits: 'fraction',
						anchorYUnits: 'pixels',
						src: 'https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Marker-16.png',
						crossOrigin: 'anonymous'
					})),
					fill: new ol.style.Fill({
						color: prev_layer_fillcolor + OpatoHex(fill_opacity)
					}),
					stroke: new ol.style.Stroke({
						color: prev_layer_color,
						width: thickness
					}),
					text: new ol.style.Text({
						textAlign: 'center',
						textBaseline: 'middle',
						font: 'normal 16px 微軟正黑體',
						text: getText(feature, resolution),
						fill: new ol.style.Fill({ color: '#AA0000', width: 4 }),
						stroke: new ol.style.Stroke({ color: '#FFFFFF', width: 3 }),
						offsetX: 0,
						offsetY: 12,
						placement: 'Line',
						maxAngle: '0.7853981633974483',
						rotation: 0.0
					})
				});
			}

			MVTTileToBeRemoved[map_ind][i].setStyle(MVT_style);

		}
	}
}
function MVTTiles_change_zIndex(layer_id, z_idx) {
	for (var i = 0; i < Vector_MVTTile_num[map_ind]; i++) {
		if (layer_id.localeCompare(Vector_MVTTile[map_ind][i].ID) === 0) {
			MVTTileToBeRemoved[map_ind][i].setZIndex(z_idx);
		}
	}
}

/* MVTTile_Orcolor */
var MVTTile_Orcolor_Num = [0, 0];
var MVTTile_Orcolor_List = new Array();
var MVTTile_Orcolor_ToBeRemoved_Num = [0, 0];
var MVTTile_Orcolor_ToBeRemoved_List = new Array();
for (let i = 0; i <= 1; ++i) {
	MVTTile_Orcolor_List[i] = new Array();
	MVTTile_Orcolor_ToBeRemoved_List[i] = new Array();
}
/**
 * Add/Remove MVTTile_Orcolor layer on map 
 * 
 * @param {*} state 0 - Remove this layer, 1 - Add this layer 
 * @param {*} layer_content layer_content of this layer
 */
function MVTTile_Orcolor(state, layer_content) {
	let present_layer_data = window[`All_Check_List_W${map_ind}`];

	if (state == 0) {


		for (i = 0; i < MVTTile_Orcolor_List[map_ind].length; i++) {

			if (MVTTile_Orcolor_List[map_ind][i].ID == layer_content.ID) {
				maps[map_ind].removeLayer(MVTTile_Orcolor_ToBeRemoved_List[map_ind][i]);
				for (var j = i; j < MVTTile_Orcolor_Num[map_ind]; j++) {
					MVTTile_Orcolor_List[map_ind][j] = MVTTile_Orcolor_List[map_ind][j + 1];
				}
				MVTTile_Orcolor_Num[map_ind]--;
			}
		}

		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			for (var i = 0; i < imageryLayers_url_3DCesium.length; i++) {
				if (imageryLayers_url_3DCesium[i] != null && imageryLayers_url_3DCesium[i].indexOf(layer_content.Url) != -1) {
					viewer.imageryLayers.remove(viewer.imageryLayers.get(i));

					imageryLayers_url_3DCesium.splice(i, 1);
					break;
				}
			}
		}
	}
	else {
		let now_vector_id = layer_content.ID;
		let temp_opacity;
		let z_idx;

		let i = present_layer_data.findIndex(layer => layer.ID == now_vector_id);
		// console.log(present_layer_data)
		if (i != -1) {
			temp_opacity = present_layer_data[i].Opacity;
			z_idx = present_layer_data[i].ZIndex;
		}

		let MVT_style = function (feature) {
			// console.log('rgb('+feature.properties_.rgb+')')
			return new ol.style.Style({
				fill: new ol.style.Fill({

					color: 'rgb(' + feature.properties_.rgb + ')'  //使用V4.6.5  debug 版本 要切換的呼叫模式
					//color: `rgb(${feature['j'].rgb})`              //使用V4.6.5非debug 版本 要切換的呼叫模式
				}),
			});
		}
		let array_id = [layer_content.ID];
		let tileSource = new ol.source.VectorTile({
			tilePixelRatio: 1, // oversampling when > 1
			tileGrid: ol.tilegrid.createXYZ({ maxZoom: 19 }),
			format: new ol.format.MVT(),
			urls: array_id,
			tileUrlFunction: function (tileCoord) {
				mvt_log = tileCoord[0] + "," + tileCoord[1] + "," + tileCoord[2];
				let z = tileCoord[0];
				let x = tileCoord[1];
				let y = -tileCoord[2] - 1;
				return layer_content.Url + z + '/' + y + '/' + x + '.pbf';
			},
			crossOrigin: 'anonymous',
		});

		/////// Cesium 3D ///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			var options = {
				url: layer_content.Url + "{z}/{y}/{x}.pbf",
				key: "",
				style: {
					stroke_color: '#00000000',//temp_color,
					fill: '#ff0000' + OpatoHex(temp_opacity),
					stroke_width: 0
				}
			}

			// console.log(options)
			var mvtLayer = createMVTWithStyle(Cesium, ol4mvt, simpleStyle, options);
			var mvtLayer_index = viewer.imageryLayers.length;
			viewer.imageryLayers.addImageryProvider(mvtLayer, mvtLayer_index);

			// console.log(mvtLayer, mvtLayer_index)
			// console.log(viewer.imageryLayers)

			imageryLayers_url_3DCesium[mvtLayer_index] = layer_content.Url;
		}

		MVTTile_Orcolor_ToBeRemoved_List[map_ind][MVTTile_Orcolor_Num[map_ind]] = new ol.layer.VectorTile({
			source: tileSource
		});

		MVTTile_Orcolor_ToBeRemoved_List[map_ind][MVTTile_Orcolor_Num[map_ind]].setStyle(MVT_style);
		MVTTile_Orcolor_ToBeRemoved_List[map_ind][MVTTile_Orcolor_Num[map_ind]].setZIndex(z_idx);
		MVTTile_Orcolor_ToBeRemoved_List[map_ind][MVTTile_Orcolor_Num[map_ind]].setOpacity(temp_opacity / 100);
		sel_Opacity_layer[0] = MVTTile_Orcolor_ToBeRemoved_List[map_ind][MVTTile_Orcolor_Num[map_ind]];
		MVTTile_Orcolor_List[map_ind][MVTTile_Orcolor_Num[map_ind]] = layer_content;
		MVTTile_Orcolor_Num[map_ind]++;
		maps[map_ind].addLayer(MVTTile_Orcolor_ToBeRemoved_List[map_ind][MVTTile_Orcolor_Num[map_ind] - 1]);
	}
}
function MVTTile_Orcolor_change_zIndex(layer_id, z_idx) {
	console.log("out");
	console.log(layer_id);
	for (var i = 0; i < MVTTile_Orcolor_Num[map_ind]; i++) {
		if (layer_id.localeColmpare(MVTTile_Orcolor_List[map_ind][i].ID) === 0) {
			MVTTile_Orcolor_ToBeRemoved_List[map_ind][i].setZIndex(z_idx);
			console.log("in");
		}
	}
}

/* Image overlay */
var linkurl_MapOverlay = [];
var ImageLayer = [];
var ImageLayer_MapOverlay_num = [0, 0];
var ImageLayer_MapOverlay = new Array();
var MapOverlayToBeRemoved_num = [0, 0];
var MapOverlayToBeRemoved = new Array();
for (var i = 0; i < 2; i++) {
	ImageLayer_MapOverlay[i] = new Array();
	MapOverlayToBeRemoved[i] = new Array();
}

function MapOverlay2(state, layer_content, map_ind) {
	let lonlat_pos = layer_content.PosInfo.split(';');
	let image_W = lonlat_pos[4];
	let image_L = lonlat_pos[5];
	let LU_X = lonlat_pos[6];
	let LU_Y = lonlat_pos[7];
	let RD_X = lonlat_pos[8];
	let RD_Y = lonlat_pos[9];
	/*** add ***/
	let present_layer_data = window[`All_Check_List_W${map_ind}`];
	/***********/

	if (state == 0) {
		for (i = 0; i < ImageLayer_MapOverlay_num[map_ind]; i++) {
			if (ImageLayer_MapOverlay[map_ind][i].ID == layer_content.ID) {
				maps[map_ind].removeLayer(MapOverlayToBeRemoved[map_ind][i]);

				/*** add ***/
				for (var j = i; j < ImageLayer_MapOverlay[map_ind].length; j++) {
					MapOverlayToBeRemoved[map_ind][j] = MapOverlayToBeRemoved[map_ind][j + 1];
					ImageLayer_MapOverlay[map_ind][j] = ImageLayer_MapOverlay[map_ind][j + 1];
				}
				ImageLayer_MapOverlay_num[map_ind]--;
				/***********/
			}

		}

		///////Cesium 3D///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			for (var i = 0; i < imageryLayers_url_3DCesium.length; i++) {
				if (imageryLayers_url_3DCesium[i] != null && imageryLayers_url_3DCesium[i].indexOf(layer_content.Url) != -1) {
					viewer.imageryLayers.remove(viewer.imageryLayers.get(i));

					imageryLayers_url_3DCesium.splice(i, 1);
					break;
				}
			}
		}
	}
	else {

		/*** add ***/

		var z_idx;

		for (var i = 0; i < present_layer_data.length; i++) {
			if (present_layer_data[i].ID.localeCompare(layer_content.ID) === 0) {
				z_idx = present_layer_data[i].ZIndex;
			}
		}

		/***********/

		MapOverlayToBeRemoved[map_ind][ImageLayer_MapOverlay_num[map_ind]] = new ol.layer.Image({
			opacity: 0.75,
			source: new ol.source.ImageStatic({
				attributions: [
					new ol.Attribution({
						html: '&copy; <a href="https://www.lib.utexas.edu/maps/historical/">University of Texas Libraries</a>'
					})
				],
				url: layer_content.Url,
				crossOrigin: 'anonymous',
				imageSize: [image_W, image_L],
				projection: maps[map_ind].getView().getProjection(),
				imageExtent: ol.extent.applyTransform([parseFloat(LU_X), parseFloat(LU_Y), parseFloat(RD_X), parseFloat(RD_Y)], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
			})
		});
		MapOverlayToBeRemoved[map_ind][ImageLayer_MapOverlay_num[map_ind]].setZIndex(z_idx);
		maps[map_ind].addLayer(MapOverlayToBeRemoved[map_ind][ImageLayer_MapOverlay_num[map_ind]]);
		sel_Opacity_layer[0] = MapOverlayToBeRemoved[map_ind][ImageLayer_MapOverlay_num[map_ind]];
		ImageLayer_MapOverlay[map_ind][ImageLayer_MapOverlay_num[map_ind]] = layer_content;
		ImageLayer_MapOverlay_num[map_ind]++;

		/////// Cesium 3D ///////
		if (model_3Dchange_index == 1 && map_ind == 1) {
			var index = viewer.imageryLayers.length;

			var imageryLayer = viewer.imageryLayers.addImageryProvider(
				new Cesium.SingleTileImageryProvider({
					url: layer_content.Url,
					rectangle: Cesium.Rectangle.fromDegrees(LU_X, LU_Y, RD_X, RD_Y),
				})
			);
			imageryLayer.alpha = 0.75;
			imageryLayers_url_3DCesium[index] = layer_content.Url;
		}
	}
}
function MapOverlay2_change_zIndex(layer_id, z_idx) {
	for (var i = 0; i < ImageLayer_MapOverlay_num[map_ind]; i++) {
		if (layer_id.localeCompare(ImageLayer_MapOverlay[map_ind][i].ID) === 0) {
			MapOverlayToBeRemoved[map_ind][i].setZIndex(z_idx);
		}
	}
}



/* Document overlay */
var linkurl_Docs = [];
var DocsFeature = [];
var DocsFeature_Layer_num = [0, 0];
var Docs_features = new Array();
var Docs_Layer = Array();
var DocsFeature_Vector_num = new Array();
var DocsFeature_Vector = new Array();
var DocsFeature_Layer = new Array();
for (var i = 0; i < 2; i++) {
	Docs_features[i] = new ol.Collection();
	DocsFeature_Vector[i] = new Array();
	DocsFeature_Layer[i] = new Array();
}
var DocsFeature_Layerinit = [0, 0];

function DocsFeatureOverlay(root_name, state, row_id, map_ind) {
	let layer_content;
	if (row_id[0] == "{") {
		layer_content = JSON.parse(row_id.toString());
	}
	else {
		let row_id_array = row_id.split("@");
		layer_content = JSON.parse('{"PosInfo":"' + row_id_array[0] + '","Type":"' + row_id_array[1] + '","Url":"' + row_id_array[2] + '","ID":"' + row_id_array[3] + '","FileName":"' + "testname" + '"}');
	}

	let loc_arr = layer_content.PosInfo.split(";");
	let feature_name = layer_content.FileName;

	// root_Obj = Get_Root_Obj(root_name);
	// if (root_Obj[0] == "grid") {
	// 	if (root_name == "Exdata_w1_Grid") { 
	// 		feature_name = root_Obj[1].cells(row_id, 2).getValue().split('^')[0]; 
	// 	} 
	// 	else { 
	// 		feature_name = root_Obj[1].cells(row_id, 1).getValue().split('^')[0]; 
	// 	}
	// } else if (root_Obj[0] == "tree") {
	// 	feature_name = root_Obj[1].getItemText(row_id);
	// }

	let present_layer_data = window[`All_Check_List_W${map_ind}`];

	if (state == 0) {
		for (j = 0; j < DocsFeature_Layer_num[map_ind]; j++) {

			if (layer_content.ID == DocsFeature_Vector[map_ind][j].ID) {
				maps[map_ind].removeLayer(DocsFeature_Layer[map_ind][j])
				DocsFeature_Layer[map_ind].splice(j, 1);
				DocsFeature_Vector[map_ind].splice(j, 1);
				DocsFeature_Vector_num[map_ind]--;
				DocsFeature_Layer_num[map_ind]--;
			}
		}
	}
	else {
		/*** add ***/
		var z_idx;
		var opacity;

		for (var i = 0; i < present_layer_data.length; i++) {
			if (present_layer_data[i].ID.localeCompare(layer_content.ID) === 0) {
				z_idx = present_layer_data[i].ZIndex;
				opacity = present_layer_data[i].Opacity;
			}
		}
		/***********/

		DocsFeature[map_ind] = new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(loc_arr[1]), parseFloat(loc_arr[0])])),
			Id: layer_content.Url,
			name: feature_name,
			population: 100,
			rainfall: 500,
			crossOrigin: 'anonymous'
		});

		DocsFeature[map_ind].setId(layer_content.ID);
		var iconStyle = new ol.style.Style({
			image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
				anchor: [0.5, 46],
				anchorXUnits: 'fraction',
				anchorYUnits: 'pixels',
				src: 'https://cdn1.iconfinder.com/data/icons/business-finance-vol-2-50/40/Untitled-5-85-48.png',
				crossOrigin: 'anonymous'
			})),
			text: new ol.style.Text({
				font: '12px helvetica,sans-serif',
				text: feature_name,
				rotation: 0,
				fill: new ol.style.Fill({
					color: '#000'
				}),
				stroke: new ol.style.Stroke({
					color: '#fff',
					width: 2
				})
			})
		});

		Docs_Layer[map_ind] = new ol.layer.Vector({
			source: new ol.source.Vector()
		});

		DocsFeature[map_ind].setStyle(iconStyle);

		Docs_Layer[map_ind].getSource().addFeature(DocsFeature[map_ind]);

		Docs_Layer[map_ind].setZIndex(z_idx);
		Docs_Layer[map_ind].setOpacity(opacity / 100);
		maps[map_ind].addLayer(Docs_Layer[map_ind]);
		DocsFeature_Layer[map_ind].push(Docs_Layer[map_ind])
		DocsFeature_Layer_num[map_ind]++;
		DocsFeature_Vector[map_ind].push(layer_content);
		DocsFeature_Vector_num[map_ind]++;
	}

}
function DocsFeatureOverlay_change_zIndex(layer_id, z_idx) {
	for (var i = 0; i < ImageLayer_MapOverlay_num[map_ind]; i++) {
		if (layer_id.localeCompare(ImageLayer_MapOverlay[map_ind][i].ID) === 0) {
			MapOverlayToBeRemoved[map_ind][i].setZIndex(z_idx);
		}
	}
}

/* Legend overlay */
var legend_array = [];
var legend_num = 0;
function LegendOverlay(root_name, state, rowId, layer_content) {
	let legend_bluid = 0;
	let lonlat_pos = layer_content.PosInfo.split(';');
	let length = lonlat_pos[4];
	let width = lonlat_pos[5];

	for (i = 0; i < legend_array.length; i++) {
		if (legend_array[i][0] == rowId) {
			if (state == 0) {
				legend_array[i][1].hide();
			} else {
				legend_array[i][1].show();
			}
			legend_bluid = 1;
		}
	}
	if (legend_bluid == 0) {
		root_obj = Get_Root_Obj(root_name);
		var legend_win_array = [];
		var legend_win = dhxWins.createWindow(rowId, 600, 600, length, width);
		legend_win.setText("圖例");

		legend_win.attachEvent("onClose", function (win) {
			root_obj[1].setCheck(rowId, false);
			//this.close();
			this.hide();
		});
		dhxWins.window(rowId).button("close").hide();
		//dhxWins.window(rowId).button("minmax").hide();
		dhxWins.window(rowId).button("park").hide();

		legend_html =
			"<div style='align: center; height:100%;width:100%;'>" +
			"<br><img src='" + layer_content.Url + "' style='display:block; margin-left: auto; margin-right: auto; max-height:100%; align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
		legend_win.attachHTMLString(legend_html);
		legend_array[legend_num] = [rowId, legend_win];
		legend_num = legend_num + 1;
		//legend_win.hide();
	}


}


// Tools function
function layer_color_picker_onchange(color) {
	// origin in hide
	$(this).parent().children('input').trigger("input");

	var attrid = $(this).attr('id');
	var check_map_list_token = attrid.substr(0, 1);
	var layer_id = attrid.substr(1);
	var present_color_data;
	var select_layer;
	var type;
	/*** add ***/
	var thickness;
	var opacity;
	var legend_id;
	var legend_name;
	var color_type;
	var param_c;
	var param_fc;
	/*** add ***/

	/*** add 20190510 ***/
	var prev_layer_color;
	var temp_fillcolor;
	var temp_fill_opacity;
	let favor_id;
	if (layer_id.indexOf("layer_color_picker") !== -1) {
		favor_id = layer_id.replace("layer_color_picker", "favor_color_picker");
	}
	else if (layer_id.indexOf("layer_fillcolor_picker") !== -1) {
		favor_id = layer_id.replace("layer_fillcolor_picker", "favor_fillcolor_picker");
	}

	let all_check_list = window[`All_Check_List_W${check_map_list_token}`];
	let favor_list = window[`Favor_Type_Check_List_W${check_map_list_token}`];
	for (var i = 0; i < all_check_list.length; i++) {
		if (layer_id.localeCompare("layer_color_picker" + all_check_list[i].ID) == 0) {
			all_check_list[i].Color = $(this).val().toString();
			temp_fillcolor = all_check_list[i].FillColor;
			param_c = $(this).val().toString();
			select_layer = i;
			type = all_check_list[i].Type;
			legend_id = all_check_list[i].ID;
			legend_name = all_check_list[i].FileName;
			color_type = 0;
			thickness = all_check_list[i].Thickness;
			opacity = all_check_list[i].Opacity;
			temp_fill_opacity = all_check_list[i].FillOpacity;
		}
		else if (layer_id.localeCompare("layer_fillcolor_picker" + all_check_list[i].ID) == 0) {
			all_check_list[i].FillColor = $(this).val().toString();
			temp_fillcolor = $(this).val().toString();
			prev_layer_color = all_check_list[i].Color;
			param_c = all_check_list[i].Color;
			param_fc = $(this).val().toString();
			select_layer = i;
			type = all_check_list[i].Type;
			legend_id = all_check_list[i].ID;
			legend_name = all_check_list[i].FileName;
			color_type = 1;
			thickness = all_check_list[i].Thickness;
			opacity = all_check_list[i].Opacity;
			temp_fill_opacity = all_check_list[i].FillOpacity;
		}
	}

	for (let i = 0; i < favor_list.length; ++i) {
		if (favor_id.localeCompare("favor_color_picker" + favor_list[i].ID) == 0) {
			favor_list[i].Color = $(this).val().toString();
			$(`#${map_ind}${favor_id}`).spectrum("set", $(this).val().toString());

		}
		else if (favor_id.localeCompare("favor_fillcolor_picker" + favor_list[i].ID) == 0) {
			favor_list[i].FillColor = $(this).val().toString();
			$(`#${map_ind}${favor_id}`).spectrum("set", $(this).val().toString());
		}
	}
	present_color_data = all_check_list;

	var temp_color = $(this).val().toString().replace("#", "");
	prev_color = Color6to8(temp_color)

	/*** add 20190510 ***/
	temp_fillcolor = temp_fillcolor.toString().replace("#", "")
	temp_fillcolor = Color6to8(temp_fillcolor)


	if (type == "KmlTile" && present_color_data[select_layer].IsAddOnMap == true) {
		for (var i = 0; i < BaseLayer_Vector_num[map_ind]; i++) {
			var temp_id = BaseLayer_Vector[map_ind][i].ID;

			if (layer_id.localeCompare("layer_color_picker" + temp_id) == 0) {
				thickness = KmlTile_Present_Thickness_Vector[map_ind][i];
				opacity = KmlTile_Present_Opacity_Vector[map_ind][i];
				KmlTile_Present_Color_Vector[map_ind][i] = prev_color;
			}
		}


		KmlTile_color_picker_onChange(layer_id, prev_color, thickness, opacity, present_color_data[select_layer].ZIndex);
	} else if (type == "Kml" && present_color_data[select_layer].IsAddOnMap == true) {
		/*** add ***/
		for (var i = 0; i < BaseLayer_KML_num[map_ind]; i++) {
			var temp_id = BaseLayer_KML[map_ind][i].ID;
			if (layer_id.localeCompare("layer_color_picker" + temp_id) == 0) {
				thickness = Kml_Present_Thickness_Vector[map_ind][i];
				opacity = Kml_Present_Opacity_Vector[map_ind][i];
				prev_layer_fillcolor = Kml_Present_FillColor_Vector[map_ind][i];
				prev_layer_color = prev_color;
				param_fc = present_color_data[select_layer].FillColor;
				//console.log(KmlTile_Present_Color_Vector[map_ind][i]);
			}
			else if (layer_id.localeCompare("layer_fillcolor_picker" + temp_id) == 0) {
				thickness = Kml_Present_Thickness_Vector[map_ind][i];
				opacity = Kml_Present_Opacity_Vector[map_ind][i];
				prev_layer_color = Kml_Present_Color_Vector[map_ind][i];
				prev_layer_fillcolor = prev_color;
				//console.log(KmlTile_Present_Color_Vector[map_ind][i]);
			}
		}
		/***********/

		Kml_color_picker_onChange(layer_id, prev_layer_fillcolor, prev_layer_color, thickness, opacity, present_color_data[select_layer].ZIndex);
	} else if (type == "Kml_color" && present_color_data[select_layer].IsAddOnMap == true) {
		/*** add ***/
		for (var i = 0; i < BaseLayer_KMLC_num[map_ind]; i++) {
			var temp_id = BaseLayer_KMLC[map_ind][i].ID;
			if (layer_id.localeCompare("layer_color_picker" + temp_id) == 0) {
				prev_layer_color = $(this).val().toString();
				thickness = present_color_data[select_layer].Thickness;
				opacity = present_color_data[select_layer].Opacity;
				temp_fill_opacity = present_color_data[select_layer].FillOpacity;
				temp_fillcolor = present_color_data[select_layer].FillColor + OpatoHex(temp_fill_opacity);
				console.log(temp_fillcolor)
				//console.log(KmlTile_Present_Color_Vector[map_ind][i]);
			}
			else if (layer_id.localeCompare("layer_fillcolor_picker" + temp_id) == 0) {
				prev_layer_color = present_color_data[select_layer].Color;
				thickness = present_color_data[select_layer].Thickness;
				opacity = present_color_data[select_layer].Opacity;
				temp_fill_opacity = present_color_data[select_layer].FillOpacity;
				temp_fillcolor = $(this).val().toString() + OpatoHex(temp_fill_opacity);
				//console.log(KmlTile_Present_Color_Vector[map_ind][i]);
			}
		}
		/***********/

		KmlC_color_picker_onChange(layer_id, prev_layer_color, temp_fillcolor, thickness, opacity, present_color_data[select_layer].ZIndex);
	} else if (type == "MVTTile" && present_color_data[select_layer].IsAddOnMap == true) {
		/*** add ***/
		for (var i = 0; i < Vector_MVTTile_num[map_ind]; i++) {
			var temp_id = Vector_MVTTile[map_ind][i].ID;

			if (layer_id.localeCompare("layer_color_picker" + temp_id) == 0) {
				prev_layer_color = $(this).val().toString();
				prev_layer_fillcolor = present_color_data[select_layer].FillColor;

				//console.log(KmlTile_Present_Color_Vector[map_ind][i]);
			}
			else if (layer_id.localeCompare("layer_fillcolor_picker" + temp_id) == 0) {

				prev_layer_color = present_color_data[select_layer].Color;
				prev_layer_fillcolor = $(this).val().toString();
				//console.log(KmlTile_Present_Color_Vector[map_ind][i]);
			}
		}
		/*** add ***/
		MVT_color_picker_onChange(layer_id, prev_layer_color, prev_layer_fillcolor, thickness, opacity, temp_fill_opacity, present_color_data[select_layer].ZIndex);
	} else if (type == "JsonOverlay" && present_color_data[select_layer].IsAddOnMap == true) {
		/*** add ***/
		for (var i = 0; i < jsonImage_MapTile_num[map_ind]; i++) {
			var temp_id = jsonImage_MapTile[map_ind][i].ID;

			if (layer_id.localeCompare("layer_color_picker" + temp_id) == 0) {
				prev_layer_color = $(this).val().toString();
				prev_layer_fillcolor = present_color_data[select_layer].FillColor;

				//console.log(KmlTile_Present_Color_Vector[map_ind][i]);
			}
			else if (layer_id.localeCompare("layer_fillcolor_picker" + temp_id) == 0) {

				prev_layer_color = present_color_data[select_layer].Color;
				prev_layer_fillcolor = $(this).val().toString();
				//console.log(KmlTile_Present_Color_Vector[map_ind][i]);
			}
		}
		/*** add ***/
		json_color_picker_onChange(layer_id, prev_layer_color, prev_layer_fillcolor, thickness, opacity, temp_fill_opacity, present_color_data[select_layer][11]);
	}

	layer_legend_add(legend_id, legend_name, param_c, param_fc, thickness, opacity);
}
function Update_Layer_Opacity(slider_id, value) {
	let present_opacity_data = window[`All_Check_List_W${map_ind}`];
	var type;
	var select_layer;

	for (var i = 0; i < present_opacity_data.length; i++) {
		var temp_id = present_opacity_data[i].ID;
		if (slider_id.localeCompare("layer_opacity_slider" + temp_id) == 0) {
			if (map_ind == 0) {
				All_Check_List_W0[i].Opacity = value;
			} else if (map_ind == 1) {
				All_Check_List_W1[i].Opacity = value;
			}
			type = present_opacity_data[i].Type;
			select_layer = i;
		}
	}

	if (type == "KmlTile") {
		for (var i = 0; i < VectorToBeRemoved_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(OpacityKmlTileId[map_ind][i]) == 0) {
				VectorToBeRemoved[map_ind][i].setOpacity(value / 100);
			}
		}
		for (var i = 0; i < BaseLayer_Vector_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(BaseLayer_Vector[map_ind][i].ID) == 0) {
				KmlTile_Present_Opacity_Vector[map_ind][i] = value;
			}
		}
	} else if (type == "Kml") {
		for (var i = 0; i < OpacityKml[map_ind].length; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(OpacityKmlId[map_ind][i]) == 0) {
				OpacityKml[map_ind][i].setOpacity(value / 100);
			}
		}
		for (var i = 0; i < BaseLayer_KML_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(BaseLayer_KML[map_ind][i].ID) == 0) {
				Kml_Present_Opacity_Vector[map_ind][i] = value;
			}
		}
	} else if (type == "Kml_color") {
		for (var i = 0; i < BaseLayer_KMLC[map_ind].length; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(BaseLayer_KMLC[map_ind][i].ID) == 0) {
				KMLCToBeRemoved[map_ind][i].setOpacity(value / 100);
			}
		}
		for (var i = 0; i < BaseLayer_KMLC_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(BaseLayer_KMLC[map_ind][i].ID) == 0) {
				KmlC_Present_Opacity_Vector[map_ind][i] = value;
			}
		}
	} else if (type == "Kml_Orcolor") {
		for (var i = 0; i < BaseLayer_Kml_Orcolor[map_ind].length; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(BaseLayer_Kml_Orcolor[map_ind][i].ID) == 0) {
				Kml_OrcolorToBeRemoved[map_ind][i].setOpacity(value / 100);
			}
		}
		for (var i = 0; i < BaseLayer_Kml_Orcolor_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(BaseLayer_Kml_Orcolor[map_ind][i].ID) == 0) {
				Kml_Orcolor_Present_Opacity_Vector[map_ind][i] = value;
			}
		}
	} else if (type == "Kml_Pos") {
		for (var i = 0; i < BaseLayer_Kml_Pos[map_ind].length; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(BaseLayer_Kml_Pos[map_ind][i].ID) == 0) {
				Kml_PosToBeRemoved[map_ind][i].setOpacity(value / 100);
			}
		}
		for (var i = 0; i < BaseLayer_Kml_Pos_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(BaseLayer_Kml_Pos[map_ind][i].ID) == 0) {
				Kml_Pos_Present_Opacity_Vector[map_ind][i] = value;
			}
		}
	} else if (type == "TileImage") {
		for (var i = 0; i < MapTile_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(MapTile[map_ind][i].ID) == 0) {
				MapTileToBeRemoved[map_ind][i].setOpacity(value / 100);
			}
		}




	} else if (type == "TileImage_nlsc") {
		for (var i = 0; i < MapTile_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(MapTile[map_ind][i].ID) == 0) {
				MapTileToBeRemoved[map_ind][i].setOpacity(value / 100);
			}
		}


	} else if (type == "ImageOverlay") {
		for (var i = 0; i < ImageLayer_MapOverlay_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(ImageLayer_MapOverlay[map_ind][i].ID) == 0) {
				MapOverlayToBeRemoved[map_ind][i].setOpacity(value / 100);
			}
		}


	} else if (type == "MVTTile") {
		for (var i = 0; i < Vector_MVTTile_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(Vector_MVTTile[map_ind][i].ID) == 0) {
				MVTTileToBeRemoved[map_ind][i].setOpacity(value / 100);
			}
		}

		for (var i = 0; i < Vector_MVTTile_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(Vector_MVTTile[map_ind][i].ID) == 0) {
				MVT_Present_Opacity_Vector[map_ind][i] = value;
			}
		}
	} else if (type === "MVTTile_Orcolor") {
		for (var i = 0; i < MVTTile_Orcolor_Num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(MVTTile_Orcolor_List[map_ind][i].ID) == 0) {
				MVTTile_Orcolor_ToBeRemoved_List[map_ind][i].setOpacity(value / 100);
			}
		}
	} else if (type == "TileImage_M") {
		for (var i = 0; i < MapTile_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(MapTile[map_ind][i].ID) == 0) {
				MapTileToBeRemoved[map_ind][i].setOpacity(value / 100);
			}
		}


	} else if (type == "TileImage_spot") {
		for (var i = 0; i < MapTile_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(MapTile[map_ind][i].ID) == 0) {
				MapTileToBeRemoved[map_ind][i].setOpacity(value / 100);
			}
		}
		/*** add 20190628 ***/
	} else if (type == "TileImage_Planet") {

		for (var i = 0; i < MapTile_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(MapTile[map_ind][i].ID) == 0) {
				MapTileToBeRemoved[map_ind][i].setOpacity(value / 100);
			}
		}
		/*** add 20190628 ***/

	} else if (type == "TileImage_GSW") {

		for (var i = 0; i < MapTile_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(MapTile[map_ind][i].ID) == 0) {
				MapTileToBeRemoved[map_ind][i].setOpacity(value / 100);
			}
		}
		/*** add 20200714 ***/
	} else if (type == "TileImage_SINICA") {

		for (var i = 0; i < MapTile_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(MapTile[map_ind][i].ID) == 0) {
				MapTileToBeRemoved[map_ind][i].setOpacity(value / 100);
			}
		}
		/*** add 20210909 ***/


	} else if (type == "Document") {
		for (var i = 0; i < DocsFeature_Layer_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(DocsFeature_Vector[map_ind][i].ID) == 0) {
				DocsFeature_Layer[map_ind][i].setOpacity(value / 100);
			}
		}


	} else if (type == "JsonOverlay") {
		for (var i = 0; i < jsonImage_MapTile_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(jsonImage_MapTile[map_ind][i].ID) == 0) {
				jsonToBeRemoved[map_ind][i].setOpacity(value / 100);
			}
		}

	}





}
function Update_Fill_Opacity(slider_id, value) {
	let present_opacity_data = window[`All_Check_List_W${map_ind}`];
	var type;
	var select_layer;

	for (var i = 0; i < present_opacity_data.length; i++) {
		var temp_id = present_opacity_data[i].ID;
		if (slider_id.localeCompare("layer_fill_opacity_slider" + temp_id) == 0) {
			present_opacity_data[i].FillOpacity = value;
			select_layer = i;
			type = present_opacity_data[i].Type;
		}
	}

	if (type === "MVTTile") {
		/*** add ***/
		var tmp_MVT_style = [
			new ol.style.Style({
				fill: new ol.style.Fill({
					color: present_opacity_data[select_layer].FillColor + OpatoHex(value)
				}),
				stroke: new ol.style.Stroke({
					color: present_opacity_data[select_layer].Color,
					width: present_opacity_data[select_layer].Thickness
				})
			}),
			new ol.style.Style({
				image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
					anchor: [0, 0],
					anchorXUnits: 'fraction',
					anchorYUnits: 'pixels',
					src: 'https://cdn3.iconfinder.com/data/icons/freeapplication/png/24x24/Target.png'
				}))
			})
		];
		/***********/

		for (var i = 0; i < Vector_MVTTile_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(Vector_MVTTile[map_ind][i].ID) == 0) {
				MVTTileToBeRemoved[map_ind][i].setStyle(tmp_MVT_style)//.getFill().setColor(new_color);
			}
		}

	} else if (type === "Kml_color") {

		var prev_kml_color = present_opacity_data[select_layer].Color;
		var thickness = present_opacity_data[select_layer].Thickness;
		var prev_fill_color = present_opacity_data[select_layer].FillColor;
		var z_idx = present_opacity_data[select_layer].ZIndex;

		var getText = function (feature, resolution) {
			var maxResolution = 100;
			var text = feature.get('name');

			if (resolution > maxResolution) {
				text = '';
			}
			return text;
		};

		var Kml_style = function (feature, resolution) {
			return new ol.style.Style({
				/*** add 20190522 ***/
				fill: new ol.style.Fill({
					color: prev_fill_color + OpatoHex(value)
				}),
				stroke: new ol.style.Stroke({
					color: prev_kml_color,
					width: thickness
				}),
				text: new ol.style.Text({
					textAlign: 'center',
					textBaseline: 'middle',
					font: 'normal 16px 微軟正黑體',
					text: getText(feature, resolution),
					fill: new ol.style.Fill({ color: '#AA0000', width: 4 }),
					stroke: new ol.style.Stroke({ color: '#FFFFFF', width: 3 }),
					offsetX: 0,
					offsetY: 12,
					placement: 'Line',
					maxAngle: '0.7853981633974483',
					rotation: 0.0
				})
			});
		}

		for (var i = 0; i < BaseLayer_KMLC[map_ind].length; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(BaseLayer_KMLC[map_ind][i].ID) == 0) {
				KMLCToBeRemoved[map_ind][i].setStyle(Kml_style);
				break;
			}
		}
	} else if (type === "JsonOverlay") {
		/*** add ***/
		var tmp_json_style = new ol.style.Style({
			fill: new ol.style.Fill({
				color: present_opacity_data[select_layer].FillColor + OpatoHex(value)
			}),
			stroke: new ol.style.Stroke({
				color: present_opacity_data[select_layer].Color,
				width: present_opacity_data[select_layer].Thickness
			})
		});
		/***********/

		for (var i = 0; i < jsonImage_MapTile_num[map_ind]; i++) {
			if (present_opacity_data[select_layer].ID.localeCompare(jsonImage_MapTile[map_ind][i].ID) == 0) {
				//var new_color = present_opacity_data[select_layer][9] + OpatoHex(value)
				//console.log(present_opacity_data[select_layer][9] + OpatoHex(value));
				jsonToBeRemoved[map_ind][i].setStyle(tmp_json_style)//.getFill().setColor(new_color);
			}
		}
	}
}
function layer_thickness_on_change(rowId) {
	var thickness = $("#layer_thickness" + rowId).val();
	var layer_id = "layer_color_picker" + rowId;
	var present_color_data;
	var present_color;
	var present_fillcolor;
	var select_layer;
	var present_fill_opacity;
	var type;
	var prev_layer_color = '';
	var opacity;

	let all_check_list = window[`All_Check_List_W${map_ind}`];
	let favor_list = window[`Favor_Type_Check_List_W${map_ind}`];

	let all_index = all_check_list.findIndex(layer => rowId.localeCompare(layer.ID) == 0)

	if (all_index !== -1) {
		all_check_list[all_index].Thickness = thickness;
		present_color = all_check_list[all_index].Color;
		type = all_check_list[all_index].Type;
		opacity = all_check_list[all_index].Opacity;
		present_fillcolor = all_check_list[all_index].FillColor;
		present_fill_opacity = all_check_list[all_index].FillOpacity;
		select_layer = all_index;
	}
	let favor_index = favor_list.findIndex(layer => rowId.localeCompare(layer.ID) == 0)
	if (favor_index !== -1) {
		favor_list[favor_index].Thickness = thickness;
	}
	$("#favor_thickness" + rowId).val($("#layer_thickness" + rowId).val())

	present_color_data = all_check_list;


	var temp_color = present_color;
	present_color = Color6to8(temp_color.toString().replace("#", ""))
	var temp_fillcolor = present_fillcolor;
	present_fillcolor = Color6to8(temp_fillcolor.toString().replace("#", ""));

	if (type == "KmlTile" && present_color_data[select_layer].IsAddOnMap == true) {

		for (var i = 0; i < BaseLayer_Vector_num[map_ind]; i++) {
			var temp_id = BaseLayer_Vector[map_ind][i].ID;
			console.log('temp_id', temp_id);
			if (layer_id.localeCompare("layer_color_picker" + temp_id) == 0) {
				KmlTile_Present_Thickness_Vector[map_ind][i] = thickness;
				prev_layer_color = KmlTile_Present_Color_Vector[map_ind][i];
				opacity = KmlTile_Present_Opacity_Vector[map_ind][i];
			}
		}


		KmlTile_color_picker_onChange(layer_id, prev_layer_color, thickness, opacity, present_color_data[select_layer].ZIndex);
	} else if (type == "Kml" && present_color_data[select_layer].IsAddOnMap == true) {

		for (var i = 0; i < BaseLayer_KML_num[map_ind]; i++) {
			var temp_id = BaseLayer_KML[map_ind][i].ID;


			if (layer_id.localeCompare("layer_color_picker" + temp_id) == 0) {
				Kml_Present_Thickness_Vector[map_ind][i] = thickness;
				prev_layer_color = Kml_Present_Color_Vector[map_ind][i];
				prev_layer_fillcolor = Kml_Present_FillColor_Vector[map_ind][i];
				opacity = Kml_Present_Opacity_Vector[map_ind][i];
				//console.log(KmlTile_Present_Color_Vector[map_ind][i]);
			}
		}

		Kml_color_picker_onChange(layer_id, prev_layer_fillcolor, prev_layer_color, thickness, opacity, present_color_data[select_layer].ZIndex);
	} else if (type == "Kml_color" && present_color_data[select_layer].IsAddOnMap == true) {

		for (var i = 0; i < BaseLayer_KMLC_num[map_ind]; i++) {
			var temp_id = BaseLayer_KMLC[map_ind][i].ID;


			if (layer_id.localeCompare("layer_color_picker" + temp_id) == 0) {
				temp_fillcolor = temp_fillcolor + OpatoHex(present_fill_opacity)
				//console.log(KmlTile_Present_Color_Vector[map_ind][i]);
			}
		}

		KmlC_color_picker_onChange(layer_id, temp_color, temp_fillcolor, thickness, opacity, present_color_data[select_layer].ZIndex);
	} else if (type == "MVTTile" && present_color_data[select_layer].IsAddOnMap == true) {
		for (var i = 0; i < Vector_MVTTile_num[map_ind]; i++) {
			var temp_id = Vector_MVTTile[map_ind][i].ID;



			if (layer_id.localeCompare("layer_color_picker" + temp_id) == 0) {
				prev_color_data = MVT_Present_Color_Vector[map_ind][i];
				opacity = MVT_Present_Opacity_Vector[map_ind][i];
			}
		}

		MVT_color_picker_onChange(layer_id, temp_color, temp_fillcolor, thickness, opacity, present_fill_opacity, present_color_data[select_layer].ZIndex);
	} else if (type == "JsonOverlay" && present_color_data[select_layer].IsAddOnMap == true) {

		json_color_picker_onChange(layer_id, temp_color, temp_fillcolor, thickness, opacity, present_fill_opacity, present_color_data[select_layer].ZIndex);
	}


}
function OpatoHex(opacity) {
	var int_o = parseInt(opacity * 2.55)
	var t_fc = ((int_o / 16) >> 0)
	var t_sc = (int_o % 16)

	if (t_fc >= 10) {
		t_fc = String.fromCharCode(t_fc + 55);
	} else if (t_fc == 0) {
		t_fc = "0";
	} else {
		t_fc = t_fc.toString();
	}

	if (t_sc >= 10) {
		t_sc = String.fromCharCode(t_sc + 55);
	} else if (t_sc == 0) {
		t_sc = "0";
	} else {
		t_sc = t_sc.toString();
	}
	return (t_fc + t_sc)
}
function HextoRGBA(hexCode) {
	var red;
	var green;
	var blue;
	var rgba;
	red = (parseInt(hexCode[1], 16)) * 16 + (parseInt(hexCode[2], 16));
	green = (parseInt(hexCode[3], 16)) * 16 + (parseInt(hexCode[4], 16));
	blue = (parseInt(hexCode[5], 16)) * 16 + (parseInt(hexCode[6], 16));
	rgba = "rgba(" + red.toString() + ", " + green.toString() + ", " + blue.toString() + ", 0.33)";

	console.log(rgba);

	return rgba;
}
function Id_Replace_Illegal_Char(str) {
	var return_str = str.toString().replace(/\//g, "");
	return_str = return_str.toString().replace(/\./g, "");
	return_str = return_str.toString().replace(/:/g, "");
	return_str = return_str.toString().replace(/\(/g, "");
	return_str = return_str.toString().replace(/\)/g, "");
	return_str = return_str.toString().replace(/\?/g, "");
	return_str = return_str.toString().replace(/=/g, "");
	return_str = return_str.toString().replace(/\-/g, "");

	return_str = return_str.toString().replace(/[^a-zA-Z0-9_\-]/g, "");

	return return_str;
}
function Geo2Tile(Geo, map_ind) {

	var siny = Math.sin(Geo[1] * Math.PI / 180);
	siny = Math.min(Math.max(siny, -0.9999), 0.9999);

	var Dscale = Math.pow(2, maps[map_ind].getView().getZoom())

	var Tile = [
		Dscale * (0.5 + Geo[0] / 360),
		Dscale * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))];
	return Tile;
}
function Color6to8(origin_color) {
	var temp_color = parseInt(origin_color, 16);

	var mask = 0xFF;
	var prev_layer_color = "FF";

	for (var color_index = 0; color_index < 3; color_index++) {
		var temp_hex = (temp_color & mask);
		var temp_hex1 = (temp_hex & 0xF0) >>> 4;
		var temp_hex2 = temp_hex & 0xF;

		if (temp_hex1 >= 10) {
			prev_layer_color += String.fromCharCode(temp_hex1 + 55);
		} else if (temp_hex1 == 0) {
			prev_layer_color += "0";
		} else {
			prev_layer_color += temp_hex1.toString();
		}

		if (temp_hex2 >= 10) {
			prev_layer_color += String.fromCharCode(temp_hex2 + 55);
		} else if (temp_hex2 == 0) {
			prev_layer_color += "0";
		} else {
			prev_layer_color += temp_hex2.toString();
		}

		temp_color = temp_color >>> 8;

	}

	return prev_layer_color
}
function explode(delimiter, string, limit) { //字串分割成陣列
	var emptyArray = {
		0: ''
	};
	// third argument is not required
	if (arguments.length < 2 || typeof arguments[0] == 'undefined' || typeof arguments[1] == 'undefined') {
		return null;
	}
	if (delimiter === '' || delimiter === false || delimiter === null) {
		return false;
	}
	if (typeof delimiter == 'function' || typeof delimiter == 'object' || typeof string == 'function' || typeof string == 'object') {
		return emptyArray;
	}
	if (delimiter === true) {
		delimiter = '1';
	}
	if (!limit) {
		return string.toString().split(delimiter.toString());
	} else {
		// support for limit argument
		var splitted = string.toString().split(delimiter.toString());
		var partA = splitted.splice(0, limit - 1);
		var partB = splitted.join(delimiter.toString());
		partA.push(partB);
		return partA;
	}
}
function window_select() {
	//alert(All_Check_List_W1);
	All_Check_List_Reset();	//已選圖層刷新
	layer_legend_update();

	if (map_ind == 0) {
		//先關閉W1視窗勾選
		for (i = 0; i < All_Check_List_W1.length; i++) {
			if (All_Check_List_W1[i].IsAddOnMap == true) {
				try {
					let ch_lay_root = Get_Root_Obj(All_Check_List_W1[i].RootName);

					if (ch_lay_root[0] == "grid") {
						(ch_lay_root[1].cells(All_Check_List_W1[i].RowID, 0)).setValue(false);
					} else if (ch_lay_root[0] == "tree") {
						ch_lay_root[1].setCheck(All_Check_List_W1[i].RowID, false);
					}
				} catch (e) {
					console.log(e);
				}
			}
		}

		//再打開W0視窗勾選
		for (i = 0; i < All_Check_List_W0.length; i++) {
			if (All_Check_List_W0[i].IsAddOnMap == true) {
				try {
					let ch_lay_root = Get_Root_Obj(All_Check_List_W0[i].RootName);

					if (ch_lay_root[0] == "grid") {
						(ch_lay_root[1].cells(All_Check_List_W0[i].RowID, 0)).setValue(true);
					} else if (ch_lay_root[0] == "tree") {
						ch_lay_root[1].setCheck(All_Check_List_W0[i].RowID, true);
					}
				} catch (e) {
					console.log(e);
				}
			}
		}
	} else if (map_ind == 1) {
		for (i = 0; i < All_Check_List_W0.length; i++) {
			if (All_Check_List_W0[i].IsAddOnMap == true) {
				try {
					let ch_lay_root = Get_Root_Obj(All_Check_List_W0[i].RootName);

					if (ch_lay_root[0] == "grid") {
						(ch_lay_root[1].cells(All_Check_List_W0[i].RowID, 0)).setValue(false);
					} else if (ch_lay_root[0] == "tree") {
						ch_lay_root[1].setCheck(All_Check_List_W0[i].RowID, false);
					}
				} catch (e) {
					console.log(e);
				}
			}
		}

		for (i = 0; i < All_Check_List_W1.length; i++) {
			if (All_Check_List_W1[i].IsAddOnMap == true) {
				try {
					let ch_lay_root = Get_Root_Obj(All_Check_List_W1[i].RootName);

					if (ch_lay_root[0] == "grid") {
						(ch_lay_root[1].cells(All_Check_List_W1[i].RowID, 0)).setValue(true);
					} else if (ch_lay_root[0] == "tree") {
						ch_lay_root[1].setCheck(All_Check_List_W1[i].RowID, true);
					}
				} catch (e) {
					console.log(e);
				}
			}
		}
	}
}
function unset_item(tree, array) {

	for (i = 0; i < array.length; i++) {
		//alert(array[i]);
		tree.setCheck(array[i], false);
	}
}
function unset_item_G(grid, array) {
	//for(i=0;i<array.length;i++){

	grid.setCheckedRows(0, 0);
	//}

}
function set_item(tree, array) {

	for (i = 0; i < array.length; i++) {

		tree.setCheck(array[i], true);
	}
}
function set_item_G(grid, array) {

	for (i = 0; i < array.length; i++) {

		(grid.cells(array[i], 0)).setValue(1);
	}

}

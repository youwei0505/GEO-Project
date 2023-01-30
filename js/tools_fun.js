/*** add 20190628 ***/

var Image_Label = ["TileImage", "TileImage_Planet", "TileImage_M", "TileImage_nlsc", "TileImage_spot", "TileImage_SINICA", "TileImage_GSW", "ImageOverlay", "3DModel", "GifOverlay", "TileImage_WMS_moeacgs"];
var Vector_Label = ["KmlTile", "Kml", "Kml_color", "MVTTile", "JsonOverlay", "Kml_Orcolor", "MVTTile_Orcolor", , "Kml_Pos"];
var Dot_Label = ["Document", "DB_Point"];
var Orcolor_Label = ["Kml_Orcolor", "MVTTile_Orcolor"];
var Fill_Label = ["Kml_color", "MVTTile", "JsonOverlay"];

/*** add 20190628 ***/
var curLayerName = ['']

/**
 *
 * Call when click checkbox of layers in 圖層選項
 * @param {string} root_name
 * @param {string} row_id
 * @param {string} cellInd
 * @param {number} state If this selected layer is checked or not
 */
function Layer_Grid_Oncheck(root_name, row_id, cellInd, state) {
	let layer_content;
	if (row_id[0] == "{") {
		layer_content = JSON.parse(row_id.toString());
	}
	else {
		let row_id_array = row_id.split("@");
		layer_content = JSON.parse('{"PosInfo":"' + row_id_array[0] + '","Type":"' + row_id_array[1] + '","Url":"' + row_id_array[2] + '","ID":"' + row_id_array[3] + '","FileName":"' + "testname" + '"}');
	}
	if (Login_ID == "") {
		if (layer_content.ID.length == 8) {
			url_accesslog = 'https://data.geodac.tw/geoinfo_api/api/anonymous/data/geoproduct/accesslog/webview/';
		} else {
			url_accesslog = 'https://data.geodac.tw/geoinfo_api/api/anonymous/data/geoproduct/accesslog/webview/staticfiles/';
		}
		$.ajax({

			url: url_accesslog + layer_content.ID + '?uid=1312&client_id=6',
			success: function (data) {
				console.log(layer_content.ID + '_unlogin:' + data.result);
			}
		})
		$.ajax({

			url: url_accesslog + layer_content.ID + '?uid=1312&client_id=6',
			success: function (data) {
				console.log(layer_content.ID + ':' + data.result);
			}
		})
	} else {
		if (layer_content.ID.length == 8) {
			url_accesslog = 'https://data.geodac.tw/geoinfo_api/api/geodac/data/geoproduct/accesslog/webview/';
		} else {
			url_accesslog = 'https://data.geodac.tw/geoinfo_api/api/geodac/data/geoproduct/accesslog/webview/staticfiles/';
		}

		$.ajax({
			headers: {
				"authorization": "Bearer " + response_token//此處放置請求到的使用者token
			},
			//url: 'https://data.geodac.tw/geoinfo_api/api/geodac/data/geoproduct/accesslog/webview/' + layer_content.ID + '?uid=' + Login_ID,
			url: url_accesslog + layer_content.ID + "?client_id=6",
			success: function (data) {
				//console.log(url_accesslog + layer_content.ID+"?client_id=6");
				console.log(layer_content.ID + ':' + data.result);
				set_curLayerContentID(layer_content.ID)

				// if(curLayerName.includes($('#gif_text').val())) {
				// 	curLayerName = curLayerName.filter(item => item !== $('#gif_text').val())
				// }
				// else {
				// 	curLayerName.push($('#gif_text').val())
				// }
				// console.log($('#gif_text').val())
				// console.log(curLayerName)
				document.getElementById('current_layer_name').innerText = $('#gif_text').val()

			}
		})
	}

	switch (layer_content.Type) {
		case "KmlTile":
			toggleDKML(state, layer_content, map_ind);
			break;
		case "Kml":
			toggleKML(state, layer_content, map_ind);
			break;
		case "Kml_color":
			toggleKml_color(state, layer_content, map_ind);
			break;
		case "Kml_Orcolor":
			toggleKml_Orcolor(state, layer_content, map_ind);
			break;
		case "Kml_Pos":
			toggleKml_Pos(state, layer_content, map_ind);
			break;
		case "TileImage":
			MapTiles2(state, layer_content, map_ind);
			break;
		case "TileImage_Planet":
			MapTiles_Planet(state, layer_content, map_ind);
			break;
		case "TileImage_M":
			MapTiles_M(state, layer_content, map_ind);
			break;
		case "TileImage_nlsc":
			MapTiles_nlsc(state, layer_content, map_ind);
			break;
		case "TileImage_spot":
			MapTiles_spot(state, layer_content, map_ind);
			break;
		case "TileImage_SINICA":
			MapTiles_SINICA_WMTS(state, layer_content, map_ind);
			break;
		case "TileImage_GSW":
			MapTiles_GSW(state, layer_content, map_ind);
			break;
		case "ImageOverlay":
			MapOverlay2(state, layer_content, map_ind);
			break;
		case "Document":
			DocsFeatureOverlay(root_name, state, row_id, map_ind);
			break;
		case "DB_Point":
			DocsFeatureOverlay(root_name, state, row_id, map_ind);
			break;
		case "Thumbnail":
			DocsFeatureOverlay(root_name, state, row_id, map_ind);
			break;
		case "MVTTile":
			MVTTiles(state, layer_content, map_ind);
			break;
		case "MVTTile_Orcolor":
			MVTTile_Orcolor(state, layer_content);
			break;
		case "3DModel":
			Map3DModel(state, layer_content, map_ind);
			break;
		case "JsonOverlay":
			JsonOverlay(state, layer_content, map_ind);
			break;
		case "GifOverlay":
			GifOverlay(state, layer_content, map_ind);
			break;
		case "LegendList":
			LegendOverlay(root_name, state, row_id, layer_content);
			break;
		case "TileImage_WMS_moeacgs":
			MapTiles_WMS_moeacgs(state, layer_content, map_ind);
			break;
	}
}
//雙擊定位	
function Location_Grid_DblClicked(rowId) {
	let layer_content = JSON.parse(rowId)
	let lonlat_pos = layer_content.PosInfo.split(';');

	Locate(lonlat_pos[0], lonlat_pos[1], lonlat_pos[3], lonlat_pos[4], lonlat_pos[5], lonlat_pos[6], lonlat_pos[7], lonlat_pos[8], lonlat_pos[9]);
}

/**
 * Call to change the layer's z-index, depend on layer's type
 *
 * @param {string} type Layer's type
 * @param {number} layer_id	Layer's id
 * @param {number} z_idx	The z-index need to apply on this layer
 */
function Layer_Zindex_Change(type, layer_id, z_idx) {
	switch (type) {
		case "KmlTile":
			DKML_change_zIndex(layer_id, z_idx);
			break;
		case "Kml":
			KML_change_zIndex(layer_id, z_idx);
			break;
		case "TileImage":
			MapTiles2_change_zIndex(layer_id, z_idx);
			break;
		case "TileImage_nlsc":
			MapTiles_nlsc_change_zIndex(layer_id, z_idx);
			break;
		case "ImageOverlay":
			MapOverlay2_change_zIndex(layer_id, z_idx);
			break;
		case "Document":
			//DocsFeatureOverlay_change_zIndex(layer_id, z_idx);
			break;
		case "MVTTile":
			MVTTiles_change_zIndex(layer_id, z_idx);
			break;
		case "3DModel":
			Map3DModel_change_zIndex(layer_id, z_idx);
			break;
		case "JsonOverlay":
			JsonOverlay_change_zIndex(layer_id, z_idx);
			break;
		case "Kml_Orcolor":
			Kml_Orcolor_change_zIndex(layer_id, z_idx);
			break;
		case "MVTTile_Orcolor":
			MVTTile_Orcolor_change_zIndex(layer_id, z_idx);
			break;
	}
}
/***********/

//定位



function Locate(lat, lng, range) {
	console.log("loc", lat, lng, range)
	if (lng != null) {

		var center = new ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857');
		var view = new ol.View({ center: center, zoom: parseFloat(range) });

		// maps[0].setView(view);
		// maps[1].setView(view);

		///////Cesium 3D///////
		if (map_win_change_index == 0 && model_3Dchange_index == 1 && map_ind == 1) {
			center = new ol.proj.transform([center[0], center[1]], 'EPSG:3857', 'EPSG:4326');

			let metersPerUnit = map.getView().getProjection().getMetersPerUnit();
			let visibleMapUnits = viewer.canvas.clientHeight / (parseFloat(range) * 0.01);
			let relativeCircumference = Math.cos(Math.abs(Cesium.Math.toRadians(center[1])));
			let visibleMeters = visibleMapUnits * metersPerUnit * relativeCircumference;
			let distance = (visibleMeters / 2) / Math.tan(viewer.camera.frustum.fovy / 2);
			distance = distance * 5 / range;
			viewer.camera.lookAt(
				Cesium.Cartesian3.fromDegrees(center[0], center[1]),
				new Cesium.HeadingPitchRange(
					-1 * map.getView().getRotation(),		// viewer.camera.heading,
					curr_cam_tilt,						//viewer.camera.pitch,
					distance
				)
			);
			viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
		}
		else {
			// change openlayer will sync to cesium directly
			maps.forEach(function (map) {
				map.getView().set("center", center);
				map.getView().setZoom(parseFloat(range));
			});
		}

	}
}

/********* Revise 20221104 youwei ***********/
//定位ICON工具
var Location_Icon_vectorLayer;
var vectorSource;
//查詢定位ICON，原始版的定位功能
function search_Icon_draw(lat, lng,) {
	console.log("\n\n * * search_Icon_draw  * * ")

	if (Location_Icon_vectorLayer != null) {
		maps[map_ind].removeLayer(Location_Icon_vectorLayer);
	}
	var locate_icon = new ol.Feature({
		geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(lng), parseFloat(lat)])),
		name: '定位點'
	});
	locate_icon.setStyle(new ol.style.Style({
		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
			crossOrigin: 'anonymous',
			src: '/map/img/Search_Icon_Location.png'
		}))
	}));
	var vectorSource = new ol.source.Vector({
		features: [locate_icon]
	});
	Location_Icon_vectorLayer = new ol.layer.Vector({
		source: vectorSource
	});
	Location_Icon_vectorLayer.setZIndex(2000);
	console.log("\n\n\n * * map_ind in tool_fun search_Icon_draw :", map_ind)
	maps[map_ind].addLayer(Location_Icon_vectorLayer);
	Locate(lat, lng, 16);
}
//Polygon版 定位ICON工具
var Polygon__Layer;
var Polygon__source;
//查詢定位ICON，Polygon版的定位功能
function search_Icon_draw_Polygon(lat, lng, data) {
	console.log("\n\n * * search_Icon_draw Polygon * * ");

	console.log('data :', data);
	console.log('data:', JSON.stringify(data));
	var polygon_data;
	var coordinates_data;
	$.each(data, function (i, o) {
		console.log('i:', i, 'o:', o.geom);
		console.log('i:', i, 'o:', o.geom.coordinates);
		coordinates_data = o.geom.coordinates;
		console.log('i:', i, 'o:', o.geom.coordinates[0][0][0]);
		console.log('i:', i, 'x :', o.geom.coordinates[0][0][0][0]);
		x = o.geom.coordinates[0][0][0][0];
		console.log('i:', i, 'y :', o.geom.coordinates[0][0][0][1]);
		y = o.geom.coordinates[0][0][0][1];
	});
	// jdata = JSON.stringify(data)// 序列化成 JSON 字串
	console.log('JSON polygon_data:', coordinates_data[0][0]);
	const input_list = coordinates_data[0][0];
	console.log("\n input_list: ", input_list);
	// 檢查用
	console.log("\n map_ind: ", map_ind);
	console.log("\n maps[map_ind]: ", maps[map_ind]);
	console.log("\n layer: ", Polygon__Layer);
	if (Polygon__Layer != null) {
		maps[map_ind].removeLayer(Polygon__Layer);
	}
	maps[map_ind].removeLayer(Polygon__Layer);


	//P
	var styles = [
		/* We are using two different styles for the polygons:
		 *  - The first style is for the polygons themselves.
		 *  - The second style is to draw the vertices of the polygons.
		 *    In a custom `geometry` function the vertices of a polygon are
		 *    returned as `MultiPoint` geometry, which will be used to render
		 *    the style.
		 */
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'blue',
				width: 5
			}),
			fill: new ol.style.Fill({
				color: 'rgba(0, 0, 255, 0.1)'
			})
		}),
		new ol.style.Style({
			image: new ol.style.Circle({
				radius: 0,
				fill: new ol.style.Fill({
					color: 'orange'
				})
			}),
			geometry: function (feature) {
				// return the coordinates of the first ring of the polygon
				var coordinates = feature.getGeometry().getCoordinates()[0];
				return new ol.geom.MultiPoint(coordinates);
			}
		})
	];

	var list = [[23.1, 121], [23.21, 121.8], [24.1, 121.9], [23.1, 121]];

	// 設定畫完圖後的定位位置
	lng = input_list[0][0];
	lat = input_list[0][1];

	list = input_list;

	for (i = 0; i < list.length; i++) {
		lng = list[i][0];
		lat = list[i][1];
		// console.log("lng 經度:", lng, ", lat 緯度:", lat);
		center = new ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857');
		list[i][0] = center[0];
		list[i][1] = center[1];
		// console.log("lng 經度: ", center[0], "lat 緯度: ", center[1]);
	}

	var geojsonObject = {
		'type': 'FeatureCollection',
		'crs': {
			'type': 'name',
			'properties': {
				'name': 'EPSG:3857'
			}
		},
		'features': [{
			'type': 'Feature',
			'geometry': {
				'type': 'Polygon',
				'coordinates': [list]
			}
		}]
	};

	Polygon__Source = new ol.source.Vector({
		features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
	});

	Polygon__Layer = new ol.layer.Vector({
		source: Polygon__Source,
		style: styles
	});
	// 不會使用到的內容
	// P
	// Location_Icon_vectorLayer.setZIndex(2000);
	// P
	// var map = new ol.Map({
	// 	layers: [layer],
	// 	target: 'map',
	// 	view: new ol.View({
	// 		center: [0, 3000000],
	// 		zoom: 2
	// 	})
	// });
	// P
	console.log("\n\n\n * * map_ind in tool_fun search_Icon_draw :", map_ind)
	maps[map_ind].addLayer(Polygon__Layer);
	Locate(lat, lng, 16);
}
//查詢批次定位ICON youwei
// 此功能會將定位的newlist塞入畫面feature，且會將畫面定位在最後一個位置
function search_Icon_draw2(lat, lng, newlist,) {
	console.log("\n\n * * search_Icon_draw2  * * ")

	if (Location_Icon_vectorLayer != null) {
		maps[map_ind].removeLayer(Location_Icon_vectorLayer);
	}

	console.log("newlist : ", newlist)
	// console.log("newlist[1].x : ", newlist[1].x, "newlist[1].y : ", newlist[1].y,)

	let locate_icons = [];

	for (let i = 0; i < newlist.length; i++) {
		var lat = newlist[i].y
		var lng = newlist[i].x
		console.log("lat : ", newlist[i].y, "lng : ", newlist[i].x)
		var locate_icon = new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(lng), parseFloat(lat)])),
			name: '定位點'
		});
		locate_icon.setStyle(new ol.style.Style({
			image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
				crossOrigin: 'anonymous',
				src: '/map/img/Search_Icon_Location.png'
			}))
		}));
		locate_icons.push(locate_icon)
	}

	vectorSource = new ol.source.Vector({
		features: locate_icons
	});
	Location_Icon_vectorLayer = new ol.layer.Vector({
		source: vectorSource
	});
	Location_Icon_vectorLayer.setZIndex(2000);
	console.log("\n\n\n * * map_ind in tool_fun search_Icon_draw2 :", map_ind)
	maps[map_ind].addLayer(Location_Icon_vectorLayer);
	Locate(lat, lng, 16);
}
//查詢批次定位ICON youwei
// 此功能會將定位的newlist塞入畫面feature，但不會將畫面定位
function search_Icon_draw3(lat, lng, newlist,) {
	console.log("\n *** search_Icon_draw3  *** ")

	if (Location_Icon_vectorLayer != null) {
		maps[map_ind].removeLayer(Location_Icon_vectorLayer);
	}

	console.log("newlist : ", newlist)
	// console.log("newlist[1].x : ", newlist[1].x, "newlist[1].y : ", newlist[1].y,)

	let locate_icons = [];

	for (let i = 1; i < newlist.length; i++) {
		var lat = newlist[i].y
		var lng = newlist[i].x
		console.log("lat : ", newlist[i].y, "lng : ", newlist[i].x)
		var locate_icon = new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(lng), parseFloat(lat)])),
			name: '定位點'
		});
		locate_icon.setStyle(new ol.style.Style({
			image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
				crossOrigin: 'anonymous',
				src: '/map/img/Search_Icon_Location.png'
			}))
		}));
		locate_icons.push(locate_icon)
	}

	vectorSource = new ol.source.Vector({
		features: locate_icons
	});
	Location_Icon_vectorLayer = new ol.layer.Vector({
		source: vectorSource
	});
	Location_Icon_vectorLayer.setZIndex(2000);
	console.log("\n *** map_ind in tool_fun search_Icon_draw3 :", map_ind)
	maps[map_ind].addLayer(Location_Icon_vectorLayer);
	// Locate(lat, lng, 16);
}
//批次地址/地點定位 icon清除 delete_one
function search_Icon_draw_delete_one() {
	console.log("search_Icon_draw_delete_one")
	console.log("vectorSource.clear()")
	vectorSource.clear();
	console.log("Location_Icon_vectorLayer.clear()")
	console.log("removeLayer")
	maps[map_ind].removeLayer(Location_Icon_vectorLayer);
}
//查詢批次定位ICON youwei
// 此功能會將定位的newlist塞入畫面feature，且會將畫面定位在最後一個位置
function search_Icon_draw2_delete_one(newlist,) {
	console.log("* * search_Icon_draw2_delete_one  * * ")
	console.log("search_Icon_draw2_delete_one newlist", newlist)
	vectorSource.clear();
	maps[map_ind].removeLayer(Location_Icon_vectorLayer);
	// if (Location_Icon_vectorLayer != null) {
	// 	maps[map_ind].removeLayer(Location_Icon_vectorLayer);
	// }

	console.log("newlist : ", newlist)
	// console.log("newlist[1].x : ", newlist[1].x, "newlist[1].y : ", newlist[1].y, "title : ", newlist[1].title)

	let locate_icons = [];

	for (let i = 0; i < newlist.length; i++) {
		var lat = newlist[i].y
		var lng = newlist[i].x
		console.log("lat : ", newlist[i].y, "lng : ", newlist[i].x, "title : ", newlist[i].title)
		var locate_icon = new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(lng), parseFloat(lat)])),
			name: '定位點'
		});
		locate_icon.setStyle(new ol.style.Style({
			image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
				crossOrigin: 'anonymous',
				src: '/map/img/Search_Icon_Location.png'
			}))
		}));
		locate_icons.push(locate_icon)
	}

	vectorSource = new ol.source.Vector({
		features: locate_icons
	});
	Location_Icon_vectorLayer = new ol.layer.Vector({
		source: vectorSource
	});
	Location_Icon_vectorLayer.setZIndex(2000);
	console.log("* * map_ind in tool_fun search_Icon_draw2 :", map_ind)
	maps[map_ind].addLayer(Location_Icon_vectorLayer);
	console.log("* * search_Icon_draw2_delete_one  * * ")
}
//批次地址/地點定位 icon清除
function search_Icon_draw_clear(length) {
	console.log("search_Icon_draw_clear")
	console.log("vectorSource", vectorSource)
	console.log("vectorSource.features", vectorSource.features)
	console.log("vectorSource.clear()")
	vectorSource.clear();
	console.log("removeLayer")
	maps[map_ind].removeLayer(Location_Icon_vectorLayer);
}
//批次地址/地點定位，單純只有定位功能，location_acc6
function search_Icon_locate(lat, lng) {
	console.log("lat x : ", lat)
	console.log("lng y : ", lng)

	Locate(lat, lng, 16);

}
/********* Revise 20221104 youwei ***********/

//地址/地點定位
function Address_Location(address) {

	//var address = document.getElementById('address').value;

	var geocoder = new google.maps.Geocoder();

	geocoder.geocode({ 'address': address }, function (point, status) {

		if (point != null) {

			//alert(point[0].geometry.location.lat()+","+ point[0].geometry.location.lng());
			search_Icon_draw(point[0].geometry.location.lat(), point[0].geometry.location.lng());
		}
	});
}
//twd97_坐標定位
function twd97locexe(twd97x, twd97y) {
	//var twd97x = document.getElementById('twd97textx').value;
	//var twd97y = document.getElementById('twd97texty').value;


	if (twd97x.length > 0 && twd97y.length > 0) {
		//轉換
		var itemloc = [twd97x, twd97y];

		var itemloc84 = jsto84(itemloc);

		//hadleNoGeolocation(itemloc84[0], itemloc84[1], "TWD97坐標：" + itemloc);
		search_Icon_draw(itemloc84[0], itemloc84[1]);

		/*$("#freeow").freeow("通知", "定位完成", {
			classes: ["gray", "pushpin"],
			autoHide: true,
			autoHideDelay: 3000
		});*/

	} else {
		//表示有一方為空值或兩者都為空
		/*$("#freeow").freeow("通知", "請輸入完整的TWD97坐標值", {
			classes: ["gray", "pushpin"],
			autoHide: true,
			autoHideDelay: 3000
		});*/
		return
	}
}
//twd97_批次坐標坐標定位
function twd97locexe2(twd97xx, twd97yy, newlist) {
	//var twd97x = document.getElementById('twd97textx').value;
	//var twd97y = document.getElementById('twd97texty').value;
	console.log("newlist : ", newlist)

	for (let i = 1; i < newlist.length; i++) {
		var twd97x = newlist[i].y
		var twd97y = newlist[i].x
		console.log("twd97x : ", twd97x, "twd97y : ", twd97y)

		if (twd97x.length > 0 && twd97y.length > 0 && twd97x > 180) {
			//轉換
			var itemloc = [twd97x, twd97y];

			var itemloc84 = jsto84(itemloc);
			console.log("itemloc84 : ", itemloc84)
			console.log("twd97x : ", itemloc84[0], "twd97y : ", itemloc84[1])
			newlist[i].y = itemloc84[0]
			newlist[i].x = itemloc84[1]

			//hadleNoGeolocation(itemloc84[0], itemloc84[1], "TWD97坐標：" + itemloc);

			search_Icon_draw2(itemloc84[0], itemloc84[1], newlist);
			search_Icon_locate(itemloc84[0], itemloc84[1]);
			/*$("#freeow").freeow("通知", "定位完成", {
				classes: ["gray", "pushpin"],
				autoHide: true,
				autoHideDelay: 3000
			});*/

		} else {
			//表示有一方為空值或兩者都為空
			/*$("#freeow").freeow("通知", "請輸入完整的TWD97坐標值", {
				classes: ["gray", "pushpin"],
				autoHide: true,
				autoHideDelay: 3000
			});*/
			search_Icon_locate(newlist[i].y, newlist[i].x);

		}
	}
}
//twd67_坐標定位
function twd67locexe(twd67x, twd67y) {
	// var twd67x = document.getElementById('twd67textx').value;
	//var twd67y = document.getElementById('twd67texty').value;

	if (twd67x.length > 0 && twd67y.length > 0) {
		//轉換
		var itemloc = [twd67x, twd67y];



		var a = 0.00001549, b = 0.000006521;

		var x67 = parseFloat(itemloc[0]) + 807.8 + a * parseFloat(itemloc[0]) + b * parseFloat(itemloc[1]);
		var y67 = parseFloat(itemloc[1]) - 248.6 + a * parseFloat(itemloc[1]) + b * parseFloat(itemloc[0]);

		itemloc[0] = x67;
		itemloc[1] = y67;

		var itemloc2 = [x67, y67];
		var itemloc84 = jsto84(itemloc2);
		//hadleNoGeolocation(itemloc84[0], itemloc84[1], "TWD67坐標：" + itemloc);
		search_Icon_draw(itemloc84[0], itemloc84[1]);
		/*$("#freeow").freeow("通知", "定位完成", {
			classes: ["gray", "pushpin"],
			autoHide: true,
			autoHideDelay: 3000
		});*/

	} else {
		//表示有一方為空值或兩者都為空
		/*$("#freeow").freeow("通知", "請輸入完整的TWD67坐標值", {
			classes: ["gray", "pushpin"],
			autoHide: true,
			autoHideDelay: 3000
		});*/
		return
	}



}
//twd67_批次坐標定位
function twd67locexe2(twd67x, twd67y) {
	// var twd67x = document.getElementById('twd67textx').value;
	//var twd67y = document.getElementById('twd67texty').value;

	if (twd67x.length > 0 && twd67y.length > 0) {
		//轉換
		var itemloc = [twd67x, twd67y];



		var a = 0.00001549, b = 0.000006521;

		var x67 = parseFloat(itemloc[0]) + 807.8 + a * parseFloat(itemloc[0]) + b * parseFloat(itemloc[1]);
		var y67 = parseFloat(itemloc[1]) - 248.6 + a * parseFloat(itemloc[1]) + b * parseFloat(itemloc[0]);

		itemloc[0] = x67;
		itemloc[1] = y67;

		var itemloc2 = [x67, y67];
		var itemloc84 = jsto84(itemloc2);
		//hadleNoGeolocation(itemloc84[0], itemloc84[1], "TWD67坐標：" + itemloc);
		search_Icon_draw2(itemloc84[0], itemloc84[1]);
		/*$("#freeow").freeow("通知", "定位完成", {
			classes: ["gray", "pushpin"],
			autoHide: true,
			autoHideDelay: 3000
		});*/

	} else {
		//表示有一方為空值或兩者都為空
		/*$("#freeow").freeow("通知", "請輸入完整的TWD67坐標值", {
			classes: ["gray", "pushpin"],
			autoHide: true,
			autoHideDelay: 3000
		});*/
		return
	}



}
/********* add 20220709 youwei ***********/

//坐標轉換
function jsto84(loc) {
	//TWD97 二度分帶轉WGS84
	var x = Math.round(loc[0], 10);
	var y = Math.round(loc[1], 10);

	var a = 6378137.0;
	var b = 6356752.314245;
	var lon0 = 121 * Math.PI / 180;
	var k0 = 0.9999;
	var dx = 250000;

	var dy = 0;
	var fe = Math.pow((1 - Math.pow(b, 2) / Math.pow(a, 2)), 0.5);
	x = x - dx;
	y = y - dy;

	var M = y / k0;

	var mu = M / (a * (1.0 - Math.pow(fe, 2) / 4.0 - 3 * Math.pow(fe, 4) / 64.0 - 5 * Math.pow(fe, 6) / 256.0));
	var e1 = (1.0 - Math.pow((1.0 - Math.pow(fe, 2)), 0.5)) / (1.0 + Math.pow((1.0 - Math.pow(fe, 2)), 0.5));
	var J1 = (3 * e1 / 2 - 27 * Math.pow(e1, 3) / 32.0);
	var J2 = (21 * Math.pow(e1, 2) / 16 - 55 * Math.pow(e1, 4) / 32.0);
	var J3 = (151 * Math.pow(e1, 3) / 96.0);
	var J4 = (1097 * Math.pow(e1, 4) / 512.0);

	var fp = mu + J1 * Math.sin(2 * mu) + J2 * Math.sin(4 * mu) + J3 * Math.sin(6 * mu) + J4 * Math.sin(8 * mu);

	var e2 = Math.pow((fe * a / b), 2);
	var C1 = Math.pow(e2 * Math.cos(fp), 2);
	var T1 = Math.pow(Math.tan(fp), 2);
	var R1 = a * (1 - Math.pow(fe, 2)) / Math.pow((1 - Math.pow(fe, 2) * Math.pow(Math.sin(fp), 2)), (3.0 / 2.0));
	var N1 = a / Math.pow((1 - Math.pow(fe, 2) * Math.pow(Math.sin(fp), 2)), 0.5);

	var D = x / (N1 * k0);
	//lat
	var Q1 = N1 * Math.tan(fp) / R1;
	var Q2 = (Math.pow(D, 2) / 2.0);
	var Q3 = (5 + 3 * T1 + 10 * C1 - 4 * Math.pow(C1, 2) - 9 * e2) * Math.pow(D, 4) / 24.0;
	var Q4 = (61 + 90 * T1 + 298 * C1 + 45 * Math.pow(T1, 2) - 3 * Math.pow(C1, 2) - 252 * e2) * Math.pow(D, 6) / 720.0;
	var lat = fp - Q1 * (Q2 - Q3 + Q4);

	//lon
	var Q5 = D;
	var Q6 = (1 + 2 * T1 + C1) * Math.pow(D, 3) / 6;
	var Q7 = (5 - 2 * C1 + 28 * T1 - 3 * Math.pow(C1, 2) + 8 * e2 + 24 * Math.pow(T1, 2)) * Math.pow(D, 5) / 120.0;
	var lon = lon0 + (Q5 - Q6 + Q7) / Math.cos(fp);

	lat = (lat * 180) / Math.PI; //緯
	lon = (lon * 180) / Math.PI; //經

	var cwgs84xy = [lat.toString(), lon.toString()];

	return cwgs84xy;
}

//文件點擊呈現
function Docs_icon_click(id, name) {
	if (id.indexOf("d3_") != 0) {
		Docs_info_w1.show();
		Docs_info_w1.setModal(false);
	}


	swcb_photo_link = id.indexOf("swcb.gov.tw/");

	//alert(swcb_photo_link);
	var filename = id;
	var extIndex = filename.lastIndexOf('.');
	Docs_info_w1.setText(name);
	if (extIndex != -1) {
		var name = filename.substr(0, extIndex);                     //檔名不含副檔名		 
		var ext = filename.substr(extIndex + 1, filename.length);  //副檔名
	}

	if (ext == "jpg" || ext == "png" || ext == "gif") {
		Docs_info_w1.attachHTMLString(
			"<img src=" + id + " width=\"850px\">"
		);
	} else if (ext == "pdf" || ext == "docx" || ext == "pptx") {
		Docs_info_w1.attachHTMLString(
			'如檔案較大，線上瀏覽請稍後...或檔案不支援線上瀏覽器<br>' +
			'直接進行檔案下載<a href=' + id + '  target="_blank">下載連結 </a>  <br>' +
			'<iframe src="http://docs.google.com/gview?url=' + id + '&embedded=true" style="width:850px; height:500px;" frameborder="0"></iframe>'
			// "<iframe src=\"http://docs.google.com/gview?url="+id+"&embedded=true\" style=\"width:600px; height:500px;\" frameborder=\"0\″></iframe>"
		);
	} else if (swcb_photo_link > 0) {

		Docs_info_w1.setDimension(1024, 768);
		Docs_info_w1.attachURL(id);

	}

	//alert("1"+id);
}
//地圖框選
var vector_box;
var source_box;

var draw_box; // global so we can remove it later
/*** add 1015 ***/
var draw_box_zindex = 10000;
/****************/

var vector_box_2;
var source_box_2;

var draw_box_2; // global so we can remove it later
/*** add 1015 ***/
var draw_box_zindex_2 = 10001;

function box_select() {
	document.getElementById("space_lonlat").checked = true;
	if (vector_box) {
		maps[map_ind].removeLayer(vector_box);
		vector_box.getSource().clear();
		source_box.clear();
		maps[map_ind].addLayer(vector_box);
	}

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
	vector_box.setZIndex(2);
	value = 'LineString';
	maxPoints = 2;
	geometryFunction = function (coordinates, geometry) {
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

	maps[map_ind].addInteraction(draw_box);
	draw_box.on('drawend', function (e) {

		//alert(e.feature.getGeometry().getExtent());

		box_array = (String(e.feature.getGeometry().getExtent())).split(",");




		loc_84 = ol.proj.transform([box_array[0], box_array[3]], 'EPSG:3857', 'EPSG:4326');
		document.getElementById("Search_In_drawbox_LU_X").value = loc_84[0];
		document.getElementById("Search_In_drawbox_LU_Y").value = loc_84[1];
		loc_84 = ol.proj.transform([box_array[2], box_array[1]], 'EPSG:3857', 'EPSG:4326');
		document.getElementById("Search_In_drawbox_RD_X").value = loc_84[0];
		document.getElementById("Search_In_drawbox_RD_Y").value = loc_84[1];
		maps[map_ind].removeInteraction(draw_box);
	})




	// addInteraction();



}

/*** 1008 add ***/
function clear_map() {
	if (line_chart) {
		line_chart.clear();
		line_chart = null;
	}

	if (path_chart) {
		path_chart.clear();
		path_chart = null;
	}

	if (draw_box) {
		maps[map_ind].removeInteraction(draw_box);
	}

	if (vector_box) {
		maps[map_ind].removeLayer(vector_box);
		vector_box.getSource().clear();
		source_box.clear();
		maps[map_ind].addLayer(vector_box);
	}

	if (icon_box) {
		maps[map_ind].removeLayer(icon_box);
		icon_box.getSource().clear();
		icon_source.clear();
		maps[map_ind].addLayer(icon_box);
	}

	if (aspect_draw_type != "none") {
		createMeasureTooltip();
		aspect_layer.getSource().clear();
		maps[map_ind].removeInteraction(aspect_draw);
	}
	if (slope_draw_type != "none") {
		createMeasureTooltip();
		slope_layer.getSource().clear();
		maps[map_ind].removeInteraction(slope_draw);
	}

	if (cluster_layer_earthquake != null) {
		search_option = 0;
		select_earthquake_or_wall = 0;
		maps[map_ind].removeLayer(cluster_layer_earthquake);
		cluster_layer_earthquake = null;
		document.getElementById('show_earthquake_cluster_btn').disabled = true;
		document.getElementById('bidirection_slider').style.display = 'none';
		document.getElementById('hslider').style.display = 'none';
		document.getElementById('bidirection_slider_time').style.display = 'none';
		document.getElementById('hslider_time').style.display = 'none';

		// display earthquake cluster checkbox
		$("#display_earthquake_checked").prop('disabled', true);
		document.getElementById("display_earthquake_checked").checked = false;
		document.getElementById('earthquake_checkbox_label').innerHTML = "開啟地震叢集"
		$("#show_earthquake_cluster_btn").val("隱藏叢集");
		$("#show_wall_cluster_btn").val("隱藏叢集");
	}

	if (cluster_layer_wall != null) {
		search_option = 0;
		select_earthquake_or_wall = 0;
		maps[map_ind].removeLayer(cluster_layer_wall);
		cluster_layer_wall = null;
		document.getElementById('show_wall_cluster_btn').disabled = true;
		document.getElementById('wall_slider_time').style.display = 'none';
		document.getElementById('wall_time').style.display = 'none';
		$("#show_earthquake_cluster_btn").val("隱藏叢集");
		$("#show_wall_cluster_btn").val("隱藏叢集");
	}

	if (mag_layer_content != null) {
		MapOverlay2(0, mag_layer_content, 0);
		mag_layer_content = null;
		mag_layer_checked = 0;
	}
	if (pga_layer_content != null) {
		MapOverlay2(0, pga_layer_content, 0);
		pga_layer_content = null;
		pga_layer_checked = 0;
	}
	if (pgv_layer_content != null) {
		MapOverlay2(0, pgv_layer_content, 0);
		pgv_layer_content = null;
		pgv_layer_checked = 0;
	}
	if (mag_val_layer_content != null) {
		select_earthquake_or_wall = 0;
		maps[map_ind].removeLayer(mag_val_layer_content);
		mag_val_layer_content = null;
		mag_val_layer_checked = 0;
	}


	/*** add 1015 ***/
	btn_enable()
	/****************/
	/*** 20190330 fixed ***/
	//clear_route();
	/*** 20190330 fixed ***/
	/*** add 20190515 ***/
	clear_var()
	/*** add 20190515 ***/


	createMeasureTooltip();
}
/*** add ***/


function clear_map2() {

	if (draw_box_2) {
		maps[map_ind].removeInteraction(draw_box_2);
	}

	if (vector_box_2) {
		maps[map_ind].removeLayer(vector_box_2);
		vector_box_2.getSource().clear();
		source_box_2.clear();
		maps[map_ind].addLayer(vector_box_2);
	}

	if (aspect_draw_type != "none") {
		createMeasureTooltip();
		aspect_layer.getSource().clear();
		maps[map_ind].removeInteraction(aspect_draw);
	}
	if (slope_draw_type != "none") {
		createMeasureTooltip();
		slope_layer.getSource().clear();
		maps[map_ind].removeInteraction(slope_draw);
	}

	/*** add 1015 ***/
	btn_enable()
	/****************/
	/*** 20190330 fixed ***/
	//clear_route();
	/*** 20190330 fixed ***/
	/*** add 20190515 ***/
	clear_var()
	/*** add 20190515 ***/


	createMeasureTooltip();
}


/*** add 20190515 ***/
function clear_var() {
	path_coord = "";
	c_sen_url = "";
	sen2_sis_cmd = "";
	cutfillL_cmd = "";
	cutfill_cmd = "";
	contour_cmd = "";
	openness_cmd = "";
	svf_cmd = "";
	MCRIF_cmd = "";
	hillshadeAZ_cmd = "";
	hillshade_cmd = "";
	stlfile_cmd = "";
	slope_draw_type = "";
	sen_url = "";

}

/**
 * Capitalize the first letter of the string, and lowercase other letters
 *
 * @param {string} str String you want to capitalize first letter
 * @returns {string} String with first letter capital
 */
function Capitalize_String(str) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function Get_Id_From_Rowid(rowid) {
	if (rowid.split("@")[3] != undefined) {
		return rowid.split("@")[3];
	}
	else {
		return rowid;
	}
}

function Get_Layer_Content_From_Id(id) {
	// console.log(id);
	// let is_static = (id.toString()[0] == 'b' || id.toString()[0] == 'e' || id.toString()[0] == 'l' || id.toString()[0] == 'm' || id.toString()[0] == 'p') ? true : false;
	// let res = $.ajax({
	// 	type: "GET",
	// 	url: "php/get_layer_data.php",
	// 	dataType: "json",
	// 	data: {
	// 		req: (is_static) ? "static" : "dynamic",
	// 		layer_id: id
	// 	},
	// 	async: false,
	// 	error: function (err) {
	// 		console.log(err);
	// 	}
	// }).responseJSON;

	// if (is_static) {
	// 	return {
	// 		url: res.url,
	// 		type: res.Type,
	// 		pos_info: res.PosInfo,
	// 		name: res.FileName,
	// 		id: res.ID
	// 	};
	// }
	// else {
	// 	return {
	// 		url: res[0].AccessURL,
	// 		type: res[0].AccessType,
	// 		pos_info: `${res[0].CenterLatitude};${res[0].CenterLongitude};${res[0].CenterHeight};${res[0].Level}`,
	// 		name: res[0].Title,
	// 		id: res[0].Id,
	// 	}

	// }
	let res = $.ajax({
		type: "GET",
		url: "php/get_layer_data.php",
		dataType: "json",
		data: {
			req: "",
			layer_id: id
		},
		async: false,
		error: function (err) {
			console.log(err);
		}
	}).responseJSON;
	console.log(res);
}

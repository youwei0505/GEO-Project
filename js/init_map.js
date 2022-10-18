var maps = [];
var ol3d;
var scene;
var terrainProvider;
var tileset = [];

//同步事件
var syncMaps = function (evt) {
	var type = evt.type.split(':');
	if (type[0] === 'change' && type.length === 2) {
		if (mapMoveSync != 2) {
			var attribute = type[1];
			maps.forEach(function (map) {
				var value = evt.target.get(attribute);
				if (map.getView().get(attribute) !== value) {
					map.getView().set(attribute, value);
				}
			});

			///////Cesium 3D///////
			if (viewer != null) {
				if (attribute == 'center') {
					var value = evt.target.get(attribute);
					var center = new ol.proj.transform([value[0], value[1]], 'EPSG:3857', 'EPSG:4326')

					let metersPerUnit = map.getView().getProjection().getMetersPerUnit();
					let visibleMapUnits = map.getView().getResolution() * viewer.canvas.clientHeight;
					let relativeCircumference = Math.cos(Math.abs(Cesium.Math.toRadians(center[1])));
					let visibleMeters = visibleMapUnits * metersPerUnit * relativeCircumference;
					let distance = (visibleMeters / 2) / Math.tan(viewer.camera.frustum.fovy / 2);
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
				else if (attribute == 'resolution') {
					var center = new ol.proj.transform([map.getView().getCenter()[0], map.getView().getCenter()[1]], 'EPSG:3857', 'EPSG:4326');
					let metersPerUnit = map.getView().getProjection().getMetersPerUnit();
					let visibleMapUnits = map.getView().getResolution() * viewer.canvas.clientHeight;
					let relativeCircumference = Math.cos(Math.abs(Cesium.Math.toRadians(center[1])));
					let visibleMeters = visibleMapUnits * metersPerUnit * relativeCircumference;
					let distance = (visibleMeters / 2) / Math.tan(viewer.camera.frustum.fovy / 2);
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
				else if (attribute == 'rotation') {
					if (alt_shift_press) {
						var center = new ol.proj.transform([map.getView().getCenter()[0], map.getView().getCenter()[1]], 'EPSG:3857', 'EPSG:4326');
						let metersPerUnit = map.getView().getProjection().getMetersPerUnit();
						let visibleMapUnits = map.getView().getResolution() * viewer.canvas.clientHeight;
						let relativeCircumference = Math.cos(Math.abs(Cesium.Math.toRadians(center[1])));
						let visibleMeters = visibleMapUnits * metersPerUnit * relativeCircumference;
						let distance = (visibleMeters / 2) / Math.tan(viewer.camera.frustum.fovy / 2);
						var value = evt.target.get(attribute);
						viewer.camera.lookAt(
							Cesium.Cartesian3.fromDegrees(center[0], center[1]),
							new Cesium.HeadingPitchRange(
								-1 * map.getView().getRotation(),		// viewer.camera.heading,
								curr_cam_tilt,						//viewer.camera.pitch,
								distance
							)
						);
						if (panorama) {
							panorama.setPov({
								heading: viewer.camera.heading * 180 / Math.PI,
								pitch: panorama.getPov().pitch
							});
						}
						viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
					}
				}
			}

		}
	}
}

//預設底圖
var sources = [
	new ol.source.OSM(),
	new ol.source.Stamen({ layer: 'toner' }),
];


var styles = [
	'Aerial'
];

var bing_layers = [];
var i, ii;
for (i = 0, ii = styles.length; i < ii; ++i) {
	bing_layers.push(new ol.layer.Tile({
		visible: true,
		preload: Infinity,
		source: new ol.source.BingMaps({
			key: 'AlLRJKkCosmEHgRwRjiC3GSCBoofEGQTrVXdI-PC-JjUrjhAqcdERbTmkXVyMokt',
			imagerySet: styles[i],
			projection: 'EPSG:3857',
			// use maxZoom 19 to see stretched tiles instead of the BingMaps
			// "no photos at this zoom level" tiles
			maxZoom: 19
		})
	}));
}

var source_bing_s = new ol.source.BingMaps({
	key: 'AlLRJKkCosmEHgRwRjiC3GSCBoofEGQTrVXdI-PC-JjUrjhAqcdERbTmkXVyMokt',
	imagerySet: 'Aerial',
	projection: 'EPSG:3857',
	// use maxZoom 19 to see stretched tiles instead of the BingMaps
	// "no photos at this zoom level" tiles
	maxZoom: 19
});

//初始化 map

//[new ol.layer.Tile({source: sources[0]})]
//http://maps.nlsc.gov.tw/S_Maps/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=EMAP1&STYLE=_null&TILEMATRIXSET=EPSG:3857&TILEMATRIX=EPSG:3857:{z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png
//http://mt0.google.cn/vt/lyrs=m@132&hl=zhCN&gl=cn&x={x}&y={y}&z={z}&s=Ga

/*h = roads only  //google 底圖代號
m = standard roadmap
p = terrain
r = somehow altered roadmap
s = satellite only
t = terrain only
y = hybrid*/

/*國土測繪中心底圖  https://maps.nlsc.gov.tw/S09SOA/
臺灣通用電子地圖            EMAP
臺灣通用電子地圖(不含等高線)EMAP6
1/5000 基本地形圖           B5000
通用版電子地圖透明(含建物)  EMAP1
通用版電子地圖透明          EMAP2
通用版電子地圖              EMAP
段籍圖                      LANDSECT
國土利用調查成果圖 		    LUIMAP
正射影像圖(通用版) 		    PHOTO2
村里界 					    Village	
*/


var source_nlsc_EMAP = new ol.source.TileImage({ url: 'https://wmts.nlsc.gov.tw/wmts/EMAP5/default/EPSG:3857/{z}/{y}/{x}', crossOrigin: 'anonymous' });
var source_nlsc_PHOTO2 = new ol.source.TileImage({ url: 'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/EPSG:3857/{z}/{y}/{x}', crossOrigin: 'anonymous' });
var source_nlsc_LUIMAP = new ol.source.TileImage({ url: 'https://wmts.nlsc.gov.tw/wmts/LUIMAP/default/EPSG:3857/{z}/{y}/{x}', crossOrigin: 'anonymous' });
//var source_nlsc_PB = new ol.source.TileImage({ url: 'https://wmts.nlsc.gov.tw/wmts/B25000/default/EPSG:3857/{z}/{y}/{x}', crossOrigin: 'anonymous' });
var source_gm_m = new ol.source.TileImage({ url: 'https://mt{1-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', crossOrigin: 'anonymous' });
var source_gm_s = new ol.source.TileImage({ url: 'https://mt{1-3}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', crossOrigin: 'anonymous' });
var source_gm_y = new ol.source.TileImage({ url: 'https://mt{1-3}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', crossOrigin: 'anonymous' });
var source_gm_p = new ol.source.TileImage({ url: 'https://mt{1-3}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', crossOrigin: 'anonymous' });
var source_moeacgs_CGS = new ol.source.TileImage({ url: 'https://gis3.moeacgs.gov.tw/api/Tile/v1/getTile.cfm?layer=CGS_CGS_MAP&x={x}&y={y}&z={z}', crossOrigin: 'anonymous' });
var source_osm_m = new ol.source.TileImage({ url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png', crossOrigin: 'anonymous' });

var source_swcb_r_2020 = new ol.source.TileImage({
	tileUrlFunction: function (tileCoord) {
		var z = tileCoord[0];
		var x = tileCoord[1] - 1;
		var y = -tileCoord[2] - 1;
		return 'https://storage.geodac.tw/Tile/Map/Host/20M/20200000_121000000_023000000_14_000_Map_HOST_20M/' + z + '/' + y + '/' + x + '.jpg?token=' + layer_token; //https://geodac.ncku.edu.tw/SWCB/MultiStage/Taiwan_Rmap_20m_opendata/
	}, crossOrigin: 'anonymous'
});
var source_swcb_r = new ol.source.TileImage({
	tileUrlFunction: function (tileCoord) {
		var z = tileCoord[0];
		var x = tileCoord[1] - 1;
		var y = -tileCoord[2] - 1;
		return 'https://storage.geodac.tw/Tile/Map/Host/20M/00000000_121000000_023000000_14_000_Map_HOST_20M/' + z + '/' + y + '/' + x + '.jpg?token=' + layer_token; //https://geodac.ncku.edu.tw/SWCB/MultiStage/Taiwan_Rmap_20m_opendata/
	}, crossOrigin: 'anonymous'
});
var source_swcb_r_5m = new ol.source.TileImage({
	tileUrlFunction: function (tileCoord) {
		var z = tileCoord[0];
		var x = tileCoord[1] - 1;
		var y = -tileCoord[2] - 1;
		return 'https://geodac.ncku.edu.tw/SWCB/MultiStage/Taiwan_Rmap_5m_opendata/' + z + '/' + y + '/' + x + '.jpg?token=' + layer_token;
	}, crossOrigin: 'anonymous'
});

var source_swcb_r_1m = new ol.source.TileImage({
	tileUrlFunction: function (tileCoord) {
		var z = tileCoord[0];
		var x = tileCoord[1] - 1;
		var y = -tileCoord[2] - 1;
		return 'https://storage.geodac.tw/Tile/SWCBProject/Taiwan_Rmap_1m/' + z + '/' + y + '/' + x + '.jpg?token=' + layer_token;
	}, crossOrigin: 'anonymous'
});
var source_swcb_CS = new ol.source.TileImage({
	tileUrlFunction: function (tileCoord) {
		var z = tileCoord[0];
		var x = tileCoord[1] - 1;
		var y = -tileCoord[2] - 1;
		return 'https://geodac.ncku.edu.tw/SWCB/MultiStage/csmap_Tile/' + z + '/' + y + '/' + x + '.jpg';
	}, crossOrigin: 'anonymous'
});
var source_swcb_CS_5m = new ol.source.TileImage({
	tileUrlFunction: function (tileCoord) {
		var z = tileCoord[0];
		var x = tileCoord[1] - 1;
		var y = -tileCoord[2] - 1;
		return 'https://geodac.ncku.edu.tw/SWCB/MultiStage/csmap_5m_Tile/' + z + '/' + y + '/' + x + '.jpg';
	}, crossOrigin: 'anonymous'
});
var source_swcb_CS_1m = new ol.source.TileImage({
	tileUrlFunction: function (tileCoord) {
		var z = tileCoord[0];
		var x = tileCoord[1] - 1;
		var y = -tileCoord[2] - 1;
		return 'https://storage.geodac.tw/Tile/Map/CSMap/1M/' + z + '/' + y + '/' + x + '.jpg';
	}, crossOrigin: 'anonymous'
});
/*var source_nlsc_PB = new ol.source.TileImage({
	tileUrlFunction: function (tileCoord) {
		var z = tileCoord[0];
		var x = tileCoord[1] - 1;
		var y = -tileCoord[2] - 1;
		return 'https://s186.geodac.tw/BaseMap/PhotoBaseMap_GM/' + z + '/' + y + '/' + x + '.jpg';
	}, crossOrigin: 'anonymous'
});*///原有自行發布1993年版本
var source_nlsc_PB = new ol.source.TileImage({
	tileUrlFunction: function (tileCoord) {
		var z = tileCoord[0];
		var x = tileCoord[1];
		var y = -tileCoord[2] - 1;
		return "https://gis.sinica.edu.tw/tileserver/file-exists.php?img=TM25K_2001-jpg-" + z + "-" + x + "-" + y;
	}, crossOrigin: 'anonymous'
});

var source_aso_ATIS = new ol.source.ImageWMS({
	url: 'php/wms.php',
	params: { 'LAYERS': 'ATIS_MNC' },
	serverType: 'geoserver',
	crossOrigin: 'anonymous'
});
/*var projection = ol.proj.get('EPSG:3857');	  
var projectionExtent = projection.getExtent();
var resolutions = new Array(14);
	var matrixIds = new Array(14);
	for (var z = 0; z < 14; ++z) {
	  // generate resolutions and matrixIds arrays for this WMTS
	  resolutions[z] = size / Math.pow(2, z);
	  matrixIds[z] = z;
	}  
var source_aso_ATIS = new ol.source.WMTS({
	  url: 'http://gis.sinica.edu.tw/tileserver/wmts',
	  layer: 'Taipei_aerialphoto_1945',
	  format: 'image/jpeg',
	  projection: 'EPSG:3857',
			tileGrid: new ol.tilegrid.WMTS({
			  origin: ol.extent.getTopLeft(projectionExtent),
			  resolutions: resolutions,
			  matrixIds: matrixIds
			}),
	  style: 'default'
  	
	});*/
var source_gwh_geo4 = new ol.source.ImageWMS({
	url: 'php/wms_gwh_geo4.php',
	params: { 'LAYERS': ',WMS/LAYER/TW/G97_TW_A1_P_2013F' },
	projection: 'EPSG:4326',
	serverType: 'geoserver',
	crossOrigin: 'anonymous'
});
var source_aso_ATIS_base = new ol.source.TileImage({
	tileUrlFunction: function (tileCoord) {
		var z = tileCoord[0];
		var x = tileCoord[1];
		var y = -tileCoord[2] - 1;
		return 'https://newhub.swcb.gov.tw/arcgis/rest/services/WMTS/base_map/MapServer/tile/' + z + '/' + y + '/' + x;
	}
});

var source_aso_base_hillside = new ol.source.TileImage({
	tileUrlFunction: function (tileCoord) {
		var z = tileCoord[0];
		var x = tileCoord[1] - 1;
		var y = -tileCoord[2] - 1;
		return 'https://storage.geodac.tw/Tile/Map/PhotoBaseMap/20180000_121000000_023000000_14_000_PhotoBaseMap/' + z + '/' + y + '/' + x + '.jpg';
	}, crossOrigin: 'anonymous'
});

var map_layer_nlsc_EMAP = new ol.layer.Tile();
map_layer_nlsc_EMAP.setSource(source_nlsc_EMAP);
map_layer_nlsc_EMAP.setZIndex(0);
var map_layer_nlsc_PHOTO2 = new ol.layer.Tile();
map_layer_nlsc_PHOTO2.setSource(source_nlsc_PHOTO2);
map_layer_nlsc_PHOTO2.setZIndex(0);
var map_layer_nlsc_LUIMAP = new ol.layer.Tile();
map_layer_nlsc_LUIMAP.setSource(source_nlsc_LUIMAP);
map_layer_nlsc_LUIMAP.setZIndex(0);

var map_layer_gm_m = new ol.layer.Tile();
map_layer_gm_m.setSource(source_gm_m);
map_layer_gm_m.setZIndex(0);
var map_layer_gm_s = new ol.layer.Tile();
map_layer_gm_s.setSource(source_gm_s);
map_layer_gm_s.setZIndex(0);
var map_layer_gm_y = new ol.layer.Tile();
map_layer_gm_y.setSource(source_gm_y);
map_layer_gm_y.setZIndex(0);
var map_layer_gm_p = new ol.layer.Tile();
map_layer_gm_p.setSource(source_gm_p);
map_layer_gm_p.setZIndex(0);
var map_layer_osm_m = new ol.layer.Tile();
map_layer_osm_m.setSource(source_osm_m);
map_layer_osm_m.setZIndex(0);
var map_layer_swcb_r_2020 = new ol.layer.Tile();
map_layer_swcb_r_2020.setSource(source_swcb_r_2020);
map_layer_swcb_r_2020.setZIndex(0);
var map_layer_swcb_r = new ol.layer.Tile();
map_layer_swcb_r.setSource(source_swcb_r);
map_layer_swcb_r.setZIndex(0);
var map_layer_swcb_r_5m = new ol.layer.Tile();
map_layer_swcb_r_5m.setSource(source_swcb_r_5m);
map_layer_swcb_r_5m.setZIndex(0);
var map_layer_swcb_r_1m = new ol.layer.Tile();
map_layer_swcb_r_1m.setSource(source_swcb_r_1m);
map_layer_swcb_r_1m.setZIndex(0);
var map_layer_swcb_CS = new ol.layer.Tile();
map_layer_swcb_CS.setSource(source_swcb_CS);
map_layer_swcb_CS.setZIndex(0);
var map_layer_swcb_CS_5m = new ol.layer.Tile();
map_layer_swcb_CS_5m.setSource(source_swcb_CS_5m);
map_layer_swcb_CS_5m.setZIndex(0);
var map_layer_swcb_CS_1m = new ol.layer.Tile();
map_layer_swcb_CS_1m.setSource(source_swcb_CS_1m);
map_layer_swcb_CS_1m.setZIndex(0);
var map_layer_aso_ATIS_base = new ol.layer.Tile();
map_layer_aso_ATIS_base.setSource(source_aso_ATIS_base);
map_layer_aso_ATIS_base.setZIndex(0);
var map_layer_aso_ATIS = new ol.layer.Image();
map_layer_aso_ATIS.setSource(source_aso_ATIS);
map_layer_aso_ATIS.setZIndex(0);
/*var map_layer_gwh_geo4 = new ol.layer.Image();
map_layer_gwh_geo4.setSource(source_gwh_geo4);
map_layer_gwh_geo4.setZIndex(0);*/
var map_layer_moeacgs_CGS = new ol.layer.Tile();
map_layer_moeacgs_CGS.setSource(source_moeacgs_CGS);
map_layer_moeacgs_CGS.setZIndex(0);

var map_layer_nlsc_PB = new ol.layer.Tile();
map_layer_nlsc_PB.setSource(source_nlsc_PB);
map_layer_nlsc_PB.setZIndex(0);

var map_layer_aso_base_hillside = new ol.layer.Tile();
map_layer_aso_base_hillside.setSource(source_aso_base_hillside);
map_layer_aso_base_hillside.setZIndex(0);

var base_map_array = [map_layer_gm_m, map_layer_nlsc_EMAP, map_layer_osm_m, map_layer_gm_s, map_layer_gm_y, map_layer_nlsc_PHOTO2, map_layer_gm_p, map_layer_swcb_r_2020, map_layer_swcb_r, map_layer_swcb_r_5m, map_layer_swcb_CS, map_layer_swcb_CS_5m, map_layer_aso_ATIS_base, map_layer_aso_ATIS, map_layer_moeacgs_CGS, map_layer_nlsc_PB, map_layer_nlsc_LUIMAP, map_layer_swcb_r_1m, map_layer_swcb_CS_1m, map_layer_aso_base_hillside];
var map01_layer = new ol.layer.Tile();
map01_layer.setSource(source_gm_m);
var map = new ol.Map({
	layers: [map01_layer],
	interactions: ol.interaction.defaults().extend([new ol.interaction.Select({
		condition: function (evt) {
			if (cluster_layer_earthquake != null || cluster_layer_wall != null) {
				return evt.type == 'pointermove';// || evt.type == 'singleclick';
			}
			else {
				return null;
			}
		},
		style: selectStyleFunction
	})]),
	target: 'map0',
	view: new ol.View({
		center: ol.proj.transform([121.079187, 23.804110], 'EPSG:4326', 'EPSG:3857'),
		zoom: 8
	})
});
map.getView().on('change:center', syncMaps);
map.getView().on('change:rotation', syncMaps);
map.getView().on('change:resolution', syncMaps);

maps.push(map);
var dhxWins = new dhtmlXWindows();
//att_win_loc_w=parseInt((document.body.clientWidth).toString());
att_win_loc_w = document.body.clientWidth / 2 + 100;
att_win = dhxWins.createWindow("att_win", att_win_loc_w, 0, 320, 500);
att_win.setText("屬性資料");
att_win.attachEvent("onClose", function (win) {
	att_win.hide();
	if ((mag_layer_content != null || pga_layer_content != null || pgv_layer_content != null || mag_val_layer_content != null)) {
		if (mag_layer_content != null) {
			// console.log('mag_layer_content is exist');
			MapOverlay2(0, mag_layer_content, 0);
			mag_layer_content = null;
			mag_layer_checked = 0;
		}
		if (pga_layer_content != null) {
			// console.log('pga_layer_content is exist');
			MapOverlay2(0, pga_layer_content, 0);
			pga_layer_content = null;
			pga_layer_checked = 0;
		}
		if (pgv_layer_content != null) {
			// console.log('pgv_layer_content is exist');
			MapOverlay2(0, pgv_layer_content, 0);
			pgv_layer_content = null;
			pgv_layer_checked = 0;
		}
		if (mag_val_layer_content != null) {
			// console.log('pgv_layer_content is exist');
			maps[0].removeLayer(mag_val_layer_content);
			mag_val_layer_content = null;
			mag_val_layer_checked = 0;
		}
		enable_earthquake_cluster_utility(mag_layer_checked, pga_layer_checked, pgv_layer_checked, mag_val_layer_checked);
	}
	return false;
});
att_win.hide();
//map01_layer.setSource(source_gm_m);
/*
var select = null;  // ref to currently selected interaction


// select interaction working on "click"
var selectClick = new ol.interaction.Select();
//var selectElement = document.getElementById('type');
select = selectClick;
var changeInteraction = function() {
	
if (select !== null) {
	maps[0].addInteraction(select);
	select.on('select', function(e) {
		
		var feature = e.selected[0];
		if(feature){
			
		alert(select.getLayer(feature).getSource().getUrls());
		
		
		if (feature.get('Id') != null) {
			Docs_icon_click(feature.get('Id'), feature.get('name'));

		} else if (feature.get('description') != null) {
		  
			displayFeatureInfo(feature);
		} else if (feature.getProperties() != null) {

			
			if (feature.get('name') != null) {
				
				if (feature.get('name').split('.flag.')[0] != 'route') {
					var geometry = feature.getGeometry();
					//var coord = evt.coordinate;
					var props = feature.getProperties();
					// var infobox = document.getElementById('info-box');
					var content = '';
					
					for (var field in props) {
						if (field != 'geometry' && field != '__proto__') {
							content += '<h5>' + field + ': ' + feature.get(field) + '</h5>';
						}
					}

					if ((content.indexOf("styleUrl: https://") == 4)) {

						alert("請Zoon in 再點擊屬性資料!");
					} else if (content == "") {

					} else {

						att_win.show();
						att_win.detachObject(false);
						att_win.setDimension(320, 50);
						document.getElementById('Attributes_Info').innerHTML = content;//info顯示區塊建立DIV 之ID		  
						att_win.attachObject("Attributes_Info", true);
						//document.getElementById('Attributes_Info').innerHTML = '<input type="button" value="關閉" style="float: right;" onclick="displayFeature_close()">'+content;
					}
				}
			}
			else {
				
				
				var geometry = feature.getGeometry();
				
				var props = feature.getProperties();
				// var infobox = document.getElementById('info-box');
				var content = '';
				for (var field in props) {
					if (field != 'geometry' && field != '__proto__') {
						content += '<h5>' + field + ': ' + feature.get(field) + '</h5>';
					}
				}

				if ((content.indexOf("styleUrl: https://") == 4)) {
					alert("請Zoon in 再點擊屬性資料!");
				} else if (content == "") {

				} else {
					att_win.show();
					att_win.detachObject(false);
					att_win.setDimension(320, 50);
					document.getElementById('Attributes_Info').innerHTML = content;//info顯示區塊建立DIV 之ID		  
					att_win.attachObject("Attributes_Info", true);
					//document.getElementById('Attributes_Info').innerHTML = '<input type="button" value="關閉" style="float: right;" onclick="displayFeature_close()">'+content;
				}
			}
			
		}
		//else{displayFeatureInfo(feature);}
	}
	});
  }
};

//selectElement.onchange = changeInteraction;
changeInteraction();*/



maps[0].on('click', function (evt) {

	if (select_earthquake_or_wall != 0) {
		return;
	}

	var feature = maps[0].forEachFeatureAtPixel(evt.pixel,
		function (feature) {
			return feature;
		});
	if (feature) {

		if (feature.get('Id') != null) {
			Docs_icon_click(feature.get('Id'), feature.get('name'));


		} else if (feature.get('description') != null) {
						att_win.show();
						att_win.detachObject(false);
						att_win.setDimension(320, 50);
						document.getElementById('Attributes_Info').innerHTML = feature.get('description');//info顯示區塊建立DIV 之ID		  
						att_win.attachObject("Attributes_Info", true);
			
			//displayFeatureInfo(feature);
		} else if (feature.getProperties() != null) {

			if (feature.get('name') != null) {

				if (feature.get('name').split('.flag.')[0] != 'route') {
					var geometry = feature.getGeometry();
					var coord = evt.coordinate;
					var props = feature.getProperties();
					// var infobox = document.getElementById('info-box');
					var content = '';
					for (var field in props) {
						if (field != 'geometry' && field != '__proto__') {
							content += '<h5>' + field + ': ' + feature.get(field) + '</h5>';
						}
					}

					if ((content.indexOf("styleUrl: https://") == 4)) {

						alert("請Zoon in 再點擊屬性資料!");
					} else if (content == "") {

					} else {

						att_win.show();
						att_win.detachObject(false);
						att_win.setDimension(320, 50);
						document.getElementById('Attributes_Info').innerHTML = content;//info顯示區塊建立DIV 之ID		  
						att_win.attachObject("Attributes_Info", true);
						//document.getElementById('Attributes_Info').innerHTML = '<input type="button" value="關閉" style="float: right;" onclick="displayFeature_close()">'+content;
					}
				}
			}
			else {


				var geometry = feature.getGeometry();
				var coord = evt.coordinate;
				var props = feature.getProperties();
				// var infobox = document.getElementById('info-box');
				var content = '';
				for (var field in props) {
					if (field != 'geometry' && field != '__proto__' && field!='styleUrl') {
						content += '<h5>' + field + ': ' + feature.get(field) + '</h5>';
					}
				}

				/*if ((content.indexOf("styleUrl: https://") == 4)) {
					alert("請Zoon in 再點擊屬性資料!");
				} else*/ if (content == "") {

				} else {

					att_win.show();
					att_win.detachObject(false);
					att_win.setDimension(320, 800);
					document.getElementById('Attributes_Info').innerHTML = content;//info顯示區塊建立DIV 之ID		  
					att_win.attachObject("Attributes_Info", true);
					//document.getElementById('Attributes_Info').innerHTML = '<input type="button" value="關閉" style="float: right;" onclick="displayFeature_close()">'+content;
				}
			}

		}
		//else{displayFeatureInfo(feature);}
	}
});





var map = new ol.Map({
	layers: [map01_layer],
	target: 'map1',
	view: new ol.View({
		center: ol.proj.transform([121.079187, 23.804110], 'EPSG:4326', 'EPSG:3857'),
		zoom: 8
	})
});
map.getView().on('change:center', syncMaps);
map.getView().on('change:rotation', syncMaps);
map.getView().on('change:resolution', syncMaps);
maps.push(map);
maps[1].on('click', function (evt) {

	var feature_1 = maps[1].forEachFeatureAtPixel(evt.pixel,
		function (feature_1) {
			return feature_1;
		});
	if (feature_1) {
		if (feature_1.get('Id') != null) {
			Docs_icon_click(feature_1.get('Id'), feature_1.get('name'));
		}
	}
});

maps[1].on('click', function (evt) {

	var feature = maps[1].forEachFeatureAtPixel(evt.pixel,
		function (feature) {
			return feature;
		});
	if (feature) {
		if (feature.get('Id') != null) {
			Docs_icon_click(feature.get('Id'), feature.get('name'));


		} else if (feature.get('description') != null) {

			displayFeatureInfo(feature);
		} else if (feature.getProperties() != null) {

			var geometry = feature.getGeometry();
			var coord = evt.coordinate;
			var props = feature.getProperties();
			// var infobox = document.getElementById('info-box');
			var content = '';
			for (var field in props) {
				if (field != 'geometry' && field != '__proto__') {
					content += '<h5>' + field + ': ' + feature.get(field) + '</h5>';
				}
			}
			if ((content.indexOf("styleUrl: https://") == 4)) {
				alert("請Zoon in 再點擊屬性資料!");
			} else if (content == "") {

			} else {
				att_win.show();
				att_win.detachObject(false);
				att_win.setDimension(320, 50);
				document.getElementById('Attributes_Info').innerHTML = content;//info顯示區塊建立DIV 之ID		  
				att_win.attachObject("Attributes_Info", true);
				//document.getElementById('Attributes_Info').innerHTML = '<input type="button" value="關閉" style="float: right;" onclick="displayFeature_close()">'+content;
			}
		}
	}
	//else{displayFeatureInfo(feature);}
});


///////Cesium 3D///////
//3D map 初始化
// init_3Dmodel();
model_3D_init = 1;
// function init_3Dmodel() {
// 	ol3d = new olcs.OLCesium({ map: maps[1] });
// 	scene = ol3d.getCesiumScene();
// 	terrainProvider = new Cesium.CesiumTerrainProvider({
// 		//url:'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles'
// 		url: 'https://3dterrain.geodac.tw:8080/tilesets/20m-DEM/'
// 	});
// 	scene.terrainProvider = terrainProvider;
// 	/*ol3d.getDataSources().add(Cesium.KmlDataSource.load(

// 	  'https://api3.geo.admin.ch/ogcproxy?url=' +
// 	  'https%3A%2F%2Fdav0.bgdi.admin.ch%2Fbazl_web%2FActive_Obstacles.kmz', {
// 		camera: scene.camera,
// 		canvas: scene.canvas
// 	  }
// 	));*/

// }

//權限圖資需取token
var layer_token;
function layer_token_get() {
	$(document).ready(function () {

		$.ajax({
			type: "POST",  //傳值方式有分 post & get
			dataType: "json",
			url: "php/layer_token.php",
			success: function (response) {
				layer_token = response['token'];
				//alert(layer_token);	
			},
			error: function (jqXHR) {
				//alert("error " + jqXHR.status);
				//swal("權限有誤!請洽執行團隊!連絡電話：06-2366740");
			}
		});
	});
}
//unlogin_permission_set();
map_win_init();



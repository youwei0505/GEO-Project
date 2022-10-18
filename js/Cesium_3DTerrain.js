Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMTAyNmZkYy05NDg1LTRlNTUtODExOS02M2MwZjNjOTg1ZmEiLCJpZCI6MTg3MzcsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzQzMjkyMzB9.i5zuLzLzcbJNosDcE9RWYSogXlKwcihhr_PICi7FvCY";

var viewer;
var mapMoveSync = 0;
var curr_cam_tilt = 0;

// detect if alt and shift pressed simultaneously
var alt_shift_press = false;
var street_icon;

window.onload = function () {
	// Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMTAyNmZkYy05NDg1LTRlNTUtODExOS02M2MwZjNjOTg1ZmEiLCJpZCI6MTg3MzcsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzQzMjkyMzB9.i5zuLzLzcbJNosDcE9RWYSogXlKwcihhr_PICi7FvCY";

	viewer = new Cesium.Viewer("map2", {
		animation: false, 				//是否顯示動畫控制物件
		homeButton: false, 				//是否顯示Home按鈕
		fullscreenButton: false, 		//是否顯示全螢幕按鈕
		baseLayerPicker: false,			//是否顯示圖層控制物件
		geocoder: false,				//是否顯示地名查找物件
		timeline: false,				//是否顯示時間線控制物件
		sceneModePicker: false,			//是否顯示投影方式控制物件
		navigationHelpButton: false,	//是否顯示帮助信息控制物件
		infoBox: false,					//是否顯示點擊要素之後顯示的資訊
		// terrainProvider: Cesium.createWorldTerrain(),
		terrainProvider: new Cesium.CesiumTerrainProvider({
			url: 'https://3dterrain.geodac.tw:8080/tilesets/20m-DEM/'
		})
	});

	//Enable lighting based on the sun position
	viewer.scene.globe.enableLighting = false;

	//Enable depth testing so things behind the terrain disappear.
	viewer.scene.globe.depthTestAgainstTerrain = true;

	viewer.scene.camera.DEFAULT_VIEW_FACTOR = 0.5;

	// set initial camera position
	var center = new ol.proj.transform([map.getView().getCenter()[0], map.getView().getCenter()[1]], 'EPSG:3857', 'EPSG:4326');
	let metersPerUnit = map.getView().getProjection().getMetersPerUnit();
	let visibleMapUnits = map.getView().getResolution() * viewer.canvas.clientHeight;
	let relativeCircumference = Math.cos(Math.abs(Cesium.Math.toRadians(center[1])));
	let visibleMeters = visibleMapUnits * metersPerUnit * relativeCircumference;
	let distance = (visibleMeters / 2) / Math.tan(viewer.camera.frustum.fovy / 2);
	viewer.scene.camera.setView({
		destination: Cesium.Cartesian3.fromDegrees(center[0], center[1], distance),
	});
	curr_cam_tilt = viewer.camera.pitch;


	// sync to openlayer
	viewer.camera.percentageChanged = 0.0001;
	viewer.camera.changed.addEventListener(function () {
		if (mapMoveSync == 2) {

			// calc camera look at position
			let windowPosition = new Cesium.Cartesian2(viewer.container.clientWidth / 2, viewer.container.clientHeight / 2);
			let pickRay = viewer.scene.camera.getPickRay(windowPosition);
			let pickPosition = viewer.scene.globe.pick(pickRay, viewer.scene);


			if (pickPosition != null) {
				let pickPositionCartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(pickPosition);
				let lon = pickPositionCartographic.longitude * (180 / Math.PI);
				let lat = pickPositionCartographic.latitude * (180 / Math.PI);
				let center = new ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857')

				// calc ol resolution from cesium height
				let distance = Cesium.Cartesian3.distance(pickPosition, viewer.camera.position);
				let metersPerUnit = map.getView().getProjection().getMetersPerUnit();
				let visibleMeters = 2 * distance * Math.tan(viewer.camera.frustum.fovy / 2);
				let relativeCircumference = Math.cos(Math.abs(Cesium.Math.toRadians(lat)));
				let visibleMapUnits = visibleMeters / metersPerUnit / relativeCircumference;
				let resolution = visibleMapUnits / viewer.canvas.clientHeight;

				maps.forEach(function (map) {
					map.getView().set("center", center);
					map.getView().set("resolution", resolution)
				});
				if (alt_shift_press) {
					maps.forEach(function (map) {
						map.getView().set("rotation", viewer.camera.heading * -1)

					});
					if (viewer.camera.pitch == 0) {
						pitch_panorama = 90;
					}
					else {
						pitch_panorama = viewer.camera.pitch / -1.553343 * 90;
					}
					if (panorama) {
						panorama.setPov({
							heading: viewer.camera.heading * 180 / Math.PI,
							pitch: pitch_panorama //panorama.getPov().pitch
						});
					}

					curr_cam_tilt = viewer.camera.pitch;
				}
			}
		}
	})


	// remove default cesium baselayer and add our base layer
	viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 1);
	viewer.imageryLayers.get(1).show = false;

	viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
	viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 0);

	// viewer.scene.mode = 2;

};
document.getElementById("map0").addEventListener("mousemove", function (event) {
	mapMoveSync = 0;
});
document.getElementById("map2").addEventListener("mousemove", function (event) {
	mapMoveSync = 2;
});

/////// init Base Layer ///////
var Cesium_source_gm_m = new Cesium.WebMapTileServiceImageryProvider({
	url: 'https://mt3.google.com/vt/lyrs=m&x={TileCol}&y={TileRow}&z={TileMatrix}',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_gm_s = new Cesium.WebMapTileServiceImageryProvider({
	url: 'https://mt3.google.com/vt/lyrs=s&x={TileCol}&y={TileRow}&z={TileMatrix}',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_gm_y = new Cesium.WebMapTileServiceImageryProvider({
	url: 'https://mt3.google.com/vt/lyrs=y&x={TileCol}&y={TileRow}&z={TileMatrix}',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_gm_p = new Cesium.WebMapTileServiceImageryProvider({
	url: 'https://mt3.google.com/vt/lyrs=p&x={TileCol}&y={TileRow}&z={TileMatrix}',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_osm_m = new Cesium.WebMapTileServiceImageryProvider({
	url: 'https://c.tile.openstreetmap.org/{TileMatrix}/{TileCol}/{TileRow}.png',
	layer: '',
	style: 'default',
	format: 'image/png',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_nlsc_EMAP = new Cesium.WebMapTileServiceImageryProvider_GSW({
	url: 'https://wmts.nlsc.gov.tw/wmts/EMAP5/default/EPSG:3857/{TileMatrix}/{TileCol}/{TileRow}',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_nlsc_PHOTO2 = new Cesium.WebMapTileServiceImageryProvider_GSW({
	url: 'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/EPSG:3857/{TileMatrix}/{TileCol}/{TileRow}',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_nlsc_LUIMAP = new Cesium.WebMapTileServiceImageryProvider_GSW({
	url: 'https://wmts.nlsc.gov.tw/wmts/LUIMAP/default/EPSG:3857/{TileMatrix}/{TileCol}/{TileRow}',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_swcb_r = new Cesium.WebMapTileServiceImageryProvider_M({
	url: 'https://storage.geodac.tw/Tile/Map/Host/20M/00000000_121000000_023000000_14_000_Map_HOST_20M/{TileMatrix}/{TileRow}/{TileCol}.jpg',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_swcb_r_5m = new Cesium.WebMapTileServiceImageryProvider_M({
	url: 'https://geodac.ncku.edu.tw/SWCB/MultiStage/Taiwan_Rmap_5m_opendata/{TileMatrix}/{TileRow}/{TileCol}.jpg',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_swcb_r_1m = new Cesium.WebMapTileServiceImageryProvider_M({
	url: 'https://storage.geodac.tw/Tile/SWCBProject/Taiwan_Rmap_1m/{TileMatrix}/{TileRow}/{TileCol}.jpg',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_swcb_CS = new Cesium.WebMapTileServiceImageryProvider_M({
	url: 'https://geodac.ncku.edu.tw/SWCB/MultiStage/csmap_Tile/{TileMatrix}/{TileRow}/{TileCol}.jpg',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_swcb_CS_5m = new Cesium.WebMapTileServiceImageryProvider_M({
	url: 'https://geodac.ncku.edu.tw/SWCB/MultiStage/csmap_5m_Tile/{TileMatrix}/{TileRow}/{TileCol}.jpg',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_swcb_CS_1m = new Cesium.WebMapTileServiceImageryProvider_M({
	url: 'https://storage.geodac.tw/Tile/Map/CSMap/1M/{TileMatrix}/{TileRow}/{TileCol}.jpg',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_nlsc_PB = new Cesium.WebMapTileServiceImageryProvider_M({
	url: 'https://s186.geodac.tw/BaseMap/PhotoBaseMap_GM/{TileMatrix}/{TileRow}/{TileCol}.jpg',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_aso_ATIS_base = new Cesium.WebMapTileServiceImageryProvider({
	url: 'https://newhub.swcb.gov.tw/arcgis/rest/services/WMTS/base_map/MapServer/tile/{TileMatrix}/{TileRow}/{TileCol}',
	layer: '',
	style: 'default',
	format: 'image/png',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_aso_ATIS = new Cesium.WebMapServiceImageryProvider_UpperCaseURL({
	url: 'php/wms.php',
	layers: 'ATIS_MNC',
	parameters: {
		transparent: true,
		format: 'image/png',
		version: '1.3.0',
		styles: '',
	},
	tileWidth: 256,
	tileHeight: 256,
	crs: 'EPSG:3857',

});
var Cesium_source_moeacgs_CGS = new Cesium.WebMapTileServiceImageryProvider({
	url: 'https://gis3.moeacgs.gov.tw/api/Tile/v1/getTile.cfm?layer=CGS_CGS_MAP&x={TileCol}&y={TileRow}&z={TileMatrix}',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_swcb_CS_1m = new Cesium.WebMapTileServiceImageryProvider_M({
	url: 'https://storage.geodac.tw/Tile/Map/CSMap/1M/{TileMatrix}/{TileRow}/{TileCol}.jpg',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});
var Cesium_source_aso_base_hillside = new Cesium.WebMapTileServiceImageryProvider_M({
	url: 'https://storage.geodac.tw/Tile/Map/PhotoBaseMap/20180000_121000000_023000000_14_000_PhotoBaseMap/{TileMatrix}/{TileRow}/{TileCol}.jpg',
	layer: '',
	style: 'default',
	format: 'image/jpg',
	tileMatrixSetID: 'default028mm',
	minimumLevel: 1,
	maximumLevel: 19,
});

// add listener to detect key and mouse event
document.onkeydown = keydown;
document.onkeyup = keyup;
function keydown(evt) {
	if (evt.shiftKey && evt.altKey) {
		alt_shift_press = true;
	}
}

function keyup(evt) {
	if (!evt.shiftKey && !evt.altKey) {
		alt_shift_press = false;
	}
}

function wheeldown(e) {
	if (e.button) {
		alt_shift_press = true;
	}
}

function wheelup(e) {
	if (e.button) {
		alt_shift_press = false;
	}
}

function isEventSupported(event) {
	var testEl = document.createElement('div');
	var isSupported;
  
	event = 'on' + event;
	isSupported = (event in testEl);
  
	if (!isSupported) {
	  testEl.setAttribute(event, 'return;');
	  isSupported = typeof testEl[event] === 'function';
	}
	testEl = null;
	return isSupported;
}

// Add event listeners
if (isEventSupported("pointerdown")) {
    document.addEventListener("pointerdown", wheeldown, false);
    document.addEventListener("pointerup", wheelup, false);
} else if (isEventSupported("touchstart")) {
    document.addEventListener("touchstart", wheeldown, false);
    document.addEventListener("touchend", wheelup, false);
} else if (isEventSupported("mousedown")) {
    document.addEventListener("mousedown", wheeldown, false);
    document.addEventListener("mouseup", wheelup, false);
}














// var stroke_color = Cesium.Color.fromRgba(0xFF0000FF);
// var fill_color = Cesium.Color.fromRgba(0x670000FF);
// var stroke_Width = 1;

// var json_style = {
//   stroke: stroke_color,
//   fill: fill_color,
//   strokeWidth: stroke_Width,
//   markerColor: fill_color,
//   markerSize: 70,
//   markerSymbol: '',
//   clampToGround: true
// };

// var dataSource_1 = Cesium.GeoJsonDataSource.load(
//     "./testData/BigGIS_SHP上傳範例檔案.json",
//     json_style,
// );
// viewer.dataSources.add(dataSource_1);


// var dataSource_2 = Cesium.GeoJsonDataSource.load(
//   "./testData/全臺33條活動斷層地質敏感區_20160104(VL00408).json",
//   json_style,
// );
// viewer.dataSources.add(dataSource_2);


// var dataSource_3 = Cesium.GeoJsonDataSource.load(
//   "./testData/BigGIS_GPX上傳範例檔案.json",
//   json_style,
// );
// viewer.dataSources.add(dataSource_3);
var street_view_win

// street view
var panorama;
var sv

var street_view_heading = 0;
var street_view_pitch = 0;
var street_view_position = { lat: 23.955515, lng: 120.687859 }

$(document).ready(function () {
	street_view_win = dhxWins.createWindow("street_view_win", 800, 100, 600, 700);
	street_view_win.setText("街景服務");
	street_view_win.button("minmax").hide();
	street_view_win.button("park").hide();
	street_view_win.centerOnScreen();
	street_view_win.denyResize();
	street_view_win.hide();

	maps[0].on("moveend", function (e) {
		// event actions
		street_view_temp_position = ol.proj.transform(maps[0].getView().getCenter(), 'EPSG:3857', 'EPSG:4326')
		street_view_position = { lat: street_view_temp_position[1], lng: street_view_temp_position[0] }
	});


	var street_view_html = "<div><button class = 'ui button' onclick = 'set_street_view_point()'>選取坐標</button><br><br></div>\
							<div id=\"pano\" style=\"width: 100%; height: 90%;float:left\"></div>";

	street_view_win.attachHTMLString(street_view_html);

	street_view_win.attachEvent("onClose", function (win) {
		street_view_win.hide();
		street_view_win.setModal(false);
		get_street_view();
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
		return false;
	});

	// maps[0].on('pointerdrag', function(e){


	// 	if (street_view_index) {
	// 		street_view_heading = ol3d.getCesiumScene().camera.heading * 180 / Math.PI;
	// 		panorama.setPov({
	// 			heading: street_view_heading,
	// 			pitch: 0
	// 		});
	// 	}
	// });
	$('#map1 button.ol-rotate-reset').click(function (e) {

		street_view_heading = 360;
		panorama.setPov({
			heading: street_view_heading,
			pitch: 0
		});
	});

	/***** show stree view *****/

	//var taiwan = {lat: 22.98860494930799, lng: 120.2346535669484};
	//sv = new google.maps.StreetViewService();

	//panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));

	//sv.getPanorama({location: taiwan, radius: 50}, processSVData);


	/***** change position *****/

	/*panorama.addListener('position_changed', function() {
		console.log("position change: " + panorama.getPosition());
		var coor = panorama.getPosition();
		var test_coor = ol.proj.transform([coor.lng(), coor.lat()], 'EPSG:4326', 'EPSG:3857');		
		
		var plot_coor = [test_coor[0], test_coor[1]];
					
		plot_street_icon(plot_coor);
		
	});*/

	/***** pov-changed *****/
	/*panorama.addListener('pov_changed', function() {
		console.log("Pov heading : " + panorama.getPov().heading);
		console.log("Pov pitch : " + panorama.getPov().pitch);
	});*/
});

var source_gm_SV = new ol.source.TileImage({ url: 'https://mts{0-3}.googleapis.com/vt?hl=zh-TW&lyrs=svv|cb_client:apiv3&style=40,18&x={x}&y={y}&z={z}', crossOrigin: 'anonymous' });
var map_layer_gm_SV = new ol.layer.Tile();
map_layer_gm_SV.setSource(source_gm_SV);
map_layer_gm_SV.setZIndex(1000);
var street_view_height_value=0;

function set_street_view_point() {
	maps[0].addLayer(map_layer_gm_SV);
	if (line_chart) {
		line_chart.clear();
		line_chart = null;
	}

	if (path_chart) {
		path_chart.clear();
		path_chart = null;
	}

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

	if (aspect_draw_type != "none") {
		createMeasureTooltip();
		aspect_layer.getSource().clear();
		maps[0].removeInteraction(aspect_draw);
		maps[1].removeInteraction(aspect_draw);
	}
	if (slope_draw_type != "none") {
		createMeasureTooltip();
		slope_layer.getSource().clear();
		maps[0].removeInteraction(slope_draw);
		maps[1].removeInteraction(slope_draw);
	}

	createMeasureTooltip();

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
	vector_box.set('altitudeMode', 'clampToGround');

	maps[0].addLayer(vector_box);
	maps[1].addLayer(vector_box);
	value = 'Point';
	maxPoints = 1;
	draw_box = new ol.interaction.Draw({
		source: source_box,
		type: /** @type {ol.geom.GeometryType} */ (value),
		maxPoints: maxPoints
	});

	maps[0].addInteraction(draw_box);
	maps[1].addInteraction(draw_box);
	
	draw_box.on('drawend',
		function (e) {
			//alert("end");
			var format = new ol.format.WKT();
			wkt = format.writeGeometry(e.feature.getGeometry());
			coor = e.feature.getGeometry().getCoordinates();
			start_84 = ol.proj.transform([coor[0], coor[1]], 'EPSG:3857', 'EPSG:4326');
			// console.log(coor)
			// console.log(start_84[0]);
			// console.log(start_84[1]);
			
                $.get("../map/php/get_terr.php", {
                    lat: start_84[0],
                    lon: start_84[1]
                }, function(data) {
					
                    //alert(data.array);
					str=data.array;
					var ss = str.replace(/]/g, "");
                ss = str.split(",");
				
                var dd = ss[2].split("]");
				
                street_view_height_value=parseFloat(dd[0]).toFixed(1);
                });
			
			
			var iconStyle = new ol.style.Style({
				image: new ol.style.Icon({
					anchor: [0.5, 46],
					anchorXUnits: 'fraction',
					anchorYUnits: 'pixels',
					opacity: 0.75,
					src: 'icons/LLGIS_LOGO/street_view_icon.png'
				})
			});


			var plot_coor = [coor[0], coor[1]];
			plot_street_icon(plot_coor);
			plot_street_icon_3d(start_84[0], start_84[1]);
			/***** show street view *****/
			sv.getPanorama({ location: { lat: start_84[1], lng: start_84[0] }, radius: 50 }, processSVData);
			street_view_position = { lat: start_84[1], lng: start_84[0] };
			//console.log(street_view_position);

			maps[0].removeInteraction(draw_box);
			maps[1].removeInteraction(draw_box);
			maps[0].removeLayer(map_layer_gm_SV);
			if (prev_route_item != "") {
				prev_route_item.css('background-color', '#FFFFFF')
				prev_route_item = ""
			}
			if (prev_route_marker != "") {
				prev_route_marker.setStyle(prev_route_iconStyle)
				prev_route_iconStyle = ""
				prev_route_marker = ""
			}

		}, this);
}

function street_view_tilt(angle) {


	var scene = ol3d.getCesiumScene();
	var camera = scene.camera;
	var pivot = olcs.core.pickBottomPoint(scene);
	if (!pivot) {
		// Could not find the bottom point
		return;
	}

	var options = {};
	var transform = Cesium.Matrix4.fromTranslation(pivot);
	var axis = camera.right;
	var rotateAroundAxis = olcs.core.rotateAroundAxis;
	//console.log(camera);
	//console.log(axis);
	//console.log(transform);
	//console.log(options);
	rotateAroundAxis(camera, -angle, axis, transform, options);

}

function street_view_rotate(lng, lat, angle, pitch) {
	maps[0].getView().set("rotation", viewer.camera.heading * -1);

	let center = new ol.proj.transform([map.getView().getCenter()[0], map.getView().getCenter()[1]], 'EPSG:3857', 'EPSG:4326');
	let metersPerUnit = map.getView().getProjection().getMetersPerUnit();
	let visibleMapUnits = map.getView().getResolution() * viewer.scene.canvas.clientHeight;
	let relativeCircumference = Math.cos(Math.abs(Cesium.Math.toRadians(center[1])));
	let visibleMeters = visibleMapUnits * metersPerUnit * relativeCircumference;
	let distance = (visibleMeters / 2) / Math.tan(viewer.camera.frustum.fovy / 2);
	console.log("angle", angle)
	console.log("pitch", pitch)
	console.log("distance", distance)
	if (Math.abs(pitch) < 0.3) {
		if (pitch >= 0)
			pitch = 0.3;
		else
			pitch = -0.3;
	}
	if (Math.abs(pitch) > 1.2) {
		if (pitch >= 0)
			pitch = 1.2;
		else
			pitch = -1.2;
	}
	console.log("street_view_height_value", street_view_height_value)
	if(street_view_height_value<600){
		if(distance>2000){
			distance=2000
		}
		if(distance<1000){
			distance=1000;
		}	
	}
	if(street_view_height_value>600){
	if(distance>1000){
		distance=3500+street_view_height_value*1;
	}
	if(distance<800){
		distance=2000+street_view_height_value*1;
	}
	console.log("distance_600", distance)
	}
	
	viewer.camera.lookAt(
		Cesium.Cartesian3.fromDegrees(lng, lat),
		new Cesium.HeadingPitchRange(
			angle,		// viewer.camera.heading,
			pitch,						//viewer.camera.pitch,
			distance
		)
	);
	viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
}

function plot_street_icon(plot_coor) {

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

	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon({
			anchor: [0.5, 40],
			anchorXUnits: 'fraction',
			anchorYUnits: 'pixels',
			opacity: 0.75,
			src: 'icons/LLGIS_LOGO/street_view_icon.png'
		})
	});

	var icon_feature = new ol.Feature(
		new ol.geom.Point(plot_coor)
	);
	icon_feature.setStyle(iconStyle);
	icon_feature.set('altitudeMode', 'clampToGround');
	icon_source = new ol.source.Vector({ wrapX: false });
	icon_source.addFeature(icon_feature);

	icon_box = new ol.layer.Vector({
		source: icon_source
	});
	icon_box.setZIndex(1000);
	maps[0].addLayer(icon_box);
	maps[1].addLayer(icon_box);

	maps[1].getView().setCenter(plot_coor);
}

function plot_street_icon_3d(coor_lng, coor_lat) {
	// if (street_icon == undefined) {
	if (street_icon) {
		//viewer.entities.remove(street_icon);
		// viewer.entities.remove(street_icon);
		// street_icon = null;
		street_icon.position = Cesium.Cartesian3.fromDegrees(coor_lng, coor_lat);
	}
	else {
		terrainProvider = viewer.terrainProvider;
		viewer.terrainProvider = Cesium.createWorldTerrain();
		viewer.scene.globe.depthTestAgainstTerrain = true;
		street_icon = viewer.entities.add({
			position: Cesium.Cartesian3.fromDegrees(coor_lng, coor_lat), // Math.abs(street_pitch) * 660 - 23
			billboard: {
				image: "icons/LLGIS_LOGO/street_view_icon.png",
				heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
				disableDepthTestDistance: Number.POSITIVE_INFINITY,
				//   imageSubRegion: new Cesium.BoundingRectangle(49, 43, 18, 18),
				//   color: Cesium.Color.LIME,
				show: true
			},
		});
	}
	// }
	// else {
	// 	//console.log(coor_lng, coor_lat)
	// 	street_icon.billboard.position = Cesium.Cartesian3.fromDegrees(coor_lng, coor_lat);
	// }
}

function processSVData(data, status) {
	if (status === 'OK') {

		/*
		  var marker = new google.maps.Marker({
			position: data.location.latLng,
			map: map,
			title: data.location.description
		  });
		*/
		//console.log(data)
		panorama.setPano(data.location.pano);
		panorama.setPov({
			heading: street_view_heading,
			pitch: 0
		});
		panorama.setVisible(true);


		/*
		marker.addListener('click', function() {
		  var markerPanoID = data.location.pano;
		  // Set the Pano to use the passed panoID.
		  panorama.setPano(markerPanoID);
		  panorama.setPov({
			heading: 270,
			pitch: 0
		  });
		  panorama.setVisible(true);
		});
		*/
	} else {
		alert('選取坐標無街景服務');
	}
}
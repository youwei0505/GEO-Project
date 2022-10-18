/*
 *  主要功能：Vincenty's formula、產生方位線
 */

 	// 1.給初始點的經緯度、方位角(initialBearing)、距離,算出所求的點的經緯度跟方位角(finalBearing)
	function vincenty_direct(lat, lng, initialBearing, distance, wrap) {
		//轉換成弧度
		var lat_to_r = lat * Math.PI / 180;//lat.toRadians();    //this * Math.PI / 180
		var	lng_to_r = lng * Math.PI / 180;//lng.toRadians();
		var bear_to_r = initialBearing * Math.PI / 180//initialBearing.toRadians();
		var s = distance;
		//constant
		var a = 6378137; //this.datum.ellipsoid.a,
		var	b = 6356752.3142; //this.datum.ellipsoid.b,
		var	f = 1 / 298.257223563; // this.datum.ellipsoid.f;

		var sin_bear = Math.sin(bear_to_r);
		var cos_bear = Math.cos(bear_to_r);
		//start calculate
		var tanU1 = (1 - f) * Math.tan(lat_to_r);
		var	cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1));
		var	sinU1 = tanU1 * cosU1;
		var para1 = Math.atan2(tanU1, cos_bear);
		var sinpara4 = cosU1 * sin_bear;
		var cosSqpara4 = 1 - sinpara4 * sinpara4;
		var uSq = cosSqpara4 * (a * a - b * b) / (b * b);
		var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
		var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
		//iterate until para5 has no significant change
		var para5 = s / (b * A), para6, iterations = 0;
		do {
			var cos2para8 = Math.cos(2 * para1 + para5);
			var sinpara5 = Math.sin(para5);
			var cospara5 = Math.cos(para5);
			var para7 = B * sinpara5 * (cos2para8 + B / 4 * (cospara5 * (-1 + 2 * cos2para8 * cos2para8) - B / 6 * cos2para8 * (-3 + 4 * sinpara5 * sinpara5) * (-3 + 4 * cos2para8 * cos2para8)));
			para6 = para5;
			para5 = s / (b * A) + para7;
		} while (Math.abs(para5 - para6) > 1e-12 && ++iterations);

		var x = sinU1 * sinpara5 - cosU1 * cospara5 * cos_bear;
		var para52 = Math.atan2(sinU1 * cospara5 + cosU1 * sinpara5 * cos_bear, (1 - f) * Math.sqrt(sinpara4 * sinpara4 + x * x));  //P2的緯度(in rad)
		var para9 = Math.atan2(sinpara5 * sin_bear, cosU1 * cospara5 - sinU1 * sinpara5 * cos_bear);
		var C = f / 16 * cosSqpara4 * (4 + f * (4 - 3 * cosSqpara4));
		var L = para9 - (1 - C) * f * sinpara4 * (para5 + C * sinpara5 * (cos2para8 + C * cospara5 * (-1 + 2 * cos2para8 * cos2para8)));

		//P2的經度(in rad)
		if (wrap)
			var para92 = (lng_to_r + L + 3 * Math.PI) % (2 * Math.PI) - Math.PI; // normalise to -180...+180
		else
			var para92 = (lng_to_r + L); // do not normalize
		//P2方位角
		var revAz = Math.atan2(sinpara4, -x);

		return {
			lat: para52 * 180 / Math.PI, //para52.toDegrees(),  //this * 180 / Math.PI
			lng: para92 * 180 / Math.PI, //para92.toDegrees(),  //this * 180 / Math.PI
			finalBearing: revAz * 180 / Math.PI //revAz.toDegrees()  //this * 180 / Math.PI
		};
	}
	// 2.給定兩點,計算兩點間的角度(forward azimuth and backward azimuth)跟距離
	function vincenty_inverse(p1_lat, p1_lng, p2_lat, p2_lng) {
		//轉換成弧度
		var lat_to_r = p1_lat * Math.PI / 180;//p1_lat.toRadians(), 
		var	lng_to_r = p1_lng * Math.PI / 180;//p1_lng.toRadians();
		var lat_to_r2 = p2_lat * Math.PI / 180;//p2_lat.toRadians(), 
		var	lng_to_r2 = p2_lng * Math.PI / 180;//p2_lng.toRadians();
		//constant
		var a = 6378137; //this.datum.ellipsoid.a,
		var	b = 6356752.3142; //this.datum.ellipsoid.b,
		var	f = 1 / 298.257223563; // this.datum.ellipsoid.f;

		var L = lng_to_r2 - lng_to_r;
		var tanU1 = (1 - f) * Math.tan(lat_to_r);
		var	cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1));
		var	sinU1 = tanU1 * cosU1;
		var tanU2 = (1 - f) * Math.tan(lat_to_r2);
		var	cosU2 = 1 / Math.sqrt((1 + tanU2 * tanU2));
		var	sinU2 = tanU2 * cosU2;

		//iterate until para1 converge, para1 may not converge
		var para1 = L;  //λ
		var	para1_re; 
		var iterations = 0
		do {
			var sinpara1 = Math.sin(para1);
			var	cospara1 = Math.cos(para1);
			var sinSq_gg = (cosU2 * sinpara1) * (cosU2 * sinpara1) + (cosU1 * sinU2 - sinU1 * cosU2 * cospara1) * (cosU1 * sinU2 - sinU1 * cosU2 * cospara1);
			var sin_gg = Math.sqrt(sinSq_gg);
			if (sin_gg == 0) return 0; // co-incident points
			var cos_gg = sinU1 * sinU2 + cosU1 * cosU2 * cospara1;
			var _gg = Math.atan2(sin_gg, cos_gg);
			var sin_zz = cosU1 * cosU2 * sinpara1 / sin_gg;
			var cosSq_zz = 1 - sin_zz * sin_zz;
			var cos2_kk = cos_gg - 2 * sinU1 * sinU2 / cosSq_zz;
			if (isNaN(cos2_kk)) cos2_kk = 0; // equatorial line: cosSq_zz=0 (ﾂｧ6)
			var C = f / 16 * cosSq_zz * (4 + f * (4 - 3 * cosSq_zz));
			para1_re = para1;
			para1 = L + (1 - C) * f * sin_zz * (_gg + C * sin_gg * (cos2_kk + C * cos_gg * (-1 + 2 * cos2_kk * cos2_kk)));
		} while (Math.abs(para1 - para1_re) > 1e-12 && ++iterations < 100);
			
		//para1 cannot converge, fail to calculate the result
		if (iterations >= 100) {
			console.log("Formula failed to converge. Altering target position.");
			return vincenty_inverse(p1_lat, p1_lng, p2_lat, p2_lng - 0.01);  //retry after modifying the second point
			//  throw new Error('Formula failed to converge');
		}

		//para1 converge, calculate the distance and azimuth
		var uSq = cosSq_zz * (a * a - b * b) / (b * b);
		var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
		var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
		var para2 = B * sin_gg * (cos2_kk + B / 4 * (cos_gg * (-1 + 2 * cos2_kk * cos2_kk) - B / 6 * cos2_kk * (-3 + 4 * sin_gg * sin_gg) * (-3 + 4 * cos2_kk * cos2_kk)));

		var s = b * A * (_gg - para2);

		var fwdAz = Math.atan2(cosU2 * sinpara1, cosU1 * sinU2 - sinU1 * cosU2 * cospara1);
		var revAz = Math.atan2(cosU1 * sinpara1, -sinU1 * cosU2 + cosU1 * sinU2 * cospara1);

		s = Number(s.toFixed(3)); // round to 1mm precision
		return {
			distance: s,
			initialBearing: fwdAz * 180 / Math.PI, //fwdAz.toDegrees(),
			finalBearing: revAz * 180 / Math.PI //revAz.toDegrees()
		};
	}
	// 3.給定兩點及方位角,如果有的話,求出兩條路徑的交點
	function intersection(p1, brng1, p2, brng2) {
		// see http://www.edwilliams.org/avform.htm#Intersection
		// 參考 https://zh.wikipedia.org/wiki/半正矢公式

		var p1_lat_r = p1[0] * Math.PI / 180;//.toRadians(),
		var p1_lng_r = p1[1] * Math.PI / 180;//.toRadians();
		var p2_lat_r = p2[0] * Math.PI / 180;//.toRadians(),
		var p2_lng_r = p2[1] * Math.PI / 180;//.toRadians();
		var brng1_r = Number(brng1) * Math.PI / 180;//.toRadians(),
		var brng2_r = Number(brng2) * Math.PI / 180;//.toRadians();
		var para1 = p2_lat_r - p1_lat_r, para2 = p2_lng_r - p1_lng_r;

		//para3 : 兩點間距離
		var para3 = 2 * Math.asin(Math.sqrt(Math.sin(para1 / 2) * Math.sin(para1 / 2) + Math.cos(p1_lat_r) * Math.cos(p2_lat_r) * Math.sin(para2 / 2) * Math.sin(para2 / 2)));
		if (para3 == 0) return null;

		// initial/final bearings between points
		var para4 = Math.acos((Math.sin(p2_lat_r) - Math.sin(p1_lat_r) * Math.cos(para3)) / (Math.sin(para3) * Math.cos(p1_lat_r))); //p1到p2的方位角
		if (isNaN(para4)) para4 = 0; // protect against rounding
		var para5 = Math.acos((Math.sin(p1_lat_r) - Math.sin(p2_lat_r) * Math.cos(para3)) / (Math.sin(para3) * Math.cos(p2_lat_r))); //p2到p1的方位角
		// 修正
		if (Math.sin(p2_lng_r - p1_lng_r) > 0) {
			var para6 = para4;
			var para7 = 2 * Math.PI - para5;
		} else {
			var para6 = 2 * Math.PI - para4;
			var para7 = para5;
		}
		// p1,p2,p3形成的三角形
		var para8 = (brng1_r - para6 + Math.PI) % (2 * Math.PI) - Math.PI; // 角1
		var para9 = (para7 - brng2_r + Math.PI) % (2 * Math.PI) - Math.PI; // 角2

		if (Math.sin(para8) == 0 && Math.sin(para9) == 0) return null; // infinite intersections
		if (Math.sin(para8) * Math.sin(para9) < 0) return null; // ambiguous intersection

		//para8 = Math.abs(para8);
		//para9 = Math.abs(para9);
		// ... Ed Williams takes abs of para8/para9, but seems to break calculation?
		
		// 角3
		var para10 = Math.acos(-Math.cos(para8) * Math.cos(para9) + Math.sin(para8) * Math.sin(para9) * Math.cos(para3));

		// p1到p3的距離
		var para11 = Math.atan2(Math.sin(para3) * Math.sin(para8) * Math.sin(para9), Math.cos(para9) + Math.cos(para8) * Math.cos(para10)); 

		// p3的緯度
		var para12 = Math.asin(Math.sin(p1_lat_r) * Math.cos(para11) + Math.cos(p1_lat_r) * Math.sin(para11) * Math.cos(brng1_r));  

		// p3的經度
		var para13 = Math.atan2(Math.sin(brng1_r) * Math.sin(para11) * Math.cos(p1_lat_r), Math.cos(para11) - Math.sin(p1_lat_r) * Math.sin(para12));
		var para14 = p1_lng_r + para13;  
		para14 = (para14 + 3 * Math.PI) % (2 * Math.PI) - Math.PI; // normalise to -180..+180ﾂｺ

		return {
			lat: para12 * 180 / Math.PI, //.toDegrees(),
			lng: para14 * 180 / Math.PI //.toDegrees()
		};
	}
	// 4.把geo的點加到houiline_source
	function add_geo_to_source(geo) {
		var geo2 = []
		for (i = 0; i < geo.length; i++){
			geo2[i] = [geo[i][1], geo[i][0]];
		}
		// OpenLayers uses [lon, lat], not [lat, lon] for coordinates
		var route = new ol.geom.LineString(geo2);
		// Coordinates need to be in the view's projection, which is
		// 'EPSG:3857' if nothing else is configured for your ol.View instance
		route.transform('EPSG:4326', 'EPSG:3857');
		
		var routeFeature = new ol.Feature({
			type: 'route',
			geometry: route
		});
		
		houiline_source.addFeature(routeFeature);
	}	
	// 5.把geo的點加到houiline_north_source
	function add_geo_to_north_source(geo) {
		var geo2 = []
		for (i = 0; i < geo.length; i++){
			geo2[i] = [geo[i][1], geo[i][0]];
		}
		// OpenLayers uses [lon, lat], not [lat, lon] for coordinates
		var route = new ol.geom.LineString(geo2);
		// Coordinates need to be in the view's projection, which is
		// 'EPSG:3857' if nothing else is configured for your ol.View instance
		route.transform('EPSG:4326', 'EPSG:3857');
		
		var routeFeature = new ol.Feature({
			type: 'route',
			geometry: route
		});
		
		houiline_north_source.addFeature(routeFeature);
	}
	// 6.給定起始點跟終點,產生兩點連線上固定間隔的點
	function generate_Geodesic(latlngs, steps) {
		var _geo = [], _geocnt = 0, s, poly, points, pointA, pointB;

		for (poly = 0; poly < latlngs.length; poly++) {
			_geo[_geocnt] = [];
			for (points = 0; points < (latlngs[poly].length - 1); points++) {
				pointA = latlngs[poly][points];  // start point
				pointB = latlngs[poly][points + 1];  // end point
				if (pointA == pointB) {
					continue;
				}
				var inverse = vincenty_inverse(pointA[0], pointA[1], pointB.lat, pointB.lng);
				var prev = pointA;
				_geo[_geocnt].push(prev);
				
				for (s = 1; s <= steps;) {
					var direct = vincenty_direct(pointA[0], pointA[1], inverse.initialBearing, inverse.distance / steps * s, true);
					var gp = [direct.lat, direct.lng];
					if (Math.abs(gp[1] - prev[1]) > 180) {
						/*var temp_p_B = ((gp[1] - prev[1]) > 0) ? [-89, -179.999] : [-89, 179.999]; //INTERSECT_LNG = 179.999
						var sec = intersection(pointA, inverse.initialBearing, temp_p_B, 0);
						console.log(sec);
						if (sec) {
							_geo[_geocnt].push([sec.lat, sec.lng])
							_geocnt++
							_geo[_geocnt] = []
							prev = [sec.lat, -sec.lng]
							_geo[_geocnt].push(prev)
							console.log("ggggg");
							s++;
						} else {*/
							_geocnt++
							_geo[_geocnt] = []
							_geo[_geocnt].push(gp)
							prev = gp
							s++
						//}
					} else {
						_geo[_geocnt].push(gp)
						prev = gp
						s++
					}
				}				
			}
			_geocnt++
		}
		return _geo
	}
	
	// 7.清除方位線
	function clear_houiline() {
		//remove houiline
		if (houiline_vector) {
			//other
			maps[map_ind].removeLayer(houiline_vector);
			houiline_vector.getSource().clear();
			houiline_source.clear();
			houiline_vector.set('altitudeMode', 'clampToGround');
			maps[map_ind].addLayer(houiline_vector);
			//north
			maps[map_ind].removeLayer(houiline_north_vector);
			houiline_north_vector.getSource().clear();
			houiline_north_source.clear();
			houiline_north_vector.set('altitudeMode', 'clampToGround');
			maps[map_ind].addLayer(houiline_north_vector);
		}
		//check if toukyoken is checked, if not, remove icon
		if (sup_icon_box) {            
            if (!$('#toukyoken_cb').checkbox('is checked') || !$.isNumeric($('#toukyoken_StepSize').val()) || !$('#toukyoken_StepSize').val() > 0) {
                maps[map_ind].removeLayer(sup_icon_box);
                sup_icon_box.getSource().clear();
                sup_icon_source.clear();
                sup_icon_box.set('altitudeMode', 'clampToGround');
                maps[map_ind].addLayer(sup_icon_box);
                maps[map_ind].removeInteraction(sup_modifyInteraction);
                has_icon = 0
            } else {
                maps[map_ind].removeLayer(sup_icon_box);
                sup_icon_box.getSource().clear();
                sup_icon_source.clear();
                sup_icon_box.set('altitudeMode', 'clampToGround');
                maps[map_ind].addLayer(sup_icon_box);
                maps[map_ind].removeInteraction(sup_modifyInteraction);
                //set icon style
                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: './img/marker_icon.png',
                    })
                });
                //create icon
                var marker = createMarker(ol.proj.transform([sup_line_loc[1], sup_line_loc[0]], 'EPSG:4326', 'EPSG:3857'), iconStyle);  // icon feature
                sup_icon_source = new ol.source.Vector({wrapX: false});
                sup_icon_source.addFeature(marker);	
                sup_icon_box = new ol.layer.Vector({
                    source: sup_icon_source
                });
                sup_icon_box.set('altitudeMode', 'clampToGround');
                maps[map_ind].addLayer(sup_icon_box);
                sup_modifyInteraction = makeMovable(marker);
                maps[map_ind].addInteraction(sup_modifyInteraction);
                
                sup_icon_box.setZIndex(10002)
                has_icon = 1
            }
		}
	}
	// 8.在選定的中心位置建立坐標圖像
	function createMarker(location, style){
		var iconFeature = new ol.Feature({
			geometry: new ol.geom.Point(location)
		});
		iconFeature.setStyle(style);

		return iconFeature
	}
	// 9.拖曳中心時重新產生方位線及等距圈
	function makeMovable(feature) {
		var modify = new ol.interaction.Modify({
			features: new ol.Collection([feature])
		});

		modify.on('modifyend', function(e) {
			var c = ol.proj.transform(e.features.getArray()[0].getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'); // return[x,y]([lon, lat])
			sup_line_loc = [c[1], c[0]];  // OpenLayers uses [lon, lat], not [lat, lon] for coordinates
			if ($('#toukyoken_cb').checkbox('is checked') && $.isNumeric($('#toukyoken_StepSize').val()) && $('#toukyoken_StepSize').val() > 0)
                get_toukyoken();  // define in toukyoken.js
            if ($('#houiline_cb').checkbox('is checked')) {
                get_houiline();
            }
		})		
		return modify;
	}	
	
	//北方方位線
	var houiline_north_source;
	var houiline_north_vector;
	//其餘的方位線
	var houiline_source;
	var houiline_vector;

	var houiCount = 4;  // 預設:4方向
	//icon
	var sup_icon_source;
	var sup_icon_box;
	var sup_line_loc;
	var sup_modifyInteraction;
	
	var hou_marker 
    var has_icon = 0;
	
	// 10.產生方位線
	function get_houiline(){
		fun_access_log("Func_Use_Sup_1_1");
		//reset houiline
		clear_houiline();
		
		var distance = 19500000;
		var wrap = true;
		var step = 1;

		houiline_source = new ol.source.Vector({wrapX: false});
		houiline_north_source = new ol.source.Vector({wrapX: false});
		
		//取得各方向的方位線
		for (var step = 1; step < houiCount;step++) 
		{
			//先取得與中心位置距離19500000的點result
			var result = vincenty_direct(sup_line_loc[0], sup_line_loc[1], 360 / houiCount * step, distance, wrap);
			//產生中心與result連線上固定間隔的點,然後加到houiline_source
			var geo = generate_Geodesic([[sup_line_loc, result]], 200);
			for (var i = 0; i < geo.length; i++)
				add_geo_to_source(geo[i])		
		}
		
		var styles = new ol.style.Style({
			stroke: new ol.style.Stroke({
				width: 3,
				color: "#99FF99"
			})
		});
		
		houiline_vector = new ol.layer.Vector({
			source: houiline_source,
			style: styles
		});
		houiline_vector.set('altitudeMode', 'clampToGround');
		maps[map_ind].addLayer(houiline_vector);
		
		step = houiCount
		//取得北方方位線
		var result = vincenty_direct(sup_line_loc[0], sup_line_loc[1], 360 / houiCount * step, distance, wrap);
			
		var geo = generate_Geodesic([[sup_line_loc, result]], 200);
		for (var i = 0; i < geo.length; i++)
			add_geo_to_north_source(geo[i])		
	
		var styles = new ol.style.Style({
			stroke: new ol.style.Stroke({
				width: 3,
				color: "#FF0000"
			})
		});
		
		houiline_north_vector = new ol.layer.Vector({
			source: houiline_north_source,
			style: styles
		});
		houiline_north_vector.set('altitudeMode', 'clampToGround');
		maps[map_ind].addLayer(houiline_north_vector);
		
        if (!has_icon) {
            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon( ({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    src: './img/marker_icon.png',
                })),
                text: new ol.style.Text({
                    textAlign: 'center',
                    textBaseline: 'middle',
                    font: 'normal 24px Arial',
                    text: 'N',
                    fill: new ol.style.Fill({color: '#FF8888', width: 3}),
                    stroke: new ol.style.Stroke({color: '#FFFFFF', width: 5}),
                    offsetX: 0,
                    offsetY: -100,
                    placement: 'point',
                    maxAngle: '0.7853981633974483',
                    rotation: 0.0
                })
            });

            sup_marker = createMarker(ol.proj.transform([sup_line_loc[1], sup_line_loc[0]], 'EPSG:4326', 'EPSG:3857'), iconStyle);

            sup_icon_source = new ol.source.Vector({wrapX: false});
            sup_icon_source.addFeature(sup_marker);	
            sup_icon_box = new ol.layer.Vector({
                source: sup_icon_source
            });
            sup_icon_box.set('altitudeMode', 'clampToGround');
            maps[map_ind].addLayer(sup_icon_box);
            
            sup_modifyInteraction = makeMovable(sup_marker);
            maps[map_ind].addInteraction(sup_modifyInteraction);
            has_icon = 1
        }
        else {
            maps[map_ind].removeLayer(sup_icon_box);
            sup_icon_box.getSource().clear();
            sup_icon_source.clear();
            sup_icon_box.set('altitudeMode', 'clampToGround');
            maps[map_ind].addLayer(sup_icon_box);
            maps[map_ind].removeInteraction(sup_modifyInteraction);
            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon( ({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    src: './img/marker_icon.png',
                })),
                text: new ol.style.Text({
                    textAlign: 'center',
                    textBaseline: 'middle',
                    font: 'normal 24px Arial',
                    text: 'N',
                    fill: new ol.style.Fill({color: '#FF8888', width: 3}),
                    stroke: new ol.style.Stroke({color: '#FFFFFF', width: 5}),
                    offsetX: 0,
                    offsetY: -100,
                    placement: 'point',
                    maxAngle: '0.7853981633974483',
                    rotation: 0.0
                })
            });

            sup_marker = createMarker(ol.proj.transform([sup_line_loc[1], sup_line_loc[0]], 'EPSG:4326', 'EPSG:3857'), iconStyle);       

            sup_icon_source = new ol.source.Vector({wrapX: false});
            sup_icon_source.addFeature(sup_marker);	
            sup_icon_box = new ol.layer.Vector({
                source: sup_icon_source
            });
            sup_icon_box.set('altitudeMode', 'clampToGround');
            maps[map_ind].addLayer(sup_icon_box);
            
            sup_modifyInteraction = makeMovable(sup_marker);
            maps[map_ind].addInteraction(sup_modifyInteraction);
            has_icon = 1
        }

		// set houiline layer to the highest level ( z-index : 10000 )		
		houiline_vector.setZIndex(10000)
		houiline_north_vector.setZIndex(10000)
		sup_icon_box.setZIndex(10002)

		maps[map_ind].getView().setZoom(maps[map_ind].getView().getZoom());		
	}
	
	// 11.重新定位中心點
	function get_supline_center(){
		document.getElementById("space_lonlat").checked = true;
		fun_access_log("Func_Use_Sup_1_1");
		clear_map();
	 
		createMeasureTooltip();  
	 
		source_box = new ol.source.Vector({wrapX: false});

		vector_box = new ol.layer.Vector({
			source: source_box,
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255, 255, 255, 0)'
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(255, 255, 255, 0)',
					width: 2
				}),
				image: new ol.style.Circle({
					radius: 7,
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0)'
					})
				})
			})
		});
		vector_box.set('altitudeMode', 'clampToGround');
		maps[map_ind].addLayer(vector_box);
		value = 'Point';
		maxPoints = 1;
		
		draw_box = new ol.interaction.Draw({
			source: source_box,
			type: /** @type {ol.geom.GeometryType} */ (value),
			maxPoints: maxPoints
		});
			
		maps[map_ind].addInteraction(draw_box);	
			
		draw_box.on('drawstart',
			function (evt) {

				btn_disable();	

			}, this);
			
		draw_box.on('drawend',
			function (e) {
				// 產生等距圈
                if ( $('#toukyoken_checked').is(':checked') ) {
					
					clear_toukyoken()  // define in toukyoken.js
					if (sup_icon_box) {
                        maps[map_ind].removeLayer(sup_icon_box);
                        sup_icon_box.getSource().clear();
                        sup_icon_source.clear();
                        sup_icon_box.set('altitudeMode', 'clampToGround');
                        maps[map_ind].addLayer(sup_icon_box);
                        maps[map_ind].removeInteraction(sup_modifyInteraction);
                        has_icon = 0
                    }
					
					var format = new ol.format.WKT();
					wkt = format.writeGeometry(e.feature.getGeometry());
					coor = e.feature.getGeometry().getCoordinates();
					// 抓起點、終點坐標
					Coord = e.feature.getGeometry().getFirstCoordinate();
							
					array=String(Coord).split(",");
					start_84=ol.proj.transform([array[0],array[1]], 'EPSG:3857', 'EPSG:4326');
						
					sup_line_loc = [start_84[1], start_84[0]];
					
					get_toukyoken()  // define in toukyoken.js
				}
                // 產生方位線
				if ( $('#houiline_checked').is(':checked') ) {
					
					clear_houiline();
					if (sup_icon_box) {
                        maps[map_ind].removeLayer(sup_icon_box);
                        sup_icon_box.getSource().clear();
                        sup_icon_source.clear();
                        sup_icon_box.set('altitudeMode', 'clampToGround');
                        maps[map_ind].addLayer(sup_icon_box);
                        maps[map_ind].removeInteraction(sup_modifyInteraction);
                        has_icon = 0
                    }
					var format = new ol.format.WKT();
					wkt = format.writeGeometry(e.feature.getGeometry());
					coor = e.feature.getGeometry().getCoordinates();
					//抓起點、終點坐標
					Coord = e.feature.getGeometry().getFirstCoordinate();

					array=String(Coord).split(",");
					start_84=ol.proj.transform([array[0],array[1]], 'EPSG:3857', 'EPSG:4326');
						
					sup_line_loc = [start_84[1], start_84[0]];
					
					get_houiline()
				}				
				btn_enable();
				maps[map_ind].removeInteraction(draw_box);
			}, this);
	 }
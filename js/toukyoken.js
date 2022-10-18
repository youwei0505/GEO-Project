/*
 *  主要功能：產生等距圈
 */

	var circle_num = 10;  //總圈數

	var maxResolution = 4800;
	var baseResolution = 36;
	var interval;
	var curr_dis_label;

	var toukyoken_source = [];
	var toukyoken_vector = [];
	var StyleFuncArr = [];
	//var sup_line_loc = [23.00019007537871, 120.2250646477952];  // initial location	

	// 1.拖曳中心時重新產生方位線及等距圈
	// (not used, define in houiline.js)
	function sup_makeMovable(feature) {
		var modify = new ol.interaction.Modify({
			features: new ol.Collection([feature])
		});

		modify.on('modifyend', function(e) {
			var c = ol.proj.transform(e.features.getArray()[0].getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
			sup_line_loc = [c[1], c[0]];
			if ($('#toukyoken_cb').checkbox('is checked') && $.isNumeric($('#toukyoken_StepSize').val()) && $('#toukyoken_StepSize').val() > 0)
                get_toukyoken();
            if ($('#houiline_cb').checkbox('is checked')) 
                get_houiline();  // define in houiline.js
		});
		
		return modify;
	}
	
	// 2.產生等距圈的標示文字(距離 + 單位)
	function getText(resolution, circle) {        
        var text = '';
		//地圖縮小到一定程度時就不顯示文字
        if (resolution > maxResolution) {			
			// Origin : disappear
			text = '';
        } else {
			if ( $('#toukyoken_unit').val() == '1' )
				text = ((circle + 1) * (interval / 1000)) + ' km';
			else
				text = ((circle + 1) * interval) + ' m';
		}
        return text;
    }
	
	// 3.計算等距圈上各點的經緯度
	function createLatLngs(radius)
	{
		var idx = 0;
		var steps = 50;
		
		var latlngs = [];
		latlngs[idx] = [];
		var numSides = steps;
		
		var wrap = true;
		
		var direct0 = vincenty_direct(sup_line_loc[0], sup_line_loc[1], 0, radius, wrap);  // 從北方(0度)開始
		var prev = [direct0.lat, direct0.lng];
		
		latlngs[idx].push(prev)
		for (step = 1; step <= numSides; ) 
		{
			var direct = vincenty_direct(sup_line_loc[0], sup_line_loc[1], 360 / numSides * step, radius, wrap);
			var gp = [direct.lat, direct.lng];
			
			if (Math.abs(gp[1] - prev[1]) > 180) {
				//var inverse = vincenty_inverse(prev, gp);	
				idx++
				latlngs[idx] = []
				latlngs[idx].push(gp)
				prev = gp
				step++
			} else {
				latlngs[idx].push(gp);
				prev = gp
				step++
			}			
		}		
		
		var result = [];
		var prevLatLng = null;
		var MAX_LAT = 85.0511287798;
		var MIN_LAT = -85.0511287798;
		
		for( var i=0; i<latlngs.length; i++ )
		{
			var arr = [];
			for( var j=0; j<latlngs[i].length; j++ )
			{				
				var latlng = latlngs[i][j];
				
				if ( latlng.lat > MAX_LAT )
				{					
					result.push( arr );
					arr = [];
				}
				else if ( latlng.lat < MIN_LAT )
				{				
					result.push( arr );
					arr = [];
				}
				else
				{
					arr.push( latlng );
				}				
				
				prevLatLng = latlng;
			}			
			if ( arr.length > 0 ) result.push( arr );
		}		
		return result;	
	}

	// 4.把result的點加到toukyoken_source
	function draw_toukyoken(result, circle_id)
	{		
		var input = [];
		
		for (var i = 0; i < result.length; i++){
			input[i] = [result[i][1], result[i][0]];
		}
		
		var route = new ol.geom.LineString(input);
		// Coordinates need to be in the view's projection, which is
		// 'EPSG:3857' if nothing else is configured for your ol.View instance
		route.transform('EPSG:4326', 'EPSG:3857');
		
		//console.log(route);
		
		var routeFeature = new ol.Feature({
			type: 'route',
			geometry: route
		});
		
		routeFeature.setId(circle_id)
		
		toukyoken_source[circle_id].addFeature(routeFeature);
	}

	// 5.清除等距圈
	function clear_toukyoken()
	{
		//remove toukyoken
		if (toukyoken_vector[0]) {
			for (var i = 0; i < circle_num; i++) {
				maps[map_ind].removeLayer(toukyoken_vector[i]);
				toukyoken_vector[i].getSource().clear();
				toukyoken_source[i].clear();
				toukyoken_vector[i].set('altitudeMode', 'clampToGround');
				maps[map_ind].addLayer(toukyoken_vector[i]);
			}
		}
		//check if houiline is checked, if not, remove icon
		if (sup_icon_box) {
            if (!$('#houiline_cb').checkbox('is checked')) {
                maps[map_ind].removeLayer(sup_icon_box);
                sup_icon_box.getSource().clear();
                sup_icon_source.clear();
                sup_icon_box.set('altitudeMode', 'clampToGround');
                maps[map_ind].addLayer(sup_icon_box);
                maps[map_ind].removeInteraction(sup_modifyInteraction);
                has_icon = 0
            }
		}		
	}
	
	// 6.產生等距圈
	function get_toukyoken()
	{	
		fun_access_log("Func_Use_Sup_1_1");	
		clear_toukyoken();
		
		interval = $('#toukyoken_StepSize').val();  // 間距(單位：m)
		
		if ( $('#toukyoken_unit').val() == '1')
			interval = interval * 1000;
		
		for (var i = 0; i < circle_num; i++) {
			toukyoken_source[i] = new ol.source.Vector({
				wrapX: false
			});
		}		
		
		// set style for each circle 
		StyleFuncArr = []		
		for ( curr_dis_label = 0; curr_dis_label < circle_num; curr_dis_label++ ) {
			StyleFuncArr.push(function (feature, resolution) {
				
				return new ol.style.Style({
					stroke: new ol.style.Stroke({
						width: 3,
						color: "#FF8888"
					}),
					text: new ol.style.Text({
						textAlign: 'center',
						textBaseline: 'middle',
						font: 'normal 16px Arial',
						text: getText(resolution, parseInt(feature.getId())),
						fill: new ol.style.Fill({color: '#FF8888'}),
						stroke: new ol.style.Stroke({color: '#FFFFFF', width: 3}),
						offsetX: 0,
						offsetY: 12,
						placement: 'point',
						maxAngle: '0.7853981633974483',
						rotation: 0.0
					})
				});				
			})
		}

		//var res = maps[map_ind].getView().getResolution();		
		//console.log(res)
		
		/*		
		if ( interval <= 1000 )
			maxResolution = baseResolution;
		else
			maxResolution = baseResolution * 40 * (interval / 1000);
		*/
		
		maxResolution = 40 * (interval / 1000);
		
		for( var i=0; i< circle_num; i++ )
		{			
			var radius =interval * (i + 1);
			var radiusText = radius;
			
			if ( radius > 21000*1000 ) continue;  // 距離大於21000km就不顯示等距圈
			var latLngs = createLatLngs(radius);
			
			
			for (var j = 0; j < latLngs.length; j++){
				draw_toukyoken(latLngs[j], i);
			}			
						
			toukyoken_vector[i] = new ol.layer.Vector({
				source: toukyoken_source[i],
				style: StyleFuncArr[i]  // CircleStyleFunction
			});
			toukyoken_vector[i].set('altitudeMode', 'clampToGround');	
			maps[map_ind].addLayer(toukyoken_vector[i]);			
		}		
		
		// if no icon, create one
        if (!has_icon) {
            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    src: './img/marker_icon.png',
                })
            });

            var marker = createMarker(ol.proj.transform([sup_line_loc[1], sup_line_loc[0]], 'EPSG:4326', 'EPSG:3857'), iconStyle);
            
            sup_icon_source = new ol.source.Vector({wrapX: false});
            sup_icon_source.addFeature(marker);	
            sup_icon_box = new ol.layer.Vector({
                source: sup_icon_source
            });
            sup_icon_box.set('altitudeMode', 'clampToGround');
            maps[map_ind].addLayer(sup_icon_box);
            sup_modifyInteraction = makeMovable(marker);
            maps[map_ind].addInteraction(sup_modifyInteraction);
            has_icon = 1
        }

		// set toukyoken layer to the highest level ( z-index : 10000 )		
		for( var i=0; i< circle_num; i++ )
			toukyoken_vector[i].setZIndex(10001);
		sup_icon_box.setZIndex(10002);
		
		maps[map_ind].getView().setZoom(maps[map_ind].getView().getZoom());
	}	
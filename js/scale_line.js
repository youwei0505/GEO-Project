function sc(A1, A2, B1, B2){

	web_url = "https://dtm.moi.gov.tw/services/pathprofile/pathprofile.asmx/getPathProfile";
	wkt = "LINESTRING(" + A1 + "%20" + A2 + "," + 
							B1 + "%20" + B2 + ")";
	data = $('#drawline_data').val();		
	stepSizeValue = $('#drawline_StepSize').val();

	$.ajax({
		type: 	"GET",
		url:	"php/get_path_height.php",
		dataType:	"json",
		data: {
			u : web_url,
			w : wkt,
			d : data,
			s : stepSizeValue
		},
		success: function(json) {
			
			if ( json.getData == true ) {
				// one of WGS84 earth radius
				var wgs84sphere = new ol.Sphere(6378137); 
				// get distance one sphere
				var d = wgs84sphere.haversineDistance([A1, A2], [B1, B2]);
				pArray = JSON.parse(json.array);
	
				for (var i = 0; i < pArray.length; i++)
				{
					if (pArray[i].m > d) {
						var inter = (pArray[i].value - pArray[i - 1].value) / (pArray[i].m - pArray[i - 1].m);
						var res = measureTooltipElement.innerHTML.split(" ");
						var scale_d;
						if (res[1] == "km") {
							scale_d = res[0] * 1000;
						} else {
							scale_d = res[0];
						}
						pArray[i].value = Math.round(((scale_d - pArray[i - 1].m) * inter) + parseFloat(pArray[i - 1].value) * 100000) / 100000;
						pArray[i].m = scale_d;
						pArray.length = i + 1;
						break;
					}
				}
				UpdateChart(pArray);
			} else {
				alert("您沒有權限使用此資料類型");
				btn_enable();
			}
			
		},
		error: function(jqXHR) {
			alert("error " + jqXHR.status);
			btn_enable();
		}
	});
}
	
var icon_box;
var icon_source;
var line_chart;

function UpdateChart(pointArray) {
    line_chart = AmCharts.makeChart("chartdiv", {
        "dataProvider": pointArray,
        "type": "serial",
		"theme": "light",
		"marginRight": 40,
		"marginLeft": 40,
		"autoMarginOffset": 20,
		"valueAxes": [{
			"id": "v1",
			"axisAlpha": 0,
			"position": "left",
			"ignoreAxisWidth": false,
			"title": "高度（m）"
		}],
		"balloon": {
			"borderThickness": 1,
			"shadowAlpha": 0
		},
		"graphs": [{
			"id": "g1",
			"lineColor": "#388112",
			"balloon": {
				"drop": true,
				"adjustBorderColor": false,
				"color": "#ffffff",
				"type": "smoothedLine"
			},
			"fillAlphas": 0.2,
			"bullet": "round",
			"bulletBorderAlpha": 1,
			"bulletColor": "#FFFFFF",
			"bulletSize": 5,
			"hideBulletsCount": 50,
			"lineThickness": 2,
			"title": "red line",
			"useLineColorForBulletBorder": true,
			"valueField": "value",
			"balloonText": "<span style='font-size:18px;'>[[value]]</span>"
		}],
		"chartScrollbar": {
			"graph": "g1",
			"scrollbarHeight": 50,
			"backgroundAlpha": 0,
			"selectedBackgroundAlpha": 0.1,
			"selectedBackgroundColor": "#888888",
			"graphFillAlpha": 0,
			"graphLineAlpha": 0.5,
			"selectedGraphFillAlpha": 0,
			"selectedGraphLineAlpha": 1,
			"autoGridCount": true,
			"color": "#AAAAAA"
		},
		"chartCursor": {
			"cursorAlpha": 0,
		},
		"valueScrollbar": {
			"autoGridCount": true,
			"color": "#000000",
			"scrollbarHeight": 50
		},
		"categoryField": "m",
		"categoryAxis": {
			"equalSpacing": true,
			"gridPosition": "middle",
			"dashLength": 1,
			"minorGridEnabled": true,
			"title": "距離（m）"
		},
		"export": {
			"enabled": true
		},
		"zoomOutOnDataUpdate": false,
		"listeners": [ {
			"event": "init",
			"method": function( e ) {
				
				/**
				* Add click event on the plot area
				*/
				e.chart.chartDiv.addEventListener( "click", function() { 
					var max_m = e.chart.dataProvider[e.chart.dataProvider.length - 1].m;
					// we track cursor's last known position by "changed" event
					if ( e.chart.lastCursorPosition !== undefined ) {
						// get date of the last known cursor position
						var date = e.chart.dataProvider[ e.chart.lastCursorPosition ][ e.chart.categoryField ];
						
						var percent = date / max_m;
						var features = vector_box.getSource().getFeatures();
						var coor_start = features[0].getGeometry().getCoordinates()[0];
						var coor_end = features[0].getGeometry().getCoordinates()[1];
						var plot_coor = [(coor_start[0] * (1 - percent)) + (coor_end[0] * percent), (coor_start[1] * (1 - percent)) + (coor_end[1] * percent)];

						if (icon_box) {
							maps[map_ind].removeLayer(icon_box);
							icon_box.getSource().clear();
							icon_source.clear();
							maps[map_ind].addLayer(icon_box);
						}
						
						var iconStyle = new ol.style.Style({
							image: new ol.style.Icon({
								anchor: [0.5, 40],
								anchorXUnits: 'fraction',
								anchorYUnits: 'pixels',
								opacity: 0.75,
								src: 'https://geodac.ncku.edu.tw/SWCB_LLGIS/location.png'
							})
						});						
						
						
						
						var icon_feature = new ol.Feature(
							new ol.geom.Point(plot_coor)
						);
						icon_feature.setStyle(iconStyle);
						
						icon_source = new ol.source.Vector({wrapX: false});
						icon_source.addFeature(icon_feature);
						
						icon_box = new ol.layer.Vector({
							source: icon_source
						});
						
						maps[map_ind].addLayer(icon_box);
						
						// create a new guide or update position of the previous one
						if ( e.chart.categoryAxis.guides.length === 0 ) {
							var guide = new AmCharts.Guide();
							guide.category = date;
							guide.lineAlpha = 1;
							guide.lineColor = "#c44";
							e.chart.categoryAxis.addGuide( guide );
							
						} else {
							e.chart.categoryAxis.guides[ 0 ].category = date;
						}
						e.chart.validateData();
					}
				} )
				//handle touch screens so that subsequent guides can
				//be added. Requires that the user taps the next
				//point twice. Needed in order to not break zoom/pan
				e.chart.chartDiv.addEventListener( "touchend", function() {
					e.chart.tapped = false;
				});
				/*** add ***/
				btn_enable();
				/*** add ***/
			}
		}, {
		"event": "changed",
		"method": function( e ) {
			/**
			* Log cursor's last known position
			*/
			e.chart.lastCursorPosition = e.index;
		}
		}],
	});
}
 
 function get_linepoint(){
	document.getElementById("space_lonlat").checked = true;
	
	clear_map();
 
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
	
	/*** add 1015 ***/
	vector_box.setZIndex(draw_box_zindex);
	/****************/
	
	
	value = 'LineString';
    maxPoints = 2;
    
	draw_box = new ol.interaction.Draw({
		source: source_box,
		type: /** @type {ol.geom.GeometryType} */ (value),
		maxPoints: maxPoints
	});
		
	maps[map_ind].addInteraction(draw_box);	
	 
	draw_box.on('drawstart',
        function (evt) {
			
			btn_disable();
			
            createMeasureTooltip();
            // set sketch
            sketch = evt.feature;

            var tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output;
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
				
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        }, this);
	
	draw_box.on('drawend',
        function (e) {
			
            coor = e.feature.getGeometry().getCoordinates();
            //抓起點、終點坐標
            startCoord = e.feature.getGeometry().getFirstCoordinate();
            endCoord = e.feature.getGeometry().getLastCoordinate();
			
			
			start_array=String(startCoord).split(",");
			start_84=ol.proj.transform([start_array[0],start_array[1]], 'EPSG:3857', 'EPSG:4326');
			
			end_array=String(endCoord).split(",");
			end_84=ol.proj.transform([end_array[0],end_array[1]], 'EPSG:3857', 'EPSG:4326');
			
			sc(start_84[0], start_84[1], end_84[0], end_84[1]);
			
			maps[map_ind].removeInteraction(draw_box);
			/*** modify ***/
			//btn_enable();
			/*** modify ***/
			
        }, this);
       
 }
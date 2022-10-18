function get_path_slope(path_slope_distance, path_slope_coor_all, data, step_size) { //抓取坡度資料
    var total_distance = 0
    
    var slope_degree_buffer = [] //坡度array
    
    for (var i = 0; i < path_slope_distance.length; i++)//內差法精確
        total_distance += path_slope_distance[i]
    
    for (var ps = 0; ps < total_distance + step_size; ps = ps + step_size){
        
        var coor_start, coor_end;
        
        var ps_temp = ps
        
        for (var i = 0; i < path_slope_distance.length; i++)
        {
            if (i < path_slope_distance[i])
            {
                percent = ps_temp / path_slope_distance[i];
                coor_start = path_slope_coor_all[i];
                coor_end = path_slope_coor_all[i + 1];
                break;
            }
            else
            {
                ps_temp = ps_temp - path_slope_distance[i];
                if (i == path_slope_distance.length - 1)
                {
                    percent = 1;
                    coor_start = path_slope_coor_all[i];
                    coor_end = path_slope_coor_all[i + 1];
                }
            }
        }
        
        
        var slope_coor = [(coor_start[0] * (1 - percent)) + (coor_end[0] * percent), (coor_start[1] * (1 - percent)) + (coor_end[1] * percent)];
        //抓取每個百分比的坡度
        
        slope_coor = ol.proj.transform([slope_coor[0],slope_coor[1]], 'EPSG:3857', 'EPSG:4326');
        var path_slope_data = 'POINT('+slope_coor[0]+' '+slope_coor[1]+')';
        $.ajax({
            url: "php/get_slope_detail.php",
            type: 'post',
            dataType:'text',
            async: false,
            data: {
                select: "getSlopeValue",
                wkt: path_slope_data,
                data: data,
                left: left_slope,
                up: up_slope,
                right: right_slope,
                down: down_slope,
                /*** add 20190515 ***/
                l: (slope_num + 1)
                /*** add 20190515 ***/
            },
            success: function(path_slope_json) { //確認是否有登入可以使用5M or 1M
                if(path_slope_json == "WKT未包含任何縣市,或此縣市資料，系統尚未支援" || data == "API KEY 錯誤" || data == "您沒有權限使用此資料類型")
                {
                    alert(path_slope_json);
                }
                else{
                    var path_slope_obj;
                    try {
                        path_slope_obj = JSON.parse(path_slope_json);
                        slope_degree_buffer.push(path_slope_obj.slope_degree)
                    } catch(e) {
                        alert('發生不明錯誤'); // error in the above string (in this case, yes)!
                    }
                }
            }
        });
    }
    
    return slope_degree_buffer
}

function sc_path(coor){ //抓取API_PATH資料
	
	web_url = "https://dtm.moi.gov.tw/services/pathprofile/pathprofile.asmx/getPathProfile";
	data = $('#drawpath_data').val();	
	stepSizeValue = $('#drawpath_StepSize').val();

	wkt = "LINESTRING(";
	
	for (var i = 0 ; i < coor.length; i++) //抓取每個點的經緯度
	{
		coor_84 = ol.proj.transform([coor[i][0],coor[i][1]], 'EPSG:3857', 'EPSG:4326');
		if (i == 0)
			wkt = wkt + coor_84[0] + "%20" + coor_84[1];
		else
			wkt = wkt + "," + coor_84[0] + "%20" + coor_84[1];
	}

	wkt = wkt + ")";
    
    aspect_wkt = "LINESTRING(";
	
	for (var i = 0 ; i < coor.length; i++) //抓取每個點的經緯度
	{
		coor_84 = ol.proj.transform([coor[i][0],coor[i][1]], 'EPSG:3857', 'EPSG:4326');
		if (i == 0)
			aspect_wkt = aspect_wkt + coor_84[0] + " " + coor_84[1];
		else
			aspect_wkt = aspect_wkt + "," + coor_84[0] + " " + coor_84[1];
	}

	aspect_wkt = aspect_wkt + ")";
    
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
				var d = 0;

				for (var i = 1; i < coor.length; i++) //計算整個距離長度
				{
					var p1 = ol.proj.transform([coor[i - 1][0],coor[i - 1][1]], 'EPSG:3857', 'EPSG:4326');
					var p2 = ol.proj.transform([coor[i][0],coor[i][1]], 'EPSG:3857', 'EPSG:4326');
				
					// create sphere to measure on
					var wgs84sphere = new ol.Sphere(6378137); // one of WGS84 earth radius'
					// get distance on sphere
					d = d + wgs84sphere.haversineDistance(p1, p2);
				}
                
				pArray = JSON.parse(json.array);
	
    
				for (var i = 0; i < pArray.length; i++) //最後一段用內差計算高度
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
                
                
                
                
				var path_slope_features = vector_box.getSource().getFeatures();
				var path_slope_coor_all = path_slope_features[0].getGeometry().getCoordinates();
                console.log(path_slope_coor_all)
                
				var path_slope_distance = [];
                
                for (var i = 1; i < path_slope_coor_all.length; i++) //計算整個距離長度
                {
                    var path_slope_point1 = ol.proj.transform([path_slope_coor_all[i - 1][0],path_slope_coor_all[i - 1][1]], 'EPSG:3857', 'EPSG:4326');
                    var path_slope_point2 = ol.proj.transform([path_slope_coor_all[i][0],path_slope_coor_all[i][1]], 'EPSG:3857', 'EPSG:4326');
                    // create sphere to measure on
                    var wgs84sphere = new ol.Sphere(6378137); // one of WGS84 earth radius'

                    // get distance on sphere
                    path_slope_distance[i - 1] = wgs84sphere.haversineDistance(path_slope_point1, path_slope_point2);
                }
                
                let path_chart_data = []
                if ( $('#drawpath_checked').is(':checked') ) {//判斷是否要包含坡度資訊
					var slope_degree_buffer = get_path_slope(path_slope_distance, path_slope_coor_all, data,  Number(stepSizeValue));             
					while(slope_degree_buffer.length < pArray.length)//處理空資料
						slope_degree_buffer.push("no data")
					
					for (var i = 0; i < slope_degree_buffer.length; i++){//處理空資料
						if (slope_degree_buffer[i] == "")
							slope_degree_buffer[i] = 'no data'
					}
				  for (var i = 0; i < pArray.length; i++) //儲存excel的格式
					{
					path_chart_data.push({"水平距離(m)":pArray[i].m, '高程':pArray[i].value, '坡度(deg)':slope_degree_buffer[i]})
					
					}
				}else{
					for (var i = 0; i < pArray.length; i++) //儲存excel的格式
					{
					path_chart_data.push({"水平距離(m)":pArray[i].m, '高程':pArray[i].value,'X坐標':pArray[i].x,'y坐標':pArray[i].y})
					}
				}
                
                
                
				UpdatepathChart(path_chart_data);
                
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
var path_chart;
var path_coord;

function UpdatepathChart(pointArray) { //折線圖的設定
    console.log(pointArray)
    path_chart = AmCharts.makeChart("path_chartdiv", {
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
			"shadowAlpha": 0.4
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
			"valueField": "高程",
			"balloonText": "<span style='font-size:18px;'>[[高程]]</span>"
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
		"categoryField": "水平距離(m)",
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
				
				
				var features = vector_box.getSource().getFeatures();
				var coor_all = features[0].getGeometry().getCoordinates();
				
				e.chart.chartDiv.addEventListener( "click", function() { //滑鼠點選後，計算在線上的哪個點
					var max_m = e.chart.dataProvider[e.chart.dataProvider.length - 1].m;
					// we track cursor's last known position by "changed" event
					if ( e.chart.lastCursorPosition !== undefined ) {
						// get date of the last known cursor position
						var date = e.chart.dataProvider[ e.chart.lastCursorPosition ][ e.chart.categoryField ];
						var date_temp = e.chart.dataProvider[ e.chart.lastCursorPosition ][ e.chart.categoryField ];
						
						var distance = [];
						
						for (var i = 1; i < coor_all.length; i++) 
						{
							point1 = ol.proj.transform([coor_all[i - 1][0],coor_all[i - 1][1]], 'EPSG:3857', 'EPSG:4326');
							point2 = ol.proj.transform([coor_all[i][0],coor_all[i][1]], 'EPSG:3857', 'EPSG:4326');
							
							// create sphere to measure on
							var wgs84sphere = new ol.Sphere(6378137); // one of WGS84 earth radius'

							// get distance on sphere
							distance[i - 1] = wgs84sphere.haversineDistance(point1, point2);
						}
						
						var coor_start, coor_end;
						
						for (var i = 0; i < distance.length; i++) 
						{
							if (date_temp < distance[i])
							{
								percent = date_temp / distance[i];
								coor_start = coor_all[i];
								coor_end = coor_all[i + 1];
								break;
							}
							else
							{
								date_temp = date_temp - distance[i];
								if (i == distance.length - 1)
								{
									percent = 1;
									coor_start = coor_all[i];
									coor_end = coor_all[i + 1];
								}
							}
						}
						
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

				btn_enable();
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

 function get_pathpoint(){ //初始化地圖、創建新的tooltip並加在map圖層上
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
	var maxPoints;

	draw_box = new ol.interaction.Draw({
		source: source_box,
		type: /** @type {ol.geom.GeometryType} */ (value),
		maxPoints: maxPoints
	});
		
	maps[map_ind].addInteraction(draw_box);	
	 

	 
	draw_box.on('drawstart',
        function (evt) {

			btn_disable();	
			
			
            //createMeasureTooltip();
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
			
			path_coord = ""
        }, this);
	
	draw_box.on('drawend',
        function (e) {
            coor = e.feature.getGeometry().getCoordinates();
            
			path_coord = coor;
			
			maps[map_ind].removeInteraction(draw_box);
			
			btn_enable();
			
        }, this);
       
 }

function get_path_data() //防呆
{
	if (path_coord != "") {
		
		btn_disable();
		sc_path(path_coord);
	} else {
		alert("發生不明錯誤")
	}
}
var start_marker = "";
var end_marker = "";

var route_line_source;
var route_line_box;
var route_marker_source;
var route_marker_box;
var start_route_marker_source;
var start_route_marker_box;
var end_route_marker_source;
var end_route_marker_box;

var start_route_modifyInteraction;
var end_route_modifyInteraction;

	/*** add 20190515 ***/
 function clear_map_for_route() {
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
 
	if(aspect_draw_type != "none")
		{
			createMeasureTooltip();
			aspect_layer.getSource().clear();
			maps[map_ind].removeInteraction(aspect_draw);
		}
	if(slope_draw_type != "none")
	{
		createMeasureTooltip();
		slope_layer.getSource().clear();
		maps[map_ind].removeInteraction(slope_draw);
	}
	
	/*** add 20190515 ***/
	clear_var()
	/*** add 20190515 ***/
	
	
	createMeasureTooltip();  
}
	/*** add 20190515 ***/

function start_route_makeMovable(feature) {
    var modify = new ol.interaction.Modify({
        features: new ol.Collection([feature])
    });

    modify.on('modifyend', function(e) {
        var c = ol.proj.transform(e.features.getArray()[0].getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
        $("#route_start_pos").val(c[0].toString() + ',' + c[1].toString());
    })
    
    return modify;
}
	
function end_route_makeMovable(feature) {
    var modify = new ol.interaction.Modify({
        features: new ol.Collection([feature])
    });

    modify.on('modifyend', function(e) {
        var c = ol.proj.transform(e.features.getArray()[0].getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
        $("#route_end_pos").val(c[0].toString() + ',' + c[1].toString());
    })
    
    return modify;
}

function set_route_start(loc) {
    if (loc != "目前位置未取得坐標資訊") {
        loc = loc.replace(' ', '');
        $("#route_start_pos").val(loc);
        
        loc_arr = loc.split(',')
        
        var iconStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({color: [187, 255, 255]}),
                stroke: new ol.style.Stroke({
                    color: [0, 0, 0], width: 1
                })
            })
        });
        if (start_marker == "") {
            console.log(ol.proj.transform([parseFloat(loc_arr[0]), parseFloat(loc_arr[1])], 'EPSG:4326', 'EPSG:3857'))
            start_marker = createMarker( ol.proj.transform([parseFloat(loc_arr[0]), parseFloat(loc_arr[1])], 'EPSG:4326', 'EPSG:3857'), iconStyle);
            start_route_marker_source = new ol.source.Vector({wrapX: false});
            start_route_marker_source.addFeature(start_marker);	
            
            start_route_marker_box = new ol.layer.Vector({
                source: start_route_marker_source
            });
            start_route_marker_box.setZIndex(4);
            maps[map_ind].addLayer(start_route_marker_box);
            
            start_route_modifyInteraction = start_route_makeMovable(start_marker);
            maps[map_ind].addInteraction(start_route_modifyInteraction);
        }
        else {
            start_marker = createMarker( ol.proj.transform([parseFloat(loc_arr[0]), parseFloat(loc_arr[1])], 'EPSG:4326', 'EPSG:3857'), iconStyle);
            start_route_marker_box.getSource().clear();
            start_route_marker_source.clear();
            maps[map_ind].removeInteraction(start_route_modifyInteraction);
            
            start_route_marker_source.addFeature(start_marker);	
            
            start_route_marker_box.setSource(start_route_marker_source);
            
            start_route_modifyInteraction = start_route_makeMovable(start_marker);
            maps[map_ind].addInteraction(start_route_modifyInteraction);
        }
    } else {
        alert('未取得坐標資訊，請再試一次')
    }
}

function set_route_end(loc) {
    if (loc != "目前位置未取得坐標資訊") {
        loc = loc.replace(' ', '');
        $("#route_end_pos").val(loc);
        
        loc_arr = loc.split(',')
        
        var iconStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({color: [187, 255, 255]}),
                stroke: new ol.style.Stroke({
                    color: [0, 0, 0], width: 1
                })
            })
        });
        
        if (end_marker == "") {
            end_marker = createMarker( ol.proj.transform([parseFloat(loc_arr[0]), parseFloat(loc_arr[1])], 'EPSG:4326', 'EPSG:3857'), iconStyle);
            end_route_marker_source = new ol.source.Vector({wrapX: false});
            end_route_marker_source.addFeature(end_marker);	
            
            end_route_marker_box = new ol.layer.Vector({
                source: end_route_marker_source
            });
            end_route_marker_box.setZIndex(4);
            maps[map_ind].addLayer(end_route_marker_box);
            
            end_route_modifyInteraction = end_route_makeMovable(end_marker);
            maps[map_ind].addInteraction(end_route_modifyInteraction);
        }
        else {
            end_marker = createMarker( ol.proj.transform([parseFloat(loc_arr[0]), parseFloat(loc_arr[1])], 'EPSG:4326', 'EPSG:3857'), iconStyle);
            end_route_marker_box.getSource().clear();
            end_route_marker_source.clear();
            maps[map_ind].removeInteraction(end_route_modifyInteraction);
            
            end_route_marker_source.addFeature(end_marker);	
            
            end_route_marker_box.setSource(end_route_marker_source);
            
            end_route_modifyInteraction = end_route_makeMovable(end_marker);
            maps[map_ind].addInteraction(end_route_modifyInteraction);
        }
    } else {
        alert('未取得坐標資訊，請再試一次')
    }
}

function get_route_start() {
    document.getElementById("space_lonlat").checked = true;
	
	clear_map_for_route();
	
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
            source.clear();
/*** 20190515 fixed ***/
			btn_disable();
/*** 20190515 fixed ***/
			
        }, this);
	
	draw_box.on('drawend',
        function (e) {
            var format = new ol.format.WKT();
            wkt = format.writeGeometry(e.feature.getGeometry());
            coor = e.feature.getGeometry().getCoordinates();
            //抓起點、終點坐標
            Coord = e.feature.getGeometry().getFirstCoordinate();
         			
			array=String(Coord).split(",");
			start_84=ol.proj.transform([array[0],array[1]], 'EPSG:3857', 'EPSG:4326');
				
			start_pos = $("#route_start_pos").val(start_84[0] + ',' + start_84[1]);
            
			maps[map_ind].removeInteraction(draw_box);
            
            set_route_start(start_84[0] + ',' + start_84[1])
/*** 20190515 fixed ***/
			btn_enable();
		maps[map_ind].removeLayer(vector_box);
		vector_box.getSource().clear();
		source_box.clear();
/*** 20190515 fixed ***/
        }, this);
}

function get_route_end() {
    document.getElementById("space_lonlat").checked = true;
	
	clear_map_for_route();
	
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
            source.clear();
/*** 20190515 fixed ***/
			btn_disable();
/*** 20190515 fixed ***/
        }, this);
	
	draw_box.on('drawend',
        function (e) {
            var format = new ol.format.WKT();
            wkt = format.writeGeometry(e.feature.getGeometry());
            coor = e.feature.getGeometry().getCoordinates();
            //抓起點、終點坐標
            Coord = e.feature.getGeometry().getFirstCoordinate();
         			
			array=String(Coord).split(",");
			start_84=ol.proj.transform([array[0],array[1]], 'EPSG:3857', 'EPSG:4326');
				
			start_pos = $("#route_end_pos").val(start_84[0] + ',' + start_84[1]);
			maps[map_ind].removeInteraction(draw_box);
            set_route_end(start_84[0] + ',' + start_84[1])
/*** 20190515 fixed ***/
			btn_enable();
		maps[map_ind].removeLayer(vector_box);
		vector_box.getSource().clear();
		source_box.clear();
/*** 20190515 fixed ***/
        }, this);
        
}
/*** 20190515 fixed ***/
$(document).ready(function () {
    route_view_win = dhxWins.createWindow("route_view_win", 800, 100, 200, 300);
    /*** 20190529 fixed ***/
    route_view_win.setText("節點定位");
    /*** 20190529 fixed ***/
    route_view_win.centerOnScreen();
    route_view_win.denyResize();
    route_view_win.showInnerScroll();
    route_view_html = "<div class='ui celled list' id = 'route_view_list'></div>"
    route_view_win.attachHTMLString(route_view_html);
    route_view_win.hide();
    
    route_view_win.attachEvent("onClose", function(win){
		route_view_win.hide();
	});
        
})

var prev_route_marker = "";
var prev_route_iconStyle = "";
var prev_route_item = "";
var not_map_click_change = 0;

function set_route_pos(lng, lat) {
    not_map_click_change = 1;
    if(prev_route_item != "") {
        prev_route_item.css('background-color', '#FFFFFF')
    }
    $('#' + lng.toString().replace('.', '') + lat.toString().replace('.', '')).css('background-color', '#FFB2BD')
    prev_route_item = $('#' + lng.toString().replace('.', '') + lat.toString().replace('.', ''))
    
    maps[map_ind].getView().setCenter(ol.proj.transform([lng, lat], "EPSG:4326", "EPSG:3857"));
    maps[map_ind].getView().setZoom(20);
    
    if(street_view_index==1) {        
        /***** show street view *****/
        sv.getPanorama({location: {lat:lat, lng:lng}, radius: 50}, processSVData);
    }
    console.log(route_marker_box.getSource().getFeatureById(lng + ',' + lat).getGeometry().getCoordinates())
    console.log(route_marker_box.getSource().getFeatureById(lng + ',' + lat))
    var cur_route_iconStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({color: [255, 50, 48]}),
            stroke: new ol.style.Stroke({
                color: [0, 0, 0], width: 1
            })
        })
    });
    var cur_route_marker = route_marker_box.getSource().getFeatureById(lng + ',' + lat)
    console.log(cur_route_marker)
    if (prev_route_marker != "")
        prev_route_marker.setStyle(prev_route_iconStyle)
    prev_route_iconStyle = cur_route_marker.getStyle();
    cur_route_marker.setStyle(cur_route_iconStyle)
    prev_route_marker = route_marker_box.getSource().getFeatureById(lng + ',' + lat)
    street_view_position = {lat:lat, lng: lng}
}
/*** 20190515 fixed ***/
function get_route(){
	fun_access_log("Func_Use_Location_1_6");
	document.getElementById("space_lonlat").checked = true;

	clear_map();
    clear_route();
    
	createMeasureTooltip();  
	
    if ($("#route_opt").val() == "length")
        web_url = "https://api.nlsc.gov.tw/other/RoutesQueryByDist/";
    else
        web_url = "https://api.nlsc.gov.tw/other/RoutesQueryByTime/"
	start_pos = $("#route_start_pos").val();
    end_pos = $("#route_end_pos").val();
    traffic = $("#route_traffic").val();
    $.ajax({
        type: 	"GET",
        url:	"php/SendAPIReq.php",
        dataType:	"json",
        data: {
        /*** 20190515 fixed ***/
            u : web_url + parseFloat(start_pos.split(',')[0]) + ',' + parseFloat(start_pos.split(',')[1]) + '/' + parseFloat(end_pos.split(',')[0]) + ',' + parseFloat(end_pos.split(',')[1]) + '/' + traffic + '/json'
        /*** 20190515 fixed ***/
        },
        success: function(data) {
            /*** 20190515 fixed ***/
            var route_inner_html = ""
            /*** 20190515 fixed ***/
            
            route_line_source = new ol.source.Vector({wrapX: false});
            route_marker_source = new ol.source.Vector({wrapX: false});
            for(j = 0; j < data.features.length; j++){
                coors = data.features[j].geometry.coordinates
                var loca = data.features[j].properties
                /*** 20190515 fixed ***/
                route_inner_html = route_inner_html + '\
                <div class="item" onclick = set_route_pos(' + coors[0][0] + ',' + coors[0][1] + ') id="' + coors[0][0].toString().replace('.', '') + coors[0][1].toString().replace('.', '') + '"> \
                    <div class="content"> \
                        <div class="header">' + loca.road + '</div> \
                        ' + loca.turnDirection + ' ' + loca.distance.toString() + 'm' +'\
                    </div> \
                </div>'
                /*** 20190515 fixed ***/
                var iconStyle = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({color: [187, 255, 255]}),
                        stroke: new ol.style.Stroke({
                            color: [0, 0, 0], width: 1
                        })
                    })
                });
                if (j == 0) {
                    var marker = createMarker(ol.proj.transform([coors[0][0], coors[0][1]], 'EPSG:4326', 'EPSG:3857'), iconStyle);
                    marker.set('name', 'route.flag.' + loca.road + ' ' + loca.turnDirection + ' ' + loca.distance.toString() + 'm');
                    marker.setId(coors[0][0] + ',' + coors[0][1]);
                }
                else {
                    var marker = createMarker(ol.proj.transform([coors[0][0], coors[0][1]], 'EPSG:4326', 'EPSG:3857'));
                    marker.set('name', 'route.flag.' + loca.road + ' ' + loca.turnDirection + ' ' + loca.distance.toString() + 'm');
                    marker.setId(coors[0][0] + ',' + coors[0][1]);
                }
                route_marker_source.addFeature(marker);	
                
                for(i = 0; i < coors.length - 1; i++) {
                    coor = coors[i];
                    coor2 = coors[i+1];
                    var start_point = ol.proj.transform([parseFloat(coor[0]), parseFloat(coor[1])], 'EPSG:4326', 'EPSG:3857')
                    var end_point = ol.proj.transform([parseFloat(coor2[0]), parseFloat(coor2[1])], 'EPSG:4326', 'EPSG:3857')
                    var points = [start_point, end_point]
                    var featureLine = new ol.Feature({
                        geometry: new ol.geom.LineString(points)
                    });
                    route_line_source.addFeature(featureLine);
                    
                    if (j == data.features.length - 1 && i == coors.length - 2) {
                        
                        var iconStyle = new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 7,
                                fill: new ol.style.Fill({color: [187, 255, 255]}),
                                stroke: new ol.style.Stroke({
                                    color: [0, 0, 0], width: 1
                                })
                            })
                        });
                        var marker = createMarker(ol.proj.transform([coor2[0], coor2[1]], 'EPSG:4326', 'EPSG:3857'), iconStyle);
                        marker.setId(coor2[0][0] + ',' + coor2[0][1]);
                        
                        route_marker_source.addFeature(marker);
                    }
                    
                }
            }
            /*** 20190515 fixed ***/
            $('#route_view_list').html(route_inner_html)
            route_view_win.show();
            /*** 20190515 fixed ***/
            
            var popup = new ol.Overlay({
                element: document.getElementById('route_popup')
            });
            maps[map_ind].addOverlay(popup);
            maps[map_ind].on('click', function(evt) {
                
                var feature =  maps[map_ind].forEachFeatureAtPixel(evt.pixel,
                    function(feature, layer) {
                        return feature;
                });
                if (feature != null && feature.get('name') != null ) {
                    var coordinates = feature.getGeometry().getCoordinates();
                    var name = feature.get('name').split('.flag.')[1];
                    popup.setPosition([coordinates[0], coordinates[1]]);
                    $('#route_popup').show();
                    $('#route_popup').popup({title:name, on:'click'});
                    $('#route_popup').popup('show');
                    $('#route_popup').hide();
                    $('#route_popup').attr('class', 'ui red empty circular label')
                }
                else {
                    $('#route_popup').popup('destroy');
                    $('#route_popup').hide();
                    $('#route_popup').attr('class', 'ui red empty circular label')
                }
            });
            
            
            route_line_box = new ol.layer.Vector({
                source: route_line_source
            });
			
            route_line_box.setZIndex(3);

            maps[map_ind].addLayer(route_line_box);

            route_marker_box = new ol.layer.Vector({
                source: route_marker_source
            });
            route_marker_box.setZIndex(4);
            maps[map_ind].addLayer(route_marker_box);
                
        },
        error: function(jqXHR) {
            alert("查無節點");
        }
    });
}


function clear_route() {
	if (route_line_box) {
		maps[map_ind].removeLayer(route_line_box);
		route_line_box.getSource().clear();
		route_line_source.clear();
		maps[map_ind].addLayer(route_line_box);
	}
	if (route_marker_box) {
		maps[map_ind].removeLayer(route_marker_box);
		route_marker_box.getSource().clear();
		route_marker_source.clear();
		maps[map_ind].addLayer(route_marker_box);
	}
	if (start_route_marker_box) {
		maps[map_ind].removeLayer(start_route_marker_box);
		start_route_marker_box.getSource().clear();
		start_route_marker_source.clear();
		maps[map_ind].addLayer(start_route_marker_box);
        maps[map_ind].removeInteraction(start_route_modifyInteraction);
	}
	if (end_route_marker_box) {
		maps[map_ind].removeLayer(end_route_marker_box);
		end_route_marker_box.getSource().clear();
		end_route_marker_source.clear();
		maps[map_ind].addLayer(end_route_marker_box);
        maps[map_ind].removeInteraction(end_route_modifyInteraction);
	}
}
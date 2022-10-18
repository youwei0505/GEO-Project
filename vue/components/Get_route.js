var prev_route_marker = '';
var prev_route_iconStyle = '';
var prev_route_item = '';
var not_map_click_change = 0;
Vue.component('Land_1_9', {
    props:  {
        maps: null,
        map_ind: null,
		fun_slug: { type: String, default: 'Func_Use_Land_1_9' }
    },
    data: function () {
        return {
            web_url : '',
            route_start_pos :'120.63448,24.1534566',
            route_end_pos :'120.66591498,24.15608765',
            route_opt :'length',
            route_traffic :'car',
            start_marker : '',
            end_marker : '',
            route_line_source : '',
            route_line_box : '',
            route_marker_source : '',
            route_marker_box : '',
            start_route_marker_source : '',
            start_route_marker_box : '',
            end_route_marker_source : '',
            end_route_marker_box : '',
            start_route_modifyInteraction : '',
            end_route_modifyInteraction : '',
    
            // prev_route_marker : '',
            // prev_route_iconStyle : '',
            // prev_route_item : '',
            // not_map_click_change : 0
        }
    }, 
	// created: function () {
    //     route_line_source = "";
    //     route_line_box = "";
    //     route_marker_source = "";
    //     route_marker_box = "";
	// },
    mounted: function () {
        this.$nextTick(function () {
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
    },
	methods: {
        createMarker(location, style){
            let iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(location)
            });
            iconFeature.setStyle(style);
    
            return iconFeature
        },
		clear_map_for_route() {
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
        },

        start_route_makeMovable(feature) {
            let modify = new ol.interaction.Modify({
                features: new ol.Collection([feature])
            });
            const that = this;
            modify.on('modifyend', function(e) {
                let c = ol.proj.transform(e.features.getArray()[0].getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
                // $("#route_start_pos").val(c[0].toString() + ',' + c[1].toString());
                that.route_start_pos = c[0].toString() + ',' + c[1].toString();
            })
            
            return modify;
        },

        end_route_makeMovable(feature) {
            let modify = new ol.interaction.Modify({
                features: new ol.Collection([feature])
            });
            const that = this;
            modify.on('modifyend', function(e) {
                let c = ol.proj.transform(e.features.getArray()[0].getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
                // $("#route_end_pos").val(c[0].toString() + ',' + c[1].toString());
                that.route_end_pos = c[0].toString() + ',' + c[1].toString();
            })
            
            return modify;
        },

        set_route_start(loc) {
            if (loc != "目前位置未取得坐標資訊") {
                loc = loc.replace(' ', '');
                // $("#route_start_pos").val(loc);
                this.route_start_pos = loc;
                
                loc_arr = loc.split(',')
                
                let iconStyle = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({color: [187, 255, 255]}),
                        stroke: new ol.style.Stroke({
                            color: [0, 0, 0], width: 1
                        })
                    })
                });
                if (this.start_marker == "") {
                    console.log(ol.proj.transform([parseFloat(loc_arr[0]), parseFloat(loc_arr[1])], 'EPSG:4326', 'EPSG:3857'))
                    this.start_marker = this.createMarker( ol.proj.transform([parseFloat(loc_arr[0]), parseFloat(loc_arr[1])], 'EPSG:4326', 'EPSG:3857'), iconStyle);
                    this.start_route_marker_source = new ol.source.Vector({wrapX: false});
                    this.start_route_marker_source.addFeature(this.start_marker);	
                    
                    this.start_route_marker_box = new ol.layer.Vector({
                        source: this.start_route_marker_source
                    });
                    this.start_route_marker_box.setZIndex(4);
                    maps[map_ind].addLayer(this.start_route_marker_box);
                    
                    this.start_route_modifyInteraction = this.start_route_makeMovable(this.start_marker);
                    maps[map_ind].addInteraction(this.start_route_modifyInteraction);
                }
                else {
                    this.start_marker = this.createMarker( ol.proj.transform([parseFloat(loc_arr[0]), parseFloat(loc_arr[1])], 'EPSG:4326', 'EPSG:3857'), iconStyle);
                    this.start_route_marker_box.getSource().clear();
                    this.start_route_marker_source.clear();
                    maps[map_ind].removeInteraction(this.start_route_modifyInteraction);
                    
                    this.start_route_marker_source.addFeature(this.start_marker);	
                    
                    this.start_route_marker_box.setSource(this.start_route_marker_source);
                    
                    this.start_route_modifyInteraction = this.start_route_makeMovable(this.start_marker);
                    maps[map_ind].addInteraction(this.start_route_modifyInteraction);
                }
            } else {
                alert('未取得坐標資訊，請再試一次')
            }
        },
        
        set_route_end(loc) {
            if (loc != "目前位置未取得坐標資訊") {
                loc = loc.replace(' ', '');
                // $("#route_end_pos").val(loc);
                this.route_end_pos = loc;

                loc_arr = loc.split(',')
                
                let iconStyle = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({color: [187, 255, 255]}),
                        stroke: new ol.style.Stroke({
                            color: [0, 0, 0], width: 1
                        })
                    })
                });
                
                if (this.end_marker == "") {
                    this.end_marker = this.createMarker( ol.proj.transform([parseFloat(loc_arr[0]), parseFloat(loc_arr[1])], 'EPSG:4326', 'EPSG:3857'), iconStyle);
                    this.end_route_marker_source = new ol.source.Vector({wrapX: false});
                    this.end_route_marker_source.addFeature(this.end_marker);	
                    
                    this.end_route_marker_box = new ol.layer.Vector({
                        source: this.end_route_marker_source
                    });
                    this.end_route_marker_box.setZIndex(4);
                    maps[map_ind].addLayer(this.end_route_marker_box);
                    
                    this.end_route_modifyInteraction = this.end_route_makeMovable(this.end_marker);
                    maps[map_ind].addInteraction(this.end_route_modifyInteraction);
                }
                else {
                    this.end_marker = this.createMarker( ol.proj.transform([parseFloat(loc_arr[0]), parseFloat(loc_arr[1])], 'EPSG:4326', 'EPSG:3857'), iconStyle);
                    this.end_route_marker_box.getSource().clear();
                    this.end_route_marker_source.clear();
                    maps[map_ind].removeInteraction(this.end_route_modifyInteraction);
                    
                    this.end_route_marker_source.addFeature(this.end_marker);	
                    
                    this.end_route_marker_box.setSource(this.end_route_marker_source);
                    
                    this.end_route_modifyInteraction = this.end_route_makeMovable(this.end_marker);
                    maps[map_ind].addInteraction(this.end_route_modifyInteraction);
                }
            } else {
                alert('未取得坐標資訊，請再試一次')
            }
        },

        get_route_start() {
            document.getElementById("space_lonlat").checked = true;
            
            this.clear_map_for_route();
            
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
            

            
            const that = this;
            draw_box.on('drawend',
                function (e) {
                    let format = new ol.format.WKT();
                    wkt = format.writeGeometry(e.feature.getGeometry());
                    coor = e.feature.getGeometry().getCoordinates();
                    //抓起點、終點坐標
                    Coord = e.feature.getGeometry().getFirstCoordinate();
                             
                    array=String(Coord).split(",");
                    start_84=ol.proj.transform([array[0],array[1]], 'EPSG:3857', 'EPSG:4326');
                        
                    // start_pos = $("#route_start_pos").val(start_84[0] + ',' + start_84[1]);
                    start_pos = that.route_start_pos = start_84[0] + ',' + start_84[1];
                    maps[map_ind].removeInteraction(draw_box);
                    
                    this.set_route_start(start_84[0] + ',' + start_84[1])
        /*** 20190515 fixed ***/
                    btn_enable();
                maps[map_ind].removeLayer(vector_box);
                vector_box.getSource().clear();
                source_box.clear();
        /*** 20190515 fixed ***/
                }, this);
        },
        
        get_route_end() {
            document.getElementById("space_lonlat").checked = true;
            
            this.clear_map_for_route();
            
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
            const that = this;
            draw_box.on('drawend',
                function (e) {
                    let format = new ol.format.WKT();
                    wkt = format.writeGeometry(e.feature.getGeometry());
                    coor = e.feature.getGeometry().getCoordinates();
                    //抓起點、終點坐標
                    Coord = e.feature.getGeometry().getFirstCoordinate();
                             
                    array=String(Coord).split(",");
                    start_84=ol.proj.transform([array[0],array[1]], 'EPSG:3857', 'EPSG:4326');
                        
                    // start_pos = $("#route_end_pos").val(start_84[0] + ',' + start_84[1]);
                    start_pos = that.route_end_pos = start_84[0] + ',' + start_84[1];
                    maps[map_ind].removeInteraction(draw_box);
                    this.set_route_end(start_84[0] + ',' + start_84[1])
        /*** 20190515 fixed ***/
                    btn_enable();
                maps[map_ind].removeLayer(vector_box);
                vector_box.getSource().clear();
                source_box.clear();
        /*** 20190515 fixed ***/
                }, this);
                
        },

        set_route_pos(lng, lat) {
            not_map_click_change = 1;
            if(prev_route_item != "") {
                // prev_route_item.css('background-color', '#FFFFFF')
                prev_route_item.style.backgroundColor = '#FFFFFF';
            }
            // $('#' + lng.toString().replace('.', '') + lat.toString().replace('.', '')).css('background-color', '#FFB2BD')
            // prev_route_item = $('#' + lng.toString().replace('.', '') + lat.toString().replace('.', ''))
            //document.getElementById(lng.toString().replace('.', '') + lat.toString().replace('.', '')).style.color = '#FFB2BD';
            prev_route_item = document.getElementById(lng.toString().replace('.', '') + lat.toString().replace('.', ''))
            prev_route_item.style.backgroundColor = '#FFB2BD';

            console.log(lng.toString().replace('.', '') + lat.toString().replace('.', ''));
            
            maps[map_ind].getView().setCenter(ol.proj.transform([lng, lat], "EPSG:4326", "EPSG:3857"));
            maps[map_ind].getView().setZoom(20);
            
            if(street_view_index==1) {        
                /***** show street view *****/
                sv.getPanorama({location: {lat:lat, lng:lng}, radius: 50}, processSVData);
            }
            console.log(this.route_marker_box.getSource().getFeatureById(lng + ',' + lat).getGeometry().getCoordinates())
            console.log(this.route_marker_box.getSource().getFeatureById(lng + ',' + lat))
            let cur_route_iconStyle = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({color: [255, 50, 48]}),
                    stroke: new ol.style.Stroke({
                        color: [0, 0, 0], width: 1
                    })
                })
            });
            let cur_route_marker = this.route_marker_box.getSource().getFeatureById(lng + ',' + lat)
            console.log(cur_route_marker)
            if (prev_route_marker != "")
                prev_route_marker.setStyle(prev_route_iconStyle)
            prev_route_iconStyle = cur_route_marker.getStyle();
            cur_route_marker.setStyle(cur_route_iconStyle)
            prev_route_marker = this.route_marker_box.getSource().getFeatureById(lng + ',' + lat)
            street_view_position = {lat:lat, lng: lng}
        },

        get_route(){
            fun_access_log("Func_Use_Location_1_6");
            document.getElementById("space_lonlat").checked = true;
        
            this.clear_map();
            this.clear_route();
            
            createMeasureTooltip();  
            
            if (this.route_opt == "length")
                this.web_url = "https://api.nlsc.gov.tw/other/RoutesQueryByDist/";
            else
                this.web_url = "https://api.nlsc.gov.tw/other/RoutesQueryByTime/"
            start_pos = this.route_start_pos;
            end_pos = this.route_end_pos;
            traffic = this.route_traffic;




            const that=this; 
				//send data
            axios.get('php/SendAPIReq.php', {
                    params: {
                        u : this.web_url + parseFloat(start_pos.split(',')[0]) + ',' + parseFloat(start_pos.split(',')[1]) + '/' + parseFloat(end_pos.split(',')[0]) + ',' + parseFloat(end_pos.split(',')[1]) + '/' + traffic + '/json'
                    }
                })
                .then( function(json) {
                    /*** 20190515 fixed ***/
                    let route_inner_html = ""
                    /*** 20190515 fixed ***/
                    let marker
                    that.route_line_source = new ol.source.Vector({wrapX: false});
                    that.route_marker_source = new ol.source.Vector({wrapX: false});
                    for(let j = 0; j < json.data.features.length; j++){
                        coors = json.data.features[j].geometry.coordinates
                        let loca = json.data.features[j].properties
                        /*** 20190515 fixed ***/
                        route_inner_html = route_inner_html + '\
                        <div class="item" onclick = vue_get_route.$refs.foo.set_route_pos(' + coors[0][0] + ',' + coors[0][1] + ') id="' + coors[0][0].toString().replace('.', '') + coors[0][1].toString().replace('.', '') + '"> \
                            <div class="content"> \
                                <div class="header">' + loca.road + '</div> \
                                ' + loca.turnDirection + ' ' + loca.distance.toString() + 'm' +'\
                            </div> \
                        </div>'
                        /*** 20190515 fixed ***/
                        let iconStyle = new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 7,
                                fill: new ol.style.Fill({color: [187, 255, 255]}),
                                stroke: new ol.style.Stroke({
                                    color: [0, 0, 0], width: 1
                                })
                            })
                        });
                        if (j == 0) {
                            marker = that.createMarker(ol.proj.transform([coors[0][0], coors[0][1]], 'EPSG:4326', 'EPSG:3857'), iconStyle);
                            marker.set('name', 'route.flag.' + loca.road + ' ' + loca.turnDirection + ' ' + loca.distance.toString() + 'm');
                            marker.setId(coors[0][0] + ',' + coors[0][1]);
                        }
                        else {
                            marker = that.createMarker(ol.proj.transform([coors[0][0], coors[0][1]], 'EPSG:4326', 'EPSG:3857'));
                            marker.set('name', 'route.flag.' + loca.road + ' ' + loca.turnDirection + ' ' + loca.distance.toString() + 'm');
                            marker.setId(coors[0][0] + ',' + coors[0][1]);
                        }
                        that.route_marker_source.addFeature(marker);	
                        
                        for(let i = 0; i < coors.length - 1; i++) {
                            coor = coors[i];
                            coor2 = coors[i+1];
                            let start_point = ol.proj.transform([parseFloat(coor[0]), parseFloat(coor[1])], 'EPSG:4326', 'EPSG:3857')
                            let end_point = ol.proj.transform([parseFloat(coor2[0]), parseFloat(coor2[1])], 'EPSG:4326', 'EPSG:3857')
                            let points = [start_point, end_point]
                            let featureLine = new ol.Feature({
                                geometry: new ol.geom.LineString(points)
                            });
                            that.route_line_source.addFeature(featureLine);
                            
                            if (j == json.data.features.length - 1 && i == coors.length - 2) {
                                
                                let iconStyle = new ol.style.Style({
                                    image: new ol.style.Circle({
                                        radius: 7,
                                        fill: new ol.style.Fill({color: [187, 255, 255]}),
                                        stroke: new ol.style.Stroke({
                                            color: [0, 0, 0], width: 1
                                        })
                                    })
                                });
                                marker = that.createMarker(ol.proj.transform([coor2[0], coor2[1]], 'EPSG:4326', 'EPSG:3857'), iconStyle);
                                marker.setId(coor2[0][0] + ',' + coor2[0][1]);
                                
                                that.route_marker_source.addFeature(marker);
                            }
                            
                        }
                    }
                    /*** 20190515 fixed ***/

                    //  $('#route_view_list').html(route_inner_html)
                    let route_view_list = document.getElementById('route_view_list');
                    console.log(route_view_list);
                    route_view_list.innerHTML = route_inner_html;
                    route_view_win.show();
                    /*** 20190515 fixed ***/
                    const container = document.getElementById('popup');
                    const content = document.getElementById('popup-content');
                    const closer = document.getElementById('popup-closer');
                    
                    let popup = new ol.Overlay({
                        element: container
                    });

                    closer.onclick = function () {
                        popup.setPosition(undefined);
                        closer.blur();
                        return false;
                    };

                    maps[map_ind].addOverlay(popup);
                    maps[map_ind].on('click', function(evt) {
                        
                        let feature =  maps[map_ind].forEachFeatureAtPixel(evt.pixel,
                            function(feature, layer) {
                                return feature;
                        });
                        if (feature != null && feature.get('name') != null ) {
                            let coordinates = feature.getGeometry().getCoordinates();
                            let name = feature.get('name').split('.flag.')[1];
                            popup.setPosition([coordinates[0], coordinates[1]]);
                            content.innerHTML = '<p>' + name + '</p>';
                            // popup.show([coordinates[0], coordinates[1]],'<div><h2>Coordinates</h2><p>' + name+ '</p></div>');
                            // $('#route_popup').show();
                            // $('#route_popup').popup({title:name, on:'click'});
                            // $('#route_popup').popup('show');
                            // $('#route_popup').hide();
                            // $('#route_popup').attr('class', 'ui red empty circular label')
                        }
                        else {
                            // $('#route_popup').popup('destroy');
                            // $('#route_popup').hide();
                            // $('#route_popup').attr('class', 'ui red empty circular label')
                        }
                    });
                    
                    
                    that.route_line_box = new ol.layer.Vector({
                        source: that.route_line_source
                    });
                    
                    that.route_line_box.setZIndex(3);
        
                    maps[map_ind].addLayer(that.route_line_box);
        
                    that.route_marker_box = new ol.layer.Vector({
                        source: that.route_marker_source
                    });
                    that.route_marker_box.setZIndex(4);
                    maps[map_ind].addLayer(that.route_marker_box);

                })
                .catch( function(error) {
                    alert("查無節點");
                });
            
        
        //     $.ajax({
        //         type: 	"GET",
        //         url:	"php/SendAPIReq.php",
        //         dataType:	"json",
        //         data: {
        //         /*** 20190515 fixed ***/
        //             u : web_url + parseFloat(start_pos.split(',')[0]) + ',' + parseFloat(start_pos.split(',')[1]) + '/' + parseFloat(end_pos.split(',')[0]) + ',' + parseFloat(end_pos.split(',')[1]) + '/' + traffic + '/json'
        //         /*** 20190515 fixed ***/
        //         },
        //         success: function(data) {
        //             /*** 20190515 fixed ***/
        //             let route_inner_html = ""
        //             /*** 20190515 fixed ***/
        //             let marker
        //             that.route_line_source = new ol.source.Vector({wrapX: false});
        //             that.route_marker_source = new ol.source.Vector({wrapX: false});
        //             for(let j = 0; j < data.features.length; j++){
        //                 coors = data.features[j].geometry.coordinates
        //                 let loca = data.features[j].properties
        //                 /*** 20190515 fixed ***/
        //                 route_inner_html = route_inner_html + '\
        //                 <div class="item" @click = set_route_pos(' + coors[0][0] + ',' + coors[0][1] + ') id="' + coors[0][0].toString().replace('.', '') + coors[0][1].toString().replace('.', '') + '"> \
        //                     <div class="content"> \
        //                         <div class="header">' + loca.road + '</div> \
        //                         ' + loca.turnDirection + ' ' + loca.distance.toString() + 'm' +'\
        //                     </div> \
        //                 </div>'
        //                 /*** 20190515 fixed ***/
        //                 let iconStyle = new ol.style.Style({
        //                     image: new ol.style.Circle({
        //                         radius: 7,
        //                         fill: new ol.style.Fill({color: [187, 255, 255]}),
        //                         stroke: new ol.style.Stroke({
        //                             color: [0, 0, 0], width: 1
        //                         })
        //                     })
        //                 });
        //                 if (j == 0) {
        //                     marker = createMarker(ol.proj.transform([coors[0][0], coors[0][1]], 'EPSG:4326', 'EPSG:3857'), iconStyle);
        //                     marker.set('name', 'route.flag.' + loca.road + ' ' + loca.turnDirection + ' ' + loca.distance.toString() + 'm');
        //                     marker.setId(coors[0][0] + ',' + coors[0][1]);
        //                 }
        //                 else {
        //                     marker = createMarker(ol.proj.transform([coors[0][0], coors[0][1]], 'EPSG:4326', 'EPSG:3857'));
        //                     marker.set('name', 'route.flag.' + loca.road + ' ' + loca.turnDirection + ' ' + loca.distance.toString() + 'm');
        //                     marker.setId(coors[0][0] + ',' + coors[0][1]);
        //                 }
        //                 that.route_marker_source.addFeature(marker);	
                        
        //                 for(let i = 0; i < coors.length - 1; i++) {
        //                     coor = coors[i];
        //                     coor2 = coors[i+1];
        //                     let start_point = ol.proj.transform([parseFloat(coor[0]), parseFloat(coor[1])], 'EPSG:4326', 'EPSG:3857')
        //                     let end_point = ol.proj.transform([parseFloat(coor2[0]), parseFloat(coor2[1])], 'EPSG:4326', 'EPSG:3857')
        //                     let points = [start_point, end_point]
        //                     let featureLine = new ol.Feature({
        //                         geometry: new ol.geom.LineString(points)
        //                     });
        //                     that.route_line_source.addFeature(featureLine);
                            
        //                     if (j == data.features.length - 1 && i == coors.length - 2) {
                                
        //                         let iconStyle = new ol.style.Style({
        //                             image: new ol.style.Circle({
        //                                 radius: 7,
        //                                 fill: new ol.style.Fill({color: [187, 255, 255]}),
        //                                 stroke: new ol.style.Stroke({
        //                                     color: [0, 0, 0], width: 1
        //                                 })
        //                             })
        //                         });
        //                         marker = createMarker(ol.proj.transform([coor2[0], coor2[1]], 'EPSG:4326', 'EPSG:3857'), iconStyle);
        //                         marker.setId(coor2[0][0] + ',' + coor2[0][1]);
                                
        //                         that.route_marker_source.addFeature(marker);
        //                     }
                            
        //                 }
        //             }
        //             /*** 20190515 fixed ***/
        //             $('#route_view_list').html(route_inner_html)
        //             route_view_win.show();
        //             /*** 20190515 fixed ***/
                    
        //             let popup = new ol.Overlay({
        //                 element: document.getElementById('route_popup')
        //             });
        //             maps[map_ind].addOverlay(popup);
        //             maps[map_ind].on('click', function(evt) {
                        
        //                 let feature =  maps[map_ind].forEachFeatureAtPixel(evt.pixel,
        //                     function(feature, layer) {
        //                         return feature;
        //                 });
        //                 if (feature != null && feature.get('name') != null ) {
        //                     let coordinates = feature.getGeometry().getCoordinates();
        //                     let name = feature.get('name').split('.flag.')[1];
        //                     popup.setPosition([coordinates[0], coordinates[1]]);
        //                     $('#route_popup').show();
        //                     $('#route_popup').popup({title:name, on:'click'});
        //                     $('#route_popup').popup('show');
        //                     $('#route_popup').hide();
        //                     $('#route_popup').attr('class', 'ui red empty circular label')
        //                 }
        //                 else {
        //                     $('#route_popup').popup('destroy');
        //                     $('#route_popup').hide();
        //                     $('#route_popup').attr('class', 'ui red empty circular label')
        //                 }
        //             });
                    
                    
        //             that.route_line_box = new ol.layer.Vector({
        //                 source: that.route_line_source
        //             });
                    
        //             that.route_line_box.setZIndex(3);
        
        //             maps[map_ind].addLayer(that.route_line_box);
        
        //             that.route_marker_box = new ol.layer.Vector({
        //                 source: that.route_marker_source
        //             });
        //             that.route_marker_box.setZIndex(4);
        //             maps[map_ind].addLayer(that.route_marker_box);
                        
        //         },
        //         error: function(jqXHR) {
        //             alert("查無節點");
        //         }
        //     });
        },
        clear_map: function() {
            // if (line_chart) {
            //     line_chart.clear();
            //     line_chart = null;
            // }
        
            // if (path_chart) {
            //     path_chart.clear();
            //     path_chart = null;
            // }
        
            // if (draw_box) {
            //     maps[map_ind].removeInteraction(draw_box);
            // }
        
            // if (vector_box) {
            //     maps[map_ind].removeLayer(vector_box);
            //     vector_box.getSource().clear();
            //     source_box.clear();
            //     maps[map_ind].addLayer(vector_box);
            // }
        
            // if (icon_box) {
            //     maps[map_ind].removeLayer(icon_box);
            //     icon_box.getSource().clear();
            //     icon_source.clear();
            //     maps[map_ind].addLayer(icon_box);
            // }
        
            // if (aspect_draw_type != "none") {
            //     createMeasureTooltip();
            //     aspect_layer.getSource().clear();
            //     maps[map_ind].removeInteraction(aspect_draw);
            // }
            // if (slope_draw_type != "none") {
            //     createMeasureTooltip();
            //     slope_layer.getSource().clear();
            //     maps[map_ind].removeInteraction(slope_draw);
            // }
        
            // if (cluster_layer_earthquake != null) {
            //     search_option = 0;
            //     select_earthquake_or_wall = 0;
            //     maps[map_ind].removeLayer(cluster_layer_earthquake);
            //     cluster_layer_earthquake = null;
            //     document.getElementById('show_earthquake_cluster_btn').disabled = true;
            //     document.getElementById('bidirection_slider').style.display = 'none';
            //     document.getElementById('hslider').style.display = 'none';
            //     document.getElementById('bidirection_slider_time').style.display = 'none';
            //     document.getElementById('hslider_time').style.display = 'none';
        
            //     // display earthquake cluster checkbox
            //     $("#display_earthquake_checked").prop('disabled', true);
            //     document.getElementById("display_earthquake_checked").checked = false;
            //     document.getElementById('earthquake_checkbox_label').innerHTML = "開啟地震叢集"
            //     $("#show_earthquake_cluster_btn").val("隱藏叢集");
            //     $("#show_wall_cluster_btn").val("隱藏叢集");
            // }
        
            // if (cluster_layer_wall != null) {
            //     search_option = 0;
            //     select_earthquake_or_wall = 0;
            //     maps[map_ind].removeLayer(cluster_layer_wall);
            //     cluster_layer_wall = null;
            //     document.getElementById('show_wall_cluster_btn').disabled = true;
            //     document.getElementById('wall_slider_time').style.display = 'none';
            //     document.getElementById('wall_time').style.display = 'none';
            //     $("#show_earthquake_cluster_btn").val("隱藏叢集");
            //     $("#show_wall_cluster_btn").val("隱藏叢集");
            // }
        
            // if (mag_layer_content != null) {
            //     MapOverlay2(0, mag_layer_content, 0);
            //     mag_layer_content = null;
            //     mag_layer_checked = 0;
            // }
            // if (pga_layer_content != null) {
            //     MapOverlay2(0, pga_layer_content, 0);
            //     pga_layer_content = null;
            //     pga_layer_checked = 0;
            // }
            // if (pgv_layer_content != null) {
            //     MapOverlay2(0, pgv_layer_content, 0);
            //     pgv_layer_content = null;
            //     pgv_layer_checked = 0;
            // }
            // if (mag_val_layer_content != null) {
            //     select_earthquake_or_wall = 0;
            //     maps[map_ind].removeLayer(mag_val_layer_content);
            //     mag_val_layer_content = null;
            //     mag_val_layer_checked = 0;
            // }
        
        
            /*** add 1015 ***/
            btn_enable()
            /****************/
            /*** 20190330 fixed ***/
            this.clear_route();
            /*** 20190330 fixed ***/
            /*** add 20190515 ***/
            clear_var()
            /*** add 20190515 ***/
        
        
            createMeasureTooltip();
        },

        clear_route: function() {
            if (this.route_line_box) {
                maps[map_ind].removeLayer(this.route_line_box);
                this.route_line_box.getSource().clear();
                this.route_line_source.clear();
                maps[map_ind].addLayer(this.route_line_box);
            }
            if (this.route_marker_box) {
                maps[map_ind].removeLayer(this.route_marker_box);
                this.route_marker_box.getSource().clear();
                this.route_marker_source.clear();
                maps[map_ind].addLayer(this.route_marker_box);
            }
            if (this.start_route_marker_box) {
                maps[map_ind].removeLayer(this.start_route_marker_box);
                this.start_route_marker_box.getSource().clear();
                this.start_route_marker_source.clear();
                maps[map_ind].addLayer(this.start_route_marker_box);
                maps[map_ind].removeInteraction(this.start_route_modifyInteraction);
            }
            if (this.end_route_marker_box) {
                maps[map_ind].removeLayer(this.end_route_marker_box);
                this.end_route_marker_box.getSource().clear();
                this.end_route_marker_source.clear();
                maps[map_ind].addLayer(this.end_route_marker_box);
                maps[map_ind].removeInteraction(this.end_route_modifyInteraction);
            }
        }
	},
	template: `
	<div>
                    <div class='ui secondary menu'>
                        <a class='item' data-tab='one'><img src='img/paint01.png' alt=''></a>
                        <button class='ui button' @click='clear_map'> clear </button>
                    </div>
                    <div class='ui form' id='openness_menu'>
                        <div class='eight wide field'>
                            <label>起點坐標</label>
                            <input id='route_start_pos' v-model='route_start_pos'></input>
                        </div>
                        <div class='eight wide field'>
                            <label>終點坐標</label>
                            <input id='route_end_pos' v-model='route_end_pos'></input>
                        </div>
                        <div class='eight wide field'>
                            <label>規劃優化方式</label>
                            <select id='route_opt' v-model='route_opt'>
                                <option value='length'>路徑最短</option>
                                <option value='time'>時間最短</option>
                            </select>
                        </div>
                        <div class='eight wide field'>
                            <label>交通方式</label>
                            <select id='route_traffic' v-model='route_traffic'>
                                <option value='car'>汽車</option>
                                <option value='foot'>步行</option>
                                <option value='avoid_highways'>汽車避開高速公路</option>
                            </select>
                        </div>
                    </div>
                    <div class='ui secondary menu'>
                        <button class='ui button' id='route_start_btn' @click='get_route_start'> 設定起點 </button>
                        <button class='ui button' id='route_end_btn' @click='get_route_end'> 設定終點 </button>
                        <button class='ui button' @click='get_route'> 開始規劃 </button>
                    </div>
	</div>
`
	
});
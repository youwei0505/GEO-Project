



var stlfile_area_ulimit = 50.0;
var stlfile_area_dlimit = 4.0;

var stlfile_area;
var stlfile_cmd = "";

var stlfile_web_url;
var stlfile_wkt;
var stlfile_data;



function get_stlfile(){
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
    geometryFunction = function(coordinates, geometry) {
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
		
	draw_box.on('drawstart',
        function (evt) {

			btn_disable();	
			sketch = evt.feature;

			var tooltipCoord = evt.coordinate;

			listener = sketch.getGeometry().on('change', function (evt) {
				var geom = evt.target;
				var output;
				output = formatArea(geom);
				tooltipCoord = geom.getInteriorPoint().getCoordinates();
				
				var sourceProj = maps[map_ind].getView().getProjection();
				var geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
				var coordinates = geom_t.getLinearRing(0).getCoordinates();
				stlfile_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
				
				measureTooltipElement.innerHTML = output;
				measureTooltip.setPosition(tooltipCoord);
			});

        }, this);
		
	draw_box.on('drawend',
        function (e) {
			
			
			btn_enable();	
			
			clear_map();
		 
			createMeasureTooltip();  
			
			if ( stlfile_area / 1000000 >= stlfile_area_dlimit && stlfile_area / 1000000 <= stlfile_area_ulimit ) {
				box_array=(String(e.feature.getGeometry().getExtent())).split(",");
			
				loc_84=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');
				
				left = loc_84[0];
				up = loc_84[1];
				
				loc_84=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');
				
				right = loc_84[0];
				down = loc_84[1];
				
				maps[map_ind].removeInteraction(draw_box);
				
				// 傳送資料給後端抓取圖片	
				
				stlfile_web_url = "https://dtm.moi.gov.tw/services/getstl/getstl.asmx/getStlFile"
				
				stlfile_wkt = "POLYGON((" + left + "%20" + up + "," + 
									left + "%20" + down + "," + 
									right + "%20" + down + "," + 
									right + "%20" + up + "," + 
									left + "%20" + up + "))";
				stlfile_data = $("#stlfile_data").val();
				
				stlfile_cmd = "ok"
				console.log("check")
				
			} else if ( stlfile_area / 1000000 > stlfile_area_ulimit ) {
				
				stlfile_cmd = "over"
			} else if (  stlfile_area / 1000000 < stlfile_area_dlimit  ) {
				
				stlfile_cmd = "under"
			}
        }, this);
 }
 
 function get_stlfile_data()
 {
	 if ( stlfile_cmd === "ok" ) {
		 loading_id = "l"+stlfile_num.toString();
				
		stlfile_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
		
		
		$.ajax({
			type: 	"GET",
			url:	"php/get_stlfile.php",
			dataType:	"json",
			data: {
				u : stlfile_web_url,
				// delete
				w : stlfile_wkt,
				d : stlfile_data
			},
			success: function(json) {
				
				// create image layer
				
				if ( json.getData == true ) {
					
					web_url = "https://dtm.moi.gov.tw/services/getstl/getstl.asmx/getStl3D"
					$.ajax({
						type: 	"GET",
						url:	"php/get_stlfile_image.php",
						dataType:	"json",
						data: {
							u : stlfile_web_url,
							// delete
							w : stlfile_wkt,
							d : stlfile_data
						},
						success: function(stlimage) {
							
							if ( stlimage.getData == true ) {
					
								stlfile_arr.push(json.stlfile);
								stlimage_arr.push(stlimage.stlfile);
								
								stlfile_num = stlfile_num + 1;
								
								new_node_id = stlfile_num.toString();
									
								// delete loading signal

								stlfile_Tree.deleteItem(loading_id, false);
									
								// layer item
								
								stlfile_Tree.insertNewChild("0", new_node_id, "高程立體透視圖" + stlfile_num.toString(), function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								// download item
								
								stlfile_Tree.insertNewItem(new_node_id, "d" + stlfile_num.toString(), "下載 .stl 檔", 
															function(){ 
																var idn = this.id.split("d");
																document.getElementById("download_iframe").src = stlfile_arr[idn[1] - 1];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								stlfile_Tree.insertNewItem(new_node_id, "e" + stlfile_num.toString(), "下載 .png 檔", 
															function(){ 
																var idn = this.id.split("e");
																window.open(stlimage_arr[idn[1] - 1], "_blank");
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
															
								stlfile_Tree.showItemCheckbox("d" + stlfile_num.toString(), false);
								
								
								// Download button Default : closed
								
								stlfile_Tree.closeItem(new_node_id);
									
								// enable button
								
								btn_enable();
								
							} else {
								alert("您沒有權限使用此資料類型");
								stlfile_Tree.deleteItem(loading_id, false);
								btn_enable();
							}
						},
						error: function(jqXHR) {
							alert("error " + jqXHR.status);
							stlfile_Tree.deleteItem(loading_id, false);
							btn_enable();
						}
					});

				} else {
					alert("您沒有權限使用此資料類型");
					stlfile_Tree.deleteItem(loading_id, false);
					btn_enable();
				}
				
			},
			error: function(jqXHR) {
				alert("error " + jqXHR.status);
				stlfile_Tree.deleteItem(loading_id, false);
				btn_enable();
			}
		});
	 } else if ( stlfile_cmd === "over" ) {
		alert("請選取範圍小於 " + stlfile_area_ulimit + " 平方公里範圍進行分析!")
		 
	 } else if ( stlfile_cmd === "under" ) {
		alert("請選取範圍大於 " + stlfile_area_dlimit + " 平方公里範圍進行分析!")
		 
	 } else {
		 
		alert("尚未選擇區域或輸入有誤")
	 }
 }
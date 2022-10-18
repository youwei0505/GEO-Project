

var MCRIF_area_ulimit = 50.0;
var MCRIF_area_dlimit = 4.0;

var MCRIF_area;
var MCRIF_cmd = "";

var MCRIF_web_url;
var MCRIF_wkt;
var MCRIF_data;
var MCRIF_color;


function get_MCRIF(){
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
				MCRIF_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
				
				measureTooltipElement.innerHTML = output;
				measureTooltip.setPosition(tooltipCoord);
			});

        }, this);
		
	draw_box.on('drawend',
        function (e) {
			
			clear_map();
		 
			createMeasureTooltip(); 
					
			btn_enable();	
			
			if ( MCRIF_area / 1000000 >= MCRIF_area_dlimit && MCRIF_area / 1000000 <= MCRIF_area_ulimit ) {
		
				box_array=(String(e.feature.getGeometry().getExtent())).split(",");
			
				loc_84=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');
				
				left = loc_84[0];
				up = loc_84[1];
				
				loc_84=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');
				
				right = loc_84[0];
				down = loc_84[1];
				
				maps[map_ind].removeInteraction(draw_box);
				
				// 傳送資料給後端抓取圖片	
				
				MCRIF_web_url = "https://dtm.moi.gov.tw/services/mcrif/mcrif.asmx/getMCRIFImg"
				
				MCRIF_wkt = "POLYGON((" + left + "%20" + up + "," + 
									left + "%20" + down + "," + 
									right + "%20" + down + "," + 
									right + "%20" + up + "," + 
									left + "%20" + up + "))";
				MCRIF_data = $("#MCRIF_data").val();
				
				MCRIF_color = $("#MCRIF_color").val();
				
				MCRIF_cmd = "ok"
				
			} else if ( MCRIF_area / 1000000 > MCRIF_area_ulimit ) {
				
				MCRIF_cmd = "over"
			} else if ( MCRIF_area / 1000000 < MCRIF_area_dlimit ) {
				
				MCRIF_cmd = "under"
			}
				
		}, this);
		
       
 }
 
 
 function get_MCRIF_data()
 {
	 
	 if ( MCRIF_cmd === "ok" ) {
	 
		btn_disable();
		
		loading_id = "l"+MCRIF_num.toString();
			
		MCRIF_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
		
		MCRIF_Tree.enableCheckBoxes(false, false);
		
		
		$.ajax({
			type: 	"GET",
			url:	"php/get_MCRIF_image.php",
			dataType:	"json",
			data: {
				u : MCRIF_web_url,
				// delete
				w : MCRIF_wkt,
				d : MCRIF_data,
				c : MCRIF_color
			},
			success: function(json) {
				
				// create image layer
				
				if ( json.getData == true ) {
					
					web_url = "https://dtm.moi.gov.tw/services/mcrif/mcrif.asmx/getMCRIFStlFile"
					$.ajax({
						type: 	"GET",
						url:	"php/get_MCRIF_stl.php",
						dataType:	"json",
						data: {
							u : MCRIF_web_url,
							// delete
							w : MCRIF_wkt,
							d : MCRIF_data,
							c : MCRIF_color
						},
						success: function(stl) {
							
							if ( stl.getData == true ) {
								var res = stl.stlfile.replace("\"", "");
								res = res.replace("\"", "");
								res = res.replace("\\u0026", "&");
								MCRIFstl_arr.push(res);
								
								MCRIF_num = MCRIF_num + 1;
								
								new_node_id = ((up + down) / 2.0).toString() + ";" + ((left + right) / 2.0).toString() + ";563426;8;" + json.imageWidth.toString() + ";"
											+ json.imageHeight.toString() + ";" + left.toString() + ";" + down.toString() + ";" + right.toString() + ";" + up.toString() + "@ImageOverlay@" + json.imgFilePath;
						
									
								// delete loading signal

								MCRIF_Tree.deleteItem(loading_id, false);
								MCRIF_Tree.enableCheckBoxes(true, true);
									
								// layer item
								
								MCRIF_Tree.insertNewChild("0", new_node_id, "多色地圖" + MCRIF_num.toString(), function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
								// download item
								
								MCRIF_Tree.insertNewItem(new_node_id, "d" + MCRIF_num.toString(), "下載 .png 檔", 
															function(){ 
																var idn = this.id.split("d");
																window.open(MCRIFstl_arr[idn[1] - 1], "_blank");
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
															
								MCRIF_Tree.showItemCheckbox("d" + MCRIF_num.toString(), false);
								
								
								// Download button Default : closed
								
								MCRIF_Tree.closeItem(new_node_id);
									
								// enable button
								
								btn_enable();
								
							} else {
								alert("您沒有權限使用此資料類型");
								MCRIF_Tree.deleteItem(loading_id, false);
								btn_enable();
							}
						},
						error: function(jqXHR) {
							alert("error " + jqXHR.status);
							MCRIF_Tree.deleteItem(loading_id, false);
							btn_enable();
						}
					});

				} else {
					alert("您沒有權限使用此資料類型");
					MCRIF_Tree.deleteItem(loading_id, false);
					btn_enable();
				}
				
			},
			error: function(jqXHR) {
				alert("error " + jqXHR.status);
				MCRIF_Tree.deleteItem(loading_id, false);
				btn_enable();
			}
		});
		
		
	 } else if ( MCRIF_cmd === "over" ) {
		 
		alert("請選取範圍小於 " + MCRIF_area_ulimit + " 平方公里範圍進行分析!")
	 } else if ( MCRIF_cmd === "under" ) {
		 
		alert("請選取範圍大於 " + MCRIF_area_dlimit + " 平方公里範圍進行分析!")
	 } else {
		 
		alert("尚未選擇區域或輸入有誤")
	 }
			
 }
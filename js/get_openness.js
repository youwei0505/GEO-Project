



var openness_area_ulimit = 50.0;
var openness_area_dlimit = 4.0;

var openness_area;
var openness_cmd = "";

var openness_web_url;
var openness_wkt;
var openness_data;
var openness_radius;


function get_openness(){
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
				openness_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
				
				measureTooltipElement.innerHTML = output;
				measureTooltip.setPosition(tooltipCoord);
			});	

        }, this);
		
	draw_box.on('drawend',
        function (e) {
			
			btn_enable();
			
			clear_map();
		 
			createMeasureTooltip();  
			
			if ( openness_area / 1000000 >= openness_area_dlimit && openness_area / 1000000 <= openness_area_ulimit ) {
				box_array=(String(e.feature.getGeometry().getExtent())).split(",");
			
				loc_84=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');
				
				left = loc_84[0];
				up = loc_84[1];
				
				loc_84=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');
				
				right = loc_84[0];
				down = loc_84[1];
				
				maps[map_ind].removeInteraction(draw_box);
				
				// 傳送資料給後端抓取圖片	
				
				openness_web_url = "https://dtm.moi.gov.tw/services/openness/openness.asmx/getImageFile";
				
				openness_wkt = "POLYGON((" + left + "%20" + up + "," + 
									left + "%20" + down + "," + 
									right + "%20" + down + "," + 
									right + "%20" + up + "," + 
									left + "%20" + up + "))";
				openness_data = $("#openness_data").val();
				openness_radius = $("#openness_posneg").val() + $("#openness_radius").val();
			
				openness_cmd = "ok"
			} else if ( openness_area / 1000000 > openness_area_ulimit ) {
				
				openness_cmd = "over"
			} else if ( openness_area / 1000000 < openness_area_dlimit ) {
				
				openness_cmd = "under"
			}
			
			
        }, this);
		
       
 }
 
 function get_openness_data()
 {
	 
	 if ( openness_cmd === "ok" ) {
		 
		btn_disable();
		
		loading_id = "l"+openness_num.toString();
			
		openness_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
		
		openness_Tree.enableCheckBoxes(false, false);
		
		$.ajax({
			type: 	"GET",
			url:	"php/get_openness.php",
			dataType:	"json",
			data: {
				u : openness_web_url,
				w : openness_wkt,
				d : openness_data,
				r : openness_radius,
				/*** add 20190515 ***/
				l : (openness_num + 1)
				/*** add 20190515 ***/
				
			},
			success: function(json) {
				
				// create image layer
				
				if ( json.getData == true ) {

					
					// get .kmz file url

					openness_arr.push(json.kmz.url);
					
					openness_num = openness_num + 1;
					
					new_node_id = ((up + down) / 2.0).toString() + ";" + ((left + right) / 2.0).toString() + ";563426;8;" + json.imageWidth.toString() + ";"
											+ json.imageHeight.toString() + ";" + left.toString() + ";" + down.toString() + ";" + right.toString() + ";" + up.toString() + "@ImageOverlay@" + json.imgFilePath;
						
					// delete loading signal

					openness_Tree.deleteItem(loading_id, false);
					openness_Tree.enableCheckBoxes(true, true);
						
					// layer item
					
					openness_Tree.insertNewChild("0", new_node_id, "開闊度分析" + openness_num.toString(), function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					
					/*** add 20190515 ***/
					openness_legend_link_arr.push(json.legendFilePath);
					openness_Tree.insertNewChild(new_node_id, "o_legend" + openness_num.toString(), "開啟圖例", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					var legend_win = dhxWins.createWindow("o_legwin" + openness_num.toString(), 600, 600, json.LegendImgWidth / 3, (json.LegendImgHeight / 3 + 120));
					legend_win.setText("");
					
					legend_win.attachEvent("onClose", function(win){
						var n = parseInt(this.getId().split("o_legwin")[1])
						openness_Tree.setCheck("o_legend" + n.toString(), false);
						//this.close();
						this.hide();
					});
					
					dhxWins.window("o_legwin" + openness_num.toString()).button("minmax").hide();
					dhxWins.window("o_legwin" + openness_num.toString()).button("park").hide();
					
					legend_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
								  "<div style='align: center; height:100%;width:100%;'>" + 
								  "<p style='text-align: center; font-size:8px;width:100%;' >開闊度分析" + openness_num.toString() + "</p>" + 
								  "<br><img src='" + json.legendFilePath + "' style='align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
					legend_win.attachHTMLString(legend_html)
					
					legend_win.hide()
					openness_Tree.showItemCheckbox("o_legwin" + openness_num.toString(), false);
					openness_legwin_link_arr.push(legend_win);
					/*** add 20190515 ***/	
					
					// download item
					
					openness_Tree.insertNewItem(new_node_id, "d" + openness_num.toString(), "下載 .kmz 檔", 
												function(){ 
													var idn = this.id.split("d");
													document.getElementById("download_iframe").src = openness_arr[idn[1] - 1];
												}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
												
					openness_Tree.showItemCheckbox("d" + openness_num.toString(), false);
					
					
					// Download button Default : closed
					
					openness_Tree.closeItem(new_node_id);
						
					// enable button
					
					btn_enable();

				} else {
					alert("您沒有權限使用此資料類型");
					openness_Tree.deleteItem(loading_id, false);
					btn_enable();
				}
				
			},
			error: function(jqXHR) {
				alert("error " + jqXHR.status);
				openness_Tree.deleteItem(loading_id, false);
				btn_enable();
			}
		});
	 } else if ( openness_cmd === "over" ) {
		
		alert("請選取範圍小於 " + openness_area_ulimit + " 平方公里範圍進行分析!")
	} else if ( openness_cmd === "under" ) {
		
		alert("請選取範圍大於 " + openness_area_dlimit + " 平方公里範圍進行分析!")
	} else {
		
		alert("尚未選擇區域或輸入有誤")
	}
 }

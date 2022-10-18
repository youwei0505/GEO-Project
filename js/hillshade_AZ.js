/*
 *  主要功能：畫出選取範圍並取得八方位陰影圖
 */

//1.宣告選取範圍上限(hillshadeAZ_area_ulimit)、下限(hillshadeAZ_area_dlimit)
var hillshadeAZ_area_ulimit = 50.0;
var hillshadeAZ_area_dlimit = 4.0;

var hillshadeAZ_area;
var hillshadeAZ_cmd = "";

var hillshadeAZ_web_url;
var hillshadeAZ_wkt;
var hillshadeAZ_data;
var hillshadeAZ_angle;

//2.畫出選取範圍
function get_squrepointAZ(){
	document.getElementById("space_lonlat").checked = true;
	
	clear_map();  //initialize
	
	createMeasureTooltip();  
 
 	//create box
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

	// listener for start drawing	
	draw_box.on('drawstart',
        function (evt) {

			btn_disable();
			sketch = evt.feature;

			var tooltipCoord = evt.coordinate;

			// listener for mouse event(changing the position)
			listener = sketch.getGeometry().on('change', function (evt) {
				var geom = evt.target;
				var output;
				output = formatArea(geom);  //calculate the area
				tooltipCoord = geom.getInteriorPoint().getCoordinates();
				
				//convert the coordinate
				var sourceProj = maps[map_ind].getView().getProjection();
				var geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
				var coordinates = geom_t.getLinearRing(0).getCoordinates();
				hillshadeAZ_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));  // calculate the area after convert the coordinate
				
				measureTooltipElement.innerHTML = output;
				measureTooltip.setPosition(tooltipCoord);
			});			
        }, this);	
		
	// listener for the end of drawing	
	draw_box.on('drawend',
        function (e) {		
				
			clear_map();
		 
			createMeasureTooltip();  
			
			btn_enable();
			
			if ( hillshadeAZ_area / 1000000 <= hillshadeAZ_area_ulimit && hillshadeAZ_area / 1000000 >= hillshadeAZ_area_dlimit ) {
			
				box_array=(String(e.feature.getGeometry().getExtent())).split(",");  // return [minx, miny, maxx, maxy]
			
				//convert the coordinate
				loc_84=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');				
				left = loc_84[0];
				up = loc_84[1];
				
				loc_84=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');				
				right = loc_84[0];
				down = loc_84[1];
				
				maps[map_ind].removeInteraction(draw_box);			
				
				// set the data to send
				hillshadeAZ_web_url = "https://dtm.moi.gov.tw/services/hillshadeAz/hillshadeAz.asmx/getImageFile";
				hillshadeAZ_wkt = "POLYGON((" + left + "%20" + up + "," + 
									left + "%20" + down + "," + 
									right + "%20" + down + "," + 
									right + "%20" + up + "," + 
									left + "%20" + up + "))";
				hillshadeAZ_data = $("#hillshadeAZ_data").val();        
        		hillshadeAZ_angle = $("#hillshadeAZ_angle").val();
				hillshadeAZ_cmd = "ok"
			
			} else if ( hillshadeAZ_area / 1000000 > hillshadeAZ_area_ulimit ) {
				
				hillshadeAZ_cmd = "over"
			} else if ( hillshadeAZ_area / 1000000 < hillshadeAZ_area_dlimit ) {
				
				hillshadeAZ_cmd = "under"
			}			
        }, this);       
 }
 
//3.傳送資料給後端抓取圖片
function get_hillshadeAZ_data()
{
	if ( hillshadeAZ_cmd === "ok" ) {
		
		btn_disable();
		hillshadeAZ_angle = $("#hillshadeAZ_angle").val();
		
		// debug
		//console.log(web_url + "?apikey=" + api_key + "&wkt=" + wkt + "&angle=" + angle + "&data=" + data);
		
		//create a new node(loading signal)
		loading_id = "l"+hillshadeAZ_num.toString();		
		draw_w2_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');		
		draw_w2_Tree.enableCheckBoxes(false, false);
		
		//send data
		$.ajax({
			type: 	"GET",
			url:	"php/get_hillshadeAZ_image.php",
			dataType:	"json",
			data: {
				u : hillshadeAZ_web_url,
				w : hillshadeAZ_wkt,
				d : hillshadeAZ_data,
				l : (hillshadeAZ_num + 1),
				angle : hillshadeAZ_angle
			},
			//jsonpCallback: 'callback',
			//request success
			success: function(json) {				
				//kmz_link = json.kmz.url;
				if (json.getData == true) {	

					// get .kmz file url
					AZ_kmz_link_arr.push(json.kmz.url);

					//alert("img url : " + json.data.link);

					hillshadeAZ_num = hillshadeAZ_num + 1;
					
					new_node_id = `{
						"PosInfo":"${((up + down) / 2.0).toString() + ";" + 
									  ((left + right) / 2.0).toString() + ";563426;8;" + 
									  json.imageWidth.toString() + ";" + 
									  json.imageHeight.toString() + ";" + 
									  left.toString() + ";" + 
									  down.toString() + ";" + 
									  right.toString() + ";" + 
									  up.toString()}",
						"Type":"ImageOverlay",
						"Url":"${json.imgFilePath}",
						"ID":"hillshadeAZ${hillshadeAZ_num.toString()}_${hillshadeAZ_angle}",
						"FileName":"八方位陰影${hillshadeAZ_num.toString()}_${hillshadeAZ_angle}度"
					}`.replace(/\n|\t/g, "").trim();
					
					
					((up + down) / 2.0).toString() + ";" + ((left + right) / 2.0).toString() + ";563426;8;" + json.imageWidth.toString() + ";"
											+ json.imageHeight.toString() + ";" + left.toString() + ";" + down.toString() + ";" + right.toString() + ";" + up.toString() + "@ImageOverlay@" + json.imgFilePath;
						
					// delete loading signal
					draw_w2_Tree.deleteItem(loading_id, false);
					draw_w2_Tree.enableCheckBoxes(true, true);
						
					// layer item					
					draw_w2_Tree.insertNewChild("0", new_node_id, "八方位陰影" + hillshadeAZ_num.toString() + "_" + hillshadeAZ_angle + "度", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
										
					/*** add 20190515 ***/
					// create a new node(legend)
					AZ_legend_link_arr.push(json.legendFilePath);
					draw_w2_Tree.insertNewChild(new_node_id, "legend" + hillshadeAZ_num.toString(), "開啟圖例", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					
					// create a new window(legend)
					var legend_win = dhxWins.createWindow("legwin" + hillshadeAZ_num.toString(), 600, 600, json.LegendImgWidth / 3, (json.LegendImgHeight / 3 + 180));
					legend_win.setText("圖例");
					
					legend_win.attachEvent("onClose", function(win){
						var n = parseInt(this.getId().split("legwin")[1])
						draw_w2_Tree.setCheck("legend" + n.toString(), false);
						//this.close();
						this.hide();
					});
										
					dhxWins.window("legwin" + hillshadeAZ_num.toString()).button("minmax").hide();
					dhxWins.window("legwin" + hillshadeAZ_num.toString()).button("park").hide();
					
					legend_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
								  "<div style='align: center; height:100%;width:100%;'>" + 
								  "<p style='text-align: center; font-size:8px;width:100%;' >八方位陰影" + hillshadeAZ_num.toString() + "</p>" + 
								  "<br><img src='" + json.legendFilePath + "' style='align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
					legend_win.attachHTMLString(legend_html)
					
					legend_win.hide()
					draw_w2_Tree.showItemCheckbox("legwin" + hillshadeAZ_num.toString(), false);
					AZ_legwin_link_arr.push(legend_win);
					/*** add 20190515 ***/	

					// download item					
					draw_w2_Tree.insertNewItem(new_node_id, "d" + hillshadeAZ_num.toString(), "下載 .kmz 檔", 
												function(){ 
													var idn = this.id.split("d");
													document.getElementById("download_iframe").src = AZ_kmz_link_arr[idn[1] - 1];
												}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								
					/*** add 20190515 ***/	
					//draw_w2_Tree.showItemCheckbox("d" + hillshadeAZ_num.toString(), false);
					draw_w2_Tree.disableCheckbox("d" + hillshadeAZ_num.toString(), true);
					/*** add 20190515 ***/	
									
					// Download button Default : closed					
					draw_w2_Tree.closeItem(new_node_id);
						
					// enable button					
					btn_enable();
				} else {
					alert("您沒有權限使用此資料類型");
					draw_w2_Tree.deleteItem(loading_id, false);
					btn_enable();
				}				
			},
			//request fail
			error: function(jqXHR) {
				alert("error " + jqXHR.status);
				draw_w2_Tree.deleteItem(loading_id, false);				
				btn_enable();
			}
		});
	} else if ( hillshadeAZ_cmd === "over" ) {
		
		alert("請選取範圍小於 " + hillshadeAZ_area_ulimit + " 平方公里範圍進行分析!")
	} else if ( hillshadeAZ_cmd === "under" ) {
		
		alert("請選取範圍大於 " + hillshadeAZ_area_dlimit + " 平方公里範圍進行分析!")
	} else {
		
		alert("尚未選擇區域或輸入有誤")
	}
}
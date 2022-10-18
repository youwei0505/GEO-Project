


var cutfill_area_ulimit = 100.0;
var cutfill_area_dlimit = 0.0;

var cutfill_area;
var cutfill_cmd = "";

var cutfill_web_url_image;
var cutfill_web_url_gis;
var cutfill_web_url_cf;
var cutfill_wkt;
var cutfill_data;
var cutfill_height;
var cutfill_left;
var cutfill_right;
var cutfill_up;
var cutfill_down;
var cutfill_legend_link_arr = [];
var cutfill_legwin_link_arr = [];

function get_squrepointCF(){
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
				cutfill_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
				
				measureTooltipElement.innerHTML = output;
				measureTooltip.setPosition(tooltipCoord);
			});
			
        }, this);	
		
		
	draw_box.on('drawend',
        function (e) {
			
			
			btn_enable();
			
			clear_map();
		 
			createMeasureTooltip();  
			
			if ( cutfill_area / 1000000 >= cutfill_area_dlimit && cutfill_area / 1000000 <= cutfill_area_ulimit ) {
			
			
				box_array=(String(e.feature.getGeometry().getExtent())).split(",");
			
				loc_84=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');
				
				cutfill_left = loc_84[0];
				cutfill_up = loc_84[1];
				
				loc_84=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');
				
				cutfill_right = loc_84[0];
				cutfill_down = loc_84[1];
				
				maps[map_ind].removeInteraction(draw_box);
				
				
				
				// 傳送資料給後端抓取圖片	
				
				cutfill_web_url_image = "https://dtm.moi.gov.tw/services/cutfill/cutfill.asmx/getImage";
				cutfill_web_url_gis = "https://dtm.moi.gov.tw/services/cutfill/cutfill.asmx/getGIS";
				cutfill_web_url_cf = "https://dtm.moi.gov.tw/services/cutfill/cutfill.asmx/getCutFill";
				cutfill_wkt = "POLYGON((" + cutfill_left + "%20" + cutfill_up + "," + 
									cutfill_left + "%20" + cutfill_down + "," + 
									cutfill_right + "%20" + cutfill_down + "," + 
									cutfill_right + "%20" + cutfill_up + "," + 
									cutfill_left + "%20" + cutfill_up + "))";
				cutfill_data = $("#cutfill_data").val();
				
				
				
				cutfill_cmd = "ok"
			} else if ( cutfill_area / 1000000 > cutfill_area_ulimit ) {
				
				cutfill_cmd = "over"
			} else if ( cutfill_area / 1000000 < cutfill_area_dlimit ) {
				
				cutfill_cmd = "under"
			}
			
			
        }, this);
		
       
 }
 
function get_cutfill_data()
{
	fun_access_log("Func_Use_Analysis_1_7");
	if ( cutfill_cmd === "ok" ) {
		cutfill_height = $("#cutfill_height").val();
		btn_disable();
		
		loading_id = "l"+cutfill_num.toString();
			
		draw_w4_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
		
		draw_w4_Tree.enableCheckBoxes(false, false);
		$.ajax({
			type: 	"GET",
			url:	"php/get_cutfill_image.php",
			dataType:	"json",
			data: {
				u : cutfill_web_url_image,
				u_gis : cutfill_web_url_gis,
				u_cf :cutfill_web_url_cf,
				w : cutfill_wkt,
				d : cutfill_data,
				height : cutfill_height,
				left: cutfill_left,
				right: cutfill_right,
				up: cutfill_up,
				down: cutfill_down
			},
			//jsonpCallback: 'callback',
			success: function(json) {
				console.log(json)
				
				//kmz_link = json.kmz.url;
				
				// imgur api
				
				// create album
				
				/*
				$.ajax({
					type:	"POST",
					url:	"https://api.imgur.com/3/album",
					headers:	{
						'Authorization': 'Client-ID 8d82e759d5008bd'
					},
					data:	{
						'privacy': 'public'
					},
					dataType:	"json",
					success:	function(json){
						console.log("album id : " + json.data.id);
					},
					error:	function(jqXHR) {
					
						// error
						alert("album error : " + jqXHR.status);
					}
				});
				*/
				
				
				// upload image
				

				if ( json.getData == true ) {
					// get .zip file url

					cutfill_zip_link_arr.push(json.shapefileURL);
					cutfill_kml_link_arr.push(json.kmlURL);
					fillArea = json.fillArea;
					cutArea = json.cutArea;
					fillVolume = json.fillVolume;
					cutVolume = json.cutVolume;
					areaUnit = json.areaUnit;
					volumeUnit = json.volumeUnit;

					//alert("img url : " + json.data.link);
					
					cutfill_num = cutfill_num + 1;
					new_node_id = `{
						"PosInfo":"${((cutfill_up + cutfill_down) / 2.0).toString() + ";" + 
									 ((cutfill_left + cutfill_right) / 2.0).toString() + ";563426;8;" + 
									 json.imageWidth.toString() + ";" + 
									 json.imageHeight.toString() + ";" + 
									 cutfill_left.toString() + ";" + 
									 cutfill_down.toString() + ";" + 
									 cutfill_right.toString() + ";" + 
									 cutfill_up.toString()}",
						"Type":"ImageOverlay",
						"Url":"${json.imgFilePath}",
						"ID":"cutfill${cutfill_num.toString()}",
						"FileName":"挖填方區域影像${cutfill_num.toString()}"
					}`.replace(/\n|\t/g, "").trim();
					
										
					// delete loading signal

					draw_w4_Tree.deleteItem(loading_id, false);
					draw_w4_Tree.enableCheckBoxes(true, true);
						
					// layer item
					
					draw_w4_Tree.insertNewChild("0", new_node_id, "挖填方區域影像" + cutfill_num.toString() + "_" + cutfill_height + "公尺", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					
					
					
					draw_w4_Tree.insertNewChild(new_node_id, "cutfill_legend" + cutfill_num.toString(), "開啟圖例", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					var legend_win = dhxWins.createWindow("cutfill_legwin" + cutfill_num.toString(), 600, 600, 250, 200);
					legend_win.setText("挖填方圖例");
					
					legend_win.attachEvent("onClose", function(win){
						var n = parseInt(this.getId().split("s_legwin")[1])
						draw_w4_Tree.setCheck("cutfill_legend" + n.toString(), false);
						//this.close();
						this.hide();
					});
					
					dhxWins.window("cutfill_legwin" + cutfill_num.toString()).button("minmax").hide();
					dhxWins.window("cutfill_legwin" + cutfill_num.toString()).button("park").hide();
					
					legend_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
								  "<div style='align: center; height:100%;width:100%;'>" + 
								  "<p style='text-align: center; font-size:8px;width:100%;' >挖填方分析" + cutfill_num.toString() + "</p>" + 
								  "<br><img src='https://geodac.ncku.edu.tw/SWCB_LLGIS/cutfill_legend.png' style='align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
					legend_win.attachHTMLString(legend_html)
					
					legend_win.hide()
					draw_w4_Tree.showItemCheckbox("cutfill_legwin" + cutfill_num.toString(), false);
					cutfill_legwin_link_arr.push(legend_win);
					
					// download item
					
					/*draw_w4_Tree.insertNewItem(new_node_id, "d" + cutfill_num.toString(), "下載 .zip 檔", 
												function(){ 
													var idn = this.id.split("d");
													document.getElementById("download_iframe").src = cutfill_zip_link_arr[idn[1] - 1];
												}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');*/
												
					draw_w4_Tree.insertNewItem(new_node_id, "dk" + cutfill_num.toString(), "下載 .kmz 檔", 
												function(){ 
													var idn = this.id.split("dk");
													document.getElementById("download_iframe").src = json.kmz;//cutfill_kml_link_arr[idn[1] - 1];
												}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
										
					fillArea_str = make_thousand_num(fillArea.toString().split('.')[0]);
					cutArea_str = make_thousand_num(cutArea.toString().split('.')[0]);
					fillVolume_str = make_thousand_num(fillVolume.toString().split('.')[0]);
					cutVolume_str = make_thousand_num(cutVolume.toString().split('.')[0]);


					draw_w4_Tree.insertNewItem(new_node_id, "ds" + cutfill_num.toString(), "<table class = 'ui celled table'><tr><td>填方面積</td><td>" + fillArea_str + " " + areaUnit + "</td></tr><tr><td>挖方面積</td><td>" + cutArea_str + " " + areaUnit + "</td></tr><tr><td>填方體積</td><td>" + fillVolume_str + " " + volumeUnit + "</td></tr><tr><td>挖方體積</td><td>" + cutVolume_str + " " + volumeUnit + "</td></tr></table>", 
												function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');						
											

					// draw_w4_Tree.insertNewItem(new_node_id, "ds" + cutfill_num.toString(), "下載 .kmz 檔",
					// function () {
					// 	var idn = this.id.split("ds");
					// 	document.getElementById("download_iframe").src = json.kmz;
					// }, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
						
					
					draw_w4_Tree.showItemCheckbox("d" + cutfill_num.toString(), false);
					draw_w4_Tree.showItemCheckbox("dk" + cutfill_num.toString(), false);
					draw_w4_Tree.showItemCheckbox("ds" + cutfill_num.toString(), false);
					
					// Download button Default : closed
					
					draw_w4_Tree.closeItem(new_node_id);
						
					// enable button
					
					btn_enable();

					/* imgur api : upload image
					$.ajax({
						type:	"POST",
						url:	"https://api.imgur.com/3/image",
						headers:	{
								'Authorization': 'Client-ID 8d82e759d5008bd'
						},
						data:	{
								image: json.imageURL
						},
						dataType:	"json",
						success: 	function(json) {
							
					
						},
						error:	function(jqXHR) {
						
							// error
							alert("imgur error : " + jqXHR.status);
							draw_w4_Tree.deleteItem(loading_id, false);
							btn_enable();	
						}
					});
					*/

				} else {
					alert("您沒有權限使用此資料類型");
					draw_w4_Tree.deleteItem(loading_id, false);
					btn_enable();
				}
				
			},
			error: function(jqXHR) {
				alert("error " + jqXHR.status);
				draw_w4_Tree.deleteItem(loading_id, false);
				btn_enable();
			}
		});
	} else if ( cutfill_cmd === "over" ) {
		
		alert("請選取範圍小於 " + cutfill_area_ulimit + " 平方公里範圍進行分析!")
	} else if ( cutfill_cmd === "under" ) {
		
		alert("請選取範圍大於 " + cutfill_area_dlimit + " 平方公里範圍進行分析!")
	} else {
		
		alert("尚未選擇區域或輸入有誤")
	}
}


function make_thousand_num(input_str){
	let input_length = input_str.length;
	let return_arr = new Array();
	let counter = 1;
	for(let i=input_length-1; i>=0; --i){
		return_arr.push(input_str[i]);
		if(counter%3 == 0 && i != 0){
			return_arr.push(",");
			counter = 0;
		}
		counter++;
	}

	return_str = ''
	for(let j=return_arr.length-1; j>=0; --j){
		return_str += return_arr[j]
	}

	return return_str;
}



var cutfillL_cmd = "";

var cutfillL_web_url;
var cutfillL_wkt;
var cutfillL_data;
var cutfillL_height;

function get_linepointCF(){
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
			
			
			btn_enable();
			
			coor = e.feature.getGeometry().getCoordinates();
            //抓起點、終點坐標
            startCoord = e.feature.getGeometry().getFirstCoordinate();
            endCoord = e.feature.getGeometry().getLastCoordinate();
			
			
			start_array=String(startCoord).split(",");
			start_84=ol.proj.transform([start_array[0],start_array[1]], 'EPSG:3857', 'EPSG:4326');
			
			end_array=String(endCoord).split(",");
			end_84=ol.proj.transform([end_array[0],end_array[1]], 'EPSG:3857', 'EPSG:4326');
			
			maps[map_ind].removeInteraction(draw_box);
			
			
			
			// 傳送資料給後端抓取圖片	
			
			cutfillL_web_url = "https://dtm.moi.gov.tw/services/cutfill/cutfill.asmx/getProfile";
			cutfillL_wkt = "LINESTRING(" + start_84[0] + "%20" + start_84[1] + "," + 
								end_84[0] + "%20" + end_84[1] + ")";
			cutfillL_data = $("#cutfillline_data").val();
			
			cutfillL_height = $("#cutfillline_height").val();
			
			cutfillL_cmd = "ok"
        }, this);
		
       
 }
 
 
function get_cutfill_Ldata()
{
	if ( cutfillL_cmd === "ok" ) {
		
		btn_disable();
		
		$.ajax({
			type: 	"GET",
			url:	"php/get_cutfill_line.php",
			dataType:	"json",
			data: {
				u : cutfillL_web_url,
				w : cutfillL_wkt,
				d : cutfillL_data,
				height : cutfillL_height
			},
			//jsonpCallback: 'callback',
			success: function(json) {



				if ( json.getData == true ) {
					chartUrl_WE = json.chartUrl_WE;
					chartUrl_NS = json.ChartUrl_NS;
					description_WE = json.description_WE;
					description_NS = json.description_NS;

					document.getElementById("chartUrl_WE").src = json.imgFilePath1;
					document.getElementById("WE_describe").innerHTML = description_WE;
					document.getElementById("WE_link").href = chartUrl_WE;
					document.getElementById("WE_link").innerHTML = '   link';
					// enable button
					
					document.getElementById("chartUrl_NS").src = json.imgFilePath2;
					document.getElementById("NS_describe").innerHTML = description_NS;
					document.getElementById("NS_link").href = chartUrl_NS;
					document.getElementById("NS_link").innerHTML = '   link';
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
								image: json.chartUrl_WE
						},
						dataType:	"json",
						success: 	function(json) {
							

						},
						error:	function(jqXHR) {
						
							// error
							alert("imgur error : " + jqXHR.status);
							btn_enable();	
						}
					});
					
					$.ajax({
						type:	"POST",
						url:	"https://api.imgur.com/3/image",
						headers:	{
								'Authorization': 'Client-ID 8d82e759d5008bd'
						},
						data:	{
								image: json.ChartUrl_NS
						},
						dataType:	"json",
						success: 	function(json) {
							
						},
						error:	function(jqXHR) {
						
							// error
							alert("imgur error : " + jqXHR.status);
							btn_enable();	
						}
					});
					*/

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
	} else {
		
		alert("尚未選擇線段或輸入有誤")
	}
}



function get_polypointCF(){
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
	value = 'Polygon';
    var maxPoints;
	draw_box = new ol.interaction.Draw({
		source: source_box,
		type: /** @type {ol.geom.GeometryType} */ (value),
		maxPoints: maxPoints
	});
	
	/*** add 1015 ***/
	vector_box.setZIndex(draw_box_zindex);
	/****************/
		
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
			
				
				coor = e.feature.getGeometry().getCoordinates()[0];
				cutfill_wkt = "POLYGON(("
				cutfill_up = 0;
				cutfill_down = 1000;
				cutfill_left = 1000;
				cutfill_right = 0;
				for (var i = 0 ; i < coor.length; i++)
				{
					var coor_84 = ol.proj.transform([coor[i][0],coor[i][1]], 'EPSG:3857', 'EPSG:4326');
					if (i == 0)
						cutfill_wkt = cutfill_wkt + coor_84[0] + "%20" + coor_84[1];
					else
						cutfill_wkt = cutfill_wkt + "," + coor_84[0] + "%20" + coor_84[1];
					
					if (coor_84[0] > cutfill_right)
						cutfill_right = coor_84[0];
					if (coor_84[0] < cutfill_left)
						cutfill_left = coor_84[0];
					if (coor_84[1] > cutfill_up)
						cutfill_up = coor_84[1];
					if (coor_84[1] < cutfill_down)
						cutfill_down = coor_84[1];
					
				}
				cutfill_wkt = cutfill_wkt + "))";
				
				maps[map_ind].removeInteraction(draw_box);
				
				
				
				// 傳送資料給後端抓取圖片	
				cutfill_web_url_image = "https://dtm.moi.gov.tw/services/cutfill/cutfill.asmx/getImage";
				cutfill_web_url_gis = "https://dtm.moi.gov.tw/services/cutfill/cutfill.asmx/getGIS";
				cutfill_web_url_cf = "https://dtm.moi.gov.tw/services/cutfill/cutfill.asmx/getCutFill";
				cutfill_data = $("#cutfill_data").val();
				
				cutfill_height = $("#cutfill_height").val();
				cutfill_cmd = "ok"

			} else if ( cutfill_area / 1000000 > cutfill_area_ulimit ) {
				
				cutfill_cmd = "over"
			} else if ( cutfill_area / 1000000 < cutfill_area_dlimit ) {
				
				cutfill_cmd = "under"
			}
				
			
        }, this);
		
       
 }
 




// 120.5306625366211%2023.699078786492777
// 120.5306625366211%2023.61542959864113
// 120.61717987060545%2023.61542959864113
// 120.61717987060545%2023.699078786492777
// 120.5306625366211%2023.699078786492777


// 120.49495697021484%2023.671725730038133
// 120.4935836791992%2023.599070878131357
// 120.56705474853516%2023.599070878131357
// 120.56705474853516%2023.670782419042183
// 120.49495697021484%2023.671725730038133




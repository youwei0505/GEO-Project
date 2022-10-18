function point_height(long,lati){

	web_url = "https://dtm.moi.gov.tw/services/polate/polate.asmx/getPolate";
	wkt = "MULTIPOINT((" + long + "%20" + lati + "))";
	data = $('#pointheight_data').val();
	$.ajax({
		type: 	"GET",
		url:	"php/get_point_height.php",
		dataType:	"json",
		data: {
			u : web_url,
			w : wkt,
			d : data,
		},
		success: function(json) {

			if ( json.getData == true ) {
				//returnHeight(json.array);
				var str = json.array;
				var ss=str.replace(/]/g,"");
				ss=str.split(",");
				var   dd=ss[2].split("]");
				alert(dd[0]+"m");
				
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

/////////////////////////////start   do ing/////
function returnHeight(str){
	var ss=str.replace(/]/g,"");
	ss=str.split(",");

	//alert(ss[2]);
	var   dd=ss[2].split("]");
	alert(dd[0]+"m");
	//for (var i in ss) {  
    //	alert(ss[i]);      
	//}  
}




 function get_pointHeight(){
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
        	//alert("start");
            source.clear();
        }, this);
	
	draw_box.on('drawend',
        function (e) {
        	//alert("end");
            var format = new ol.format.WKT();
            wkt = format.writeGeometry(e.feature.getGeometry());
            coor = e.feature.getGeometry().getCoordinates();
            //抓起點、終點坐標
            Coord = e.feature.getGeometry().getFirstCoordinate();
         			
			array=String(Coord).split(",");
			start_84=ol.proj.transform([array[0],array[1]], 'EPSG:3857', 'EPSG:4326');
				
			point_height(start_84[0], start_84[1]);
			
			maps[map_ind].removeInteraction(draw_box);
        }, this);
       
 }
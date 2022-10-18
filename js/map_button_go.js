function get_terrain_data_go(){
	
	var canvas_png = document.getElementById('canvas_png');
	//var canvas_png_new = document.getElementById('canvas_png');
	//console.log(resize_url_new);
	
	canvas_png.setAttribute('style','transform:rotate(180deg)');
	var resize_url_new = canvas_png.toDataURL('image/png');

	
	/////////
	var h = localStorage.getItem("_sh");
	var w = localStorage.getItem("_sw");
	
	var extentMap = map.getView().calculateExtent([w,h]);
	var center = map.getView().getCenter();
	
	var bottomLeft = ol.proj.transform(ol.extent.getBottomLeft(extentMap),'EPSG:3857', 'EPSG:4326');
    var topRight = ol.proj.transform(ol.extent.getTopRight(extentMap),'EPSG:3857', 'EPSG:4326');
    var bottomRight = ol.proj.transform(ol.extent.getBottomRight(extentMap),'EPSG:3857', 'EPSG:4326');
    var topLeft  = ol.proj.transform(ol.extent.getTopLeft(extentMap),'EPSG:3857', 'EPSG:4326');
	
	left = bottomLeft[0];
	down = bottomLeft[1];
	right = topRight[0];
	up = topRight[1];
	
	//console.log(left);
	//console.log(down);
	//console.log(right);
	//console.log(up);
	
	var x1 = right;
	var x2 = left;
	var y1 = down;
	var y2 = up;
	var getInput = x1 + "/" + x2 + "/" + y1 + "/" + y2;
	localStorage.setItem("storageName", getInput);
	var show_type = 0;
	localStorage.setItem("show_type", show_type);

	
	var exp  = new Date();
	exp.setTime(exp.getTime() + 60*1000);
	document.cookie = "cookie1" + "="+ escape (x1) + ";expires=" + exp.toGMTString();
	document.cookie = "cookie2" + "="+ escape (x2) + ";expires=" + exp.toGMTString();
	document.cookie = "cookie3" + "="+ escape (y1) + ";expires=" + exp.toGMTString();
	document.cookie = "cookie4" + "="+ escape (y2) + ";expires=" + exp.toGMTString();
	
	canvas_png.style.display = "none"; //////////**************
	
	//localStorage.setItem("resize", resize_url_new);
	
	//190820
	
	if (vector_box) {
			console.log("clear");
			maps[map_ind].removeLayer(vector_box);
			vector_box.getSource().clear();
			source_box.clear();
	}
	
	clear_var();
	
	
	source_box = new ol.source.Vector({wrapX: false});
	console.log(source_box);
	vector_box = new ol.layer.Vector({
		source: source_box,
		style: new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255, 255, 255, 0.1)'
			}),
			stroke: new ol.style.Stroke({
				color: '#ffcc33',
				width: 2
			})
		})
	}); 
	
	
	document.getElementById("space_lonlat").checked = true;
			
		var convertedCoordinates = [];            
		var unformattedCoordinates = [
			ol.extent.getTopRight(extentMap),
			ol.extent.getBottomRight(extentMap),
			ol.extent.getBottomLeft(extentMap),
			ol.extent.getTopLeft(extentMap)
		];


		$(unformattedCoordinates).each(function(index, coordinate){
			var lat = coordinate[0];
			var lon = coordinate[1];

			var circle = new ol.geom.Circle([lat, lon])
			//circle.transform(wgs84Proj, origProj);

		convertedCoordinates.push(circle.getCenter());
		});

		var polygonGeometry = new ol.geom.Polygon([convertedCoordinates])
		var polygonFeature = new ol.Feature({ geometry : polygonGeometry });

		source_box.addFeature(polygonFeature);
		
		maps[map_ind].addLayer(vector_box);
		vector_box.setZIndex(draw_box_zindex);
	
	//canvas_png.setAttribute('style','transform:rotate(180deg)');
	//var resize_url_new = canvas_png.toDataURL('image/png');
	
	localStorage.setItem("resize", resize_url_new);
	//window.open("https://140.116.228.144/model_dev/LLGIS_20190816/js/3d_data/test.html");
}

function get_terrain_data_go_earthquake_and_wall(){
	
	var canvas_png = document.getElementById('canvas_png');
	//var canvas_png_new = document.getElementById('canvas_png');
	//console.log(resize_url_new);
	
	canvas_png.setAttribute('style','transform:rotate(180deg)');
	var resize_url_new = canvas_png.toDataURL('image/png');

	
	/////////
	var h = localStorage.getItem("_sh");
	var w = localStorage.getItem("_sw");
	
	var extentMap = map.getView().calculateExtent([w,h]);
	var center = map.getView().getCenter();
	
	var bottomLeft = ol.proj.transform(ol.extent.getBottomLeft(extentMap),'EPSG:3857', 'EPSG:4326');
    var topRight = ol.proj.transform(ol.extent.getTopRight(extentMap),'EPSG:3857', 'EPSG:4326');
    var bottomRight = ol.proj.transform(ol.extent.getBottomRight(extentMap),'EPSG:3857', 'EPSG:4326');
    var topLeft  = ol.proj.transform(ol.extent.getTopLeft(extentMap),'EPSG:3857', 'EPSG:4326');
	
	left = bottomLeft[0];
	down = bottomLeft[1];
	right = topRight[0];
	up = topRight[1];
	
	//console.log(left);
	//console.log(down);
	//console.log(right);
	//console.log(up);
	
	var x1 = right;
	var x2 = left;
	var y1 = down;
	var y2 = up;
	var getInput = x1 + "/" + x2 + "/" + y1 + "/" + y2;
	localStorage.setItem("storageName", getInput);
	var show_type = 0;
	localStorage.setItem("show_type", show_type);

	
	var exp  = new Date();
	exp.setTime(exp.getTime() + 60*1000);
	document.cookie = "cookie1" + "="+ escape (x1) + ";expires=" + exp.toGMTString();
	document.cookie = "cookie2" + "="+ escape (x2) + ";expires=" + exp.toGMTString();
	document.cookie = "cookie3" + "="+ escape (y1) + ";expires=" + exp.toGMTString();
	document.cookie = "cookie4" + "="+ escape (y2) + ";expires=" + exp.toGMTString();
	
	canvas_png.style.display = "none"; //////////**************
	
	//localStorage.setItem("resize", resize_url_new);
	
	//190820
	
	if (vector_box) {
			console.log("clear");
			maps[map_ind].removeLayer(vector_box);
			vector_box.getSource().clear();
			source_box.clear();
	}
	
	clear_var();
	
	
	document.getElementById("space_lonlat").checked = true;
			
		var convertedCoordinates = [];            
		var unformattedCoordinates = [
			ol.extent.getTopRight(extentMap),
			ol.extent.getBottomRight(extentMap),
			ol.extent.getBottomLeft(extentMap),
			ol.extent.getTopLeft(extentMap)
		];


		$(unformattedCoordinates).each(function(index, coordinate){
			var lat = coordinate[0];
			var lon = coordinate[1];

			var circle = new ol.geom.Circle([lat, lon])
			//circle.transform(wgs84Proj, origProj);

		convertedCoordinates.push(circle.getCenter());
		});

		localStorage.setItem("resize", resize_url_new);
}




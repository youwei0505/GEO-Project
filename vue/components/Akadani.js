Vue.component('Model_1_3', {
    props:  {
        maps: null,
        map_ind: null,
		fun_slug: { type: String, default: 'Func_Use_Model_1_3' }
    },
	data: function () {
        return {
			NNumber: 5,
			c: 20,
			fi: 25,
			gamma: 20.4,
			space: 100
        }
    },
	created: function () {
		coor1 = null;
		coor2 = null;
		h1 = 0;
		h2 = 0;
		flag1 = false;
		flag2 = false;
		flag3 = false;
		flag4 = false;
		
		// 左or右
		map_index = 0;
		// 當下底圖
		map_layer_index = 0;
		map_flag = false;
		
		// point array
		source_box_arr = [];
		vector_box_arr = [];
		source_box_line_arr = [];
		vector_box_line_arr = [];
		draw_point_arr = [];
		coor_arr = [];
		path_chart_data_arr = [];
		
		tan_chart = null;
		root = null;
		
	},
	methods: {
		test() {
			console.log("test");
			for(let i=0;i<coor_arr.length;i++) {	
				this.sc_path(coor_arr[i]);
			}
			this.show_chart();
		},
		
		drawStartPoint(){
			// access
			this.$emit('access-akadani', this.fun_slug);
			
			// draw
			
			this.clear();
			
			createMeasureTooltip();  
			
			// 更改底圖
			
			if(!map_flag) {
				map_flag = true;
				if(map_ind==1) map_layer_index = map01_layer_ind;
				else map_layer_index = map00_layer_ind;
			}
			if(map_ind==1){ 
				map_index = 1;
				
				maps[1].removeLayer(base_map_array[map01_layer_ind]);
				maps[1].addLayer(map_layer_swcb_r_5m);					
				map01_layer_ind=9;
				layer_token_get();
			}
			else {
				map_index = 0;
				
				maps[0].removeLayer(base_map_array[map00_layer_ind]);
				maps[0].addLayer(map_layer_swcb_r_5m);					
				map00_layer_ind=9;
				layer_token_get();
			}
			
			source_box_1 = new ol.source.Vector({wrapX: false});

			vector_box_1 = new ol.layer.Vector({
				source: source_box_1,
				style: new ol.style.Style({
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.2)'
					}),
					stroke: new ol.style.Stroke({
						color: '#ffcc33',
						width: 2
					}),
					// image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
						// anchor: [0.5, 46],
						// anchorXUnits: 'fraction',
						// anchorYUnits: 'pixels',
						// scale: 0.5,
						// src: 'img/marker03.png'
					// })),
					text: new ol.style.Text({
						font: "Microsoft Yahei,sans-serif",
						fill: new ol.style.Fill({ color: 'black' }),
						scale: 2.5,
						stroke: new ol.style.Stroke({color: 'yellow', width: 0.8}),
						text: "A"
					})
				})
			});
			
			// clear flag
			flag1 = true;
			
			maps[map_ind].addLayer(vector_box_1);
			
			/*** add 1015 ***/
			vector_box_1.setZIndex(draw_box_zindex);
			/****************/
			
			value = 'Point';
			maxPoints = 2;
			
			draw_start_point = new ol.interaction.Draw({
				source: source_box_1,
				type: /** @type {ol.geom.GeometryType} */ (value),
				maxPoints: maxPoints
			});
				
			maps[map_ind].addInteraction(draw_start_point);	
				
			draw_start_point.on('drawstart',
				function (evt) {
					btn_disable();	

				}, this);
				
			draw_start_point.on('drawend',
				function (e) {
					createMeasureTooltip();
					
					A_coor = e.feature.getGeometry().getCoordinates()
					coor1 = ol.proj.transform(e.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
					maps[map_ind].removeInteraction(draw_start_point);
					
					// clear flag
					flag1 = true;
					this.drawNPoint(0);
					
				}, this);
					
		},
		
		drawNPoint(N){
			source_box_arr.push(new ol.source.Vector({wrapX: false}));

			vector_box_arr.push(new ol.layer.Vector({
				source: source_box_arr.at(N),
				style: new ol.style.Style({
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.2)'
					}),
					stroke: new ol.style.Stroke({
						color: '#ffcc33',
						width: 2
					}),
					// image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
						// anchor: [0.5, 46],
						// anchorXUnits: 'fraction',
						// anchorYUnits: 'pixels',
						// scale: 0.5,
						// src: 'img/marker03.png'
					// })),
					text: new ol.style.Text({
						font: "Microsoft Yahei,sans-serif",
						fill: new ol.style.Fill({ color: 'black' }),
						scale: 2.5,
						stroke: new ol.style.Stroke({color: 'yellow', width: 0.8}),
						text: (N+1).toString()
					})
				})
			}));
			
			
			
			// clear flag
			flag1 = true;
			
			maps[map_ind].addLayer(vector_box_arr.at(N));
			
			/*** add 1015 ***/
			vector_box_arr.at(N).setZIndex(draw_box_zindex);
			/****************/
			
			value = 'Point';
			maxPoints = 2;
			
			draw_point_arr.push(new ol.interaction.Draw({
				source: source_box_arr.at(N),
				type: /** @type {ol.geom.GeometryType} */ (value),
				maxPoints: maxPoints
			}));
				
			maps[map_ind].addInteraction(draw_point_arr.at(N));	
				
			draw_point_arr.at(N).on('drawstart',
				function (evt) {
					btn_disable();	

				}, this);
				
			draw_point_arr.at(N).on('drawend',
				function (e) {
					createMeasureTooltip();
					
					coor = e.feature.getGeometry().getCoordinates()
					coor1 = ol.proj.transform(e.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
					maps[map_ind].removeInteraction(draw_point_arr.at(N));
					
					console.log(coor);
					line_coor = [A_coor, coor];
					coor_arr.push(line_coor);
					console.log(coor_arr);
					
					this.drawLine(line_coor, N)
					
					N = N+1;
					if(N<this.NNumber) this.drawNPoint(N);
					
					
				}, this);
		},
		
		drawLine(locations, N) {
			// Your loctations
			

			// OpenLayers uses [lon, lat], not [lat, lon] for coordinates
			// locations.map(function(l) {
			  // return l.reverse();
			// });

			let polyline = new ol.geom.LineString(locations);
			// Coordinates need to be in the view's projection, which is
			// 'EPSG:3857' if nothing else is configured for your ol.View instance
			//polyline.transform('EPSG:4326', 'EPSG:3857');

			let feature = new ol.Feature(polyline);
			let source = new ol.source.Vector();
			source.addFeature(feature);
			vector_box_line_arr.push(new ol.layer.Vector({
				source: source,
				style: new ol.style.Style({
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.2)'
					}),
					stroke: new ol.style.Stroke({
						color: '#ffcc33',
						width: 2
					})
				})
				  
			}));
			
			maps[map_ind].addLayer(vector_box_line_arr.at(N));
		},
		
		clear() {
			let self = this;
			clear_map();
			
			// clear array
			// point
			for(let i=0;i<source_box_arr.length;i++){
				maps[map_ind].removeLayer(vector_box_arr.at(i));
				vector_box_arr.at(i).getSource().clear();
				source_box_arr.at(i).clear();
				maps[map_ind].addLayer(vector_box_arr.at(i));
				maps[map_ind].removeInteraction(draw_point_arr.at(i));
			}
			// line
			for(let i=0;i<vector_box_line_arr.length;i++){
				maps[map_ind].removeLayer(vector_box_line_arr.at(i));
				vector_box_line_arr.at(i).getSource().clear();
				maps[map_ind].addLayer(vector_box_line_arr.at(i));
			}
			
			source_box_arr = []
			vector_box_arr = []
			draw_point_arr = []
			vector_box_line_arr = []
			
			// point array
			source_box_line_arr = [];
			coor_arr = [];
			path_chart_data_arr = [];

			
			if (flag1) {
				maps[map_ind].removeLayer(vector_box_1);
				vector_box_1.getSource().clear();
				source_box_1.clear();
				maps[map_ind].addLayer(vector_box_1);
				flag1 = false;
				maps[map_ind].removeInteraction(draw_start_point);
			}
			if (flag2) {
				maps[map_ind].removeLayer(vector_box_2);
				vector_box_2.getSource().clear();
				source_box_2.clear();
				maps[map_ind].addLayer(vector_box_2);
				flag2 = false;
				maps[map_ind].removeInteraction(draw_end_point);
			}
			if (flag3) {
				maps[map_ind].removeLayer(vector_box_3);
				vector_box_3.getSource().clear();
				source_box_3.clear();
				maps[map_ind].addLayer(vector_box_3);
				flag3 = false;
				maps[map_ind].removeInteraction(draw_box);
			}
			if (flag4) {
				maps[map_ind].removeLayer(vector_box_4);
				vector_box_4.getSource().clear();
				source_box_4.clear();
				maps[map_ind].addLayer(vector_box_4);
				flag4 = false;
				maps[map_ind].removeInteraction(draw_box);
			}
			if(map_flag) {
				map_flag = false;
				if(map_index==1){ 
					maps[1].removeLayer(base_map_array[map01_layer_ind]);
					if (map_layer_index == 0){					
						maps[1].addLayer(map_layer_gm_m);					
						map01_layer_ind=0;
					}else if(map_layer_index == 1){					
						maps[1].addLayer(map_layer_nlsc_EMAP);					
						map01_layer_ind=1;
					}else if (map_layer_index == 2){					
						maps[1].addLayer(map_layer_osm_m);					
						map01_layer_ind=2;
					}else if(map_layer_index == 3){					
						maps[1].addLayer(map_layer_gm_s);					
						map01_layer_ind=3;
					}else if(map_layer_index == 4){					
						maps[1].addLayer(map_layer_gm_y);					
						map01_layer_ind=4;
					}else if(map_layer_index == 5){					
						maps[1].addLayer(map_layer_nlsc_PHOTO2);					
						map01_layer_ind=5;
					}else if(map_layer_index == 6){
						maps[1].addLayer(map_layer_gm_p);					
						map01_layer_ind=6;
					}else if(map_layer_index == 7){					
						maps[1].addLayer(map_layer_swcb_r);					
						map01_layer_ind=7;
						layer_token_get();
					}else if(map_layer_index == 8){					
						maps[1].addLayer(map_layer_swcb_r_5m);					
						map01_layer_ind=8;
						layer_token_get();
					}else if(map_layer_index == 9){					
						maps[1].addLayer(map_layer_swcb_CS);					
						map01_layer_ind=9;
					}else if(map_layer_index == 10){					
						maps[1].addLayer(map_layer_swcb_CS_5m);					
						map01_layer_ind=10;
					}else if(map_layer_index == 11){					
						maps[1].addLayer(map_layer_aso_ATIS_base);					
						map01_layer_ind=11;
					}else if(map_layer_index == 12){
						alert("此底圖解析度較高且為WMS介接，讀取時間較為長，請耐心等候!");
						maps[1].addLayer(map_layer_aso_ATIS);					
						map01_layer_ind=12;
					}else if(map_layer_index == 13){
						//alert("此底圖為WMS介接，讀取時間較為長，請耐心等候!");
						maps[1].addLayer(map_layer_moeacgs_CGS);					
						map01_layer_ind=13;
					}else if(map_layer_index == 14){					
						maps[1].addLayer(map_layer_nlsc_PB);					
						map01_layer_ind=14;
					}else if(map_layer_index == 15){					
						maps[1].addLayer(map_layer_nlsc_LUIMAP);					
						map01_layer_ind=15;
					}else if(map_layer_index == 16){					
						maps[1].addLayer(map_layer_swcb_r_1m);					
						map01_layer_ind=16;
						layer_token_get();
					}else if(map_layer_index == 17){					
						maps[1].addLayer(map_layer_swcb_CS_1m);					
						map01_layer_ind=17;
						layer_token_get();
					}
				}
				if(map_ind==0){ 
					maps[0].removeLayer(base_map_array[map00_layer_ind]);
					if (map_layer_index == 0){					
						maps[0].addLayer(map_layer_gm_m);					
						map00_layer_ind=0;
					}else if(map_layer_index == 1){					
						maps[0].addLayer(map_layer_nlsc_EMAP);					
						map00_layer_ind=1;
					}else if(map_layer_index == 2){					
						maps[0].addLayer(map_layer_osm_m);					
						map00_layer_ind=2;
					}else if(map_layer_index == 3){					
						maps[0].addLayer(map_layer_gm_s);					
						map00_layer_ind=3;
					}else if(map_layer_index == 4){					
						maps[0].addLayer(map_layer_gm_y);					
						map00_layer_ind=4;
					}else if(map_layer_index == 5){					
						maps[0].addLayer(map_layer_nlsc_PHOTO2);					
						map00_layer_ind=5;
					}else if(map_layer_index == 6){					
						maps[0].addLayer(map_layer_gm_p);					
						map00_layer_ind=6;
					}else if(map_layer_index == 7){	
						maps[0].addLayer(map_layer_swcb_r);					
						map00_layer_ind=7;
						layer_token_get();
					}else if(map_layer_index == 8){					
						maps[0].addLayer(map_layer_swcb_r_5m);					
						map00_layer_ind=8;
						layer_token_get();
					}else if(map_layer_index == 9){					
						maps[0].addLayer(map_layer_swcb_CS);					
						map00_layer_ind=9;
					}else if(map_layer_index == 10){					
						maps[0].addLayer(map_layer_swcb_CS_5m);					
						map00_layer_ind=10;
					}else if(map_layer_index == 11){					
						maps[0].addLayer(map_layer_aso_ATIS_base);					
						map00_layer_ind=11;
					}else if(map_layer_index == 12){
						swal("切換WMS圖層", "此底圖解析度較高且為WMS介接，\n讀取時間較為長，請耐心等候!", "warning");
						//alert("此底圖解析度較高且為WMS介接，讀取時間較為長，請耐心等候!");
						maps[0].addLayer(map_layer_aso_ATIS);					
						map00_layer_ind=12;
					}else if(map_layer_index == 13){
						//swal("切換WMS圖層", "此底圖解析度較高且為WMS介接，\n讀取時間較為長，請耐心等候!", "warning");
						//alert("此底圖為WMS介接，讀取時間較為長，請耐心等候!");
						maps[0].addLayer(map_layer_moeacgs_CGS);					
						map00_layer_ind=13;
					}else if(map_layer_index == 14){					
						maps[0].addLayer(map_layer_nlsc_PB);					
						map00_layer_ind=14;
					}else if(map_layer_index == 15){					
						maps[0].addLayer(map_layer_nlsc_LUIMAP);					
						map00_layer_ind=15;
					}else if(map_layer_index == 16){					
						maps[0].addLayer(map_layer_swcb_r_1m);					
						map00_layer_ind=16;
						layer_token_get();
					}else if(map_layer_index == 17){					
						maps[0].addLayer(map_layer_swcb_CS_1m);					
						map00_layer_ind=17;
					}
				}
			}
			
			let staticTooltip = document.getElementsByClassName("tooltip-me");
			let length = staticTooltip.length;
			for(let i = 0; i < length; i++)
			{
				//staticTooltip[0].parentNode.removeChild(staticTooltip[0]);
				if (staticTooltip[0]) {
					staticTooltip[0].parentNode.removeChild(staticTooltip[0]);
				}
			}
			
			// clear amchart
			if(root){
				root.dispose();
				root = null;
			}
			
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		sc_path(coor){ //抓取API_PATH資料
			web_url = "https://dtm.moi.gov.tw/services/pathprofile/pathprofile.asmx/getPathProfile";
			data = $('#drawpath_data').val();
			stepSizeValue = this.space;

			wkt = "LINESTRING(";
			
			for (let i = 0 ; i < coor.length; i++) //抓取每個點的經緯度
			{
				coor_84 = ol.proj.transform([coor[i][0],coor[i][1]], 'EPSG:3857', 'EPSG:4326');
				if (i == 0)
					wkt = wkt + coor_84[0] + "%20" + coor_84[1];
				else
					wkt = wkt + "," + coor_84[0] + "%20" + coor_84[1];
			}

			wkt = wkt + ")";
			
			aspect_wkt = "LINESTRING(";
			
			for (let i = 0 ; i < coor.length; i++) //抓取每個點的經緯度
			{
				coor_84 = ol.proj.transform([coor[i][0],coor[i][1]], 'EPSG:3857', 'EPSG:4326');
				if (i == 0)
					aspect_wkt = aspect_wkt + coor_84[0] + " " + coor_84[1];
				else
					aspect_wkt = aspect_wkt + "," + coor_84[0] + " " + coor_84[1];
			}

			aspect_wkt = aspect_wkt + ")";
			
			$.ajax({
				async: false,
				type: 	"GET",
				url:	"php/get_path_height.php",
				dataType:	"json",
				data: {
					u : web_url,
					w : wkt,
					d : data,
					s : stepSizeValue
				},
				success: function(json) {
					
					if ( json.getData == true ) {
						
						// one of WGS84 earth radius
						let wgs84sphere = new ol.Sphere(6378137); 
						// get distance one sphere
						let d = 0;

						for (let i = 1; i < coor.length; i++) //計算整個距離長度
						{
							let p1 = ol.proj.transform([coor[i - 1][0],coor[i - 1][1]], 'EPSG:3857', 'EPSG:4326');
							let p2 = ol.proj.transform([coor[i][0],coor[i][1]], 'EPSG:3857', 'EPSG:4326');
						
							// create sphere to measure on
							let wgs84sphere = new ol.Sphere(6378137); // one of WGS84 earth radius'
							// get distance on sphere
							d = d + wgs84sphere.haversineDistance(p1, p2);
						}
						
						pArray = JSON.parse(json.array);
			
			
						for (let i = 0; i < pArray.length; i++) //最後一段用內差計算高度
						{
							if (pArray[i].m > d) {
								let inter = (pArray[i].value - pArray[i - 1].value) / (pArray[i].m - pArray[i - 1].m);
								let res = measureTooltipElement.innerHTML.split(" ");
								let scale_d;
								if (res[1] == "km") {
									scale_d = res[0] * 1000;
								} else {
									scale_d = res[0];
								}
								pArray[i].value = Math.round(((scale_d - pArray[i - 1].m) * inter) + parseFloat(pArray[i - 1].value) * 100000) / 100000;
								pArray[i].m = scale_d;
								pArray.length = i + 1;
								break;
							}
						}
						
						
						let path_slope_coor_all = coor;
						console.log(path_slope_coor_all)
						
						let path_slope_distance = [];
						
						for (let i = 1; i < path_slope_coor_all.length; i++) //計算整個距離長度
						{
							let path_slope_point1 = ol.proj.transform([path_slope_coor_all[i - 1][0],path_slope_coor_all[i - 1][1]], 'EPSG:3857', 'EPSG:4326');
							let path_slope_point2 = ol.proj.transform([path_slope_coor_all[i][0],path_slope_coor_all[i][1]], 'EPSG:3857', 'EPSG:4326');
							// create sphere to measure on
							let wgs84sphere = new ol.Sphere(6378137); // one of WGS84 earth radius'

							// get distance on sphere
							path_slope_distance[i - 1] = wgs84sphere.haversineDistance(path_slope_point1, path_slope_point2);
						}
						
						path_chart_data = []
						if ( $('#drawpath_checked').is(':checked') ) {//判斷是否要包含坡度資訊
							let slope_degree_buffer = this.get_path_slope(path_slope_distance, path_slope_coor_all, data,  Number(stepSizeValue));             
							while(slope_degree_buffer.length < pArray.length)//處理空資料
								slope_degree_buffer.push("no data")
							
							for (let i = 0; i < slope_degree_buffer.length; i++){//處理空資料
								if (slope_degree_buffer[i] == "")
									slope_degree_buffer[i] = 'no data'
							}
						  for (let i = 0; i < pArray.length; i++) //儲存excel的格式
							{
							path_chart_data.push({"水平距離(m)":pArray[i].m, '高程':pArray[i].value, '坡度(deg)':slope_degree_buffer[i]})
							
							}
						}else{
							for (let i = 0; i < pArray.length; i++) //儲存excel的格式
							{
							path_chart_data.push({"水平距離(m)":pArray[i].m, '高程':pArray[i].value,'X座標':pArray[i].x,'y座標':pArray[i].y})
							}
						}
						
						
						
						//UpdatepathChart(path_chart_data);
						path_chart_data.pop();
						path_chart_data_arr.push(path_chart_data);
						
						//this.show_chart();
						
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
		},
		show_chart() {
			console.log("testtest");
			console.log(path_chart_data_arr);
			
			///////////////////////////////////////////////////////////////////////////////////
			
			
			am5.ready(function() {

				// Create root element
				// https://www.amcharts.com/docs/v5/getting-started/#Root_element
				root = am5.Root.new("Aka_chartdiv");

				// Set themes
				// https://www.amcharts.com/docs/v5/concepts/themes/
				root.setThemes([am5themes_Animated.new(root)]);


				// Create chart
				// https://www.amcharts.com/docs/v5/charts/xy-chart/
				let chart = root.container.children.push(am5xy.XYChart.new(root, {
				  panX: true,
				  panY: true,
				  wheelX: "panX",
				  wheelY: "zoomX",
				  pinchZoomX:true
				}));


				// Add cursor
				// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
				let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
				  behavior: "none"
				}));
				cursor.lineY.set("visible", false);
				
				// transfor to tan
				for(let i=0;i<path_chart_data_arr.length;i++){
					for(let j=0;j<path_chart_data_arr[i].length;j++) {
						path_chart_data_arr[i][j]["高程差"] = path_chart_data_arr[i][j]["高程"]-path_chart_data_arr[i][0]["高程"];
					}

					for(let j=1;j<path_chart_data_arr[i].length;j++) {
						path_chart_data_arr[i][j]["tan"] = path_chart_data_arr[i][j]["高程差"]/path_chart_data_arr[i][j]["水平距離(m)"];
					}
				}

				let critical = [];

				deg = 26;
				c = vue_akadani.$children[0].c;
				fi = vue_akadani.$children[0].fi;
				gamma = vue_akadani.$children[0].gamma;
				
				console.log(c)
				console.log(fi)
				console.log(gamma)

				while(deg<80) {
					a = {};
					a["水平距離(m)"] = (4*c/gamma)*( ( Math.sin(deg/180*Math.PI) * Math.cos(fi/180*Math.PI) ) / (1 - Math.cos((deg-fi)/180*Math.PI)));
					a["tan"] = Math.tan(deg/180*Math.PI);
					critical.push(a);
					
					deg++;
				};


				// Create axes
				// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
				let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
				  renderer: am5xy.AxisRendererX.new(root, {}),
				  tooltip: am5.Tooltip.new(root, {})
				}));

				let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
				  //logarithmic: true,
				  renderer: am5xy.AxisRendererY.new(root, {})
				}));

				function createSeries(field, name, color, dashed, data) {
				  let series = chart.series.push(am5xy.LineSeries.new(root, {
					name: name,
					xAxis: xAxis,
					yAxis: yAxis,
					valueYField: field,
					valueXField: "水平距離(m)",
					//stroke: color,
					tooltip: am5.Tooltip.new(root, {
					  pointerOrientation: "horizontal",
					  getFillFromSprite: false,
					  labelText: "[bold]{name}[/]\n{valueX}: [bold]{valueY}[/]"
					})
				  }));
				  
				  /////////////////////////////////////////////////////////////////////// click event
				  series.bullets.push(function() {
					var circle = am5.Circle.new(root, {
					  radius: 5,
					  fill: series.get("fill")
					});
					circle.events.on("click", function(ev) {
					   console.log(ev.target.dataItem.dataContext);
					   
					   if (icon_box) {
							maps[map_ind].removeLayer(icon_box);
							icon_box.getSource().clear();
							icon_source.clear();
							maps[map_ind].addLayer(icon_box);
						}
						
						let iconStyle = new ol.style.Style({
							image: new ol.style.Icon({
								anchor: [0.5, 40],
								anchorXUnits: 'fraction',
								anchorYUnits: 'pixels',
								opacity: 0.75,
								src: 'https://geodac.ncku.edu.tw/SWCB_LLGIS/location.png'
							})
						});						
						coor_wgs84 = vue_akadani.$children[0].cal_TWD97_To_lonlat(Number(ev.target.dataItem.dataContext["X座標"]), Number(ev.target.dataItem.dataContext["y座標"]))
						
						plot_coor = [0, 0]
						plot_coor = ol.proj.transform(coor_wgs84, 'EPSG:4326', 'EPSG:3857');
						
						console.log("plot_coor")
						console.log(plot_coor)
						
						let icon_feature = new ol.Feature(
							new ol.geom.Point(plot_coor)
						);
						icon_feature.setStyle(iconStyle);
						
						icon_source = new ol.source.Vector({wrapX: false});
						icon_source.addFeature(icon_feature);
						
						icon_box = new ol.layer.Vector({
							source: icon_source
						});
						
						maps[map_ind].addLayer(icon_box);
						
					});
					return am5.Bullet.new(root, {
					  sprite: circle
					});
				  });
				  
				  series.get("tooltip").get("background").setAll({
					fillOpacity: 0.7,
					fill: color,
					pointerBaseWidth: 0
				  });
				  
				  series.strokes.template.setAll({
					strokeWidth: 3
				  });
				  
				  if (dashed) {
					series.strokes.template.set("strokeDasharray", [5, 3]);
				  }
				  
				  series.data.processor = am5.DataProcessor.new(root, {
					numericFields: ["水平距離(m)", "高程"]
				  });
				  
				  series.data.setAll(data);
				  series.appear(1000);
				  
				  series.events.once("datavalidated", function(ev) {
					  yAxis.setAll({
						  min: yAxis.getPrivate("min"),
						  max: 1.5,
						  start: 0,
						  end: 0.5
						});
				  });
				  
				  return series;
				}

				// add
				// createSeries("tan", "tanθ", am5.color(0x10AFAA), false, data4);
				createSeries("tan", "critical tanθ", am5.color(0xFF2D2D), false, critical);
				
				for(let i=0;i<path_chart_data_arr.length;i++) {
					createSeries("tan", (i+1).toString()+" tanθ", am5.color(0x10AFAA), false, path_chart_data_arr[i]);
				}
				
				console.log("critical")
				console.log(critical)

				let legend = chart.children.push(
				  am5.Legend.new(root, {
						// layout: am5.GridLayout.new(root, {
						// maxColumns: 3,
						// fixedWidthGrid: true
					// })
				  })
				);

				legend.data.setAll(chart.series.values);
				chart.series.events.once("datavalidated", function(ev) {
				  ev.target.get("yAxis").zoomToValues(0, 1.5);
				});

				// Scrollbar X
				var scrollbarX = am5.Scrollbar.new(root, {
				  orientation: "horizontal"
				});
				chart.set("scrollbarX", scrollbarX);
				chart.bottomAxesContainer.children.push(scrollbarX);
				
				var exporting = am5plugins_exporting.Exporting.new(root, {
				  menu: am5plugins_exporting.ExportingMenu.new(root, {}),
				  dataSource: path_chart_data_arr
				});

			}); // end am5.ready()
			
			////////////////////////////////////////////////////////////////////////////////////
		},
		cal_TWD97_To_lonlat(x, y) {
				let a = 6378137.0;
    		let b = 6356752.314245;
    		let lon0 = 121 * Math.PI / 180;
			let k0 = 0.9999;
		
					let dx = 250000
			let dy = 0;
			let e = (1- (b**2)/((a**2))) ** 0.5;

			x -= dx;
			y -= dy;

			// Calculate the Meridional Arc
			let M = y/k0;

			// Calculate Footprint Latitude
			let mu = M/(a*(1.0 - e**2/4.0 - 3*(e**4)/64.0 - 5*(e**6)/256.0));
			let e1 = (1.0 - ((1.0 - (e**2))**0.5)) / (1.0 + ((1.0 - (e**2)) ** 0.5));

			let J1 = (3*e1/2 - 27*(e1**3)/32.0);
			let J2 = (21*(e1**2)/16 - 55*(e1**4)/32.0);
			let J3 = (151*(e1**3)/96.0);
			let J4 = (1097*(e1**4)/512.0);

			let fp = mu + J1*Math.sin(2*mu) + J2*Math.sin(4*mu) + J3*Math.sin(6*mu) + J4*Math.sin(8*mu);

			// Calculate Latitude and Longitude

			let e2 = ((e*a/b)**2);
			let C1 = (e2*Math.cos(fp)**2);
			let T1 = (Math.tan(fp)**2);
			let R1 = a*(1-(e**2))/((1-(e**2)*(Math.sin(fp)**2))**(3.0/2.0));
			let N1 = a/((1-(e**2)*(Math.sin(fp)**2))**0.5);

			let D = x/(N1*k0);

			// 計算緯度
			let Q1 = N1*Math.tan(fp)/R1;
			let Q2 = (Math.pow(D, 2)/2.0);
			let Q3 = (5 + 3*T1 + 10*C1 - 4*Math.pow(C1, 2) - 9*e2)*Math.pow(D, 4)/24.0;
			let Q4 = (61 + 90*T1 + 298*C1 + 45*Math.pow(T1, 2) - 3*Math.pow(C1, 2) - 252*e2)*Math.pow(D, 6)/720.0;
			let lat = fp - Q1*(Q2 - Q3 + Q4);

			// 計算經度
			let Q5 = D;
			let Q6 = (1 + 2*T1 + C1)*Math.pow(D, 3)/6;
			let Q7 = (5 - 2*C1 + 28*T1 - 3*Math.pow(C1, 2) + 8*e2 + 24*Math.pow(T1, 2))*Math.pow(D, 5)/120.0;
			let lon = lon0 + (Q5 - Q6 + Q7)/Math.cos(fp);

			lat = (lat * 180) / Math.PI; //緯
			lon = (lon * 180) / Math.PI; //經
					console.log("lat")
					console.log(lat)
					console.log("lon")
					console.log(lon)

			coor = [lon, lat]
			return coor;
		},
		
		comment() {
			window.open("vue/components/坡面穩定曲線法(吉野-內田法)說明.pdf", "坡面穩定曲線法");
		}
	},
	template: `
	<div>
		
		
		<div class='ui form' id='drawpath_menu'>
			<div class='eight wide field'> 
				<label>數值資料</label> 
				<select id='drawpath_data'>
					<option value='TW_DLA_20010814_20061226_20M_3826'>20M TW DLA DTM (92-94年)</option>
					<option value='TW_DLA_20110101_20161101_20M_3826'>20M TW DLA DTM (99-104年)</option>
					<!-- 20190513 fixed -->
					<!--<option value='TW_DLA_20010814_20061226_5M_3826'>5M TW DLA DTM (92-94年)</option>-->
					<!-- 20190513 fixed -->
				</select> 
			</div>
			<div class='eight wide field'> 
				<label>分析格點間距(m)</label> 
				<input type='text' v-model.number="space" value=20> 
			</div> 
			<div class='eight wide field'> 
				<label>C凝聚力(KN/m2)</label> 
				<input type='text' v-model.number="c" value=20> 
			</div> 
			<div class='eight wide field'> 
				<label>φ內摩擦角(degree)</label> 
				<input type='text' v-model.number="fi" value=25> 
			</div> 
			<div class='eight wide field'> 
				<label>γ土壤單位重(kN/m3)</label> 
				<input type='text' v-model.number="gamma" value=20.4> 
			</div> 
			<div class='eight wide field'> 
				<label>N分析剖面數(上限20)</label> 
				<input type='text' v-model.number="NNumber" value=5> 
			</div> 
			<div class='eight wide field'> 
				<label>繪製剖面線</label> 
				<label>1. 於圖上點選坡趾A</label> 
				<label>2. 依序點選坡頂1~N</label> 
			</div> 
		</div>
		<div class='ui secondary menu'>
			<a class='item' data-tab='one'><img src='img/paint01.png' alt=''></a> 
			<a class='item' @click="drawStartPoint"><img src='img/paint02.png' alt=''></a>
			<button class = 'ui button' @click="clear"> clear </button>	
			<button class='ui button' @click="comment">?</button>			
		</div>
		
		<button class='ui button' @click="test">執行</button>
		
		<div id="Aka_chartdiv" ref="Aka_chartdiv"></div>
	</div>
`
	
});

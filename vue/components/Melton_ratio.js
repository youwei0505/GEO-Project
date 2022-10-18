Vue.component('Model_1_1', {
    props:  {
        maps: null,
        map_ind: null,
		fun_slug: { type: String, default: 'Func_Use_Model_1_1' }
    },
	data: function () {
        return {
			MR_msg: "",
			diff: 0,
			dis: 0,
			MR: 0
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
		MR_area = 0;
		this.MR_msg = " ";
		this.diff = " ";
		this.dis = " ";
		this.MR = " ";
		
		// 左or右
		map_index = 0;
		// 當下底圖
		map_layer_index = 0;
		map_flag = false;
		
		output_area = " ";
	},
	methods: {
		
		// 溢流點
		drawStartPoint(){
			// access
			this.$emit('access-meltonratio', this.fun_slug);
			
			// draw
			alert("請點選 關注集水區區域 溢流點位置");
			
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
				map01_layer_ind=8;
				layer_token_get();
			}
			else {
				map_index = 1;
				
				maps[0].removeLayer(base_map_array[map00_layer_ind]);
				maps[0].addLayer(map_layer_swcb_r_5m);					
				map00_layer_ind=8;
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
					image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
						anchor: [0.5, 46],
						anchorXUnits: 'fraction',
						anchorYUnits: 'pixels',
						scale: 0.5,
						src: 'img/marker03.png'
					})),
					text: new ol.style.Text({
						font: "Microsoft Yahei,sans-serif",
						fill: new ol.style.Fill({ color: 'green' }),
						scale: 2.5,
						stroke: new ol.style.Stroke({color: 'yellow', width: 0.8}),
						text: "溢流點"
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
					
					ori_coor = e.feature.getGeometry().getCoordinates()
					coor1 = ol.proj.transform(e.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
					maps[map_ind].removeInteraction(draw_start_point);
					this.getTerr(coor1, 1);
					
					// clear flag
					flag1 = true;
					this.drawPolygon();
				}, this);
		},
		
		// 最高點
		drawEndPoint(){
			// draw
			alert("請點選 關注集水區區域 最高點位置");
			
			// 更改底圖
			if(map_ind==1){ 
				map_index = 1;
				maps[1].removeLayer(base_map_array[map01_layer_ind]);
				maps[1].addLayer(map_layer_nlsc_EMAP);					
				map01_layer_ind=1;
			}
			else {
				map_index = 1;
				maps[0].removeLayer(base_map_array[map00_layer_ind]);
				maps[0].addLayer(map_layer_nlsc_EMAP);					
				map00_layer_ind=1;
			}
			
			source_box_2 = new ol.source.Vector({wrapX: false});
			
			vector_box_2 = new ol.layer.Vector({
				source: source_box_2,
				style: new ol.style.Style({
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.2)'
					}),
					stroke: new ol.style.Stroke({
						color: '#ffcc33',
						width: 2
					}),
					image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
						anchor: [0.5, 46],
						anchorXUnits: 'fraction',
						anchorYUnits: 'pixels',
						scale: 0.5,
						src: 'img/marker03.png'
					})),
					text: new ol.style.Text({
						font: "Microsoft Yahei,sans-serif",
						fill: new ol.style.Fill({ color: 'red' }),
						scale: 2.5,
						stroke: new ol.style.Stroke({color: 'yellow', width: 0.8}),
						text: "最高點"
					})
				})
			});
			
			// clear flag
			flag2 = true;
			
			maps[map_ind].addLayer(vector_box_2);
			
			/*** add 1015 ***/
			vector_box_2.setZIndex(draw_box_zindex);
			/****************/
			
			value = 'Point';
			maxPoints = 2;
			
			draw_end_point = new ol.interaction.Draw({
				source: source_box_2,
				type: /** @type {ol.geom.GeometryType} */ (value),
				maxPoints: maxPoints
			});
				
			maps[map_ind].addInteraction(draw_end_point);	
				
			draw_end_point.on('drawstart',
				function (evt) {
					// clear flag
					flag2 = true;
					
					measureTooltipElement.innerHTML = output_area;
				}, this);
				
			draw_end_point.on('drawend',
				function (e) {
					createMeasureTooltip();  
					
					btn_enable();	
					
					ori_coor = e.feature.getGeometry().getCoordinates()
					coor2 = ol.proj.transform(e.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
					maps[map_ind].removeInteraction(draw_end_point);
					this.getTerr(coor2, 2);
					
					measureTooltipElement.innerHTML = output_area;
					
					alert("請輸入或繪製流域長度");
				}, this);
			
			
			measureTooltipElement.innerHTML = output_area;
		},
		
		// 集水區範圍
		drawPolygon() {
			// draw
			alert("請框選 關注集水區範圍");
			
			source_box_3 = new ol.source.Vector({wrapX: false});

			vector_box_3 = new ol.layer.Vector({
				source: source_box_3,
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
			
			// clear flag
			flag3 = true;
			
			maps[map_ind].addLayer(vector_box_3);
			
			/*** add 1015 ***/
			vector_box_3.setZIndex(draw_box_zindex);
			/****************/
			
			value = 'Polygon';

			draw_box = new ol.interaction.Draw({
				source: source_box_3,
				type: /** @type {ol.geom.GeometryType} */ (value),
			});
				
			maps[map_ind].addInteraction(draw_box);
			
			
			let tooltipCoord_area;
			
			draw_box.on('drawstart',
				function (evt) {
					sketch = evt.feature;

					let tooltipCoord = evt.coordinate;

					listener = sketch.getGeometry().on('change', function (evt) {
						let geom = evt.target;
						geom_area = geom;
						let output;
						output = formatArea(geom);
						output_area = output
						tooltipCoord = geom.getInteriorPoint().getCoordinates();
						tooltipCoord_area = tooltipCoord;
						
						let sourceProj = maps[map_ind].getView().getProjection();
						let geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
						let coordinates = geom_t.getLinearRing(0).getCoordinates();
						MR_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
						
						measureTooltipElement.innerHTML = output;
						measureTooltip.setPosition(tooltipCoord);
						
						// clear flag
						flag3 = true;
					});
				}, this);
				
			draw_box.on('drawend',
				function (e) {
					createMeasureTooltip();
					btn_enable();
					
					maps[map_ind].removeInteraction(draw_box);
					
					measureTooltipElement.innerHTML = output_area;
					measureTooltip.setPosition(tooltipCoord_area);
					
					measureTooltipElement.className = 'tooltip tooltip-me';
					// unset tooltip so that a new one can be created
					measureTooltipElement = null;
					
					
					
					createMeasureTooltip();
					
					this.drawEndPoint();
				}, this);
		},
		
		drawFlow() {
			// draw
			alert("請點選 河流流域");
			
			clear_map();
		 
			createMeasureTooltip();  
			
			// clear self
			if (flag4) {
				maps[map_ind].removeLayer(vector_box_4);
				vector_box_4.getSource().clear();
				source_box_4.clear();
				maps[map_ind].addLayer(vector_box_4);
				flag4 = false;
				maps[map_ind].removeInteraction(draw_box);
			}
			
			//更改底圖
			if(!map_flag) {
				map_flag = true;
				if(map_ind==1) map_layer_index = map01_layer_ind;
				else map_layer_index = map00_layer_ind;
			}
			if(map_ind==1){ 
				map_index = 1;
				maps[1].removeLayer(base_map_array[map01_layer_ind]);
				maps[1].addLayer(map_layer_swcb_r_5m);					
				map01_layer_ind=8;
				layer_token_get();
			}
			else {
				map_index = 1;
				maps[0].removeLayer(base_map_array[map00_layer_ind]);
				maps[0].addLayer(map_layer_swcb_r_5m);					
				map00_layer_ind=8;
				layer_token_get();
			}
			
			source_box_4 = new ol.source.Vector({wrapX: false});

			vector_box_4 = new ol.layer.Vector({
				source: source_box_4,
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
			
			// clear flag
			flag4 = true;
			
			maps[map_ind].addLayer(vector_box_4);
			
			/*** add 1015 ***/
			vector_box_4.setZIndex(draw_box_zindex);
			/****************/
			
			value = 'LineString';

			draw_box = new ol.interaction.Draw({
				source: source_box_4,
				type: /** @type {ol.geom.GeometryType} */ (value),
			});
				
			maps[map_ind].addInteraction(draw_box);	
			
			draw_box.on('drawstart',
				function (evt) {
					sketch = evt.feature;

					let tooltipCoord = evt.coordinate;

					listener = sketch.getGeometry().on('change', function (evt) {
						let geom = evt.target;
						let output;
						output = formatLength(geom);
						tooltipCoord = geom.getLastCoordinate();
						
						measureTooltipElement.innerHTML = output;
						measureTooltip.setPosition(tooltipCoord);
						
						// clear flag
						flag4 = true;
					});
				}, this);
				
			draw_box.on('drawend',
				function (e) {
					createMeasureTooltip();
					btn_enable();
					maps[map_ind].removeInteraction(draw_box);
					let ll = e.feature.getGeometry().getLength();
					this.dis = ll/1000;
					this.dis = Math.round(this.dis*1000)/1000;
					this.getMR();
				}, this);
		},
		
		clear() {
			let self = this;
			clear_map();
			if (flag1) {
				maps[map_ind].removeLayer(vector_box_1);
				vector_box_1.getSource().clear();
				source_box_1.clear();
				maps[map_ind].addLayer(vector_box_1);
				flag1 = false;
				maps[map_ind].removeInteraction(draw_end_point);
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
			
			var staticTooltip = document.getElementsByClassName("tooltip-me");
			var length = staticTooltip.length;
			for(var i = 0; i < length; i++)
			{
				//staticTooltip[0].parentNode.removeChild(staticTooltip[0]);
				if (staticTooltip[0]) {
					staticTooltip[0].parentNode.removeChild(staticTooltip[0]);
				}
			}
			
			this.MR_msg = " ";
			this.diff = " ";
			this.dis = " ";
			this.MR = " ";
			h1 = 0;
			h2 = 0;
			MR_area = 0;
		},
		
		/* 
		distance(lat1, lon1, lat2, lon2) {
			if ((lat1 == lat2) && (lon1 == lon2)) {
				return 0;
			}
			else {
				let radlat1 = Math.PI * lat1/180;
				let radlat2 = Math.PI * lat2/180;
				let theta = lon1-lon2;
				let radtheta = Math.PI * theta/180;
				let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
				if (dist > 1) {
					dist = 1;
				}
				dist = Math.acos(dist);
				dist = dist * 180/Math.PI;
				dist = dist * 60 * 1.1515;
				dist = dist * 1.609344
				return dist;
			}
		},
		 */
		 
		getTerr(coor,n){
			let self = this;
			$.get("php/get_terr.php",{ lat: coor[0], lon: coor[1] },function(data){
                returnHeight(data.array);
                if (data.array.indexOf('WKT未包含任何縣市,或此縣市資料，系統尚未支援') > -1) {
					if(n==1) h1 = 0;
					else h2 = 0;
                }
                else {
					if(n==1) h1 = parseFloat(data.array.split('[')[1].split(']')[0].split(',')[2]);
					else h2 = parseFloat(data.array.split('[')[1].split(']')[0].split(',')[2]);
                }
            });
		},
		
		getMR() {
			if(h1!=0 && h2!=0 && this.dis!=" " && MR_area!=0) {
				let self = this;
				//改為使用者輸入 this.dis = this.distance(coor1[1], coor1[0], coor2[1], coor2[0]);
				this.diff = Math.round((Math.abs(h1-h2)/1000)*1000)/1000;
				this.MR = Math.round((this.diff/(Math.sqrt(MR_area/1000000)))*1000)/1000;
				this.MR_msg = " ";
				if(this.MR<0.3) {
					// 洪水
					this.MR_msg = "洪水";
					//alert("您關注的集水區屬於 洪水");
				}
				if(this.MR>0.43 && this.dis<=14 && this.dis>=7) {
					// 高含砂水流+土石流
					this.MR_msg = "高含砂水流+土石流";
					//alert("您關注的集水區屬於 高含砂水流");
				}
				if(this.MR>=0.3 && this.MR<=0.43 && this.dis<=14) {
					// 高含砂水流+土石流
					this.MR_msg = "高含砂水流+土石流";
				}
				if(this.MR>0.43 && this.dis<7){
					// 土石流
					this.MR_msg = "土石流";
				}
				if(this.MR_msg == " "){
					this.MR_msg = "不屬於任何災害類型"
				}
			}
			else{
				alert("尚有參數未設定")
			}
			
		},
		
		comment() {
			window.open("vue/components/MR.html", "流域險峻值");
		}
	},
	template: `
	<div>
					<div class='ui secondary menu'>
						<button class='ui button' @click="drawStartPoint">設定參數</button>
						<button class='ui button' @click="clear">    清除    </button>
						<button class='ui button' @click="comment">?</button>
					</div>
					<div class='ui form'>
						<table border="1">
						<tr>
							<th>高程差(km)：</th>
							<td><input type='text' v-model.number="diff" disabled></td>
						</tr>
						<tr>
							<th>流域長度(km)：</th>
							<td><input type='text' @keyup="getMR" v-model.number="dis"></td>
							<td><button class='ui button' @click="drawFlow">地圖繪製</button></td>
						</tr>
						<tr>
							<th>MR值：</th>
							<td><input type='text' v-model.number="MR" disabled></td>
						</tr>
						</table>
						
						<h4>您關注的集水區屬於</h4>
						
						<h2>{{MR_msg}}</h2>
						
						<h4>災害類型</h4>
					</div>
	</div>
`
	
});
Vue.component('Model_1_2', {
    props:  {
        maps: null,
        map_ind: null,
		fun_slug: { type: String, default: 'Func_Use_Model_1_2' }
    },
	data: function () {
        return {
			polygon_area: 0,
			rain_list: [],
			rain_5: 0,
			rain_10: 0,
			rain_25: 0,
			rain_50: 0,
			rain_100: 0,
			rain_200: 0,
			rain_choose: "",
			rain_coefficient: 0,
			rain_result: 0
        }
    },
	created: function () {
		this.polygon_area = " ";
		this.rain_result = " ";
		this.rain_coefficient = " ";
		// load data
		var rain = document.createElement('script');
		rain.src = "vue/components/rain.js";
		document.head.appendChild(rain);
		this.rain_list = [];
		coor = null;
	},
	methods: {
		get_scope(){ //初始化地圖、創建新的tooltip並加在map圖層上
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
			
			value = 'Polygon';

			draw_box = new ol.interaction.Draw({
				source: source_box,
				type: /** @type {ol.geom.GeometryType} */ (value),
			});
				
			maps[map_ind].addInteraction(draw_box);
			
			let output_area;
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
						
						measureTooltipElement.innerHTML = output;
						measureTooltip.setPosition(tooltipCoord);
					});
				}, this);
				
			draw_box.on('drawend',
				function (e) {
					createMeasureTooltip();
					btn_enable();
					
					coor = ol.proj.transform(e.feature.getGeometry().getCoordinates()[0][0], 'EPSG:3857', 'EPSG:4326');
					maps[map_ind].removeInteraction(draw_box);
					
					measureTooltipElement.innerHTML = output_area;
					measureTooltip.setPosition(tooltipCoord_area);
					
					this.polygon_area = output_area.split(" ",1)[0] * 100;
					this.get_raindata(coor);
				}, this);
			   
		},
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
				dist = dist * 1.609344;
				return dist;
			}
		},
		get_raindata(coor) {
			//distance(coor[1], coor[0], lat2, lon2)
			let min_dist = 99999;
			let target_index = -1;
			for(let i=0; i<rain_data.length; i++){
				let lat = rain_data[i]["lat"];
				let lon = rain_data[i]["lon"];
				let dist = this.distance(coor[1], coor[0], lat, lon)
				if (dist < min_dist){
					min_dist = dist;
					target_index = i;
				}
			}
			console.log(min_dist);
			console.log(target_index);
			if(target_index == -1){
				this.rain_list = [];
				alert("error occur: cannot find target index");
			}
			else {
				// fill rain_list
				this.rain_5 = Math.round(rain_data[target_index]["i560"]);
				this.rain_10 = Math.round(rain_data[target_index]["i1060"]);
				this.rain_25 = Math.round(rain_data[target_index]["i2560"]);
				this.rain_50 = Math.round(rain_data[target_index]["i5060"]);
				this.rain_100 = Math.round(rain_data[target_index]["i10060"]);
				this.rain_200 = Math.round(rain_data[target_index]["i20060"]);
				let rain_name = rain_data[target_index]["stname"];
				this.rain_list = [rain_name+"(5年重現期):"+this.rain_5.toString(), rain_name+"(10年重現期):"+this.rain_10.toString(), 
				rain_name+"(25年重現期):"+this.rain_25.toString(), rain_name+"(50年重現期):"+this.rain_50.toString(), 
				rain_name+"(100年重現期):"+this.rain_100.toString(), rain_name+"(200年重現期):"+this.rain_200.toString()];
				
				// draw icon
				this.icon_draw(rain_data[target_index]["lat"], rain_data[target_index]["lon"]);
			}
			
		},
		get_result() {
			this.rain_result = this.rain_coefficient*parseInt(this.rain_choose.split(":")[1])*this.polygon_area/360;
		},
		clear_number() {
			this.polygon_area = " ";
			this.rain_list = [];
			this.rain_5 = 0;
			this.rain_10 = 0;
			this.rain_25 = 0;
			this.rain_50 = 0;
			this.rain_100 = 0;
			this.rain_200 = 0;
			this.rain_choose = " ";
			this.rain_coefficient = " ";
			this.rain_result = " ";
		},
		
		icon_draw(lat, lng) {
			// search_Icon_draw() from tool_fun.js
			
			if (Location_Icon_vectorLayer != null) {
				maps[map_ind].removeLayer(Location_Icon_vectorLayer);
			}

			var locate_icon = new ol.Feature({
				geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(lng), parseFloat(lat)])),
				name: '定位點'
			});
			locate_icon.setStyle(new ol.style.Style({
				image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
					crossOrigin: 'anonymous',
					src: '/img/Search_Icon_Location.png'
				}))
			}));

			var vectorSource = new ol.source.Vector({
				features: [locate_icon]
			});
			Location_Icon_vectorLayer = new ol.layer.Vector({
				source: vectorSource
			});
			maps[map_ind].addLayer(Location_Icon_vectorLayer);

		}
	},
	template: `
	<div>
					<div class='ui secondary menu'>
						<button class='ui button' @click="get_scope">框選範圍</button>
						<button class='ui button' onclick = 'clear_map()'>clear</button>
					</div>
					
					<div class='ui form'>
						<table border="1">
						<tr>
							<td align="center"><h3>C</h3></td>
							<td rowspan=3><h3> × </h3></td>
							<td align="center"><h3>I</h3></td>
							<td rowspan=3><h3> × </h3></td>
							<td align="center"><h3>A</h3></td>
							<td rowspan=3><h3>/360</h3></td>
						</tr>
						<tr>
							<td><input type='text' v-model.number="rain_coefficient"></td>
							<td><select v-model="rain_choose" id='drawline_data'>
								<option>--</option>
								<option v-for="i in rain_list">{{i}}</option>
							</select> </td>
							<td><input type='text' v-model.number="polygon_area"></td>
						</tr>
						<tr>
							<td>逕流係數(無單位)</td>
							<td>降雨強度(mm/hr)</td>
							<td>集水區面積(公頃)</td>
						</tr>
						</table>
					</div>
					<div class='ui form'>
						<table border="1">
						<tr>
							<td rowspan=3><h3> = </h3></td>
							<td align="center"><h3>Q</h3></td>
						</tr>
						<tr>
							<td><input type='text' v-model.number="rain_result"></td>
						</tr>
						<tr>
							<td>洪峰流量(m^3/s)</td>
						</tr>
						</table>
					</div>
					<div class='ui secondary menu'>
						<button class='ui button' @click="get_result">計算</button>
						<button class='ui button' @click="clear_number">重置</button>
					</div>
					逕流係數建議表：
					<div class='ui form'>
						<table border="1">
						<tr>
							<th>集水區狀況</th>
							<th>陡峻山地</th>
							<th>山嶺區</th>
							<th>丘陵地或森林地</th>
							<th>平坦耕地</th>
							<th>非農業使用</th>
						</tr>
						<tr>
							<th>無開發整地之逕流係數</th>
							<td>0.75~0.90</td>
							<td>0.70~0.80</td>
							<td>0.50~0.75</td>
							<td>0.45~0.60</td>
							<td>0.75~0.95</td>
						</tr>
						<tr>
							<th>開發整地後之逕流係數</th>
							<td>0.95</td>
							<td>0.90</td>
							<td>0.90</td>
							<td>0.85</td>
							<td>0.95~1.00</td>
						</tr>
						</table>
					</div>
	</div>
`
	
});
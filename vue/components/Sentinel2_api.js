Vue.component('Sentinel2_api', {
    props:  {
        maps: null,
        map_ind: null,
    },
    data: function () {
        return {
			sentinel2_arr: [] ,
			curr_sentinel_layer:Object,
			sentinel2_source:null,
			sentinel2_vector:null,
			sentinel2_region: "",
			//sen_modifyInteraction: null,
			avg_lat: 0,
			avg_lng: 0,
			area_limit: 50.0,
			sen_url: "",
			sentinel2_area: null,
			
			sentinel2_cb: false,//開關目前狀態
			sentinel2_list_selected:'', // v-model with template
			sentinel2_poly_open:0,//poly是否運作
			sentinel2_arr_html:[],//下拉選單內容
			from_poly: 0,
			
			//for getKml，in draw.js past
			sentinel2_num: 0,
			sentinel2_kml_link_arr: [],
			draw_w6_Tree:null,
        }
    },
    watch: {
		sentinel2_list_selected : function(){
			this.sentinel2_onchange();
		},
		sentinel2_cb:function(){
			this.sentinel2_cb_onchange();
		}
    },
	mounted: function () {
	  this.$nextTick(function () {//初始化，1.取得衛星影像並加到下拉式選單
			var self = this;
			$.ajax({
				type: "GET",
				url: "php/BL_A01_T02.php",
				dataType: "xml",
				//jsonpCallback: 'callback',
				success: function (xml) {
					self.sentinel2_arr = $(xml).children().children()
					// add to list
 					for (let i = 0; i < $(xml).children().children().length; i++) {
						let str = $(xml).children().children()[i].getAttribute('text')
						let o = new Option(str, str);
						$(o).html(str)
						self.sentinel2_arr_html.push(o);
					} 
					// set the default layer
					self.curr_sentinel_layer = self.sentinel2_arr[0];
					// add the event 'change', change the image when the selection change
					self.sentinel2_list_selected = self.sentinel2_arr[0].getAttribute('text');
				},
				error: function (jqXHR) {
					$("#sentinel_block").css("display", "none");
				}
			});

			if (!this.sentinel2_cb) {
				//$("#sentinel_poly_button").off('click');
				this.sentinel2_poly_open = 0;
			} else {
				//$("#sentinel_poly_button").on('click', function (e) { this.Sentinel2_getPoly() });
				this.sentinel2_poly_open = 1;
			}

			this.sen_url = "";
			this.sentinel2_area = 10000000000;
			
			
			//for getKml，in draw.js past
			this.draw_w6_Tree = new dhtmlXTreeObject("treeBox_sentinel2", "100%", "100%", 0);
			this.draw_w6_Tree.setImagePath("codebase/imgs/dhxtree_material/");
			this.draw_w6_Tree.enableCheckBoxes(1);
			this.draw_w6_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
			this.draw_w6_Tree.setOnCheckHandler(this.Layer_Tree_OnCheck_Sentinel2_Tree);
			this.draw_w6_Tree.setOnDblClickHandler(Location_Grid_DblClicked);
		})
	},
    methods: {
		xmlread_Function(xml) {
			var xmlDoc = xml.responseXML;
			if(xmlDoc!=null){
			 x=xmlDoc.getElementsByTagName('name')[xmlDoc.getElementsByTagName('name').length-1];
			y=x.childNodes[0].nodeValue;
			}else{
				y="";
			}
			return y;
		},

		Layer_Tree_OnCheck_Sentinel2_Tree(rowId, state){
			Layer_Tree_Oncheck_Pre("draw_w6_Tree",rowId, state);
		},
		sentinel2_cb_onchange(){ //checkBox開關時，開關圖層
			if(this.sentinel2_cb) {
				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.clear_sentinel2_compare("left")
				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.clear_sentinel2_compare("right")
				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_cb = false
				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.clear_spectrum("left")
				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.clear_spectrum("right")
				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spectrum_cb = false
				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.clear_sentinel2_sis()
				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_cb = false
				$('#sentinel_compare_checked').prop("checked", false)
				$('#spectrum_checked').prop("checked", false)
				$('#sentinel_sis_checked').prop("checked", false)
				$('#subscene_checked').prop("checked", false)
/* 				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.clear_sentinel2_sis_region()
				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.clear_sentinel2_compare_region()
				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.clear_spectrum_region()
				vueapp_subscene_image_api.$refs.subscene_image_api.clear_subscene("left")
				vueapp_subscene_image_api.$refs.subscene_image_api.clear_subscene("right") */
				vueapp_subscene_image_api.$refs.subscene_image_api.vue_subscene_cb = false
				this.set_sentinel2();
				map_win_single()
				if(this.from_poly == 1){
					this.Sentinel2_getPoly()
				}
			}
			else {
				this.clear_sentinel2();
				this.clear_sentinel2_region()
				this.from_poly = 0
			}
		},		

 		// 2.清除原本的衛星影像圖層
		clear_sentinel2() {
			//$("#sentinel_poly_button").off('click');
			this.sentinel2_poly_open =0;
			this.sen_url = "";
			
			//sen_url = "";
			if (this.sentinel2_vector) {
				maps[map_ind].removeLayer(this.sentinel2_vector);
				this.sentinel2_vector = "";
				this.sentinel2_source = "";
				//maps[map_ind].addLayer(sentinel2_vector);
			}
		},
		// 3.清除所選的區域
		clear_sentinel2_region() {
			this.sentinel2_area = 10000000000;
			this.sen_url = ""
			this.sentinel2_region = ""
			clear_map()
		},
		
		// 3.清除所選的區域
		clear_sentinel2_region() {
			this.sentinel2_area = 10000000000;
			this.sen_url = ""
			this.sentinel2_region = ""
			clear_map()
		},
		
		// 4.更改選擇的選項時改變要顯示的衛星影像
		sentinel2_onchange() {
			for (var i = 0; i < this.sentinel2_arr.length; i++) {
				if (this.sentinel2_arr[i].getAttribute('text') === this.sentinel2_list_selected) {
					this.curr_sentinel_layer = this.sentinel2_arr[i];
				}
			}
			this.sen_url = "";

			if (this.sentinel2_cb) {
				this.clear_sentinel2()
				this.set_sentinel2()
			}
		},
		
		// 5.顯示衛星影像
		set_sentinel2() {
			//$("#sentinel_poly_button").on('click', function (e) { this.Sentinel2_getPoly() });
			this.sentinel2_poly_open = 1;

			//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016

			let curr_layer = JSON.parse(this.curr_sentinel_layer.getAttribute('id'))

			
			this.sentinel2_source = new ol.source.TileImage({
				tileUrlFunction: function (tileCoord) {

					var z = tileCoord[0];
					var x = tileCoord[1] - 1;
					var y = -tileCoord[2] - 1;
					return curr_layer.Url + z + '/' + y + '/' + x + '.jpg';
				},
				crossOrigin: 'anonymous'
			})

			this.sentinel2_vector = new ol.layer.Tile({
				source: vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_source
			});

			this.sentinel2_vector.setZIndex(1);

			maps[map_ind].addLayer(this.sentinel2_vector);
		},
		
		// 6.畫出選取範圍
		Sentinel2_getPoly() {
			if(this.sentinel2_poly_open == 0){
				this.from_poly = 1
				this.sentinel2_cb = 1
			}
			document.getElementById("space_lonlat").checked = true;
			this.clear_sentinel2_region(); // clear the selected region

			createMeasureTooltip();

			// create box
			source_box = new ol.source.Vector({ wrapX: false });
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

			vector_box.setZIndex(draw_box_zindex);
			maps[map_ind].addInteraction(draw_box);

			// create listener for start drawing
			draw_box.on('drawstart',
				function (evt) {

					btn_disable();

					sketch = evt.feature;

					var tooltipCoord = evt.coordinate;
					// listener for mouse event(changing the position)
					listener = sketch.getGeometry().on('change', function (evt) {
						var geom = evt.target;
						var output;
						output = formatArea(geom);
						tooltipCoord = geom.getInteriorPoint().getCoordinates();
						// convert the coordinate
						var sourceProj = maps[map_ind].getView().getProjection();
						var geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
						var coordinates = geom_t.getLinearRing(0).getCoordinates();
						vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
						measureTooltipElement.innerHTML = output;
						measureTooltip.setPosition(tooltipCoord);
					});
				}, this);

			// listener for the end of drawing
			draw_box.on('drawend',
				function (e) {
					clear_map();
					//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsasd?
					//date=20180526&
					//sentinel2_region=120.7258760671514%2C24.11023190418376%3B120.7425065966939%2C24.07755520679549%3B120.7972651666654%2C24.07795616672053%3B120.8060511576072%2C24.11258739313845%3B120.7931073286575%2C24.12840319631653%3B120.7602521139275%2C24.13013827730786%3B120.7258760671514%2C24.11023190418376

					coor = e.feature.getGeometry().getCoordinates()[0];

					//date = "date=" + curr_sentinel_layer.getAttribute('text').split("_")[0]
					vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_region = "&region="
					/*
					up = 0;
					down = 1000;
					left = 1000;
					right = 0;
					*/

					var coor_00;  // start point

					for (var i = 0; i < coor.length; i++) {
						// convert the coordinate
						var coor_84 = ol.proj.transform([coor[i][0], coor[i][1]], 'EPSG:3857', 'EPSG:4326');

						if (i == 0)  // start point
							coor_00 = coor_84;

						vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_region = vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_region + coor_84[0] + "%2C" + coor_84[1] + "%3B";

						vueapp_sentinel2_api.$refs.sentinel2_api.avg_lng = vueapp_sentinel2_api.$refs.sentinel2_api.avg_lng + coor_84[0]
						vueapp_sentinel2_api.$refs.sentinel2_api.avg_lat = vueapp_sentinel2_api.$refs.sentinel2_api.avg_lat + coor_84[1]
						/*
						if (coor_84[0] > right)
							right = coor_84[0];
						if (coor_84[0] < left)
							left = coor_84[0];
						if (coor_84[1] > up)
							up = coor_84[1];
						if (coor_84[1] < down)
							down = coor_84[1];
						*/
					}
					vueapp_sentinel2_api.$refs.sentinel2_api.avg_lat /= coor.length
					vueapp_sentinel2_api.$refs.sentinel2_api.avg_lng /= coor.length

					vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_region = vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_region + coor_00[0] + "%2C" + coor_00[1];

					maps[map_ind].removeInteraction(draw_box);

					btn_enable();

				}, this);
				//Layer_Grid_Oncheck(ch_lay_root_name,ch_id,0,document.getElementById(ch_id).checked);
		},
		
		// 7.傳送資料給後端抓取圖片
		Sentinel2_getKml() {
			fun_access_log("Func_Use_Analysis_1_1");
			var date = "date=" + this.curr_sentinel_layer.getAttribute('text').split("_")[0]
			if (this.sentinel2_area / 1000000 <= this.area_limit) {
				this.sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsasd?" + date + this.sentinel2_region
			} else if (this.sentinel2_region == "") {
				this.sen_url = "";
			} else {
				this.sen_url = "over";
			}

			if (this.sen_url != "over" && this.sen_url != "") {
				console.log(this.sen_url);
				btn_disable();

				loading_id = "l" + this.sentinel2_num.toString();
				this.draw_w6_Tree.insertNewItem("0", loading_id, "loading...", function () { }, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
				this.draw_w6_Tree.enableCheckBoxes(false, false);

				//send data

				$.ajax({
					type: "GET",
					url: "php/get_elsasd.php",
					dataType: "json",
					data: {
						u: vueapp_sentinel2_api.$refs.sentinel2_api.sen_url
					},
					//jsonpCallback: 'callback',
					success: function (json) {
						console.log(json.result)

						if (json.result != false) {
							var TotalArea=0;
							var xhttp = new XMLHttpRequest();
							xhttp.onreadystatechange = function() {
								if (this.readyState == 4 && this.status == 200) {
									TotalArea=vueapp_sentinel2_api.$refs.sentinel2_api.xmlread_Function(this);//從kml取得總面積	
								vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_kml_link_arr.push(json.kmlFilePath);

								vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_num = vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_num + 1;

								new_node_id =  `{
									"PosInfo":"${vueapp_sentinel2_api.$refs.sentinel2_api.avg_lat + ";" + vueapp_sentinel2_api.$refs.sentinel2_api.avg_lng + ";563426;8;#FFFF00;;;;;"}",
									"Type":"Kml",
									"Url":"${json.kmlFilePath}",
									"ID":"Sentinel2${vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_num.toString()}",
									"FileName":"Sentinel2-${vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_num.toString()}_${vueapp_sentinel2_api.$refs.sentinel2_api.curr_sentinel_layer.getAttribute('text').split("_")[0]}"
								}`.replace(/\n|\t/g, "").trim();
								
								
								vueapp_sentinel2_api.$refs.sentinel2_api.draw_w6_Tree.enableCheckBoxes(true, true);

								// layer item
								vueapp_sentinel2_api.$refs.sentinel2_api.draw_w6_Tree.insertNewChild("0", new_node_id, "Sentinel2-" + vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_num.toString() + "_" + vueapp_sentinel2_api.$refs.sentinel2_api.curr_sentinel_layer.getAttribute('text').split("_")[0]
									+"_"+TotalArea, function () { }, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								// download item
								vueapp_sentinel2_api.$refs.sentinel2_api.draw_w6_Tree.insertNewItem(new_node_id, "sk" + vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_num.toString(), "下載 .kml 檔",
									function () {
										var idn = this.id.split("sk");
										document.getElementById("download_iframe").src = vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_kml_link_arr[idn[1] - 1];
									}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								vueapp_sentinel2_api.$refs.sentinel2_api.draw_w6_Tree.showItemCheckbox("sk" + vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_num.toString(), false);

								// Download button Default : closed
								vueapp_sentinel2_api.$refs.sentinel2_api.draw_w6_Tree.closeItem(new_node_id);
								};
							}
						xhttp.open("GET", json.kmlFilePath, true);
						xhttp.send();
						} else {
							alert("回傳檔案發生問題");
						}
						// delete loading signal
						vueapp_sentinel2_api.$refs.sentinel2_api.draw_w6_Tree.deleteItem(loading_id, false);

						btn_enable();
					},
					error: function (jqXHR) {
						console.log("error")
						alert("發生不明錯誤")
						vueapp_sentinel2_api.$refs.sentinel2_api.draw_w6_Tree.deleteItem(loading_id, false);
						btn_enable();
					}
				});
			} else if (this.sen_url == "over") {
				alert("選取範圍請小於 50 平方公里")
				this.clear_sentinel2_region();
			} else {
				alert("尚未設定選擇區域")
				this.clear_sentinel2_region();
			}
		}
    },
    template: `	
<div>
	<div class='ui secondary menu'>
		<a class='item' id = 'sentinel_poly_button' v-on:click="Sentinel2_getPoly()"><img src='img/paint03.png' alt=''></a>  
		<button class='ui button' v-on:click="clear_sentinel2_region()"> clear </button>
	</div>
	<div class='ui form'>
		<div class='fields'>
			<div class='field'>
				<select v-model="sentinel2_list_selected" class="ui dropdown" style="width:300px;"><!-- class="ui dropdown" style="width:300px;" -->
					<option v-for="list in sentinel2_arr_html">{{ list.value }}</option>
				</select>
			</div>
		</div>
		<div class="ui toggle checkbox" id = "sentinel_cb">
			<input type="checkbox" id="sentinel_checked" v-model="sentinel2_cb">
			<label>開啟</label>
		</div>
	</div>
	<br><br>
	<button class='ui button' id="Sentinel2_get" v-on:click='Sentinel2_getKml()'>執行</button>
	<div id='treeBox_sentinel2' style='width:100%;height:200;'></div>
</div>
`
});
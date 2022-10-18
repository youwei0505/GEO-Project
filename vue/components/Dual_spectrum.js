Vue.component('Dual_spectrum_api', {
    props:  {
        maps: null,
        map_ind: null,
    },
    data: function () {
        return {
			spectrum_arr: [],
			curr_spectrum_layer1:null,
			curr_spectrum_layer2:null,
			curr_spectrum_layer1_ind:1,
			curr_spectrum_layer2_ind:1,

			spectrum_source1:null,
			spectrum_vector1:null,
			spectrum_source2:null,
			spectrum_vector2:null,
			spectrum_region: '',

			avg_lat: 0,
			avg_lng: 0,

			// 選取範圍上下限
			spectrum_area_up_limit: 10.0, 
			spectrum_area_down_limit: 0.0,

			spec_url: "",
			spec_area: 0,
			
			spectrum_cb: false,//開關目前狀態
			spectrum_list_selected1:'', // v-model with template1
			spectrum_list_selected2:'', // v-model with template2
			spectrum_poly_open:0,//poly是否運作
			spectrum_list1:[],// 左下拉選單內容
			spectrum_list2:[],// 右下拉選單內容
			
			//for getKml，in draw.js past
			spec_num: 0,
			spec_kml_link_arr: [],
			from_poly:0,
			
			draw_w9_Tree:null,
        }
    },
    watch: {
		spectrum_list_selected1 : function(){
			this.spectrum_onchange1();
		},
		spectrum_list_selected2 : function(){
			this.spectrum_onchange2();
		},
		spectrum_cb:function(){
			this.spectrum_cb_onchange();
		}
    },
	mounted: function () {
	  this.$nextTick(function () {//初始化，1.取得衛星影像並加到下拉式選單
			var self = this;
			$.ajax({
				type: 	"GET",
				url:	"php/BL_A01_T02.php",
				dataType:	"xml",
				//jsonpCallback: 'callback',
				success: function (xml) {
					self.spectrum_arr = $(xml).children().children()
					// add to list
 					for (let i = 0; i < $(xml).children().children().length; i++) {
						let str = $(xml).children().children()[i].getAttribute('text')
						
						let o1 = new Option(str, str);
						$(o1).html(str)
						self.spectrum_list1.push(o1);
						
						let o2 = new Option(str, str);
						$(o2).html(str)
						self.spectrum_list2.push(o2);
					} 
					// set the default layer
					self.curr_spectrum_layer1 = self.spectrum_arr[0];
					self.curr_spectrum_layer2 = self.spectrum_arr[0];
					// add the event 'change', change the image when the selection change
					self.spectrum_list_selected1 = self.spectrum_arr[0].getAttribute('text');
					self.spectrum_list_selected2 = self.spectrum_arr[0].getAttribute('text');
				},
				error: function (jqXHR) {
					$("#dual_spectrum_block").css("display","none");
				}
			});

			if (!this.spectrum_cb) {
				//$("#spectrum_button").off('click');
				this.spectrum_poly_open = 0;
			} else {
				//$("#spectrum_button").on('click', function(e){spectrum_getPoly()});
				this.spectrum_poly_open = 1;
			}

			this.spec_url = "";
			this.spec_area = 0;
			
			
			//for getKml，in draw.js past	
			this.draw_w9_Tree = new dhtmlXTreeObject("treeBox_dual_spectrum", "100%", "100%", 0);
			this.draw_w9_Tree.setImagePath("codebase/imgs/dhxtree_material/");
			this.draw_w9_Tree.enableCheckBoxes(1);
			this.draw_w9_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
			this.draw_w9_Tree.setOnCheckHandler(this.Layer_Tree_OnCheck_Dual_Spectrum_Tree);
			this.draw_w9_Tree.setOnDblClickHandler(Location_Grid_DblClicked);
		})
	},
    methods: {
		Layer_Tree_OnCheck_Dual_Spectrum_Tree(rowId, state){
			Layer_Tree_Oncheck_Pre("draw_w9_Tree",rowId, state);
		},
		spectrum_cb_onchange(){ //checkBox開關時，開關圖層
			if(this.spectrum_cb) {
				
				
				vueapp_sentinel2_api.$refs.sentinel2_api.clear_sentinel2()
				

				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.clear_sentinel2_compare("left")
				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.clear_sentinel2_compare("right")

				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.clear_sentinel2_sis("all")
				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.clear_sentinel2_sis("left")
				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.clear_sentinel2_sis("right")

				vueapp_subscene_image_api.$refs.subscene_image_api.clear_subscene("left")
				vueapp_subscene_image_api.$refs.subscene_image_api.clear_subscene("right")

				$('#sentinel_checked').prop("checked", false)
				$('#sentinel_compare_checked').prop("checked", false)
				$('#sentinel_sis_checked').prop("checked", false)
				$('#subscene_checked').prop("checked", false)
				
				vueapp_sentinel2_api.$refs.sentinel2_api.clear_sentinel2_region()
				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.clear_sentinel2_compare_region()
				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.clear_sentinel2_sis_region()
				vueapp_subscene_image_api.$refs.subscene_image_api.clear_subscene_region()
				vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_cb = false
				vueapp_subscene_image_api.$refs.subscene_image_api.vue_subscene_cb = false
				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_cb = false
				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_cb = false
				this.set_spectrum("left")
				this.set_spectrum("right")
				map_win_double()
				if(this.from_poly == 1) {
					this.spectrum_getPoly()
				}
			}
			else {
				this.clear_spectrum("left")
				this.clear_spectrum("right")
								if(!vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_cb && !vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_cb && !vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_cb 
				&& !vueapp_subscene_image_api.$refs.subscene_image_api.vue_subscene_cb && !vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spectrum_cb)
				{map_win_single();}	
				this.clear_spectrum_region()
				/*** add 20190513 ***/
				//$("#spectrum_button").off('click');
				/********************/	
				this.from_poly = 0
			}
		},
		//define in duel_spectrum.js
		
 		// 2.清除原本的衛星影像圖層
		clear_spectrum(map)
		{
			//$("#spectrum_button").off('click');
			this.dual_poly_open =0;
			this.spec_url = "";
			// 左視窗
			if (map == "left" ) {
				if (this.spectrum_vector1) {
					maps[map_ind].removeLayer(this.spectrum_vector1);
					this.spectrum_vector1 = "";
					this.spectrum_source1 = "";
				}
			}
			// 右視窗
			else if ( map == "right" ) {
				if (this.spectrum_vector2) {
					maps[map_ind ^ 0x1].removeLayer(this.spectrum_vector2);
					this.spectrum_vector2 = "";
					this.spectrum_source2 = "";		
				}
			}
		},
		// 3.清除所選的區域
		clear_spectrum_region()
		{
			this.spec_area = 0;
			this.spec_url = ""
			this.spectrum_region = ""
			clear_map()
		},

		// 4.更改左圖層選擇的選項時改變左視窗要顯示的衛星影像
		spectrum_onchange1() {
			for (var i = 0; i < this.spectrum_arr.length; i++) {
				if (this.spectrum_arr[i].getAttribute('text') === this.spectrum_list_selected1) {
					this.curr_spectrum_layer1_ind=i;
					this.curr_spectrum_layer1 = this.spectrum_arr[i];
				}
			}
			this.spec_url = "";

			if (this.spectrum_cb) {
				this.clear_spectrum("right")
				this.set_spectrum("right")
			}
		},
		// 5.更改右圖層選擇的選項時改變右視窗要顯示的衛星影像
		spectrum_onchange2() {
			for (var i = 0; i < this.spectrum_arr.length; i++) {
				if (this.spectrum_arr[i].getAttribute('text') === this.spectrum_list_selected2) {
					this.curr_spectrum_layer2_ind=i;
					this.curr_spectrum_layer2 = this.spectrum_arr[i];
				}
			}
			this.spec_url = "";

			if (this.spectrum_cb) {
				this.clear_spectrum("left")
				this.set_spectrum("left")
			}
		},
		// 6.顯示衛星影像
		set_spectrum(map){
			if ( map === "left" ) {
				//$("#spectrum_button").on('click', function(e){spectrum_getPoly()});
				this.spectrum_poly_open = 1;
				//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016

				let curr_layer = JSON.parse(this.curr_spectrum_layer1.getAttribute('id'));
					
				this.spectrum_source1 = new ol.source.TileImage({
					tileUrlFunction: function(tileCoord){

						var z = tileCoord[0];
						var x = tileCoord[1]-1;
						var y = -tileCoord[2]-1;					
						return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
					},
					crossOrigin:'anonymous'
				})
				
				this.spectrum_vector1 = new ol.layer.Tile({
					source: this.spectrum_source1
				});
				
				this.spectrum_vector1.setZIndex(1);
				
				maps[map_ind].addLayer(this.spectrum_vector1);
			} else if ( map === "right" ) {
				//$("#spectrum_button").on('click', function(e){spectrum_getPoly()});
				this.spectrum_poly_open
				//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016

				let curr_layer = JSON.parse(this.curr_spectrum_layer2.getAttribute('id'));
					
				this.spectrum_source2 = new ol.source.TileImage({
					tileUrlFunction: function(tileCoord){

						var z = tileCoord[0];
						var x = tileCoord[1]-1;
						var y = -tileCoord[2]-1;					
						return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
					},
					crossOrigin:'anonymous'
				})
				
				this.spectrum_vector2 = new ol.layer.Tile({
					source: this.spectrum_source2
				});
				
				this.spectrum_vector2.setZIndex(1);
				
				maps[map_ind ^ 0x1].addLayer(this.spectrum_vector2);
			}
		},
		// 7.畫出選取範圍
		spectrum_getPoly(){
			if(this.spectrum_poly_open  == 0){
				this.from_poly = 1
				this.spectrum_cb = 1
			}
				document.getElementById("space_lonlat").checked = true;
				
				this.clear_spectrum_region(); // clear the selected region
			 
				createMeasureTooltip();  
			 
				// create box
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
				value = 'LineString';
				var maxPoints = 2;
				
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
						var geom_t = (geom.clone().transform(sourceProj, 'EPSG:4326'));
						var coordinates = geom_t.getLinearRing(0).getCoordinates();
						vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spec_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
						
						measureTooltipElement.innerHTML = output;
						measureTooltip.setPosition(tooltipCoord);
					});
				}, this);	
					
				// listener for the end of drawing
				draw_box.on('drawend',
					function (e) {
						clear_map();
					 
						createMeasureTooltip();
						//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/searcharchiveexport?
						//satellite_band=1,2,3,4
						//&start_date=20170501
						//&end_date=20170831
						//&lefttop_x=121.03157043457031
						//&rightbottom_x=121.19430541992188
						//&lefttop_y=22.816061209792952
						//&rightbottom_y=22.72299043351299
						
						box_array=(String(e.feature.getGeometry().getExtent())).split(",");  // return [minx, miny, maxx, maxy]

						loc_84=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');
						lefttop_x=loc_84[0]
						lefttop_y=loc_84[1]

						loc_84=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');
						rightbottom_x=loc_84[0]
						rightbottom_y=loc_84[1]

						vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spectrum_region = "&lefttop_x=" + lefttop_x +
										  "&rightbottom_x=" + rightbottom_x +
										  "&lefttop_y=" + lefttop_y +
										  "&rightbottom_y=" + rightbottom_y

						console.log("spectrum_region : " + vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spectrum_region)
						vueapp_dual_spectrum_api.$refs.dual_spectrum_api.avg_lat = (lefttop_x + rightbottom_x) / 2
						vueapp_dual_spectrum_api.$refs.dual_spectrum_api.avg_lng = (lefttop_y + rightbottom_y) / 2

						maps[map_ind].removeInteraction(draw_box);
						
						btn_enable();
						
					}, this);	  			
		},
		// 8.傳送資料給後端抓取圖片
		spectrum_getKml(){
			fun_access_log("Func_Use_Analysis_1_9");
			//satellite_band=1,2,3,4
			var satellite_band = "satellite_band=";
			var selected = 0;
			for(var i=1;i<14;i++)
			{
				var band = "band_" + i.toString();
				var checkBox = document.getElementById(band);
				
				if(checkBox.checked == true){
					var val = checkBox.value;
					selected = i
					satellite_band = satellite_band + val + ",";
				}		
			}
			satellite_band = satellite_band.slice(0,satellite_band.length-1)
			if(selected == 0)
			{
				alert("尚未選擇波段");
				retrun;
			}
			console.log(satellite_band)
			//&start_date=20170501
			//&end_date=20170831
			var before = this.curr_spectrum_layer1.getAttribute('text').split("_")[0]
			var after = this.curr_spectrum_layer2.getAttribute('text').split("_")[0]
			var date = "&start_date=" + before +
					   "&end_date=" + after

			//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/searcharchiveexport?satellite_band=1,2,3,4&start_date=20170501&end_date=20170831&lefttop_x=121.03157043457031&rightbottom_x=121.19430541992188&lefttop_y=22.816061209792952&rightbottom_y=22.72299043351299
			// check the size of selected area
			if ( this.spec_area / 1000000 <= this.spectrum_area_up_limit && this.spec_area / 1000000 > this.spectrum_area_down_limit ) {
				this.spec_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/searcharchiveexport?" + satellite_band + date + this.spectrum_region
			} else if ( this.spec_area / 1000000 > this.spectrum_area_up_limit ) {
				this.spec_url = "over";
			} else if ( this.spec_area / 1000000 < this.spectrum_area_down_limit ) {
				this.spec_url = "under";
			} else if ( this.spectrum_region == "" ) {
				this.spec_url = "";
			}
			// check the order (left < right)
			if ( before === after ) {
				this.spec_url = "same"
			} else if ( parseInt(before) > parseInt(after) ) {
				this.spec_url = "bigB"
			}
			if(this.curr_spectrum_layer1_ind-this.curr_spectrum_layer2_ind>5){
				this.spec_url = "range_limit"
			}
			console.log("send url : " + this.spec_url)
			if ( this.spec_url != "under" && this.spec_url != "over" && this.spec_url != "same" && this.spec_url != "bigB"&& this.spec_url != "range_limit"  && this.spec_url != "" ) {
				
				btn_disable();
				
				loading_id = "l"+this.spec_num.toString();
				this.draw_w9_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
				this.draw_w9_Tree.enableCheckBoxes(false, false);

				//send data
				$.ajax({
					type: 	"GET",
					url:	"php/get_spectrum.php",
					dataType:	"json",
					data: {
						u: this.spec_url
					},
					//jsonpCallback: 'callback',
					success: function(json) {
						console.log("result : " + json.images)
						
						if ( json.result != false ) {
							
							vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spec_kml_link_arr.push(json.kmlFilePath);
							
							vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spec_num = vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spec_num + 1;
									
							new_node_id = vueapp_dual_spectrum_api.$refs.dual_spectrum_api.avg_lat + ";" + vueapp_dual_spectrum_api.$refs.dual_spectrum_api.avg_lng + ";563426;8;#FFFF00;;;;;@Kml@" + json.kmlFilePath;

							vueapp_dual_spectrum_api.$refs.dual_spectrum_api.draw_w9_Tree.enableCheckBoxes(true, true);
								
							// layer item
							vueapp_dual_spectrum_api.$refs.dual_spectrum_api.draw_w9_Tree.insertNewChild("0", new_node_id, "Spectrum-" + vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spec_num.toString() + "_" + before + "_" + after + "(展開點擊下載)"
														, function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
							vueapp_dual_spectrum_api.$refs.dual_spectrum_api.draw_w9_Tree.showItemCheckbox(new_node_id, false);
							// download item
							vueapp_dual_spectrum_api.$refs.dual_spectrum_api.draw_w9_Tree.insertNewItem(new_node_id, "sk" + vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spec_num.toString(), "下載 .zip 檔", 
														function(){ 
															var idn = this.id.split("sk");
															document.getElementById("download_iframe").src = vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spec_kml_link_arr[idn[1] - 1];
														}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
							vueapp_dual_spectrum_api.$refs.dual_spectrum_api.draw_w9_Tree.showItemCheckbox("sk" + vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spec_num.toString(), false);

							// Download button Default : closed
							vueapp_dual_spectrum_api.$refs.dual_spectrum_api.draw_w9_Tree.closeItem(new_node_id);
						} else {
							alert("回傳檔案發生問題");
						}
						// delete loading signal
						vueapp_dual_spectrum_api.$refs.dual_spectrum_api.draw_w9_Tree.deleteItem(loading_id, false);
						
						btn_enable();
					},
					error: function(jqXHR) {
						console.log("error")
						alert("發生不明錯誤或尚未選擇區域")
						vueapp_dual_spectrum_api.$refs.dual_spectrum_api.draw_w9_Tree.deleteItem(loading_id, false);
						btn_enable();
					}
				});
			} else if ( this.spec_url == "over" ) {
				alert("請選取範圍小於 " + this.spectrum_area_up_limit + " 平方公里範圍進行分析!")
				this.clear_spectrum_region();
			} else if ( this.spec_url == "under" ) {
				alert("請選取範圍大於 " + this.spectrum_area_down_limit + " 平方公里範圍進行分析!")
				this.clear_spectrum_region();
			} else if ( this.spec_url == "same" ) {
				alert("無法比對相同日期影像")
				this.clear_spectrum_region();
			} else if ( this.spec_url == "bigB" ) {
				alert("日期順序錯誤")
				this.clear_spectrum_region();
			} else if ( this.spec_url == "range_limit" ) {
				alert("日期區間請選擇一個月內")
				this.clear_spectrum_region();
			}else {
				alert("尚未設定選擇區域")
				this.clear_spectrum_region();
			}
		}
    },
    template: `	
<div>
	<div class='ui secondary menu'>
		<a class='item' id='spectrum_button' v-on:click="spectrum_getPoly()"><img src='img/paint06.png' alt=''></a>
		<button class='ui button' v-on:click='clear_spectrum_region()'> clear </button>
	</div>
	<div class='ui form'>
		<div class='fields'>
			<div class='field'>

				<label>起始日期</label>
				<select id="spectrum_list1" v-model="spectrum_list_selected1">
					<!-- class="ui dropdown" style="width:300px;" -->
					<option v-for="list1 in spectrum_list1">{{ list1.value }}</option>
				</select>
				<label>結束日期</label>
				<select id="spectrum_list2" v-model="spectrum_list_selected2">
					<option v-for="list2 in spectrum_list2">{{ list2.value }}</option>
				</select>
				<br>

				<div class="grouped fields">
					<label>波段</label>
					<div class="fields">
						<div class="ui checkbox">
							<input type="checkbox" value="1" id="band_1">
							<label>Band 1 - Coastal aerosol</label>
						</div>
					</div>
					<div class="fields">
						<div class="ui checkbox">
							<input type="checkbox" value="2" id="band_2">
							<label>Band 2 - Blue</label>
						</div>
					</div>
					<div class="fields">
						<div class="ui checkbox">
							<input type="checkbox" value="3" id="band_3">
							<label>Band 3 - Green</label>
						</div>
					</div>
					<div class="fields">
						<div class="ui checkbox">
							<input type="checkbox" value="4" id="band_4">
							<label>Band 4 - Red</label>
						</div>
					</div>
					<div class="fields">
						<div class="ui checkbox">
							<input type="checkbox" value="5" id="band_5">
							<label>Band 5 - Vegetation Red Edge</label>
						</div>
					</div>
					<div class="fields">
						<div class="ui checkbox">
							<input type="checkbox" value="6" id="band_6">
							<label>Band 6 - Vegetation Red Edge</label>
						</div>
					</div>
					<div class="fields">
						<div class="ui checkbox">
							<input type="checkbox" value="7" id="band_7">
							<label>Band 7 - Vegetation Red Edge</label>
						</div>
					</div>
					<div class="fields">
						<div class="ui checkbox">
							<input type="checkbox" value="8" id="band_8">
							<label>Band 8 - NIR</label>
						</div>
					</div>
					<div class="fields">
						<div class="ui checkbox">
							<input type="checkbox" value="9" id="band_9">
							<label>Band 8A - Vegetation Red Edge</label>
						</div>
					</div>
					<div class="fields">
						<div class="ui checkbox">
							<input type="checkbox" value="10" id="band_10">
							<label>Band 9 - Water vapour</label>
						</div>
					</div>
					<div class="fields">
						<div class="ui checkbox">
							<input type="checkbox" value="11" id="band_11">
							<label>Band 10 - SWIR - Cirrus</label>
						</div>
					</div>
					<div class="fields">
						<div class="ui checkbox">
							<input type="checkbox" value="12" id="band_12">
							<label>Band 11 - SWIR</label>
						</div>
					</div>
					<div class="fields">
						<div class="ui checkbox">
							<input type="checkbox" value="13" id="band_13">
							<label>Band 12 - SWIR</label>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="ui toggle checkbox" id="spectrum_cb">
			<input type="checkbox" id="spectrum_checked" v-model="spectrum_cb">
			<label>開啟</label>
		</div>
	</div>
	<br><br>
	<button class='ui button' id="spectrum_get" v-on:click="spectrum_getKml()">執行</button>
	<div id='treeBox_dual_spectrum' style='width:100%;height:200;'></div>
</div>
`
});
Vue.component('Sentinel2_compare_api', {
    props:  {
        maps: null,
        map_ind: null,
    },
    data: function () {
        return {
			sentinel2_compare_arr: [],
			curr_sentinel_layer1:null,
			curr_sentinel_layer2:null,

			sentinel2_compare_source1:null,
			sentinel2_compare_vector1:null,
			sentinel2_compare_source2:null,
			sentinel2_compare_vector2:null,

			sentinel2_compare_region:null,
			sen_modifyInteraction:null,

			c_avg_lat: 0,
			c_avg_lng: 0,

			// 選取範圍上下限
			compare_area_up_limit: 50.0,  
			compare_area_down_limit: 4.0,

			c_sen_url:null,
			sentinel2_compare_area: null,
			
			sentinel2_compare_cb: false,//開關目前狀態
			sentinel2_list_selected1:'', // v-model with template1
			sentinel2_list_selected2:'', // v-model with template2
			sentinel2_poly_open:0,//poly是否運作
			sentinel2_arr_html1:[],// 左下拉選單內容
			sentinel2_arr_html2:[],// 右下拉選單內容
			from_poly: 0,
			
			//for getKml，in draw.js past
			sentinel2_compare_num: 0,
			sentinel2_compare_kml_link_arr: [],
			draw_w7_Tree:null,
        }
    },
    watch: {
		sentinel2_list_selected1 : function(){
			this.sentinel2_onchange1();
		},
		sentinel2_list_selected2 : function(){
			this.sentinel2_onchange2();
		},
		sentinel2_compare_cb:function(){
			this.sentinel2_cb_onchange();
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
					self.sentinel2_compare_arr = $(xml).children().children()
					// add to list
 					for (let i = 0; i < $(xml).children().children().length; i++) {
						let str = $(xml).children().children()[i].getAttribute('text')
						
						let o1 = new Option(str, str);
						$(o1).html(str)
						self.sentinel2_arr_html1.push(o1);
						
						let o2 = new Option(str, str);
						$(o2).html(str)
						self.sentinel2_arr_html2.push(o2);
					} 
					// set the default layer
					self.curr_sentinel_layer1 = self.sentinel2_compare_arr[0];
					self.curr_sentinel_layer2 = self.sentinel2_compare_arr[0];
					// add the event 'change', change the image when the selection change
					self.sentinel2_list_selected1 = self.sentinel2_compare_arr[0].getAttribute('text');
					self.sentinel2_list_selected2 = self.sentinel2_compare_arr[0].getAttribute('text');
				},
				error: function (jqXHR) {
					$("#sentinel_block").css("display", "none");
				}
			});

			if (!this.sentinel2_compare_cb) {
				//$("#sentinel_polyCompare_button").off('click');
				this.sentinel2_poly_open = 0;
			} else {
				//$("#sentinel_polyCompare_button").on('click', function(e){Sentinel2_compare_getPoly()});
				this.sentinel2_poly_open = 1;
			}

			this.c_sen_url = "";
			this.sentinel2_compare_area = 0;
			
			
			//for getKml，in draw.js past
			this.draw_w7_Tree = new dhtmlXTreeObject("treeBox_sentinel2_compare", "100%", "100%", 0);
			this.draw_w7_Tree.setImagePath("codebase/imgs/dhxtree_material/");
			this.draw_w7_Tree.enableCheckBoxes(1);
			this.draw_w7_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
			this.draw_w7_Tree.setOnCheckHandler(this.Layer_Tree_OnCheck_Sentinel2_Compare_Tree);
			this.draw_w7_Tree.setOnDblClickHandler(Location_Grid_DblClicked); 
		})
	},
    methods: {
		Layer_Tree_OnCheck_Sentinel2_Compare_Tree(rowId, state){
			Layer_Tree_Oncheck_Pre("draw_w7_Tree",rowId, state);
		},
		sentinel2_cb_onchange(){ //checkBox開關時，開關圖層
			if(this.sentinel2_compare_cb) {

				
				vueapp_sentinel2_api.$refs.sentinel2_api.clear_sentinel2()

				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.clear_sentinel2_sis("all")
				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.clear_sentinel2_sis("left")
				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.clear_sentinel2_sis("right")

				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.clear_spectrum("left")
				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.clear_spectrum("right")

				vueapp_subscene_image_api.$refs.subscene_image_api.clear_subscene("left")
				vueapp_subscene_image_api.$refs.subscene_image_api.clear_subscene("right")

				$('#sentinel_checked').prop("checked", false)
				$('#sentinel_sis_checked').prop("checked", false)
				$('#spectrum_checked').prop("checked", false)
				$('#subscene_checked').prop("checked", false)

				vueapp_sentinel2_api.$refs.sentinel2_api.clear_sentinel2_region()
				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.clear_sentinel2_sis_region()
				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.clear_spectrum_region()
				vueapp_subscene_image_api.$refs.subscene_image_api.clear_subscene_region()
				vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_cb = false
				vueapp_subscene_image_api.$refs.subscene_image_api.vue_subscene_cb = false
				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_cb = false
				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spectrum_cb = false
				this.set_sentinel2_compare("left")
				this.set_sentinel2_compare("right")
				map_win_double()
				if(this.from_poly == 1){
					this.Sentinel2_getPoly()
				}
			}
			else {
				this.clear_sentinel2_compare("left")
				this.clear_sentinel2_compare("right")
				if(!vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_cb && !vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_cb && !vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_cb 
				&& !vueapp_subscene_image_api.$refs.subscene_image_api.vue_subscene_cb && !vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spectrum_cb)
				{map_win_single();}
				this.clear_sentinel2_compare_region()
				this.from_poly = 0
			}
		},		
		
 		// 2.清除原本的衛星影像圖層
		clear_sentinel2_compare(map)
		{
			
			//$("#sentinel_polyCompare_button").off('click');
			this.sentinel2_poly_open = 0;
			this.c_sen_url = "";
			// 左視窗
			if (map == "left" ) {
				if (this.sentinel2_compare_vector1) {
					maps[map_ind].removeLayer(this.sentinel2_compare_vector1);
					this.sentinel2_compare_vector1 = "";
					this.sentinel2_compare_source1 = "";
				}
			}
			// 右視窗
			else if ( map == "right" ) {
				if (this.sentinel2_compare_vector2) {
					maps[map_ind ^ 0x1].removeLayer(this.sentinel2_compare_vector2);
					this.sentinel2_compare_vector2 = "";
					this.sentinel2_compare_source2 = "";		
				}
			}
		},
		// 3.清除所選的區域
		clear_sentinel2_compare_region()
		{
			this.sentinel2_compare_area = 0
			this.c_sen_url = ""
			this.sentinel2_compare_region = ""
			clear_map()
		},
		// 4.更改左圖層選擇的選項時改變左視窗要顯示的衛星影像
		sentinel2_onchange1() {
			for (var i = 0; i < this.sentinel2_compare_arr.length; i++) {
				if (this.sentinel2_compare_arr[i].getAttribute('text') === this.sentinel2_list_selected1) {
					this.curr_sentinel_layer1 = this.sentinel2_compare_arr[i];
				}
			}
			this.c_sen_url = "";

			if (this.sentinel2_compare_cb) {
				this.clear_sentinel2_compare("left")
				this.set_sentinel2_compare("left")
			}
		},
		// 5.更改右圖層選擇的選項時改變右視窗要顯示的衛星影像
		sentinel2_onchange2() {
			for (var i = 0; i < this.sentinel2_compare_arr.length; i++) {
				if (this.sentinel2_compare_arr[i].getAttribute('text') === this.sentinel2_list_selected2) {
					this.curr_sentinel_layer2 = this.sentinel2_compare_arr[i];
				}
			}
			this.c_sen_url = "";

			if (this.sentinel2_compare_cb) {
				this.clear_sentinel2_compare("right")
				this.set_sentinel2_compare("right")
			}
		},
		
		// 6.顯示衛星影像
		set_sentinel2_compare(map) {
			if ( map === "left" ) {
				//$("#sentinel_polyCompare_button").on('click', function(e){Sentinel2_getComparePoly()});
				this.sentinel2_poly_open = 1;
				//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016

				let curr_layer = JSON.parse(this.curr_sentinel_layer1.getAttribute('id'));
					
				this.sentinel2_compare_source1 = new ol.source.TileImage({
					tileUrlFunction: function(tileCoord){

						var z = tileCoord[0];
						var x = tileCoord[1]-1;
						var y = -tileCoord[2]-1;					
						return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
					},
					crossOrigin:'anonymous'
				})
				
				this.sentinel2_compare_vector1 = new ol.layer.Tile({
					source: vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_source1
				});
				
				this.sentinel2_compare_vector1.setZIndex(1);
				
				maps[map_ind].addLayer(this.sentinel2_compare_vector1);
			} else if ( map === "right" ) {
				//$("#sentinel_polyCompare_button").on('click', function(e){Sentinel2_getComparePoly()});
				this.sentinel2_poly_open = 1;
				//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016

				let curr_layer = JSON.parse(this.curr_sentinel_layer2.getAttribute('id'));
					
				this.sentinel2_compare_source2 = new ol.source.TileImage({
					tileUrlFunction: function(tileCoord){

						var z = tileCoord[0];
						var x = tileCoord[1]-1;
						var y = -tileCoord[2]-1;					
						return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
					},
					crossOrigin:'anonymous'
				})
				
				this.sentinel2_compare_vector2 = new ol.layer.Tile({
					source: vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_source2
				});
				
				this.sentinel2_compare_vector2.setZIndex(1);
				
				maps[map_ind^0x1].addLayer(this.sentinel2_compare_vector2);
			}
		},
		
		// 7.畫出選取範圍
		Sentinel2_getPoly() {
			if(this.sentinel2_poly_open  == 0){
				this.from_poly = 1
				this.sentinel2_compare_cb = 1
			}
				document.getElementById("space_lonlat").checked = true;
				
				this.clear_sentinel2_compare_region();
			 
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
						vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
						
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
						//sentinel2_compare_region=120.7258760671514%2C24.11023190418376%3B120.7425065966939%2C24.07755520679549%3B120.7972651666654%2C24.07795616672053%3B120.8060511576072%2C24.11258739313845%3B120.7931073286575%2C24.12840319631653%3B120.7602521139275%2C24.13013827730786%3B120.7258760671514%2C24.11023190418376
							
						coor = e.feature.getGeometry().getCoordinates()[0];
						
						//var before = curr_sentinel_layer1.getAttribute('text').split("_")[0]
						//var after = curr_sentinel_layer2.getAttribute('text').split("_")[0]
						//var date = "before=" + before
						//date = date + "&after=" + after
						
						vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_region = "&region="
						/*
						up = 0;
						down = 1000;
						left = 1000;
						right = 0;
						*/
						
						var coor_00;  // start point
						
						for (var i = 0 ; i < coor.length; i++)
						{
							// convert the coordinate
							var coor_84 = ol.proj.transform([coor[i][0],coor[i][1]], 'EPSG:3857', 'EPSG:4326');
							
							if (i == 0)  // start point
								coor_00 = coor_84;

							vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_region = vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_region + coor_84[0] + "," + coor_84[1] + ";";
							
							vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.c_avg_lng = vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.c_avg_lng + coor_84[0]
							vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.c_avg_lat = vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.c_avg_lat + coor_84[1]
							
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
						
						vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.c_avg_lat /= coor.length
						vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.c_avg_lng /= coor.length
						
						vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_region = vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_region + coor_00[0] + "," + coor_00[1];
						
						/* check the size of the selected area
						if ( sentinel2_compare_area / 1000000 <= compare_area_up_limit ) {
							c_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?" + date + sentinel2_compare_region
						} else {
							c_sen_url = "over";
						}
						// check the order of left and right 
						if ( before === after ) {
							c_sen_url = "same"
						} else if ( parseInt(before) > parseInt(after) ) {
							c_sen_url = "bigB"
						}
						*/
						
						maps[map_ind].removeInteraction(draw_box);
						
						btn_enable();
						
					}, this);
				  //Layer_Grid_Oncheck(ch_lay_root_name,ch_id,0,document.getElementById(ch_id).checked);
		},
		// 8.傳送資料給後端抓取圖片
		Sentinel2_getKml() {
			// false
			//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20180401&after=20180416&sentinel2_compare_region=121.05791856764648%2C23.472071219430262%3B121.06381455922852%2C23.47116986237836%3B121.05944715805664%2C23.468666060484367%3B121.05791856764648%2C23.472071219430262%3B121.05791856764648%2C23.472071219430262
			//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20180401%26after=20180426%26region=121.21850967407228%2C23.731985247786838%3B121.23606204986574%2C23.72821370461088%3B121.22009754180908%2C23.713558652272837%3B121.21850967407228%2C23.731985247786838%3B121.21850967407228%2C23.731985247786838
			// good
			//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20170720&after=20180215&sentinel2_compare_region=120.8567532193329,23.44596794215077;120.8544248505181,23.44398906434632;120.8571331157023,23.43952378142274;120.8568156585571,23.42394034620056;120.8645144837861,23.41276606561682;120.8808192243636,23.41144157211883;120.8991404716364,23.40942189935453;120.9184096891597,23.41383678688257;120.9135910841748,23.42499799183454;120.9053071990364,23.43399841091956;120.9095216000687,23.43628025052095;120.9099051855738,23.4379326384103;120.9102833774821,23.443878444641;120.8990782494477,23.44899108355424;120.8796324875291,23.44922327790944;120.8782378022941,23.44467160253231;120.8688457630732,23.44387630455463;120.8606020017506,23.44685268235575;120.8567532193329,23.44596794215077
			
			var before = this.curr_sentinel_layer1.getAttribute('text').split("_")[0]
			var after = this.curr_sentinel_layer2.getAttribute('text').split("_")[0]
			var date = "before=" + before
			date = date + "&after=" + after
			// check the size of selected area
			if ( this.sentinel2_compare_area / 1000000 <= this.compare_area_up_limit && this.sentinel2_compare_area / 1000000 >= this.compare_area_down_limit ) {
				//c_sen_url = "https://apis.geodac.tw:31343/geoinfo_api/api/geodac/compute/elsadscd?" + date + sentinel2_compare_region
				this.c_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?" + date + this.sentinel2_compare_region
				//before=20170720&after=20180215&region=120.8567532193329,23.44596794215077;120.8544248505181,23.44398906434632;120.8571331157023,23.43952378142274;120.8568156585571,23.42394034620056;120.8645144837861,23.41276606561682;120.8808192243636,23.41144157211883;120.8991404716364,23.40942189935453;120.9184096891597,23.41383678688257;120.9135910841748,23.42499799183454;120.9053071990364,23.43399841091956;120.9095216000687,23.43628025052095;120.9099051855738,23.4379326384103;120.9102833774821,23.443878444641;120.8990782494477,23.44899108355424;120.8796324875291,23.44922327790944;120.8782378022941,23.44467160253231;120.8688457630732,23.44387630455463;120.8606020017506,23.44685268235575;120.8567532193329,23.44596794215077";
				//c_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?" + date + sentinel2_compare_region
			} else if ( this.sentinel2_compare_area / 1000000 > this.compare_area_up_limit ) {
				this.c_sen_url = "over";
			} else if ( this.sentinel2_compare_area / 1000000 < this.compare_area_down_limit ) {
				this.c_sen_url = "under";
			} else if ( this.sentinel2_compare_region == "" ) {
				this.c_sen_url = "";
			}
			// check the order (left < right)
			if ( before === after ) {
				this.c_sen_url = "same"
			} else if ( parseInt(before) > parseInt(after) ) {
				this.c_sen_url = "bigB"
			}

			console.log(this.c_sen_url)
			
			if ( this.c_sen_url != "under" && this.c_sen_url != "over" && this.c_sen_url != "same" && this.c_sen_url != "bigB" && this.c_sen_url != "" ) {
				
				btn_disable();
				
				loading_id = "l"+this.sentinel2_compare_num.toString();		
				this.draw_w7_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');		
				this.draw_w7_Tree.enableCheckBoxes(false, false);

				// send the data
				$.ajax({
					type: 	"GET",
					url:	"php/get_elsadscd.php",
					dataType:	"json",
					data: {
						u: vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.c_sen_url
					},
					//jsonpCallback: 'callback',
					success: function(json) {
						console.log(json.result)				
						if ( json.result != false ) {
							console.log(json.diskmlFilePath);
							
							tmp_compare_kml_arr = [];
							tmp_compare_kml_arr.push(json.diskmlFilePath);
							tmp_compare_kml_arr.push(json.newkmlFilePath);
							console.log("tmp_arr : " + tmp_compare_kml_arr);
							vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_kml_link_arr.push(tmp_compare_kml_arr);

							vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_num = vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_num + 1;
									
							new_node_id_dis = `{
								"PosInfo":"${vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.c_avg_lat + ";" + vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.c_avg_lng + ";563426;8;#FFFF00;;;;;"}",
								"Type":"Kml",
								"Url":"${json.diskmlFilePath}",
								"ID":"Sentinel2_Compare${vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_num.toString()}",
								"FileName":"Sentinel2_Compare-${vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_num.toString()}_${before}_${after}_Disappear"
							}`.replace(/\n|\t/g, "").trim();
							
							
							new_node_id_new = `{
								"PosInfo":"${vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.c_avg_lat + ";" + vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.c_avg_lng + ";563426;8;#FFFF00;;;;;"}",
								"Type":"Kml",
								"Url":"${json.newkmlFilePath}",
								"ID":"Sentinel2_Compare${vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_num.toString()}",
								"FileName":"Sentinel2_Compare-${vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_num.toString()}_${before}_${after}_New"
							}`.replace(/\n|\t/g, "").trim();
							
							
							vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.draw_w7_Tree.enableCheckBoxes(true, true);
							var TotalArea=0;
							var xhttp = new XMLHttpRequest();
							xhttp.onreadystatechange = function() {
							if (this.readyState == 4 && this.status == 200) {	
								TotalArea=vueapp_sentinel2_api.$refs.sentinel2_api.xmlread_Function(this);//從kml取得總面積	
								// layer item (Disappear)
								vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.draw_w7_Tree.insertNewChild("0", new_node_id_dis, "Sentinel2_Compare-" + vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_num.toString() + "_" + before + "_" + after + "_Disappear" +TotalArea, function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								// add download item	
								vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.draw_w7_Tree.insertNewItem(new_node_id_dis, "skc_dis" + vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_num.toString(), "下載 .kml 檔", 
															function(){ 
																var idn = this.id.split("skc_dis");
																document.getElementById("download_iframe").src = vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_kml_link_arr[idn[1] - 1][0];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.draw_w7_Tree.showItemCheckbox("skc_dis" + vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_num.toString(), false);
								};
							}
							xhttp.open("GET", json.diskmlFilePath, true);
							xhttp.send();
							var TotalArea=0;
							var xhttp = new XMLHttpRequest();
							xhttp.onreadystatechange = function() {
							if (this.readyState == 4 && this.status == 200) {
									TotalArea=vueapp_sentinel2_api.$refs.sentinel2_api.xmlread_Function(this);//從kml取得總面積	
								// layer item (New)
								vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.draw_w7_Tree.insertNewChild("0", new_node_id_new, "Sentinel2_Compare-" + vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_num.toString() + "_" + before + "_" + after + "_New" +TotalArea, function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								// add download item 
								vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.draw_w7_Tree.insertNewItem(new_node_id_new, "skc_new" + vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_num.toString(), "下載 .kml 檔", 
															function(){ 
																var idn = this.id.split("skc_new");
																document.getElementById("download_iframe").src = vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_kml_link_arr[idn[1] - 1][1];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
								vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.draw_w7_Tree.showItemCheckbox("skc_new" + vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_num.toString(), false);
							};
							}
							xhttp.open("GET", json.newkmlFilePath, true);
							xhttp.send();
							// Download button Default : closed
							vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.draw_w7_Tree.closeItem(new_node_id_dis);
							vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.draw_w7_Tree.closeItem(new_node_id_new);
						} else {
							alert("回傳檔案發生問題或框選範圍包含海域的部分，請重新框選分析範圍!");
						}
						// delete loading signal
						vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.draw_w7_Tree.deleteItem(loading_id, false);
						
						btn_enable();
					},
					error: function(jqXHR) {
						console.log("error")
						alert("發生不明錯誤")
						vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.draw_w7_Tree.deleteItem(loading_id, false);
						btn_enable();
					}
				});
			} else if ( this.c_sen_url == "over" ) {
				alert("請選取範圍小於 " + this.compare_area_up_limit + " 平方公里範圍進行分析!")
				this.clear_sentinel2_compare_region();
			} else if ( this.c_sen_url == "under" ) {
				alert("請選取範圍大於 " + this.compare_area_down_limit + " 平方公里範圍進行分析!")
				this.clear_sentinel2_compare_region();
			} else if ( this.c_sen_url == "same" ) {
				alert("無法比對相同日期影像")
				this.clear_sentinel2_compare_region();
			} else if ( this.c_sen_url == "bigB" ) {
				alert("日期順序錯誤")
				this.clear_sentinel2_compare_region();
			} else {
				alert("尚未設定選擇區域")
				this.clear_sentinel2_compare_region();
			}
		}
    },
    template: `	
<div>
	<div class='ui secondary menu'>
		<a class='item' id='sentinel_polyCompare_button' v-on:click="Sentinel2_getPoly()"><img src='img/paint03.png' alt=''></a>
		<button class='ui button' v-on:click='clear_sentinel2_compare_region()'> clear </button>
	</div>
	<div class='ui form'>
		<div class='fields'>
			<div class='field'>
				<label>之前 (左圖層)</label>
				<select id="sentinel2_compare_list1" v-model="sentinel2_list_selected1" class="ui dropdown" style="width:300px;"><!-- class="ui dropdown" style="width:300px;" -->
					<option v-for="list1 in sentinel2_arr_html1">{{ list1.value }}</option>
				</select>
				<label>之後 (右圖層)</label>
				<select id="sentinel2_compare_list2" v-model="sentinel2_list_selected2" class="ui dropdown" style="width:300px;"><!-- class="ui dropdown" style="width:300px;" -->
					<option v-for="list2 in sentinel2_arr_html2">{{ list2.value }}</option>
				</select>
			</div>
		</div>
		<div class="ui toggle checkbox" id="sentinel_compare_cb">
			<input type="checkbox" id="sentinel_compare_checked" v-model="sentinel2_compare_cb">
			<label>開啟</label>
		</div>
	</div>
	<br><br>
	<button class='ui button' id="Sentinel2_getCompare" v-on:click="Sentinel2_getKml()">執行</button>
	<div id='treeBox_sentinel2_compare' style='width:100%;height:200;'></div>
</div>
`
});
Vue.component('Subscene_image_api', {
    props:  {
        maps: null,
        map_ind: null,
    },
    data: function () {
        return {
			subscene_arr: [],
			curr_subscene_layer1: null,
			curr_subscene_layer2: null,

			curr_subscene_layer1_ind:1,
			curr_subscene_layer2_ind:1,

			subscene_source1: null,
			subscene_vector1: null,
			subscene_source2: null,
			subscene_vector2: null,

			subscene_region: null,

			subs_avg_lat: 0,
			subs_avg_lng: 0,

			subscene_area_up_limit: 10.0,
			subscene_area_down_limit: 0.0,

			subs_sen_url:null,
			subscene_area:null,

			subs_left:null ,
			subs_right:null ,
			subs_up:null ,
			subs_down:null,

			subscene_year1:null,
			subscene_month1:null ,
			subscene_day1:null,
			subscene_year2:null,
			subscene_month2:null,
			subscene_day2:null,

			subscene_start_x:null,
			subscene_start_y:null,
			subscene_end_x:null,
			subscene_end_y:null,
			subscene_classcode:null,//$("#subscene_classcode").val().toString()
			
			
			vue_subscene_cb: false,//開關目前狀態
			subscene_list_selected1:'', // v-model with template1
			subscene_list_selected2:'', // v-model with template2
			subscene_poly_open:0,//poly是否運作
			subscene_arr_html1:[],// 左下拉選單內容
			subscene_arr_html2:[],// 右下拉選單內容
			from_poly:0,
			
			//for getKml，in draw.js past
			subscene_num: 0,
			subscene_zip_link_arr: [],
			subscene_Tree:null ,
        }
    },
    watch: {
		subscene_list_selected1 : function(){
			this.subscene_onchange1();
		},
		subscene_list_selected2 : function(){
			this.subscene_onchange2();
		},
		vue_subscene_cb:function(){
			this.vue_subscene_cb_onchange();
		},
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
					self.subscene_arr = $(xml).children().children()
					// add to list			
					for (var i = 0; i < $(xml).children().children().length; i++) {
						var str = $(xml).children().children()[i].getAttribute('text')
						var o1 = new Option(str, str);
						var o2 = new Option(str, str);
						self.subscene_year1 = str.substr(0, 4)
						self.subscene_month1 = str.substr(4, 2)
						self.subscene_day1 = str.substr(6, 2)
						self.subscene_year2 = str.substr(0, 4)
						self.subscene_month2 = str.substr(4, 2)
						self.subscene_day2 = str.substr(6, 2)
						$(o1).html(str)
						$(o2).html(str)
						self.subscene_arr_html1.push(o1);
						self.subscene_arr_html2.push(o2);
					}
					
					self.curr_subscene_layer1 = self.subscene_arr[0]
					self.subscene_year1 = self.curr_subscene_layer1.getAttribute('text').substr(0, 4)
					self.subscene_month1 = self.curr_subscene_layer1.getAttribute('text').substr(4, 2)
					self.subscene_day1 = self.curr_subscene_layer1.getAttribute('text').substr(6, 2)
					self.subscene_list_selected1 = self.subscene_arr[0].getAttribute('text');

					self.curr_subscene_layer2 = self.subscene_arr[0]
					self.subscene_year2 = self.curr_subscene_layer2.getAttribute('text').substr(0, 4)
					self.subscene_month2 = self.curr_subscene_layer2.getAttribute('text').substr(4, 2)
					self.subscene_day2 = self.curr_subscene_layer2.getAttribute('text').substr(6, 2)
					self.subscene_list_selected2 = self.subscene_arr[0].getAttribute('text');

				},
				error: function (jqXHR) {
					$("#sentinel_block").css("display", "none");
				}
			});

			if (!this.vue_subscene_cb) {
				this.subscene_poly_open = 0;
			} else {
				this.subscene_poly_open = 1;
			}

			this.subs_sen_url = "";
			this.subscene_area = 0;
			
			//for getKml，in draw.js past
			this.subscene_Tree = new dhtmlXTreeObject("treeBox_subscene", "100%", "100%", 0);
			this.subscene_Tree.setImagePath("codebase/imgs/dhxtree_material/");
			this.subscene_Tree.enableCheckBoxes(1);
			this.subscene_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
			this.subscene_Tree.setOnCheckHandler(this.Layer_Tree_OnCheck_Subscene_Tree);
			this.subscene_Tree.setOnDblClickHandler(Location_Grid_DblClicked);
		})
	},
    methods: {
		Layer_Tree_OnCheck_Subscene_Tree(rowId, state){
			Layer_Tree_Oncheck_Pre("subscene_Tree",rowId, state);
		},
		
		SubsceneBaseOnChange(){
			this.clear_subscene("left")
			this.clear_subscene("right")
			this.subscene_arr = []
			
			//if ( $("#subscene_classcode").val().toString() === "sentinel2" ) {//
			if(this.subscene_classcode === "sentinel2"){//
				
				/*
				var length1 = $("#subscene_list1").options.length;
				var length2 = $("#subscene_list2").options.length;
				
				for (var i = 0; i < length1; i++) {
					$("#subscene_list1").remove(i)
				}
				
				for (var i = 0; i < length2; i++) {
					$("#subscene_list2").remove(i)
				}
				*/
				
				//$("#subscene_list1").empty();
				//$("#subscene_list2").empty();
				while (subscene_arr_html1.length) {
					subscene_arr_html1.pop();
				}
				while (subscene_arr_html2.length) {
					subscene_arr_html2.pop();
				}
				
				
				// php/BL_A01_T02.php
				var self = this;
				$.ajax({
					type: 	"GET",
					url:	"php/BL_A01_T02.php",
					dataType:	"xml",
					//jsonpCallback: 'callback',
					success: function(xml) {
							
						console.log("sentinel2")
							
						self.subscene_arr = $(xml).children().children()
							
						for (var i = 0; i < $(xml).children().children().length; i++) {
							var str = $(xml).children().children()[i].getAttribute('text')
							var o1 = new Option(str, str);
							var o2 = new Option(str, str);
							self.subscene_year1 = str.substr(0, 4)
							self.subscene_month1 = str.substr(4, 2)
							self.subscene_day1 = str.substr(6, 2)
							self.subscene_year2 = str.substr(0, 4)
							self.subscene_month2 = str.substr(4, 2)
							self.subscene_day2 = str.substr(6, 2)
							$(o1).html(str)
							$(o2).html(str)
							self.subscene_arr_html1.push(o1);
							self.subscene_arr_html2.push(o2);
							//$("#subscene_list1").append(o1);
							//$("#subscene_list2").append(o2);
							//console.log($(xml).children().children()[i].getAttribute('id'))
						}
						
						self.curr_subscene_layer1 = self.subscene_arr[0]
						self.subscene_year1 = self.curr_subscene_layer1.getAttribute('text').substr(0, 4)
						self.subscene_month1 = self.curr_subscene_layer1.getAttribute('text').substr(4, 2)
						self.subscene_day1 = self.curr_subscene_layer1.getAttribute('text').substr(6, 2)
						self.subscene_list_selected1 = self.subscene_arr[0].getAttribute('text');
						//$("#subscene_list1").on("change", subscene_onchange1);
						self.curr_subscene_layer2 = self.subscene_arr[0]
						self.subscene_year2 = curr_subscene_layer2.getAttribute('text').substr(0, 4)
						self.subscene_month2 = curr_subscene_layer2.getAttribute('text').substr(4, 2)
						self.subscene_day2 = curr_subscene_layer2.getAttribute('text').substr(6, 2)
						self.subscene_list_selected2 = self.subscene_arr[0].getAttribute('text');
						//$("#subscene_list2").on("change", subscene_onchange2);
						
						self.set_subscene("left")
						self.set_subscene("right")
					},
					error: function(jqXHR) {
						$("#subscene_block").css("display","none");
					}
				});
				
				
			} else if(this.subscene_classcode === "sentinel1" ) {
				/*
				var length1 = $("#subscene_list1").options.length;
				var length2 = $("#subscene_list2").options.length;
				
				for (var i = 0; i < length1; i++) {
					$("#subscene_list1").remove(i)
				}
				
				for (var i = 0; i < length2; i++) {
					$("#subscene_list2").remove(i)
				}
				*/
				//$("#subscene_list1").empty();
				//$("#subscene_list2").empty();
				while (subscene_arr_html1.length) {
					subscene_arr_html1.pop();
				}
				while (subscene_arr_html2.length) {
					subscene_arr_html2.pop();
				}
				
				// php/BL_A01_T05.php
				var self = this;
				$.ajax({
					type: 	"GET",
					url:	"php/BL_A01_T05.php",
					dataType:	"xml",
					//jsonpCallback: 'callback',
					success: function(xml) {
							
							
						self.subscene_arr = $(xml).children().children()
							
						for (var i = 0; i < $(xml).children().children().length; i++) {
							var str = $(xml).children().children()[i].getAttribute('text')
							var o1 = new Option(str, str);
							var o2 = new Option(str, str);
							self.subscene_year1 = str.substr(0, 4)
							self.subscene_month1 = str.substr(4, 2)
							self.subscene_day1 = str.substr(6, 2)
							self.subscene_year2 = str.substr(0, 4)
							self.subscene_month2 = str.substr(4, 2)
							self.subscene_day2 = str.substr(6, 2)
							$(o1).html(str)
							$(o2).html(str)
							self.subscene_arr_html1.push(o1);
							self.subscene_arr_html2.push(o2);
							//$("#subscene_list1").append(o1);
							//$("#subscene_list2").append(o2);
							//console.log($(xml).children().children()[i].getAttribute('id'))
						}
						
						self.curr_subscene_layer1 = self.subscene_arr[0]
						self.subscene_year1 = self.curr_subscene_layer1.getAttribute('text').substr(0, 4)
						self.subscene_month1 = self.curr_subscene_layer1.getAttribute('text').substr(4, 2)
						self.subscene_day1 = self.curr_subscene_layer1.getAttribute('text').substr(6, 2)
						self.subscene_list_selected1 = self.subscene_arr[0].getAttribute('text');
						//$("#subscene_list1").on("change", subscene_onchange1);
						self.curr_subscene_layer2 = self.subscene_arr[0]
						self.subscene_year2 = curr_subscene_layer2.getAttribute('text').substr(0, 4)
						self.subscene_month2 = curr_subscene_layer2.getAttribute('text').substr(4, 2)
						self.subscene_day2 = curr_subscene_layer2.getAttribute('text').substr(6, 2)
						self.subscene_list_selected2 = self.subscene_arr[0].getAttribute('text');
						//$("#subscene_list2").on("change", subscene_onchange2);
						
						self.set_subscene("left")
						self.set_subscene("right")
					},
					error: function(jqXHR) {
						$("#subscene_block").css("display","none");
					}
					
				});
				
			} else if(this.subscene_classcode === "landset8" ) {
				
				/*
				var length1 = $("#subscene_list1").options.length;
				var length2 = $("#subscene_list2").options.length;
				
				for (var i = 0; i < length1; i++) {
					$("#subscene_list1").remove(i)
				}
				
				for (var i = 0; i < length2; i++) {
					$("#subscene_list2").remove(i)
				}
				*/
				while (subscene_arr_html1.length) {
					subscene_arr_html1.pop();
				}
				while (subscene_arr_html2.length) {
					subscene_arr_html2.pop();
				}
				
				var self = this;
				$.ajax({
					type: 	"GET",
					url:	"php/BL_A01_T03_L.php",
					dataType:	"xml",
					//jsonpCallback: 'callback',
					success: function(xml) {
							
						console.log("sentinel1")
							
						self.subscene_arr = $(xml).children().children()
							
						for (var i = 0; i < $(xml).children().children().length; i++) {
							var str = $(xml).children().children()[i].getAttribute('text')
							var o1 = new Option(str, str);
							var o2 = new Option(str, str);
							self.subscene_year1 = str.substr(0, 4)
							self.subscene_month1 = str.substr(4, 2)
							self.subscene_day1 = str.substr(6, 2)
							self.subscene_year2 = str.substr(0, 4)
							self.subscene_month2 = str.substr(4, 2)
							self.subscene_day2 = str.substr(6, 2)
							$(o1).html(str)
							$(o2).html(str)
							self.subscene_arr_html1.push(o1);
							self.subscene_arr_html2.push(o2);
							//$("#subscene_list1").append(o1);
							//$("#subscene_list2").append(o2);
							//console.log($(xml).children().children()[i].getAttribute('id'))
						}
						
						self.curr_subscene_layer1 = self.subscene_arr[0]
						self.subscene_year1 = self.curr_subscene_layer1.getAttribute('text').substr(0, 4)
						self.subscene_month1 = self.curr_subscene_layer1.getAttribute('text').substr(4, 2)
						self.subscene_day1 = self.curr_subscene_layer1.getAttribute('text').substr(6, 2)
						self.subscene_list_selected1 = self.subscene_arr[0].getAttribute('text');
						//$("#subscene_list1").on("change", subscene_onchange1);
						self.curr_subscene_layer2 = self.subscene_arr[0]
						self.subscene_year2 = curr_subscene_layer2.getAttribute('text').substr(0, 4)
						self.subscene_month2 = curr_subscene_layer2.getAttribute('text').substr(4, 2)
						self.subscene_day2 = curr_subscene_layer2.getAttribute('text').substr(6, 2)
						self.subscene_list_selected2 = self.subscene_arr[0].getAttribute('text');
						//$("#subscene_list2").on("change", subscene_onchange2);
						
						self.set_subscene("left")
						self.set_subscene("right")
					},
					error: function(jqXHR) {
						$("#subscene_block").css("display","none");
					}
				});
			}
		},
		
		
		vue_subscene_cb_onchange(){ //checkBox開關時，開關圖層
			if(this.vue_subscene_cb) {
				

				vueapp_sentinel2_api.$refs.sentinel2_api.clear_sentinel2()

				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.clear_sentinel2_compare("left")
				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.clear_sentinel2_compare("right")

				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.clear_sentinel2_sis("left")
				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.clear_sentinel2_sis("right")
				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.clear_sentinel2_sis("all")

				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.clear_spectrum("left")
				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.clear_spectrum("right")

				
				$('#sentinel_checked').prop("checked", false)
				$('#sentinel_compare_checked').prop("checked", false)
				$('#sentinel_sis_checked').prop("checked", false)
				$('#spectrum_checked').prop("checked", false)

				vueapp_sentinel2_api.$refs.sentinel2_api.clear_sentinel2_region()
				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.clear_sentinel2_compare_region()
				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.clear_sentinel2_sis_region()
				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.clear_spectrum_region()
				
				vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_cb = false
				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_cb = false
				vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_cb = false
				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spectrum_cb = false
				this.set_subscene("left")
				this.set_subscene("right")
				map_win_double()
				if(this.from_poly == 1) {
					this.subscene_getPoly()
				}
			}
			else {
				this.clear_subscene("left")
				this.clear_subscene("right")
				this.clear_subscene_region()
				/*** add 20190513 ***/
				//$("#subscene_poly_button").off('click');
				/********************/
								if(!vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_cb && !vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_cb && !vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_cb 
				&& !vueapp_subscene_image_api.$refs.subscene_image_api.vue_subscene_cb && !vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spectrum_cb)
				{map_win_single();}
				this.from_poly = 0
			}
		},		
		//define in sentinel2_compare_api.js
		
 		// 2.清除原本的衛星影像圖層
		clear_subscene(map)
		{
			
		/* 	$("#subscene_button").off('click');
			subs_sen_url = ""; */
			
			this.subscene_poly_open = 0;
			this.subs_sen_url = "";
			
			if (map == "left" ) {
			
				if (this.subscene_vector1) {
					maps[0].removeLayer(this.subscene_vector1);
					this.subscene_vector1 = "";
					this.subscene_source1 = "";

					//maps[map_ind].addLayer(subscene_vector);
				}
			} else if ( map == "right" ) {
				
				if (this.subscene_vector2) {
					maps[1].removeLayer(this.subscene_vector2);
					this.subscene_vector2 = "";
					this.subscene_source2 = "";		
				}
			}
		},

		// 3.清除所選的區域
		clear_subscene_region()
		{
			this.subscene_area = 0
			this.subs_sen_url = ""
			this.subscene_region = ""
			clear_map()
		},

		// 4.更改選擇的選項時改變要顯示的衛星影像

		subscene_onchange1()
		{
			for (var i = 0; i < this.subscene_arr.length; i++) {
				if ( this.subscene_arr[i].getAttribute('text') === this.subscene_list_selected1 ) {
					this.curr_subscene_layer1_ind=i;
					this.curr_subscene_layer1 = this.subscene_arr[i]
					curr_id1 = this.curr_subscene_layer1.getAttribute('text').toString()
					this.subscene_year1 = curr_id1.substr(0, 4)
					this.subscene_month1 = curr_id1.substr(4, 2)
					this.subscene_day1 = curr_id1.substr(6, 2)
				}
			}
			
			this.subs_sen_url = "";

			if ( this.vue_subscene_cb ) {
				
				this.clear_subscene("left")
				this.set_subscene("left")
			}
		},
		subscene_onchange2()
		{
			for (var i = 0; i < this.subscene_arr.length; i++) {
				if ( this.subscene_arr[i].getAttribute('text') === this.subscene_list_selected2 ) {
					this.curr_subscene_layer2_ind=i;
					this.curr_subscene_layer2 = this.subscene_arr[i]
					curr_id2 = this.curr_subscene_layer2.getAttribute('text').toString()
					this.subscene_year2 = curr_id2.substr(0, 4)
					this.subscene_month2 = curr_id2.substr(4, 2)
					this.subscene_day2 = curr_id2.substr(6, 2)
				}
			}
			
			this.subs_sen_url = "";

			if ( this.vue_subscene_cb ) {
				this.clear_subscene("right")
				this.set_subscene("right")
			}
		},
		// 5.顯示衛星影像
		set_subscene(map){
			if ( map === "left" ) {
				//$("#subscene_button").on('click', function(e){subscene_getPoly()});
				this.subscene_poly_open = 1;
				
				//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016

				let curr_layer = JSON.parse(this.curr_subscene_layer1.getAttribute('id'));
					
				this.subscene_source1 = new ol.source.TileImage({
					tileUrlFunction: function(tileCoord){

						var z = tileCoord[0];
						var x = tileCoord[1]-1;
						var y = -tileCoord[2]-1;					
						return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
					},
					crossOrigin:'anonymous'
				})
				
				this.subscene_vector1 = new ol.layer.Tile({
					source: vueapp_subscene_image_api.$refs.subscene_image_api.subscene_source1
				});
				
				this.subscene_vector1.setZIndex(1);
				
				maps[map_ind].addLayer(this.subscene_vector1);
				
				
				
			} else if ( map === "right" ) {
				//$("#subscene_button").on('click', function(e){subscene_getPoly()});
				this.subscene_poly_open = 1;
				//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016

				let curr_layer = JSON.parse(this.curr_subscene_layer2.getAttribute('id'));

				this.subscene_source2 = new ol.source.TileImage({
					tileUrlFunction: function(tileCoord){

						var z = tileCoord[0];
						var x = tileCoord[1]-1;
						var y = -tileCoord[2]-1;					
						return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
					},
					crossOrigin:'anonymous'
				})
				
				this.subscene_vector2 = new ol.layer.Tile({
					source: vueapp_subscene_image_api.$refs.subscene_image_api.subscene_source2
				});
				
				this.subscene_vector2.setZIndex(1);
				
				maps[map_ind ^ 0x1].addLayer(this.subscene_vector2);
			}
			
		},
		// 6.畫出選取範圍
		subscene_getPoly(){
			if(this.subscene_poly_open == 0){
				this.from_poly = 1
				this.vue_subscene_cb = 1
			}
				document.getElementById("space_lonlat").checked = true;
				
				this.clear_subscene_region();
			 
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
				//value = 'Polygon';
				//var maxPoints;
				value = 'LineString';
				var maxPoints = 2
				
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
					

				var mouse_x;
				var mouse_y;
				
				onmousemove = function(e){mouse_x=e.clientX;mouse_y = e.clientY;}

				draw_box.on('drawstart',
				function (evt) {
					vueapp_subscene_image_api.$refs.subscene_image_api.subscene_start_x = mouse_x;
					vueapp_subscene_image_api.$refs.subscene_image_api.subscene_start_y = mouse_y;

					btn_disable();
					
					sketch = evt.feature;

					console.log(evt);

					var tooltipCoord = evt.coordinate;

					listener = sketch.getGeometry().on('change', function (evt) {
						var geom = evt.target;
						var output;
						output = formatArea(geom);
						tooltipCoord = geom.getInteriorPoint().getCoordinates();
						
						var sourceProj = maps[map_ind].getView().getProjection();
						var geom_t = (geom.clone().transform(sourceProj, 'EPSG:4326'));
						var coordinates = geom_t.getLinearRing(0).getCoordinates();
						vueapp_subscene_image_api.$refs.subscene_image_api.subscene_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
						
						measureTooltipElement.innerHTML = output;
						measureTooltip.setPosition(tooltipCoord);
					});
					
					
				}, this);	
					
				draw_box.on('drawend',
				function (e) {
					
					vueapp_subscene_image_api.$refs.subscene_image_api.subscene_end_x = mouse_x;
					vueapp_subscene_image_api.$refs.subscene_image_api.subscene_end_y = mouse_y;
					//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsasd?
					//date=20180526&
					//subscene_region=120.7258760671514%2C24.11023190418376%3B120.7425065966939%2C24.07755520679549%3B120.7972651666654%2C24.07795616672053%3B120.8060511576072%2C24.11258739313845%3B120.7931073286575%2C24.12840319631653%3B120.7602521139275%2C24.13013827730786%3B120.7258760671514%2C24.11023190418376
						
					console.log(e);

					coor = e.feature.getGeometry().getCoordinates()[0];
					
					box_array=(String(e.feature.getGeometry().getExtent())).split(",");
				
					loc_84=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');
					
					vueapp_subscene_image_api.$refs.subscene_image_api.subs_left = loc_84[0];
					vueapp_subscene_image_api.$refs.subscene_image_api.subs_up = loc_84[1];
					
					loc_84=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');
					
					vueapp_subscene_image_api.$refs.subscene_image_api.subs_right = loc_84[0];
					vueapp_subscene_image_api.$refs.subscene_image_api.subs_down = loc_84[1];
					
					vueapp_subscene_image_api.$refs.subscene_image_api.subscene_region = "&lefttop_x=" + vueapp_subscene_image_api.$refs.subscene_image_api.subs_left + "&rightbottom_x=" + vueapp_subscene_image_api.$refs.subscene_image_api.subs_right + "&lefttop_y=" + vueapp_subscene_image_api.$refs.subscene_image_api.subs_up + "&rightbottom_y=" + vueapp_subscene_image_api.$refs.subscene_image_api.subs_down;
					
					/*
					if ( subscene_area / 1000000 <= subscene_area_up_limit ) {
						subs_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?" + date + subscene_region
					} else {
						subs_sen_url = "over";
					}
					
					if ( before === after ) {
						subs_sen_url = "same"
					} else if ( parseInt(before) > parseInt(after) ) {
						subs_sen_url = "bigB"
					}
					*/
					
					maps[map_ind].removeInteraction(draw_box);
					
					btn_enable();
					
				}, this);
					
				   
				  //Layer_Grid_Oncheck(ch_lay_root_name,ch_id,0,document.getElementById(ch_id).checked);
		 },
		// 7.傳送資料給後端抓取圖片
		subscene_getKml(){
			fun_access_log("Func_Use_Analysis_1_8");
			// false
			//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20180401&after=20180416&subscene_region=121.05791856764648%2C23.472071219430262%3B121.06381455922852%2C23.47116986237836%3B121.05944715805664%2C23.468666060484367%3B121.05791856764648%2C23.472071219430262%3B121.05791856764648%2C23.472071219430262
			//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20180401%26after=20180426%26region=121.21850967407228%2C23.731985247786838%3B121.23606204986574%2C23.72821370461088%3B121.22009754180908%2C23.713558652272837%3B121.21850967407228%2C23.731985247786838%3B121.21850967407228%2C23.731985247786838
			// good
			//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20170720&after=20180215&subscene_region=120.8567532193329,23.44596794215077;120.8544248505181,23.44398906434632;120.8571331157023,23.43952378142274;120.8568156585571,23.42394034620056;120.8645144837861,23.41276606561682;120.8808192243636,23.41144157211883;120.8991404716364,23.40942189935453;120.9184096891597,23.41383678688257;120.9135910841748,23.42499799183454;120.9053071990364,23.43399841091956;120.9095216000687,23.43628025052095;120.9099051855738,23.4379326384103;120.9102833774821,23.443878444641;120.8990782494477,23.44899108355424;120.8796324875291,23.44922327790944;120.8782378022941,23.44467160253231;120.8688457630732,23.44387630455463;120.8606020017506,23.44685268235575;120.8567532193329,23.44596794215077
			var subscene_width = Math.round(Math.abs(this.subscene_end_x - this.subscene_start_x));
			var subscene_height = Math.round(Math.abs(this.subscene_end_y - this.subscene_start_y));
			
			var before = this.curr_subscene_layer1.getAttribute('text').split("_")[0]
			var after = this.curr_subscene_layer2.getAttribute('text').split("_")[0]

			console.log(before)
			console.log(after)
			
			var subscene_method ='byquery';//var subscene_method = $("#subscene_method").val().toString()
			var subscene_classcode ='sentinel2';//var subscene_classcode = $("#subscene_classcode").val().toString()
			var subscene_PixelSize ="&pixel_size="+ $("#subscene_PixelSize").val().toString();
			//var subscene_maxCloud = $("#subscene_maxCloud").val().toString();
			var subscene_time = "&date1=" + this.subscene_year1 + "-" + this.subscene_month1 + "-" + this.subscene_day1 + "&date2=" + this.subscene_year2 + "-" + this.subscene_month2 + "-" + this.subscene_day2;
			
			if ( this.subscene_area / 1000000 <= this.subscene_area_up_limit && this.subscene_area / 1000000 >= this.subscene_area_down_limit ) {
				this.subs_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/subsceneimage/" + subscene_method + "?classcode[]=" + subscene_classcode + 
							   subscene_time + this.subscene_region + subscene_PixelSize
			} else if ( this.subscene_area / 1000000 > this.subscene_area_up_limit ) {
				this.subs_sen_url = "over";
			} else if ( this.subscene_area / 1000000 < this.subscene_area_down_limit ) {
				this.subs_sen_url = "under";
			} else if ( subscene_region == "" ) {
				this.subs_sen_url = "";
			}
			
			if ( before === after ) {
				this.subs_sen_url = "same"
			} else if ( parseInt(before) > parseInt(after) ) {
				this.subs_sen_url = "bigB"
			}
			
			if(this.curr_subscene_layer1_ind-this.curr_subscene_layer2_ind>5){
				this.subs_sen_url = "range_limit"
			}
			console.log(this.subs_sen_url)
			
			if ( this.subs_sen_url != "under" && this.subs_sen_url != "over" && this.subs_sen_url != "same" && this.subs_sen_url != "bigB" &&this.subs_sen_url != "range_limit"&& this.subs_sen_url != "" ) {
				
				btn_disable();
				
				loading_id = "l"+this.subscene_num.toString();
				
				this.subscene_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
				
				this.subscene_Tree.enableCheckBoxes(false, false);
				
				$.ajax({
					type: 	"GET",
					url:	"php/get_subscene.php",
					dataType:	"json",
					data: {
						u: vueapp_subscene_image_api.$refs.subscene_image_api.subs_sen_url,
						n: (vueapp_subscene_image_api.$refs.subscene_image_api.subscene_num + 1)
					},
					//jsonpCallback: 'callback',
					success: function(json) {
						console.log(json.result)
						
						if ( json.result != false ) {
							
							vueapp_subscene_image_api.$refs.subscene_image_api.subscene_zip_link_arr.push(json.imgZipPath);
							
							vueapp_subscene_image_api.$refs.subscene_image_api.subscene_num = vueapp_subscene_image_api.$refs.subscene_image_api.subscene_num + 1;
									
							new_node_id = `{
								"PosInfo":"${((vueapp_subscene_image_api.$refs.subscene_image_api.subs_up + vueapp_subscene_image_api.$refs.subscene_image_api.subs_down) / 2.0).toString() + ";" + 
											 ((vueapp_subscene_image_api.$refs.subscene_image_api.subs_left + vueapp_subscene_image_api.$refs.subscene_image_api.subs_right) / 2.0).toString() + ";563426;8;" + 
											 subscene_width.toString() + ";" + 
											 subscene_height.toString() + ";" +
											 vueapp_subscene_image_api.$refs.subscene_image_api.subs_left.toString() + ";" + 
											 vueapp_subscene_image_api.$refs.subscene_image_api.subs_up.toString() + ";" + 
											 vueapp_subscene_image_api.$refs.subscene_image_api.subs_right.toString() + ";" + 
											 vueapp_subscene_image_api.$refs.subscene_image_api.subs_down.toString()}",
								"Type":"GifOverlay",
								"Url":"${json.imgFilePath}",
								"ID":"Sentinel2_sis2${vueapp_subscene_image_api.$refs.subscene_image_api.subscene_num.toString()}",
								"FileName":"Sentinel2_sis2-${vueapp_subscene_image_api.$refs.subscene_image_api.subscene_num.toString()}_${before}_${after}"
							}`.replace(/\n|\t/g, "").trim();
							
							
							// delete loading signal

							vueapp_subscene_image_api.$refs.subscene_image_api.subscene_Tree.enableCheckBoxes(true, true);
								
							// layer item
							
							vueapp_subscene_image_api.$refs.subscene_image_api.subscene_Tree.insertNewChild("0", new_node_id, "subscene-" + vueapp_subscene_image_api.$refs.subscene_image_api.subscene_num.toString() + "_" + before + "_" + after , function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
							
							// download item
														
							vueapp_subscene_image_api.$refs.subscene_image_api.subscene_Tree.insertNewItem(new_node_id, "subs" + vueapp_subscene_image_api.$refs.subscene_image_api.subscene_num.toString(), "下載 .zip 檔", 
														function(){ 
															var idn = this.id.split("subs");
															document.getElementById("download_iframe").src = vueapp_subscene_image_api.$refs.subscene_image_api.subscene_zip_link_arr[idn[1] - 1];
														}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
													
							vueapp_subscene_image_api.$refs.subscene_image_api.subscene_Tree.showItemCheckbox("subs" + vueapp_subscene_image_api.$refs.subscene_image_api.subscene_num.toString(), false);
												
							
							// Download button Default : closed
							
							vueapp_subscene_image_api.$refs.subscene_image_api.subscene_Tree.closeItem(new_node_id);
							
						} else {
							alert("回傳檔案發生問題");
						}
						
						vueapp_subscene_image_api.$refs.subscene_image_api.subscene_Tree.deleteItem(loading_id, false);
						
						btn_enable();
					},
					error: function(jqXHR) {
						console.log("error")
						alert("發生不明錯誤或尚未選擇區域")
						vueapp_subscene_image_api.$refs.subscene_image_api.subscene_Tree.deleteItem(loading_id, false);
						btn_enable();
					}
				});
			} else if ( this.subs_sen_url == "over" ) {
				alert("請選取範圍小於 " + this.subscene_area_up_limit + " 平方公里範圍進行分析!")
				this.clear_subscene_region();
			} else if ( this.subs_sen_url == "under" ) {
				alert("請選取範圍大於 " + this.subscene_area_down_limit + " 平方公里範圍進行分析!")
				this.clear_subscene_region();
			} else if ( this.subs_sen_url == "same" ) {
				alert("無法比對相同日期影像")
				this.clear_subscene_region();
			} else if ( this.subs_sen_url == "bigB" ) {
				alert("日期順序錯誤")
				this.clear_subscene_region();
			}else if ( this.subs_sen_url == "range_limit" ) {
				alert("日期區間請選擇一個月內")
				this.clear_subscene_region();
			} else {
				alert("尚未設定選擇區域")
				this.clear_subscene_region();
			}
		}
	},
    template: `	
<div>
	<div class='ui secondary menu'>
		<a class='item' id='subscene_button' v-on:click="subscene_getPoly()"><img src='img/paint06.png' alt=''></a>
		<button class='ui button' v-on:click='clear_subscene_region()'> clear </button>
	</div>
	<div class='ui form'>
		<div class='fields'>
			<div class='field'>

				<label>起始時間點 (左圖層)</label>
				<select id="subscene_list1" v-model="subscene_list_selected1">
					<option v-for="list1 in subscene_arr_html1">{{ list1.value }}</option>
				</select>
				<label>結束時間點 (右圖層)</label>
				<select id="subscene_list2" v-model="subscene_list_selected2">
					<option v-for="list2 in subscene_arr_html2">{{ list2.value }}</option>
				</select>
				<br>
				<label>輸出解析度(m)</label>
				<input type='text' id='subscene_PixelSize' value='10'>
			</div>
		</div>
		<div class="ui toggle checkbox" id="subscene_cb">
			<input type="checkbox" id="subscene_checked" v-model="vue_subscene_cb">
			<label>開啟</label>
		</div>
	</div>
	<br><br>
	<button class='ui button' id="subscene_get" v-on:click="subscene_getKml()">執行</button>
	<div id='treeBox_subscene' style='width:100%;height:200;'></div>
</div>
`
});

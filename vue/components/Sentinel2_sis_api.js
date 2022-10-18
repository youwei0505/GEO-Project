Vue.component('Sentinel2_sis_api', {
    props:  {
        maps: null,
        map_ind: null,
    },
    data: function () {
        return {
			sentinel2_sis_arr: [],
			curr_sis_sentinel_layer:null,
			curr_sis_sentinel_layer1:null,
			curr_sis_sentinel_layer2:null,

			sentinel2_sis_source:null,
			sentinel2_sis_vector:null,
			sentinel2_sis_source1:null,
			sentinel2_sis_vector1:null,
			sentinel2_sis_source2:null,
			sentinel2_sis_vector2:null,

			sentinel2_sis_region: "",
			sen_modifyInteraction:null,

			s_avg_lat: 0,
			s_avg_lng: 0,

			s_sen_url: "",
			sentinel2_sis_area:null,
			sis_up: 0,
			sis_down: 1000,
			sis_left: 1000,
			sis_right: 0,
			sis_area_up_limit: 50.0,  
			sis_area_down_limit: 4.0,
			
			sentinel2_sis_cb: false,//開關目前狀態
			sentinel2_list_selected:'',// v-model with template0
			sentinel2_list_selected1:'', // v-model with template1
			sentinel2_list_selected2:'', // v-model with template2
			sentinel2_poly_open:0,//poly是否運作
			sentinel2_arr_html:[],//下拉選單
			sentinel2_arr_html1:[],// 左下拉選單內容
			sentinel2_arr_html2:[],// 右下拉選單內容
			sentinel2_sis_spectral_selected:'NDWI',// v-model
			from_poly:0,
			
			//for getKml，in draw.js past
			sentinel2_sis_num: 0,
			sentinel2_sis_kml_link_arr: [],
			sis_legend_arr: [],
			sis_legwin_arr: [],
			draw_w8_Tree:null,
        }
    },
    watch: {
		sentinel2_list_selected : function(){
			this.sentinel2_sis_onchange();
		},
		sentinel2_list_selected1 : function(){
			this.sentinel2_sis_onchange1();
		},
		sentinel2_list_selected2 : function(){
			this.sentinel2_sis_onchange2();
		},
		sentinel2_sis_cb:function(){
			this.sentinel2_cb_onchange();
		},
		sentinel2_sis_spectral_selected:function(){
			this.DNBR_interface();
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
					self.sentinel2_sis_arr = $(xml).children().children()
					// add to list
 					for (let i = 0; i < $(xml).children().children().length; i++) {
						let str = $(xml).children().children()[i].getAttribute('text')

						
						let o = new Option(str, str);
						$(o).html(str)
						self.sentinel2_arr_html.push(o);
						
						let o1 = new Option(str, str);
						$(o1).html(str)
						self.sentinel2_arr_html1.push(o1);
						
						let o2 = new Option(str, str);
						$(o2).html(str)
						self.sentinel2_arr_html2.push(o2);
					}

					// set the default layer
					self.curr_sis_sentinel_layer = self.sentinel2_sis_arr[0]
					self.curr_sis_sentinel_layer1 = self.sentinel2_sis_arr[0]
					self.curr_sis_sentinel_layer2 = self.sentinel2_sis_arr[0]
					// add the event 'change', change the image when the selection change
					self.sentinel2_list_selected = self.sentinel2_sis_arr[0].getAttribute('text');
					self.sentinel2_list_selected1 = self.sentinel2_sis_arr[0].getAttribute('text');
					self.sentinel2_list_selected2 = self.sentinel2_sis_arr[0].getAttribute('text');
				},
				error: function (jqXHR) {
					$("#sentinel_block").css("display", "none");
				}
			});

			if (!this.sentinel2_sis_cb) {
				//$("#sentinel_polyCompare_button").off('click');
				this.sentinel2_poly_open = 0;
			} else {
				//$("#sentinel_polyCompare_button").on('click', function(e){Sentinel2_compare_getPoly()});
				this.sentinel2_poly_open = 1;
			}

			this.s_sen_url = "";
			this.sentinel2_sis_area = 0;
			
			//for getKml，in draw.js past
			this.draw_w8_Tree = new dhtmlXTreeObject("treeBox_sentinel2_sis", "100%", "100%", 0);
			this.draw_w8_Tree.setImagePath("codebase/imgs/dhxtree_material/");
			this.draw_w8_Tree.enableCheckBoxes(1);
			this.draw_w8_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
			this.draw_w8_Tree.setOnCheckHandler(this.Layer_Tree_OnCheck_Sentinel2_Sis_Tree);
			this.draw_w8_Tree.setOnDblClickHandler(Location_Grid_DblClicked);
		})
	},
    methods: {
		Layer_Tree_OnCheck_Sentinel2_Sis_Tree(rowId, state){
			if(rowId.indexOf("sis_legend") == -1){
				Layer_Tree_Oncheck_Pre("draw_w8_Tree",rowId, state);
			} else {
				var n = parseInt(rowId.split("sis_legend")[1]);
				var image_path = this.sis_legend_arr[n-1];
				console.log(n);
				if(state == true){
					for(var t=0;t<this.sis_legwin_arr.length;t++){
						console.log(this.sis_legwin_arr[t].getId());
						if(this.sis_legwin_arr[t].getId() === ("sis_legwin" + n.toString())){
							this.sis_legwin_arr[t].show();
							break;
						}
					}
				} else {
					for(var t=0;t<this.sis_legwin_arr.length;t++){
						console.log(this.sis_legwin_arr[t].getId());
						if(this.sis_legwin_arr[t].getId() === ("sis_legwin" + n.toString())){
							this.sis_legwin_arr[t].hide();
							break;
						}
					}
				}
			}
		},
		sentinel2_cb_onchange(){ //checkBox開關時，開關圖層
			if(this.sentinel2_sis_cb) {

				vueapp_sentinel2_api.$refs.sentinel2_api.clear_sentinel2()

				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.clear_sentinel2_compare("left")
				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.clear_sentinel2_compare("right")

				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.clear_spectrum("left")
				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.clear_spectrum("right")

				vueapp_subscene_image_api.$refs.subscene_image_api.clear_subscene("left")
				vueapp_subscene_image_api.$refs.subscene_image_api.clear_subscene("right")

				$('#sentinel_checked').prop("checked", false)
				$('#sentinel_compare_checked').prop("checked", false)
				$('#spectrum_checked').prop("checked", false)
				$('#subscene_checked').prop("checked", false)

				vueapp_sentinel2_api.$refs.sentinel2_api.clear_sentinel2_region()
				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.clear_sentinel2_compare_region()
				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.clear_spectrum_region()
				vueapp_subscene_image_api.$refs.subscene_image_api.clear_subscene_region()
				vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_cb = false
				vueapp_subscene_image_api.$refs.subscene_image_api.vue_subscene_cb = false
				vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_cb = false
				vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spectrum_cb = false
				this.DNBR_interface()
				if(this.from_poly == 1){
					this.Sentinel2_getSisPoly()
				}
			}
			else {
				this.clear_sentinel2_sis("all")
				this.clear_sentinel2_sis("left")
				this.clear_sentinel2_sis("right")
				this.clear_sentinel2_sis_region()
				this.from_poly=0
			}
		},		
		//define in sentinel2_compare_api.js
		
 		// 2.清除原本的衛星影像圖層
		clear_sentinel2_sis(map)
		{
			//$("#sentinel_polySis_button").off('click');  // remove the event 'click' on the button
			this.sentinel2_poly_open = 0;
			this.s_sen_url = "";
			
			//all
			if(map == "all")
			{
				if (this.sentinel2_sis_vector) {
					maps[map_ind].removeLayer(this.sentinel2_sis_vector);
					this.sentinel2_sis_vector = "";
					this.sentinel2_sis_source = "";
					//maps[map_ind].addLayer(sentinel2_compare_vector);
				}
			}
			//***** Add DNBR *****
			//left
			else if(map == "left")
			{
				if (this.sentinel2_sis_vector1) {
					maps[map_ind].removeLayer(this.sentinel2_sis_vector1);
					this.sentinel2_sis_vector1 = "";
					this.sentinel2_sis_source1 = "";
					//maps[map_ind].addLayer(sentinel2_compare_vector);
				}
			}
			//right
			else if(map == "right")
			{
				if (this.sentinel2_sis_vector2) {
					maps[map_ind ^ 0x1].removeLayer(this.sentinel2_sis_vector2);
					this.sentinel2_sis_vector2 = "";
					this.sentinel2_sis_source2 = "";
					//maps[map_ind].addLayer(sentinel2_compare_vector);
				}
			}
			//***** Add DNBR *****
		},
		// 3.清除所選的區域
		clear_sentinel2_sis_region()
		{
			this.sentinel2_sis_area = 10000000000
			this.s_sen_url = ""
			this.sentinel2_sis_region = ""
			clear_map()
		},
		// 4.更改選擇的選項時改變要顯示的衛星影像
		sentinel2_sis_onchange()
		{
			for (var i = 0; i < this.sentinel2_sis_arr.length; i++) {
				if ( this.sentinel2_sis_arr[i].getAttribute('text') === this.sentinel2_list_selected ) {
					this.curr_sis_sentinel_layer = this.sentinel2_sis_arr[i];
				}
			}

			this.s_sen_url = "";

			if (this.sentinel2_sis_cb) {	
				this.clear_sentinel2_sis("all")
				this.set_sentinel2_sis("all")
			}
		},
		// left
		sentinel2_sis_onchange1()
		{
			for (var i = 0; i < this.sentinel2_sis_arr.length; i++) {
				if ( this.sentinel2_sis_arr[i].getAttribute('text') === this.sentinel2_list_selected1 ) {
					this.curr_sis_sentinel_layer1 = this.sentinel2_sis_arr[i];
				}
			}

			this.s_sen_url = "";

			if (this.sentinel2_sis_cb) {		
				this.clear_sentinel2_sis("left")
				this.set_sentinel2_sis("left")
			}
		},
		//right
		sentinel2_sis_onchange2()
		{
			for (var i = 0; i < this.sentinel2_sis_arr.length; i++) {
				if ( this.sentinel2_sis_arr[i].getAttribute('text') === this.sentinel2_list_selected2 ) {
					this.curr_sis_sentinel_layer2 = this.sentinel2_sis_arr[i]
				}
			}

			this.s_sen_url = "";

			if ( this.sentinel2_sis_cb ) {		
				this.clear_sentinel2_sis("right")
				this.set_sentinel2_sis("right")
			}
		},
		// 5.顯示衛星影像
		set_sentinel2_sis(map) {
			if(map === "all") {
				// add event 'click' to the button
				//$("#sentinel_polySis_button").on('click', function(e){Sentinel2_getSisPoly()});
				this.sentinel2_poly_open = 1;
				//23.81544446;119.9016875;;7@TileImage@https://s186.geodac.tw/RSImage/Satellite/Landsat8/20140410_121128711_023631090_07_000_RSImage_Satellite_Landsat8/@0K-00016
			
				let curr_layer = JSON.parse(this.curr_sis_sentinel_layer.getAttribute('id'));
					
				this.sentinel2_sis_source = new ol.source.TileImage({
					tileUrlFunction: function(tileCoord){
			
						var z = tileCoord[0];
						var x = tileCoord[1]-1;
						var y = -tileCoord[2]-1;
						return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
					},
					crossOrigin:'anonymous'
				})
				
				this.sentinel2_sis_vector = new ol.layer.Tile({
					source: vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_source
				});
				
				this.sentinel2_sis_vector.setZIndex(1);
				
				maps[map_ind].addLayer(this.sentinel2_sis_vector);
			}
			else if(map === "left") {
				//$("#sentinel_polySis_button").on('click', function(e){Sentinel2_getSisPoly()});
				this.sentinel2_poly_open = 1;
				

				let curr_layer = JSON.parse(this.curr_sis_sentinel_layer1.getAttribute('id'));
					
				this.sentinel2_sis_source1 = new ol.source.TileImage({
					tileUrlFunction: function(tileCoord){

						var z = tileCoord[0];
						var x = tileCoord[1]-1;
						var y = -tileCoord[2]-1;					
						return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
					},
					crossOrigin:'anonymous'
				})
				
				this.sentinel2_sis_vector1 = new ol.layer.Tile({
					source: vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_source1
				});
				
				this.sentinel2_sis_vector1.setZIndex(1);
				
				maps[map_ind].addLayer(this.sentinel2_sis_vector1);		
			} 
			else if(map === "right") {
				//$("#sentinel_polySis_button").on('click', function(e){Sentinel2_getSisPoly()});
				this.sentinel2_poly_open = 1;

				let curr_layer = JSON.parse(this.curr_sis_sentinel_layer2.getAttribute('id'));
					
				this.sentinel2_sis_source2 = new ol.source.TileImage({
					tileUrlFunction: function(tileCoord){

						var z = tileCoord[0];
						var x = tileCoord[1]-1;
						var y = -tileCoord[2]-1;					
						return curr_layer.Url + z + '/' + y + '/' + x + '.jpg'; 
					},
					crossOrigin:'anonymous'
				})
				
				this.sentinel2_sis_vector2 = new ol.layer.Tile({
					source: vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_source2
				});
				
				this.sentinel2_sis_vector2.setZIndex(1);
				
				maps[map_ind ^ 0x1].addLayer(this.sentinel2_sis_vector2);		
			}
		},
		
		// 6.畫出選取範圍
		Sentinel2_getSisPoly(){
			if(this.sentinel2_poly_open == 0){
				this.from_poly = 1
				this.sentinel2_sis_cb = 1
			}
				document.getElementById("space_lonlat").checked = true;
				
				this.clear_sentinel2_sis_region(); // clear the selected region
			 
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
						vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));  // calculate the area after convert the coordinate
						
						measureTooltipElement.innerHTML = output;
						measureTooltip.setPosition(tooltipCoord);
					});		
				}, this);	
					
				// listener for the end of drawing
				draw_box.on('drawend',
					function (e) {
						clear_map();
					 
						createMeasureTooltip();
						//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsasd?
						//date=20180526&
						//sentinel2_sis_region=120.7258760671514%2C24.11023190418376%3B120.7425065966939%2C24.07755520679549%3B120.7972651666654%2C24.07795616672053%3B120.8060511576072%2C24.11258739313845%3B120.7931073286575%2C24.12840319631653%3B120.7602521139275%2C24.13013827730786%3B120.7258760671514%2C24.11023190418376
									
						box_array=(String(e.feature.getGeometry().getExtent())).split(",");  // return [minx, miny, maxx, maxy]
						//convert the coordinate
						loc_84=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');
						sis_left = loc_84[0];
						sis_up = loc_84[1];
						
						loc_84=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');
						sis_right = loc_84[0];
						sis_down = loc_84[1];
						
						//date = "date=" + curr_sis_sentinel_layer.getAttribute('text').split("_")[0]
						//spectral = "&spectral=" + $("#sentinel2_sis_spectral").val().toString()
						
						vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_region = "&region="			
						vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_region = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_region + sis_left + "," + sis_up + ";" +
										  sis_right + "," + sis_up + ";" +
										  sis_right + "," + sis_down + ";" +
										  sis_left + "," + sis_down + ";" +
										  sis_left + "," + sis_up;
						
						vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.s_avg_lat = (sis_left + sis_right) / 2
						vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.s_avg_lng = (sis_up + sis_down) / 2

						/* check the size of the selected area 
						if ( sentinel2_sis_area / 1000000 <= area_limit ) {
							s_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/sis2?" + date + sentinel2_sis_region + spectral
						} else {
							s_sen_url = "over";
						}
						*/
						
						maps[map_ind].removeInteraction(draw_box);
						
						btn_enable();
						
					}, this
				);
			  //Layer_Grid_Oncheck(ch_lay_root_name,ch_id,0,document.getElementById(ch_id).checked);
		 },
		// 7.傳送資料給後端抓取圖片
		Sentinel2_getSisKml()
		{
			// false
			//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20180401&after=20180416&sentinel2_sis_region=121.05791856764648%2C23.472071219430262%3B121.06381455922852%2C23.47116986237836%3B121.05944715805664%2C23.468666060484367%3B121.05791856764648%2C23.472071219430262%3B121.05791856764648%2C23.472071219430262
			//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20180401%26after=20180426%26region=121.21850967407228%2C23.731985247786838%3B121.23606204986574%2C23.72821370461088%3B121.22009754180908%2C23.713558652272837%3B121.21850967407228%2C23.731985247786838%3B121.21850967407228%2C23.731985247786838
			// good
			//https://compute.geodac.tw/geoinfo_api/api/geodac/compute/elsadscd?before=20170720&after=20180215&sentinel2_sis_region=120.8567532193329,23.44596794215077;120.8544248505181,23.44398906434632;120.8571331157023,23.43952378142274;120.8568156585571,23.42394034620056;120.8645144837861,23.41276606561682;120.8808192243636,23.41144157211883;120.8991404716364,23.40942189935453;120.9184096891597,23.41383678688257;120.9135910841748,23.42499799183454;120.9053071990364,23.43399841091956;120.9095216000687,23.43628025052095;120.9099051855738,23.4379326384103;120.9102833774821,23.443878444641;120.8990782494477,23.44899108355424;120.8796324875291,23.44922327790944;120.8782378022941,23.44467160253231;120.8688457630732,23.44387630455463;120.8606020017506,23.44685268235575;120.8567532193329,23.44596794215077
			var date = "date="
			var before = "date1="
			var after = "&date2="
			//if($("#sentinel2_sis_spectral").val() == "DNBR")
			if(this.sentinel2_sis_spectral_selected == "DNBR")
			{
				var before = before + this.curr_sis_sentinel_layer1.getAttribute('text').split("_")[0]
				var after = after + this.curr_sis_sentinel_layer2.getAttribute('text').split("_")[0]
			}
			else
			{
				date = "date=" + this.curr_sis_sentinel_layer.getAttribute('text').split("_")[0]
			}

			//var spectral = "&spectral=" + $("#sentinel2_sis_spectral").val().toString()
			var spectral = "&spectral=" + this.sentinel2_sis_spectral_selected
			
			// 20191001 add the area limit check
			if ( this.sentinel2_sis_area / 1000000 <= this.sis_area_up_limit && this.sentinel2_sis_area / 1000000 >= this.sis_area_down_limit ) {
				//s_sen_url = "https://apis.geodac.tw:31343/geoinfo_api/api/geodac/compute/sis2?" + date + sentinel2_sis_region + spectral;
				//if($("#sentinel2_sis_spectral").val() == "DNBR")
				if(this.sentinel2_sis_spectral_selected == "DNBR")
				{
					if ( this.curr_sis_sentinel_layer1.getAttribute('text').split("_")[0] === this.curr_sis_sentinel_layer2.getAttribute('text').split("_")[0] ) {
						this.s_sen_url = "same"
					} else if ( parseInt(this.curr_sis_sentinel_layer1.getAttribute('text').split("_")[0]) > parseInt(this.curr_sis_sentinel_layer2.getAttribute('text').split("_")[0]) ) {
						this.s_sen_url = "bigB"
					}
					else {
						this.s_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/sis2diff?type=Sentinel2&" + before + after + this.sentinel2_sis_region + spectral;
					}
				}
				else
				{
					this.s_sen_url = "https://compute.geodac.tw/geoinfo_api/api/geodac/compute/sis2?" + date + this.sentinel2_sis_region + spectral;
				}
				//date=20180215&region=120.89355468749997,23.843137735416278;120.96496582031246,23.843137735416278;120.96496582031246,23.797910674481983;120.89355468749997,23.797910674481983;120.89355468749997,23.843137735416278&spectral=NBR"
				//"https://compute.geodac.tw/geoinfo_api/api/geodac/compute/sis2?" + date + sentinel2_sis_region + spectral;
			} else if ( this.sentinel2_sis_area / 1000000 > this.sis_area_up_limit ) {
				this.s_sen_url = "over";
			} else if ( this.sentinel2_sis_area / 1000000 < this.sis_area_down_limit ) {
				this.s_sen_url = "under";
			} else if ( this.sentinel2_sis_region == "" ) {
				this.s_sen_url = "";
			}
			
			console.log(this.s_sen_url)
			
			if ( this.s_sen_url != "under" && this.s_sen_url != "over" && this.s_sen_url != "same" && this.s_sen_url != "bigB" && this.s_sen_url != ""  ) {
				
				btn_disable();
				
				loading_id = "l"+this.sentinel2_sis_num.toString();
				this.draw_w8_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
				this.draw_w8_Tree.enableCheckBoxes(false, false);
				
				//send data
				$.ajax({
					type: 	"GET",
					url:	"php/get_sis.php",
					dataType:	"json",
					data: {
						u: this.s_sen_url,
						n: this.sentinel2_sis_num,
						s: this.sentinel2_sis_spectral_selected
					},
					//jsonpCallback: 'callback',
					success: function(json) {
						console.log(json.imgFilePath)
						console.log(json)
						if ( json.result != false ) {
						
							//***** Add for DNBR *****
							if (vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_spectral_selected == "DNBR")
							{
								//vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr.push(json.kmlFilePath)
								tmp_kml_link_arr = []
								tmp_kml_link_arr.push(json.kmlFilePath)
								for(let i = 2;i<json.result.polygons.length;++i)
								{
									tmp_kml_link_arr.push(json.result.polygons[i])
								}
								/*
								tmp_kml_link_arr.push(json.result.polygons[2])
								tmp_kml_link_arr.push(json.result.polygons[3])
								tmp_kml_link_arr.push(json.result.polygons[4])
								tmp_kml_link_arr.push(json.result.polygons[5])
								tmp_kml_link_arr.push(json.result.polygons[6])
								*/
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr.push(tmp_kml_link_arr);
							}//***** Add for DNBR *****
							else
							{
								tmp_kml_link_arr = []
								tmp_kml_link_arr.push(json.kmlFilePath)
								tmp_kml_link_arr.push(json.kml1FilePath)
								tmp_kml_link_arr.push(json.kml2FilePath)
								tmp_kml_link_arr.push(json.kml3FilePath)
								tmp_kml_link_arr.push(json.kml4FilePath)
								tmp_kml_link_arr.push(json.kml5FilePath)
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr.push(tmp_kml_link_arr);
							}

							vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num + 1;
									
							new_node_id = `{
								"PosInfo":"${vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.s_avg_lat + ";" + 
											 vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.s_avg_lng + ";563426;8;" + 
											 json.imageWidth.toString() + ";" + 
											 json.imageHeight.toString() + ";" +
											 sis_left.toString() + ";" + 
											 sis_down.toString() + ";" + 
											 sis_right.toString() + ";" + 
											 sis_up.toString()}",
								"Type":"ImageOverlay",
								"Url":"${json.imgFilePath}",
								"ID":"Sentinel2_sis2${vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString()}",
								"FileName":"Sentinel2_sis2-${vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString()}_${vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_spectral_selected}_${vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.curr_sis_sentinel_layer.getAttribute('text').split("_")[0]}"
							}`.replace(/\n|\t/g, "").trim();				

							vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.enableCheckBoxes(true, true);
								
							// layer item					
							vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.insertNewChild("0", new_node_id, "Sentinel2_sis2-" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString() + "_" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_spectral_selected + "_" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.curr_sis_sentinel_layer.getAttribute('text').split("_")[0]
														, function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');

							//create new node (legend)
							vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sis_legend_arr.push(json.legendFilePath);
							vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.insertNewChild(new_node_id,"sis_legend" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(),"開啟圖例", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
							var legend_win = dhxWins.createWindow("sis_legwin"+vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(),600,600,json.LegendImgWidth, (json.LegendImgHeight+200));
							legend_win.setText("");

							legend_win.attachEvent("onClose",function(win){
								var n = parseInt(this.getId().split("sis_legwin")[1])
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.setCheck("sis_legend" + n.toString(), false);
								this.hide();
							});
							dhxWins.window("sis_legwin"+vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString()).button("minmax").hide();
							dhxWins.window("sis_legwin"+vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString()).button("park").hide();

							legend_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
										  "<div style='align: center; height:100%;width:100%;'>" + 
										  "<p style='text-align: center; font-size:8px;width:100%;' >頻譜指標" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString() + "</p>" + 
										  "<br><img src='" + json.legendFilePath + "' style='align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
							legend_win.attachHTMLString(legend_html)
							
							legend_win.hide()
							vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.showItemCheckbox("sis_legwin"+vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), false);
							vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sis_legwin_arr.push(legend_win);

							// download item
							//***** Add for DNBR *****
							if(vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_spectral_selected == "DNBR")
							{
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.insertNewItem(new_node_id, "ss" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), "下載分析成果 kmz 檔", 
															function(){ 
																var idn = this.id.split("ss");
																document.getElementById("download_iframe").src = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr[idn[1] - 1][0];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.showItemCheckbox("ss" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), false);
								
								for(let i = 1;i<vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr[vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr.length-1].length;++i){
									
									let temp_arr = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr[vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr.length-1][i].split("_");
									if(temp_arr[6] === "High Severity.kml")
									{
										// download item 1
										vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.insertNewItem(new_node_id, "s1" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), "下載DNBR_High_Severity kmz 檔", 
																	function(){ 
																		var idn = this.id.split("s1");
																		document.getElementById("download_iframe").src = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr[idn[1] - 1][i];
																	}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
										vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.showItemCheckbox("s1" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), false);
									}
									else if(temp_arr[6] === "Low Severity.kml")
									{
										// download item 2											
										vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.insertNewItem(new_node_id, "s2" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), "下載DNBR_Low_Severity kmz 檔", 
																	function(){ 
																		var idn = this.id.split("s2");
																		document.getElementById("download_iframe").src = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr[idn[1] - 1][i];
																	}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
										vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.showItemCheckbox("s2" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), false);
									}
									else if(temp_arr[6] === "Moderate-high Severity.kml")
									{
										// download item 3											
										vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.insertNewItem(new_node_id, "s3" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), "下載DNBR_Moderate-ligh_Severity kmz 檔", 
																	function(){ 
																		var idn = this.id.split("s3");
																		document.getElementById("download_iframe").src = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr[idn[1] - 1][i];
																	}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
										vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.showItemCheckbox("s3" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), false);
									}
									else if(temp_arr[6] === "Moderate-low Severity.kml")
									{
										// download item 4											
										vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.insertNewItem(new_node_id, "s4" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), "下載DNBR_Moderate-low_Severity kmz 檔", 
																	function(){ 
																		var idn = this.id.split("s4");
																		document.getElementById("download_iframe").src = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr[idn[1] - 1][i];
																	}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
										vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.showItemCheckbox("s4" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), false);
									}
									else if(temp_arr[6] === "Unburned.kml")
									{
										// download item 5											
										vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.insertNewItem(new_node_id, "s5" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), "下載DNBR_Unburned kmz 檔", 
																	function(){ 
																		var idn = this.id.split("s5");
																		document.getElementById("download_iframe").src = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr[idn[1] - 1][i];
																	}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
										vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.showItemCheckbox("s5" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), false);
									}
								}
							}//***** Add for DNBR *****
							else
							{
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.insertNewItem(new_node_id, "ss" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), "下載分析成果 kmz 檔", 
															function(){ 
																var idn = this.id.split("ss");
																document.getElementById("download_iframe").src = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr[idn[1] - 1][0];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.showItemCheckbox("ss" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), false);
								// download item 1											
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.insertNewItem(new_node_id, "s1" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), "下載自適門檻1級區域範圍檔", 
															function(){ 
																var idn = this.id.split("s1");
																document.getElementById("download_iframe").src = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr[idn[1] - 1][1];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.showItemCheckbox("s1" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), false);
								// download item 2											
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.insertNewItem(new_node_id, "s2" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), "下載自適門檻2級區域範圍檔", 
															function(){ 
																var idn = this.id.split("s2");
																document.getElementById("download_iframe").src = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr[idn[1] - 1][2];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.showItemCheckbox("s2" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), false);
								// download item 3											
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.insertNewItem(new_node_id, "s3" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), "下載自適門檻3級區域範圍檔", 
															function(){ 
																var idn = this.id.split("s3");
																document.getElementById("download_iframe").src = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr[idn[1] - 1][3];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.showItemCheckbox("s3" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), false);
								// download item 4											
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.insertNewItem(new_node_id, "s4" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), "下載自適門檻4級區域範圍檔", 
															function(){ 
																var idn = this.id.split("s4");
																document.getElementById("download_iframe").src = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr[idn[1] - 1][4];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.showItemCheckbox("s4" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), false);
								// download item 5											
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.insertNewItem(new_node_id, "s5" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), "下載自適門檻5級區域範圍檔", 
															function(){ 
																var idn = this.id.split("s5");
																document.getElementById("download_iframe").src = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_kml_link_arr[idn[1] - 1][5];
															}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');			
								vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.showItemCheckbox("s5" + vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_num.toString(), false);
							}
							
							// Download button Default : closed					
							vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.closeItem(new_node_id);
						} else {
							alert("回傳檔案發生問題");
						}
						// delete loading signal
						vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.deleteItem(loading_id, false);
						
						btn_enable();
					},
					error: function(jqXHR) {
						console.log("error")
						alert("發生不明錯誤")
						vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree.deleteItem(loading_id, false);
						btn_enable();
					}
				});
			} else if ( this.s_sen_url == "over" ) {
				alert("請選取範圍小於 " + this.sis_area_up_limit + " 平方公里範圍進行分析!")
				this.clear_sentinel2_sis_region();
			} else if ( this.s_sen_url == "under" ) {
				alert("請選取範圍大於 " + this.sis_area_down_limit + " 平方公里範圍進行分析!")
				this.clear_sentinel2_sis_region();
			} else if ( this.s_sen_url == "same" ) {
				alert("無法比對相同日期影像")
				this.clear_sentinel2_sis_region();
			} else if ( this.s_sen_url == "bigB" ) {
				alert("日期順序錯誤")
				this.clear_sentinel2_sis_region();
			} else {
				alert("尚未設定選擇區域")
				this.clear_sentinel2_sis_region();
			}
		},
		DNBR_interface() {
			if(this.sentinel2_sis_cb){
				if(this.sentinel2_sis_spectral_selected == 'DNBR')
				{
					document.getElementById("sentinel2_sis_list_field").style.display = "none";
					document.getElementById("sentinel2_sis_list_cmp_field").style.display = "inline";

					console.log("check : " + this.sentinel2_sis_cb )
					if(this.sentinel2_sis_cb)
					{		
						this.clear_sentinel2_sis("left")
						this.clear_sentinel2_sis("right")
						this.clear_sentinel2_sis("all")
						this.set_sentinel2_sis("left")
						this.set_sentinel2_sis("right")
						map_win_double()
					}
					else
					{
										if(!vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_cb && !vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_cb && !vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_cb 
				&& !vueapp_subscene_image_api.$refs.subscene_image_api.vue_subscene_cb && !vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spectrum_cb)
				{map_win_single();}
						this.clear_sentinel2_sis("left")
						this.clear_sentinel2_sis("right")
						this.clear_sentinel2_sis("all")
					}
				}
				else
				{
					document.getElementById("sentinel2_sis_list_field").style.display = "inline";
					document.getElementById("sentinel2_sis_list_cmp_field").style.display = "none";

					console.log("check : " + this.sentinel2_sis_cb )
					if(this.sentinel2_sis_cb)
					{
						this.clear_sentinel2_sis("left")
						this.clear_sentinel2_sis("right")
						this.clear_sentinel2_sis("all")
						this.set_sentinel2_sis("all")
						map_win_single()
					}
					else
					{
										if(!vueapp_sentinel2_api.$refs.sentinel2_api.sentinel2_cb && !vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.sentinel2_compare_cb && !vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.sentinel2_sis_cb 
				&& !vueapp_subscene_image_api.$refs.subscene_image_api.vue_subscene_cb && !vueapp_dual_spectrum_api.$refs.dual_spectrum_api.spectrum_cb)
				{map_win_single();}			
						this.clear_sentinel2_sis("left")
						this.clear_sentinel2_sis("right")
						this.clear_sentinel2_sis("all")
					}
				}
			}
		}
    },
    template: `	
<div>
	<div class='ui secondary menu'>
		<a class='item' id='sentinel_polySis_button' v-on:click="Sentinel2_getSisPoly()"><img src='img/paint06.png' alt=''></a>
		<button class='ui button' v-on:click='clear_sentinel2_sis_region()'> clear </button>
	</div>
	<div class='ui form'>
		<div class='fields'>
			<div class='field'>
				<div class='field' id='sentinel2_sis_list_field'>
					<select id="sentinel2_sis_list" v-model="sentinel2_list_selected">
						<!-- class="ui dropdown" style="width:300px;" -->
						<option v-for="list in sentinel2_arr_html">{{ list.value }}</option>
					</select>
				</div>
				<div class='field' id='sentinel2_sis_list_cmp_field' style="display:none">
					<label>之前 (左圖層)</label>
					<select id="sentinel2_sis_list1" v-model="sentinel2_list_selected1">
						<!-- class="ui dropdown" style="width:300px;" -->
						<option v-for="list1 in sentinel2_arr_html1">{{ list1.value }}</option>
					</select>
					<label>之後 (右圖層)</label>
					<select id="sentinel2_sis_list2" v-model="sentinel2_list_selected2">
						<!-- class="ui dropdown" style="width:300px;" -->
						<option v-for="list2 in sentinel2_arr_html2">{{ list2.value }}</option>
					</select>
				</div>
				<div class='field'>
					<br>
					<label>頻譜指標</label>
					<select id="sentinel2_sis_spectral" v-model="sentinel2_sis_spectral_selected">
						<option selected value="NDWI">常態化差異水體指標</option>
						<option value="NDVI">植生指標</option>
						<option value="NBR">標準化燃燒指標</option>
						<option value="DNBR">標準化燃燒指標差異</option>
					</select>
				</div>
			</div>
		</div>
		<div class="ui toggle checkbox" id="sentinel_sis_cb">
			<input type="checkbox" id="sentinel_sis_checked" v-model="sentinel2_sis_cb">
			<label>開啟</label>
		</div>
	</div>
	<br><br>
	<button class='ui button' id="Sentinel2_getSis" v-on:click='Sentinel2_getSisKml()'>執行</button>
	<div id='treeBox_sentinel2_sis' style='width:100%;height:200;'></div>
</div>
`
});
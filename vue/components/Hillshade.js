Vue.component('Land_1_2', {
    props:  {
        maps: null,
        map_ind: null,
		fun_slug: { type: String, default: 'Func_Use_Land_1_2' }
    },
	/* data: function () {
        return {
        }
    }, */
	created: function () {
		hillshade_area_ulimit = 50.0;
		hillshade_area_dlimit = 4.0;

		hillshade_area = 0.0;
		hillshade_cmd = "";

		hillshade_web_url = "";
		hillshade_wkt = "";
		hillshade_data = "";
		
		/* hillshade_num = 0;
		kmz_link_arr = [];
		legend_link_arr = []
		legwin_link_arr = []

		draw_w1_Tree = new dhtmlXTreeObject("treeBox", "100%", "100%", 0);
		draw_w1_Tree.setImagePath("codebase/imgs/dhxtree_material/");
		draw_w1_Tree.enableCheckBoxes(1);
		draw_w1_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
		draw_w1_Tree.setOnCheckHandler(this.Layer_Tree_OnCheck_Hillshade_Tree);
		draw_w1_Tree.setOnDblClickHandler(Location_Grid_DblClicked); */
	},
	methods: {
		
		Layer_Tree_OnCheck_Hillshade_Tree(rowId, state){
			if ( rowId.indexOf("h_legend") == -1 ) {
				Layer_Tree_Oncheck_Pre("draw_w1_Tree",rowId, state);
			} else {
				var n = parseInt(rowId.split("h_legend")[1]);
				var image_path = legend_link_arr[n - 1]
				console.log(n)
				if (state == true) {
					for (var t = 0; t < legwin_link_arr.length; t++) {
						console.log(legwin_link_arr[t].getId())
						if ( legwin_link_arr[t].getId() === ("h_legwin" + n.toString())) {
							legwin_link_arr[t].show();
							break;
						}
					}
					
				} else {
					
					for (var t = 0; t < legwin_link_arr.length; t++) {
						console.log(legwin_link_arr[t].getId())
						if ( legwin_link_arr[t].getId() === ("h_legwin" + n.toString())) {
							legwin_link_arr[t].hide()
							break;
						}
					}
				}
			}
		},
		
		//2.畫出選取範圍
		get_squrepoint() {
			document.getElementById("space_lonlat").checked = true;

			clear_map();
		 
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
			
			/*** add 1015 ***/
			vector_box.setZIndex(draw_box_zindex);
			/****************/
			
			value = 'LineString';
			maxPoints = 2;
			geometryFunction = function(coordinates, geometry) {
				if (!geometry) {
					geometry = new ol.geom.Polygon(null);
				}
				let start = coordinates[0];
				let end = coordinates[1];
				
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
				
			maps[map_ind].addInteraction(draw_box);	

			// listener for start drawing		
			draw_box.on('drawstart',
				function (evt) {

					btn_disable();
					
					sketch = evt.feature;

					let tooltipCoord = evt.coordinate;

					// listener for mouse event(changing the position)
					listener = sketch.getGeometry().on('change', function (evt) {
						let geom = evt.target;
						let output;
						output = formatArea(geom);  // calculate the area
						tooltipCoord = geom.getInteriorPoint().getCoordinates();
						
						//convert the coordinate
						let sourceProj = maps[map_ind].getView().getProjection();
						let geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
						let coordinates = geom_t.getLinearRing(0).getCoordinates();
						hillshade_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));  // calculate the area after convert the coordinate
						
						measureTooltipElement.innerHTML = output;
						measureTooltip.setPosition(tooltipCoord);
					});

				}, this);
			
			// listener for the end of drawing	
			draw_box.on('drawend',
				function (e) {
					clear_map();
				 
					createMeasureTooltip();  
					
					btn_enable();

					if ( hillshade_area / 1000000 >= hillshade_area_dlimit && hillshade_area / 1000000 <= hillshade_area_ulimit ) {			
					
						box_array=(String(e.feature.getGeometry().getExtent())).split(",");  // return [minx, miny, maxx, maxy]
					
						// convert the coordinate
						loc_84=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');				
						left = loc_84[0];
						up = loc_84[1];
						
						loc_84=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');				
						right = loc_84[0];
						down = loc_84[1];
						
						maps[map_ind].removeInteraction(draw_box);
						
						//set the data to send					
						hillshade_web_url = "https://dtm.moi.gov.tw/services/hillshade/hillshade.asmx/getImageFile";
						hillshade_wkt = "POLYGON((" + left + "%20" + up + "," + 
											left + "%20" + down + "," + 
											right + "%20" + down + "," + 
											right + "%20" + up + "," + 
											left + "%20" + up + "))";
						hillshade_cmd = "ok";
						hillshade_cmd_datatype="DEM";				
						
					} else if ( hillshade_area / 1000000 > hillshade_area_ulimit ) {
						
						hillshade_cmd = "over";
		 
					} else if ( hillshade_area / 1000000 < hillshade_area_dlimit ) {
						
						hillshade_cmd = "under";
						
					}
				}, this);
		 },

		//3.傳送資料給後端抓取圖片
		get_hillshade_data(){	
			this.$emit('access-hillshade', this.fun_slug);
							
			if ( hillshade_cmd === "ok" ) {
				
				btn_disable();	
				
				//create new node(loading signal)
				loading_id = "l"+hillshade_num.toString();		
				draw_w1_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');		
				draw_w1_Tree.enableCheckBoxes(false, false);
				
				hillshade_data = $("#hillshade_data").val();

				//send data
				$.ajax({
					type: 	"GET",
					url:	"php/get_hillshade_image.php",
					dataType:	"json",
					data: {
						u : hillshade_web_url,
						w : hillshade_wkt,
						d : hillshade_data,
						/*** add 20190515 ***/
						l : (hillshade_num + 1)
						/*** add 20190515 ***/
					},
					//request success
					success: function(json) {
						console.log(json)
						// create image layer				
						if ( json.getData == true ) {
							// get .kmz file url
							kmz_link_arr.push(json.kmz.url);

							// debug
							console.log(json.imgFilePath);
							console.log("Width : " + json.imageWidth);
							console.log("Height : " + json.imageHeight);
							//alert("img url : " + json.data.link);
							
							hillshade_num = hillshade_num + 1;
							
							new_node_id = `{
								"PosInfo":"${((up + down) / 2.0).toString() + ";" + 
											  ((left + right) / 2.0).toString() + ";563426;8;" + 
											  json.imageWidth.toString() + ";" + 
											  json.imageHeight.toString() + ";" + 
											  left.toString() + ";" + 
											  down.toString() + ";" + 
											  right.toString() + ";" + 
											  up.toString()}",
								"Type":"ImageOverlay",
								"Url":"${json.imgFilePath}",
								"ID":"hillshade${hillshade_num.toString()}",
								"FileName":"高程陰影${hillshade_num.toString()}"
							}`.replace(/\n|\t/g, "").trim();
							
							
							((up + down) / 2.0).toString() + ";" + ((left + right) / 2.0).toString() + ";563426;8;" + json.imageWidth.toString() + ";"
													+ json.imageHeight.toString() + ";" + left.toString() + ";" + down.toString() + ";" + right.toString() + ";" + up.toString() + "@ImageOverlay@" + json.imgFilePath;
								
							// delete loading signal
							draw_w1_Tree.deleteItem(loading_id, false);
							draw_w1_Tree.enableCheckBoxes(true, true);
								
							// layer item					
							draw_w1_Tree.insertNewChild("0", new_node_id, "高程陰影" + hillshade_num.toString(), function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
							
							/*** add 20190515 ***/
							//create new node (legend)
							legend_link_arr.push(json.legendFilePath);
							draw_w1_Tree.insertNewChild(new_node_id, "h_legend" + hillshade_num.toString(), "開啟圖例", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
							let legend_win = dhxWins.createWindow("h_legwin" + hillshade_num.toString(), 600, 600, json.LegendImgWidth / 3, (json.LegendImgHeight / 3 + 220));
							legend_win.setText("");
							
							legend_win.attachEvent("onClose", function(win){
								let n = parseInt(this.getId().split("h_legwin")[1])
								draw_w1_Tree.setCheck("h_legend" + n.toString(), false);
								//this.close();
								this.hide();
							});
							
							dhxWins.window("h_legwin" + hillshade_num.toString()).button("minmax").hide();
							dhxWins.window("h_legwin" + hillshade_num.toString()).button("park").hide();
							
							legend_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
										  "<div style='align: center; height:100%;width:100%;'>" + 
										  "<p style='text-align: center; font-size:8px;width:100%;' >高程陰影" + hillshade_num.toString() + "</p>" + 
										  "<br><img src='" + json.legendFilePath + "' style='align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
							legend_win.attachHTMLString(legend_html)
							
							legend_win.hide()
							draw_w1_Tree.showItemCheckbox("h_legwin" + hillshade_num.toString(), false);
							legwin_link_arr.push(legend_win);
							/*** add 20190515 ***/	
							
							// download item					
							draw_w1_Tree.insertNewItem(new_node_id, "d" + hillshade_num.toString(), "下載 .kmz 檔", 
														function(){ 
															let idn = this.id.split("d");
															document.getElementById("download_iframe").src = kmz_link_arr[idn[1] - 1];
														}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
														
							/*** add 20190515 ***/	
							//draw_w1_Tree.showItemCheckbox("d" + hillshade_num.toString(), false);
							draw_w1_Tree.disableCheckbox("d" + hillshade_num.toString(), true);
							/*** add 20190515 ***/	
							
							// Legend and Download button Default : closed					
							draw_w1_Tree.closeItem(new_node_id);
								
							// enable button					
							btn_enable();
						} else {
							alert("您沒有權限使用此資料類型");
							draw_w1_Tree.deleteItem(loading_id, false);
							btn_enable();
						}				
					},
					//request fail
					error: function(jqXHR) {
						alert("error " + jqXHR.status);
						draw_w1_Tree.deleteItem(loading_id, false);
						btn_enable();
					}
				});
			} else if ( hillshade_cmd == "over" ) {
				
				alert("請選取範圍小於 " + hillshade_area_ulimit + " 平方公里範圍進行分析!")
			} else if ( hillshade_cmd == "under" ) {

				alert("請選取範圍大於 " + hillshade_area_dlimit + " 平方公里範圍進行分析!")
			} else {
				
				alert("尚未選擇區域或輸入有誤")
			}
		}
		
	},
	template: `
	<div>
					<div class='ui secondary menu'>
						<a class='item' data-tab='one'><img src='img/paint01.png' alt=''></a>
						<a class='item' @click="get_squrepoint"><img src='img/paint06.png' alt=''></a>
						<button class='ui button' onclick='clear_map()'> clear </button>
					</div>
					<div class='ui form' id='hillshade_menu'>
						<div class='eight wide field'>
							<label>數值資料</label>
							<select id='hillshade_data'>
								<option value='TW_DLA_20010814_20061226_20M_3826'>20M TW DLA DTM (92-94年)</option>
								<option value='TW_DLA_20110101_20161101_20M_3826'>20M TW DLA DTM (99-104年)</option>
								<!-- 20190513 fixed -->
								<!--<option value='TW_DLA_20010814_20061226_5M_3826'>5M TW DLA DTM (92-94年)</option>-->
								<!-- 20190513 fixed -->
							</select>
						</div>
					</div>
					<!-- 20190513 add -->
					<br><br>
					<button class='ui button' id="get_hillshade_data" @click="get_hillshade_data">執行</button>
					<!------------------>
	</div>
`
	
});
Vue.component('Land_1_3', {
    props:  {
        maps: null,
        map_ind: null,
		fun_slug: { type: String, default: 'Func_Use_Land_1_3' }
    },
	data: function () {
        return {
            hillshadeAZ_data: 'TW_DLA_20010814_20061226_20M_3826',
            hillshadeAZ_angle: 0,
            hillshadeAZ_area_ulimit : 50.0,
            hillshadeAZ_area_dlimit : 4.0,

            hillshadeAZ_area : 0.0,
            hillshadeAZ_cmd : "",

            hillshadeAZ_web_url : "",
            hillshadeAZ_wkt : ""
        }
    }, 
	/* created: function () {

		hillshadeAZ_num = 0;
        AZ_kmz_link_arr = [];
        AZ_legend_link_arr = []
        AZ_legwin_link_arr = []

        draw_w2_Tree = new dhtmlXTreeObject("treeBoxAZ", "100%", "100%", 0);
        draw_w2_Tree.setImagePath("codebase/imgs/dhxtree_material/");
        draw_w2_Tree.enableCheckBoxes(1);
        draw_w2_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
        draw_w2_Tree.setOnCheckHandler(Layer_Tree_OnCheck_HillshadeAZ_Tree);
        draw_w2_Tree.setOnDblClickHandler(Location_Grid_DblClicked); 
	},*/
	methods: {
		
        Layer_Tree_OnCheck_HillshadeAZ_Tree(rowId, state){
            if ( rowId.indexOf("legend") == -1 ) {
                Layer_Tree_Oncheck_Pre("draw_w2_Tree",rowId, state);
            } else {
                let n = parseInt(rowId.split("legend")[1]);
                let image_path = AZ_legend_link_arr[n - 1]
                console.log(n)
                if (state == true) {
                    for (let t = 0; t < AZ_legwin_link_arr.length; t++) {
                        console.log(AZ_legwin_link_arr[t].getId())
                        if ( AZ_legwin_link_arr[t].getId() === ("legwin" + n.toString())) {
                            AZ_legwin_link_arr[t].show();
                            break;
                        }
                    }
                    
                } else {
                    
                    for (let t = 0; t < AZ_legwin_link_arr.length; t++) {
                        console.log(AZ_legwin_link_arr[t].getId())
                        if ( AZ_legwin_link_arr[t].getId() === ("legwin" + n.toString())) {
                            AZ_legwin_link_arr[t].hide()
                            break;
                        }
                    }
                }
            }
        },
		
        //2.畫出選取範圍
        get_squrepointAZ(){
            document.getElementById("space_lonlat").checked = true;
            
            clear_map();  // initialize
            
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

            const that=this; 
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
                        output = formatArea(geom);  //calculate the area
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                        
                        //convert the coordinate
                        let sourceProj = maps[map_ind].getView().getProjection();
                        let geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
                        let coordinates = geom_t.getLinearRing(0).getCoordinates();
                        that.hillshadeAZ_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));  // calculate the area after convert the coordinate
                        
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
                    
                    if ( that.hillshadeAZ_area / 1000000 <= that.hillshadeAZ_area_ulimit && that.hillshadeAZ_area / 1000000 >= that.hillshadeAZ_area_dlimit ) {
                    
                        box_array=(String(e.feature.getGeometry().getExtent())).split(",");  // return [minx, miny, maxx, maxy]
                    
                        // convert the coordinate
                        loc_84=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');				
                        left = loc_84[0];
                        up = loc_84[1];
                        
                        loc_84=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');				
                        right = loc_84[0];
                        down = loc_84[1];
                        
                        maps[map_ind].removeInteraction(draw_box);			
                        
                        // set the data to send
                        that.hillshadeAZ_web_url = "https://dtm.moi.gov.tw/services/hillshadeAz/hillshadeAz.asmx/getImageFile";
                        that.hillshadeAZ_wkt = "POLYGON((" + left + "%20" + up + "," + 
                                            left + "%20" + down + "," + 
                                            right + "%20" + down + "," + 
                                            right + "%20" + up + "," + 
                                            left + "%20" + up + "))";
                        //hillshadeAZ_data = $("#hillshadeAZ_data").val();        
                        //hillshadeAZ_angle = $("#hillshadeAZ_angle").val();
                        that.hillshadeAZ_cmd = "ok"
                    
                    } else if ( that.hillshadeAZ_area / 1000000 > that.hillshadeAZ_area_ulimit ) {
                        
                        that.hillshadeAZ_cmd = "over"
                    } else if ( that.hillshadeAZ_area / 1000000 < that.hillshadeAZ_area_dlimit ) {
                        
                        that.hillshadeAZ_cmd = "under"
                    }	
                    		
                }, this);       
        }, 


		//3.傳送資料給後端抓取圖片
		get_hillshadeAZ_data(){	
			this.$emit('access-hillshadeAZ', this.fun_slug);
							
			if ( this.hillshadeAZ_cmd === "ok" ) {
				
				btn_disable();	
                //hillshadeAZ_angle = $("#hillshadeAZ_angle").val();
				
				// create new node(loading signal)
				loading_id = "l"+hillshadeAZ_num.toString();		
				draw_w2_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');		
				draw_w2_Tree.enableCheckBoxes(false, false);
                
                const that=this; 
				//send data
                axios.get('php/get_hillshadeAZ_image.php', {
                        params: {
                            u : this.hillshadeAZ_web_url,
                            w : this.hillshadeAZ_wkt,
                            d : this.hillshadeAZ_data,
                            l : (hillshadeAZ_num + 1), 
                            angle : this.hillshadeAZ_angle
                        }
                    })
                    .then( function(json) {
                        console.log(json.data);
						// create image layer				
						if ( json.data.getData == true ) {
							// get .kmz file url
							AZ_kmz_link_arr.push(json.data.kmz.url);

							//alert("img url : " + json.data.link);
							
							hillshadeAZ_num = hillshadeAZ_num + 1;
							
							new_node_id = `{
								"PosInfo":"${((up + down) / 2.0).toString() + ";" + 
											  ((left + right) / 2.0).toString() + ";563426;8;" + 
											  json.data.imageWidth.toString() + ";" + 
											  json.data.imageHeight.toString() + ";" + 
											  left.toString() + ";" + 
											  down.toString() + ";" + 
											  right.toString() + ";" + 
											  up.toString()}",
								"Type":"ImageOverlay",
								"Url":"${json.data.imgFilePath}",
								"ID":"hillshadeAZ${hillshadeAZ_num.toString()}_${that.hillshadeAZ_angle}",
								"FileName":"八方位陰影${hillshadeAZ_num.toString()}_${that.hillshadeAZ_angle}度"
							}`.replace(/\n|\t/g, "").trim();
							
							
							((up + down) / 2.0).toString() + ";" + ((left + right) / 2.0).toString() + ";563426;8;" + json.data.imageWidth.toString() + ";"
													+ json.data.imageHeight.toString() + ";" + left.toString() + ";" + down.toString() + ";" + right.toString() + ";" + up.toString() + "@ImageOverlay@" + json.data.imgFilePath;
								
							// delete loading signal
							draw_w2_Tree.deleteItem(loading_id, false);
							draw_w2_Tree.enableCheckBoxes(true, true);
								
							// layer item					
                            draw_w2_Tree.insertNewChild("0", new_node_id, "八方位陰影" + hillshadeAZ_num.toString() + "_" + that.hillshadeAZ_angle + "度", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
							
							/*** add 20190515 ***/
							// create new node (legend)
							AZ_legend_link_arr.push(json.data.legendFilePath);
							draw_w2_Tree.insertNewChild(new_node_id, "legend" + hillshadeAZ_num.toString(), "開啟圖例", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
							
                    		// create a new window(legend)
                            let legend_win = dhxWins.createWindow("legwin" + hillshadeAZ_num.toString(), 600, 600, json.data.LegendImgWidth / 3, (json.data.LegendImgHeight / 3 + 220));
							legend_win.setText("圖例");
							
							legend_win.attachEvent("onClose", function(win){
								let n = parseInt(this.getId().split("legwin")[1])
								draw_w2_Tree.setCheck("legend" + n.toString(), false);
								//this.close();
								this.hide();
							});
							
							dhxWins.window("legwin" + hillshadeAZ_num.toString()).button("minmax").hide();
							dhxWins.window("legwin" + hillshadeAZ_num.toString()).button("park").hide();
							
                            legend_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
                            "<div style='align: center; height:100%;width:100%;'>" + 
                            "<p style='text-align: center; font-size:8px;width:100%;' >八方位陰影" + hillshadeAZ_num.toString() + "</p>" + 
                            "<br><img src='" + json.data.legendFilePath + "' style='align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
                            legend_win.attachHTMLString(legend_html)
							
							legend_win.hide()
							draw_w2_Tree.showItemCheckbox("legwin" + hillshadeAZ_num.toString(), false);
							AZ_legwin_link_arr.push(legend_win);
							/*** add 20190515 ***/	
							
							// download item					
							draw_w2_Tree.insertNewItem(new_node_id, "d" + hillshadeAZ_num.toString(), "下載 .kmz 檔", 
														function(){ 
															let idn = this.id.split("d");
															document.getElementById("download_iframe").src = AZ_kmz_link_arr[idn[1] - 1];
														}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
														
							/*** add 20190515 ***/	
							//draw_w2_Tree.showItemCheckbox("d" + hillshadeAZ_num.toString(), false);
							draw_w2_Tree.disableCheckbox("d" + hillshadeAZ_num.toString(), true);
							/*** add 20190515 ***/	
							
							// Legend and Download button Default : closed					
							draw_w2_Tree.closeItem(new_node_id);
								
							// enable button					
							btn_enable();
						} else {
							alert("您沒有權限使用此資料類型");
							draw_w2_Tree.deleteItem(loading_id, false);
							btn_enable();
						}				
                    })
                    .catch( function(error) {
                            if(error.response) {
                                alert("error " + error.response.status);
                            }
                            draw_w2_Tree.deleteItem(loading_id, false);
                            btn_enable();
                    });

			} else if ( this.hillshadeAZ_cmd == "over" ) {
				
				alert("請選取範圍小於 " + this.hillshadeAZ_area_ulimit + " 平方公里範圍進行分析!")
			} else if ( this.hillshadeAZ_cmd == "under" ) {

				alert("請選取範圍大於 " + this.hillshadeAZ_area_dlimit + " 平方公里範圍進行分析!")
			} else {
				
				alert("尚未選擇區域或輸入有誤")
			}
		}
		
	},
	template: `
	<div>
                    <div class='ui secondary menu'>
                        <a class='item' data-tab='one'><img src='img/paint01.png' alt=''></a>
						<a class='item' @click="get_squrepointAZ"><img src='img/paint06.png' alt=''></a>
                        <button class='ui button' onclick='clear_map()'> clear </button>
                    </div>
                    <div class='ui form' id='hillshadeAZ_menu'>
                        <div class='eight wide field'>
                            <label>方位角</label>
                            <select id='hillshadeAZ_angle' v-model="hillshadeAZ_angle">
                                <option value='0'>0</option>
                                <option value='45'>45</option>
                                <option value='90'>90</option>
                                <option value='135'>135</option>
                                <option value='180'>180</option>
                                <option value='225'>225</option>
                                <option value='270'>270</option>
                                <option value='315'>315</option>
                            </select>
                        </div>
                        <div class='eight wide field'>
                            <label>數值資料</label>
                            <select id='hillshadeAZ_data' v-model="hillshadeAZ_data">
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
                    <button class='ui button' id="get_hillshadeAZ_data" @click='get_hillshadeAZ_data()'>執行</button>
                    <!------------------>
	</div>
`
	
});
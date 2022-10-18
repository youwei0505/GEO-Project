Vue.component('Contour',{
    props: {  // data from outside
        maps: null,
        map_ind: null,
        fun_slug: { type: String, default: 'Func_Use_Land_1_4' },
        //enable_refresh: 0
    },
    data: function (){
        return {
            contour_area_ulimit : 50.0,
            contour_area_dlimit : 4.0,

            contour_area: 0.0,
            contour_cmd : "",

            contour_web_url: "",
            contour_wkt: "",
            contour_data:'TW_DLA_20010814_20061226_20M_3826',
            contour_left:0.0,
            contour_right:0.0,
            contour_up:0.0,
            contour_down:0.0
        };
    },
    // created(){
    //     this.contour_area_ulimit = 50.0,
    //     this.contour_area_dlimit = 4.0,

    //     contour_areas,
    //     this.contour_cmd = "",

    //     contour_web_urlm,
    //     this.contour_wkt,
    //     contour_data,
    //     this.contour_left,
    //     this.contour_right,
    //     this.contour_up,
    //     this.contour_down 
    // },


    methods: {
        get_squarepoint_contour() {
            document.getElementById("space_lonlat").checked = true;
        
            clear_map();
        
            createMeasureTooltip();
        
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
        
            /*** add 1015 ***/
            vector_box.setZIndex(draw_box_zindex);
            /****************/
        
            value = 'LineString';
            maxPoints = 2;
            geometryFunction = function (coordinates, geometry) {
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
        
            const that = this;
            draw_box.on('drawstart',
                function (evt) {
        
                    btn_disable();
                    sketch = evt.feature;
        
                    let tooltipCoord = evt.coordinate;
        
                    listener = sketch.getGeometry().on('change', function (evt) {
                        let geom = evt.target;
                        let output;
                        output = formatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
        
                        let sourceProj = maps[map_ind].getView().getProjection();
                        let geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
                        let coordinates = geom_t.getLinearRing(0).getCoordinates();
                        that.contour_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
        
                        measureTooltipElement.innerHTML = output;
                        measureTooltip.setPosition(tooltipCoord);
                    });
        
                }, this);
                
            
            draw_box.on('drawend',
                function (e) {
        
                    btn_enable();
        
                    clear_map();
        
                    createMeasureTooltip();
        
                    if (that.contour_area / 1000000 >= that.contour_area_dlimit && that.contour_area / 1000000 <= that.contour_area_ulimit) {
                        box_array = (String(e.feature.getGeometry().getExtent())).split(",");
        
                        loc_84 = ol.proj.transform([box_array[0], box_array[3]], 'EPSG:3857', 'EPSG:4326');
        
                        that.contour_left = loc_84[0];
                        that.contour_up = loc_84[1];
        
                        loc_84 = ol.proj.transform([box_array[2], box_array[1]], 'EPSG:3857', 'EPSG:4326');
        
                        that.contour_right = loc_84[0];
                        that.contour_down = loc_84[1];
        
                        maps[map_ind].removeInteraction(draw_box);
                        

                        // print(that.contour_left)
                        // console.log(that.contour_left+" left")
                        // console.log(that.contour_right+" right")
                        // console.log(that.contour_up)
                        // console.log(that.contour_down)
                        // console.log("hahahaha")
        
        
                        // 傳送資料給後端抓取圖片	
        
                        that.contour_web_url = "https://dtm.moi.gov.tw/services/contour/contour.asmx/getImage";
                        that.contour_wkt = "POLYGON((" + that.contour_left + "%20" + that.contour_up + "," +
                            that.contour_left + "%20" + that.contour_down + "," +
                            that.contour_right + "%20" + that.contour_down + "," +
                            that.contour_right + "%20" + that.contour_up + "," +
                            that.contour_left + "%20" + that.contour_up + "))";
         
                        // 5米
                        //"TW_DLA_20010814_20061226_5M_3826";
                        console.log(that.contour_data)
        
                        that.contour_cmd = "ok"
        
                    } else if (that.contour_area / 1000000 > that.contour_area_ulimit) {
        
                        that.contour_cmd = "over"
                    } else if (that.contour_area / 1000000 < that.contour_area_dlimit) {
        
                        that.contour_cmd = "under"
                    }
        
        
        
                }, this);
        
        
        },
        get_contour_data() {
            this.$emit('access-hillshade',this.fun_slug);

            if (this.contour_cmd === "ok") {
        
                btn_disable();
        
                loading_id = "l" + contour_num.toString();
        
                draw_w3_Tree.insertNewItem("0", loading_id, "loading...", function () { }, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
        
                // disable button
                
                // $("#contour_button").attr('disabled', true);
                
                const that=this;

                draw_w3_Tree.enableCheckBoxes(false, false);
                // console.log(this.contour_web_url);
                axios.get('php/get_contour_image.php', {
                    params: {
                        u: this.contour_web_url,
                        w: this.contour_wkt,
                        d: this.contour_data,
                        left: this.contour_left,
                        right: this.contour_right,
                        up: this.contour_up,
                        down: this.contour_down
                    }
                })
                .then( function(json) {
                    // let url = json.imgURL;
                    // console.log(json);
                    if (json.data.getImg == true) {
                        //alert("img url : " + json.data.link);
    
                        contour_num = contour_num + 1;
    
                        new_node_id = `{
                            "PosInfo":"${((that.contour_up + that.contour_down) / 2.0).toString() + ";" + 
                                            ((that.contour_left + that.contour_right) / 2.0).toString() + ";563426;8;" + 
                                            json.data.imageWidth.toString() + ";" + 
                                            json.data.imageHeight.toString() + ";" + 
                                            (that.contour_left).toString() + ";" + 
                                            (that.contour_down).toString() + ";" + 
                                            (that.contour_right).toString() + ";" + 
                                            (that.contour_up).toString()}",
                            "Type":"ImageOverlay",
                            "Url":"${json.data.imgFilePath}",
                            "ID":"contour${contour_num.toString()}",
                            "FileName":"等高線計算${contour_num.toString()}"
                        }`.replace(/\n|\t/g, "").trim();
                        
                        
    
                        // delete loading signal
    
                        draw_w3_Tree.deleteItem(loading_id, false);
                        draw_w3_Tree.enableCheckBoxes(true, true);
    
                        // layer item
    
                        draw_w3_Tree.insertNewChild("0", new_node_id, "等高線計算" + contour_num.toString(), function () { }, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
    
                        // download item
    
    
                        draw_w3_Tree.insertNewItem(new_node_id, "d" + contour_num.toString(), "下載 .kmz 檔",
                            function () {
                                var idn = this.id.split("d");
                                document.getElementById("download_iframe").src = json.data.kmz;
                            }, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
    
    
                        draw_w3_Tree.showItemCheckbox("d" + contour_num.toString(), false);
    
    
                        // Download button Default : closed
    
                        draw_w3_Tree.closeItem(new_node_id);
    
                        // enable button
    
                        btn_enable();
    
    
    
    
                    } else {
                        alert("您沒有權限使用此資料類型");
                        draw_w3_Tree.deleteItem(loading_id, false);
                        btn_enable();
                    }
                })
                .catch( function (jqXHR) {
                    alert("error " + jqXHR.status);
                    draw_w3_Tree.deleteItem(loading_id, false);
    
                    btn_enable();
    
                });

            
            } else if (this.contour_cmd === "over") {
        
                alert("請選取範圍小於 " + this.contour_area_ulimit + " 平方公里範圍進行分析!")
            } else if (this.contour_cmd === "under") {
        
                alert("請選取範圍大於 " + this.contour_area_dlimit + " 平方公里範圍進行分析!")
            } else {
        
                alert("尚未選擇區域或輸入有誤")
            }
        }

    },
    beforeCreate(){
        
        // console.log("Contour.js is detected but not created yet");
    },

    
    template:`
	<div>
                <div class='ui secondary menu'>
                    <a class='item' data-tab='one'><img src='img/paint01.png' alt=''></a>
                    <a class='item' id='contour_button' v-on:click='get_squarepoint_contour()'> <img src='img/paint06.png' alt=''></a>
                    <button class='ui button' onclick='clear_map()'> clear </button>
                </div>
                <div class='ui form' id='contour_menu'>
                    <div class='eight wide field'>
                        <label>數值資料</label>
                        <select id='contour_data' v-model="contour_data">
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
                <button class='ui button' id="get_contour_data" v-on:click='get_contour_data()'>執行</button>
                <!------------------>
	</div>
`

});
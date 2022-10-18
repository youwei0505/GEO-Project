Vue.component('Land_1_5', {
    props: {
        maps: null,
        map_ind: null,
        fun_slug: { type: String, default: 'Func_Use_Analysis_1_6'}
    },

    data: function() {
        return{
            viewshed_data : "TW_DLA_20010814_20061226_20M_3826",
            viewshed_cmd : "",

            viewshed_web_url : "",
            viewshed_wkt : "",
            viewshed_distance_range : 100,
            viewshed_h : 1,
            viewshed_c : ""
        }
    },

    /*created: function () {
        viewshed_cmd = "";

        viewshed_web_url = "";
        viewshed_wkt = "";
        viewshed_data = "";
        viewshed_distance_range = "";
        viewshed_h = "";
        viewshed_c = "";
    },*/

    methods: {
        

        get_viewshed_point(){

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
            
            value = 'Point';
            maxPoints = 1;
            
            draw_box = new ol.interaction.Draw({
                source: source_box,
                type: /** @type {ol.geom.GeometryType} */ (value),
                maxPoints: maxPoints
            });
                
            maps[map_ind].addInteraction(draw_box);	
                
            draw_box.on('drawstart',
                function (evt) {
        
                    btn_disable();	
                    this.viewshed_cmd = ""
        
                }, this);
                
            draw_box.on('drawend',
                function (e) {
                    
                    clear_map();
                
                    createMeasureTooltip();  
                    
                    btn_enable();	
                    
                    ori_coor = e.feature.getGeometry().getCoordinates()
                    let coor = ol.proj.transform(e.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
                    maps[map_ind].removeInteraction(draw_box);
                    
                    // 傳送資料給後端抓取圖片	
                    
                    this.viewshed_web_url = "https://dtm.moi.gov.tw/services/viewshed/viewshed.asmx/getImageFile"
                    this.viewshed_wkt = "POINT(" + coor[0] + "%20" + coor[1] + ")";
                    //viewshed_data = $("#viewshed_data").val();
                    
                    this.viewshed_c = "0,0,0";
                    //viewshed_h = $("#viewshed_height").val();
                    //viewshed_distance_range = $("#viewshed_radius").val();;
                    
                    this.viewshed_cmd = "ok"
                }, this);
        },

        get_viewshed(){
            this.$emit('access-viewshed', this.fun_slug);

            if ( this.viewshed_cmd === "ok" ) {
                btn_disable();	
            
                loading_id = "l"+stlfile_num.toString();
                
                viewshed_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
                viewshed_Tree.enableCheckBoxes(false, false);
                
                axios.get('php/viewshed.php', {
                    params: {
                        u : this.viewshed_web_url,
                        // delete
                        w : this.viewshed_wkt,
                        d : this.viewshed_data,
                        c : this.viewshed_c,
                        h : this.viewshed_h,
                        /*** add 20190515 ***/
                        l: (viewshed_num + 1),
                        /*** add 20190515 ***/
                        dt: this.viewshed_distance_range
                    }
                })
                .then(function(json) {
                    console.log(json.data)
                    
                    // create image layer
                    
                    if ( json.data.getData == true ) {
                        
                        viewshed_coor = json.data.bbox.split(',');
                        viewshed_num = viewshed_num + 1;
                        
                        left_coor = ori_coor[0] - (viewshed_coor[2] - viewshed_coor[0]) / 2;
                        down_coor = ori_coor[1] - (viewshed_coor[3] - viewshed_coor[1]) / 2;
                        right_coor = parseFloat(ori_coor[0]) + (viewshed_coor[2] - viewshed_coor[0]) / 2;
                        up_coor = ori_coor[1] + (viewshed_coor[3] - viewshed_coor[1]) / 2;
                        
                        let loc = ol.proj.transform([left_coor,up_coor], 'EPSG:3857', 'EPSG:4326')
                        left = loc[0]
                        up = loc[1]
                        loc = ol.proj.transform([right_coor,down_coor], 'EPSG:3857', 'EPSG:4326')
                        right = loc[0]
                        down = loc[1]
                        
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
                            "ID":"viewshed${viewshed_num.toString()}",
                            "FileName":"視域範圍分析${viewshed_num.toString()}"
                        }`.replace(/\n|\t/g, "").trim();
                        
                    
                            
                        // delete loading signal

                        viewshed_Tree.deleteItem(loading_id, false);
                        viewshed_Tree.enableCheckBoxes(true, true);
                            
                        // layer item
                        
                        viewshed_Tree.insertNewChild("0", new_node_id, "視域範圍分析" + viewshed_num.toString(), function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
                        
                        /*** add 20190515 ***/
                        viewshed_legend_link_arr.push(json.data.legendFilePath);
                        viewshed_Tree.insertNewChild(new_node_id, "v_legend" + viewshed_num.toString(), "開啟圖例", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
                        let legend_win = dhxWins.createWindow("v_legwin" + viewshed_num.toString(), 600, 600, json.data.LegendImgWidth / 3, (json.data.LegendImgHeight / 3 + 120));
                        legend_win.setText("");
                        
                        legend_win.attachEvent("onClose", function(win){
                            let n = parseInt(this.getId().split("v_legwin")[1])
                            viewshed_Tree.setCheck("v_legend" + n.toString(), false);
                            //this.close();
                            this.hide();
                        });
                        
                        dhxWins.window("v_legwin" + viewshed_num.toString()).button("minmax").hide();
                        dhxWins.window("v_legwin" + viewshed_num.toString()).button("park").hide();
                        
                        legend_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
                                    "<div style='align: center; height:100%;width:100%;'>" + 
                                    "<p style='text-align: center; font-size:8px;width:100%;' >視域範圍分析" + viewshed_num.toString() + "</p>" + 
                                    "<br><img src='" + json.data.legendFilePath + "' style='align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
                        legend_win.attachHTMLString(legend_html)
                        
                        legend_win.hide()
                        viewshed_Tree.showItemCheckbox("v_legwin" + viewshed_num.toString(), false);
                        viewshed_legwin_link_arr.push(legend_win);
                        /*** add 20190515 ***/	
                        
                        viewshed_Tree.showItemCheckbox("d" + stlfile_num.toString(), false);
                        
                        
                        // Download button Default : closed
                        
                        viewshed_Tree.closeItem(new_node_id);
                            
                        // enable button
                        
                        btn_enable();
                                    
                    } else {
                        alert("您沒有權限使用此資料類型");
                        viewshed_Tree.deleteItem(loading_id, false);
                        btn_enable();
                    }
                    
                })
                .catch(function(error) {
                    if(error.response){
                        alert("error " + error.response.status);
                    }
                    viewshed_Tree.deleteItem(loading_id, false);
                    btn_enable();
                });
                
            } else {
                
                alert("尚未設定點位或輸入錯誤")
            }
        }

    },
    template:`
    <div>
                <div class='ui secondary menu'>
                    <a class='item' data-tab='one'><img src='img/paint01.png' alt=''></a>
                    <a class='item' id='viewshed_button' @click="get_viewshed_point"><img src='img/paint02.png' alt=''></a>
                    <button class='ui button' onclick='clear_map()'> clear </button>
                </div>
                <div class='ui form' id='viewshed_menu'>
                    <div class='eight wide field'>
                        <label>可視半徑(公尺)：最多 1500 公尺</label>
                        <input type='text' id='viewshed_radius' v-model='viewshed_distance_range'>
                    </div>
                    <div class='eight wide field'>
                        <label>眼睛高度(公尺)</label>
                        <input type='text' id='viewshed_height' v-model='viewshed_h'>
                    </div>
                    <div class='eight wide field'>
                        <label>數值資料</label>
                        <select id='viewshed_data' v-model='viewshed_data'>
                            <option value='TW_DLA_20010814_20061226_20M_3826'>20M TW DLA DTM (92-94年)</option>
                            <option value='TW_DLA_20110101_20161101_20M_3826'>20M TW DLA DTM (99-104年)</option>
                            <!-- 20190513 fixed -->
                            <!--
                    <option value='TW_DLA_20010814_20061226_5M_3826'>5M TW DLA DTM (92-94年)</option>
                    <option value='TW_DLA_20110101_20161101_5M_3826'>5M TW DLA DTM (99-104年)</option>
                    -->
                            <!-- 20190513 fixed -->
                        </select>
                    </div>
                </div>
                <br>
                <!-- add 20190515 -->
                <button class='ui button' id="get_viewshed_data" @click="get_viewshed">執行</button>
                <!-- add 20190515 -->
    </div>

`
});
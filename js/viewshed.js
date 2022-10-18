// 20190218 fixed

/*** add 20190515 ***/
var viewshed_cmd = "";

var viewshed_web_url;
var viewshed_wkt;
var viewshed_data;
var viewshed_distance_range;
var viewshed_h;
var viewshed_c;
/*** add 20190515 ***/


function get_viewshed_point(){
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
			viewshed_cmd = ""

        }, this);
		
	draw_box.on('drawend',
        function (e) {
			
			clear_map();
		 
			createMeasureTooltip();  
			
			btn_enable();	
			
            ori_coor = e.feature.getGeometry().getCoordinates()
	        var coor = ol.proj.transform(e.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
			maps[map_ind].removeInteraction(draw_box);
			
			// 傳送資料給後端抓取圖片	
			
			viewshed_web_url = "https://dtm.moi.gov.tw/services/viewshed/viewshed.asmx/getImageFile"
			viewshed_wkt = "POINT(" + coor[0] + "%20" + coor[1] + ")";
			viewshed_data = $("#viewshed_data").val();
			
            viewshed_c = "0,0,0";
            viewshed_h = $("#viewshed_height").val();
            viewshed_distance_range = $("#viewshed_radius").val();;
            
			viewshed_cmd = "ok"
        }, this);
		
       
 }
 
function get_viewshed()
{
	 
	 if ( viewshed_cmd === "ok" ) {
		btn_disable();	
	 
		loading_id = "l"+stlfile_num.toString();
		
		viewshed_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
		viewshed_Tree.enableCheckBoxes(false, false);
		
		
		$.ajax({
			type: 	"GET",
			url:	"php/viewshed.php",
			dataType:	"json",
			data: {
				u : viewshed_web_url,
				// delete
				w : viewshed_wkt,
				d : viewshed_data,
				c: viewshed_c,
				h: viewshed_h,
				/*** add 20190515 ***/
				l: (viewshed_num + 1),
				/*** add 20190515 ***/
				dt: viewshed_distance_range
			},
			success: function(json) {
				
				// create image layer
				
				if ( json.getData == true ) {
					
					viewshed_coor = json.bbox.split(',');
					viewshed_num = viewshed_num + 1;
					
					left_coor = ori_coor[0] - (viewshed_coor[2] - viewshed_coor[0]) / 2;
					down_coor = ori_coor[1] - (viewshed_coor[3] - viewshed_coor[1]) / 2;
					right_coor = parseFloat(ori_coor[0]) + (viewshed_coor[2] - viewshed_coor[0]) / 2;
					up_coor = ori_coor[1] + (viewshed_coor[3] - viewshed_coor[1]) / 2;
					
					var loc = ol.proj.transform([left_coor,up_coor], 'EPSG:3857', 'EPSG:4326')
					left = loc[0]
					up = loc[1]
					var loc = ol.proj.transform([right_coor,down_coor], 'EPSG:3857', 'EPSG:4326')
					right = loc[0]
					down = loc[1]
					
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
						"ID":"viewshed${viewshed_num.toString()}",
						"FileName":"視域範圍分析${viewshed_num.toString()}"
					}`.replace(/\n|\t/g, "").trim();
					
				
						
					// delete loading signal

					viewshed_Tree.deleteItem(loading_id, false);
					viewshed_Tree.enableCheckBoxes(true, true);
						
					// layer item
					
					viewshed_Tree.insertNewChild("0", new_node_id, "視域範圍分析" + viewshed_num.toString(), function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					
					/*** add 20190515 ***/
					viewshed_legend_link_arr.push(json.legendFilePath);
					viewshed_Tree.insertNewChild(new_node_id, "v_legend" + viewshed_num.toString(), "開啟圖例", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					var legend_win = dhxWins.createWindow("v_legwin" + viewshed_num.toString(), 600, 600, json.LegendImgWidth / 3, (json.LegendImgHeight / 3 + 120));
					legend_win.setText("");
					
					legend_win.attachEvent("onClose", function(win){
						var n = parseInt(this.getId().split("v_legwin")[1])
						viewshed_Tree.setCheck("v_legend" + n.toString(), false);
						//this.close();
						this.hide();
					});
					
					dhxWins.window("v_legwin" + viewshed_num.toString()).button("minmax").hide();
					dhxWins.window("v_legwin" + viewshed_num.toString()).button("park").hide();
					
					legend_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
								  "<div style='align: center; height:100%;width:100%;'>" + 
								  "<p style='text-align: center; font-size:8px;width:100%;' >視域範圍分析" + viewshed_num.toString() + "</p>" + 
								  "<br><img src='" + json.legendFilePath + "' style='align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
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
				
			},
			error: function(jqXHR) {
				alert("error " + jqXHR.status);
				viewshed_Tree.deleteItem(loading_id, false);
				btn_enable();
			}
		});
	 } else {
		 
		 alert("尚未設定點位或輸入錯誤")
	 }
 }
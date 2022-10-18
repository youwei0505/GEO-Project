//搜尋條件視窗
  
Model_w1 = dhxWins.createWindow("Model_w1", 360, 100, 350, 660);
Model_w1.setText("模式分析");
//Model_w1.denyMove();
//Model_w1.denyPark();
//Model_w1.denyResize();
Model_w1_Acc_all = Model_w1.attachAccordion({
	icons_path: "icons/model/",
	items: [
		{ id: "a0", text: "&nbsp;&nbsp;&nbsp;請勾選圖資" },
		{ id: "a1", text: "模式分析成果" },
		{ id: "a2", text: "&nbsp;&nbsp;&nbsp;請勾選圖資" },
		{ id: "a3", text: "&nbsp;&nbsp;&nbsp;請勾選圖資" },
		{ id: "a4", text: "&nbsp;&nbsp;&nbsp;請勾選圖資" },
		{ id: "a5", text: "&nbsp;&nbsp;&nbsp;請勾選圖資" },
		{ id: "a6", text: "&nbsp;&nbsp;&nbsp;請勾選圖資" }
	]
   
});



function remove_map(layer_content, layer_url){
	maps[map_ind].removeLayer(layer_content);
	if(map_ind == 1){
		for(var i = 0; i<imageryLayers_url_3DCesium.length;i++){
			if(imageryLayers_url_3DCesium[i]!=null && imageryLayers_url_3DCesium[i].indexOf(layer_url)!=-1){
				viewer.imageryLayers.remove(viewer.imageryLayers.get(i));
				imageryLayers_url_3DCesium.splice(i,1);
				break;
			}
		}
	}
}

function add_PNG_map(w, h, url, west, south, east, north, layer_array, url_array) {
	PNG_layer_content = new ol.layer.Image({
		source: new ol.source.ImageStatic({
			url: url,
			crossOrigin: 'anonymous',
			imageSize: [w, h],
			projection: maps[map_ind].getView().getProjection(),
			imageExtent: ol.extent.applyTransform([parseFloat(west), parseFloat(south), parseFloat(east), parseFloat(north)], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
		})
	});

	maps[map_ind].addLayer(PNG_layer_content);	
	PNG_layer_content.setZIndex(10000);
	layer_array.push(PNG_layer_content);
	url_array.push(url);

	if(map_ind == 1){
		var index = viewer.imageryLayers.length;

		var imageryLayer = viewer.imageryLayers.addImageryProvider(
			new Cesium.SingleTileImageryProvider({
				url: url,
				rectangle: Cesium.Rectangle.fromDegrees(west, south, east, north),
			})
		);
		imageryLayer.alpha = 0.75;
		imageryLayers_url_3DCesium[index] = url;
	}
}

function add_TILE_map(layer_content, layer_array, url_array) {
	TILE_layer_content = new ol.layer.Tile({
		source: new ol.source.TileImage({
			tileUrlFunction: function (tileCoord) {
				var z = tileCoord[0];
				var x = tileCoord[1] - 1;
				var y = -tileCoord[2] - 1;
				return layer_content.Url + z + '/' + y + '/' + x + '.jpg';
			},
			crossOrigin: 'anonymous'
		})
	});
	console.log('url : ', layer_content.Url);

	maps[map_ind].addLayer(TILE_layer_content);
	TILE_layer_content.setZIndex(10000);
	layer_array.push(TILE_layer_content);
	url_array.push(layer_content.Url);
	
	///////Cesium 3D///////
	if(/*model_3Dchange_index == 1 &&*/ map_ind == 1){
		var index = viewer.imageryLayers.length;
		var imageryLayer = viewer.imageryLayers.addImageryProvider(
			new Cesium.WebMapTileServiceImageryProvider_M({
				url: layer_content.Url + "{TileMatrix}/{TileRow}/{TileCol}.jpg",
				layer: '',
				style : 'default',
				format : 'image/jpg',
				tileMatrixSetID : 'default028mm',
				minimumLevel: 1,
				maximumLevel: 19,
			}),
			index
		);
		imageryLayers_url_3DCesium[index] = layer_content.Url;
	}
}

Model_w1_Acc_01 = Model_w1_Acc_all.cells("a1").attachAccordion({
	icons_path: "icons/model/",
	items: [
		{ id: "a0", text: "災害事件衛星影像判釋成果", icon: "a1-0.png" },
		{ id: "HECRAS", text: "HEC_RAS水理模擬模式", icon: "a1-0.png" },
		{ id: "DFMfGT", text: "DFMfGT模擬模式", icon: "a1-0.png" },
		{ id: "a1", text: "目前警戒資訊(資料僅於災中提供)", icon: "a1-1.png" },
		{ id: "a11",text: "歷史警戒資訊", icon: "a1-11.png" },
		{ id: "a2", text: "集水區安定指標", icon: "a1-2.png" },
		{ id: "a3", text: "衛星影像偵測疑似變異點", icon: "a1-3.png" }
		/*{ id: "a4", text: "水利署    ", icon: "a6-4.png" },
		{ id: "a5", text: "行政區界  ", icon: "a6-5.png" },
		{ id: "a6", text: "道路圖    ", icon: "a6-6.png" }*/
	]
});

// HEC_RAS

Model_w1_Acc_01.cells("HECRAS").attachHTMLString(
	"<div class='HEC_RAS_content'>"+ 
	'事件名稱 : <br> <select id="HEC_RAS_list" onchange="get_HEC_RAS_select_opt()">'+
	'<option value="0"> 00001_50m0.5hr-新竹梅花-深度          </option>'+
	'<option value="1"> 00002_30m0.5hr-台東大南溪-深度        </option>'+
	'<option value="2"> 00002_60m0.5hr-台東大南溪-深度          </option>'+
	'<option value="3"> 00002_30m  1hr-台東大南溪-深度        </option>'+
	'<option value="4"> 00002_30m  1hr-台東大南溪-深度(60m)   </option>'+
	'<option value="5"> 00002_60m  1hr-台東大南溪-深度        </option>'+
	'<option value="6"> 00002_60m  1hr-台東大南溪-深度(60m)   </option>'+
	'<option value="7"> 00002_30m0.5hr-台東大南溪-流速        </option>'+
	'<option value="8"> 00002_60m0.5hr-台東大南溪-流速        </option>'+
	'<option value="9"> 00002_30m1hr-台東大南溪-流速          </option>'+
	'<option value="10">00002_60m1hr-台東大南溪-流速          </option>'+
	'<option value="11">00003_17m0.25hr-南投小半天-深度       </option>'+
	'<option value="12">00003_7m0.25hr-南投小半天-深度        </option>'+
	'</select><br><br>'+
	'<img id="HEC_RAS_legend" src="https://storage.geodac.tw/Tile/Mode/HECRAS/00001/20190917_121208058_024685844_13_21600_Mode_HECRAS_1/colorbar.png"  style=" height:10%; width:100%; border-style:solid; border-width:3px; border-radius: 5px; border-color: gray;" >'+
	"<br><br>"+
	"<button id='HEC_RAS_start'> start </button>"+ 
	"<button id='HEC_RAS_stop'> stop </button>"+
	"<button id='HEC_RAS_reset'> reset </button>"+
	"<br><br>"+
	'速度 : <input type="text" id="HEC_RAS_speed" size="15" value="2">' +
	'取樣 : <input type="text" id="HEC_RAS_sample" size="15" value="10">' +
	"</div>"+
	"<br>"+
	'<div id="Progress" style="width: 90%; height: 30px; background-color: #ddd; margin:0 auto;">'+
	'<div id="Bar" style="width: 0%; height: 30px; background-color: #04AA6D; text-align: center; line-height: 30px; color: black;"></div>'+
	'時間(s)：<div id="HEC_RAS_time">1</div>'+
	'</div>'+
	"<button id='get_result' style='display:none'> get result </button>"
)	


let tmp_json=null;
let tid = null;
let counter=1;
let	HEC_RAS_layer_content = null;
let prepare_framesize = 2;
let sample_size = 1; 
let play_speed = 2;
// let HEC_RAS_time_counter = 1;
let HEC_RAS_layer_array = new Array();
let HEC_RAS_url_array = new Array();
let HEC_RAS_locate = 0;

let HEC_RAS_layer_size = 0;
let HEC_RAS_layer_size_array = [21600, 1081, 1081, 1081, 1081,1081,1081,1081,1081,1081,1081,300,99];
let url_base_array = [
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00001/20190917_121208058_024685844_13_',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/1/20210301_120987089_022768456_11_',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/2/20210301_120987089_022768456_11_',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/3/20210301_120987089_022768456_11_',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/3_60m/20210301_120987089_022768456_11_',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/4/20210301_120987089_022768456_11_',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/4_60m/20210301_120987089_022768456_11_',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/vel_1/20210301_120987089_022768456_11_',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/vel_2/20210301_120987089_022768456_11_',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/vel_3/20210301_120987089_022768456_11_',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/vel_4/20210301_120987089_022768456_11_',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00003/depth_8/20171114_120745552_023710833_13_',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00003/depth_10/20171114_120745552_023710833_13_'
	
]

let url_folder_array = [
	'_Mode_HECRAS/',
	'_Mode_HECRAS_1/',
	'_Mode_HECRAS_2/',
	'_Mode_HECRAS_3/',
	'_Mode_HECRAS_3_60m/',
	'_Mode_HECRAS_4/',
	'_Mode_HECRAS_4_60m/',
	'_Mode_HECRAS_vel_1/',
	'_Mode_HECRAS_vel_2/',
	'_Mode_HECRAS_vel_3/',
	'_Mode_HECRAS_vel_4/',
	'_Mode_HECRAS_depth_8/',
	'_Mode_HECRAS_depth_10/'
	
]

// tile image location
let HEC_RAS_coord_array = [
	[24.685844, 121.208058,13],
	[22.768456, 120.987089,13],
	[22.768456, 120.987089,13],
	[22.768456, 120.987089,13],
	[22.768456, 120.987089,13],
	[22.768456, 120.987089,13],
	[22.768456, 120.987089,13],
	[22.768456, 120.987089,13],
	[22.768456, 120.987089,13],
	[22.768456, 120.987089,13],
	[22.768456, 120.987089,13],
	[23.710833, 120.745552,15],
	[23.710833, 120.745552,15]
]
let HEC_RAS_coord=HEC_RAS_coord_array[0];


let HEC_RAS_legend_array = [
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00001/20190917_121208058_024685844_13_21600_Mode_HECRAS_1/colorbar.png',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/20210301_120987089_022768456_11_00100_Mode_HECRAS_1/colorbar.png',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/20210301_120987089_022768456_11_00100_Mode_HECRAS_2/colorbar.png',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/20210301_120987089_022768456_11_00100_Mode_HECRAS_3/colorbar.png',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/20210301_120987089_022768456_11_00100_Mode_HECRAS_3_60m/colorbar.png',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/20210301_120987089_022768456_11_00100_Mode_HECRAS_4/colorbar.png',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/20210301_120987089_022768456_11_00100_Mode_HECRAS_4_60m/colorbar.png',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/20210301_120987089_022768456_11_00100_Mode_HECRAS_vel_1/colorbar.png',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/20210301_120987089_022768456_11_00100_Mode_HECRAS_vel_2/colorbar.png',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/20210301_120987089_022768456_11_00100_Mode_HECRAS_vel_3/colorbar.png',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00002/20210301_120987089_022768456_11_00100_Mode_HECRAS_vel_4/colorbar.png',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00003/20171114_120745552_023710833_13_00100_Mode_HECRAS_depth_8/colorbar.png',
	'https://storage.geodac.tw/Tile/Mode/HECRAS/00003/20171114_120745552_023710833_13_00100_Mode_HECRAS_depth_10/colorbar.png'
	
]
let total_num = HEC_RAS_layer_size_array[0];
let url_base=url_base_array[0];
let url_folder=url_folder_array[0];
let HEC_RAS_pic_width = 0
let HEC_RAS_pic_height = 0;



function get_HEC_RAS_select_opt(){
	reset_HEC_RAS();

	let HEC_RAS_sel = document.getElementById("HEC_RAS_list");
	let HEC_RAS_sel_text = HEC_RAS_sel.options[HEC_RAS_sel.selectedIndex].text;
	HEC_RAS_select_opt = HEC_RAS_sel.value;

	console.log('HEC_RAS_select_opt: ', HEC_RAS_select_opt);
	console.log('HEC_RAS_select_text: ', HEC_RAS_sel_text);

	url_base = url_base_array[HEC_RAS_select_opt];
	url_folder = url_folder_array[HEC_RAS_select_opt];
	total_num = HEC_RAS_layer_size_array[HEC_RAS_select_opt];
	HEC_RAS_coord = HEC_RAS_coord_array[HEC_RAS_select_opt];

	document.getElementById("HEC_RAS_legend").src = HEC_RAS_legend_array[HEC_RAS_select_opt];

	if(url_folder[url_folder.length-1] == '/'){
		if(HEC_RAS_locate == 0){
			Locate(HEC_RAS_coord[0], HEC_RAS_coord[1], HEC_RAS_coord[2]);
			HEC_RAS_locate = 1;
		}
	}
	else{
		num = get_str_counter(current_counter);
		url = url_base+num+url_folder;
		kml = url.replace("png", "kml");
		var x = new XMLHttpRequest();
		x.open("GET", kml, true);
		let north=0, south=0, west=0, east=0;
	
		x.onreadystatechange = function () {
			if (x.readyState == 4 && x.status == 200){
				let doc = x.responseXML;
				north = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("north")[0].firstChild.nodeValue;
				west = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("west")[0].firstChild.nodeValue;
				south = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("south")[0].firstChild.nodeValue;
				east = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("east")[0].firstChild.nodeValue;
				console.log("north:",north,"\nsouth:",south,"\nwest:",west,"\neast:",east);
				// console.log('add =======> https://storage.geodac.tw/Tile/Mode/HECRAS/00001/20190917_121208058_024685844_13_'+num+'_Mode_HECRAS/')
				if(HEC_RAS_locate == 0){
					Locate(north, west, 12);
					HEC_RAS_locate = 1;
				}
			}
		};
	
		x.send(null);
	}

}


function reset_HEC_RAS(){
	document.getElementById("Bar").style.width = 0 + "%";
	document.getElementById("HEC_RAS_sample").value = 10;
	document.getElementById("HEC_RAS_speed").value = 2;
	document.getElementById("HEC_RAS_time").innerHTML = 1;
	tid = null;
	for(let i=0; i<=HEC_RAS_layer_array.length; i++){
		remove_map(HEC_RAS_layer_array[i], HEC_RAS_url_array[i]);
	}
	counter=1;
	// HEC_RAS_time_counter=1;
	HEC_RAS_layer_array = new Array();
	HEC_RAS_url_array = new Array();
	HEC_RAS_locate = 0;
}

$("#HEC_RAS_start").click(function() {
	sample_size = parseInt(document.getElementById("HEC_RAS_sample").value);
	play_speed = parseFloat(1000 / parseFloat(document.getElementById("HEC_RAS_speed").value));
	console.log('==================', sample_size, ' frames - ', play_speed, 'ms =========================');
	prepare_framesize = parseInt(document.getElementById("HEC_RAS_speed").value)+2;
	if(prepare_framesize < 2){
		prepare_framesize = 4;
	}
	if(tid == null){
		tid = setInterval(function(){
			if(counter > total_num){
				clearInterval(tid);
				document.getElementById("Bar").style.width = 100 + '%';
			}
			if(counter <= total_num){
				// document.getElementById("HEC_RAS_time").innerHTML = parseFloat(HEC_RAS_time_counter*(play_speed/1000)).toFixed(1);
				add_HEC_RAS_layer(counter);
				counter = counter+sample_size;
				let achieve_percentage = counter / total_num;
				if(achieve_percentage >= 1){
					achieve_percentage = 1
				}
				document.getElementById("Bar").style.width = achieve_percentage*100 + "%";
				if(counter-1 >= total_num){
					document.getElementById("HEC_RAS_time").innerHTML = total_num;
				}
				else{
					document.getElementById("HEC_RAS_time").innerHTML = counter-1;
				}
				// HEC_RAS_time_counter = HEC_RAS_time_counter+1;
			}
		}, play_speed)
	}
})

$("#HEC_RAS_stop").click(function() {
	console.log('HEC_RAS stop click!!');
	clearInterval(tid);
	tid = null;
	// HEC_RAS_locate = 0;
})

$("#HEC_RAS_reset").click(function() {
	console.log('HEC_RAS reset click!!');
	clearInterval(tid);
	reset_HEC_RAS();
})

function get_str_counter(num){
	if(num.toString().length < 2){
		current_num = '0000'+num.toString();
	}
	else if(num.toString().length < 3){
		current_num = '000'+num.toString();
	}
	else if(num.toString().length < 4){
		current_num = '00'+num.toString();
	}
	else if(num.toString().length < 5){
		current_num = '0'+num.toString();
	}
	else{
		current_num = num.toString();
	}

	return current_num;
}

function add_HEC_RAS_layer(current_counter){
	// let achieve_percentage = current_counter / total_num;
	// document.getElementById("Bar").style.width = achieve_percentage*100 + "%";

	// tile image
	if(url_folder[url_folder.length-1] == '/'){
		if(HEC_RAS_locate == 0){
			Locate(HEC_RAS_coord[0], HEC_RAS_coord[1], 12);
			HEC_RAS_locate = 1;
		}
		num = get_str_counter(current_counter)
		HEC_RAS_layer_content = {
			Url : url_base+num+url_folder
		};
		add_TILE_map(HEC_RAS_layer_content, HEC_RAS_layer_array, HEC_RAS_url_array);
	}
	// png image
	else{
		num = get_str_counter(current_counter);
		url = url_base+num+url_folder;
		kml = url.replace("png", "kml");

		if(HEC_RAS_pic_width==0 || HEC_RAS_pic_height==0){
			let img = new Image();
			img.src = url;
			img.onload = function(){
				HEC_RAS_pic_width=img.width;
				HEC_RAS_pic_height=img.height;
			};
			HEC_RAS_pic_width=img.width;
			HEC_RAS_pic_height=img.height;
		}
		// console.log('width:', DFMfGT_pic_width,', height:', DFMfGT_pic_height);
		var x = new XMLHttpRequest();
		x.open("GET", kml, true);

		let north=0, south=0, west=0, east=0;
	
		x.onreadystatechange = function () {
			// console.log(x.readyState);
			// console.log(x.status);
			if (x.readyState == 4 && x.status == 200){
				let doc = x.responseXML;
				north = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("north")[0].firstChild.nodeValue;
				west = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("west")[0].firstChild.nodeValue;
				south = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("south")[0].firstChild.nodeValue;
				east = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("east")[0].firstChild.nodeValue;
				console.log("north:",north,"\nsouth:",south,"\nwest:",west,"\neast:",east);
				// console.log('add =======> https://storage.geodac.tw/Tile/Mode/HECRAS/00001/20190917_121208058_024685844_13_'+num+'_Mode_HECRAS/')
				add_PNG_map(HEC_RAS_pic_width, HEC_RAS_pic_height, url, west, south, east, north, HEC_RAS_layer_array, HEC_RAS_url_array);

				if(HEC_RAS_locate == 0){
					Locate(north, west, 12);
					HEC_RAS_locate = 1;
				}
			}
		};
	
		x.send(null);
	}

	if(current_counter - prepare_framesize*sample_size > 0){
		remove_map(HEC_RAS_layer_array[0], HEC_RAS_url_array[0]);
		HEC_RAS_layer_array.shift();
		HEC_RAS_url_array.shift();
	}
}


// DFMfGT
Model_w1_Acc_01.cells("DFMfGT").attachHTMLString(
	"<div class='DFMfGT_content'>"+ 
	'事件名稱 : <br> <select id="DFMfGT_list" onchange="get_DFMfGT_select_opt()">'+
	'<option value="0">00001 - 20090808莫拉克小林村</option>'+
	'<option value="1">00002 - 20090808莫拉克小林村_測試</option>'+
	'</select><br><br>'+
	"<input type='checkbox' id='DFMfGT_vel' checked='checked'> 流速模擬   " +
	"<input type='checkbox' id='DFMfGT_phis'> 濃度模擬   " +
	"<input type='checkbox' id='DFMfGT_depth'> 深度模擬   " +
	"<br>"+
	'<img id="DFMfGT_legend_img" src="https://storage.geodac.tw/Tile/Mode/DFMfGT/00001/vel/20090808_00_120655350_023164787_14_001_Mode_DFMfGT_Vel/colorbar/vel.png"  style=" height:10%; width:100%; border-style:solid; border-width:3px; border-radius: 5px; border-color: gray;" >'+
	// '<canvas id="DFMfGT_legend" width="340" height="75" style="border:1px solid #d3d3d3;"></canvas>'+
	"<br><br>"+
	"<button id='DFMfGT_start'> start </button>"+ 
	"<button id='DFMfGT_stop'> stop </button>"+
	"<button id='DFMfGT_reset'> reset </button>"+
	"<br><br>"+
	'速度 : <input type="text" id="DFMfGT_speed" size="15" value="2">' +
	'取樣 : <input type="text" id="DFMfGT_sample" size="15" value="1">' +
	"</div>"+
	"<br>"+
	'<div id="DFMfGT_Progress" style="width: 90%; height: 30px; background-color: #ddd; margin:0 auto;">'+
	'<div id="DFMfGT_Bar" style="width: 0%; height: 30px; background-color: #04AA6D; text-align: center; line-height: 30px; color: black;"></div>'+
	'時間(s)：<div id="DFMfGT_time">1</div>'+
	'</div>'
)	

// let c = document.getElementById("DFMfGT_legend");
// let ctx = c.getContext("2d");
// let img = document.getElementById("DFMfGT_legend_img");

// function reset_lengend_canvas(){
// 	c.setAttribute('width', 340);
// 	c.setAttribute('height', 75);
// 	ctx.clearRect(0, 0, c.width, c.height); //clear html5 canvas
// }


$("#DFMfGT_vel").click(function() {
	if($("#DFMfGT_vel").prop("checked")) {
		// reset_lengend_canvas();
		document.getElementById("DFMfGT_legend_img").src = DFMfGT_vel_legend;
		document.getElementById("DFMfGT_phis").checked = false;
		document.getElementById("DFMfGT_depth").checked = false;
		// img.style.transform = "rotate(0deg)";
		// setTimeout(() => {
		// 	ctx.drawImage(img, 0, 0, 340, 75);	
		// }, 100);
	} 
	else {
		document.getElementById("DFMfGT_vel").checked = true;
		document.getElementById("DFMfGT_phis").checked = false;
		document.getElementById("DFMfGT_depth").checked = false;
	}
});

$("#DFMfGT_phis").click(function() {
	if($("#DFMfGT_phis").prop("checked")) {
		// reset_lengend_canvas();
		document.getElementById("DFMfGT_legend_img").src = DFMfGT_phis_legend;
		document.getElementById("DFMfGT_vel").checked = false;
		document.getElementById("DFMfGT_depth").checked = false;
		// img.style.transform = "rotate(90deg)";
		// setTimeout(() => {
		// 	ctx.rotate(90 * Math.PI / 180);
		// 	ctx.drawImage(img, 5, -img.height+150, 75, 340);
		// }, 100);
	} 
	else {
		document.getElementById("DFMfGT_phis").checked = true;
		document.getElementById("DFMfGT_vel").checked = false;
		document.getElementById("DFMfGT_depth").checked = false;
	}
});

$("#DFMfGT_depth").click(function() {
	if($("#DFMfGT_depth").prop("checked")) {
		// reset_lengend_canvas()
		document.getElementById("DFMfGT_legend_img").src = DFMfGT_depth_legend;
		document.getElementById("DFMfGT_vel").checked = false;
		document.getElementById("DFMfGT_phis").checked = false;
		// img.style.transform = "rotate(0deg)";
		// setTimeout(() => {
		// 	ctx.drawImage(img, 0, 0, 340, 75);	
		// }, 100);
	} 
	else {
		document.getElementById("DFMfGT_depth").checked = true;
		document.getElementById("DFMfGT_vel").checked = false;
		document.getElementById("DFMfGT_phis").checked = false;
	}
});


let DFMfGT_tid = null;
let DFMfGT_counter=1;
let	DFMfGT_layer_content = null;
let DFMfGT_prepare_framesize = 2;
let DFMfGT_sample_size = 1; 
let DFMfGT_play_speed = 2;
// let DFMfGT_time_counter = 1;
let DFMfGT_layer_array = new Array();
let DFMfGT_url_array = new Array();
let DFMfGT_locate = 0;

let DFMfGT_layer_size_array = [181, 100];
let DFMfGT_url_base_array = [
	[
		'https://storage.geodac.tw/Tile/Mode/DFMfGT/00001/vel/20090808_00_120655350_023164787_14_',
		'https://storage.geodac.tw/Tile/Mode/DFMfGT/00001/depth/20090808_00_120655350_023164787_14_',
		'https://storage.geodac.tw/Tile/Mode/DFMfGT/00001/phis/20090808_00_120655350_023164787_14_'

	],
	[
		'https://storage.geodac.tw/Tile/Mode/DFMfGT/00002/vel/20090808_00_120655350_023164787_14_',
		'https://storage.geodac.tw/Tile/Mode/DFMfGT/00002/depth/20090808_00_120655350_023164787_14_',
		'https://storage.geodac.tw/Tile/Mode/DFMfGT/00002/phis/20090808_00_120655350_023164787_14_'
	]
]

let DFMfGT_url_folder_array = [
	[
		'_Mode_DFMfGT_Vel.png',
		'_Mode_DFMfGT_Depth.png',
		'_Mode_DFMfGT_Phis.png'
	],
	[
		'_Mode_DFMfGT_Vel.png',
		'_Mode_DFMfGT_Depth.png',
		'_Mode_DFMfGT_Phis.png'
	]
]

// lengend position url
let DFMfGT_legend_array = [
	[
		'https://storage.geodac.tw/Tile/Mode/DFMfGT/00001/vel/20090808_00_120655350_023164787_14_001_Mode_DFMfGT_Vel/colorbar/vel.png',
		'https://storage.geodac.tw/Tile/Mode/DFMfGT/00001/depth/20090808_00_120655350_023164787_14_001_Mode_DFMfGT_Depth/colorbar/depth.png',
		'https://storage.geodac.tw/Tile/Mode/DFMfGT/00001/phis/20090808_00_120655350_023164787_14_001_Mode_DFMfGT_Phis/colorbar/phis.png'
	],
	[
		'https://storage.geodac.tw/Tile/Mode/DFMfGT/00002/vel/20090808_00_120655350_023164787_14_001_Mode_DFMfGT_Vel/colorbar/vel.png',
		'https://storage.geodac.tw/Tile/Mode/DFMfGT/00002/depth/20090808_00_120655350_023164787_14_001_Mode_DFMfGT_Depth/colorbar/depth.png',
		'https://storage.geodac.tw/Tile/Mode/DFMfGT/00002/phis/20090808_00_120655350_023164787_14_001_Mode_DFMfGT_Phis/colorbar/phis.png'
	]
]

let DFMfGT_total_num = DFMfGT_layer_size_array[0];
let DFMfGT_vel_base = DFMfGT_url_base_array[0][0];
let DFMfGT_vel_folder = DFMfGT_url_folder_array[0][0];
let DFMfGT_depth_base = DFMfGT_url_base_array[0][1];
let DFMfGT_depth_folder = DFMfGT_url_folder_array[0][1];
let DFMfGT_phis_base = DFMfGT_url_base_array[0][2];
let DFMfGT_phis_folder = DFMfGT_url_folder_array[0][2];
let DFMfGT_vel_legend = DFMfGT_legend_array[0][0];
let DFMfGT_depth_legend = DFMfGT_legend_array[0][1];
let DFMfGT_phis_legend = DFMfGT_legend_array[0][2];

let DFMfGT_pic_width = 0
let DFMfGT_pic_height = 0;

// tile image location
let DFMfGT_coord_array = [
	[0, 0],
	[0, 0]
]
let DFMfGT_coord=DFMfGT_coord_array[0];


function get_DFMfGT_select_opt(){
	reset_DFMfGT();

	let DFMfGT_sel = document.getElementById("DFMfGT_list");
	let DFMfGT_sel_text = DFMfGT_sel.options[DFMfGT_sel.selectedIndex].text;
	DFMfGT_select_opt = DFMfGT_sel.value;

	console.log('DFMfGT_select_opt: ', DFMfGT_select_opt);
	console.log('DFMfGT_select_text: ', DFMfGT_sel_text);

	DFMfGT_vel_base = DFMfGT_url_base_array[DFMfGT_select_opt][0];
	DFMfGT_vel_folder = DFMfGT_url_folder_array[DFMfGT_select_opt][0];

	DFMfGT_depth_base = DFMfGT_url_base_array[DFMfGT_select_opt][1];
	DFMfGT_depth_folder = DFMfGT_url_folder_array[DFMfGT_select_opt][1];

	DFMfGT_phis_base = DFMfGT_url_base_array[DFMfGT_select_opt][2];
	DFMfGT_phis_folder = DFMfGT_url_folder_array[DFMfGT_select_opt][2];

	DFMfGT_vel_legend = DFMfGT_legend_array[DFMfGT_select_opt][0];
	DFMfGT_depth_legend = DFMfGT_legend_array[DFMfGT_select_opt][1];
	DFMfGT_phis_legend = DFMfGT_legend_array[DFMfGT_select_opt][2];

	DFMfGT_total_num = DFMfGT_layer_size_array[DFMfGT_select_opt];
	DFMfGT_coord = DFMfGT_coord_array[DFMfGT_select_opt];

	if(DFMfGT_vel_folder[DFMfGT_vel_folder.length-1]=='/'){
		if(DFMfGT_locate == 0){
			Locate(DFMfGT_coord[0], DFMfGT_coord[1], 12);
			DFMfGT_locate = 1;
		}
	}
	else{
		num = get_DFMfGT_counter(1);
		url = DFMfGT_vel_base + num + DFMfGT_vel_folder;
		kml = url.replace("png", "kml");
		// kml = kml.replace("Z:\\","https://storage.geodac.tw/");
		var x = new XMLHttpRequest();
		x.open("GET", kml, true);
		let north=0, south=0, west=0, east=0;
		x.onreadystatechange = function () {
			// console.log(x.readyState);
			// console.log(x.status);
			if (x.readyState == 4 && x.status == 200){
				let doc = x.responseXML;
				north = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("north")[0].firstChild.nodeValue;
				west = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("west")[0].firstChild.nodeValue;
				south = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("south")[0].firstChild.nodeValue;
				east = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("east")[0].firstChild.nodeValue;
				console.log("north:",north,"\nsouth:",south,"\nwest:",west,"\neast:",east);
				if(DFMfGT_locate == 0){
					Locate(north, west, 12);
					DFMfGT_locate = 1;
				}
			}
		};
	
		x.send(null);
	}
}


function reset_DFMfGT(){
	document.getElementById("DFMfGT_Bar").style.width = 0 + "%";
	document.getElementById("DFMfGT_sample").value = 1;
	document.getElementById("DFMfGT_speed").value = 2;
	document.getElementById("DFMfGT_time").innerHTML = 1;
	DFMfGT_tid = null;
	for(let i=0; i<=DFMfGT_layer_array.length; i++){
		remove_map(DFMfGT_layer_array[i], DFMfGT_url_array[i]);
	}
	DFMfGT_counter=1;
	// DFMfGT_time_counter=1;
	DFMfGT_layer_array = new Array();
	DFMfGT_url_array = new Array();
	DFMfGT_locate = 0;
}

function get_DFMfGT_counter(num){
	if(num.toString().length < 2){
		current_num = '00'+num.toString();
	}
	else if(num.toString().length < 3){
		current_num = '0'+num.toString();
	}
	else{
		current_num = num.toString();
	}
	return current_num;
}


$("#DFMfGT_start").click(function() {
	DFMfGT_sample_size = parseInt(document.getElementById("DFMfGT_sample").value);
	DFMfGT_play_speed = parseFloat(1000 / parseFloat(document.getElementById("DFMfGT_speed").value));
	console.log('==================', DFMfGT_sample_size, ' frames - ', DFMfGT_play_speed, 'ms =========================');
	DFMfGT_prepare_framesize = parseInt(document.getElementById("DFMfGT_speed").value);
	if(DFMfGT_prepare_framesize < 2){
		DFMfGT_prepare_framesize = 2;
	}
	if(DFMfGT_tid == null){
		DFMfGT_tid = setInterval(function(){
			if(DFMfGT_counter > DFMfGT_total_num){
				clearInterval(DFMfGT_tid);
				document.getElementById("DFMfGT_Bar").style.width = 100 + '%';
			}
			if(DFMfGT_counter <= DFMfGT_total_num){
				// document.getElementById("DFMfGT_time").innerHTML = parseFloat(DFMfGT_time_counter*(DFMfGT_play_speed/1000)).toFixed(1);
				add_DFMfGT_layer(DFMfGT_counter);
				console.log('soil_counter : ', DFMfGT_counter);
				console.log('total_num : ', DFMfGT_total_num);
				console.log('sample_size : ', DFMfGT_sample_size);
				console.log('play_speed : ', DFMfGT_play_speed);
				console.log('prepare_framesize : ', DFMfGT_prepare_framesize);
				console.log('image array len : ', DFMfGT_layer_array.length);

				DFMfGT_counter = DFMfGT_counter+DFMfGT_sample_size;
				let achieve_percentage = DFMfGT_counter / DFMfGT_total_num;
				if(achieve_percentage >= 1){
					achieve_percentage = 1;
				}
				document.getElementById("DFMfGT_Bar").style.width = achieve_percentage*100 + "%";
				if(DFMfGT_counter-1 >= DFMfGT_total_num){
					document.getElementById("DFMfGT_time").innerHTML = DFMfGT_total_num;
				}
				else{
					document.getElementById("DFMfGT_time").innerHTML = DFMfGT_counter-1;
				}
				// DFMfGT_time_counter = DFMfGT_time_counter+1;
			}
		}, DFMfGT_play_speed)
	}
})

$("#DFMfGT_stop").click(function() {
	console.log('DFMfGT stop click!!');
	clearInterval(DFMfGT_tid);
	DFMfGT_tid = null;
	// DFMfGT_locate = 0;
})

$("#DFMfGT_reset").click(function() {
	clearInterval(DFMfGT_tid);
	console.log('DFMfGT reset click!!');
	reset_DFMfGT();
})

function add_DFMfGT_layer(current_counter){
	// let achieve_percentage = current_counter / DFMfGT_total_num;
	// document.getElementById("DFMfGT_Bar").style.width = achieve_percentage*100 + "%";


	// tile image
	if(DFMfGT_vel_folder[DFMfGT_vel_folder.length-1]=='/'){
		if(DFMfGT_locate == 0){
			Locate(DFMfGT_coord[0], DFMfGT_coord[1], 12);
			DFMfGT_locate = 1;
		}
		num = get_DFMfGT_counter(current_counter)
		DFMfGT_layer_content = {
			Url : url_base+num+url_folder
		};
		add_TILE_map(DFMfGT_layer_content, DFMfGT_layer_array, DFMfGT_url_array);
	}
	// png inage
	else{
		num = get_DFMfGT_counter(current_counter);
		url = DFMfGT_vel_base + num + DFMfGT_vel_folder;
		kml = url.replace("png", "kml");
		// kml = kml.replace("Z:\\","https://storage.geodac.tw/");


		if(DFMfGT_pic_width==0 || DFMfGT_pic_height==0){
			let img = new Image();
			img.src = url;
			img.onload = function(){
				DFMfGT_pic_width=img.width;
				DFMfGT_pic_height=img.height;
			};
			DFMfGT_pic_width=img.width;
			DFMfGT_pic_height=img.height;
		}
		// console.log('width:', DFMfGT_pic_width,', height:', DFMfGT_pic_height);
		var x = new XMLHttpRequest();
		x.open("GET", kml, true);

		let north=0, south=0, west=0, east=0;
	
		x.onreadystatechange = function () {
			// console.log(x.readyState);
			// console.log(x.status);
			if (x.readyState == 4 && x.status == 200){
				let doc = x.responseXML;
				north = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("north")[0].firstChild.nodeValue;
				west = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("west")[0].firstChild.nodeValue;
				south = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("south")[0].firstChild.nodeValue;
				east = doc.getElementsByTagName("GroundOverlay")[0].getElementsByTagName("LatLonBox")[0].getElementsByTagName("east")[0].firstChild.nodeValue;
				console.log("north:",north,"\nsouth:",south,"\nwest:",west,"\neast:",east);
				// console.log('add =======> https://storage.geodac.tw/Tile/Mode/HECRAS/00001/20190917_121208058_024685844_13_'+num+'_Mode_HECRAS/')
				if(document.getElementById('DFMfGT_vel').checked){
					add_PNG_map(DFMfGT_pic_width, DFMfGT_pic_height, url, west, south, east, north, DFMfGT_layer_array, DFMfGT_url_array);
				}
				else if(document.getElementById('DFMfGT_phis').checked){
					phis_url = DFMfGT_phis_base + num + DFMfGT_phis_folder;
					add_PNG_map(DFMfGT_pic_width, DFMfGT_pic_height, phis_url, west, south, east, north, DFMfGT_layer_array, DFMfGT_url_array);
				}
				else if(document.getElementById('DFMfGT_depth').checked){
					depth_url = DFMfGT_depth_base + num + DFMfGT_depth_folder;
					add_PNG_map(DFMfGT_pic_width, DFMfGT_pic_height, depth_url, west, south, east, north, DFMfGT_layer_array, DFMfGT_url_array);
				}
				if(DFMfGT_locate == 0){
					Locate(north, west, 12);
					DFMfGT_locate = 1;
				}
			}
		};
	
		x.send(null);
	}
	
	if(current_counter - DFMfGT_prepare_framesize*DFMfGT_sample_size > 0){			
		remove_map(DFMfGT_layer_array[0], DFMfGT_url_array[0])
		DFMfGT_layer_array.shift();
		DFMfGT_url_array.shift()

	}
}
	
			var Model_w1_Acc_01_Tree_01_load_ind=0;
			var Model_w1_Acc_01_Tree_011_load_ind=0;
			var Model_w1_Acc_01_Tree_02_load_ind=0;
			var Model_w1_Acc_01_Tree_03_load_ind=0;

			
			Model_w1_Acc_01.attachEvent("onBeforeActive", function(id){
				
				//console.log("onBeforeActive event, cell: "+id);
				
				if(Model_w1_Acc_01_Tree_01_load_ind==0 && id=="a1" )  {Model_w1_Acc_01_Tree_01.load("php/MD_A01_T01.php"); Model_w1_Acc_01_Tree_01_load_ind=1;}
				if(Model_w1_Acc_01_Tree_011_load_ind==0 && id=="a11" ){Model_w1_Acc_01_Tree_011.load("php/MD_A01_T011.php");; Model_w1_Acc_01_Tree_011_load_ind=1;}
				if(Model_w1_Acc_01_Tree_02_load_ind==0 && id=="a2" )  {Model_w1_Acc_01_Tree_02.loadXML("tree_xml/model/IntraOffice_02.xml"); Model_w1_Acc_01_Tree_02_load_ind=1;}
				if(Model_w1_Acc_01_Tree_03_load_ind==0 && id=="a3" )  {Model_w1_Acc_01_Tree_03.loadXML("tree_xml/model/IntraOffice_03.xml"); Model_w1_Acc_01_Tree_03_load_ind=1;}//Model_w1_Acc_01_Tree_03.load("php/MD_A01_T03.php"); 
				
				return true;
			});
			
			Model_w1_Acc_01_call();
			
			Model_w1_Acc_01_Tree_00 = Model_w1_Acc_01.cells("a0").attachTree();
		    Model_w1_Acc_01_Tree_00.setImagePath("codebase/imgs/dhxtree_material/");
		    Model_w1_Acc_01_Tree_00.enableCheckBoxes(1);			
		    Model_w1_Acc_01_Tree_00.enableThreeStateCheckboxes(true);
		    Model_w1_Acc_01_Tree_00.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
		    Model_w1_Acc_01_Tree_00.setOnCheckHandler(Layer_Tree_OnCheck_Model_Tree00);			
		    Model_w1_Acc_01_Tree_00.setOnDblClickHandler(Location_Grid_DblClicked);
		    //Model_w1_Acc_01_Tree_00.loadXML("tree_xml/model/IntraOffice_00.xml");
			Model_w1_Acc_01_Tree_00.load("php/DisEvent_layer.php");
						
			Model_w1_Acc_01_Tree_01 = Model_w1_Acc_01.cells("a1").attachTree();
		    Model_w1_Acc_01_Tree_01.setImagePath("codebase/imgs/dhxtree_material/");
		    Model_w1_Acc_01_Tree_01.enableCheckBoxes(1);			
		    Model_w1_Acc_01_Tree_01.enableThreeStateCheckboxes(true);
		    Model_w1_Acc_01_Tree_01.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
		    Model_w1_Acc_01_Tree_01.setOnCheckHandler(Layer_Tree_OnCheck_Model_Tree01);			
		    Model_w1_Acc_01_Tree_01.setOnDblClickHandler(Location_Grid_DblClicked);
			//Model_w1_Acc_01_Tree_01.load("php/LHI_layer.php");
			Model_w1_Acc_01.cells("a1").hide();
			
			/*function Model_w1_Acc_01_Tree_01_data(event){
				
			  	event.preventDefault(); //不刷新頁面
			
				$.ajax({					
					type:"POST",  //傳值方式有分 post & get
					dataType: "xml",
	                url:"php/LHI_layer.php",
					success: function(response){
						//alert(response);
                        Model_w1_Acc_01_Tree_01_data_call(response);                      
                    }
				});
			};
			Model_w1_Acc_01_Tree_01_data_call(xml_str){
				
			}*/
			
		    //Model_w1_Acc_01_Tree_01.loadStruct("http://uavp.geodac.tw/geoinfo_api/api/geodac/weather/latestraincwb/xml");
			
			Model_w1_Acc_01_Tree_011 = Model_w1_Acc_01.cells("a11").attachTree();
		    Model_w1_Acc_01_Tree_011.setImagePath("codebase/imgs/dhxtree_material/");
		    Model_w1_Acc_01_Tree_011.enableCheckBoxes(1);			
		    Model_w1_Acc_01_Tree_011.enableThreeStateCheckboxes(true);
		    Model_w1_Acc_01_Tree_011.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
		    Model_w1_Acc_01_Tree_011.setOnCheckHandler(Layer_Tree_OnCheck_Model_Tree011);			
		    Model_w1_Acc_01_Tree_011.setOnDblClickHandler(Location_Grid_DblClicked);
		    //Model_w1_Acc_01_Tree_011.loadXML("tree_xml/model/IntraOffice_011.xml");
			Model_w1_Acc_01.cells("a11").hide();		
			Model_w1_Acc_01_Tree_02 = Model_w1_Acc_01.cells("a2").attachTree();
		    Model_w1_Acc_01_Tree_02.setImagePath("codebase/imgs/dhxtree_material/");
		    Model_w1_Acc_01_Tree_02.enableCheckBoxes(1);
		    Model_w1_Acc_01_Tree_02.enableThreeStateCheckboxes(true);
		    Model_w1_Acc_01_Tree_02.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
		    Model_w1_Acc_01_Tree_02.setOnCheckHandler(Layer_Tree_OnCheck_Model_Tree02);
		    Model_w1_Acc_01_Tree_02.setOnDblClickHandler(Location_Grid_DblClicked);
			
		    //Model_w1_Acc_01_Tree_02.loadXML("tree_xml/model/IntraOffice_02.xml");
			
			
			Model_w1_Acc_01_Tree_03_Menu = new dhtmlXMenuObject();
			Model_w1_Acc_01_Tree_03_Menu.setIconsPath("icons/model/menu/");
			Model_w1_Acc_01_Tree_03_Menu.renderAsContextMenu();
			Model_w1_Acc_01_Tree_03_Menu.attachEvent("onClick",Model_w1_Acc_01_Tree_03_Menu_onButtonClick);
			Model_w1_Acc_01_Tree_03_Menu.loadStruct("tree_xml/model/IntraOffice_03_menu.xml");
				
			
			Model_w1_Acc_01_Tree_03 = Model_w1_Acc_01.cells("a3").attachTree();
		    Model_w1_Acc_01_Tree_03.setImagePath("codebase/imgs/dhxtree_material/");
		    Model_w1_Acc_01_Tree_03.enableCheckBoxes(1);
		    Model_w1_Acc_01_Tree_03.enableThreeStateCheckboxes(true);
		    Model_w1_Acc_01_Tree_03.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
		    Model_w1_Acc_01_Tree_03.setOnCheckHandler(Layer_Tree_OnCheck_Model_Tree03);
		    Model_w1_Acc_01_Tree_03.setOnDblClickHandler(Location_Grid_DblClicked);
			//Model_w1_Acc_01_Tree_03.enableContextMenu(Model_w1_Acc_01_Tree_03_Menu);		
			Model_w1_Acc_01_Tree_03.attachEvent("onBeforeContextMenu",function(itemId){
				
				if (Model_w1_Acc_01_Tree_03.hasChildren(itemId) > 0 || itemId.indexOf("TileImage") > 0 ){
					Model_w1_Acc_01_Tree_03_Menu.hideItem('change_overlay');
				} else {
					Model_w1_Acc_01_Tree_03_Menu.showItem('change_overlay');
				}
				return true
			});
		    //Model_w1_Acc_01_Tree_03.loadXML("tree_xml/model/IntraOffice_03.xml");
			Model_w1_Acc_01.cells("a3").hide();
			
			function Model_w1_Acc_01_Tree_03_Menu_onButtonClick(menuitemId,type){
				var id = Model_w1_Acc_01_Tree_03.contextID;
			if(menuitemId=="change_overlay"){
				 //alert(id);
				 // alert(All_Check_List_W0);
				 
				image_id_arr=(id.substr(87, 17)).split('_');
				before_image_id="23.44902889;121.00409163;;7@TileImage@https://storage.geodac.tw/Tile/RSImage/Satellite/Sentinel2/"+image_id_arr[0]+"_121004092_023449029_07_000_RSImage_Satellite_Sentinel2/";
			    after_image_id="23.44902889;121.00409163;;7@TileImage@https://storage.geodac.tw/Tile/RSImage/Satellite/Sentinel2/"+image_id_arr[1]+"_121004092_023449029_07_000_RSImage_Satellite_Sentinel2/";
	
				W0_Layer_Checked("Model_w1_Acc_01_Tree_03",before_image_id);
				W0_Layer_Checked("Model_w1_Acc_01_Tree_03",id);
				
				W1_Layer_Checked("Model_w1_Acc_01_Tree_03",after_image_id);
				W1_Layer_Checked("Model_w1_Acc_01_Tree_03",id);
			
				if(map_ind==0){
				document.getElementById("mwt_slider_content_in").innerHTML =All_Check_List_W0_Str;
				}else if(map_ind==1){
				document.getElementById("mwt_slider_content_in").innerHTML =All_Check_List_W1_Str;	
				}
				/*if(map_ind==0){
					
					
					Layer_Tree_OnCheck_Model_Tree03(before_image_id, 1);
					Model_w1_Acc_01_Tree_03.setCheck(before_image_id, 1);
					Layer_Tree_OnCheck_Model_Tree03(id, 1);
				    Model_w1_Acc_01_Tree_03.setCheck(id, 1);
					map_ind=1;				
				}else if(map_ind==1){
					Layer_Tree_OnCheck_Model_Tree03(after_image_id, 1);
					Model_w1_Acc_01_Tree_03.setCheck(after_image_id, 1);
					Layer_Tree_OnCheck_Model_Tree03(id, 1);
					Model_w1_Acc_01_Tree_03.setCheck(id, 1);
					map_ind=0;
					}
				

				if(map_ind==0){
					Layer_Tree_OnCheck_Model_Tree03(before_image_id, 1);
					Layer_Tree_OnCheck_Model_Tree03(id, 1);
					map_ind=1;
					}else if(map_ind==1){
						Layer_Tree_OnCheck_Model_Tree03(after_image_id, 1);
						Layer_Tree_OnCheck_Model_Tree03(id, 1);
						map_ind=0;
						}
				*/
				
			}
			map_win_double();
			//alert(menuitemId);

			
			}
			
			
			
			

			Model_w1.attachEvent("onClose", function(win){
					Model_w1.hide();
					Model_w1.setModal(false);
					return false;
				});
			Model_w1.hide();
			/*Model_w1_Acc_01_Tree_03 = Model_w1_Acc_01.cells("a3").attachTree();
		    Model_w1_Acc_01_Tree_03.setImagePath("codebase/imgs/dhxtree_material/");
		    Model_w1_Acc_01_Tree_03.enableCheckBoxes(1);
		    Model_w1_Acc_01_Tree_03.enableThreeStateCheckboxes(true);
		    Model_w1_Acc_01_Tree_03.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
		    Model_w1_Acc_01_Tree_03.setOnCheckHandler(createNetworkLink);
		    Model_w1_Acc_01_Tree_03.setOnDblClickHandler(Location_Grid_DblClicked);
		    Model_w1_Acc_01_Tree_03.loadXML("tree_xml/baselayer/tree_06_03.xml");
			
			Model_w1_Acc_01_Tree_04 = Model_w1_Acc_01.cells("a4").attachTree();
		    Model_w1_Acc_01_Tree_04.setImagePath("codebase/imgs/dhxtree_material/");
		    Model_w1_Acc_01_Tree_04.enableCheckBoxes(1);
		    Model_w1_Acc_01_Tree_04.enableThreeStateCheckboxes(true);
		    Model_w1_Acc_01_Tree_04.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
		    Model_w1_Acc_01_Tree_04.setOnCheckHandler(createNetworkLink);
		    Model_w1_Acc_01_Tree_04.setOnDblClickHandler(Location_Grid_DblClicked);
		    Model_w1_Acc_01_Tree_04.loadXML("tree_xml/baselayer/tree_06_04.xml");
			
			Model_w1_Acc_01_Tree_05 = Model_w1_Acc_01.cells("a5").attachTree();
		    Model_w1_Acc_01_Tree_05.setImagePath("codebase/imgs/dhxtree_material/");
		    Model_w1_Acc_01_Tree_05.enableCheckBoxes(1);
		    Model_w1_Acc_01_Tree_05.enableThreeStateCheckboxes(true);
		    Model_w1_Acc_01_Tree_05.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
		    Model_w1_Acc_01_Tree_05.setOnCheckHandler(createNetworkLink);
		    Model_w1_Acc_01_Tree_05.setOnDblClickHandler(Location_Grid_DblClicked);
		    Model_w1_Acc_01_Tree_05.loadXML("tree_xml/baselayer/tree_06_05.xml");
			
			Model_w1_Acc_01_Tree_06 = Model_w1_Acc_01.cells("a6").attachTree();
		    Model_w1_Acc_01_Tree_06.setImagePath("codebase/imgs/dhxtree_material/");
		    Model_w1_Acc_01_Tree_06.enableCheckBoxes(1);
		    Model_w1_Acc_01_Tree_06.enableThreeStateCheckboxes(true);
		    Model_w1_Acc_01_Tree_06.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
		    Model_w1_Acc_01_Tree_06.setOnCheckHandler(createNetworkLink);
		    Model_w1_Acc_01_Tree_06.setOnDblClickHandler(Location_Grid_DblClicked);
		    Model_w1_Acc_01_Tree_06.loadXML("tree_xml/baselayer/tree_06_06.xml");*/
		   
			
			
			
		function Model_w1_Acc_00_call() {
			
		    Model_w1_Acc_all.cells('a0').show();
		    Model_w1_Acc_all.cells('a0').open();
			Model_w1_Acc_all.cells('a1').hide();
		    Model_w1_Acc_all.cells('a2').hide();
		    Model_w1_Acc_all.cells('a3').hide();
		    Model_w1_Acc_all.cells('a4').hide();
		    Model_w1_Acc_all.cells('a5').hide();
		    Model_w1_Acc_all.cells('a6').hide();
		}
		function Model_w1_Acc_01_call() {
			Model_w1_Acc_all.cells('a0').hide();
		    Model_w1_Acc_all.cells('a1').show();
		    Model_w1_Acc_all.cells('a1').open();
		    Model_w1_Acc_all.cells('a2').hide();
		    Model_w1_Acc_all.cells('a3').hide();
		    Model_w1_Acc_all.cells('a4').hide();
		    Model_w1_Acc_all.cells('a5').hide();
		    Model_w1_Acc_all.cells('a6').hide();
		}
        
		function Model_w1_Acc_02_call() {
			Model_w1_Acc_all.cells('a0').hide();
		    Model_w1_Acc_all.cells('a1').hide();
		    Model_w1_Acc_all.cells('a2').show();
		    Model_w1_Acc_all.cells('a2').open();
		    Model_w1_Acc_all.cells('a3').hide();
		    Model_w1_Acc_all.cells('a4').hide();
		    Model_w1_Acc_all.cells('a5').hide();
		    Model_w1_Acc_all.cells('a6').hide();
			
			
		}
		function Model_w1_Acc_03_call() {
			Model_w1_Acc_all.cells('a0').hide();
		    Model_w1_Acc_all.cells('a1').hide();
		    Model_w1_Acc_all.cells('a2').hide();
		    Model_w1_Acc_all.cells('a3').show();
		    Model_w1_Acc_all.cells('a3').open();
		    Model_w1_Acc_all.cells('a4').hide();
		    Model_w1_Acc_all.cells('a5').hide();
		    Model_w1_Acc_all.cells('a6').hide();
		}
		function Model_w1_Acc_04_call() {
			Model_w1_Acc_all.cells('a0').hide();
		    Model_w1_Acc_all.cells('a1').hide();
		    Model_w1_Acc_all.cells('a2').hide();
		    Model_w1_Acc_all.cells('a3').hide();
		    Model_w1_Acc_all.cells('a4').show();
		    Model_w1_Acc_all.cells('a4').open();
		    Model_w1_Acc_all.cells('a5').hide();
		    Model_w1_Acc_all.cells('a6').hide();
		}
		function Model_w1_Acc_05_call() {
			Model_w1_Acc_all.cells('a0').hide();
		    Model_w1_Acc_all.cells('a1').hide();
		    Model_w1_Acc_all.cells('a2').hide();
		    Model_w1_Acc_all.cells('a3').hide();
		    Model_w1_Acc_all.cells('a4').hide();
		    Model_w1_Acc_all.cells('a5').show();
		    Model_w1_Acc_all.cells('a5').open();
		    Model_w1_Acc_all.cells('a6').hide();
		}
		function Model_w1_Acc_06_call() {
			Model_w1_Acc_all.cells('a0').hide();
		    Model_w1_Acc_all.cells('a1').hide();
		    Model_w1_Acc_all.cells('a2').hide();
		    Model_w1_Acc_all.cells('a3').hide();
		    Model_w1_Acc_all.cells('a4').hide();
		    Model_w1_Acc_all.cells('a5').hide();
		    Model_w1_Acc_all.cells('a6').show();
		    Model_w1_Acc_all.cells('a6').open();
		}


		function Layer_Tree_OnCheck_Model_Tree00(rowId, state){
			Layer_Tree_Oncheck_Pre("Model_w1_Acc_01_Tree_00",rowId, state);
		}
		function Layer_Tree_OnCheck_Model_Tree01(rowId, state){
			Layer_Tree_Oncheck_Pre("Model_w1_Acc_01_Tree_01",rowId, state);
		}
		function Layer_Tree_OnCheck_Model_Tree011(rowId, state){
			Layer_Tree_Oncheck_Pre("Model_w1_Acc_01_Tree_011",rowId, state);
		}
		function Layer_Tree_OnCheck_Model_Tree02(rowId, state){
			Layer_Tree_Oncheck_Pre("Model_w1_Acc_01_Tree_02",rowId, state);
		}
		function Layer_Tree_OnCheck_Model_Tree03(rowId, state){
			Layer_Tree_Oncheck_Pre("Model_w1_Acc_01_Tree_03",rowId, state);
		}
		
			
			
			
			
			
			
			
			
			
			
			

			
			
			
			
			
			
			
			
			
			
			

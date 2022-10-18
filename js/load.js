$(document).ready(function () {
	check_checkbox();
});

var dhxWins = new dhtmlXWindows();

//搜尋條件視窗
Search_In_w1 = dhxWins.createWindow("Search_w1", 100, 100, 400, 520);
Search_In_w1.setText("搜尋條件");
Search_In_w1.attachHTMLString(
	'<span class="label">設定查詢時間範圍</span><br>' +
	'<form name="form1" method="post" action="" >' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="label">起始時間</span> <input type="text" id="date_from" readonly="true"><span><img id="calendar_icon_S" src="img/calendar.png" border="0" onclick="Search_In_Calendar_setSens(\'date_to\', \'max\');" ></span><br>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="label">結束時間</span> <input type="text" id="date_to"  readonly="true"><span><img id="calendar_icon_E" src="img/calendar.png" border="0" onclick="Search_In_Calendar_setSens(\'date_from\', \'min\');"></span><br>' +
	'<div name="city_theForm">' +
	'<HR>' +
	'<span class="label">設定查詢空間範圍</span><br>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="space_sel"  id="space_city" value="space_city" checked="checked">' +
	'<span class="label">&nbsp;&nbsp;&nbsp;行政區範圍</span><br>' +
	'<table border=0 style="background-color:#AAFFEE">' +
	'<tr><th>縣市</th><th>鄉鎮</th><th>村里</th></tr>' +
	'<tr>' +
	'<td align=center>' +
	'&nbsp;&nbsp;&nbsp;<select name="city_column1" id="city_column1" onchange="city_onChangeColumn1(); ">' +
	//'<script>for (i = 0; i < dataTree.length; i++) document.writeln("<option value=\"" + dataTree[i].name + "\">" + dataTree[i].name);</script>'+										    
	'<option value="宜蘭縣">宜蘭縣</option>' +
	'<option value="基隆市">基隆市</option>' +
	'<option value="臺北市">臺北市</option>' +
	'<option value="新北市">新北市</option>' +
	'<option value="桃園市">桃園市</option>' +
	'<option value="新竹縣">新竹縣</option>' +
	'<option value="新竹市">新竹市</option>' +
	'<option value="苗栗縣">苗栗縣</option>' +
	'<option value="臺中市">臺中市</option>' +
	'<option value="彰化縣">彰化縣</option>' +
	'<option value="南投縣">南投縣</option>' +
	'<option value="雲林縣">雲林縣</option>' +
	'<option value="嘉義縣">嘉義縣</option>' +
	'<option value="嘉義市">嘉義市</option>' +
	'<option value="臺南市">臺南市</option>' +
	'<option value="高雄市">高雄市</option>' +
	'<option value="屏東縣">屏東縣</option>' +
	'<option value="臺東縣">臺東縣</option>' +
	'<option value="花蓮縣">花蓮縣</option>' +
	'</select>' +
	'</td>' +
	'<td align=center><select name="city_column2" id="city_column2" onchange="city_onChangeColumn2();"><option  value="">選擇鄉鎮</option></select></td>' +
	'<td align=center><select name="city_column3" id="city_column3"onchange="city_onChangeColumn3();"><option value="">選擇村里</option></select></td>' +
	'</tr>' +
	'</table>' +
	'</div>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="space_sel" id="space_lonlat" value="space_lonlat">' +
	'<span class="label">&nbsp;&nbsp;&nbsp;地圖框選範圍</span><br>' +
	'<button type="button" name="button" value="地圖框選" onclick="box_select()" />地圖框選</button> ' +
	'<button type="button" class = "ui button" onclick = "clear_map()"> clear </button><br>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="label">左上坐標：<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;X坐標: <input type="text" size="15"; id="Search_In_drawbox_LU_X" value="120.39779663085939">&nbsp;&nbsp;&nbsp;Y坐標: <input type="text" size="15"; id="Search_In_drawbox_LU_Y" value="22.960290070337322"></span><br>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="label">右下坐標：<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;X坐標: <input type="text" size="15"; id="Search_In_drawbox_RD_X" value="120.42182922363281">&nbsp;&nbsp;&nbsp;Y坐標: <input type="text" size="15"; id="Search_In_drawbox_RD_Y" value="22.945115307629337"></span>' +
	'<HR>' +
	'<span class="label">設定所屬計畫</span>' +
	'<button type="button" name="Search_In_PlanCombo" value="清除計畫所屬條件" onclick="PlanCombo_unslect()">清除計畫所屬條件</button><br>' +
	'<div id="plan_combo_zone" style="width:400px;"></div>' +
	'<HR>' +
	'<input type="hidden"  name="txt_json" />' +
	'<button type="button" onclick="show_classification_layer()"> 類別選擇 </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<input type="submit" name="button" value="確認查詢" /> ' +
	'</form>'
)

Search_In_Calendar_S = new dhtmlXCalendarObject({ input: "date_from", button: "calendar_icon_S" });
Search_In_Calendar_E = new dhtmlXCalendarObject({ input: "date_to", button: "calendar_icon_E" });
Search_In_Calendar_S.setDate("2013-03-10");
Search_In_Calendar_S.hideTime();
Search_In_Calendar_E.hideTime();
// init values
var t = new Date();
Search_In_Calendar_byId("date_from").value = "2020-10-25";
Search_In_Calendar_byId("date_to").value = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
function Search_In_Calendar_byId(id) {
	return document.getElementById(id);
}

function Search_In_Calendar_setSens(id, k) {

	// update range
	if (k == "min") {
		Search_In_Calendar_E.setSensitiveRange(Search_In_Calendar_byId(id).value, null);
	} else {
		Search_In_Calendar_S.setSensitiveRange(null, Search_In_Calendar_byId(id).value);
	}
}
Search_In_w1.attachEvent("onClose", function (win) {
	Search_In_w1.hide();

	Search_In_w1.setModal(false);


	return false;
});
Search_In_w1.hide();

var cluster_layer;
$("form").submit(function (event) {

	event.preventDefault(); //不刷新頁面
	$.ajax({
		/*
		type:"POST",  //傳值方式有分 post & get
		url:"2.php",
		data:{
			date_from:$('#date_from').val(),date_to:$('#date_to').val(),
			space_sel:$('#space_sel:checked').val(),
			city_column1:$('#city_column1').val(),city_column2:$('#city_column2').val(),city_column3:$('#city_column3').val(),
			Search_In_drawbox_LU_X:$('#Search_In_drawbox_LU_X').val(),Search_In_drawbox_LU_Y:$('#Search_In_drawbox_LU_Y').val(),Search_In_drawbox_RD_X:$('#Search_In_drawbox_RD_X').val(),Search_In_drawbox_RD_Y:$('#Search_In_drawbox_RD_Y').val()
		},//將表單的值設定好
		async:false
		}).responseText;
		//alert(myhtml);
		Search_w1_call(myhtml);
		console.log(myhtml);
		return false; //不刷新頁面
		*/
		type: "POST",  //傳值方式有分 post & get
		dataType: "xml",
		url: "2.php",
		data: {

			date_from: $('#date_from').val(), date_to: $('#date_to').val(),
			space_sel: $('input[name=space_sel]:checked').val(),
			//space_sel:$('#space_sel:checked').val(),
			city_column1: $('#city_column1').val(), city_column2: $('#city_column2').val(), city_column3: $('#city_column3').val(),
			Search_In_drawbox_LU_X: $('#Search_In_drawbox_LU_X').val(), Search_In_drawbox_LU_Y: $('#Search_In_drawbox_LU_Y').val(), Search_In_drawbox_RD_X: $('#Search_In_drawbox_RD_X').val(), Search_In_drawbox_RD_Y: $('#Search_In_drawbox_RD_Y').val(),
			projectno: projectno_menu, LoginID: Login_ID,LoginSource:Login_Source,

			classification_number: classification_number,
			classification_list: classification_list,
			planet_checked: planet_checked
		},
		success: function (response) {
			// console.log(response);

			// research0_clear();
			// research1_clear();
			// research_clear();
			fun_access_log("Func_Use_Data_1_1");
			Search_w1_call(response);
			if (cluster_layer != null) {
				maps[0].removeLayer(cluster_layer);
			}
			cluster_layer = create_cluster(response);
			cluster_layer.setZIndex(3);
			maps[0].addLayer(cluster_layer);
			maps[0].on('click', add_cluster_click_event);
			//maps[0].un('click', add_cluster_click_event);
			//Search_Layout.cells("b").attachHTMLString(myhtml);
			//Search_w1.show();
		}
	});
});

// function research_clear() {

// 	for (let i = 0; i < All_Check_List_W0.length; i++) {
// 		if (All_Check_List_W0[i][0] == "Search_Grid") {
// 			All_Check_List_W0[i][0] = "Outside_Grid";
// 			Outside_Grid.addRow(All_Check_List_W0[i][1], [All_Check_List_W0[i][3], All_Check_List_W0[i][2], "", "", "", "", "", "", "", "", ""], All_Check_List_W0[i][3]);
// 		}
// 	}
// 	for (let i = 0; i < All_Check_List_W1.length; i++) {
// 		if (All_Check_List_W1[i][0] == "Search_Grid") {
// 			All_Check_List_W1[i][0] = "Outside_Grid";
// 			Outside_Grid.addRow(All_Check_List_W1[i][1], [All_Check_List_W1[i][3], All_Check_List_W1[i][2], "", "", "", "", "", "", "", "", ""], All_Check_List_W1[i][3]);
// 		}
// 	}
// }

function research0_clear() {//重新查詢清空已選圖層


	search_map_ind_temp = map_ind;
	map_ind = 0;
	Search_Grid_sav_temp = new Array();
	Search_Grid_sav_ind_num = 0;
	for (var i = 0; i < All_Check_List_W0.length; i++) {
		if (All_Check_List_W0[i].RootName != "Search_Grid") {
			Search_Grid_sav_temp[Search_Grid_sav_ind_num] = All_Check_List_W0[i];
			Search_Grid_sav_ind_num++;
		} else if (All_Check_List_W0[i].RootName == "Search_Grid") {

			Layer_Grid_OnCheck_Search_Grid01(All_Check_List_W0[i].ID, "", false);
		}
	}
	All_Check_List_W0 = Search_Grid_sav_temp;
	map_ind = search_map_ind_temp;


	//圖資查詢後，保留前次查詢 
	// let search_map_ind_temp = map_ind;
	// map_ind = 0;
	// Search_Grid_sav_temp = new Array();
	// Search_Grid_sav_ind_num = 0;
	// for (var i = 0; i < All_Check_List_W0.length; i++) {
	// 	if (All_Check_List_W0[i][0] != "Search_Grid") {
	// 		Search_Grid_sav_temp[Search_Grid_sav_ind_num] = All_Check_List_W0[i];
	// 		//alert(Search_Grid_sav_ind_num);																																				
	// 	} else if (All_Check_List_W0[i][0] == "Search_Grid") {
	// 		// alert(All_Check_List_W0[i][3]);
	// 		//alert(Search_Grid_sav_ind_num);
	// 		All_Check_List_W0[i][0] = "Outside_Grid";
	// 		if (All_Check_List_W0[i][3] == true) { temp_check = 1 } else { temp_check = 0 };
	// 		Outside_Grid.addRow(All_Check_List_W0[i][1], [All_Check_List_W0[i][3], All_Check_List_W0[i][2], "", "", "", "", "", "", "", "", ""], temp_check);
	// 		Search_Grid_sav_temp[Search_Grid_sav_ind_num] = All_Check_List_W0[i];
	// 		//Search_Grid_sav_ind_num++;
	// 		//Layer_Grid_OnCheck_Search_Grid01(All_Check_List_W0[i][1],"",false);

	// 	}
	// 	Search_Grid_sav_ind_num++;
	// }
	// All_Check_List_W0 = Search_Grid_sav_temp;
	// map_ind = search_map_ind_temp;



}

function research1_clear() {//重新查詢清空已選圖層

	search_map_ind_temp = map_ind;
	map_ind = 1;
	Search_Grid1_sav_temp = new Array();
	Search_Grid1_sav_ind_num = 0;

	for (var j = 0; j < All_Check_List_W1.length; j++) {

		if (All_Check_List_W1[j].RootName != "Search_Grid") {
			Search_Grid1_sav_temp[Search_Grid1_sav_ind_num] = All_Check_List_W1[j];
			Search_Grid1_sav_ind_num++;
		} else if (All_Check_List_W1[j].RootName == "Search_Grid") {

			Layer_Grid_OnCheck_Search_Grid01(All_Check_List_W1[j].ID, "", false);
		}
	}
	All_Check_List_W1 = Search_Grid1_sav_temp;
	map_ind = search_map_ind_temp;

	//圖資查詢後，保留前次查詢
	// let search_map_ind_temp = map_ind;
	// map_ind = 1;
	// Search_Grid1_sav_temp = new Array();
	// Search_Grid1_sav_ind_num = 0;
	// for (var i = 0; i < All_Check_List_W1.length; i++) {
	// 	if (All_Check_List_W1[i][0] != "Search_Grid") {
	// 		Search_Grid_sav_temp[Search_Grid1_sav_ind_num] = All_Check_List_W1[i];

	// 	} else if (All_Check_List_W1[i][0] == "Search_Grid") {

	// 		All_Check_List_W1[i][0] = "Outside_Grid";
	// 		if (All_Check_List_W1[i][3] == true) { temp_check = 1 } else { temp_check = 0 };
	// 		Outside_Grid.addRow(All_Check_List_W1[i][1], [All_Check_List_W1[i][3], All_Check_List_W1[i][2], "", "", "", "", "", "", "", "", ""], temp_check);
	// 		Search_Grid1_sav_temp[Search_Grid1_sav_ind_num] = All_Check_List_W1[i];


	// 	}
	// 	Search_Grid1_sav_ind_num++;
	// }
	// All_Check_List_W1 = Search_Grid1_sav_temp;
	// map_ind = search_map_ind_temp;
}





//搜尋結果主視窗宣告


//dhxWins.attachViewportTo("winVP"); 	
Search_w1 = dhxWins.createWindow("Search_w1", 300, 100, 1040, 420);//1040
Search_w1.setText("搜尋結果");


Search_Layout = Search_w1.attachLayout("2E");
Search_Layout.cells("a").hideHeader();
Search_Layout.cells("b").hideHeader();
Search_Layout.cells("a").setHeight(40);
var search_class = '<input type="button" name="a2" value="取消分類" onclick="Search_Grid.unGroup();">&nbsp;&nbsp;' +
	'<input type="button"  name="q1" value="分類依據" onclick=\'Search_Grid.groupBy(document.getElementById("Search_Layout_sel").value);\'>' +
	'<select id="Search_Layout_sel">' +
	'<option value="0">勾選</option>' +
	'<option value="2"selected="1">主類別</option>' +
	'<option value="3"selected="1">次類別</option>' +
	'<option value="4">縣市</option>' +
	'<option value="5">鄉鎮</option>' +
	'<option value="6">村里</option>' +
	'<option value="7">集水區</option>' +
	'<option value="9">年</option>' +
	'<option value="10">月</option>' +
	'<option value="11">日</option>' +
	'</select>' +
	'&nbsp;<input type="button" id="show_hide_cluster_btn" value="隱藏叢集">&nbsp;&nbsp;' +
	'<img src="icons/buy.png" id="data_buy" style="width:100px;height:100px; position:absolute;top:-35px;right:10px;" onclick="buy_image();" title="現有圖資不符需求，需進行採購，將目前搜尋條件導入進行採購!">';


Search_Layout.cells("a").attachHTMLString(search_class);
Search_Grid_Menu = new dhtmlXMenuObject();
Search_Grid_Menu.setIconsPath("icons/menu/");
Search_Grid_Menu.renderAsContextMenu();
Search_Grid_Menu.attachEvent("onClick", Search_Grid_Menu_onButtonClick);
Search_Grid_Menu.loadStruct("tree_xml/grid_Search_Grid_menu.xml");
Search_Grid = Search_Layout.cells("b").attachGrid();
Search_Grid.setImagePath("codebase/imgs/");
//Search_Grid.enableContextMenu(Search_Grid_Menu);
Search_Grid.setHeader("套疊,名稱,主類別,次類別,縣市,鄉鎮,村里,集水區,日期,年,月,日,提供單位,資料來源");
Search_Grid.attachHeader("&nbsp;,#text_filter,#select_filter,#select_filter,#select_filter,#select_filter,#select_filter,#select_filter,#text_filter,#select_filter,#select_filter,#select_filter,#text_filter,#text_filter");


Search_Grid.setInitWidths("40,310,80,65,60,60,60,65,100,0,0,0,80,80");
Search_Grid.enableColumnAutoSize(true);

Search_Grid.setColAlign("right,left,left,right,right,center,left,center,center,center,center,center,center,center");
Search_Grid.attachEvent("onRowDblClicked", Location_Grid_DblClicked);
Search_Grid.setColTypes("ch,link,ed,ed,ed,ed,ed,ed,ed,ed,ed,ed,ed,ed");
Search_Grid.attachEvent("onCheckbox", Layer_Grid_OnCheck_Search_Grid01);
Search_Grid.setColSorting("na,str,str,str,str,str,str,str,str,int,int,int,str,str");
Search_Grid.init();


Search_w1.hide();
Search_w1.attachEvent("onClose", function (win) {
	if (cluster_layer != null) {
		maps[0].removeLayer(cluster_layer);
	}
	Search_w1.hide();
	Search_w1.setModal(false);
	return false;
});

function Search_Grid_Menu_onButtonClick(menuitemId) {
	var id = Search_Grid.contextID;
	id_array = id.split('@');
	alert(id_array[3]);
}


function Search_w1_call(xml_str) {
	Search_w1.show();
	Search_w1.bringToTop();
	Search_Grid.clearAll();
	Search_Grid.enableDistributedParsing(true, 200, 100);
	Search_Grid.parse(xml_str);

	Search_Grid.groupBy(2);
	// Search_Grid.adjustColumnSize(1);
	/*Search_Grid.clearAndLoad(xml_str,function(){
		Search_Grid.groupBy(2);
	});*/
	// Search_Grid_layer_array = Search_Grid.getAllItemIds().split(',');
	// for (var i = 0; i < Search_Grid_layer_array.length; i++) {
	// 	if (Search_Grid.cells(Search_Grid_layer_array[i], 0).getValue() == 1) {

	// 		//Layer_Grid_OnCheck_Search_Grid01(Search_Grid_layer_array[i],"",1);					

	// 	}
	// }


}





//w1.button("close").disable();



//所屬計畫下拉是選單宣告
var projectno_menu = "";
var Search_In_PlanCombo_myhtml = $.ajax({
	type: "POST",  //傳值方式有分 post & get
	url: "php/Plan_list.php",
	//將表單的值設定好
	async: false
}).responseText;


Search_In_PlanCombo = new dhtmlXCombo("plan_combo_zone", "plan_combo_zone", 400);
Search_In_PlanCombo.enableFilteringMode("between");
Search_In_PlanCombo.load(Search_In_PlanCombo_myhtml);
Search_In_PlanCombo.attachEvent("onChange", function (value, text) {

	projectno_menu = value;
});

function PlanCombo_unslect() {
	Search_In_PlanCombo.unSelectOption();
}


//文件彈跳視窗宣告
Docs_info_w1 = dhxWins.createWindow("Docs_info_w1", 150, 100, 850, 500);
Docs_info_w1.setText("圖資內容");
Docs_info_w1.hide();

Docs_info_w1.attachEvent("onClose", function (win) {
	Docs_info_w1.hide();
	Docs_info_w1.setModal(false);
	return false;
});

/**
 * When click on layer list in 圖資蒐尋 -> 搜尋結果
 *
 * @param {*} rowId
 * @param {*} cellInd
 * @param {*} state
 */
function Layer_Grid_OnCheck_Search_Grid01(rowId, cellInd, state) {
	Layer_Grid_Oncheck_Pre('Search_Grid', rowId, cellInd, state);
}



/* function Layer_Grid_OnCheck_Search(rowId,cellInd,state){
						 	
				 item_inlist=0;
				 if(map_ind==0){
					 for(i=0;i<All_Check_List_W0.length;i++){					
						 if(All_Check_List_W0[i][0]=='Search_Grid' &&All_Check_List_W0[i][1]==rowId){
							 //alert(document.getElementById(rowId).checked);								
							 All_Check_List_W0[i][3]=state;								
							 item_inlist=1;
							 //alert(item_inlist);
							 break;
						 }
					 }
					 if(item_inlist==0){
						 var temp_item=[];
						 temp_item[0]='Search_Grid';
						 temp_item[1]=rowId.toString();							
						 temp_item[2]=Search_Grid.cells(rowId,1).getValue().split('^')[0];
						 //temp_item[2]=Search_Grid.cells(rowId,1).getValue();
						 temp_item[3]=true;
						 //alert(temp_item[1]);
						 All_Check_List_W0[All_Check_List_W0.length]=temp_item;
					 	
					 }
				 }else if(map_ind==1){
					 for(i=0;i<All_Check_List_W1.length;i++){					
						 if(All_Check_List_W1[i][0]=='Search_Grid' &&All_Check_List_W1[i][1]==rowId){
							 //alert(document.getElementById(rowId).checked);								
							 All_Check_List_W1[i][3]=state;								
							 item_inlist=1;
							 //alert(item_inlist);
							 break;
						 }
					 }
					 if(item_inlist==0){
						 var temp_item=[];
						 temp_item[0]='Search_Grid';
						 temp_item[1]=rowId.toString();							
						 temp_item[2]=Search_Grid.cells(rowId,2).getValue().split('^')[0];
						 //temp_item[2]=Search_Grid.cells(rowId,1).getValue();
						 temp_item[3]=true;
						 //alert(temp_item[1]);
						 All_Check_List_W1[All_Check_List_W1.length]=temp_item;
					 	
					 }
				 }
				 All_Check_List_Reset();
		 	
			 Layer_Grid_Oncheck(rowId,cellInd,state);
		 }        			
	 	
	 */

// 地圖 cluster
var cluster_last_arr = "";
function create_cluster(xml) {
	var $item = $(xml).find("row");
	var features = new Array($item.length);
	var i = 0;
	$item.each(function () {
		var coordinates = ol.proj.transform(parse_lnglat($(this).attr("id")), 'EPSG:4326', 'EPSG:3857');
		features[i] = new ol.Feature({
			id: $(this).attr("id"),
			location: $(this).children("cell:nth-child(2)").text(),
			product: $(this).children("cell:nth-child(3)").text(),
			image: $(this).children("cell:nth-child(4)").text(),
			time: $(this).children("cell:nth-child(9)").text() + " " + $(this).children("cell:nth-child(10)").text() + " " + $(this).children("cell:nth-child(11)").text(),
			geometry: new ol.geom.Point(coordinates)
		});
		i++;
	});

	var source = new ol.source.Vector({
		features: features
	});

	var distance = 50;
	var clusterSource = new ol.source.Cluster({
		distance: parseInt(distance, 10),
		source: source
	});

	var styleCache = {};
	var clusters = new ol.layer.Vector({
		source: clusterSource,
		style: function (feature) {
			var size = feature.get('features').length;
			var style = styleCache[size];
			if (!style) {
				style = new ol.style.Style({
					image: new ol.style.Circle({
						radius: 10,
						stroke: new ol.style.Stroke({
							color: '#fff'
						}),
						fill: new ol.style.Fill({
							color: '#3399CC'
						})
					}),
					text: new ol.style.Text({
						text: size.toString(),
						fill: new ol.style.Fill({
							color: '#fff'
						})
					})
				});
				styleCache[size] = style;
			}
			return style;
		}
	});

	return clusters;
}

function buy_image() {  //導向採購平台

	re_link = "https://pdims.geodac.tw/?action=buy&step=1&m=4326&p1=" + $('#Search_In_drawbox_LU_Y').val() + "," + $('#Search_In_drawbox_LU_X').val() + "&p2=" + $('#Search_In_drawbox_RD_Y').val() + "," + $('#Search_In_drawbox_RD_X').val() + "&daterange=" + $('#date_from').val() + "," + $('#date_to').val();
	window.open(re_link);
}


$("#show_hide_cluster_btn").on('click', function () {
	if (cluster_layer != null)
		show_hide_cluster(cluster_layer, $(this));
	else
		console.log("Error, cluster_layer is null");
});

function show_hide_cluster(layer, $btn) {
	if ($btn.val() == "隱藏叢集") {
		maps[0].removeLayer(layer);
		$btn.val("顯示叢集");
	}
	else {
		maps[0].addLayer(layer);
		$btn.val("隱藏叢集");
	}
}

function parse_lnglat(str) {
	var substr = JSON.parse(str).PosInfo.split(";");
	return [parseFloat(substr[1]), parseFloat(substr[0])];
}

var add_cluster_click_event = function (evt) {
	var feature = maps[0].forEachFeatureAtPixel(evt.pixel, function (feature) { return feature; });
	if (feature) {
		if (typeof feature.get('features') === 'undefined') {
			// not a cluster
		} else {
			// is a cluster, so loop through all the underlying features
			// Note even if cluster only contain 1 node, it's still cluster
			if (cluster_last_arr != "") {
				for (var i = 0; i < cluster_last_arr.length; i++) {

					Search_Grid.setRowTextStyle(cluster_last_arr[i].get('id'), 'color:black;font-family:verdana;font-size:14px;');


				}

			}

			var features = feature.get('features');
			cluster_last_arr = features;
			var str = "";
			for (var i = 0; i < features.length; i++) {
				// here you'll have access to your normal attributes:
				//console.log(features[i].get('id')+" "+features[i].get('product')+" "+features[i].get('image'));

				str += "<" + i + "> " + features[i].get('id') + " " + features[i].get('product') + " " + features[i].get('image') + "\n";
				Search_Grid.setRowTextStyle(features[i].get('id'), 'color:red;font-family:verdana;font-size:18px;')
				Search_Grid.selectRowById(features[i].get('id'));
				if (cluster_last_arr.length < 20) {
					(Search_Grid.cells(cluster_last_arr[i].get('id'), 0)).setValue(1);
					Layer_Grid_OnCheck_Search_Grid01(cluster_last_arr[i].get('id'), "", 1);

				}

			}


			//alert(str);
		}
	}
};


classification_layer = dhxWins.createWindow("class_window", 600, 100, 375, 650);
classification_layer.setText("類別選取");

classification_layer.attachHTMLString(
	'<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label><input type="checkbox" name="layer_class" value="Ortho" id="checkbox_Ortho" checked="checked"> UAV正射影像 </label>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +

	'<label><input type="checkbox" name="layer_class" value="HistPhoto" id="checkbox_HistPhoto" checked="checked"> 歷史照片 </label>' +
	//'<label><input type="checkbox" name="layer_class" value="3DModel" id="checkbox_3DModel"> UAV3D模型 </label><br><br>'+
	//'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
	//'<label><input type="checkbox" name="layer_class" value="Photo" id="checkbox_Photo"> UAV地面照片 </label>'+
	//'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
	'<br><br>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label><input type="checkbox" name="layer_class" value="WithGPS" id="checkbox_WithGPS" checked="checked"> UAV斜拍照片(GPS) </label>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label><input type="checkbox" name="layer_class" value="NoGPS" id="checkbox_NoGPS" checked="checked"> UAV斜拍照片(No GPS) </label>' +
	'<br><br>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label><input type="checkbox" name="layer_class" value="Aerial_Photograph" id="checkbox_Aerial_Photograph" checked="checked"> 航照(非正射) </label>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label><input type="checkbox" name="layer_class" value="Airplane" id="checkbox_Airplane" checked="checked"> 航照(正射) </label>' +
	'<br><br>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label><input type="checkbox" name="layer_class" value="Pleiades" id="checkbox_Pleiades" checked="checked"> Pleiades衛星 </label>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label><input type="checkbox" name="layer_class" value="Quickbird" id="checkbox_Quickbird" checked="checked"> QuickBird衛星 </label>' +
	'<br><br>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label><input type="checkbox" name="layer_class" value="WorldView2" id="checkbox_WorldView2" checked="checked"> WorldView2衛星 </label>' +
	'<br><br>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label><input type="checkbox" name="layer_class" value="SPOT" id="checkbox_SPOT" checked="checked"> SPOT衛星 </label>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label><input type="checkbox" name="layer_class" value="Formosat2" id="checkbox_Formosat2" checked="checked"> 福衛2號 </label>' +
	'<br><br>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label><input type="checkbox" name="layer_class" value="Landsat9" id="checkbox_Landsat9" checked="checked"> Landsat-9衛星 </label>' +
	'<label><input type="checkbox" name="layer_class" value="Landsat8" id="checkbox_Landsat8" checked="checked"> Landsat-8衛星 </label>' +
    '<br><br>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label><input type="checkbox" name="layer_class" value="Landsat5" id="checkbox_Landsat5" checked="checked"> Landsat-5衛星 </label>' +
	'<label><input type="checkbox" name="layer_class" value="Landsat4" id="checkbox_Landsat4" checked="checked"> Landsat-4衛星 </label>' +
	'<label><input type="checkbox" name="layer_class" value="Landsat3" id="checkbox_Landsat3" checked="checked"> Landsat-3衛星 </label>' +
	'<label><input type="checkbox" name="layer_class" value="Landsat2" id="checkbox_Landsat2" checked="checked"> Landsat-2衛星 </label>' +
	'<label><input type="checkbox" name="layer_class" value="Landsat1" id="checkbox_Landsat1" checked="checked"> Landsat-1衛星 </label>' +
	'<br><br>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label><input type="checkbox" name="layer_class" value="Sentinel2" id="checkbox_Sentinel2" checked="checked"> Sentinel-2衛星 </label>' +
	'<br><br>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label><input type="checkbox" name="layer_class" value="GRDH_S1" id="checkbox_GRDH_S1" checked="checked"> Sentinel-1衛星 </label>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label><input type="checkbox" name="layer_class" value="Corona" id="checkbox_Corona" checked="checked"> Corona衛星 </label>' +
	//'<label><input type="checkbox" name="layer_class" value="PlanetScope" id="checkbox_PlanetScope"> PlanetScope衛星 </label>'+			
	//'<label><input type="checkbox" name="layer_class" value="GF1" id="checkbox_GF1"> GF1衛星 </label><br><br>'+
	//'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
	'<br><br>' +
	'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<label id="planet_checkbox"><input type="checkbox" name="layer_class" value="planet" id="checkbox_planet" onclick="planet_alert()"> Planet衛星 </label><br><br>' +
	
	'<button type="button" onclick="addallclassification()">加入所有類別</button>' +
	'&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<button type="button" onclick="clearclassification()">清除所有類別</button>'
	// '&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
	// '<button type="button" onclick="addclassification()">確認</button>'
)



classification_layer.attachEvent("onClose", function (win) {
	classification_layer.hide();
	classification_layer.setModal(false);
	return false;
});
classification_layer.hide();

function show_classification_layer() {
	classification_layer.show();
}


// let test_classification_value = '';
let classification_list = [];
let classification_number = 0;
let planet_checked = 0;
function planet_alert() {
	//{ swal("使用提醒!", "Plant衛星因為使用API查詢國外資料庫，需耗時較久，建議查詢期間設定於一年內，時間過長如無結果回應，煩請重新設定時間區間!", "warning"); }
}
function addclassification() {
	// classification_layer.hide();
	let checkedElements = document.getElementsByName('layer_class');
	classification_list = [];
	for (let i = 0; checkedElements[i]; ++i) {
		if (checkedElements[i].checked && classification_list.indexOf(checkedElements[i].value) == -1 && checkedElements[i].value != 'planet') {
			// console.log(checkedElements[i].value);
			classification_list.push(checkedElements[i].value);
		}
		//if (V_permission["Data_Use_LandslideDam_1_0"] == 1) {

			if (checkedElements[i].checked && checkedElements[i].value == 'planet') {

				//swal("使用提醒!", "Plant衛星因為使用API查詢國外資料庫，需耗時較久，建議查詢期間設定於一年內，時間過長如無結果回應，煩請重新設定時間區間!","warning");
				//alert("")
				classification_list.push('PSScene4Band');
				planet_checked = 1;
			}
			else if (!checkedElements[i].checked && checkedElements[i].value == 'planet') {
				planet_checked = 0;
			}
		//}
		else {
			planet_checked = 0;
		}
	}
	// console.log('planet_checked')
	// console.log(planet_checked)
	classification_number = classification_list.length;
	// console.log('add classification : ');
	// console.log(classification_list);
	// console.log(classification_number);
}


function check_checkbox() {
	let checkedElements = document.getElementsByName('layer_class');
	for (let i = 0; checkedElements[i]; ++i) {
		checkbox_id = '#checkbox_' + checkedElements[i].value
		// console.log(checkbox_id)
		$(checkbox_id).change(function () {
			addclassification();
		});
	}
}


function clearclassification() {
	let checkedElements = document.getElementsByName('layer_class');
	for (let i = 0; checkedElements[i]; ++i) {
		if (checkedElements[i].checked) {
			checkedElements[i].checked = false;
		}
	}
	classification_list = [];
	classification_number = 0;
	planet_checked = 0;
	console.log('clearclassification')
	console.log(planet_checked)
	// console.log('clear classification');
	// console.log(classification_list);
	// console.log(classification_number);
}

function addallclassification() {
	let checkedElements = document.getElementsByName('layer_class');
	for (let i = 0; checkedElements[i]; ++i) {
		if (!checkedElements[i].checked) {
			checkedElements[i].checked = true;
		}
		if (classification_list.indexOf(checkedElements[i].value) == -1) {
			classification_list.push(checkedElements[i].value);
		}
	}

	classification_number = classification_list.length;
	if (V_permission["Data_Use_LandslideDam_1_0"] == 1) {
		planet_checked = 1;
	}
	else {
		planet_checked = 0;
	}
	// console.log('planet_checked')
	// console.log(planet_checked)
	// console.log('clear classification');
	// console.log(classification_list);
	// console.log(classification_number);
}
addclassification();




















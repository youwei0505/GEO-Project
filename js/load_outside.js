var dhxWins = new dhtmlXWindows();

//外部圖資載入視窗
Outside_w1 = dhxWins.createWindow("Outside_w1", 100, 100, 400, 450);
Outside_w1.setText("外部開啟圖資");


Outside_Layout = Outside_w1.attachLayout("2E");
Outside_Layout.cells("a").hideHeader();
Outside_Layout.cells("b").hideHeader();
Outside_Layout.cells("a").setHeight(40);
var Outside_class = '<input type="button" name="a2" value="取消分類" onclick="Outside_Grid.unGroup();">&nbsp;&nbsp;' +
	'<input type="button"  name="q1" value="分類依據" onclick=\'Outside_Grid.groupBy(document.getElementById("Outside_Layout_sel").value);\'>' +
	'<select id="Outside_Layout_sel">' +
	'<option value="0">勾選</option>' +
	'<option value="2"selected="1">主類別</option>' +
	'<option value="3"selected="1">次類別</option>' +
	'<option value="4">縣市</option>' +
	'<option value="5">鄉鎮</option>' +
	'<option value="6">村里</option>' +
	'<option value="7">集水區</option>' +
	'<option value="8">年</option>' +
	'<option value="9">月</option>' +
	'<option value="10">日</option>' +
	'</select>';


Outside_Layout.cells("a").attachHTMLString(Outside_class);

Outside_Grid = Outside_Layout.cells("b").attachGrid();

Outside_Grid.setImagePath("codebase/imgs/");
Outside_Grid.setHeader("套疊,名稱,主類別,次類別,縣市,鄉鎮,村里,集水區,年,月,日,資料來源,提供單位");
Outside_Grid.attachHeader("&nbsp;,#text_filter,#select_filter,#select_filter,#select_filter,#select_filter,#select_filter,#select_filter,#select_filter,#select_filter,#select_filter,#select_filter,#select_filter");
Outside_Grid.setInitWidths("40,100,80,60,60,60,60,70,60,40,40,40,40");
Outside_Grid.setColAlign("right,left,left,right,right,center,left,center,center,center,center,center,center");
Outside_Grid.attachEvent("onRowDblClicked", Location_Grid_DblClicked);
Outside_Grid.setColTypes("ch,link,ed,ed,ed,ed,ed,ed,ed,ed,ed,ed,ed");
Outside_Grid.attachEvent("onCheckbox", Layer_Grid_OnCheck_Outside_Grid01);
Outside_Grid.setColSorting("na,str,str,str,str,str,str,str,int,int,int,str,str");
Outside_Grid.init();

Outside_w1.hide();
Outside_w1.attachEvent("onClose", function (win) {
	if (cluster_layer != null) {
		maps[0].removeLayer(cluster_layer);
	}
	Outside_w1.hide();
	Outside_w1.setModal(false);
	return false;
});

function outslide_layer_id(event) {

	//event.preventDefault(); //不刷新頁面

	$.ajax({
		type: "POST",  //傳值方式有分 post & get
		dataType: "xml",
		url: "php/outsied_layer.php",
		data: {

			layers_id: outside_layer_id
		},
		success: function (response) {
			//alert(response.getElementsByTagName("id"));
			console.log(response);
			Outside_w1_call(response);
		},
		error: function (e) {
			console.log("Error getting layer information");
			console.log(e);
		}
	});
};


function outslide_MVTlayer_id(event) {

	//event.preventDefault(); //不刷新頁面

	$.ajax({
		type: "POST",  //傳值方式有分 post & get
		dataType: "xml",
		url: "php/outsied_MVTlayer.php",
		data: {

			layers_id: outside_MVTlayer_id
		},
		success: function (response) {
			//alert(response);
			console.log(response);
			Outside_w1_call(response);
		},
		error: function (e) {
			console.log("Error getting layer information");
			console.log(e);
		}
	});
};

function Outside_w1_call(xml_str) {
	Outside_w1.bringToTop();
	Outside_Grid.clearAll();
	//alert(xml_str);
	Outside_Grid.parse(xml_str);

	if (outside_layer_id_win_index) {
		map_ind = outside_layer_id_win_index;//指定載入左視窗或右視窗圖資
	}


	var layer_count_or = 0;
	if (map_ind == 0) {
		for (i = 0; i < outside_layer_vector.length; i++) {
			console.log(outside_layer_vector[i]);
			Outside_Grid.addRow(outside_layer_vector[i][0], [outside_layer_vector[i][1], outside_layer_vector[i][2], "", "", "", "", "", "", "", "", "", "", ""], 1)
		}
		for (i = 0; i < All_Check_List_W0.length; i++) {
			if (All_Check_List_W0[i].RootName == "Outside_Grid") {

				Outside_Grid.addRow(All_Check_List_W0[i].RowID, [All_Check_List_W0[i].IsAddOnMap, All_Check_List_W0[i].FileName, "", "", "", "", "", "", "", "", "", "", ""], 1)
				layer_count_or = layer_count_or + 1;
			}
		}
	} else if (map_ind == 1) {
		for (i = 0; i < All_Check_List_W1.length; i++) {
			if (All_Check_List_W1[i].RootName == "Outside_Grid") {
				Outside_Grid.addRow(All_Check_List_W1[i].RowID, [All_Check_List_W1[i].IsAddOnMap, All_Check_List_W1[i].FileName, "", "", "", "", "", "", "", "", "", "", ""], 1)
				layer_count_or = layer_count_or + 1;
			}
		}
	}
	//Outside_w1.show();
	//alert(xml_str);
	Outside_Grid.groupBy(2);
	/*Search_Grid.clearAndLoad(xml_str,function(){
		Search_Grid.groupBy(2);
	});*/

	Outside_Grid_layer_array = Outside_Grid.getAllItemIds().split(/,(?={)/);

	for (var i = 0; i < Outside_Grid_layer_array.length; i++) {
		//if(Outside_Grid.cells(Outside_Grid_layer_array[i],0).getValue()==1){

		//alert(Outside_Grid_layer_array[i]);

		if (outside_layer_chicked != null) {
			Layer_Grid_OnCheck_Outside_Grid01(Outside_Grid_layer_array[i], "", 1);
			Layer_Grid_OnCheck_Outside_Grid01(Outside_Grid_layer_array[i], "", 0);
			temp_id = JSON.parse(Outside_Grid_layer_array[i]).ID;
			for (var j = 0; j < outside_layer_chicked.length; j++) {
				if (outside_layer_chicked[j] == temp_id) {
					Layer_Grid_OnCheck_Outside_Grid01(Outside_Grid_layer_array[i], "", 1);
				}
			}
		} else {
			Layer_Grid_OnCheck_Outside_Grid01(Outside_Grid_layer_array[i], "", 1);
		}




	}


	//}								
}

//Outside_w1.show();





//w1.button("close").disable();



function Layer_Grid_OnCheck_Outside_Grid01(rowId, cellInd, state) {
	Layer_Grid_Oncheck_Pre('Outside_Grid', rowId, cellInd, state);
}





























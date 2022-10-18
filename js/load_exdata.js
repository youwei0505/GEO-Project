
//搜尋條件視窗

Exdata_w1 = dhxWins.createWindow("Exdata_w1", 1080, 100, 650, 600);
Exdata_w1.setText("資訊彙整");
//Exdata_w1.denyMove();
//Exdata_w1.denyPark();
//Exdata_w1.denyResize();
Exdata_w1_Layout = Exdata_w1.attachLayout("2E");
Exdata_w1_Layout.cells("a").hideHeader();
Exdata_w1_Layout.cells("b").hideHeader();
Exdata_w1_Layout.cells("a").setHeight(30);
var Exdata_class = '<input type="button" name="a2" value="取消分類" onclick="Exdata_w1_Grid.unGroup();">&nbsp;&nbsp;' +
	'<input type="button"  name="q1" value="分類依據" onclick=\'Exdata_w1_Grid.groupBy(document.getElementById("Exdata_w1_sel").value);\'>' +
	'<select id="Exdata_w1_sel">' +
	'<option value="0"></option>' +
	'<option value="3"selected="1">資料來源單位</option>' +
	'<option value="4">類型</option>' +
	'<option value="5">區域</option>' +
	'<option value="7">年份</option>' +
	'</select>';

Exdata_w1_Layout.cells("a").attachHTMLString(Exdata_class);

Exdata_w1_Grid = Exdata_w1_Layout.cells("b").attachGrid();

Exdata_w1_Grid.setImagePath("codebase/imgs/");
Exdata_w1_Grid.setHeader("圖資,說明,圖層名稱,資料來源單位,類型,區域,關鍵字,年份");
Exdata_w1_Grid.attachHeader("&nbsp;,&nbsp;,#text_filter,#select_filter,#select_filter,#select_filter,#text_filter,#select_filter");
Exdata_w1_Grid.setInitWidths("40,20,200,150,80,80,80,70");
Exdata_w1_Grid.setColAlign("right,left,left,left,center,center,left,left");
Exdata_w1_Grid.attachEvent("onRowDblClicked", Location_Grid_DblClicked);
Exdata_w1_Grid.setColTypes("ch,sub_row,link,ed,ed,ed,ed,ed");
Exdata_w1_Grid.attachEvent("onCheckbox", Layer_Grid_Oncheck_Exdata_Grid01);
Exdata_w1_Grid.setColSorting("na,na,str,str,str,str,str,str");

Exdata_w1_Grid.init();
Exdata_w1_Grid.load("tree_xml/exdata/list_2.xml", function () {
	Exdata_w1_Grid.groupBy(3);
});


/*** add 20190225 ***/

var Opacity_Clicking = false;

var Dot_Type_Isopen = false;
var Vector_Type_Isopen = false;
var Image_Type_Isopen = false;
/*** add 0819 ***/
var Favor_Type_Isopen = false;
/****************/
var Layer_Unit_Height = 28;

var Color_Picker_Order = 0;

var Init_Color;
var Init_Fill_Color;


/********************/


Exdata_w1.hide();
Exdata_w1.attachEvent("onClose", function (win) {
	Exdata_w1.hide();
	Exdata_w1.setModal(false);
	return false;
});

function Layer_Grid_Oncheck_Exdata_Grid01(rowId, cellInd, state) {
	Layer_Grid_Oncheck_Pre('Exdata_w1_Grid', rowId, cellInd, state);
}


/* 
	id					value name							default
		
	RowID				row id of layer						row_id
	RootName			root name							root_tree
	ID					id									JSON.parse(row_id.toString()).ID
	FileName			layer name							JSON.parse(row_id.toString()).FileName
	Type				layer type							JSON.parse(row_id.toString()).Type
	Url 				url 								JSON.parse(row_id.toString()).Url
	PosInfo				position info						JSON.parse(row_id.toString()).PosInfo
	ZIndex				z index								according to layer type
	Thickness			thickness							1
	Color				stroke color						JSON.parse(row_id.toString()).PosInfo.split(';')[5] or Init_Color (#FF0000, #00FF00, #0000FF)
	FillColor			fill color							Init_Fill_Color (#00FF00, #0000FF, ##FF0000)
	Opacity				opacity								0 < JSON.parse(row_id.toString()).PosInfo.split(';')[4] < 100, else 100
	FillOpacity			fill opacity						20
	SettingIsOpen		setting panel is open or not		false
	IsAddOnMap			is add on map or not				true
	IsInFavor			is in favor list or not				false
	
 */

window.onload = function () {
	// console.log("window loaded")
};

function Get_Layer_In_All_Check_List_Idx(layer_id) {
	let all_check_list = window[`All_Check_List_W${map_ind}`];

	for (let i = 0; i < all_check_list.length; ++i) {
		if (layer_id == all_check_list[i].ID)
			return i;
	}
	return -1;
}

function Get_Layer_In_Favorite_List_Idx(layer_id) {
	let favor_list = window[`Favor_Type_Check_List_W${map_ind}`];

	for (let i = 0; i < favor_list.length; ++i) {
		if (layer_id == favor_list[i].ID)
			return i;
	}
	return -1;
}


/**
 * Call when click checkbox in 圖層選項 window
 *
 * @param {string} root_tree
 * @param {string} row_id
 * @param {number} state
 */
function Layer_Tree_Oncheck_Pre(root_tree, row_id, state) {
	/* For create gif */
	try {
		if (state) {
			root_tree_Obj = Get_Root_Obj(root_tree);
			let gif_name = root_tree_Obj[1].getItemText(row_id)
			$('#gif_text').val(gif_name);
		}
	} catch (e) {
		console.log(e);
	}
	/* Init according to left/right windows */
	let all_check_list = window[`All_Check_List_W${map_ind}`];
	let dot_list = window[`Dot_Type_Check_List_W${map_ind}`];
	let vector_list = window[`Vector_Type_Check_List_W${map_ind}`];
	let image_list = window[`Image_Type_Check_List_W${map_ind}`];
	let favor_list = window[`Favor_Type_Check_List_W${map_ind}`];
	let new_layer;
	let layer_content;

	if (row_id[0] == "{") {
		layer_content = JSON.parse(row_id.toString());
	}
	else {
		let row_id_array = row_id.split("@");
		layer_content = JSON.parse('{"PosInfo":"' + row_id_array[0] + '","Type":"' + row_id_array[1] + '","Url":"' + row_id_array[2] + '","ID":"' + row_id_array[3] + '","FileName":"' + "testname" + '"}');
	}
	let idx_all = Get_Layer_In_All_Check_List_Idx(layer_content.ID);
	let idx_favor = Get_Layer_In_Favorite_List_Idx(layer_content.ID);

	if (idx_favor != -1) {
		favor_list[idx_favor].IsAddOnMap = state;
		new_layer = JSON.parse(JSON.stringify(favor_list[idx_favor]));
		new_layer.IsAddOnMap = true;
	}
	if (state == true) {
		/* If this layer is not in all_check_list, init it */
		if (idx_all == -1 && idx_favor == -1) {
			new_layer = {};
			new_layer.RootName = root_tree;
			new_layer.ID = layer_content.ID;
			new_layer.FileName = layer_content.FileName;
			new_layer.IsAddOnMap = true;

			/* Choose a init color */
			if ((Color_Picker_Order % 3) == 0) {
				Init_Color = "#ff0000";
				Init_Fill_Color = "#00ff00";
			} else if ((Color_Picker_Order % 3) == 1) {
				Init_Color = "#00ff00";
				Init_Fill_Color = "#0000ff";
			} else if ((Color_Picker_Order % 3) == 2) {
				Init_Color = "#0000ff";
				Init_Fill_Color = "#ff0000";
			}

			/* If this layer has default color, use default color */
			let init_att = layer_content.PosInfo.split(';');
			if (init_att[5] != null) {
				Init_Color = init_att[5];
			}

			new_layer.Color = Init_Color;
			new_layer.Type = layer_content.Type;
			new_layer.Thickness = 1;

			/* If this layer has default opacity, use default opacity */
			if (init_att[4] < 100 && init_att[4] > 0) {
				new_layer.Opacity = init_att[4];
			} else {
				new_layer.Opacity = 100;
			};

			new_layer.FillColor = Init_Fill_Color;

			Color_Picker_Order++;

			new_layer.SettingIsOpen = false;

			new_layer.FillOpacity = 20;

			new_layer.IsInFavor = false;

			new_layer.Url = layer_content.Url;

			new_layer.PosInfo = layer_content.PosInfo;

			new_layer.RowID = row_id;
		}

		if (idx_all == -1) {
			let idx_dot = Dot_Label.indexOf(new_layer.Type, 0);
			let idx_vec = Vector_Label.indexOf(new_layer.Type, 0);
			let idx_img = Image_Label.indexOf(new_layer.Type, 0);

			if (idx_dot != -1) {
				new_layer.ZIndex = 1000 + dot_list.length;
				dot_list.unshift(new_layer);
			} else if (idx_vec != -1) {
				new_layer.ZIndex = 600 + vector_list.length;
				vector_list.unshift(new_layer);
			} else if (idx_img != -1) {
				new_layer.ZIndex = 300 + image_list.length;
				image_list.unshift(new_layer);
			} else {
				new_layer.ZIndex = 300 + image_list.length;
				image_list.unshift(new_layer);
			}

			if (new_layer.FileName.localeCompare("loading...") != 0 && state == true)
				window[`All_Check_List_W${map_ind}`] = dot_list.concat(vector_list.concat(image_list));

		}
	}

	cellInd = "";
	if (idx_all == -1) {
		if (state) {
			Layer_Grid_Oncheck(root_tree, row_id, cellInd, state);
		}
	}
	else if (state != all_check_list[idx_all].IsAddOnMap) {
		all_check_list[idx_all].IsAddOnMap = state;
		Layer_Grid_Oncheck(root_tree, row_id, cellInd, state);
	}

	All_Check_List_Reset();
}

/**
 * Call when click checkbox in 資訊彙整 window
 *
 * @param {string} root_grid
 * @param {string} row_id
 * @param {number} cellInd
 * @param {number} state
 */
function Layer_Grid_Oncheck_Pre(root_grid, row_id, cellInd, state) {
	/* For create gif */
	try {
		if (state) {
			root_grid_Obj = Get_Root_Obj(root_grid);
			let gif_name;
			if (root_grid == "Exdata_w1_Grid") {
				gif_name = root_grid_Obj[1].cells(row_id, 2).getValue().split('^')[0];
			} else {
				gif_name = root_grid_Obj[1].cells(row_id, 1).getValue().split('^')[0];
			}
			$('#gif_text').val(gif_name);
		}
	} catch (e) {
		console.log(e);
	}

	/* Init according to left/right windows */
	let all_check_list = window[`All_Check_List_W${map_ind}`];
	let dot_list = window[`Dot_Type_Check_List_W${map_ind}`];
	let vector_list = window[`Vector_Type_Check_List_W${map_ind}`];
	let image_list = window[`Image_Type_Check_List_W${map_ind}`];
	let favor_list = window[`Favor_Type_Check_List_W${map_ind}`];
	let new_layer;
	let layer_content;
	if (row_id[0] == "{") {
		layer_content = JSON.parse(row_id.toString());
	}
	else {
		let row_id_array = row_id.split("@");
		layer_content = JSON.parse('{"PosInfo":"' + row_id_array[0] + '","Type":"' + row_id_array[1] + '","Url":"' + row_id_array[2] + '","ID":"' + row_id_array[3] + '","FileName":"' + "testname" + '"}');
	}

	let idx_all = Get_Layer_In_All_Check_List_Idx(layer_content.ID);
	let idx_favor = Get_Layer_In_Favorite_List_Idx(layer_content.ID);

	if (idx_favor != -1) {
		favor_list[idx_favor].IsAddOnMap = state;
		new_layer = JSON.parse(JSON.stringify(favor_list[idx_favor]));
		new_layer.IsAddOnMap = true;
	}

	if (state == true) {
		if (idx_all == -1 && idx_favor == -1) {
			new_layer = {};
			new_layer.RootName = root_grid;
			new_layer.ID = layer_content.ID;
			new_layer.FileName = layer_content.FileName;
			new_layer.IsAddOnMap = true;

			/* Choose a init color */
			if ((Color_Picker_Order % 3) == 0) {
				Init_Color = "#ff0000";
				Init_Fill_Color = "#00ff00";
			} else if ((Color_Picker_Order % 3) == 1) {
				Init_Color = "#00ff00";
				Init_Fill_Color = "#0000ff";
			} else if ((Color_Picker_Order % 3) == 2) {
				Init_Color = "#0000ff";
				Init_Fill_Color = "#ff0000";
			}

			/* If this layer has default color, use default color */
			let init_att = layer_content.PosInfo.split(';');
			if (init_att[5] != null) {
				Init_Color = init_att[5];
			}

			new_layer.Color = Init_Color;
			new_layer.Type = layer_content.Type;
			new_layer.Thickness = 1;

			/* If this layer has default opacity, use default opacity */
			if (init_att[4] < 100 && init_att[4] > 0) {
				new_layer.Opacity = init_att[4];
			} else {
				new_layer.Opacity = 100;
			};

			new_layer.FillColor = Init_Fill_Color;

			Color_Picker_Order++;

			new_layer.SettingIsOpen = false;

			new_layer.FillOpacity = 20;

			new_layer.IsInFavor = false;

			new_layer.Url = layer_content.Url;

			new_layer.PosInfo = layer_content.PosInfo;

			new_layer.RowID = row_id;
		}

		if (idx_all == -1) {
			let idx_dot = Dot_Label.indexOf(new_layer.Type, 0);
			let idx_vec = Vector_Label.indexOf(new_layer.Type, 0);
			let idx_img = Image_Label.indexOf(new_layer.Type, 0);

			if (idx_dot != -1) {
				new_layer.ZIndex = 1000 + dot_list.length;
				dot_list.unshift(new_layer);
			} else if (idx_vec != -1) {
				new_layer.ZIndex = 600 + vector_list.length;
				vector_list.unshift(new_layer);
			} else if (idx_img != -1) {
				new_layer.ZIndex = 300 + image_list.length;
				image_list.unshift(new_layer);
			} else {
				new_layer.ZIndex = 300 + image_list.length;
				image_list.unshift(new_layer);
			}
			if (new_layer.FileName.localeCompare("loading...") != 0)
				window[`All_Check_List_W${map_ind}`] = dot_list.concat(vector_list.concat(image_list));

		}
	}
	if (idx_all == -1) {
		if (state) {
			Layer_Grid_Oncheck(root_grid, row_id, cellInd, state);
		}
	}
	else if (state != all_check_list[idx_all].IsAddOnMap) {
		all_check_list[idx_all].IsAddOnMap = state;
		Layer_Grid_Oncheck(root_grid, row_id, cellInd, state);
	}
	All_Check_List_Reset();
}

/**
 * Call when click move up / move down in right layer field Layer_Up_Down
 *
 * @param {number} direct 0 for up, 1 for down
 * @param {number} index the layer in the list which clicked on
 */
function Layer_Up_Down(direct, index) {
	$(".mwt_slider_content_img").css("pointer-events", "none");

	/* Init according to left/right windows */
	let dot_list = window[`Dot_Type_Check_List_W${map_ind}`];
	let vector_list = window[`Vector_Type_Check_List_W${map_ind}`];
	let image_list = window[`Image_Type_Check_List_W${map_ind}`];
	let all_check_list = window[`All_Check_List_W${map_ind}`];
	let index_exchange;

	/*
		1. Determine which layer list to change order 
		2. Clamp the index position if necessary
		3. Calculate the index of exchange layer, according to move up / move down
		4. Change both layers' display in map 
		5. Change both layers' position in list
		6. Change both layers' display in map
	*/

	/* Change the dot layer list order */
	if (dot_list.length != 0 &&
		((index > 0 && index <= dot_list.length - 1 && direct == 0) ||
			(index >= 0 && index < dot_list.length - 1 && direct == 1))) {

		index_exchange = (direct == 0) ? index - 1 : index + 1;

		[dot_list[index].ZIndex, dot_list[index_exchange].ZIndex] = [dot_list[index_exchange].ZIndex, dot_list[index].ZIndex];
		[dot_list[index], dot_list[index_exchange]] = [dot_list[index_exchange], dot_list[index]];

		Layer_Zindex_Change(dot_list[index].Type, dot_list[index].ID, dot_list[index].ZIndex);
		Layer_Zindex_Change(dot_list[index_exchange].Type, dot_list[index_exchange].ID, dot_list[index_exchange].ZIndex);

		/* Change the vector layer list order */
	} else if (vector_list.length != 0 &&
		((index > dot_list.length && index <= dot_list.length + vector_list.length - 1 && direct == 0) ||
			(index >= dot_list.length && index < dot_list.length + vector_list.length - 1 && direct == 1))) {

		index = index - dot_list.length;
		index_exchange = (direct == 0) ? index - 1 : index + 1;

		[vector_list[index].ZIndex, vector_list[index_exchange].ZIndex] = [vector_list[index_exchange].ZIndex, vector_list[index].ZIndex];
		[vector_list[index], vector_list[index_exchange]] = [vector_list[index_exchange], vector_list[index]];

		Layer_Zindex_Change(vector_list[index].Type, vector_list[index].ID, vector_list[index].ZIndex);
		Layer_Zindex_Change(vector_list[index_exchange].Type, vector_list[index_exchange].ID, vector_list[index_exchange].ZIndex);

		/* Change the image layer list order */
	} else if (image_list.length != 0 &&
		((index > dot_list.length + vector_list.length && index <= all_check_list.length - 1 && direct == 0) ||
			(index >= dot_list.length + vector_list.length && index < all_check_list.length - 1 && direct == 1))) {

		index = index - dot_list.length - vector_list.length;
		index_exchange = (direct == 0) ? index - 1 : index + 1;

		[image_list[index].ZIndex, image_list[index_exchange].ZIndex] = [image_list[index_exchange].ZIndex, image_list[index].ZIndex];
		[image_list[index], image_list[index_exchange]] = [image_list[index_exchange], image_list[index]];

		Layer_Zindex_Change(image_list[index].Type, image_list[index].ID, image_list[index].ZIndex);
		Layer_Zindex_Change(image_list[index_exchange].Type, image_list[index_exchange].ID, image_list[index_exchange].ZIndex);
	}

	/* Update layer list in right layer field */
	window[`All_Check_List_W${map_ind}`] = dot_list.concat(vector_list.concat(image_list));
	All_Check_List_Reset();

	$(".mwt_slider_content_img").css("pointer-events", "auto");
}

/**
 * For unfold/fold the setting of each layer (the plus button)
 *
 * @param {number} ind Index of the layer which clicked
 * @param {boolean} is_favor This layer is in FAVOR_LIST or not
 */
function Layer_Setting_Up_Down(ind, is_favor) {
	let curr_type_h;
	let slider = "_slider";

	let list = (is_favor) ? window[`Favor_Type_Check_List_W${map_ind}`] : window[`All_Check_List_W${map_ind}`];
	let dot_list = window[`Dot_Type_Check_List_W${map_ind}`];
	let vector_list = window[`Vector_Type_Check_List_W${map_ind}`];
	let image_list = window[`Image_Type_Check_List_W${map_ind}`];

	let id = list[ind].ID;
	let is_open = list[ind].SettingIsOpen;
	list[ind].SettingIsOpen = is_open ^ true;

	/* If this layer is in ALL_CHECK_LIST */
	if (is_favor == false) {
		if (ind >= 0 && ind < dot_list.length) {
			curr_type_h = $("#dot_slider").css("height");
			slider = "#dot_slider";
		} else if (ind >= dot_list.length && ind < vector_list.length + dot_list.length) {
			curr_type_h = $("#vector_slider").css("height");
			slider = "#vector_slider";
		} else if (ind >= dot_list.length + vector_list.length &&
			ind < image_list.length + dot_list.length + vector_list.length) {
			curr_type_h = $("#image_slider").css("height");
			slider = "#image_slider";
		}
	}
	/* If this layer is in FAVOR_LIST */
	else if (is_favor == true) {
		curr_type_h = $("#favor_slider").css("height");
		slider = "#favor_slider";
	}

	let setting = `${(is_favor) ? "#fsetting" : "#setting"}${id}`;
	let mse = `${(is_favor) ? "#fmse" : "#mse"}${id}`;
	let mses = `${(is_favor) ? "#fmses" : "#mses"}${id}`;


	$(setting).css("pointer-events", "none");

	let setting_height = $(mses).css("height").split('px')[0];
	let select_height = $(mse).css("height").split('px')[0];
	let animate_interval = 200;

	/* If this layer's setting need to be closed */
	if (is_open == 0) {
		curr_type_h = parseInt(curr_type_h.split('px')[0]) + parseInt(setting_height);

		$(slider).animate({ height: (curr_type_h).toString() + 'px' },
			animate_interval,
			'swing',
			function () {
				$(setting).css("pointer-events", "auto");
			});
		$(mse).animate({ height: (parseInt(select_height) + parseInt(setting_height)).toString() + 'px' }, animate_interval, 'swing');
		$(mses).css("display", "inline-block");
		$(setting).attr('src', "icons/minus-func.png");
	}
	/* Else if this layer's setting need to be opened */
	else if (is_open == 1) {
		curr_type_h = parseInt(curr_type_h.split('px')[0]) - parseInt(setting_height);

		$(slider).animate({ height: (curr_type_h).toString() + 'px' }, animate_interval, 'swing');
		$(mse).animate({ height: (parseInt(select_height) - parseInt(setting_height)).toString() + 'px' },
			animate_interval,
			'swing',
			function () {
				$(mses).css("display", "none");
				$(setting).css("pointer-events", "auto");
			});
		$(setting).attr('src', "icons/plus-func.png");
	}

}

/**
 * Unfold / fold the list of layer's type
 *
 * @param {string} id Name of layer's type list button
 */
function Layer_Type_Slider(id) {
	/* slider_type[0]: type, 
	   slider_type[1]: "button" */
	slider_type = id.split('_')[0];

	$("#" + id).css("pointer-events", "none");

	let h = 0;
	let is_open = false;

	/* If this layer list is not empty, and not open, change it to open */
	if (window[`${Capitalize_String(slider_type)}_Type_Isopen`] == false &&
		window[`${Capitalize_String(slider_type)}_Type_Check_List_W${map_ind}`].length != 0) {
		window[`${Capitalize_String(slider_type)}_Type_Isopen`] = true;
		is_open = true;
	}
	/* If this layer list is empty or open, change it to close */
	else {
		window[`${Capitalize_String(slider_type)}_Type_Isopen`] = false;
		is_open = false;
	}

	if (outside_isopen != "") {
		is_open = outside_isopen;
	}

	/* Unfold the specific layer list */
	if (is_open == true) {
		h = parseInt($("#" + slider_type + "_slider").css("height").split('px')[0]) +
			parseInt($("#" + slider_type + "_content").css("height").split('px')[0]);

		$("#" + slider_type + "_slider").animate({ height: h.toString() + 'px' },
			300,
			'swing',
			function () {
				$("#" + id).css("pointer-events", "auto");
			});
		$("#" + slider_type + "_content").css("display", "inline-block");

		$("#" + slider_type + "_isOpen_icon").attr("src", "icons/type-open.png");

	}
	/* Fold the specific layer list */
	else {
		h = parseInt($("#" + slider_type + "_slider").css("height").split('px')[0]) -
			parseInt($("#" + slider_type + "_content").css("height").split('px')[0]);

		$("#" + slider_type + "_slider").animate({ height: h.toString() + 'px' }, 300, 'swing',
			function () {
				$("#" + slider_type + "_content").css("display", "none");
				$("#" + id).css("pointer-events", "auto");
			});

		$("#" + slider_type + "_isOpen_icon").attr("src", "icons/type-close.png");
	}
}


/**
 * Refresh the content view of 圖層管理 window
 */
function All_Check_List_Reset() {
	let all_check_list = window[`All_Check_List_W${map_ind}`];
	let dot_list = window[`Dot_Type_Check_List_W${map_ind}`];
	let vector_list = window[`Vector_Type_Check_List_W${map_ind}`];
	let image_list = window[`Image_Type_Check_List_W${map_ind}`];
	let favor_list = window[`Favor_Type_Check_List_W${map_ind}`];

	/*let all_check_list_str =
		`&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" name="Clear_All_Layer" value="刪除所有圖層" onclick="Clear_All_Layer();">
		&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" id="layer_legend_open_close" value="開啟圖例" onclick="layer_legend_open_close();">
		<br><br>
		&nbsp;&nbsp;&nbsp;&nbsp;
		${(Login_ID == "") ? "" : `<input type="button" id="update_favor_list" value="更新最愛" onclick="Update_Favor_List();">`}
		&nbsp;&nbsp;&nbsp;&nbsp;
		${(Login_ID == "") ? "" : `<a style="color:inherit" download="my_favorite" id="export_favor_list"><input type='button' value="匯出最愛"></a>`}
		&nbsp;&nbsp;&nbsp;&nbsp;
		${(Login_ID == "") ? "" : `<input type="file" id="import_favor_list" style="display: none;"/><input type="button" value="匯入最愛" onclick="document.getElementById('import_favor_list').click();" />`}
		<br><br>`;*/
	let all_check_list_str =
		`&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" name="Clear_All_Layer" value="刪除所有圖層" onclick="Clear_All_Layer();">
		&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" id="layer_legend_open_close" value="開啟圖例" onclick="layer_legend_open_close();">
		&nbsp;&nbsp;&nbsp;&nbsp;
		${(Login_ID == "") ? "" : `<input type="button" id="update_favor_list" value="更新最愛" onclick="Update_Favor_List();">`}
		`;

	let dot_content_css, dot_isopen_img;
	let vector_content_css, vector_isopen_img;
	let image_content_css, image_isopen_img;
	let favor_content_css, favor_isopen_img;

	/* Set three type of layer to hide or show */
	if (Dot_Type_Isopen == true && dot_list.length != 0) {
		dot_content_css = 'display: inline-block;'
		dot_isopen_img = 'icons/type-open.png';
	} else {
		dot_content_css = 'display: none;';
		dot_isopen_img = 'icons/type-close.png';
	}
	if (Vector_Type_Isopen == true && vector_list.length != 0) {
		vector_content_css = 'display: inline-block;'
		vector_isopen_img = 'icons/type-open.png';
	} else {
		vector_content_css = 'display: none;';
		vector_isopen_img = 'icons/type-close.png';
	}
	if (Image_Type_Isopen == true && image_list.length != 0) {
		image_content_css = 'display: inline-block;'
		image_isopen_img = 'icons/type-open.png';
	} else {
		image_content_css = 'display: none;';
		image_isopen_img = 'icons/type-close.png';
	}
	if (Favor_Type_Isopen == true && favor_list.length != 0) {
		favor_content_css = 'display: inline-block;'
		favor_isopen_img = 'icons/type-open.png';
	} else {
		favor_content_css = 'display: none;';
		favor_isopen_img = 'icons/type-close.png';
	}


	/**
	 * For create layer content of each selected layer
	 *
	 * @param {number} i Index of layer in all check list
	 * @returns	{string} String of this layer's html
	 */
	let Create_Layer_Content = function (i, is_favor) {
		let list, type_id, setting, mse, mses;
		if (is_favor) {
			list = favor_list;
			type_id = "favor";
			setting = "fsetting";
			mse = "fmse";
			mses = "fmses";
		}
		else {
			list = all_check_list;
			type_id = "layer";
			setting = "setting";
			mse = "mse";
			mses = "mses";
		}
		let remove_img = "icons/Cancel-128.png";
		let location_img = "icons/Location-128.png";
		let layer_up_img = "icons/up-arrow.png";
		let layer_down_img = "icons/down-arrow.png";
		let favor_img = (list[i].IsInFavor == 1) ? 'icons/like.png' : 'icons/unlike.png';
		let setting_isopen_img;
		let setting_content_style;

		/* Set this layer's setting to hide or show */
		if (list[i].SettingIsOpen == 1) {
			setting_isopen_img = "icons/minus-func.png";
			setting_content_style = "display: inline-block;";
		} else if (list[i].SettingIsOpen == 0) {
			setting_isopen_img = "icons/plus-func.png";
			setting_content_style = "display: none;";
		}

		let idx_dot = Dot_Label.indexOf(list[i].Type, 0);
		let idx_img = Image_Label.indexOf(list[i].Type, 0);
		let idx_orcolor = Orcolor_Label.indexOf(list[i].Type, 0);
		let idx_fill = Fill_Label.indexOf(list[i].Type, 0);

		/* Html for 線段顏色, 填滿顏色, 粗細 */
		let seg_color, fill_color, thickness_selection;
		if (idx_dot != -1 || idx_img != -1 || idx_orcolor != -1) {
			seg_color = "";
			fill_color = "";
			thickness_selection = "";
		}
		else {
			seg_color =
				`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;線段顏色&nbsp;
				<input type="text" class="color_picker" id="0${type_id}_color_picker${list[i].ID}" value="${list[i].Color}">`;
			fill_color =
				`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;填滿顏色&nbsp;
				<input type="text" class="color_picker" id="0${type_id}_fillcolor_picker${list[i].ID}" value="${list[i].FillColor}">`;
			thickness_selection =
				`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;粗細&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<select id="${type_id}_thickness${list[i].ID}" onchange="${type_id}_thickness_on_change('${list[i].ID}')"> 
					<option value="1" ${list[i].Thickness == 1 ? 'selected="selected"' : ''}> 1 </option>
					<option value="2" ${list[i].Thickness == 2 ? 'selected="selected"' : ''}> 2 </option> 
					<option value="3" ${list[i].Thickness == 3 ? 'selected="selected"' : ''}> 3 </option> 
					<option value="4" ${list[i].Thickness == 4 ? 'selected="selected"' : ''}> 4 </option> 
					<option value="5" ${list[i].Thickness == 5 ? 'selected="selected"' : ''}> 5 </option> 
					<option value="6" ${list[i].Thickness == 6 ? 'selected="selected"' : ''}> 6 </option> 
					<option value="7" ${list[i].Thickness == 7 ? 'selected="selected"' : ''}> 7 </option> 
					<option value="8" ${list[i].Thickness == 8 ? 'selected="selected"' : ''}> 8 </option> 
					<option value="9" ${list[i].Thickness == 9 ? 'selected="selected"' : ''}> 9 </option> 
					<option value="10" ${list[i].Thickness == 10 ? 'selected="selected"' : ''}> 10 </option>
				</select>&nbsp;&nbsp;`;
		}

		/* Html for 透明度 */
		let seg_opacity =
			`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;透明度&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			<input type="range" min="0" max="100" value="${list[i].Opacity}" style="width:50px;height=10px;" id="${type_id}_opacity_slider${list[i].ID}">`;

		/* Html for 填滿透明度 */
		let fill_opacity =
			(idx_fill != -1) ?
				`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;填滿透明度&nbsp;
				<input type="range" min="0" max="100" value="${list[i].FillOpacity}" style="width:50px;height=10px;" id="${type_id}_fill_opacity_slider${list[i].ID}">` :
				"";


		/* Add this layer's content into html */
		let layer_content_str =
			`<div class="mwt_slider_element" id="${mse}${list[i].ID}" ondblclick=Location_Grid_DblClicked('${list[i].RowID}')>
				&nbsp;&nbsp;</t>
				<input type='checkbox'  style='zoom:1.5' id="${(is_favor) ? "f" : ""}${list[i].ID}" ${(list[i].IsAddOnMap) ? " checked" : " "} onclick=${Capitalize_String(type_id)}_Selected_Lay_Change('${list[i].RootName.toString()}','${list[i].ID.toString()}','${list[i].RowID.toString().replace(/ /g, '+')}',${i})>
				${list[i].FileName}&nbsp;&nbsp;
				${(is_favor) ? "" : `<img title="圖層刪除" src="${remove_img}" class="mwt_slider_content_img" onclick=Del_Lay('${list[i].RootName}','${list[i].ID.toString()}','${list[i].RowID.toString().replace(/ /g, '+')}')>&nbsp;&nbsp;`}
				<img title="圖層可視範圍定位" src="${location_img}" class="mwt_slider_content_img" onclick=Location_Grid_DblClicked('${list[i].RowID}')>&nbsp;&nbsp;
				${(is_favor) ? "" : `<img title="圖層順序上移" src="${layer_up_img}" class="mwt_slider_content_img" onclick="Layer_Up_Down(0, ${i})">&nbsp;&nbsp;`}

				${(is_favor) ? "" : `<img title="圖層順序下移" src="${layer_down_img}" class="mwt_slider_content_img" onclick="Layer_Up_Down(1, ${i})">&nbsp;&nbsp;`}
				${(Login_ID == "" || Get_Root_Obj(list[i].RootName)[2] == true) ? "" : `<img title="加入到我的最愛" src="${favor_img}" id="favor${list[i].ID}" class="mwt_slider_content_img" onclick=Favor_Onclick("${list[i].ID}")>&nbsp;&nbsp;`}
				
				<img title="圖層樣式設定" src="${setting_isopen_img}" id="${setting}${list[i].ID}" class="mwt_slider_content_img" onclick="Layer_Setting_Up_Down(${i}, ${(is_favor) ? "true" : "false"})">

				&nbsp;&nbsp;<br>
					<div class="mwt_slider_element_setting" style="${setting_content_style}" id="${mses}${list[i].ID}">
						${seg_color}
						${fill_color}
						${thickness_selection}
						${seg_opacity}
						${fill_opacity}
						<br>
					</div>
				</div>`;
				//${(Login_ID == "") ? "" : `<img id="geopdf_origin_button" title="原始圖資產製" src = "${location_img}" class="mwt_slider_content_img" onclick="get_geopdf_origin(${i})">&nbsp;&nbsp;`}//離線地圖產製快捷
		return layer_content_str;
	}

	let dot_list_content_str = "";
	let vector_list_content_str = "";
	let image_list_content_str = "";
	let favor_list_content_str = "";

	/* Add layer content to 圖層管理 window, for each selected layer */
	for (let i = 0; i < dot_list.length; ++i) {
		dot_list_content_str += Create_Layer_Content(i, false);
	}
	for (let i = dot_list.length; i < dot_list.length + vector_list.length; ++i) {
		vector_list_content_str += Create_Layer_Content(i, false);
	}
	for (let i = dot_list.length + vector_list.length; i < all_check_list.length; ++i) {
		image_list_content_str += Create_Layer_Content(i, false);
	}
	for (let i = 0; i < favor_list.length; ++i) {
		favor_list_content_str += Create_Layer_Content(i, true);
	}

	all_check_list_str +=
		`<div class='mwt_slider_type_element' id='dot_slider'>
			<div id='dot_button' onclick='Layer_Type_Slider(this.id)'>
				&nbsp;&nbsp;
				<img src='${dot_isopen_img}' id='dot_isOpen_icon' class='mwt_slider_type_img'>
				&nbsp;&nbsp;&nbsp;&nbsp;點圖層
			</div>
			<div class='mwt_slider_type_content' id='dot_content' style='${dot_content_css}'>
				${dot_list_content_str}
			</div>
		</div><hr>
		<div class='mwt_slider_type_element' id='vector_slider'>
			<div id='vector_button' onclick='Layer_Type_Slider(this.id)'>
				&nbsp;&nbsp;
				<img src='${vector_isopen_img}' id='vector_isOpen_icon' class='mwt_slider_type_img'>
				&nbsp;&nbsp;&nbsp;&nbsp;向量圖層
			</div>
			<div class='mwt_slider_type_content' id='vector_content' style='${vector_content_css}'>
				${vector_list_content_str}
			</div>
		</div><hr>
		<div class='mwt_slider_type_element' id='image_slider'>
			<div id='image_button' onclick='Layer_Type_Slider(this.id)'>
				&nbsp;&nbsp;
				<img src='${image_isopen_img}' id='image_isOpen_icon' class='mwt_slider_type_img'>
				&nbsp;&nbsp;&nbsp;&nbsp;影像圖層
			</div>
			<div class='mwt_slider_type_content' id='image_content' style='${image_content_css}'>
				${image_list_content_str}
			</div>
		</div><hr>
		${(Login_ID == "") ? "" :
			`<div class="mwt_slider_type_element" id="favor_slider">
			<div id="favor_button" onclick="Layer_Type_Slider(this.id)">
				&nbsp;&nbsp;
				<img src="${favor_isopen_img}" id="favor_isOpen_icon" class="mwt_slider_type_img">
				&nbsp;&nbsp;&nbsp;&nbsp;我的最愛
			</div>
			<div class="mwt_slider_type_content" id="favor_content" style="${favor_content_css}">
				${favor_list_content_str}
			</div>
		</div><hr>`}`;



	/* Remove tab, change line content in html */
	all_check_list_str = all_check_list_str.replace(/\t|\n/g, '').trim();
	window[`All_Check_List_W${map_ind}_STR`] = all_check_list_str;
	document.getElementById("mwt_slider_content_in").innerHTML = all_check_list_str;

	/* Export favorite list to file */
	const export_data = [];
	for (let i = 0; i < 2; ++i) {
		export_data[i] = window[`Favor_Type_Check_List_W${i}`];
	}
	$("#export_favor_list").click(() => {
		$("#export_favor_list").attr("href", `data:text/plain;base64,${btoa(encodeURIComponent(JSON.stringify(export_data)))}`);
	});

	/* Import favorite list from file */
	$("#import_favor_list").change(() => {
		let reader = new FileReader();
		reader.onload = function (event) {
			// read feature to layer
			Clear_All_Layer();
			const pre_map_ind = map_ind;
			const import_favor_data = JSON.parse(decodeURIComponent(event.target.result));
			import_favor_data.forEach((import_favor_list, index) => {
				// window[`All_Check_List_W${index}`] = import_favor_list;
				// let all_check_list = window[`All_Check_List_W${index}`];
				let dot_list = window[`Dot_Type_Check_List_W${index}`];
				let vector_list = window[`Vector_Type_Check_List_W${index}`];
				let image_list = window[`Image_Type_Check_List_W${index}`];
				let favor_list = window[`Favor_Type_Check_List_W${index}`];

				import_favor_list.forEach((import_favor_layer) => {
					const idx = favor_list.findIndex(layer => layer.ID == import_favor_layer.ID);
					if (idx != -1) {
						favor_list[idx] = import_favor_layer;
					}
					else {
						favor_list.push(import_favor_layer);
					}		
				});

				// Because map_ind is global variable, will cause bug when adding layer, change to specific map_ind for each layer
				map_ind = index;

				if (favor_list.length > 0) {
					for (let i = 0; i < favor_list.length; i++) {
						favor_list[i].SettingIsOpen = false;
						let idx_dot = Dot_Label.indexOf(favor_list[i].Type, 0);
						let idx_vec = Vector_Label.indexOf(favor_list[i].Type, 0);
						let idx_img = Image_Label.indexOf(favor_list[i].Type, 0);

						let tmp_layer = JSON.parse(JSON.stringify(favor_list[i]));
						if (idx_dot != -1) {
							tmp_layer.ZIndex = 1000 + dot_list.length;
							dot_list.unshift(tmp_layer);
						} else if (idx_vec != -1) {
							tmp_layer.ZIndex = 600 + vector_list.length;
							vector_list.unshift(tmp_layer);
						} else if (idx_img != -1) {
							tmp_layer.ZIndex = 300 + image_list.length;
							image_list.unshift(tmp_layer);
						}

						window[`All_Check_List_W${map_ind}`] = dot_list.concat(vector_list.concat(image_list));
						let ch_lay_root = Get_Root_Obj(favor_list[i].RootName);
						let row_id = favor_list[i].RowID;
						try {
							if (ch_lay_root[2] == false) {
								if (ch_lay_root[0] == "grid") {
									(ch_lay_root[1].cells(row_id, 0)).setValue(favor_list[i].IsAddOnMap);
								} else if (ch_lay_root[0] == "tree") {
									ch_lay_root[1].setCheck(row_id, favor_list[i].IsAddOnMap);
								}
							}
						} catch (e) {
							console.log("cannot find layer tree or layer grid");
						}
						Layer_Grid_Oncheck(favor_list[i].RootName, row_id, 0, favor_list[i].IsAddOnMap);
					}
					// }

				}
			});
			map_ind = pre_map_ind;
			All_Check_List_Reset();
		};

		reader.readAsText($('#import_favor_list').prop('files')[0]);

	});


	let Add_Setting_Content = function (i, is_favor) {
		let type_id = (is_favor) ? "favor" : "layer";
		let list = (is_favor) ? favor_list : all_check_list;

		/* Set up segment color picker */
		$(`#0${type_id}_color_picker${list[i].ID}`).spectrum({
			preferredFormat: "hex",
			color: list[i].Color,
			showPalette: true,
			hideAfterPaletteSelect: true,
			palette: [
				['#000000', 'white', '#76060C',
					'rgb(255, 128, 0);', 'hsv 100 70 50'],
				['#ff0000', '#660066', '#00ff00', '#0000ff', '#7f00ff']
			],
			hide: window[`${type_id}_color_picker_onchange`]
		});

		let idx_vec = Vector_Label.indexOf(list[i].Type, 0)
		let idx_fill = Fill_Label.indexOf(list[i].Type, 0)

		/* Set up fill color picker if is vector */
		if (idx_vec != -1) {
			$(`#0${type_id}_fillcolor_picker${list[i].ID}`).spectrum({
				preferredFormat: "hex",
				color: list[i].FillColor,
				showPalette: true,
				hideAfterPaletteSelect: true,
				palette: [
					['#000000', 'white', '#76060C',
						'rgb(255, 128, 0);', 'hsv 100 70 50'],
					['#ff0000', '#660066', '#00ff00', '#0000ff', '#7f00ff']
				],
				hide: window[`${type_id}_color_picker_onchange`]
			});
		}

		/* Adjust segment opacity */
		/* If mouse is down, set flag to ready to change opacity while mouse moving */
		$(`#${type_id}_opacity_slider${list[i].ID}`).on('mousedown', function () {
			Opacity_Clicking = true;
		});
		/* If mouse is up, change opacity and zero flag */
		$(`#${type_id}_opacity_slider${list[i].ID}`).on('mouseup', function () {
			Opacity_Clicking = false;
			if (is_favor) {
				nid = $(this).attr('id').replace("favor_opacity_slider", "layer_opacity_slider")
				$("#" + nid).val($(this).val())
				Update_Layer_Opacity(nid, $(this).val());

				let favor_id = $(this).attr('id').replace("favor_opacity_slider", "")
				for (var i = 0; i < favor_list.length; i++) {
					if (favor_list[i].ID.localeCompare(favor_id) === 0) {
						favor_list[i].Opacity = $(this).val()
					}
				}
			}
			else {
				Update_Layer_Opacity($(this).attr('id'), $(this).val());

				let favor_id = $(this).attr('id').replace("layer_opacity_slider", "favor_opacity_slider");
				$("#" + favor_id).val($(this).val());
				favor_id = favor_id.replace("favor_opacity_slider", "");
				for (let i = 0; i < favor_list.length; i++) {
					if (favor_list[i].ID.localeCompare(favor_id) === 0) {
						favor_list[i].Opacity = $(this).val()
					}
				}
			}
		});
		/* If mouse is moving and down, change opacity */
		$(`#${type_id}_opacity_slider${list[i].ID}`).on('mousemove', function () {
			if (Opacity_Clicking) {
				if (is_favor) {
					let nid = $(this).attr('id').replace("favor_opacity_slider", "layer_opacity_slider")
					$("#" + nid).val($(this).val())
					Update_Layer_Opacity(nid, $(this).val());

					let favor_id = $(this).attr('id').replace("favor_opacity_slider", "")
					for (var i = 0; i < favor_list.length; i++) {
						if (favor_list[i].ID.localeCompare(favor_id) === 0) {
							favor_list[i].Opacity = $(this).val()
						}
					}
				}
				else {
					Update_Layer_Opacity($(this).attr('id'), $(this).val());

					let favor_id = $(this).attr('id').replace("layer_opacity_slider", "favor_opacity_slider")
					$("#" + favor_id).val($(this).val())
					favor_id = favor_id.replace("favor_opacity_slider", "")
					for (var i = 0; i < favor_list.length; i++) {
						if (favor_list[i].ID.localeCompare(favor_id) === 0) {
							favor_list[i].Opacity = $(this).val()
						}
					}
				}
			}
		});

		/* Adjust fill opacity */
		if (idx_fill != -1) {
			/* If mouse is down, set flag to ready to change fill opacity while mouse moving */
			$(`#${type_id}_fill_opacity_slider${list[i].ID}`).on('mousedown', function () {
				Opacity_Clicking = true;
			});
			/* If mouse is up, change fill opacity and zero flag */
			$(`#${type_id}_fill_opacity_slider${list[i].ID}`).on('mouseup', function () {
				Opacity_Clicking = false;
				if (is_favor) {
					nid = $(this).attr('id').replace("favor_fill_opacity_slider", "layer_fill_opacity_slider")
					Update_Fill_Opacity(nid, $(this).val());

					let favor_id = $(this).attr('id').replace("favor_fill_opacity_slider", "")
					for (var i = 0; i < favor_list.length; i++) {
						if (favor_list[i].ID.localeCompare(favor_id) === 0) {
							favor_list[i].FillOpacity = $(this).val()
						}
					}
				}
				else {
					Update_Fill_Opacity($(this).attr('id'), $(this).val());

					let favor_id = $(this).attr('id').replace("layer_fill_opacity_slider", "favor_fill_opacity_slider")
					$("#" + favor_id).val($(this).val())
					favor_id = favor_id.replace("favor_fill_opacity_slider", "")
					for (var i = 0; i < favor_list.length; i++) {
						if (favor_list[i].ID.localeCompare(favor_id) === 0) {
							favor_list[i].FillOpacity = $(this).val()
						}
					}
				}
			});
			/* If mouse is moving and down, change fill opacity */
			$(`#${type_id}_fill_opacity_slider${list[i].ID}`).on('mousemove', function () {
				if (Opacity_Clicking) {
					if (is_favor) {
						nid = $(this).attr('id').replace("favor_fill_opacity_slider", "layer_fill_opacity_slider")
						$("#" + nid).val($(this).val())
						Update_Fill_Opacity(nid, $(this).val());

						let favor_id = $(this).attr('id').replace("favor_fill_opacity_slider", "")
						for (var i = 0; i < favor_list.length; i++) {
							if (favor_list[i].ID.localeCompare(favor_id) === 0) {
								favor_list[i].FillOpacity = $(this).val()
							}
						}
					}
					else {
						Update_Fill_Opacity($(this).attr('id'), $(this).val());

						let favor_id = $(this).attr('id').replace("layer_fill_opacity_slider", "favor_fill_opacity_slider")
						$("#" + favor_id).val($(this).val())
						favor_id = favor_id.replace("favor_fill_opacity_slider", "")
						for (var i = 0; i < favor_list.length; i++) {
							if (favor_list[i].ID.localeCompare(favor_id) === 0) {
								favor_list[i].FillOpacity = $(this).val()
							}
						}
					}
				}
			});

		}
	}

	/* Add setting content to each layer in 圖層管理 window */
	for (let i = 0; i < all_check_list.length; ++i) {
		Add_Setting_Content(i, false);
	}
	for (let i = 0; i < favor_list.length; ++i) {
		Add_Setting_Content(i, true);
	}
}

/**
 * Call when clicked on checkbox in front of each selected layer
 *
 * @param {string} ch_lay_root_name
 * @param {string} ch_id
 */
function Layer_Selected_Lay_Change(ch_lay_root_name, ch_id, row_id, idx) {
	let all_check_list = window[`All_Check_List_W${map_ind}`];
	let favor_list = window[`Favor_Type_Check_List_W${map_ind}`];
	row_id = row_id.replaceAll("+", " ");
	/* Change the selected status in 圖層管理 window */
	let index = all_check_list.findIndex(layer => layer.ID == ch_id);
	if (index != -1) {
		all_check_list[index].IsAddOnMap = document.getElementById(ch_id).checked;
		/* If this layer is also in favorate list, need to select it too */
		if (all_check_list[index].IsInFavor == 1) {
			document.getElementById("f" + ch_id).checked = document.getElementById(ch_id).checked;
			let favo_index = favor_list.findIndex(layer => layer.ID === ch_id);
			if (favo_index !== -1) {
				favor_list[favo_index].IsAddOnMap = document.getElementById(ch_id).checked;
			}
		}
	}

	/* Change the selected status in 圖層選項 window */
	let ch_lay_root = Get_Root_Obj(ch_lay_root_name);
	try {
		if (ch_lay_root[0] == "grid") {
			(ch_lay_root[1].cells(row_id, 0)).setValue(document.getElementById(ch_id).checked);
		} else if (ch_lay_root[0] == "tree") {
			ch_lay_root[1].setCheck(row_id, document.getElementById(ch_id).checked);
		}
	} catch (e) {
		console.log(e)
	}

	Layer_Grid_Oncheck(ch_lay_root_name, row_id, 0, document.getElementById(ch_id).checked);
}


function W0_Layer_Checked(ch_lay_root_name, ch_id) {
	map_ind_temp = map_ind;
	map_ind = 0;
	let ch_lay_root = Get_Root_Obj(ch_lay_root_name);
	if (All_Check_List_W0.length == 0) {
		try {
			if (ch_lay_root[0] == "grid") {
				Layer_Grid_Oncheck_Pre(ch_lay_root_name, ch_id, true);
				if (map_ind_temp == map_ind) {
					(ch_lay_root[1].cells(ch_id, 0)).setValue(true);
				}
			} else if (ch_lay_root[0] == "tree") {
				Layer_Tree_Oncheck_Pre(ch_lay_root_name, ch_id, true);
				if (map_ind_temp == map_ind) {
					ch_lay_root[1].setCheck(ch_id, true);
				}
			}
		}
		catch (e) {
			console.log(e);
		}
	}

	for (i = 0; i < All_Check_List_W0.length; i++) {
		if (All_Check_List_W0[i].ID == ch_id) {
			if (All_Check_List_W0[i].IsAddOnMap == true) {
				map_ind = map_ind_temp;
				break;
			} else {
				try {
					if (ch_lay_root[0] == "grid") {
						Layer_Grid_Oncheck_Pre(ch_lay_root_name, ch_id, true);
						(ch_lay_root[1].cells(ch_id, 0)).setValue(true);
						map_ind = map_ind_temp;
						break;
					} else if (ch_lay_root[0] == "tree") {
						Layer_Tree_Oncheck_Pre(ch_lay_root_name, ch_id, true);
						ch_lay_root[1].setCheck(ch_id, true);
						map_ind = map_ind_temp;
						break;
					}
				} catch (e) {
					console.log(e);
				}

			}
		}
		if (i == All_Check_List_W0.length - 1) {
			try {
				if (ch_lay_root[0] == "grid") {
					Layer_Grid_Oncheck_Pre(ch_lay_root_name, ch_id, true);
					(ch_lay_root[1].cells(ch_id, 0)).setValue(true);
				} else if (ch_lay_root[0] == "tree") {
					Layer_Grid_Oncheck_Pre(ch_lay_root_name, ch_id, true);
					ch_lay_root[1].setCheck(ch_id, true);
				}
			} catch (e) {
				console.log(e);
			}
		}
	}
	map_ind = map_ind_temp;

}

function W1_Layer_Checked(ch_lay_root_name, ch_id) {

	map_ind = 1;
	var ch_lay_root = new Array();
	ch_lay_root = Get_Root_Obj(ch_lay_root_name);

	if (All_Check_List_W1.length == 0) {
		try {
			if (ch_lay_root[0] == "grid") {
				Layer_Grid_Oncheck_Pre(ch_lay_root_name, ch_id, true);
				if (map_ind_temp == map_ind) {
					(ch_lay_root[1].cells(ch_id, 0)).setValue(true);
				}
			} else if (ch_lay_root[0] == "tree") {
				Layer_Grid_Oncheck_Pre(ch_lay_root_name, ch_id, true);
				if (map_ind_temp == map_ind) {
					ch_lay_root[1].setCheck(ch_id, true);
				}
			}
		} catch (e) {
			console.log(e);
		}
	}


	for (i = 0; i < All_Check_List_W1.length; i++) {
		if (All_Check_List_W1[i].ID == ch_id) {
			if (All_Check_List_W1[i].IsAddOnMap == true) {
				map_ind = map_ind_temp;
				break;
			} else {
				try {
					if (ch_lay_root[0] == "grid") {
						Layer_Tree_Oncheck_Pre(ch_lay_root_name, ch_id, true);
						(ch_lay_root[1].cells(ch_id, 0)).setValue(true);
						map_ind = map_ind_temp;
						break;
					} else if (ch_lay_root.RootName == "tree") {
						Layer_Tree_Oncheck_Pre(ch_lay_root_name, ch_id, true);
						ch_lay_root[1].setCheck(ch_id, true);
						map_ind = map_ind_temp;
						break;
					}
				} catch (e) {
					console.log(e);
				}
			}
		}
		if (i == All_Check_List_W1.length - 1) {
			try {
				if (ch_lay_root[0] == "grid") {
					Layer_Grid_Oncheck_Pre(ch_lay_root_name, ch_id, true);
					(ch_lay_root[1].cells(ch_id, 0)).setValue(true);
				} else if (ch_lay_root[0] == "tree") {
					Layer_Grid_Oncheck_Pre(ch_lay_root_name, ch_id, true);
					ch_lay_root[0].setCheck(ch_id, true);
				}
			} catch (e) {
				console.log(e);
			}
		}
	}
	map_ind = map_ind_temp;
}


/**
 * Get the list of root data for obj_name;
 * 
 * @param {string} obj_name Name of ch_lay_root_name want to find the root;
 * @returns {[string, Objec
 * t, boolean]} The root's data, [0] - Type name of root <string>, [1] - Root ch_lay_root_name <Object>, [2] - If this root is generated by API or built-in;
 */
function Get_Root_Obj(obj_name) {
	let temp_root = new Array(3);

	// add 20190912
	temp_root[0] = "";
	temp_root[1] = "";
	temp_root[2] = false;

	if (obj_name == "Baselayer_w1_Acc_00_Tree_00") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_00;
		return temp_root;
	}
	if (obj_name == "Baselayer_w1_Acc_00_Tree_01") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_01;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_02") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_02;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_03") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_03;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_04") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_04;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_05") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_05;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_06") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_06;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_07") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_07;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_08") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_08;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_09") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_09;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_10") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_10;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_11") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_11;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_12") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_12;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_13") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_13;
		return temp_root;
	}


	if (obj_name == "Baselayer_w1_Acc_00_Tree_C01") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_C01;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_C02") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_C02;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_C03") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_C03;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_C04") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_C04;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_C05") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_C05;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_C06") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_C06;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_C07") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_C07;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_C08") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_C08;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_00_Tree_C09") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_00_Tree_C09;
		return temp_root;
	}


	if (obj_name == "Baselayer_w1_Acc_01_Tree_00") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_01_Tree_00;
		return temp_root;
	}
	if (obj_name == "Baselayer_w1_Acc_01_Tree_01") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_01_Tree_01;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_01_Tree_02") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_01_Tree_02;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_01_Tree_03_L8L") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_01_Tree_03_L8L;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_01_Tree_03_L8R") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_01_Tree_03_L8R;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_01_Tree_04") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_01_Tree_04;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_01_Tree_05") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_01_Tree_05;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_01_Tree_06") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_01_Tree_06;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_01_Tree_07") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_01_Tree_07;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_01_Tree_08") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_01_Tree_08;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_01_Tree_09") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_01_Tree_09;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_01_Tree_10") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_01_Tree_10;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_01_Tree_11") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_01_Tree_11;
		return temp_root;
	}

	if (obj_name == "Baselayer_w1_Acc_02_Tree_00") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_02_Tree_00;
		return temp_root;
	}


	if (obj_name == "Baselayer_w1_Acc_03_Tree_00") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_03_Tree_00;
		return temp_root;
	}
	if (obj_name == "Baselayer_w1_Acc_03_Tree_01") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_03_Tree_01;
		return temp_root;
	} if (obj_name == "Baselayer_w1_Acc_03_Tree_02") {
		temp_root[0] = "tree";
		temp_root[1] = Baselayer_w1_Acc_03_Tree_02;
		return temp_root;
	}

	if (obj_name == "Model_w1_Acc_01_Tree_00") {
		temp_root[0] = "tree";
		temp_root[1] = Model_w1_Acc_01_Tree_00;
		return temp_root;
	}


	if (obj_name == "Model_w1_Acc_01_Tree_01") {
		temp_root[0] = "tree";
		temp_root[1] = Model_w1_Acc_01_Tree_01;
		return temp_root;
	}

	if (obj_name == "Model_w1_Acc_01_Tree_011") {
		temp_root[0] = "tree";
		temp_root[1] = Model_w1_Acc_01_Tree_011;
		return temp_root;
	}

	if (obj_name == "Model_w1_Acc_01_Tree_02") {
		temp_root[0] = "tree";
		temp_root[1] = Model_w1_Acc_01_Tree_02;
		return temp_root;
	}

	if (obj_name == "Model_w1_Acc_01_Tree_03") {
		temp_root[0] = "tree";
		temp_root[1] = Model_w1_Acc_01_Tree_03;
		return temp_root;
	}

	if (obj_name == "Project_w1_Acc_Tree_01") {
		temp_root[0] = "tree";
		temp_root[1] = Project_w1_Acc_Tree_01;
		return temp_root;
	}

	if (obj_name == "Project_w1_Acc_Tree_02") {
		temp_root[0] = "tree";
		temp_root[1] = Project_w1_Acc_Tree_02;
		return temp_root;
	}

	if (obj_name == "Project_w1_Acc_Tree_03") {
		temp_root[0] = "tree";
		temp_root[1] = Project_w1_Acc_Tree_03;
		return temp_root;
	}

	if (obj_name == "Project_w1_Acc_Tree_04") {
		temp_root[0] = "tree";
		temp_root[1] = Project_w1_Acc_Tree_04;
		return temp_root;
	}

	if (obj_name == "Project_w1_Acc_Tree_05") {
		temp_root[0] = "tree";
		temp_root[1] = Project_w1_Acc_Tree_05;
		return temp_root;
	}

	if (obj_name == "Project_w1_Acc_Tree_06") {
		temp_root[0] = "tree";
		temp_root[1] = Project_w1_Acc_Tree_06;
		return temp_root;
	}

	if (obj_name == "Project_w1_Acc_Tree_07") {
		temp_root[0] = "tree";
		temp_root[1] = Project_w1_Acc_Tree_07;
		return temp_root;
	}

	if (obj_name == "Landslidedam_w1_Acc_00_Tree_00") {
		temp_root[0] = "tree";
		temp_root[1] = Landslidedam_w1_Acc_00_Tree_00;
		return temp_root;
	}

	if (obj_name == "Landslidedam_w1_Acc_00_Tree_01") {
		temp_root[0] = "tree";
		temp_root[1] = Landslidedam_w1_Acc_00_Tree_01;
		return temp_root;
	}

	if (obj_name == "Landslidedam_w1_Acc_01_Tree_00") {
		temp_root[0] = "tree";
		temp_root[1] = Landslidedam_w1_Acc_01_Tree_00;
		return temp_root;
	}

	if (obj_name == "Landslidedam_w1_Acc_03_Tree_00") {
		temp_root[0] = "tree";
		temp_root[1] = Landslidedam_w1_Acc_03_Tree_00;
		return temp_root;
	}

	if (obj_name == "draw_w1_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = draw_w1_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}
	if (obj_name == "draw_w2_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = draw_w2_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}

	if (obj_name == "draw_w3_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = draw_w3_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}

	if (obj_name == "draw_w4_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = draw_w4_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}
	/**** 20190904 fixed ****/

	if (obj_name == "draw_crop_gif_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = draw_crop_gif_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}

	/**** 20190904 fixed ****/
	/****   20190218 fixed ****/
	if (obj_name == "geojson_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = geojson_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}
	if (obj_name == "stlfile_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = stlfile_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}
	if (obj_name == "viewshed_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = viewshed_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}
	/****   20190218 fixed ****/
	/****   20190304 fixed ****/
	if (obj_name == "MCRIF_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = MCRIF_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}
	if (obj_name == "svf_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = svf_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}
	if (obj_name == "openness_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = openness_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}
	/****   20190304 fixed ****/
	if (obj_name == "draw_w6_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = vueapp_sentinel2_api.$refs.sentinel2_api.draw_w6_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}

	if (obj_name == "draw_w7_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = vueapp_sentinel2_compare_api.$refs.sentinel2_compare_api.draw_w7_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}

	if (obj_name == "draw_w8_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = vueapp_sentinel2_sis_api.$refs.sentinel2_sis_api.draw_w8_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}

	if (obj_name == "draw_slope_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = draw_slope_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}

	if (obj_name == "draw_aspect_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = draw_aspect_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;

	}
	if (obj_name == "subscene_Tree") {
		temp_root[0] = "tree";
		temp_root[1] = vueapp_subscene_image_api.$refs.subscene_image_api.subscene_Tree;
		// add 20190912
		temp_root[2] = true;
		return temp_root;
	}

	if (obj_name == "Exdata_w1_Grid") {
		temp_root[0] = "grid";
		temp_root[1] = Exdata_w1_Grid;
		return temp_root;
	}
	if (obj_name == "Search_Grid") {
		temp_root[0] = "grid";
		temp_root[1] = Search_Grid;
		return temp_root;
	}

	if (obj_name == "Outside_Grid") {
		temp_root[0] = "grid";
		temp_root[1] = Outside_Grid;
		return temp_root;
	}

}

/**
 * Delete specific layer in selected list
 *
 * @param {string} ch_lay_root_name The tree name of the layer want to delete from selected list
 * @param {string} ch_id The row id of current root ch_lay_root_name;
 */
function Del_Lay(ch_lay_root_name, ch_id, row_id) {
	/* Reset check option in 圖層選項 */
	let ch_lay_root = Get_Root_Obj(ch_lay_root_name);
	try {
		if (ch_lay_root[0] == "grid") {
			(ch_lay_root[1].cells(row_id, 0)).setValue(false);
		} else if (ch_lay_root[0] == "tree") {
			ch_lay_root[1].setCheck(row_id, false);
		}
	} catch (e) {
		console.log(e);
	}

	/* Init according to left/right windows */
	let all_check_list = window[`All_Check_List_W${map_ind}`];
	let favor_list = window[`Favor_Type_Check_List_W${map_ind}`];
	let dot_list = window[`Dot_Type_Check_List_W${map_ind}`];
	let vector_list = window[`Vector_Type_Check_List_W${map_ind}`];
	let image_list = window[`Image_Type_Check_List_W${map_ind}`];
	/* Find the index of this layer in all_check_list */
	let index = all_check_list.findIndex(layer => layer.ID === ch_id);
	let f_index = favor_list.findIndex(layer => layer.ID === ch_id);
	console.log(index, f_index);
	/* If found in all_check_list */
	if (index !== -1) {
		/* If this layer is also in favorate list, uncheck it in favorite list */
		if (f_index !== -1) {
			/* Find layer in favor_list, and uncheck it */
			console.log(`f${all_check_list[index].ID}`);
			document.getElementById("f" + all_check_list[index].ID).checked = false;
			favor_list[f_index].IsAddOnMap = false;

		}
		/* Delete this layer from all_check_list */
		all_check_list.splice(index, 1);

		/* Adjust the order of Dot, Vector, Image list */
		if (dot_list.length != 0 && index >= 0 && index <= dot_list.length - 1) {
			dot_list.splice(index, 1);
			for (let z = index - 1; z >= 0; --z) {
				dot_list[z].ZIndex--;
			}
		} else if (vector_list.length != 0 && index >= dot_list.length && index <= dot_list.length + vector_list.length - 1) {
			vector_list.splice(index - dot_list.length, 1);
			for (let z = index - dot_list.length - 1; z >= 0; --z) {
				vector_list[z].ZIndex--;
			}
		} else if (image_list.length != 0 && index >= dot_list.length + vector_list.length && index <= dot_list.length + vector_list.length + image_list.length - 1) {
			image_list.splice(index - dot_list.length - vector_list.length, 1);
			for (let z = index - dot_list.length - vector_list.length - 1; z >= 0; --z) {
				image_list[z].ZIndex--;
			}
		}
	}
	All_Check_List_Reset();
	Layer_Grid_Oncheck(ch_lay_root_name, row_id, 0, 0);
}

/**
 * Call when click on 刪除所有圖層 button, clear all the layer in map and list
 *
 */
function Clear_All_Layer() {
	let all_check_list = window[`All_Check_List_W${map_ind}`];
	for (let i = all_check_list.length - 1; i >= 0; i--) {
		layer_legend_delete(all_check_list[i].ID);

		Del_Lay(all_check_list[i].RootName, all_check_list[i].ID, all_check_list[i].RowID);
	}
	Outside_Grid.clearAll();
	if (Dot_Type_Isopen)
		Layer_Type_Slider("dot_button");
	if (Vector_Type_Isopen)
		Layer_Type_Slider("vector_button");
	if (Image_Type_Isopen)
		Layer_Type_Slider("image_button");
	if (Favor_Type_Isopen)
		Layer_Type_Slider("favor_button");
}

/**
 * Call when click on favorite button
 *
 * @param {string} favor_id Id from html tag
 */
function Favor_Onclick(favor_id) {
	let all_check_list = window[`All_Check_List_W${map_ind}`];;
	let favor_list = window[`Favor_Type_Check_List_W${map_ind}`];

	let all_idx = all_check_list.findIndex(layer => layer.ID === favor_id);
	if (all_idx != -1) {
		let favor_idx = favor_list.findIndex(layer => layer.ID == favor_id);
		/* If is in favorite list, remove it */
		if (favor_idx != -1) {
			all_check_list[all_idx].IsInFavor = 0;
			favor_list.splice(favor_idx, 1);
		}
		/* If isn't favorite list, add it */
		else {
			all_check_list[all_idx].IsInFavor = 1;
			favor_list.push(JSON.parse(JSON.stringify(all_check_list[all_idx])));
		}
	}
	/* If not in all check list, just delete it in favorite list */
	else {
		let favor_idx = favor_list.findIndex(layer => layer.ID == favor_id);
		favor_list.splice(favor_idx, 1);
	}

	All_Check_List_Reset();
}

/**
 * Call when clicked on checkbox in front of favorite list
 *
 * @param {string} ch_lay_root_name
 * @param {string} ch_id
 */
function Favor_Selected_Lay_Change(ch_lay_root_name, ch_id, row_id, idx) {
	let isChecked = document.getElementById("f" + ch_id).checked;
	let isInList = false;
	let all_check_list = window[`All_Check_List_W${map_ind}`];
	let favor_list = window[`Favor_Type_Check_List_W${map_ind}`];
	let dot_list = window[`Dot_Type_Check_List_W${map_ind}`];
	let vector_list = window[`Vector_Type_Check_List_W${map_ind}`];
	let image_list = window[`Image_Type_Check_List_W${map_ind}`];
	row_id = row_id.replaceAll("+", " ");

	favor_list[idx].IsAddOnMap = isChecked;
	for (let i = 0; i < all_check_list.length; i++) {
		if (ch_id == all_check_list[i].ID) {
			isInList = true;
			all_check_list[i].IsAddOnMap = isChecked;
			document.getElementById(all_check_list[i].ID).checked = isChecked;
			break;
		}
	}

	if (isInList == false) {
		var idx_dot = Dot_Label.indexOf(favor_list[idx].Type, 0);
		var idx_vec = Vector_Label.indexOf(favor_list[idx].Type, 0);
		var idx_img = Image_Label.indexOf(favor_list[idx].Type, 0);

		let tmp_layer = JSON.parse(JSON.stringify(favor_list[idx]));
		if (idx_dot != -1) {
			tmp_layer.ZIndex = 1000 + dot_list.length;
			dot_list.unshift(tmp_layer);
		} else if (idx_vec != -1) {
			tmp_layer.ZIndex = 600 + vector_list.length;
			vector_list.unshift(tmp_layer);
		} else if (idx_img != -1) {
			tmp_layer.ZIndex = 300 + image_list.length;
			image_list.unshift(tmp_layer);
		}

		window[`All_Check_List_W${map_ind}`] = dot_list.concat(vector_list.concat(image_list));
	}
	let ch_lay_root = Get_Root_Obj(ch_lay_root_name);
	try {
		if (ch_lay_root[2] == false) {
			if (ch_lay_root[0] == "grid") {
				(ch_lay_root[1].cells(row_id, 0)).setValue(isChecked);
			} else if (ch_lay_root[0] == "tree") {
				ch_lay_root[1].setCheck(row_id, isChecked);
			}
		}

	} catch (e) {
		console.log("not in tree or grid");
	}
	Layer_Grid_Oncheck(ch_lay_root_name, row_id, 0, isChecked);

	All_Check_List_Reset();

}

/**
 * Get user's favorite list from database
 *
 */
var favor_re_read_count = 0;
function Read_Favor_List() {
	let map_ind_preserve = map_ind;

	for (let i = 0; i < 2; ++i) {
		(function (index, map_ind_preserve) {
			$.ajax({
				type: "POST",
				url: "php/user_data_slug.php",
				dataType: "json",
				data: {
					req: 1,
					slug: `FavorList${index}`
				},
				success: function (json) {
					let favor_list;
					if (json.indexOf('error') > 1) {
						//alert(json);
						console.log("token 讀取失敗");
						favor_re_read_count = favor_re_read_count + 1;
						if (favor_re_read_count < 20) {
							Read_Favor_List();
						}
					} else {
						json = JSON.parse(json);
						if (Object.keys(json).length == 0) {
							$.ajax({
								type: "POST",
								url: "php/user_data_slug.php",
								dataType: "json",
								data: {
									req: 2,
									slug: `FavorList${index}`,
									profile: "[]"
								},
								success: function () {
									console.log("Update data success");
								},
								error: function () {
									console.log("Update data failed");
								}
							});
							favor_list = [];
						}
						else {
							favor_list = json.profile;
						}

						let all_check_list = window[`All_Check_List_W${index}`];
						let dot_list = window[`Dot_Type_Check_List_W${index}`];
						let vector_list = window[`Vector_Type_Check_List_W${index}`];
						let image_list = window[`Image_Type_Check_List_W${index}`];
						window[`Favor_Type_Check_List_W${index}`] = favor_list;


						// Because map_ind is global variable, will cause bug when adding layer, change to specific map_ind for each layer
						map_ind = index;

						if (favor_list.length > 0) {
							if (Is_Priority_Url) {
								for (let fi = 0; fi < favor_list.length; fi++) {
									favor_list[fi].IsAddOnMap = false;
									favor_list[fi].SettingIsOpen = false;
								}
							}
							else {
								for (let fi = 0; fi < favor_list.length; fi++) {
									favor_list[fi].SettingIsOpen = false;
									let isAddOnMap = false;
									for (let i = 0; i < all_check_list.length; i++) {
										if (favor_list[fi].ID == all_check_list[i].ID) {
											$("#0layer_color_picker" + all_check_list[i].ID).spectrum("set", favor_list[fi].Color);
											$("#0layer_fillcolor_picker" + all_check_list[i].ID).spectrum("set", favor_list[fi].FillColor);
											$("#layer_thickness" + all_check_list[i].ID).val(favor_list[fi].Thickness);
											$("#layer_opacity_slider" + all_check_list[i].ID).val(favor_list[fi].Opacity);
											$("#layer_fill_opacity_slider" + all_check_list[i].ID).val(favor_list[fi].FillOpacity);
											all_check_list[i].Color = favor_list[fi].Color;
											all_check_list[i].Thickness = favor_list[fi].Thickness;
											all_check_list[i].Opacity = favor_list[fi].Opacity;
											all_check_list[i].FillColor = favor_list[fi].FillColor;
											all_check_list[i].SettingIsOpen = false;
											all_check_list[i].FillOpacity = favor_list[fi].FillOpacity;
											all_check_list[i].IsInFavor = favor_list[fi].IsInFavor;
											$("#0layer_color_picker" + all_check_list[i].ID).spectrum("show");
											$("#0layer_color_picker" + all_check_list[i].ID).spectrum("hide");
											// If this layer is already on the map
											isAddOnMap = true;
											break;
										}
									}

									// If this layer isn't on the map, add it to map & all list
									if (isAddOnMap == false) {
										var idx_dot = Dot_Label.indexOf(favor_list[fi].Type, 0);
										var idx_vec = Vector_Label.indexOf(favor_list[fi].Type, 0);
										var idx_img = Image_Label.indexOf(favor_list[fi].Type, 0);

										tmp_layer = JSON.parse(JSON.stringify(favor_list[fi]));
										if (idx_dot != -1) {
											tmp_layer.ZIndex = 1000 + dot_list.length;
											dot_list.unshift(tmp_layer);
										} else if (idx_vec != -1) {
											tmp_layer.ZIndex = 600 + vector_list.length;
											vector_list.unshift(tmp_layer);
										} else if (idx_img != -1) {
											tmp_layer.ZIndex = 300 + image_list.length;
											image_list.unshift(tmp_layer);
										}

										window[`All_Check_List_W${index}`] = dot_list.concat(vector_list.concat(image_list));
										let ch_lay_root = Get_Root_Obj(favor_list[fi].RootName);
										let row_id = favor_list[fi].RowID;
										try {
											if (ch_lay_root[2] == false) {
												if (ch_lay_root[0] == "grid") {
													(ch_lay_root[1].cells(row_id, 0)).setValue(favor_list[fi].IsAddOnMap);
												} else if (ch_lay_root[0] == "tree") {
													ch_lay_root[1].setCheck(row_id, favor_list[fi].IsAddOnMap);
												}
											}
										} catch (e) {
											console.log("cannot find layer tree or layer grid");
										}


										if (!Is_Priority_Url) {
											Layer_Grid_Oncheck(favor_list[fi].RootName, row_id, 0, favor_list[fi].IsAddOnMap);
										}
									}
								}
							}
						}
					}
				},
				complete: function () {
					map_ind = map_ind_preserve;
					All_Check_List_Reset();

				},
				error: function (jqXHR) {
					map_ind = map_ind_preserve;
					alert("read favor error")
				}
			});
		})(i, map_ind_preserve);
	}

}

/**
 * Update user's favorite list to database
 *
 */
async function Update_Favor_List() {
	let res = new Array(2);
	for (let i = 0; i < 2; ++i) {
		let form_data = new FormData();
		form_data.append('req', 2);
		form_data.append('slug', `FavorList${i}`);
		form_data.append('profile', JSON.stringify(window[`Favor_Type_Check_List_W${i}`]));

		res[i] = await fetch('php/user_data_slug.php', {
			method: 'POST',
			body: form_data
		});
	}

	if (res[0].ok && res[1].ok) {
		alert("更新我的最愛成功");
	}
	else {
		alert("更新我的最愛失敗");
	}
}


/**
 * Delete user's favorite list in database, not use now
 * 
 */
function Delete_Favor_List() {
	for (let i = 0; i < 2; ++i) {
		$.ajax({
			type: "POST",
			url: "php/user_data_slug.php",
			dataType: "json",
			data: {
				req: 3,
				slug: `favor_list_${i}`
			},
			success: function (json) {
			},
			error: function (jqXHR) {
				alert(jqXHR);
			}
		});
	}
}


/**
 * For debug, to get all user data
 *
 */
function Test_Read(id) {
	$.ajax({
		type: "POST",
		url: "php/user_data_slug.php",
		dataType: "json",
		data: {
			req: 1,
			slug: id,
		},
		success: function (json) {
			console.log(JSON.parse(json));
		}
	});
}


/*** 20201102 ***/
function get_geopdf_origin(i) {
	// 打開地圖輔助工具
	drawer_win_call()
	// 打開繪圖與分享工具
	document.getElementById('toolItem3').click()
	// 打開離線圖資產製(原始畫質)
	if (document.getElementById('Share_1_5').className == 'title')
		document.getElementById('Share_1_5').click()

	// 直接讓使用者框選
	get_crop_image_x_y_origin()

	// 擷取圖層名稱
	let all_check_list = window[`All_Check_List_W${map_ind}`];
	document.getElementById('GeoPDF_name_origin').value = all_check_list[i].FileName
	let mail = response_s.split("@@@")[0].split(',')[3].split('"')[3]
	document.getElementById('GeoPDF_mail_origin').value = mail
	alert('請框選覆蓋範圍!')
}

/*** 20201102 ***/


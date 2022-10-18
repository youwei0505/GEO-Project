 
//堰塞湖

LandslideArea_w1 = dhxWins.createWindow("LandslideArea_w1", 200, 100, 550, 680);
LandslideArea_w1.setText("大崩塌專區視窗");

var Landslidedam_w1_Toolbar=Landslidedam_w1.attachToolbar({
		//icon_path: "icons/Landslidedam/",
		items: [					
			{type: "buttonTwoState",id: "a1_0", text: ""},
			//{type: "separator", id: "sep1"},
			//{type: "buttonTwoState",id: "a1_1", text: "偵測"},
			//{type: "separator", id: "sep2"},
			//{type: "buttonTwoState",id: "a1_2", text: "監測"},
			//{type: "separator", id: "sep3"},
			//{type: "buttonTwoState",id: "a1_3", text: "分析"}					
		]
	});

var Landslidedam_w1_Acc = Landslidedam_w1.attachAccordion({
		//icons_path: "icons/Landslidedam/",
		items: [
			{ id: "a0_0", text: "2021年事件" },
			{ id: "a0_1", text: "歷史事件 " },
		
			{ id: "a1_0", text: "圖資" },
			//{ id: "a1_1", text: "109年度山坡地範圍水保法" },
			//{ id: "a1_2", text: "坡度30度以上範圍圖" },
			//{ id: "a1_3", text: "水庫與河道範圍圖" },

			//{ id: "a2_0", text: "光學衛星與雷達衛星序列影像動畫" },

			{ id: "a3_0", text: "地質圖" },
			{ id: "a3_1", text: "坡度分級圖" },
			{ id: "a3_2", text: "坡向分級圖" },
			{ id: "a3_3", text: "面積與距離量測工具" },
			//{ id: "a3_4", text: "淤積長度" }
    	]
});
Landslidedam_w1_Acc.cells("a3_1").showInnerScroll();
Landslidedam_w1_Acc.cells("a3_1").attachHTMLString("<div class='content' id='landslidedam_slope'></div>");
Landslidedam_w1_Acc.cells("a3_2").showInnerScroll();
Landslidedam_w1_Acc.cells("a3_2").attachHTMLString("<div class='content' id='landslidedam_aspect'></div>");
Landslidedam_w1_Acc.cells("a3_3").attachHTMLString("<div class='content'>" +
														"<div class='ui secondary menu'>" +
															"<a class='item' data-tab='one'><img src='img/paint01.png'></a> " +
															"<a class='item' data-tab='five' id='landslidedam_measure'><img src='img/paint05.png'></a>" +
														"</div>" + 
														"<div class='ui form'>" + 
															"<div class='field'>" + 
																"<label>測量型態</label>" + 
																"<select id='landslidedam_type'>" + 
																	"<option value='length'>線段長度 (LineString)</option>" + 
																	"<option value='area'>多邊形面積 (Polygon)</option>" + 
																	"<option value='point'>經緯度坐標 (location)</option>" + 
																"</select>" + 
															"</div>" + 
															"<div class='fields'>" + 
																"<div class='field'>" + 
																	"<button class='ui button' id='landslidedam_measure_clean'>清除測量</button>" + 
																"</div>" + 
															"</div>" +
														"</div>" + 
													"</div> ");

//initial state

//Landslidedam_w1_Acc.cells('a0_0').open();
//Landslidedam_w1_Toolbar.setItemState("a1_0",true);
//Landslidedam_w1_Toolbar.setItemState("a1_1",false);
//Landslidedam_w1_Toolbar.setItemState("a1_2",false);
//Landslidedam_w1_Toolbar.setItemState("a1_3",false);

// 事件專區
var Landslidedam_w1_Acc_00_Tree_01_load_ind=0;

// 偵測			
var Landslidedam_w1_Acc_01_Tree_00_load_ind=0;
//var Landslidedam_w1_Acc_01_Tree_01_load_ind=0;
//var Landslidedam_w1_Acc_01_Tree_02_load_ind=0;
//var Landslidedam_w1_Acc_01_Tree_03_load_ind=0;

// 監測		
//var Landslidedam_w1_Acc_02_Tree_00_load_ind=0;

// 分析			

var Landslidedam_w1_Acc_03_Tree_00_load_ind=0;
var Landslidedam_w1_Acc_03_Tree_01_load_ind=0;
var Landslidedam_w1_Acc_03_Tree_02_load_ind=0;
var Landslidedam_w1_Acc_03_Tree_03_load_ind=0;
//var Landslidedam_w1_Acc_03_Tree_04_load_ind=0;

Landslidedam_w1.attachEvent("onClose", function(win){
	Landslidedam_w1.hide();
	Landslidedam_w1.setModal(false);
	return false;
});

Landslidedam_w1.hide();

Landslidedam_w1_Acc_00_call(1);
Landslidedam_w1_Acc_01_call(0);
//Landslidedam_w1_Acc_02_call(0);
Landslidedam_w1_Acc_03_call(0); 

Landslidedam_w1_Acc.cells("a0_0").open();
Landslidedam_w1_Toolbar.setItemState("a1_0",true);

Landslidedam_w1_Toolbar.attachEvent("onStateChange",function(id,state){
	Landslidedam_w1_Toolbar.setItemState("a1_0",false);
	Landslidedam_w1_Toolbar.setItemState("a1_1",false);
	//Landslidedam_w1_Toolbar.setItemState("a1_2",false);
	Landslidedam_w1_Toolbar.setItemState("a1_3",false);
	console.log("open id : ", id);
	
	if(id == "a1_0"){
		Landslidedam_w1_Acc_00_call(1);
		Landslidedam_w1_Acc_01_call(0);
		//Landslidedam_w1_Acc_02_call(0);
		Landslidedam_w1_Acc_03_call(0);
		Landslidedam_w1_Acc.cells('a0_0').open();
		Landslidedam_w1_Toolbar.setItemState("a1_0",true);
	}
	if(id == "a1_1"){
		Landslidedam_w1_Acc_00_call(0);
		Landslidedam_w1_Acc_01_call(1);
		//Landslidedam_w1_Acc_02_call(0);
		Landslidedam_w1_Acc_03_call(0); 
		if(Landslidedam_w1_Acc_01_Tree_00_load_ind == 0)
		{
			//load tree
			Landslidedam_w1_Acc_01_Tree_00.load("tree_xml/landslidedam/tree_01_00.xml");
			Landslidedam_w1_Acc_01_Tree_00_load_ind = 1;
		}
		Landslidedam_w1_Acc.cells('a1_0').open();
		Landslidedam_w1_Toolbar.setItemState("a1_1",true);
	}
	/*if(id == "a1_2"){
		Landslidedam_w1_Acc_00_call(0);
		Landslidedam_w1_Acc_01_call(0);
		Landslidedam_w1_Acc_02_call(1);
		Landslidedam_w1_Acc_03_call(0); 
		if(Landslidedam_w1_Acc_02_Tree_00_load_ind == 0)
		{
			//load tree
			Landslidedam_w1_Acc_02_Tree_00_load_ind = 1;
		}
		Landslidedam_w1_Acc.cells('a2_0').open();
		Landslidedam_w1_Toolbar.setItemState("a1_2",true);
	}*/
	if(id == "a1_3"){
		Landslidedam_w1_Acc_00_call(0);
		Landslidedam_w1_Acc_01_call(0);
		//Landslidedam_w1_Acc_02_call(0);
		Landslidedam_w1_Acc_03_call(1); 
		if(Landslidedam_w1_Acc_03_Tree_00_load_ind == 0)
		{
			//load tree
			Landslidedam_w1_Acc_03_Tree_00.load("tree_xml/landslidedam/tree_03_00.xml");
			Landslidedam_w1_Acc_03_Tree_00_load_ind = 1;
		}
		Landslidedam_w1_Acc.cells('a3_0').open();
		Landslidedam_w1_Toolbar.setItemState("a1_3",true);
	}
});

Landslidedam_w1_Acc.attachEvent("onBeforeActive", function(id){
				
	//console.log("onBeforeActive event, cell: "+id);
	if(Landslidedam_w1_Acc_00_Tree_01_load_ind==0 && id=="a0_1" ){Landslidedam_w1_Acc_00_Tree_01.loadXML("tree_xml/landslidedam/tree_00_01.xml"); Landslidedam_w1_Acc_00_Tree_01_load_ind=1;}

	//if(Landslidedam_w1_Acc_01_Tree_01_load_ind==0 && id=="a1_1" ){Landslidedam_w1_Acc_01_Tree_01_load_ind=1;}
	//if(Landslidedam_w1_Acc_01_Tree_02_load_ind==0 && id=="a1_2" ){Landslidedam_w1_Acc_01_Tree_02_load_ind=1;}
	//if(Landslidedam_w1_Acc_01_Tree_03_load_ind==0 && id=="a1_3" ){Landslidedam_w1_Acc_01_Tree_03_load_ind=1;}

	if(Landslidedam_w1_Acc_03_Tree_01_load_ind==0 && id=="a3_1" ){Landslidedam_w1_Acc_03_Tree_01_load_ind=1;}
	if(Landslidedam_w1_Acc_03_Tree_02_load_ind==0 && id=="a3_2" ){Landslidedam_w1_Acc_03_Tree_02_load_ind=1;}
	if(Landslidedam_w1_Acc_03_Tree_03_load_ind==0 && id=="a3_3" ){Landslidedam_w1_Acc_03_Tree_03_load_ind=1;}
	//if(Landslidedam_w1_Acc_03_Tree_04_load_ind==0 && id=="a3_4" ){Landslidedam_w1_Acc_03_Tree_04_load_ind=1;}
			
	return true;
});
Landslidedam_w1_Acc.attachEvent("onActive", function(id){

	if(id=="a3_1" ){slope_function_show(1);}
	if(id=="a3_2" ){aspect_function_show(1);}
				
	return true;
});

Landslidedam_w1_Acc_00_Tree_00 = Landslidedam_w1_Acc.cells("a0_0").attachTree();
Landslidedam_w1_Acc_00_Tree_00.setImagePath("codebase/imgs/dhxtree_material/");
Landslidedam_w1_Acc_00_Tree_00.enableCheckBoxes(1);
Landslidedam_w1_Acc_00_Tree_00.enableThreeStateCheckboxes(true);
Landslidedam_w1_Acc_00_Tree_00.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
Landslidedam_w1_Acc_00_Tree_00.setOnCheckHandler(Layer_Tree_OnCheck_Landslidedam_Acc_00_Tree00);
Landslidedam_w1_Acc_00_Tree_00.setOnDblClickHandler(Location_Grid_DblClicked);
Landslidedam_w1_Acc_00_Tree_00.loadXML("tree_xml/landslidedam/tree_00_00.xml");

Landslidedam_w1_Acc_00_Tree_01 = Landslidedam_w1_Acc.cells("a0_1").attachTree();
Landslidedam_w1_Acc_00_Tree_01.setImagePath("codebase/imgs/dhxtree_material/");
Landslidedam_w1_Acc_00_Tree_01.enableCheckBoxes(1);
Landslidedam_w1_Acc_00_Tree_01.enableThreeStateCheckboxes(true);
Landslidedam_w1_Acc_00_Tree_01.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
Landslidedam_w1_Acc_00_Tree_01.setOnCheckHandler(Layer_Tree_OnCheck_Landslidedam_Acc_00_Tree01);
Landslidedam_w1_Acc_00_Tree_01.setOnDblClickHandler(Location_Grid_DblClicked);

Landslidedam_w1_Acc_01_Tree_00 = Landslidedam_w1_Acc.cells("a1_0").attachTree();
Landslidedam_w1_Acc_01_Tree_00.setImagePath("codebase/imgs/dhxtree_material/");
Landslidedam_w1_Acc_01_Tree_00.enableCheckBoxes(1);
Landslidedam_w1_Acc_01_Tree_00.enableThreeStateCheckboxes(true);
Landslidedam_w1_Acc_01_Tree_00.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
Landslidedam_w1_Acc_01_Tree_00.setOnCheckHandler(Layer_Tree_OnCheck_Landslidedam_Acc_01_Tree00);
Landslidedam_w1_Acc_01_Tree_00.setOnDblClickHandler(Location_Grid_DblClicked);

Landslidedam_w1_Acc_03_Tree_00 = Landslidedam_w1_Acc.cells("a3_0").attachTree();
Landslidedam_w1_Acc_03_Tree_00.setImagePath("codebase/imgs/dhxtree_material/");
Landslidedam_w1_Acc_03_Tree_00.enableCheckBoxes(1);
Landslidedam_w1_Acc_03_Tree_00.enableThreeStateCheckboxes(true);
Landslidedam_w1_Acc_03_Tree_00.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
Landslidedam_w1_Acc_03_Tree_00.setOnCheckHandler(Layer_Tree_OnCheck_Landslidedam_Acc_03_Tree00);
Landslidedam_w1_Acc_03_Tree_00.setOnDblClickHandler(Location_Grid_DblClicked);
//Landslidedam_w1_Acc_03_Tree_00.loadXML("tree_xml/landslidedam/tree_03_00.xml");



function Landslidedam_w1_Acc_00_call(dis) {
			
	if(dis==1){
		Landslidedam_w1_Acc.cells('a0_0').show();
		Landslidedam_w1_Acc.cells('a0_1').show();
	}
	else if(dis==0){
		Landslidedam_w1_Acc.cells('a0_0').hide();
		Landslidedam_w1_Acc.cells('a0_1').hide();	
	}
}
function Landslidedam_w1_Acc_01_call(dis) {
			
	if(dis==1){
		Landslidedam_w1_Acc.cells('a1_0').show();
		//Landslidedam_w1_Acc.cells('a1_1').show();
		//Landslidedam_w1_Acc.cells('a1_2').show();
		//Landslidedam_w1_Acc.cells('a1_3').show();
	}
	else if(dis==0){
		Landslidedam_w1_Acc.cells('a1_0').hide();
		//Landslidedam_w1_Acc.cells('a1_1').hide();
		//Landslidedam_w1_Acc.cells('a1_2').hide();
		//Landslidedam_w1_Acc.cells('a1_3').hide();
	}
}
/*function Landslidedam_w1_Acc_02_call(dis) {
			
	if(dis==1){
		Landslidedam_w1_Acc.cells('a2_0').show();
	}
	else if(dis==0){
		Landslidedam_w1_Acc.cells('a2_0').hide();
	}
}*/
function Landslidedam_w1_Acc_03_call(dis) {
			
	if(dis==1){
		Landslidedam_w1_Acc.cells('a3_0').show();
		Landslidedam_w1_Acc.cells('a3_1').show();
		Landslidedam_w1_Acc.cells('a3_2').show();
		Landslidedam_w1_Acc.cells('a3_3').show();
		//Landslidedam_w1_Acc.cells('a3_4').show();
	}
	else if(dis==0){
		Landslidedam_w1_Acc.cells('a3_0').hide();
		Landslidedam_w1_Acc.cells('a3_1').hide();
		Landslidedam_w1_Acc.cells('a3_2').hide();
		Landslidedam_w1_Acc.cells('a3_3').hide();
		//Landslidedam_w1_Acc.cells('a3_4').hide();
	}
}
function Layer_Tree_OnCheck_Landslidedam_Acc_00_Tree00(rowId, state){
	Layer_Tree_Oncheck_Pre('Landslidedam_w1_Acc_00_Tree_00',rowId, state);
}
function Layer_Tree_OnCheck_Landslidedam_Acc_00_Tree01(rowId, state){
	Layer_Tree_Oncheck_Pre('Landslidedam_w1_Acc_00_Tree_01',rowId, state);
}
function Layer_Tree_OnCheck_Landslidedam_Acc_01_Tree00(rowId, state){
	Layer_Tree_Oncheck_Pre('Landslidedam_w1_Acc_01_Tree_00',rowId, state);
}
function Layer_Tree_OnCheck_Landslidedam_Acc_03_Tree00(rowId, state){
	Layer_Tree_Oncheck_Pre('Landslidedam_w1_Acc_03_Tree_00',rowId, state);
}
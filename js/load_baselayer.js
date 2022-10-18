$(document).ready(function () {
 /********* 20220506 ***********/
    /********* 圖層選項 component init ***********/
    var dhxWins = new dhtmlXWindows();
   
	
    Baselayer_w1 = dhxWins.createWindow("Baselayer_w1", 65, 100, 610, 750);
    Baselayer_w1.setText("圖層選項");
    Baselayer_w1.showInnerScroll();    
    console.log('Baselayer_w1 Done !');

    var baselayer_html = "";	
	$.ajax({
		url: 'html/baselayer.html',
		type: 'get',
		async: false,
		success: function(html) {
			var baselayer_html = String(html);
						
			// debug
			// console.log("test baselayer_html '" + baselayer_html + "'");
			
			Baselayer_w1.attachHTMLString(baselayer_html);
            // 在src/畫面上的重複點集
            Baselayer_w1.attachEvent("onClose", function(win){
                Baselayer_w1.hide();   
                Baselayer_w1.setModal(false);
                return false;
            });
            Baselayer_w1.hide(); //視窗是否自動隱藏
			}
		});
            
            // 嘗試將load_baselayer由外部引入
            // document.write("<script language=javascript src='js/load_baselayer.js'></script>");

            // <script src="js/load_baselayer.js"></script>

            var Baselayer_w1_Acc_00_Tree_01_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_02_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_03_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_04_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_05_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_06_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_07_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_08_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_09_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_10_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_11_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_12_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_13_load_ind = 0;
            
            var Baselayer_w1_Acc_01_Tree_00_load_ind = 0;
            var Baselayer_w1_Acc_01_Tree_01_load_ind = 0;
            var Baselayer_w1_Acc_01_Tree_02_load_ind = 0;
            var Baselayer_w1_Acc_01_Tree_03_load_ind = 0;
            var Baselayer_w1_Acc_01_Tree_04_load_ind = 0;
            var Baselayer_w1_Acc_01_Tree_05_load_ind = 0;
            var Baselayer_w1_Acc_01_Tree_06_load_ind = 0;
            var Baselayer_w1_Acc_01_Tree_07_load_ind = 0;
            var Baselayer_w1_Acc_01_Tree_08_load_ind = 0;
            var Baselayer_w1_Acc_01_Tree_09_load_ind = 0;
            var Baselayer_w1_Acc_01_Tree_10_load_ind = 0;
            var Baselayer_w1_Acc_01_Tree_11_load_ind = 0;
            var Baselayer_w1_Acc_01_Tree_12_load_ind = 0;

            var Baselayer_w1_Acc_02_Tree_00_load_ind = 0;

            var Baselayer_w1_Acc_03_Tree_00_load_ind = 0;
            var Baselayer_w1_Acc_03_Tree_01_load_ind = 0;
            var Baselayer_w1_Acc_03_Tree_02_load_ind = 0;
            //核心圖層_應用分類
            var Baselayer_w1_Acc_00_Tree_C01_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_C02_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_C03_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_C04_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_C05_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_C06_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_C07_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_C08_load_ind = 0;
            var Baselayer_w1_Acc_00_Tree_C09_load_ind = 0;
        /********* 核心圖層 ***********/
            /********* 核心圖層_應用分類 ***********/
            /********* new version 04/11/2022~ ***********/

            /********* 核心圖層_行政及土地區界 ***********/
            Baselayer_w1_Acc_00_Tree_C01 = new dhtmlXTreeObject("a0_C1_divcontent","100%","100%",0);
            Baselayer_w1_Acc_00_Tree_C01.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_00_Tree_C01.enableCheckBoxes(1);
            Baselayer_w1_Acc_00_Tree_C01.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_00_Tree_C01.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_00_Tree_C01.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC01);
            Baselayer_w1_Acc_00_Tree_C01.setOnDblClickHandler(Location_Grid_DblClicked);
            //Baselayer_w1_Acc_00_Tree_C01.loadXML("tree_xml/baselayer/tree_00_C01.xml");

            /********* 核心圖層_路網與地標 ***********/
            Baselayer_w1_Acc_00_Tree_C02 = new dhtmlXTreeObject("a0_C2_divcontent","100%","100%",0);
            Baselayer_w1_Acc_00_Tree_C02.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_00_Tree_C02.enableCheckBoxes(1);
            Baselayer_w1_Acc_00_Tree_C02.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_00_Tree_C02.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_00_Tree_C02.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC02);
            Baselayer_w1_Acc_00_Tree_C02.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_00_Tree_C02.loadXML("tree_xml/baselayer/tree_00_C02.xml");

            /********* 核心圖層_防災資訊 ***********/
            Baselayer_w1_Acc_00_Tree_C03 = new dhtmlXTreeObject("a0_C3_divcontent","100%","100%",0);
            Baselayer_w1_Acc_00_Tree_C03.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_00_Tree_C03.enableCheckBoxes(1);
            Baselayer_w1_Acc_00_Tree_C03.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_00_Tree_C03.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_00_Tree_C03.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC03);
            Baselayer_w1_Acc_00_Tree_C03.setOnDblClickHandler(Location_Grid_DblClicked);
            //Baselayer_w1_Acc_00_Tree_C03.loadXML("tree_xml/baselayer/tree_00_C03.xml");

            /********* 核心圖層_水文與集水區 ***********/
            Baselayer_w1_Acc_00_Tree_C04 = new dhtmlXTreeObject("a0_C4_divcontent","100%","100%",0);
            Baselayer_w1_Acc_00_Tree_C04.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_00_Tree_C04.enableCheckBoxes(1);
            Baselayer_w1_Acc_00_Tree_C04.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_00_Tree_C04.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_00_Tree_C04.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC04);
            Baselayer_w1_Acc_00_Tree_C04.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_00_Tree_C04.loadXML("tree_xml/baselayer/tree_00_C04.xml");

            /********* 核心圖層_雨量資訊 ***********/
            Baselayer_w1_Acc_00_Tree_C05 = new dhtmlXTreeObject("a0_C5_divcontent","100%","100%",0);
            Baselayer_w1_Acc_00_Tree_C05.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_00_Tree_C05.enableCheckBoxes(1);
            Baselayer_w1_Acc_00_Tree_C05.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_00_Tree_C05.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_00_Tree_C05.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC05);
            Baselayer_w1_Acc_00_Tree_C05.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_00_Tree_C05.loadXML("tree_xml/baselayer/tree_00_C05.xml");

            /********* 核心圖層_地形圖 ***********/
            Baselayer_w1_Acc_00_Tree_C06 = new dhtmlXTreeObject("a0_C6_divcontent","100%","100%",0);
            Baselayer_w1_Acc_00_Tree_C06.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_00_Tree_C06.enableCheckBoxes(1);
            Baselayer_w1_Acc_00_Tree_C06.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_00_Tree_C06.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_00_Tree_C06.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC06);
            Baselayer_w1_Acc_00_Tree_C06.setOnDblClickHandler(Location_Grid_DblClicked);
            //Baselayer_w1_Acc_00_Tree_C06.loadXML("tree_xml/baselayer/tree_00_C06.xml");

            /********* 核心圖層_基本圖與歷史地圖 ***********/
            Baselayer_w1_Acc_00_Tree_C07 = new dhtmlXTreeObject("a0_C7_divcontent","100%","100%",0);
            Baselayer_w1_Acc_00_Tree_C07.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_00_Tree_C07.enableCheckBoxes(1);
            Baselayer_w1_Acc_00_Tree_C07.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_00_Tree_C07.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_00_Tree_C07.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC07);
            Baselayer_w1_Acc_00_Tree_C07.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_00_Tree_C07.loadXML("tree_xml/baselayer/tree_00_C07.xml");

        /********* 核心圖層_生態資訊 ***********/
            Baselayer_w1_Acc_00_Tree_C08 = new dhtmlXTreeObject("a0_C8_divcontent","100%","100%",0);
            Baselayer_w1_Acc_00_Tree_C08.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_00_Tree_C08.enableCheckBoxes(1);
            Baselayer_w1_Acc_00_Tree_C08.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_00_Tree_C08.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_00_Tree_C08.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC08);
            Baselayer_w1_Acc_00_Tree_C08.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_00_Tree_C08.loadXML("tree_xml/baselayer/tree_00_C08.xml");

        /********* 核心圖層_農業與環境 ***********/
            Baselayer_w1_Acc_00_Tree_C09 = new dhtmlXTreeObject("a0_C9_divcontent","100%","100%",0);
            Baselayer_w1_Acc_00_Tree_C09.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_00_Tree_C09.enableCheckBoxes(1);
            Baselayer_w1_Acc_00_Tree_C09.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_00_Tree_C09.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_00_Tree_C09.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC09);
            Baselayer_w1_Acc_00_Tree_C09.setOnDblClickHandler(Location_Grid_DblClicked);
            //Baselayer_w1_Acc_00_Tree_C09.loadXML("tree_xml/baselayer/tree_00_C09.xml");

        /********* 舊版本的核心圖層  ***********/
            // Baselayer_w1_Acc_00_Tree_00 = new dhtmlXTreeObject("a0_0_divcontent","100%","100%",0);
            // Baselayer_w1_Acc_00_Tree_00.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_00_Tree_00.enableCheckBoxes(1);
            // Baselayer_w1_Acc_00_Tree_00.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_00_Tree_00.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_00_Tree_00.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_Tree00);
            // Baselayer_w1_Acc_00_Tree_00.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_00_Tree_00.loadXML("tree_xml/baselayer/tree_00_00.xml");
            
            // Baselayer_w1_Acc_00_Tree_01 = new dhtmlXTreeObject("a0_1_divcontent","100%","100%",0);
            // Baselayer_w1_Acc_00_Tree_01.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_00_Tree_01.enableCheckBoxes(1);
            // Baselayer_w1_Acc_00_Tree_01.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_00_Tree_01.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_00_Tree_01.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_Tree01);
            // Baselayer_w1_Acc_00_Tree_01.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_00_Tree_01.loadXML("tree_xml/baselayer/tree_00_01.xml");
            // // 根據使用者打開的情況，再決定是否產生xml的內容
            // // var Obj_a0_1=document.getElementById("a0_1_divcontent");
            // // Obj_a0_1.onclick = function Open_Baselayer_w1_Acc_00_Tree_01() {
            // //     if ( Baselayer_w1_Acc_00_Tree_01_load_ind == 0 ) { Baselayer_w1_Acc_00_Tree_01.loadXML("tree_xml/baselayer/tree_00_01.xml"); Baselayer_w1_Acc_00_Tree_01_load_ind = 1; }
            // // }            

            // Baselayer_w1_Acc_00_Tree_02 = new dhtmlXTreeObject("a0_2_divcontent","100%","100%",0);
            // Baselayer_w1_Acc_00_Tree_02.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_00_Tree_02.enableCheckBoxes(1);
            // Baselayer_w1_Acc_00_Tree_02.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_00_Tree_02.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_00_Tree_02.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_Tree02);
            // Baselayer_w1_Acc_00_Tree_02.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_00_Tree_02.loadXML("tree_xml/baselayer/tree_00_02.xml");

            // Baselayer_w1_Acc_00_Tree_03 = new dhtmlXTreeObject("a0_3_divcontent","100%","100%",0);
            // Baselayer_w1_Acc_00_Tree_03.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_00_Tree_03.enableCheckBoxes(1);
            // Baselayer_w1_Acc_00_Tree_03.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_00_Tree_03.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_00_Tree_03.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_Tree03);
            // Baselayer_w1_Acc_00_Tree_03.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_00_Tree_03.loadXML("tree_xml/baselayer/tree_00_03.xml");

            // Baselayer_w1_Acc_00_Tree_04 = new dhtmlXTreeObject("a0_4_divcontent","100%","100%",0);
            // Baselayer_w1_Acc_00_Tree_04.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_00_Tree_04.enableCheckBoxes(1);
            // Baselayer_w1_Acc_00_Tree_04.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_00_Tree_04.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_00_Tree_04.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_Tree04);
            // Baselayer_w1_Acc_00_Tree_04.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_00_Tree_04.loadXML("tree_xml/baselayer/tree_00_04.xml");

            // Baselayer_w1_Acc_00_Tree_05 = new dhtmlXTreeObject("a0_5_divcontent","100%","100%",0);
            // Baselayer_w1_Acc_00_Tree_05.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_00_Tree_05.enableCheckBoxes(1);
            // Baselayer_w1_Acc_00_Tree_05.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_00_Tree_05.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_00_Tree_05.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_Tree05);
            // Baselayer_w1_Acc_00_Tree_05.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_00_Tree_05.loadXML("tree_xml/baselayer/tree_00_05.xml");

            // Baselayer_w1_Acc_00_Tree_06 = new dhtmlXTreeObject("a0_6_divcontent","100%","100%",0);
            // Baselayer_w1_Acc_00_Tree_06.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_00_Tree_06.enableCheckBoxes(1);
            // Baselayer_w1_Acc_00_Tree_06.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_00_Tree_06.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_00_Tree_06.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_Tree06);
            // Baselayer_w1_Acc_00_Tree_06.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_00_Tree_06.loadXML("tree_xml/baselayer/tree_00_06.xml");

            // Baselayer_w1_Acc_00_Tree_07 = new dhtmlXTreeObject("a0_7_divcontent","100%","100%",0);
            // Baselayer_w1_Acc_00_Tree_07.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_00_Tree_07.enableCheckBoxes(1);
            // Baselayer_w1_Acc_00_Tree_07.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_00_Tree_07.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_00_Tree_07.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_Tree07);
            // Baselayer_w1_Acc_00_Tree_07.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_00_Tree_07.loadXML("tree_xml/baselayer/tree_00_07.xml");

            // Baselayer_w1_Acc_00_Tree_08 = new dhtmlXTreeObject("a0_8_divcontent","100%","100%",0);
            // Baselayer_w1_Acc_00_Tree_08.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_00_Tree_08.enableCheckBoxes(1);
            // Baselayer_w1_Acc_00_Tree_08.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_00_Tree_08.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_00_Tree_08.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_Tree08);
            // Baselayer_w1_Acc_00_Tree_08.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_00_Tree_08.loadXML("tree_xml/baselayer/tree_00_08.xml");
            
            // Baselayer_w1_Acc_00_Tree_09 = new dhtmlXTreeObject("a0_9_divcontent","100%","100%",0);
            // Baselayer_w1_Acc_00_Tree_09.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_00_Tree_09.enableCheckBoxes(1);
            // Baselayer_w1_Acc_00_Tree_09.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_00_Tree_09.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_00_Tree_09.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_Tree09);
            // Baselayer_w1_Acc_00_Tree_09.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_00_Tree_09.loadXML("tree_xml/baselayer/tree_00_09.xml");
            
            // Baselayer_w1_Acc_00_Tree_10 = new dhtmlXTreeObject("a0_10_divcontent","100%","100%",0);
            // Baselayer_w1_Acc_00_Tree_10.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_00_Tree_10.enableCheckBoxes(1);
            // Baselayer_w1_Acc_00_Tree_10.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_00_Tree_10.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_00_Tree_10.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_Tree10);
            // Baselayer_w1_Acc_00_Tree_10.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_00_Tree_10.loadXML("tree_xml/baselayer/tree_00_10.xml");

            // Baselayer_w1_Acc_00_Tree_11 = new dhtmlXTreeObject("a0_11_divcontent","100%","100%",0);
            // Baselayer_w1_Acc_00_Tree_11.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_00_Tree_11.enableCheckBoxes(1);
            // Baselayer_w1_Acc_00_Tree_11.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_00_Tree_11.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_00_Tree_11.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_Tree11);
            // Baselayer_w1_Acc_00_Tree_11.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_00_Tree_11.loadXML("tree_xml/baselayer/tree_00_11.xml");

            // Baselayer_w1_Acc_00_Tree_12 = new dhtmlXTreeObject("a0_12_divcontent","100%","100%",0);
            // Baselayer_w1_Acc_00_Tree_12.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_00_Tree_12.enableCheckBoxes(1);
            // Baselayer_w1_Acc_00_Tree_12.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_00_Tree_12.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_00_Tree_12.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_Tree12);
            // Baselayer_w1_Acc_00_Tree_12.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_00_Tree_12.loadXML("tree_xml/baselayer/tree_00_12.xml");

            // Baselayer_w1_Acc_00_Tree_13 = new dhtmlXTreeObject("a0_13_divcontent","100%","100%",0);
            // Baselayer_w1_Acc_00_Tree_13.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_00_Tree_13.enableCheckBoxes(1);
            // Baselayer_w1_Acc_00_Tree_13.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_00_Tree_13.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_00_Tree_13.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_00_Tree13);
            // Baselayer_w1_Acc_00_Tree_13.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_00_Tree_13.loadXML("tree_xml/baselayer/tree_00_13.xml");

        // <!-- ↥ 舊版本的核心圖層 ↥ -->
		
			if (response_s == "empty_session") {
				//單位登入
				/*Baselayer_w1_Acc_00_Tree_08_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_08.loadXML("tree_xml/baselayer/tree_00_08.xml");
				Baselayer_w1_Acc_00_Tree_04_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_04.loadXML("tree_xml/baselayer/tree_00_04.xml");
				Baselayer_w1_Acc_00_Tree_03_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_03.loadXML("tree_xml/baselayer/tree_00_03.xml");*/
				
				//應用登入
				Baselayer_w1_Acc_00_Tree_C01_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_C01.loadXML("tree_xml/baselayer/tree_00_C01.xml");
				Baselayer_w1_Acc_00_Tree_C03_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_C03.loadXML("tree_xml/baselayer/tree_00_C03.xml");
				Baselayer_w1_Acc_00_Tree_C06_load_ind = 1;  
				Baselayer_w1_Acc_00_Tree_C06.loadXML("tree_xml/baselayer/tree_00_C06.xml");
				Baselayer_w1_Acc_00_Tree_C09_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_C09.loadXML("tree_xml/baselayer/tree_00_C09.xml");
			} else if (!response_s) {
				//alert(response_s);
						//單位登入
				/*Baselayer_w1_Acc_00_Tree_08_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_08.loadXML("tree_xml/baselayer/tree_00_08.xml");
				Baselayer_w1_Acc_00_Tree_04_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_04.loadXML("tree_xml/baselayer/tree_00_04.xml");
				Baselayer_w1_Acc_00_Tree_03_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_03.loadXML("tree_xml/baselayer/tree_00_03.xml");*/
				
				//應用登入
				Baselayer_w1_Acc_00_Tree_C01_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_C01.loadXML("tree_xml/baselayer/tree_00_C01.xml");
				Baselayer_w1_Acc_00_Tree_C03_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_C03.loadXML("tree_xml/baselayer/tree_00_C03.xml");
				Baselayer_w1_Acc_00_Tree_C06_load_ind = 1;  
				Baselayer_w1_Acc_00_Tree_C06.loadXML("tree_xml/baselayer/tree_00_C06.xml");
				Baselayer_w1_Acc_00_Tree_C09_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_C09.loadXML("tree_xml/baselayer/tree_00_C09.xml");
			} else if (ID_data.Source == "SOCIAL") {
						//單位登入
				/*Baselayer_w1_Acc_00_Tree_08_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_08.loadXML("tree_xml/baselayer/tree_00_08.xml");
				Baselayer_w1_Acc_00_Tree_04_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_04.loadXML("tree_xml/baselayer/tree_00_04.xml");
				Baselayer_w1_Acc_00_Tree_03_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_03.loadXML("tree_xml/baselayer/tree_00_03.xml");*/
				
				//應用登入
				Baselayer_w1_Acc_00_Tree_C01_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_C01.loadXML("tree_xml/baselayer/tree_00_C01.xml");
				Baselayer_w1_Acc_00_Tree_C03_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_C03.loadXML("tree_xml/baselayer/tree_00_C03.xml");
				Baselayer_w1_Acc_00_Tree_C06_load_ind = 1;  
				Baselayer_w1_Acc_00_Tree_C06.loadXML("tree_xml/baselayer/tree_00_C06.xml");
				Baselayer_w1_Acc_00_Tree_C09_load_ind = 1;
				Baselayer_w1_Acc_00_Tree_C09.loadXML("tree_xml/baselayer/tree_00_C09.xml");
			}else if  (typeof ID_data.DisplayName != "" && typeof ID_data.DisplayName != "underfined") {
					//單位登入
					/*Baselayer_w1_Acc_00_Tree_08_load_ind = 1;
					Baselayer_w1_Acc_00_Tree_08.loadXML("tree_xml/baselayer/tree_00_08_lg.xml");
					Baselayer_w1_Acc_00_Tree_04_load_ind = 1;
					Baselayer_w1_Acc_00_Tree_04.loadXML("tree_xml/baselayer/tree_00_04_lg.xml");
					Baselayer_w1_Acc_00_Tree_03_load_ind = 1;
					Baselayer_w1_Acc_00_Tree_03.loadXML("tree_xml/baselayer/tree_00_03_lg.xml");*/
					
					//應用登入
					Baselayer_w1_Acc_00_Tree_C01_load_ind = 1;
					Baselayer_w1_Acc_00_Tree_C01.loadXML("tree_xml/baselayer/tree_00_C01_lg.xml");
					Baselayer_w1_Acc_00_Tree_C03_load_ind = 1;
					Baselayer_w1_Acc_00_Tree_C03.loadXML("tree_xml/baselayer/tree_00_C03_lg.xml");
					Baselayer_w1_Acc_00_Tree_C06_load_ind = 1;  
					Baselayer_w1_Acc_00_Tree_C06.loadXML("tree_xml/baselayer/tree_00_C06_lg.xml");
					Baselayer_w1_Acc_00_Tree_C09_load_ind = 1;
					Baselayer_w1_Acc_00_Tree_C09.loadXML("tree_xml/baselayer/tree_00_C09_lg.xml");
			}else{
					//單位登入
					/*Baselayer_w1_Acc_00_Tree_08_load_ind = 1;
					Baselayer_w1_Acc_00_Tree_08.loadXML("tree_xml/baselayer/tree_00_08.xml");
					Baselayer_w1_Acc_00_Tree_04_load_ind = 1;
					Baselayer_w1_Acc_00_Tree_04.loadXML("tree_xml/baselayer/tree_00_04.xml");
					Baselayer_w1_Acc_00_Tree_03_load_ind = 1;
					Baselayer_w1_Acc_00_Tree_03.loadXML("tree_xml/baselayer/tree_00_03.xml");*/
					
					//應用登入
					Baselayer_w1_Acc_00_Tree_C01_load_ind = 1;
					Baselayer_w1_Acc_00_Tree_C01.loadXML("tree_xml/baselayer/tree_00_C01.xml");
					Baselayer_w1_Acc_00_Tree_C03_load_ind = 1;
					Baselayer_w1_Acc_00_Tree_C03.loadXML("tree_xml/baselayer/tree_00_C03.xml");
					Baselayer_w1_Acc_00_Tree_C06_load_ind = 1;  
					Baselayer_w1_Acc_00_Tree_C06.loadXML("tree_xml/baselayer/tree_00_C06.xml");
					Baselayer_w1_Acc_00_Tree_C09_load_ind = 1;
					Baselayer_w1_Acc_00_Tree_C09.loadXML("tree_xml/baselayer/tree_00_C09.xml");
			}
				
			
		
            //核心圖層_應用分類
            
            function Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC01(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_C01", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC02(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_C02", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC03(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_C03", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC04(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_C04", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC05(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_C05", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC06(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_C06", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC07(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_C07", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC08(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_C08", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_TreeC09(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_C09", rowId, state);
            }


        /*********   ↧ 舊版本的核心圖層 ↧ *********/
            function Layer_Tree_OnCheck_Baselayer_Acc_00_Tree00(rowId, state) {
                Layer_Tree_Oncheck_Pre('Baselayer_w1_Acc_00_Tree_00', rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_Tree01(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_01", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_Tree02(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_02", rowId, state);
            }            
            function Layer_Tree_OnCheck_Baselayer_Acc_00_Tree03(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_03", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_Tree04(rowId, state) {
                Layer_Tree_Oncheck_Pre('Baselayer_w1_Acc_00_Tree_04', rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_Tree05(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_05", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_Tree06(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_06", rowId, state);
            }            
            function Layer_Tree_OnCheck_Baselayer_Acc_00_Tree07(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_07", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_Tree08(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_08", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_Tree09(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_09", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_Tree10(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_10", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_Tree11(rowId, state) {
                type_arr = JSON.parse(rowId).Type;
                if (type_arr == "3DModel") {
                    if (map_ind == 0) {
                        swal("切換模式", "請切換至右視窗3D模式檢視!", "warning");
                        //alert("請切換至左視窗3D模式檢視!");
                        Baselayer_w1_Acc_00_Tree_11.setCheck(rowId, false);
                    } else if (model_3Dchange_index == 1) {
                        Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_11", rowId, state);
                    } else if (model_3Dchange_index == 0) {
                        swal("切換模式", "還未在3D模式，請切換至3D模式檢視!!", "warning");
                        //alert("還未在3D模式，請切換至3D模式檢視!");
                        Baselayer_w1_Acc_00_Tree_11.setCheck(rowId, false);
                    }
                } else {
                    Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_11", rowId, state);
                }
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_Tree12(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_12", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_00_Tree13(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_00_Tree_13", rowId, state);
            }
        /*********   ↥ 舊版本的核心圖層 ↥ *********/
        /********* 核心圖層 ***********/   

        /********* 衛星影像 ***********/
            Baselayer_w1_Acc_01_Tree_00 = new dhtmlXTreeObject("Acc_a1_0_div","100%","100%",0);
            Baselayer_w1_Acc_01_Tree_00.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_01_Tree_00.enableCheckBoxes(1);
            Baselayer_w1_Acc_01_Tree_00.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_01_Tree_00.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_01_Tree_00.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_01_Tree00);
            Baselayer_w1_Acc_01_Tree_00.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_01_Tree_00.loadXML("tree_xml/baselayer/tree_01_00.xml");

            Baselayer_w1_Acc_01_Tree_01 = new dhtmlXTreeObject("Acc_a1_1_div","100%","100%",0);
            Baselayer_w1_Acc_01_Tree_01.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_01_Tree_01.enableCheckBoxes(1);
            Baselayer_w1_Acc_01_Tree_01.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_01_Tree_01.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_01_Tree_01.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_01_Tree01);
            Baselayer_w1_Acc_01_Tree_01.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_01_Tree_01.loadXML("tree_xml/baselayer/tree_01_01.xml");

            // Baselayer_w1_Acc_01_Tree_02_Menu = new dhtmlXMenuObject();
            // Baselayer_w1_Acc_01_Tree_02_Menu.setIconsPath("icons/menu/");
            // Baselayer_w1_Acc_01_Tree_02_Menu.renderAsContextMenu();
            // Baselayer_w1_Acc_01_Tree_02_Menu.attachEvent("onClick", Baselayer_w1_Acc_01_Tree_02_Menu_onButtonClick);
            // Baselayer_w1_Acc_01_Tree_02_Menu.loadStruct("tree_xml/baselayer/tree_01_02_menu.xml");
            Baselayer_w1_Acc_01_Tree_02 = new dhtmlXTreeObject("Acc_a1_2_div","100%","100%",0);
            Baselayer_w1_Acc_01_Tree_02.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_01_Tree_02.enableCheckBoxes(1);
            Baselayer_w1_Acc_01_Tree_02.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_01_Tree_02.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_01_Tree_02.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_01_Tree01);
            Baselayer_w1_Acc_01_Tree_02.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_01_Tree_02.load("php/BL_A01_T02.php"); 



            Baselayer_w1_Acc_01_Tree_03 = new dhtmlXTreeObject("Acc_a1_3_div","100%","100%",0);

            // Baselayer_w1_Acc_01_Tree_03_L = new dhtmlXTreeObject("Acc_a1_3_div_01","100%","100%",0);
            // Baselayer_w1_Acc_01_Tree_03_R = new dhtmlXTreeObject("Acc_a1_3_div_02","100%","100%",0);

            
            
            Baselayer_w1_Acc_01_Tree_03_L8L_Menu = new dhtmlXMenuObject();
            Baselayer_w1_Acc_01_Tree_03_L8L_Menu.setIconsPath("icons/menu/");
            Baselayer_w1_Acc_01_Tree_03_L8L_Menu.renderAsContextMenu();
            Baselayer_w1_Acc_01_Tree_03_L8L_Menu.attachEvent("onClick", Baselayer_w1_Acc_01_Tree_03_L8L_Menu_onButtonClick);
            Baselayer_w1_Acc_01_Tree_03_L8L_Menu.loadStruct("tree_xml/baselayer/tree_01_03_L8L_menu.xml");

            Baselayer_w1_Acc_01_Tree_03_L8L = new dhtmlXTreeObject("Acc_a1_3_div_01","100%","100%",0);
            Baselayer_w1_Acc_01_Tree_03_L8L.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_01_Tree_03_L8L.enableRadioButtons(1);
            Baselayer_w1_Acc_01_Tree_03_L8L.enableCheckBoxes(1);
            Baselayer_w1_Acc_01_Tree_03_L8L.attachEvent("onOpenEnd", function (nodeId, event) { });
            Baselayer_w1_Acc_01_Tree_03_L8L.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_01_Tree03_L8L);
            Baselayer_w1_Acc_01_Tree_03_L8L.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_01_Tree_03_L8L.enableContextMenu(Baselayer_w1_Acc_01_Tree_03_L8L_Menu);
            
            Baselayer_w1_Acc_01_Tree_03_L8R_Menu = new dhtmlXMenuObject();
            Baselayer_w1_Acc_01_Tree_03_L8R_Menu.setIconsPath("icons/menu/");
            Baselayer_w1_Acc_01_Tree_03_L8R_Menu.renderAsContextMenu();
            Baselayer_w1_Acc_01_Tree_03_L8R_Menu.attachEvent("onClick", Baselayer_w1_Acc_01_Tree_03_L8R_Menu_onButtonClick);
            Baselayer_w1_Acc_01_Tree_03_L8R_Menu.loadStruct("tree_xml/baselayer/tree_01_03_L8R_menu.xml");

            Baselayer_w1_Acc_01_Tree_03_L8R = new dhtmlXTreeObject("Acc_a1_3_div_02","100%","100%",0);
            Baselayer_w1_Acc_01_Tree_03_L8R.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_01_Tree_03_L8R.enableCheckBoxes(1);
            Baselayer_w1_Acc_01_Tree_03_L8R.attachEvent("onOpenEnd", function (nodeId, event) { });
            Baselayer_w1_Acc_01_Tree_03_L8R.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_01_Tree03_L8R);
            Baselayer_w1_Acc_01_Tree_03_L8R.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_01_Tree_03_L8R.enableContextMenu(Baselayer_w1_Acc_01_Tree_03_L8R_Menu);
            //Baselayer_w1_Acc_01_Tree_03_L8L.loadXML("tree_xml/baselayer/tree_01_03.xml");

            Baselayer_w1_Acc_01_Tree_03_L8L.load("php/BL_A01_T03_L.php"); 
            Baselayer_w1_Acc_01_Tree_03_L8R.load("php/BL_A01_T03_R.php");

            function Baselayer_w1_Acc_01_Tree_03_L8L_Menu_onButtonClick(menuitemId, type) {
                var id = Baselayer_w1_Acc_01_Tree_03_L8L.contextID;
                id_array = id.split('@');
                if (menuitemId == "download") {
                    if (Login_ID != "" && V_permission["Data_Download_Base_1_3"] == 1) {
                        swal("使用提醒!", "Landsat-8光學衛星影像單幅全島影像超過25GB!如需原檔，煩請直接聯繫執行團隊!連絡電話：06-2366740", "warning");
                        //download_get(Login_ID,id_array[3]);					
                    } else if (Login_ID != "" && V_permission["Data_Download_Base_1_3"] == 0) {
                        swal("使用提醒!", "您無權限下載此類型檔案!", "warning");
                    } else {
                        swal("使用提醒!", "本系統之圖資下載需先登入!", "warning");
                    }
                }

            }
            function Baselayer_w1_Acc_01_Tree_03_L8R_Menu_onButtonClick(menuitemId, type) {
                var id = Baselayer_w1_Acc_01_Tree_03_L8R.contextID;
                id_array = id.split('@');
                if (menuitemId == "download") {
                    if (Login_ID != "" && V_permission["Data_Download_Base_1_3"] == 1) {
                        swal("使用提醒!", "Landsat-8光學衛星影像單幅全島影像超過25GB!如需原檔，煩請直接聯繫執行團隊!連絡電話：06-2366740", "warning");
                        //download_get(Login_ID,id_array[3]);					
                    } else if (Login_ID != "" && V_permission["Data_Download_Base_1_3"] == 0) {
                        swal("使用提醒!", "您無權限下載此類型檔案!", "warning");
                    } else {
                        swal("使用提醒!", "本系統之圖資下載需先登入!", "warning");
                    }
                }
            
            }
            // Baselayer_w1_Acc_01_Tree_03.cells("a").setText('<img src="icons/baselayer/a1-3L.png" style="vertical-align:middle;" height="20" width="20">左條帶');
            // Baselayer_w1_Acc_01_Tree_03.cells("b").setText('<img src="icons/baselayer/a1-3R.png" style="vertical-align:middle;" height="20" width="20">右條帶');
            // Baselayer_w1_Acc_01_Tree_03.cells("a").fixSize(true);

            // Baselayer_w1_Acc_01_Tree_03.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_01_Tree_03.enableCheckBoxes(1);
            // Baselayer_w1_Acc_01_Tree_03.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_01_Tree_03.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_01_Tree_03.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_01_Tree01);
            // Baselayer_w1_Acc_01_Tree_03.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_01_Tree_03.load("php/BL_A01_T02.php");

            Baselayer_w1_Acc_01_Tree_04 = new dhtmlXTreeObject("Acc_a1_4_div","100%","100%",0);
            Baselayer_w1_Acc_01_Tree_04.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_01_Tree_04.enableCheckBoxes(1);
            Baselayer_w1_Acc_01_Tree_04.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_01_Tree_04.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_01_Tree_04.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_01_Tree01);
            Baselayer_w1_Acc_01_Tree_04.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_01_Tree_04.load("php/BL_A01_T04.php"); 

            Baselayer_w1_Acc_01_Tree_05 = new dhtmlXTreeObject("Acc_a1_5_div","100%","100%",0);
            Baselayer_w1_Acc_01_Tree_05.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_01_Tree_05.enableCheckBoxes(1);
            Baselayer_w1_Acc_01_Tree_05.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_01_Tree_05.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_01_Tree_05.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_01_Tree05);
            Baselayer_w1_Acc_01_Tree_05.setOnDblClickHandler(Location_Grid_DblClicked);
            //Baselayer_w1_Acc_01_Tree_05.loadXML("tree_xml/baselayer/tree_01_05.xml");
            Baselayer_w1_Acc_01_Tree_05.load("php/BL_A01_T05.php"); 

            Baselayer_w1_Acc_01_Tree_06 = new dhtmlXTreeObject("Acc_a1_6_div","100%","100%",0);
            Baselayer_w1_Acc_01_Tree_06.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_01_Tree_06.enableCheckBoxes(1);
            Baselayer_w1_Acc_01_Tree_06.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_01_Tree_06.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_01_Tree_06.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_01_Tree06);
            Baselayer_w1_Acc_01_Tree_06.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_01_Tree_06.loadXML("tree_xml/baselayer/tree_01_06.xml");

            // Baselayer_w1_Acc_01_Tree_07 = new dhtmlXTreeObject("Acc_a1_7_div","100%","100%",0);
            // Baselayer_w1_Acc_01_Tree_07.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_01_Tree_07.enableCheckBoxes(1);
            // Baselayer_w1_Acc_01_Tree_07.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_01_Tree_07.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_01_Tree_07.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_01_Tree07);
            // Baselayer_w1_Acc_01_Tree_07.setOnDblClickHandler(Location_Grid_DblClicked);
            // //Baselayer_w1_Acc_01_Tree_07.loadXML("tree_xml/baselayer/tree_01_07.xml");
            // Baselayer_w1_Acc_01_Tree_07.load("php/BL_A01_T07.php");

            // Baselayer_w1_Acc_01_Tree_08 = new dhtmlXTreeObject("Acc_a1_8_div","100%","100%",0);
            // Baselayer_w1_Acc_01_Tree_08.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_01_Tree_08.enableCheckBoxes(1);
            // Baselayer_w1_Acc_01_Tree_08.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_01_Tree_08.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_01_Tree_08.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_01_Tree08);
            // Baselayer_w1_Acc_01_Tree_08.setOnDblClickHandler(Location_Grid_DblClicked);
            // //Baselayer_w1_Acc_01_Tree_08.loadXML("tree_xml/baselayer/tree_01_08.xml");
            // Baselayer_w1_Acc_01_Tree_08.load("php/BL_A01_T08.php"); 

            Baselayer_w1_Acc_01_Tree_09 = new dhtmlXTreeObject("Acc_a1_9_div","100%","100%",0);
            Baselayer_w1_Acc_01_Tree_09.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_01_Tree_09.enableCheckBoxes(1);
            Baselayer_w1_Acc_01_Tree_09.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_01_Tree_09.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_01_Tree_09.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_01_Tree06);
            Baselayer_w1_Acc_01_Tree_09.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_01_Tree_09.loadXML("tree_xml/baselayer/tree_01_09.xml");

            Baselayer_w1_Acc_01_Tree_10 = new dhtmlXTreeObject("Acc_a1_10_div","100%","100%",0);
            Baselayer_w1_Acc_01_Tree_10.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_01_Tree_10.enableCheckBoxes(1);
            Baselayer_w1_Acc_01_Tree_10.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_01_Tree_10.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_01_Tree_10.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_01_Tree10);
            Baselayer_w1_Acc_01_Tree_10.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_01_Tree_10.loadXML("tree_xml/baselayer/tree_01_10.xml");

            // Baselayer_w1_Acc_01_Tree_11 = new dhtmlXTreeObject("Acc_a1_11_div","100%","100%",0);
            // Baselayer_w1_Acc_01_Tree_11.setImagePath("codebase/imgs/dhxtree_material/");
            // Baselayer_w1_Acc_01_Tree_11.enableCheckBoxes(1);
            // Baselayer_w1_Acc_01_Tree_11.enableThreeStateCheckboxes(true);
            // Baselayer_w1_Acc_01_Tree_11.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            // Baselayer_w1_Acc_01_Tree_11.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_01_Tree11);
            // Baselayer_w1_Acc_01_Tree_11.setOnDblClickHandler(Location_Grid_DblClicked);
            // Baselayer_w1_Acc_01_Tree_11.loadXML("tree_xml/baselayer/tree_01_11.xml");

            function Layer_Tree_OnCheck_Baselayer_Acc_01_Tree00(rowId, state) {
                Layer_Tree_Oncheck_Pre('Baselayer_w1_Acc_01_Tree_00', rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_01_Tree01(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_01_Tree_01", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_01_Tree02(rowId, state) {
            
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_01_Tree_02", rowId, state);
            }            
            function Layer_Tree_OnCheck_Baselayer_Acc_01_Tree03_L8L(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_01_Tree_03_L8L", rowId, state);
            }            
            function Layer_Tree_OnCheck_Baselayer_Acc_01_Tree03_L8R(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_01_Tree_03_L8R", rowId, state);
            }            
            function Layer_Tree_OnCheck_Baselayer_Acc_01_Tree04(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_01_Tree_04", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_01_Tree05(rowId, state) {
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_01_Tree_05", rowId, state);
            }            
            function Layer_Tree_OnCheck_Baselayer_Acc_01_Tree06(rowId, state) {
            
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_01_Tree_06", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_01_Tree07(rowId, state) {
            
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_01_Tree_07", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_01_Tree08(rowId, state) {
            
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_01_Tree_08", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_01_Tree09(rowId, state) {
            
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_01_Tree_09", rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_01_Tree10(rowId, state) {
            
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_01_Tree_10", rowId, state);
            }            
            function Layer_Tree_OnCheck_Baselayer_Acc_01_Tree11(rowId, state) {
            
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_01_Tree_11", rowId, state);
            }            
            function Layer_Tree_OnCheck_Baselayer_Acc_01_Tree12(rowId, state) {
            
                Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_01_Tree_12", rowId, state);
            }
        /********* 衛星影像 ***********/
            
        /********* 航空照片 ***********/
            Baselayer_w1_Acc_02_Tree_00 = new dhtmlXTreeObject("a2_0_div","100%","100%",0);
            Baselayer_w1_Acc_02_Tree_00.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_02_Tree_00.enableCheckBoxes(1);
            Baselayer_w1_Acc_02_Tree_00.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_02_Tree_00.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_02_Tree_00.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_02_Tree00);
            Baselayer_w1_Acc_02_Tree_00.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_02_Tree_00.load("php/BL_A02_T00.php");

            function Layer_Tree_OnCheck_Baselayer_Acc_02_Tree00(rowId, state) {
                Layer_Tree_Oncheck_Pre('Baselayer_w1_Acc_02_Tree_00', rowId, state);
            }
        /********* 航空照片 ***********/

        /********* UAV空拍 ***********/
            Baselayer_w1_Acc_03_Tree_00 = new dhtmlXTreeObject("a3_0_div","100%","100%",0);
            Baselayer_w1_Acc_03_Tree_00.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_03_Tree_00.enableCheckBoxes(1);
            Baselayer_w1_Acc_03_Tree_00.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_03_Tree_00.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_03_Tree_00.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_03_Tree00);
            //Baselayer_w1_Acc_03_Tree_00.enableContextMenu(Baselayer_w1_Acc_03_Tree_00_Menu);
            Baselayer_w1_Acc_03_Tree_00.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_03_Tree_00.attachEvent("onBeforeContextMenu", function (itemId) {
                //alert(itemId);
                return true
            });
            Baselayer_w1_Acc_03_Tree_00.load("php/BL_A03_T00.php"); 

            Baselayer_w1_Acc_03_Tree_02 = new dhtmlXTreeObject("a3_2_div","100%","100%",0);
            Baselayer_w1_Acc_03_Tree_02.setImagePath("codebase/imgs/dhxtree_material/");
            Baselayer_w1_Acc_03_Tree_02.enableCheckBoxes(1);
            Baselayer_w1_Acc_03_Tree_02.enableThreeStateCheckboxes(true);
            Baselayer_w1_Acc_03_Tree_02.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
            Baselayer_w1_Acc_03_Tree_02.setOnCheckHandler(Layer_Tree_OnCheck_Baselayer_Acc_03_Tree02);
            Baselayer_w1_Acc_03_Tree_02.setOnDblClickHandler(Location_Grid_DblClicked);
            Baselayer_w1_Acc_03_Tree_02.loadXML("tree_xml/baselayer/tree_03_02.xml");


            function Layer_Tree_OnCheck_Baselayer_Acc_03_Tree00(rowId, state) {
                Layer_Tree_Oncheck_Pre('Baselayer_w1_Acc_03_Tree_00', rowId, state);
            }
            function Layer_Tree_OnCheck_Baselayer_Acc_03_Tree02(rowId, state) {
                type_arr = JSON.parse(rowId).Type;
                if (type_arr == "3DModel") {
                    if (map_ind == 0) {
                        swal("切換模式", "請切換至右視窗3D模式檢視!", "warning");
                        //alert("請切換至左視窗3D模式檢視!");
                        Baselayer_w1_Acc_03_Tree_02.setCheck(rowId, false);
                    } else if (model_3Dchange_index == 1) {
                        Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_03_Tree_02", rowId, state);
                    } else if (model_3Dchange_index == 0) {
                        swal("切換模式", "還未在3D模式，請切換至3D模式檢視!!", "warning");
                        //alert("還未在3D模式，請切換至3D模式檢視!");
                        Baselayer_w1_Acc_03_Tree_02.setCheck(rowId, false);
                    }
                } else {
                    Layer_Tree_Oncheck_Pre("Baselayer_w1_Acc_03_Tree_02", rowId, state);
                }
            }
        /********* UAV空拍 ***********/
		
    
    /********* 20220506 ***********/
});
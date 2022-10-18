    
			//1.宣告視窗(Project_w1)
			Project_w1 = dhxWins.createWindow("Project_w1", 720, 100, 350, 600);
			//2.視窗名稱為"計畫成果"
			Project_w1.setText("計畫成果");

			//3.將各單位建立摺疊分頁(Accordion)
		    Project_w1_Acc = Project_w1.attachAccordion({
		        icons_path: "icons/",
		        items: [
					{ id: "a1", text: "水土保持局總局" },
					{ id: "a2", text: "水土保持局臺北分局" },
					{ id: "a3", text: "水土保持局臺中分局" },
					{ id: "a4", text: "水土保持局臺南分局", },
					{ id: "a5", text: "水土保持局臺東分局", },
					{ id: "a6", text: "水土保持局南投分局", },
					{ id: "a7", text: "水土保持局花蓮分局", }
		        ]
		    });
			
				//判斷是否載入過變數
			var Project_w1_Acc_Tree_01_load_ind=0;
			var Project_w1_Acc_Tree_02_load_ind=0;
			var Project_w1_Acc_Tree_03_load_ind=0;
			var Project_w1_Acc_Tree_04_load_ind=0;
			var Project_w1_Acc_Tree_05_load_ind=0;
			var Project_w1_Acc_Tree_06_load_ind=0;
			var Project_w1_Acc_Tree_07_load_ind=0;
			
			
			//4.判斷是否載入過圖資XML
			Project_w1_Acc.attachEvent("onBeforeActive", function(id){
				if(Project_w1_Acc_Tree_02_load_ind==0 && id=="a2" )  {Project_w1_Acc_Tree_02.loadXML("tree_xml/project/tree_01_02.xml"); Project_w1_Acc_Tree_02_load_ind=1;}
				if(Project_w1_Acc_Tree_03_load_ind==0 && id=="a3" )  {Project_w1_Acc_Tree_03.loadXML("tree_xml/project/tree_01_03.xml"); Project_w1_Acc_Tree_03_load_ind=1;}
				if(Project_w1_Acc_Tree_04_load_ind==0 && id=="a4" )  {Project_w1_Acc_Tree_04.loadXML("tree_xml/project/tree_01_04.xml"); Project_w1_Acc_Tree_04_load_ind=1;}
				if(Project_w1_Acc_Tree_05_load_ind==0 && id=="a5" )  {Project_w1_Acc_Tree_05.loadXML("tree_xml/project/tree_01_05.xml"); Project_w1_Acc_Tree_05_load_ind=1;}
				if(Project_w1_Acc_Tree_06_load_ind==0 && id=="a6" )  {Project_w1_Acc_Tree_06.loadXML("tree_xml/project/tree_01_06.xml"); Project_w1_Acc_Tree_06_load_ind=1;}
				if(Project_w1_Acc_Tree_07_load_ind==0 && id=="a7" )  {Project_w1_Acc_Tree_07.loadXML("tree_xml/project/tree_01_07.xml"); Project_w1_Acc_Tree_07_load_ind=1;}
				
				return true;
			});
			
				//水土保持局總局>>a1
			//5.宣告"水土保持局總局"分頁項目右建選單內容
			Project_w1_Acc_Tree_01_Menu = new dhtmlXMenuObject();
			Project_w1_Acc_Tree_01_Menu.setIconsPath("icons/menu/");
			Project_w1_Acc_Tree_01_Menu.renderAsContextMenu();
			Project_w1_Acc_Tree_01_Menu.attachEvent("onClick",Project_w1_Acc_Tree_01_Menu_onButtonClick);
			Project_w1_Acc_Tree_01_Menu.loadStruct("tree_xml/project/tree_01_01_menu.xml");
			
			//6."水土保持局總局"分頁右建選單事件
			function Project_w1_Acc_Tree_01_Menu_onButtonClick(menuitemId,type){
				var id = Project_w1_Acc_Tree_01.contextID;
					id_array=id.split('@');					
				if(menuitemId=="download"){					
					if(Login_ID!="" && V_permission["Data_Download_Project_1_1"]==1){
					download_get(Login_ID,id_array[3]);					
					}else if(Login_ID!="" && V_permission["Data_Download_Project_1_1"]==0){
					swal("使用提醒!", "您無權限下載此類型檔案!", "warning");							
					}else{
					swal("使用提醒!", "本系統之圖資下載需先登入!", "warning");
					}
				}				
			}
			
			//7.宣告"水土保持局總局"分頁項目樣式與事件
			Project_w1_Acc.cells("a1").open();
			Project_w1_Acc_Tree_01 = Project_w1_Acc.cells("a1").attachTree();//增加圖資樹狀目錄			
		    Project_w1_Acc_Tree_01.setImagePath("codebase/imgs/dhxtree_material/");	//設定ICON路徑
		    Project_w1_Acc_Tree_01.enableThreeStateCheckboxes(true);//啟用三態復選框
			Project_w1_Acc_Tree_01.enableCheckBoxes(1);//設定為CheckBox
			Project_w1_Acc_Tree_01.setOnCheckHandler(Layer_Tree_OnCheck_Project_Tree01);//勾選後觸發事件
		    Project_w1_Acc_Tree_01.setOnDblClickHandler(Location_Grid_DblClicked);//雙擊觸發定位事件>>tools_fun.js
		    Project_w1_Acc_Tree_01.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });//分頁選擇開啟事件		 				
		    //Project_w1_Acc_Tree_01.enableContextMenu(Project_w1_Acc_Tree_01_Menu);//附加分頁內容選項右鍵選擇menu
			Project_w1_Acc_Tree_01.loadXML("tree_xml/project/tree_01_01.xml");//載入圖資XML
			
			
				//水土保持局臺北分局>>a2
			Project_w1_Acc_Tree_02_Menu = new dhtmlXMenuObject();
			Project_w1_Acc_Tree_02_Menu.setIconsPath("icons/menu/");
			Project_w1_Acc_Tree_02_Menu.renderAsContextMenu();
			Project_w1_Acc_Tree_02_Menu.attachEvent("onClick",Project_w1_Acc_Tree_02_Menu_onButtonClick);
			Project_w1_Acc_Tree_02_Menu.loadStruct("tree_xml/project/tree_01_02_menu.xml");
			
			function Project_w1_Acc_Tree_02_Menu_onButtonClick(menuitemId,type){
				var id = Project_w1_Acc_Tree_02.contextID;
					id_array=id.split('@');					
				if(menuitemId=="download"){					
					if(Login_ID!="" && V_permission["Data_Download_Project_1_2"]==1){
					download_get(Login_ID,id_array[3]);					
					}else if(Login_ID!="" && V_permission["Data_Download_Project_1_2"]==0){
					swal("使用提醒!", "您無權限下載此類型檔案!", "warning");							
					}else{
					swal("使用提醒!", "本系統之圖資下載需先登入!", "warning");
					}
				}				
			}
			
			Project_w1_Acc_Tree_02 = Project_w1_Acc.cells("a2").attachTree();			
		    Project_w1_Acc_Tree_02.setImagePath("codebase/imgs/dhxtree_material/");	
		    Project_w1_Acc_Tree_02.enableThreeStateCheckboxes(true);
			Project_w1_Acc_Tree_02.enableCheckBoxes(1);
			Project_w1_Acc_Tree_02.setOnCheckHandler(Layer_Tree_OnCheck_Project_Tree02);
		    Project_w1_Acc_Tree_02.setOnDblClickHandler(Location_Grid_DblClicked);
		    Project_w1_Acc_Tree_02.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });		 				
		    //Project_w1_Acc_Tree_02.enableContextMenu(Project_w1_Acc_Tree_02_Menu);

			
				//水土保持局臺中分局>>a3
			Project_w1_Acc_Tree_03_Menu = new dhtmlXMenuObject();
			Project_w1_Acc_Tree_03_Menu.setIconsPath("icons/menu/");
			Project_w1_Acc_Tree_03_Menu.renderAsContextMenu();
			Project_w1_Acc_Tree_03_Menu.attachEvent("onClick",Project_w1_Acc_Tree_03_Menu_onButtonClick);
			Project_w1_Acc_Tree_03_Menu.loadStruct("tree_xml/project/tree_01_03_menu.xml");
			
			function Project_w1_Acc_Tree_03_Menu_onButtonClick(menuitemId,type){
				var id = Project_w1_Acc_Tree_03.contextID;
					id_array=id.split('@');					
				if(menuitemId=="download"){					
					if(Login_ID!="" && V_permission["Data_Download_Project_1_3"]==1){
					download_get(Login_ID,id_array[3]);					
					}else if(Login_ID!="" && V_permission["Data_Download_Project_1_3"]==0){
					swal("使用提醒!", "您無權限下載此類型檔案!", "warning");							
					}else{
					swal("使用提醒!", "本系統之圖資下載需先登入!", "warning");
					}
				}				
			}
				
			Project_w1_Acc_Tree_03 = Project_w1_Acc.cells("a3").attachTree();			
		    Project_w1_Acc_Tree_03.setImagePath("codebase/imgs/dhxtree_material/");	
		    Project_w1_Acc_Tree_03.enableThreeStateCheckboxes(true);
			Project_w1_Acc_Tree_03.enableCheckBoxes(1);
			Project_w1_Acc_Tree_03.setOnCheckHandler(Layer_Tree_OnCheck_Project_Tree03);
		    Project_w1_Acc_Tree_03.setOnDblClickHandler(Location_Grid_DblClicked);
		    Project_w1_Acc_Tree_03.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });		 				
		    //Project_w1_Acc_Tree_03.enableContextMenu(Project_w1_Acc_Tree_03_Menu);
			
				//水土保持局臺南分局>>a4
			Project_w1_Acc_Tree_04_Menu = new dhtmlXMenuObject();
			Project_w1_Acc_Tree_04_Menu.setIconsPath("icons/menu/");
			Project_w1_Acc_Tree_04_Menu.renderAsContextMenu();
			Project_w1_Acc_Tree_04_Menu.attachEvent("onClick",Project_w1_Acc_Tree_04_Menu_onButtonClick);
			Project_w1_Acc_Tree_04_Menu.loadStruct("tree_xml/project/tree_01_04_menu.xml");
			
			function Project_w1_Acc_Tree_04_Menu_onButtonClick(menuitemId,type){
				var id = Project_w1_Acc_Tree_04.contextID;
					id_array=id.split('@');					
				if(menuitemId=="download"){					
					if(Login_ID!="" && V_permission["Data_Download_Project_1_4"]==1){
					download_get(Login_ID,id_array[3]);					
					}else if(Login_ID!="" && V_permission["Data_Download_Project_1_4"]==0){
					swal("使用提醒!", "您無權限下載此類型檔案!", "warning");							
					}else{
					swal("使用提醒!", "本系統之圖資下載需先登入!", "warning");
					}
				}				
			}
				
			Project_w1_Acc_Tree_04 = Project_w1_Acc.cells("a4").attachTree();			
		    Project_w1_Acc_Tree_04.setImagePath("codebase/imgs/dhxtree_material/");	
		    Project_w1_Acc_Tree_04.enableThreeStateCheckboxes(true);
			Project_w1_Acc_Tree_04.enableCheckBoxes(1);
			Project_w1_Acc_Tree_04.setOnCheckHandler(Layer_Tree_OnCheck_Project_Tree04);
		    Project_w1_Acc_Tree_04.setOnDblClickHandler(Location_Grid_DblClicked);
		    Project_w1_Acc_Tree_04.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });		 				
		    //Project_w1_Acc_Tree_04.enableContextMenu(Project_w1_Acc_Tree_04_Menu);
			
				//水土保持局臺東分局>>a5
			Project_w1_Acc_Tree_05_Menu = new dhtmlXMenuObject();
			Project_w1_Acc_Tree_05_Menu.setIconsPath("icons/menu/");
			Project_w1_Acc_Tree_05_Menu.renderAsContextMenu();
			Project_w1_Acc_Tree_05_Menu.attachEvent("onClick",Project_w1_Acc_Tree_05_Menu_onButtonClick);
			Project_w1_Acc_Tree_05_Menu.loadStruct("tree_xml/project/tree_01_05_menu.xml");
			
			function Project_w1_Acc_Tree_05_Menu_onButtonClick(menuitemId,type){
				var id = Project_w1_Acc_Tree_05.contextID;
					id_array=id.split('@');					
				if(menuitemId=="download"){					
					if(Login_ID!="" && V_permission["Data_Download_Project_1_5"]==1){
					download_get(Login_ID,id_array[3]);					
					}else if(Login_ID!="" && V_permission["Data_Download_Project_1_5"]==0){
					swal("使用提醒!", "您無權限下載此類型檔案!", "warning");							
					}else{
					swal("使用提醒!", "本系統之圖資下載需先登入!", "warning");
					}
				}				
			}
				
			Project_w1_Acc_Tree_05 = Project_w1_Acc.cells("a5").attachTree();			
		    Project_w1_Acc_Tree_05.setImagePath("codebase/imgs/dhxtree_material/");	
		    Project_w1_Acc_Tree_05.enableThreeStateCheckboxes(true);
			Project_w1_Acc_Tree_05.enableCheckBoxes(1);
			Project_w1_Acc_Tree_05.setOnCheckHandler(Layer_Tree_OnCheck_Project_Tree05);
		    Project_w1_Acc_Tree_05.setOnDblClickHandler(Location_Grid_DblClicked);
		    Project_w1_Acc_Tree_05.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });		 				
		    //Project_w1_Acc_Tree_05.enableContextMenu(Project_w1_Acc_Tree_05_Menu);
		   
				//水土保持局南投分局>>a6
			Project_w1_Acc_Tree_06_Menu = new dhtmlXMenuObject();
			Project_w1_Acc_Tree_06_Menu.setIconsPath("icons/menu/");
			Project_w1_Acc_Tree_06_Menu.renderAsContextMenu();
			Project_w1_Acc_Tree_06_Menu.attachEvent("onClick",Project_w1_Acc_Tree_06_Menu_onButtonClick);
			Project_w1_Acc_Tree_06_Menu.loadStruct("tree_xml/project/tree_01_06_menu.xml");
			
			function Project_w1_Acc_Tree_06_Menu_onButtonClick(menuitemId,type){
				var id = Project_w1_Acc_Tree_06.contextID;
					id_array=id.split('@');					
				if(menuitemId=="download"){					
					if(Login_ID!="" && V_permission["Data_Download_Project_1_6"]==1){
					download_get(Login_ID,id_array[3]);					
					}else if(Login_ID!="" && V_permission["Data_Download_Project_1_6"]==0){
					swal("使用提醒!", "您無權限下載此類型檔案!", "warning");							
					}else{
					swal("使用提醒!", "本系統之圖資下載需先登入!", "warning");
					}
				}				
			}
				
			Project_w1_Acc_Tree_06 = Project_w1_Acc.cells("a6").attachTree();			
		    Project_w1_Acc_Tree_06.setImagePath("codebase/imgs/dhxtree_material/");	
		    Project_w1_Acc_Tree_06.enableThreeStateCheckboxes(true);
			Project_w1_Acc_Tree_06.enableCheckBoxes(1);
			Project_w1_Acc_Tree_06.setOnCheckHandler(Layer_Tree_OnCheck_Project_Tree06);
		    Project_w1_Acc_Tree_06.setOnDblClickHandler(Location_Grid_DblClicked);
		    Project_w1_Acc_Tree_06.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });		 				
		    //Project_w1_Acc_Tree_06.enableContextMenu(Project_w1_Acc_Tree_06_Menu);
			
				//水土保持局花蓮分局>>a7
			Project_w1_Acc_Tree_07_Menu = new dhtmlXMenuObject();
			Project_w1_Acc_Tree_07_Menu.setIconsPath("icons/menu/");
			Project_w1_Acc_Tree_07_Menu.renderAsContextMenu();
			Project_w1_Acc_Tree_07_Menu.attachEvent("onClick",Project_w1_Acc_Tree_07_Menu_onButtonClick);
			Project_w1_Acc_Tree_07_Menu.loadStruct("tree_xml/project/tree_01_07_menu.xml");
			
			function Project_w1_Acc_Tree_07_Menu_onButtonClick(menuitemId,type){
				var id = Project_w1_Acc_Tree_07.contextID;
					id_array=id.split('@');					
				if(menuitemId=="download"){					
					if(Login_ID!="" && V_permission["Data_Download_Project_1_7"]==1){
					download_get(Login_ID,id_array[3]);					
					}else if(Login_ID!="" && V_permission["Data_Download_Project_1_7"]==0){
					swal("使用提醒!", "您無權限下載此類型檔案!", "warning");							
					}else{
					swal("使用提醒!", "本系統之圖資下載需先登入!", "warning");
					}
				}				
			}
			
			Project_w1_Acc_Tree_07 = Project_w1_Acc.cells("a7").attachTree();			
		    Project_w1_Acc_Tree_07.setImagePath("codebase/imgs/dhxtree_material/");	
		    Project_w1_Acc_Tree_07.enableThreeStateCheckboxes(true);
			Project_w1_Acc_Tree_07.enableCheckBoxes(1);
			Project_w1_Acc_Tree_07.setOnCheckHandler(Layer_Tree_OnCheck_Project_Tree07);
		    Project_w1_Acc_Tree_07.setOnDblClickHandler(Location_Grid_DblClicked);
		    Project_w1_Acc_Tree_07.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });		 				
		    //Project_w1_Acc_Tree_07.enableContextMenu(Project_w1_Acc_Tree_07_Menu);
		   
			//8."計畫成果"視窗關閉觸發事件
			Project_w1.attachEvent("onClose", function(win){
					Project_w1.hide();
					Project_w1.setModal(false);
					return false;
				});
			Project_w1.hide();

			//9.分頁圖資項目勾選_函式
			function Layer_Tree_OnCheck_Project_Tree01(rowId, state){
	
			Layer_Tree_Oncheck_Pre('Project_w1_Acc_Tree_01',rowId, state);//傳遞勾選項目>>load_exdata.js
			}
			
			function Layer_Tree_OnCheck_Project_Tree02(rowId, state){
	
			Layer_Tree_Oncheck_Pre('Project_w1_Acc_Tree_02',rowId, state);
			}
			
			function Layer_Tree_OnCheck_Project_Tree03(rowId, state){
	
			Layer_Tree_Oncheck_Pre('Project_w1_Acc_Tree_03',rowId, state);
			}
			
			function Layer_Tree_OnCheck_Project_Tree04(rowId, state){
	
			Layer_Tree_Oncheck_Pre('Project_w1_Acc_Tree_04',rowId, state);
			}
			
			function Layer_Tree_OnCheck_Project_Tree05(rowId, state){
	
			Layer_Tree_Oncheck_Pre('Project_w1_Acc_Tree_05',rowId, state);
			}
			
			function Layer_Tree_OnCheck_Project_Tree06(rowId, state){
	
			Layer_Tree_Oncheck_Pre('Project_w1_Acc_Tree_06',rowId, state);
			}
			
			function Layer_Tree_OnCheck_Project_Tree07(rowId, state){
	
			Layer_Tree_Oncheck_Pre('Project_w1_Acc_Tree_07',rowId, state);
			}
			
			
			
			
			
			
			
			
			
			
			
			

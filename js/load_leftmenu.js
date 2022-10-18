var outside_isopen = "";


function leftmenu_onclick(point_index) {
	//alert(point_index);
	Clear_All_Layer();

	if (point_index == "Landslide_P1") {
		outside_layer_vector = [];
		Locate(24.9782, 121.6971, 16);
		outside_layer_id = "11-00001,0J-00H9D,0H-0002G,0M-0001U";//11-00001(conrna) 0J-00H9D(2017SPOT) 
		outside_layer_chicked = ["0H-0002G"];
		outside_layer_vector[0] = [`{
			"FileName":"大規模崩塌潛勢區(34處優先辦理區)",
			"PosInfo":"23.549765;121.113281;696480;8;50",
			"Type":"Kml",
			"Url":"https://geodac.ncku.edu.tw/SWCB_LLGIS/34_v3.kml",
			"ID":"baselayer_tree_00_04_lg_4"
		}`, "1", "大規模崩塌潛勢區(34處優先辦理區)"
		];
	}
	if (point_index == "Landslide_P2") {
		outside_layer_vector = [];
		Locate(24.6777, 121.2111, 17);
		outside_layer_id = "11-00001,0J-00H9D,0H-00026,0J-004FW,03-000DG";//11-0001
		outside_layer_chicked = ["03-000DG"];
		outside_layer_vector[0] = [`{
			"FileName":"大規模崩塌潛勢區(34處優先辦理區)",
			"PosInfo":"23.549765;121.113281;696480;8;50",
			"Type":"Kml",
			"Url":"https://geodac.ncku.edu.tw/SWCB_LLGIS/34_v3.kml",
			"ID":"baselayer_tree_00_04_lg_4"
		}`, "1", "大規模崩塌潛勢區(34處優先辦理區)"
		];
	}
	if (point_index == "Landslide_P3") {
		outside_layer_vector = [];
		Locate(23.5392, 120.6781, 16);
		outside_layer_id = "0J-00H9D,0H-0003V,0M-002AY,03-0001X";//11-0001
		outside_layer_chicked = ["03-0001X"];
		outside_layer_vector[0] = [`{
			"FileName":"大規模崩塌潛勢區(34處優先辦理區)",
			"PosInfo":"23.549765;121.113281;696480;8;50",
			"Type":"Kml",
			"Url":"https://geodac.ncku.edu.tw/SWCB_LLGIS/34_v3.kml",
			"ID":"baselayer_tree_00_04_lg_4"
		}`, "1", "大規模崩塌潛勢區(34處優先辦理區)"
		];
	}
	if (point_index == "Landslide_P4") {
		outside_layer_vector = [];
		Locate(22.9072, 120.6855, 15);
		outside_layer_id = "0J-00H9D,0H-00047,0M-002AG,0Y-005O4,0V-005YR";//11-0001
		outside_layer_chicked = ["0Y-005O4", "0V-005YR"];
		outside_layer_vector[0] = [`{
			"FileName":"大規模崩塌潛勢區(34處優先辦理區)",
			"PosInfo":"23.549765;121.113281;696480;8;50",
			"Type":"Kml",
			"Url":"https://geodac.ncku.edu.tw/SWCB_LLGIS/34_v3.kml",
			"ID":"baselayer_tree_00_04_lg_4"
		}`, "1", "大規模崩塌潛勢區(34處優先辦理區)"
		];
	}
	if (point_index == "Landslide_P5") {
		outside_layer_vector = [];
		Locate(22.8941, 121.056, 15);
		outside_layer_id = "0J-00H9D,0H-0003N,0M-002BD,03-000CE,0V-016Y7";//11-0001
		outside_layer_chicked = ["03-000CE", "0V-016Y7"];
		outside_layer_vector[0] = [`{
			"FileName":"大規模崩塌潛勢區(34處優先辦理區)",
			"PosInfo":"23.549765;121.113281;696480;8;50",
			"Type":"Kml",
			"Url":"https://geodac.ncku.edu.tw/SWCB_LLGIS/34_v3.kml",
			"ID":"baselayer_tree_00_04_lg_4"
		}`, "1", "大規模崩塌潛勢區(34處優先辦理區)"
		];
	}
	if (point_index == "Landslide_P6") {
		outside_layer_vector = [];
		Locate(24.658306, 121.392438, 19);
		
		outside_layer_id = "03-000NX,03-000O3,03-000O5,03-000O6,03-000O7,03-000PM,03-000SK,03-000ZU,03-000ZV,03-000ZX,03-0018E,03-001BO,03-001BZ,03-001C0,03-001C1,03-001C2,03-001C3,03-001C8,03-001CA,03-001C7,03-001CB,03-001C9,03-001CC,03-001CZ,03-001CD,03-001D0,03-001CE,03-001D1,03-001CG,03-001D2,03-001CH,03-001CI,03-001D3,03-001DA,03-001D4,03-001DB,03-001D5,03-001DC,03-001DD,03-001DG,03-001DH,03-001DR,03-001DI,03-001DS,03-001DV,03-001EE,03-001ED,03-001EP,03-001F0,03-001F3,03-001JO,03-001JQ,17-003BR,19-002WQ";//11-0001
		outside_layer_chicked = ["03-001JQ"];
		/*outside_layer_vector[0] = [`{
			"FileName":"大規模崩塌潛勢區(34處優先辦理區)",
			"PosInfo":"23.549765;121.113281;696480;8;50",
			"Type":"Kml",
			"Url":"https://geodac.ncku.edu.tw/SWCB_LLGIS/34_v3.kml",
			"ID":"baselayer_tree_00_04_lg_4"
		}`, "1", "大規模崩塌潛勢區(34處優先辦理區)"
		];*/
	}
	
	if (point_index == "Landslide_P7") {
		outside_layer_vector = [];
		Locate( 23.465480, 121.328523, 17);
		//alert(point_index);
		outside_layer_id = "0J-00538,0M-001YI,0J-000OI,0M-0029X,0J-0047K,0J-0048T,0J-002OK,0J-0045Y,0J-004GV,0J-00G4Q,0J-00J4O,0J-00JPL,0H-000A5,0J-00JSV,0J-00JT9,17-002CF,19-002PW";//11-0001
		outside_layer_chicked = ["0H-000A5"];
		
	}
	if (point_index == "SWC_P1") {
		Locate(24.257431, 120.589778, 15);
		outside_layer_vector = [];
		outside_layer_id = "0J-00HEY,0M-002FK,0M-002FG,0M-002FA,11-00002,0V-0059V,13-00FY1,13-00FY0,1A-00002";//11-0001
		outside_layer_chicked = ["0V-0059V", "13-00FY1", "13-00FY0", "1A-00002"];
		outside_layer_vector[0] = [`{
			"FileName":"109年度山坡地範圍(山保條例、含六都)_20200520",
			"PosInfo":"23.549765;121.113281;696480;8",
			"Type":"MVTTile",
			"Url":"https://compute.geodac.tw/vectortiles/shp/HBNDS0520C/",
			"ID":"baselayer_tree_00_04_lg_17"
		}`, "0", "108年度山坡地範圍(山保條例、含六都))"
		];
	}
	outslide_layer_id();//呼叫外部圖資
	setTimeout(function () {
		var w = $("#mwt_slider_content").width();
		if ($("#mwt_mwt_slider_scroll").css('right') == ("-" + w + 'px')) {
			$("#mwt_mwt_slider_scroll").animate({ right: '0px' }, 600, 'swing');
			document.getElementById("mwt_fb_tab").innerHTML = ' <span>►</span><span>圖</span><span>層</span><span>管</span><span>理</span>';
		}



		open_R_menu_alert();

	}, 2000);
	setTimeout(function () {

		outside_isopen = true;
		Layer_Type_Slider("dot_button");
		Layer_Type_Slider("vector_button");
		Layer_Type_Slider("image_button");
		outside_isopen = "";
	}, 3000);
	//setTimeout(function(){document.getElementById("mwt_fb_tab").click(); }, 2000);
}
var L_menu_content_01 = '<table>' +
	'<tbody>' +
	'<tr>' +
	'<td style="text-align: center;"><strong><img src="icons/L_menu/Landslide_P1.png" id="Landslide_P1"; onclick="leftmenu_onclick(this.id);" alt="石碇(大崙山)" width="45" /></strong></td>' +
	'<td style="text-align: center;"><strong><img src="icons/L_menu/Landslide_P2.png" id="Landslide_P2"; onclick="leftmenu_onclick(this.id);" alt="新竹(梅花)"   width="45" /></strong></td>' +
	'<td style="text-align: center;"><strong><img src="icons/L_menu/Landslide_P3.png" id="Landslide_P3"; onclick="leftmenu_onclick(this.id);" alt="嘉義(幼葉林)" width="45" /></strong></td>' +
	'<td style="text-align: center;"><strong><img src="icons/L_menu/Landslide_P4.png" id="Landslide_P4"; onclick="leftmenu_onclick(this.id);" alt="高雄(萬山)"   width="45" /></strong></td>' +
	'<td style="text-align: center;"><strong><img src="icons/L_menu/Landslide_P5.png" id="Landslide_P5"; onclick="leftmenu_onclick(this.id);" alt="臺東(紅葉村)" width="45" /></strong></td>' +
	'<td style="text-align: center;"><strong><img src="icons/L_menu/Landslide_P6.png" id="Landslide_P6"; onclick="leftmenu_onclick(this.id);" alt="桃園(光華)" width="45" /></strong></td>' +
	'<td style="text-align: center;"><strong><img src="icons/L_menu/Landslide_P7.png" id="Landslide_P7"; onclick="leftmenu_onclick(this.id);" alt="花蓮(舞鶴)" width="45" /></strong></td>' +
	'</tr>' +
	'<tr>' +
	'<td><strong>&nbsp;<font size="3">石碇(大崙山)</font>&nbsp;</strong></td>' +
	'<td><strong>&nbsp;新竹(梅花)&nbsp;</strong></td>' +
	'<td><strong>&nbsp;嘉義(幼葉林)&nbsp;</strong></td>' +
	'<td><strong>&nbsp;高雄(萬山)&nbsp;</strong></td>' +
	'<td><strong>&nbsp;臺東(紅葉村)</strong>&nbsp;</td>' +
	'<td><strong>&nbsp;桃園(光華)</strong>&nbsp;</td>' +
	'<td><strong>&nbsp;花蓮(舞鶴)</strong>&nbsp;</td>' +
	'</tr>' +
	'</tbody>' +
	'</table>';
var L_menu_content_02 = '<table align="center">' +
	'<tbody >' +
	'<tr>' +
	'<td style="text-align: center;"><br><strong><img src="icons/L_menu/SWC_P1.png" id="SWC_P1"; onclick="leftmenu_onclick(this.id);" alt="台中(鹿寮)第一座水土保持示範區" width="100" /></strong></td>' +
	'<td style="text-align: center;"><strong>&nbsp;台中(鹿寮)第一座<br>水土保持示範區&nbsp;</strong></td>' +
	'</tr>' +
	'</tbody>' +
	'</table>';
function load_leftmenu(MenuIndex) {

	if (MenuIndex == null) { MenuIndex = "TM01" };
	if (MenuIndex == "TM01") {
		//document.getElementById("L_mwt_slider_content_in").innerHTML = L_menu_content_01;
	}
	if (MenuIndex == "TM02") {
		//document.getElementById("L_mwt_slider_content_in").innerHTML = L_menu_content_02;
	}
};

function close_L_menu_alert() {
	$("#L_mean_alert_content").hide();
}
function close_R_menu_alert() {
	$("#R_mean_alert_content").hide();
}
function close_RT_menu_alert() {
	$("#RT_mean_alert_content").hide();
}

function open_L_menu_alert() {
	$("#L_mean_alert_content").show();
}
function open_R_menu_alert() {
	$("#R_mean_alert_content").show();
}
function open_RT_menu_alert() {
	$("#RT_mean_alert_content").show();
}
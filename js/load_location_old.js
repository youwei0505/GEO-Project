//定位主視窗宣告
            Location_w1 = dhxWins.createWindow("Location_w1", 400, 150, 300, 500);
			Location_w1.setText("定位工具");	
			Location_Acc = Location_w1.attachAccordion();
			Location_Acc.addItem("a1", "地址/地點定位", true);
			//Location_Acc.addItem("a2", "行政區定位");
			Location_Acc.addItem("a3", "土石流潛勢溪流定位");
			Location_Acc.addItem("a4", "坐標系統定位");
			Location_Acc.addItem("a5", "地號定位查詢");
			Location_Acc.addItem("a7", "地址/地點定位(國土測繪中心)");
			/*Location_Acc.cells("a1").attachHTMLString(
			'<form name="doublecombo" action="javascript:Address_Location();void(0);">'+
			'<input type="text" size="25" id="address" value="台北市大安區信義路3段" />'+
			'<input type="submit" style="width:65px;background-color:#B5FFFF;" value="搜尋" />'+
			'</form>'
			);*/
			
			//地址/地點定位
			Location_Acc_form1Data=[
			
			{type: "input", name:"Location_Acc1_Form",label: "查詢地址/地點 ", inputWidth: 200,value:""},
			{type: "button", name: "okey", value: "定位查詢"},						
			{type: "label", label: "查詢範例"},
			{type: "label", label: "地址：南投縣南投市光華路6號"},
			{type: "label", label: "景點：台北101大樓"},
			{type: "label", label: "經緯度坐標：23.11,121.25"},
			{type: "button", name: "clear_mark", value: "清除定位標記"},
			]
	
			Location_Acc1_Form = Location_Acc.cells("a1").attachForm();
			Location_Acc1_Form.loadStruct(Location_Acc_form1Data);
			
			Location_Acc1_Form.attachEvent("onEnter",function(inp,ev,id,value){
				
					var t = Location_Acc1_Form.getFormData();
					var p = "";
					for (var a in t) p += a+"@"+String(t[a])+"\n";
					Location_Acc1_Form_Reslut=p.split("@");
					//alert(Location_Acc1_Form_Reslut[1]);
					Address_Location(Location_Acc1_Form_Reslut[1]);
						 			
				}
			);
			
			Location_Acc1_Form.attachEvent("onButtonClick", function(name){
				fun_access_log("Func_Use_Location_1_1");
				if(name=="okey"){
				var t = Location_Acc1_Form.getFormData();
				var p = "";
			for (var a in t) p += a+"@"+String(t[a])+"\n";
			    Location_Acc1_Form_Reslut=p.split("@");
				//alert(Location_Acc1_Form_Reslut[1]);
				Address_Location(Location_Acc1_Form_Reslut[1]);
				}else if(name=="clear_mark"){
					maps[0].removeLayer(Location_Icon_vectorLayer);
					maps[1].removeLayer(Location_Icon_vectorLayer);
				}
				});
			//潛勢溪流定位
			Location_Acc.cells("a3").attachHTMLString(
					'<form name="theForm">'+
                          '<table border=0 style="background-color:greenyellow">'+                           
                              '<tr><th>縣市</th><th>鄉鎮</th><th>編號 </th></tr>'+
                              '<tr>'+
                                 '<td align=center>'+
                                      '<select name="column1" onchange="onChangeColumn1();">'+
                                          //'<script>for (i = 0; i < dataTree.length; i++) document.writeln("<option value=\"" + dataTree[i].name + "\">" + dataTree[i].name);</script>'+
										   '<option value="Yilan_County">宜蘭縣</option>'+
											'<option value="Keelung_City">基隆市</option>'+
											'<option value="Taipei_City">臺北市</option>'+
											'<option value="Xinbai_City">新北市</option>'+
											'<option value="Taoyuan_County">桃園市</option>'+
											'<option value="Hsinchu_County">新竹縣</option>'+
											'<option value="Miaoli_County">苗栗縣</option>'+
											'<option value="Taichung_City">臺中市</option>'+
											'<option value="Changhua_County">彰化縣</option>'+
											'<option value="Nantou_County">南投縣</option>'+
											'<option value="Yunlin_County">雲林縣</option>'+
											'<option value="Chiayi_County">嘉義縣</option>'+
											'<option value="Tainan_City">臺南市</option>'+
											'<option value="Kaohsiung_City">高雄市</option>'+
											'<option value="Pingtung_County">屏東縣</option>'+
											'<option value="Taitung_County">臺東縣</option>'+
											'<option value="Hualien_County">花蓮縣</option>'+
                                      '</select>'+
                                  '</td>'+
                                  '<td align=center><select name="column2" onchange="onChangeColumn2();"><option>選擇鄉鎮</option></select></td>'+
                                  '<td align=center><select name="column3" onchange="onChangeColumn3();"><option>選擇編號</option></select></td>'+
                              '</tr>'+
                          '</table>'+
                      '</form>'			
			);
			
			
			//坐標定位
			Location_Acc_form4Data=[
			{type: "label", label: "WGS84坐標定位"},
			{type: "input", name:"Location_Acc4_Form_WGS84Y",label: "Y坐標 ", inputWidth: 200,value:"23.955921"},
			{type: "input", name:"Location_Acc4_Form_WGS84X",label: "X坐標 ", inputWidth: 200,value:"120.68733"},			
			{type: "button", name: "WGS84_okey", value: "定位查詢"},
			
			{type: "label", label: "TWD97坐標定位"},
			{type: "input", name:"Location_Acc4_Form_TWD97X",label: "X坐標 ", inputWidth: 200,value:"252049.744283697"},
			{type: "input", name:"Location_Acc4_Form_TWD97Y",label: "Y坐標 ", inputWidth: 200,value:"2544835.501399"},
			{type: "button", name: "TWD97_okey", value: "定位查詢"},
			
			{type: "label", label: "TWD67坐標定位"},
			{type: "input", name:"Location_Acc4_Form_TWD67X",label: "X坐標 ", inputWidth: 200,value:"251221.584900369"},
			{type: "input", name:"Location_Acc4_Form_TWD67Y",label: "Y坐標 ", inputWidth: 200,value:"2545042.95873966"},
			{type: "button", name: "TWD67_okey", value: "定位查詢"},
			]
			Location_Acc4_Form = Location_Acc.cells("a4").attachForm();
			Location_Acc4_Form.loadStruct(Location_Acc_form4Data);
			
			Location_Acc4_Form.attachEvent("onButtonClick", function(name){
				fun_access_log("Func_Use_Location_1_4");
				var t = Location_Acc4_Form.getFormData();
				var p = "";
				for (var a in t) p += a+"@"+String(t[a])+"@";
				Location_Acc4_Form_Reslut=p.split("@");
				if(name=="WGS84_okey"){			
			    search_Icon_draw(Location_Acc4_Form_Reslut[1],Location_Acc4_Form_Reslut[3]);
				}
				if(name=="TWD97_okey"){			
			    twd97locexe(Location_Acc4_Form_Reslut[5],Location_Acc4_Form_Reslut[7]);
				}
				if(name=="TWD67_okey"){			
			    twd67locexe(Location_Acc4_Form_Reslut[9],Location_Acc4_Form_Reslut[11]);
				}
				});
			Location_w1.attachEvent("onClose", function(win){
					Location_w1.hide();
					Location_w1.setModal(false);
					return false;
				});	
			//地號定位查詢
        	Location_Acc.cells("a5").attachHTMLString(
			"<div class='content'>"+ 
			"<select id='county'></select>"+  
			"<select id='town'> </select> "+ 
			"<br> "+ 
			"<br>"+  
			"<select id='sect'> </select> "+ 
			"<br>"+ 
			"<br>"+ 
			"地號:   <input id='cadas'> </input>"+ 
			"<br>查詢範例：<br>(1)只輸入地號母號 EX：12"+ 
			"<br>(2)地號母號+地號子號 EX:169-2<br>"+ 
			"<button id='load_pos_by_cadas'> 定位 </button>"+ 
			"<button id='clear_load_pos'> clear </button>"+ 
			"</div>"
			)	
				
            //地址/地點定位(國土測繪)
			Location_Acc.cells("a7").attachHTMLString(
                    "\
                        <br>\
                        <label>模糊搜尋: </label> \
                        <div class='ui-widget'>\
                            <label for='locate_input'>輸入搜尋地址: </label> \
                            <input id='locate_input'> \
                        </div>\
                        <button id='locate_input_load_pos'> 搜尋 </button>\
                        <button id='locate_input_clear'> clear </button>\
                        <br>\
                        <br>\
                        <label>門牌搜尋: </label> \
                        <br>\
                        <select id='locate_county'></select>   \
                        <select id='locate_town'> </select> \
                        <select id='locate_road'> </select> \
                        <br>\
                        <select id='locate_lane'> </select> \
                        <select id='locate_alley'> </select> \
                        <br>\
                        <input id='locate_number'> </input>號\
                        <br>\
                        <button id='locate_load_pos'> 搜尋 </button>\
                        <button id='locate_clear'> clear </button>\
                    "		
			);
			
			Location_w1.hide();
			$.ajax({
                url: "https://api.nlsc.gov.tw/other/ListCounty",
            }).done(function(data) {
                $("#locate_county option").remove();
                $("#locate_county").append($("<option></option>").attr("value", "default").text("縣市"));
                $("#locate_town option").remove();
                $("#locate_town").append($("<option></option>").attr("value", "default").text("鄉鎮市區"));
                $("#locate_road option").remove();
                $("#locate_road").append($("<option></option>").attr("value", "default").text("路名"));
                $("#locate_lane option").remove();
                $("#locate_lane").append($("<option></option>").attr("value", "default").text("巷"));
                $("#locate_alley option").remove();
                $("#locate_alley").append($("<option></option>").attr("value", "default").text("弄"));
                $(data).find("countyItem").each(function(i) {
                    var countycode = $(this).children("countycode").text();
                    var countyname = $(this).children("countyname").text();
                    $("#locate_county").append($("<option></option>").attr("value", countycode).text(countyname));
                })
                
                $("#locate_county").change(function() {
                    var countycode = $("#locate_county").find(":selected").val();
                            
                    if (countycode != "default") {
                        $("#locate_town option").remove();
                        $("#locate_town").append($("<option></option>").attr("value", "default").text("鄉鎮市區"));
                        $("#locate_road option").remove();
                        $("#locate_road").append($("<option></option>").attr("value", "default").text("路名"));
                        $("#locate_lane option").remove();
                        $("#locate_lane").append($("<option></option>").attr("value", "default").text("巷"));
                        $("#locate_alley option").remove();
                        $("#locate_alley").append($("<option></option>").attr("value", "default").text("弄"));
                        $.ajax({
                            url: "https://api.nlsc.gov.tw/other/ListTown/" + countycode,
                        }).done(function(data) {
                            $(data).find("townItem").each(function(i) {
                                var towncode = $(this).children("towncode").text();
                                var townname = $(this).children("townname").text();
                                $("#locate_town").append($("<option></option>").attr("value", towncode).text(townname));
                            })
                        });
                    }
                    else {
                        $("#locate_town option").remove();
                        $("#locate_town").append($("<option></option>").attr("value", "default").text("鄉鎮市區(地政)"));
                        $("#locate_road option").remove();
                        $("#locate_road").append($("<option></option>").attr("value", "default").text("路名"));
                        $("#locate_lane option").remove();
                        $("#locate_lane").append($("<option></option>").attr("value", "default").text("巷"));
                        $("#locate_alley option").remove();
                        $("#locate_alley").append($("<option></option>").attr("value", "default").text("弄"));
                    }
                });
                
                $("#locate_town").change(function() {
                    var countycode = $("#locate_county").find(":selected").val();
                    var towncode = $("#locate_town").find(":selected").val();
                    if (towncode != "default") {
                        $("#locate_road option").remove();
                        $("#locate_road").append($("<option></option>").attr("value", "default").text("路名"));
                        $("#locate_lane option").remove();
                        $("#locate_lane").append($("<option></option>").attr("value", "default").text("巷"));
                        $("#locate_alley option").remove();
                        $("#locate_alley").append($("<option></option>").attr("value", "default").text("弄"));
                        
                        $.ajax({
                            type: 	"GET",
                            url:	"php/SendAPIReq.php",
                            data: {
                                u : "https://api.nlsc.gov.tw/idc/ListRoad/" + countycode + "/" + towncode + ""
                            }
                        }).done(function(data) {
                            $(data).find("road").each(function(i) {
                                var roadname = $(this).children("name").text();
                                $("#locate_road").append($("<option></option>").attr("value", roadname).text(roadname));
                            })
                        });
                    }
                    else {
                        $("#locate_road option").remove();
                        $("#locate_road").append($("<option></option>").attr("value", "default").text("路名"));
                        $("#locate_lane option").remove();
                        $("#locate_lane").append($("<option></option>").attr("value", "default").text("巷"));
                        $("#locate_alley option").remove();
                        $("#locate_alley").append($("<option></option>").attr("value", "default").text("弄"));
                    }
                });		
                
                $("#locate_road").change(function() {
                    var countycode = $("#locate_county").find(":selected").val();
                    var towncode = $("#locate_town").find(":selected").val();
                    var roadcode = $("#locate_road").find(":selected").val();
                    if (roadcode != "default") {
                        $("#locate_lane option").remove();
                        $("#locate_lane").append($("<option></option>").attr("value", "default").text("巷"));
                        $("#locate_alley option").remove();
                        $("#locate_alley").append($("<option></option>").attr("value", "default").text("弄"));
                        
                        $.ajax({
                            type: 	"GET",
                            url:	"php/SendAPIReq.php",
                            data: {
                                u : encodeURI("https://api.nlsc.gov.tw/idc/ListRoadLaneAlley/" + countycode + "/" + towncode + "/" + roadcode + "")
                            }
                        }).done(function(data) {
                            $(data).find("laneAlleyItem").each(function(i) {
                                var lanenum = $(this).children("lane").text();
                                var alleysnums = $(this).children("alleys");
                                $("#locate_lane").append($("<option></option>").attr("value", lanenum).text(lanenum));
                            })
                        });
                    }
                    else {
                        $("#locate_lane option").remove();
                        $("#locate_lane").append($("<option></option>").attr("value", "default").text("巷"));
                        $("#locate_alley option").remove();
                        $("#locate_alley").append($("<option></option>").attr("value", "default").text("弄"));
                    }
                });	
                
                $("#locate_lane").change(function() {
                    var countycode = $("#locate_county").find(":selected").val();
                    var towncode = $("#locate_town").find(":selected").val();
                    var roadcode = $("#locate_road").find(":selected").val();
                    var lanecode = $("#locate_lane").find(":selected").val();
                    if (roadcode != "default") {
                        $("#locate_alley option").remove();
                        $("#locate_alley").append($("<option></option>").attr("value", "default").text("弄"));
                        
                        $.ajax({
                            type: 	"GET",
                            url:	"php/SendAPIReq.php",
                            data: {
                                u : encodeURI("https://api.nlsc.gov.tw/idc/ListRoadLaneAlley/" + countycode + "/" + towncode + "/" + roadcode + "")
                            }
                        }).done(function(data) {
							fun_access_log("Func_Use_Location_1_7");
                            $(data).find("laneAlleyItem").each(function(i) {
                                var lanenum = $(this).children("lane").text();
                                var alleysnums = $(this).children("alleys");
                                if (lanenum == lanecode){
                                    for (i = 0; i < alleysnums.length; i++){
                                        $("#locate_alley").append($("<option></option>").attr("value", alleysnums[i].innerText).text(alleysnums[i].innerText));
                                    }
                                }
                            })
                        });
                    }
                    else {
                        $("#locate_alley option").remove();
                        $("#locate_alley").append($("<option></option>").attr("value", "default").text("弄"));
                    }
                });	
            });
            /* 全形轉半形
            function fullChar2halfChar(str)
            {
                var result = '';
                for (i=0 ; i<str.length;i++)
                {
                    code = str.charCodeAt(i);//獲取當前字元的unicode編碼
                    if (code >= 65281 && code <= 65373)//在這個unicode編碼範圍中的是所有的英文字母已經各種字元
                    {
                        result  += String.fromCharCode(str.charCodeAt(i) - 65248);//把全形字元的unicode編碼轉換為對應半形字元的unicode碼
                    }else if (code == 12288)//空格
                    {
                        result  += String.fromCharCode(str.charCodeAt(i) - 12288 + 32);
                    }else
                    {
                        result  += str.charAt(i);
                    }
                }
                return result;
            }*/
            $(document).ready(function () {
                locate_view_win = dhxWins.createWindow("locate_view_win", 800, 100, 200, 300);
                /*** 20190529 fixed ***/
                locate_view_win.setText("節點定位");
                /*** 20190529 fixed ***/
                locate_view_win.centerOnScreen();
                locate_view_win.denyResize();
                locate_view_win.showInnerScroll();
                locate_view_html = "<div class='ui celled list' id = 'locate_view_list'></div>"
                locate_view_win.attachHTMLString(locate_view_html);
                locate_view_win.hide();
                
                locate_view_win.attachEvent("onClose", function(win){
                    locate_view_win.hide();
                });
                    
            })
            $("#locate_load_pos").click(function() {
                
                var countyname = $("#locate_county").find(":selected").text();
                var countycode = $("#locate_county").find(":selected").val();
                var townname = $("#locate_town").find(":selected").text();
                var roadname = $("#locate_road").find(":selected").text();
                var lanename = $("#locate_lane").find(":selected").text();
                var alleyname = $("#locate_alley").find(":selected").text();
                var locate_number = $("#locate_number").val();
                if (alleyname != "弄") {
                    var locate_full_search_name = countyname + townname + roadname + lanename + '巷' + alleyname + '弄' + locate_number
                } else {
                    var locate_full_search_name = countyname + townname + roadname + lanename + '巷' + locate_number
                }
                $.ajax({
                    type: 	"GET",
                    url:	"php/SendAPIReq.php",
                    data: {
                        u : encodeURI("https://api.nlsc.gov.tw/idc/TextQueryAddress/" + locate_full_search_name +  "/5/" + countycode + "")
                    }
                }).done(function(data) {
                    fun_access_log("Func_Use_Location_1_7");
                    var locate_inner_html = ""
                    
                    $(data).find("addressItem").each(function(i) {
                        var content = $(this).children("content").text();
                        var loca = $(this).children("location").text();
                        var coors = loca.split(',')
                        locate_inner_html = locate_inner_html + '\
                        <div class="item" onclick = set_locate_pos(' + coors[1] + ',' + coors[0] + ') id="' + coors[0].toString().replace('.', '') + coors[1].toString().replace('.', '') + '"> \
                            <div class="content"> \
                                <div class="header">' + content+ '</div> \
                            </div> \
                        </div>'
                    })
                    $('#locate_view_list').html(locate_inner_html)
                    locate_view_win.show();
                });
                
            })
            $("#locate_input_load_pos").click(function() {
                
                var searchname = $("#locate_input").val();
                $.ajax({
                    type: 	"GET",
                    url:	"php/SendAPIReq.php",
                    data: {
                        u : encodeURI("https://api.nlsc.gov.tw/idc/TextQueryMap/" + searchname)
                    }
                }).done(function(data) {
					fun_access_log("Func_Use_Location_1_7");
                    var locate_inner_html = ""
                    $(data).find("ITEM").each(function(i) {
                        var content = $(this).children("CONTENT").text()
                        var loca = $(this).children("LOCATION").text();
                        var coors = loca.split(',')
                        locate_inner_html = locate_inner_html + '\
                        <div class="item" onclick = set_locate_pos(' + coors[1] + ',' + coors[0] + ') id="' + coors[0].toString().replace('.', '') + coors[1].toString().replace('.', '') + '"> \
                            <div class="content"> \
                                <div class="header">' + content+ '</div> \
                            </div> \
                        </div>'
                    })
                    $('#locate_view_list').html(locate_inner_html)
                    locate_view_win.show();
                });                
            })
            var prev_locate_item = ""
            function set_locate_pos(lat, lng) {
                not_map_click_change = 1;
                if(prev_locate_item != "") {
                    prev_locate_item.css('background-color', '#FFFFFF')
                }
                $('#' + lng.toString().replace('.', '') + lat.toString().replace('.', '')).css('background-color', '#FFB2BD')
                prev_locate_item = $('#' + lng.toString().replace('.', '') + lat.toString().replace('.', ''))
                
                search_Icon_draw(lat, lng)
            }
            $("#locate_clear").click(function() {
                
                if(prev_locate_item != "") {
                    prev_locate_item.css('background-color', '#FFFFFF')
                    prev_locate_item = ""
                }
                maps[0].removeLayer(Location_Icon_vectorLayer);
                maps[1].removeLayer(Location_Icon_vectorLayer);
                
            })
            $("#locate_input_clear").click(function() {
                
                if(prev_locate_item != "") {
                    prev_locate_item.css('background-color', '#FFFFFF')
                    prev_locate_item = ""
                }
                maps[0].removeLayer(Location_Icon_vectorLayer);
                maps[1].removeLayer(Location_Icon_vectorLayer);
                
            })
            
            $('#locate_input').autocomplete({
                source: function( request, response ) {
                    $.ajax({
                        type: 	"GET",
                        url:	"php/SendAPIReq.php",
                        data: {
                            u : encodeURI("https://api.nlsc.gov.tw/idc/TextQueryMap/" + request.term)
                        }
                    }).done(function(data) {
                        var content = []
                        $(data).find("ITEM").each(function(i) {
                            content.push($(this).children("CONTENT").text())
                        })
                        response(content)
                    });
                    /*
                    var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
                    response( $.grep( names, function( value ) {
                        value = value.label || value.value || value;
                        return matcher.test( value ) || matcher.test( normalize( value ) );
                    }) );*/
                },
                open: function(){
                    $(this).autocomplete('widget').css('z-index', 300);
                    return false;
                },
            });
			
	//定位圖例
	function createMarker(location, style){
		var iconFeature = new ol.Feature({
			geometry: new ol.geom.Point(location)
		});
		iconFeature.setStyle(style);

		return iconFeature
	}	
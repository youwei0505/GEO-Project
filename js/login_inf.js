var Login_win, Login_Form;
var Login_ID = "";
var Login_Source="";
var Login_Name = "";
Login_win = dhxWins.createWindow("Login_win", 500, 300, 300, 330);
Login_win.setText("使用者登入");
//Login_win.button("close").disable();
Login_win.button("minmax").hide();
Login_win.button("park").hide();
Login_win.centerOnScreen();
Login_win.denyResize();
Login_win.hide();

/**** 20190513 fixed *****/
function login_add_option() {
	$("#drawpath_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
	$("#drawpath_data").append(new Option("1M TW DLA DTM (99-104年)", 'TW_DLA_20110101_20161101_1M_3826_DEM'));
	$("#drawline_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
	$("#hillshade_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
	//$("#hillshade_data").append(new Option("1M TW DLA DSM (99-104年)", 'TW_DLA_20110101_20161101_1M_3826_DSM'));
	$("#hillshadeAZ_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
	//$("#hillshadeAZ_data").append(new Option("1M TW DLA DTM (99-104年)", 'TW_DLA_20110101_20161101_1M_3826_DSM'));
	$("#stlfile_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
	$("#stlfile_data").append(new Option("5M TW DLA DTM (99-104年)", 'TW_DLA_20110101_20161101_5M_3826'));
	$("#stlfile_data").append(new Option("1M TW DLA DTM (99-104年)", 'TW_DLA_20110101_20161101_1M_3826'));
	//$("#viewshed_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
	//$("#viewshed_data").append(new Option("5M TW DLA DTM (99-104年)", 'TW_DLA_20110101_20161101_5M_3826'));
	$("#MCRIF_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
	$("#MCRIF_data").append(new Option("5M TW DLA DTM (99-104年)", 'TW_DLA_20110101_20161101_5M_3826'));
	$("#MCRIF_data").append(new Option("1M TW DLA DTM (99-104年)", 'TW_DLA_20110101_20161101_1M_3826'));
	$("#svf_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
	$("#svf_data").append(new Option("5M TW DLA DTM (99-104年)", 'TW_DLA_20110101_20161101_5M_3826'));
	$("#openness_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
	$("#openness_data").append(new Option("5M TW DLA DTM (99-104年)", 'TW_DLA_20110101_20161101_5M_3826'));
	$("#contour_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
	//$("#contour_data").append(new Option("1M TW DLA DTM (99-104年)", 'TW_DLA_20110101_20161101_1M_3826_DEM'));
	$("#cutfill_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
	$("#cutfillline_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
	$("#slope_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
	$("#slope_data").append(new Option("1M TW DLA DTM (99-104年)", 'TW_DLA_20110101_20161101_1M_3826_DEM'));
	$("#aspect_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
	$("#aspect_data").append(new Option("1M TW DLA DTM (99-104年)", 'TW_DLA_20110101_20161101_1M_3826_DEM'));
	$("#pointheight_data").append(new Option("5M TW DLA DTM (92-94年)", 'TW_DLA_20010814_20061226_5M_3826'));
}

function logout_remove_option() {
	$("#drawpath_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
	$("#drawline_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
	$("#hillshade_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
	$("#hillshadeAZ_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
	$("#stlfile_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
	$("#stlfile_data option[value = 'TW_DLA_20110101_20161101_5M_3826']").remove();
	$("#stlfile_data option[value = 'TW_DLA_20110101_20161101_1M_3826']").remove();
	$("#viewshed_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
	$("#viewshed_data option[value = 'TW_DLA_20110101_20161101_5M_3826']").remove();
	$("#MCRIF_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
	$("#MCRIF_data option[value = 'TW_DLA_20110101_20161101_5M_3826']").remove();
	$("#MCRIF_data option[value = 'TW_DLA_20110101_20161101_1M_3826']").remove();
	$("#svf_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
	$("#svf_data option[value = 'TW_DLA_20110101_20161101_5M_3826']").remove();
	$("#openness_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
	$("#openness_data option[value = 'TW_DLA_20110101_20161101_5M_3826']").remove();
	$("#contour_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
	$("#cutfill_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
	$("#cutfillline_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
	$("#slope_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
	$("#slope_data option[value = 'TW_DLA_20110101_20161101_1M_3826_DEM']").remove();
	$("#aspect_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
	$("#aspect_data option[value = 'TW_DLA_20110101_20161101_1M_3826_DEM']").remove();
	                                
	$("#pointheight_data option[value = 'TW_DLA_20010814_20061226_5M_3826']").remove();
}
/**** 20190513 fixed *****/

function account_login_win() {
	Login_win.show();
}
Login_win.attachEvent("onClose", function (win) {
	Login_win.hide();
	Login_win.setModal(false);
	return false;
});

Login_win.attachHTMLString(
	'<form action="php/login_token.php" id="BG_login" method="post">' +
	'<br><p style="text-align: center;">帳號:<input name="account" type="text" /></p>' +
	'<p style="text-align: center;">密碼: <input name="password" type="password" /></p>' +
	'<div id="recaptchaResponse" ></div>'+
	'<p style="text-align: center;"><input type="submit" value="送出" /></p>' +
	'</form><hr>' +
	'<ol style="list-style: none; font-size: 14px; line-height: 32px; font-weight: bold;">' +
	'<ul style="list-style-type: circle;">' +
	'<li style="clear: both;"><img style="float: left;" src="img/login_google.png" alt="Google 帳號登入" width="32" onclick="community_login(1)"/>Login with Google</li>' +
	'<br><li style="clear: both;"><img style="float: left;" src="img/login_facebook.png" alt="Facebook 帳號登入" width="32" onclick="community_login(2)" />Login with facebook</li>' +
	'<a href="privacy.html" target="_blank" title="[BigGIS隱私權政策]">[BigGIS隱私權政策]</a>'

);
setTimeout(call_recaptcha,6000)
function call_recaptcha(){
	
	$('.grecaptcha-badge').appendTo('#recaptchaResponse');
	$('#recaptchaResponse').attr("style", "");
}

function community_login(type) {
	//alert(location.href);
	if (type == 2) {
		document.location.href = 'https://data.geodac.tw/geoinfo_api/login/facebook?redirect=' + location.href;
	}
	else if (type == 1) {
		document.location.href = 'https://data.geodac.tw/geoinfo_api/login/google?redirect=' + location.href;
	}
}
var response_all_result;
$(document).ready(function (e) {
	//表單發送處理
	$("#BG_login").submit(function (e) {
		$.ajax({
			type: $(this).attr("method"),
			url: $(this).attr("action"),
			data: $(this).serializeArray(),
			dataType: "text"
		}).done(function (response_all) {
			response_all_result=response_all;
		grecaptcha
				.ready(() => {
				grecaptcha.execute('6LeN2hscAAAAAOyO1elVA0pE6VIlmhvsShYmL7_3', {
				action: 'verify3'
				}).then(token => {
				// 將 token 送到後端做驗證
				let formData = new FormData();
		  formData.append('token', token);

		  fetch('https://script.google.com/macros/s/AKfycbyu5HVQLmfSLPq37yF6KJE4dtb-3BT_MTxR22mCoAxi_zoV-p2lTUjwSE5O4KOIRAyS/exec', {
			method: "POST",
			body: formData
		  }).then(response => response.json())
			.then(result => {
			  if(result.success) {
				// 分數大過 0.5，才當作是真實人類操作
				console.log("Google reCAPTCHA分數："+result.score);
				if(result.score > 0.5) {
				 console.log("Google reCAPTCHA保護機制通過");
			response_array = response_all_result.split("@@@");
			response = response_array[0];
			response_token = response_array[1];
			BiggisTracer.token = response_token;
			BiggisTracer.init();
			var ID_data = JSON.parse(response);
			Login_Source=ID_data.Source;
			Login_ID = ID_data.id;
			Login_Name = ID_data.DisplayName;

			if (ID_data.DisplayName != "" && typeof ID_data.DisplayName != "underfined") {
				
				Model_w1.show();
				//Model_w1_Acc_01_call();
				Model_w1_Acc_01.cells("a1").show();//LHI分析
				Model_w1_Acc_01.cells("a11").show();//LHI分析_歷史
				Model_w1_Acc_01.cells("a3").show();//S-2變異分析
				$('#Analysis_1_1').attr("style", "");
				$('#Analysis_1_2').attr("style", "");
				$('#Analysis_1_3').attr("style", "");
				$('#Sup_1_3').attr("style", "");
				$('#Sup_1_4').attr("style", "");
				Model_w1.hide();
				login_permission_set(ID_data.roles);

				document.all('logout_btn').style.visibility = 'visible';
				/*** 20190513 fixed ***/
				login_add_option();
				/*** 20190513 fixed ***/
				alert(Login_Name + "登入成功!");

				document.getElementById('login_name').innerHTML = "使用者：" + ID_data.DisplayName;
				Login_win.hide();
				undermap_list.addOption("source_swcb_r_1m", "2010-2015 HOST地圖(1m)", null, "swcb.png");
				undermap_list.addOption("source_swcb_CS_1m", "2010-2015 CS地圖(1m)", null, "swcb.png");
				document.getElementById("model_terrain_change_btn").disabled = false;
				//undermap_list.addOption("source_swcb_CS_5m","水保局CS地圖(5m)",null,"swcb.png");
				Read_Favor_List();
				Read_Story_Tree();
			
			}
				 // 判斷是真人時要做的事
				}
				
				// 分數低於 0.5，當作機器人
				else {
				 console.log("Google reCAPTCHA保護機制不通過");
				succ_index=0;
				 // 判斷是機器人時要做的事
				}
			  } else {
				console.log(result['error-codes'][0])
			  }
			})
			.catch(err => {
				console.log(err)
			})
				});
			});
		   
			
		})
			.fail(function (jqxhr, textStatus, error) {
				alert("帳號密碼錯誤，請重新輸入!");
				//alert(textStatus);
			});
		e.preventDefault(); //停止預設動作
		//e.unbind(); //解除綁定。停止多個表單提交.
		
	});
});


/*formData =[
{type: "settings", position: "label-left", labelWidth: 130, inputWidth: 120, offsetLeft: 10},
{type: "input", label: "帳號", name:"account",offsetTop: 10,value:""},
{type: "password", label: "密碼", name:"password",value:""},
{type: "button", value: "送出", name:"send"}
];
		
Login_Form = Login_win.attachForm();
Login_Form.loadStruct(formData, "json");
	
	
Login_Form.attachEvent("onEnter",function(inp,ev,id,value){
			if (typeof(value) != "undefined") {
				account_login_textbox();
			} else {
				account_login_textbox();
			}
		});
		
Login_Form.attachEvent("onButtonClick", function(id){
	

	account_login_textbox();
	
	
});
*/
var response_token;
var ID_data;
function account_login_textbox() {
	Login_Form.send("php/login_token.php", function (loader, response_all) {
		if (response_all == "") {
			alert("帳號密碼錯誤，請重新輸入!");
		} else {
			response_array = response_all.split("@@@");
			response = response_array[0];
			response_token = response_array[1];
			BiggisTracer.token = response_token;
			BiggisTracer.init();

			ID_data = JSON.parse(response);
			Login_ID = ID_data.id;
			Login_Source=ID_data.Source;
			Login_Name = ID_data.DisplayName;

			if (ID_data.DisplayName != "" && typeof ID_data.DisplayName != "underfined") {
				
				Model_w1.show();
				//Model_w1_Acc_01_call();
				Model_w1_Acc_01.cells("a1").show();//LHI分析
				Model_w1_Acc_01.cells("a11").show();//LHI分析_歷史
				Model_w1_Acc_01.cells("a3").show();//S-2變異分析
				$('#Analysis_1_1').attr("style", "");
				$('#Analysis_1_2').attr("style", "");
				$('#Analysis_1_3').attr("style", "");
				$('#Sup_1_3').attr("style", "");
				$('#Sup_1_4').attr("style", "");
				Model_w1.hide();
				login_permission_set(ID_data.roles);
				document.all('logout_btn').style.visibility = 'visible';
				/*** 20190513 fixed ***/
				login_add_option();
				/*** 20190513 fixed ***/

				alert(ID_data.DisplayName + "登入成功!");

				document.getElementById('login_name').innerHTML = "使用者：" + ID_data.DisplayName;
				Login_win.hide();
				undermap_list.addOption("source_swcb_r_1m", "水保局HOST地圖(1m)", null, "swcb.png");
				undermap_list.addOption("source_swcb_CS_1m", "水保局CS地圖(1m)", null, "swcb.png");
				document.getElementById("model_terrain_change_btn").disabled = false;
				//undermap_list.addOption("source_swcb_CS_5m","水保局CS地圖(5m)",null,"swcb.png");
				Read_Favor_List();
				Read_Story_Tree();
			}
		}
	});
}

function account_login() {
	if (response_s != "empty_session") {
		response_array = response_s.split("@@@");
		response = response_array[0];
		response_token = response_array[1];

		ID_data = JSON.parse(response);
	}
	if (response_s == "") {
		alert("帳號密碼錯誤，請重新輸入!");
	} else if (response_s == "empty_session") {
						
		Model_w1.show();
	} else if (!response_s) {
		
		Model_w1.show();
	} else if (ID_data.Source == "SOCIAL") {
						
		Model_w1.show();
		console.log(ID_data)
		Login_ID = ID_data.id;
		Login_Name = ID_data.DisplayName;
		setTimeout(function () { login_permission_set(ID_data.roles); }, 3000);
		document.all('logout_btn').style.visibility = 'visible';
		document.getElementById('login_name').innerHTML = "使用者：" + ID_data.DisplayName;
		if (ID_data.DisplayName == null) {

			alert("帳號登入已逾時，請重新登入!");
			account_logout();
			document.location.href = 'https://eip.swcb.gov.tw/';
		}

		alert(ID_data.DisplayName + "登入成功!");
		document.getElementById("model_terrain_change_btn").disabled = false;
		Read_Favor_List();
		Read_Story_Tree();
	}
	else {

		//ID_data=response.split('[');


		BiggisTracer.token = response_token;
		BiggisTracer.init();


		Login_ID = ID_data.id;
		Login_Name = ID_data.DisplayName;
		//alert(ID_data.DisplayName);

		if (typeof ID_data.DisplayName != "" && typeof ID_data.DisplayName != "underfined") {
			
			Model_w1.show();
			
			//Model_w1_Acc_01_call();
			Model_w1_Acc_01.cells("a1").show();//LHI分析
			Model_w1_Acc_01.cells("a11").show();//LHI分析_歷史
			Model_w1_Acc_01.cells("a3").show();//S-2變異分析

			Model_w1.hide();
			setTimeout(function () { login_permission_set(ID_data.roles); }, 3000);


			document.all('logout_btn').style.visibility = 'visible';
			/*** 20190513 fixed ***/
			login_add_option();
			/*** 20190513 fixed ***/


			document.getElementById('login_name').innerHTML = "使用者：" + ID_data.DisplayName;

			Login_win.hide();
			undermap_list.addOption("source_swcb_r_1m", "2010-2015 HOST地圖(1m)", null, "swcb.png");
			undermap_list.addOption("source_swcb_CS_1m", "2010-2015 CS地圖(1m)", null, "swcb.png");
			if (ID_data.DisplayName == null) {

				alert("帳號登入已逾時，請重新登入!");
				account_logout();
				document.location.href = 'https://eip.swcb.gov.tw/';
			}
			alert(ID_data.DisplayName + "登入成功!");
			//alert("目前鴿子(Planet)衛星，原廠API調整中，圖磚影像暫時無法顯示，造成不便，敬請見諒!");
			document.getElementById("model_terrain_change_btn").disabled = false;		
		}	
		Read_Favor_List();
		Read_Story_Tree();
	}
}

function account_logout() {
	document.location = 'php/logout_token.php';
	Login_ID = "";
	Login_Name = "";
	/*$(function(){   
	$('#more').more({'address': 'php/logout_token.php'}) 
	}); */


	Model_w1.show();
	Model_w1_Acc_01.cells("a1").hide();//LHI分析
	Model_w1_Acc_01.cells("a11").hide();//LHI分析_歷史
	Model_w1_Acc_01.cells("a3").hide();//S-2變異分析

	document.getElementById('login_name').innerHTML = "";
	Model_w1.hide();
	/*** 20190513 fixed ***/
	logout_remove_option();
	/*** 20190513 fixed ***/


	document.all('logout_btn').style.visibility = 'hidden';
	document.getElementById("model_terrain_change_btn").disabled = true;
	alert("登出成功!");

}




function account_management() {
	if (Login_ID == "") {
		alert("未登入或帳號逾時，請重新登入!");
	} else {
		url = "https://gis.swcb.gov.tw/BigGIS_Manage/view/members.php?page=members_staff";
		//url = "https://data.geodac.tw/BigGIS_Manage/view/members.php?page=members_staff";
		var newWindow = window.open(url, "BigGIS_management");
		if (!newWindow) return false;
		var html = "";
		html += "<html><head></head><body><form id='formid' method='post' action='" + url + "'>";
		html += "<input type='hidden' name='UserID' value='" + Login_ID + "'/>";
		html += "</form><script type='text/javascript'>document.getElementById(\"formid\").submit()</script></body></html>";
		newWindow.document.write(html);
		return newWindow;
	}
}
//permission_set();
setTimeout(permission_set, 9000);

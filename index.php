<?php
header('Access-Control-Allow-Origin: *');
include 'php/login_token.php';
?>
<!DOCTYPE html>
<html>

<head>
    <meta name="google-site-verification" content="Roye04edgcS41123IjEKX8za65XN5C77xVsGo6wORIA" />
    <meta name="description" content="農委會水保局掌握的圖資現在大公開！水保局長期從事山坡地防減災工作，因此累積大量國內外歷史衛星影像、航空照片，以及超過30萬公頃的UAV（無人機）空拍影像等珍貴圖資，水保局建置「巨量空間資訊系統(BigGIS)」(https://gis.swcb.gov.tw/)，將這些豐富的資源整合起來，同時提供多種線上數化分析功能，搭配3D展示及多視窗輔助介面" />
    <meta name="keywords" content="BigGIS,巨量空間資訊系統,水保局,SWCB">
    <meta name="googlebot" content="index,follow" />
    <meta name="robots" content="index,follow" />
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-140411970-1"></script>
    <script>
	
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'UA-140411970-1');
        gtag('set', {
            'user_id': 'UA-140411970-1'
        }); // 使用已登入的 user_id 設定 User ID
        ga('set', 'userId', 'UA-140411970-1'); // 使用已登入的 user_id 設定 User ID
    </script>
    <title>BigGIS_巨量空間資訊系統</title>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <!--script async src="https://www.googletagmanager.com/gtag/js?id=UA-139989011-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-139989011-1');
      gtag('set', {'user_id': 'USER_ID'}); // 使用已登入的 user_id 設定 User ID。
    </script-->

    <!-- 20190330 fixed-->
    <link rel="stylesheet" href="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/css/ol.css" type="text/css">
    <!--script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/build/ol.js"></script-->
    <!--- 20190330 fixed --->
    <!--<link rel="stylesheet" href="ol3_source/ol.css" type="text/css">-->
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>

    <link rel="stylesheet" type="text/css" href="codebase/fonts/font_roboto/roboto.css" />

    <link rel="stylesheet" type="text/css" href="codebase/dhtmlx.css" />
    <!--故事分鏡套件-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.7.6/tinymce.min.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
    <link rel="stylesheet" href="bootstrap/bootstrap.min.css" />
    <!-----故事分鏡套件----->
    <link rel="stylesheet" type="text/css" href="css/StyleSheet.css">
    <link rel="stylesheet" type="text/css" href="css/ol.css">
    <link rel="stylesheet" type="text/css" href="css/semantic.min.css">
    <link rel="stylesheet" type="text/css" href="css/spectrum.css">
    <link rel="stylesheet" type="text/css" href="css/range.css">
    <link rel="stylesheet" type="text/css" href="css/drawer.css">
    <link rel="stylesheet" type="text/css" href="css/mainwin_switch.css">
    <link rel="stylesheet" type="text/css" href="css/sideslider.css">
    <link rel="stylesheet" type="text/css" href="css/en/chart.css">
    <link rel="stylesheet" type="text/css" href="css/slope_aspect.css">
    <!-- 20190330 add -->
    <link rel="stylesheet" type="text/css" href="css/legend.css">
    <!--------->
    <!-- add 20190417 -->
    <link rel="stylesheet" type="text/css" href="css/swipeSlider.css">
    <!-- 導覽說明 -->
    <link rel="stylesheet" type="text/css" href="css/guide.css">
    <!------------------>
    <script src="codebase/dhtmlx.js"></script>
    <script src="js/jquery-3.3.1.min.js"></script>
    <script src="bootstrap/bootstrap.bundle.min.js"></script>
    <!-- 20191007 -->
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <!-- 20191007 -->

    <!--- 20190330 fixed --->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.contextMenu.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.contextMenu.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.ui.position.js"></script>
    <!--- 20190330 fixed --->

    <!--<script type="text/javascript" src="https://openlayers.org/en/v4.6.5/build/ol.js"></script>-->

    <!--<script type="text/javascript" src="https://openlayers.org/en/v4.6.5/build/ol-debug.js"></script>-->

    <!-- <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.5.0/build/ol.js"></script> -->

    <!-- Cesium 3D -->
    <!--script type="text/javascript" src="ol3_source/olcesium.js"></script-->
    <!-- <script type="text/javascript" src="ol3_source/inject_ol_cesium.js"></script> -->
    <script src="./CesiumMVT/openlayers4mvt/ol4mvt-debug.js"></script>
    <script src="./v4.6.5-dist/ol-debug.js"></script>
    <!-- Cesium 3D -->
    <script src="porj4js/proj4.js"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <script src="https://data.geodac.tw/geoinfo_api/js/onlinetracer"></script>

    <!--引用Pace theme CSS loading bar-->
    <link href="loading/themes/blue/pace-theme-flash.css" rel="stylesheet" />
    <!--引用Pace.js-->
    <script src="loading/pace.js"></script>

    <!--- 20190515 fixed --->
    <!--amchart api-->
    <script src="js/amcharts/amcharts.js"></script>
    <script src="js/amcharts/serial.js"></script>
    <script src="js/amcharts/plugins/export/export.min.js"></script>
    <link rel="stylesheet" href="js/amcharts/plugins/export/export.css" type="text/css" media="all" />
    <script src="js/amcharts/themes/light.js"></script>

    <!-- Resources -->
    <script src="https://www.amcharts.com/lib/4/core.js"></script>
    <script src="https://www.amcharts.com/lib/4/charts.js"></script>
    <script src="https://www.amcharts.com/lib/4/themes/animated.js"></script>
    <!--- 20190515 fixed --->
    <!-- Vue2.x-->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

    <!--- 20220512 add --->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.26.1/axios.min.js"></script>

    <script type="text/javascript" src="js/semantic.min.js"></script>
    <script type="text/javascript" src="js/spectrum.js"></script><!-- color picker -->
    <script type="text/javascript" src="js/range.js"></script><!-- slider https://github.com/tyleryasaka/semantic-ui-range -->

    <!-- print -->
    <script type="text/javascript" src="js/FileSaver.min.js"></script>
    <script type="text/javascript" src="js/jspdf.js"></script>
    <script type="text/javascript" src="js/print.js"></script>
    <script type='text/javascript' src='js/png_support/zlib.js'></script>
    <script type='text/javascript' src='js/png_support/png.js'></script>
    <script type='text/javascript' src='js/deflate.js'></script>
    <script type='text/javascript' src='js/jspdf.debug.js'></script>
    <script type='text/javascript' src='js/html2canvas.js'></script>
    <!-- !print -->
    <!--********    add    ********-->
    <!--縱橫剖面-->
    <script type="text/javascript" src="js/scale_line.js"></script>
    <!--路名搜尋-->
    <script type="text/javascript" src="js/loadcity.js"></script>
    <!--路線剖面-->
    <!-- <script type="text/javascript" src="js/scale_path.js"></script> -->
    <!--八方位陰影圖-->
    <!--script type="text/javascript" src="js/hillshade_AZ.js"></script -->
    <!--等高線圖形-->
    <!--script type="text/javascript" src="js/contour.js"></script -->
    <!--挖填方圖形-->
    <script type="text/javascript" src="js/cutfill.js"></script>
    <!--挖填方多邊形-->
    <script type="text/javascript" src="js/cutfill_poly.js"></script>
    <!--挖填方直線剖面圖-->
    <script type="text/javascript" src="js/cutfill_line.js"></script>
    <!--近似高程分析-->
    <script type="text/javascript" src="js/point_height.js"></script>
    <!--批次近似高程分析-->
    <script type="text/javascript" src="js/batch_point_height.js"></script>
    <!--方位線-->
    <!-- <script type="text/javascript" src="js/houiline.js"></script> -->
    <!--等距線-->
    <!-- <script type="text/javascript" src="js/toukyoken.js"></script> -->
    <!-- 坡度分析 -->
    <script type="text/javascript" src="js/slope_aspect.js"></script>
    <!-- 20190513 fixed
        amchart api
    <script src="js/amcharts/amcharts.js"></script>
    <script src="js/amcharts/serial.js"></script>
    <script src="js/amcharts/plugins/export/export.min.js"></script>
    <link rel="stylesheet" href="js/amcharts/plugins/export/export.css" type="text/css" media="all" />
    <script src="js/amcharts/themes/light.js"></script>
    -->

    <!--高程陰影-->
    <!-- <script type="text/javascript" src="js/hillshade.js"></script> -->
    <!-- 20190330 fixed -->
    <!-- geojson 轉換 -->
    <script type="text/javascript" src="js/geojson.js"></script>
    <!-- 高程立體透視圖 -->
    <script type="text/javascript" src="js/getstlfile.js"></script>
    <!-- 視域範圍分析 -->
    <!--script type="text/javascript" src="js/viewshed.js"></script -->
    <!-- 多色地圖 -->
    <script type="text/javascript" src="js/getMCRIF.js"></script>
    <!-- 透空度分析 -->
    <script type="text/javascript" src="js/getsvf.js"></script>
    <!-- 開闊度分析 -->
    <script type="text/javascript" src="js/get_openness.js"></script>
    <!-- 路徑規劃 -->
    <!--<script type="text/javascript" src="js/get_route.js"></script>-->
    <!-- 20191007 fixed -->
    <!-- 扇形繪畫 -->
    <script type="text/javascript" src="js/create_polygon_curve.js"></script>
    <!-- 20191007 fixed -->
    <!-- 20190330 fixed -->

    <!-- 自訂頻譜波段 -->
    <!-- <script type="text/javascript" src="js/dual_spectrum.js"></script> -->

    <!-- 20190716 fixed -->
    <!-- 時間序列 -->
    <!-- <script type="text/javascript" src="js/subscene_image.js"></script> -->
    <div id='gif_container' title='Gif_Container'>
    </div>
    <!------------------>
    <!-- 20190716 fixed -->
    <!-- 20191007 fixed -->
    <!-- 截圖script -->
    <script type="text/javascript" src="js/gif/gif.js"></script>
    <script type="text/javascript" src="js/crop_image.js"></script>
    <!-- 20191007 fixed -->
    <!-- 快捷工具script -->
    <script type="text/javascript" src="js/quick_fun.js"></script>
    <!--********   20220510  add   ********-->
	<script type="text/javascript" src="js/load_baselayer.js"></script>
    <script type="text/javascript" src="js/load_location.js"></script>
    <!--********   20220510  add   ********-->
    <script type="text/javascript" src="js/draw.js"></script>
	
    <script type="text/javascript" src="js/story.js"></script>
    <script type="text/javascript" src="js/import_export.js"></script>
    <script type="text/javascript" src="js/share.js"></script>
    <script type="text/javascript" src="js/inface_fun.js"></script>
    <script type="text/javascript" src="js/tools_fun.js"></script>
    <script type="text/javascript" src="js/overlay.js"></script>
    <script type="text/javascript" src="js/disflow_search.js"></script>
    <script type="text/javascript" src="js/city_search.js"></script>
    <script type="text/javascript" src="js/login_permission.js"></script>
    <!-- add 20190417 -->
    <script type="text/javascript" src="js/map_swipeSlider.js"></script>
    <!------------------>
    <!-- add 20190417 -->
    <script type="text/javascript" src="js/layer_legend.js"></script>
    <!------------------>

    <!--script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script-->
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDk1mMkr9SPXg7ZUgXV7WAOBCpwRSKWYzc&callback=initMap"></script>

    <!-- add 20190820 -->
    <script type="text/javascript" src="js/terrain.js"></script>
    <script type="text/javascript" src="js/map_button_click_v2.js"></script>
    <script type="text/javascript" src="js/map_button_go.js"></script>
    <script type="text/javascript" src="js/terrain_click_go.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
    <script src="vue/components/ButtonCounter.js"></script>
    <script src="vue/components/Toukyoken_Houiline.js"></script>
    <script src="vue/components/PrintFile.js"></script>
	<script src="vue/components/Sentinel2_api.js"></script>
	<script src="vue/components/Sentinel2_compare_api.js"></script>
	<script src="vue/components/Sentinel2_sis_api.js"></script>
	<script src="vue/components/Subscene_image.js"></script>
	<script src="vue/components/Dual_spectrum.js"></script>
    <!-- add 20210817 -->
    <!--script type="text/javascript" src="vue/fonts/font.js"></script-->
    <!-- add 20220510 -->
    <script type="text/javascript" src="vue/components/location_acc1.js"></script>
    <script type="text/javascript" src="vue/components/location_acc2.js"></script>
    <script type="text/javascript" src="vue/components/location_acc3.js"></script>
    <script type="text/javascript" src="vue/components/location_acc4.js"></script>
    <script type="text/javascript" src="vue/components/location_acc5.js"></script>
    <!-- add 20220709 youwei -->
    <!-- 定位工具，批次定位選單功能 -->
    <script type="text/javascript" src="vue/components/location_acc6.js"></script>
    <!-- add 20220709 youwei -->
    <script type="text/javascript" src="vue/components/location_acc7.js"></script>
    <!-- add 20220510 -->
    <!-- 集水區定位 add 20220725 youwei -->
    <script type="text/javascript" src="vue/components/location_acc8.js"></script>
    <!-- 集水區定位 add 20220725 youwei -->
    <!-- add 20210831 -->
    <script src="vue/components/Scale_path.js"></script>
    <script src="vue/components/Hillshade.js"></script>
    <script src="vue/components/Melton_ratio.js"></script>

    <!-- add 20210913 -->
    <script src="vue/components/Peak_discharge.js"></script>
		<!-- add 20211127 -->
	<!-- Amchart5 Resources -->
	<script src="https://cdn.amcharts.com/lib/5/index.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/plugins/exporting.js"></script>
	<script src="vue/components/Akadani.js"></script>

	
    <!-- add 20220512 -->
    <script src="vue/components/Contour.js"></script>
    <script src="vue/components/Viewshed.js"></script>
    <script src="vue/components/Hillshade_AZ.js"></script>
    <script src="vue/components/Get_route.js"></script>
    <!------------------>

    <!-- add 20200322 -->
    <script type="text/javascript" src="js/download.js"></script>
    <!------------------>

    <!-- add 20210322 -->
    <script type="text/javascript" src="js/modify_picture.js"></script>
    <!-- ol-ext -->
    <link rel="stylesheet" href="https://cdn.rawgit.com/Viglino/ol-ext/master/dist/ol-ext.min.css" />
    <script type="text/javascript" src="https://cdn.rawgit.com/Viglino/ol-ext/master/dist/ol-ext.min.js"></script>
    <!-- add 20210322 -->

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.3.8/purify.min.js"></script>


    <style>
        html {
            width: 100%;
            height: 100%;
            margin: 0px;
            overflow: hidden;
        }



        .maps {
            height: 100%;
            width: 100%;
            margin: 0;
            float: left;
        }

        .map {
            height: 100%;
            width: 50%;
            margin: 0;
            float: left;
        }

        span.label {
            font-family: 微軟正黑體;
            font-size: 14px;
            color: #404040;
        }

        #layer_opacity_slider {
            position: absolute;
            width: 100px;
            height: 30px;
            margin-left: 48%;
            margin-top: 50px;
        }

        .terr_class {
            position: absolute;
            width: 100px;
            height: 30px;
            bottom: 60px;
            left: .5rem;
            width: 6em;
        }

        div#Attributes_Info {
            width: 320px;
            overflow: auto;
        }

        .s_c_center {
            background: #1caffc;
            position: absolute;
            top: 50%;
            left: 50%;
            display: none;
        }

        .s_c_center::after {
            content: "";
            height: 11px;
            width: 71px;
            background: #1caffc;
            display: block;
            position: absolute;
            left: -35px;
            top: -5px;
            border-radius: 8px;
            /* //border-width:2px; 
            //border-style:solid; */
        }

        .s_c_center::before {
            content: "";
            height: 71px;
            width: 11px;
            background: #1caffc;
            display: block;
            position: absolute;
            top: -35px;
            left: -5px;
            border-radius: 8px;
            /* //border-width:2px; 
            //border-style:solid; */
        }

        .grecaptcha-badge {
            position: fixed !important;
            bottom: 60px;
        }
    </style>





</head>

<body>
    <script>
        //swal("使用提醒!", "\n各項資料彙整自不同主管機關，\n如有疑義應以主管機關認定為準，\n本網站資料不具證明效力! ", "img/contact.jpg");//alert.png	
        //swal("", "", "img/alert.jpg")
        /*swal("最新消息", "111年度1729條土石流潛勢溪流相關圖資更新囉!^0^ ", "warning")
            .then((value) => {

                swal("使用提醒!", "\n各項資料彙整自不同主管機關，\n如有疑義應以主管機關認定為準，\n本網站資料不具證明效力! ", "img/contact.jpg")
                    .then((value) => {
                        // 顯示guide區塊
                        showGuide();
                    });

            });
         */
        //swal("最新消息","34處大規模崩塌潛勢區圖資上線囉!^0^ ", "https://geodac.ncku.edu.tw/SWCB_LLGIS/landslide_5.gif")
        //swal("最新消息","34處大規模崩塌潛勢區公開! ", "warning")
        //\n\n本系統於2019/8/3(六)~/8/4(日)進行系統與圖資調整，\n部分圖資與功能受影響，\n如有造成不便，\n敬請見諒!  
        //本系統於每月第一個周末2019/10/6(日)進行例行性圖資儲存設備重組，圖資展圖速度受到影響，如有造成不便，敬請見諒! 
        //本系統於2019/11/4(一)下午二時至下午六時，進行系統災害復原演練，部分圖資展示受到影響，如有造成不便，敬請見諒! 
    </script>
    <!--div id="Msg" style="position:absolute; left:800px;"></div-->
    <div class="maps">
        <div id="Attributes_Info" style="overflow: auto;  height:500px; position:absolute; "></div>
        <div id="map0" class="map"></div>
        <!--- 20190330 fixed --->
        <div style="display: none;">
            <div id='route_popup' class='ui red empty circular label'></div>
        </div>
        <!--- 20190330 fixed --->
        <div id="map1" class="map"></div>
        <!-- Cesium 3D -->
        <div id="map2" class="map"></div>
        <!-- Cesium 3D -->
        <!--- 20190417 fixed --->
    </div>
    <!---------------------->
    <!--- 20190417 fixed --->
    <div id="winVP" style="z-index:40;"></div>
    <div id="r_c_center" style="z-index:40;"></div>
    <div id="l_c_center" style="z-index:40;"></div>
    <div class="s_c_center" style="z-index:40;"></div>
    <div id="layer_opacity_slider" style="z-index:40;">圖層透明度</div>
    <!---------------------->


    <!-- 20190417 add -->
    <input type="range" min="0" max="100" value="50" class="swipeSlider" id="swipeSlider" style="z-index:40;">
    <!------------------>

    <!--<script type="text/javascript" src="js/init_map.js"></script>-->
    <script src="js/load.js"></script>
    
    
    <script src="js/load_project.js"></script>
    <script src="js/load_model.js"></script>
    <script src="js/load_exdata.js"></script>
    <script src="js/load_landslidedam.js"></script>
    <script src="js/load_outside.js"></script>
    <script src="js/load_leftmenu.js"></script>
    <script src="js/login_inf.js"></script>
    <script src="https://www.google.com/recaptcha/api.js?render=6LeN2hscAAAAAOyO1elVA0pE6VIlmhvsShYmL7_3"></script>
    <script>
        // grecaptcha.ready(function() {
            // grecaptcha.execute('6LeN2hscAAAAAOyO1elVA0pE6VIlmhvsShYmL7_3', {
                // action: 'homepage'
            // }).then(function(token) {
                // var recaptchaResponse = document.getElementById('recaptchaResponse');
                // recaptchaResponse.value = token;
				// console.log(recaptchaResponse.value);
            // });
        // });
		
		var btn = document.getElementById('BG_login');
			btn.addEventListener('click', e => {
			grecaptcha
				.ready(() => {
				grecaptcha.execute('6LeN2hscAAAAAOyO1elVA0pE6VIlmhvsShYmL7_3', {
				action: 'verify3'
				}).then(token => {
				// 將 token 送到後端做驗證
				verifyCallback(token)
				});
			});
			})
		function verifyCallback(token) {

		  let formData = new FormData();
		  formData.append('token', token);

		  fetch(uriGAS, {
			method: "POST",
			body: formData
		  }).then(response => response.json())
			.then(result => {
			  if(result.success) {
				// 分數大過 0.5，才當作是真實人類操作
				if(result.score > 0.5) {
				 alert(result.score);
				 // 判斷是真人時要做的事
				}
				
				// 分數低於 0.5，當作機器人
				else {
				 alert(result.score);
				 // 判斷是機器人時要做的事
				}
			  } else {
				window.alert(result['error-codes'][0])
			  }
			})
			.catch(err => {
				window.alert(err)
			})

		}
    </script>
    <!--script type="text/javascript" src="js/arc.js"></script-->
    <!--街景-->
    <script type="text/javascript" src="js/street_view.js"></script>
    <!-- Google Street View API -->


    <!-- 20190417 fixed -->
    <img src="icons/LLGIS_LOGO/system_logo.png" style="position:absolute; left:30px; top:0px; z-index:40;" width="13%" onclick="window.open('https://gis.swcb.gov.tw', 'BigGIS入口網站');" title="返回入口網站">
    <img src="icons/LLGIS_LOGO/Baselayer.png" id="base_layer_icon" style="position:absolute; left:15%; top:0px; z-index:40;" height="8.5%" width="5%" title="基礎圖層" onclick="baselayer_win_call();">
    <img src="icons/LLGIS_LOGO/model.png" style="position:absolute; left:20%; top:0px; z-index:40;" height="8.5%" width="5%" title="模式分析" onclick="model_win_call();">
    <img src="icons/LLGIS_LOGO/exdata.png" style="position:absolute; left:25%; top:0px; z-index:40;" height="8.5%" width="5%" title="資訊彙整" onclick="exdata_win_call();">
    <img src="icons/LLGIS_LOGO/search_in.png" id="data_search" style="position:absolute; left:30%; top:0px; z-index:40;" height="8.5%" width="5%" title="圖資搜尋" onclick="search_in_win_call();">
    <img src="icons/LLGIS_LOGO/project.png" id="project_win_id" style="position:absolute; left:35%; top:0px; z-index:40;" height="8.5%" width="5%" title="計畫成果" onclick="project_win_call();">

    <!-- Add LandslideDam project -->
    <img src="icons/LLGIS_LOGO/landslidedam.png" id="landslidedam" style="position:absolute; left:40%; top:0px; z-index:40;" height="8.5%" width="5%" title="堰塞湖" onclick="landslidedam_win_call();">

    <img src="icons/LLGIS_LOGO/management.png" id="account_management_id" style="position:absolute; left:0px; top:15%; z-index:40;" height="7%" width="4%" title="後端管理" onclick="account_management();">
    <img src="icons/LLGIS_LOGO/login.png" id="account_login_icon" style="position:absolute; left:0px; top:20%;" height="8%" width="5%" title="帳號登入" onclick="account_login_win();">
    <img src="icons/LLGIS_LOGO/location_Taiwan.png" style="position:absolute; left:0px; top:28%; z-index:40;" height="8%" width="5%" title="臺灣視角" onclick="location_taiwan();">
    <img src="icons/LLGIS_LOGO/locationTool.png" style="position:absolute; left:0px; top:36%; z-index:40;" height="8%" width="5%" title="定位工具" onclick="locationTool_win_call();">
    <img src="icons/LLGIS_LOGO/drawer.png" style="position:absolute; left:0px; top:44%; z-index:40;" height="8%" width="5%" title="輔助工具" onclick="drawer_win_call();">
    <!--<img src="icons/LLGIS_LOGO/win_double.png" id="map_win_change_id"style="position:absolute; left:0px; top:55%; z-index:40;"  height="10%" width="5%" title="單雙視窗切換" onclick="map_win_change();">-->

    <!--快捷工具-->
    <img src="icons/Quick_menu/Quick_icon_caputre.png" style="position:absolute; left:55%; top:0.5%; z-index:40;" height="5%" width="3%" title="截圖產製KMZ檔" onclick="quick_get_crop_image_x_y();">
    <!-- 20190603 fixed -->
    <div id="map_win_select" onmouseleave="map_win_select_leave()">
        <img src="icons/LLGIS_LOGO/win_double.png" id="map_win_change_id" style="position:absolute; left:0px; top:52%; z-index:40;" height="8%" width="5%" title="單雙視窗切換" onmouseenter="map_win_select_enter()">
        <div id="map_win_option" style="position:absolute; left:5%; top:52%; z-index:40; height:20%; width:3%; display:none;">
            <img src="icons/LLGIS_LOGO/win_single_thumb.png" id="map_win_single_btn" style="position:absolute; top:0%; height:30%; width:100%; border-style:solid; border-width:3px; border-radius: 5px; border-color: gray;" title="單視窗" onclick="map_win_single()">
            <img src="icons/LLGIS_LOGO/win_double_thumb.png" id="map_win_double_btn" style="position:absolute; top:35%; height:30%; width:100%; border-style:solid; border-width:3px; border-radius: 5px; border-color: gray;" title="雙視窗" onclick="map_win_double()">
            <img src="icons/LLGIS_LOGO/win_slide_thumb.png" id="map_win_slide_btn" style="position:absolute; top:70%; height:30%; width:100%; border-style:solid; border-width:3px; border-radius: 5px; border-color: gray;" title="視窗滑動" onclick="map_win_slide()">
        </div>
    </div>
    <!-- 20190603 fixed -->

    <!--
    <img src="icons/LLGIS_LOGO/set_3Dmodel.png" id="model_3Dchange_id" style="position:absolute; left:0px; top:630px;; z-index:40;"  height="10%" width="5%" title="2D/3D切換" onclick="set_3Dmodel();">
    -->
    <div id="model_change_select" onmouseleave="model_change_select_leave()">
        <img src="icons/LLGIS_LOGO/set_3Dmodel.png" id="model_change_id" style="position:absolute; left:0px; top:60%; z-index:40;" height="8%" width="5%" title="2D/3D/3D地形切換" onmouseenter="model_change_select_enter()">
        <div id="model_change_option" style="position:absolute; left:5%; top:60%; z-index:40; height:20%; width:3%; display:none;">
            <img src="icons/LLGIS_LOGO/set_3D_new.png" id="model_3Dchange_btn" style="position:absolute; top:0%; height:30%; width:100%; border-style:solid; border-width:3px; border-radius: 5px; border-color: gray;" title="2D/3D切換" onclick="set_3Dmodel()">
            <img src="icons/LLGIS_LOGO/set_terrain_model.png" id="model_terrain_change_btn" disabled="disabled" style="position:absolute; top:35%; height:30%; width:100%; border-style:solid; border-width:3px; border-radius: 5px; border-color: gray;" title="3D地形" onclick="terrain_win_call()">
        </div>
    </div>
    <img id="story_win_call" src="icons/LLGIS_LOGO/BG_Story.png" style="position:absolute; left:0px; top:68%; z-index:40; display:none;" height="8%" width="5%" title="主題化故事(事件)" onclick="Story_Win_Call()" />

    <img src="icons/LLGIS_LOGO/street_view.png" id="model_streetview_id" style="position:absolute; left:0px; top:85%;; z-index:40;" height="6%" width="3%" title="街景模式" onclick="get_street_view();">
    <!-------------------->

    <!--img src="icons/LLGIS_LOGO/remove_all_layer.png" style="position:absolute; left:0px; top:620px;"  height="100" title="清除圖層" onclick="remove_all_layer();">
    <img src="" style="position:absolute; left:1000px;"  height="50" size="50" alt="測試按鈕"  title="臺灣視角" onclick="drawer_win_call();">
    <input type="button" value="Enable/disable" style="position:absolute; top:300px; left:0px;" onclick="set_3Dmodel();"/>
    <button id="show_hide_draw_menu" style="position:absolute; left:400px; top:300px;" >隱藏/顯示繪圖選單</button>
    <button style="position:absolute; left:270px; top:300px;"  onclick="single_win()" >單視窗</button>
    <button style="position:absolute; left:350px; top:300px;"   onclick="double_win()" >雙視窗</button>
    <button style="position:absolute; left:400px; top:300px;"   onclick="baselayer_win_call();" >基礎圖層</button>
    <button style="position:absolute; left:450px;"   onclick="model_win_call();" >模式分析</button>
    <button style="position:absolute; left:500px;"   onclick="project_win_call();" >計畫成果</button>
    <button style="position:absolute; left:550px;"   onclick="exdata_win_call();" >資訊彙整</button>
    <button style="position:absolute; left:600px;"   onclick="search_in_win_call();" >圖資搜尋</button>
    <button style="position:absolute; left:700px;"   onclick="locationTool_win_call();" >定位工具</button>
    <button style="position:absolute; left:800px;"   onclick="drawer_win_call();" >繪圖工具</button>
    <!--button style="position:absolute; left:850px;"   onclick="toggleKML(1,'SaltPan.kml',1)" >向量</button>
    <button style="position:absolute; left:800px; top:100px;"   onclick="toggleKML(0,'Grassland.kml',0)" >向量_off</button>
    <button style="position:absolute; left:850px; top:100px;"   onclick="toggleKML(0,'SaltPan.kml',1)" >向量_off</button>
    <input  style="position:absolute; left:750px; top:100px;"   type="button" value="show" onclick="showWindow('w1', true);"> <input type="button" style="position:absolute; left:650px; top:100px;"  value="hide" onclick="showWindow('w1', false);"><br-->

    <!-- Sentinel2 -->
    <!--<script src="js/sentinel2_api.js"></script>-->
    <!--<script src="js/sentinel2_compare_api.js"></script>-->
    <!--<script src="js/sentinel2_sis_api.js"></script>-->
    <!-- 20190330 fixed-->
    <script type="text/javascript" src="js/init_map.js"></script>
    <!-- 20190330 fixed-->



    <!-- Cesium 3D -->
    <script src="./Build_/CesiumUnminified/Cesium.js"></script>
    <link href="./Build_/CesiumUnminified/Widgets/widgets.css" rel="stylesheet">
    <!-- <script src="./v4.6.5-dist/ol-debug.js"></script> -->
    <script src="./CesiumMVT/openlayers4mvt/mapbox-streets-v6-style.js"></script>
    <script src="./CesiumMVT/openlayers4mvt/simple-style.js"></script>
    <!-- <script src="./CesiumMVT/jquery.min.3.2.1.js"></script> -->
    <script type="text/javascript" src="./CesiumMVT/require.min.js" data-main="./js/main"></script>
    <script type="text/javascript" src="./CesiumMVT/imageryproviders/mvt.js"></script>
    <script type="text/javascript" src="./CesiumMVT/cesium-navigation/Source/viewerCesiumNavigationMixin.js"></script>
    <!-- <script type="text/javascript" src="./CesiumMVT/jquery/jquery-3.5.1.min.js"></script> -->

    <script type="text/javascript" src="js/Cesium_3DTerrain.js"></script>
    <!-- Cesium 3D -->



    <script>
        // const vm= new Vue({
        //     data:{
        //         message:'hello vue'
        //     }
        // });
        // vm.$mount('#app');

        var BiggisTracer = Tracer.init({
            site: 'BigGIS'
        });

        $("#account_management_id").hide();
        $("#project_win_id").hide();
        $("#landslidedam").hide();

        var EIP_sessionId = '<?php echo htmlEntities($sessionId); ?>';
        var EIP_loginname = '<?php echo htmlEntities($loginname); ?>';
        //alert(EIP_sessionId);
        //alert(EIP_loginname);
        function buy_image() { //導向採購平台


            re_link = "http://pdims.geodac.tw/?action=buy&step=1&m=4326&p1=" + $('#Search_In_drawbox_LU_Y').val() + "," + $('#Search_In_drawbox_LU_X').val() + "&p2=" + $('#Search_In_drawbox_RD_Y').val() + "," + $('#Search_In_drawbox_RD_X').val() + "&daterange=" + $('#date_from').val() + "," + $('#date_to').val() + "&sessionId=" + EIP_sessionId + "&loginname=" + EIP_loginname;
            //alert(re_link);	
            window.open(re_link);
        }


        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
            swal("系統偵測：您使用IE瀏覽器!", "微軟已於2016年01月12日起\n終止維護Internet Explorer瀏覽器\n\n為了能提升瀏覽安全性及效能與體驗BigGIS完整功能\n建議使用更換最新的Google Chrome或微軟 Edge瀏覽器。", "warning");
        }

        //拖曳時呼叫	
        function handleClick(cb) {
            if (cb.checked == true) {
                map_ind = 1;
                undermap_list.selectOption(map01_layer_ind);
                // if ($('#toukyoken_cb').checkbox('is checked') && $.isNumeric($('#toukyoken_StepSize').val()) && $('#toukyoken_StepSize').val() > 0)
                // 	get_toukyoken()
                //refresh_toukyoken +=1;

                // if ($('#houiline_cb').checkbox('is checked'))
                // 	get_houiline();

                /* If is in single window, change the right/left window */
                if (map_win_change_index == 0)
                    map_win_single();
            } else if (cb.checked == false) {
                map_ind = 0;
                undermap_list.selectOption(map00_layer_ind);
                // if ($('#toukyoken_cb').checkbox('is checked') && $.isNumeric($('#toukyoken_StepSize').val()) && $('#toukyoken_StepSize').val() > 0)
                // 	get_toukyoken();
                //refresh_toukyoken +=1;

                // if ($('#houiline_cb').checkbox('is checked'))
                // 	get_houiline();

                /* If is in single window, change the right/left window */
                if (map_win_change_index == 0)
                    map_win_single();
            }

            //alert("Clicked, new value = " + cb.checked);
            window_select();


        }

        //側邊已選圖資選單


        $(function() {

            var w = $("#mwt_slider_content").width();
            h = $(window).height();
            h = h - 95;
            $('#mwt_slider_content').css('height', h + 'px'); //將區塊自動撐滿畫面高度
            $('#mwt_slider_content_in').css('height', h + 'px'); //將區塊自動撐滿畫面高度
            $("#mwt_fb_tab").click(function() { //滑鼠click時
                if ($("#mwt_mwt_slider_scroll").css('right') == ("-" + w + 'px')) {
                    $("#mwt_mwt_slider_scroll").animate({
                        right: '0px'
                    }, 600, 'swing');
                    document.getElementById("mwt_fb_tab").innerHTML = ' <span>►</span><span>圖</span><span>層</span><span>管</span><span>理</span>';
                    $("#R_mean_alert_content").show();
                } else {
                    $("#mwt_mwt_slider_scroll").animate({
                        right: '-' + w + 'px'
                    }, 600, 'swing');
                    document.getElementById("mwt_fb_tab").innerHTML = '<span>◄</span><span>圖</span><span>層</span><span>管</span><span>理</span>';
                    $("#R_mean_alert_content").hide();
                }
            });
        });
        //左邊收合選單(大規模崩塌重點區)
        $(function() {

            var w = $("#L_mwt_slider_content").width();
            //h = $(window).height();

            h = 80;
            $('#L_mwt_slider_content').css('height', h + 'px'); //將區塊自動撐滿畫面高度
            $('#L_mwt_slider_content_in').css('height', h + 'px'); //將區塊自動撐滿畫面高度
            $("#L_mwt_fb_tab").click(function() { //滑鼠click時
                if ($("#L_mwt_mwt_slider_scroll").css('left') == ('-' + w + 'px')) {
                    $("#L_mwt_mwt_slider_scroll").animate({
                        left: '0px'
                    }, 650, 'swing');
                    document.getElementById("L_mwt_fb_tab").innerHTML = ' <span>►</span>';
                    $("#L_mean_alert_content").show();
                } else {
                    $("#L_mwt_mwt_slider_scroll").animate({
                        left: '-' + w + 'px'
                    }, 650, 'swing');
                    document.getElementById("L_mwt_fb_tab").innerHTML = '<span>◄</span>';
                    $("#L_mean_alert_content").hide();
                }
            });
            $("#L_mwt_Top_tabmenu01").click(function() {
                load_leftmenu("TM01");
            });
            $("#L_mwt_Top_tabmenu02").click(function() {
                load_leftmenu("TM02");
            });
        });
        var Slider_Opacity;
        var Pop_Opacity;

        // init slider
        Slider_Opacity = new dhtmlXSlider({
            parent: "layer_opacity_slider",
            step: 1,
            value: 100,
            min: 0,
            max: 100
        });

        // attach popup to slider
        Pop_Opacity = new dhtmlXPopup({
            slider: Slider_Opacity
        });

        // change popup value when slider moved
        Slider_Opacity.attachEvent("onChange", function(value) {
            updatePopupValue(value);
        });

        function updatePopupValue(value) {
            Pop_Opacity.attachHTML("透明度:" + value.toString());
            //alert(sel_Opacity_layer.length);
            for (k = 0; k < sel_Opacity_layer.length; k++) {
                sel_Opacity_layer[k].setOpacity(value / 100);
            }

        }

        var response_s = <?php
                            if (isset($_SESSION['response_SESSION'])) {
                                echo $_SESSION['response_SESSION'];
                            } else {
                                echo '"empty_session"';
                            }
                            ?>;
    </script>
    <div id="infoDiv"></div>
    <!------右邊選單(已選圖層)-------------->
    <div id="mwt_mwt_slider_scroll" style="z-index:40;">

        <div id="mwt_fb_tab">
            <span>◄</span>
            <span>已</span>
            <span>選</span>
            <span>圖</span>
            <span>層</span>
        </div>
        <div id="mwt_slider_content">
            <div id="mwt_slider_content_in"></div>
        </div>
    </div>

    <div class="R_mean_arrow_box" id="R_mean_alert_content" style="z-index:100; display:none;">
        <img style="float: left;" src="icons/menu_alert/R_menu.png" width="45" />
        <img style="float: right" src="icons/menu_alert/Close.png" onclick="close_R_menu_alert()" ; width="20" />
        <p style="text-align: center; "><span style=" vertical-align:middle; color: #000080;"><strong>可開關圖層與調整透明度喔!!</strong></span></p>
    </div>


    <!------左邊選單(大規模崩塌重點區)-------->
    <!--div id="L_mwt_mwt_slider_scroll" style="z-index:30;" style="display:none"  >
        <div id="L_mwt_Top_tabmenu01">
            大規模崩塌潛勢區
        </div>
        <div id="L_mwt_Top_tabmenu02">
            水土保持檔案展活動
        </div>
        <div id="L_mwt_fb_tab">
            <span>►</span>
        </div>
        <div id="L_mwt_slider_content">
            <div id="L_mwt_slider_content_in"></div>
        </div>
    </div-->


    <!--div class="L_mean_arrow_box" id="L_mean_alert_content" style="z-index:100;">
        <img style="float: left;" src="icons/menu_alert/L_menu.png" alt="html table div" width="45" />
        <img style="float: right" src="icons/menu_alert/Close.png" onclick="close_L_menu_alert()" ; alt="html table div" width="20" />
        <br>
        <p style="text-align: center; "><span style=" vertical-align:middle; color: #000080;"><strong>點此快速檢閱!</strong></span></p>
    </div-->



    <div id="popup" class="ol-popup">
        <a href="#" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content"></div>
        <div id="update"></div>

    </div>


    <!-- 底圖切換與登入 -->
    <div id="undermap_lists" style="width:250px; position:absolute; right:50px; top:30px; z-index:40; "></div>
    <button id="logout_btn" style="position:absolute; right:200px; visibility:hidden;  z-index:40;" onclick="account_logout()" ; value="登出" ;>登出</button>
    <div id="login_name" style="position:absolute; right:100px;  z-index:40;"></div>
    <!-------------------->
    <!------底圖切換提示-------->

    <!--div class="RT_mean_arrow_box" id="RT_mean_alert_content" style="z-index:100;">
        <img style="float: left;" src="icons/menu_alert/RT_menu.png" width="45" />
        <img style="float: right" src="icons/menu_alert/Close.png" onclick="close_RT_menu_alert()" ; width="20" />
        <p style="text-align: center; "><span style=" vertical-align:middle; color: #000080;"><strong>多種底圖可切換喔!!</strong></span></p>
    </div-->




    <!-- 20190417 fixed -->
    <div class="mainwin_switch" style="z-index:40;">
        <!-------------------->

        <input type="checkbox" name="mainwin_switch" class="mainwin_switch-checkbox" id="mymainwin_switch" onclick='handleClick(this)'>
        <label class="mainwin_switch-label" for="mymainwin_switch">
            <span class="mainwin_switch-inner"></span>
            <span class="mainwin_switch-switch"></span>
        </label>
    </div>


    <!--div id="FullScreen" class="ol-control ol-collapsed ol-unselectable " title="FullScreen">
            <button onclick=enterFullScreen()><i class="fa fa-arrows-alt" ></i></button>
        </div>
        <div id="FullExstent" class="ol-control ol-collapsed ol-unselectable " title="FullExstent">
            <button onclick=initmap()><i class="fa fa-home"></i></button>
        </div>

        <div id="Legend" class="ol-control ol-collapsed ol-unselectable" tabindex="0" onClick="Openinfo(this.id);" title="Legend">
            <button ><i class="fa fa-th-list" ></i></button>
        </div>
        <div id="Legend_Info" class="Info" style="bottom:5rem;right:.5rem;"></div>
        <div id="Attributes" class="ol-control ol-collapsed ol-unselectable" tabindex="0" onClick="Openinfo(this.id);" title="Attributes">
            <button ><i class="fa fa-file-text-o" ></i></button>
        </div>
        <div id="Attributes_Info" class="Info" style="top:.5rem;right:4rem;"></div>
        <div id="Locate" class="ol-control ol-collapsed ol-unselectable" tabindex="0" onClick="Locate();" title="Locate">
            <button style="color:yellow"><i class="fa fa-location-arrow " ></i></button>
        </div-->



    <!--<div class="jquery-accordion-menu-footer"></div>-->
    <img id="img1" src="img/logo_min.png" style="display:none">
    <img id="compass_icons" src="img/north.png" style="display:none">
    <canvas id="canvas_title" width="800" height="80" style="position:absolute; background-color: white; color:black">
    </canvas>
    <canvas id="canvas_content" width="800" height="100" style="position:absolute; background-color: white; color:black">
    </canvas>
    <div id="menu_down" class="menu_down">
        <select id="Scale_Units" style="bottom:40px;left:.5rem;width:100px;">
            <option value="degrees">度分秒制</option>
            <option value="imperial">英制</option>
            <option value="us">美制</option>
            <option value="nautical">浬</option>
            <option value="metric" selected>公制</option>
        </select>
        <select id="Projection_Type" style="bottom:5px;left:.5rem;width:6em;">
            <option value="EPSG:4326" selected>經緯度</option>
            <option value="EPSG:3828">TWD67</option>
            <option value="EPSG:3826">TWD97</option>

        </select>
        <div id="Cursor_Coord" style="bottom:5px;left:110px; width:170px;text-align:left; "></div>
        <div id="Cursor_terr" style="bottom:60px;left:110px; width:0px;text-align:left;"></div>
        <label id="Terr_Lable" style="bottom:5px;left:300px;width:4em;">高程(m)</label>
        <label id="Terr_value" style="bottom:5px;left:360px;width:5em;"></label>
        <div class="guide-info-btn" onclick="showGuide()">導覽說明</div>
    </div>

    <div class="ol-csutomattribution">
        <ul>
            <li> <a href="https://www.swcb.gov.tw" target="_blank">行政院農業委員會水土保持局 </a>版權所有 © 2017 SWCB All Rights Reserved.</li>
        </ul>
    </div>
    <script>
        load_leftmenu(); //載入左邊選單

        proj4.defs([
            [
                'EPSG:4326',
                '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'
            ],
            [
                'EPSG:3826',
                '+title=TWD97 TM2+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +units=公尺 +no_defs'
            ],
            [
                'EPSG:3828',
                '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=aust_SA +towgs84=-752,-358,-179,-0.0000011698,0.0000018398,0.0000009822,0.00002329 +units=m +no_defs'
            ]
        ]);

        var EPSG3826 = new proj4.Proj('EPSG:3826'); //TWD97 121分帶
        var EPSG3828 = new proj4.Proj('EPSG:3828'); //TWD67 121分帶
        var EPSG4326 = new proj4.Proj('EPSG:4326'); //WGS84	
        var EPSG3857 = new proj4.Proj('EPSG:3857');
        $('.ui.accordion').toggle();
        var Scale_Units_Select = document.getElementById('Scale_Units');
        //宣告輔助比例尺
        var Init_Control_ScaleLine = 'metric';
        var Control_FullScreen = new ol.control.FullScreen();
        //var Control_RotateNorth = new app.RotateNorthControl();
        var Control_ScaleLine = new ol.control.ScaleLine();
        var Control_ZoomSlider = new ol.control.ZoomSlider();
        /*var Control_MousePosition = new ol.control.MousePosition({
=======
            [
                'EPSG:4326',
                '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'
            ],
            [
                'EPSG:3826',
                '+title=TWD97 TM2+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +units=公尺 +no_defs'
            ],
            [
                'EPSG:3828',
                '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=aust_SA +towgs84=-752,-358,-179,-0.0000011698,0.0000018398,0.0000009822,0.00002329 +units=m +no_defs'
            ]
        ]);

        var EPSG3826 = new proj4.Proj('EPSG:3826'); //TWD97 121分帶
        var EPSG3828 = new proj4.Proj('EPSG:3828'); //TWD67 121分帶
        var EPSG4326 = new proj4.Proj('EPSG:4326'); //WGS84	

        $('.ui.accordion').toggle();
        var Scale_Units_Select = document.getElementById('Scale_Units');
        //宣告輔助比例尺
        var Init_Control_ScaleLine = 'metric';
        var Control_FullScreen = new ol.control.FullScreen();
        //var Control_RotateNorth = new app.RotateNorthControl();
        var Control_ScaleLine = new ol.control.ScaleLine();
        var Control_ZoomSlider = new ol.control.ZoomSlider();
        /*var Control_MousePosition = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(5),
            projection: 'EPSG:4326',
            target: document.getElementById('Cursor_Coord'),
            undefinedHTML: '目前位置未取得坐標資訊'
        });*/
        var Control_MousePosition_terr = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(6),
            projection: 'EPSG:4326',
            target: document.getElementById('Cursor_terr'),
            undefinedHTML: '目前位置未取得坐標資訊'
        });
        /*var Control_Attri_terr = new ol.control.Attribution({
                className:"terr_class",
                collapsible:"false",
                target: document.getElementById('Cursor_terr'),
                label:"高程"
                
            });	*/
        var All_Check_List_W0 = new Array(); //目前以勾選圖資清單
        var All_Check_List_W0_Str = "";
        var All_Check_List_W1 = new Array(); //目前以勾選圖資清單
        var All_Check_List_W1_Str = "";


        /*** 20190415 add ***/
        var Dot_Type_Check_List_W0 = new Array();
        var Vector_Type_Check_List_W0 = new Array();
        var Image_Type_Check_List_W0 = new Array();
        var Favor_Type_Check_List_W0 = new Array();
        var Dot_Type_Check_List_W1 = new Array();
        var Vector_Type_Check_List_W1 = new Array();
        var Image_Type_Check_List_W1 = new Array();
        var Favor_Type_Check_List_W1 = new Array();
        /***********/

        var map00_layer_ind = 0;
        var map01_layer_ind = 1;
        var sel_Opacity_layer = []; //目前透明圖層

        document.getElementById("Cursor_terr").style.display = "none"; //隱藏
        var now_proj4 = "EPSG:4326";

        function Scale_Units_Select_onChange() {
            Control_ScaleLine.setUnits(Scale_Units_Select.value);
        }
        Scale_Units_Select.addEventListener('change', Scale_Units_Select_onChange);

        var Projection_Select = document.getElementById('Projection_Type');
        Projection_Select.addEventListener('change', function(event) {
            //alert(event.target.value);
            now_proj4 = event.target.value;
            //Control_MousePosition.setProjection(ol.proj.get(event.target.value));
        });

        maps[0].addControl(Control_ScaleLine);
        maps[0].addControl(Control_ZoomSlider);
        //maps[0].addControl(Control_MousePosition);
        maps[0].addControl(Control_MousePosition_terr);
        //maps[0].addControl(Control_Attri_terr);

        var terr_query_loc_temp = 0;
        const get_terr = function() {
            var trans_loc;
            terr_query_loc = document.getElementById("Cursor_terr").innerText;

            if (terr_query_loc != terr_query_loc_temp) {

                loc_arr = terr_query_loc.split(',');
                $.get("php/get_terr.php", {
                    lat: loc_arr[0],
                    lon: loc_arr[1]
                }, function(data) {
                    returnHeight(data.array);
                });
                if (isNaN(loc_arr[0])) {
                    Cursor_Coord.innerHTML = '目前位置未取得坐標資訊';
                } else {

                    if (now_proj4 == "EPSG:4326") {
                        terr_query_loc_arr = terr_query_loc.toString().split(',');
                        Cursor_Coord.innerHTML = parseFloat(terr_query_loc_arr[1]).toFixed(6) + '&nbsp;' + parseFloat(terr_query_loc_arr[0]).toFixed(6);
                        //Cursor_Coord.innerHTML=terr_query_loc;

                    } else {
                        if (now_proj4 == "EPSG:3826") {

                            trans_loc = proj4(EPSG4326, EPSG3826, [loc_arr[0], loc_arr[1]]);

                        } else if (now_proj4 == "EPSG:3828") {
                            trans_loc = proj4(EPSG4326, EPSG3828, [loc_arr[0], loc_arr[1]]);
                        } else {
                            trans_loc = [loc_arr[0], loc_arr[1]];
                        }
                        trans_loc_arr = trans_loc.toString().split(',');
                        Cursor_Coord.innerHTML = parseFloat(trans_loc_arr[0]).toFixed(1) + ', ' + parseFloat(trans_loc_arr[1]).toFixed(1);
                    }

                }

            }
            terr_query_loc_temp = terr_query_loc;
        }

        setInterval(get_terr, 1000);

        function returnHeight(str) {
			
            if (str.indexOf('WKT未包含任何縣市,或此縣市資料，系統尚未支援') > -1) {
                Terr_value.innerHTML = 'No data';
            } else {
				
                var ss = str.replace(/]/g, "");
                ss = str.split(",");
				
                var dd = ss[2].split("]");
                Terr_value.innerHTML = parseFloat(dd[0]).toFixed(1);
            }
        }
        var undermap_list = new dhtmlXCombo("undermap_lists", null, 250, "image");
        //undermap_list.setOptionWidth(300);
        undermap_list.setImagePath("icons/");
        undermap_list.load('<complete>' +
            '<option value="source_gm_m" img="google.png" selected="1">Google 電子地圖</option>' +
            '<option value="source_nlsc_EMAP" img="nlsc.png">通用版電子地圖</option>' +
            '<option value="source_osm_m" img="osm.png" >OSM 電子地圖</option>' +
            '<option value="source_gm_s" img="google.png" >Google 衛星地圖</option>' +
            '<option value="source_gm_y" img="google.png" >Google 混合地圖</option>' +
            '<option value="source_nlsc_PHOTO2" img="nlsc.png" >通用版正射影像圖</option>' +
            '<option value="source_gm_p" img="google.png"  >Google 地形圖</option>' +
			'<option value="source_swcb_r_2020" img="swcb.png"  >2020水保局HOST地圖(20m)</option>' +
            '<option value="source_swcb_r" img="swcb.png"  >2010-2015水保局HOST地圖(20m)</option>' +
            '<option value="source_swcb_r_5m" img="swcb.png"  >2010-2015水保局HOST地圖(6m)</option>' +
            '<option value="source_swcb_CS" img="swcb.png"  >2010-2015水保局CS地圖(20m)</option>' +
            '<option value="source_swcb_CS_5m" img="swcb.png"  >2010-2015水保局CS地圖(6m)</option>' +
            // '<option value="source_aso_ATIS_base" img="aso.png" >農航所像片基本圖</option>' +
			'<option value="source_aso_base_hillside" img="aso.png" >像片基本圖_山坡地</option>' +
            '<option value="source_aso_ATIS" img="aso.png" >農航所航照圖(WMS)</option>' +
            '<option value="source_moeacgs_CGS" img="CGS.png" >地調所地質圖(五萬分之一)</option>' +
            '<option value="source_nlsc_PB" img="nlsc.png" >經建版地形圖</option>' +
            '<option value="source_nlsc_LUIMAP" img="nlsc.png" >國土利用調查成果圖</option>' +
            '<option value="source_swcb_r_1m" img="swcb.png"  >2010-2015 HOST地圖(1m)</option>' +
            '<option value="source_swcb_CS_1m" img="swcb.png"  >2010-2015 CS地圖(1m)</option>' +
            '</complete>');



        undermap_list.attachEvent("onChange", function(value, text) {
            /////// Cesium 3D ///////
            if (map_ind == 1) {
                maps[1].removeLayer(base_map_array[map01_layer_ind]);
                if (value == "source_gm_m") {
                    maps[1].addLayer(map_layer_gm_m);
                    map01_layer_ind = 0;
                    if (viewer != null) {
                        viewer.imageryLayers.get(1).show = false;
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 0);
                    }
                } else if (value == "source_nlsc_EMAP") {
                    maps[1].addLayer(map_layer_nlsc_EMAP);
                    map01_layer_ind = 1;
                    if (viewer != null) {
                        viewer.imageryLayers.get(1).show = false;
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_nlsc_EMAP, 0);
                    }
                } else if (value == "source_osm_m") {
                    maps[1].addLayer(map_layer_osm_m);
                    map01_layer_ind = 2;
                    if (viewer != null) {
                        viewer.imageryLayers.get(1).show = false;
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_osm_m, 0);
                    }
                } else if (value == "source_gm_s") {
                    maps[1].addLayer(map_layer_gm_s);
                    map01_layer_ind = 3;
                    if (viewer != null) {
                        viewer.imageryLayers.get(1).show = false;
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_s, 0);
                    }
                } else if (value == "source_gm_y") {
                    maps[1].addLayer(map_layer_gm_y);
                    map01_layer_ind = 4;
                    if (viewer != null) {
                        viewer.imageryLayers.get(1).show = false;
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_y, 0);
                    }
                } else if (value == "source_nlsc_PHOTO2") {
                    maps[1].addLayer(map_layer_nlsc_PHOTO2);
                    map01_layer_ind = 5;
                    if (viewer != null) {
                        viewer.imageryLayers.get(1).show = false;
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_nlsc_PHOTO2, 0);
                    }
                } else if (value == "source_gm_p") {
                    maps[1].addLayer(map_layer_gm_p);
                    map01_layer_ind = 6;
                    if (viewer != null) {
                        viewer.imageryLayers.get(1).show = false;
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_p, 0);
                    }
                } else if (value == "source_swcb_r_2020") {
                    maps[1].addLayer(map_layer_swcb_r_2020);
                    map01_layer_ind = 7;
                    layer_token_get();
                    if (viewer != null) {
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 0);
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(1));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_swcb_r_2020, 1);
                    }
                } else if (value == "source_swcb_r") {
                    maps[1].addLayer(map_layer_swcb_r);
                    map01_layer_ind = 8;
                    layer_token_get();
                    if (viewer != null) {
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 0);
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(1));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_swcb_r, 1);
                    }
                }else if (value == "source_swcb_r_5m") {
                    maps[1].addLayer(map_layer_swcb_r_5m);
                    map01_layer_ind = 9;
                    layer_token_get();
                    if (viewer != null) {
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 0);
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(1));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_swcb_r_5m, 1);
                    }
                } else if (value == "source_swcb_CS") {
                    maps[1].addLayer(map_layer_swcb_CS);
                    map01_layer_ind = 10;
                    if (viewer != null) {
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 0);
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(1));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_swcb_CS, 1);
                    }
                } else if (value == "source_swcb_CS_5m") {
                    maps[1].addLayer(map_layer_swcb_CS_5m);
                    map01_layer_ind = 11;
                    if (viewer != null) {
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 0);
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(1));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_swcb_CS_5m, 1);
                    }
                } else if (value == "source_aso_ATIS_base") {
                    maps[1].addLayer(map_layer_aso_ATIS_base);
                    map01_layer_ind = 12;
                    if (viewer != null) {
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 0);
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(1));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_aso_ATIS_base, 1);
                    }
                } else if (value == "source_aso_ATIS") {
                    swal("切換WMS圖層", "此底圖解析度較高且為WMS介接，\n讀取時間較為長，請耐心等候!", "warning");
                    maps[1].addLayer(map_layer_aso_ATIS);
                    map01_layer_ind = 13;

                    // alert("此底圖解析度較高且為WMS介接，讀取時間較為長，請耐心等候!");
                    if (viewer != null) {
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 0);
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(1));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_aso_ATIS, 1);
                    }
                } else if (value == "source_moeacgs_CGS") {
                    maps[1].addLayer(map_layer_moeacgs_CGS);
                    map01_layer_ind = 14;
                    if (viewer != null) {
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 0);
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(1));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_moeacgs_CGS, 1);
                    }
                } else if (value == "source_nlsc_PB") {
                    maps[1].addLayer(map_layer_nlsc_PB);
                    map01_layer_ind = 15;
                    if (viewer != null) {
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 0);
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(1));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_nlsc_PB, 1);
                    }
                } else if (value == "source_nlsc_LUIMAP") {
                    maps[1].addLayer(map_layer_nlsc_LUIMAP);
                    map01_layer_ind = 16;
                    if (viewer != null) {
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 0);
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(1));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_nlsc_LUIMAP, 1);
                    }
                } else if (value == "source_swcb_r_1m") {
                    maps[1].addLayer(map_layer_swcb_r_1m);
                    map01_layer_ind = 17;
                    layer_token_get();
                    if (viewer != null) {
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 0);
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(1));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_swcb_r_1m, 1);
                    }
                } else if (value == "source_swcb_CS_1m") {
                    maps[1].addLayer(map_layer_swcb_CS_1m);
                    map01_layer_ind = 18;
                    layer_token_get();
                    if (viewer != null) {
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 0);
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(1));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_swcb_CS_1m, 1);
                    }
                } else if (value == "source_aso_base_hillside") {
                    maps[1].addLayer(map_layer_aso_base_hillside);
                    map01_layer_ind = 19;
                    layer_token_get();
                    if (viewer != null) {
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_gm_m, 0);
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(1));
                        viewer.imageryLayers.addImageryProvider(Cesium_source_aso_base_hillside, 1);
                    }
                }  
            } 
            if (map_ind == 0) {
                maps[0].removeLayer(base_map_array[map00_layer_ind]);
                if (value == "source_gm_m") {
                    maps[0].addLayer(map_layer_gm_m);
                    map00_layer_ind = 0;
                } else if (value == "source_nlsc_EMAP") {
                    maps[0].addLayer(map_layer_nlsc_EMAP);
                    map00_layer_ind = 1;
                } else if (value == "source_osm_m") {
                    maps[0].addLayer(map_layer_osm_m);
                    map00_layer_ind = 2;
                } else if (value == "source_gm_s") {
                    maps[0].addLayer(map_layer_gm_s);
                    map00_layer_ind = 3;
                } else if (value == "source_gm_y") {
                    maps[0].addLayer(map_layer_gm_y);
                    map00_layer_ind = 4;
                } else if (value == "source_nlsc_PHOTO2") {
                    maps[0].addLayer(map_layer_nlsc_PHOTO2);
                    map00_layer_ind = 5;
                } else if (value == "source_gm_p") {
                    maps[0].addLayer(map_layer_gm_p);
                    map00_layer_ind = 6;
                }else if (value == "source_swcb_r_2020") {
                    maps[0].addLayer(map_layer_swcb_r_2020);
                    map00_layer_ind = 7;
                    layer_token_get();
                }
				else if (value == "source_swcb_r") {
                    maps[0].addLayer(map_layer_swcb_r);
                    map00_layer_ind = 8;
                    layer_token_get();
                } else if (value == "source_swcb_r_5m") {
                    maps[0].addLayer(map_layer_swcb_r_5m);
                    map00_layer_ind = 9;
                    layer_token_get();
                } else if (value == "source_swcb_CS") {
                    maps[0].addLayer(map_layer_swcb_CS);
                    map00_layer_ind = 10;
                } else if (value == "source_swcb_CS_5m") {
                    maps[0].addLayer(map_layer_swcb_CS_5m);
                    map00_layer_ind = 11;
                } else if (value == "source_aso_ATIS_base") {
                    maps[0].addLayer(map_layer_aso_ATIS_base);
                    map00_layer_ind = 12;
                } else if (value == "source_aso_ATIS") {
                    swal("切換WMS圖層", "此底圖解析度較高且為WMS介接，\n讀取時間較為長，請耐心等候!", "warning");
                    //alert("此底圖解析度較高且為WMS介接，讀取時間較為長，請耐心等候!");
                    maps[0].addLayer(map_layer_aso_ATIS);
                    map00_layer_ind = 13;
                } else if (value == "source_moeacgs_CGS") {
                    //swal("切換WMS圖層", "此底圖解析度較高且為WMS介接，\n讀取時間較為長，請耐心等候!", "warning");
                    //alert("此底圖為WMS介接，讀取時間較為長，請耐心等候!");
                    maps[0].addLayer(map_layer_moeacgs_CGS);
                    map00_layer_ind = 14;
                } else if (value == "source_nlsc_PB") {
                    maps[0].addLayer(map_layer_nlsc_PB);
                    map00_layer_ind = 15;
                } else if (value == "source_nlsc_LUIMAP") {
                    maps[0].addLayer(map_layer_nlsc_LUIMAP);
                    map00_layer_ind = 16;
                } else if (value == "source_swcb_r_1m") {
                    maps[0].addLayer(map_layer_swcb_r_1m);
                    map00_layer_ind = 17;
                    layer_token_get();
                } else if (value == "source_swcb_CS_1m") {
                    maps[0].addLayer(map_layer_swcb_CS_1m);
                    map00_layer_ind = 18;
                } else if (value == "source_aso_base_hillside") {					
                    maps[0].addLayer(map_layer_aso_base_hillside);
                    map00_layer_ind = 19;
                }
            }
        });
        undermap_list.deleteOption("source_swcb_r_1m");
        undermap_list.deleteOption("source_swcb_CS_1m");
        //undermap_list.deleteOption("source_swcb_CS_5m");
        account_login(); //EIP登入

        /***** 20190330 fixed  ***/

        /*** 20190515 fixed **/
        var route_click_loc = 0;
        $('#map0').contextmenu(function() {
            var trans_loc;
            terr_query_loc = document.getElementById("Cursor_terr").innerText;

            loc_arr = terr_query_loc.split(',');
            if (isNaN(loc_arr[0])) {
                Cursor_Coord.innerHTML = '目前位置未取得坐標資訊';
            } else {

                if (now_proj4 == "EPSG:4326") {
                    Cursor_Coord.innerHTML = terr_query_loc;
                    route_click_loc = terr_query_loc;

                } else {
                    if (now_proj4 == "EPSG:3826") {

                        trans_loc = proj4(EPSG4326, EPSG3826, [loc_arr[0], loc_arr[1]]);

                    } else if (now_proj4 == "EPSG:3828") {
                        trans_loc = proj4(EPSG4326, EPSG3828, [loc_arr[0], loc_arr[1]]);
                    } else {
                        trans_loc = [loc_arr[0], loc_arr[1]];
                    }
                    trans_loc_arr = trans_loc.toString().split(',');
                    Cursor_Coord.innerHTML = parseFloat(trans_loc_arr[0]).toFixed(3) + ', ' + parseFloat(trans_loc_arr[1]).toFixed(3);
                    route_click_loc = parseFloat(trans_loc_arr[0]).toFixed(3) + ', ' + parseFloat(trans_loc_arr[1]).toFixed(3);
                }

            }
            $.get("php/get_terr.php", {
                lat: loc_arr[0],
                lon: loc_arr[1]
            }, function(data) {
                returnHeight(data.array);
                if (data.array.indexOf('WKT未包含任何縣市,或此縣市資料，系統尚未支援') > -1) {
                    Terr_value.innerHTML = 'No data';
                    route_click_loc = route_click_loc + ', No data'
                } else {
                    route_click_loc = route_click_loc + ', ' + data.array.split('[')[1].split(']')[0].split(',')[2];
                }
            });
        })
        /*** 20190515 fixed **/

        $(function() {
            $.contextMenu({
                selector: '#map0',
                callback: function(key, options) {
                    //alert(key);
                    if (key == 'set_route_start') {
                        vue_get_route.$refs.foo.set_route_start(route_click_loc);
                        //clear_map();
                    }
                    if (key == 'set_route_end') {
                        vue_get_route.$refs.foo.set_route_end(route_click_loc);
                        //clear_map();
                    }
                    if (key == 'start_find_route') {
                        vue_get_route.$refs.foo.get_route();
                    }
                    if (key == 'clear_map') {
                        vue_get_route.$refs.foo.clear_map();
                    }
                    if (key == 'copy_coor') {

                        route_click_loc_array = route_click_loc.split(',');

                        if (now_proj4 == "EPSG:4326") {
                            route_click_loc = route_click_loc_array[1] + " " + route_click_loc_array[0];
                        } else {
                            route_click_loc = route_click_loc_array[0] + "," + route_click_loc_array[1];
                        }
                        //alert(route_click_loc);
                        Copy_coor(route_click_loc);
                    }
                    if (key == 'copy_coor_terr') {
                        route_click_loc_array = route_click_loc.split(',');
                        if (now_proj4 == "EPSG:4326") {
                            route_click_loc = route_click_loc_array[1] + " " + route_click_loc_array[0] + " " + route_click_loc_array[2];
                        }
                        Copy_coor(route_click_loc);
                    }
					if(key =='Google_stree_view'){
						route_click_loc_array = route_click_loc.split(',');
						window.open("https://www.google.com/maps?q&layer=c&cbll="+route_click_loc_array[1]+","+route_click_loc_array[0]+"&cbp=12,270&hl=zh-TW ", 'Google街景');
						
						//alert(route_click_loc_array[1] + " " + route_click_loc_array[0]);
					}
                },
                items: {
                    "fold1": {
                        "name": "路徑規劃",
                        "items": {
                            "set_route_start": {
                                name: "設定起點"
                            },
                            "set_route_end": {
                                name: "設定終點"
                            },
                            "start_find_route": {
                                name: "開始規劃"
                            },
                            "clear_map": {
                                name: "清除"
                            },
                        }
                    },					 
                    "Google_stree_view":{
					name:"Google街景"	
					},
                    "copy_coor": {
                        name: "複製坐標位置(不含高程)"
                    },
                    "copy_coor_terr": {
                        name: "複製坐標位置(含高程)"
                    },
                    "quit": {
                        name: "Quit",
                        icon: function() {
                            return 'context-menu-icon context-menu-icon-quit';
                        }
                    }
                }
            });
        });

        function Copy_coor(coor) {
            var textArea = document.createElement("textarea");
            textArea.value = coor;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Fallback: Copying text command was ' + msg);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }

            document.body.removeChild(textArea);
        }

        /***** 20190330 fixed  ***/
    </script>
    <div id="guide">
        <div class="step step-1">
            <div class="step-frame"></div>
            <div class="step-info">
                主題資料區
            </div>
        </div>

        <div class="step step-2">
            <div class="step-frame"></div>
            <div class="step-info">
                輔助工具區
            </div>
            <div class="step-other-info">
                <div>帳號登入</div>
                <div>全臺視角</div>
                <div>定位工具</div>
                <div>測繪輔助工具</div>
                <div>單/雙視窗切換工具</div>
                <div>2D/3D檢視模式切換</div>
            </div>
        </div>

        <div class="step step-3">
            <div class="step-frame"></div>
            <div class="step-info">
                坐標比例尺
            </div>
            <div class="step-other-info">
                <div>Google街景連動模式</div>
            </div>
        </div>

        <div class="step step-4">
            <div class="step-frame"></div>
            <div class="step-info">
                左右視窗切換工具
            </div>
        </div>

        <div class="step step-5">
            <div class="step-frame"></div>
            <div class="step-info">
                快捷調整透明度
            </div>
        </div>

        <div class="step step-6">
            <div class="step-frame"></div>
            <div class="step-info">
                底圖切換工具
            </div>
        </div>

        <div class="step step-7">
            <div class="step-frame"></div>
            <div class="step-info">
                圖層樣式最愛圖資管理工具
            </div>
        </div>

        <div class="step step-8">
            <div class="step-info">
                展示主畫面
            </div>
        </div>
		
		<div class="step step-9">
            <div class="step-info" >
                <p style="text-align:center"><font color="red">使用提醒!</font><br>各項資料彙整自不同主管機關，<br>如有疑義應以主管機關認定為準<br>，本網站資料不具證明效力!</p>
            </div>
        </div>

    </div>
    <!-- add 20211202 -->
    <script type="text/javascript" src="js/guide.js"></script>
    <!-- add 20211202 -->
	<script>
	showGuide();
	</script>
</body>

</html>
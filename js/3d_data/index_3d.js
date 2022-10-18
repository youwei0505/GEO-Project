var php_list;
var php_list_test;

var longitude = new Array();
var latitude = new Array();
var terr_height = new Array();
var terr_height_new = new Array();

var terr_height_new_1 = new Array();
var newArr = new Array();
var arr_h, arr_h_new;
var nArr = new Array();
var nArr_new = new Array();

var terr_info = new Array();

// var wf_on = 0;
// var side_on = 1;

var ha;
var cy_loc_temp;

var xy_val = new Array();

// var _left, _right, _up, _down;

var tooltipEnabledObjects_drillhole = [];
var tooltipEnabledObjects_drillhole_mountain = [];
var tooltipEnabledObjects_drillhole_plane = [];
var tooltipEnabledObjects_earthquake = [];

//mouse event
var mouse = new THREE.Vector2();
var latestMouseProjection;
var hoveredObj;
var tooltipDisplayTimeout;

var done = 0;
var z_rate = 1.0;

var world = {};
var lyr = [], mat = [], tex = [], jsons=[], labels=[], queryableObjs = [];

var earthquake_info = new Array();
var earthquake_center_height = new Array();
var find_center_height = 0;
let mag_L3d = 0, mag_H3d = 10;
let depth_L3d = 0, depth_H3d = 720;

let init_max_depth = 0, init_min_depth = 720, init_max_mag = 0, init_min_mag = 10;
let min_year = 3000, max_year = 0;


var drillhole_info = []
var mountain_drillhole_info = []
var plane_drillhole_info = []
//cylinder
var meshMaterial = [];
var mountain_meshMaterial = [];
var plane_meshMaterial = [];


var cylinder = [];
var mountain_cylinder = [];
var plane_cylinder = [];


var cylinderGeometry;
var mountain_cylinderGeometry;
var plane_cylinderGeometry;

// var drillhole_info = [
//     [["<<模擬資料：麻竹坑地滑地區擴充調查暨自動化觀測計畫>><br>鑽孔地點：麻竹坑<br>鑽孔編號：BH-07<br>總深度：30公尺<br>深度：0-20公尺<br><img src=\"BH-07_1.jpeg\">"],[120.864],[24.22],[-8],[20]],
//     [["<<模擬資料：麻竹坑地滑地區擴充調查暨自動化觀測計畫>><br>鑽孔地點：麻竹坑<br>鑽孔編號：BH-07<br>總深度：30公尺<br>深度：20-40公尺<br><img src=\"BH-07_2.jpeg\">"],[120.864],[24.22],[-28],[20]]
// ];



let time_start3d = '', time_end3d = '';
let earthquake_Wins = new dhtmlXWindows();
let scale_img_wins = earthquake_Wins.createWindow("scale_img", 50, 50, 190, 350);
let wall_win = earthquake_Wins.createWindow("wall_img", 50, 420, 200, 240);
let mountain_plane_win = earthquake_Wins.createWindow("wall_img", 250, 50, 200, 150);


let wall_date_from = '';
let wall_date_to = '';

let scale_width = 0;
let scale_height = 0;


function onLoad() {
    change_display_type();
    scale_img_wins.setText("地震圖例");
	scale_img_wins.attachHTMLString(
        '<div id="earthquake_image">' +
		'<img src="./earthquake3d_scale_image.png" alt="">'+
		'</div>'
    );

    scale_img_wins.hide();
    scale_img_wins.attachEvent("onClose", function(win){
        scale_img_wins.hide();
        return false;
    });

    wall_win.setText("鑽探圖例");
	wall_win.attachHTMLString(
        '<div id="wall_image">' +
		'<img src="./wall_win_image.png" alt="">'+
		'</div>'
    );

    wall_win.hide();
    wall_win.attachEvent("onClose", function(win){
        wall_win.hide();
        return false;
    });

    mountain_plane_win.setText("鑽探圖例");
	mountain_plane_win.attachHTMLString(
        '<div id="mountain_plane_image">' +
		'<img src="./mountain_plane_win_image.png" alt="">'+
		'</div>'
    );

    mountain_plane_win.hide();
    mountain_plane_win.attachEvent("onClose", function(win){
        wall_win.hide();
        return false;
    });


    var val = localStorage.getItem("storageName");
    let search_coordinate = localStorage.getItem("search_coordinate");
    let search_val = search_coordinate.split("/");
    console.log('search val', search_coordinate);
    console.log(search_val[0]);
    console.log(search_val[1]);
    console.log(search_val[2]);
    console.log(search_val[3]);

    xy_val = val.split("/");
    console.log("val : ", val);
    console.log(xy_val[0]);
    console.log(xy_val[1]);
    console.log(xy_val[2]);
    console.log(xy_val[3]);


    console.log('x1 : ' + xy_val[0]);
    console.log('x2 : ' + xy_val[1]);
    console.log('y1 : ' + xy_val[2]);
    console.log('y2 : ' + xy_val[3]);

    wall_date_from = localStorage.getItem("date_from");
    wall_date_to = localStorage.getItem("date_to");


    $.ajax({
        type:"GET",
        url:"../../php/wall.php",
        dataType:'json',
        data:{
            x1:search_val[0],
            x2:search_val[1],
            y1:search_val[2],
            y2:search_val[3],
        },
        success: function(response){
            for(let i=0; i<response.features.length; i++){
                if(parseFloat(response.features[i].geometry['coordinates'][0]) > parseFloat(xy_val[0]) || parseFloat(response.features[i].geometry['coordinates'][0]) < parseFloat(xy_val[1])){
                    continue;
                }
                else if(parseFloat(response.features[i].geometry['coordinates'][1]) > parseFloat(xy_val[3]) || parseFloat(response.features[i].geometry['coordinates'][1]) < parseFloat(xy_val[2])){
                    continue;
                }
                let add_wall_flag = wall_data_in_time(wall_date_from, wall_date_to, response.features[i].properties['MEASUREDATE']);
                if(add_wall_flag == 0){
                    continue;
                }

                for(let j=0; j<response.features[i].properties['DETAIL'].length; j++){
                    let wall_data = new Array();

                    wall_data.push(response.features[i].properties['PROJECT_NAME']);
                    wall_data.push([parseFloat(response.features[i].geometry['coordinates'][0])]);
                    wall_data.push([parseFloat(response.features[i].geometry['coordinates'][1])]);
                    wall_data.push([-1*parseFloat(response.features[i].properties['DEPTH'])]);
                    wall_data.push([parseFloat(response.features[i].properties['DEPTH'])]);
                    wall_data.push([-1*parseFloat(response.features[i].properties['DETAIL'][j]['TOP_DEPTH'])]);
                    wall_data.push([-1*parseFloat(response.features[i].properties['DETAIL'][j]['BOTTOM_DEPTH'])]);
                    wall_data.push([response.features[i].properties['DETAIL'][j]['CODE']]);
                    wall_data.push(response.features[i].properties['HOLE_POINT_NO']);
                    wall_data.push(response.features[i].properties['PROJECT_NO']);
                    wall_data.push(response.features[i].properties['ELEVATION']);
                    wall_data.push(response.features[i].properties['WATER_TABLE_DEPTH']);
                    wall_data.push(response.features[i].properties['MEASUREDATE']);
                    wall_data.push(response.features[i].properties['PARTY_EXECUTE']);
                    wall_data.push(response.features[i].properties['PARTY_ORGANIZE']);
                
                    drillhole_info.push(wall_data);
                }
            }

            console.log('drillhole_info.length');
            console.log(drillhole_info);

            for(let i=0;i<drillhole_info.length;i++){
                let color_code = 0x000000;
                if(parseInt(drillhole_info[i][7]) == 1){
                    color_code = 0x84493C;
                }
                else if(parseInt(drillhole_info[i][7]) == 10){
                    color_code = 0x797979;
                }
                else if(parseInt(drillhole_info[i][7]) >= 101 && parseInt(drillhole_info[i][7]) <= 112){
                    color_code = 0xFAFF00;
                }
                else if(parseInt(drillhole_info[i][7]) >= 202 && parseInt(drillhole_info[i][7]) <= 266){
                    color_code = 0xFAFF00;
                }
                else if(parseInt(drillhole_info[i][7]) >= 301 && parseInt(drillhole_info[i][7]) <= 312){
                    color_code = 0x00FF0E;
                }
                else if(parseInt(drillhole_info[i][7]) >= 320 && parseInt(drillhole_info[i][7]) <= 329){
                    color_code = 0x00FF0E;
                }
                else if(parseInt(drillhole_info[i][7]) >= 341 && parseInt(drillhole_info[i][7]) <= 345){
                    color_code = 0x00FF0E;
                }
                else if(parseInt(drillhole_info[i][7]) >= 351 && parseInt(drillhole_info[i][7]) <= 353){
                    color_code = 0x00FF0E;
                }
                else if(parseInt(drillhole_info[i][7]) >= 361 && parseInt(drillhole_info[i][7]) <= 362){
                    color_code = 0x00FF0E;
                }
                else if(parseInt(drillhole_info[i][7]) >= 401 && parseInt(drillhole_info[i][7]) <= 482){
                    color_code = 0x00FF0E;
                }
                else if(parseInt(drillhole_info[i][7]) >= 501 && parseInt(drillhole_info[i][7]) <= 507){
                    color_code = 0xCDD3D4;
                }
                else if(parseInt(drillhole_info[i][7]) >= 511 && parseInt(drillhole_info[i][7]) <= 516){
                    color_code = 0xCDD3D4;
                }
                else if(parseInt(drillhole_info[i][7]) >= 602 && parseInt(drillhole_info[i][7]) <= 685){
                    color_code = 0xCDD3D4;
                }
                else if(parseInt(drillhole_info[i][7]) >= 700 && parseInt(drillhole_info[i][7]) <= 705){
                    color_code = 0xFF00D9;
                }
                else if(parseInt(drillhole_info[i][7]) >= 711 && parseInt(drillhole_info[i][7]) <= 714){
                    color_code = 0xFF00D9;
                }
                else if(parseInt(drillhole_info[i][7]) >= 721 && parseInt(drillhole_info[i][7]) <= 723){
                    color_code = 0xFF00D9;
                }
                else if(parseInt(drillhole_info[i][7]) >= 731 && parseInt(drillhole_info[i][7]) <= 733){
                    color_code = 0xFF00D9;
                }
                else if(parseInt(drillhole_info[i][7]) == 740 || parseInt(drillhole_info[i][7]) == 884){
                    color_code = 0xFF00D9;
                }
                else if(parseInt(drillhole_info[i][7]) >= 802 && parseInt(drillhole_info[i][7]) <= 806){
                    color_code = 0xFF00D9;
                }
                else{
                    continue;
                }

                meshMaterial[i] = new THREE.MeshBasicMaterial( {color: color_code, transparent: true, opacity: 0.5});
                cylinderGeometry = new THREE.CylinderBufferGeometry(0.3, 0.3, (parseFloat(drillhole_info[i][5])-parseFloat(drillhole_info[i][6])), 10);
                cylinder[i] = new THREE.Mesh(cylinderGeometry, meshMaterial[i]);
            }

        },
        error: function(jqXHR) {
            console.log("wall error " + jqXHR.status);
        }
    });

    $.ajax({
        type:"GET",
        url:"../../php/mountain_wall.php",
        dataType:'json',
        data:{
            x1:search_val[0],
            x2:search_val[1],
            y1:search_val[2],
            y2:search_val[3],
        },
        success: function(response){
            console.log('mountain wall data');
            console.log(response.features);

            for(let i=0; i<response.features.length; i++){
                let mountain_wall_date = response.features[i].properties['EXEYEAR'] + '-0-0';
                let add_wall_flag = wall_data_in_time(wall_date_from, wall_date_to, mountain_wall_date);
                if(add_wall_flag == 0){
                    continue;
                }
                
                $.ajax({
                    type : "GET",
                    url : "../../php/mountain_wall_detail.php",
                    dataType : 'json',
                    data:{
                        number : response.features[i].properties['STATION_NMBR']
                    },
                    success: function(response_detail){
                        // console.log('mountain wall detail');
                        // console.log(response_detail);
                        let current_k = mountain_drillhole_info.length;
                        for(let j=0; j<response_detail['Rocks'].length; ++j){
                            if(parseFloat(response.features[i].geometry.coordinates[0]) > parseFloat(xy_val[0]) || parseFloat(response.features[i].geometry.coordinates[0]) < parseFloat(xy_val[1])){
                                continue;
                            }
                            else if(parseFloat(response.features[i].geometry.coordinates[1]) > parseFloat(xy_val[3]) || parseFloat(response.features[i].geometry.coordinates[1]) < parseFloat(xy_val[2])){
                                continue;
                            }
                            let mountain_wall_data = new Array();

                            mountain_wall_data.push([parseFloat(response.features[i].geometry.coordinates[0])]);
                            mountain_wall_data.push([parseFloat(response.features[i].geometry.coordinates[1])]);
                            mountain_wall_data.push([parseFloat(response.features[i].properties['WELL_DEPTH'])]);
                            mountain_wall_data.push([response.features[i].properties['AREA_NMBR']]);
                            mountain_wall_data.push([response.features[i].properties['COUNTY_NMBR']]);
                            mountain_wall_data.push([response.features[i].properties['CUR_ELEVATION']]);
                            mountain_wall_data.push([response.features[i].properties['EXEYEAR']]);
                            mountain_wall_data.push([response.features[i].properties['GEO_UNION']]);
                            mountain_wall_data.push([response.features[i].properties['RIVER_AREA_NMBR']]);
                            mountain_wall_data.push([response.features[i].properties['STATION_ADDR']]);
                            mountain_wall_data.push([response.features[i].properties['STATION_ID']]);
                            mountain_wall_data.push([response.features[i].properties['STATION_NAME']]);
                            mountain_wall_data.push([response.features[i].properties['STATION_NMBR']]);
                            mountain_wall_data.push([response.features[i].properties['WELL_TYPE']]);

                            mountain_wall_data.push([response_detail['Rocks'][j]['TOP_DEPTH']]);
                            mountain_wall_data.push([response_detail['Rocks'][j]['BOTTOM_DEPTH']]);
                            mountain_wall_data.push([response_detail['Rocks'][j]['TYPE_OF_ROCK']]);

                            mountain_drillhole_info.push(mountain_wall_data);
                        }
                        for(let k=current_k;k<mountain_drillhole_info.length;k++){
                            mountain_meshMaterial[k] = new THREE.MeshBasicMaterial( {color: Math.random() * 0xffffff, transparent: true, opacity: 0.5});
                            mountain_cylinderGeometry = new THREE.CylinderBufferGeometry(0.3, 0.3, (parseFloat(mountain_drillhole_info[k][15])-parseFloat(mountain_drillhole_info[k][14])), 10);
                            mountain_cylinder[k] = new THREE.Mesh(mountain_cylinderGeometry, mountain_meshMaterial[k]);
                        }
                        
                    },
                    error: function(jqXHR) {
                        console.log("mountain_wall detail error " + jqXHR.status);
                    }
                });
            }
        },
        error: function(jqXHR) {
            console.log("mountain_wall error " + jqXHR.status);
        }
    });

    $.ajax({
        type:"GET",
        url:"../../php/plane_wall.php",
        dataType:'json',
        data:{
            x1:search_val[0],
            x2:search_val[1],
            y1:search_val[2],
            y2:search_val[3],
        },
        success: function(response){
            console.log('plane wall data');
            console.log(response.features);

            for(let i=0; i<response.features.length; i++){
                let plane_wall_date = response.features[i].properties['ROCK_UP_RACK_DATE'].split('T')[0];
                let add_wall_flag = wall_data_in_time(wall_date_from, wall_date_to, plane_wall_date);
                if(add_wall_flag == 0){
                    continue;
                }


                $.ajax({
                    type : "GET",
                    url : "../../php/plane_wall_detail.php",
                    dataType : 'json',
                    data:{
                        number : response.features[i].properties['OFFICIAL_NAME']
                    },
                    success: function(response_detail){
                        let current_k = plane_drillhole_info.length;

                        for(let j=0; j<response_detail['Rocks'].length; ++j){
                            if(parseFloat(response.features[i].geometry.coordinates[0]) > parseFloat(xy_val[0]) || parseFloat(response.features[i].geometry.coordinates[0]) < parseFloat(xy_val[1])){
                                continue;
                            }
                            else if(parseFloat(response.features[i].geometry.coordinates[1]) > parseFloat(xy_val[3]) || parseFloat(response.features[i].geometry.coordinates[1]) < parseFloat(xy_val[2])){
                                continue;
                            }
                            let plane_wall_data = new Array();
                            plane_wall_data.push([parseFloat(response.features[i].geometry.coordinates[0])]);
                            plane_wall_data.push([parseFloat(response.features[i].geometry.coordinates[1])]);
                            plane_wall_data.push([parseFloat(response.features[i].properties['TOTAL_DEPTH'])]);
                            plane_wall_data.push([response.features[i].properties['TOP_DEPTH']]);
                            plane_wall_data.push([response.features[i].properties['BOTTOM_DEPTH']]);
                            plane_wall_data.push([response.features[i].properties['ROCK_TOP_DEPTH']]);
                            plane_wall_data.push([response.features[i].properties['ROCK_BOTTOM_DEPTH']]);
                            plane_wall_data.push([response.features[i].properties['AREA_NMBR']]);
                            plane_wall_data.push([response.features[i].properties['BOOKS']]);
                            plane_wall_data.push([response.features[i].properties['CONT_NAME']]);
                            plane_wall_data.push([response.features[i].properties['COUNTY_NMBR']]);
                            plane_wall_data.push([response.features[i].properties['DATUM_ELEVATION']]);
                            plane_wall_data.push([response.features[i].properties['END_PROD_DATE']]);
                            plane_wall_data.push([response.features[i].properties['EXEYEAR']]);
                            plane_wall_data.push([response.features[i].properties['FCODE']]);
                            plane_wall_data.push([response.features[i].properties['MAPID']]);
                            plane_wall_data.push([response.features[i].properties['MSLINK']]);
                            plane_wall_data.push([response.features[i].properties['OFFICIAL_NAME']]);
                            plane_wall_data.push([response.features[i].properties['REPORTING_NAME']]);
                            plane_wall_data.push([response.features[i].properties['RIVER_AREA_NMBR']]);
                            plane_wall_data.push([response.features[i].properties['RIVER_NAME']]);
                            plane_wall_data.push([response.features[i].properties['ROCK_DOWN_RACK_DATE']]);
                            plane_wall_data.push([response.features[i].properties['ROCK_UP_DOWN_STATE']]);
                            plane_wall_data.push([response.features[i].properties['ROCK_UP_RACK_DATE']]);
                            plane_wall_data.push([response.features[i].properties['SITE']]);
                            plane_wall_data.push([response.features[i].properties['SITE_NAME']]);
                            plane_wall_data.push([response.features[i].properties['STATE_NAME']]);
                            plane_wall_data.push([response.features[i].properties['STATION_ADDR']]);
                            plane_wall_data.push([response.features[i].properties['WELL_TYPE']]);
                            plane_wall_data.push([response.features[i].properties['WSECT_NAME']]);
                            plane_wall_data.push([response_detail['Rocks'][j]['TOP_DEPTH']]);
                            plane_wall_data.push([response_detail['Rocks'][j]['BOTTOM_DEPTH']]);
                            plane_wall_data.push([response_detail['Rocks'][j]['TYPE_OF_ROCK']]);

                            plane_drillhole_info.push(plane_wall_data);
                        }

                        for(let k=current_k;k<plane_drillhole_info.length;k++){
                            plane_meshMaterial[k] = new THREE.MeshBasicMaterial( {color: Math.random() * 0xffffff, transparent: true, opacity: 0.5});
                            plane_cylinderGeometry = new THREE.CylinderBufferGeometry(0.3, 0.3, (parseFloat(plane_drillhole_info[k][31])-parseFloat(plane_drillhole_info[k][30])), 10);
                            plane_cylinder[k] = new THREE.Mesh(plane_cylinderGeometry, plane_meshMaterial[k]);
                        }
                    },
                    error: function(jqXHR) {
                        console.log("plane wall detail error " + jqXHR.status);
                    }
                });
            }
        },
        error: function(jqXHR) {
            console.log("plane_wall error " + jqXHR.status);
        }
    });


    $.ajax({
        type:"GET",
        url:"3d_page.php",
        data:{
            x1:xy_val[0],
            x2:xy_val[1],
            y1:xy_val[2],
            y2:xy_val[3],
        },
        success: function(response){
            // console.log('get php_list_test');
            // console.log(response.toString());
            php_list_test = response.toString();
        },
        error: function(jqXHR) {
            alert("3d_page error " + jqXHR.status);
        }
    });

    $.ajax({
        type:"GET",
        dataType: "json",
        url:"../../php/earthquake.php",
        data:{
            earthquake_date_from:localStorage.getItem("date_from"),
            earthquake_date_to:localStorage.getItem("date_to"),
            Search_earthquake_In_drawbox_LU_X:search_val[1],
            Search_earthquake_In_drawbox_LU_Y:search_val[3],
            Search_earthquake_In_drawbox_RD_X:search_val[0],
            Search_earthquake_In_drawbox_RD_Y:search_val[2],
            depth_L : localStorage.getItem("min_depth"),
            depth_H : localStorage.getItem("max_depth"),
            mag_L : localStorage.getItem("min_mag"),
            mag_h : localStorage.getItem("max_mag"),
            earthquake_opt : localStorage.getItem("earthquake_opt")
        },
        success: function(response){
            if(response.length == 0){
                console.log('no earthquake data!')
            }
            else{
                console.log(response);

                for(let i = 0; i < response.length; ++i){
                    if(parseFloat(response[i]['pos_lon']) > parseFloat(xy_val[0]) || parseFloat(response[i]['pos_lon']) < parseFloat(xy_val[1])){
                        continue;
                    }
                    else if(parseFloat(response[i]['pos_lat']) > parseFloat(xy_val[3]) || parseFloat(response[i]['pos_lat']) < parseFloat(xy_val[2])){
                        continue;
                    }
                    let year = parseInt(response[i]['earthq_time'].split(' ')[0].split('-')[0]);
                    if(year <= min_year){
                        min_year = year;
                    }
                    if(year >= max_year){
                        max_year = year;
                    }

                    if(parseFloat(response[i]['earthq_scale']) < init_min_mag){
                        init_min_mag = parseFloat(response[i]['earthq_scale']);
                    }
                    if(parseFloat(response[i]['earthq_scale']) > init_max_mag){
                        init_max_mag = parseFloat(response[i]['earthq_scale']);
                    }

                    if(parseFloat(response[i]['earthq_depth']) < init_min_depth){
                        init_min_depth = parseFloat(response[i]['earthq_depth']);
                    }
                    if(parseFloat(response[i]['earthq_depth']) > init_max_depth){
                        init_max_depth = parseFloat(response[i]['earthq_depth']);
                    }

                }
                time_start3d = min_year.toString() + '/1';
                time_end3d = max_year.toString() + '/12';

                // $("#3dhslider_mag_L").html(parseInt(mag_L3d));
                // $("#3dhslider_mag_H").html(parseInt(mag_H3d)+1);
        
                // $("#3dhslider_depth_L").html(parseInt(depth_L3d));
                // $("#3dhslider_depth_H").html(parseInt(depth_H3d)+1);
                
                // $("#3dhslider_time_L").html(time_start3d);
                // $("#3dhslider_time_H").html(time_end3d);

                for(let i=0; i < response.length; ++i){
                    if(parseFloat(response[i]['pos_lon']) > parseFloat(xy_val[0]) || parseFloat(response[i]['pos_lon']) < parseFloat(xy_val[1])){
                        continue;
                    }
                    else if(parseFloat(response[i]['pos_lat']) > parseFloat(xy_val[3]) || parseFloat(response[i]['pos_lat']) < parseFloat(xy_val[2])){
                        continue;
                    }
                    info_flag.push(1);
                    let earthquake_response = new Array();
                    earthquake_response.push([i]);
                    earthquake_response.push([response[i]['earthq_time'].toString()]);
                    earthquake_response.push([parseFloat(response[i]['pos_lon'])]);
                    earthquake_response.push([parseFloat(response[i]['pos_lat'])]);
                    earthquake_response.push([-1 * parseFloat(response[i]['earthq_depth'])]);
                    earthquake_response.push([parseFloat(response[i]['earthq_scale'])]);
                    earthquake_response.push([response[i]['earthq_class'].toString()]);
        
                    if(response[i]['earthq_class'].toString() == "地震活動"){
                        if(response[i]['pos_desc'].toString() != ""){
                            earthquake_response.push([response[i]['pos_desc'].toString()]);
                        }
                        earthquake_response.push([response[i]['url_code'].toString()]);
                    }
                    
                    earthquake_info.push(earthquake_response)
                }

                for(let i=0;i<earthquake_info.length;i++){
                    if(parseFloat(earthquake_info[i][5]) < 5.5){
                        color_earth = 0x2b6935;
                    }
                    else if(parseFloat(earthquake_info[i][5]) < 6){
                        color_earth=0xe5e043;
                    }
                    else{
                        color_earth=0xea480b;
                    }

                    sphereGeometry_1[i] = new THREE.SphereBufferGeometry(earthquake_info[i][5], 20, 20);
                    sphereMaterial_1[i] = new THREE.MeshBasicMaterial( {color: color_earth, transparent: true, opacity: 0.8} );
                    sphere_1[i] = new THREE.Mesh(sphereGeometry_1[i], sphereMaterial_1[i]);
                    sphere_ground[i] = new THREE.Mesh(sphereGeometry_1[i], sphereMaterial_1[i]);

                    material_line[i] = new THREE.LineBasicMaterial({color:color_earth, transparent: true, opacity: 0.2});
                    geometry_line[i] = new THREE.BufferGeometry();
                    // geometry_line[i] = new THREE.Geometry();
                    line[i] = new THREE.Line(geometry_line[i], material_line[i]);
                }
            }
        },
        error: function(jqXHR) {
            console.log("earthquake error " + jqXHR.status);
        }
    });

    console.log(earthquake_info)


    document.getElementById("Cursor_Coord").innerHTML = "目前位置未取得坐標資訊";
    document.getElementById("url_btn").onclick = clk_url;
    document.getElementById("model_btn").onclick = clk_model;
    document.getElementById("infobtn").onclick = showInfo;
    document.getElementById("wf_btn").onclick = click_wf_btn;
    document.getElementById("side_btn").onclick = click_side_btn;
    document.getElementById("closebtn").onclick = closeClicked;	
    
    if ("hidebutton" in vars) document.getElementById("infobtn").style.display = "none";
    
    var img_url = localStorage.getItem("resize");
    
    document.getElementById("floatingCirclesG").style.display = "";
    document.getElementById("model_btn").style.display = "none";
    document.getElementById("url_btn").style.display = "none";
    document.getElementById("wf_btn").style.display = "none";
    document.getElementById("side_btn").style.display = "none";
    
    document.getElementById("myRange").disabled = true;
    
    slider = document.getElementById("myRange");
    
    console.log("onload");
    done = 1;
    create_menu();
    setTimeout(function(){
        document.getElementById("url_btn").click();
        document.getElementById("model_btn").click();
        document.getElementById("floatingCirclesG").style.display = "none";
        document.getElementById("wall_data_button").onclick = wall_data_clk;
        document.getElementById("mountain_wall_data_button").onclick = mountain_wall_data_clk;
        document.getElementById("plane_wall_data_button").onclick = plane_wall_data_clk;
        document.getElementById("earthquake_data_button").onclick = earthquake_data_clk;
        document.getElementById("side_button").onclick = click_side_btn;
        document.getElementById("wireframe_button").onclick = click_wf_btn;
    }, 5000);  
}


function wall_data_in_time(wall_date_from, wall_date_to, wall_date_data){
    let from_year = parseInt(wall_date_from.split('-')[0]);
    let from_month = parseInt(wall_date_from.split('-')[1]);
    let from_date = parseInt(wall_date_from.split('-')[2]);
    let to_year = parseInt(wall_date_to.split('-')[0]);
    let to_month = parseInt(wall_date_to.split('-')[1]);
    let to_date = parseInt(wall_date_to.split('-')[2]);
    let add_wall_data = 0;

    let wall_year = parseInt(wall_date_data.split('-')[0]);
    let wall_month = parseInt(wall_date_data.split('-')[1]);
    let wall_date = parseInt(wall_date_data.split('-')[2]);

    if(wall_year < 1900){
        add_wall_data = 0;
    }

    if(wall_year > from_year && wall_year < to_year){
        add_wall_data = 1;
    }
    else if(wall_year == from_year && wall_year == to_year){
        if(wall_month > from_month && wall_month < to_month){
            add_wall_data = 1;
        }
        else if(wall_month == from_month && wall_month == to_month){
            if(wall_date >= from_date && wall_date <= to_date){
                add_wall_data = 1;
            }
            else{
                add_wall_data = 0;
            }
        }
        else if(wall_month == from_month){
            if(wall_date >=  from_date){
                add_wall_data = 1;
            }
            else{
                add_wall_data = 0;
            }
        }
        else if(wall_month == to_month){
            if(wall_date <= from_date){
                add_wall_data = 1;
            }
            else{
                add_wall_data = 0;
            }
        }
        else{
            add_wall_data = 0;
        }
    }
    else if(wall_year == from_year){
        if(wall_month > from_month){
            add_wall_data = 1;
        }
        else if(wall_month == from_month){
            if(wall_date >= from_date){
                add_wall_data = 1;
            }
            else{
                add_wall_data = 0;
            }
        }
        else{
            add_wall_data = 0;
        }
    }
    else if(wall_year == to_year){
        if(wall_month < to_month){
            add_wall_data = 1;
        }
        else if(wall_month == to_month){
            if(wall_date <= to_date){
                add_wall_data = 1;
            }
            else{
                add_wall_data = 0;
            }
        }
        else{
            add_wall_data = 0;
        }
    }

    return add_wall_data;

}


// var geom = new THREE.SphereBufferGeometry(6, 350, 90);
// var colors = [];

// var color = new THREE.Color();
// var colorList = ['red', 'purple', 'pink'];
// for (let i = 0; i < geom.attributes.position.count; i++) {
//   color.set(colorList[THREE.Math.randInt(0, colorList.length - 1)]);
//   color.toArray(colors, i * 3);
// }
// geom.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
// geom.addAttribute('colorRestore', new THREE.BufferAttribute(new Float32Array(colors), 3));

// var points = new THREE.Points(geom, new THREE.PointsMaterial({
//   vertexColors: THREE.VertexColors,
//   size: 0.125
// }));
// scene.add(points);

// var usedIndices = [];
// var pointsUsed = 300;

// function changeColors() {

//   for (let i = 0; i < usedIndices.length; i++) {
//     let idx = usedIndices[i];
//     geom.attributes.color.copyAt(idx, geom.attributes.colorRestore, idx); // restore the color of a point
//   }

//   for (let i = 0; i < pointsUsed; i++) {
//     let idx = THREE.Math.randInt(0, geom.attributes.color.count - 1);
//     geom.attributes.color.setXYZ(idx, 1, 1, 1); // set point's color to white
//     usedIndices[i] = idx; // save the index of the point
//   }

//   geom.attributes.color.needsUpdate = true;
// }

// setInterval(changeColors, 500);





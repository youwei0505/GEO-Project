var sphere_1 = [];
var sphere_ground = [];
var sphereGeometry_1 = [];
var sphereMaterial_1 = [];
var sphere_2 = [];
var sphereGeometry_2 = [];
var sphereMaterial_2 = [];
var sphere_3 = [];
var sphereGeometry_3 = [];
var sphereMaterial_3 = [];
var material_line = [];
var geometry_line = [];
var line = [];
var color_earth = 0xff0000;

var ground_height = new Array();

var earthquake_data = new Array();
let info_flag = new Array();

var earthquake_on = 0;
let display_type = 0;

localStorage.setItem("earthquake_data_storage",earthquake_on);

function change_display_type(){
    $('#show_earthquake_center').change(function(){
        hideTooltip();
        clear_earthquake_obj();
        display_type = 0;
        if(document.getElementById('show_earthquake_center').checked){
            display_type = display_type + 1;
        }
        if(document.getElementById('show_earthquake_source').checked){
            display_type = display_type + 3;
        }
        if(document.getElementById('center_source_line').checked){
            display_type = display_type + 5;
        }
        if(display_type == 0){
            display_type = -1;
        }
        build_earthquake_obj(display_type);
    });

    $('#show_earthquake_source').change(function(){
        hideTooltip();
        clear_earthquake_obj();

        display_type = 0;
        if(document.getElementById('show_earthquake_center').checked){
            display_type = display_type + 1;
        }
        if(document.getElementById('show_earthquake_source').checked){
            display_type = display_type + 3;
        }
        if(document.getElementById('center_source_line').checked){
            display_type = display_type + 5;
        }
        if(display_type == 0){
            display_type = -1;
        }
        build_earthquake_obj(display_type);
    });

    $('#center_source_line').change(function(){
        hideTooltip();
        clear_earthquake_obj();

        display_type = 0;
        if(document.getElementById('show_earthquake_center').checked){
            display_type = display_type + 1;
        }
        if(document.getElementById('show_earthquake_source').checked){
            display_type = display_type + 3;
        }
        if(document.getElementById('center_source_line').checked){
            display_type = display_type + 5;
        }
        if(display_type == 0){
            display_type = -1;
        }
        build_earthquake_obj(display_type);
    });
}


function earthquake_data_clk(){
    if(earthquake_on == 0){
        earthquake_data = earthquake_info;
        display_type = 9;
        scale_img_wins.show();

        console.log("earth_on");
        document.getElementById("earthquake_data_button").innerText = "關閉地震資料";
        earthquake_on = 1;
        localStorage.setItem("earthquake_data_storage",earthquake_on);

        document.getElementById('earthquake_info_block').style.display = 'block';

        $("#3dhslider_mag_L").html(parseInt(init_min_mag));
        $("#3dhslider_mag_H").html(parseInt(init_max_mag)+1);

        $("#3dhslider_depth_L").html(parseInt(init_min_depth));
        $("#3dhslider_depth_H").html(parseInt(init_max_depth)+1);
        
        $("#3dhslider_time_L").html(time_start3d);
        $("#3dhslider_time_H").html(time_end3d);

        set_3dtime_slider(min_year, max_year);
        set_3dmag_slider();
        set_3ddepth_slider();

        document.getElementById('show_earthquake_center').checked = true;
        document.getElementById('show_earthquake_source').checked = true;

        info_flag = new Array();
        for(let i=0;i<earthquake_info.length;i++){
            info_flag.push(1);
        }
        build_earthquake_obj(display_type);
    }
    else{
        scale_img_wins.hide();

        document.getElementById("earthquake_data_button").innerText = "開啟地震資料";
        earthquake_on = 0;
        localStorage.setItem("earthquake_data_storage",earthquake_on);
        hideTooltip();

        document.getElementById('earthquake_info_block').style.display = 'none';
        clear_earthquake_obj();
    }
}

function clk_url(){	

    let _sw = parseFloat(localStorage.getItem("_sw"));
    let _sh = parseFloat(localStorage.getItem("_sh"));
    console.log(_sw);
    console.log(_sh);
    let compute_width = Math.round(2500*(2500/(_sw*_sh))*_sw);
    let compute_height = Math.round(2500*(2500/(_sw*_sh))*_sh);

    console.log(compute_width);
    console.log(compute_height);


    let max_term = 0, max_line = 0, min_line = 0, scale_number = 0, max_count = 0;
    let splice_number = 50;
    scale_width = 99;
    scale_height = 99;
    if(_sw < _sh){
        max_line = _sh;
        min_line = _sw;
        max_term = 2;
    }
    else{
        max_line = _sw;
        min_line = _sh;
        max_term = 1;
    }


    for(let i=1; i<=1024; i*=2){
        let avg_scale = max_line/min_line;
        if(avg_scale >= i && avg_scale <= i*2){
            if(avg_scale <= i*1.5){
                scale_number = i;
            }
            else{
                scale_number = i*2;
                max_count++;
            }
            break;
        }
        max_count++;
    }

    for(let i=0; i<=max_count; i++){  
        splice_number = splice_number*2-1;
    }

    if(max_term ==1){
        scale_width = splice_number;
    }
    else{
        scale_height = splice_number;
    }



    console.log('max term = ', max_term);
    console.log('max count = ', max_count);
    console.log('scale number = ', scale_number);
    console.log('splice_number = ', splice_number);



    php_list_test = php_list_test.split("<");
    var temp = php_list_test[0].split(" ");
    var t_1,t_2,t_3;
    var t_lo,t_la,t_h;
    
    // console.log(temp);
    // console.log(temp.length);


    var j = 0
    while(1){
        if(j == 40000){break;}
        var ttt = new String('\\"coordinates\\":');
        var ttt_1 = new String(temp[j]);
        // console.log(ttt_1);
        var isEquel = JSON.stringify(ttt_1) == JSON.stringify(ttt);
        if(isEquel == true){
            t_1 = temp[j+1];
            t_lo = t_1.toString().substring(1,t_1.toString().length-1);
            
            t_2 = temp[j+2];
            t_la = t_2.toString().substring(0,t_2.toString().length-1);
            
            t_3 = temp[j+3];
            t_h = t_3.toString().substring(0,t_3.toString().length-3);

            longitude.push(t_lo);
            latitude.push(t_la);
            if(parseInt(t_h) < 0){
                terr_height.push(0);
                ground_height.push(0)
            }
            else{
                terr_height.push(parseInt(t_h));
                ground_height.push((t_h))
            }
        }
        j++;
    }

    for(let i=0; i < earthquake_info.length; ++i){
        min_val = 0
        min_h = 0
        for(let j=0; j < longitude.length; ++j){
            lon_diff = Math.abs(parseFloat(earthquake_info[i][2]) - parseFloat(longitude[j]))// * 111.320 * Math.cos(parseFloat(earthquake_info[i][3]));
            lat_diff = Math.abs(parseFloat(earthquake_info[i][3]) - parseFloat(latitude[j]))// * 110.574;
            average_dist = Math.sqrt(Math.pow(lon_diff, 2) + Math.pow(lat_diff, 2))
            if(j == 0){
                min_val = average_dist;
                min_h = ground_height[j]/100;
            }
            else{
                if(average_dist < min_val){
                    min_val = average_dist;
                    min_h = ground_height[j]/100;
                }
                else{
                    continue;
                }
            }
        }
        earthquake_center_height.push(min_h);
    }

    // console.log('earthquake_center_height')
    // console.log(earthquake_center_height)


    $('.text').text("");
    //1D to 2D
    while(terr_height.length > 0) {
        // nArr.push(terr_height.splice(0, parseInt(compute_height)));
        nArr.push(terr_height.splice(0,50));
    }	

    // console.log(nArr)
    // console.log(nArr.length)
    
    var k1, k2;
    var h8;
    // let tmp_terr_height_new = new Array();
    var nArr1 = [];

    // tmp_terr_height_new = nArr;
    // if(max_term == 1){
    //     for(let i=0; i<max_count; i++){
    //         terr_height_new = new Array();
    //         for(k1 = 0; k1 < tmp_terr_height_new.length; k1++){
    //             terr_height_new.push(tmp_terr_height_new[k1][0]);
    //             for(k2 = 0; k2 < tmp_terr_height_new[0].length-1; k2++){
    //                 h8 = (parseInt(tmp_terr_height_new[k1][k2]) + parseInt(tmp_terr_height_new[k1][k2+1]))/2.0;//mid
    //                 terr_height_new.push(Math.abs(h8));
    //                 terr_height_new.push(Math.abs(parseInt(tmp_terr_height_new[k1][k2+1])));
    //             }
    //         }
    //         console.log('width = ', tmp_terr_height_new[0].length);
    //         console.log('height = ', tmp_terr_height_new.length);
    //         splice_number = parseInt(tmp_terr_height_new[0].length)*2-1;
    //         console.log('splice_number : ', splice_number);
    //         nArr1 = [];
    //         while(terr_height_new.length > 0) {
    //             // nArr1.push(terr_height_new.splice(0, parseInt(compute_width)*2-1));
    //             nArr1.push(terr_height_new.splice(0, parseInt(splice_number)));
    //         }
    //         tmp_terr_height_new = nArr1;
    //     }
    //     console.log('width = ', tmp_terr_height_new[0].length);
    //     console.log('height = ', tmp_terr_height_new.length);

    // }
    // else{
        for(k1 = 0; k1 < nArr.length; k1++){
            terr_height_new.push(nArr[k1][0]);
            for(k2 = 0; k2 < nArr.length-1; k2++){
                h8 = (parseInt(nArr[k1][k2]) + parseInt(nArr[k1][k2+1]))/2.0;//mid
                terr_height_new.push(Math.abs(h8));
                terr_height_new.push(Math.abs(parseInt(nArr[k1][k2+1])));
            }
        }
        nArr1 = [];
        while(terr_height_new.length > 0) {
            // nArr1.push(terr_height_new.splice(0, parseInt(compute_width)*2-1));
            nArr1.push(terr_height_new.splice(0, 99));
        }
    // }

    for(k1 = 0;k1 < /*nArr1[0].length*/99 ; k1++){
        terr_height_new_1.push(nArr1[0][k1]);
        for(k2 = 0; k2 < nArr.length-1; k2++){
            h8 = (parseInt(nArr1[k2][k1]) + parseInt(nArr1[k2+1][k1]))/2.0;//mid
            terr_height_new_1.push(Math.abs(h8));
            terr_height_new_1.push(Math.abs(parseInt(nArr1[k2+1][k1])));

        }
    }
    
    // for(var i = 0 ; i < 50; i++){
    //     for(var j = 0 ; j <50 ; j++){
    //         nArr_new.push(nArr[i][j]);
    //     }
    // }

    let new_height_arr = new Array();
    for(let i=0; i<terr_height_new_1.length; i++){
        new_height_arr.push(terr_height_new_1[i]);
        // new_height_arr.push(terr_height_new_1[i]);
    }

    console.log(new_height_arr.length);
    console.log(new_height_arr[0].length);
    console.log(terr_height_new_1.length)


    arr_h = new_height_arr.map(function(x) { return x /100.0; });
    // arr_h = terr_height_new_1.map(function(x) { return x /100.0; });
    console.log(arr_h)
    console.log(arr_h.length)
    ha = arr_h[1249];

    cy_loc_temp = arr_h[600];
}


function build_earthquake_obj(opt){
    // opt = 0 : show all
    // opt = 1 : show center
    // opt = 2 : show source
    // opt = 3 : show nothing

    for(let i=0; i < earthquake_info.length; i++){
        if(info_flag[i] == 1){
            let len_x = Math.abs(xy_val[0] - xy_val[1]);
            let len_y = Math.abs(xy_val[2] - xy_val[3]);
            
            let len_x1 = Math.abs(xy_val[0]-earthquake_info[i][2]);
            let len_y1 = Math.abs(xy_val[3]-earthquake_info[i][3]);
    
            let len_x_fin = (Math.abs(len_x1/len_x))*100.0;
            let len_y_fin = (Math.abs(len_y1/len_y))*100.0;

            // earquake center
            if(opt == 1 || opt == 4 || opt == 6 || opt == 9){
                sphere_ground[i].position.x = len_x_fin-50;
                sphere_ground[i].position.y = len_y_fin-50;
                sphere_ground[i].position.z = parseFloat(earthquake_center_height[i]);
                scene.add(sphere_ground[i]);
            }
            // earquake source
            if(opt == 3 || opt == 4 || opt == 8 || opt == 9){
                sphere_1[i].position.x = len_x_fin-50;
                sphere_1[i].position.y = len_y_fin-50;
                sphere_1[i].position.z = parseFloat(earthquake_info[i][4])*10;
                scene.add(sphere_1[i]);
                tooltipEnabledObjects_earthquake.push(sphere_1[i]);
            }
            // earthquake line
            if(opt == 5 || opt == 6 || opt == 8 || opt == 9){
                let geo_vertices = []
                geo_vertices.push(len_x_fin-50,len_y_fin-50, earthquake_center_height[i]);
                geo_vertices.push(len_x_fin-50,len_y_fin-50, parseFloat(earthquake_info[i][4])*10);
        
                geometry_line[i].setAttribute(
                    'position',
                    new THREE.Float32BufferAttribute(geo_vertices, 3)
                )
        
                line[i] = new THREE.Line(geometry_line[i], material_line[i]);
                scene.add(line[i]);
            }
        }
    }
}

function clear_earthquake_obj(){
    for(let i=0; i < earthquake_info.length; i++){
        scene.remove(sphere_1[i]);
        tooltipEnabledObjects_earthquake = [];
        scene.remove(line[i]);
        scene.remove(sphere_ground[i]);
    }
}


function set_3dmag_slider(){
    $("#hslider_mag3d").slider({
		min: parseInt(init_min_mag),
		max: parseInt(init_max_mag)+1,
		range: true,
		values: [parseInt(init_min_mag), parseInt(init_max_mag)+1],
		create: function(e, ui) {
			var style={"width":"20px","text-align":"center"};
			$(this).find(".ui-slider-handle").css(style);
		},
		slide: function(e, ui) {
            hideTooltip();
            clear_earthquake_obj();
            create_earthquake_data(1, ui.values[0], ui.values[1], time_start3d, time_end3d, depth_L3d, depth_H3d);
            build_earthquake_obj(display_type);

			$("#3dhslider_mag_L").html(ui.values[0]);
			$("#3dhslider_mag_H").html(ui.values[1]);
		}
	});
}


function set_3dtime_slider(min_year_val, max_year_val){
	$("#hslider_time3d").slider({
		min: 1,
		max: (parseInt(max_year_val)-parseInt(min_year_val)+1)*12,
		range: true,
		values: [1, (parseInt(max_year_val)-parseInt(min_year_val)+1)*12],
		create: function(e, ui) {
			var style={"width":"20px","text-align":"center"};
			$(this).find(".ui-slider-handle").css(style);
		},
		slide: function(e, ui) {
			let ts = get_3dstart_time(min_year_val, ui.values[0]);
            let te = get_3dend_time(min_year_val, ui.values[1]);
            hideTooltip();
            clear_earthquake_obj();
            create_earthquake_data(2, mag_L3d, mag_H3d, ts, te, depth_L3d, depth_H3d);
            build_earthquake_obj(display_type);
            
			$("#3dhslider_time_L").html(ts);
			$("#3dhslider_time_H").html(te);
		}
	});
}


function get_3dstart_time(min_year, val){
	let year = min_year + parseInt(val/12);
	let month = val%12;
	if(month == 0){
		year = year-1;
		month = 12;
	}
	return_str = year.toString() + '/' + month.toString();
	return return_str;
}

function get_3dend_time(min_year, val){
	let year = min_year + parseInt(val/12);
	let month = val%12;
	if(month == 0){
		year = year-1;
		month = 12;
	}
	return_str = year.toString() + '/' + month.toString();
	return return_str;
}

function set_3ddepth_slider(){
    $("#hslider_depth3d").slider({
		min: parseInt(init_min_depth),
		max: parseInt(init_max_depth)+1,
		range: true,
		values: [parseInt(init_min_depth), parseInt(init_max_depth)+1],
		create: function(e, ui) {
			var style={"width":"20px","text-align":"center"};
			$(this).find(".ui-slider-handle").css(style);
		},
		slide: function(e, ui) {
            hideTooltip();
            clear_earthquake_obj();
            create_earthquake_data(3, mag_L3d, mag_H3d, time_start3d, time_end3d, ui.values[0], ui.values[1]);
            build_earthquake_obj(display_type);

			$("#3dhslider_depth_L").html(ui.values[0]);
			$("#3dhslider_depth_H").html(ui.values[1]);
		}
	});
}

function create_earthquake_data(opt, min_magnitude, max_magnitude, from_time, to_time, min_depth, max_depth){
    let earthquake_data_len = earthquake_info.length;
    earthquake_data = new Array();
	for(let i = 0; i < earthquake_data_len; ++i){
		if(opt == 0){
			info_flag[i] = 1;
		}
		else{
			if(opt == 1){
				mag_L3d = min_magnitude;
				mag_H3d = max_magnitude;
			}
			else if(opt == 2){
				time_start3d = from_time;
				time_end3d = to_time;
            }
            else{
                depth_L3d = min_depth;
                depth_H3d = max_depth;
            }
			let add_flag = 0;
			let year = parseInt(earthquake_info[i][1][0].split(' ')[0].split('-')[0]);
			let month = parseInt(earthquake_info[i][1][0].split(' ')[0].split('-')[1]);

            let magnitude = parseFloat(earthquake_info[i][5][0]);
            let depth = -1*parseFloat(earthquake_info[i][4][0]);

            if(depth >= parseFloat(min_depth) && depth <= parseFloat(max_depth)){
                if(magnitude >= parseFloat(min_magnitude) && magnitude <= parseFloat(max_magnitude)){
                    if(year > parseInt(from_time.split('/')[0]) && year < parseInt(to_time.split('/')[0])){
                        add_flag = 1;
                    }
                    else if(year == parseInt(from_time.split('/')[0]) && year == parseInt(to_time.split('/')[0])){
                        if(month >= parseInt(from_time.split('/')[1]) && month <= parseInt(to_time.split('/')[1])){
                            add_flag = 1;
                        }
                        else{
                            add_flag = 0;
                        }
                    }
                    else if(year == parseInt(from_time.split('/')[0])){
                        if(month >= parseInt(from_time.split('/')[1])){
                            add_flag = 1;
                        }
                        else{
                            add_flag = 0;
                        }
                    }
                    else if(year == parseInt(to_time.split('/')[0])){
                        if(month <= parseInt(to_time.split('/')[1])){
                            add_flag = 1;
                        }
                        else{
                            add_flag = 0;
                        }
                    }
                    else{
                        add_flag = 0;
                    }
                }
                else{
                    add_flag = 0;
                }
            }
            else{
                add_flag = 0;
            }
			
			if(add_flag == 1){
                info_flag[i] = 1;
                earthquake_data.push(earthquake_info[i]);
			}
			else{
                info_flag[i] = -1;
			}			
        }
    }
}


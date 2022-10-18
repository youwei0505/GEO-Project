let wall_center_height = new Array();
var wall_on = 0;
var mountain_wall_on = 0;
var plane_wall_on = 0;
localStorage.setItem("wall_data_storage",wall_on);
localStorage.setItem("mountain_wall_data_storage",mountain_wall_on);
localStorage.setItem("plane_wall_data_storage",plane_wall_on);

function wall_data_clk(){
    if(wall_on == 0){
        wall_win.show();
        console.log("drill_on");
        document.getElementById("wall_data_button").innerText = "關閉鑽探資料";
        wall_on = 1;
        localStorage.setItem("wall_data_storage",wall_on);
        tooltipEnabledObjects_drillhole = [];

        var c;
        get_wall_data_height();
        for(c=0;c<drillhole_info.length;c++)
        {
            build_other_obj(c, 0);
        }
        
    }
    else{
        wall_win.hide();
        hideTooltip();
        document.getElementById("wall_data_button").innerText = "開啟鑽探資料";
        wall_on = 0;
        localStorage.setItem("wall_data_storage",wall_on);
        var c;
        wall_center_height = new Array();
        tooltipEnabledObjects_drillhole = [];

        for(c=0;c<drillhole_info.length;c++)
        {
            clear_other_obj(c, 0);
        }
    }
}

function mountain_wall_data_clk(){
    if(mountain_wall_on == 0){
        mountain_plane_win.show();
        console.log("mountain drill_on");
        document.getElementById("mountain_wall_data_button").innerText = "關閉山區水文鑽探資料";
        mountain_wall_on = 1;
        localStorage.setItem("mountain_wall_data_storage", mountain_wall_on);
        tooltipEnabledObjects_drillhole_mountain = [];

        var c;
        for(c=0;c<mountain_drillhole_info.length;c++)
        {
            build_other_obj(c, 1);
        }
    }
    else{
        if(plane_wall_on==0){
            mountain_plane_win.hide();
        }
        document.getElementById("mountain_wall_data_button").innerText = "開啟山區水文鑽探資料";
        mountain_wall_on = 0;
        localStorage.setItem("mountain_wall_data_storage", mountain_wall_on);
        var c;
        tooltipEnabledObjects_drillhole_mountain = [];
        for(c=0;c<mountain_drillhole_info.length;c++)
        {
            clear_other_obj(c, 1);
        }
    }
}

function plane_wall_data_clk(){
    if(plane_wall_on == 0){
        mountain_plane_win.show();
        console.log("plane drill_on");
        document.getElementById("plane_wall_data_button").innerText = "關閉平原區水文鑽探資料";
        plane_wall_on = 1;
        localStorage.setItem("plane_wall_data_storage", plane_wall_on);
        tooltipEnabledObjects_drillhole_plane = [];

        var c;
        for(c=0;c<plane_drillhole_info.length;c++)
        {
            build_other_obj(c, 2);
        }
        
    }
    else{
        if(mountain_wall_on==0){
            mountain_plane_win.hide();
        }
        document.getElementById("plane_wall_data_button").innerText = "開啟平原區水文鑽探資料";
        plane_wall_on = 0;
        localStorage.setItem("plane_wall_data_storage", plane_wall_on);
        tooltipEnabledObjects_drillhole_plane = [];

        var c;
        for(c=0;c<plane_drillhole_info.length;c++)
        {
            clear_other_obj(c, 2);
        }
    }
}


function get_wall_data_height(){
    for(let i=0; i < drillhole_info.length; ++i){
        min_val = 0
        min_h = 0
        for(let j=0; j < longitude.length; ++j){
            lon_diff = Math.abs(parseFloat(drillhole_info[i][2]) - parseFloat(longitude[j]))// * 111.320 * Math.cos(parseFloat(earthquake_info[i][3]));
            lat_diff = Math.abs(parseFloat(drillhole_info[i][3]) - parseFloat(latitude[j]))// * 110.574;
            average_dist = Math.sqrt(Math.pow(lon_diff, 2) + Math.pow(lat_diff, 2))
            if(j == 0){
                min_val = average_dist;
                min_h = ground_height[j]/30;
            }
            else{
                if(average_dist < min_val){
                    min_val = average_dist;
                    min_h = ground_height[j]/30;
                }
                else{
                    continue;
                }
            }
        }
        wall_center_height.push(min_h);
    }
    // console.log('wall_center_height');
    // console.log(wall_center_height);
}


//設立鑽井孔實體
function build_other_obj(i, opt) {
    if(opt==0){
        cylinder[i].rotation.x = Math.PI/2;
        var len_x = Math.abs(xy_val[0] - xy_val[1]);
        var len_y = Math.abs(xy_val[2] - xy_val[3]);
        
        var len_x1 = Math.abs(xy_val[0]-drillhole_info[i][1]);
        var len_y1 = Math.abs(xy_val[3]-drillhole_info[i][2]);

        var len_x_fin = (Math.abs(len_x1/len_x))*100.0;
        var len_y_fin = (Math.abs(len_y1/len_y))*100.0;

        cylinder[i].position.x = len_x_fin-50;
        cylinder[i].position.y = len_y_fin-50;
        cylinder[i].position.z = (parseFloat(drillhole_info[i][6])+parseFloat(drillhole_info[i][5]))/2;//(parseFloat(drillhole_info[i][6])-parseFloat(drillhole_info[i][5]))/2;// parseFloat(wall_center_height[i]) + parseFloat(drillhole_info[i][5])+(parseFloat(drillhole_info[i][6])-parseFloat(drillhole_info[i][5]))/2;

        scene.add(cylinder[i]);
        tooltipEnabledObjects_drillhole.push(cylinder[i]);

        localStorage.setItem("object_num",tooltipEnabledObjects_drillhole.length);
    }
    else if(opt==1){
        mountain_cylinder[i].rotation.x = Math.PI/2;
        var len_x = Math.abs(xy_val[0] - xy_val[1]);
        var len_y = Math.abs(xy_val[2] - xy_val[3]);
        
        var len_x1 = Math.abs(xy_val[0]-mountain_drillhole_info[i][0]);
        var len_y1 = Math.abs(xy_val[3]-mountain_drillhole_info[i][1]);

        var len_x_fin = (Math.abs(len_x1/len_x))*100.0;
        var len_y_fin = (Math.abs(len_y1/len_y))*100.0;

        mountain_cylinder[i].position.x = len_x_fin-50;
        mountain_cylinder[i].position.y = len_y_fin-50;
        mountain_cylinder[i].position.z = -1*(parseFloat(mountain_drillhole_info[i][15])+parseFloat(mountain_drillhole_info[i][14]))/2;

        scene.add(mountain_cylinder[i]);
        tooltipEnabledObjects_drillhole_mountain.push(mountain_cylinder[i]);
        // localStorage.setItem("object_num",tooltipEnabledObjects_drillhole.length);
    }	
    else{
        plane_cylinder[i].rotation.x = Math.PI/2;
        var len_x = Math.abs(xy_val[0] - xy_val[1]);
        var len_y = Math.abs(xy_val[2] - xy_val[3]);
        
        var len_x1 = Math.abs(xy_val[0]-plane_drillhole_info[i][0]);
        var len_y1 = Math.abs(xy_val[3]-plane_drillhole_info[i][1]);

        var len_x_fin = (Math.abs(len_x1/len_x))*100.0;
        var len_y_fin = (Math.abs(len_y1/len_y))*100.0;

        plane_cylinder[i].position.x = len_x_fin-50;
        plane_cylinder[i].position.y = len_y_fin-50;
        plane_cylinder[i].position.z = -1*(parseFloat(plane_drillhole_info[i][31])+parseFloat(plane_drillhole_info[i][30]))/2;

        scene.add(plane_cylinder[i]);
        tooltipEnabledObjects_drillhole_plane.push(plane_cylinder[i]);
    }	
}


//190921
function clear_other_obj(i, opt){
    if(opt==0){
        scene.remove(cylinder[i]);
    }
    else if(opt==1){
        scene.remove(mountain_cylinder[i]);
    }	
    else{
        scene.remove(plane_cylinder[i]);
    }	
}


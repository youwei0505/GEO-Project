var side_on = 1;
var wf_on = 0;

// camera and controls
var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

camera.position.set(0, -100, 100);

var controls = createControls(camera, renderer.domElement);
restoreView(controls, vars);
addDefaultKeyEventListener();

function showInfo() {
    //var str = (typeof controlHelp === "undefined") ? "INFO：" : "震源位置：xxx <br>";
    //str += "震源深度：xxx <br>";
    //document.getElementById("info").innerHTML = str;
    //var help = (typeof controlHelp === "undefined") ? "* Keys" : controlHelp.split("\n").join("<br>");
    var help = "↑ ↓ ← →：水平移動模型<br>Shift + s：擷取畫面<br>Shift + ↑ ↓ ← →：移動視角<br>Ctrl + ↑ ↓ ← →：旋轉模型<br>Shift + Ctrl + ↑ ↓： 放大(縮小)<br>R：自動旋轉(on/off)<br>U：水平翻轉模型<br>"
    document.getElementById("usage").innerHTML = help;
    
    document.getElementById("pageinfo").style.display = "block";
    document.getElementById("queryresult").style.display = "none";
    document.getElementById("popup").style.display = "block";
}

localStorage.setItem("side_storage",side_on);
function click_side_btn(){
    if(side_on == 0){
        side_on = 1;
        localStorage.setItem("side_storage",side_on);
        document.getElementById("side_button").innerText = "關閉底座";//change text:innerText!
        scene.add(plane_bottom);
        scene.add(mesh_1);
        scene.add(mesh_2);
        scene.add(mesh_3);
        scene.add(mesh_4);
        document.getElementById("myRange").disabled = true;
        document.getElementById("myRange").value = 1.0;
        z_rate = 1.0;
        var j = 0;
        var m = geometry_plane.vertices.length;
        while(j < m){
            geometry_plane.vertices[j].z = arr_h[j]*z_rate;
            j++;
        }
        geometry_plane.dynamic = true;
        geometry_plane.computeFaceNormals();
        geometry_plane.computeVertexNormals();
        geometry_plane.normalsNeedUpdate = true;
        geometry_plane.verticesNeedUpdate = true;
        document.getElementById("val_z").innerHTML = "高度倍率：" + z_rate;
        /////////
    }
    else if(side_on == 1){
        side_on = 0;
        localStorage.setItem("side_storage",side_on);
        document.getElementById("side_button").innerText = "開啟底座";
        scene.remove(plane_bottom);
        scene.remove(mesh_1);
        scene.remove(mesh_2);
        scene.remove(mesh_3);
        scene.remove(mesh_4);
        document.getElementById("myRange").disabled = false;
        /////////
    }
}


function closeClicked() {
    document.getElementById("popup").style.display = "none";
    queryMarker.visible = false;
}

localStorage.setItem("wf_storage",wf_on);
function click_wf_btn(){
    if(wf_on == 0){
        wf_on = 1;
        localStorage.setItem("wf_storage",wf_on);
        document.getElementById("wireframe_button").innerText = "關閉網格";//change text:innerText!
        scene.remove(plane);
        build_plane(scene);
        render();
    }
    else if(wf_on == 1){
        wf_on = 0;
        localStorage.setItem("wf_storage",wf_on);
        document.getElementById("wireframe_button").innerText = "開啟網格";//change text:innerText!
        scene.remove(plane);
        build_plane(scene);
        render();

    }
}

// Add default key event listener
function addDefaultKeyEventListener() {
    window.addEventListener("keydown", function(e){
        var keyPressed = e.which;
        if (keyPressed == 27) closeClicked(); // ESC
        else if (keyPressed == 73) showInfo();	// I
        else if (keyPressed == 76) toggleLabelVisibility();	// L
        else if (!e.ctrlKey && e.shiftKey) {
            if (keyPressed == 82) controls.reset();	 // Shift + R
            else if (keyPressed == 83) { // Shift + S
                takeScreenshot();
            }
        }
    });
}

//mouse click event
var click_flag = 0; //0: close / 1: open
let current_mouseX = 0, current_mouseY = 0;
function showTooltip() {
    // console.log("show");
    var divElement = $("#tooltip");
    if (divElement && latestMouseProjection){
        divElement.css({
            display: "block",
            opacity: 0.0
        });
        
        if(wall_on==1)
        {
            // console.log('wall onnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');
            for(let i = 0; i < tooltipEnabledObjects_drillhole.length; i++)
            {
                if(hoveredObj.uuid == tooltipEnabledObjects_drillhole[i].uuid){
                    let wallinformation = "計畫名稱 : " + drillhole_info[i][0];
                    wallinformation = wallinformation + "<br>計畫編號 : " + drillhole_info[i][9];
                    wallinformation = wallinformation + "<br>鑽井編號 : " + drillhole_info[i][8];
                    wallinformation = wallinformation + "<br>測量日期 : " + drillhole_info[i][12];
                    wallinformation = wallinformation + "<br>坐標 : " + drillhole_info[i][1] + ', ' + drillhole_info[i][2];
                    wallinformation = wallinformation + "<br>深度 : " + drillhole_info[i][4];
                    wallinformation = wallinformation + "<br>地下水位深度 : " + drillhole_info[i][11];
                    wallinformation = wallinformation + "<br>海拔 : " + drillhole_info[i][10];
                    wallinformation = wallinformation + "<br>執行組織 : " + drillhole_info[i][14];
                    wallinformation = wallinformation + "<br>執行人員 : " + drillhole_info[i][13];
                    wallinformation = wallinformation + "<br>細目 : ";
                    wallinformation = wallinformation + "<br>頂部高度 : " + -1*parseFloat(drillhole_info[i][5]);
                    wallinformation = wallinformation + "<br>底部高度 : " + -1*parseFloat(drillhole_info[i][6]);
                    wallinformation = wallinformation + "<br>代碼 : " + parseFloat(drillhole_info[i][7]);
                    document.getElementById("tooltip").innerHTML = wallinformation;
                    // console.log('drillhole_info : ', drillhole_info[i]);
                }
            }

            divElement.css({
                left: `${current_mouseX+10}px`,
                top: `${current_mouseY-125}px`
            });
        }

        if(mountain_wall_on==1){
            for(let i = 0; i < tooltipEnabledObjects_drillhole_mountain.length; i++){
                if(hoveredObj.uuid == tooltipEnabledObjects_drillhole_mountain[i].uuid){
                    let mountain_wallinformation = "測站編號 : " + mountain_drillhole_info[i][12];
                    mountain_wallinformation = mountain_wallinformation + "<br>測站名稱 : " + mountain_drillhole_info[i][11];
                    mountain_wallinformation = mountain_wallinformation + "<br>鑽井深度 : " + mountain_drillhole_info[i][2];
                    mountain_wallinformation = mountain_wallinformation + "<br>鑽井類型 : " + mountain_drillhole_info[i][13];
                    mountain_wallinformation = mountain_wallinformation + "<br>上方深度 : " + mountain_drillhole_info[i][14];
                    mountain_wallinformation = mountain_wallinformation + "<br>底部深度 : " + mountain_drillhole_info[i][15];
                    mountain_wallinformation = mountain_wallinformation + "<br>圖元代號 : " + mountain_drillhole_info[i][16];
                    mountain_wallinformation = mountain_wallinformation + "<br>行政區名稱 : " + mountain_drillhole_info[i][4];
                    mountain_wallinformation = mountain_wallinformation + "<br>地名名稱 : " + mountain_drillhole_info[i][3];
                    mountain_wallinformation = mountain_wallinformation + "<br>測站位置 : " + mountain_drillhole_info[i][9];
                    mountain_wallinformation = mountain_wallinformation + "<br>流域名稱 : " + mountain_drillhole_info[i][8];
                    mountain_wallinformation = mountain_wallinformation + "<br>坐標 : " + mountain_drillhole_info[i][0] + ', ' + mountain_drillhole_info[i][1];
                    mountain_wallinformation = mountain_wallinformation + "<br>海拔 : " + mountain_drillhole_info[i][5];
                    mountain_wallinformation = mountain_wallinformation + "<br>執行年分(西元) : " + mountain_drillhole_info[i][6];


                    // mountain_wallinformation = mountain_wallinformation + "<br>GEO_UNION : " + mountain_drillhole_info[i][7];
                    // mountain_wallinformation = mountain_wallinformation + "<br>STATION_ID : " + mountain_drillhole_info[i][10];

                    document.getElementById("tooltip").innerHTML = mountain_wallinformation;
                }
            }

            divElement.css({
                left: `${current_mouseX+10}px`,
                top: `${current_mouseY-125}px`
            });
        }

        if(plane_wall_on==1){
            for(let i = 0; i < tooltipEnabledObjects_drillhole_plane.length; i++){
                if(hoveredObj.uuid == tooltipEnabledObjects_drillhole_plane[i].uuid){
                    let plane_wallinformation = "測站代碼 : " + plane_drillhole_info[i][24];
                    plane_wallinformation = plane_wallinformation + "<br>測站名稱 : " + plane_drillhole_info[i][25];
                    plane_wallinformation = plane_wallinformation + "<br>鑽井深度 : " + plane_drillhole_info[i][2];
                    plane_wallinformation = plane_wallinformation + "<br>鑽井類型 : " + plane_drillhole_info[i][28];
                    plane_wallinformation = plane_wallinformation + "<br>上方深度 : " + plane_drillhole_info[i][30];
                    plane_wallinformation = plane_wallinformation + "<br>底部深度 : " + plane_drillhole_info[i][31];
                    plane_wallinformation = plane_wallinformation + "<br>圖元代號 : " + plane_drillhole_info[i][32];
                    plane_wallinformation = plane_wallinformation + "<br>行政區名稱 : " + plane_drillhole_info[i][9];
                    plane_wallinformation = plane_wallinformation + "<br>平原區域名稱 : " + plane_drillhole_info[i][29];
                    plane_wallinformation = plane_wallinformation + "<br>測站位置 : " + plane_drillhole_info[i][27];
                    plane_wallinformation = plane_wallinformation + "<br>流域名稱 : " + plane_drillhole_info[i][20];
                    plane_wallinformation = plane_wallinformation + "<br>坐標 : " + plane_drillhole_info[i][0] + ', ' + plane_drillhole_info[i][1];
                    plane_wallinformation = plane_wallinformation + "<br>基準高程 : " + plane_drillhole_info[i][11];
                    plane_wallinformation = plane_wallinformation + "<br>執行年分(民國) : " + plane_drillhole_info[i][13];
                    plane_wallinformation = plane_wallinformation + "<br>產製單位 : " + plane_drillhole_info[i][18];


                    // plane_wallinformation = plane_wallinformation + "<br>AREA_NMBR : " + plane_drillhole_info[i][7];
                    // plane_wallinformation = plane_wallinformation + "<br>BOOKS : " + plane_drillhole_info[i][8];
                    // plane_wallinformation = plane_wallinformation + "<br>COUNTY_NMBR : " + plane_drillhole_info[i][10];
                    // plane_wallinformation = plane_wallinformation + "<br>END_PROD_DATE : " + plane_drillhole_info[i][12];
                    // plane_wallinformation = plane_wallinformation + "<br>FCODE : " + plane_drillhole_info[i][14];
                    // plane_wallinformation = plane_wallinformation + "<br>MAPID : " + plane_drillhole_info[i][15];
                    // plane_wallinformation = plane_wallinformation + "<br>MSLINK : " + plane_drillhole_info[i][16];
                    // plane_wallinformation = plane_wallinformation + "<br>OFFICIAL_NAME : " + plane_drillhole_info[i][17];
                    // plane_wallinformation = plane_wallinformation + "<br>RIVER_AREA_NMBR : " + plane_drillhole_info[i][19];
                    // plane_wallinformation = plane_wallinformation + "<br>ROCK_BOTTOM_DEPTH : " + plane_drillhole_info[i][6];
                    // plane_wallinformation = plane_wallinformation + "<br>ROCK_DOWN_RACK_DATE : " + plane_drillhole_info[i][21];
                    // plane_wallinformation = plane_wallinformation + "<br>ROCK_TOP_DEPTH : " + plane_drillhole_info[i][5];
                    // plane_wallinformation = plane_wallinformation + "<br>ROCK_UP_DOWN_STATE : " + plane_drillhole_info[i][22];
                    // plane_wallinformation = plane_wallinformation + "<br>ROCK_UP_RACK_DATE : " + plane_drillhole_info[i][23];
                    // plane_wallinformation = plane_wallinformation + "<br>STATE_NAME : " + plane_drillhole_info[i][26];
                    
                    
                    document.getElementById("tooltip").innerHTML = plane_wallinformation;
                }
            }

            divElement.css({
                left: `${current_mouseX+10}px`,
                top: `${current_mouseY-125}px`
            });
        }


        if(earthquake_on == 1)
        {
            // console.log('eatthquake onnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');
            for(let i = 0; i < tooltipEnabledObjects_earthquake.length; i++)
            {
                if(hoveredObj.uuid == tooltipEnabledObjects_earthquake[i].uuid){
                    let showinformation = "類別 : " + earthquake_data[i][6];
                    showinformation = showinformation + "<br>時間 : " + earthquake_data[i][1];
                    showinformation = showinformation + "<br>坐標 : " + earthquake_data[i][2] + ', ' + earthquake_data[i][3];
                    showinformation = showinformation + "<br>規模 : " + earthquake_data[i][5];
                    showinformation = showinformation + "<br>深度 : " + -1*parseFloat(earthquake_data[i][4]);
                    
                    if(earthquake_data[i][6] == '地震活動'){
                        if(earthquake_data[i][7] != ""){
                            showinformation = showinformation + "<br>地點 : " + earthquake_data[i][7];
                        }
                        showinformation = showinformation + "<br><a href=\"#\" onclick=\"window.open('https://scweb.cwb.gov.tw/zh-tw/earthquake/details/" + earthquake_data[i][8] + "');\">連結</a>"

                    }
                    divElement.css({
                        left: `${current_mouseX+10}px`,
                        top: `${current_mouseY-125}px`
                    });
                    document.getElementById("tooltip").innerHTML = showinformation;
                }
            }
        }
        setTimeout(function() {
            divElement.css({
                opacity: 1.0
            });
        }, 250);
    }
}
function hideTooltip() {
    var divElement = $("#tooltip");
    if (divElement) {
        divElement.css({
            display: "none"
        });
    }
}
function updateMouseCoords(event, coordsObj) {
    coordsObj.x = ((event.clientX - renderer.domElement.offsetLeft + 0.5) / window.innerWidth) * 2 - 1;
    coordsObj.y = -((event.clientY - renderer.domElement.offsetTop + 0.5) / window.innerHeight) * 2 + 1;
    current_mouseX = event.clientX;
    current_mouseY = event.clientY;
}

var intersects_drill;
var intersects_mountain_drill;
var intersects_plane_drill;
var intersects_earth;
function handleManipulationUpdate(e) {
    
    var object_num = localStorage.getItem("object_num");
        
    var canvasOffset = offset(renderer.domElement);
    var mx = e.clientX - canvasOffset.left;
    var my = e.clientY - canvasOffset.top;
    var x = (mx / width) * 2 - 1;
    var y = -(my / height) * 2 + 1;
    var vector = new THREE.Vector3(x, y, 1);
    vector.unproject(camera);    
    // projector.unprojectVector(vector, camera);    
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());    
    intersects_drill = raycaster.intersectObjects(tooltipEnabledObjects_drillhole);
    intersects_mountain_drill = raycaster.intersectObjects(tooltipEnabledObjects_drillhole_mountain);
    intersects_plane_drill = raycaster.intersectObjects(tooltipEnabledObjects_drillhole_plane);
    intersects_earth = raycaster.intersectObjects(tooltipEnabledObjects_earthquake);//
    
    if (intersects_drill.length > 0 && intersects_earth.length <= 0 && intersects_mountain_drill.length <= 0 && intersects_plane_drill.length <= 0) {
        latestMouseProjection = intersects_drill[0].point;
        hoveredObj = intersects_drill[0].object;
    }
    else if (intersects_earth.length > 0 && intersects_drill.length <= 0 && intersects_mountain_drill.length <= 0 && intersects_plane_drill.length <= 0) {
        latestMouseProjection = intersects_earth[0].point;
        hoveredObj = intersects_earth[0].object;
    }
    else if(intersects_mountain_drill.length > 0 && intersects_earth.length <= 0 && intersects_drill.length <= 0 && intersects_plane_drill.length <= 0){
        latestMouseProjection = intersects_mountain_drill[0].point;
        hoveredObj = intersects_mountain_drill[0].object;
    }
    else if(intersects_plane_drill.length > 0 && intersects_earth.length <= 0 && intersects_mountain_drill.length <= 0 && intersects_drill.length <= 0){
        latestMouseProjection = intersects_plane_drill[0].point;
        hoveredObj = intersects_plane_drill[0].object;
    }


    if ((tooltipDisplayTimeout || !latestMouseProjection) && (click_flag == 0)) {
        clearTimeout(tooltipDisplayTimeout);
        tooltipDisplayTimeout = undefined;
        hideTooltip();
    }
    if (!tooltipDisplayTimeout && latestMouseProjection || (click_flag == 1)) {
        tooltipDisplayTimeout = setTimeout(function() {
            tooltipDisplayTimeout = undefined;
            showTooltip();
        }, 330);
    }
}

function handleManipulationUpdate_click(e) {
    var canvasOffset = offset(renderer.domElement);
    var mx = e.clientX - canvasOffset.left;
    var my = e.clientY - canvasOffset.top;
    var x = (mx / width) * 2 - 1;
    var y = -(my / height) * 2 + 1;
    var vector = new THREE.Vector3(x, y, 1);
    vector.unproject(camera);    
    // projector.unprojectVector(vector, camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    
    intersects_drill = raycaster.intersectObjects(tooltipEnabledObjects_drillhole);
    intersects_mountain_drill = raycaster.intersectObjects(tooltipEnabledObjects_drillhole_mountain);
    intersects_plane_drill = raycaster.intersectObjects(tooltipEnabledObjects_drillhole_plane);
    intersects_earth = raycaster.intersectObjects(tooltipEnabledObjects_earthquake);

    if(intersects_drill.length > 0 && intersects_earth.length <= 0 && intersects_mountain_drill.length <= 0 && intersects_plane_drill.length <= 0){
        latestMouseProjection = intersects_drill[0].point;
        hoveredObj = intersects_drill[0].object;
        //click_flag = 0; //0: close / 1: open
        if(click_flag == 0){ click_flag = 1;}
        else{click_flag = 0;}
    }
    else if (intersects_earth.length > 0/* && intersects_drill.length <= 0 && intersects_mountain_drill.length <= 0 && intersects_plane_drill.length <= 0*/) {
        latestMouseProjection = intersects_earth[0].point;
        hoveredObj = intersects_earth[0].object;
        if(click_flag == 0){ click_flag = 1;}
        else{click_flag = 0;}
    }
    else if(intersects_mountain_drill.length > 0 && intersects_earth.length <= 0 && intersects_drill.length <= 0 && intersects_plane_drill.length <= 0){
        latestMouseProjection = intersects_mountain_drill[0].point;
        hoveredObj = intersects_mountain_drill[0].object;
        if(click_flag == 0){ click_flag = 1;}
        else{click_flag = 0;}
    }
    else if(intersects_plane_drill.length > 0 && intersects_earth.length <= 0 && intersects_mountain_drill.length <= 0 && intersects_drill.length <= 0){
        latestMouseProjection = intersects_plane_drill[0].point;
        hoveredObj = intersects_plane_drill[0].object;
        if(click_flag == 0){ click_flag = 1;}
        else{click_flag = 0;}
    }
    // console.log(click_flag);
    if(click_flag == 0){ // close
        hideTooltip();
    }
    else{
        showTooltip();
    }
   
}

function onMouseMove(event) {
    if(earthquake_on==1 || wall_on==1 || mountain_wall_on==1 || plane_wall_on==1){
        updateMouseCoords(event, mouse);
        latestMouseProjection = undefined;
        hoveredObj = undefined;
        handleManipulationUpdate(event);
    }
}

function onMouseClick(event){
    if(earthquake_on==1 || wall_on==1 || mountain_wall_on==1 || plane_wall_on==1){
        updateMouseCoords(event, mouse);
        latestMouseProjection = undefined;
        hoveredObj = undefined;
        handleManipulationUpdate_click(event);
    }
}

window.addEventListener('mousemove', onMouseMove, false);

//190812 add mouse click event
window.addEventListener('mousedown', onMouseClick, false);
render();

function render() {
    controls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    updateLabels();
}

function object_clicked(objs) {
    var obj = objs[0];
    queryMarker.position.set(obj.point.x, obj.point.y, obj.point.z);
    queryMarker.visible = true;
    var object = obj.object;
    var pt = world.toMapCoordinates(obj.point.x, obj.point.y, obj.point.z);
    var r = [];
    r.push("Clicked coordinates");
    r.push(" X: " + pt.x.toFixed(2));
    r.push(" Y: " + pt.y.toFixed(2));
    r.push(" Z: " + pt.z.toFixed(2));

    document.getElementById("Cursor_Coord").innerHTML = pt.x.toFixed(2) + ", " + +pt.y.toFixed(2);
    document.getElementById("queryresult").innerHTML = r.join("<br>");
    document.getElementById("queryresult").style.display = "block";
    document.getElementById("pageinfo").style.display = "none";
    document.getElementById("popup").style.display = "block";
}


// Called from *Controls.js when canvas is clicked
function canvas_clicked(e) {
    if (object_clicked === undefined) return;
    var canvasOffset = offset(renderer.domElement);
    var mx = e.clientX - canvasOffset.left;
    var my = e.clientY - canvasOffset.top;
    var x = (mx / width) * 2 - 1;
    var y = -(my / height) * 2 + 1;
    var vector = new THREE.Vector3(x, y, 1);
    vector.unproject(camera);    
    // projector.unprojectVector(vector, camera);
    var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())
    var objs = ray.intersectObjects(queryableObjs);
    if(objs.length > 0) object_clicked(objs);
}

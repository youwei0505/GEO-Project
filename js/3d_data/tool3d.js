function reverseArr(arr, left, right) {
    while (left < right) {
        var temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
    return arr;
}

function clk_model(){
    world = new World([1586263.69261,5028319.00199,1590281.07303,5030555.5249],100,3.0,0.0);
    lyr[0] = new MapLayer({q:1,stats:{max:587.641723633,min:34.0071563721},type:"dem",name:"terrain hights",dem:[{width:99,s:{},plane:{width:100,offsetX:0,offsetY:0,height:100},t:{},height:99}]})
    // lyr[0] = new MapLayer({q:1,stats:{max:587.641723633,min:34.0071563721},type:"dem",name:"terrain hights",dem:[{width:parseInt(scale_width),s:{},plane:{width:parseInt(scale_width)+1,offsetX:0,offsetY:0,height:parseInt(scale_height)+1},t:{},height:parseInt(scale_height)}]})
    lyr[0].dem[0].data = arr_h;
    lyr[0].dem[0].t.data = localStorage.getItem("resize_img");    
    console.log('scale width:', scale_width);
    console.log('scale height:', scale_height);
    // console.log(lyr[0].dem[0].t.data);
    // build models
    // console.log('arr_h');
    // console.log(arr_h);
    // console.log(arr_h.length);
    buildModels(scene);
    
    container.appendChild(renderer.domElement);
    render();
}

function takeScreenshot() {
    // open in new window like this
    var w = window.open('', '');
    w.document.title = "Screenshot";
    var img = new Image();
    // Without 'preserveDrawingBuffer' set to true, we must render now
    renderer.render(scene, camera);
    img.src = renderer.domElement.toDataURL();
    w.document.body.appendChild(img);  
}

function currentViewUrl() {
    var c = controls.object.position, t = controls.target, u = controls.object.up;
    var hash = "#cx=" + c.x + "&cy=" + c.y + "&cz=" + c.z;
    if (t.x || t.y || t.z) hash += "&tx=" + t.x + "&ty=" + t.y + "&tz=" + t.z;
    if (u && (u.x || u.y || u.z != 1)) hash += "&ux=" + u.x + "&uy=" + u.y + "&uz=" + u.z;
    return window.location.href.split("#")[0] + hash;
}

function offset(elm) {
    var top = left = 0;
    do {
        top += elm.offsetTop || 0; left += elm.offsetLeft || 0; elm = elm.offsetParent;
    } while(elm);
    return {top: top, left: left};
}

function parseParams() {
    var p, vars = {};
    window.location.search.substring(1).split('&').forEach(function (param) {
        p = param.split('=');
        vars[p[0]] = p[1];
    });
    window.location.hash.substring(1).split('&').forEach(function (param) {
        p = param.split('=');
        vars[p[0]] = p[1];
    });
    return vars;
}

// Restore camera position and target position
function restoreView(controls, vars) {
    if (vars === undefined) return;
    if (vars.tx !== undefined) controls.target.set(vars.tx, vars.ty, vars.tz);
    if (vars.cx !== undefined) controls.object.position.set(vars.cx, vars.cy, vars.cz);
    if (vars.ux !== undefined) controls.object.up.set(vars.ux, vars.uy, vars.uz);
}


function create_menu(){
    var w = $("#menu_slider_content").width();
    h = $(window).height();
    h = h-105;
    $('#menu_slider_content').css('height',h+'px');
    $("#menu_tab").click(function () {
        if ($("#menu_slider_scroll").css('right') == ("-" + w + 'px')){
            $("#menu_slider_scroll").animate({ right: '0px' }, 600, 'swing');
            document.getElementById("menu_tab").innerHTML = ' <span>►</span><span>輔</span><span>助</span><span>選</span><span>單</span>';                      
        }
        else {
            $("#menu_slider_scroll").animate({ right: '-' + w + 'px' }, 600, 'swing');
            document.getElementById("menu_tab").innerHTML = '<span>◄</span><span>輔</span><span>助</span><span>選</span><span>單</span>';
        }
    });	
    
}

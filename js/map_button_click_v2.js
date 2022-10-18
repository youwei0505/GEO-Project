function get_terrain_data_v2(){
	
	var resize_url;
	//var h_, w_;
	//document.getElementById('button_png_v2').addEventListener('click', function() {
		maps[0].once('postcompose', function(event) {
			//console.log("!!!");
			var canvas = event.context.canvas;
			//img.setAttribute('style','transform:rotate(180deg)');			
			canvas_url = canvas.toDataURL();
			
			var canvas_png = document.getElementById('canvas_png');
			//canvas_png.setAttribute('style','transform:rotate(180deg)');
			
			h_ = canvas.height;
			w_ = canvas.width;
			
			var rectcollection = canvas.getClientRects();

			localStorage.setItem("_h", h_);
			localStorage.setItem("_w", w_);
			
			ctx = canvas_png.getContext('2d');
			
			width = 785;
			height = 785;
			canvas_png.width = width;
			canvas_png.height = height;
			
			//canvas_png.setAttribute('style','transform:rotate(180deg)');
			
			var i = new Image(); 
			var sWidth;
			var sHeight;

			i.onload = function(){
				sWidth = i.width;
				sHeight = i.height;
			};	

			i.src = canvas_url; 
			
			
			var image = new Image();
			image.onload = function() {
				if(sWidth > sHeight){
					sWidth = sHeight;
				}
				else{
					sHeight = sWidth;
				}
				
				localStorage.setItem("_sw", sWidth);
				localStorage.setItem("_sh", sHeight);
				var _h = localStorage.getItem("_h");
				var _w = localStorage.getItem("_w");
				
				ctx.translate(785,785);
				ctx.rotate(Math.PI);
				
				ctx.drawImage(image, (_w - sWidth)/2, (_h - sHeight)/2, sWidth, sHeight, 0, 0, 785, 785);
				
				//***//
				resize_url = canvas_png.toDataURL('image/png');
				localStorage.setItem("resize_img", resize_url);
				
			};	
			image.src = canvas_url;
			
			canvas_png.style.display = "none";
		});
		maps[0].renderSync();
		maps[0].addControl(new ol.control.Zoom({
			className: 'custom-zoom'
		}));
	//});
	
	var _h = localStorage.getItem("_h");
	var _w = localStorage.getItem("_w");
	//console.log(_w, _h);
	
	var up = "23.843137735416278";
	var down = "23.755181766112628";
	var left = "120.50251007080078";
	var right = "120.6233596801758";
	
	var _w1, _h1;
	if(_w > _h){ 
		_w1 = _h;
		_h1 = _h;
	}
	else{
		_w1 = _w;
		_h1 = _w;
	}
	//console.log(_w1,_h1);
	var extentMap = map.getView().calculateExtent([_w1,_h1]);
	var center = map.getView().getCenter();
	//var centerInPx = map.getPixelFromCoordinate(center)
	//var t_r = map.getView().getTopRight();

	var b_l = ol.extent.getBottomLeft(extentMap);
	var t_r = ol.extent.getTopRight(extentMap);
	var bottomLeft = ol.proj.transform(ol.extent.getBottomLeft(extentMap),'EPSG:3857', 'EPSG:4326');
    var topRight = ol.proj.transform(ol.extent.getTopRight(extentMap),'EPSG:3857', 'EPSG:4326');
    var bottomRight = ol.proj.transform(ol.extent.getBottomRight(extentMap),'EPSG:3857', 'EPSG:4326');
    var topLeft  = ol.proj.transform(ol.extent.getTopLeft(extentMap),'EPSG:3857', 'EPSG:4326');
	//var temp_center = ol.proj.transform(([center[0]+10000,center[1]]),'EPSG:3857', 'EPSG:4326');
	
	left = bottomLeft[0];
	down = bottomLeft[1];
	right = topRight[0];
	up = topRight[1];

	map.updateSize();
	var ex = map.getView().calculateExtent(map.getSize());
	
	//console.log(_h);
	//console.log(_w);
	
	
	//var worlds = Math.floor((value + 180) / 360);
	
	var box_array = (String(ex)).split(",");
	var temp_h = (parseFloat(box_array[3]) - parseFloat(box_array[1]));
	//console.log(temp_h);
		
	var right_temp = (parseInt(box_array[0]-temp_h*1.85)).toString(); //-
	var left_temp = (parseInt(box_array[0]+temp_h*1.5)).toString();
	
	var bottomLeft_ = ol.proj.transform(ol.extent.getBottomLeft(ex),'EPSG:3857', 'EPSG:4326');
    var topRight_ = ol.proj.transform(ol.extent.getTopRight(ex),'EPSG:3857', 'EPSG:4326');
	
	left = bottomLeft_[0];
	down = bottomLeft_[1];
	right = topRight_[0];
	up = topRight_[1];
	
	var x1 = right;
	var x2 = left;
	var y1 = down;
	var y2 = up;
	var getInput = x1 + "/" + x2 + "/" + y1 + "/" + y2;
	localStorage.setItem("storageName", getInput);
    localStorage.setItem("date_from", '2000-1-1');
    localStorage.setItem("date_to", $('#earthquake_date_to').val());
    localStorage.setItem("min_depth", 1);
    localStorage.setItem("max_depth", 720);
    localStorage.setItem("min_mag", 0);
    localStorage.setItem("max_mag", 10);
	localStorage.setItem("earthquake_opt", 1);
	
	var show_type = 0;
	localStorage.setItem("show_type", show_type);

	var exp  = new Date();
	exp.setTime(exp.getTime() + 60*1000);
	
	document.cookie = "left" + "="+ escape (left_temp) + ";expires=" + exp.toGMTString();
	document.cookie = "right" + "="+ escape (right_temp) + ";expires=" + exp.toGMTString();
	document.cookie = "up" + "="+ escape (box_array[3]) + ";expires=" + exp.toGMTString();
	document.cookie = "down" + "="+ escape (box_array[1]) + ";expires=" + exp.toGMTString();
	
	localStorage.setItem("_left", left_temp);
	localStorage.setItem("_right", right_temp);
	localStorage.setItem("_up", box_array[3]);
	localStorage.setItem("_down", box_array[1]);
	
	map.renderSync();
	
	//aps[map_ind].removeLayer(vector_box);
   //maps[map_ind].removeLayer(vector_box);
	
	setTimeout(function(){
		//clear_map();
		document.getElementById("button_png_v2").click();
	}, 1500); 
	
	localStorage.setItem("flag_1021", 1);
	
	
}

function get_terrain_data(){
	let opt = 0;
	var resize_url;
    maps[0].once('postcompose', function(event) {
        let canvas = event.context.canvas;
        canvas_url = canvas.toDataURL();
        let canvas_png = document.getElementById('canvas_png');
        ctx = canvas_png.getContext('2d');
        
        width = 785;
        height = 785;
        canvas_png.width = width;
        canvas_png.height = height;
                
        let i = new Image(); 
        let sWidth;
        let sHeight;

        i.onload = function(){
            sWidth = i.width;
            sHeight = i.height;
        };	
        i.src = canvas_url; 
        
        let image = new Image();
        image.onload = function() {
            if(sWidth > sHeight){
                sWidth = sHeight;
            }
            else{
                sHeight = sWidth;
            }
            
            localStorage.setItem("_sw", sWidth);
            localStorage.setItem("_sh", sHeight);
            
            ctx.translate(785,785);
            ctx.rotate(Math.PI);
            
            ctx.drawImage(image, (canvas.width - sWidth)/2, (canvas.height - sHeight)/2, sWidth, sHeight, 0, 0, 785, 785);
            
            resize_url = canvas_png.toDataURL('image/png');
            localStorage.setItem("resize_img", resize_url);

            let extentMap = map.getView().calculateExtent([sWidth, sHeight]);

            let bottomLeft = ol.proj.transform(ol.extent.getBottomLeft(extentMap),'EPSG:3857', 'EPSG:4326');
            let topRight = ol.proj.transform(ol.extent.getTopRight(extentMap),'EPSG:3857', 'EPSG:4326');
            
            left = bottomLeft[0];
            down = bottomLeft[1];
            right = topRight[0];
            up = topRight[1];

            let getInput = right + "/" + left + "/" + down + "/" + up;
            localStorage.setItem("storageName", getInput);
            localStorage.setItem("date_from", '2000-1-1');
            localStorage.setItem("date_to", $('#earthquake_date_to').val());
            localStorage.setItem("min_depth", 1);
            localStorage.setItem("max_depth", 720);
            localStorage.setItem("min_mag", 0);
            localStorage.setItem("max_mag", 10);
            localStorage.setItem("earthquake_opt", 1);
            
            let show_type = 0;
            localStorage.setItem("show_type", show_type);
            
            map.renderSync();
            localStorage.setItem("flag_1021", 1);
            
			localStorage.setItem("search_coordinate", localStorage.getItem("storageName", getInput));
			localStorage.setItem("date_from", '2000-1-1');
			localStorage.setItem("date_to", $('#earthquake_date_to').val());
	
			localStorage.setItem("min_depth", 0);
			localStorage.setItem("max_depth", 720);
	
			localStorage.setItem("min_mag", 0);
			localStorage.setItem("max_mag", 10);
			localStorage.setItem("earthquake_opt", 1);
			
			let dest_url = window.location.href.split('/src')[0] + "/js/3d_data/index_3d.php"
			window.open(dest_url);
        };	
        image.src = canvas_url;
        canvas_png.style.display = "none";
    });

    maps[0].renderSync();
    maps[0].addControl(new ol.control.Zoom({
        className: 'custom-zoom'
    }));

}





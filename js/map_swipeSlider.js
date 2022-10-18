
var swipe_map10_ind = 0;
var swipe_map11_ind = 0;
var swipe_map20_ind = 0;
var swipe_map21_ind = 0;
var swipe_on_open;

var present_map_index = 0;

var map0_center = [];
var map0_zoom = 8;
var map1_center = [];
var map1_zoom = 8;


$(document).ready(function () {

	var extent = maps[0].getView().calculateExtent(map.getSize());
	map0_center = [((extent[0] + extent[2]) / 2), ((extent[3] + extent[1]) / 2)];
	extent = maps[1].getView().calculateExtent(map.getSize());
	map1_center = [((extent[0] + extent[2]) / 2), ((extent[3] + extent[1]) / 2)];

	document.getElementById("swipeSlider").addEventListener('input', function () {
		/*
		if (map_ind == 1) {
			maps[1].render();
		} else {
			maps[0].render();
		}
		*/



		/* test new ver 
		
		map0_w = ((0.008 * document.getElementById("swipeSlider").value + 0.1) * 100).toString() + '%';
		map1_w = (((-0.008) * document.getElementById("swipeSlider").value + 0.9) * 100).toString() + '%';
		
		document.getElementById('map0').style.width = map0_w;
		document.getElementById('map1').style.width = map1_w;		  
		//maps[0].updateSize();
		//maps[1].updateSize();

				
		//maps[1].render();
		//maps[0].render();
		
		*/

		const screen_w = $("#map0").width();
		const screen_h = $("#map1").height();
		
		const slider_w = 32;	// from swipeSlider.css
		const slider_bar_w = $("#swipeSlider").width();
		const slider_bar_l = $("#swipeSlider").offset().left + slider_w / 2;
		
		const slider_val = $("#swipeSlider").val();

		const map0_w = slider_bar_l + (slider_bar_w - slider_w) * (slider_val / 100);

		$("#map0").css("clip", `rect(0px, ${map0_w}px, ${screen_h}px, 0px)`);
		$("#map1").css("clip", `rect(0px, ${screen_w}px, ${screen_h}px, ${map0_w}px)`);
	}, false);

	swipe_on_open = 1;

});


// 視窗滑動切換
function map_win_slide_change(map_win_slide_index) {
	if (map_win_slide_index == 0) {
		$("$swipeSlider").style.display = "none";


		$('#two_maps').css("overflow", "");
		//$('#two_maps').css("display","block")
		//$('#two_maps').css("position","absolute")

		$('#map0').css("z-index", "");
		$('#map1').css("z-index", "");
		$('#map0').css("position", "");
		maps[0].updateSize();
		maps[1].updateSize();

		$("#canvas_title").css("display", "");
		$("#canvas_content").css("display", "");

		if (present_map_index == 0) {
			map_win_single();
		} else if (present_map_index == 1) {
			map_win_double();
		}

		swipe_on_open = 1;


	}
	else {
		present_map_index = map_win_change_index;

		if (map_win_change_index == 0) {
			map_win_single();
		}

		$("#swipeSlider").css("display", "none");
		//$('#two_maps').css("display","block")
		//$('#two_maps').css("position","absolute")



		const screen_w = $("#map0").width();
		const screen_h = $("#map1").height();
		
		const slider_w = 32;	// from swipeSlider.css
		const slider_bar_w = $("#swipeSlider").width();
		const slider_bar_l = $("#swipeSlider").offset().left + slider_w / 2;
		
		const slider_val = $("#swipeSlider").val();

		const map0_w = slider_bar_l + (slider_bar_w - slider_w) * (slider_val / 100);

		$("#map0").css("clip", `rect(0px, ${map0_w}px, ${screen_h}px, 0px)`);
		$("#map1").css("clip", `rect(0px, ${screen_w}px, ${screen_h}px, ${map0_w}px)`);

		$("$swipeSlider").style.display = "inline";
		$('#map1').width('100%');
		$('#map1').height('100%');
		$('#map0').css("width", $("#map1").width());
		$('#map0').css("height", $("#map1").height());
		$('#map0').css("z-index", "20");
		$('#map1').css("z-index", "10");
		$('#map0').css("position", "fixed");
		maps[0].updateSize();
		maps[1].updateSize();

		$("#canvas_title").css("display", "none")
		$("#canvas_content").css("display", "none")

		swipe_on_open = 0;
	}

}

function map_slide_precompose(event) {
	var ctx = event.context;
	var width = ctx.canvas.width * ((0.8 * document.getElementById("swipeSlider").value + 10) / 100) - 0.32 * document.getElementById("swipeSlider").value + 16;

	//console.log("precomp")

	ctx.save();
	ctx.beginPath();
	ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
	ctx.clip();
}

function map_slide_postcompose(event) {
	var ctx = event.context;
	ctx.restore();
}

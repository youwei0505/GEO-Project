$(document).ready(function () {

    /********* component init ***********/
    var dhxWins = new dhtmlXWindows();
    terrain_w1 = dhxWins.createWindow("terrain_w1", 150, 150, 400, 450);
    terrain_w1.setText("3d地形建置");
	
    var draw_html = "";	
	$.ajax({
		url: 'html/terrain.html',
		type: 'get',
		async: false,
		success: function(html) {
			var terrain_html = String(html);			
			terrain_w1.attachHTMLString(terrain_html);
			
		}
	});
	//loadcity();
    //btn_enable();
	canvas_png.style.display = "none";
	button_png_v2.style.display= "none";
	
	toolItemNum = 1
	for (var i = 1; i <= toolItemNum; i++) {
		$("#toolItem" + i.toString()).on('click', function(){
			if ( !$(this).hasClass('item active') ) {
				$(this)
					.addClass('active')
					.siblings('.item')
						.removeClass('active');
			}
			
			token = $(this).attr('id').split('toolItem')[1]
			$("#3d_model").css("display", "inline")
		})
	}
	// default : otherAPIs
	$("#3d_model").css("display", "inline")
 
    terrain_w1.attachEvent("onClose", function(){
        terrain_w1.hide();
        terrain_w1.setModal(false);
        return false;
    });
    terrain_w1.hide();
});
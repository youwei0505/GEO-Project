/********* 20220510 add ***********/
$(document).ready(function () {
    /********* 20220510 add ***********/
    /********* 定位工具 component init ***********/
    var dhxWins = new dhtmlXWindows();
    Location_w1 = dhxWins.createWindow("location_w1", 1200, 100, 500, 700);
    Location_w1.setText("定位工具");
	Location_w1.showInnerScroll();
    console.log('Location_w1 Done !');
	
    var location_html = "";	
	$.ajax({
		url: 'html/location.html',
		type: 'get',
		async: false,
		success: function(html) {
			var location_html = String(html);
						
			// debug
			// console.log("test location_html '" + location_html + "'");
			
			Location_w1.attachHTMLString(location_html);
            //在src/畫面上的重複點集
			Location_w1.attachEvent("onClose", function(win){
                Location_w1.hide();
                Location_w1.setModal(false);
                return false;
                });
            Location_w1.hide();
		}
    });
    /********* 20220510 add ***********/
});
/********* 20220510 add ***********/
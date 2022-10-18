$(document).ready(function () {	
	$("#pointHeightInfile").change( function(){
		$('#PointHeightFileName').val($('#pointHeightInfile').val().substr($('#pointHeightInfile').val().lastIndexOf('\\') + 1));
	});
});


function getPointHeightFile() {
	$('#pointHeightInfile').click();
}


function getBatchPointHeight() {
		
		console.log($("#pointHeightInfile").val());
		
		var url="php/batch_point_height.php";
		var file=document.getElementById('pointHeightInfile').files[0];
		var outLink=document.getElementById('pointHeightInfileLink');
		
		var xHR = new XMLHttpRequest();
		
		var formD=new FormData();
		var web_url = "https://dtm.moi.gov.tw/services/polate/polate.asmx/getPolate";		
		//var data = 'TW_DLA_20010814_20061226_20M_3826';
		var data =document.getElementById('pointheight_data').value;
		formD.append("infile",file);
		formD.append('u',web_url);
		formD.append('d',data);
		
		xHR.open("POST",url,true);
		xHR.onreadystatechange=cb;
		xHR.send(formD);
		
		function cb(){
			if((xHR.readyState == 4)&&(xHR.status == 200)){
				//alert(file.name);
				//alert(xHR.responseText);
				//outLink.text=xHR.responseText;
				//var outfile=document.getElementById("out");
				//outfile.value=xHR.responseText;
				if(xHR.responseText=="請登入"){
					alert("請登入");
				}
				else{
					window.open(document.URL.substr(0,document.URL.lastIndexOf('/'))+xHR.responseText, '_blank');
				}
				
			}
		}
	}
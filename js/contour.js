



var contour_area_ulimit = 50.0;
var contour_area_dlimit = 4.0;

var contour_area;
var contour_cmd = "";

var contour_web_url;
var contour_wkt;
var contour_data;
var contour_left;
var contour_right;
var contour_up;
var contour_down;



function get_squrepoint_contour() {
	document.getElementById("space_lonlat").checked = true;

	clear_map();

	createMeasureTooltip();

	source_box = new ol.source.Vector({ wrapX: false });

	vector_box = new ol.layer.Vector({
		source: source_box,
		style: new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255, 255, 255, 0.2)'
			}),
			stroke: new ol.style.Stroke({
				color: '#ffcc33',
				width: 2
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: '#ffcc33'
				})
			})
		})
	});

	maps[map_ind].addLayer(vector_box);

	/*** add 1015 ***/
	vector_box.setZIndex(draw_box_zindex);
	/****************/

	value = 'LineString';
	maxPoints = 2;
	geometryFunction = function (coordinates, geometry) {
		if (!geometry) {
			geometry = new ol.geom.Polygon(null);
		}
		var start = coordinates[0];
		var end = coordinates[1];

		geometry.setCoordinates([
			[start, [start[0], end[1]], end, [end[0], start[1]], start]
		]);
		return geometry;
	};
	draw_box = new ol.interaction.Draw({
		source: source_box,
		type: /** @type {ol.geom.GeometryType} */ (value),
		geometryFunction: geometryFunction,
		maxPoints: maxPoints
	});

	maps[map_ind].addInteraction(draw_box);


	draw_box.on('drawstart',
		function (evt) {

			btn_disable();
			sketch = evt.feature;

			var tooltipCoord = evt.coordinate;

			listener = sketch.getGeometry().on('change', function (evt) {
				var geom = evt.target;
				var output;
				output = formatArea(geom);
				tooltipCoord = geom.getInteriorPoint().getCoordinates();

				var sourceProj = maps[map_ind].getView().getProjection();
				var geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
				var coordinates = geom_t.getLinearRing(0).getCoordinates();
				contour_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));

				measureTooltipElement.innerHTML = output;
				measureTooltip.setPosition(tooltipCoord);
			});

		}, this);

	draw_box.on('drawend',
		function (e) {

			btn_enable();

			clear_map();

			createMeasureTooltip();

			if (contour_area / 1000000 >= contour_area_dlimit && contour_area / 1000000 <= contour_area_ulimit) {
				box_array = (String(e.feature.getGeometry().getExtent())).split(",");

				loc_84 = ol.proj.transform([box_array[0], box_array[3]], 'EPSG:3857', 'EPSG:4326');

				contour_left = loc_84[0];
				contour_up = loc_84[1];

				loc_84 = ol.proj.transform([box_array[2], box_array[1]], 'EPSG:3857', 'EPSG:4326');

				contour_right = loc_84[0];
				contour_down = loc_84[1];

				maps[map_ind].removeInteraction(draw_box);



				// 傳送資料給後端抓取圖片	

				contour_web_url = "https://dtm.moi.gov.tw/services/contour/contour.asmx/getImage";
				contour_wkt = "POLYGON((" + contour_left + "%20" + contour_up + "," +
					contour_left + "%20" + contour_down + "," +
					contour_right + "%20" + contour_down + "," +
					contour_right + "%20" + contour_up + "," +
					contour_left + "%20" + contour_up + "))";
				contour_data = $("#contour_data").val();
				// 5米
				//"TW_DLA_20010814_20061226_5M_3826";

				contour_cmd = "ok"

			} else if (contour_area / 1000000 > contour_area_ulimit) {

				contour_cmd = "over"
			} else if (contour_area / 1000000 < contour_area_dlimit) {

				contour_cmd = "under"
			}



		}, this);


}

function get_contour_data() {


	if (contour_cmd === "ok") {

		btn_disable();

		loading_id = "l" + contour_num.toString();

		draw_w3_Tree.insertNewItem("0", loading_id, "loading...", function () { }, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');

		// disable button

		$("#contour_button").attr('disabled', true);

		draw_w3_Tree.enableCheckBoxes(false, false);

		$.ajax({
			type: "GET",
			url: "php/get_contour_image.php",
			dataType: "json",
			data: {
				u: contour_web_url,
				w: contour_wkt,
				d: contour_data,
				left: contour_left,
				right: contour_right,
				up: contour_up,
				down: contour_down
			},
			//jsonpCallback: 'callback',
			success: function (json) {


				var url = json.imgURL;

				if (json.getImg == true) {
					//alert("img url : " + json.data.link);

					contour_num = contour_num + 1;

					new_node_id = `{
						"PosInfo":"${((contour_up + contour_down) / 2.0).toString() + ";" + 
									 ((contour_left + contour_right) / 2.0).toString() + ";563426;8;" + 
									 json.imageWidth.toString() + ";" + 
									 json.imageHeight.toString() + ";" + 
									 contour_left.toString() + ";" + 
									 contour_down.toString() + ";" + 
									 contour_right.toString() + ";" + 
									 contour_up.toString()}",
						"Type":"ImageOverlay",
						"Url":"${json.imgFilePath}",
						"ID":"contour${contour_num.toString()}",
						"FileName":"等高線計算${contour_num.toString()}"
					}`.replace(/\n|\t/g, "").trim();
					
					

					// delete loading signal

					draw_w3_Tree.deleteItem(loading_id, false);
					draw_w3_Tree.enableCheckBoxes(true, true);

					// layer item

					draw_w3_Tree.insertNewChild("0", new_node_id, "等高線計算" + contour_num.toString(), function () { }, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');

					// download item


					draw_w3_Tree.insertNewItem(new_node_id, "d" + contour_num.toString(), "下載 .kmz 檔",
						function () {
							var idn = this.id.split("d");
							document.getElementById("download_iframe").src = json.kmz;
						}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');


					draw_w3_Tree.showItemCheckbox("d" + contour_num.toString(), false);


					// Download button Default : closed

					draw_w3_Tree.closeItem(new_node_id);

					// enable button

					btn_enable();



					/* imgur api :  upload image (previous version)

					$.ajax({
						type:	"POST",
						url:	"https://api.imgur.com/3/image",
						headers:	{
								'Authorization': 'Client-ID 8d82e759d5008bd'
						},
						data:	{
								image: url
						},
						dataType:	"json",
						success: 	function(json) {
							
					
						},
						error:	function(jqXHR) {
						
							// error
							alert("imgur error : " + jqXHR.status);
							draw_w3_Tree.deleteItem(loading_id, false);
							btn_enable();
							
						}
					});
					*/

				} else {
					alert("您沒有權限使用此資料類型");
					draw_w3_Tree.deleteItem(loading_id, false);
					btn_enable();
				}

			},
			error: function (jqXHR) {
				alert("error " + jqXHR.status);
				draw_w3_Tree.deleteItem(loading_id, false);

				btn_enable();

			}
		});
	} else if (contour_cmd === "over") {

		alert("請選取範圍小於 " + contour_area_ulimit + " 平方公里範圍進行分析!")
	} else if (contour_cmd === "under") {

		alert("請選取範圍大於 " + contour_area_dlimit + " 平方公里範圍進行分析!")
	} else {

		alert("尚未選擇區域或輸入有誤")
	}
}


//快捷產生KML檔
function quick_get_crop_image_x_y() {
    document.getElementById("space_lonlat").checked = true;
	fun_access_log("Func_Use_Share_1_3");
    clear_map();

    createMeasureTooltip();

    source_box = new ol.source.Vector({ wrapX: false });

    vector_box = new ol.layer.Vector({
        source: source_box,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.05)'
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
    alert("請點選並拖曳關注區域範圍進行截圖!");
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

    var mouse_x
    var mouse_y

    onmousemove = function (e) { mouse_x = e.clientX; mouse_y = e.clientY; }
    draw_box.on('drawstart',
        function (evt) {
            start_mouse_x = mouse_x;
            start_mouse_y = mouse_y;
            crop_image_coor_start = $('#Cursor_Coord').html()

            btn_disable();
			 
        }, this);


    draw_box.on('drawend',
        function (e) {
           
            box_array = (String(e.feature.getGeometry().getExtent())).split(",");

            loc_84 = ol.proj.transform([box_array[0], box_array[3]], 'EPSG:3857', 'EPSG:4326');

            crop_gif_left = loc_84[0];
            crop_gif_up = loc_84[1];

            loc_84 = ol.proj.transform([box_array[2], box_array[1]], 'EPSG:3857', 'EPSG:4326');

            crop_gif_right = loc_84[0];
            crop_gif_down = loc_84[1];

            end_mouse_x = mouse_x;
            end_mouse_y = mouse_y;
            crop_image_coor_end = $('#Cursor_Coord').html()


            btn_enable();

            clear_map();

            createMeasureTooltip();
			
			//alert("截圖產製KMZ檔，請稍後，橘色框選範圍消失後即完成...");
			var $dialog = $('<div></div>')
			.html('截圖產製KMZ檔，請稍後.....<br>橘色框選範圍消失後即完成...<br>*<a href="BigGIS截圖比例說明.pdf" target="_blank" title="詳細操作請參考"><font color="#FF0000">截圖產製比例跑掉了怎麼辦?!</font></a>')
			.dialog({
				autoOpen: false,
				title: ''
			});
			$dialog.dialog('open');
			
			setTimeout(function(){get_crop_kml();}, 100);
			setTimeout(function(){clear_map();}, 3000);
			
			

        }, this);
}
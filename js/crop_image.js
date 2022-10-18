var first_load = 1;

function ToGIFUpload() {
    $('#upload_crop_gif_text').val($('#upload_crop_gif').val().substr($('#upload_crop_gif').val().lastIndexOf('\\') + 1));
    first_load = 1;
}

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

var getTextHeight = function (font) {

    var text = $('<span>Hg</span>').css({ fontFamily: font });
    var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');

    var div = $('<div></div>');
    div.append(text, block);

    var body = $('body');
    body.append(div);

    try {

        var result = {};

        block.css({ verticalAlign: 'baseline' });
        result.ascent = block.offset().top - text.offset().top;

        block.css({ verticalAlign: 'bottom' });
        result.height = block.offset().top - text.offset().top;

        result.descent = result.height - result.ascent;

    } finally {
        div.remove();
    }

    return result.height;
};

// 產生螢幕截圖 with lines 
function screenshot_image(element, options = {}) {
    // our cropping context
    var canvas = document.createElement('canvas');
    var cropper = canvas.getContext("2d");
    // save the passed width and height
    let finalWidth = options.width
    let finalHeight = options.height
    let left = options.left
    let up = options.up
    let right = options.right
    let down = options.down
    // different degree for 經緯度 and TWD97
    var deg = 4//經緯度
    if (options.TWD97)//TWD97
    {
        deg = 0
    }
    // update the options value so we can pass it to h2c
    if (options.x) {
        options.width = finalWidth
    }
    if (options.y) {
        options.height = finalHeight
    }
    // chain h2c Promise
    blank_width = getTextWidth(up.toFixed(deg).toString(), "bold 8pt 微軟正黑體")
    var text_size = $('#gif_text_size').val()
    finalWidth = finalWidth + blank_width * 2;
    finalHeight = finalHeight + blank_width * 2;

    return html2canvas(element, options).then(c => {

        // do our cropping
        cropper.canvas.width = finalWidth;
        cropper.canvas.height = finalHeight;
        cropper.fillStyle = "white";
        cropper.fillRect(0, 0, finalWidth, finalHeight);
        //cropper.drawImage(c, -(+options.x || 0), -(+options.y || 0));
        cropper.drawImage(c, blank_width, blank_width);
        var img1 = document.getElementById('img1');
        cropper.globalAlpha = 1.0;
        cropper.drawImage(img1, blank_width, blank_width);
        var compass_icons = document.getElementById('compass_icons');
        cropper.globalAlpha = 2.0;
        cropper.drawImage(compass_icons, finalWidth - blank_width, 0, blank_width, blank_width);
        width = getTextWidth($('#gif_text').val(), "bold " + text_size + "pt 微軟正黑體")
        cropper.fillStyle = 'white';
        cropper.strokeStyle = 'black';
        cropper.lineWidth = 2;
        cropper.font = "bold " + text_size + "pt 微軟正黑體";
        cropper.fillText($('#gif_text').val(), finalWidth - blank_width - width, finalHeight - 5 - blank_width);
        cropper.strokeText($('#gif_text').val(), finalWidth - blank_width - width, finalHeight - 5 - blank_width);
        cropper.fill();
        cropper.stroke();
        cropper.lineWidth = 1;
        cropper.beginPath();
        cropper.moveTo(blank_width + (finalWidth - blank_width * 2) / 2, blank_width);
        cropper.lineTo(blank_width + (finalWidth - blank_width * 2) / 2, finalHeight - blank_width);
        cropper.stroke();
        cropper.lineWidth = 1;
        cropper.beginPath();
        cropper.moveTo(blank_width + (finalWidth - blank_width * 2) / 4, blank_width);
        cropper.lineTo(blank_width + (finalWidth - blank_width * 2) / 4, finalHeight - blank_width);
        cropper.stroke();
        cropper.lineWidth = 1;
        cropper.beginPath();
        cropper.moveTo(blank_width + (finalWidth - blank_width * 2) * 3 / 4, blank_width);
        cropper.lineTo(blank_width + (finalWidth - blank_width * 2) * 3 / 4, finalHeight - blank_width);
        cropper.stroke();
        cropper.lineWidth = 1;
        cropper.beginPath();
        cropper.moveTo(blank_width, blank_width + (finalHeight - blank_width * 2) / 2);
        cropper.lineTo(finalWidth - blank_width, blank_width + (finalHeight - blank_width * 2) / 2);
        cropper.stroke();
        cropper.lineWidth = 1;
        cropper.beginPath();
        cropper.moveTo(blank_width, blank_width + (finalHeight - blank_width * 2) / 4);
        cropper.lineTo(finalWidth - blank_width, blank_width + (finalHeight - blank_width * 2) / 4);
        cropper.stroke();
        cropper.lineWidth = 1;
        cropper.beginPath();
        cropper.moveTo(blank_width, blank_width + (finalHeight - blank_width * 2) * 3 / 4);
        cropper.lineTo(finalWidth - blank_width, blank_width + (finalHeight - blank_width * 2) * 3 / 4);
        cropper.stroke();
        height = getTextHeight(left.toFixed(deg).toString(), "bold 8pt 微軟正黑體");
        cropper.fillStyle = 'black';
        cropper.strokeStyle = 'black';
        cropper.lineWidth = 1;
        cropper.font = "bold 8pt 微軟正黑體";
        cropper.fillText(left.toFixed(deg).toString(), blank_width, finalHeight - blank_width + height);
        cropper.strokeText(left.toFixed(deg).toString(), blank_width, finalHeight - blank_width + height);
        cropper.fill();
        cropper.stroke();
        height = getTextHeight(left.toFixed(deg).toString(), "bold 8pt 微軟正黑體");
        cropper.fillStyle = 'black';
        cropper.strokeStyle = 'black';
        cropper.lineWidth = 1;
        cropper.font = "bold 8pt 微軟正黑體";
        cropper.fillText((left + (right - left) / 4).toFixed(deg).toString(), blank_width + (finalWidth - blank_width * 2) / 4, finalHeight - blank_width + height);
        cropper.strokeText((left + (right - left) / 4).toFixed(deg).toString(), blank_width + (finalWidth - blank_width * 2) / 4, finalHeight - blank_width + height);
        cropper.fill();
        cropper.stroke();
        height = getTextHeight(left.toFixed(deg).toString(), "bold 8pt 微軟正黑體");
        cropper.fillStyle = 'black';
        cropper.strokeStyle = 'black';
        cropper.lineWidth = 1;
        cropper.font = "bold 8pt 微軟正黑體";
        cropper.fillText((left + (right - left) / 2).toFixed(deg).toString(), blank_width + (finalWidth - blank_width * 2) / 2, finalHeight - blank_width + height);
        cropper.strokeText((left + (right - left) / 2).toFixed(deg).toString(), blank_width + (finalWidth - blank_width * 2) / 2, finalHeight - blank_width + height);
        cropper.fill();
        cropper.stroke();
        height = getTextHeight(left.toFixed(deg).toString(), "bold 8pt 微軟正黑體");
        cropper.fillStyle = 'black';
        cropper.strokeStyle = 'black';
        cropper.lineWidth = 1;
        cropper.font = "bold 8pt 微軟正黑體";
        cropper.fillText((left + (right - left) * 3 / 4).toFixed(deg).toString(), blank_width + (finalWidth - blank_width * 2) * 3 / 4, finalHeight - blank_width + height);
        cropper.strokeText((left + (right - left) * 3 / 4).toFixed(deg).toString(), blank_width + (finalWidth - blank_width * 2) * 3 / 4, finalHeight - blank_width + height);
        cropper.fill();
        cropper.stroke();
        height = getTextHeight(right.toFixed(deg).toString(), "bold 8pt 微軟正黑體");
        width = getTextWidth(right.toFixed(deg).toString(), "bold 8pt 微軟正黑體")
        cropper.fillStyle = 'black';
        cropper.strokeStyle = 'black';
        cropper.lineWidth = 1;
        cropper.font = "bold 8pt 微軟正黑體";
        cropper.fillText(right.toFixed(deg).toString(), finalWidth - width, finalHeight - blank_width + height);
        cropper.strokeText(right.toFixed(deg).toString(), finalWidth - width, finalHeight - blank_width + height);
        cropper.fill();
        cropper.stroke();
        cropper.fillStyle = 'black';
        cropper.strokeStyle = 'black';
        cropper.lineWidth = 1;
        cropper.font = "bold 8pt 微軟正黑體";
        cropper.fillText(up.toFixed(deg).toString(), 0, blank_width);
        cropper.strokeText(up.toFixed(deg).toString(), 0, blank_width);
        cropper.fill();
        cropper.stroke();
        cropper.fillStyle = 'black';
        cropper.strokeStyle = 'black';
        cropper.lineWidth = 1;
        cropper.font = "bold 8pt 微軟正黑體";
        cropper.fillText((down + (up - down) * 3 / 4).toFixed(deg).toString(), 0, blank_width + (finalHeight - blank_width * 2) / 4);
        cropper.strokeText((down + (up - down) * 3 / 4).toFixed(deg).toString(), 0, blank_width + (finalHeight - blank_width * 2) / 4);
        cropper.fill();
        cropper.stroke();
        cropper.fillStyle = 'black';
        cropper.strokeStyle = 'black';
        cropper.lineWidth = 1;
        cropper.font = "bold 8pt 微軟正黑體";
        cropper.fillText((down + (up - down) / 2).toFixed(deg).toString(), 0, blank_width + (finalHeight - blank_width * 2) / 2);
        cropper.strokeText((down + (up - down) / 2).toFixed(deg).toString(), 0, blank_width + (finalHeight - blank_width * 2) / 2);
        cropper.fill();
        cropper.stroke();
        cropper.fillStyle = 'black';
        cropper.strokeStyle = 'black';
        cropper.lineWidth = 1;
        cropper.font = "bold 8pt 微軟正黑體";
        cropper.fillText((down + (up - down) / 4).toFixed(deg).toString(), 0, blank_width + (finalHeight - blank_width * 2) * 3 / 4);
        cropper.strokeText((down + (up - down) / 4).toFixed(deg).toString(), 0, blank_width + (finalHeight - blank_width * 2) * 3 / 4);
        cropper.fill();
        cropper.stroke();
        cropper.fillStyle = 'black';
        cropper.strokeStyle = 'black';
        cropper.lineWidth = 1;
        cropper.font = "bold 8pt 微軟正黑體";
        cropper.fillText(down.toFixed(deg).toString(), 0, finalHeight - blank_width);
        cropper.strokeText(down.toFixed(deg).toString(), 0, finalHeight - blank_width);
        cropper.fill();
        cropper.stroke();

        // return our canvas
        return cropper.canvas;
    });

}

// 產生螢幕截圖 with logo and title(for GIF list)
function screenshot(element, options = {}) {
    // our cropping context
    var canvas = document.createElement('canvas');
    var cropper = canvas.getContext("2d");
    // save the passed width and height
    let finalWidth = options.width
    let finalHeight = options.height
    // update the options value so we can pass it to h2c
    if (options.x) {
        options.width = finalWidth
    }
    if (options.y) {
        options.height = finalHeight
    }
    // chain h2c Promise

    var text_size = $('#gif_text_size').val()


    return html2canvas(element, options).then(c => {

        // do our cropping
        cropper.canvas.width = finalWidth;
        cropper.canvas.height = finalHeight;
        //cropper.drawImage(c, -(+options.x || 0), -(+options.y || 0));
        cropper.drawImage(c,0,0);
        if(options.logo) {
            var img1 = document.getElementById('img1');
            cropper.globalAlpha = 1.0;
            cropper.drawImage(img1, 0, 0);
        }
        if(options.title) {            
            width = getTextWidth($('#gif_text').val(), "bold "+ text_size + "pt 微軟正黑體")
            cropper.fillStyle = 'white';
            cropper.strokeStyle = 'black';
            cropper.lineWidth = 2;
            cropper.font = "bold " + text_size + "pt 微軟正黑體";
            cropper.fillText($('#gif_text').val(), finalWidth - width, finalHeight - 5);
            cropper.strokeText($('#gif_text').val(), finalWidth - width, finalHeight - 5);
            cropper.fill();
            cropper.stroke();
        }
        // return our canvas
        return cropper.canvas;
    });

}

// 產生螢幕截圖 with nothing (for kml)
function screenshot_kml(element, options = {}) {
    // our cropping context
    var canvas = document.createElement('canvas');
    var cropper = canvas.getContext("2d");
    // save the passed width and height
    let finalWidth = options.width
    let finalHeight = options.height
    // update the options value so we can pass it to h2c
    if (options.x) {
        options.width = finalWidth
    }
    if (options.y) {
        options.height = finalHeight
    }
    // chain h2c Promise

    var text_size = $('#gif_text_size').val()


    return html2canvas(element, options).then(c => {

        // do our cropping
        cropper.canvas.width = finalWidth;
        cropper.canvas.height = finalHeight;
        //cropper.drawImage(c, -(+options.x || 0), -(+options.y || 0));
        cropper.drawImage(c, 0, 0);
        //var img1 = document.getElementById('img1');
        cropper.globalAlpha = 1.0;
        //cropper.drawImage(img1, 0, 0);

        /*width = getTextWidth($('#gif_text').val(), "bold "+ text_size + "pt 微軟正黑體")
        cropper.fillStyle = 'white';
        cropper.strokeStyle = 'black';
        cropper.lineWidth = 2;
        cropper.font = "bold " + text_size + "pt 微軟正黑體";
        cropper.fillText($('#gif_text').val(), finalWidth - width, finalHeight - 5);
        cropper.strokeText($('#gif_text').val(), finalWidth - width, finalHeight - 5);
        cropper.fill();
        cropper.stroke();*/

        // return our canvas
        return cropper.canvas;
    });

}

// 產生圖片網址
function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png"); //獲得圖片地址
    return image;
}

// 另存為圖片
function downloadImg(src, imgType, imgNumber) {
    
    if(imgType == "png")
        var a = $("<a>").attr("href", src).attr("download", "img.png").appendTo("body");
    if(imgType == "tif")
        var a = $("<a>").attr("href", src).attr("download", "img_"+imgNumber+".tif").appendTo("body");
    a[0].click();
    a.remove();
}

// 另存為kml檔
function download_kml(src) {
    var a = $("<a>").attr("href", src).attr("download", "crop.kmz").appendTo("body");
    a[0].click();
    a.remove();
}

//判斷是否為ie瀏覽器
function browserIsIe() {
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}

function DownLoadReportIMG(imgPathURL) {
    //如果隱藏IFRAME不存在，則新增
    if (!document.getElementById("IframeReportImg"))
        $('<iframe style="display:none;" id="IframeReportImg" name="IframeReportImg" onload="DoSaveAsIMG();" width="0" height="0" src="about:blank"></iframe>').appendTo("body");
    if (document.all.IframeReportImg.src != imgPathURL) {
        //載入圖片
        document.all.IframeReportImg.src = imgPathURL;
    }
    else {
        //圖片直接另存為
        DoSaveAsIMG();
    }
}

var start_mouse_x
var start_mouse_y
var end_mouse_x
var end_mouse_y
//var crop_image_coor_start
//var crop_image_coor_end

var crop_gif_left;
var crop_gif_right;
var crop_gif_up;
var crop_gif_down;
/*** 20200321 ***/
var start_coor
var end_coor
/*** 20200321 ***/

/*---- for restore gif ----*/
var zoom_level;
var map_center_x;
var map_center_y;

var start_box_x;
var start_box_y;
var end_box_x;
var end_box_y;
/*---- for restore gif ----*/

// 取得截圖區域坐標
function get_crop_image_x_y() {
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

    var mouse_x
    var mouse_y

    onmousemove = function (e) { mouse_x = e.clientX; mouse_y = e.clientY; }
    draw_box.on('drawstart',
        function (evt) {
            start_mouse_x = mouse_x;
            start_mouse_y = mouse_y;
            crop_image_coor_start = $('#Cursor_Coord').html()


			btn_disable();
            /*** 20200321 ***/
            start_coor = document.getElementById("Cursor_terr").innerText;
            /*** 20200321 ***/
        }, this);	
		
	draw_box.on('drawend',
        function (e) {
            /*** 20200321 ***/
            end_coor = document.getElementById("Cursor_terr").innerText;
            /*** 20200321 ***/    
            box_array=(String(e.feature.getGeometry().getExtent())).split(",");
        
            loc_84=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');
            

            crop_gif_left = loc_84[0];
            crop_gif_up = loc_84[1];
            
            loc_84=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');
            

            crop_gif_right = loc_84[0];
            crop_gif_down = loc_84[1];

            end_mouse_x = mouse_x;
            end_mouse_y = mouse_y;
            crop_image_coor_end = $('#Cursor_Coord').html()

            crop_cmd = 'ok'
            
            /*---- information for restore ----*/
            zoom_level = maps[0].getView().getZoom();
            map_center_x = maps[0].getView().getCenter()[0];
            map_center_y = maps[0].getView().getCenter()[1];
            start_box_x = box_array[0];
            start_box_y = box_array[1];
            end_box_x = box_array[2];
            end_box_y = box_array[3];
            /*---- information for restore ----*/

            btn_enable();
            clear_map();
            createMeasureTooltip();

        }, this);
}

/*** 20201130 ***/
// area
var geopdf_area
var geopdf_area_ulimit = 50.0;
var geopdf_area_dlimit = 4.0;
// coordirate


function get_crop_image_x_y_origin() {
    document.getElementById("space_lonlat").checked = true;
    clear_map();
    createMeasureTooltip();
    ////
    // var Drag = /*@__PURE__*/ (function (PointerInteraction) {
    //     function Drag() {
    //       PointerInteraction.call(this, {
    //         handleDownEvent: handleDownEvent,
    //         handleDragEvent: handleDragEvent,
    //         handleMoveEvent: handleMoveEvent,
    //         handleUpEvent: handleUpEvent
    //       });
      
    //       /**
    //        * @type {import("../src/ol/coordinate.js").Coordinate}
    //        * @private
    //        */
    //       this.coordinate_ = null;
      
    //       /**
    //        * @type {string|undefined}
    //        * @private
    //        */
    //       this.cursor_ = "pointer";
      
    //       /**
    //        * @type {Feature}
    //        * @private
    //        */
    //       this.feature_ = null;
      
    //       /**
    //        * @type {string|undefined}
    //        * @private
    //        */
    //       this.previousCursor_ = undefined;
    //     }
      
    //     if (PointerInteraction) Drag.__proto__ = PointerInteraction;
    //     Drag.prototype = Object.create(
    //       PointerInteraction && PointerInteraction.prototype
    //     );
    //     Drag.prototype.constructor = Drag;
      
    //     return Drag;
    //   })(PointerInteraction);
    //   function handleDownEvent(evt) {
    //     var map = evt.map;
      
    //     var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    //       return feature;
    //     });
      
    //     if (feature) {
    //       this.coordinate_ = evt.coordinate;
    //       this.feature_ = feature;
    //     }
      
    //     return !!feature;
    //   }
      
    //   /**
    //    * @param {import("../src/ol/MapBrowserEvent.js").default} evt Map browser event.
    //    */
    //   function handleDragEvent(evt) {
    //     var deltaX = evt.coordinate[0] - this.coordinate_[0];
    //     var deltaY = evt.coordinate[1] - this.coordinate_[1];
      
    //     var geometry = this.feature_.getGeometry();
    //     geometry.translate(deltaX, deltaY);
      
    //     this.coordinate_[0] = evt.coordinate[0];
    //     this.coordinate_[1] = evt.coordinate[1];
    //   }
      
    //   /**
    //    * @param {import("../src/ol/MapBrowserEvent.js").default} evt Event.
    //    */
    //   function handleMoveEvent(evt) {
    //     if (this.cursor_) {
    //       var map = evt.map;
    //       var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    //         return feature;
    //       });
    //       var element = evt.map.getTargetElement();
    //       if (feature) {
    //         if (element.style.cursor != this.cursor_) {
    //           this.previousCursor_ = element.style.cursor;
    //           element.style.cursor = this.cursor_;
    //         }
    //       } else if (this.previousCursor_ !== undefined) {
    //         element.style.cursor = this.previousCursor_;
    //         this.previousCursor_ = undefined;
    //       }
    //     }
    //   }
    //   /**
    //    * @return {boolean} `false` to stop the drag sequence.
    //    */
    //   function handleUpEvent() {
    //     this.coordinate_ = null;
    //     this.feature_ = null;
    //     return false;
    //   }
    // maps[map_ind].addInteraction(draw_box);
    // point = [[[13372199.476322, 2795149.250332], 
    //           [13361804.040475, 2616592.352258], 
    //           [13571547.246090, 2612923.374900], 
    //           [13599676.072499, 2795760.746559], 
    //           [13372199.476322, 2795149.250332]]]
    // var square = new ol.geom.Polygon(point)
    // var polygonFeature = new ol.Feature(square);
   
    // //point_feature = createMarker([13471703.88162943, 2713106.9166056826], iconStyle);
    // //var point_feature = new ol.Feature({ });
    // // var point_geom = new ol.geom.Point(
    // //     [20, 20]
    // //   );
    // //point_feature.setGeometry(point_geom);
    // // var vector_layer = new ol.layer.Vector({
    // //     source: new ol.source.Vector({
    // //       features:  point_feature
    // //     })
    // // })
    // // vector_layer.setZIndex(draw_box_zindex);
    // // maps[map_ind].addLayer(vector_layer);
    // //test = start_route_makeMovable(polygonFeature);
    // //maps[map_ind].addInteraction(test);
    ////

    source_box = new ol.source.Vector({ wrapX: false });

    ////
    // source_box.addFeature(polygonFeature)
    ////
    vector_box = new ol.layer.Vector({
        source: source_box,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0)'
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
    //
    maps[map_ind].on("pointermove", function (evt) {
        var hit = this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
            return true;
        }); 
        if (hit) {
            this.getTargetElement().style.cursor = 'pointer';
        } else {
            this.getTargetElement().style.cursor = '';
        }
    });

    var mouse_x
    var mouse_y

    onmousemove = function (e) { mouse_x = e.clientX; mouse_y = e.clientY; }
    draw_box.on('drawstart',
        function (evt) {
            start_mouse_x = mouse_x;
            start_mouse_y = mouse_y;
            crop_image_coor_start = $('#Cursor_Coord').html()

			btn_disable();
            /*** 20200321 ***/
            start_coor = document.getElementById("Cursor_terr").innerText;
            /*** 20200321 ***/

            /*** 20201130 ***/    
            var sketch = evt.feature;
            var tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', function (evt) {
				var geom = evt.target;
				var output;
				var output = formatArea(geom);  // calculate the area
				var tooltipCoord = geom.getInteriorPoint().getCoordinates();
				
				//convert the coordinate
				var sourceProj = maps[map_ind].getView().getProjection();
				var geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
				var coordinates = geom_t.getLinearRing(0).getCoordinates();
				geopdf_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));  // calculate the area after convert the coordinate
				
				measureTooltipElement.innerHTML = output;
				measureTooltip.setPosition(tooltipCoord);
			});
            /*** 20201130 ***/
        }, this);	
		
	draw_box.on('drawend',
        function (e) {
            if(geopdf_area/1000000 > geopdf_area_ulimit) {
                alert("請選取範圍小於 " + geopdf_area_ulimit + " 平方公里範圍!")
                document.getElementById('crop_square_button_GeoTiff_origin').click()
            }
            // else if(geopdf_area/1000000 < geopdf_area_dlimit) {
            //     alert("請選取範圍大於 " + geopdf_area_dlimit + " 平方公里範圍!")
            //     document.getElementById('crop_square_button_GeoTiff_origin').click()
            // }
            /*** 20200321 ***/
            end_coor = document.getElementById("Cursor_terr").innerText;
            /*** 20200321 ***/    
            box_array=(String(e.feature.getGeometry().getExtent())).split(",");
        
            loc_84=ol.proj.transform([box_array[0],box_array[3]], 'EPSG:3857', 'EPSG:4326');
            console.log(loc_84)
            crop_gif_left = loc_84[0];
            crop_gif_up = loc_84[1];
            
            loc_84=ol.proj.transform([box_array[2],box_array[1]], 'EPSG:3857', 'EPSG:4326');
            console.log(loc_84)

            crop_gif_right = loc_84[0];
            crop_gif_down = loc_84[1];

            end_mouse_x = mouse_x;
            end_mouse_y = mouse_y;
            crop_image_coor_end = $('#Cursor_Coord').html()
            btn_enable();

            clear_map();

            createMeasureTooltip();
            
        }, this);
    
}
/*** 20201130 ***/


var crop_width = 0
var crop_height = 0

// 關注區域截圖PNG檔下載  
function get_crop_image() {
    crop_x = 0
    crop_y = 0
    crop_width = 0
    crop_height = 0
    TWD97 = 0 // is twd97
    cropGIFleft = 0
    cropGIFup = 0
    cropGIFright = 0
    cropGIFdown = 0
    if (start_mouse_x > end_mouse_x) {
        crop_x = end_mouse_x
        crop_width = start_mouse_x - end_mouse_x
    } else {
        crop_x = start_mouse_x
        crop_width = end_mouse_x - start_mouse_x
    }

    if (start_mouse_y > end_mouse_y) {
        crop_y = end_mouse_y
        crop_height = start_mouse_y - end_mouse_y
    } else {
        crop_y = start_mouse_y
        crop_height = end_mouse_y - start_mouse_y
    }

    if ($('#crop_twd97').is(":checked")) {
        var crop_coor = proj4(EPSG4326, EPSG3826, [crop_gif_left, crop_gif_up]);
        cropGIFleft = crop_coor[0]
        cropGIFup = crop_coor[1]
        crop_coor = proj4(EPSG4326, EPSG3826, [crop_gif_right, crop_gif_down]);
        cropGIFright = crop_coor[0]
        cropGIFdown = crop_coor[1]
        TWD97 = 1
    }
    else {
        cropGIFleft = crop_gif_left
        cropGIFup = crop_gif_up
        cropGIFright = crop_gif_right
        cropGIFdown = crop_gif_down
        TWD97 = 0
    }

    screenshot_image($('#map0')[0], {
        x: crop_x, // this are our custom x y properties
        y: crop_y,
        width: crop_width, // final width and height
        height: crop_height,
        left: cropGIFleft,
        up: cropGIFup,
        right: cropGIFright,
        down: cropGIFdown,
        TWD97: TWD97,
        useCORS: true // you can still pass default html2canvas options
    }).then(canvas => {
        //do whatever with the canvas
        var img = convertCanvasToImage(canvas);
        if (browserIsIe()) { //假如是ie瀏覽器    
            DownLoadReportIMG(img.src);
        }else{
            downloadImg(img.src, 'png')
        }
    })

}

var crop_kml_num = 0

// 關注區域截圖KML檔下載
function get_crop_kml() { 
    btn_disable();
    crop_x = 0
    crop_y = 0
    crop_width = 0
    crop_height = 0
    TWD97 = 0 // is twd97
    cropGIFleft = 0
    cropGIFup = 0
    cropGIFright = 0
    cropGIFdown = 0
    if (start_mouse_x > end_mouse_x) {
        crop_x = end_mouse_x
        crop_width = start_mouse_x - end_mouse_x
    } else {
        crop_x = start_mouse_x
        crop_width = end_mouse_x - start_mouse_x
    }

    if (start_mouse_y > end_mouse_y) {
        crop_y = end_mouse_y
        crop_height = start_mouse_y - end_mouse_y
    } else {
        crop_y = start_mouse_y
        crop_height = end_mouse_y - start_mouse_y
    }

    if ($('#crop_twd97').is(":checked")) {
        /* var crop_coor = proj4(EPSG4326, EPSG3826, [crop_gif_left, crop_gif_up]);
         cropGIFleft = crop_coor[0]
         cropGIFup = crop_coor[1]
         crop_coor = proj4(EPSG4326, EPSG3826, [crop_gif_right, crop_gif_down]);
         cropGIFright = crop_coor[0]
         cropGIFdown = crop_coor[1]*/
        cropGIFleft = crop_gif_left
        cropGIFup = crop_gif_up
        cropGIFright = crop_gif_right
        cropGIFdown = crop_gif_down
        TWD97 = 1
    }
    else {
        cropGIFleft = crop_gif_left
        cropGIFup = crop_gif_up
        cropGIFright = crop_gif_right
        cropGIFdown = crop_gif_down
        TWD97 = 0
    }
    //console.log("get crop coordinates X : ", crop_x,", Y : ", crop_y, ",width : ",crop_width, ", height : ", crop_height);
    //console.log("get gif coordinates left : ", cropGIFleft,", right : ", cropGIFright, ",up : ",cropGIFup, ", down : ", cropGIFdown);
    screenshot($('#map0')[0], {
        x: crop_x, // this are our custom x y properties
        y: crop_y,
        width: crop_width, // final width and height
        height: crop_height,
        left: cropGIFleft,
        up: cropGIFup,
        right: cropGIFright,
        down: cropGIFdown,
        TWD97: TWD97,
        useCORS: true // you can still pass default html2canvas options
    }).then(canvas => {
        //do whatever with the canvas
        var img = convertCanvasToImage(canvas);

        $.ajax({
            type: "POST",
            url: "php/get_crop_kml.php",
            dataType: "json",
            data: {
                n: cropGIFup,
                s: cropGIFdown,
                e: cropGIFright,
                w: cropGIFleft,
                img_url: img.src,
                num: (crop_kml_num + 1)

            },
            //request success
            success: function (json) {
                //console.log("crop_kml success, return : ",json['kmz']);
                download_kml(json['kmz']);
                btn_enable();
            },
            //request fail
            error: function (jqXHR) {
                alert("error " + jqXHR.status);
                btn_enable();
            }
        });
        crop_kml_num = crop_kml_num + 1;

        /*if(browserIsIe()){ //假如是ie瀏覽器    
            DownLoadReportIMG(img.src);
        }else{
            download_kml(kml src)
        }*/
    })

}

//-----------------------GIF影像編輯列表---------------------------
// 介面
$(document).ready(function () {
    crop_canvas_view_win = dhxWins.createWindow("crop_canvas_view_win", 800, 100, 400, 600);
    /*** 20190529 fixed ***/
    crop_canvas_view_win.setText("GIF 影像編輯列表");
    /*** 20190529 fixed ***/
    crop_canvas_view_win.centerOnScreen();
    //crop_canvas_view_win.denyResize();
    crop_canvas_view_win.showInnerScroll();
    crop_canvas_view_html = "<div class='ui celled list' id = 'crop_canvas_view_list'></div>"
    crop_canvas_view_win.attachHTMLString(crop_canvas_view_html);
    crop_canvas_view_win.hide();

    crop_canvas_view_win.attachEvent("onClose", function (win) {
        crop_canvas_view_win.hide();
    });

    /** 20200917 **/
    crop_canvas_view_win_Geotiff = dhxWins.createWindow("crop_canvas_view_win_Geotiff", 800, 100, 400, 600);
    crop_canvas_view_win_Geotiff.setText("離線圖資編輯列表");
    crop_canvas_view_win_Geotiff.centerOnScreen();
    crop_canvas_view_win_Geotiff.showInnerScroll();
    crop_canvas_view_Geotiff_html = "<div class='ui celled list' id = 'crop_canvas_view_list_Geotiff'></div>"
    crop_canvas_view_win_Geotiff.attachHTMLString(crop_canvas_view_Geotiff_html);
    crop_canvas_view_win_Geotiff.hide();
    
    crop_canvas_view_win_Geotiff.attachEvent("onClose", function(win){
        crop_canvas_view_win_Geotiff.hide();
    });
    /** 20200917 **/
    /** 20201026 **/
    crop_canvas_view_win_Geotiff_origin = dhxWins.createWindow("crop_canvas_view_win_Geotiff_origin", 800, 100, 400, 600);
    crop_canvas_view_win_Geotiff_origin.setText("離線圖資編輯列表(原始畫質)");
    crop_canvas_view_win_Geotiff_origin.centerOnScreen();
    crop_canvas_view_win_Geotiff_origin.showInnerScroll();
    crop_canvas_view_Geotiff_html_origin = "<div class='ui celled list' id = 'crop_canvas_view_list_Geotiff_origin'></div>"
    crop_canvas_view_win_Geotiff_origin.attachHTMLString(crop_canvas_view_Geotiff_html_origin);
    crop_canvas_view_win_Geotiff_origin.hide();
    
    crop_canvas_view_win_Geotiff_origin.attachEvent("onClose", function(win){
        crop_canvas_view_win_Geotiff_origin.hide();
    });
    /** 20201026 **/
        
})

var crop_canvas_list = []
var crop_canvas_line_list = []
var crop_canvas_kml_list = []
var crop_canvas_name_list = []

var crop_canvas_num = 1
var crop_canvas_line_num = 1
var crop_canvas_kml_num = 1
var crop_canvas_name_num = 1

/***  20200917 ***/
var crop_canvas_list_Geotiff = []
var crop_canvas_num_Geotiff = 0
var Geotiff_proj_data_list = []
// [number, [start x, start y, end x, end y, start_mouse_x, start_mouse_y, end_mouse_x, end_mouse_y]]
/***  20200917 ***/

/***  20201026 ***/
var crop_canvas_list_Geotiff_origin = []
// storing only coordinate and layer ID
// [number, [layer ID, start x, start y, end x, end y, start_mouse_x, start_mouse_y, end_mouse_x, end_mouse_y]]
var crop_canvas_num_Geotiff_origin = 0
/***  20201026 ***/

function crop_order_up(e, num){
    var wrapper = $(e).parent().parent().closest('div')
    wrapper.insertBefore(wrapper.prev())
    for (i = 1; i < crop_canvas_list.length; i++) {
        if (crop_canvas_list[i][0] == num) {
            var temp = crop_canvas_list[i - 1]
            crop_canvas_list[i - 1] = crop_canvas_list[i]
            crop_canvas_list[i] = temp
        }
    }
    for (i = 1; i < crop_canvas_line_list.length; i++) {
        if (crop_canvas_line_list[i][0] == num) {
            var temp = crop_canvas_line_list[i - 1]
            crop_canvas_line_list[i - 1] = crop_canvas_line_list[i]
            crop_canvas_line_list[i] = temp
        }
    }
    /*for (i = 1; i < crop_canvas_kml_list.length; i++) {
        if (crop_canvas_kml_list[i][0] == num) {
            var temp = crop_canvas_kml_list[i - 1]
            crop_canvas_kml_list[i - 1] = crop_canvas_kml_list[i]
            crop_canvas_kml_list[i] = temp
        }
    }*/
    for (i=1; i<crop_canvas_name_list.length; i++) {
        if (crop_canvas_name_list[i][0] == num) {
            var temp = crop_canvas_name_list[i - 1]
            crop_canvas_name_list[i - 1] = crop_canvas_name_list[i]
            crop_canvas_name_list[i] = temp
        }
    }
}

// 向下移動
function crop_order_down(e, num) {
    var wrapper = $(e).parent().parent().closest('div')
    wrapper.insertAfter(wrapper.next())
    for (i = 0; i < crop_canvas_list.length - 1; i++) {
        if (crop_canvas_list[i][0] == num) {
            var temp = crop_canvas_list[i + 1]
            crop_canvas_list[i + 1] = crop_canvas_list[i]
            crop_canvas_list[i] = temp
        }
    }
    for (i = 1; i < crop_canvas_line_list.length; i++) {
        if (crop_canvas_line_list[i][0] == num) {
            var temp = crop_canvas_line_list[i + 1]
            crop_canvas_line_list[i + 1] = crop_canvas_line_list[i]
            crop_canvas_line_list[i] = temp
        }
    }
    /*for (i = 1; i < crop_canvas_kml_list.length; i++) {
        if (crop_canvas_kml_list[i][0] == num) {
            var temp = crop_canvas_kml_list[i + 1]
            crop_canvas_kml_list[i + 1] = crop_canvas_kml_list[i]
            crop_canvas_kml_list[i] = temp
        }
    }*/
    for (i=1; i<crop_canvas_name_list.length; i++) {
        if (crop_canvas_name_list[i][0] == num) {
            var temp = crop_canvas_name_list[i + 1]
            crop_canvas_name_list[i + 1] = crop_canvas_name_list[i]
            crop_canvas_name_list[i] = temp
        }
    }
}

// 移除
function crop_order_remove(e, num) {
    var wrapper = $(e).parent().parent()
    wrapper.remove()
    for (i = 0; i < crop_canvas_list.length; i++) {
        if (crop_canvas_list[i][0] == num) {

            crop_canvas_list.splice(i, 1)
            crop_canvas_line_list.splice(i, 1)
            //crop_canvas_kml_list.splice(i, 1)
            crop_canvas_name_list.splice(i, 1)
        }
    }
}
//-----------------------GIF影像編輯列表---------------------------


//debug
// function Geotiff_debug() {
//     console.log(crop_canvas_list_Geotiff)
//     console.log(Geotiff_proj_data_list)
// }


function crop_order_remove_GeoPDF(e, num){
    var wrapper = $(e).parent().parent()
    wrapper.remove()
    
    for (i=0; i<crop_canvas_list_Geotiff.length; i++) {
        if (crop_canvas_list_Geotiff[i][0] == num) {
            
            crop_canvas_list_Geotiff.splice(i, 1)
            Geotiff_proj_data_list.splice(i, 1)
            //crop_canvas_line_list.splice(i, 1)
        }
    }
}
function crop_order_remove_GeoPDF_origin(e, num){
    var wrapper = $(e).parent().parent()
    wrapper.remove()
    
    for (i=0; i<crop_canvas_list_Geotiff_origin.length; i++) {
        if (crop_canvas_list_Geotiff_origin[i][0] == num) {
            crop_canvas_list_Geotiff_origin.splice(i, 1)
        }
    }
}


// 關注區域加到GIF列表
function add_crop_image_to_gif() {
	fun_access_log("Func_Use_Share_1_3");
    crop_x = 0
    crop_y = 0
    crop_width = 0
    crop_height = 0
    TWD97 = 0 // is twd97
    cropGIFleft = 0
    cropGIFup = 0
    cropGIFright = 0
    cropGIFdown = 0
    if (start_mouse_x > end_mouse_x) {
        crop_x = end_mouse_x
        crop_width = start_mouse_x - end_mouse_x
    } else {
        crop_x = start_mouse_x
        crop_width = end_mouse_x - start_mouse_x
    }

    if (start_mouse_y > end_mouse_y) {
        crop_y = end_mouse_y
        crop_height = start_mouse_y - end_mouse_y
    } else {
        crop_y = start_mouse_y
        crop_height = end_mouse_y - start_mouse_y
    }

    // picture with logo
    screenshot($('#map0')[0], {
        x: crop_x, // this are our custom x y properties
        y: crop_y,
        width: crop_width, // final width and height
        height: crop_height,
        useCORS: true, // you can still pass default html2canvas options
        logo: true, // BigGIS logo
        title: true // picture title
    }).then(canvas => {
        //do whatever with the canvas
        var img = convertCanvasToImage(canvas);

        var img_w = crop_width;
        var img_h = crop_height;
        var img_ratio = 100 / img_w;
        var rescale_img_h = img_h * img_ratio;

        //var imgsrc = URL.createObjectURL(img)
        crop_canvas_list.push([crop_canvas_num, canvas])
        $('#crop_canvas_view_list').append('<div class="item">\
                                                <div class="content"> \
                                                    <img id="crop_img_' + crop_canvas_num + '" src="' + img.src + '" width="100" height="' + rescale_img_h + '" onmouseover="crop_image_mouse_over(' + crop_canvas_num + ', ' + img_h + ', ' + img_w + ')" onmouseout="crop_image_mouse_out(' + crop_canvas_num + ', ' + rescale_img_h + ', ' + 100 + ')"> \
                                                    <button class="ui button" onclick="crop_order_up(this, ' + (crop_canvas_num) + ')"><i class="angle up icon"></i></button>\
                                                    <button class="ui button" onclick="crop_order_down(this, ' + (crop_canvas_num) + ')"><i class="angle down  icon"></i></button>\
                                                    <button class="ui button" onclick="crop_order_remove(this, ' + (crop_canvas_num) + ')"><i class="trash  icon"></i></button> \
                                                    <br>' + $('#gif_text').val() + '\
                                                </div> \
                                            </div>')
        crop_canvas_num += 1
        crop_canvas_view_win.show();

        /*
        gif.on('finished', function(blob) {
            renderimg = $('#crop_image_gif');
            console.log(URL.createObjectURL(blob));
            $('#crop_image_gif').attr("src", URL.createObjectURL(blob))
        });
        gif.render();
        */

    })

    if ($('#crop_twd97').is(":checked")) {
        var crop_coor = proj4(EPSG4326, EPSG3826, [crop_gif_left, crop_gif_up]);
        cropGIFleft = crop_coor[0]
        cropGIFup = crop_coor[1]
        crop_coor = proj4(EPSG4326, EPSG3826, [crop_gif_right, crop_gif_down]);
        cropGIFright = crop_coor[0]
        cropGIFdown = crop_coor[1]
        TWD97 = 1
    }
    else {
        cropGIFleft = crop_gif_left
        cropGIFup = crop_gif_up
        cropGIFright = crop_gif_right
        cropGIFdown = crop_gif_down
        TWD97 = 0
    }

    //picture with lines
    screenshot_image($('#map0')[0], {
        x: crop_x, // this are our custom x y properties
        y: crop_y,
        width: crop_width, // final width and height
        height: crop_height,
        left: cropGIFleft,
        up: cropGIFup,
        right: cropGIFright,
        down: cropGIFdown,
        TWD97: TWD97,
        useCORS: true // you can still pass default html2canvas options
    }).then(canvas => {
        //do whatever with the canvas
        var img = convertCanvasToImage(canvas);

        //var imgsrc = URL.createObjectURL(img)
        crop_canvas_line_list.push([crop_canvas_line_num, canvas])

        crop_canvas_line_num += 1
    })

    // picture with nothing
    /*screenshot_kml($('#map0')[0], {
        x: crop_x, // this are our custom x y properties
        y: crop_y,
        width: crop_width, // final width and height
        height: crop_height,
        left: cropGIFleft,
        up: cropGIFup,
        right: cropGIFright,
        down: cropGIFdown,
        TWD97: TWD97,
        useCORS: true // you can still pass default html2canvas options
    }).then(canvas => {
        //do whatever with the canvas
        var img = convertCanvasToImage(canvas);
        crop_canvas_kml_list.push([crop_canvas_kml_num, img.src]);
        console.log("crop list ", crop_canvas_kml_num, " : ", crop_canvas_kml_list[(crop_canvas_kml_num - 1)]);
        crop_canvas_kml_num += 1;

    })*/
    //console.log("crop list ",crop_canvas_kml_num," : ", crop_canvas_kml_list[(crop_canvas_kml_num-1)]);

    //***** picture name *****
    crop_canvas_name_list.push([crop_canvas_name_num,$('#gif_text').val()])
    console.log("crop name ",crop_canvas_name_num," : ", crop_canvas_name_list[(crop_canvas_name_num-1)]);
    crop_canvas_name_num += 1;
    //console.log("crop list ",crop_canvas_kml_num," : ", crop_canvas_kml_list[(crop_canvas_kml_num-1)]);
}


function crop_image_mouse_over(id, img_h, img_w) {
    $('#crop_img_' + id).width(img_w);
    $('#crop_img_' + id).height(img_h);
}

function crop_image_mouse_out(id, img_h, img_w) {
    $('#crop_img_' + id).width(img_w);
    $('#crop_img_' + id).height(img_h);
}

// 產製GIF動畫檔
function show_crop_image_gif() {

    loading_id = "l" + crop_gif_num.toString();

    draw_crop_gif_Tree.insertNewItem("0", loading_id, "loading...", function () { }, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
    draw_crop_gif_Tree.enableCheckBoxes(false, false);

    var crop_canvas_img = []
    var crop_canvas_img_line = []
    var crop_canvas_img_kml = []

    var gif = new GIF({
        workers: 2,
        quality: 10
    });
    var gif_line = new GIF({
        workers: 2,
        quality: 10
    });

    for (i = 0; i < crop_canvas_list.length; i++)
        crop_canvas_img.push(crop_canvas_list[i][1])
    for (i = 0; i < crop_canvas_line_list.length; i++)
        crop_canvas_img_line.push(crop_canvas_line_list[i][1])

    var delay = 1500

    if ($('#gif_speed_high').is(":checked")) {
        delay = 500;
    }
    else if ($('#gif_speed_medium').is(":checked")) {
        delay = 1000;
    }
    else if ($('#gif_speed_user_define').is(":checked")){
        delay = parseInt($('#gif_speed').val())*1000;
    }

    // add progress bar for gif img(without line)
    crop_canvas_kml_list = [];
    crop_canvas_kml_num = 1;
    var gif_img_num = crop_canvas_img.length;
    for (i = 0; i < crop_canvas_img.length; i++) {
        if (crop_canvas_img[i].getContext) {
            //console.log("get",i,"canvas context");
            //console.log("wid : ", crop_canvas_img[i].width, "height : ",crop_canvas_img[i].height)
            var canv = crop_canvas_img[i].getContext('2d');
            //clear previous progress bar
            canv.beginPath();
            canv.moveTo(0,crop_canvas_img[i].height);
            canv.lineTo(crop_canvas_img[i].width,crop_canvas_img[i].height);
            canv.lineWidth = 6;
            canv.strokeStyle = '#ffcc33';
            canv.stroke();

            canv.beginPath();
            canv.moveTo(0, crop_canvas_img[i].height); // start pos
            canv.lineTo((crop_canvas_img[i].width / gif_img_num) * (i + 1), crop_canvas_img[i].height); // end pos
            canv.lineWidth = 5;
            canv.strokeStyle = 'blue'; // set line color
            canv.stroke();
        }
        else
            console.log("cannot get canvas")
        gif.addFrame(crop_canvas_img[i], { delay: delay });
        var img = convertCanvasToImage(crop_canvas_img[i]);

        // for kml
        crop_canvas_kml_list.push([crop_canvas_kml_num, img.src]);
        console.log("crop list ", crop_canvas_kml_num, " : ", crop_canvas_kml_list[(crop_canvas_kml_num - 1)]);
        crop_canvas_kml_num += 1;
    }

    // add progress bar for gif img(with line)
    var line_gif_img_num = crop_canvas_img_line.length;
    for (i = 0; i < crop_canvas_img_line.length; i++){
        if (crop_canvas_img_line[i].getContext){
            var canv = crop_canvas_img_line[i].getContext('2d');
            //clear previous progress bar
            canv.beginPath();
            canv.moveTo(0,crop_canvas_img_line[i].height);
            canv.lineTo(crop_canvas_img_line[i].width,crop_canvas_img_line[i].height);
            canv.lineWidth = 6;
            canv.strokeStyle = 'white';
            canv.stroke();

            canv.beginPath();
            canv.moveTo(0, crop_canvas_img_line[i].height); // start pos
            canv.lineTo((crop_canvas_img_line[i].width / line_gif_img_num) * (i + 1), crop_canvas_img_line[i].height); // end pos
            canv.lineWidth = 5;
            canv.strokeStyle = 'blue'; // set line color
            canv.stroke();
        }
        else
            console.log("cannot get canvas")
        gif_line.addFrame(crop_canvas_img_line[i], { delay: delay });
    }

    //create gif node
    gif.on('finished', function (blob) {
        renderimg = $('#crop_image_gif');

        crop_gif_link_arr.push(URL.createObjectURL(blob));

        crop_gif_num = crop_gif_num + 1;

        
        new_node_id = `{
            "PosInfo": "${((crop_gif_up + crop_gif_down) / 2.0).toString() + ";" + 
                       ((crop_gif_left + crop_gif_right) / 2.0).toString() + ";563426;8;" + 
                       crop_width.toString() + ";" + 
                       crop_height.toString() + ";" + 
                       crop_gif_left.toString() + ";" + 
                       crop_gif_up.toString() + ";" + 
                       crop_gif_right.toString() + ";" + 
                       crop_gif_down.toString()}",
            "Type": "GifOverlay",
            "Url": "${URL.createObjectURL(blob)}",
            "ID": "${$('#gif_text').val()}",
            "FileName": "${$('#gif_text').val()}"
        }`.replace(/\n|\t/g, "").trim();
        console.log(new_node_id);
        
        
        // new_node_id = ((crop_gif_up + crop_gif_down) / 2.0).toString() + ";" + ((crop_gif_left + crop_gif_right) / 2.0).toString() + ";563426;8;" + crop_width.toString() + ";"
        //     + crop_height.toString() + ";" + crop_gif_left.toString() + ";" + crop_gif_up.toString() + ";" + crop_gif_right.toString() + ";" + crop_gif_down.toString()
        //     + "@GifOverlay@" + URL.createObjectURL(blob);

        draw_crop_gif_Tree.deleteItem(loading_id, false);
        draw_crop_gif_Tree.enableCheckBoxes(true, true);

        // layer item
        draw_crop_gif_Tree.insertNewChild("0", new_node_id, "GIF" + crop_gif_num.toString(), function () { }, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');


        draw_crop_gif_Tree.insertNewItem(new_node_id, "d" + crop_gif_num.toString(), "下載 .gif 檔",
            function () {
                var idn = this.id.split("d");
                var a = $("<a>").attr("href", crop_gif_link_arr[idn[1] - 1]).attr("download", "gif.gif").appendTo("body");
                a[0].click();
                a.remove();
                //document.getElementById("download_iframe").src = crop_gif_link_arr[idn[1] - 1];
            }, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
        draw_crop_gif_Tree.disableCheckbox("d" + crop_gif_num.toString(), true);
        // Download button Default : closed

        //draw_crop_gif_Tree.closeItem(new_node_id);  

    });
    try {
        gif.render();
    }
    catch (e) {
        draw_crop_gif_Tree.deleteItem(loading_id, false);
    }

    //create gif node (with lines)
    gif_line.on('finished', function (blob) {
        crop_gif_link_line_arr.push(URL.createObjectURL(blob));
        draw_crop_gif_Tree.insertNewItem(new_node_id, "f" + crop_gif_num.toString(), "下載 .gif 檔 (格線)",
            function () {
                var idn = this.id.split("f");
                var a = $("<a>").attr("href", crop_gif_link_line_arr[idn[1] - 1]).attr("download", "gif.gif").appendTo("body");
                a[0].click();
                a.remove();
                //document.getElementById("download_iframe").src = crop_gif_link_line_arr[idn[1] - 1];
            }, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
        draw_crop_gif_Tree.disableCheckbox("f" + crop_gif_num.toString(), true);
        //draw_crop_gif_Tree.closeItem(new_node_id);

        //create kmz node
        var crop_gif_time = Date.now();
        TWD97 = 0 // is twd97
        cropGIFleft = 0
        cropGIFup = 0
        cropGIFright = 0
        cropGIFdown = 0
        crop_x = 0
        crop_y = 0
        crop_width = 0
        crop_height = 0
        // x, y position for map
        if (start_mouse_x > end_mouse_x) {
            crop_x = end_mouse_x 
            crop_width = start_mouse_x - end_mouse_x
        } else {
            crop_x = start_mouse_x 
            crop_width = end_mouse_x - start_mouse_x
        }
    
        if (start_mouse_y > end_mouse_y) {
            crop_y = end_mouse_y 
            crop_height = start_mouse_y - end_mouse_y
        } else {
            crop_y = start_mouse_y 
            crop_height = end_mouse_y - start_mouse_y
        }
        //x, y position for kml
        if ($('#crop_twd97').is(":checked")) {
            /*var crop_coor = proj4(EPSG4326, EPSG3826, [crop_gif_left, crop_gif_up]);
            cropGIFleft = crop_coor[0]
            cropGIFup = crop_coor[1]
            crop_coor = proj4(EPSG4326, EPSG3826, [crop_gif_right, crop_gif_down]);
            cropGIFright = crop_coor[0]
            cropGIFdown = crop_coor[1]*/
            cropGIFleft = crop_gif_left
            cropGIFup = crop_gif_up
            cropGIFright = crop_gif_right
            cropGIFdown = crop_gif_down
            TWD97 = 1
        }
        else {
            cropGIFleft = crop_gif_left
            cropGIFup = crop_gif_up
            cropGIFright = crop_gif_right
            cropGIFdown = crop_gif_down
            TWD97 = 0
        }

        for (i = 0; i < crop_canvas_kml_list.length; i++)
            crop_canvas_img_kml.push(crop_canvas_kml_list[i][1]);

        for (i = 0; i < crop_canvas_img_kml.length; i++) {
            // store img
            $.ajax({
                async: false,
                type: "POST",
                url: "php/save_crop_img.php",
                dataType: "json",
                data: {
                    img_url: crop_canvas_img_kml[i],
                    gif_num: crop_gif_num,
                    gif_time : crop_gif_time,
                    num: i
                },
                //request success
                success: function (json) {
                    console.log("save ", i, "th img success, return : ", json);//['imgFilePath']);
                    btn_enable();
                },
                //request fail
                error: function (jqXHR) {
                    alert("error " + jqXHR.status);
                    btn_enable();
                }
            });
        }
        //get gif kmz
        $.ajax({
            async: false,
            type: "POST",
            url: "php/get_crop_gif.php",
            dataType: "json",
            data: {
                n : cropGIFup,
                s : cropGIFdown,
                e : cropGIFright,
                w : cropGIFleft,
                delay : delay,
                gif_num : crop_gif_num,
                gif_time : crop_gif_time,
                length : crop_canvas_img_kml.length,
                name : crop_canvas_name_list,
                zoom : zoom_level,
                center_x : map_center_x,
                center_y : map_center_y,
                start_box_x : start_box_x,
                start_box_y : start_box_y,
                end_box_x : end_box_x,
                end_box_y : end_box_y,
                start_mouse_x : start_mouse_x,
                start_mouse_y : start_mouse_y,
                end_mouse_x : end_mouse_x,
                end_mouse_y : end_mouse_y,
                crop_wid : crop_width,
                crop_hei : crop_height
            },
            //request success
            success: function (json) {
                console.log("crop_kml success, return : ", json['kmz']);
                console.log("gif kml new_node_id: ", new_node_id);

                crop_gif_link_kml_arr.push(json['kmz']);
                // insert download node
                draw_crop_gif_Tree.insertNewItem(new_node_id, "k" + crop_gif_num.toString(), "下載 .kmz 檔",
                    function () {
                        var idn = this.id.split("k");
                        var a = $("<a>").attr("href", crop_gif_link_kml_arr[idn[1] - 1]).attr("download", "gif.kmz").appendTo("body");
                        a[0].click();
                        a.remove();
                        //document.getElementById("download_iframe").src = crop_gif_link_kml_arr[idn[1] - 1];
                    }, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
                draw_crop_gif_Tree.disableCheckbox("k" + crop_gif_num.toString(), true);
                draw_crop_gif_Tree.closeItem(new_node_id);

                //download_kml(json['kmz']);
                btn_enable();
            },
            //request fail
            error: function (jqXHR) {
                alert("error " + jqXHR.status);
                btn_enable();
            }
        });

    });
    try {
        gif_line.render();
    }
    catch (e) {
        draw_crop_gif_Tree.deleteItem(loading_id, false);
    }
}

// 清除GIF列表
function clear_crop_image_gif() {
    crop_canvas_list = [];
    crop_canvas_line_list = [];
    crop_canvas_kml_list = [];
    crop_canvas_name_list = [];
    
    $('#crop_canvas_view_list').empty();
    crop_canvas_num = 1;
    crop_canvas_line_num = 1;
    crop_canvas_kml_num = 1;
    crop_canvas_name_num = 1;
}

/*** 20200917 ***/
function clear_crop_image_Geotiff() {
    Geotiff_proj_data_list = []
    $('#crop_canvas_view_list_Geotiff').empty()
    
    crop_canvas_list_Geotiff = []
    crop_canvas_num_Geotiff = 0
}
/*** 20200917 ***/

/*** 20201026 ***/
function clear_crop_image_Geotiff_origin() {
    $('#crop_canvas_view_list_Geotiff_origin').empty()
    crop_canvas_list_Geotiff_origin = []
    crop_canvas_num_Geotiff_origin = 0
    console.log($('#gif_text').val())
}
/*** 20201026 ***/

/*** 20200322 ***/

function add_crop_image_to_GeoTiff() {
    Geotiff_proj_data_list.push([crop_canvas_num_Geotiff, []])
    for(i = 0; i < Geotiff_proj_data_list.length; i++) {
        if(Geotiff_proj_data_list[i][0] == crop_canvas_num_Geotiff) {
            tmp = start_coor.split(',')
            Geotiff_proj_data_list[i][1].push(tmp[0])
            Geotiff_proj_data_list[i][1].push(tmp[1])
            tmp = end_coor.split(',')
            Geotiff_proj_data_list[i][1].push(tmp[0])
            Geotiff_proj_data_list[i][1].push(tmp[1])
            Geotiff_proj_data_list[i][1].push(start_mouse_x)
            Geotiff_proj_data_list[i][1].push(start_mouse_y)
            Geotiff_proj_data_list[i][1].push(end_mouse_x)
            Geotiff_proj_data_list[i][1].push(end_mouse_y)            
            break
        }
    }
    
    /* debug
    alert(Geotiff_data_list[0][0] + '  ' + Geotiff_data_list[0][1] + '   ' + 
          Geotiff_data_list[0][2] + '  ' + Geotiff_data_list[0][3] + '   ' + 
          Geotiff_data_list[0][4] + '  ' + Geotiff_data_list[0][5] + '   ' + 
          Geotiff_data_list[0][6] + '  ' + Geotiff_data_list[0][7])
    */
    crop_x = 0
    crop_y = 0
    crop_width = 0
    crop_height = 0
    
    if (start_mouse_x > end_mouse_x) {
        crop_x = end_mouse_x 
        crop_width = start_mouse_x - end_mouse_x
    } else {
        crop_x = start_mouse_x 
        crop_width = end_mouse_x - start_mouse_x
    }
    
    if (start_mouse_y > end_mouse_y) {
        crop_y = end_mouse_y 
        crop_height = start_mouse_y - end_mouse_y
    } else {
        crop_y = start_mouse_y 
        crop_height = end_mouse_y - start_mouse_y
    }
    
    screenshot($('#map0')[0], {
        x: crop_x, // this are our custom x y properties
        y: crop_y, 
        width: crop_width, // final width and height
        height: crop_height,
        useCORS: true, // you can still pass default html2canvas options
        logo: false, // BigGIS logo
        title: false // picture title
         }).then(canvas => {
        //do whatever with the canvas
        var img = convertCanvasToImage(canvas);
        var img_w = crop_width;
        var img_h = crop_height;
        var img_ratio = 100 / img_w;
        var rescale_img_h = img_h * img_ratio;
        
        //var imgsrc = URL.createObjectURL(img)
        //crop_canvas_view_win.setText('離線圖資編輯列表')
        var layerName = $('#gif_text').val()
        if (layerName == '')
            layerName = 'layer'+crop_canvas_num_Geotiff
        crop_canvas_list_Geotiff.push([crop_canvas_num_Geotiff, canvas])
        $('#crop_canvas_view_list_Geotiff').append('<div class="item">\
                                                <div class="content"> \
                                                    <img id="crop_img_GeoTiff_' + crop_canvas_num_Geotiff + '" src="' + img.src + '" width="100" height="' + rescale_img_h + '" > \
                                                    <button class="ui button" onclick="get_GeoTiff(' + (crop_canvas_num_Geotiff) + ')">GeoTiff下載</button>\
                                                    <button class="ui button" onclick="get_GeoPDF(' + (crop_canvas_num_Geotiff) + ')">GeoPDF下載</button>\
                                                    <br>\
                                                    <br>\
                                                    <div class="ui input">\
                                                        <input type="text" value="'+layerName+' "placeholder="layer'+ crop_canvas_num_Geotiff +' name" id="GeoPDF_layer_name_'+ crop_canvas_num_Geotiff +'" >\
                                                    </div>\
                                                    <button class="ui button" onclick="crop_order_remove_GeoPDF(this, ' + (crop_canvas_num_Geotiff) + ')"><i class="trash  icon"></i></button> \
                                                    <br>\
                                                </div> \
                                            </div>')
        crop_canvas_num_Geotiff += 1
        crop_canvas_view_win_Geotiff.show();
    })
}

function distance(lat1,lon1,lat2,lon2) {
    //reference: http://maxtellyou.blogspot.com/2012/09/calculate-distance-between-two-points.html
    var R = 6371; // m (change this constant to get miles)
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180 ) *  Math.cos(lat2 * Math.PI / 180 ) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    // if (d>1) return d;
    // else if (d<=1) return Math.round(d*1000);
    return d;
}

function get_GeoTiff(imgNumber){
    //projection
    var TFW_data = get_TFW_data(imgNumber)
    //geotiff
    var Geotiff_data = document.getElementById("crop_img_GeoTiff_" + imgNumber)
    console.log(Geotiff_data.src)
    console.log(Geotiff_data)
    //save Geotiff on server
    var FileName
    $.ajax({
        url: 'php/save_Geotiff.php',
        type: 'POST',
        async : false, //for return
        data: {
            imgBase64: Geotiff_data.src, 
            TFW_file: TFW_data
        },
        success: function(result){
            FileName = result
            console.log(result);
        },
        error: function(jqXHR) {
            alert("error " + jqXHR.status);
        }
    });
    // create geotiff with projection
    $.ajax({
        url: 'php/create_Geotiff_with_projection.php',
        type: 'POST',
        async : false, //for return
        data: {
            FileName: FileName
        },
        success: function(result){
            console.log(result);
        },
        error: function(jqXHR) {
            alert("error " + jqXHR.status);
        }
    });

    //download
    FileName = FileName + '_proj.tif'
    Path =  "storage/temp_geotiff/tmp/" + FileName
    var user_Geotiff_name = $('#GeoPDF_layer_name_'+String(imgNumber)).val()
    var a = $("<a>").attr({ "download"  : user_Geotiff_name, 
                            "href"      : Path})
    a[0].click();
    a.remove();
}

function get_GeoTiff_list(){
    FileName_list_str = ""
    for(i = 0; i < crop_canvas_list_Geotiff.length; i++){
        var imgNumber = crop_canvas_list_Geotiff[i][0]

        //debug
        // console.log(i)
        // console.log(crop_canvas_list_Geotiff[i])
        // console.log(crop_canvas_list_Geotiff[i][0])
        
        
        //projection
        var TFW_data = get_TFW_data(imgNumber)
        //geotiff
        var Geotiff_data = document.getElementById("crop_img_GeoTiff_" + String(imgNumber))

        //save Geotiff on server
        var FileName
        $.ajax({
            url: 'php/save_Geotiff.php',
            type: 'POST',
            async : false, //for return
            data: {
                imgBase64: Geotiff_data.src, 
                TFW_file: TFW_data
            },
            success: function(result){
                FileName = result
                //console.log(result);
            },
            error: function(jqXHR) {
                alert("error " + jqXHR.status);
            }
        });
        // create geotiff with projection
        $.ajax({
            url: 'php/create_Geotiff_with_projection.php',
            type: 'POST',
            async : false, //for return
            data: {
                FileName: FileName
            },
            success: function(result){
                console.log(result)
            },
            error: function(jqXHR) {
                alert("error " + jqXHR.status);
            }
        });
        if(i == crop_canvas_list_Geotiff.length-1)
            FileName_list_str += FileName+"_proj.tif"
        else
            FileName_list_str += FileName+"_proj.tif,"
    }
    zipName = new Date().valueOf()
    $.ajax({
        url: 'php/download_compressed_tiffs.php',
        type: 'POST',
        async : false, //for return
        data: {
            FileName: FileName_list_str, 
            zipName: zipName
        },
        success: function(result){
            FileName = result
            console.log(result);
        },
        error: function(jqXHR) {
            alert("error " + jqXHR.status);
        }
    });
    //download
    Path =  "storage/temp_geotiff/tmp/" + zipName + ".zip"
    zipName_download = $('#GeoPDF_name').val()
    var a = $("<a>").attr({ "download"  : zipName_download, 
                            "href"      : Path})
    a[0].click();
    a.remove();

}

/*** 20200322 ***/
/*** 20200701 ***/
function get_TFW_data(imgNumber){
    console.log(imgNumber)
    console.log(Geotiff_proj_data_list)
    for(i = 0; i < Geotiff_proj_data_list.length; i++){
        if(imgNumber == Geotiff_proj_data_list[i][0]){
            var startCoorX = Geotiff_proj_data_list[i][1][0]
            var startCoorY = Geotiff_proj_data_list[i][1][1]
            var endCoorX   = Geotiff_proj_data_list[i][1][2]
            var endCoorY   = Geotiff_proj_data_list[i][1][3]
        
            var StartMouseX = Geotiff_proj_data_list[i][1][4]
            var StartMouseY = Geotiff_proj_data_list[i][1][5]
            var EndMouseX   = Geotiff_proj_data_list[i][1][6]
            var EndMouseY   = Geotiff_proj_data_list[i][1][7]

            break
        }
    }

            //ensure that the start point is the left-up point
    if(startCoorX > endCoorX)
    {
        tmp = startCoorX;
        startCoorX = endCoorX;
        endCoorX = tmp;
    }
    if(startCoorY < endCoorY)
    {
        tmp = startCoorY;
        startCoorY = endCoorY;
        endCoorY = tmp;
    }
    if(StartMouseX > EndMouseX)
    {
        tmp = StartMouseX;
        StartMouseX = EndMouseX;
        EndMouseX = tmp;
    }
    if(StartMouseY < EndMouseY)
    {
        tmp = StartMouseY;
        StartMouseY = EndMouseY;
        EndMouseY = tmp;
    }

    disX = distance(startCoorY, startCoorX, startCoorY, endCoorX)
    disY = distance(startCoorY, startCoorX, endCoorY, startCoorX)
    resX = disX*1000/(EndMouseX-StartMouseX)
    resY = disY*1000/(EndMouseY-StartMouseY)
    rotateX = 0
    rotateY = 0

    var startCoor_TWD97 = proj4(EPSG4326, EPSG3826, [startCoorX, startCoorY])
    var startCoorX_TWD97 = startCoor_TWD97[0]
    var startCoorY_TWD97 = startCoor_TWD97[1]

    var TFW_data = resX+"\n"+rotateX+"\n"+rotateY+"\n"+resY+"\n"+startCoorX_TWD97+"\n"+startCoorY_TWD97+"\n"
    
    return TFW_data
}
function get_GeoPDF(imgNumber){
    //projection
    var TFW_data = get_TFW_data(imgNumber)
    console.log(TFW_data)
    //geotiff
    var Geotiff_data = document.getElementById("crop_img_GeoTiff_" + imgNumber)
    
    //save Geotiff on server
    var FileName
    $.ajax({
		url: 'php/save_Geotiff.php',
        type: 'POST',
        async : false, //for return
        data: {
            imgBase64: Geotiff_data.src, 
            TFW_file: TFW_data
        },
		success: function(result){
            FileName = result
            console.log(result);
        },
        error: function(jqXHR) {
			alert("error " + jqXHR.status);
		}
    });

    //geopdf layer name
    var layer_name = $('#GeoPDF_layer_name_'+imgNumber).val()
    console.log("layername filename:")
    console.log(layer_name)
    console.log(FileName)

    //translate geotiff to geopdf
    $.ajax({
		url: 'php/create_Geopdf.php',
        type: 'POST',
        async : false, //wait until php return
        data: {
            FileName: FileName,
            layer_name: layer_name
        },
		success: function(result){
            console.log(result);
        },
        error: function(jqXHR) {
			alert("error " + jqXHR.status);
		}
    });

    //download
    
    FileName = FileName + '.pdf'
    Path =  "storage/temp_geopdf/" + FileName
    var user_GeoPDF_name = $('#GeoPDF_layer_name_'+String(imgNumber)).val()
    var a = $("<a>").attr({ "download"  : user_GeoPDF_name, 
                            "href"      : Path})
    a[0].click();
    a.remove();
}

/*** 20200701 ***/
/*** 20200731 ***/
function get_GeoPDF_combine(){                                                                                                                                                                                                                                           
    tiff_name = []

    for(i = 0; i < crop_canvas_list_Geotiff.length; i++){
        var imgNumber = crop_canvas_list_Geotiff[i][0]
        var Geotiff_data = document.getElementById("crop_img_GeoTiff_" + String(imgNumber))
        if(Geotiff_data)
        {
            var TFW_data = get_TFW_data(imgNumber)
            console.log(TFW_data)
            //save Geotiff on server
            $.ajax({
                url: 'php/save_Geotiff.php',
                type: 'POST',
                async : false, //wait until php return
                data: {
                    imgBase64: Geotiff_data.src, 
                    TFW_file: TFW_data
                },
                success: function(result){
                    tiff_name.push(result)
                    console.log(result);
                },
                error: function(jqXHR) {
                    alert("error " + jqXHR.status);
                }
            });
        }
    }
    tiff_name_str = tiff_name.toString()

    // geopdf layers name
    for(i = 0; i < crop_canvas_list_Geotiff.length; i++) {
        var imgNumber = crop_canvas_list_Geotiff[i][0]
        if(i == 0)
            layer_name = $('#GeoPDF_layer_name_'+String(imgNumber)).val()
        else
            layer_name += ","+$('#GeoPDF_layer_name_'+String(imgNumber)).val()
    }
    layer_name = layer_name.replace(/\s*/g,"")

    
    //transform geotiff to geopdf
    $.ajax({
        url: 'php/create_Geopdf.php',
        type: 'POST',
        async : false, //for return
        data: {
            FileName: tiff_name_str,
            layer_name: layer_name
        },
        success: function(result){
            console.log(result);
        },
        error: function(jqXHR) {
            alert("error " + jqXHR.status);
        }
    });
    FileName = tiff_name[0] + '.pdf'
    
    Path =  "storage/temp_geopdf/" + FileName
    var user_GeoPDF_name = $('#GeoPDF_name').val()
    var a = $("<a>").attr({ "download"  : user_GeoPDF_name, 
                            "href"      : Path})
    a[0].click();
    a.remove();

    
}
/*** 20200731 ***/

/*** 20201019****/
function add_crop_img_to_Geotiff_origin(){ 
    if(curLayerContentID[curLayerContentID.length-1] == 'base') {
        alert('未選取目標圖資進行原解析度資料裁切申請')
    }
    else if(geopdf_area/1000000 > geopdf_area_ulimit) {
        alert("請選取範圍小於 " + geopdf_area_ulimit + " 平方公里範圍!")
    }
    // else if(geopdf_area/1000000 < geopdf_area_dlimit) {
    //     alert("請選取範圍大於 " + geopdf_area_dlimit + " 平方公里範圍!")
    // }
    else {
        startCoorX = start_coor.split(',')[0]
        startCoorY = start_coor.split(',')[1]
        endCoorX = end_coor.split(',')[0]
        endCoorY = end_coor.split(',')[1]
    
        if(startCoorX > endCoorX)
        {
            tmp = startCoorX;
            startCoorX = endCoorX;
            endCoorX = tmp;
        }
        if(startCoorY < endCoorY)
        {
            tmp = startCoorY;
            startCoorY = endCoorY;
            endCoorY = tmp;
        }
        crop_canvas_list_Geotiff_origin.push([crop_canvas_num_Geotiff_origin, []])
        for(i = 0; i < crop_canvas_list_Geotiff_origin.length; i++) {
            if(crop_canvas_list_Geotiff_origin[i][0] == crop_canvas_num_Geotiff_origin) {
                // layer name
                crop_canvas_list_Geotiff_origin[i][1].push($('#gif_text').val())
                // x
                crop_canvas_list_Geotiff_origin[i][1].push(startCoorX)
                crop_canvas_list_Geotiff_origin[i][1].push(startCoorY)
                // y
                crop_canvas_list_Geotiff_origin[i][1].push(endCoorX)
                crop_canvas_list_Geotiff_origin[i][1].push(endCoorY)
                
                crop_canvas_list_Geotiff_origin[i][1].push(start_mouse_x)
                crop_canvas_list_Geotiff_origin[i][1].push(start_mouse_y)
                crop_canvas_list_Geotiff_origin[i][1].push(end_mouse_x)
                crop_canvas_list_Geotiff_origin[i][1].push(end_mouse_y)
                // layer id
                crop_canvas_list_Geotiff_origin[i][1].push(curLayerContentID[curLayerContentID.length-1])

                break
            }
        }
    
        crop_x = 0
        crop_y = 0
        crop_width = 0
        crop_height = 0
        
        if (start_mouse_x > end_mouse_x) {
            crop_x = end_mouse_x 
            crop_width = start_mouse_x - end_mouse_x
        } else {
            crop_x = start_mouse_x 
            crop_width = end_mouse_x - start_mouse_x
        }
        
        if (start_mouse_y > end_mouse_y) {
            crop_y = end_mouse_y 
            crop_height = start_mouse_y - end_mouse_y
        } else {
            crop_y = start_mouse_y 
            crop_height = end_mouse_y - start_mouse_y
        }
        var layerName = $('#gif_text').val()
        if (layerName == '')
            layerName = 'layer'+crop_canvas_num_Geotiff
        screenshot($('#map0')[0], {
            x: crop_x, // this are our custom x y properties
            y: crop_y, 
            width: crop_width, // final width and height
            height: crop_height,
            useCORS: true, // you can still pass default html2canvas options
            logo: false, // BigGIS logo
            title: false // picture title
             }).then(canvas => {
            //do whatever with the canvas
            var img = convertCanvasToImage(canvas);
            var img_w = crop_width;
            var img_h = crop_height;
            var img_ratio = 100 / img_w;
            var rescale_img_h = img_h * img_ratio;
            
            //var imgsrc = URL.createObjectURL(img)
            //crop_canvas_view_win.setText('離線圖資編輯列表')
            //crop_canvas_list_Geotiff.push([crop_canvas_num_Geotiff, canvas])
            $('#crop_canvas_view_list_Geotiff_origin').append('<div class="item">\
                                                    <div class="content"> \
                                                        <img id="crop_img_GeoTiff_origin_' + crop_canvas_num_Geotiff_origin + '" src="' + img.src + '" width="100" height="' + rescale_img_h + '" > \
                                                        <select id="GEOINFO_API_list">\
                                                        <option value="0">GeoTiff</option>\
                                                        <option value="1">GeoTiff + GeoPDF</option>\
                                                        </select>\
                                                        <br>\
                                                        <button class="ui button" id="download_GeoINFO_origin_'+ crop_canvas_num_Geotiff_origin +'" onclick="get_GeoINFO_origin(' + (crop_canvas_num_Geotiff_origin) + ')">申請原解析度檔案</button>\
                                                        <br>\
                                                        <br>\
                                                        <div class="ui input">\
                                                            <input type="text" value="'+layerName+' "placeholder="layer'+ crop_canvas_num_Geotiff_origin +' name" id="GeoPDF_layer_name_origin_'+ crop_canvas_num_Geotiff_origin +'" >\
                                                        </div>\
                                                        <button class="ui button" onclick="crop_order_remove_GeoPDF_origin(this, ' + (crop_canvas_num_Geotiff_origin) + ')"><i class="trash  icon"></i></button> \
                                                        <br>' + '\
                                                    </div> \
                                                </div>')
            crop_canvas_num_Geotiff_origin += 1
            crop_canvas_view_win_Geotiff_origin.show()
        })
    }
}
// current layer queue
var curLayerContentID = ['base'];
function get_GeoPDF_origin(imgNumber) {
    console.log('imgnumber=', imgNumber)

    btnID = 'download_GeoPDF_origin_'+imgNumber
    btn = document.getElementById(btnID)
    btn.disabled = true
    
    // information
    userid = Login_ID//TODO
    // product_id = '0L-0003S'//TODO
    product_id = curLayerContentID[curLayerContentID.length-1]//Test
    var startCoorX
    var startCoorY
    var endCoorX
    var endCoorY
    var layer_name_origin
    for(i = 0; i < crop_canvas_list_Geotiff_origin.length; i++){
        if(imgNumber == crop_canvas_list_Geotiff_origin[i][0]){
            layer_name_origin = crop_canvas_list_Geotiff_origin[i][1][0]
            startCoorX = crop_canvas_list_Geotiff_origin[i][1][1]
            startCoorY = crop_canvas_list_Geotiff_origin[i][1][2]
            endCoorX   = crop_canvas_list_Geotiff_origin[i][1][3]
            endCoorY   = crop_canvas_list_Geotiff_origin[i][1][4]
            break
        }
    }

    p0 = [startCoorX, startCoorY]
    p1 = [endCoorX, startCoorY]
    p2 = [endCoorX, endCoorY]
    p3 = [startCoorX, endCoorY]
    p4 = [startCoorX, startCoorY]
    region = p0[0].toString() + '%2C' + p0[1].toString() + '%3B' + 
             p1[0].toString() + '%2C' + p1[1].toString() + '%3B' +
             p2[0].toString() + '%2C' + p2[1].toString() + '%3B' +
             p3[0].toString() + '%2C' + p3[1].toString() + '%3B' +
             p4[0].toString() + '%2C' + p4[1].toString()
    PDF = 1
    query_str="https://compute.geodac.tw/geoinfo_api/api/geodac/compute/geopdf?userid="+userid+"&product_id="+product_id+"&pdf="+PDF+"&layer_name="+layer_name_origin+"&region="+region;
    // console.log('query_str:', query_str)
    var ComputeId = 0
    
    $.ajax({
        type: "GET",
		url: "php/get_GEOINFO.php",
        dataType: 'json',
        data: {
            query_str: query_str
        },
		success: function(response){
            console.log(response)
            console.log('compute id:', response['ComputeId']);
            ComputeId = response['ComputeId']
            WaitForComputeResult(btnID, ComputeId)
        },
        error: function(jqXHR) {
			alert("此圖資因授權、介接原因，無提供原始影像裁切申請功能");
            btn.disabled = false
		}
    });
    
    

}
function get_GeoINFO_origin(imgNumber) {
    // disable button
    btnID = 'download_GeoINFO_origin_'+imgNumber
    btn = document.getElementById(btnID)
    btn.innerText = '正在計算原解析度檔案...'
    btn.disabled = true

    var SelectValue = document.getElementById('GEOINFO_API_list').value
    if(SelectValue == 0)
        PDF = 0
    else
        PDF = 1

    // information
    userid = Login_ID
    var product_id
    var startCoorX, startCoorY, endCoorX, endCoorY
    var layer_name_origin
    for(i = 0; i < crop_canvas_list_Geotiff_origin.length; i++){
        if(imgNumber == crop_canvas_list_Geotiff_origin[i][0]){
            layer_name_origin = crop_canvas_list_Geotiff_origin[i][1][0]
            startCoorX = crop_canvas_list_Geotiff_origin[i][1][1]
            startCoorY = crop_canvas_list_Geotiff_origin[i][1][2]
            endCoorX   = crop_canvas_list_Geotiff_origin[i][1][3]
            endCoorY   = crop_canvas_list_Geotiff_origin[i][1][4]
            product_id = crop_canvas_list_Geotiff_origin[i][1][9]
            break
        }
    }
    // change status text
    var StatusText = document.getElementById('get_GEOINFO_status')
    StatusText.innerText = '圖資\"'+layer_name_origin+'\"正在裁切，請稍後......'
   
    p0 = [startCoorX, startCoorY]
    p1 = [endCoorX, startCoorY]
    p2 = [endCoorX, endCoorY]
    p3 = [startCoorX, endCoorY]
    p4 = [startCoorX, startCoorY]
    region = p0[0].toString() + '%2C' + p0[1].toString() + '%3B' + 
             p1[0].toString() + '%2C' + p1[1].toString() + '%3B' +
             p2[0].toString() + '%2C' + p2[1].toString() + '%3B' +
             p3[0].toString() + '%2C' + p3[1].toString() + '%3B' +
             p4[0].toString() + '%2C' + p4[1].toString()
    
    query_str="https://compute.geodac.tw/geoinfo_api/api/geodac/compute/geopdf?userid="+userid+"&product_id="+product_id+"&pdf="+PDF+"&layer_name="+layer_name_origin+"&region="+region;
    // console.log('query_str:', query_str)
    var ComputeId = 0
    $.ajax({
        type: "GET",
		url: "php/get_GEOINFO.php",
        dataType: 'json',
        data: {
            query_str: query_str
        },
		success: function(response){
            console.log(response['result'] )
            if(response['result'] != true) {
                alert("此類型圖資因授權、介接原因或尚未完成原解析度功能，無提供原始影像裁切申請功能");
                btn.disabled = false
                btn.innerText = '申請原解析度檔案'
                StatusText.innerText = ''
            }
            else {
                console.log('compute id:', response['ComputeId']);
                ComputeId = response['ComputeId']
                WaitForComputeResult(btnID, ComputeId, layer_name_origin)
            }
        },
        error: function(jqXHR) {
			alert("此類型圖資因授權、介接原因或尚未完成原解析度功能，無提供原始影像裁切申請功能");
            btn.disabled = false
            btn.innerText = '申請原解析度檔案'
            StatusText.innerText = ''
		}
    });  
}
function get_GeoTiff_origin(imgNumber) {

    btnID = 'download_GeoTiff_origin_'+imgNumber
    btn = document.getElementById(btnID)
    btn.disabled = true
    
    // information
    userid = Login_ID//TODO
    // product_id = '0L-0003S'//TODO
    product_id = curLayerContentID[curLayerContentID.length-1]//Test
    var startCoorX
    var startCoorY
    var endCoorX
    var endCoorY
    var layer_name_origin
    for(i = 0; i < crop_canvas_list_Geotiff_origin.length; i++){
        if(imgNumber == crop_canvas_list_Geotiff_origin[i][0]){
            layer_name_origin = crop_canvas_list_Geotiff_origin[i][1][0]
            startCoorX = crop_canvas_list_Geotiff_origin[i][1][1]
            startCoorY = crop_canvas_list_Geotiff_origin[i][1][2]
            endCoorX   = crop_canvas_list_Geotiff_origin[i][1][3]
            endCoorY   = crop_canvas_list_Geotiff_origin[i][1][4]
            break
        }
    }

    p0 = [startCoorX, startCoorY]
    p1 = [endCoorX, startCoorY]
    p2 = [endCoorX, endCoorY]
    p3 = [startCoorX, endCoorY]
    p4 = [startCoorX, startCoorY]
    region = p0[0].toString() + '%2C' + p0[1].toString() + '%3B' + 
             p1[0].toString() + '%2C' + p1[1].toString() + '%3B' +
             p2[0].toString() + '%2C' + p2[1].toString() + '%3B' +
             p3[0].toString() + '%2C' + p3[1].toString() + '%3B' +
             p4[0].toString() + '%2C' + p4[1].toString()
    PDF = 0
    query_str="https://compute.geodac.tw/geoinfo_api/api/geodac/compute/geopdf?userid="+userid+"&product_id="+product_id+"&pdf="+PDF+"&layer_name="+layer_name_origin+"&region="+region;
    // console.log('query_str:', query_str)
    var ComputeId = 0
    
    $.ajax({
        type: "GET",
		url: "php/get_GEOINFO.php",
        dataType: 'json',
        data: {
            query_str: query_str
        },
		success: function(response){
            console.log(response)
            console.log('compute id:', response['ComputeId']);
            ComputeId = response['ComputeId']
            WaitForComputeResult(btnID, ComputeId)
        },
        error: function(jqXHR) {
			alert("此圖資因授權、介接原因，無提供原始影像裁切申請功能");
            btn.disabled = false
		}
    });  
    
    
    
}

// 等待API端計算完成 重新enable button
async function WaitForComputeResult(btnID, ComputeId, fileName) {
    console.log(btnID, ComputeId)
    var btn = document.getElementById(btnID)
    var StatusText = document.getElementById('get_GEOINFO_status')
    var status = 'Q'
    var ctr = 0
    var MaxWaitingTime = 100
    var timeInterval = 2000 // check every 2000 ms

    var timer = setInterval(function() {
        ctr += 1
        $.ajax({
            type:"GET",
            url:"php/GetComputeResult_GEOINFO.php",
            dataType:'json',
            success: function(response){
                console.log(response)
                for(let i=0; i<response.length; i++){
                    if(response[i]['ComputeId'] == ComputeId){
                        console.log('status:', response[i]['ExecuteStatus'])
                        status = response[i]['ExecuteStatus']
                        break
                    }
                }
            },
            error: function(jqXHR) {
                console.log("GetComputResult error " + jqXHR.status);
            }
        });
        if(status == 'S') {
            clearInterval(timer)
            console.log('compute completion!')
            btn.innerText = '申請原解析度檔案'
            btn.disabled = false
            StatusText.innerText = '您申請\"' + fileName + '\"訂單已經完成，請至信箱收件下載'
        }
        if(ctr >= MaxWaitingTime) {
            clearInterval(timer)
            console.log('timeout! there is something error in computing')
            btn.innerText = '申請原解析度檔案'
            btn.disabled = false
            StatusText.innerText = ''
        }
    }, timeInterval)
    
}

function get_GeoPDF_combine_origin() {
    alert("開發中!")
    
}
function get_GeoTiff_list_origin() {
    alert("開發中!")
    //TODO
}
function set_curLayerContentID(content){
    if(curLayerContentID.includes(content)) {
        curLayerContentID = curLayerContentID.filter(item => item !== content)
    }
    else {
        curLayerContentID.push(content)
    }

    console.log('current layer:', curLayerContentID)
}

/*** 20201019 ***/


    crop_canvas_kml_num = 1;


/*** 20201111 ***/
function wrapLon(value) {
    var worlds = Math.floor((value + 180) / 360);
    return value - (worlds * 360);
}
function get_full_screen_image() {
    var extent = maps[map_ind].getView().calculateExtent(maps[map_ind].getSize());
    console.log(extent)
    var bottomLeft = ol.proj.transform(ol.extent.getBottomLeft(extent),
    'EPSG:3857', 'EPSG:4326');
    var topRight = ol.proj.transform(ol.extent.getTopRight(extent),
    'EPSG:3857', 'EPSG:4326');
    
    console.log(proj4(EPSG3857, EPSG4326, [extent[0], extent[3]]))
    console.log(proj4(EPSG3857, EPSG4326, [extent[2], extent[1]]))

    startCoorX = bottomLeft[0]
    startCoorY = topRight[1]
    endCoorX = topRight[0]
    endCoorY = bottomLeft[1]

    maxWidth = document.body.clientWidth
    maxHeight = document.body.clientHeight
    console.log(startCoorX)
    console.log(startCoorY)
    console.log(endCoorX)
    console.log(endCoorY)

    console.log(maxWidth)
    console.log(maxHeight)

    Geotiff_proj_data_list.push([crop_canvas_num_Geotiff, []])
    for(i = 0; i < Geotiff_proj_data_list.length; i++) {
        if(Geotiff_proj_data_list[i][0] == crop_canvas_num_Geotiff) {
            Geotiff_proj_data_list[i][1].push(startCoorX)
            Geotiff_proj_data_list[i][1].push(startCoorY)
            Geotiff_proj_data_list[i][1].push(endCoorX)
            Geotiff_proj_data_list[i][1].push(endCoorY)

            Geotiff_proj_data_list[i][1].push(0)
            Geotiff_proj_data_list[i][1].push(0)
            Geotiff_proj_data_list[i][1].push(maxWidth)
            Geotiff_proj_data_list[i][1].push(maxHeight)       
            break
        }
    }
    screenshot($('#map0')[0], {
        x: 0, // this are our custom x y properties
        y: 0, 
        width: maxWidth, // final width and height
        height: maxHeight,
        useCORS: true, // you can still pass default html2canvas options
        logo: false, // BigGIS logo
        title: false // picture title
         }).then(canvas => {
        //do whatever with the canvas
        var img = convertCanvasToImage(canvas);
        var img_w = maxWidth;
        var img_h = maxHeight;
        var img_ratio = 100 / img_w;
        var rescale_img_h = img_h * img_ratio;
        
        //var imgsrc = URL.createObjectURL(img)
        //crop_canvas_view_win.setText('離線圖資編輯列表')
        var layerName = $('#gif_text').val()
        if (layerName == '')
            layerName = 'layer'+crop_canvas_num_Geotiff
        crop_canvas_list_Geotiff.push([crop_canvas_num_Geotiff, canvas])
        console.log('push!')
        $('#crop_canvas_view_list_Geotiff').append('<div class="item">\
                                                <div class="content"> \
                                                    <img id="crop_img_GeoTiff_' + crop_canvas_num_Geotiff + '" src="' + img.src + '" width="100" height="' + rescale_img_h + '" > \
                                                    <button class="ui button" onclick="get_GeoTiff(' + (crop_canvas_num_Geotiff) + ')">GeoTiff下載</button>\
                                                    <button class="ui button" onclick="get_GeoPDF(' + (crop_canvas_num_Geotiff) + ')">GeoPDF下載</button>\
                                                    <br>\
                                                    <br>\
                                                    <div class="ui input">\
                                                        <input type="text" value="'+layerName+' "placeholder="layer'+ crop_canvas_num_Geotiff +' name" id="GeoPDF_layer_name_'+ crop_canvas_num_Geotiff +'" >\
                                                    </div>\
                                                    <button class="ui button" onclick="crop_order_remove_GeoPDF(this, ' + (crop_canvas_num_Geotiff) + ')"><i class="trash  icon"></i></button> \
                                                    <br>\
                                                </div> \
                                            </div>')
        crop_canvas_num_Geotiff += 1
        crop_canvas_view_win_Geotiff.show();
    })
}

/*** 20201111 ***/
crop_cmd = ""
function get_crop_kmz() {
    console.log('creating kmz')
    if(crop_cmd === 'ok') {
        btn_disable();	

        //create new node(loading signal)
        loading_id = "l"+crop_img_num.toString();		
		crop_img_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');		
        crop_img_Tree.enableCheckBoxes(false, false);

        crop_left = start_coor.split(',')[0]
        crop_up = start_coor.split(',')[1]
        crop_right = end_coor.split(',')[0]
        crop_down = end_coor.split(',')[1]
        if($('#GeoPDF_name').val() == '')
            KMZname = 'UserKMZ'
        else
            KMZname = $('#GeoPDF_name').val()
        // crop_kmz = $("#crop_kmz").val();
        $.ajax({
			type: 	"GET",
			url:	"php/get_crop_kmz.php",
			dataType:	"json",
			data: {
				// u : cutfill_web_url_image,
				// u_gis : cutfill_web_url_gis,
				// u_cf :cutfill_web_url_cf,
				// w : cutfill_wkt,
				// d : cutfill_data,
				// height : cutfill_height,
				left: crop_left,
				right: crop_right,
				up: crop_up,
				down: crop_down,
                filename: KMZname
			},
			//jsonpCallback: 'callback',
			success: function(json) {
				console.log(json)
				
				// upload image

				// if ( json.getData == true ) {
					// get .zip file url

					// cutfill_zip_link_arr.push(json.shapefileURL);
					// cutfill_kml_link_arr.push(json.kmlURL);
					// // fillArea = json.fillArea;
					// cutArea = json.cutArea;
					// fillVolume = json.fillVolume;
					// cutVolume = json.cutVolume;
					// areaUnit = json.areaUnit;
					// volumeUnit = json.volumeUnit;

					//alert("img url : " + json.data.link);
					
					crop_img_num = crop_img_num + 1;
					new_node_id = `{
						"PosInfo":"${((crop_up + crop_down) / 2.0).toString() + ";" + 
									 ((crop_left + crop_right) / 2.0).toString() + ";563426;8;" + 
									//  json.imageWidth.toString() + ";" + 
									//  json.imageHeight.toString() + ";" + 
									 crop_left.toString() + ";" + 
									 crop_down.toString() + ";" + 
									 crop_right.toString() + ";" + 
									 crop_up.toString()}",
						"Type":"ImageOverlay",
						
						"ID":"crop_img${crop_img_num.toString()}",
						"FileName":"測試測試${crop_img_num.toString()}"
					}`.replace(/\n|\t/g, "").trim();
					
										
					// delete loading signal

					crop_img_Tree.deleteItem(loading_id, false);
					crop_img_Tree.enableCheckBoxes(true, true);
						
					// layer item
					
					crop_img_Tree.insertNewChild("0", new_node_id, "框選離線圖資" + crop_img_num.toString(), function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					
					
					
					// draw_w4_Tree.insertNewChild(new_node_id, "cutfill_legend" + cutfill_num.toString(), "開啟圖例", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
					// var legend_win = dhxWins.createWindow("cutfill_legwin" + cutfill_num.toString(), 600, 600, 250, 200);
					// legend_win.setText("挖填方圖例");
					
					// legend_win.attachEvent("onClose", function(win){
					// 	var n = parseInt(this.getId().split("s_legwin")[1])
					// 	draw_w4_Tree.setCheck("cutfill_legend" + n.toString(), false);
					// 	//this.close();
					// 	this.hide();
					// });
					
					// dhxWins.window("cutfill_legwin" + cutfill_num.toString()).button("minmax").hide();
					// dhxWins.window("cutfill_legwin" + cutfill_num.toString()).button("park").hide();
					
					// legend_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
					// 			  "<div style='align: center; height:100%;width:100%;'>" + 
					// 			  "<p style='text-align: center; font-size:8px;width:100%;' >挖填方分析" + cutfill_num.toString() + "</p>" + 
					// 			  "<br><img src='https://geodac.ncku.edu.tw/SWCB_LLGIS/cutfill_legend.png' style='align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
					// legend_win.attachHTMLString(legend_html)
					
					// legend_win.hide()
					// crop_img_Tree.showItemCheckbox("cutfill_legwin" + cutfill_num.toString(), false);
					// cutfill_legwin_link_arr.push(legend_win);
					
					// download item
		
					crop_img_Tree.insertNewItem(new_node_id, "dk" + crop_img_num.toString(), "下載 .kmz 檔", 
												function(){ 
													var idn = this.id.split("dk");
													document.getElementById("download_iframe").src = json.kmz;//cutfill_kml_link_arr[idn[1] - 1];
												}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
										
					// fillArea_str = make_thousand_num(fillArea.toString().split('.')[0]);
					// cutArea_str = make_thousand_num(cutArea.toString().split('.')[0]);
					// fillVolume_str = make_thousand_num(fillVolume.toString().split('.')[0]);
					// cutVolume_str = make_thousand_num(cutVolume.toString().split('.')[0]);


					// draw_w4_Tree.insertNewItem(new_node_id, "ds" + cutfill_num.toString(), "<table class = 'ui celled table'><tr><td>填方面積</td><td>" + fillArea_str + " " + areaUnit + "</td></tr><tr><td>挖方面積</td><td>" + cutArea_str + " " + areaUnit + "</td></tr><tr><td>填方體積</td><td>" + fillVolume_str + " " + volumeUnit + "</td></tr><tr><td>挖方體積</td><td>" + cutVolume_str + " " + volumeUnit + "</td></tr></table>", 
					// 							function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');						
											
					
					// draw_w4_Tree.showItemCheckbox("d" + cutfill_num.toString(), false);
                    crop_img_Tree.showItemCheckbox("dk" + crop_img_num.toString(), false);
					// draw_w4_Tree.showItemCheckbox("ds" + cutfill_num.toString(), false);
					
					// Download button Default : closed
					
					crop_img_Tree.closeItem(new_node_id);
						
					// enable button
					
					btn_enable();

				// } else {
				// 	alert("您沒有權限使用此資料類型");
				// 	crop_img_Tree.deleteItem(loading_id, false);
				// 	btn_enable();
				// }
				
			},
			error: function(jqXHR) {

				alert("error " + jqXHR.status);
				crop_img_Tree.deleteItem(loading_id, false);
				btn_enable();
			}
		});
    }
    else {
        alert('尚未選擇區域')
    }

    crop_canvas_name_num = 1;
}

//匯入GIF列表
function upload_crop_image_gif(){

    clear_map();
    clear_crop_image_gif()

    var formData = new FormData();
    formData.append('file',$('#upload_crop_gif')[0].files[0]);

    $.ajax({
        type:   "POST",
        url:    "php/save_upload_gif.php",
        data:   formData,
        contentType: false,
        processData: false,
        //request success
        success: function(json) {
            console.log("return : ", json);

            /*---- restore resolution ----*/
            maps[0].getView().setZoom(parseInt(json.zoom,10));
            maps[0].getView().setCenter([parseFloat(json.center_x), parseFloat(json.center_y)]);
            console.log("zoom : ",json.zoom);

            /*---- redraw select region ----*/
            box_sx = parseInt(json.start_box_x,10);
            box_sy = parseInt(json.start_box_y,10);
            box_ex = parseInt(json.end_box_x,10);
            box_ey = parseInt(json.end_box_y,10);

            box_feature = new ol.Feature(
                new ol.geom.Polygon(
                    [
                        [
                            [box_sx,box_sy],
                            [box_ex,box_sy],
                            [box_ex,box_ey],
                            [box_sx,box_ey],
                            [box_sx,box_sy]
                        ]
                    ]
                )
            );
            source_box = new ol.source.Vector({
                wrapX: false,
                features: [box_feature]
            });
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
            vector_box.setZIndex(draw_box_zindex);

            loc_84=ol.proj.transform([box_sx,box_ey], 'EPSG:3857', 'EPSG:4326');
            
            crop_gif_left = loc_84[0];
            crop_gif_up = loc_84[1];
            
            loc_84=ol.proj.transform([box_ex,box_sy], 'EPSG:3857', 'EPSG:4326');
            
            crop_gif_right = loc_84[0];
            crop_gif_down = loc_84[1];
            console.log("restore up : ",crop_gif_up,", restore left : ", crop_gif_left,", restore down : ", crop_gif_down,", restore right : ", crop_gif_right);
            
            if ($('#crop_twd97').is(":checked")) {
                var crop_coor = proj4(EPSG4326, EPSG3826, [crop_gif_left, crop_gif_up]);
                cropGIFleft = crop_coor[0]
                cropGIFup = crop_coor[1]
                crop_coor = proj4(EPSG4326, EPSG3826, [crop_gif_right, crop_gif_down]);
                cropGIFright = crop_coor[0]
                cropGIFdown = crop_coor[1]
                TWD97 = 1
                deg = 0
            }
            else {
                cropGIFleft = crop_gif_left
                cropGIFup = crop_gif_up
                cropGIFright = crop_gif_right
                cropGIFdown = crop_gif_down
                TWD97 = 0
                deg = 4
            }

            start_mouse_x = parseInt(json.start_crop_x);
            start_mouse_y = parseInt(json.start_crop_y);
            end_mouse_x = parseInt(json.end_crop_x);
            end_mouse_y = parseInt(json.end_crop_y);
            console.log("restore crop sx : ",start_mouse_x,", restore crop sy : ", start_mouse_y,", restore crop ex : ",end_mouse_x,", restore crop ey : ", end_mouse_y);
            
            /*---- restore gif list ----*/
            // create img element for gif picture
            for (var i = 0;i<parseInt(json.pic_num); i++) {
                pic_name = "crop_img_" + i
                var img_id = pic_name + "_src";
                if(document.getElementById(img_id) == null)
                {
                    var c_img = document.createElement('img');
                    c_img.src = json[pic_name];
                    c_img.id = img_id;

                    //console.log("null, img id : ", img_id);

                    document.getElementsByTagName('body')[0].appendChild(c_img);
                    document.getElementById(img_id).style.display = "none";
                }
                else
                {
                    var c_img = document.getElementById(img_id);
                    c_img.remove();

                    c_img = document.createElement('img');
                    c_img.src = json[pic_name];
                    c_img.id = img_id;

                    //console.log("not null, img id : ", img_id);

                    document.getElementsByTagName('body')[0].appendChild(c_img);
                    document.getElementById(img_id).style.display = "none";
                }
            }
            // draw the picture on the canvas and show at the gif list
            if(first_load == 0) {
                for (var i = 0;i<parseInt(json.pic_num); i++) {
                    console.log("In pic " ,i)
                    pic_name = "crop_img_" + i
                    crop_canvas_view_win.show();
    
                    var crop_width = parseInt(json.crop_wid);
                    var crop_height = parseInt(json.crop_hei);
                    console.log("wid, height : ", crop_width, crop_height);
            
                    var img_ratio = 100 / crop_width;
                    var rescale_img_h = crop_height * img_ratio;
    
                    var img_id = pic_name + "_src";
                    var c_img = document.getElementById(img_id);
                    c_img.src = json[pic_name];
                    c_img.id = img_id;
    
                    //console.log("img id : ", img_id);
    
                    // push back picture(with logo and name)
                    var crop_canvs_1 = document.createElement('canvas');
                    var ctx_1 = crop_canvs_1.getContext('2d');
    
                    finalWidth = crop_width;
                    finalHeight = crop_height;
                    ctx_1.canvas.width = finalWidth;
                    ctx_1.canvas.height = finalHeight;
    
                    var list_img = document.getElementById(img_id);
                    ctx_1.drawImage(list_img,0,0)
    
                    // clear the progress bar
                    ctx_1.beginPath();
                    ctx_1.moveTo(0,ctx_1.canvas.height);
                    ctx_1.lineTo(ctx_1.canvas.width,ctx_1.canvas.height);
                    ctx_1.lineWidth = 6;
                    ctx_1.strokeStyle = '#ffcc33';
                    ctx_1.stroke();
    
                    crop_canvas_list.push([crop_canvas_num, ctx_1.canvas]);                
                    var src_img = convertCanvasToImage(ctx_1.canvas);
    
                    var crop_canvs = document.createElement('canvas');
                    var ctx = crop_canvs.getContext('2d');
                    //picture with line
                    var blank_width = getTextWidth(cropGIFup.toFixed(deg).toString(), "bold 8pt 微軟正黑體")
                    var text_size = $('#gif_text_size').val()
                    finalWidth = finalWidth + blank_width * 2;
                    finalHeight = finalHeight + blank_width * 2;
                    ctx.canvas.width = finalWidth;
                    ctx.canvas.height = finalHeight;
    
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, finalWidth, finalHeight);
    
                    ctx.drawImage(list_img,blank_width,blank_width);
                    // clear the progress bar
                    ctx.beginPath();
                    ctx.moveTo(blank_width, (blank_width + list_img.height));
                    ctx.lineTo((blank_width + list_img.width), (blank_width + list_img.height));
                    ctx.lineWidth = 6;
                    ctx.strokeStyle = '#ffcc33';
                    ctx.stroke();
    
                    var compass_icons = document.getElementById('compass_icons');
                    ctx.globalAlpha = 2.0;
                    ctx.drawImage(compass_icons, finalWidth - blank_width, 0, blank_width, blank_width);
    
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(blank_width + (finalWidth - blank_width * 2) / 2, blank_width);
                    ctx.lineTo(blank_width + (finalWidth - blank_width * 2) / 2, finalHeight - blank_width);
                    ctx.stroke();
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(blank_width + (finalWidth - blank_width * 2) / 4, blank_width);
                    ctx.lineTo(blank_width + (finalWidth - blank_width * 2) / 4, finalHeight - blank_width);
                    ctx.stroke();
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(blank_width + (finalWidth - blank_width * 2) * 3 / 4, blank_width);
                    ctx.lineTo(blank_width + (finalWidth - blank_width * 2) * 3 / 4, finalHeight - blank_width);
                    ctx.stroke();
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(blank_width, blank_width + (finalHeight - blank_width * 2) / 2);
                    ctx.lineTo(finalWidth - blank_width, blank_width + (finalHeight - blank_width * 2) / 2);
                    ctx.stroke();
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(blank_width, blank_width + (finalHeight - blank_width * 2) / 4);
                    ctx.lineTo(finalWidth - blank_width, blank_width + (finalHeight - blank_width * 2) / 4);
                    ctx.stroke();
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(blank_width, blank_width + (finalHeight - blank_width * 2) * 3 / 4);
                    ctx.lineTo(finalWidth - blank_width, blank_width + (finalHeight - blank_width * 2) * 3 / 4);
                    ctx.stroke();
                    height = getTextHeight(cropGIFleft.toFixed(deg).toString(), "bold 8pt 微軟正黑體");
                    ctx.fillStyle = 'black';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.font = "bold 8pt 微軟正黑體";
                    ctx.fillText(cropGIFleft.toFixed(deg).toString(), blank_width, finalHeight - blank_width + height);
                    ctx.strokeText(cropGIFleft.toFixed(deg).toString(), blank_width, finalHeight - blank_width + height);
                    ctx.fill();
                    ctx.stroke();
                    height = getTextHeight(cropGIFleft.toFixed(deg).toString(), "bold 8pt 微軟正黑體");
                    ctx.fillStyle = 'black';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.font = "bold 8pt 微軟正黑體";
                    ctx.fillText((cropGIFleft + (cropGIFright - cropGIFleft) / 4).toFixed(deg).toString(), blank_width + (finalWidth - blank_width * 2) / 4, finalHeight - blank_width + height);
                    ctx.strokeText((cropGIFleft + (cropGIFright - cropGIFleft) / 4).toFixed(deg).toString(), blank_width + (finalWidth - blank_width * 2) / 4, finalHeight - blank_width + height);
                    ctx.fill();
                    ctx.stroke();
                    height = getTextHeight(cropGIFleft.toFixed(deg).toString(), "bold 8pt 微軟正黑體");
                    ctx.fillStyle = 'black';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.font = "bold 8pt 微軟正黑體";
                    ctx.fillText((cropGIFleft + (cropGIFright - cropGIFleft) / 2).toFixed(deg).toString(), blank_width + (finalWidth - blank_width * 2) / 2, finalHeight - blank_width + height);
                    ctx.strokeText((cropGIFleft + (cropGIFright - cropGIFleft) / 2).toFixed(deg).toString(), blank_width + (finalWidth - blank_width * 2) / 2, finalHeight - blank_width + height);
                    ctx.fill();
                    ctx.stroke();
                    height = getTextHeight(cropGIFleft.toFixed(deg).toString(), "bold 8pt 微軟正黑體");
                    ctx.fillStyle = 'black';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.font = "bold 8pt 微軟正黑體";
                    ctx.fillText((cropGIFleft + (cropGIFright - cropGIFleft) * 3 / 4).toFixed(deg).toString(), blank_width + (finalWidth - blank_width * 2) * 3 / 4, finalHeight - blank_width + height);
                    ctx.strokeText((cropGIFleft + (cropGIFright - cropGIFleft) * 3 / 4).toFixed(deg).toString(), blank_width + (finalWidth - blank_width * 2) * 3 / 4, finalHeight - blank_width + height);
                    ctx.fill();
                    ctx.stroke();
                    height = getTextHeight(cropGIFright.toFixed(deg).toString(), "bold 8pt 微軟正黑體");
                    width = getTextWidth(cropGIFright.toFixed(deg).toString(), "bold 8pt 微軟正黑體")
                    ctx.fillStyle = 'black';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.font = "bold 8pt 微軟正黑體";
                    ctx.fillText(cropGIFright.toFixed(deg).toString(), finalWidth - width, finalHeight - blank_width + height);
                    ctx.strokeText(cropGIFright.toFixed(deg).toString(), finalWidth - width, finalHeight - blank_width + height);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = 'black';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.font = "bold 8pt 微軟正黑體";
                    ctx.fillText(cropGIFup.toFixed(deg).toString(), 0, blank_width);
                    ctx.strokeText(cropGIFup.toFixed(deg).toString(), 0, blank_width);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = 'black';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.font = "bold 8pt 微軟正黑體";
                    ctx.fillText((cropGIFdown + (cropGIFup - cropGIFdown) * 3 / 4).toFixed(deg).toString(), 0, blank_width + (finalHeight - blank_width * 2) / 4);
                    ctx.strokeText((cropGIFdown + (cropGIFup - cropGIFdown) * 3 / 4).toFixed(deg).toString(), 0, blank_width + (finalHeight - blank_width * 2) / 4);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = 'black';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.font = "bold 8pt 微軟正黑體";
                    ctx.fillText((cropGIFdown + (cropGIFup - cropGIFdown) / 2).toFixed(deg).toString(), 0, blank_width + (finalHeight - blank_width * 2) / 2);
                    ctx.strokeText((cropGIFdown + (cropGIFup - cropGIFdown) / 2).toFixed(deg).toString(), 0, blank_width + (finalHeight - blank_width * 2) / 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = 'black';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.font = "bold 8pt 微軟正黑體";
                    ctx.fillText((cropGIFdown + (cropGIFup - cropGIFdown) / 4).toFixed(deg).toString(), 0, blank_width + (finalHeight - blank_width * 2) * 3 / 4);
                    ctx.strokeText((cropGIFdown + (cropGIFup - cropGIFdown) / 4).toFixed(deg).toString(), 0, blank_width + (finalHeight - blank_width * 2) * 3 / 4);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = 'black';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.font = "bold 8pt 微軟正黑體";
                    ctx.fillText(cropGIFdown.toFixed(deg).toString(), 0, finalHeight - blank_width);
                    ctx.strokeText(cropGIFdown.toFixed(deg).toString(), 0, finalHeight - blank_width);
                    ctx.fill();
                    ctx.stroke();
    
                    crop_canvas_line_list.push([crop_canvas_line_num, ctx.canvas]);
    
    
                    $('#crop_canvas_view_list').append('<div class="item">\
                                                    <div class="content"> \
                                                        <img id="crop_img_' + crop_canvas_num + '" src="' + src_img.src + '" width="100" height="' + rescale_img_h + '" onmouseover="crop_image_mouse_over(' + crop_canvas_num + ', ' + crop_height + ', ' + crop_width + ')" onmouseout="crop_image_mouse_out(' + crop_canvas_num + ', ' + rescale_img_h + ', ' + 100 + ')"> \
                                                        <button class="ui button" onclick="crop_order_up(this, ' + (crop_canvas_num) + ')"><i class="angle up icon"></i></button>\
                                                        <button class="ui button" onclick="crop_order_down(this, ' + (crop_canvas_num) + ')"><i class="angle down  icon"></i></button>\
                                                        <button class="ui button" onclick="crop_order_remove(this, ' + (crop_canvas_num) + ')"><i class="trash  icon"></i></button> \
                                                        <br>' + json["name_"+pic_name] + '\
                                                    </div> \
                                                </div>')
    
                    //crop_canvas_kml_num += 1;
                    crop_canvas_num += 1;
                    crop_canvas_line_num += 1;
    
                    crop_canvas_name_list.push([crop_canvas_name_num,json["name_" + pic_name]]);
                    console.log("crop name ",crop_canvas_name_num," : ", crop_canvas_name_list[(crop_canvas_name_num-1)]);
                    crop_canvas_name_num += 1;
                }
            }
            //maps[0].getInteractions().forEach(function(interaction) {
            //    interaction.setActive(false);
            //}, this);
            //$('#gif_lock_map_cb')[0].classList.add("checked");

            btn_enable();
            if(first_load)
            {
                first_load = 0;
                upload_crop_image_gif();
            }            
        },
        //request fail
        error: function(jqXHR) {
            alert("error " + jqXHR.status);
            btn_enable();
        }
    });
}


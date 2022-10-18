
var featureOverlay;
var popup_overlay;
var features;
var modify;
var want_modify_feature;

/*-- measure global variable --*/
var measure;
var sketch;
var helpTooltipElement;
var helpTooltip;
var measureTooltipElement;
var measureTooltip;
var wgs84Sphere = new ol.Sphere(6378137);
var measure_draw;
var source = new ol.source.Vector();
/*-- !measure global variable --*/
/********* 20220510 add ***********/
// var Location_w1;
// var Baselayer_w1;
/********* 20220510 add ***********/
$(document).ready(function () {
   

    /********* component init ***********/
    var dhxWins = new dhtmlXWindows();
    draw_w1 = dhxWins.createWindow("draw_w1", 1200, 100, 500, 700);
    draw_w1.setText("地圖輔助工具");
    /*** 20190513 add ***/
    draw_w1.showInnerScroll();
    /********************/

    var draw_html = "";
    $.ajax({
        url: 'html/draw.html',
        type: 'get',
        async: false,
        success: function (html) {
            var draw_html = String(html);

            // debug
            //console.log("get : '" + twig + "'");

            // debug
            //console.log("test '" + draw_html + "'");

            draw_w1.attachHTMLString(draw_html);
            permission_set();
        }
    });
    var script = document.createElement('script');
    script.onload = function () {
        console.log('vue load successfull');
    };

    get_compute_result();
    /********* 20220622 add ***********/
    // script.src = "/map/vue/app.js";
    script.src = "../src/vue/app.js";
    /********* 20220622 add ***********/

    document.getElementsByTagName('head')[0].appendChild(script);
    loadcity();
    btn_enable();
    cb_enable();
    // ****************  earthquake  **********************
    Search_earthquake_In_Calendar_S = new dhtmlXCalendarObject({ input: "earthquake_date_from", button: "earthquake_calendar_icon_S" });
    Search_earthquake_In_Calendar_E = new dhtmlXCalendarObject({ input: "earthquake_date_to", button: "earthquake_calendar_icon_E" });
    Search_earthquake_In_Calendar_S.setDate("2013-03-10");
    Search_earthquake_In_Calendar_S.hideTime();
    Search_earthquake_In_Calendar_E.hideTime();
    var earthquake_t = new Date();
    Search_earthquake_In_Calendar_byId("earthquake_date_from").value = "2019-12-25";
    Search_earthquake_In_Calendar_byId("earthquake_date_to").value = earthquake_t.getFullYear() + "-" + (earthquake_t.getMonth() + 1) + "-" + earthquake_t.getDate();

    set_mag_slider();
    set_time_slider();
    set_search_depth_slider();
    set_search_mag_slider();
    display_earthquake_checkbox();
    // display_earthquake_mag_checkbox();
    image_stretch_opacity_slider();

    $("#display_earthquake_checked").prop('disabled', true);
    document.getElementById("display_earthquake_checked").checked = false;

    $("#search_mag_L").html(0);
    $("#search_mag_H").html(10);
    $("#search_depth_L").html(0);
    $("#search_depth_H").html(720);
    $("#image_opacity").html(0);


    $("#show_earthquake_cluster_btn").on('click', function () {
        if (cluster_layer_earthquake != null) {
            change_earthquake_cluster(cluster_layer_earthquake, $(this));
        }
        else {
            console.log("Error, cluster_layer is null");
        }
    });

    $(document).mousedown(function (event) {
        // let pageCoords = "( " + event.pageX + ", " + event.pageY + " )";
        coor_x = event.pageX;
        coor_y = event.pageY;
        // console.log(pageCoords)
    });


    // **************** 鑽探資料 *********************************
    Search_wall_In_Calendar_S = new dhtmlXCalendarObject({ input: "wall_date_from", button: "wall_calendar_icon_S" });
    Search_wall_In_Calendar_E = new dhtmlXCalendarObject({ input: "wall_date_to", button: "wall_calendar_icon_E" });
    Search_wall_In_Calendar_S.setDate("2013-03-10");
    Search_wall_In_Calendar_S.hideTime();
    Search_wall_In_Calendar_E.hideTime();
    var wall_t = new Date();
    Search_wall_In_Calendar_byId("wall_date_from").value = "2000-01-01";
    Search_wall_In_Calendar_byId("wall_date_to").value = wall_t.getFullYear() + "-" + (wall_t.getMonth() + 1) + "-" + wall_t.getDate();

    $("#show_wall_cluster_btn").on('click', function () {
        if (cluster_layer_wall != null) {
            change_wall_cluster(cluster_layer_wall, $(this));
        }
        else {
            console.log("Error, wall cluster_layer is null");
        }
    });

    // 目前 3 欄
    // 修改時請連同 draw.html 一同修改 ( <div class="ui [number in english] item menu">)
    toolItemNum = 3
    for (var i = 1; i <= toolItemNum; i++) {
        $("#toolItem" + i.toString()).on('click', function () {
            if (!$(this).hasClass('item active')) {
                $(this)
                    .addClass('active')
                    .siblings('.item')
                    .removeClass('active');
            }

            token = $(this).attr('id').split('toolItem')[1]

            console.log(token)
            if (token === "1") {
                $("#otherAPIs").css("display", "inline")
                $("#LandAPIs").css("display", "none")
                $("#otherTools").css("display", "none")
            } else if (token === "2") {
                $("#otherAPIs").css("display", "none")
                $("#LandAPIs").css("display", "inline")
                $("#otherTools").css("display", "none")
            } else if (token === "3") {
                $("#LandAPIs").css("display", "none")
                $("#otherAPIs").css("display", "none")
                $("#otherTools").css("display", "inline")
            }
        })
    }
    // default : otherAPIs
    $("#otherAPIs").css("display", "inline")
    $("#LandAPIs").css("display", "none")
    $("#otherTools").css("display", "none")


    draw_w1.attachEvent("onShow", function () {
        $('.ui.accordion').accordion({
            onOpen: function () {
                if ($(this).index(".content") == 0) {
                    // fix prpblem when add text, edit text then add text again
                    // init again
                    switch ($(this).index(".tab")) {
                        case 1:
                            // the ranger wont display until tab index 1 is clicked
                            // so if ranger init at first, the function wont work
                            $("#point_arc_ranger").range({
                                min: -90,
                                max: 90,
                                start: 0,
                                step: 30,
                                onChange: function (value) {
                                    $("#point_text_arc").html(value);
                                    $("#point_text_arc").trigger('input');
                                }
                            });
                            break;
                        case 2:
                            $('#line_arc_ranger').range({
                                min: -90,
                                max: 90,
                                start: 0,
                                step: 30,
                                onChange: function (value) {
                                    $("#line_text_arc").html(value);
                                    $("#line_text_arc").trigger('input');
                                }
                            });
                            break;
                        case 3:
                            $('#poly_arc_ranger').range({
                                min: -90,
                                max: 90,
                                start: 0,
                                step: 30,
                                onChange: function (value) {
                                    $("#poly_text_arc").html(value);
                                    $("#poly_text_arc").trigger('input');
                                }
                            });
                            $('#poly_trans_ranger').range({
                                min: 0,
                                max: 100,
                                start: 50,
                                step: 10,
                                onChange: function (value) {
                                    $("#poly_trans").html(value);
                                    $("#poly_trans").trigger('input');
                                }
                            });
                            break;
                    }
                }
            }
        });

        $('.secondary.menu > .item').tab({
            onVisible: function () {
                // the ranger wont display until tab index 1 is clicked
                // so if ranger init at first, the function wont work
                switch ($(this).index(".tab")) {
                    case 1:
                        $("#point_arc_ranger").range({
                            min: -90,
                            max: 90,
                            start: 0,
                            step: 30,
                            onChange: function (value) {
                                $("#point_text_arc").html(value);
                                $("#point_text_arc").trigger('input');
                            }
                        });
                        break;
                    case 2:
                        $('#line_arc_ranger').range({
                            min: -90,
                            max: 90,
                            start: 0,
                            step: 30,
                            onChange: function (value) {
                                $("#line_text_arc").html(value);
                                $("#line_text_arc").trigger('input');
                            }
                        });
                        break;
                    case 3:
                        $('#poly_arc_ranger').range({
                            min: -90,
                            max: 90,
                            start: 0,
                            step: 30,
                            onChange: function (value) {
                                $("#poly_text_arc").html(value);
                                $("#poly_text_arc").trigger('input');
                            }
                        });
                        $('#poly_trans_ranger').range({
                            min: 0,
                            max: 100,
                            start: 50,
                            step: 10,
                            onChange: function (value) {
                                $("#poly_trans").html(value);
                                $("#poly_trans").trigger('input');
                            }
                        });
                        break;
                }
            }
        });

        $(".color_picker").spectrum({
            preferredFormat: "hex",
            color: "#000000",
            //showPaletteOnly: true,
            showPalette: true,
            hideAfterPaletteSelect: true,
            palette: [
                ['#000000', 'white', '#76060C',
                    'rgb(255, 128, 0);', 'hsv 100 70 50'],
                ['red', '#660066', 'green', 'blue', 'violet']
            ],
            hide: function (color) {
                $(this).parent().children('input').trigger("input");
            }
        });
    });


    /***************hillshade layers*****************/
    hillshade_num = 0;
    kmz_link_arr = [];
    /*** add 20190515 ***/
    legend_link_arr = []
    legwin_link_arr = []
    /*** add 20190515 ***/

    draw_w1_Tree = new dhtmlXTreeObject("treeBox", "100%", "100%", 0);
    draw_w1_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    draw_w1_Tree.enableCheckBoxes(1);
    draw_w1_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    draw_w1_Tree.setOnCheckHandler(Layer_Tree_OnCheck_Hillshade_Tree);
    draw_w1_Tree.setOnDblClickHandler(Location_Grid_DblClicked);


    /*** add 20190515 ***/
    function Layer_Tree_OnCheck_Hillshade_Tree(rowId, state) {
        if (rowId.indexOf("h_legend") == -1) {
            Layer_Tree_Oncheck_Pre("draw_w1_Tree", rowId, state);
        } else {
            var n = parseInt(rowId.split("h_legend")[1]);
            var image_path = legend_link_arr[n - 1]
            console.log(n)
            if (state == true) {
                for (var t = 0; t < legwin_link_arr.length; t++) {
                    console.log(legwin_link_arr[t].getId())
                    if (legwin_link_arr[t].getId() === ("h_legwin" + n.toString())) {
                        legwin_link_arr[t].show();
                        break;
                    }
                }

            } else {

                for (var t = 0; t < legwin_link_arr.length; t++) {
                    console.log(legwin_link_arr[t].getId())
                    if (legwin_link_arr[t].getId() === ("h_legwin" + n.toString())) {
                        legwin_link_arr[t].hide()
                        break;
                    }
                }
            }
        }
    }

    /*** add 20190515 ***/

    /*************** hillshadeAZ layers*****************/

    hillshadeAZ_num = 0;
    AZ_kmz_link_arr = [];
    /*** add 20190515 ***/
    AZ_legend_link_arr = []
    AZ_legwin_link_arr = []
    /*** add 20190515 ***/

    draw_w2_Tree = new dhtmlXTreeObject("treeBoxAZ", "100%", "100%", 0);
    draw_w2_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    draw_w2_Tree.enableCheckBoxes(1);
    draw_w2_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    draw_w2_Tree.setOnCheckHandler(Layer_Tree_OnCheck_HillshadeAZ_Tree);
    draw_w2_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    /*** add 20190515 ***/
    function Layer_Tree_OnCheck_HillshadeAZ_Tree(rowId, state) {
        if (rowId.indexOf("legend") == -1) {
            Layer_Tree_Oncheck_Pre("draw_w2_Tree", rowId, state);
        } else {
            var n = parseInt(rowId.split("legend")[1]);
            var image_path = AZ_legend_link_arr[n - 1]
            console.log(n)
            if (state == true) {
                for (var t = 0; t < AZ_legwin_link_arr.length; t++) {
                    console.log(AZ_legwin_link_arr[t].getId())
                    if (AZ_legwin_link_arr[t].getId() === ("legwin" + n.toString())) {
                        AZ_legwin_link_arr[t].show();
                        break;
                    }
                }

            } else {

                for (var t = 0; t < AZ_legwin_link_arr.length; t++) {
                    console.log(AZ_legwin_link_arr[t].getId())
                    if (AZ_legwin_link_arr[t].getId() === ("legwin" + n.toString())) {
                        AZ_legwin_link_arr[t].hide()
                        break;
                    }
                }
            }
        }
    }
    /*** add 20190515 ***/

    /****************************************************/

    /*************** slope layers*****************/

    slope_num = 0;
    slope_kmz_link_arr = [];
    /*** add 20190515 ***/
    slope_legend_link_arr = []
    slope_legwin_link_arr = []
    /*** add 20190515 ***/

    draw_slope_Tree = new dhtmlXTreeObject("treeBox_slope", "100%", "100%", 0);
    draw_slope_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    draw_slope_Tree.enableCheckBoxes(1);
    draw_slope_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    draw_slope_Tree.setOnCheckHandler(Layer_Tree_OnCheck_Slope_Tree);
    draw_slope_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_Slope_Tree(rowId, state) {
        /*** add 20190515 ***/
        if (rowId.indexOf("slope_legend") == -1) {
            Layer_Tree_Oncheck_Pre("draw_slope_Tree", rowId, state);
        } else {
            var n = parseInt(rowId.split("slope_legend")[1]);
            var image_path = slope_legend_link_arr[n - 1]
            console.log(n)
            if (state == true) {
                for (var t = 0; t < slope_legwin_link_arr.length; t++) {
                    console.log(slope_legwin_link_arr[t].getId())
                    if (slope_legwin_link_arr[t].getId() === ("slope_legwin" + n.toString())) {
                        slope_legwin_link_arr[t].show();
                        break;
                    }
                }

            } else {

                for (var t = 0; t < slope_legwin_link_arr.length; t++) {
                    console.log(slope_legwin_link_arr[t].getId())
                    if (slope_legwin_link_arr[t].getId() === ("slope_legwin" + n.toString())) {
                        slope_legwin_link_arr[t].hide()
                        break;
                    }
                }
            }
        }
        /*** add 20190515 ***/
    }

    /****************************************************/

    /*************** aspect layers*****************/

    aspect_num = 0;
    aspect_kmz_link_arr = [];
    /*** add 20190515 ***/
    aspect_legend_link_arr = []
    aspect_legwin_link_arr = []
    /*** add 20190515 ***/

    draw_aspect_Tree = new dhtmlXTreeObject("treeBox_aspect", "100%", "100%", 0);
    draw_aspect_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    draw_aspect_Tree.enableCheckBoxes(1);
    draw_aspect_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    draw_aspect_Tree.setOnCheckHandler(Layer_Tree_OnCheck_Aspect_Tree);
    draw_aspect_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_Aspect_Tree(rowId, state) {
        /*** add 20190515 ***/
        if (rowId.indexOf("aspect_legend") == -1) {
            Layer_Tree_Oncheck_Pre("draw_aspect_Tree", rowId, state);
        } else {
            var n = parseInt(rowId.split("aspect_legend")[1]);
            var image_path = aspect_legend_link_arr[n - 1]
            console.log(n)
            if (state == true) {
                for (var t = 0; t < aspect_legwin_link_arr.length; t++) {
                    console.log(aspect_legwin_link_arr[t].getId())
                    if (aspect_legwin_link_arr[t].getId() === ("aspect_legwin" + n.toString())) {
                        aspect_legwin_link_arr[t].show();
                        break;
                    }
                }

            } else {

                for (var t = 0; t < aspect_legwin_link_arr.length; t++) {
                    console.log(aspect_legwin_link_arr[t].getId())
                    if (aspect_legwin_link_arr[t].getId() === ("aspect_legwin" + n.toString())) {
                        aspect_legwin_link_arr[t].hide()
                        break;
                    }
                }
            }
        }
        /*** add 20190515 ***/
    }

    /****************************************************/

    /***************contour layers*****************/

    contour_num = 0;

    draw_w3_Tree = new dhtmlXTreeObject("treeBox_contour", "100%", "100%", 0);
    draw_w3_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    draw_w3_Tree.enableCheckBoxes(1);
    draw_w3_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    draw_w3_Tree.setOnCheckHandler(Layer_Tree_OnCheck_Contour_Tree);
    draw_w3_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_Contour_Tree(rowId, state) {
        Layer_Tree_Oncheck_Pre("draw_w3_Tree", rowId, state);
    }

    /**************************************************/

    /*************** cutfill layers*****************/

    cutfill_num = 0;
    cutfill_zip_link_arr = [];
    cutfill_kml_link_arr = [];

    draw_w4_Tree = new dhtmlXTreeObject("treeBox_cutfill", "100%", "100%", 0);
    draw_w4_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    draw_w4_Tree.enableCheckBoxes(1);
    draw_w4_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    draw_w4_Tree.setOnCheckHandler(Layer_Tree_OnCheck_Cutfill_Tree);
    draw_w4_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_Cutfill_Tree(rowId, state) {
        /*** add 20190515 ***/
        if (rowId.indexOf("cutfill_legend") == -1) {
            Layer_Tree_Oncheck_Pre("draw_w4_Tree", rowId, state);
        } else {

            var n = parseInt(rowId.split("cutfill_legend")[1]);
            var image_path = cutfill_legend_link_arr[n - 1]
            console.log(n)
            if (state == true) {
                for (var t = 0; t < cutfill_legwin_link_arr.length; t++) {
                    console.log(cutfill_legwin_link_arr[t].getId())
                    if (cutfill_legwin_link_arr[t].getId() === ("cutfill_legwin" + n.toString())) {
                        cutfill_legwin_link_arr[t].show();
                        break;
                    }
                }

            } else {

                for (var t = 0; t < cutfill_legwin_link_arr.length; t++) {
                    console.log(cutfill_legwin_link_arr[t].getId())
                    if (cutfill_legwin_link_arr[t].getId() === ("cutfill_legwin" + n.toString())) {
                        cutfill_legwin_link_arr[t].hide()
                        break;
                    }
                }
            }
        }
        /*** add 20190515 ***/
    }

    /**************************************************/

    /*************** crop image layers*****************/
    crop_img_num = 0;
    // crop_img_zip_link_arr = [];
    // crop_img_kml_link_arr = [];

    crop_img_Tree = new dhtmlXTreeObject("treeBox_crop_img", "100%", "100%", 0);
    crop_img_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    crop_img_Tree.enableCheckBoxes(1);
    crop_img_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    crop_img_Tree.setOnCheckHandler(Layer_Tree_OnCheck_Crop_img_Tree);
    crop_img_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_Crop_img_Tree(rowId, state) {
        Layer_Tree_Oncheck_Pre("crop_img_Tree", rowId, state);
    }

    /**************************************************/

    /****   20191007 fixed ****/
    /*************** crop gif layers*****************/

    crop_gif_num = 0;
    crop_gif_link_arr = [];
    crop_gif_link_line_arr = [];
    crop_gif_link_kml_arr = [];

    draw_crop_gif_Tree = new dhtmlXTreeObject("treeBox_crop_gif", "100%", "100%", 0);
    draw_crop_gif_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    draw_crop_gif_Tree.enableCheckBoxes(1);
    draw_crop_gif_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    draw_crop_gif_Tree.setOnCheckHandler(Layer_Tree_OnCheck_crop_gif_Tree);
    draw_crop_gif_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_crop_gif_Tree(rowId, state) {
        Layer_Tree_Oncheck_Pre("draw_crop_gif_Tree", rowId, state);
    }
    /**************************************************/
    /****   20191007 fixed ****/

    /****   20190330 fixed ****/
    /***************add geojson layers*****************/

    geoj_num = 0;

    geojson_Tree = new dhtmlXTreeObject("treeBox_geoj", "100%", "100%", 0);
    geojson_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    geojson_Tree.enableCheckBoxes(1);
    geojson_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    geojson_Tree.setOnCheckHandler(Layer_Tree_OnCheck_Geoj_Tree);
    geojson_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_Geoj_Tree(rowId, state) {
        Layer_Tree_Oncheck_Pre("geojson_Tree", rowId, state);
    }

    /**************************************************/
    /***************stifile layers*****************/
    stlfile_num = 0;
    stlfile_arr = [];
    stlimage_arr = [];

    stlfile_Tree = new dhtmlXTreeObject("treeBox_stlfile", "100%", "100%", 0);
    stlfile_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    stlfile_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    stlfile_Tree.setOnCheckHandler(Layer_Tree_OnCheck_Stlfile_Tree);
    stlfile_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_Stlfile_Tree(rowId, state) {
        Layer_Tree_Oncheck_Pre("stlfile_Tree", rowId, state);
    }
    /**************************************************/
    /***************viewshed layers*****************/
    viewshed_num = 0;
    /*** add 20190515 ***/
    viewshed_legend_link_arr = []
    viewshed_legwin_link_arr = []
    /*** add 20190515 ***/

    viewshed_Tree = new dhtmlXTreeObject("treeBox_viewshed", "100%", "100%", 0);
    viewshed_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    viewshed_Tree.enableCheckBoxes(1);
    viewshed_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    viewshed_Tree.setOnCheckHandler(Layer_Tree_OnCheck_viewshed_Tree);
    viewshed_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_viewshed_Tree(rowId, state) {
        /*** add 20190515 ***/
        if (rowId.indexOf("legend") == -1) {
            Layer_Tree_Oncheck_Pre("viewshed_Tree", rowId, state);
        } else {
            var n = parseInt(rowId.split("legend")[1]);
            var image_path = viewshed_legend_link_arr[n - 1]
            console.log(n)
            if (state == true) {
                for (var t = 0; t < viewshed_legwin_link_arr.length; t++) {
                    console.log(viewshed_legwin_link_arr[t].getId())
                    if (viewshed_legwin_link_arr[t].getId() === ("v_legwin" + n.toString())) {
                        viewshed_legwin_link_arr[t].show();
                        break;
                    }
                }
            } else {
                for (var t = 0; t < viewshed_legwin_link_arr.length; t++) {
                    console.log(viewshed_legwin_link_arr[t].getId())
                    if (viewshed_legwin_link_arr[t].getId() === ("v_legwin" + n.toString())) {
                        viewshed_legwin_link_arr[t].hide()
                        break;
                    }
                }
            }
        }
        /*** add 20190515 ***/
    }
    /**************************************************/
    /***************MCRIF layers*****************/
    MCRIF_num = 0;
    MCRIFstl_arr = [];

    MCRIF_Tree = new dhtmlXTreeObject("treeBox_MCRIF", "100%", "100%", 0);
    MCRIF_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    MCRIF_Tree.enableCheckBoxes(1);
    MCRIF_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    MCRIF_Tree.setOnCheckHandler(Layer_Tree_OnCheck_MCRIF_Tree);
    MCRIF_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_MCRIF_Tree(rowId, state) {
        Layer_Tree_Oncheck_Pre("MCRIF_Tree", rowId, state);
    }
    /**************************************************/
    /***************svf layers*****************/
    svf_num = 0;
    svf_arr = [];
    /*** add 20190515 ***/
    svf_legend_link_arr = []
    svf_legwin_link_arr = []
    /*** add 20190515 ***/

    svf_Tree = new dhtmlXTreeObject("treeBox_svf", "100%", "100%", 0);
    svf_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    svf_Tree.enableCheckBoxes(1);
    svf_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    svf_Tree.setOnCheckHandler(Layer_Tree_OnCheck_svf_Tree);
    svf_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_svf_Tree(rowId, state) {

        /*** add 20190515 ***/
        if (rowId.indexOf("s_legend") == -1) {
            Layer_Tree_Oncheck_Pre("svf_Tree", rowId, state);
        } else {
            var n = parseInt(rowId.split("s_legend")[1]);
            var image_path = svf_legend_link_arr[n - 1]
            console.log(n)
            if (state == true) {
                for (var t = 0; t < svf_legwin_link_arr.length; t++) {
                    console.log(svf_legwin_link_arr[t].getId())
                    if (svf_legwin_link_arr[t].getId() === ("s_legwin" + n.toString())) {
                        svf_legwin_link_arr[t].show();
                        break;
                    }
                }

            } else {

                for (var t = 0; t < svf_legwin_link_arr.length; t++) {
                    console.log(svf_legwin_link_arr[t].getId())
                    if (svf_legwin_link_arr[t].getId() === ("s_legwin" + n.toString())) {
                        svf_legwin_link_arr[t].hide()
                        break;
                    }
                }
            }
        }
        /*** add 20190515 ***/

    }
    /**************************************************/
    /***************openness layers*****************/
    openness_num = 0;
    openness_arr = [];
    /*** add 20190515 ***/
    openness_legend_link_arr = []
    openness_legwin_link_arr = []
    /*** add 20190515 ***/

    openness_Tree = new dhtmlXTreeObject("treeBox_openness", "100%", "100%", 0);
    openness_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    openness_Tree.enableCheckBoxes(1);
    openness_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    openness_Tree.setOnCheckHandler(Layer_Tree_OnCheck_openness_Tree);
    openness_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_openness_Tree(rowId, state) {
        /*** add 20190515 ***/
        if (rowId.indexOf("o_legend") == -1) {
            Layer_Tree_Oncheck_Pre("openness_Tree", rowId, state);
        } else {
            var n = parseInt(rowId.split("o_legend")[1]);
            var image_path = openness_legend_link_arr[n - 1]
            console.log(n)
            if (state == true) {
                for (var t = 0; t < openness_legwin_link_arr.length; t++) {
                    console.log(openness_legwin_link_arr[t].getId())
                    if (openness_legwin_link_arr[t].getId() === ("o_legwin" + n.toString())) {
                        openness_legwin_link_arr[t].show();
                        break;
                    }
                }
            } else {
                for (var t = 0; t < openness_legwin_link_arr.length; t++) {
                    console.log(openness_legwin_link_arr[t].getId())
                    if (openness_legwin_link_arr[t].getId() === ("o_legwin" + n.toString())) {
                        openness_legwin_link_arr[t].hide()
                        break;
                    }
                }
            }
        }
        /*** add 20190515 ***/
    }
    /**************************************************/

    /****   20190330 fixed ****/

    /***************** sentinel2 ******************/

/*     sentinel2_num = 0;
    sentinel2_kml_link_arr = [];

    draw_w6_Tree = new dhtmlXTreeObject("treeBox_sentinel2", "100%", "100%", 0);
    draw_w6_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    draw_w6_Tree.enableCheckBoxes(1);
    draw_w6_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    draw_w6_Tree.setOnCheckHandler(Layer_Tree_OnCheck_Sentinel2_Tree);
    draw_w6_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_Sentinel2_Tree(rowId, state) {
        Layer_Tree_Oncheck_Pre("draw_w6_Tree", rowId, state);
    } */

    /*********************************************/

    /***************** add sentinel2 compare ******************/

/*     sentinel2_compare_num = 0;
    sentinel2_compare_kml_link_arr = [];

    draw_w7_Tree = new dhtmlXTreeObject("treeBox_sentinel2_compare", "100%", "100%", 0);
    draw_w7_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    draw_w7_Tree.enableCheckBoxes(1);
    draw_w7_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    draw_w7_Tree.setOnCheckHandler(Layer_Tree_OnCheck_Sentinel2_Compare_Tree);
    draw_w7_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_Sentinel2_Compare_Tree(rowId, state) {
        Layer_Tree_Oncheck_Pre("draw_w7_Tree", rowId, state);
    } */

    /******************************************************/

    /***************** add sentinel2 sis ******************/

/*     sentinel2_sis_num = 0;
    sentinel2_sis_kml_link_arr = [];
    sis_legend_arr = [];
    sis_legwin_arr = [];

    draw_w8_Tree = new dhtmlXTreeObject("treeBox_sentinel2_sis", "100%", "100%", 0);
    draw_w8_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    draw_w8_Tree.enableCheckBoxes(1);
    draw_w8_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    draw_w8_Tree.setOnCheckHandler(Layer_Tree_OnCheck_Sentinel2_Sis_Tree);
    draw_w8_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_Sentinel2_Sis_Tree(rowId, state) {
        if (rowId.indexOf("sis_legend") == -1) {
            Layer_Tree_Oncheck_Pre("draw_w8_Tree", rowId, state);
        } else {
            var n = parseInt(rowId.split("sis_legend")[1]);
            var image_path = sis_legend_arr[n - 1];
            console.log(n);
            if (state == true) {
                for (var t = 0; t < sis_legwin_arr.length; t++) {
                    console.log(sis_legwin_arr[t].getId());
                    if (sis_legwin_arr[t].getId() === ("sis_legwin" + n.toString())) {
                        sis_legwin_arr[t].show();
                        break;
                    }
                }
            } else {
                for (var t = 0; t < sis_legwin_arr.length; t++) {
                    console.log(sis_legwin_arr[t].getId());
                    if (sis_legwin_arr[t].getId() === ("sis_legwin" + n.toString())) {
                        sis_legwin_arr[t].hide();
                        break;
                    }
                }
            }
        }
    } */

    /******************************************************/

    /***************** add 20190610 subscene ******************/

/*     subscene_num = 0;
    subscene_zip_link_arr = [];

    subscene_Tree = new dhtmlXTreeObject("treeBox_subscene", "100%", "100%", 0);
    subscene_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    subscene_Tree.enableCheckBoxes(1);
    subscene_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    subscene_Tree.setOnCheckHandler(Layer_Tree_OnCheck_Subscene_Tree);
    subscene_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_Subscene_Tree(rowId, state) {
        Layer_Tree_Oncheck_Pre("subscene_Tree", rowId, state);
    } */

    /******************************************************/

    /***************** add dual spectrum ******************/

/*     spec_num = 0;
    spec_kml_link_arr = [];

    draw_w9_Tree = new dhtmlXTreeObject("treeBox_dual_spectrum", "100%", "100%", 0);
    draw_w9_Tree.setImagePath("codebase/imgs/dhxtree_material/");
    draw_w9_Tree.enableCheckBoxes(1);
    draw_w9_Tree.attachEvent("onOpenEnd", function (nodeId, event) { doLog("An id of open item is " + nodeId); });
    draw_w9_Tree.setOnCheckHandler(Layer_Tree_OnCheck_Dual_Spectrum_Tree);
    draw_w9_Tree.setOnDblClickHandler(Location_Grid_DblClicked);

    function Layer_Tree_OnCheck_Dual_Spectrum_Tree(rowId, state) {
        Layer_Tree_Oncheck_Pre("draw_w9_Tree", rowId, state);
    } */

    /******************************************************/

    /****************************************************/
    draw_w1.attachEvent("onClose", function () {
        draw_w1.hide();
        draw_w1.setModal(false);
        return false;
    });
    draw_w1.hide();
    /********* !component init ***********/

    /*************** editor popup **************/
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    /**
    * Create an overlay to anchor the popup to the map.
    */
    popup_overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ {
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });

    /**
    * Add a click handler to hide the popup.
    * @return {boolean} Don't follow the href.
    */
    closer.onclick = function () {
        var feature_id = $('#update').siblings("#popup-content").children("div").first().text();
        var feature = featureOverlay.getSource().getFeatureById(feature_id);
        want_modify_feature.remove(feature);

        popup_overlay.setPosition(undefined);
        content.innerHTML = "";
        closer.blur();
        return false;
    };
    /*************** !editor popup **************/


    /************ map init *************/


    features = new ol.Collection();
    //sync feature
    featureOverlay = new ol.layer.Vector({
        source: new ol.source.Vector({ features: features }),
    });

    //add main map
    maps[0].addLayer(featureOverlay);
    featureOverlay.setZIndex(10000);
    maps[0].addOverlay(popup_overlay);

    want_modify_feature = new ol.Collection();
    modify = new ol.interaction.Modify({
        features: want_modify_feature,
        // the SHIFT key must be pressed to delete vertices, so
        // that new vertices can be drawn at the same position
        // of existing vertices
        deleteCondition: function (event) {
            return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
        }
    });
    maps[0].addInteraction(modify);
    /************ !map init *************/

    /************ menu button listener ***********/
    $('.secondary.menu > a.item').on('click', function () {
        if ($(this).data("tab") === "one") {
            map_move_mode();
        }
        /*else if( $(this).data("tab") === "five"){ //measure on change
            measure_start();
        }*/
    });

    $('#point_button').click(function () {
        fun_access_log("Func_Use_Draw_1_1");
        maps[0].removeInteraction(draw); // remove old brush
        maps[0].removeInteraction(measure_draw);
        clear_helptooltip();
        drawIconText();
    });
    $("#point_text_size, input[name='point_icon']").change(function () {
        maps[0].removeInteraction(draw); // remove old brush
        maps[0].removeInteraction(measure_draw);
        clear_helptooltip();
        drawIconText();
    });
    $("#point_text_color, #point_text_content, #point_text_arc").on('input', function () {
        maps[0].removeInteraction(draw); // remove old brush
        maps[0].removeInteraction(measure_draw);
        clear_helptooltip();
        drawIconText();
    });

    $('#line_button').click(function () {
        fun_access_log("Func_Use_Draw_1_1");
        maps[0].removeInteraction(draw); // remove old brush
        maps[0].removeInteraction(measure_draw);
        clear_helptooltip();
        drawLine();
    });
    $("#line_text_size, #line_size").change(function () {
        maps[0].removeInteraction(draw); // remove old brush
        maps[0].removeInteraction(measure_draw);
        clear_helptooltip();
        drawLine();
    });
    $("#line_text_color, #line_color, #line_text_content, #line_text_arc").on('input', function () {
        maps[0].removeInteraction(draw); // remove old brush
        maps[0].removeInteraction(measure_draw);
        clear_helptooltip();
        drawLine();
    });

    $('#poly_button').click(function () {
        fun_access_log("Func_Use_Draw_1_1");
        maps[0].removeInteraction(draw); // remove old brush
        maps[0].removeInteraction(measure_draw);
        clear_helptooltip();
        drawPolygon();
    });
    $("#poly_text_size, #poly_size, #poly_border_size").change(function () {
        maps[0].removeInteraction(draw); // remove old brush
        maps[0].removeInteraction(measure_draw);
        clear_helptooltip();
        drawPolygon();
    });
    $("#poly_text_color, #poly_line_color, #poly_color, #poly_text_content, #poly_text_arc", "#poly_trans").on('input', function () {
        maps[0].removeInteraction(draw); // remove old brush
        maps[0].removeInteraction(measure_draw);
        clear_helptooltip();
        drawPolygon();
    });

    $('#measure_button').click(function () {
        fun_access_log("Func_Use_Draw_1_1");
        maps[0].removeInteraction(draw); // remove old brush
        maps[0].removeInteraction(measure_draw);
        clear_helptooltip();
        measure_start(typeSelect);
    });

    // add landslidedam measure button
    $('#landslidedam_measure').click(function () {
        maps[0].removeInteraction(draw); // remove old brush
        maps[0].removeInteraction(measure_draw);
        clear_helptooltip();
        measure_start(landslidedam_select);
    });

    $(document).on('click', '.search.button', function () {
        var feature_id = $(this).parent().siblings("td").first().children("div").text();
        if (feature_id.split(' ')[0] == "line") {
            maps[0].getView().setCenter(
                featureOverlay.getSource().getFeatureById(feature_id).getGeometry().getCoordinates()[0]
            );
        } else if (feature_id.split(' ')[0] == "polygon") {
            maps[0].getView().setCenter(
                featureOverlay.getSource().getFeatureById(feature_id).getGeometry().getCoordinates()[0][0]
            );
        } else {
            maps[0].getView().setCenter(
                featureOverlay.getSource().getFeatureById(feature_id).getGeometry().getCoordinates()
            );
        }
        maps[0].getView().setZoom(13);
    });

    $(document).on('click', '.edit.button', function () {

        var feature_id = $(this).parent().siblings("td").first().children("div").text();

        var feature = featureOverlay.getSource().getFeatureById(feature_id);
        if (feature_id.split(' ')[0] == "polygon") {
            var coord = feature.getGeometry().getCoordinates()[0][0];
        } else if (feature_id.split(' ')[0] == "line") {
            var coord = feature.getGeometry().getCoordinates()[0];
        } else {
            var coord = feature.getGeometry().getCoordinates();
        }

        coord[1] += 0.1;
        popup_overlay.setPosition(coord);

        want_modify_feature.push(feature);

        var type = $(this).parent().siblings("td:nth-child(2)").children("i").attr('class');
        
        switch (type) {
            case 'font icon':
            case 'home icon':
            case 'h icon':
            case 'warning sign icon':
                var text_style = feature.getStyle().getText();
                var text_size = text_style.getScale();
                if (feature.getStyle().getImage().getImage().toString().indexOf("Image") != -1) {
                    var img = feature.getStyle().getImage().getSrc();
                } else {
                    var img = "none";
                }

                content.innerHTML =
                    "<div style='display: none;'>" + feature_id + "</div>" +
                    "<div class='ui form'>" +
                    "<div class='fields'>" +
                    "<div class='eight wide field'>" +
                    "<label>字體大小</label>" +
                    "<select id='update_text_size'>" +
                    "<option value='1.0' " + ((text_size == 1.0) ? "selected='selected'" : "") + ">1.0</option>" +
                    "<option value='1.5' " + ((text_size == 1.5) ? "selected='selected'" : "") + ">1.5</option>" +
                    "<option value='2.0' " + ((text_size == 2.0) ? "selected='selected'" : "") + ">2.0</option>" +
                    "<option value='2.5' " + ((text_size == 2.5) ? "selected='selected'" : "") + ">2.5</option>" +
                    "<option value='3.0' " + ((text_size == 3.0) ? "selected='selected'" : "") + ">3.0</option>" +
                    "<option value='3.5' " + ((text_size == 3.5) ? "selected='selected'" : "") + ">3.5</option>" +
                    "<option value='4.0' " + ((text_size == 4.0) ? "selected='selected'" : "") + ">4.0</option>" +
                    "<option value='4.5' " + ((text_size == 4.5) ? "selected='selected'" : "") + ">4.5</option>" +
                    "<option value='5.0' " + ((text_size == 5.0) ? "selected='selected'" : "") + ">5.0</option>" +
                    "<option value='5.5' " + ((text_size == 5.5) ? "selected='selected'" : "") + ">5.5</option>" +
                    "<option value='6.0' " + ((text_size == 6.0) ? "selected='selected'" : "") + ">6.0</option>" +
                    "<option value='6.5' " + ((text_size == 6.5) ? "selected='selected'" : "") + ">6.5</option>" +
                    "</select>" +
                    "</div>" +
                    "<div class='eight wide field'>" +
                    "<label>字顏色</label>" +
                    "<input type='text' id='update_text_color_picker' />" +
                    "</div>" +
                    "</div>" +
                    "<div class='field'>" +
                    "<label>內容</label>" +
                    "<input type='text' id='update_text_content' value='" + text_style.getText() + "'/>" +
                    "</div>" +
                    "<div class='fields'>" +
                    "<div class='field'>" +
                    "<input type='radio' name='update_point_icon' " + ((img == "none") ? "checked='checked'" : "") + " value='none' tabindex='0'>" +
                    "<p>無圖示</p>" +
                    "</div>" +
                    "<div class='field'>" +
                    "<input type='radio' name='update_point_icon' " + ((img == "img/marker01.png") ? "checked='checked'" : "") + " value='img/marker01.png' tabindex='0'>" +
                    "<img class='ui small image' src='img/marker01.png'>" +
                    "</div>" +
                    "<div class='field'>" +
                    "<input type='radio' name='update_point_icon' " + ((img == "img/marker02.png") ? "checked='checked'" : "") + " value='img/marker02.png' tabindex='0'>" +
                    "<img class='ui small image' src='img/marker02.png'>" +
                    "</div>" +
                    "<div class='field'>" +
                    "<input type='radio' name='update_point_icon' " + ((img == "img/marker03.png") ? "checked='checked'" : "") + " value='img/marker03.png' tabindex='0'>" +
                    "<img class='ui small image' src='img/marker03.png'>" +
                    "</div>" +
                    "</div>" +
                    "<div class='field'>" +
                    "<label>字角度：<span id='update_text_arc'></span></label>" +
                    "<div class='ui brown range'></div>" +
                    "</div>" +
                    "</div>";

                $("#update_text_color_picker").spectrum({
                    preferredFormat: "hex",
                    color: text_style.getFill().getColor(),
                    //showPaletteOnly: true,
                    showPalette: true,
                    hideAfterPaletteSelect: true,
                    palette: [
                        ['black', 'white', '#76060C',
                            'rgb(255, 128, 0);', 'hsv 100 70 50'],
                        ['red', '#660066', 'green', 'blue', 'violet']
                    ],
                    hide: function (color) {
                        update_feature();
                    }
                });

                $('.ui.range').range({
                    min: -90,
                    max: 90,
                    start: parseInt((text_style.getRotation() * 180) / Math.PI),
                    step: 30,
                    onChange: function (value) {
                        $('#update_text_arc').html(value);
                        update_feature();
                    }
                });
                break;

            case 'arrow left icon':
                var text_style = feature.getStyle().getText();
                var text_size = text_style.getScale();
                var line_style = feature.getStyle().getStroke();
                var line_width = parseInt(line_style.getWidth());

                content.innerHTML =
                    "<div style='display: none;'>" + feature_id + "</div>" +
                    "<div class='ui form'>" +
                    "<div class='fields'>" +
                    "<div class='eight wide field'>" +
                    "<label>字體大小</label>" +
                    "<select id='update_text_size'>" +
                    "<option value='1.0' " + ((text_size == 1.0) ? "selected='selected'" : "") + ">1.0</option>" +
                    "<option value='1.5' " + ((text_size == 1.5) ? "selected='selected'" : "") + ">1.5</option>" +
                    "<option value='2.0' " + ((text_size == 2.0) ? "selected='selected'" : "") + ">2.0</option>" +
                    "<option value='2.5' " + ((text_size == 2.5) ? "selected='selected'" : "") + ">2.5</option>" +
                    "<option value='3.0' " + ((text_size == 3.0) ? "selected='selected'" : "") + ">3.0</option>" +
                    "<option value='3.5' " + ((text_size == 3.5) ? "selected='selected'" : "") + ">3.5</option>" +
                    "<option value='4.0' " + ((text_size == 4.0) ? "selected='selected'" : "") + ">4.0</option>" +
                    "<option value='4.5' " + ((text_size == 4.5) ? "selected='selected'" : "") + ">4.5</option>" +
                    "<option value='5.0' " + ((text_size == 5.0) ? "selected='selected'" : "") + ">5.0</option>" +
                    "<option value='5.5' " + ((text_size == 5.5) ? "selected='selected'" : "") + ">5.5</option>" +
                    "<option value='6.0' " + ((text_size == 6.0) ? "selected='selected'" : "") + ">6.0</option>" +
                    "<option value='6.5' " + ((text_size == 6.5) ? "selected='selected'" : "") + ">6.5</option>" +
                    "</select>" +
                    "</div>" +
                    "<div class='eight wide field'>" +
                    "<label>字顏色</label>" +
                    "<input type='text' id='update_text_color_picker' />" +
                    "</div>" +
                    "</div>" +
                    "<div class='field'>" +
                    "<label>內容</label>" +
                    "<input type='text' id='update_text_content' value='" + text_style.getText() + "'/>" +
                    "</div>" +
                    "<div class='field'>" +
                    "<label>字角度：<span id='update_text_arc'></span></label>" +
                    "<div class='ui brown range'></div>" +
                    "</div>" +
                    "<div class='fields'>" +
                    "<div class='eight wide field'>" +
                    "<label>線寬</label>" +
                    "<select id='update_line_size'>" +
                    "<option value='2' " + ((line_width == 2) ? "selected='selected'" : "") + ">2 </option>" +
                    "<option value='4' " + ((line_width == 4) ? "selected='selected'" : "") + ">4 </option>" +
                    "<option value='6' " + ((line_width == 6) ? "selected='selected'" : "") + ">6 </option>" +
                    "<option value='8' " + ((line_width == 8) ? "selected='selected'" : "") + ">8 </option>" +
                    "<option value='10' " + ((line_width == 10) ? "selected='selected'" : "") + ">10</option>" +
                    "<option value='13' " + ((line_width == 13) ? "selected='selected'" : "") + ">13</option>" +
                    "<option value='15' " + ((line_width == 15) ? "selected='selected'" : "") + ">15</option>" +
                    "<option value='20' " + ((line_width == 20) ? "selected='selected'" : "") + ">20</option>" +
                    "<option value='30' " + ((line_width == 30) ? "selected='selected'" : "") + ">30</option>" +
                    "<option value='40' " + ((line_width == 40) ? "selected='selected'" : "") + ">40</option>" +
                    "</select>" +
                    "</div>" +
                    "<div class='eight wide field'>" +
                    "<label>線顏色</label>" +
                    "<input type='text' id='update_line_color_picker' />" +
                    "</div>" +
                    "</div>" +
                    "</div>";
                
                $("#update_text_color_picker").spectrum({
                    preferredFormat: "hex",
                    color: text_style.getFill().getColor(),
                    //showPaletteOnly: true,
                    showPalette: true,
                    hideAfterPaletteSelect: true,
                    palette: [
                        ['black', 'white', '#76060C',
                            'rgb(255, 128, 0);', 'hsv 100 70 50'],
                        ['red', '#660066', 'green', 'blue', 'violet']
                    ],
                    hide: function (color) {
                        update_feature();
                    }
                });
                $("#update_line_color_picker").spectrum({
                    preferredFormat: "hex",
                    color: line_style.getColor(),
                    //showPaletteOnly: true,
                    showPalette: true,
                    hideAfterPaletteSelect: true,
                    palette: [
                        ['black', 'white', '#76060C',
                            'rgb(255, 128, 0);', 'hsv 100 70 50'],
                        ['red', '#660066', 'green', 'blue', 'violet']
                    ],
                    hide: function (color) {
                        update_feature();
                    }
                });

                $('.ui.range').range({
                    min: -90,
                    max: 90,
                    start: parseInt((text_style.getRotation() * 180) / Math.PI),
                    step: 30,
                    onChange: function (value) {
                        $('#update_text_arc').html(value);
                        update_feature();
                    }
                });
                break;

            case 'square outline icon':
                var text_style = feature.getStyle().getText();
                var text_size = text_style.getScale();
                var line_style = feature.getStyle().getStroke();
                var line_width = parseInt(line_style.getWidth());
                var poly_color = feature.getStyle().getFill().getColor();
                var poly_trans = parseInt(parseFloat(poly_color.split(",")[3].slice(0, -1)) * 100);

                content.innerHTML =
                    "<div style='display: none;'>" + feature_id + "</div>" +
                    "<div class='ui form'>" +
                    "<div class='fields'>" +
                    "<div class='eight wide field'>" +
                    "<label>字體大小</label>" +
                    "<select id='update_text_size'>" +
                    "<option value='1.0' " + ((text_size == 1.0) ? "selected='selected'" : "") + ">1.0</option>" +
                    "<option value='1.5' " + ((text_size == 1.5) ? "selected='selected'" : "") + ">1.5</option>" +
                    "<option value='2.0' " + ((text_size == 2.0) ? "selected='selected'" : "") + ">2.0</option>" +
                    "<option value='2.5' " + ((text_size == 2.5) ? "selected='selected'" : "") + ">2.5</option>" +
                    "<option value='3.0' " + ((text_size == 3.0) ? "selected='selected'" : "") + ">3.0</option>" +
                    "<option value='3.5' " + ((text_size == 3.5) ? "selected='selected'" : "") + ">3.5</option>" +
                    "<option value='4.0' " + ((text_size == 4.0) ? "selected='selected'" : "") + ">4.0</option>" +
                    "<option value='4.5' " + ((text_size == 4.5) ? "selected='selected'" : "") + ">4.5</option>" +
                    "<option value='5.0' " + ((text_size == 5.0) ? "selected='selected'" : "") + ">5.0</option>" +
                    "<option value='5.5' " + ((text_size == 5.5) ? "selected='selected'" : "") + ">5.5</option>" +
                    "<option value='6.0' " + ((text_size == 6.0) ? "selected='selected'" : "") + ">6.0</option>" +
                    "<option value='6.5' " + ((text_size == 6.5) ? "selected='selected'" : "") + ">6.5</option>" +
                    "</select>" +
                    "</div>" +
                    "<div class='eight wide field'>" +
                    "<label>字顏色</label>" +
                    "<input type='text' id='update_text_color_picker' />" +
                    "</div>" +
                    "</div>" +
                    "<div class='field'>" +
                    "<label>內容</label>" +
                    "<input type='text' id='update_text_content' value='" + text_style.getText() + "' />" +
                    "</div>" +
                    "<div class='field'>" +
                    "<label>字角度：<span id='update_text_arc'></span></label>" +
                    "<div class='ui brown range' id='update_arc_ranger'></div>" +
                    "</div>" +
                    "<div class='fields'>" +
                    "<div class='field'>" +
                    "<label>邊寬</label>" +
                    "<select id='update_border_size'>" +
                    "<option value='2' " + ((line_width == 2) ? "selected='selected'" : "") + ">2 </option>" +
                    "<option value='4' " + ((line_width == 4) ? "selected='selected'" : "") + ">4 </option>" +
                    "<option value='6' " + ((line_width == 6) ? "selected='selected'" : "") + ">6 </option>" +
                    "<option value='8' " + ((line_width == 8) ? "selected='selected'" : "") + ">8 </option>" +
                    "<option value='10' " + ((line_width == 10) ? "selected='selected'" : "") + ">10</option>" +
                    "<option value='13' " + ((line_width == 13) ? "selected='selected'" : "") + ">13</option>" +
                    "<option value='15' " + ((line_width == 15) ? "selected='selected'" : "") + ">15</option>" +
                    "<option value='20' " + ((line_width == 20) ? "selected='selected'" : "") + ">20</option>" +
                    "<option value='30' " + ((line_width == 30) ? "selected='selected'" : "") + ">30</option>" +
                    "<option value='40' " + ((line_width == 40) ? "selected='selected'" : "") + ">40</option>" +
                    "</select>" +
                    "</div>" +
                    "<div class='five wide field'>" +
                    "<label>邊框顏色</label>" +
                    "<input type='text' id='update_border_color_picker' />" +
                    "</div>" +
                    "<div class='field'>" +
                    "<label>多邊形顏色</label>" +
                    "<input type='text' id='update_poly_color_picker' />" +
                    "</div>" +

                    "</div>" +
                    "<div class='field'>" +
                    "<label>多邊形透明度：<span id='update_poly_trans'></span></label>" +
                    "<div class='ui brown range' id='update_poly_trans_ranger'></div>" +
                    "</div>" +
                    "</div>";

                $("#update_text_color_picker").spectrum({
                    preferredFormat: "hex",
                    color: hexToRgbA(text_style.getFill().getColor(), 100),
                    //showPaletteOnly: true,
                    showPalette: true,
                    hideAfterPaletteSelect: true,
                    palette: [
                        ['black', 'white', '#76060C',
                            'rgb(255, 128, 0);', 'hsv 100 70 50'],
                        ['red', '#660066', 'green', 'blue', 'violet']
                    ],
                    hide: function (color) {
                        update_feature();
                    }
                });
                $("#update_border_color_picker").spectrum({
                    preferredFormat: "hex",
                    color: hexToRgbA(line_style.getColor(), 100),
                    //showPaletteOnly: true,
                    showPalette: true,
                    hideAfterPaletteSelect: true,
                    palette: [
                        ['black', 'white', '#76060C',
                            'rgb(255, 128, 0);', 'hsv 100 70 50'],
                        ['red', '#660066', 'green', 'blue', 'violet']
                    ],
                    hide: function (color) {
                        update_feature();
                    }
                });
                $("#update_poly_color_picker").spectrum({
                    preferredFormat: "hex",
                    color: RGB_Add_Opacity(poly_color, 100),
                    //showPaletteOnly: true,
                    showPalette: true,
                    hideAfterPaletteSelect: true,
                    palette: [
                        ['black', 'white', '#76060C',
                            'rgb(255, 128, 0);', 'hsv 100 70 50'],
                        ['red', '#660066', 'green', 'blue', 'violet']
                    ],
                    hide: function (color) {
                        update_feature();
                    }
                });

                $('#update_arc_ranger').range({
                    min: -90,
                    max: 90,
                    start: parseInt((text_style.getRotation() * 180) / Math.PI),
                    step: 30,
                    onChange: function (value) {
                        $('#update_text_arc').html(value);
                        update_feature();
                    }
                });
                $('#update_poly_trans_ranger').range({
                    min: 0,
                    max: 100,
                    start: poly_trans,
                    step: 10,
                    onChange: function (value) {
                        $('#update_poly_trans').html(value);
                        update_feature();
                    }
                });
                break;
        }
    });
    $(document).on('change', "#update_text_size,#update_line_size,#update_border_size,input[name='update_point_icon']", function () {
        update_feature();
    });
    $(document).on('input', '#update_text_content', function () {
        update_feature();
    });

    $(document).on('click', '.remove.button', function () {
        console.log(this);
        var feature_id = $(this).parent().siblings("td").first().children("div").text();
        featureOverlay.getSource().removeFeature(featureOverlay.getSource().getFeatureById(feature_id));
        $(this).parent().parent().remove();
    });
    /************ !menu button listener ***********/

    /*************** measure *************/

    typeSelect = document.getElementById('type');
    landslidedam_select = document.getElementById('landslidedam_type');
    /**
    * Let user change the geometry type.
    */
    typeSelect.onchange = function () {
        map.removeInteraction(measure_draw);
        //addInteraction();
        measure_start(typeSelect);
    };
    landslidedam_select.onchange = function () {
        map.removeInteraction(measure_draw);
        measure_start(landslidedam_select);
    };

    function measure_start(measure_type) {

        maps[0].removeInteraction(draw);
        maps[0].removeInteraction(measure_draw);

        measure = new ol.layer.Vector({
            source: source,
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

        /**
        * Message to show when the user is drawing a polygon.
        * @type {string}
        */
        var continuePolygonMsg = 'Click to continue drawing the polygon';

        /**
        * Message to show when the user is drawing a line.
        * @type {string}
        */
        var continueLineMsg = 'Click to continue drawing the line';

        /**
        * Handle pointer move.
        * @param {ol.MapBrowserEvent} evt The event.
        */
        createMeasureTooltip();
        createHelpTooltip();

        var pointerMoveHandler = function (evt) {
            if (evt.dragging) {
                return;
            }
            /** @type {string} */
            var helpMsg = 'Click to start drawing';

            if (sketch) {
                var geom = (sketch.getGeometry());
                if (geom instanceof ol.geom.Polygon) {
                    helpMsg = continuePolygonMsg;
                } else if (geom instanceof ol.geom.LineString) {
                    helpMsg = continueLineMsg;
                }
            }

            helpTooltipElement.innerHTML = helpMsg;
            helpTooltip.setPosition(evt.coordinate);

            helpTooltipElement.classList.remove('hidden');
        };

        maps[0].on('pointermove', pointerMoveHandler);

        maps[0].getViewport().addEventListener('mouseout', function () {
            helpTooltipElement.classList.add('hidden');
        });

        maps[0].addLayer(measure);
        measure.setZIndex(10000);
        addInteraction(measure_type);
    };
    //addInteraction();

    // 清除measure圖層與tooltip
    $('#measure_clean').click(function () {
        measure_clean();
    });
    $('#landslidedam_measure_clean').click(function () {
        measure_clean();
    });

    /*************** !measure *************/

});

function update_feature() {
    var feature_id = $('#update').siblings("#popup-content").children("div").first().text();
    var feature = featureOverlay.getSource().getFeatureById(feature_id);
    want_modify_feature.remove(feature);

    switch ((feature_id.split(' '))[0]) {
        case 'font':
        case 'home':
        case 'h':
        case 'warning_sign':
            var text_style = feature.getStyle().getText();
            var new_style = new ol.style.Style({
                image: (($("input[name=update_point_icon]:checked").val() == "none") ?
                    new ol.style.Circle({
                        radius: 0,
                        fill: new ol.style.Fill({ color: "rgba(0,0,0,0)", })
                    }) :
                    new ol.style.Icon({
                        anchor: [0.5, 46],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        scale: 1,
                        src: $("input[name=update_point_icon]:checked").val(),
                    })),
                stroke: new ol.style.Stroke({
                    color: "rgba(0,0,0,0)",
                    width: 0,
                }),
                fill: new ol.style.Fill({
                    color: "rgba(0,0,0,0)",
                }),
                text: new ol.style.Text({
                    font: "Microsoft Yahei,sans-serif",
                    scale: parseFloat($('#update_text_size').val()),
                    fill: new ol.style.Fill({ color: ($('#update_text_color_picker').val() == "") ? text_style.getFill().getColor() : $('#update_text_color_picker').val() }),
                    stroke: new ol.style.Stroke({ color: 'yellow', width: 1 }),
                    rotation: parseInt($('#update_text_arc').text()) * Math.PI / 180,
                    text: $('#update_text_content').val(),
                    offsetY: -10
                })
            });
            feature.setStyle(new_style);
            break;
        case 'line':
            var text_style = feature.getStyle().getText();
            var line_style = feature.getStyle().getStroke();
            var new_style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 0,
                    fill: new ol.style.Fill({ color: "rgba(0,0,0,0)", })
                }),
                stroke: new ol.style.Stroke({
                    color: (($('#update_line_color_picker').val() == "") ? line_style.getColor() : $('#update_line_color_picker').val()),
                    width: parseInt($('#update_line_size').val()),
                }),
                fill: new ol.style.Fill({
                    color: "rgba(0,0,0,0)",
                }),
                text: new ol.style.Text({
                    font: "Microsoft Yahei,sans-serif",
                    scale: parseFloat($('#update_text_size').val()),
                    fill: new ol.style.Fill({ color: ($('#update_text_color_picker').val() == "") ? text_style.getFill().getColor() : $('#update_text_color_picker').val() }),
                    stroke: new ol.style.Stroke({ color: 'yellow', width: 1 }),
                    rotation: parseInt($('#update_text_arc').text()) * Math.PI / 180,
                    text: $('#update_text_content').val(),
                    offsetY: -10
                })
            });
            feature.setStyle(new_style);
            break;
        case 'polygon':
            var text_style = feature.getStyle().getText();
            var line_style = feature.getStyle().getStroke();
            var poly_color = feature.getStyle().getFill().getColor();
            
            if (isNaN(parseInt($('#update_poly_trans').text())) && poly_color.split(",")[3] != undefined) {
                $('#update_poly_trans').text(100 - parseInt(parseFloat(poly_color.split(",")[3].split(")")[0]) * 100));
            }
            var new_style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 0,
                    fill: new ol.style.Fill({ color: "rgba(0,0,0,0)", })
                }),
                stroke: new ol.style.Stroke({
                    color: (($('#update_border_color_picker').val() == "") ? line_style.getColor() : $('#update_border_color_picker').val()),
                    width: parseInt($('#update_border_size').val()),
                }),
                fill: new ol.style.Fill({
                    color: (($('#update_poly_color_picker').val() == "") ? RGB_Add_Opacity(poly_color, parseInt($('#update_poly_trans').text())) : hexToRgbA($('#update_poly_color_picker').val(), parseInt($('#update_poly_trans').text()))),
                }),
                text: new ol.style.Text({
                    font: "Microsoft Yahei,sans-serif",
                    scale: parseFloat($('#update_text_size').val()),
                    fill: new ol.style.Fill({ color: ($('#update_text_color_picker').val() == "") ? text_style.getFill().getColor() : $('#update_text_color_picker').val() }),
                    stroke: new ol.style.Stroke({ color: 'yellow', width: 1 }),
                    rotation: parseInt($('#update_text_arc').text()) * Math.PI / 180,
                    text: $('#update_text_content').val(),
                    offsetY: -10
                })
            });
            feature.setStyle(new_style);
            break;
    }

    // update edit icon
    fun_access_log("Func_Use_Draw_1_2");
    for (i = 0; i < $("#editor > tbody > tr > td:first-child > div").length; i++) {
        if ($($("#editor > tbody > tr > td:first-child > div")[i]).text() == feature_id) {
            if ((feature_id.split(' '))[0] == "line")
                $($("#editor > tbody > tr > td:first-child > div")[i]).parent().siblings("td").first().html("<i class='arrow left icon'></i>(" + $('#update_text_content').val() + ")");
            else if ((feature_id.split(' '))[0] == "polygon")
                $($("#editor > tbody > tr > td:first-child > div")[i]).parent().siblings("td").first().html("<i class='square outline icon'></i>(" + $('#update_text_content').val() + ")");
            else  // point
                switch ($("input[name=update_point_icon]:checked").val()) {
                    case 'none':
                        $($("#editor > tbody > tr > td:first-child > div")[i]).parent().siblings("td").first().html("<i class='font icon'></i>(" + $('#update_text_content').val() + ")");
                        $($("#editor > tbody > tr > td:first-child > div")[i]).text("font " + (feature_id.split(' '))[1]);
                        feature.setId("font " + (feature_id.split(' '))[1]);
                        $('#popup > #popup-content > div:first-child').text("font " + (feature_id.split(' '))[1]);
                        break;
                    case 'img/marker01.png':
                        $($("#editor > tbody > tr > td:first-child > div")[i]).parent().siblings("td").first().html("<i class='home icon'></i>(" + $('#update_text_content').val() + ")");
                        $($("#editor > tbody > tr > td:first-child > div")[i]).text("home " + (feature_id.split(' '))[1]);
                        feature.setId("home " + (feature_id.split(' '))[1]);
                        $('#popup > #popup-content > div:first-child').text("home " + (feature_id.split(' '))[1]);
                        break;
                    case 'img/marker02.png':
                        $($("#editor > tbody > tr > td:first-child > div")[i]).parent().siblings("td").first().html("<i class='h icon'></i>(" + $('#update_text_content').val() + ")");
                        $($("#editor > tbody > tr > td:first-child > div")[i]).text("h " + (feature_id.split(' '))[1]);
                        feature.setId("h " + (feature_id.split(' '))[1]);
                        $('#popup > #popup-content > div:first-child').text("h " + (feature_id.split(' '))[1]);
                        break;
                    case 'img/marker03.png':
                        $($("#editor > tbody > tr > td:first-child > div")[i]).parent().siblings("td").first().html("<i class='warning sign icon'></i>(" + $('#update_text_content').val() + ")");
                        $($("#editor > tbody > tr > td:first-child > div")[i]).text("warning_sign " + (feature_id.split(' '))[1]);
                        feature.setId("warning_sign " + (feature_id.split(' '))[1]);
                        $('#popup > #popup-content > div:first-child').text("warning_sign " + (feature_id.split(' '))[1]);
                        break;
                }
            break;
        }
    }
}

// transfer kml color code "abgr" to normal hex color code "#rgb"
function kmlColorCodeToHex(code) {
    let r = code[6] + code[7];
    let g = code[4] + code[5];
    let b = code[2] + code[3];
    let a = code[0] + code[1];
    return "#" + r + g + b + a;
}
// global variable
var draw;
var type;
var point_color;
var point_radius;
var line_color;
var line_width;
var plane_color;
var text_content;
var text_size;
var text_color;
var text_rotation;
var icon_url;
var isIcon;
var brush = false;
var is_measure = false;

// set default features to prevent some error
function setDefaultFeatures() {
    type = "Point";
    point_color = "rgba(0, 0, 0, 0)";
    point_radius = 0;
    line_color = "rgba(0, 0, 0, 0)";
    line_width = 0;
    plane_color = "rgba(0, 0, 0, 0)";
    text_content = "";
    text_size = 1;
    text_color = "rgba(0, 0, 0, 0)";
    text_rotation = 0;
    icon_url = "https://cdn1.iconfinder.com/data/icons/business-finance-vol-2-50/40/Untitled-5-85-48.png";
    isIcon = false;
}




function map_move_mode() {
    maps[0].removeInteraction(draw);
    maps[0].removeInteraction(measure_draw);

    if (draw_box) {
        maps[map_ind].removeInteraction(draw_box);
    }
    clear_helptooltip();

    //interaction = new ol.interaction.Select();
    //maps[0].addInteraction(interaction);
}

/*
function drawPoint(color,radius){
    setDefaultFeatures();
    type = "Point";
    point_color = color;
    point_radius = radius;
    runBrush();
}
*/

function drawLine() {
    setDefaultFeatures();
    type = "LineString";

    text_content = $('#line_text_content').val();//content;
    text_color = $('#line_menu > .fields').first().children(".field:nth-child(2)").children('.color_picker').val();//color;
    text_size = $('#line_text_size').val();//size;
    text_rotation = parseInt($('#line_text_arc').text()) * Math.PI / 180;

    line_color = $('#line_menu > .fields:nth-child(4)').children(".field:nth-child(2)").children('.color_picker').val();
    line_width = parseInt($('#line_size').val());

    runBrush("line");
}

function drawPolygon() {
    setDefaultFeatures();
    type = "Polygon";

    text_content = $('#poly_text_content').val();//content;
    text_color = $('#poly_menu > .fields').first().children(".field:nth-child(2)").children('.color_picker').val();//color;
    text_size = parseFloat($('#poly_text_size').val());//size;
    text_rotation = parseInt($('#poly_text_arc').text()) * Math.PI / 180;

    line_color = $('#poly_menu > .fields:nth-child(4)').children(".field:nth-child(2)").children('.color_picker').val();
    line_width = parseInt($("#poly_border_size").val());
    poly_trans = 100 - parseInt($('#poly_trans').text());
    if ($('#poly_menu > .fields:nth-child(4)').children(".field:nth-child(3)").children('.color_picker').val() == "") {
        plane_color = hexToRgbA("#000000", poly_trans);
    } else {
        if (isNaN(poly_trans)) {
            poly_trans = 50;
        }
        plane_color = hexToRgbA($('#poly_menu > .fields:nth-child(4)').children(".field:nth-child(3)").children('.color_picker').val(), poly_trans);
    }
    runBrush("polygon");
}

/*
function drawCircle(circle_plane_color,circle_line_color){
    setDefaultFeatures();
    type = "Circle";
    plane_color = circle_plane_color;
    line_color = circle_line_color;
    line_width = 3;
    runBrush();
}
*/

function drawIconText(/*content,color,size,rotation*/) {
    setDefaultFeatures();
    type = "Point";
    text_content = $('#point_text_content').val();//content;
    text_color = $('#point_menu > .fields').first().children(".field:nth-child(2)").children('.color_picker').val();//color;
    text_size = parseFloat($('#point_text_size').val());//size;
    text_rotation = parseInt($('#point_text_arc').html()) * Math.PI / 180;
    var draw_type = "font";
    if ($("input[name=point_icon]:checked").val() != "none") {
        icon_url = $("input[name=point_icon]:checked").val();
        isIcon = true;
        switch (icon_url) {
            case 'img/marker01.png': draw_type = "home"; break;
            case 'img/marker02.png': draw_type = "h"; break;
            case 'img/marker03.png': draw_type = "warning_sign"; break;
        }
    }
    runBrush(draw_type);
}

/*
function putIcon(url){
    setDefaultFeatures();
    type = "Point";

    console.log( icon_url);

    text_content = $('#icon_text').val();//content;
    text_color = "rgb(0,0,0)";
    text_size = "20px";

    var draw_type = "";
    switch(icon_url){
        case 'img/marker01.png': draw_type = "home";        break;
        case 'img/marker02.png': draw_type = "h";           break;
        case 'img/marker03.png': draw_type = "warning sign";    break;
    }
    runBrush(draw_type);
}
*/

var $cnt = 0;
// draw the shape on the map and append it to editor to make it editable
function runBrush(draw_type) {
 
    draw = new ol.interaction.Draw({
        features: features,
        type: /** @type {ol.geom.GeometryType} */ (type)
    });
    maps[0].addInteraction(draw);


    if (is_measure) createMeasureTooltip();


    draw.on('drawstart', function (event) {
        var s = new ol.style.Style({
            image: getImage(),
            stroke: new ol.style.Stroke({
                color: line_color,
                width: line_width,
            }),
            fill: new ol.style.Fill({
                color: plane_color,
            }),
            text: new ol.style.Text({
                font: "Microsoft Yahei,sans-serif",
                fill: new ol.style.Fill({ color: text_color }),
                scale:  parseFloat(text_size),
                stroke: new ol.style.Stroke({ color: 'yellow', width:1 }),
                text: text_content,
				rotation: parseInt(0),   //text_rotation             
                offsetY: -10
            })
        });
        event.feature.setStyle(s);

        // set current feature ID
        sketch = event.feature;
        //alert(draw_type + " " + $cnt);

        sketch.setId(draw_type + " " + $cnt);

        // add to editor
        $("#editor > tbody").append(
            "<tr>" +
            "<td>" +
            "<h2 class='ui center aligned header'>" + $cnt + "</h2>" +
            "<div style='display: none;'>" + (draw_type + " " + $cnt) + "</div>" +
            "</td>" +

            "<td>" +
            "<i class='" + ((draw_type == "line") ? "arrow left" : (draw_type == "polygon") ? "square outline" : (draw_type == "warning_sign") ? "warning sign" : draw_type) + " icon'></i>" +
            "(" + text_content + ")" +
            "</td>" +
            "<td>" +
            "<button class='ui icon search button'><i class='search icon'></i></button>" +
            "</td>" +
            "<td>" +
            "<button class='ui icon edit button'><i class='edit icon'></i></button>" +
            "</td>" +
            "<td>" +
            "<button class='ui icon remove button'><i class='remove icon'></i></button>" +
            "</td>" +
            "<td>" +
            "<input type='checkbox' id=" + (draw_type + "_" + String($cnt)) + " onclick='editor_layer_man(this.id,this.checked)' checked>" +
            "</td>" +
            "</tr>"
        );
        $cnt++;

        /** @type {ol.Coordinate|undefined} */
        var tooltipCoord = event.coordinate;
        /*
        listener = sketch.getGeometry().on('change', function(evt) {
            var geom = evt.target;
            var output;
            if (geom instanceof ol.geom.LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
        */
    }, this);
    draw.on('drawend', function (event) {
        map_move_mode()
    }, this);
}
//編輯圖層開關

var editor_feature_array = []
function editor_layer_man(id, ch) {
    fun_access_log("Func_Use_Draw_1_2");
    id = id.replace("_", " ");
    if (ch == false) {
        editor_feature_array.push(featureOverlay.getSource().getFeatureById(id));
        featureOverlay.getSource().removeFeature(featureOverlay.getSource().getFeatureById(id));
    }
    //DocsFeature_Layer[map_ind].getSource().removeFeature(DocsFeature_Layer[map_ind].getSource().getFeatureById(linkurl_Docs[map_ind]));
    if (ch == true) {
        for (i = 0; i < editor_feature_array.length; i++) {
            if (editor_feature_array[i].getId() == id) {
                featureOverlay.getSource().addFeature(editor_feature_array[i]);
                editor_feature_array.splice(i, 1);
            }
        }
    }

}

// to choose if the point is a circle or a image
function getImage() {
    var image;
    if (isIcon) {
        image = new ol.style.Icon(/** @type {olx.style.IconOptions} */({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            scale: 1,
            src: icon_url,
        }));
    }
    else {
        image = new ol.style.Circle({
            radius: point_radius,
            fill: new ol.style.Fill({ color: point_color, })
        });
    }
    return image;
}

function hexToRgbA(hex, trac) {
    //alert(hex);
    console.log(hex, trac);
    var c;
    if (/^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        else {
            c = [c[0], c[1], c[2], c[3], c[4], c[5]];
        }
        c = '0x' + c.join('');

        //if(c=="0x010000"){
        //return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+', 0)';	
        //}else{

        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + trac * 0.01 + ')';
        //}
    }
    throw new Error('Bad Hex');
}
function RGB_Add_Opacity(rgb, trac) {
    FillOpacity_temp = rgb.split(',');
    return FillOpacity_temp[0] + ',' + FillOpacity_temp[1] + ',' + FillOpacity_temp[2] + ',' + trac * 0.01 + ')';
}

function Remove_Draw_On_Map() {
    $("#editor > tbody > tr").each((idx, tr) => {
        const remove_btn = $(tr).children("td:nth-child(4)").children("button");
        const feature_id = $(remove_btn).parent().siblings("td").first().children("div").text();
        featureOverlay.getSource().removeFeature(featureOverlay.getSource().getFeatureById(feature_id));
        $(remove_btn).parent().parent().remove();
    })
}

// function import_kml_string_old(kml_str) {

//     var format = new ol.format.KML();
//     featureOverlay.getSource().addFeatures(format.readFeatures(kml_str));
//     featureOverlay.setMap(map);
//     var x = $.parseXML(kml_str);
//     var objs = $(x).find("Placemark");
//     console.log(objs);
//     for (var i = 0; i < objs.length; i++) {
//         var id = $(objs[i]).attr("id");
//         setDefaultFeatures();
//         switch ((id.split(' '))[0]) {
//             case 'font':
//                 type = "Point";
//                 text_content = $(objs[i]).find("name").text();
//                 text_color = kmlColorCodeToHex($(objs[i]).find("Style").find("LabelStyle").find("color").text());
//                 text_size = $(x).find("myText[id=\"" + id + "\"]").attr("size");
//                 text_rotation = parseFloat($(x).find("myText[id=\"" + id + "\"]").attr("rotation"));
//                 isIcon = false;
//                 break;
//             case 'line':
//                 type = "LineString";
//                 text_content = $(objs[i]).find("name").text();
//                 text_color = kmlColorCodeToHex($(objs[i]).find("Style").find("LabelStyle").find("color").text());
//                 text_size = $(x).find("myText[id=\"" + id + "\"]").attr("size");
//                 text_rotation = parseFloat($(x).find("myText[id=\"" + id + "\"]").attr("rotation"));
//                 isIcon = false;
//                 line_color = kmlColorCodeToHex($(objs[i]).find("Style").find("LineStyle").find("color").text());
//                 line_width = parseInt($(objs[i]).find("Style").find("LineStyle").find("width").text());
//                 break;
//             case 'polygon':
//                 type = "Polygon";
//                 text_content = $(objs[i]).find("name").text();
//                 text_color = kmlColorCodeToHex($(objs[i]).find("Style").find("LabelStyle").find("color").text());
//                 text_size = $(x).find("myText[id=\"" + id + "\"]").attr("size");
//                 text_rotation = parseFloat($(x).find("myText[id=\"" + id + "\"]").attr("rotation"));
//                 isIcon = false;
//                 line_color = kmlColorCodeToHex($(objs[i]).find("Style").find("LineStyle").find("color").text());
//                 line_width = parseInt($(objs[i]).find("Style").find("LineStyle").find("width").text());
//                 plane_color = hexToRgbA(kmlColorCodeToHex($(objs[i]).find("Style").find("PolyStyle").find("color").text()), 50);
//                 break;
//             case 'home':
//             case 'h':
//             case 'warning_sign':
//                 type = "Point";
//                 text_content = $(objs[i]).find("name").text();
//                 text_color = kmlColorCodeToHex($(objs[i]).find("Style").find("LabelStyle").find("color").text());
//                 text_size = $(x).find("myText[id=\"" + id + "\"]").attr("size");
//                 text_rotation = parseFloat($(x).find("myText[id=\"" + id + "\"]").attr("rotation"));
//                 isIcon = true;
//                 icon_url = $(objs[i]).find("Style").find("IconStyle").find("Icon").find("href").text();
//                 break;
//         }
//         var s = new ol.style.Style({
//             image: getImage(),
//             stroke: new ol.style.Stroke({
//                 color: line_color,
//                 width: line_width,
//             }),
//             fill: new ol.style.Fill({
//                 color: plane_color,
//             }),
//             text: new ol.style.Text({
//                 font: text_size + " Microsoft Yahei,sans-serif",
//                 fill: new ol.style.Fill({ color: text_color }),
//                 stroke: new ol.style.Stroke({ color: 'yellow', width: 0.8 }),
//                 rotation: text_rotation,
//                 text: text_content,
//                 offsetY: -10
//             })
//         });
//         var feature = featureOverlay.getSource().getFeatureById(id);
//         console.log(feature);
//         feature.setStyle(s);
//         var draw_type = (id.split(' '))[0];
//         var $cnt = (id.split(' '))[1];
//         // add to editor
//         $("#editor > tbody").append(
//             "<tr>" +
//             "<td>" +
//             "<h2 class='ui center aligned header'>" + i + "</h2>" +
//             "<div style='display: none;'>" + (draw_type + " " + $cnt) + "</div>" +
//             "</td>" +
//             "<td>" +
//             "<i class='" + ((draw_type == "line") ? "arrow left" : (draw_type == "polygon") ? "square outline" : (draw_type == "warning_sign") ? "warning sign" : draw_type) + " icon'></i>" +
//             "(" + text_content + ")" +
//             "</td>" +
//             "<td>" +
//             "<button class='ui icon search button'><i class='search icon'></i></button>" +
//             "</td>" +
//             "<td>" +
//             "<button class='ui icon edit button'><i class='edit icon'></i></button>" +
//             "</td>" +
//             "<td>" +
//             "<button class='ui icon remove button'><i class='remove icon'></i></button>" +
//             "</td>" +
//             "<td>" +
//             "<input type='checkbox' id=" + (draw_type + "_" + String($cnt)) + " onclick='editor_layer_man(this.id,this.checked)' checked>" +
//             "</td>" +
//             "</tr>"
//         );
//     };
//     // draw on map
//     var load_interaction = new ol.interaction.Modify({
//         features: new ol.Collection(featureOverlay.getSource().getFeatures())
//     });
//     map.addInteraction(load_interaction);
// }

// button disable
function btn_disable() {
    $("#drawline_button").off('click');
    $("#drawpath_button").off('click');
    $("#hillshade_button").off('click');
    $("#hillshadeAZ_button").off('click');
    $("#contour_button").off('click');
    $("#cutfill_square_button").off('click');
    $("#cutfill_poly_button").off('click');
    $("#cutfill_line_button").off('click');
    $("#point_height_button").off('click');
    $("#slope_paint01").off('click');
    $("#slope_paint02").off('click');
    $("#slope_paint03").off('click');
    $("#slope_paint04").off('click');
    $("#slope_paint06").off('click');
    $("#aspect_paint01").off('click');
    $("#aspect_paint02").off('click');
    $("#aspect_paint03").off('click');
    //	$("#aspect_paint04").off('click');
    $("#aspect_paint06").off('click');
    // houiline toukyoken
    $("supportline_button").off('click');


    /*** add 20190513 ***/
    //$("#sentinel_poly_button").off('click');
    /********************/

    $("#sentinel2_list").prop('disabled', true);
    $("#sentinel2_compare_list1").prop('disabled', true);
    $("#sentinel2_compare_list2").prop('disabled', true);
    $("#sentinel2_sis_list").prop('disabled', true);
    $("#sentinel2_sis_spectral").prop('disabled', true);
    /*
    $("#sentinel_cb").off('click');
    $("#sentinel_compare_cb").off('click');
    $("#sentinel_sis_cb").off('click');
    */
    $("#sentinel_checked").prop('disabled', true);
    $("#sentinel_compare_checked").prop('disabled', true);
    $("#sentinel_sis_checked").prop('disabled', true);

    $("#Sentinel2_get").prop('disabled', true);
    $("#Sentinel2_getCompare").prop('disabled', true);
    $("#Sentinel2_getSis").prop('disabled', true);
    /*** add 20190513 ***/
    //$("#sentinel_polyCompare_button").off('click');
    //$("#sentinel_polySis_button").off('click');
    //sen2_btn_disable()
    /********************/
    /*****   20190330 fixed  ****/
    $("#btn_togeojson").off('click');
    $("#btn_fromgeojson").off('click');
    $("#btn_downloadgeoj").off('click');
    $("#upload_togeojson").off('click');
    $("#stlfile_button").off('click');
    $("#viewshed_button").off('click');
    $("#MCRIF_button").off('click');
    $("#svf_button").off('click');
    $("#openness_button").off('click');
    $("#route_start_btn").off('click');
    $("#route_end_btn").off('click');
    /*****   20190330 fixed  ****/

    // add upload gif
    $("#upload_crop_gif").off('click');

    /*** add 20190515 ***/
    $("#get_path_data").prop('disabled', true);
    $("#get_hillshade_data").prop('disabled', true);
    $("#get_hillshadeAZ_data").prop('disabled', true);
    $("#get_stlfile_data").prop('disabled', true);
    $("#get_MCRIF_data").prop('disabled', true);
    $("#get_svf_data").prop('disabled', true);
    $("#get_openness_data").prop('disabled', true);
    $("#get_contour_data").prop('disabled', true);
    $("#get_cutfill_data").prop('disabled', true);
    $("#get_cutfill_Ldata").prop('disabled', true);
    $("#slope_execute").prop('disabled', true);
    $("#aspect_execute").prop('disabled', true);
    /*** add 20190515 ***/

    /*** add 20190610 ***/
    $("#subscene_checked").prop('disabled', true);
    $("#subscene_button").off('click');
    /*** add 20190610 ***/

    /*** add 20191125 ***/
    $("#spectrum_list1").prop('disabled', true);
    $("#spectrum_list2").prop('disabled', true);
    $("#spectrum_button").off('click');
    /*** add 20191125 ***/

    /*** add 20190610 ***/
    $("#crop_square_button").off('click');
    /*** add 20190610 ***/
    /*** add 20191007 ***/
    $("#polygon_curve_button").off('click');
    /*** add 20191007 ***/

    /*** add 20191118 ***/
    $("#map_data_button_v2").off('click');
    $("#button_png_v2").off('click');
    $("#button_go_v2").off('click');

    /*** add 20191118 ***/
    /*** add 20200321 ***/
    $("#crop_square_button_GeoTiff").off('click');
    /*** add 20200321 ***/

    /*** add 20201026 ***/
    $("#crop_square_button_GeoTiff_origin").off('click');
    /*** add 20201026 ***/

    /*** add 20191118 ***/

    $("#dem_poly_button").off('click');
    $("#mssrc_poly_button").off('click');
    $("#clear_dem_region").off('click');
    $("#clear_mssrc_region").off('click');
    $("#soil_done").off('click');
    dem_btn_disable();
}


function dem_btn_enable() {
	
    $("#dem_poly_button").on('click', function (e) { dem_getPoly() });
    $("#mssrc_poly_button").on('click', function (e) { mssrc_getPoly() });
}

function dem_btn_disable() {
    $("#dem_poly_button").off('click');
    $("#mssrc_poly_button").off('click');
}


// button enable
function btn_enable() {
    $("#drawline_button").on('click', function (e) { get_linepoint(); });
    $("#drawpath_button").on('click', function (e) { get_pathpoint(); fun_access_log("Func_Use_Land_1_1"); });
    $("#hillshade_button").on('click', function (e) { get_squrepoint(); fun_access_log("Func_Use_Land_1_2"); });
//    $("#hillshadeAZ_button").on('click', function (e) { get_squrepointAZ(); fun_access_log("Func_Use_Land_1_3"); });
//    $("#contour_button").on('click', function (e) { get_squrepoint_contour(); fun_access_log("Func_Use_Land_1_4"); });
    $("#cutfill_square_button").on('click', function (e) { get_squrepointCF(); fun_access_log("Func_Use_Analysis_1_7"); });
    $("#cutfill_poly_button").on('click', function (e) { get_polypointCF() });
    $("#cutfill_line_button").on('click', function (e) { get_linepointCF() });
    $("#point_height_button").on('click', function (e) { get_pointHeight() });
    $("#slope_paint01").on('click', function (e) { slope_remove_interaction(); fun_access_log("Func_Use_Analysis_1_4"); });
    $("#slope_paint02").on('click', function (e) { slope_add_point(); fun_access_log("Func_Use_Analysis_1_4"); });
    $("#slope_paint03").on('click', function (e) { slope_add_polygon(); fun_access_log("Func_Use_Analysis_1_4"); });
    $("#slope_paint04").on('click', function (e) { slope_add_linestring(); fun_access_log("Func_Use_Analysis_1_4"); });
    $("#slope_paint06").on('click', function (e) { slope_add_rectangle(); fun_access_log("Func_Use_Analysis_1_4"); });
    $("#aspect_paint01").on('click', function (e) { aspect_remove_interaction(); fun_access_log("Func_Use_Analysis_1_5"); });
    $("#aspect_paint02").on('click', function (e) { aspect_add_point(); fun_access_log("Func_Use_Analysis_1_5"); });
    $("#aspect_paint03").on('click', function (e) { aspect_add_polygon(); fun_access_log("Func_Use_Analysis_1_5"); });
    //	$("#aspect_paint04").on('click', function(e){aspect_add_linestring()});
    $("#aspect_paint06").on('click', function (e) { aspect_add_rectangle(); fun_access_log("Func_Use_Analysis_1_5"); });

    /*****   20190330 fixed  ****/
    $("#btn_togeojson").on('click', function (e) { ConToGeo() });
    $("#btn_fromgeojson").on('click', function (e) { ConFromGeo() });
    $("#btn_downloadgeoj").on('click', function (e) { DownloadGeoj() });
    $("#btn_downloadkml").on('click', function (e) { Downloadkml() });
    $("#upload_togeojson").on('change', function (e) { ToGeoUpload() });
    $("#stlfile_button").on('click', function (e) { get_stlfile() });
//    $("#viewshed_button").on('click', function (e) { get_viewshed_point(); fun_access_log("Func_Use_Analysis_1_6"); });
    $("#MCRIF_button").on('click', function (e) { get_MCRIF() });
    $("#svf_button").on('click', function (e) { get_svf() });
    $("#openness_button").on('click', function (e) { get_openness() });
//    $("#route_start_btn").on('click', function (e) { get_route_start() });
//    $("#route_end_btn").on('click', function (e) { get_route_end() });
    /*****   20190330 fixed  ****/

    // add upload gif
    $("#upload_crop_gif").on('change', function (e) { ToGIFUpload() });

    // houiline toukyoken
    //$("#supportline_button").on('click', function(e){get_supline_center()});
    //$("#houiline_button").on('click', function(e){get_houiline_center()});
    //$("#toukyoken_button").on('click', function(e){get_toukyoken_center()});
    /*** add 20190513 ***/
    //$("#sentinel_poly_button").on('click', function(e){Sentinel2_getPoly()});
    /********************/
    $("#sentinel2_list").prop('disabled', false);
    $("#sentinel2_compare_list1").prop('disabled', false);
    $("#sentinel2_compare_list2").prop('disabled', false);
    $("#sentinel2_sis_list").prop('disabled', false);
    $("#sentinel2_sis_spectral").prop('disabled', false);
    //$("#sentinel2_sis_spectral").on('change', function (e) { DNBR_interface() });
    /*
    $("#sentinel_cb").on('click');
    $("#sentinel_compare_cb").on('click');
    $("#sentinel_sis_cb").on('click');
    */
    $("#sentinel_checked").prop('disabled', false);
    $("#sentinel_compare_checked").prop('disabled', false);
    $("#sentinel_sis_checked").prop('disabled', false);

    $("#Sentinel2_get").prop('disabled', false);
    $("#Sentinel2_getCompare").prop('disabled', false);
    $("#Sentinel2_getSis").prop('disabled', false);
    /*** add 20190513 ***/
    //$("#sentinel_polyCompare_button").on('click', function(e){Sentinel2_getComparePoly()});
    //$("#sentinel_polySis_button").on('click', function(e){Sentinel2_getSisPoly()});
    //sen2_btn_enable()
    /********************/

    /*** add 20190515 ***/
    $("#get_path_data").prop('disabled', false);
    $("#get_hillshade_data").prop('disabled', false);
    $("#get_hillshadeAZ_data").prop('disabled', false);
    $("#get_stlfile_data").prop('disabled', false);
    $("#get_MCRIF_data").prop('disabled', false);
    $("#get_svf_data").prop('disabled', false);
    $("#get_openness_data").prop('disabled', false);
    $("#get_contour_data").prop('disabled', false);
    $("#get_cutfill_data").prop('disabled', false);
    $("#get_cutfill_Ldata").prop('disabled', false);
    $("#slope_execute").prop('disabled', false);
    $("#aspect_execute").prop('disabled', false);
    /*** add 20190515 ***/

    /*** add 20190610 ***/
    $("#subscene_checked").prop('disabled', false);
    //$("#subscene_button").on('click', function (e) { subscene_getPoly() });
    /*** add 20190610 ***/

    /*** add 20191125 ***/
    $("#spectrum_list1").prop('disabled', false);
    $("#spectrum_list2").prop('disabled', false);
    //$("#spectrum_button").on('click', function (e) { spectrum_getPoly() });
    /*** add 20191125 ***/

    /*** add 20190610 ***/
    $("#crop_square_button").on('click', function (e) { get_crop_image_x_y() });
    /*** add 20190610 ***/
    /*** add 20191007 ***/
    $("#polygon_curve_button").on('click', function (e) { get_polygoncurv_center() });
    /*** add 20191007 ***/

    /*** add 20191118 ***/
    $("#map_data_button_v2").on('click', function (e) { get_terrain_data_v2() });
    $("#button_png_v2").on('click', function (e) { get_terrain_data_go() });
    $("#button_go_v2").on('click', function (e) { terrain_click_go() });

    /*** add 20191118 ***/

    /*** add 20200321 ***/
    $("#crop_square_button_GeoTiff").on('click', function (e) { get_crop_image_x_y() });
    /*** add 20200321 ***/

    /*** add 20201026 ***/
    $("#crop_square_button_GeoTiff_origin").on('click', function (e) { get_crop_image_x_y_origin() });
    /*** add 20201026 ***/

    /*** add 20191118 ***/

    dem_btn_enable();


}


/*** add 20190513 ***/
/* function sen2_btn_enable() {
    if ($('#sentinel_checked').is(":checked")) {
        $("#sentinel_poly_button").on('click', function (e) { Sentinel2_getPoly(); fun_access_log("Func_Use_Analysis_1_1"); });
    }
    if ($('#sentinel_compare_checked').is(":checked")) {
        $("#sentinel_polyCompare_button").on('click', function (e) { Sentinel2_getComparePoly(); fun_access_log("Func_Use_Analysis_1_2"); });
    }
    if ($('#sentinel_sis_checked').is(":checked")) {
        $("#sentinel_polySis_button").on('click', function (e) { Sentinel2_getSisPoly(); fun_access_log("Func_Use_Analysis_1_3"); });
    }
}

function sen2_btn_disable() {
    if ($('#sentinel_checked').is(":checked")) {
        $("#sentinel_poly_button").off('click');
    }
    if ($('#sentinel_compare_checked').is(":checked")) {
        $("#sentinel_polyCompare_button").off('click');
    }
    if ($('#sentinel_sis_checked').is(":checked")) {
        $("#sentinel_polySis_button").off('click');
    }
} */

/********************/

function cb_enable() {
    /*$('#houiline_cb').checkbox({
        onChecked: function() {
            if (!$('#toukyoken_cb').checkbox('is checked') || !$.isNumeric($('#toukyoken_StepSize').val()) || !$('#toukyoken_StepSize').val() > 0)
                sup_line_loc = [ol.proj.transform(maps[map_ind].getView().getCenter(), 'EPSG:3857', 'EPSG:4326')[1], ol.proj.transform(maps[map_ind].getView().getCenter(), 'EPSG:3857', 'EPSG:4326')[0]]
            get_houiline();
        },
        onUnchecked: function() {
            clear_houiline();
        }
    });
	
    $('#toukyoken_StepSize').on('keyup',function (){
        if ($('#toukyoken_cb').checkbox('is checked') && $.isNumeric($('#toukyoken_StepSize').val()) && $('#toukyoken_StepSize').val() > 0)
            get_toukyoken();
    });*/
    /***  1007 ***/
    $("#polygon_curve_radius").on('keyup', function () {
        fun_access_log("Func_Use_Sup_1_4");
        if ($('#map_polygon_curve_checked').is(':checked')) {
            clear_polygoncurv();
            createPolygonCurve();
        }
    });
    $("#polygon_curve_angles").on('keyup', function () {
        fun_access_log("Func_Use_Sup_1_4");
        if ($('#map_polygon_curve_checked').is(':checked')) {
            clear_polygoncurv();
            createPolygonCurve();
        }
    });
    $("#polygon_curve_rotation").on('keyup', function () {
        fun_access_log("Func_Use_Sup_1_4");
        if ($('#map_polygon_curve_checked').is(':checked')) {
            clear_polygoncurv();
            createPolygonCurve();
        }
    });
    /*** 1007 ***/

    /*$('#toukyoken_unit').change(function (){
        if ($('#toukyoken_cb').checkbox('is checked') && $.isNumeric($('#toukyoken_StepSize').val()) && $('#toukyoken_StepSize').val() > 0)
            get_toukyoken();
    });
	
	
    $('#toukyoken_cb').checkbox({
        onChecked: function() {
            if ($.isNumeric($('#toukyoken_StepSize').val()) && $('#toukyoken_StepSize').val() > 0) {
                if (!$('#houiline_cb').checkbox('is checked'))
                    sup_line_loc = [ol.proj.transform(maps[map_ind].getView().getCenter(), 'EPSG:3857', 'EPSG:4326')[1], ol.proj.transform(maps[map_ind].getView().getCenter(), 'EPSG:3857', 'EPSG:4326')[0]]
                get_toukyoken();
            }
        },
        onUnchecked: function() {
            clear_toukyoken();
        }
    });*/

    /***** 20191007 fixed ***/
    $('#gif_lock_map_cb').checkbox({
        onChecked: function () {
            maps[0].getInteractions().forEach(function (interaction) {
                interaction.setActive(false);
            }, this);
        },
        onUnchecked: function () {
            maps[0].getInteractions().forEach(function (interaction) {
                interaction.setActive(true);
            }, this);
        }
    });
    $('#map_polygon_curve_cb').checkbox({
        onChecked: function () {
            createPolygonCurve();
        },
        onUnchecked: function () {
            clear_polygoncurv();
        }
    });
    /***** 20191007 fixed ***/

    $('#map_center_cb').checkbox({
        onChecked: function () {
            //alert("開啟中心線");
            map_center_on();
        },
        onUnchecked: function () {
            //alert("關閉中心線");			
            map_center_off();
        }
    });


    /*** add 20190417 ***/

    $('#map_slider_cb').checkbox({
        onChecked: function () {
            map_win_slide_change(1);
        },
        onUnchecked: function () {
            map_win_slide_change(0);
        }
    });
    /********************/

    // $('#sentinel_cb').checkbox({
        // onChecked: function () {
            // set_sentinel2()
            // map_win_single()

            // clear_sentinel2_compare("left")
            // clear_sentinel2_compare("right")

            // clear_spectrum("left")
            // clear_spectrum("right")

            // clear_sentinel2_sis("all")
            // clear_sentinel2_sis("left")
            // clear_sentinel2_sis("right")

            // clear_subscene("left")
            // clear_subscene("right")

            // $('#sentinel_compare_checked').removeAttr("checked")
            // $('#spectrum_checked').removeAttr("checked")
            // $('#sentinel_sis_checked').removeAttr("checked")
            // $('#subscene_checked').removeAttr("checked")

            // clear_sentinel2_compare_region()
            // clear_sentinel2_sis_region()
            // clear_spectrum_region()
            // clear_subscene_region()
        // },
        // onUnchecked: function () {
            // clear_sentinel2()
            // clear_sentinel2_region()
            // /*** add 20190513 ***/
            // $("#sentinel_poly_button").off('click');
            // /********************/
        // }
    // });

    // $('#sentinel_compare_cb').checkbox({
        // onChecked: function () {
            // set_sentinel2_compare("left")
            // set_sentinel2_compare("right")
            // map_win_double()

            // clear_sentinel2()

            // clear_sentinel2_sis("all")
            // clear_sentinel2_sis("left")
            // clear_sentinel2_sis("right")

            // clear_spectrum("left")
            // clear_spectrum("right")

            // clear_subscene("left")
            // clear_subscene("right")

            // $('#sentinel_checked').removeAttr("checked")
            // $('#sentinel_sis_checked').removeAttr("checked")
            // $('#spectrum_checked').removeAttr("checked")
            // $('#subscene_checked').removeAttr("checked")

            // clear_sentinel2_region()
            // clear_sentinel2_sis_region()
            // clear_spectrum_region()
            // clear_subscene_region()
        // },
        // onUnchecked: function () {
            // clear_sentinel2_compare("left")
            // clear_sentinel2_compare("right")
            // map_win_single();
            // clear_sentinel2_compare_region()
            // /*** add 20190513 ***/
            // $("#sentinel_polyCompare_button").off('click');
            // /********************/
        // }
    // });


    // $('#sentinel_sis_cb').checkbox({
        // onChecked: function () {
            // DNBR_interface()

            // clear_sentinel2()

            // clear_sentinel2_compare("left")
            // clear_sentinel2_compare("right")

            // clear_spectrum("left")
            // clear_spectrum("right")

            // clear_subscene("left")
            // clear_subscene("right")

            // $('#sentinel_checked').removeAttr("checked")
            // $('#sentinel_compare_checked').removeAttr("checked")
            // $('#spectrum_checked').removeAttr("checked")
            // $('#subscene_checked').removeAttr("checked")

            // clear_sentinel2_region()
            // clear_sentinel2_compare_region()
            // clear_spectrum_region()
            // clear_subscene_region()
        // },
        // onUnchecked: function () {
            // clear_sentinel2_sis("all")
            // clear_sentinel2_sis("left")
            // clear_sentinel2_sis("right")
            // clear_sentinel2_sis_region()
            // /*** add 20190513 ***/
            // $("#sentinel_polySis_button").off('click');
            // /********************/
        // }
    //});

    /*** add 20190610 ***/
    // $('#subscene_cb').checkbox({
        // onChecked: function () {
            // set_subscene("left")
            // set_subscene("right")
            // map_win_double()

            // clear_sentinel2()

            // clear_sentinel2_compare("left")
            // clear_sentinel2_compare("right")

            // clear_sentinel2_sis("left")
            // clear_sentinel2_sis("right")
            // clear_sentinel2_sis("all")

            // clear_spectrum("left")
            // clear_spectrum("right")

            // $('#sentinel_checked').removeAttr("checked")
            // $('#sentinel_compare_checked').removeAttr("checked")
            // $('#sentinel_sis_checked').removeAttr("checked")
            // $('#spectrum_checked').removeAttr("checked")

            // clear_sentinel2_region()
            // clear_sentinel2_compare_region()
            // clear_sentinel2_sis_region()
            // clear_spectrum_region()
        // },
        // onUnchecked: function () {
            // clear_subscene("left")
            // clear_subscene("right")
            // clear_subscene_region()
            // /*** add 20190513 ***/
            // $("#subscene_poly_button").off('click');
            // /********************/
            // map_win_single()
        // }
    // });
    /*** add 20190610 ***/

    /*** add 20191125 ***/
    // $('#spectrum_cb').checkbox({
        // onChecked: function () {
            // set_spectrum("left")
            // set_spectrum("right")
            // map_win_double()

            // clear_sentinel2()

            // clear_sentinel2_compare("left")
            // clear_sentinel2_compare("right")

            // clear_sentinel2_sis("all")
            // clear_sentinel2_sis("left")
            // clear_sentinel2_sis("right")

            // clear_subscene("left")
            // clear_subscene("right")

            // $('#sentinel_checked').removeAttr("checked")
            // $('#sentinel_compare_checked').removeAttr("checked")
            // $('#sentinel_sis_checked').removeAttr("checked")
            // $('#subscene_checked').removeAttr("checked")

            // clear_sentinel2_region()
            // clear_sentinel2_compare_region()
            // clear_sentinel2_sis_region()
            // clear_subscene_region()
        // },
        // onUnchecked: function () {
            // clear_spectrum("left")
            // clear_spectrum("right")
            // map_win_single();
            // clear_spectrum_region()
            // /*** add 20190513 ***/
            // $("#spectrum_button").off('click');
            // /********************/
        // }
    // });
    /*** add 20191125 ***/


    /*$('#4dir').checkbox({
        onChecked: function() {
            houiCount = 4;
            if ($('#houiline_cb').checkbox('is checked'))
                get_houiline();
        }
    });
	
    $('#8dir').checkbox({
        onChecked: function() {
            houiCount = 8;
            if ($('#houiline_cb').checkbox('is checked'))
                get_houiline();
        }
    });
	
    $('#16dir').checkbox({
        onChecked: function() {
            houiCount = 16;
            if ($('#houiline_cb').checkbox('is checked'))
                get_houiline();
        }
    });*/
}
/*************** measure function *************/

/**
* Format length output.
* @param {ol.geom.LineString} line The line.
* @return {string} The formatted length.
*/
var formatLength = function (line) {
    var length;
    var coordinates = line.getCoordinates();
    length = 0;
    var sourceProj = maps[0].getView().getProjection();
    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
        var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
        length += wgs84Sphere.haversineDistance(c1, c2);
    }
    var output;
    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) + ' km';
    } else {
        output = (Math.round(length * 100) / 100) + ' m';
    }
    return output;
};

/**
* Format area output.
* @param {ol.geom.Polygon} polygon The polygon.
* @return {string} Formatted area.
*/
var formatArea = function (polygon) {
    var area;

    var sourceProj = maps[0].getView().getProjection();
    var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(sourceProj, 'EPSG:4326'));
    var coordinates = geom.getLinearRing(0).getCoordinates();
    area = Math.abs(wgs84Sphere.geodesicArea(coordinates));

    var output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>';
    } else {
        output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';
    }
    return output;
};


function clear_helptooltip() {
    //helpTooltipElement關閉
    if (helpTooltipElement) {
        if (helpTooltipElement.parentNode)
            helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
}

function addInteraction(measure_type) {
    var type = (measure_type.value == 'area' ? 'Polygon' : measure_type.value == 'length' ? 'LineString' : 'Point');
    measure_draw = new ol.interaction.Draw({
        source: source,
        type: /** @type {ol.geom.GeometryType} */ (type),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    });

    maps[0].addInteraction(measure_draw);

    createMeasureTooltip();
    createHelpTooltip();

    var listener;
    measure_draw.on('drawstart',
        function (evt) {
            // set sketch
            sketch = evt.feature;
            /** @type {ol.Coordinate|undefined} */
            var tooltipCoord = evt.coordinate;
            var coord;

            if (type == "Point") {
                var normalCoord = 0;
                //得到經緯度坐標
                coord = evt.feature.getGeometry().getCoordinates();
                normalCoord = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326')

                //顯示取到四捨五入第四位
                var size = Math.pow(10, 4);
                normalCoord[0] = Math.round(normalCoord[0] * size) / size;
                normalCoord[1] = Math.round(normalCoord[1] * size) / size;

                measureTooltipElement.innerHTML = normalCoord;
                measureTooltip.setPosition(coord);
            }
            else {
                listener = sketch.getGeometry().on('change', function (evt) {
                    var geom = evt.target;
                    var output;
                    if (geom instanceof ol.geom.Polygon) {
                        output = formatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof ol.geom.LineString) {
                        output = formatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    measureTooltipElement.innerHTML = output;
                    measureTooltip.setPosition(tooltipCoord);
                });
            }

        }, this);

    measure_draw.on('drawend',
        function () {
            measureTooltipElement.className = 'tooltip tooltip-me';
            measureTooltip.setOffset([0, -7]);
            // unset sketch
            sketch = null;
            // unset tooltip so that a new one can be created
            measureTooltipElement = null;
            createMeasureTooltip();
            ol.Observable.unByKey(listener);
            map_move_mode();
        }, this);
}

/**
* Creates a new help tooltip
*/
function createHelpTooltip() {
    if (helpTooltipElement) {
        if (helpTooltipElement.parentNode)
            helpTooltipElement.parentNode.removeChild(helpTooltipElement);

    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'tooltip hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    maps[0].addOverlay(helpTooltip);
}

/**
* Creates a new measure tooltip
*/
function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    maps[0].addOverlay(measureTooltip);
}

// 清除measure圖層與tooltip
function measure_clean() {
    if (measure) {
        maps[0].removeLayer(measure);
        measure.getSource().clear();
        source.clear();
        maps[0].addLayer(measure);
        var staticTooltip = document.getElementsByClassName("tooltip-me");
        var length = staticTooltip.length;
        for (var i = 0; i < length; i++) {
            //staticTooltip[0].parentNode.removeChild(staticTooltip[0]);
            if (staticTooltip[0]) {
                staticTooltip[0].parentNode.removeChild(staticTooltip[0]);
            }
        }
        createMeasureTooltip();
    }
}

/*************** !measure function *************/
/*** 1007 ***/
function map_center_off() {
    $('.s_c_center').hide();
}
function map_center_on() {
    fun_access_log("Func_Use_Sup_1_2");
    $('.s_c_center').show();
}
/*** 1007 ***/

/*****************************************************  earthquake  ****************************************************************************** */
let select_earthquake_or_wall = 0;
var wallFill = new ol.style.Fill({
    color: 'rgba(0, 255, 0, 0.8)'
});
var wallStroke = new ol.style.Stroke({
    color: 'rgba(0, 255, 0, 0.2)',
    width: 1
});
var magStroke = new ol.style.Stroke({
    color: 'rgba(255, 0, 0, 0.2)',
    width: 3
});
var magFill = new ol.style.Fill({
    color: 'rgba(255, 0, 0, 0.8)'
});

var earthquakeFill = new ol.style.Fill({
    color: 'rgba(255, 0, 0, 0.8)'
});
var earthquakeFill_small = new ol.style.Fill({
    color: 'rgba(43, 105, 53, 0.8)'
});
var earthquakeFill_mid = new ol.style.Fill({
    color: 'rgba(229, 224, 67, 0.8)'
});
var earthquakeFill_big = new ol.style.Fill({
    color: 'rgba(234, 72, 11, 0.8)'
});
var earthquakeStroke = new ol.style.Stroke({
    color: 'rgba(255, 204, 0, 0.2)',
    width: 1
});
var earthquakeStroke_small = new ol.style.Stroke({
    color: 'rgba(43, 105, 53, 0.2)',
    width: 1
});
var earthquakeStroke_mid = new ol.style.Stroke({
    color: 'rgba(229, 224, 67, 0.2)',
    width: 1
});
var earthquakeStroke_big = new ol.style.Stroke({
    color: 'rgba(234, 72, 11, 0.2)',
    width: 1
});
var textFill = new ol.style.Fill({
    color: '#fff'
});
var textStroke = new ol.style.Stroke({
    color: 'rgba(0, 0, 0, 0.6)',
    width: 3
});
var invisibleFill = new ol.style.Fill({
    color: 'rgba(255, 255, 255, 0.01)'
});

let search_option = 0;

function open_3dlayer(opt) {
    var resize_url;
    maps[0].once('postcompose', function (event) {
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

        i.onload = function () {
            sWidth = i.width;
            sHeight = i.height;
        };
        i.src = canvas_url;

        let image = new Image();
        image.onload = function () {
            if (sWidth > sHeight) {
                sWidth = sHeight;
            }
            else {
                sHeight = sWidth;
            }

            localStorage.setItem("_sw", sWidth);
            localStorage.setItem("_sh", sHeight);

            ctx.translate(785, 785);
            ctx.rotate(Math.PI);

            ctx.drawImage(image, (canvas.width - sWidth) / 2, (canvas.height - sHeight) / 2, sWidth, sHeight, 0, 0, 785, 785);

            resize_url = canvas_png.toDataURL('image/png');
            localStorage.setItem("resize_img", resize_url);

            let extentMap = map.getView().calculateExtent([sWidth, sHeight]);

            let bottomLeft = ol.proj.transform(ol.extent.getBottomLeft(extentMap), 'EPSG:3857', 'EPSG:4326');
            let topRight = ol.proj.transform(ol.extent.getTopRight(extentMap), 'EPSG:3857', 'EPSG:4326');

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

            if (opt == 'earthquake') {
                fun_access_log("Func_Use_Data_1_3");
                let active_earthquake_checked = document.getElementById('active_earthquake').checked
                let history_earthquake_checked = document.getElementById('history_earthquake').checked
                let earthquake_opt = 0
                if (active_earthquake_checked == true && history_earthquake_checked == true) {
                    earthquake_opt = 1;
                }
                else if (active_earthquake_checked == true) {
                    earthquake_opt = 2;
                }
                else if (history_earthquake_checked == true) {
                    earthquake_opt = 3;
                }
                else {
                    earthquake_opt = 0;
                }
                if (search_option == 0) {
                    localStorage.setItem("search_coordinate", localStorage.getItem("storageName", getInput));
                    localStorage.setItem("date_from", '2000-1-1');
                    localStorage.setItem("date_to", $('#earthquake_date_to').val());

                    localStorage.setItem("min_depth", 0);
                    localStorage.setItem("max_depth", 720);

                    localStorage.setItem("min_mag", 0);
                    localStorage.setItem("max_mag", 10);
                    localStorage.setItem("earthquake_opt", 1);
                }
                else {
                    let coordinate = $('#Search_earthquake_In_drawbox_RD_X').val() + '/' + $('#Search_earthquake_In_drawbox_LU_X').val() + '/' + $('#Search_earthquake_In_drawbox_RD_Y').val() + '/' + $('#Search_earthquake_In_drawbox_LU_Y').val();
                    localStorage.setItem("search_coordinate", coordinate);
                    localStorage.setItem("date_from", $('#earthquake_date_from').val());
                    localStorage.setItem("date_to", $('#earthquake_date_to').val());

                    localStorage.setItem("min_depth", $('#search_depth_L').text());
                    localStorage.setItem("max_depth", $('#search_depth_H').text());

                    localStorage.setItem("min_mag", $('#search_mag_L').text());
                    localStorage.setItem("max_mag", $('#search_mag_H').text());
                    localStorage.setItem("earthquake_opt", earthquake_opt);
                }


                let dest_url = window.location.href.split('/src')[0] + "/js/3d_data/index_3d.php"
                window.open(dest_url);
            }
            else {
                fun_access_log("Func_Use_Data_1_4");
                if (search_option == 0) {
                    localStorage.setItem("search_coordinate", localStorage.getItem("storageName", getInput));
                    localStorage.setItem("date_from", '2000-1-1');
                    localStorage.setItem("date_to", $('#wall_date_to').val());
                }
                else {
                    let coordinate = $('#Search_wall_In_drawbox_RD_X').val() + '/' + $('#Search_wall_In_drawbox_LU_X').val() + '/' + $('#Search_wall_In_drawbox_RD_Y').val() + '/' + $('#Search_wall_In_drawbox_LU_Y').val();
                    localStorage.setItem("search_coordinate", coordinate);
                    localStorage.setItem("date_from", $('#wall_date_from').val());
                    localStorage.setItem("date_to", $('#wall_date_to').val());
                }

                localStorage.setItem("min_depth", 0);
                localStorage.setItem("max_depth", 720);

                localStorage.setItem("min_mag", 0);
                localStorage.setItem("max_mag", 10);
                localStorage.setItem("earthquake_opt", 1);

                let dest_url = window.location.href.split('/src')[0] + "/js/3d_data/index_3d.php"
                window.open(dest_url);
            }
        };
        image.src = canvas_url;
        canvas_png.style.display = "none";
    });

    maps[0].renderSync();
    maps[0].addControl(new ol.control.Zoom({
        className: 'custom-zoom'
    }));

}

// 折線圖
var icon_box;
var icon_source;
var path_chart;
var path_coord;

function UpdatepathChart(pointArray) { //折線圖的設定
    console.log(pointArray)
    path_chart = AmCharts.makeChart("path_chartdiv", {
        "dataProvider": pointArray,
        "type": "serial",
        "theme": "light",
        "marginRight": 40,
        "marginLeft": 40,
        "autoMarginOffset": 20,
        "valueAxes": [{
            "id": "v1",
            "axisAlpha": 0,
            "position": "left",
            "ignoreAxisWidth": false,
            "title": "高度（m）"
        }],
        "balloon": {
            "borderThickness": 1,
            "shadowAlpha": 0.4
        },
        "graphs": [{
            "id": "g1",
            "lineColor": "#388112",
            "balloon": {
                "drop": true,
                "adjustBorderColor": false,
                "color": "#ffffff",
                "type": "smoothedLine"
            },
            "fillAlphas": 0.2,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "bulletSize": 5,
            "hideBulletsCount": 50,
            "lineThickness": 2,
            "title": "red line",
            "useLineColorForBulletBorder": true,
            "valueField": "高程",
            "balloonText": "<span style='font-size:18px;'>[[高程]]</span>"
        }],
        "chartScrollbar": {
            "graph": "g1",
            "scrollbarHeight": 50,
            "backgroundAlpha": 0,
            "selectedBackgroundAlpha": 0.1,
            "selectedBackgroundColor": "#888888",
            "graphFillAlpha": 0,
            "graphLineAlpha": 0.5,
            "selectedGraphFillAlpha": 0,
            "selectedGraphLineAlpha": 1,
            "autoGridCount": true,
            "color": "#AAAAAA"
        },
        "chartCursor": {
            "cursorAlpha": 0,
        },
        "valueScrollbar": {
            "autoGridCount": true,
            "color": "#000000",
            "scrollbarHeight": 50
        },
        "categoryField": "水平距離(m)",
        "categoryAxis": {
            "equalSpacing": true,
            "gridPosition": "middle",
            "dashLength": 1,
            "minorGridEnabled": true,
            "title": "距離（m）"
        },
        "export": {
            "enabled": true
        },
        "zoomOutOnDataUpdate": false,
        "listeners": [{
            "event": "init",
            "method": function (e) {

                /**
                * Add click event on the plot area
                */


                var features = vector_box.getSource().getFeatures();
                var coor_all = features[0].getGeometry().getCoordinates();

                e.chart.chartDiv.addEventListener("click", function () { //滑鼠點選後，計算在線上的哪個點
                    var max_m = e.chart.dataProvider[e.chart.dataProvider.length - 1].m;
                    // we track cursor's last known position by "changed" event
                    if (e.chart.lastCursorPosition !== undefined) {
                        // get date of the last known cursor position
                        var date = e.chart.dataProvider[e.chart.lastCursorPosition][e.chart.categoryField];
                        var date_temp = e.chart.dataProvider[e.chart.lastCursorPosition][e.chart.categoryField];

                        var distance = [];

                        for (var i = 1; i < coor_all.length; i++) {
                            point1 = ol.proj.transform([coor_all[i - 1][0], coor_all[i - 1][1]], 'EPSG:3857', 'EPSG:4326');
                            point2 = ol.proj.transform([coor_all[i][0], coor_all[i][1]], 'EPSG:3857', 'EPSG:4326');

                            // create sphere to measure on
                            var wgs84sphere = new ol.Sphere(6378137); // one of WGS84 earth radius'

                            // get distance on sphere
                            distance[i - 1] = wgs84sphere.haversineDistance(point1, point2);
                        }

                        var coor_start, coor_end;

                        for (var i = 0; i < distance.length; i++) {
                            if (date_temp < distance[i]) {
                                percent = date_temp / distance[i];
                                coor_start = coor_all[i];
                                coor_end = coor_all[i + 1];
                                break;
                            }
                            else {
                                date_temp = date_temp - distance[i];
                                if (i == distance.length - 1) {
                                    percent = 1;
                                    coor_start = coor_all[i];
                                    coor_end = coor_all[i + 1];
                                }
                            }
                        }

                        var plot_coor = [(coor_start[0] * (1 - percent)) + (coor_end[0] * percent), (coor_start[1] * (1 - percent)) + (coor_end[1] * percent)];

                        if (icon_box) {
                            maps[map_ind].removeLayer(icon_box);
                            icon_box.getSource().clear();
                            icon_source.clear();
                            maps[map_ind].addLayer(icon_box);
                        }

                        var iconStyle = new ol.style.Style({
                            image: new ol.style.Icon({
                                anchor: [0.5, 40],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                opacity: 0.75,
                                src: 'https://geodac.ncku.edu.tw/SWCB_LLGIS/location.png'
                            })
                        });



                        var icon_feature = new ol.Feature(
                            new ol.geom.Point(plot_coor)
                        );
                        icon_feature.setStyle(iconStyle);

                        icon_source = new ol.source.Vector({ wrapX: false });
                        icon_source.addFeature(icon_feature);

                        icon_box = new ol.layer.Vector({
                            source: icon_source
                        });

                        maps[map_ind].addLayer(icon_box);


                        // create a new guide or update position of the previous one
                        if (e.chart.categoryAxis.guides.length === 0) {
                            var guide = new AmCharts.Guide();
                            guide.category = date;
                            guide.lineAlpha = 1;
                            guide.lineColor = "#c44";
                            e.chart.categoryAxis.addGuide(guide);
                        } else {
                            e.chart.categoryAxis.guides[0].category = date;

                        }
                        e.chart.validateData();
                    }
                })
                //handle touch screens so that subsequent guides can
                //be added. Requires that the user taps the next
                //point twice. Needed in order to not break zoom/pan
                e.chart.chartDiv.addEventListener("touchend", function () {
                    e.chart.tapped = false;
                });

                btn_enable();
            }
        }, {
            "event": "changed",
            "method": function (e) {
                /**
                * Log cursor's last known position
                */
                e.chart.lastCursorPosition = e.index;
            }
        }],
    });
}


// init values
function Search_earthquake_In_Calendar_byId(id) {
    return document.getElementById(id);
}

function Search_earthquake_In_Calendar_setSens(id, k) {
    // update range
    if (k == "min") {
        Search_earthquake_In_Calendar_E.setSensitiveRange(Search_earthquake_In_Calendar_byId(id).value, null);
    } else {
        Search_earthquake_In_Calendar_S.setSensitiveRange(null, Search_earthquake_In_Calendar_byId(id).value);
    }
}

function earthquake_box_select() {
    $("#show_earthquake_cluster_btn").val("隱藏叢集");
    $("#show_wall_cluster_btn").val("隱藏叢集");
    show_cluster_flag = 1;
    show_wall_flag = 1;
    let coor_array = new Array();
    let resize_url;
    let canvas;
    let canvas_url;
    let canvas_png = document.getElementById('canvas_png');
    let screen_cut_count = 0;

    clear_map();
    if (vector_box) {
        maps[map_ind].removeLayer(vector_box);
        vector_box.getSource().clear();
        source_box.clear();
        maps[map_ind].addLayer(vector_box);
    }

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

    // canvas = document.getElementsByClassName("ol-unselectable");
    // canvas_url = canvas[0].toDataURL('image/png'); //獲得圖片地址
    // canvas_png = document.getElementById('canvas_png');

    maps[map_ind].addLayer(vector_box);
    vector_box.setZIndex(100000);
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
        coor_array.push(coor_x);
        coor_array.push(coor_y);
        if (screen_cut_count == 0) {
            canvas = document.getElementsByClassName("ol-unselectable");
            canvas_url = canvas[0].toDataURL('image/png'); //獲得圖片地址
        }
        screen_cut_count++;

        return geometry;
    };
    draw_box = new ol.interaction.Draw({
        source: source_box,
        type: /** @type {ol.geom.GeometryType} */ (value),
        geometryFunction: geometryFunction,
        maxPoints: maxPoints
    });

    maps[map_ind].addInteraction(draw_box);
    draw_box.on('drawend', function (e) {
        box_array = (String(e.feature.getGeometry().getExtent())).split(",");
        loc_84 = ol.proj.transform([box_array[0], box_array[3]], 'EPSG:3857', 'EPSG:4326');
        document.getElementById("Search_earthquake_In_drawbox_LU_X").value = loc_84[0];
        document.getElementById("Search_earthquake_In_drawbox_LU_Y").value = loc_84[1];
        loc_84 = ol.proj.transform([box_array[2], box_array[1]], 'EPSG:3857', 'EPSG:4326');
        document.getElementById("Search_earthquake_In_drawbox_RD_X").value = loc_84[0];
        document.getElementById("Search_earthquake_In_drawbox_RD_Y").value = loc_84[1];
        maps[map_ind].removeInteraction(draw_box);

        // console.log('coor_array : ', coor_array[0]);
        // console.log('coor_array : ', coor_array[1]);

        // console.log('coor_array : ', coor_array[coor_array.length-2]);
        // console.log('coor_array : ', coor_array[coor_array.length-1]);

        // console.log(coor_array.length);

        let start_x, start_y;
        if (parseInt(coor_array[0]) < parseInt(coor_array[coor_array.length - 2])) {
            start_x = coor_array[0];
            start_y = coor_array[1];
        }
        else {
            start_x = coor_array[coor_array.length - 2];
            start_y = coor_array[coor_array.length - 1];
        }

        // console.log('start x : ', start_x);
        // console.log('start y : ', start_y);

        ctx = canvas_png.getContext('2d');

        width = 785;
        height = 785;
        canvas_png.width = width;
        canvas_png.height = height;

        // canvas_png.width = Math.abs(parseInt(coor_array[coor_array.length-2]) - parseInt(coor_array[0]));
        // canvas_png.height = Math.abs(parseInt(coor_array[coor_array.length-1]) - parseInt(coor_array[1]));

        var i = new Image();
        var sWidth;
        var sHeight;

        i.onload = function () {
            sWidth = i.width;
            sHeight = i.height;
        };

        i.src = canvas_url;

        var image = new Image();
        image.onload = function () {
            sWidth = Math.abs(parseInt(coor_array[coor_array.length - 2]) - parseInt(coor_array[0]));
            sHeight = Math.abs(parseInt(coor_array[coor_array.length - 1]) - parseInt(coor_array[1]));

            localStorage.setItem("_sw", sWidth);
            localStorage.setItem("_sh", sHeight);

            // ctx.translate(sWidth,sHeight);
            ctx.translate(785, 785);
            ctx.rotate(Math.PI);

            // ctx.drawImage(image, start_x, start_y, sWidth, sHeight, 0, 0, sWidth, sHeight);
            ctx.drawImage(image, start_x, start_y, sWidth, sHeight, 0, 0, 785, 785);

            resize_url = canvas_png.toDataURL('image/png');
            localStorage.setItem("resize_img", resize_url);
        };
        image.src = canvas_url;
        canvas_png.setAttribute('style', 'transform:rotate(180deg)');
        canvas_png.style.display = "none";
    })
}

function open_earthquake3d() {
    fun_access_log("Func_Use_Data_1_3");
    let active_earthquake_checked = document.getElementById('active_earthquake').checked
    let history_earthquake_checked = document.getElementById('history_earthquake').checked
    let earthquake_opt = 0
    if (active_earthquake_checked == true && history_earthquake_checked == true) {
        earthquake_opt = 1;
    }
    else if (active_earthquake_checked == true) {
        earthquake_opt = 2;
    }
    else if (history_earthquake_checked == true) {
        earthquake_opt = 3;
    }
    else {
        earthquake_opt = 0;
    }

    let coordinate = $('#Search_earthquake_In_drawbox_RD_X').val() + '/' + $('#Search_earthquake_In_drawbox_LU_X').val() + '/' + $('#Search_earthquake_In_drawbox_RD_Y').val() + '/' + $('#Search_earthquake_In_drawbox_LU_Y').val();
    localStorage.setItem("storageName", coordinate);
    localStorage.setItem("date_from", $('#earthquake_date_from').val());
    localStorage.setItem("date_to", $('#earthquake_date_to').val());

    localStorage.setItem("min_depth", $('#search_depth_L').text());
    localStorage.setItem("max_depth", $('#search_depth_H').text());

    localStorage.setItem("min_mag", $('#search_mag_L').text());
    localStorage.setItem("max_mag", $('#search_mag_H').text());
    localStorage.setItem("earthquake_opt", earthquake_opt);

    let dest_url = window.location.href.split('/src')[0] + "/js/3d_data/index_3d.php"
    window.open(dest_url);
}

function search_earthquake() {
    fun_access_log("Func_Use_Data_1_3");
    clear_map();
    select_earthquake_or_wall = 1;

    if (mag_layer_content != null) {
        MapOverlay2(0, mag_layer_content, 0);
        mag_layer_content = null;
    }
    if (pga_layer_content != null) {
        MapOverlay2(0, pga_layer_content, 0);
        pga_layer_content = null;
    }
    if (pgv_layer_content != null) {
        MapOverlay2(0, pgv_layer_content, 0);
        pgv_layer_content = null;
    }
    $("#show_earthquake_cluster_btn").val("隱藏叢集");
    $("#show_wall_cluster_btn").val("隱藏叢集");
    show_cluster_flag = 1;
    show_wall_flag = 1;
    // earthquake_date_from = $('#earthquake_date_from').val()
    // earthquake_date_to = $('#earthquake_date_to').val()
    // Search_earthquake_In_drawbox_LU_X = $('#Search_earthquake_In_drawbox_LU_X').val()
    // Search_earthquake_In_drawbox_LU_Y = $('#Search_earthquake_In_drawbox_LU_Y').val()
    // Search_earthquake_In_drawbox_RD_X = $('#Search_earthquake_In_drawbox_RD_X').val()
    // Search_earthquake_In_drawbox_RD_Y = $('#Search_earthquake_In_drawbox_RD_Y').val()

    active_earthquake_checked = document.getElementById('active_earthquake').checked
    history_earthquake_checked = document.getElementById('history_earthquake').checked
    earthquake_opt = 0
    if (active_earthquake_checked == true && history_earthquake_checked == true) {
        earthquake_opt = 1;
    }
    else if (active_earthquake_checked == true) {
        earthquake_opt = 2;
    }
    else if (history_earthquake_checked == true) {
        earthquake_opt = 3;
    }
    else {
        earthquake_opt = 0;
    }

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "php/earthquake.php",
        data: {
            earthquake_date_from: $('#earthquake_date_from').val(),
            earthquake_date_to: $('#earthquake_date_to').val(),
            Search_earthquake_In_drawbox_LU_X: $('#Search_earthquake_In_drawbox_LU_X').val(),
            Search_earthquake_In_drawbox_LU_Y: $('#Search_earthquake_In_drawbox_LU_Y').val(),
            Search_earthquake_In_drawbox_RD_X: $('#Search_earthquake_In_drawbox_RD_X').val(),
            Search_earthquake_In_drawbox_RD_Y: $('#Search_earthquake_In_drawbox_RD_Y').val(),
            depth_L: $('#search_depth_L').text(),
            depth_H: $('#search_depth_H').text(),
            mag_L: $('#search_mag_L').text(),
            mag_h: $('#search_mag_H').text(),
            earthquake_opt: earthquake_opt
        },
        success: function (response) {
            if (response.length == 0) {
                console.log('no earthquake data!')
                return
            }
            search_option = 1;
            // show earthquake cluster check box 
            $("#display_earthquake_checked").prop('disabled', false);
            document.getElementById("display_earthquake_checked").checked = true;
            document.getElementById('earthquake_checkbox_label').innerHTML = "關閉地震叢集"

            document.getElementById('show_earthquake_cluster_btn').disabled = false;
            // console.log(response);
            if (cluster_layer_earthquake != null) {
                maps[0].removeLayer(cluster_layer_earthquake);
                time_start = ''
                time_end = ''
            }

            let min_month = 13, max_month = 0, min_year = 10000, max_year = 0;
            for (let i = 0; i < response.length; ++i) {
                let month = parseInt(response[i]['earthq_time'].split(' ')[0].split('-')[1]);
                let year = parseInt(response[i]['earthq_time'].split(' ')[0].split('-')[0]);
                if (year <= min_year) {
                    min_year = year;
                }
                if (year >= max_year) {
                    max_year = year;
                }
            }
            time_start = min_year.toString() + '/1';
            time_end = max_year.toString() + '/12';

            cluster_layer_earthquake = create_cluster_earthquake(response, 0, 0, 0, 0, 0);
            cluster_layer_earthquake.setZIndex(100000);

            tmp_xml = response;
            set_mag_slider();
            set_time_slider(min_year, max_year);

            maps[0].addLayer(cluster_layer_earthquake);
            maps[0].on('click', add_earthquake_cluster_click_event);

            // display_earthquake_mag_checkbox();

            $("#hslider_value_L").html(0);
            $("#hslider_value_H").html(10);
            $("#hslider_value_L_time").html(time_start);
            $("#hslider_value_H_time").html(time_end);

            document.getElementById('bidirection_slider').style.display = 'block';
            document.getElementById('hslider').style.display = 'block';
            document.getElementById('bidirection_slider_time').style.display = 'block';
            document.getElementById('hslider_time').style.display = 'block';
        },
        error: function (jqXHR) {
            alert("error " + jqXHR.status);
        }
    });
}

function display_earthquake_checkbox() {
    $('#earthquake_hide_checkbox').checkbox({
        onChecked: function () {
            document.getElementById('show_earthquake_cluster_btn').disabled = false;
            if (cluster_layer_earthquake != null) {
                maps[0].removeLayer(cluster_layer_earthquake);
                cluster_layer_earthquake = null;
            }
            cluster_layer_earthquake = create_cluster_earthquake(tmp_xml, 3, mag_L, mag_H, time_start, time_end);
            cluster_layer_earthquake.setZIndex(100000);
            document.getElementById('earthquake_checkbox_label').innerHTML = "關閉地震叢集"
            document.getElementById('bidirection_slider').style.display = 'block';
            document.getElementById('hslider').style.display = 'block';
            document.getElementById('bidirection_slider_time').style.display = 'block';
            document.getElementById('hslider_time').style.display = 'block';

            let source = cluster_layer_earthquake.getSource();
            if (show_cluster_flag == 1) {
                source.setDistance(40);
            }
            else {
                source.setDistance(0);
            }

            maps[0].addLayer(cluster_layer_earthquake);
            maps[0].on('click', add_earthquake_cluster_click_event);
        },
        onUnchecked: function () {
            document.getElementById('show_earthquake_cluster_btn').disabled = true;
            document.getElementById('bidirection_slider').style.display = 'none';
            document.getElementById('hslider').style.display = 'none';
            document.getElementById('bidirection_slider_time').style.display = 'none';
            document.getElementById('hslider_time').style.display = 'none';

            if (cluster_layer_earthquake != null) {
                maps[0].removeLayer(cluster_layer_earthquake);
                cluster_layer_earthquake = null;
            }
            document.getElementById('earthquake_checkbox_label').innerHTML = "開啟地震叢集"
        }
    });
}

var show_cluster_flag = 1;
function change_earthquake_cluster(layer, $btn) {
    if ($btn.val() == "隱藏叢集") {
        $btn.val("顯示叢集");
        show_cluster_flag = 0;
        show_wall_flag = 0;
        let source = layer.getSource();
        let features = source.getFeatures();
        source.setDistance(0);
        cluster = null;
        layer.getSource().forEachFeature(function (feature) {
            let current_features = feature.get('features');
            for (let i = 0; i < current_features.length; ++i) {
                let magnitude = parseFloat(current_features[i].get('magnitude'));
                let radius = 6 * parseInt(magnitude) + 3 * ((magnitude * 10) % 10) / 10;
                let radius_inter = 1.5 * parseInt(magnitude);
                let select_stroke = null;
                let select_fill = null;
                if (magnitude < 5.5) {
                    select_stroke = earthquakeStroke_small;
                    select_fill = earthquakeFill_small;
                }
                else if (magnitude < 6) {
                    select_stroke = earthquakeStroke_mid;
                    select_fill = earthquakeFill_mid;
                }
                else {
                    select_stroke = earthquakeStroke_big;
                    select_fill = earthquakeFill_big;
                }
                style = new ol.style.Style({
                    geometry: feature.getGeometry(),
                    image: new ol.style.RegularShape({
                        radius1: radius,
                        radius2: radius_inter,
                        points: 5,
                        angle: Math.PI,
                        fill: select_fill,
                        stroke: select_stroke
                    }),
                    text: new ol.style.Text({
                        text: magnitude.toString(),
                        fill: textFill,
                        stroke: textStroke
                    })
                });
                feature.setStyle(style);
            }
        });
    }
    else {
        show_cluster_flag = 1;
        show_wall_flag = 1;
        let earthquake_source = layer.getSource();
        if (earthquake_source instanceof ol.source.Cluster) {
            earthquake_source.setDistance(40);
        }
        $btn.val("隱藏叢集");
    }
}

var add_earthquake_cluster_click_event = function (evt) {
    if (select_earthquake_or_wall != 1) {
        return;
    }
    var feature = maps[0].forEachFeatureAtPixel(evt.pixel, function (feature) { return feature; });
    if (feature) {
        if (typeof feature.get('features') === 'undefined') {
            return;
        } else {
            let content = "";
            let features = feature.get('features');
            cluster_last_arr = features;
            for (let i = 0; i < cluster_last_arr.length; ++i) {
                content += "<h5> id : " + features[i].get('id') + "</h5>"
                content += "<h5> 類別 : " + features[i].get('class') + "</h5>"
                content += "<h5> 時間 : " + features[i].get('time') + "</h5>"
                if (features[i].get('class') == "歷史地震") {
                    content += "<h5> 位置 : " + features[i].get('lat') + ', ' + features[i].get('lon') + "</h5>"
                    content += "<h5> 規模 : " + features[i].get('magnitude') + "</h5>"
                    content += "<h5> 深度 : " + features[i].get('depth') + "</h5><HR>"
                }
                else {
                    content += "<h5> 坐標 : " + features[i].get('lat') + ', ' + features[i].get('lon') + "</h5>"
                    content += "<h5> 規模 : " + features[i].get('magnitude') + "</h5>"
                    content += "<h5> 深度 : " + features[i].get('depth') + "</h5>"
                    content += "<h5> 地點 : " + features[i].get('destination') + "</h5>"
                    content += "<h5><a href=\"#\" onclick=\"window.open('https://scweb.cwb.gov.tw/zh-tw/earthquake/details/" + features[i].get('url_code') + "');\">連結</a></h5>"

                    if (features[i].get('no') != "小區域有感地震") {
                        checkbox_mag_id = 'show_earthquake_mag_' + features[i].get('id');
                        content += `</h5><input type="checkbox" value="${features[i].get('id') + '@' + features[i].get('time').split('-')[0]}" name="earthquake_class" id="${checkbox_mag_id}">  震度圖 </h5><br>`
                        if (parseInt(features[i].get('time').split('-')[0]) >= 2020) {
                            checkbox_pga_id = 'show_earthquake_pga_' + features[i].get('id');
                            content += `</h5><input type="checkbox" value="${features[i].get('id')}" name="earthquake_pga_class" id="${checkbox_pga_id}">  最大地動加速度圖 </h5><br>`
                            checkbox_pgv_id = 'show_earthquake_pgv_' + features[i].get('id');
                            content += `</h5><input type="checkbox" value="${features[i].get('id')}" name="earthquake_pgv_class" id="${checkbox_pgv_id}">  最大地動速度圖 </h5><br>`
                        }
                        checkbox_mag_val_id = 'show_earthquake_mag_val_' + features[i].get('id');
                        content += `</h5><input type="checkbox" value="${features[i].get('id') + '@' + features[i].get('time').split('-')[0] + '@' + features[i].get('lat') + '@' + features[i].get('lon')}" name="earthquake_mag_val_class" id="${checkbox_mag_val_id}">  震度數值圖 </h5><HR>`
                    }
                }
            }

            if (content != "") {
                att_win.show();
                att_win.detachObject(false);
                att_win.setDimension(320, 50);
                document.getElementById('Attributes_Info').innerHTML = content;
                att_win.attachObject("Attributes_Info", true);
            }
        }
    }
    // 震度圖
    let checkedElements = document.getElementsByName('earthquake_class');
    // console.log(checkedElements);
    for (let i = 0; checkedElements[i]; ++i) {
        let id = '#show_earthquake_mag_' + checkedElements[i].value.split('@')[0];
        let year = checkedElements[i].value.split('@')[1];
        // console.log(i, ' = ', id);
        // console.log(checkbox_id)
        $(id).change(function () {
            add_mag_layer(id, i, year);
        });
    }

    // 最大地動加速度圖
    let checkedElements_pga = document.getElementsByName('earthquake_pga_class');
    // console.log(checkedElements_pga);
    for (let i = 0; checkedElements_pga[i]; ++i) {
        let id = '#show_earthquake_pga_' + checkedElements_pga[i].value;
        // console.log(i, ' = ', id);
        // console.log(checkbox_id)
        $(id).change(function () {
            add_pga_layer(id, i, 2020);
        });
    }

    // 最大地動速度圖
    let checkedElements_pgv = document.getElementsByName('earthquake_pgv_class');
    // console.log(checkedElements_pgv);
    for (let i = 0; checkedElements_pgv[i]; ++i) {
        let id = '#show_earthquake_pgv_' + checkedElements_pgv[i].value;
        // console.log(i, ' = ', id);
        // console.log(checkbox_id)
        $(id).change(function () {
            add_pgv_layer(id, i, 2020);
        });
    }

    // 震度數值圖
    let checkedElements_mag_val = document.getElementsByName('earthquake_mag_val_class');
    // console.log(checkedElements_pgv);
    for (let i = 0; checkedElements_mag_val[i]; ++i) {
        let id = '#show_earthquake_mag_val_' + checkedElements_mag_val[i].value.split('@')[0];
        let year = checkedElements_mag_val[i].value.split('@')[1];
        // console.log(i, ' = ', id);
        // console.log(checkbox_id)
        $(id).change(function () {
            add_mag_val_layer(id, i, year, checkedElements_mag_val[i].value.split('@')[2], checkedElements_mag_val[i].value.split('@')[3]);
        });
    }

};

function disable_earthquake_cluster_utility() {
    document.getElementById('show_earthquake_cluster_btn').disabled = true;
    $("#display_earthquake_checked").prop('disabled', true);
    document.getElementById('bidirection_slider').style.display = 'none';
    document.getElementById('hslider').style.display = 'none';
    document.getElementById('bidirection_slider_time').style.display = 'none';
    document.getElementById('hslider_time').style.display = 'none';

    document.getElementById("display_earthquake_checked").checked = false;
    if (cluster_layer_earthquake != null) {
        maps[0].removeLayer(cluster_layer_earthquake);
        cluster_layer_earthquake = null;
    }
    document.getElementById('earthquake_checkbox_label').innerHTML = "開啟地震叢集"
}

function enable_earthquake_cluster_utility(mag_layer_checked, pga_layer_checked, pgv_layer_checked, mag_val_layer_checked) {
    if (mag_layer_checked == 0 && pga_layer_checked == 0 && pgv_layer_checked == 0 && mag_val_layer_checked == 0) {
        select_earthquake_or_wall = 1;

        document.getElementById('show_earthquake_cluster_btn').disabled = false;
        $("#display_earthquake_checked").prop('disabled', false);
        document.getElementById('bidirection_slider').style.display = 'block';
        document.getElementById('hslider').style.display = 'block';
        document.getElementById('bidirection_slider_time').style.display = 'block';
        document.getElementById('hslider_time').style.display = 'block';

        document.getElementById("display_earthquake_checked").checked = true;
        document.getElementById('earthquake_checkbox_label').innerHTML = "關閉地震叢集"

        if (cluster_layer_earthquake != null) {
            maps[0].removeLayer(cluster_layer_earthquake);
            cluster_layer_earthquake = null;
        }
        cluster_layer_earthquake = create_cluster_earthquake(tmp_xml, 3, mag_L, mag_H, time_start, time_end);
        cluster_layer_earthquake.setZIndex(100000);
        let source = cluster_layer_earthquake.getSource();
        if (show_cluster_flag == 1) {
            source.setDistance(40);
        }
        else {
            source.setDistance(0);
        }
        maps[0].addLayer(cluster_layer_earthquake);
    }
}

let mag_layer_content = null, pga_layer_content = null, pgv_layer_content = null, mag_val_layer_content = null;
let mag_layer_checked = 0, pga_layer_checked = 0, pgv_layer_checked = 0, mag_val_layer_checked = 0;


function add_mag_layer(id, index, year) {
    let checkedElements_mag = document.getElementsByName('earthquake_class');
    // console.log(id);
    let input_id = id.split('#show_earthquake_mag_')[1];
    // console.log(id.split('#show_earthquake_mag_'))
    // console.log(input_id)

    for (let i = 0; checkedElements_mag[i]; ++i) {
        if (i == index) {
            continue;
        }
        checkedElements_mag[i].checked = false;
    }

    if (checkedElements_mag[index].checked) {
        if (mag_layer_content != null) {
            MapOverlay2(0, mag_layer_content, 0);
            mag_layer_content = null;
        }
        mag_layer_checked = 1;
        disable_earthquake_cluster_utility();

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "php/seismic_intensity.php",
            data: {
                id: input_id
            },
            success: function (response) {
                console.log(response);
                console.log(response['mag_figure']);
                // console.log(response['mag_figure']);
                if (parseInt(year) < 2020) {
                    mag_layer_content = {
                        PosInfo: '23.16077263411840000000;120.64281523483096000000;563426;8;499;671;118.241621220699;19.78496703722129;123.2399636820923;26.42217246399297',
                        ID: 0,
                        Url: response['mag_figure']
                    };
                }
                else {
                    mag_layer_content = {
                        PosInfo: '23.16077263411840000000;120.64281523483096000000;563426;8;2334;2997;118.7077662110288;20.87398345127309;123.1235422735889;26.03098641546406',
                        ID: 0,
                        Url: response['mag_figure']
                    };
                }
                MapOverlay2(1, mag_layer_content, 0);
                // if(year >= 2020){

                // }
            },
            error: function (jqXHR) {
                alert("error " + jqXHR.status);
            }
        });
    }
    else {
        MapOverlay2(0, mag_layer_content, 0);
        mag_layer_content = null;
        mag_layer_checked = 0;
        enable_earthquake_cluster_utility(mag_layer_checked, pga_layer_checked, pgv_layer_checked, mag_val_layer_checked);
    }
}

function add_pga_layer(id, index, year) {
    let checkedElements_pga = document.getElementsByName('earthquake_pga_class');
    let input_id = id.split('#show_earthquake_pga_')[1];
    if (checkedElements_pga[index].checked) {
        if (pga_layer_content != null) {
            MapOverlay2(0, pga_layer_content, 0);
            pga_layer_content = null;
        }
        pga_layer_checked = 1;
        disable_earthquake_cluster_utility();

        for (let i = 0; checkedElements_pga[i]; ++i) {
            if (i == index) {
                continue;
            }
            checkedElements_pga[i].checked = false;
        }

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "php/seismic_intensity.php",
            data: {
                id: input_id
            },
            success: function (response) {
                // console.log(response['mag_figure']);
                pga_layer_content = {
                    PosInfo: '23.16077263411840000000;120.64281523483096000000;563426;8;2334;2997;118.7077662110288;20.87398345127309;123.1235422735889;26.03098641546406',
                    ID: 1,
                    Url: response['pga_figure']
                };
                MapOverlay2(1, pga_layer_content, 0);
                // if(year >= 2020){

                // }
            },
            error: function (jqXHR) {
                alert("error " + jqXHR.status);
            }
        });
    }
    else {
        MapOverlay2(0, pga_layer_content, 0);
        pga_layer_content = null;
        pga_layer_checked = 0;
        enable_earthquake_cluster_utility(mag_layer_checked, pga_layer_checked, pgv_layer_checked, mag_val_layer_checked);
    }
}

function add_pgv_layer(id, index, year) {
    let checkedElements_pgv = document.getElementsByName('earthquake_pgv_class');
    let input_id = id.split('#show_earthquake_pgv_')[1];
    if (checkedElements_pgv[index].checked) {
        if (pgv_layer_content != null) {
            MapOverlay2(0, pgv_layer_content, 0);
            pgv_layer_content = null;
        }
        pgv_layer_checked = 1;
        disable_earthquake_cluster_utility();

        for (let i = 0; checkedElements_pgv[i]; ++i) {
            if (i == index) {
                continue;
            }
            checkedElements_pgv[i].checked = false;
        }

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "php/seismic_intensity.php",
            data: {
                id: input_id
            },
            success: function (response) {
                pgv_layer_content = {
                    PosInfo: '23.16077263411840000000;120.64281523483096000000;563426;8;2334;2997;118.7077662110288;20.87398345127309;123.1235422735889;26.03098641546406',
                    ID: 2,
                    Url: response['pgv_figure']
                };
                MapOverlay2(1, pgv_layer_content, 0);
                // if(year >= 2020){

                // }
            },
            error: function (jqXHR) {
                alert("error " + jqXHR.status);
            }
        });
    }
    else {
        MapOverlay2(0, pgv_layer_content, 0);
        pgv_layer_content = null;
        pgv_layer_checked = 0;
        enable_earthquake_cluster_utility(mag_layer_checked, pga_layer_checked, pgv_layer_checked, mag_val_layer_checked);
    }
}


var add_mag_val_click_event = function (evt) {
    return;
};

function add_mag_val_layer(id, index, year, lat, lon) {
    let checkedElements_mag_val = document.getElementsByName('earthquake_mag_val_class');
    let input_id = id.split('#show_earthquake_mag_val_')[1];

    for (let i = 0; checkedElements_mag_val[i]; ++i) {
        if (i == index) {
            continue;
        }
        checkedElements_mag_val[i].checked = false;
    }

    if (checkedElements_mag_val[index].checked) {
        disable_earthquake_cluster_utility();
        mag_val_layer_checked = 1;

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "php/seismic_intensity.php",
            data: {
                id: input_id
            },
            success: function (response) {
                console.log(response);
                // console.log(response['magnitude']);
                // console.log(response['magnitude'].length);
                // console.log(response['magnitude'][0]);
                // console.log(response['magnitude'][1]['Stalon']);
                // console.log(response['magnitude'][1]['Stalat']);
                // console.log(response['mag_figure']);
                if (mag_val_layer_content != null) {
                    maps[0].removeLayer(mag_val_layer_content);
                }
                select_earthquake_or_wall = 3;
                mag_val_layer_content = create_mag_val_layer(response['magnitude'], year, lat, lon);
                tmp_mag_val = response['magnitude'];

                maps[0].addLayer(mag_val_layer_content);
                mag_val_layer_content.setZIndex(100000);
                maps[0].on('click', add_mag_val_click_event);
            },
            error: function (jqXHR) {
                alert("error " + jqXHR.status);
            }
        });
    }
    else {
        if (mag_val_layer_content != null) {
            maps[0].removeLayer(mag_val_layer_content);
            mag_val_layer_checked = 0;
        }
        select_earthquake_or_wall = 1;
        mag_val_layer_checked = 0;
        enable_earthquake_cluster_utility(mag_layer_checked, pga_layer_checked, pgv_layer_checked, mag_val_layer_checked);
    }
}

let tmp_mag_val = null;
function create_mag_val_layer(mag_val, year, lat, lon) {
    tmp_mag_val = mag_val;
    let mag_val_len = mag_val.length;
    let mag_features = new Array();
    for (let i = 0; i < mag_val_len; ++i) {
        let coordinates_mag_val = ol.proj.transform([parseFloat(mag_val[i]['Stalon']), parseFloat(mag_val[i]['Stalat'])], 'EPSG:4326', 'EPSG:3857');
        if (parseInt(year) < 2020) {
            if (parseFloat(mag_val[i]['PGA(V)']) < 0.8) {
                int_val = 0;
                continue;
            }
            else if (parseFloat(mag_val[i]['PGA(V)']) < 2.5) {
                int_val = 1;
            }
            else if (parseFloat(mag_val[i]['PGA(V)']) < 8) {
                int_val = 2;
            }
            else if (parseFloat(mag_val[i]['PGA(V)']) < 25) {
                int_val = 3;
            }
            else if (parseFloat(mag_val[i]['PGA(V)']) < 80) {
                int_val = 4;
            }
            else if (parseFloat(mag_val[i]['PGA(V)']) < 250) {
                int_val = 5;

            }
            else if (parseFloat(mag_val[i]['PGA(V)']) < 400) {
                int_val = 6;
            }
            else {
                int_val = 7;
            }

            mag_features.push(new ol.Feature({
                int: int_val,
                lat: mag_val[i]['Stalat'],
                lon: mag_val[i]['Stalon'],
                geometry: new ol.geom.Point(coordinates_mag_val)
            }));

        }
        else {
            mag_features.push(new ol.Feature({
                int: mag_val[i]['Int'],
                lat: mag_val[i]['Stalat'],
                lon: mag_val[i]['Stalon'],
                geometry: new ol.geom.Point(coordinates_mag_val)
            }));
        }
    }
    mag_features.push(new ol.Feature({
        int: '100',
        lat: lat,
        lon: lon,
        geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'))
    }));
    let mag_val_source = new ol.source.Vector({
        features: mag_features
    });

    let mag_val_distance = 1;
    let mag_val_clusterSource = new ol.source.Cluster({
        distance: parseInt(mag_val_distance, 10),
        source: mag_val_source
    });
    let mag_val_styleCache = {};
    let mag_val_clusters = new ol.layer.Vector({
        source: mag_val_clusterSource,
        style: function (feature) {
            let mag_val_size = feature.get('features').length;
            let mag_val_style = mag_val_styleCache[mag_val_size];
            let mag_val_current_feature = feature.get('features');
            let mag_val_int = parseInt(mag_val_current_feature[0].get('int'));
            if (mag_val_int == 100) {
                mag_val_style = new ol.style.Style({
                    geometry: feature.getGeometry(),
                    image: new ol.style.RegularShape({
                        radius1: 16,
                        radius2: 6,
                        points: 5,
                        fill: magFill,
                        stroke: magStroke
                    }),
                });
            }
            else {
                mag_val_style = new ol.style.Style({
                    geometry: feature.getGeometry(),
                    text: new ol.style.Text({
                        text: parseInt(mag_val_int).toString(),
                        fill: textFill,
                        stroke: textStroke,
                        font: parseInt(mag_val_int) * 3 + 10 + 'px sans-serif'
                    })
                });
            }
            mag_val_styleCache[mag_val_size] = mag_val_style;
            return mag_val_style;
        }
    });
    return mag_val_clusters;
}


function display_earthquake_mag_checkbox() {
    console.log('mag checkbox setup finished !');
    let checkedElements = document.getElementsByName('earthquake_class');
    console.log(checkedElements);
    for (let i = 0; checkedElements[i]; ++i) {
        checkbox_id = '#show_earthquake_mag_' + checkedElements[i].value;
        console.log(checkbox_id, document.getElementById(checkbox_id).checked);

        // console.log(checkbox_id)
        $(checkbox_id).change(function () {
            console.log(checkbox_id, document.getElementById(checkbox_id).checked);
        });
    }
}


function createEarthquakeStyle(feature) {
    var magnitude = parseFloat(feature.get('magnitude'));
    let radius = 6 * parseInt(magnitude) + 3 * ((magnitude * 10) % 10) / 10;
    let radius_inter = 1.5 * parseInt(magnitude);

    let select_stroke = null;
    let select_fill = null;
    if (magnitude < 5.5) {
        select_stroke = earthquakeStroke_small;
        select_fill = earthquakeFill_small;
    }
    else if (magnitude < 6) {
        select_stroke = earthquakeStroke_mid;
        select_fill = earthquakeFill_mid;
    }
    else {
        select_stroke = earthquakeStroke_big;
        select_fill = earthquakeFill_big;
    }

    return new ol.style.Style({
        geometry: feature.getGeometry(),
        image: new ol.style.RegularShape({
            radius1: radius,
            radius2: radius_inter,
            points: 5,
            angle: Math.PI,
            fill: select_fill,
            stroke: select_stroke
        }),
        text: new ol.style.Text({
            text: magnitude.toString(),
            fill: textFill,
            stroke: textStroke
        })
    });
}

var maxFeatureCount, vector;
function calculateClusterInfo(resolution) {
    maxFeatureCount = 0;
    var features = vector.getSource().getFeatures();
    var feature, radius;
    for (var i = features.length - 1; i >= 0; --i) {
        feature = features[i];
        var originalFeatures = feature.get('features');
        var extent = ol.extent.createEmpty();
        var j, jj;
        for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
            ol.extent.extend(extent, originalFeatures[j].getGeometry().getExtent());
        }
        maxFeatureCount = Math.max(maxFeatureCount, jj);
        radius = 0.25 * (ol.extent.getWidth(extent) + ol.extent.getHeight(extent)) / resolution;
        feature.set('radius', radius);
    }
}

var currentResolution;
function styleFunction(feature, resolution) {
    if (resolution != currentResolution) {
        calculateClusterInfo(resolution);
        currentResolution = resolution;
    }
    var style;
    var size = feature.get('features').length;
    if (size > 1) {
        style = new ol.style.Style({
            image: new ol.style.Circle({
                radius: feature.get('radius'),
                fill: new ol.style.Fill({
                    color: [255, 153, 0, Math.min(0.8, 0.4 + (size / maxFeatureCount))]
                })
            }),
            text: new ol.style.Text({
                text: size.toString(),
                fill: textFill,
                stroke: textStroke
            })
        });
    } else {
        var originalFeature = feature.get('features')[0];
        if (select_earthquake_or_wall == 1) {
            style = createEarthquakeStyle(originalFeature);
        }
        else if (select_earthquake_or_wall == 2) {
            style = createWallStyle(originalFeature);
        }
    }
    return style;
}

function selectStyleFunction(feature) {
    if (cluster_layer_earthquake != null) {
        var styles = [new ol.style.Style({
            image: new ol.style.Circle({
                radius: feature.get('radius'),
                fill: invisibleFill
            })
        })];
        var originalFeatures = feature.get('features');
        var originalFeature;
        for (var i = originalFeatures.length - 1; i >= 0; --i) {
            originalFeature = originalFeatures[i];
            // if(select_earthquake_or_wall==1){
            styles.push(createEarthquakeStyle(originalFeature));
            // }
            // if(select_earthquake_or_wall==2){
            //     styles.push(createWallStyle(originalFeature));
            // }
        }
        return styles;
    }
    else if (cluster_layer_wall != null) {
        var styles = [new ol.style.Style({
            image: new ol.style.Circle({
                radius: feature.get('radius'),
                fill: invisibleFill
            })
        })];
        var originalFeatures = feature.get('features');
        var originalFeature;
        for (var i = originalFeatures.length - 1; i >= 0; --i) {
            originalFeature = originalFeatures[i];
            // if(select_earthquake_or_wall==1){
            //     styles.push(createEarthquakeStyle(originalFeature));
            // }
            // if(select_earthquake_or_wall==2){
            styles.push(createWallStyle(originalFeature));
            // }
        }
        return styles;
    }
}
function image_stretch_opacity_slider() {
    $("#slider_opacity").slider({
        range: "max",
        min: 0,
        max: 100,
        value: 0,
        slide: function (e, ui) {
            $("#image_opacity").html(ui.value);
        }
    });
}


function set_search_depth_slider() {
    $("#slider_depth").slider({
        min: 0,
        max: 720,
        range: true,
        values: [0, 720],
        create: function (e, ui) {
            var style = { "width": "20px", "text-align": "center" };
            $(this).find(".ui-slider-handle").css(style);
        },
        slide: function (e, ui) {
            $("#search_depth_L").html(ui.values[0]);
            $("#search_depth_H").html(ui.values[1]);
        }
    });
}

function set_search_mag_slider() {
    $("#slider_mag").slider({
        min: 0,
        max: 10,
        range: true,
        values: [0, 10],
        create: function (e, ui) {
            var style = { "width": "20px", "text-align": "center" };
            $(this).find(".ui-slider-handle").css(style);
        },
        slide: function (e, ui) {
            $("#search_mag_L").html(ui.values[0]);
            $("#search_mag_H").html(ui.values[1]);
        }
    });
}

var mag_L = 0, mag_H = 10, time_start = '', time_end = '';
function set_mag_slider() {
    $("#hslider").slider({
        min: 0,
        max: 10,
        range: true,
        values: [0, 10],
        create: function (e, ui) {
            var style = { "width": "20px", "text-align": "center" };
            $(this).find(".ui-slider-handle").css(style);
        },
        slide: function (e, ui) {
            if (cluster_layer_earthquake != null) {
                features = null;
                maps[0].removeLayer(cluster_layer_earthquake);
                cluster_layer_earthquake = null;
            }

            cluster_layer_earthquake = create_cluster_earthquake(tmp_xml, 1, ui.values[0], ui.values[1], time_start, time_end);
            maps[0].addLayer(cluster_layer_earthquake);
            let source = cluster_layer_earthquake.getSource();
            if (show_cluster_flag == 1) {
                source.setDistance(40);
            }
            else {
                source.setDistance(0);
            }
            $("#hslider_value_L").html(ui.values[0]);
            $("#hslider_value_H").html(ui.values[1]);
        }
    });
}

function set_time_slider(min_year_val, max_year_val) {
    $("#hslider_time").slider({
        min: 1,
        max: (parseInt(max_year_val) - parseInt(min_year_val) + 1) * 12,
        range: true,
        values: [1, (parseInt(max_year_val) - parseInt(min_year_val) + 1) * 12],
        create: function (e, ui) {
            var style = { "width": "20px", "text-align": "center" };
            $(this).find(".ui-slider-handle").css(style);
        },
        slide: function (e, ui) {
            if (cluster_layer_earthquake != null) {
                features = null;
                maps[0].removeLayer(cluster_layer_earthquake);
                cluster_layer_earthquake = null;
            }

            ts = get_start_time(min_year_val, ui.values[0]);
            te = get_end_time(min_year_val, ui.values[1]);

            cluster_layer_earthquake = create_cluster_earthquake(tmp_xml, 2, mag_L, mag_H, ts, te);
            maps[0].addLayer(cluster_layer_earthquake);
            let source = cluster_layer_earthquake.getSource();
            if (show_cluster_flag == 1) {
                source.setDistance(40);
            }
            else {
                source.setDistance(0);
            }

            $("#hslider_value_L_time").html(ts);
            $("#hslider_value_H_time").html(te);
        }
    });
}

function get_start_time(min_year, val) {
    let year = min_year + parseInt(val / 12);
    let month = val % 12;
    if (month == 0) {
        year = year - 1;
        month = 12;
    }
    return_str = year.toString() + '/' + month.toString();
    return return_str;
}

function get_end_time(min_year, val) {
    let year = min_year + parseInt(val / 12);
    let month = val % 12;
    if (month == 0) {
        year = year - 1;
        month = 12;
    }
    return_str = year.toString() + '/' + month.toString();
    return return_str;
}

var tmp_feature = null;
var tmp_earthquake_data = null;
var cluster_layer_earthquake = null;
function create_cluster_earthquake(earthquake_data, opt, min_magnitude, max_magnitude, from_time, to_time) {
    tmp_earthquake_data = earthquake_data;
    let earthquake_data_len = earthquake_data.length;
    var features = new Array();
    for (let i = 0; i < earthquake_data_len; ++i) {
        /*
                if(parseInt(earthquake_data[i]['earthq_time'].split('-')[0]) < 2020){
                    mag_url = 'https://storage.geodac.tw/' + earthquake_data[i]['mag_figure'];
                    pga_url = '';
                    pgv_url = '';
                }
                else{
                    mag_url = 'https://storage.geodac.tw/' + earthquake_data[i]['mag_figure'];
                    pga_url = 'https://storage.geodac.tw/' + earthquake_data[i]['pga_figure'];
                    pgv_url = 'https://storage.geodac.tw/' + earthquake_data[i]['pgv_figure'];
                }
        */

        if (opt == 0) {
            let magnitude = parseFloat(earthquake_data[i]['earthq_scale']);
            let radius = 5 + 20 * (magnitude - 5);
            let coordinates = ol.proj.transform([parseFloat(earthquake_data[i]['pos_lon']), parseFloat(earthquake_data[i]['pos_lat'])], 'EPSG:4326', 'EPSG:3857');

            features.push(new ol.Feature({
                id: earthquake_data[i]['earthq_id'],
                no: earthquake_data[i]['earthq_no'],
                lat: earthquake_data[i]['pos_lat'],
                lon: earthquake_data[i]['pos_lon'],
                magnitude: magnitude,
                depth: earthquake_data[i]['earthq_depth'],
                time: earthquake_data[i]['earthq_time'],
                class: earthquake_data[i]['earthq_class'],
                destination: earthquake_data[i]['pos_desc'],
                url_code: earthquake_data[i]['url_code'],
                /*
                mag_url : mag_url,
                pga_url : pga_url,
                pgv_url : pgv_url,
                */
                geometry: new ol.geom.Point(coordinates)
            }));
        }
        else {
            if (opt == 1) {
                mag_L = min_magnitude;
                mag_H = max_magnitude;
            }
            else if (opt == 2) {
                time_start = from_time;
                time_end = to_time;
            }
            else {
                mag_L = min_magnitude;
                mag_H = max_magnitude;
                time_start = from_time;
                time_end = to_time;
            }
            let add_flag = 0, start_flag = 0, end_flag = 0;
            let year = parseInt(earthquake_data[i]['earthq_time'].split(' ')[0].split('-')[0]);
            let month = parseInt(earthquake_data[i]['earthq_time'].split(' ')[0].split('-')[1]);

            let magnitude = parseFloat(earthquake_data[i]['earthq_scale']);
            if (magnitude >= parseFloat(min_magnitude) && magnitude <= parseFloat(max_magnitude)) {
                if (year > parseInt(from_time.split('/')[0]) && year < parseInt(to_time.split('/')[0])) {
                    add_flag = 1;
                }
                else if (year == parseInt(from_time.split('/')[0]) && year == parseInt(to_time.split('/')[0])) {
                    if (month >= parseInt(from_time.split('/')[1]) && month <= parseInt(to_time.split('/')[1])) {
                        add_flag = 1;
                    }
                    else {
                        add_flag = 0;
                    }
                }
                else if (year == parseInt(from_time.split('/')[0])) {
                    if (month >= parseInt(from_time.split('/')[1])) {
                        add_flag = 1;
                    }
                    else {
                        add_flag = 0;
                    }
                }
                else if (year == parseInt(to_time.split('/')[0])) {
                    if (month <= parseInt(to_time.split('/')[1])) {
                        add_flag = 1;
                    }
                    else {
                        add_flag = 0;
                    }
                }
                else {
                    add_flag = 0;
                }
            }
            if (add_flag == 1) {
                let radius = 5 + 20 * (magnitude - 5);
                let coordinates = ol.proj.transform([parseFloat(earthquake_data[i]['pos_lon']), parseFloat(earthquake_data[i]['pos_lat'])], 'EPSG:4326', 'EPSG:3857');
                features.push(new ol.Feature({
                    id: earthquake_data[i]['earthq_id'],
                    no: earthquake_data[i]['earthq_no'],
                    lat: earthquake_data[i]['pos_lat'],
                    lon: earthquake_data[i]['pos_lon'],
                    magnitude: magnitude,
                    depth: earthquake_data[i]['earthq_depth'],
                    time: earthquake_data[i]['earthq_time'],
                    class: earthquake_data[i]['earthq_class'],
                    destination: earthquake_data[i]['pos_desc'],
                    url_code: earthquake_data[i]['url_code'],
                    /*
                    mag_url : mag_url,
                    pga_url : pga_url,
                    pgv_url : pgv_url,
                    */
                    geometry: new ol.geom.Point(coordinates)
                }));
            }
            else {
                continue;
            }
        }
        tmp_feature = features;
    }

    var source = new ol.source.Vector({
        features: features
    });

    var distance = 40;
    var clusterSource = new ol.source.Cluster({
        distance: parseInt(distance, 10),
        source: source
    });

    var styleCache = {};
    var clusters = new ol.layer.Vector({
        source: clusterSource,
        style: function (feature) {
            var size = feature.get('features').length;
            var style = styleCache[size];
            if (show_cluster_flag == 1) {
                style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: size + 5,
                        stroke: earthquakeStroke,
                        fill: earthquakeFill
                    }),
                    text: new ol.style.Text({
                        text: size.toString(),
                        stroke: textStroke,
                        fill: textFill
                    })
                });
                styleCache[size] = style;
                return style;
            }
            else {
                let current_features = feature.get('features');

                let magnitude = parseFloat(current_features[0].get('magnitude'));
                let radius = 6 * parseInt(magnitude) + 3 * ((magnitude * 10) % 10) / 10;
                let radius_inter = 1.5 * parseInt(magnitude);

                let select_stroke = null;
                let select_fill = null;
                if (magnitude < 5.5) {
                    select_stroke = earthquakeStroke_small;
                    select_fill = earthquakeFill_small;
                }
                else if (magnitude < 6) {
                    select_stroke = earthquakeStroke_mid;
                    select_fill = earthquakeFill_mid;
                }
                else {
                    select_stroke = earthquakeStroke_big;
                    select_fill = earthquakeFill_big;
                }

                style = new ol.style.Style({
                    geometry: feature.getGeometry(),
                    image: new ol.style.RegularShape({
                        radius1: radius,
                        radius2: radius_inter,
                        points: 5,
                        angle: Math.PI,
                        fill: select_fill,
                        stroke: select_stroke
                    }),
                    text: new ol.style.Text({
                        text: magnitude.toString(),
                        fill: textFill,
                        stroke: textStroke
                    })
                });
                styleCache[size] = style;
                return style;
            }
        }
    });
    return clusters;
}

// ************************ search wall data ****************************
function Search_wall_In_Calendar_byId(id) {
    return document.getElementById(id);
}

function Search_wall_In_Calendar_setSens(id, k) {
    // update range
    if (k == "min") {
        Search_wall_In_Calendar_E.setSensitiveRange(Search_wall_In_Calendar_byId(id).value, null);
    } else {
        Search_wall_In_Calendar_S.setSensitiveRange(null, Search_wall_In_Calendar_byId(id).value);
    }
}

function toggle_menu(id, menu_size) {
    for (let i = 0; i < menu_size; ++i) {
        let menu_id = 'menu_' + id + "_" + i;
        let menu_item = document.getElementById(menu_id);
        menu_item.classList.toggle("menu_hide");


        let element_id = 'items_' + id + '_' + i;
        let details_item = document.getElementById(element_id);
        details_item.classList.toggle("hide");
        // for(j=0; j<menu_size; ++j){
        //     let element_id = 'items_' + id + '_' + j;
        //     let details_item = document.getElementById(element_id);
        //     details_item.style.display=="none";
        // }
    }
}


function toggle_detail(id, idx) {
    let element_id = 'items_' + id + '_' + idx;
    let details_item = document.getElementById(element_id);
    details_item.classList.toggle("hide");
}

var add_wall_cluster_click_event = function (evt) {
    if (select_earthquake_or_wall != 2) {
        return;
    }
    var feature = maps[0].forEachFeatureAtPixel(evt.pixel, function (feature) { return feature; });
    if (feature) {
        if (typeof feature.get('features') === 'undefined') {
            return;
        } else {
            let content = "";
            let features = feature.get('features');
            cluster_last_arr = features;
            for (let i = 0; i < cluster_last_arr.length; ++i) {
                content += "<h5> 計畫名稱 : " + features[i].get('name') + "</h5>"
                content += "<h5> 計畫編號 : " + features[i].get('no') + "</h5>"
                content += "<h5> 鑽井編號 : " + features[i].get('id') + "</h5>"
                content += "<h5> 測量日期 : " + features[i].get('time') + "</h5>"
                content += "<h5> 位置 : " + features[i].get('lat') + ', ' + features[i].get('lon') + "</h5>"
                content += "<h5> 深度 : " + features[i].get('depth') + "</h5>"
                content += "<h5> 地下水位深度 : " + features[i].get('water_table_depth') + "</h5>"
                content += "<h5> 海拔 : " + features[i].get('elevation') + "</h5>"
                content += "<h5> 執行組織 : " + features[i].get('party_org') + "</h5>"
                content += "<h5> 執行人員 : " + features[i].get('party_exe') + "</h5>"
                content += `<h5 onclick="toggle_menu(\'${features[i].get('id')}\', ${features[i].get('detail').length})"> ▼ 細項 : (點擊查看詳細資訊)</h5>`
                for (let j = 0; j < features[i].get('detail').length; ++j) {
                    let menu_id = 'menu_' + features[i].get('id') + "_" + j;
                    let item_id = 'items_' + features[i].get('id') + "_" + j;
                    content += `<div id="${menu_id}" class="menu_hide"> ● ${j + 1}</div>`
                    // content += `<div id="${menu_id}" class="menu_hide" onclick="toggle_detail(\'${features[i].get('id')}\', ${j})"> ● ${j+1}</div>`
                    content += `<ul class="hide" id="${item_id}">`
                    // content += `<ul class="hide" id="${item_id}">`
                    content += "<li> 頂部深度 : " + features[i].get('detail')[j]['TOP_DEPTH'] + "</li>"
                    content += "<li> 底部深度 : " + features[i].get('detail')[j]['BOTTOM_DEPTH'] + "</li>"
                    content += "<li> 代碼 : " + features[i].get('detail')[j]['CODE'] + "</li>"
                    content += "</ul>"
                }
                content += "<HR>"

            }
            if (content != "") {
                att_win.show();
                att_win.detachObject(false);
                att_win.setDimension(320, 50);
                document.getElementById('Attributes_Info').innerHTML = content;
                att_win.attachObject("Attributes_Info", true);
            }
        }
    }

};


function open_wall3d() {
    fun_access_log("Func_Use_Data_1_4");
    let coordinate = $('#Search_wall_In_drawbox_RD_X').val() + '/' + $('#Search_wall_In_drawbox_LU_X').val() + '/' + $('#Search_wall_In_drawbox_RD_Y').val() + '/' + $('#Search_wall_In_drawbox_LU_Y').val();
    localStorage.setItem("storageName", coordinate);
    localStorage.setItem("date_from", $('#wall_date_from').val());
    localStorage.setItem("date_to", $('#wall_date_to').val());

    localStorage.setItem("min_depth", 0);
    localStorage.setItem("max_depth", 720);

    localStorage.setItem("min_mag", 0);
    localStorage.setItem("max_mag", 10);
    localStorage.setItem("earthquake_opt", 1);

    let dest_url = window.location.href.split('/src')[0] + "/js/3d_data/index_3d.php"
    window.open(dest_url);
}

function wall_box_select() {
    $("#show_earthquake_cluster_btn").val("隱藏叢集");
    $("#show_wall_cluster_btn").val("隱藏叢集");
    show_cluster_flag = 1;
    show_wall_flag = 1;
    let coor_array = new Array();
    let resize_url;
    let canvas;
    let canvas_url;
    let canvas_png = document.getElementById('canvas_png');
    let screen_cut_count = 0;

    clear_map();
    if (vector_box) {
        maps[map_ind].removeLayer(vector_box);
        vector_box.getSource().clear();
        source_box.clear();
        maps[map_ind].addLayer(vector_box);
    }

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

    // canvas = document.getElementsByClassName("ol-unselectable");
    // canvas_url = canvas[0].toDataURL('image/png'); //獲得圖片地址
    // canvas_png = document.getElementById('canvas_png');

    maps[map_ind].addLayer(vector_box);
    vector_box.setZIndex(100000);
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
        coor_array.push(coor_x);
        coor_array.push(coor_y);
        if (screen_cut_count == 0) {
            canvas = document.getElementsByClassName("ol-unselectable");
            canvas_url = canvas[0].toDataURL('image/png'); //獲得圖片地址
        }
        screen_cut_count++;

        return geometry;
    };
    draw_box = new ol.interaction.Draw({
        source: source_box,
        type: /** @type {ol.geom.GeometryType} */ (value),
        geometryFunction: geometryFunction,
        maxPoints: maxPoints
    });

    maps[map_ind].addInteraction(draw_box);
    draw_box.on('drawend', function (e) {
        box_array = (String(e.feature.getGeometry().getExtent())).split(",");
        loc_84 = ol.proj.transform([box_array[0], box_array[3]], 'EPSG:3857', 'EPSG:4326');
        document.getElementById("Search_wall_In_drawbox_LU_X").value = loc_84[0];
        document.getElementById("Search_wall_In_drawbox_LU_Y").value = loc_84[1];
        loc_84 = ol.proj.transform([box_array[2], box_array[1]], 'EPSG:3857', 'EPSG:4326');
        document.getElementById("Search_wall_In_drawbox_RD_X").value = loc_84[0];
        document.getElementById("Search_wall_In_drawbox_RD_Y").value = loc_84[1];
        maps[map_ind].removeInteraction(draw_box);
        // console.log('coor_array : ', coor_array[0]);
        // console.log('coor_array : ', coor_array[1]);

        // console.log('coor_array : ', coor_array[coor_array.length-2]);
        // console.log('coor_array : ', coor_array[coor_array.length-1]);

        // console.log(coor_array.length);

        let start_x, start_y;
        if (parseInt(coor_array[0]) < parseInt(coor_array[coor_array.length - 2])) {
            start_x = coor_array[0];
            start_y = coor_array[1];
        }
        else {
            start_x = coor_array[coor_array.length - 2];
            start_y = coor_array[coor_array.length - 1];
        }

        // console.log('start x : ', start_x);
        // console.log('start y : ', start_y);

        ctx = canvas_png.getContext('2d');

        width = 785;
        height = 785;
        canvas_png.width = width;
        canvas_png.height = height;

        // canvas_png.width = Math.abs(parseInt(coor_array[coor_array.length-2]) - parseInt(coor_array[0]));
        // canvas_png.height = Math.abs(parseInt(coor_array[coor_array.length-1]) - parseInt(coor_array[1]));

        var i = new Image();
        var sWidth;
        var sHeight;

        i.onload = function () {
            sWidth = i.width;
            sHeight = i.height;
        };

        i.src = canvas_url;

        var image = new Image();
        image.onload = function () {
            sWidth = Math.abs(parseInt(coor_array[coor_array.length - 2]) - parseInt(coor_array[0]));
            sHeight = Math.abs(parseInt(coor_array[coor_array.length - 1]) - parseInt(coor_array[1]));

            localStorage.setItem("_sw", sWidth);
            localStorage.setItem("_sh", sHeight);

            // ctx.translate(sWidth,sHeight);
            ctx.translate(785, 785);
            ctx.rotate(Math.PI);

            // ctx.drawImage(image, start_x, start_y, sWidth, sHeight, 0, 0, sWidth, sHeight);
            ctx.drawImage(image, start_x, start_y, sWidth, sHeight, 0, 0, 785, 785);

            resize_url = canvas_png.toDataURL('image/png');
            localStorage.setItem("resize_img", resize_url);
        };
        image.src = canvas_url;
        canvas_png.setAttribute('style', 'transform:rotate(180deg)');
        canvas_png.style.display = "none";
    })
}

function set_wall_time_slider(min_year_val, max_year_val) {
    $("#wall_time").slider({
        min: 1,
        max: (parseInt(max_year_val) - parseInt(min_year_val) + 1) * 12,
        range: true,
        values: [1, (parseInt(max_year_val) - parseInt(min_year_val) + 1) * 12],
        create: function (e, ui) {
            var style = { "width": "20px", "text-align": "center" };
            $(this).find(".ui-slider-handle").css(style);
        },
        slide: function (e, ui) {
            if (cluster_layer_wall != null) {
                maps[0].removeLayer(cluster_layer_wall);
                cluster_layer_wall = null;
            }

            ts = get_start_time(min_year_val, ui.values[0]);
            te = get_end_time(min_year_val, ui.values[1]);

            start_time = ts.split('/')[0] + '-' + ts.split('/')[1] + '-' + '0';
            end_time = te.split('/')[0] + '-' + te.split('/')[1] + '-' + '32';

            // console.log('start time');
            // console.log(start_time);
            // console.log('end time');
            // console.log(start_time);

            cluster_layer_wall = create_cluster_wall(wall_tmp_xml, start_time, end_time);

            let source = cluster_layer_wall.getSource();
            if (show_wall_flag == 1) {
                source.setDistance(40);
            }
            else {
                source.setDistance(0);
            }

            maps[0].addLayer(cluster_layer_wall);

            $("#wall_time_L").html(ts);
            $("#wall_time_H").html(te);
        }
    });
}

function search_wall() {
    fun_access_log("Func_Use_Data_1_4");
    clear_map();
    select_earthquake_or_wall = 2;

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "php/wall.php",
        data: {
            x1: $('#Search_wall_In_drawbox_LU_X').val(),
            x2: $('#Search_wall_In_drawbox_RD_X').val(),
            y1: $('#Search_wall_In_drawbox_LU_Y').val(),
            y2: $('#Search_wall_In_drawbox_RD_Y').val(),
        },
        success: function (response) {
            if (response.length == 0) {
                console.log('no wall data!')
                return
            }
            else {
                search_option = 2;
                // console.log($('#Search_wall_In_drawbox_LU_X').val());
                // console.log($('#Search_wall_In_drawbox_RD_X').val());
                // console.log($('#Search_wall_In_drawbox_LU_Y').val());
                // console.log($('#Search_wall_In_drawbox_RD_Y').val());

                console.log(response.features);
                if (cluster_layer_wall != null) {
                    maps[0].removeLayer(cluster_layer_wall);
                }
                document.getElementById('show_wall_cluster_btn').disabled = false;
                $("#show_earthquake_cluster_btn").val("隱藏叢集");
                $("#show_wall_cluster_btn").val("隱藏叢集");
                show_cluster_flag = 1;
                show_wall_flag = 1;

                wall_data_from = $('#wall_date_from').val();
                wall_data_to = $('#wall_date_to').val();

                // console.log('wall_data_from : ', wall_data_from)
                // console.log('wall_data_to : ', wall_data_to)

                let wall_min_year = 10000, wall_max_year = 0;
                for (let i = 0; i < response.features.length; ++i) {
                    if (parseInt(response.features[i].properties['MEASUREDATE'].split('-')[0]) < 1900) {
                        continue;
                    }
                    if (parseInt(response.features[i].properties['MEASUREDATE'].split('-')[0]) < parseInt(wall_data_from) || parseInt(response.features[i].properties['MEASUREDATE'].split('-')[0]) > parseInt(wall_data_to)) {
                        continue;
                    }
                    // console.log('year : ', parseInt(response.features[i].properties['MEASUREDATE'].split('-')[0]));
                    if (parseInt(response.features[i].properties['MEASUREDATE'].split('-')[0]) >= wall_max_year) {
                        wall_max_year = parseInt(response.features[i].properties['MEASUREDATE'].split('-')[0]);
                    }
                    if (parseInt(response.features[i].properties['MEASUREDATE'].split('-')[0]) <= wall_min_year) {
                        wall_min_year = parseInt(response.features[i].properties['MEASUREDATE'].split('-')[0]);
                        // console.log('i = ', i, wall_min_year);
                    }
                }
                $("#wall_time_L").html(wall_min_year + '/1');
                $("#wall_time_H").html(wall_max_year + '/12');
                document.getElementById('wall_slider_time').style.display = 'block';
                document.getElementById('wall_time').style.display = 'block';


                set_wall_time_slider(wall_min_year, wall_max_year);
                wall_tmp_xml = response;
                cluster_layer_wall = create_cluster_wall(response, wall_data_from, wall_data_to);
                cluster_layer_wall.setZIndex(100000);

                maps[0].addLayer(cluster_layer_wall);
                maps[0].on('click', add_wall_cluster_click_event);
            }
        },
        error: function (jqXHR) {
            alert("error " + jqXHR.status);
        }
    });
}


let wall_tmp_xml = null;
var tmp_wall_feature = null;
var tmp_wall_data = null;
var cluster_layer_wall = null;
function create_cluster_wall(wall_data, wall_data_from, wall_data_to) {
    tmp_wall_data = wall_data;
    let wall_data_len = wall_data.features.length;
    var features = new Array();

    from_year = parseInt(wall_data_from.split('-')[0]);
    from_month = parseInt(wall_data_from.split('-')[1]);
    from_date = parseInt(wall_data_from.split('-')[2]);
    to_year = parseInt(wall_data_to.split('-')[0]);
    to_month = parseInt(wall_data_to.split('-')[1]);
    to_date = parseInt(wall_data_to.split('-')[2]);

    let add_wall_data = 0;

    for (let i = 0; i < wall_data_len; ++i) {
        add_wall_data = 0;
        wall_year = parseInt(wall_data.features[i].properties['MEASUREDATE'].split('-')[0]);
        wall_month = parseInt(wall_data.features[i].properties['MEASUREDATE'].split('-')[1]);
        wall_date = parseInt(wall_data.features[i].properties['MEASUREDATE'].split('-')[2]);

        // if(wall_year < 1900){
        //     continue
        // }

        if (wall_year > from_year && wall_year < to_year) {
            add_wall_data = 1;
        }
        else if (wall_year == from_year && wall_year == to_year) {
            if (wall_month > from_month && wall_month < to_month) {
                add_wall_data = 1;
            }
            else if (wall_month == from_month && wall_month == to_month) {
                if (wall_date >= from_date && wall_date <= to_date) {
                    add_wall_data = 1;
                }
                else {
                    add_wall_data = 0;
                }
            }
            else if (wall_month == from_month) {
                if (wall_date >= from_date) {
                    add_wall_data = 1;
                }
                else {
                    add_wall_data = 0;
                }
            }
            else if (wall_month == to_month) {
                if (wall_date <= from_date) {
                    add_wall_data = 1;
                }
                else {
                    add_wall_data = 0;
                }
            }
            else {
                add_wall_data = 0;
            }
        }
        else if (wall_year == from_year) {
            if (wall_month > from_month) {
                add_wall_data = 1;
            }
            else if (wall_month == from_month) {
                if (wall_date >= from_date) {
                    add_wall_data = 1;
                }
                else {
                    add_wall_data = 0;
                }
            }
            else {
                add_wall_data = 0;
            }
        }
        else if (wall_year == to_year) {
            if (wall_month < to_month) {
                add_wall_data = 1;
            }
            else if (wall_month == to_month) {
                if (wall_date <= to_date) {
                    add_wall_data = 1;
                }
                else {
                    add_wall_data = 0;
                }
            }
            else {
                add_wall_data = 0;
            }
        }

        if (add_wall_data == 0) {
            continue;
        }
        // console.log(wall_data.features[i].properties['MEASUREDATE']);
        // console.log('*******************************************');
        // console.log(JSON.stringify(wall_data.features[i].properties['DETAIL']))
        // console.log(typeof(JSON.stringify(wall_data.features[i].properties['DETAIL'])))
        // console.log(typeof(wall_data.features[i].properties['DETAIL']))
        // console.log('*******************************************');


        let coordinates = ol.proj.transform([parseFloat(wall_data.features[i].geometry['coordinates'][0]), parseFloat(wall_data.features[i].geometry['coordinates'][1])], 'EPSG:4326', 'EPSG:3857');
        features.push(new ol.Feature({
            id: wall_data.features[i].properties['HOLE_POINT_NO'],
            no: wall_data.features[i].properties['PROJECT_NO'],
            lat: wall_data.features[i].geometry['coordinates'][1],
            lon: wall_data.features[i].geometry['coordinates'][0],
            elevation: wall_data.features[i].properties['ELEVATION'],
            depth: wall_data.features[i].properties['DEPTH'],
            water_table_depth: wall_data.features[i].properties['WATER_TABLE_DEPTH'],
            time: wall_data.features[i].properties['MEASUREDATE'],
            name: wall_data.features[i].properties['PROJECT_NAME'],
            party_exe: wall_data.features[i].properties['PARTY_EXECUTE'],
            party_org: wall_data.features[i].properties['PARTY_ORGANIZE'],
            detail: wall_data.features[i].properties['DETAIL'],
            // destination : wall_data.features[i].properties['WATER_TABLE_DEPTH'],
            geometry: new ol.geom.Point(coordinates)
        }));
        tmp_wall_feature = features;
    }

    var source = new ol.source.Vector({
        features: features
    });

    var distance = 40;
    var clusterSource = new ol.source.Cluster({
        distance: parseInt(distance, 10),
        source: source
    });

    var styleCache = {};
    var clusters = new ol.layer.Vector({
        source: clusterSource,
        style: function (feature) {
            var size = feature.get('features').length;
            var style = styleCache[size];
            if (show_wall_flag == 1) {
                style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: size + 5,
                        stroke: wallStroke,
                        fill: wallFill
                    }),
                    text: new ol.style.Text({
                        text: size.toString(),
                        stroke: textStroke,
                        fill: textFill
                    })
                });
                styleCache[size] = style;
                return style;
            }
            else {
                var size = feature.get('features').length;
                style = new ol.style.Style({
                    geometry: feature.getGeometry(),
                    image: new ol.style.Circle({
                        radius: size + 5,
                        // points: 100,
                        // angle: Math.PI,
                        fill: wallFill,
                        stroke: wallStroke
                    }),
                    text: new ol.style.Text({
                        text: "1",
                        fill: textFill,
                        stroke: textStroke
                    })
                });
                styleCache[size] = style;
                return style;
            }
        }
    });
    return clusters;
}

function createWallStyle(feature) {
    return new ol.style.Style({
        geometry: feature.getGeometry(),
        image: new ol.style.Circle({
            radius: 6,
            // points: 100,
            // angle: Math.PI,
            stroke: wallStroke,
            fill: wallFill
        }),
        text: new ol.style.Text({
            text: "1",
            fill: textFill,
            stroke: textStroke
        })
    });
}

var show_wall_flag = 1;
function change_wall_cluster(layer, $btn) {
    if ($btn.val() == "隱藏叢集") {
        $btn.val("顯示叢集");
        show_cluster_flag = 0;
        show_wall_flag = 0;
        let source = layer.getSource();
        let features = source.getFeatures();
        source.setDistance(0);
        cluster = null;
        layer.getSource().forEachFeature(function (feature) {
            let current_features = feature.get('features');
            for (let i = 0; i < current_features.length; ++i) {
                style = new ol.style.Style({
                    geometry: feature.getGeometry(),
                    image: new ol.style.Circle({
                        radius: 6,
                        // points: 100,
                        // angle: Math.PI,
                        fill: wallFill,
                        stroke: wallStroke
                    }),
                    text: new ol.style.Text({
                        text: "1",
                        fill: textFill,
                        stroke: textStroke
                    })
                });
                feature.setStyle(style);
            }
        });
    }
    else {
        show_cluster_flag = 1;
        show_wall_flag = 1;
        let wall_source = layer.getSource();
        if (wall_source instanceof ol.source.Cluster) {
            wall_source.setDistance(40);
        }
        $btn.val("隱藏叢集");
    }
}



// 土石流 sdf 模式模擬
let dem_arr = []
let curr_pic_Layer;
let mssrc_arr = [];
let curr_mssrc_layer;

let dem_source;
let dem_vector;
let dem_region = "";
let dem_modifyInteraction;
let mssrc_source;
let mssrc_vector;
let mssrc_region = "";
let mssrc_modifyInteraction;

let dem_area;
let mssrc_area;

let avg_lat_dem = 0;
let avg_lng_dem = 0;
let avg_lat_mssrc = 0;
let avg_lng_mssrc = 0;
let mid_lat = 0;
let mid_lng = 0;

//let area_limit = 15.0;

let pic_Layer;
let change_img = 0;
let n = 0;

let soil_data;
let soil_zip_link_arr = [];

let co_1, co_2;

let west = 0;
let east = 0;
let north = 0;
let south = 0;
let old_pic;

let json_url = "";
let json_pic = "";
let json_kml = "";
let json_legend = "";
let json_index = 0;
let json_count = 0;

let json_length = 0;
let soil_url = '';

let soil_result = new Array();
let soil_select_opt = -1;
let current_data = null;
let soil_tid = null;
let pic_width = 0, pic_height = 0;
let debrisflow_array = new Array();
let debrisflow_url = new Array();
let soil_counter = 0;
let soil_total_num = 0;

let compute_state = 0;
// let soil_time_counter = 1;
let soil_locate = 0;

//清除原本的土石流分析區域
function clear_dem() {
    $("#dem_poly_button").off('click');
    soil_url = "";
    if (dem_vector) {
        maps[map_ind].removeLayer(dem_vector);
        dem_vector = "";
        dem_source = "";
    }
}

function clear_mssrc() {
    $("#mssrc_poly_button").off('click');
    soil_url = "";
    if (mssrc_vector) {
        maps[map_ind].removeLayer(mssrc_vector);
        mssrc_vector = "";
        mssrc_source = "";
    }

}

//清除所選的區域
function clear_dem_region() {
    change_img = 0;
    if (old_pic) {
        maps[map_ind].removeLayer(old_pic);
    }
    if (pic_Layer) {
        maps[map_ind].removeLayer(pic_Layer);
    }
    clear_map();
    dem_region = "";
    dem_area = 0;
    north = 0;
    west = 0;
    east = 0;
    south = 0;
    json_index = 0;
    json_count = 0;
    pic_height = 0;
    pic_width = 0;
    json_pic = "";
}

function clear_mssrc_region() {
    change_img = 0;
    if (old_pic) {
        maps[map_ind].removeLayer(old_pic);
    }
    if (pic_Layer) {
        maps[map_ind].removeLayer(pic_Layer);
    }
    clear_map2();
    mssrc_region = "";
    mssrc_area = 0;
    north = 0;
    west = 0;
    east = 0;
    south = 0;
    json_index = 0;
    json_count = 0;
    pic_height = 0;
    pic_width = 0;
    json_pic = "";
}


//畫出選取範圍
function dem_getPoly() {
    if (compute_state == 1) {
        return;
    }

    document.getElementById("space_lonlat").checked = true;

    clear_dem_region(); // clear the selected region

    createMeasureTooltip();

    // create box
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
    value = 'Polygon';
    var maxPoints;
    draw_box = new ol.interaction.Draw({
        source: source_box,
        type: /** @type {ol.geom.GeometryType} */ (value),
        maxPoints: maxPoints
    });

    vector_box.setZIndex(draw_box_zindex);
    maps[map_ind].addInteraction(draw_box);

    // create listener for start drawing
    draw_box.on('drawstart',
        function (evt) {

            btn_disable();

            sketch = evt.feature;

            var tooltipCoord = evt.coordinate;
            // listener for mouse event(changing the position)
            listener = sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output;
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
                // convert the coordinate
                var sourceProj = maps[map_ind].getView().getProjection();
                var geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
                var coordinates = geom_t.getLinearRing(0).getCoordinates();
                dem_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));

                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        }, this);

    // listener for the end of drawing
    draw_box.on('drawend',
        function (e) {
            clear_map();

            coor = e.feature.getGeometry().getCoordinates()[0];

            //dem_region = "dem_region="

            var coor_00;  // start point

            for (var i = 0; i < coor.length; i++) {
                // convert the coordinate
                var coor_84 = ol.proj.transform([coor[i][0], coor[i][1]], 'EPSG:3857', 'EPSG:4326');

                if (i == 0)  // start point
                    coor_00 = coor_84;

                dem_region = dem_region + coor_84[0] + "," + coor_84[1] + ";";
                console.log(dem_region);

                avg_lng_dem = avg_lng_dem + coor_84[0];
                avg_lat_dem = avg_lat_dem + coor_84[1];

                console.log(coor_84);

            }
            avg_lat_dem /= coor.length;
            avg_lng_dem /= coor.length;
            dem_region = dem_region + coor_00[0] + "," + coor_00[1];
            maps[map_ind].removeInteraction(draw_box);

            btn_enable();

        }, this);
    //Layer_Grid_OnCheck(ch_lay_root_name,ch_id,0,document.getElementById(ch_id).checked);	
}

function mssrc_getPoly() {
    if (compute_state == 1) {
        return;
    }

    document.getElementById("space_lonlat").checked = true;

    clear_mssrc_region(); // clear the selected region

    createMeasureTooltip();

    // create box
    source_box_2 = new ol.source.Vector({ wrapX: false });
    vector_box_2 = new ol.layer.Vector({
        source: source_box_2,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#fa3a2f',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#fa3a2f'
                })
            })
        })
    });

    maps[map_ind].addLayer(vector_box_2);
    value = 'Polygon';
    var maxPoints_2;
    draw_box_2 = new ol.interaction.Draw({
        source: source_box_2,
        type: /** @type {ol.geom.GeometryType} */ (value),
        maxPoints_2: maxPoints_2
    });

    vector_box_2.setZIndex(draw_box_zindex_2);
    maps[map_ind].addInteraction(draw_box_2);

    // create listener for start drawing
    draw_box_2.on('drawstart',
        function (evt) {

            btn_disable();

            sketch = evt.feature;

            var tooltipCoord = evt.coordinate;
            // listener for mouse event(changing the position)
            listener = sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output;
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
                // convert the coordinate
                var sourceProj = maps[map_ind].getView().getProjection();
                var geom_t = /** @type {ol.geom.Polygon} */(geom.clone().transform(sourceProj, 'EPSG:4326'));
                var coordinates = geom_t.getLinearRing(0).getCoordinates();
                mssrc_area = Math.abs(wgs84Sphere.geodesicArea(coordinates));

                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        }, this);

    // listener for the end of drawing
    draw_box_2.on('drawend',
        function (e) {
            clear_map2();

            coor = e.feature.getGeometry().getCoordinates()[0];

            //mssrc_region = "&mssrc_region="

            var coor_00;  // start point

            for (var i = 0; i < coor.length; i++) {
                // convert the coordinate
                var coor_84 = ol.proj.transform([coor[i][0], coor[i][1]], 'EPSG:3857', 'EPSG:4326');

                if (i == 0)  // start point
                    coor_00 = coor_84;

                mssrc_region = mssrc_region + coor_84[0] + "," + coor_84[1] + ";";

                avg_lng_mssrc = avg_lng_mssrc + coor_84[0];
                avg_lat_mssrc = avg_lat_mssrc + coor_84[1];
                mid_lng = mid_lng + coor[i][0];
                mid_lat = mid_lat + coor[i][1];

            }
            avg_lat_mssrc /= coor.length;
            avg_lng_mssrc /= coor.length;
            mid_lat /= coor.length;
            mid_lng /= coor.length;
            mssrc_region = mssrc_region + coor_00[0] + "," + coor_00[1];

            maps[map_ind].removeInteraction(draw_box_2);

            btn_enable();

        }, this);
    //Layer_Grid_OnCheck(ch_lay_root_name,ch_id,0,document.getElementById(ch_id).checked);
}

// 傳送資料給後端抓取圖片
function dem_getKml() {
    disable_search();

    alert("任務參數確認中，請稍後...");

    const mssrcdepth_value = document.getElementById("MSSRC_Depth");
    const vs_value = document.getElementById("vs");
    const cv_value = document.getElementById("cv");
    const dt_value = document.getElementById("dt");
    const savedt_value = document.getElementById("save_dt");
    const plotdt_value = document.getElementById("plot_dt");
    const maxdepth_value = document.getElementById("plot_MaxDepth");
    var mssrc_depth = mssrcdepth_value.value;
    var viscosity_coef = vs_value.value;
    var volume_concentration = cv_value.value;
    var compute_dt = dt_value.value;
    var save_dt = savedt_value.value;
    var plot_dt = plotdt_value.value;
    var plot_maxdepth = maxdepth_value.value;
    var output_image = 1;
    let compute_name = document.getElementById("compute_name").value;

    console.log("dem_region:", dem_region);
    console.log("mssrc_region", mssrc_region);
    console.log('compute_name', compute_name)

    if (dem_area / 1000000 <= area_limit && mssrc_area <= dem_area) {
        btn_disable();

        //loading_id = "l"+soil_num.toString();
        //console.log(loading_id);	
        //draw_soil_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');

        //draw_soil_Tree.enableCheckBoxes(false, false);

        //var return_val=0;
        //var return_count=1;
        //while(return_val==0){

        console.log("user_id:", Login_ID);
        console.log("user_name:", Login_Name);
        console.log("dem_region:", dem_region);
        console.log("mssrc_region:", mssrc_region);
        console.log("mssrc_depth:", mssrc_depth);
        console.log("viscosity_coef:", viscosity_coef);
        console.log("volume_concentration:", volume_concentration);
        console.log("compute_dt:", compute_dt);
        console.log("save_dt:", save_dt);
        console.log("plot_dt:", plot_dt);
        console.log("plot_maxdepth:", plot_maxdepth);
        console.log("output_image:", output_image);
        $.ajax({
            type: "GET",
            url: "php/debrisflow.php",
            dataType: "json",
            data: {
                user_id: Login_ID,
                dem_region: dem_region,
                mssrc_region: mssrc_region,
                mssrc_depth: mssrc_depth,
                viscosity_coef: viscosity_coef,
                volume_concentration: volume_concentration,
                compute_dt: compute_dt,

                plot_maxdepth: plot_maxdepth,
                output_image: output_image,
                compute_name: compute_name
            },
            //jsonpCallback: 'callback',
            success: function (response) {
                // upload image
                //alert("任務完成送出，您任務運算中，完成後寄信通知您，等待此任務完成運算，才可再送出新任務");
                console.log(response);
                check_search();
            },
            error: function (jqXHR) {
                alert("error " + jqXHR.status);
                btn_enable();
                enable_search();
            }
        });
    }
    else if (dem_region == "") {
        soil_url = "dem_region_empty";
        enable_search();
    }
    else if (mssrc_region == "") {
        soil_url = "mssrc_region_empty";
        enable_search();
    }
    else if (mssrc_area > dem_area) {
        soil_url = "mssrc_over_dem";
        enable_search();
    }
    else {
        soil_url = "over";
    }

    if (soil_url != "over" && soil_url != "mssrc_region_empty" && soil_url != "dem_region_empty" && soil_url != "mssrc_over_dem") {
        change_img = 1;
    }
    else if (soil_url == "over") {
        alert("選取範圍大於 15 平方公里")
        clear_dem_region();
    }
    else if (soil_url == "dem_region_empty") {
        alert("尚未設定選擇區域")
        clear_dem_region();
        enable_search();
    }
    else if (soil_url == "mssrc_region_empty") {
        alert("尚未設定指定研究區域內發生崩塌範圍")
        clear_mssrc_region();
        enable_search();
    }
    else if (soil_url == "mssrc_over_dem") {
        alert("指定研究區域內發生崩塌範圍大於選取範圍")
        soil_url == "";
        clear_mssrc_region();
        enable_search();
    }

    check_search();

}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function get_compute_result() {
    console.log('get_result click!!');

    if (Login_ID == '' || Login_Name == '') {
        disable_search();
        compute_state = 1;
    }
    else {
        enable_search();
        compute_state = 0;
    }

    $.ajax({
        type: "GET",
        url: "php/GetComputeResult.php",
        dataType: 'json',
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                if (response[i]['ComputeId'] == 679 || response[i]['ComputeId'] == 723 || response[i]['ComputeId'] == 724) {
                    readTextFile(response[i]['results'], function (text) {
                        var data = JSON.parse(text);
                        data['id'] = response[i]['ComputeId'];
                        soil_result.push(data);
                    });
                }
            }
        },
        error: function (jqXHR) {
            console.log("GetComputResult error " + jqXHR.status);
        }
    });

    $.ajax({
        type: "GET",
        url: "php/GetUserComputeResult.php",
        dataType: 'json',
        data: {
            user_id: Login_ID
        },
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                if (response[i]['ExecuteStatus'] == 'Q' || response[i]['ExecuteStatus'] == 'P' || response[i]['ExecuteStatus'] == 'N') {
                    disable_search();
                    compute_state = 1;
                }
                if (response[i]['ExecuteStatus'] == 'S') {
                    readTextFile(response[i]['results'], function (text) {
                        var data = JSON.parse(text);
                        data['id'] = response[i]['ComputeId'];
                        soil_result.push(data);
                        document.getElementById('soil_list').add(new Option(response[i]['ComputeName'], response[i]['ComputeId']));
                        // console.log(data);
                    });
                }
            }
        },
        error: function (jqXHR) {
            console.log("GetComputResult error " + jqXHR.status);
        }
    });
    get_select_opt();
    soil_counter = 1;
    // soil_time_counter = 1;
}

function enable_search() {
    document.getElementById("soil_data_select_list").disabled = false;
    document.getElementById("MSSRC_Depth").disabled = false;
    document.getElementById("vs").disabled = false;
    document.getElementById("cv").disabled = false;
    document.getElementById("dt").disabled = false;
    document.getElementById("save_dt").disabled = false;
    document.getElementById("plot_dt").disabled = false;
    document.getElementById("plot_MaxDepth").disabled = false;
    document.getElementById("soil_done").disabled = false;
    document.getElementById("compute_name").disabled = false;
}

function disable_search() {
    document.getElementById("soil_data_select_list").disabled = true;
    document.getElementById("MSSRC_Depth").disabled = true;
    document.getElementById("vs").disabled = true;
    document.getElementById("cv").disabled = true;
    document.getElementById("dt").disabled = true;
    document.getElementById("save_dt").disabled = true;
    document.getElementById("plot_dt").disabled = true;
    document.getElementById("plot_MaxDepth").disabled = true;
    document.getElementById("soil_done").disabled = true;
    document.getElementById("compute_name").disabled = true;
}

function check_search() {
    if (Login_ID == '' || Login_Name == '') {
        disable_search();
        compute_state = 1;
    }
    else {
        enable_search();
        compute_state = 0;
    }

    $.ajax({
        type: "GET",
        url: "php/GetUserComputeResult.php",
        dataType: 'json',
        data: {
            user_id: Login_ID
        },
        success: function (response) {
            // console.log(response)

            for (let i = 0; i < response.length; i++) {
                if (response[i]['ExecuteStatus'] == 'Q' || response[i]['ExecuteStatus'] == 'P' || response[i]['ExecuteStatus'] == 'N') {
                    disable_search();
                    compute_state = 1;
                }
            }
        },
        error: function (jqXHR) {
            console.log("GetComputResult error " + jqXHR.status);
        }
    });
}


function soil_start() {
    console.log('soil start click!!');

    if (soil_select_opt == -1) {
        return;
    }
    sample_size = parseInt(document.getElementById("soil_sample").value);

    play_speed = parseFloat(1000 / parseFloat(document.getElementById("soil_speed").value));
    prepare_framesize = parseInt(document.getElementById("soil_speed").value);
    if (prepare_framesize < 2) {
        prepare_framesize = 2;
    }

    for (let i = 0; i < soil_result.length; i++) {
        // console.log(i);
        if (soil_result[i]['id'] == soil_select_opt) {
            // console.log(soil_result[i]['id'], soil_select_opt);
            current_data = soil_result[i];
            soil_total_num = current_data['progress'].length / 2;
            break
        }
    }

    console.log('==================', sample_size, ' frames - ', play_speed, 'ms =========================');
    console.log('soil total size: ', soil_total_num);

    if (soil_tid == null) {
        soil_tid = setInterval(function () {
            if (soil_counter > soil_total_num) {
                clearInterval(soil_tid);
                document.getElementById("soil_Bar").style.width = 100 + "%";

            }
            if (soil_counter <= soil_total_num) {
                add_debrisflow_layer(soil_counter, current_data);
                // document.getElementById("soil_Bar_time").innerHTML = parseFloat(soil_time_counter*(play_speed/1000)).toFixed(1);

                console.log('soil_counter : ', soil_counter);
                console.log('total_num : ', soil_total_num);
                console.log('sample_size : ', sample_size);
                console.log('play_speed : ', play_speed);
                console.log('prepare_framesize : ', prepare_framesize);
                console.log('image array len : ', debrisflow_array.length);
                soil_counter = soil_counter + sample_size;

                let achieve_percentage = soil_counter / soil_total_num;
                if (achieve_percentage >= 1) {
                    achieve_percentage = 1;
                }
                document.getElementById("soil_Bar").style.width = achieve_percentage * 100 + "%";
                if (soil_counter - 1 >= soil_total_num) {
                    document.getElementById("soil_Bar_time").innerHTML = soil_total_num;
                }
                else {
                    document.getElementById("soil_Bar_time").innerHTML = soil_counter - 1;
                }
                // soil_time_counter = soil_time_counter+1;
            }
        }, play_speed)
    }

}


function get_select_opt() {
    let sel = document.getElementById("soil_list");
    let sel_text = sel.options[sel.selectedIndex].text;
    soil_select_opt = sel.value;
    // if(soil_select_opt == '20210807盧碧颱風玉穗溪集水區土石流模擬'){
    //     soil_select_opt = 679;
    // }
    soil_reset();
    for (let i = 0; i < soil_result.length; i++) {
        // console.log(i);
        if (soil_result[i]['id'] == soil_select_opt) {
            current_data = soil_result[i];
            url = soil_result[i]['progress'][0].replace("Z:\\", "https://storage.geodac.tw/");
            document.getElementById("soil_legend").src = url.split('.jpg')[0] + '_Legend.jpg';
            break
        }
    }

    if (current_data != null) {
        console.log(current_data)
        url = current_data['progress'][0].replace("Z:\\", "https://storage.geodac.tw/");
        kml = current_data['progress'][0].replace("jpg", "kml");
        kml = kml.replace("Z:\\", "https://storage.geodac.tw/");

        var x = new XMLHttpRequest();
        x.open("GET", kml, true);

        let north = 0, south = 0, west = 0, east = 0;

        x.onreadystatechange = function () {
            if (x.readyState == 4 && x.status == 200) {
                let doc = x.responseXML;
                north = doc.getElementsByTagName("Document")[0].getElementsByTagName("Region")[0].getElementsByTagName("LatLonAltBox")[0].getElementsByTagName("north")[0].firstChild.nodeValue;
                west = doc.getElementsByTagName("Document")[0].getElementsByTagName("Region")[0].getElementsByTagName("LatLonAltBox")[0].getElementsByTagName("west")[0].firstChild.nodeValue;
                south = doc.getElementsByTagName("Document")[0].getElementsByTagName("Region")[0].getElementsByTagName("LatLonAltBox")[0].getElementsByTagName("south")[0].firstChild.nodeValue;
                east = doc.getElementsByTagName("Document")[0].getElementsByTagName("Region")[0].getElementsByTagName("LatLonAltBox")[0].getElementsByTagName("east")[0].firstChild.nodeValue;
                console.log("north:", north, "\nsouth:", south, "\nwest:", west, "\neast:", east);
                if (soil_locate == 0) {
                    Locate(north, west, 12);
                    soil_locate = 1;
                }
            }
        };

        x.send(null);
    }

}

function soil_stop() {
    console.log('soil stop click!!');
    clearInterval(soil_tid);
    soil_tid = null;
}

function soil_reset() {
    console.log('soil reset click!!');
    document.getElementById("soil_Bar_time").innerHTML = 1;
    document.getElementById("soil_Bar").style.width = 0 + "%";
    document.getElementById("soil_sample").value = 1;
    document.getElementById("soil_speed").value = 2;
    clearInterval(soil_tid);
    soil_tid = null;
    if (current_data != null) {
        for (let i = 0; i < debrisflow_array.length; i++) {
            maps[map_ind].removeLayer(debrisflow_array[i]);

            if (map_ind == 1) {
                for (let j = 0; j < imageryLayers_url_3DCesium.length; j++) {
                    if (imageryLayers_url_3DCesium[j] != null && imageryLayers_url_3DCesium[j].indexOf(debrisflow_url[i]) != -1) {
                        console.log('reset url :', debrisflow_url[i])
                        viewer.imageryLayers.remove(viewer.imageryLayers.get(j));

                        imageryLayers_url_3DCesium.splice(j, 1);
                        break;
                    }
                }
            }
        }
    }
    current_data = null;
    soil_counter = 1;
    debrisflow_array = new Array();
    debrisflow_url = new Array();
    // soil_time_counter = 1;
    soil_locate = 0;
}

function add_debrisflow_layer(current_counter, data) {
    current_counter = current_counter - 1;
    // let achieve_percentage = current_counter / soil_total_num;

    // document.getElementById("soil_Bar").style.width = achieve_percentage*100 + "%";
    // document.getElementById("Bar").innerHTML = parseFloat(achieve_percentage*100).toFixed(1) + "%";

    url = data['progress'][current_counter].replace("Z:\\", "https://storage.geodac.tw/");
    kml = data['progress'][current_counter].replace("jpg", "kml");
    kml = kml.replace("Z:\\", "https://storage.geodac.tw/");

    if (pic_width == 0 || pic_height == 0) {
        let img = new Image();
        img.src = url;
        img.onload = function () {
            pic_width = img.width;
            pic_height = img.height;
        };
        pic_width = img.width;
        pic_height = img.height;
    }
    console.log('width:', pic_width, ', height:', pic_height);
    var x = new XMLHttpRequest();
    x.open("GET", kml, true);

    let north = 0, south = 0, west = 0, east = 0;

    x.onreadystatechange = function () {
        if (x.readyState == 4 && x.status == 200) {
            let doc = x.responseXML;
            north = doc.getElementsByTagName("Document")[0].getElementsByTagName("Region")[0].getElementsByTagName("LatLonAltBox")[0].getElementsByTagName("north")[0].firstChild.nodeValue;
            west = doc.getElementsByTagName("Document")[0].getElementsByTagName("Region")[0].getElementsByTagName("LatLonAltBox")[0].getElementsByTagName("west")[0].firstChild.nodeValue;
            south = doc.getElementsByTagName("Document")[0].getElementsByTagName("Region")[0].getElementsByTagName("LatLonAltBox")[0].getElementsByTagName("south")[0].firstChild.nodeValue;
            east = doc.getElementsByTagName("Document")[0].getElementsByTagName("Region")[0].getElementsByTagName("LatLonAltBox")[0].getElementsByTagName("east")[0].firstChild.nodeValue;
            console.log("north:", north, "\nsouth:", south, "\nwest:", west, "\neast:", east);
            // console.log('add =======> https://storage.geodac.tw/Tile/Mode/HECRAS/00001/20190917_121208058_024685844_13_'+num+'_Mode_HECRAS/')
            debrisflow_map(pic_width, pic_height, url, west, south, east, north)
            if (soil_locate == 0) {
                Locate(north, west, 12);
                soil_locate = 1;
            }
        }
    };

    x.send(null);
    // MapOverlay2(1, debrisflow_layer_content, 0);
    // MapTiles2(1, debrisflow_layer_content, 0);

    if (current_counter - prepare_framesize * sample_size > 0) {
        prev_counter = current_counter - prepare_framesize * sample_size - 1;
        prev_url = data['progress'][prev_counter].replace("Z:\\", "https://storage.geodac.tw/");

        if (map_ind == 1) {
            for (var i = 0; i < imageryLayers_url_3DCesium.length; i++) {
                if (imageryLayers_url_3DCesium[i] != null && imageryLayers_url_3DCesium[i].indexOf(debrisflow_url[0]) != -1) {
                    // console.log(debrisflow_url[0])
                    viewer.imageryLayers.remove(viewer.imageryLayers.get(i));

                    imageryLayers_url_3DCesium.splice(i, 1);
                    break;
                }
            }
        }


        maps[map_ind].removeLayer(debrisflow_array[0]);
        debrisflow_array.shift();
        debrisflow_url.shift()
        console.log('remove : ', prev_counter);
        console.log('remove url : ', prev_url);

    }
}

function debrisflow_map(w, h, url, west, south, east, north) {
    debrisflow_layer_content = new ol.layer.Image({
		opacity: 0.3,
        source: new ol.source.ImageStatic({
            url: url,
            crossOrigin: 'anonymous',
            imageSize: [w, h],
            projection: maps[map_ind].getView().getProjection(),
            imageExtent: ol.extent.applyTransform([parseFloat(west), parseFloat(south), parseFloat(east), parseFloat(north)], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
        })
    });

    maps[map_ind].addLayer(debrisflow_layer_content);
    debrisflow_layer_content.setZIndex(10000);
    debrisflow_array.push(debrisflow_layer_content);
    debrisflow_url.push(url);

    if (map_ind == 1) {
        var index = viewer.imageryLayers.length;

        var imageryLayer = viewer.imageryLayers.addImageryProvider(
            new Cesium.SingleTileImageryProvider({
                url: url,
                rectangle: Cesium.Rectangle.fromDegrees(west, south, east, north),
            })
        );
        imageryLayer.alpha = 0.35;
        imageryLayers_url_3DCesium[index] = url;
    }
}







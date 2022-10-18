function createRegularPolygonCurve(origin, radius, sides, rotation,angles) {  
    var angle = Math.PI * ((1/sides) + 1/2);
        
    angle += (angles / 180) * Math.PI;
    
    var rotatedAngle, x, y;
    var points = [];
    for(var i=0; i<sides; ++i) {
        var an = i*(rotation/360);
        rotatedAngle = angle + (an * 2 * Math.PI / sides) ;
        x = origin[0] + (radius * Math.cos(rotatedAngle));
        y = origin[1] + (radius * Math.sin(rotatedAngle));
        points.push(new ol.proj.transform([x, y], 'EPSG:4326', 'EPSG:3857'));
    }
    if(rotation!=0){
        points.push(new ol.proj.transform(origin, 'EPSG:4326', 'EPSG:3857'));
    }
    var ring = new ol.geom.LinearRing(points);
    return new ol.geom.Polygon([points]);
};

var polygon_curve_source
var polygon_curve_box

function createPolygonCurve(){

    var points = $('#polygon_curve_pos').val().split(',')
    var radius = parseFloat($('#polygon_curve_radius').val()) / 100 / 1000
    var sides = 1000
    var rotation = $('#polygon_curve_rotation').val()
    var angles = $('#polygon_curve_angles').val()

    points[0] = parseFloat(points[0])
    points[1] = parseFloat(points[1])
    
    polygon_curve_source = new ol.source.Vector({wrapX: false});
    var origin_point = new ol.geom.Point(ol.proj.transform([13444661.779136218, 2700061.587145566], 'EPSG:3857', 'EPSG:4326'));
    var circle = new createRegularPolygonCurve(points,radius,sides,rotation,angles);
    var polygonFeature = new ol.Feature(circle);
    polygon_curve_source.addFeature(polygonFeature);
    polygon_curve_box = new ol.layer.Vector({ source: polygon_curve_source }); 
	polygon_curve_box.setZIndex(100);
    maps[map_ind].addLayer(polygon_curve_box);
}

function clear_polygoncurv()
{
    if (polygon_curve_box) {
        maps[map_ind].removeLayer(polygon_curve_box);
        polygon_curve_box.getSource().clear();
        polygon_curve_source.clear();
        polygon_curve_box.set('altitudeMode', 'clampToGround');
		
        maps[map_ind].addLayer(polygon_curve_box);
    }
}

function get_polygoncurv_center(){
	fun_access_log("Func_Use_Sup_1_4");
    document.getElementById("space_lonlat").checked = true;

    clear_map();
 
    createMeasureTooltip();  
 
    source_box = new ol.source.Vector({wrapX: false});

    vector_box = new ol.layer.Vector({
        source: source_box,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 255, 255, 0)',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0)'
                })
            })
        })
    });
    vector_box.set('altitudeMode', 'clampToGround');
    maps[map_ind].addLayer(vector_box);
    value = 'Point';
    maxPoints = 1;
    
    draw_box = new ol.interaction.Draw({
        source: source_box,
        type: /** @type {ol.geom.GeometryType} */ (value),
        maxPoints: maxPoints
    });
        
    maps[map_ind].addInteraction(draw_box);	
        
    draw_box.on('drawstart',
        function (evt) {

            btn_disable();	

        }, this);
        
    draw_box.on('drawend',
        function (e) {
                
            Coord = e.feature.getGeometry().getFirstCoordinate();
            array=String(Coord).split(",");
            start_84=ol.proj.transform([array[0],array[1]], 'EPSG:3857', 'EPSG:4326');
                
            $('#polygon_curve_pos').val(start_84[0].toString() + ',' + start_84[1].toString())
            fun_access_log("Func_Use_Sup_1_4");
            if ( $('#map_polygon_curve_checked').is(':checked') ) {
				
                clear_polygoncurv()
                createPolygonCurve()
            }	
            btn_enable();
            maps[map_ind].removeInteraction(draw_box);
        }, this);
 }
//後端處理資料庫存取之php
//var back_ip = "http://140.116.228.167/SWCB_PDIMS/LLGIS";
var back_ip = "https://gis.swcb.gov.tw/";
//var back_ip = "https://data.gedac.tw/";
$(document).ready(function () {

	/*************** share **************/
    //---facebook init----
    var dt;
    var time;
    var rand;

    window.fbAsyncInit = function() {
        FB.init({
            appId      : '489441061569120', //appId是先註冊好 140.116.228.167的   320240928434373
            cookie     : true,
            xfbml      : true,
            version    : 'v3.2'
        });
        FB.AppEvents.logPageView();
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    //---!facebook init----

    //點選fb share
    document.getElementById('fb_share').onclick = function() {
		fun_access_log("Func_Use_Share_1_1");
        //將id 使用時間+亂數組成
        dt = new Date();
        time = dt.getFullYear() +""+(dt.getMonth()+1) +""+ dt.getDate() +""+dt.getHours() +""+ dt.getMinutes() +""+ dt.getSeconds();
        rand = Math.floor((Math.random() * 100000) + 1);

        var sourceProj = map.getView().getProjection();
        var vectorSource;
        var features = [];
        var myTexts = [];
        if(featureOverlay){
            vectorSource = featureOverlay.getSource(); 
            vectorSource.forEachFeature(function(feature) {               
                feature.setGeometry(feature.getGeometry().clone().transform(sourceProj, 'EPSG:4326') );
                var text = feature.getStyle().getText().getText();
                var pos = getPosition(feature);
                var rotation = feature.getStyle().getText().getRotation();
                var myText = {text:text,pos:pos,rotation:rotation};
                myTexts.push(myText);
                features.push(feature);
            });                       
        }
        // measure layer
        /*
        var mVectorSource;
        if(measure){
            mVectorSource = measure.getSource();        
            mVectorSource.forEachFeature(function(feature){
                feature.setGeometry(feature.getGeometry().clone().transform(sourceProj, 'EPSG:4326') );
                features.push(feature);
            });
        }
        */
        var format = new ol.format.KML();
        var kml_str = format.writeFeatures(features);
        if(featureOverlay){
            vectorSource = featureOverlay.getSource(); 
            vectorSource.forEachFeature(function(feature) {
                feature.setGeometry(feature.getGeometry().clone().transform('EPSG:4326', sourceProj) );
            });                       
        }
        // measure layer
        var mVectorSource;
        if(measure){
            mVectorSource = measure.getSource();        
            mVectorSource.forEachFeature(function(feature){
                feature.setGeometry(feature.getGeometry().clone().transform('EPSG:4326', sourceProj) );
            });
        }        
        var doc = $.parseXML(kml_str);
        var objs = $(doc).find("Placemark");
		
        for(var i=0;i<Object.keys(objs).length;i++){
            //add empty iconstyle (to prevent have pin.png in google earth)
            var iconStyleLength = $(objs[i]).find("IconStyle").length;
            if(iconStyleLength==0){
                $(objs[i]).find("Style").append("<IconStyle><Icon></Icon></IconStyle>");
            }
            var textInfo = getTextInfo(myTexts,objs[i]);
            var rotation = textInfo.rotation;            
            // add text rotation
            $(objs[i]).find("Style").append("<MyRotationStyle>"+rotation+"</MyRotationStyle>");
            // add text scale
            var scale = textInfo.scale;
            var labelScaleLength = $(objs[i]).find("LabelStyle").find("scale").length;
            if(labelScaleLength==0){
                $(objs[i]).find("LabelStyle").append("<scale>"+scale+"</scale>");
            } 
        }
        var kml_s = $(doc).find("kml").prop('outerHTML');

        var url = back_ip+'/index.php?' + time + "" +rand;

        FB.ui({
            method: 'share',
            href: url ,
        }, function(response){});

        //將kml與id資訊建檔於database
        var formData = {kml_str: kml_s, type: "insert", date_str: time+ ""+ rand}
        $.ajax({
            url: back_ip+'/php/Drawer_db_connect.php',
            type: "POST",
            data: formData,
            dataType: 'jsonp',
            jsonpCallback: 'handler',
            success: function(response) {
                console.log(response);
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log(textStatus, errorThrown);
            }
        });
    };

    //點選email share
    $('#emailLink').on('click', function (event) {
		fun_access_log("Func_Use_Share_1_1");
        dt = new Date();
        time = dt.getFullYear() +""+(dt.getMonth()+1) +""+ dt.getDate() +""+dt.getHours() +""+ dt.getMinutes() +""+ dt.getSeconds();
        rand = Math.floor((Math.random() * 100000) + 1);

        var sourceProj = map.getView().getProjection();
        var vectorSource;
        var features = [];
        var myTexts = [];
        if(featureOverlay){
            vectorSource = featureOverlay.getSource(); 
            vectorSource.forEachFeature(function(feature) {               
                feature.setGeometry(feature.getGeometry().clone().transform(sourceProj, 'EPSG:4326') );
                var text = feature.getStyle().getText().getText();
                var pos = getPosition(feature);
                var rotation = feature.getStyle().getText().getRotation();
                var myText = {text:text,pos:pos,rotation:rotation};
                myTexts.push(myText);
                features.push(feature);
            });                       
        }
        // measure layer
        /*
        var mVectorSource;
        if(measure){
            mVectorSource = measure.getSource();        
            mVectorSource.forEachFeature(function(feature){
                feature.setGeometry(feature.getGeometry().clone().transform(sourceProj, 'EPSG:4326') );
                features.push(feature);
            });
        }
        */
        var format = new ol.format.KML();
        var kml_str = format.writeFeatures(features);
        if(featureOverlay){
            vectorSource = featureOverlay.getSource(); 
            vectorSource.forEachFeature(function(feature) {
                feature.setGeometry(feature.getGeometry().clone().transform('EPSG:4326', sourceProj) );
            });                       
        }
        // measure layer
        var mVectorSource;
        if(measure){
            mVectorSource = measure.getSource();        
            mVectorSource.forEachFeature(function(feature){
                feature.setGeometry(feature.getGeometry().clone().transform('EPSG:4326', sourceProj) );
            });
        }        
        var doc = $.parseXML(kml_str);
        var objs = $(doc).find("Placemark");
        for(var i=0;i<objs.size();i++){
            //add empty iconstyle (to prevent have pin.png in google earth)
            var iconStyleLength = $(objs[i]).find("IconStyle").length;
            if(iconStyleLength==0){
                $(objs[i]).find("Style").append("<IconStyle><Icon></Icon></IconStyle>");
            }
            var textInfo = getTextInfo(myTexts,objs[i]);
            var rotation = textInfo["rotation"];            
            // add text rotation
            $(objs[i]).find("Style").append("<MyRotationStyle>"+rotation+"</MyRotationStyle>");
            // add text scale
            var scale = textInfo["scale"];
            var labelScaleLength = $(objs[i]).find("LabelStyle").find("scale").length;
            if(labelScaleLength==0){
                $(objs[i]).find("LabelStyle").append("<scale>"+scale+"</scale>");
            } 
        }
        var kml_s = $(doc).find("kml").prop('outerHTML');

        var url = back_ip+'/index.php?' + time + "" +rand;
        event.preventDefault();
        var email = '';
        var subject = 'share the geo info';
        var emailBody = 'url: ' + url;
        window.location = 'mailto:' + email + '?subject=' + subject + '&body=' + emailBody;

        var formData = {kml_str: kml_s, type: "insert", date_str: time+ ""+ rand}

        //將kml與id資訊建檔於database
        $.ajax({
            url: back_ip+'/php/Drawer_db_connect.php',
            type: "POST",
            data: formData,
            dataType: 'jsonp',
            jsonpCallback: 'handler',
            success: function(response) {
                console.log(response);
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log(textStatus, errorThrown);
            }
        });

    });
    /*************** !share **************/

});
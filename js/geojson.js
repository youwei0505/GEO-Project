/***    20190218 fixed  ***/
function ToGeoUpload() {
	fun_access_log("Func_Use_Sup_1_3");
	$('#upload_togeojson_text').val($('#upload_togeojson').val().substr($('#upload_togeojson').val().lastIndexOf('\\') + 1));
}
function ConToGeo() {
	
	//## 宣告一個FormData
	var data = new FormData();
	//## 將檔案append FormData
	var files = $("#upload_togeojson").get(0).files;
	if (files.length > 0) {
        if ((files[0].size / 1024 / 1024) > 3) {
            alert("上傳檔案超過 3mb")
        } else {
            data.append("upload", files[0]);
            data.append("targetSrs", 'EPSG:4326');
            data.append("skipFailures", true);
            var geojson_show_name = files[0].name.split('.')[0]

            //## 透過ajax方式Post 至Action
            var ajaxRequest = $.ajax({
                type: "POST",
                url: 'https://3dterrain.geodac.tw:2048/convert',
                contentType: false,         // 告诉jQuery不要去這置Content-Type
                processData: false,         // 告诉jQuery不要去處理發送的數據
                data: data,
                success: function(msg){
                    feature = msg.features

                    //////////////////////20200610 clampToGround//////////////////////
                    for(var i=0;i<feature.length; i++){
                        feature[i].properties.altitudeMode = 'clampToGround';
                    }
                    //////////////////////////////////////////////////////////////////

                    console.log(feature[0].geometry)
                    
                    if (feature[0].geometry == null) {
                        alert("無法轉換的檔案格式")
                    }
                    else {
                        loading_id = "l"+geoj_num.toString();
                        
                        geojson_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
                        
                        geojson_Tree.enableCheckBoxes(false, false);
                        $.ajax({
                            type: 	"POST",
                            url:	"php/save_geojson.php",
                            dataType:	"json",
                            data: {
                                m : JSON.stringify(msg)
                            },
                            success: function(json) {
                                feature = msg.features
                                
                                if (feature[0].geometry.type == "Point") {
                                    lat = feature[0].geometry.coordinates[1]
                                    lng = feature[0].geometry.coordinates[0]
                                } else if (feature[0].geometry.type == "GeometryCollection") {
                                    if (feature[0].geometry.geometries[0].type == "Point") {
                                        lat = feature[0].geometry.geometries[0].coordinates[1]
                                        lng = feature[0].geometry.geometries[0].coordinates[0]
                                    } else if (feature[0].geometry.geometries[0].type == "LineString") {
                                        lat = feature[0].geometry.geometries[0].coordinates[0][1]
                                        lng = feature[0].geometry.geometries[0].coordinates[0][0]
                                    } else if (feature[0].geometry.geometries[0].type == "MultiPolygon") {
                                        lat = feature[0].geometry.geometries[0].coordinates[0][0][0][1]
                                        lng = feature[0].geometry.geometries[0].coordinates[0][0][0][0]
                                    } else {
                                        lat = feature[0].geometry.geometries[0].coordinates[0][0][1]
                                        lng = feature[0].geometry.geometries[0].coordinates[0][0][0]
                                    }
                                } else if (feature[0].geometry.type == "LineString") {
                                    lat = feature[0].geometry.coordinates[0][1]
                                    lng = feature[0].geometry.coordinates[0][0]
                                } else if (feature[0].geometry.type == "MultiPolygon") {
                                    lat = feature[0].geometry.coordinates[0][0][0][1]
                                    lng = feature[0].geometry.coordinates[0][0][0][0]
                                } else {
                                    lat = feature[0].geometry.coordinates[0][0][1]
                                    lng = feature[0].geometry.coordinates[0][0][0]
                                }
                                
                                console.log(lat)
                                console.log(lng)
                                
                                if (lat > 90 || lat < -90 || lng > 180 || lng < -180) {
                                    center = ol.proj.transform([lng, lat], 'EPSG:3857', 'EPSG:4326')
                                    lat = center[1]
                                    lng = center[0]
                                }
                                
                                console.log(lat)
                                console.log(lng)
                                geoj_num = geoj_num + 1;
                                    
                                new_node_id = lat + ";" + lng + ";563426;8;100;#ff0000;@JsonOverlay@" + json.geojFilePath;
                                    
                                // delete loading signal

                                geojson_Tree.deleteItem(loading_id, false);
                                geojson_Tree.enableCheckBoxes(true, true);
                                    
                                // layer item
                                
                                //geojson_Tree.insertNewChild("0", new_node_id, "geojson" + geoj_num.toString(), function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
                                geojson_Tree.insertNewChild("0", new_node_id, geojson_show_name, function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
                                
                                // Download button Default : closed
                                
                                geojson_Tree.closeItem(new_node_id);						
                            },
                            error: function(jqXHR) {
                                alert("error " + jqXHR.status);
                                geojson_Tree.deleteItem(loading_id, false);
                            }
                        });
                    }
                }
            })
            .fail(function(err) {
                alert("無法轉換的檔案格式")
                console.log(err)
            });
        }
	}
};

function ConToGeo2(){
	
	//## 宣告一個FormData
	var data = new FormData();
	//## 將檔案append FormData
	var files = $("#upload_togeojson").get(0).files;
	if (files.length > 0) {
        if ((files[0].size / 1024 / 1024) > 3) {
            alert("上傳檔案超過 3mb")
        } else {
            data.append("upload", files[0]);
            data.append("targetSrs", 'EPSG:4326');
            data.append("skipFailures", true);
            var geojson_show_name = files[0].name.split('.')[0]

            //## 透過ajax方式Post 至Action
            var ajaxRequest = $.ajax({
                type: "POST",
                url: 'https://3dterrain.geodac.tw:2048/convert',
                contentType: false,         // 告诉jQuery不要去這置Content-Type
                processData: false,         // 告诉jQuery不要去處理發送的數據
                data: data,
				async:false,
                success: function(msg){
                    feature = msg.features

                    //////////////////////20200610 clampToGround//////////////////////
                    for(var i=0;i<feature.length; i++){
                        feature[i].properties.altitudeMode = 'clampToGround';
                    }
                    //////////////////////////////////////////////////////////////////

                    console.log(feature[0].geometry)
                    
                    if (feature[0].geometry == null) {
                        alert("無法轉換的檔案格式")
                    }
                    else {
                        loading_id = "l"+geoj_num.toString();
                        
                        geojson_Tree.insertNewItem("0", loading_id, "loading...", function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
                        
                        geojson_Tree.enableCheckBoxes(false, false);
                        $.ajax({
                            type: 	"POST",
                            url:	"php/save_geojson.php",
                            dataType:	"json",
                            data: {
                                m : JSON.stringify(msg)
                            },
							async:false,
                            success: function(json) {
                                feature = msg.features
                                
                                if (feature[0].geometry.type == "Point") {
                                    lat = feature[0].geometry.coordinates[1]
                                    lng = feature[0].geometry.coordinates[0]
                                } else if (feature[0].geometry.type == "GeometryCollection") {
                                    if (feature[0].geometry.geometries[0].type == "Point") {
                                        lat = feature[0].geometry.geometries[0].coordinates[1]
                                        lng = feature[0].geometry.geometries[0].coordinates[0]
                                    } else if (feature[0].geometry.geometries[0].type == "LineString") {
                                        lat = feature[0].geometry.geometries[0].coordinates[0][1]
                                        lng = feature[0].geometry.geometries[0].coordinates[0][0]
                                    } else if (feature[0].geometry.geometries[0].type == "MultiPolygon") {
                                        lat = feature[0].geometry.geometries[0].coordinates[0][0][0][1]
                                        lng = feature[0].geometry.geometries[0].coordinates[0][0][0][0]
                                    } else {
                                        lat = feature[0].geometry.geometries[0].coordinates[0][0][1]
                                        lng = feature[0].geometry.geometries[0].coordinates[0][0][0]
                                    }
                                } else if (feature[0].geometry.type == "LineString") {
                                    lat = feature[0].geometry.coordinates[0][1]
                                    lng = feature[0].geometry.coordinates[0][0]
                                } else if (feature[0].geometry.type == "MultiPolygon") {
                                    lat = feature[0].geometry.coordinates[0][0][0][1]
                                    lng = feature[0].geometry.coordinates[0][0][0][0]
                                } else {
                                    lat = feature[0].geometry.coordinates[0][0][1]
                                    lng = feature[0].geometry.coordinates[0][0][0]
                                }
                                
                                console.log(lat)
                                console.log(lng)
                                
                                if (lat > 90 || lat < -90 || lng > 180 || lng < -180) {
                                    center = ol.proj.transform([lng, lat], 'EPSG:3857', 'EPSG:4326')
                                    lat = center[1]
                                    lng = center[0]
                                }
                                
                                console.log(lat)
                                console.log(lng)
                                geoj_num = geoj_num + 1;
                                    
                                new_node_id = lat + ";" + lng + ";563426;8;100;#ff0000;@JsonOverlay@" + json.geojFilePath;
                                    
                                // delete loading signal

                                geojson_Tree.deleteItem(loading_id, false);
                                geojson_Tree.enableCheckBoxes(true, true);
                                    
                                // layer item
                                
                                //geojson_Tree.insertNewChild("0", new_node_id, "geojson" + geoj_num.toString(), function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
                                geojson_Tree.insertNewChild("0", new_node_id, geojson_show_name, function(){}, 'blank.gif', 'folderOpen.gif', 'folderClosed.gif');
                                
                                // Download button Default : closed
                                
                                geojson_Tree.closeItem(new_node_id);
								return json.geojFilePath	
                            },
                            error: function(jqXHR) {
                                alert("error " + jqXHR.status);
                                geojson_Tree.deleteItem(loading_id, false);
                            }
                        });
                    }
                }
            })
            .fail(function(err) {
                alert("無法轉換的檔案格式")
                console.log(err)
            });
        }
	}
	
};

function DownloadGeoj() {
	
	//## 宣告一個FormData
	var data = new FormData();
	//## 將檔案append FormData
	var files = $("#upload_togeojson").get(0).files;
	if (files.length > 0) {
        if ((files[0].size / 1024 / 1024) > 3) {
            alert("上傳檔案超過 3mb")
        } else {
            data.append("upload", files[0]);
            data.append("targetSrs", 'EPSG:4326');
            data.append("skipFailures", true);
    
            var download_name = files[0].name.split('.')[0] + '.json'
            
            //## 透過ajax方式Post 至Action
            var ajaxRequest = $.ajax({
                type: "POST",
                url: 'https://3dterrain.geodac.tw:2048/convert',
                contentType: false,         // 告诉jQuery不要去這置Content-Type
                processData: false,         // 告诉jQuery不要去處理發送的數據
                data: data,
                success: function(msg){
                    //console.log(JSON.stringify(msg));
                    var file = new Blob([JSON.stringify(msg)], {type: "text/plain"});
                    if (window.navigator.msSaveOrOpenBlob) // IE10+
                        window.navigator.msSaveOrOpenBlob(file, "json.txt");
                    else { // Others
                        var a = document.createElement("a"),
                        url = URL.createObjectURL(file);
                        a.href = url;
                        a.download = download_name;
                        a.click();
                    }
                }
            })
            .fail(function(err) {
                console.log(err)
                console.log( "error");
            });
        }
	}
};

function Downloadkml() {
	
	//## 宣告一個FormData
	var data = new FormData();
	//## 將檔案append FormData
	var files = $("#upload_togeojson").get(0).files;
	if (files.length > 0) {
        if ((files[0].size / 1024 / 1024) > 3) {
            alert("上傳檔案超過 3mb")
        } else {
            data.append("upload", files[0]);
            data.append("targetSrs", 'EPSG:4326');
            data.append("skipFailures", true);
			
            var download_name = files[0].name.split('.')[0] + '.kml'
            
            //## 透過ajax方式Post 至Action
            var ajaxRequest = $.ajax({
                type: "POST",
                url: 'https://3dterrain.geodac.tw:7000/jsontokml',
                contentType: false,         // 告诉jQuery不要去這置Content-Type
                processData: false,         // 告诉jQuery不要去處理發送的數據
                data: data,
				async:false,
                success: function(msg){
                    //console.log(msg);
                    var file = new Blob([msg], {type: "text/plain"});
                    if (window.navigator.msSaveOrOpenBlob) // IE10+
                        window.navigator.msSaveOrOpenBlob(file, "kml.txt");
                    else { // Others
                        var a = document.createElement("a"),
                        url = URL.createObjectURL(file);
                        a.href = url;
                        a.download = download_name;
                        a.click();
                    }
                }
            })
            .fail(function(err) {
                console.log(err)
                console.log( "error");
            });
        }
	}
};

function ConFromGeo() {
	
	var data = new FormData();
	//## 將檔案append FormData
	var files = $("#upload_togeojson").get(0).files;
	if (files.length > 0) {
        if ((files[0].size / 1024 / 1024) > 3) {
            alert("上傳檔案超過 3mb")
        } else {
            data.append("upload", files[0]);
            data.append("targetSrs", 'EPSG:4326');
            data.append("skipFailures", true);

            var download_name = files[0].name.split('.')[0] + '.zip'
            
            //## 透過ajax方式Post 至Action
            var ajaxRequest = $.ajax({
                type: "POST",
                url: 'https://3dterrain.geodac.tw:2048/convert',
                contentType: false,         // 告诉jQuery不要去這置Content-Type
                processData: false,         // 告诉jQuery不要去處理發送的數據
                data: data,
                success: function(msg){
                    //## 將檔案append FormData
                    
                    var data = new FormData();
                    data.append("json", JSON.stringify(msg))
                    
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", 'https://3dterrain.geodac.tw:2048/convertJson', true);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            // alert("Failed to download:" + xhr.status + "---" + xhr.statusText);
                            var file = new Blob([xhr.response], {type: "octet/stream"});
                            if (window.navigator.msSaveOrOpenBlob) // IE10+sssss
                                window.navigator.msSaveOrOpenBlob(file, download_name);
                            else { // Others
                                var a = document.createElement("a"),
                                url = URL.createObjectURL(file);
                                a.href = url;
                                a.download = download_name;
                                a.click();
                            }
                        }
                        else if (xhr.readyState == 4) {
                            alert("無法轉換成shp檔 error = " + xhr.status)
                        }
                    }
                    xhr.responseType = "arraybuffer";
                    xhr.send(data);
                    
                }
            })
            .fail(function(err) {
                console.log(err)
                console.log( "error");
            });
        }
	}
	
};
/***    20190218 fixed  ***/
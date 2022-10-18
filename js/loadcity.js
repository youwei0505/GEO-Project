var loadcity_icon_source
var loadcity_icon_box
var loadcity_marker
var loadcity_line_source
var loadcity_line_box
var qrytile_source
var qrytile_box
var qrytile_draw
var qrytile_line_source
var qrytile_line_box
var retry_time = 0

function clear_load_pos() {
	if (loadcity_icon_box) {
		maps[map_ind].removeLayer(loadcity_icon_box);
		loadcity_icon_box.getSource().clear();
		loadcity_icon_source.clear();
		maps[map_ind].addLayer(loadcity_icon_box);
	}
	if (qrytile_box) {
		maps[map_ind].removeLayer(qrytile_box);
		qrytile_box.getSource().clear();
		qrytile_source.clear();
		maps[map_ind].addLayer(qrytile_box);
	}
	if (qrytile_draw) {
		maps[map_ind].removeInteraction(qrytile_draw);		
	}
	if (qrytile_line_box) {
		maps[map_ind].removeLayer(qrytile_line_box);
		qrytile_line_box.getSource().clear();
		qrytile_line_source.clear();
		maps[map_ind].addLayer(qrytile_line_box);
	}
	$("#qrycity").html('')
	//$("#qryccode").html('')
	$("#qrytown").html('')
	//$("#qrytcode").html('')
	//$("#qrydept").html('')
	$("#qrydcode").html('')
	//$("#qrysec").html('')
	$("#qryscode").html('')
	//$("#qryvcode").html('')
	//$("#qryvillage").html('')
	$("#qrydicode").html('')
	$("#qryarea").html('')
    $('#loadcity_owner').html("所有權人:")
}

function clear_load_line() {
	if (loadcity_line_box) {
		maps[map_ind].removeLayer(loadcity_line_box);
		loadcity_line_box.getSource().clear();
		loadcity_line_source.clear();
		maps[map_ind].addLayer(loadcity_line_box);
	}
}

function clear_qrytile() {
	if (qrytile_box) {
		maps[map_ind].removeLayer(qrytile_box);
		qrytile_box.getSource().clear();
		qrytile_source.clear();
		maps[map_ind].addLayer(qrytile_box);
	}
	if (qrytile_draw) {
		maps[map_ind].removeInteraction(qrytile_draw);		
	}
	if (qrytile_line_box) {
		maps[map_ind].removeLayer(qrytile_line_box);
		qrytile_line_box.getSource().clear();
		qrytile_line_source.clear();
		maps[map_ind].addLayer(qrytile_line_box);
	}
	$("#qrycity").html('')
	//$("#qryccode").html('')
	$("#qrytown").html('')
	//$("#qrytcode").html('')
	//$("#qrydept").html('')
	$("#qrydcode").html('')
	//$("#qrysec").html('')
	$("#qryscode").html('')
	//$("#qryvcode").html('')
	//$("#qryvillage").html('')
	$("#qrydicode").html('')
	$("#qryarea").html('')
	$("#qryyear").html('')
	
	$("#qryLcode_C1").html('')
	$("#qryLcode_C2").html('')
	$("#qryLcode_C3").html('')
	$("#qryLCODE").html('')
	$("#qryNAME").html('')
    $('#loadcity_owner').html("所有權人:")
}

function get_pos_by_cadas() {
	$.ajax({
		type: 	"GET",
		url:	"php/SendAPIReq.php",
		data: {
			u : encodeURI('https://landmaps.nlsc.gov.tw/S_Maps_WebService/qryLand?xml=<SQUIDReq><ServiceReq><Body><QueryRequest><QueryType>GetLandPositionLongitudeLatitude</QueryType><City>' + $("#county").find(":selected").val() + '</City><Sec>' + $("#sect").find(":selected").val() + '</Sec><No>' + pre_zero + '</No></QueryRequest></Body></ServiceReq></SQUIDReq>')
        },
		success: function(data) {
			if (data == ""){
				if (retry_time < 10)
					get_pos_by_cadas()
				else
					alert("系統繁忙請重試一次")
				retry_time = retry_time + 1
			}
			else {
                console.log(data)
				retry_time = 0
				if (data.includes("NO DATA"))
					alert("地號查詢無資料")
				else {
					$(data).find("RESPONSE").each(function(i) {
						var lat = $(this).children("LATITUDE").text();
						var lng = $(this).children("LONGITUDE").text();
						var iconStyle = new ol.style.Style({
							image: new ol.style.Icon( ({
								anchor: [0.5, 1],
								anchorXUnits: 'fraction',
								anchorYUnits: 'fraction',
								src: './img/marker_icon.png',
							}))
						});
						
						loadcity_marker = createMarker(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'), iconStyle);
						
						loadcity_icon_source = new ol.source.Vector({wrapX: false});
						loadcity_icon_source.addFeature(loadcity_marker);	
						loadcity_icon_box = new ol.layer.Vector({
							source: loadcity_icon_source
						});
						
						/*
						var image_extent = [120.62604418753313, 24.14645057108406, 120.62620681522012, 24.14660443074493]
						var image_projection = new ol.proj.Projection({
							code: 'EPSG:4326',
							  // The extent is used to determine zoom level 0. Recommended values for a
							  // projection's validity extent can be found at http://epsg.io/.
							extent: image_extent
						});
						
						var image_layer = new ol.layer.Image({
							source : new ol.source.ImageStatic({
								imageExtent : image_extent,
								imageLoadFunction : function(image){
									image.getImage().src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAEHUlEQVR42u3aUYoCMRRFwew8S2/9UBBBsFWQ5NSBu4GBeo7BMaTNm2Mc/gpSFP9V/3QEpCj++25HwCGQavgf5whIUfyOgBTH//SVQFINvyMgxfF7HJTi+L0LSA6AIyDV8XsXkOL4HQEpjt/joBTH711Agt8RkOr4vQtIcfyOgBTH73FQiuP3LiDB7whIdfzeBaQ4fkdAiuP3OCjF8XsXkOB3BKQ6fu8CUhy/IyA5AB4HpTJ+7wIS/I6AVMfvXUDwx/E7AoLfPA4KfvMuIPjNERD85l1A8DsCjoDgdwQcAsHvXUCC3xGQ4PcuIMHvCEjwexyU4PcuIMHvCEgOgHcBCX5HQILf46AEv3cBCX5fCST4HQEJfkdAgt/joAS/x0EJfl8JJPgdAcFvjoDgN4+Dgt88Dgp+2+4ICH4Q/Acg+A1+wW/wywEw+AW/wS/4DX7Bb/ALfoNf8Bv8gt/gF/wGv+A3+AW/wS/4DX7Bb/ALfoNf8Bv8gt/gF/wGv+A3B0BvBj/88ulv8At+g1/wG/yC3+AX/Aa/4Df4Bb/BL/gNfsFv8At+g1/wG/yC3+AX/Aa/4Df4Bb/BL/gNfsFv8Ovb4IdfPv0NfsFv8At+g1/wG/yC3+AX/Aa/4Df4Bb/BL/gNfsFv8At+g1/wG/yC3+AX/Aa/4Df4Bb/BL/gNfjkABr/gN/gFv73YhF/w+/QX/PDDL/gNfsFv8At+g1/wG/yC3+AX/Aa/4Df4Bb/BL/gNfsFv8At+g1/wG/yC3+CXA2DwC36DX/Ab/ILf4Bf8Br/gN/gFv8Ev+A1+wQ8//IIffsEPBfyC3+AX/Aa/4Df4Bb/BL/gNfsFv8At+g18OgMEv+A1+wW/wC36DX/Ab/ILf4Bf85gAIfoNf8Bv8gt/gF/wGv+A3+AW/wS/4DX7BD78EP/yCHwz4Bb/BLwfA4Bf8Br/gN/gFv8Ev+A1+wW/wC36DX/Ab/ILf4Bf8Br/gN/gFv8Ev+A1+wW/wC36DX/Ab/ILf4Nfp4IdfPv0NfsFv8At+g1/wG/yC3+AX/Aa/4Df4Bb/BrwWCH345ApA4AHIEDH45Aga/HAGDX46AwS9HwOCXI2DwK3QE/FAIfsVzBOCXI+AIwC9HADr45QgY/HIEDH45Aga/gjkC8MsRgBN+OQIGvxwBg1+OgMEvR8DglyNg8MsRMPgVOgJ+MAS/4jkC8MsRcATglyMAPPxyBAx+OQLwS44A/FKwA37JEYBfcgTglxwB+CVHAH7JEYBfcgTglxwB+KXOEVjtB0PwSz9ulSMAvxQ9AvBL4SPgAEjRIwC/FD0C8EvRIwC/9N8O+CVHAH7JEYBfcgTglxwB+CVHAH7JEYBfcgTglzpH4NMfDMEvbdLZIwC/FD0C8EvRIwC/FD0C8EvRIwC/FD0C8KvaBeSDwBuNYNicAAAAAElFTkSuQmCC';
								},
								projection : image_projection,
								url : ''
							})
						});
						
						maps[map_ind].addLayer(image_layer);
						*/
						loadcity_icon_box.setZIndex(3);
						maps[map_ind].addLayer(loadcity_icon_box);
						Locate(lat, lng, 20)
					})
				}
			}
		},
		error: function(jqXHR) {
			alert("error " + jqXHR.status);
		}
	})
}

function processData(allText) {
    var record_num = 3;  // or however many elements there are in each row
    var allTextLines = allText.split(/\r\n|\n/);
    var entries = allTextLines[0].split(',');
    var lines = [];

    var headings = entries.splice(0,record_num);
    while (entries.length>0) {
        var tarr = [];
        for (var j=0; j<record_num; j++) {
            tarr.push(headings[j]+":"+entries.shift());
        }
        lines.push(tarr);
    }
    return tarr
    // alert(lines);
}

function CadasMapQuery() {
	
    
	$.ajax({
		type: 	"GET",
		url:	"php/SendAPIReq.php",
		data: {
			u : 'https://api.nlsc.gov.tw/dmaps/CadasMapQuery/' + $("#county").find(":selected").val() + '/' + $("#sect").find(":selected").val() + '/' + pre_zero 
		},
		success: function(data) {
            
			if (data == ""){
				if (retry_time < 10)
					CadasMapQuery()
				else
					alert("系統繁忙請重試一次")
				retry_time = retry_time + 1
			}
			else {
				
                dcode = data.split("<WFS:OFFICE>")[1].split("</WFS:OFFICE>")[0]
                scode = data.split("<WFS:SECT>")[1].split("</WFS:SECT>")[0]
                dicode = data.split("<WFS:LANDNO>")[1].split("</WFS:LANDNO>")[0]
                
                $.ajax({
                    type: 	"GET",
                    url:	"php/send_moigov_req.php",
                    contentType : 'application/json; charset=utf-8',
                    data: {
                        u: 'https://api.land.moi.gov.tw/cp/gis/landWFS?Service=WFS&request=GetFeature&LD=' + dcode + '&SCNO=' + scode + '&PO=' + dicode,
                        d: ""
                    },
                    success: function(draw_data) {
                        //console.log(draw_data)
                        var pos = draw_data.split("<gml:posList")
                        if (pos.length > 1) {
                            //console.log(pos)
                            qrytile_line_source = new ol.source.Vector({wrapX: false});
                            for(j = 1; j < pos.length; j++){
                                coord = pos[j].split('>')[1].split("</gml:posList")[0].split(" ")
                                //console.log( pos[1].split('>')[1].split("</gml:posList")[0])
                                //console.log(coord)
                                for(i = 0; i < coord.length - 2; i = i + 2) {
                                    var start_point = ol.proj.transform([parseFloat(coord[i]), parseFloat(coord[i + 1])], 'EPSG:4326', 'EPSG:3857')
                                    var end_point = ol.proj.transform([parseFloat(coord[i + 2]), parseFloat(coord[i + 3])], 'EPSG:4326', 'EPSG:3857')
                                    var points = [start_point, end_point]
                                    //console.log(points)
                                    var featureLine = new ol.Feature({
                                        geometry: new ol.geom.LineString(points)
                                    });
                                    qrytile_line_source.addFeature(featureLine);

                                }
                            }
                            qrytile_line_box = new ol.layer.Vector({
                                source: qrytile_line_source
                            });
                            qrytile_line_box.setZIndex(3);
                            maps[map_ind].addLayer(qrytile_line_box);
                        }
                    },
                    error: function(jqXHR) {
                        alert("error " + jqXHR.status);
                    }
                })
                
				retry_time = 0
                /*
				var pos = data.split("<gml:coordinates>")
				if (pos.length > 2) {
					coor = pos[2].split("</gml:coordinates>")[0].split(" ")
					loadcity_line_source = new ol.source.Vector({wrapX: false});
					for(i = 0; i < coor.length - 1; i++) {
						var start_point = ol.proj.transform([parseFloat(coor[i].split(',')[0]), parseFloat(coor[i].split(',')[1])], 'EPSG:4326', 'EPSG:3857')
						var end_point = ol.proj.transform([parseFloat(coor[i + 1].split(',')[0]), parseFloat(coor[i + 1].split(',')[1])], 'EPSG:4326', 'EPSG:3857')
						var points = [start_point, end_point]
						var featureLine = new ol.Feature({
							geometry: new ol.geom.LineString(points)
						});
						loadcity_line_source.addFeature(featureLine);

					}
					
					loadcity_line_box = new ol.layer.Vector({
						source: loadcity_line_source
					});

					maps[map_ind].addLayer(loadcity_line_box);
				}*/
			}
            
		},
		error: function(jqXHR) {
			alert("error " + jqXHR.status);
		}
	})
}

function QryTileMapQuery(coor) {
	
	$.ajax({
		type: 	"GET",
		url:	"php/SendAPIReq.php",
		data: {
			u : 'https://api.nlsc.gov.tw/dmaps/CadasMapPointQuery/' + coor[0] + '/' + coor[1]
		},
		success: function(data) {
			if (data == ""){
				if (retry_time < 10)
					QryTileMapQuery(coor)
				else
					alert("查無資料")
				retry_time = retry_time + 1
			}
			else {
				retry_time = 0
				/*var pos = data.split("<gml:coordinates>")
				if (pos.length > 2) {
					coord = pos[2].split("</gml:coordinates>")[0].split(" ")
                    console.log(coord)
					qrytile_line_source = new ol.source.Vector({wrapX: false});
					for(i = 0; i < coord.length - 1; i++) {
						var start_point = ol.proj.transform([parseFloat(coord[i].split(',')[0]), parseFloat(coord[i].split(',')[1])], 'EPSG:4326', 'EPSG:3857')
						var end_point = ol.proj.transform([parseFloat(coord[i + 1].split(',')[0]), parseFloat(coord[i + 1].split(',')[1])], 'EPSG:4326', 'EPSG:3857')
						var points = [start_point, end_point]
                        console.log(points)
						var featureLine = new ol.Feature({
							geometry: new ol.geom.LineString(points)
						});
						qrytile_line_source.addFeature(featureLine);

					}
					
					qrytile_line_box = new ol.layer.Vector({
						source: qrytile_line_source
					});
					qrytile_line_box.setZIndex(3);
					maps[map_ind].addLayer(qrytile_line_box);
				}*/
                city = data.split("<WFS:CITY>")[1].split("</WFS:CITY>")[0]
                town = data.split("<WFS:TOWN>")[1].split("</WFS:TOWN>")[0]
                dcode = data.split("<WFS:OFFICE>")[1].split("</WFS:OFFICE>")[0]
                scode = data.split("<WFS:SECT>")[1].split("</WFS:SECT>")[0]
                dicode = data.split("<WFS:LANDNO>")[1].split("</WFS:LANDNO>")[0]
                diarea = data.split("<WFS:AREA>")[1].split("</WFS:AREA>")[0]
                $.ajax({
                    type: 	"GET",
                    url:	"php/send_moigov_req.php",
                    contentType : 'application/json; charset=utf-8',
                    data: {
                        u: 'https://api.land.moi.gov.tw/cp/api/PublicLandQuery/QueryByLandNo',
                        d: "[{\"UNIT\":\"" + dcode + "\",\"SEC\":\"" + scode + "\",\"NO\":\"" + dicode + "\"}]"
                    },
                    success: function(owner_data) {
                        
                        obj = JSON.parse(owner_data)
                        
                        $.ajax({
                            type: 	"GET",
                            url:	"php/send_moigov_req.php",
                            contentType : 'application/json; charset=utf-8',
                            data: {
                                u: 'https://api.land.moi.gov.tw/cp/gis/landWFS?Service=WFS&request=GetFeature&LD=' + dcode + '&SCNO=' + scode + '&PO=' + dicode + '',
                                d: ""
                            },
                            success: function(draw_data) {
                                //console.log(draw_data)
                                var pos = draw_data.split("<gml:posList")
                                if (pos.length > 1) {
                                    qrytile_line_source = new ol.source.Vector({wrapX: false});
                                    for(j = 1; j < pos.length; j++){
                                        coord = pos[j].split('>')[1].split("</gml:posList")[0].split(" ")
                                        //console.log( pos[1].split('>')[1].split("</gml:posList")[0])
                                        //console.log(coord)
                                        for(i = 0; i < coord.length - 2; i = i + 2) {
                                            var start_point = ol.proj.transform([parseFloat(coord[i]), parseFloat(coord[i + 1])], 'EPSG:4326', 'EPSG:3857')
                                            var end_point = ol.proj.transform([parseFloat(coord[i + 2]), parseFloat(coord[i + 3])], 'EPSG:4326', 'EPSG:3857')
                                            var points = [start_point, end_point]
                                            //console.log(points)
                                            var featureLine = new ol.Feature({
                                                geometry: new ol.geom.LineString(points)
                                            });
                                            qrytile_line_source.addFeature(featureLine);

                                        }
                                    }
                                    qrytile_line_box = new ol.layer.Vector({
                                        source: qrytile_line_source
                                    });
                                    qrytile_line_box.setZIndex(3);
                                    maps[map_ind].addLayer(qrytile_line_box);
                                }
                                if (obj.RESPONSE[0].PUBLIC == null) {
                                    $('#loadcity_owner').html("所有權人:  私人土地")
                                } else {
                                    gov = obj.RESPONSE[0].PUBLIC.OWNER[0].LNAM
                                    owner = obj.RESPONSE[0].PUBLIC.OWNER[0].RMNGR[0].LNAM
                                    $('#loadcity_owner').html("所有權人:  " + gov + "/" + owner)
                                }
                                $("#qrycity").html("&ensp;" + city + "&ensp;")
                                $("#qrytown").html("&ensp;" + town + "&ensp;")
                                $("#qrydcode").html("&ensp;" + dcode + "&ensp;")
                                $("#qryscode").html("&ensp;" + scode + "&ensp;")
                                $("#qrydicode").html("&ensp;" + dicode + "&ensp;")
                                $("#qryarea").html("&ensp;" + diarea + "&ensp;")
                                $.ajax({
                                    type: 	"GET",
                                    url:	"php/SendAPIReq.php",
                                    data: {
                                        u: 'https://api.nlsc.gov.tw/other/LandUsePointQuery/' + coor[0] + '/' + coor[1]
                                    },
                                    success: function(land_data) {
                                        console.log(land_data)
                                        year = land_data.split("<YEAR>")[1].split("</YEAR>")[0]
                                        Lcode_C1 = land_data.split("<Lcode_C1>")[1].split("</Lcode_C1>")[0]
                                        Lcode_C2 = land_data.split("<Lcode_C2>")[1].split("</Lcode_C2>")[0]
                                        Lcode_C3 = land_data.split("<Lcode_C3>")[1].split("</Lcode_C3>")[0]
                                        LCODE = land_data.split("<LCODE>")[1].split("</LCODE>")[0]
                                        NAME = land_data.split("<NAME>")[1].split("</NAME>")[0]
                                        $("#qryyear").html("&ensp;" + year + "&ensp;")
                                        $("#qryLcode_C1").html("&ensp;" + Lcode_C1 + "&ensp;")
                                        $("#qryLcode_C2").html("&ensp;" + Lcode_C2 + "&ensp;")
                                        $("#qryLcode_C3").html("&ensp;" + Lcode_C3 + "&ensp;")
                                        $("#qryLCODE").html("&ensp;" + LCODE + "&ensp;")
                                        $("#qryNAME").html("&ensp;" + NAME + "&ensp;")
                                        var legname = 'img/RGB_list_95.jpg'
                                        if (parseInt(year) > 104)
                                            legname = 'img/RGB_list_105.png'
                                        var load_city_win = dhxWins.createWindow("load_city_win", 600, 600, 400, 400);
                                        load_city_win.setText("圖例");
                                        load_city_html = //"<div style='height:" + json.LegendImgHeight / 3 + ";width:" + json.LegendImgWidth / 3 + ";'>" + 
											  "<div style='align: center; height:100%;width:100%;'>" + 
											  "<br><img src='" + legname + "' style='display:block; margin-left: auto; margin-right: auto; max-height:100%; align: center; max-height:100%; height:auto; max-width:100%; width:auto;'></img></div>"
                                        load_city_win.attachHTMLString(load_city_html)
                                        
                                    },
                                    error: function(jqXHR) {
                                        alert("error " + jqXHR.status);
                                    }
                                })
                            },
                            error: function(jqXHR) {
                                alert("error " + jqXHR.status);
                            }
                        })
                        
                        
                    },
                    error: function(jqXHR) {
                        alert("error " + jqXHR.status);
                    }
                })
			}
		},
		error: function(jqXHR) {
			alert("error " + jqXHR.status);
		}
	})
}
/*
function QryTileMapIndex(coor) {
	$.ajax({
        url: "https://api.nlsc.gov.tw/other/TownVillagePointQuery/" + coor[0] + "/" + coor[1] + "/4326",
    }).done(function(data) {
        $(data).find("townVillageItem").each(function(i) {
            $("#qrycity").html($(this).children("ctyName").text()) 
            $("#qryccode").html($(this).children("ctyCode").text())
            $("#qrytown").html($(this).children("townName").text()) 
            $("#qrytcode").html($(this).children("townCode").text())
            $("#qrydept").html($(this).children("officeName").text()) 
            $("#qrydcode").html($(this).children("officeCode").text())  
            $("#qrysec").html($(this).children("sectName").text()) 
            $("#qryscode").html($(this).children("sectCode").text()) 
            $("#qryvcode").html($(this).children("villageCode").text()) 
            $("#qryvillage").html($(this).children("villageName").text())
        })
        $.ajax({
            type: 	"GET",
            url:	"php/SendAPIReq.php",
            data: {
                u : 'https://landmaps.nlsc.gov.tw/S_Maps_WebService/qryLand?xml=<SQUIDReq><ServiceReq><Body><QueryRequest><QueryType>GetLandNO</QueryType><Longitude>' + coor[0] + '</Longitude><Latitude>' + coor[1] + '</Latitude></QueryRequest></Body></ServiceReq></SQUIDReq>'
            },
            success: function(d) {
                if (d == ""){
                    if (retry_time < 10)
                        QryTileMapIndex(coor)
                    else
                        alert("系統繁忙請重試一次")
                    retry_time = retry_time + 1
                }
                else {
                    retry_time = 0
                    if (d.includes("NO DATA"))
                            alert("查無地號")
                    else {
                        $(d).find("RESPONSE").each(function(i) {
                            var no = $(this).children("NO").text();
                            $("#qrydicode").html(no)
                        })
                    }
                }
            },
            error: function(jqXHR) {
                alert("error " + jqXHR.status);
            }
        })
    });
	
}
*/
function loadcity() {
	
			
	$.ajax({
		url: "https://api.nlsc.gov.tw/other/ListCounty",
	}).done(function(data) {
		$("#county option").remove();
		$("#county").append($("<option></option>").attr("value", "default").text("縣市"));
		$("#town option").remove();
		$("#town").append($("<option></option>").attr("value", "default").text("鄉鎮市區(地政)"));
		$("#sect option").remove();
		$("#sect").append($("<option></option>").attr("value", "default").text("地段"));
		$("#cadas").val('');
		$(data).find("countyItem").each(function(i) {
			var countycode = $(this).children("countycode").text();
			var countyname = $(this).children("countyname").text();
			$("#county").append($("<option></option>").attr("value", countycode).text(countyname));
		})
		
		$("#county").change(function() {
			var countycode = $("#county").find(":selected").val();
					
			if (countycode != "default") {
				$("#town option").remove();
				$("#town").append($("<option></option>").attr("value", "default").text("鄉鎮市區(地政)"));
				$("#sect option").remove();
				$("#sect").append($("<option></option>").attr("value", "default").text("地段"));
				$("#cadas").val('');
				$.ajax({
					url: "https://api.nlsc.gov.tw/other/ListTown/" + countycode,
				}).done(function(data) {
					$(data).find("townItem").each(function(i) {
						var towncode = $(this).children("towncode").text();
						var townname = $(this).children("townname").text();
						$("#town").append($("<option></option>").attr("value", towncode).text(townname));
					})
				});
			}
			else {
				$("#town option").remove();
				$("#town").append($("<option></option>").attr("value", "default").text("鄉鎮市區(地政)"));
				$("#sect option").remove();
				$("#sect").append($("<option></option>").attr("value", "default").text("地段"));
				$("#cadas").val('');
			}
		});
		
		$("#town").change(function() {
			var countycode = $("#county").find(":selected").val();
			var towncode = $("#town").find(":selected").val();
			if (towncode != "default") {
				$("#sect option").remove();
				$("#sect").append($("<option></option>").attr("value", "default").text("地段"));
				
				$.ajax({
					url: "https://api.nlsc.gov.tw/other/ListLandSection/" + countycode + "/" + towncode,
				}).done(function(data) {
					$(data).find("sectItem").each(function(i) {
						var sectcode = $(this).children("sectcode").text();
						var sectname = $(this).children("sectstr").text();
						$("#sect").append($("<option></option>").attr("value", sectcode).text(sectname));
					})
				});
			}
			else {
				$("#sect option").remove();
				$("#sect").append($("<option></option>").attr("value", "default").text("地段"));
				$("#cadas").val('');
			}
		});		
	});
	
	$("#load_pos_by_cadas").click(function() {
		fun_access_log("Func_Use_Location_1_5");
		clear_load_pos()
		clear_load_line()
		retry_time = 0
		
		pre_zero = ""
		//地號補0
		if($("#cadas").val().indexOf('-')==-1){
			for(i = 0; i < 4 - $("#cadas").val().length; i++){
			pre_zero = pre_zero + '0'
			}
			pre_zero=pre_zero + $("#cadas").val() + "0000"; 
		}else if ($("#cadas").val().indexOf('-')>1){
			pre_zoro_arr=$("#cadas").val().split('-');
			
			for(i = 0; i < 4 - pre_zoro_arr[0].length; i++){
			pre_zero = pre_zero + '0'
			}
			pre_zoro_arr[0]=pre_zero+pre_zoro_arr[0];
			pre_zero = "";
			for(i = 0; i < 4 - pre_zoro_arr[1].length; i++){
			pre_zero = pre_zero + '0'
			}
			pre_zoro_arr[1]=pre_zero+pre_zoro_arr[1];
			pre_zero = "";
			pre_zero=pre_zoro_arr[0]+pre_zoro_arr[1];
			
		}
		CadasMapQuery()
		
		get_pos_by_cadas()
		
	})
	
	$("#clear_load_pos").click(function() {
		clear_load_pos()
		clear_load_line()
	})
	
	$("#qrytile_button").click(function() {
		fun_access_log("Func_Use_Location_1_6");
		retry_time = 0
		clear_qrytile();
		qrytile_source = new ol.source.Vector({wrapX: false});

		qrytile_box = new ol.layer.Vector({
			source: qrytile_source,
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255, 255, 255, 0.2)'
				}),
				stroke: new ol.style.Stroke({
					color: '#ffcc33',
					width: 3
				}),
				image: new ol.style.Circle({
					radius: 7,
					fill: new ol.style.Fill({
						color: '#ffcc33'
					})
				})
			})
		});
	    qrytile_box.setZIndex(3);
		maps[map_ind].addLayer(qrytile_box);
	
		qrytile_draw = new ol.interaction.Draw({
	        type: 'Point',
	        source: qrytile_source,
	        maxPoints: 1
	    });
		
		
		maps[map_ind].addInteraction(qrytile_draw);	
		
		qrytile_draw.on('drawend', function(event){
			
	        var s = new ol.style.Style({
	            image: new ol.style.Circle({
	                radius: 5,
	                fill: new ol.style.Fill({color: '#ff8000'}),
	                stroke: new ol.style.Stroke({color: '#0072e3', width: 1})
	            })
	        });
			
	        event.feature.setStyle(s);
	        var coor = ol.proj.transform(event.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
			
			//QryTileMapIndex(coor)
			QryTileMapQuery(coor)
			maps[map_ind].removeInteraction(qrytile_draw);
	    });
		
	})

}
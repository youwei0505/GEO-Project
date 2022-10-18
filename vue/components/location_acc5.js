/********* 20220510 add ***********/
 //功能5
  Vue.component('load_location_5', {                
    data: function() {
          return { 
            HTMLcontent: null,
            loadcity_icon_box: null,
            loadcity_icon_source: null,
            loadcity_icon_box: null,
            loadcity_marker: null,
            loadcity_line_source: null,
            loadcity_line_box: null,
            qrytile_source: null,
            qrytile_box: null,
            qrytile_draw: null,
            qrytile_line_source: null,
            qrytile_line_box: null,
            retry_time: 0
          }
    },
    methods: {
      //檢測用
      log: function (e) {
        console.log(e.currentTarget);
        console.log(e);
      }, 
      clear_load_pos_click: function (e) {
        console.log('clear_load_pos_click');
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
      }, 
      clear_load_line: function (e) {
        console.log('clear_load_line');
        console.log('this.loadcity_line_box',this.loadcity_line_box);
        console.log('maps[map_ind]',maps[map_ind]);
        console.log('this.loadcity_line_source',this.loadcity_line_source);
        console.log('this.loadcity_line_box',this.loadcity_line_box);
        if (this.loadcity_line_box) {
          //找不到
          maps[map_ind].removeLayer(loadcity_line_box);
          this.loadcity_line_box.getSource().clear();
          this.loadcity_line_source.clear();
          maps[map_ind].addLayer(loadcity_line_box);
        }
      },
      clear_load_pos: function(e) {
        if (this.loadcity_icon_box) {
          maps[map_ind].removeLayer(loadcity_icon_box);
          loadcity_icon_box.getSource().clear();
          loadcity_icon_source.clear();
          maps[map_ind].addLayer(loadcity_icon_box);
        }
        if (this.qrytile_box) {
          maps[map_ind].removeLayer(qrytile_box);
          qrytile_box.getSource().clear();
          qrytile_source.clear();
          maps[map_ind].addLayer(qrytile_box);
        }
        if (this.qrytile_draw) {
          maps[map_ind].removeInteraction(qrytile_draw);		
        }
        if (this.qrytile_line_box) {
          maps[map_ind].removeLayer(qrytile_line_box);
          qrytile_line_box.getSource().clear();
          qrytile_line_source.clear();
          maps[map_ind].addLayer(qrytile_line_box);
        }
        $("#qrycity").html('')
        $("#qrytown").html('')
        $("#qrydcode").html('')
        $("#qryscode").html('')
        $("#qrydicode").html('')
        $("#qryarea").html('')
        $('#loadcity_owner').html("所有權人:")
        console.log("clear_load_pos");
      },     
      load_pos_by_cadas: function(e) {
        //fun_access_log("Func_Use_Location_1_5");
        this.clear_load_pos()
        this.clear_load_line()
        retry_time = 0
        
        pre_zero = ""
        
        for(i = 0; i < 4 - $("#cadas_acc_5").val().length; i++)
          pre_zero = pre_zero + '0'
    
        this.CadasMapQuery()
        
        this.get_pos_by_cadas()
      },      
      createMarker: function(e) {
        var iconFeature = new ol.Feature({
          geometry: new ol.geom.Point(location)
        });
        iconFeature.setStyle(style);
    
        return iconFeature        
      },
      get_pos_by_cadas: function(location, style) {
        $.ajax({
          type: 	"GET",
          url:	"php/SendAPIReq.php",
          data: {
            u : encodeURI('https://landmaps.nlsc.gov.tw/S_Maps_WebService/qryLand?xml=<SQUIDReq><ServiceReq><Body><QueryRequest><QueryType>GetLandPositionLongitudeLatitude</QueryType><City>' + $("#county_acc_5").find(":selected").val() + '</City><Sec>' + $("#sect_acc_5").find(":selected").val() + '</Sec><No>' + pre_zero + $("#cadas_acc_5").val() + "0000" + '</No></QueryRequest></Body></ServiceReq></SQUIDReq>')
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
                  
                  // 在選定的中心位置建立坐標圖像
                  function createMarker(location, style){
                    var iconFeature = new ol.Feature({
                      geometry: new ol.geom.Point(location)
                    });
                    iconFeature.setStyle(style);

                    return iconFeature
                  }

                  loadcity_marker = createMarker(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'), iconStyle);
                  
                  loadcity_icon_source = new ol.source.Vector({wrapX: false});
                  loadcity_icon_source.addFeature(loadcity_marker);	
                  loadcity_icon_box = new ol.layer.Vector({
                    source: loadcity_icon_source
                  });
                  
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
      }, 
      CadasMapQuery: function (e) {
        console.log($("#county_acc_5").find(":selected").val())
        console.log($("#sect_acc_5").find(":selected").val())
        console.log($("#cadas_acc_5").val())
        
	      $.ajax({
          type: 	"GET",
          url:	"php/SendAPIReq.php",
          data: {
            u : 'https://api.nlsc.gov.tw/dmaps/CadasMapQuery/' + $("#county_acc_5").find(":selected").val() + '/' + $("#sect_acc_5").find(":selected").val() + '/' + pre_zero + $("#cadas_acc_5").val() + "0000"
          },
          success: function(data) {
            console.log(" success in php/SendAPIReq.php")  
            console.log(data)     
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
                      dcode = "AA"
                      scode = "0001"
                      dicode = "00010000"
                      console.log(dcode)
                      console.log(scode)
                      console.log(dicode)
                      $.ajax({
                          type: 	"GET",
                          url:	"php/send_moigov_req.php",
                          contentType : 'application/json; charset=utf-8',
                          data: {
                              u: 'https://api.land.moi.gov.tw/cp/gis/landWFS?Service=WFS&request=GetFeature&LD=' + dcode + '&SCNO=' + scode + '&PO=' + dicode,
                              d: ""
                          },
                          success: function(draw_data) {
                              console.log(" success in php/send_moigov_req.php")    
                              console.log(draw_data)
                              var pos = draw_data.split("<gml:posList")
                              if (pos.length > 1) {
                                  console.log("pos",pos)
                                  qrytile_line_source = new ol.source.Vector({wrapX: false});
                                  for(j = 1; j < pos.length; j++){
                                      coord = pos[j].split('>')[1].split("</gml:posList")[0].split(" ")
                                      console.log("pos[1].split",pos[1].split('>')[1].split("</gml:posList")[0])
                                      console.log("coord",coord)
                                      for(i = 0; i < coord.length - 2; i = i + 2) {
                                          var start_point = ol.proj.transform([parseFloat(coord[i]), parseFloat(coord[i + 1])], 'EPSG:4326', 'EPSG:3857')
                                          var end_point = ol.proj.transform([parseFloat(coord[i + 2]), parseFloat(coord[i + 3])], 'EPSG:4326', 'EPSG:3857')
                                          var points = [start_point, end_point]
                                          console.log("points",points)
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
    },
    created() {
      console.log('load');
      $.ajax({
        url: "https://api.nlsc.gov.tw/other/ListCounty",
      }).done(function(data) {
        $("#county_acc_5 option").remove();
        $("#county_acc_5").append($("<option></option>").attr("value", "default").text("縣市"));
        $("#town_acc_5 option").remove();
        $("#town_acc_5").append($("<option></option>").attr("value", "default").text("鄉鎮市區(地政)"));
        $("#sect_acc_5 option").remove();
        $("#sect_acc_5").append($("<option></option>").attr("value", "default").text("地段"));
        $("#cadas_acc_5").val('');
        $(data).find("countyItem").each(function(i) {
          var countycode = $(this).children("countycode").text();
          var countyname = $(this).children("countyname").text();
          $("#county_acc_5").append($("<option></option>").attr("value", countycode).text(countyname));
        })
        $("#county_acc_5").change(function() {
          var countycode = $("#county_acc_5").find(":selected").val();
              
          if (countycode != "default") {
            $("#town_acc_5 option").remove();
            $("#town_acc_5").append($("<option></option>").attr("value", "default").text("鄉鎮市區(地政)"));
            $("#sect_acc_5 option").remove();
            $("#sect_acc_5").append($("<option></option>").attr("value", "default").text("地段"));
            $("#cadas_acc_5").val('');
            $.ajax({
              url: "https://api.nlsc.gov.tw/other/ListTown/" + countycode,
            }).done(function(data) {
              $(data).find("townItem").each(function(i) {
                var towncode = $(this).children("towncode").text();
                var townname = $(this).children("townname").text();
                $("#town_acc_5").append($("<option></option>").attr("value", towncode).text(townname));
              })
            });
          }
          else {
            $("#town_acc_5 option").remove();
            $("#town_acc_5").append($("<option></option>").attr("value", "default").text("鄉鎮市區(地政)"));
            $("#sect_acc_5 option").remove();
            $("#sect_acc_5").append($("<option></option>").attr("value", "default").text("地段"));
            $("#cadas_acc_5").val('');
          }
        });
        $("#town_acc_5").change(function() {
          var countycode = $("#county_acc_5").find(":selected").val();
          var towncode = $("#town_acc_5").find(":selected").val();
          if (towncode != "default") {
            $("#sect_acc_5 option").remove();
            $("#sect_acc_5").append($("<option></option>").attr("value", "default").text("地段"));
            
            $.ajax({
              url: "https://api.nlsc.gov.tw/other/ListLandSection/" + countycode + "/" + towncode,
            }).done(function(data) {
              $(data).find("sectItem").each(function(i) {
                var sectcode = $(this).children("sectcode").text();
                var sectname = $(this).children("sectstr").text();
                $("#sect_acc_5").append($("<option></option>").attr("value", sectcode).text(sectname));
              })
            });
          }
          else {
            $("#sect_acc_5 option").remove();
            $("#sect_acc_5").append($("<option></option>").attr("value", "default").text("地段"));
            $("#cadas_acc_5").val('');
          }
        });		
      });
    },
  template: 
    ` 
    <div>         
      <div id="vue_load_location_5"> 
        <div class='content'> 
          <select id='county_acc_5' ></select> 
          <select id='town_acc_5'> </select> 
          <br> 
          <br> 
          <select id='sect_acc_5'> </select> 
          <br>
          <br>
          地號:   <input id='cadas_acc_5'> </input>
          <br>
          <br>
          <button id='load_pos_by_cadas' @click='load_pos_by_cadas'> 定位 </button>
          <button id='clear_load_pos' @click='clear_load_pos_click'> clear </button>
          <p>查詢範例：</p>
					<p>(1)只輸入地號母號 EX：12</p>
					<p>(2)地號母號+地號子號 EX:169-2</p>
        </div>
      </div>
    </div> 
    `
  })

/********* 20220510 add ***********/

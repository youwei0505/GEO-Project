/********* 20220510 add ***********/
/********* 20220510 add ***********/
  //功能7
  Vue.component('load_location_7', {                
    data: function() {
          return { 
            HTMLcontent: null,
          }
    },
    methods: {
      greet: function (event) {
        alert('Hello ' + this.count + '!');
        console.log(this);
        this.count++;
        this.HTMLcontent = 
        `
        <div>I'm section one</div>
        <div>I'm section two</div>
        `
        ;          
      },
      //檢測用
      log: function (e) {
        console.log(e.currentTarget);
        console.log(e);
      }, 
      locate_load_pos_function: function (e) {
        console.log('locate_load_pos_function');
                
        var countyname = $("#locate_county_acc_7").find(":selected").text();
        var countycode = $("#locate_county_acc_7").find(":selected").val();
        var townname = $("#locate_town_acc_7").find(":selected").text();
        var roadname = $("#locate_road_acc_7").find(":selected").text();
        var lanename = $("#locate_lane_acc_7").find(":selected").text();
        var alleyname = $("#locate_alley_acc_7").find(":selected").text();
        var locate_number = $("#locate_number_acc_7").val();
        console.log('locate_number',locate_number);
        if (alleyname != "弄") {
            var locate_full_search_name = countyname + townname + roadname + lanename + '巷' + alleyname + '弄' + locate_number
        } else {
            var locate_full_search_name = countyname + townname + roadname + lanename + '巷' + locate_number
        }
        $.ajax({
            type: 	"GET",
            url:	"php/SendAPIReq.php",
            data: {
                u : encodeURI("https://api.nlsc.gov.tw/idc/TextQueryAddress/" + locate_full_search_name +  "/5/" + countycode + "")
            }
        }).done(function(data) {
            //fun_access_log("Func_Use_Location_1_7");
            var locate_inner_html = ""
            
            $(data).find("addressItem").each(function(i) {
                var content = $(this).children("content").text();
                var loca = $(this).children("location").text();
                var coors = loca.split(',')
                locate_inner_html = locate_inner_html + '\
                <div class="item" onclick = set_locate_pos(' + coors[1] + ',' + coors[0] + ') id="' + coors[0].toString().replace('.', '') + coors[1].toString().replace('.', '') + '"> \
                    <div class="content"> \
                        <div class="header">' + content+ '</div> \
                    </div> \
                </div> \
                <script> \
                  var prev_locate_item = "";\
                  function set_locate_pos(lat, lng) { \
                    console.log(set_locate_pos);\
                    console.log(lat); \
                    console.log(lng); \
                    not_map_click_change = 1; \
                    if(prev_locate_item != "") { \
                        prev_locate_item.css("background-color", "#FFFFFF") \
                    } \
                    '+'$("#" + lng.toString().replace(".", "") + lat.toString().replace(".", "")).css("background-color", "#FFB2BD"); ' +  
                    'prev_locate_item = $("#" + lng.toString().replace(".", "") + lat.toString().replace(".", ""));' +      
                    'search_Icon_draw(lat, lng);' +   
                    ' } \
                </script> \
                '

            })
            
            $('#locate_view_list_acc_7').html(locate_inner_html);
            
            locate_view_win.show();
                      
      })

      }, 
      locate_input_load_pos_function: function (e) {
        console.log('locate_input_load_pos_function');
        var searchname = $("#locate_input_acc_7").val();
                $.ajax({
                    type: 	"GET",
                    url:	"php/SendAPIReq.php",
                    data: {
                        u : encodeURI("https://api.nlsc.gov.tw/idc/TextQueryMap/" + searchname)
                    }
                }).done(function(data) {
					//fun_access_log("Func_Use_Location_1_7");
                    var locate_inner_html = ""
                    $(data).find("ITEM").each(function(i) {
                        var content = $(this).children("CONTENT").text()
                        var loca = $(this).children("LOCATION").text();
                        var coors = loca.split(',')
                        locate_inner_html = locate_inner_html + '\
                        <div class="item" onclick = set_locate_pos(' + coors[1] + ',' + coors[0] + ') id="' + coors[0].toString().replace('.', '') + coors[1].toString().replace('.', '') + '"> \
                            <div class="content"> \
                                <div class="header">' + content+ '</div> \
                            </div> \
                        </div> \
                        <script> \
                        var prev_locate_item = "";\
                        function set_locate_pos(lat, lng) { \
                          console.log(set_locate_pos);\
                          console.log(lat); \
                          console.log(lng); \
                          not_map_click_change = 1; \
                          if(prev_locate_item != "") { \
                              prev_locate_item.css("background-color", "#FFFFFF") \
                          } \
                          '+'$("#" + lng.toString().replace(".", "") + lat.toString().replace(".", "")).css("background-color", "#FFB2BD"); ' +  
                          'prev_locate_item = $("#" + lng.toString().replace(".", "") + lat.toString().replace(".", ""));' +      
                          'search_Icon_draw(lat, lng);' +   
                          ' } \
                      </script> \
                        '
                    })
                    $('#locate_view_list_acc_7').html(locate_inner_html)
                    locate_view_win.show();
                }); 

      }, 
      set_locate_pos: function (e) {
        console.log('In set_locate_pos');
      },
      locate_clear: function (e) {
        console.log('In locate_clear');
        if(prev_locate_item != "") {
          prev_locate_item.css('background-color', '#FFFFFF');
          prev_locate_item = "";
        }
        maps[0].removeLayer(Location_Icon_vectorLayer);
        maps[1].removeLayer(Location_Icon_vectorLayer);
      },
    },
    mounted () {
  
    },
    created() {
			$.ajax({
          url: "https://api.nlsc.gov.tw/other/ListCounty",
      }).done(function(data) {
          $("#locate_county_acc_7 option").remove();
          $("#locate_county_acc_7").append($("<option></option>").attr("value", "default").text("縣市"));
          $("#locate_town_acc_7 option").remove();
          $("#locate_town_acc_7").append($("<option></option>").attr("value", "default").text("鄉鎮市區"));
          $("#locate_road_acc_7 option").remove();
          $("#locate_road_acc_7").append($("<option></option>").attr("value", "default").text("路名"));
          $("#locate_lane_acc_7 option").remove();
          $("#locate_lane_acc_7").append($("<option></option>").attr("value", "default").text("巷"));
          $("#locate_alley_acc_7 option").remove();
          $("#locate_alley_acc_7").append($("<option></option>").attr("value", "default").text("弄"));
          $(data).find("countyItem").each(function(i) {
              var countycode = $(this).children("countycode").text();
              var countyname = $(this).children("countyname").text();
              $("#locate_county_acc_7").append($("<option></option>").attr("value", countycode).text(countyname));
          })
          
          $("#locate_county_acc_7").change(function() {
              var countycode = $("#locate_county_acc_7").find(":selected").val();
                      
              if (countycode != "default") {
                  $("#locate_town_acc_7 option").remove();
                  $("#locate_town_acc_7").append($("<option></option>").attr("value", "default").text("鄉鎮市區"));
                  $("#locate_road_acc_7 option").remove();
                  $("#locate_road_acc_7").append($("<option></option>").attr("value", "default").text("路名"));
                  $("#locate_lane_acc_7 option").remove();
                  $("#locate_lane_acc_7").append($("<option></option>").attr("value", "default").text("巷"));
                  $("#locate_alley_acc_7 option").remove();
                  $("#locate_alley_acc_7").append($("<option></option>").attr("value", "default").text("弄"));
                  $.ajax({
                      url: "https://api.nlsc.gov.tw/other/ListTown/" + countycode,
                  }).done(function(data) {
                      $(data).find("townItem").each(function(i) {
                          var towncode = $(this).children("towncode").text();
                          var townname = $(this).children("townname").text();
                          $("#locate_town_acc_7").append($("<option></option>").attr("value", towncode).text(townname));
                      })
                  });
              }
              else {
                  $("#locate_town_acc_7 option").remove();
                  $("#locate_town_acc_7").append($("<option></option>").attr("value", "default").text("鄉鎮市區(地政)"));
                  $("#locate_road_acc_7 option").remove();
                  $("#locate_road_acc_7").append($("<option></option>").attr("value", "default").text("路名"));
                  $("#locate_lane_acc_7 option").remove();
                  $("#locate_lane_acc_7").append($("<option></option>").attr("value", "default").text("巷"));
                  $("#locate_alley_acc_7 option").remove();
                  $("#locate_alley_acc_7").append($("<option></option>").attr("value", "default").text("弄"));
              }
          });
          
          $("#locate_town_acc_7").change(function() {
              var countycode = $("#locate_county_acc_7").find(":selected").val();
              var towncode = $("#locate_town_acc_7").find(":selected").val();
              if (towncode != "default") {
                  $("#locate_road_acc_7 option").remove();
                  $("#locate_road_acc_7").append($("<option></option>").attr("value", "default").text("路名"));
                  $("#locate_lane_acc_7 option").remove();
                  $("#locate_lane_acc_7").append($("<option></option>").attr("value", "default").text("巷"));
                  $("#locate_alley_acc_7 option").remove();
                  $("#locate_alley_acc_7").append($("<option></option>").attr("value", "default").text("弄"));
                  
                  $.ajax({
                      type: 	"GET",
                      url:	"php/SendAPIReq.php",
                      data: {
                          u : "https://api.nlsc.gov.tw/idc/ListRoad/" + countycode + "/" + towncode + ""
                      }
                  }).done(function(data) {
                      $(data).find("road").each(function(i) {
                          var roadname = $(this).children("name").text();
                          $("#locate_road_acc_7").append($("<option></option>").attr("value", roadname).text(roadname));
                      })
                  });
              }
              else {
                  $("#locate_road_acc_7 option").remove();
                  $("#locate_road_acc_7").append($("<option></option>").attr("value", "default").text("路名"));
                  $("#locate_lane_acc_7 option").remove();
                  $("#locate_lane_acc_7").append($("<option></option>").attr("value", "default").text("巷"));
                  $("#locate_alley_acc_7 option").remove();
                  $("#locate_alley_acc_7").append($("<option></option>").attr("value", "default").text("弄"));
              }
          });		
          
          $("#locate_road_acc_7").change(function() {
              var countycode = $("#locate_county_acc_7").find(":selected").val();
              var towncode = $("#locate_town_acc_7").find(":selected").val();
              var roadcode = $("#locate_road_acc_7").find(":selected").val();
              if (roadcode != "default") {
                  $("#locate_lane_acc_7 option").remove();
                  $("#locate_lane_acc_7").append($("<option></option>").attr("value", "default").text("巷"));
                  $("#locate_alley_acc_7 option").remove();
                  $("#locate_alley_acc_7").append($("<option></option>").attr("value", "default").text("弄"));
                  
                  $.ajax({
                      type: 	"GET",
                      url:	"php/SendAPIReq.php",
                      data: {
                          u : encodeURI("https://api.nlsc.gov.tw/idc/ListRoadLaneAlley/" + countycode + "/" + towncode + "/" + roadcode + "")
                      }
                  }).done(function(data) {
                      $(data).find("laneAlleyItem").each(function(i) {
                          var lanenum = $(this).children("lane").text();
                          var alleysnums = $(this).children("alleys");
                          $("#locate_lane_acc_7").append($("<option></option>").attr("value", lanenum).text(lanenum));
                      })
                  });
              }
              else {
                $("#locate_lane_acc_7 option").remove();
                $("#locate_lane_acc_7").append($("<option></option>").attr("value", "default").text("巷"));
                $("#locate_alley_acc_7 option").remove();
                $("#locate_alley_acc_7").append($("<option></option>").attr("value", "default").text("弄"));
              }
          });	        
          $("#locate_lane_acc_7").change(function() {
            var countycode = $("#locate_county_acc_7").find(":selected").val();
            var towncode = $("#locate_town_acc_7").find(":selected").val();
            var roadcode = $("#locate_road_acc_7").find(":selected").val();
            var lanecode = $("#locate_lane_acc_7").find(":selected").val();
            if (roadcode != "default") {
              $("#locate_alley_acc_7 option").remove();
              $("#locate_alley_acc_7").append($("<option></option>").attr("value", "default").text("弄"));
              
              $.ajax({
                type: 	"GET",
                url:	"php/SendAPIReq.php",
                data: {
                    u : encodeURI("https://api.nlsc.gov.tw/idc/ListRoadLaneAlley/" + countycode + "/" + towncode + "/" + roadcode + "")
                }
              }).done(function(data) {
                fun_access_log("Func_Use_Location_1_7");
                $(data).find("laneAlleyItem").each(function(i) {
                    var lanenum = $(this).children("lane").text();
                    var alleysnums = $(this).children("alleys");
                    if (lanenum == lanecode){
                        for (i = 0; i < alleysnums.length; i++){
                            $("#locate_alley_acc_7").append($("<option></option>").attr("value", alleysnums[i].innerText).text(alleysnums[i].innerText));
                        }
                    }
                })
              });
            }
            else {
              $("#locate_alley_acc_7 option").remove();
              $("#locate_alley_acc_7").append($("<option></option>").attr("value", "default").text("弄"));
            }
          });	
    });
    locate_view_win = dhxWins.createWindow("locate_view_win", 800, 100, 200, 300);
    /*** 20190529 fixed ***/
    locate_view_win.setText("節點定位");
    /*** 20190529 fixed ***/
    locate_view_win.centerOnScreen();
    locate_view_win.denyResize();
    locate_view_win.showInnerScroll();
    locate_view_html = "<div class='ui celled list' id = 'locate_view_list_acc_7'></div>"
    locate_view_win.attachHTMLString(locate_view_html);
    locate_view_win.hide();
    
    locate_view_win.attachEvent("onClose", function(win){
        locate_view_win.hide();
    });

  },
  template: 
    ` 
    <div>         
      <div id="vue_load_location_7"> 
        <br>
        <label>模糊搜尋: </label> 
        <div class='ui-widget'>
            <label for='locate_input_acc_7'>輸入搜尋地址: </label> 
            <input id='locate_input_acc_7'> 
        </div>
        <button id='locate_input_load_pos_acc_7' @click="locate_input_load_pos_function" > 搜尋 </button>
        <button id='locate_input_clear_acc_7' @click="locate_clear" > clear </button>
        <br>
        <br>
        <label>門牌搜尋: </label> 
        <br>
        <select id='locate_county_acc_7'></select>   
        <select id='locate_town_acc_7'> </select> 
        <select id='locate_road_acc_7'> </select> 
        <br>
        <select id='locate_lane_acc_7'> </select> 
        <select id='locate_alley_acc_7'> </select> 
        <br>
        <input id='locate_number_acc_7'> </input>號
        <br>
        <button id='locate_load_pos_acc_7' @click="locate_load_pos_function" > 搜尋 </button>
        <button id='locate_clear_acc_7' @click="locate_clear" > clear </button>   
      </div>
    </div>
    `
  })
/********* 20220510 add ***********/
/********* 20220510 add ***********/
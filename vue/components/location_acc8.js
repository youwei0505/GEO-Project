//功能 省道
Vue.component('load_location_8', {
    data: function () {
        return {
            HTMLcontent: null,
        }
    },
    methods: {
        // 修改所顯示的路徑
        updatePath: function (e) {
            console.log('updatePath');
            form = document.theForm_8;
            // print(form)
            //index1=form.column1_8.selectedIndex;
            //index2=form.column2_8.selectedIndex;
            // index3_updatePath=theForm_8.column3['selectedIndex'];
            var theForm_8 = document.getElementById("theForm_8");
            console.log('theForm_8.column2_8', theForm_8.column2_8);
            console.log('theForm_8.column2_8.value', theForm_8.column2_8.value);
            form = document.theForm_8;
            index1 = theForm_8.column1_8.selectedIndex;
            index2 = theForm_8.column2_8.selectedIndex;
            // index3=theForm_8.column3.selectedIndex;
            // console.log('theForm_8.column2_8.value', theForm_8.column2_8.value);
            // index3_updatePath = index3
            // print("index3_updatePath ", index3_updatePath)
            // text3 = theForm_8.column3.options[index3_updatePath].text;

            text3 = theForm_8.column2_8.value
            console.log(' theForm_8.column1_8.value : ', theForm_8.column1_8.value);
            console.log(' index1 : ', theForm_8.column1_8.selectedIndex);
            console.log(' theForm_8.column2_8.value : ', theForm_8.column2_8.value);
            console.log(' index2 : ', theForm_8.column2_8.selectedIndex);
            console.log(' text3 : ', text3);
            console.log(' thb01_gategory : ', thb01_gategory);
            thb01_gategory = theForm_8.column1_8.value;
            if (text3 != "") {
                // 臺中分局
                if (thb01_gategory == "Thi_1") {
                    switch (text3) {
                        case "大安溪1": lan_s = 121.2403051; lat = 25.10689088; range = 6000;
                            console.log('Thi_15_A_0K+042_中央":lan_s=121.2403051;lat=25.10689088;');
                            break;
                        case "大安溪2": lan_s = 121.2358054; lat = 25.10719397; range = 6000;
                            console.log('Thi_15_A_0K+501_中央":lan_s=121.2358054;lat=25.10719397;');
                            break;
                        case "大安溪3": lan_s = 121.2308863; lat = 25.10769087; range = 6000;
                            console.log('Thi_15_A_1K+000_中央":lan_s=121.2308863;lat=25.10769087;');
                            break;
                    }
                }
                // 臺北分局
                if (thb01_gategory == "Thi_2") {
                    switch (text3) {
                        case "大安溪11": lan_s = 121.2403051; lat = 25.10689088; range = 6000;
                            console.log('Thi_15_A_0K+042_中央":lan_s=121.2403051;lat=25.10689088;');
                            break;
                        case "大安溪12": lan_s = 121.2358054; lat = 25.10719397; range = 6000;
                            console.log('Thi_15_A_0K+501_中央":lan_s=121.2358054;lat=25.10719397;');
                            break;
                        case "大安溪13": lan_s = 121.2308863; lat = 25.10769087; range = 6000;
                            console.log('Thi_15_A_1K+000_中央":lan_s=121.2308863;lat=25.10769087;');
                            break;
                    }
                }
                // 臺南分局
                if (thb01_gategory == "Thi_3") {
                    switch (text3) {
                        case "大安溪21": lan_s = 121.2403051; lat = 25.10689088; range = 6000;
                            console.log('Thi_15_A_0K+042_中央":lan_s=121.2403051;lat=25.10689088;');
                            break;
                        case "大安溪22": lan_s = 121.2358054; lat = 25.10719397; range = 6000;
                            console.log('Thi_15_A_0K+501_中央":lan_s=121.2358054;lat=25.10719397;');
                            break;
                        case "大安溪23": lan_s = 121.2308863; lat = 25.10769087; range = 6000;
                            console.log('Thi_15_A_1K+000_中央":lan_s=121.2308863;lat=25.10769087;');
                            break;
                    }
                }

            }

            console.log('lat :', lat, ' , lan_s : ', lan_s);
            search_Icon_draw(lat, lan_s);
        },
        // 第一個欄位被更動後的反應動作
        onClickcolumn1_8: function (e) {

            console.log('column1_8:selected', $("#column1_8").find(":selected").val());
            var branch = $("#column1_8").find(":selected").val();
            console.log('branch :', branch);
            $.ajax({
                type: "GET",
                url: "php/SendAPI.php",
                dataType: "json",
                data: {
                    u: "https://data2.geodac.tw/geoinfo_api/api/geodac/corevectors/query/WA839M2" + "?branch=" + branch,
                },
                success: function (branch_data) {
                    console.log('branch data:', branch_data);
                    console.log('branch_data:', JSON.stringify(branch_data));
                    console.log('branch data.basin_name:', branch_data.filter(function (value, index, self) { return self.indexOf(value) == index; }));
                    var toAppend = '';
                    var list = [];

                    $.each(branch_data, function (i, o) {
                        console.log('i:', i, 'o:', o.basin_name);
                        list.push(o.basin_name);
                    });

                    var branch_data_filter = Array.from(new Set(list));
                    console.log("branch_data_filter :", branch_data_filter);

                    // console.log("branch_data_filter :", branch_data_filter);

                    $("#column2_8").find("option").remove();
                    $("#column3_8").find("option").remove();
                    $('#column2_8').append('<option>' + '選擇主集水區' + '</option>');
                    $('#column3_8').append('<option>' + '選擇子集水區' + '</option>');

                    $.each(branch_data_filter, function (i, o) {
                        console.log('i:', i, 'o:', o);
                        toAppend += '<option>' + o + '</option>';
                    });

                    $('#column2_8').append(toAppend);
                },
                // error: function (jqXHR) {
                //     alert("error");
                // }

            });
        },

        // 第二個欄位被更動後的反應動作
        onClickcolumn2_8: function (e) {
            console.log('onChangecolumn2_8 new');
            console.log('column1_8:selected', $("#column1_8").find(":selected").val());
            console.log('column2_8:selected', $("#column2_8").find(":selected").val());
            var main_branch = $("#column1_8").find(":selected").val();
            var child_branch = $("#column2_8").find(":selected").val();
            console.log('main_branch : ', main_branch);
            console.log('child_branch : ', child_branch);
            $.ajax({
                type: "GET",
                url: "php/SendAPI.php",
                dataType: "json",
                data: {
                    u: "https://data2.geodac.tw/geoinfo_api/api/geodac/corevectors/query/WA839M2" + "?branch=" + main_branch + "&basin_name=" + child_branch,
                },
                success: function (child_branch_data) {
                    console.log('branch data:', child_branch_data);
                    console.log('branch_data:', JSON.stringify(child_branch_data));

                    // console.log('branch data.basin_name:', child_branch_data.filter(function (value, index, self) { return self.indexOf(value) == index; }));

                    var child_toAppend = '';
                    var child_list = [];

                    $.each(child_branch_data, function (i, o) {
                        console.log('i:', i, 'o:', o.ws_name);
                        child_list.push(o.ws_name);
                    });

                    var child_branch_data_filter = Array.from(new Set(child_list));
                    console.log("child_branch_data_filter :", child_branch_data_filter);

                    // console.log("branch_data_filter :", branch_data_filter);

                    $("#column3_8").find("option").remove();
                    $('#column3_8').append('<option>' + '選擇子集水區' + '</option>');

                    $.each(child_branch_data_filter, function (i, o) {
                        console.log('i:', i, 'o:', o);
                        child_toAppend += '<option>' + o + '</option>';
                    });

                    // console.log("$('#column2_8').options.length; :", $('#column2_8').options.length);

                    $('#column3_8').append(child_toAppend);


                },
                // error: function (jqXHR) {
                //     alert("error");
                // }


            });
        },
        onClickcolumn3_8: function (e) {
            console.log('onChangecolumn3_8 new');

            var branch = $("#column1_8").find(":selected").val();
            var basin_name = $("#column2_8").find(":selected").val();
            var ws_name = $("#column3_8").find(":selected").val();

            console.log('branch column1_8:selected', branch);
            console.log('basin_name column2_8:selected', basin_name);
            console.log('ws_name column3_8:selected', ws_name);
            if (ws_name != "選擇子集水區") {
                $.ajax({
                    type: "GET",
                    url: "php/SendAPI.php",
                    dataType: "json",
                    data: {
                        u: "https://data2.geodac.tw/geoinfo_api/api/geodac/corevectors/query/WA839M2" + "?branch=" + branch + "&basin_name=" + basin_name + "&ws_name=" + ws_name,
                    },
                    success: function (ws_data) {
                        console.log('ws_data :', ws_data);
                        console.log('ws_data:', JSON.stringify(ws_data));

                        console.log('ws_data.geom:', ws_data[0].geom);

                        geojsonObject = JSON.stringify(ws_data[0].geom);
                        //將轉換好的內容丟給下一級處理
                        console.log('geojsonObject:', geojsonObject);

                        $.each(ws_data, function (i, o) {
                            console.log('i:', i, 'o:', o.geom);
                            console.log('i:', i, 'o:', o.geom.coordinates);
                            console.log('i:', i, 'o:', o.geom.coordinates[0][0][0]);
                            console.log('i:', i, 'x :', o.geom.coordinates[0][0][0][0]);
                            x = o.geom.coordinates[0][0][0][0];
                            console.log('i:', i, 'y :', o.geom.coordinates[0][0][0][1]);
                            y = o.geom.coordinates[0][0][0][1];
                        });

                        search_Icon_draw_Polygon(y, x, ws_data);
                    },
                    // error: function (jqXHR) {
                    //     alert("error");
                    // }

                });
            }
        },
    },
    created() {
        //生成父子連結        
        function node(name, child) {
            this.name = name;
            this.child = child;
        }
        //頁面連結
        function dataHierarchy() {
            // 主集水區類別 : 臺中分局
            var Thi_1 = new Array(); var i = 0;
            Thi_1[i++] = new node("大安溪1");
            Thi_1[i++] = new node("大安溪2");
            Thi_1[i++] = new node("大安溪3");

            // 主集水區類別 : 臺北分局
            var Thi_2 = new Array(); var i = 0;
            Thi_2[i++] = new node("大安溪11");
            Thi_2[i++] = new node("大安溪12");
            Thi_2[i++] = new node("大安溪13");

            // 主集水區類別 : 臺南分局
            var Thi_3 = new Array(); var i = 0;
            Thi_3[i++] = new node("大安溪21");
            Thi_3[i++] = new node("大安溪22");
            Thi_3[i++] = new node("大安溪23");

            // 頁面連結所有分局類別
            var output = new Array();
            var i = 0;
            output[i++] = new node("臺中分局", Thi_1);
            output[i++] = new node("臺北分局", Thi_2);
            output[i++] = new node("臺南分局", Thi_3);

            return (output);
        }

        console.log('load');

        console.log('column1_8:selected', $("#column1_8").find(":selected").val());
        var branch = $("#column1_8").find(":selected").val();
        $.ajax({
            url: "https://data2.geodac.tw/geoinfo_api/api/geodac/corevectors/query/WA839M2",
        }).done(function (data) {
            console.log('data:', data);
            console.log('data:', JSON.stringify(data));
            console.log('column1_8:selected', $("#column1_8").find(":selected").val());
            var branch = $("#column1_8").find(":selected").val();
            $.ajax({
                url: "https://data2.geodac.tw/geoinfo_api/api/geodac/corevectors/query/WA839M2" + "?branch=" + branch,
            }).done(function (branch_data) {
                console.log('branch data:', branch_data);
                console.log('branch_data:', JSON.stringify(branch_data));
                console.log('branch data.basin_name:', branch_data.filter(function (value, index, self) { return self.indexOf(value) == index; }));
                var toAppend = '';
                var list = [];

                $.each(branch_data, function (i, o) {
                    console.log('i:', i, 'o:', o.basin_name);
                    list.push(o.basin_name);
                });

                var branch_data_filter = Array.from(new Set(list));
                console.log("branch_data_filter :", branch_data_filter);

                $.each(branch_data_filter, function (i, o) {
                    console.log('i:', i, 'o:', o);
                    toAppend += '<option>' + o + '</option>';
                });

                $('#column2_8').append(toAppend);
            });

        });

        //原始Js
        dataTree_8 = dataHierarchy();
        console.log("load_location_8");
    },
    template:
        ` 
	<div> 
		<div id="vue_load_location_8"> 
			<form id="theForm_8">
			<table border=0 style="background-color:#FF4500">
				<tr>
					<th>分局名稱</th>
					<th>主集水區數</th>
                    <th>子集水區數</th>
				</tr>
				<td align=center>
					<!--   // 分局 所有下拉選單 類別 :   ********-->
					<select id="column1_8" @click="onClickcolumn1_8($event)">      
                        <option >選擇分局</option>
                        <option value="臺中分局">臺中分局</option>
                        <option value="臺北分局">臺北分局</option>
                        <option value="臺南分局">臺南分局</option>   
                        <option value="南投分局">南投分局</option>   
                        <option value="臺東分局">臺東分局</option>    
                        <option value="花蓮分局">花蓮分局</option>  
                        
                               
					</select>
					<!--   // 集水區 所有下拉選單 類別 :   ********-->
				</td>
				<td align=center>
					<select id="column2_8" @click="onClickcolumn2_8($event)">
					    <option>選擇主集水區</option>
				    </select>
				</td>  
                <td align=center>
					<select id="column3_8" @change="onClickcolumn3_8($event)">
					    <option>選擇子集水區</option>
				    </select>
				</td>        
			</table>
			</form>      
		</div>
	</div>
	`
})

/********* 20220510 add ***********/
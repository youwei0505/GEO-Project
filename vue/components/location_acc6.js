/********* add 20220709 youwei ***********/
//功能，批次功能定位選單
Vue.component("button-counter", {
  template:
    `
  <div id="button-counter">
    <ul>
      <table id="location_68" class="table table-bordered" style="font-size: 0.6rem;">
      <thead>
      
      <button class="btn btn-warning" @click="kml_output"  style="width: 100%;"  variant="primary" >KML</button>
      <br>
      <button class="btn btn-warning" @click="clear"  style="width: 100%;"  variant="info" >清除</button>
      
      <li v-for="item in newlist" :key="item.name">
      <tr>
        <td style="width: 69.29px; text-align: center; padding: 0.5rem 0px;">
        <button class="btn btn-default btn-circle gfLocateCsv_locateOne" data-x="120.4444" data-y="23.55555" data-title="test2" data-descript="<p>desc111</p>" data-srs="EPSG:4326"
        @click=onButtonClick_Search_Icon_locate(item.y,item.x,item.type,newlist) > {{item.name}}
            <i class="mdi mdi-map-marker" title="定位"></i>
        </button>
        </td>
        <td style=" width: 69.29px; text-align: center; padding: 0.5rem 0px;">{{item.title}}</td>
        <td style=" width: 69.29px; text-align: center; padding: 0.5rem 0px;">{{item.desc}}</td>
      </tr>
      </li>
      </thead>
      </table>
    </ul>
  </div>
  `
  ,
  methods: {
    onButtonClick_Search_Icon_locate: function (y, x, type, newlist) {
      // 檢查用
      // console.log('onButtonClick_Search_Icon_locate onButtonClick')
      // console.log("newlist ", newlist)
      // console.log("type ", type)
      // console.log("y ", y)
      // console.log("x ", x)
      if (type == 84) {
        console.log("type ", 84)
        search_Icon_draw2(y, x, newlist)
        search_Icon_locate(y, x)
      }
      else if (type == 97) {
        console.log("type ", 97)
        search_Icon_draw2(y, x, newlist)
        search_Icon_locate(y, x)
      }
      else if (type == 67) {
        console.log("type ", 67)
        twd67locexe2(y, x);
      }
      else {
        console.log("onButtonClick_Search_Icon_locate error !")
      }
      console.log('onButtonClick_Search_Icon_locate Click !')
    },
    clear: function () {
      console.log("  clear function : in append !")
      console.log(" $list in append", $list)
      console.log(" this.newlist in append", this.newlist)
      var new_list = []
      var length = $list.length
      for (let i = $list.length; i > 1; i--) {
        $list.pop();
        search_Icon_draw_clear(i - 2)
      }
      this.newlist = $list
      console.log("$list in append", $list)
      console.log("this.newlist length in append", length)
    },
    kml_output: function () {
      // Function:
      //	將批次定位所讀取到的資料:標題和說明都可以另外輸出成kml檔案
      // History:
      //  2022/11/30
      // Author
      //  Youwei

      // 將所有的$list      
      // 1.原有的方法，會導致記憶體位置衝突，導致下載後無法進行清除的功能
      // let kml_data = $list
      // 2.深拷貝(Deep Copy)
      // 複製整個值包含至深層，存進獨立的記憶體位置，不影響本來的參考
      // 陣列值/物件值內容不能包含 function 或 RegExp ...等
      // JSON.stringify() 先轉成字串;再JSON.parse() 再轉回原本的 物件/ 陣列
      // 陣列與物件都可多維/多層拷貝
      // from:https://eudora.cc/posts/210430/
      let kml_data = JSON.parse(JSON.stringify($list))
      //移除第一個不需要用到的，此為標題列，不需要跟讀取的資料一並刪除
      delete kml_data[0];
      // 檢查用
      // console.log("kml_data = ", kml_data)
      // console.log("kml_data.length = ", kml_data.length)

      //要寫入kml的資料，kml檔案的開頭
      let kml_text = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \n"
      kml_text = kml_text + "<Document> \n" + " \t <Folder> \n" + " \t\t <name>批次定位</name> \n"

      // 印出當前批次定位所有的資料，並且依序讀取和加入所需要符合的kml格式
      kml_data.forEach(element => {
        // 檢查用
        // console.log(element.desc, element.title, element.type, element.x, element.y)
        // 印出所需要的資料
        kml_text = kml_text +
          " \t \t \t <Placemark> \n" +
          " \t \t \t \t <name>" + String(element.title) + "</name> \n" +
          " \t \t \t \t <description>" + String(element.desc).split('\r')[0] + "</description> \n" +
          " \t \t \t \t <type>" + String(element.type) + "</type> \n" +
          " \t \t \t \t <Point> \n" +
          " \t \t \t \t \t <coordinates>" + String(element.x) + " ," + String(element.y) + "</coordinates> \n" +
          " \t \t \t \t </Point> \n" +
          " \t \t \t </Placemark> \n"
      });
      //要寫入kml的資料，kml結尾
      kml_text = kml_text + " \t </Folder> \n" + "</Document> \n"

      // 下載的kml檔案的名稱
      var kml_file = "Data0000.kml"

      //下載的過程
      let element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(kml_text))
      element.setAttribute('download', kml_file)
      element.style.display = 'none'
      element.click()

    },
  },
  created() {
    function clear() {
      console.log("$list in append", $list)
    }
    this.newlist = $list

    console.log("$list in append", $list)
    console.log("this.newlist in append", this.newlist)

  }
  ,
  // 需要用到，不能刪除
  data() {
    return {
      count: 0,
      text: {
        text1: 'text 111',
        text2: 'text 222',
      },
      text2: {
        text1: 'text 111',
        text2: 'text 222',
      },
      newlist: [],
    }
  }
});

var $list = []

//功能6，批次定位
Vue.component('load_location_6', {
  data: {
    fileinput: '',
    WGS84Y1: '23.955921',
    WGS84X1: '120.68733',
    cells1_y: '',
    cells1_x: '',
    texts1_x: '',
    texts1_y: '',
    newAddText: '',
    nextTodoId: 4,
    data_table: []
  },
  data() {
    return {
      text: {
        text1: 'text 111',
        text2: 'text 222',
      },
      text2: {
        text1: 'text 111',
        text2: 'text 222',
      },
    }
  },
  methods: {
    onFileChange(e) {
      console.log("methods:  onFileChange")
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createInput(files[0]);
      console.log("files[0]", files[0]);
    },
    createInput(file) {
      let promise = new Promise((resolve, reject) => {
        var reader = new FileReader();
        var vm = this;
        reader.onload = e => {
          resolve((vm.fileinput = reader.result));
        };
        reader.readAsText(file);

      });

      promise.then(
        result => {
          /* handle a successful result */
          fileinput = this.fileinput
          console.log("this.fileinput", this.fileinput);
          console.log("fileinput", fileinput);
          this.castify(fileinput)
          console.log(" start to append the dom in vue/template");
          this.insert()
        },
        error => {
          /* handle an error */
          console.log("error", error);
        }
      );
    },
    // 分類種類
    castify(fileinput) {
      this.insert()



      console.log("\n\n\n castify \n\n\n ")
      console.log("this.data_list", this.data_list)
      var rows = fileinput.split(/[\n]/)
      console.log("rows", rows)
      var data = rows
      this.data_list = rows
      console.log("this.data_list", this.data_list)
      console.log("data.length", data.length)
      console.log("data", data)
      /*  */
      var type = fileinput.split("_")[0]
      console.log("type : ", type)

      if (type == "wgs84") {
        console.log(" castify type WGS84 ");

        var data_rows = data

        for (let i = 1; i < data.length - 1; i++) {
          console.log("rows[", i, "]", data_rows[i])
          this.cells = data_rows[i].split(",")
          console.log("cells", this.cells)
          console.log("data_table", this.data_table)

          $list.push({
            name: type + i,
            title: this.cells[2],
            desc: this.cells[3],
            x: this.cells[1],
            y: this.cells[0],
            type: 84,
            number: 20,
          })

          console.log("this.cells[0]", this.cells[0])
          console.log("this.cells[1]", this.cells[1])
          console.log("this.cells[2]", this.cells[2])
          console.log("this.cells[3]", this.cells[3])
          console.log(" i  ", i)

        }
      }
      else if (type == "97") {
        console.log(" castify type TWD97 ");

        var data_rows = data

        for (let i = 1; i < data.length - 1; i++) {
          console.log(" i  ", i)

          console.log("rows[", i, "]", data_rows[i])
          this.cells = data_rows[i].split(",")
          console.log("cells", this.cells)
          console.log("data_table", this.data_table)

          console.log("this.cells[0]", this.cells[0])
          console.log("this.cells[1]", this.cells[1])
          console.log("this.cells[2]", this.cells[2])
          console.log("this.cells[3]", this.cells[3])


          // 轉換
          // var itemloc = [twd97x, twd97y];
          var itemloc = [this.cells[0], this.cells[1]];
          var itemloc84 = jsto84(itemloc);
          console.log("itemloc84", itemloc84)



          $list.push({
            name: type + i,
            title: this.cells[2],
            desc: this.cells[3],
            x: itemloc84[1],
            y: itemloc84[0],
            type: 97,
            number: 20,
          })


          // this.insert()            
        }

        // twd97locexe2(this.TWD97Y,this.TWD97X);                                  
      }
      else if (type == "67") {
        console.log(" castify type TWD67 ");

        var data_rows = data

        for (let i = 1; i < data.length - 1; i++) {
          console.log(" i  ", i)

          console.log("rows[", i, "]", data_rows[i])
          this.cells = data_rows[i].split(",")
          console.log("cells", this.cells)
          console.log("data_table", this.data_table)

          console.log("this.cells[0]", this.cells[0])
          console.log("this.cells[1]", this.cells[1])
          console.log("this.cells[2]", this.cells[2])
          console.log("this.cells[3]", this.cells[3])


          // 轉換
          // var itemloc = [twd67x, twd67y];
          var itemloc = [this.cells[0], this.cells[1]];

          var a = 0.00001549, b = 0.000006521;

          var x67 = parseFloat(itemloc[0]) + 807.8 + a * parseFloat(itemloc[0]) + b * parseFloat(itemloc[1]);
          var y67 = parseFloat(itemloc[1]) - 248.6 + a * parseFloat(itemloc[1]) + b * parseFloat(itemloc[0]);

          itemloc[0] = x67;
          itemloc[1] = y67;

          var itemloc2 = [x67, y67];
          var itemloc84 = jsto84(itemloc2);
          console.log("itemloc84", itemloc84)



          $list.push({
            name: type + i,
            title: this.cells[2],
            desc: this.cells[3],
            x: itemloc84[1],
            y: itemloc84[0],
            type: 97,
            number: 20,
          })


          // this.insert()            
        }

        this.output_kml()
        // twd67locexe2(this.TWD67Y,this.TWD67X);

      }
      // error
      else {
        console.log("error");
      }
    },
    // 下載檔案
    download: function (name) {
      //## 透過ajax方式Post 至Action
      var ajaxRequest = $.ajax({
        type: "POST",
        url: 'https://3dterrain.geodac.tw:2048/convert',
        contentType: false,         // 告诉jQuery不要去這置Content-Type
        processData: false,         // 告诉jQuery不要去處理發送的數據
        data: data,
        success: function (msg) {
          console.log("download");


        }
      })
        .fail(function (err) {
          console.log(err)
          console.log("error");
        });
    },
    // 下載文件
    downloadLink84: function () {
      console.log("downloadLink")
      //window.location.href="vue/components/sample_84.txt";
      download("vue/components/sample_84.txt");

    },
    // 下載文件
    downloadLink67: function () {
      console.log("downloadLink")
      download("vue/components/sample_67.txt");
      //window.open("vue/components/sample_67.txt","_self")
    },
    // 下載文件
    downloadLink97: function () {
      console.log("downloadLink")
      download("vue/components/sample_97.txt");
      // window.open("vue/components/sample_97.txt","_self")
    },

    // onButtonClick_WGS84_okey: function (number) {

    //   console.log('onButtonClick_WGS84_okey onButtonClick')
    //   console.log("number", number)
    //   var i = number
    //   console.log("fileinput",this.fileinput) 
    //   console.log("data_list",this.data_list) 
    //   var data_rows = this.data_list 
    //   console.log("rows[",i,"]",data_rows[i]) 
    //   var cells = data_rows[i].split(",")
    //   console.log(cells)
    //   this.WGS84Y1 = cells[0]
    //   this.WGS84X1 = cells[1]
    //   console.log("this.WGS84Y1", this.WGS84Y1)
    //   console.log("this.WGS84X1", this.WGS84X1)
    //   search_Icon_draw2(this.WGS84X1,this.WGS84Y1)           
    //   },
    // onButtonClick_WGS84_okey2: function (number) {
    //   console.log('onButtonClick_WGS84_okey2 onButtonClick')
    //   console.log("number", number)
    //   var i = number
    //   console.log("fileinput",this.fileinput) 
    //   console.log("data_list",this.data_list) 
    //   var data_rows = this.data_list 
    //   console.log("rows[",i,"]",data_rows[i]) 
    //   var cells = data_rows[i].split(",")
    //   console.log(cells)
    //   this.WGS84Y1 = cells[0]
    //   this.WGS84X1 = cells[1]
    //   console.log("this.WGS84Y1", this.WGS84Y1)
    //   console.log("this.WGS84X1", this.WGS84X1)
    //   search_Icon_draw2(this.WGS84X1,this.WGS84Y1)     
    // },
    // updatetext: function(i) {
    //   console.log("updatetext")
    //   console.log(i)
    //   this.$set(this.text, 'text1', this.texts1_x)
    //   this.$set(this.text, 'text2', this.texts1_y)

    //   $("#location_6").append(`
    //   <tr>
    //   <td id="location_6_append" style="width: 50px; text-align: center; padding: 0.5rem 0px;">
    //   <button class="btn btn-default btn-circle gfLocateCsv_locateOne" data-x="120.4444" data-y="23.55555" data-title="test2" data-descript="<p>desc111</p>" data-srs="EPSG:4326"
    //   @click=onButtonClick_WGS84_okey(1) > test1
    //       <i class="mdi mdi-map-marker" title="定位"></i>
    //   </button>
    //   </td>
    //   <td style="text-align: center; padding: 0.5rem 0px;">{{text2.text1}}</td>
    //   <td style="text-align: center; padding: 0.5rem 0px;">{{text2.text2}}</td>
    //   </tr>
    //   `);

    //   $( "#location_6_append" ).on( "click", function() {

    //     console.log("location_6_append")
    //   });


    // },    
    // useless
    // addNewList: function(){
    //   this.lists.push({
    //     id:this.nextTodoId++,
    //     title:this.newAddText
    //   })
    //   this.newAddText=''
    // },      
    clear: function () {
      console.log("  clear \n\n\n")
    },
    insert: function () {

      const ButtonCounter = Vue.component("button-counter"); // 只能查找到全局註冊到組件
      const instance = new ButtonCounter();
      instance.$mount("#insert-container");

    }
  },
  computed: {

  },
  created() {
    function clear() {
      console.log("$list in outside", $list)
    }
    clear()
    $list.unshift({
      name: "點擊定位",
      title: "標題",
      desc: "說明",
      x: '',
      y: '',
      type: 0,
      number: 56,
    })

  },
  template:
    `
    <div id="containerLocateBatch"
        style="width: 200px; background: transparent; overflow: hidden; height: 1200px; padding: 0px; margin: 0px;">
        
        <div class="gfLocateCsv_uploadContainer" style="height: 250px; ">
          <form enctype="multipart/form-data">
              <input type="file" @change="onFileChange">
          </form>
          <button class="btn btn-success btn-round" @click="downloadLink84" style="width: 100%; margin-top: 10px;">
              <i class="mdi mdi-cloud-download"> WGS84範例下載</i>
          </button>
          <button class="btn btn-success btn-round" @click="downloadLink97" style="width: 100%; margin-top: 10px;">
              <i class="mdi mdi-cloud-download"> TWD97範例下載</i>
          </button>
          <button class="btn btn-success btn-round" @click="downloadLink67" style="width: 100%; margin-top: 10px;">
              <i class="mdi mdi-cloud-download"> TWD67範例下載</i>
          </button>
          <p style="padding: 10px;">請依據範例檔案中的格式填入對應的座標數值，完成後上傳即可定位。</p>
        </div>
        
        
        
            <div id="insert-container">
            </div>
        </div>
    </div>
    `
}).$mount("#containerLocateBatch");

/********* add 20220709 youwei ***********/

// 暫時沒用到的
// <button @click="insert">click to insert button-counter comonent</button>

// <br>
// <br>
// <br>
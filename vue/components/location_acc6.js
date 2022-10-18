/********* add 20220709 youwei ***********/
//功能，批次功能定位選單
Vue.component("button-counter", {  
  template: 
  `
  <div id="button-counter">
    <ul>
      <table id="location_68" class="table table-bordered" style="font-size: 0.6rem;">
      <thead>
      
      <button class="btn btn-warning" @click="clear"  style="width: 100%;">清除</button>
      
      <li v-for="item in newlist" :key="item.name">
      <tr>
        <td style="width: 69.29px; text-align: center; padding: 0.5rem 0px;">
        <button class="btn btn-default btn-circle gfLocateCsv_locateOne" data-x="120.4444" data-y="23.55555" data-title="test2" data-descript="<p>desc111</p>" data-srs="EPSG:4326"
        @click=onButtonClick_WGS84_okey_a(item.y,item.x,item.type,newlist) > {{item.name}}
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
    onButtonClick_WGS84_okey_a: function (y,x,type,newlist) {      
      console.log('onButtonClick_WGS84_okey_a onButtonClick')
      console.log("newlist ", newlist)
      console.log("type ", type)
      console.log("y ", y)
      console.log("x ", x)
      if (type == 84)
      {
        console.log("type ", 84)
        search_Icon_draw2(y, x, newlist)   
        // search_Icon_draw(y, x)   
        search_Icon_locate( y, x)
      }   
      else if (type == 97)    
      {
        console.log("type ", 97)
        // search_Icon_draw(newlist[1].x, newlist[1].y);
        search_Icon_draw2( y, x, newlist)
        search_Icon_locate( y, x)
        // twd97locexe2( y, x, newlist)
        // search_Icon_locate( y, x)
        // search_Icon_locate( y, x)
      }  
      else if (type == 67)    
      {
        console.log("type ", 67)
        twd67locexe2( y, x);
      } 
      else  
      {
        console.log("error")
      } 
        console.log('onButtonClick_WGS84_okey_a onButtonClick')        
      },
    locate_function_initial: function (y,x,type,newlist) {      
      console.log('locate_function_initial begin')
      console.log("newlist ", newlist)
      console.log("type ", type)
      console.log("y ", y)
      console.log("x ", x)
      search_Icon_draw3(y, x, newlist)  
      console.log('locate_function_initial done')        
    },
    clear: function() {
      console.log("  clear in append \n\n\n")
      console.log("$list in append", $list)
      console.log("this.newlist in append", this.newlist)
      var new_list = []
      var length = $list.length
      for (let i = $list.length; i > 1; i--) {
        $list.pop();
        search_Icon_draw_clear(i-2)
        // maps[map_ind].removeLayer(Location_Icon_vectorLayer);
      }
      this.newlist = $list
      console.log("$list in append", $list)
      console.log("length in append", length)
      
      // search_Icon_draw_clear(length)
      console.log("length in append", length)
      // maps[map_ind].removeLayer(Location_Icon_vectorLayer);

      // clear function
      // search_Icon_draw_clear()
    },
  },
  created() {
    function clear() {
      console.log("$list in append", $list)
    }
    this.newlist = $list
    
    console.log("$list in append", $list)
    console.log("this.newlist in append", this.newlist)
    
    console.log(" \n ***  button-counter created *** \n")
    var y = 0 , x = 0, type = 84; 
    console.log("this.newlist : ", this.newlist)
    this.locate_function_initial(y,x,type,this.newlist); 
  }
  ,
  data() {
    return {
      count: 0,
      text : {
        text1: 'text 111',
        text2: 'text 222',
      }, 
      text2 : {
        text1: 'text 111',
        text2: 'text 222',
      },
      newlist: [],
    }
  }
});

var $list = [ ]

//功能6，批次定位
Vue.component('load_location_6', {                
  data: {
      fileinput: '',  
      WGS84Y1 : '23.955921',
      WGS84X1 : '120.68733',
      cells1_y : '', 
      cells1_x : '', 
      texts1_x : '', 
      texts1_y : '', 
      newAddText:'',
      nextTodoId: 4,
      data_table:[]
  },
  data () {
    return {      
      text : {
        text1: 'text 111',
        text2: 'text 222',
      }, 
      text2 : {
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
        console.log("files[0]",files[0]);
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
            console.log("this.fileinput",this.fileinput);
            console.log("fileinput",fileinput);   
            this.castify(fileinput)
            console.log(" start to append the dom in vue/template");
            this.insert()
          },
          error => {
            /* handle an error */ 
            console.log("error",error);
          }
        );
      },
      // 分類種類
      castify(fileinput) {
        this.insert()   
        
        console.log("\n\n\n castify \n\n\n ") 
        console.log("this.data_list",this.data_list) 
        var rows = fileinput.split(/[\n]/) 
        console.log("rows",rows) 
        var data = rows  
        this.data_list = rows  
        console.log("this.data_list",this.data_list) 
        console.log("data.length",data.length)  
        console.log("data",data)   

        var type = fileinput.split("_")[0] 
        console.log("type : ",type)  

        if ( type == "wgs84" )
        {
            console.log(" castify type WGS84 "); 
            
            var data_rows = data             

            for (let i = 1; i < data.length - 1; i++) {
                console.log("rows[",i,"]",data_rows[i]) 
                this.cells = data_rows[i].split(",")
                console.log("cells", this.cells ) 
                console.log("data_table", this.data_table ) 

                $list.push({
                  name: type+i,
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
                console.log(" i  ",i)   
                            
            }
        }
        else if ( type == "97" )
        {
          console.log(" castify type TWD97 "); 

          var data_rows = data             

            for (let i = 1; i < data.length - 1; i++) {
                console.log(" i  ",i)  

                console.log("rows[",i,"]",data_rows[i]) 
                this.cells = data_rows[i].split(",")
                console.log("cells", this.cells ) 
                console.log("data_table", this.data_table ) 

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
                  name: type+i,
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
        else if ( type == "67" )
        {
          console.log(" castify type TWD67 "); 

          var data_rows = data             

            for (let i = 1; i < data.length - 1; i++) {
                console.log(" i  ",i)  

                console.log("rows[",i,"]",data_rows[i]) 
                this.cells = data_rows[i].split(",")
                console.log("cells", this.cells ) 
                console.log("data_table", this.data_table ) 

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
                  name: type+i,
                  title: this.cells[2],
                  desc: this.cells[3],
                  x: itemloc84[1],
                  y: itemloc84[0],
                  type: 97,
                  number: 20,
                })    

                
                // this.insert()            
            }

          // twd67locexe2(this.TWD67Y,this.TWD67X);
          
        }
        // error
        else
        {
            console.log("error");  
        } 
      },
      // 下載檔案
      download: function(name) {
        //## 透過ajax方式Post 至Action
        var ajaxRequest = $.ajax({
          type: "POST",
          url: 'https://3dterrain.geodac.tw:2048/convert',
          contentType: false,         // 告诉jQuery不要去這置Content-Type
          processData: false,         // 告诉jQuery不要去處理發送的數據
          data: data,
          success: function(msg){
              console.log("download");
          }
          })
          .fail(function(err) {
              console.log(err)
              console.log( "error");
          });
      },
      // 下載
      // 下載84文件
      downloadLink84: function() {
        console.log("downloadLink")
        //window.location.href="vue/components/sample_84.txt";
	      download("vue/components/sample_84.txt");		
      },
      // 下載67文件
      downloadLink67: function() {
        console.log("downloadLink")
		    download("vue/components/sample_67.txt");
        //window.open("vue/components/sample_67.txt","_self")
      },
      // 下載97文件
      downloadLink97: function() {
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
      clear: function() {
        console.log("  clear \n\n\n")        
      },
      insert: function() {

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
      desc:"說明",
      x:'',
      y:'',
      type:0,
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
    `
  }).$mount("#containerLocateBatch");

/********* add 20220709 youwei ***********/


/********* 20220510 add ***********/
//功能1，地址/地點定位
  Vue.component('load_location_1', {                
    //Props：由外向內傳入，特性為資料一更新，則傳入 data ，隨即更新頁面。
    props: {  // data from outside
      maps: null,
      map_ind: null,
      fun_slug: { type: String, default: 'Func_Use_Sup_1_1' },
      inputtext: null,
    },    
    data: function() {
        return {
          count: 0,
          text: null,
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
      Func_Use_Location_1_1: function(name) {
        console.log("Func_Use_Location_1_1");
        var t = this.text;
        console.log("text : ",t);
        Address_Location(t);
        //var t = Location_Acc1_Form.getFormData();
				//var p = "";
        /*
        for (var a in t) p += a+"@"+String(t[a])+"\n";
          Location_Acc1_Form_Reslut=p.split("@");
          console.log("Location_Acc1_Form_Reslut : ",Location_Acc1_Form_Reslut);          
          //Address_Location("23.11,121.25");
          Address_Location(Location_Acc1_Form_Reslut);
          console.log("Location_Acc1_Form_Reslut[1] : ",Location_Acc1_Form_Reslut[1]);  
        */ 
      },
      Func_Use_Location_1_2: function(name) {
        console.log("Func_Use_Location_1_2");
        maps[0].removeLayer(Location_Icon_vectorLayer);
        maps[1].removeLayer(Location_Icon_vectorLayer);
      },
      //檢測用
      log: function (e) {
        console.log(e.currentTarget);
        console.log(e);
      }, 
    },
    created() {
      /*
      // 建立測試HTMLcontent
      this.HTMLcontent = `<div id="test" >I'm section one</div>`
      // 創建dhtmlXWindows
      var dhxWins = new dhtmlXWindows();
      Location_w1 = dhxWins.createWindow("Location_w1", 400, 150, 300, 500);
      Location_w1.setText("定位工具");
      // 填入視窗標頭
      Location_Acc = Location_w1.attachAccordion();
      Location_Acc.addItem("a1", "地址/地點定位", true);
      Location_Acc.addItem("a3", "土石流潛勢溪流定位", true);
      Location_Acc.addItem("a4", "坐標系統定位");
      Location_Acc.addItem("a5", "地號定位查詢");
      Location_Acc.addItem("a7", "地址/地點定位(國土測繪中心)");
      */

      //console.log('國土測繪中心');

      //load_location.js
      

      
  },
  template: 
    ` 
    <div>         
      <div id="vue_load_location_1">   
        <label >查詢地址/地點</label>
        <br>
        <input name="Location_Acc1_Form" v-model="text" inputWidth="200" value="">        
        <br>
        <button type="button"  name= "okey" value='定位查詢' @click="Func_Use_Location_1_1($event)" >定位查詢</button>	
        <br>
        <label >查詢範例</label><br>
        <label >地址：南投縣南投市光華路6號</label><br>
        <label >景點：台北101大樓</label><br>
        <label >經緯度坐標：23.11,121.25</label><br>
        <button type="button"  name= "clear_mark" value='清除定位標記' @click="Func_Use_Location_1_2($event)" >清除定位標記</button>	
        <br>
      </div>
    </div>
    `
  })
/* 
  // <p>input text is: {{ text }}</p>
*/
/********* 20220510 add ***********/
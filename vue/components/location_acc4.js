/********* 20220510 add ***********/
  //2021/11/23 完成
  //功能4
  Vue.component('load_location_4', {                
    data () {
      return {
        WGS84Y : '23.955923',
        WGS84X : '120.687334',
        TWD97X : '252049.1',
        TWD97Y : '2544835.2',
        TWD67X : '251221.2',
        TWD67Y : '2545042.4'
       } 
     },
    methods: {
      onButtonClick_WGS84_okey: function (name) {
        console.log('onButtonClick_WGS84_okey onButtonClick');

        console.log('WGS84Y');
        console.log(this.WGS84Y);
        
        console.log('WGS84X');
        console.log(this.WGS84X);
        
        console.log('name');
        console.log(name);
        console.log(name.currentTarget);
        
        console.log("name == WGS84_okey");	
        search_Icon_draw(this.WGS84Y,this.WGS84X);  
        
      }, 
      onButtonClick_TWD97_okey: function (name) {
        console.log('onButtonClick_TWD97_okey onButtonClick');

        console.log('TWD97X');
        console.log(this.TWD97X);
        
        console.log('TWD97Y');
        console.log(this.TWD97Y);
        
        console.log('name');
        console.log(name);
        console.log(name.currentTarget);
        
        console.log("name == TWD97_okey");	
        twd97locexe(this.TWD97X,this.TWD97Y);  
      }, 
      onButtonClick_TWD67_okey: function (name) {
        console.log('onButtonClick_TWD67_okey onButtonClick');

        console.log('TWD67X');
        console.log(this.TWD67X);
        
        console.log('TWD67Y');
        console.log(this.TWD67Y);
        
        console.log('name');
        console.log(name);
        console.log(name.currentTarget);
        
        console.log("name == TWD67_okey");	
        twd67locexe(this.TWD67X,this.TWD67Y);  
      }, 
    },
    created() {
           
  },
  template: 
    ` 
    <div>         
      <div id="vue_load_location_4">    
        
        <div>
          <br> 
            <label>WGS84坐標定位</label>
         
		 <br> 
		    緯度 <input name="Location_Acc4_Form_WGS84Y" v-model="WGS84Y">
		  
          <br>
            經度 <input name="Location_Acc4_Form_WGS84X" v-model="WGS84X">
            
          <br>
           
          <button name="WGS84_okey" @click=onButtonClick_WGS84_okey>定位查詢</button>
        </div> 
        <br>
        <div>
          <br>
            <label>TWD97坐標定位</label>
            <br> 
            X坐標 <input name="Location_Acc4_Form_TWD97X" v-model="TWD97X">
            <br>
            Y坐標 <input name="Location_Acc4_Form_TWD97Y" v-model="TWD97Y">
            <br>
            
            
          <button name="TWD97_okey" @click=onButtonClick_TWD97_okey>定位查詢</button> 
        </div> 
        <div>
          <br>
          <label>TWD67坐標定位</label>
          <br> 
          X坐標 <input name="Location_Acc4_Form_TWD67X" v-model="TWD67X">
          
          <br>
          Y坐標 <input name="Location_Acc4_Form_TWD67Y" v-model="TWD67Y">
          <br>
          
          <button name="TWD67_okey" @click=onButtonClick_TWD67_okey>定位查詢</button> 
        </div> 
        <br>
      </div>
    </div>
    `
  })

// <div> Y坐標 {{WGS84Y}} </div> 
// <div> X坐標 {{WGS84X}} </div> 
// <div> Y坐標 {{TWD97X}} </div> 
// <div> X坐標 {{TWD97Y}} </div>
// <div> Y坐標 {{TWD67X}}</div>
// <div> X坐標 {{TWD67Y}} </div>
/********* 20220510 add ***********/
// houiline and toukyoken
// not recommended, they should be implemented by other ways
var vuedata_toukyoken_houiline = {
    // the shared data are recommended to be implemented in vuex
    maps: maps,
    map_ind: map_ind,
};

const vueapp_toukyoken_houiline = new Vue({
    el: '#vue_toukyoken_houiline',
    data: vuedata_toukyoken_houiline,
    methods: {
        fun_access_log(val) {
            fun_access_log(val);
        }
    }
});

// print file

// not recommended, they should be implemented by other ways
var vuedata_printfile = {
    // the shared data are recommended to be implemented in vuex
    maps: maps,
    map_ind: map_ind,
};

const vueapp_printfile = new Vue({
    el: '#vue_printfile',
    data: vuedata_printfile,
    methods: {
        fun_access_log(val) {
            fun_access_log(val);
        }
    }
});

var vue_scale_path = new Vue({
    el: '#vue_scale_path',
    data: {
		maps: null,
		map_ind: null
	},
	methods: {
        fun_access_log(val) {
            fun_access_log(val);
			console.log("call fun_access_log");
        }
    }
});

var vue_hillshade = new Vue({
    el: '#vue_hillshade',
    data: {
		maps: null,
		map_ind: null
	},
	methods: {
        fun_access_log(val) {
            fun_access_log(val);
			console.log("call fun_access_log");
        }
    }
});

var vue_Melton_ratio = new Vue({
    el: '#vue_Melton_ratio',
    data: {
		maps: null,
		map_ind: null
	},
	methods: {
        fun_access_log(val) {
            fun_access_log(val);
			console.log("call fun_access_log");
        }
    }
});

var vue_peak_discharge = new Vue({
    el: '#vue_peak_discharge',
    data: {
		maps: null,
		map_ind: null
	},
	methods: {
        fun_access_log(val) {
            fun_access_log(val);
			console.log("call fun_access_log");
        }
    }
});

/*********   20220510  add   ***********/ 

const vueapp_load_location_1 = new Vue({
    el: '#vue_load_location_1',
    methods: {        
        fun_access_log(val) {
            fun_access_log(val);
        }
    }
});

const vueapp_load_location_2 = new Vue({
    el: '#vue_load_location_2',
    methods: {        
        fun_access_log(val) {
            fun_access_log(val);
        }
    }
});


const vueapp_load_location_3 = new Vue({
    el: '#vue_load_location_3',
    methods: {        
        fun_access_log(val) {
            fun_access_log(val);
        }
    }
});


const vueapp_load_location_4 = new Vue({
    el: '#vue_load_location_4',
    methods: {        
        fun_access_log(val) {
            fun_access_log(val);
        }
    }
});

const vueapp_load_location_5 = new Vue({
    el: '#vue_load_location_5',
    methods: {        
        fun_access_log(val) {
            fun_access_log(val);
        }
    }
});

/********* add 20220709 youwei ***********/
//功能，批次功能定位選單
const vueapp_load_location_6 = new Vue({
    el: '#vue_load_location_6',
    methods: {        
        fun_access_log(val) {
            fun_access_log(val);
        }
    }
});
/********* add 20220709 youwei ***********/

const vueapp_load_location_7 = new Vue({
    el: '#vue_load_location_7',
    methods: {        
        fun_access_log(val) {
            fun_access_log(val);
        }
    }
});
/*********   20220510  add   ***********/ 
/********* 集水區定位 add 20220725 youwei ***********/

const vueapp_load_location_8 = new Vue({
    el: '#vue_load_location_8',
    methods: {        
        fun_access_log(val) {
            fun_access_log(val);
        }
    }
});
/********* 集水區定位 add 20220725 youwei ***********/

/****** 20220512 add ******/
var vue_contour = new Vue({
    el: '#vue_contour',
    data: {
  maps: null,
  map_ind: null
 },
 methods: {
        fun_access_log(val) {
            fun_access_log(val);
   console.log("call fun_access_log");
        }
    }
});

var vue_hillshadeAZ = new Vue({
    el: '#vue_hillshadeAZ',
    data: {
  maps: null,
  map_ind: null
 },
 methods: {
        fun_access_log(val) {
            fun_access_log(val);
   console.log("call fun_access_log");
        }
    }
});

var vue_get_route = new Vue({
    el: '#vue_get_route',
    data: {
  maps: null,
  map_ind: null
 },
 methods: {
        fun_access_log(val) {
            fun_access_log(val);
   console.log("call fun_access_log");
        }
    }
});

var vue_viewshed = new Vue({
    el: '#vue_viewshed',
    data: {
		maps: null,
		map_ind: null
	},
	methods: {
        fun_access_log(val) {
            fun_access_log(val);
			console.log("call fun_access_log");
        }
    }
});
/****** 20220512 add ******/
// 20220630 add
var vue_akadani = new Vue({
    el: '#vue_akadani',
    data: {
		maps: null,
		map_ind: null
	},
	methods: {
        fun_access_log(val) {
            fun_access_log(val);
			console.log("call fun_access_log");
        }
    }
});


var vuedata_sentinel2_api = {
    maps: maps,
    map_ind: map_ind
};

const vueapp_sentinel2_api = new Vue({
    el: '#vue_sentinel2_api',
    data:vuedata_sentinel2_api,
    methods: {
        fun_access_log(val) {
            fun_access_log(val);
        }
    }
});

var vuedata_sentinel2_compare_api = {
    maps: maps,
    map_ind: map_ind
};

const vueapp_sentinel2_compare_api = new Vue({
    el: '#vue_sentinel2_compare_api',
    data:vuedata_sentinel2_compare_api,
    methods: {
        fun_access_log(val) {
            fun_access_log(val);
        }
    }
});


var vuedata_sentinel2_sis_api = {
    maps: maps,
    map_ind: map_ind
};

const vueapp_sentinel2_sis_api = new Vue({
    el: '#vue_sentinel2_sis_api',
    data:vuedata_sentinel2_sis_api,
    methods: {
        fun_access_log(val) {
            fun_access_log(val);
        }
    }
});

var vuedata_subscene_image_api = {
    maps: maps,
    map_ind: map_ind
};

const vueapp_subscene_image_api = new Vue({
    el: '#vue_subscene_image_api',
    data:vuedata_subscene_image_api,
    methods: {
        fun_access_log(val) {
            fun_access_log(val);
        }
    }
});

var vuedata_dual_spectrum_api = {
    maps: maps,
    map_ind: map_ind
};

const vueapp_dual_spectrum_api = new Vue({
    el: '#vue_dual_spectrum_api',
    data:vuedata_dual_spectrum_api,
    methods: {
        fun_access_log(val) {
            fun_access_log(val);
        }
    }
});

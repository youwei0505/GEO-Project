// Variables
var world = {};
var lyr = [], mat = [], tex = [], jsons=[], labels=[], queryableObjs = [];
var labelVisible = true;
var option = {
	sole_height: 1.5,
	side: {color: 0xc7ac92},
	frame: {color: 0},
	label: {pointerColor: 0xc0c0d0, autoSize: false, fontSize: "10px"},
	qmarker: {r: 0.25, c:0xffff00, o:0.8}};

var ua = window.navigator.userAgent.toLowerCase();
var isIE = (ua.indexOf("msie") != -1 || ua.indexOf("trident") != -1);

var projector = new THREE.Projector();
var xAxis = new THREE.Vector3(1, 0, 0), zAxis = new THREE.Vector3(0, 0, 1);

// World class
World = function ( mapExtent, width, zExaggeration, zShift ) {
	this.mapExtent = mapExtent;
	this.width = width;
	this.height = width * (mapExtent[3] - mapExtent[1]) / (mapExtent[2] - mapExtent[0]);
	this.scale = width / (mapExtent[2] - mapExtent[0]);
	this.zExaggeration = zExaggeration;
	this.zScale = this.scale * zExaggeration;
	this.zShift = zShift;
};

World.prototype = {

	constructor: World,

	toMapCoordinates: function (x, y, z) {
		return {x : (x + this.width / 2) / this.scale + this.mapExtent[0],
						y : (y + this.height / 2) / this.scale + this.mapExtent[1],
						z : z / this.zScale - this.zShift};
	}

};

// MapLayer class
MapLayer = function ( params ) {
	for (var k in params) {
		this[k] = params[k];
	}
};

MapLayer.prototype = {

	constructor: MapLayer,

	meshes: function () {
		var m = [];
		if (this.type == "dem") {
			for (var i = 0, l = this.dem.length; i < l; i++) {
				m.push(this.dem[i].obj);

				//var aObjs = this.dem[i].aObjs || [];
				//for (var j = 0, k = aObjs.length; j < k; j++) m.push(aObjs[j]);
			}
		} else {
			for (var i = 0, l = this.f.length; i < l; i++) {
				this.f[i].objs.forEach(function (mesh) {
					m.push(mesh);
				});
			}
		}
		return m;
	},

	setVisible: function (visible) {
		if (this.type == "dem") {
			for (var i = 0, l = this.dem.length; i < l; i++) {
				this.dem[i].obj.visible = visible;

				var aObjs = this.dem[i].aObjs;
				if (aObjs !== undefined) {
					for (var j = 0, m = aObjs.length; j < m; j++) {
						aObjs[j].visible = visible;
					}
				}
			}
		} else {
			for (var i = 0, l = this.f.length; i < l; i++) {
				var f = this.f[i];
				f.obj.visible = visible;	// TODO: objs
				if (f.aObj !== undefined) f.aObj.visible = visible;
				if (f.aElem !== undefined) f.aElem.style.display = (visible) ? "block": "none";
			}
		}
	}

};


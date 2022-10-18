var labelVisible = true;
var option = {
    sole_height: 1.5,
    side: {color: 0xc7ac92},
    frame: {color: 0},
    label: {pointerColor: 0xc0c0d0, autoSize: false, fontSize: "10px"},
    qmarker: {r: 0.25, c:0xffff00, o:0.8}};

var ua = window.navigator.userAgent.toLowerCase();
var isIE = (ua.indexOf("msie") != -1 || ua.indexOf("trident") != -1);

// var projector = new THREE.Projector();
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

var container = document.getElementById('webgl');
var width = window.innerWidth, height = window.innerHeight;

    // parse URL parameters
var vars = parseParams();

if ("popup" in vars) {
    // open popup window
    var c = window.location.href.split("?");
    window.open(c[0] + "?" + c[1].replace(/&?popup/, ""), "popup", "width=" + vars.width + ",height=" + vars.height);
}
if (vars.width && vars.height) {
    // set canvas size
    container.style.width = vars.width + "px";
    container.style.height = vars.height + "px";
    width = vars.width;
    height = vars.height;
}

var renderer = new THREE.WebGLRenderer({antialias: true, alpha: (option.bgcolor === undefined)});
renderer.setSize(width, height);
renderer.setClearColor(option.bgcolor || 0, (option.bgcolor === undefined) ? 0 : 1);

var scene = new THREE.Scene();

// light
scene.add(new THREE.AmbientLight(0x999999));
var light = new THREE.DirectionalLight(0xffffff, 0.4);
light.position.set(-0.1, -0.3, 1);
scene.add(light);

// marker at queried point
var queryMarker = new THREE.Mesh(new THREE.SphereBufferGeometry(option.qmarker.r), new THREE.MeshLambertMaterial({color: option.qmarker.c/*, ambient: option.qmarker.c*/, opacity: option.qmarker.o, transparent: (option.qmarker.o < 1)}));
// var queryMarker = new THREE.Mesh(new THREE.SphereGeometry(option.qmarker.r), new THREE.MeshLambertMaterial({color: option.qmarker.c, ambient: option.qmarker.c, opacity: option.qmarker.o, transparent: (option.qmarker.o < 1)}));
queryMarker.visible = false;
scene.add(queryMarker);


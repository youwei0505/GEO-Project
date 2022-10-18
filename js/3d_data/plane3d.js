var geometry_plane;

setTimeout(function(){
var slider = document.getElementById("myRange");
    slider.oninput = function() {
        z_rate = this.value;
        var j = 0;
        var m = geometry_plane.vertices.length;
        while(j < m){
            geometry_plane.vertices[j].z = arr_h[j]*z_rate;
            j++;
        }
        geometry_plane.dynamic = true;
        geometry_plane.computeFaceNormals();
        geometry_plane.computeVertexNormals();
        geometry_plane.normalsNeedUpdate = true;
        geometry_plane.verticesNeedUpdate = true;
        document.getElementById("val_z").innerHTML = "高度倍率：" + z_rate;
    }
}, 7000); 


// Terrain material
var material;
var material_wireframe;
var plane;
var geometry = new THREE.BufferGeometry();
// var geometry = new THREE.Geometry();
plane = new THREE.Mesh(geometry, material);
// Terrain functions
function buildDEM(scene, layer, dem) {

    geometry_plane = new THREE.PlaneGeometry( dem.plane.width, dem.plane.height, dem.width - 1, dem.height - 1);
                                            
    console.log('dem.width - 1');
    console.log(dem.width - 1);
    console.log('dem.height - 1');
    console.log(dem.height - 1);
    // Filling of the DEM plane
    var j = 0;
    var m = geometry_plane.vertices.length;
    while(j < m){
        geometry_plane.vertices[j].z = dem.data[j]*z_rate;
        j++;
    }
   
    geometry_plane.dynamic = true;
    geometry_plane.computeFaceNormals();
    geometry_plane.computeVertexNormals();
    geometry_plane.normalsNeedUpdate = true;
    geometry_plane.verticesNeedUpdate = true;
    
    console.log("dem done");
    
    if (dem.m !== undefined) material = mat[dem.m].m;
    else {
        var texture;
        if (dem.t.src === undefined) {
            texture = createTexture(dem.t.data);
            }
        else {
            texture = THREE.ImageUtils.loadTexture(dem.t.src);
            texture.needsUpdate = true;
        }
        if (dem.t.o === undefined) dem.t.o = 1;
        material = new THREE.MeshPhongMaterial({map: texture, opacity: dem.t.o, transparent: (dem.t.o < 1)});
        material_wireframe = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true});
    }
    if (!isIE) material.side = THREE.DoubleSide;
    if(localStorage.getItem("wf_storage") == 0){
        plane = new THREE.Mesh(geometry_plane, material);
        queryableObjs = [];
    }
    else if(localStorage.getItem("wf_storage") == 1){
        // plane = new THREE.SceneUtils.createMultiMaterialObject(geometry_plane, [material, material_wireframe]);
        plane = new THREE.Mesh(geometry_plane, material);
        plane_wireframe = new THREE.Mesh(geometry_plane, material_wireframe);
        plane.add(plane_wireframe);
        queryableObjs = [];
    }
    if (dem.plane.offsetX != 0) plane.position.x = dem.plane.offsetX;
    if (dem.plane.offsetY != 0) plane.position.y = dem.plane.offsetY;
    plane.userData = [layer.index, 0];
    plane.needsUpdate = true;
    scene.add(plane);
    if (layer.q) queryableObjs.push(plane);
    dem.obj = plane;
}

function build_plane(scene)
{
    createMaterials();

    for (var i = 0, l = lyr.length; i < l; i++) {
        var layer = lyr[i];
        layer.index = i;
        if (layer.type == "dem") {
            console.log("wireframe")
            for (var j = 0, k = layer.dem.length; j < k; j++) {
                buildDEM(scene, layer, layer.dem[j]);
                layer.dem[j].aObjs = [];
            }
            console.log("wireframe done")
        }
    }
}



/**
* buildSides()
*	 - scene : scene in which we add sides
*	 - dem : a dem object
*	 - color : color of sides
*	 - sole_height : depth of bottom under zero
*
*	Creates sides and bottom of the DEM to give an impression of "extruding" 
*	and increase the 3D aspect.
*	It adds also lights to see correctly the meshes created.
*/
var plane_bottom;
var mesh_1;
var mesh_2;
var mesh_3;
var mesh_4;
var geom_s;

var altitudes = {
        'back': [],
        'left': [],
        'front': [],
        'right': []
    };

function buildSides(scene, dem, color, sole_height) {
    // Filling of altitudes dictionary
    var w = dem.width, h = dem.height;
    altitudes['back'] = dem.data.slice(0, w);
    altitudes['front'] = dem.data.slice(w * (h - 1));
    for (var y = 0; y < h; y++) {
        altitudes['left'].push(dem.data[y * w]);
        altitudes['right'].push(dem.data[(y + 1) * w - 1]);
    }

    // Material
    if (dem.s.o === undefined) dem.s.o = 1;

    var front_material = new THREE.MeshLambertMaterial({ color: color,
                                                            /*ambient: color,*/
                                                            opacity: dem.s.o,
                                                            transparent: (dem.s.o < 1)});
    var back_material;
    if (isIE) {	 // Shader compilation error occurs with double sided material on IE11
        back_material = front_material.clone();
        back_material.side = THREE.BackSide;
    }
    else {
        front_material.side = THREE.DoubleSide;
        back_material = front_material;
    }

    // Sides
    var side_width;
    for (var side in altitudes) {
        if (side == 'back' || side == 'front'){
            side_width = dem.plane.width;
        }
        else{
            side_width = dem.plane.height;
        }

        geom_s = new THREE.PlaneGeometry(side_width, 2 * sole_height, altitudes[side].length -1, 1);
        // Filling of the geometry vertices
        for (var i = 0, l = altitudes[side].length; i < l; i++) {
            geom_s.vertices[i].y = altitudes[side][i];
        }
        
        geom_s.dynamic = true;
        geom_s.computeFaceNormals();
        geom_s.computeVertexNormals();
        geom_s.normalsNeedUpdate = true;
        geom_s.verticesNeedUpdate = true;

        // Rotation(s) and translating(s) according to the side
        switch (side) {
            case 'back' :
                mesh_1 = new THREE.Mesh(geom_s, back_material);
                mesh_1.position.y = dem.plane.height/2;
                mesh_1.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
                break;
            case 'left' :
                mesh_2 = new THREE.Mesh(geom_s, front_material);
                mesh_2.position.x = -dem.plane.width/2;
                mesh_2.rotateOnAxis(new THREE.Vector3(0,0,1), -Math.PI/2);
                mesh_2.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
                break;
            case 'front' :
                mesh_3 = new THREE.Mesh(geom_s, front_material);
                mesh_3.position.y = -dem.plane.height/2;
                mesh_3.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
                break;
            case 'right' :
                mesh_4 = new THREE.Mesh(geom_s, back_material);
                mesh_4.position.x = dem.plane.width/2;
                mesh_4.rotateOnAxis(new THREE.Vector3(0,0,1), -Math.PI/2);
                mesh_4.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
                break;
        }

        scene.add(mesh_1);
        scene.add(mesh_2);
        scene.add(mesh_3);
        scene.add(mesh_4);
        dem.aObjs.push(mesh_1);
        dem.aObjs.push(mesh_2);
        dem.aObjs.push(mesh_3);
        dem.aObjs.push(mesh_4);

        }

    // Bottom
    var geom_bottom = new THREE.PlaneGeometry(dem.plane.width, dem.plane.height, 1, 1);
    plane_bottom = new THREE.Mesh(geom_bottom, back_material);
    plane_bottom.position.z = -sole_height;
    scene.add(plane_bottom);
    dem.aObjs.push(plane_bottom);

    // Additional lights
    var light2 = new THREE.DirectionalLight(0xffffff, 0.3);
    light2.position.set(dem.plane.width, -dem.plane.height / 2, -10);
    scene.add(light2);

    var light3 = new THREE.DirectionalLight(0xffffff, 0.3);
    light3.position.set(-dem.plane.width, dem.plane.height / 2, -10);
    scene.add(light3);
}

// Create a texture with image data and update texture when the image has been loaded
function createTexture(imageData) {
    var texture, image = new Image();
    image.onload = function () { texture.needsUpdate = true; };
    image.src = imageData;
    texture = new THREE.Texture(image);
    return texture;
}


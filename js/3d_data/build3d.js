
// Call this once to create materials
function createMaterials() {
    var material;
    for (var i = 0, l = mat.length; i < l; i++) {
        var m = mat[i];
        console.log('******** m test **************');
        console.log(m.c);
        if (m.type == 0) {
            material = new THREE.MeshLambertMaterial({color:m.c, ambient:m.c});
        }
        else if (m.type == 1) {
            material = new THREE.LineBasicMaterial({color:m.c});
        }
        else {		// type == 2
            material = new THREE.MeshLambertMaterial({color:m.c, ambient:m.c, wireframe:true});
        }
        if (m.o !== undefined && m.o < 1) {
            material.opacity = m.o;
            material.transparent = true;
        }
        mat[i].m = material;
    }
}

var m_loader = new THREE.TextureLoader();
m_loader.crossOrigin = '';
function buildFrame(scene, dem, color, sole_height) {
    var line_mat = new THREE.LineBasicMaterial({color:color});

    // horizontal rectangle at bottom
    var hw = dem.plane.width / 2, hh = dem.plane.height / 2, z = -sole_height;
    let geo_vertices = [];
    geo_vertices.push(-hw, -hh, z);
    geo_vertices.push(hw, -hh, z);
    geo_vertices.push(hw, hh, z);
    geo_vertices.push(-hw, hh, z);
    geo_vertices.push(-hw, -hh, z);
    var geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(geo_vertices, 3)
    )

    // var geometry = new THREE.Geometry();
    // geometry.vertices.push(new THREE.Vector3(-hw, -hh, z));
    // geometry.vertices.push(new THREE.Vector3(hw, -hh, z));
    // geometry.vertices.push(new THREE.Vector3(hw, hh, z));
    // geometry.vertices.push(new THREE.Vector3(-hw, hh, z));
    // geometry.vertices.push(new THREE.Vector3(-hw, -hh, z));

    var obj = new THREE.Line(geometry, line_mat);
    scene.add(obj);
    dem.aObjs.push(obj);

    // vertical lines at corners
    var pts = [[-hw, -hh, dem.data[dem.data.length - dem.width]],
                        [hw, -hh, dem.data[dem.data.length - 1]],
                        [hw, hh, dem.data[dem.width-1]],
                        [-hw, hh, dem.data[0]]];
    for (var i = 0; i < 4; i++) {
        var pt = pts[i];
        let geo_vertices = [];
        geo_vertices.push(pt[0], pt[1], pt[2]);
        geo_vertices.push(pt[0], pt[1], z);
        geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(geo_vertices, 3)
        )
        // geometry = new THREE.Geometry();
        // geometry.vertices.push(new THREE.Vector3(pt[0], pt[1], pt[2]));
        // geometry.vertices.push(new THREE.Vector3(pt[0], pt[1], z));

        obj = new THREE.Line(geometry, line_mat);
        scene.add(obj);
        dem.aObjs.push(obj);
    }
}

// Vector functions
function buildPointLayer(scene, layer) {
    var f, geometry, obj;
    var deg2rad = Math.PI / 180;
    for (var i = 0, l = layer.f.length; i < l; i++) {
        // each feature in the layer
        f = layer.f[i];
        f.objs = [];
        f.pts.forEach(function (pt) {
            if (layer.objType == "Cube") geometry = new THREE.CubeGeometry(f.w, f.h, f.d);
            else if (layer.objType == "Cylinder" || layer.objType == "Cone") geometry = new THREE.CylinderGeometry(f.rt, f.rb, f.h);
            else geometry = new THREE.SphereBufferGeometry(f.r);
            // else geometry = new THREE.SphereGeometry(f.r);

            obj = new THREE.Mesh(geometry, mat[f.m].m);
            obj.position.set(pt[0], pt[1], pt[2]);
            if (f.rotateX) obj.rotation.x = f.rotateX * deg2rad;
            obj.userData = [layer.index, i];
            scene.add(obj);
            if (layer.q) queryableObjs.push(obj);
            f.objs.push(obj);
        });
    }
}

function buildJSONPointLayer(scene, layer) {
    var manager = new THREE.LoadingManager();
    var loader = new THREE.JSONLoader(manager);
    var f, obj, json_objs=[];
    var deg2rad = Math.PI / 180;

    for (var i = 0, l = layer.f.length; i < l; i++) {
        // each feature in the layer
        f = layer.f[i];
        f.objs = [];
        if (json_objs[f.json_index] === undefined) {
            var result = loader.parse(JSON.parse(jsons[f.json_index]));
            json_objs[f.json_index] = new THREE.Mesh(result.geometry, result.materials[0]);
        }
        f.pts.forEach(function (pt) {
            obj = json_objs[f.json_index].clone();
            obj.position.set(pt[0], pt[1], pt[2]);
            if (f.rotateX || f.rotateY || f.rotateZ)
                obj.rotation.set((f.rotateX || 0) * deg2rad, (f.rotateY || 0) * deg2rad, (f.rotateZ || 0) * deg2rad);
            if (f.scale) obj.scale.set(f.scale, f.scale, f.scale);
            obj.userData = [layer.index, i];
            scene.add(obj);
            if (layer.q) queryableObjs.push(obj);
            f.objs.push(obj);
        });
    }
}

function buildLineLayer(scene, layer) {
    var f, geometry, obj, userData;
    for (var i = 0, l = layer.f.length; i < l; i++) {
        // each feature in the layer
        f = layer.f[i];
        f.objs = [];
        userData = [layer.index, i];

        if (layer.objType == "Line") {
            f.lines.forEach(function (line) {
                let geo_vertices = [];
                line.forEach(function (pt) {
                    geo_vertices.push(pt[0], pt[1], pt[2]);
                });
                geometry = new THREE.BufferGeometry();
                geometry.setAttribute(
                    'position',
                    new THREE.Float32BufferAttribute(geo_vertices, 3)
                )
                // geometry = new THREE.Geometry();
                // line.forEach(function (pt) {
                //     geometry.vertices.push(new THREE.Vector3(pt[0], pt[1], pt[2]));
                // });
                obj = new THREE.Line(geometry, mat[f.m].m);
                obj.userData = userData;
                scene.add(obj);
                if (layer.q) queryableObjs.push(obj);
                f.objs.push(obj);
            });
        }
        else if (layer.objType == "Pipe" || layer.objType == "Cone") {
            var hasJoints = (layer.objType == "Pipe");
            var pt, pt0 = new THREE.Vector3(), pt1 = new THREE.Vector3(), sub = new THREE.Vector3();
            f.lines.forEach(function (line) {
                for (var j = 0, m = line.length; j < m; j++) {
                    pt = line[j];
                    pt1.set(pt[0], pt[1], pt[2]);

                    if (hasJoints) {
                        geometry = new THREE.SphereBufferGeometry(f.rb);
                        // geometry = new THREE.SphereGeometry(f.rb);
                        obj = new THREE.Mesh(geometry, mat[f.m].m);
                        obj.position.copy(pt1);
                        obj.userData = userData;
                        scene.add(obj);
                        if (layer.q) queryableObjs.push(obj);
                        f.objs.push(obj);
                    }

                    if (j) {
                        sub.subVectors(pt1, pt0);
                        geometry = new THREE.CylinderGeometry(f.rt, f.rb, pt0.distanceTo(pt1));
                        obj = new THREE.Mesh(geometry, mat[f.m].m);
                        obj.position.set((pt0.x + pt1.x) / 2, (pt0.y + pt1.y) / 2, (pt0.z + pt1.z) / 2);
                        obj.rotation.set(Math.atan2(sub.z, Math.sqrt(sub.x * sub.x + sub.y * sub.y)), 0, Math.atan2(sub.y, sub.x) - Math.PI / 2, "ZXY");
                        obj.userData = userData;
                        scene.add(obj);
                        if (layer.q) queryableObjs.push(obj);
                        f.objs.push(obj);
                    }
                    pt0.copy(pt1);
                }
            });
        }
    }
}

function buildPolygonLayer(scene, layer) {
    var f, polygon, boundary, pts, shape, geometry, obj;
    for (var i = 0, l = layer.f.length; i < l; i++) {
        // each feature in the layer
        f = layer.f[i];
        f.objs = [];
        for (var j = 0, m = f.polygons.length; j < m; j++) {
            polygon = f.polygons[j];
            for (var k = 0, n = polygon.length; k < n; k++) {
                boundary = polygon[k];
                pts = [];
                boundary.forEach(function(pt) {
                    pts.push(new THREE.Vector2(pt[0], pt[1]));
                });
                if (k == 0) {
                    shape = new THREE.Shape(pts);
                } else {
                    shape.holes.push(new THREE.Path(pts));
                }
            }
            geometry = new THREE.ExtrudeGeometry(shape, {bevelEnabled:false, amount:f.h});
            obj = new THREE.Mesh(geometry, mat[f.m].m);
            obj.position.z = f.zs[j];
            obj.userData = [layer.index, i];
            scene.add(obj);
            if (layer.q) queryableObjs.push(obj);
            f.objs.push(obj);
        }
    }
}

function buildLabels(scene) {
    var f, pts, e, h, pt0, pt1, geometry;
    var container = document.getElementById("webgl");
    var line_mat = new THREE.LineBasicMaterial({color:option.label.pointerColor});
    for (var i = 0, l = lyr.length; i < l; i++) {
        var label = lyr[i].l;
        if (label === undefined) continue;

        for (var j = 0, m = lyr[i].f.length; j < m; j++) {
            f = lyr[i].f[j];
            if (lyr[i].type == "point") pts = f.pts;
            else if (lyr[i].type == "polygon") pts = f.centroids;
            else continue;

            f.aElems = [];
            f.aObjs = [];
            pts.forEach(function (pt) {
                // create div element for label
                e = document.createElement("div");
                e.appendChild(document.createTextNode(f.a[label.i]));
                e.className = "label";
                container.appendChild(e);

                if (label.ht == 1) h = label.v;	// fixed height
                else if (label.ht == 2) h = pt[2] + label.v;	// height from point / bottom
                else if (label.ht == 3) h = pt[2] + f.h + label.v;	// height from top (extruded polygon)
                else h = (f.a[label.ht - 100] + world.zShift) * world.zScale + label.v;	// data-defined + addend

                pt0 = new THREE.Vector3(pt[0], pt[1], pt[2]);
                pt1 = new THREE.Vector3(pt[0], pt[1], h);

                // create pointer
                let geo_vertices = [];
                geo_vertices.push(pt[0], pt[1], pt[2]);
                geo_vertices.push(pt[0], pt[1], h);

                geometry = new THREE.BufferGeometry();

                geometry.setAttribute(
                    'position',
                    new THREE.Float32BufferAttribute(geo_vertices, 3)
                )
                // geometry = new THREE.Geometry();
                // geometry.vertices.push(pt1);
                // geometry.vertices.push(pt0);
                obj = new THREE.Line(geometry, line_mat);
                obj.userData = [i, j];
                scene.add(obj);

                f.aElems.push(e);
                f.aObjs.push(obj);

                labels.push({e:e, obj:obj, pt:pt1, l:i, f:j});
            });
        }
    }
}

function buildModels(scene) {    
    createMaterials();

    for (var i = 0, l = lyr.length; i < l; i++) {
        var layer = lyr[i];
        layer.index = i;
        if (layer.type == "dem") {
            console.log("build model");
            for (var j = 0, k = layer.dem.length; j < k; j++) {
                
                buildDEM(scene, layer, layer.dem[j]);
                layer.dem[j].aObjs = [];

                // Build sides, bottom and frame
                if (layer.dem[j].s !== undefined) buildSides(scene, layer.dem[j], option.side.color, option.sole_height);
                if (layer.dem[j].frame) buildFrame(scene, layer.dem[j], option.frame.color, option.sole_height);
            }
            console.log("build model");
        }
        else if (layer.type == "point") {
            if (layer.objType == "JSON model") buildJSONPointLayer(scene, layer);
            else buildPointLayer(scene, layer);
        }
        else if (layer.type == "line") {
            buildLineLayer(scene, layer);
        }
        else if (layer.type == "polygon") {
            buildPolygonLayer(scene, layer);
        }
    }

    buildLabels(scene);
}

// update label positions
function updateLabels() {
    if (labels.length == 0 || !labelVisible) return;

    var widthHalf = width / 2, heightHalf = height / 2;
    var autosize = option.label.autoSize;

    var c2t = controls.target.clone().sub(camera.position);
    var c2l = new THREE.Vector3();
    var v = new THREE.Vector3();

    // make a list of [label index, distance to camera]
    var idx_dist = [];
    for (var i = 0, l = labels.length; i < l; i++) {
        idx_dist.push([i, camera.position.distanceTo(labels[i].pt)]);
    }

    // sort label indexes in descending order of distances
    idx_dist.sort(function(a, b){
        if (a[1] < b[1]) return 1;
        if (a[1] > b[1]) return -1;
        return 0;
    });

    var label, e, x, y, dist, fontSize;
    for (var i = 0, l = labels.length; i < l; i++) {
        label = labels[idx_dist[i][0]];
        e = label.e;
        if (c2l.subVectors(label.pt, camera.position).dot(c2t) > 0) {
            // label is in front
            // calculate label position
            v.copy(label.pt).project(camera);
            // projector.projectVector(v.copy(label.pt), camera);

            x = (v.x * widthHalf) + widthHalf;
            y = -(v.y * heightHalf) + heightHalf;

            // set label position
            e.style.display = "block";
            e.style.left = (x - (e.offsetWidth / 2)) + "px";
            e.style.top = (y - (e.offsetHeight / 2)) + "px";
            e.style.zIndex = i + 1;

            // set font size
            if (autosize) {
                dist = idx_dist[i][1];
                if (dist < 10) dist = 10;
                fontSize = Math.round(1000 / dist);
                if (fontSize < 10) fontSize = 10;
                e.style.fontSize = fontSize + "px";
            }
            else {
                e.style.fontSize = option.label.fontSize;
            }
        }
        else {
            // label is in back
            e.style.display = "none";
        }
    }
}

function toggleLabelVisibility() {
    labelVisible = !labelVisible;
    if (labels.length == 0) return;
    labels.forEach(function (label) {
        if (!labelVisible) label.e.style.display = "none";
        label.obj.visible = labelVisible;
    });
}

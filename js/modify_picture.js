function upload_image(){
    fun_access_log("Func_Use_Sup_1_4");
    var SizeLimit = 10//10mb
    
    var fileUploader = document.querySelector('#user_image');
    var FileSize = fileUploader.files.item(0).size
    var FileType = fileUploader.files[0].name.split('.')[1]
    if(FileSize/1024/1024 > SizeLimit) {
        // image over size 
        alert("上傳檔案超過" + String(SizeLimit) + "MB!")
    }
    else if(FileType != 'jpg' && FileType != 'jpeg' && FileType != 'png') {
        //  doesnt support type
        alert("不支援上傳檔案格式!")
    }
    else {
        // fileUploader
        var reader = new FileReader();
        // get image source
        reader.readAsDataURL(fileUploader.files[0])
        reader.onload = function(e) {
            // temp image to get the image size
            var tmp_img = new Image()
            var img_width, img_height, img_path, img_name, img_src

            tmp_img.onload = function() {
                img_width = tmp_img.width
                img_height = tmp_img.height
                add_to_transform(img_width, img_height, img_path)
            }
            // load image
			
            tmp_img.src = e.target.result
            if(FileType == 'jpg' || FileType == 'jpeg') {
                img_src = e.target.result.replace('data:image/jpeg;base64,', '')
                img_src = img_src.replace(' ', '+')
            }
            else if (FileType == 'png') {
                img_src = e.target.result.replace('data:image/png;base64,', '')
                img_src = img_src.replace(' ', '+')    
            }

            //save user's image on server
            $.ajax({
                url: 'php/save_user_image.php',
                type: 'POST',
                async : false, //wait for return
                data: {
                    img_src: img_src,
                    img_type: FileType
                },
                success: function(result){
                    console.log(result);
                    img_name = result
                },
                error: function(jqXHR) {
                    alert("error " + jqXHR.status);
                }
            })
            // set button disable
            document.getElementById('upload_image_button').disabled = true
            
            img_path = 'storage/temp_userimage/' + img_name + '.' + FileType

        }
    
    }

}

var vector_layer
var pic_layer
var transform
var interval_mp

// combine transform layer and image layer
function add_to_transform(img_width, img_height, img_path){
    // 4 corner's coordinate of the map  
    corner = maps[map_ind].getView().calculateExtent(maps[map_ind].getSize())
    map_left = corner[0]
    map_bottom = corner[1]
    map_right = corner[2]
    map_top = corner[3]
    // center's coordinate of the map 
    map_center = maps[map_ind].getView().getCenter()
    if(img_width >= img_height) {
        // img coordirate
        img_left = map_left + (map_right-map_left)*0.3
        img_right = map_left + (map_right-map_left)*0.7 
        img_top    = map_center[1] + (img_right-img_left)/2*(img_height/img_width)
        img_bottom = map_center[1] - (img_right-img_left)/2*(img_height/img_width)
    }
    else {    
        // img coordirate
        img_bottom = map_bottom + (map_top-map_bottom)*0.3
        img_top = map_bottom + (map_top-map_bottom)*0.7
        img_right  = map_center[0] + (img_top-img_bottom)/2*(img_width/img_height)
        img_left   = map_center[0] - (img_top-img_bottom)/2*(img_width/img_height)
    }
    point0 = [img_left, img_top]
    point1 = [img_left, img_bottom]
    point2 = [img_right, img_bottom]
    point3 = [img_right, img_top]
    // add vector layer
    vector_layer = new ol.layer.Vector({
    })
	var vector_layer_style = new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255,255,255,0.01)'
			}),
			stroke: new ol.style.Stroke({
				// color: 'rgba(125,125,255,1)',
                color: 'transparent',
				width: 1
			}),

		});
	vector_layer.setStyle(vector_layer_style);
    vector_layer.setSource(new ol.source.Vector())
    vector_layer.getSource().addFeature(new ol.Feature(new ol.geom.Polygon([[point0, point1, point2, point3]])));
    vector_layer.setZIndex(1005);
	maps[map_ind].addLayer(vector_layer);


    rotate_angle = 0
    end_angle = 0
    scaleX = (img_left-img_right)/img_width
    scaleY = (img_top-img_bottom)/img_height
    s0 = 1
    s1 = 1
    // add transform interaction
    transform = new ol.interaction.Transform({
        
    })
    transform.on('scaling', function(e){
        s0 = e.scale[0]
        s1 = e.scale[1]
    })
    transform.on('scaleend', function(e){
        scaleX = scaleX*s0
        scaleY = scaleY*s1
        s0 = 1
        s1 = 1
    })
    transform.on('rotating', function(e){
        rotate_angle = -e.angle + end_angle
    })
    transform.on('rotateend', function(e){
        end_angle = rotate_angle
    })
    maps[map_ind].addInteraction(transform);

    // refresh image
    interval_mp=window.setInterval(function() {        
        img_points = vector_layer.getSource().getExtent()//

        img_left = img_points[0]
        img_bottom = img_points[1]
        img_right = img_points[2]
        img_top = img_points[3]

        new_source = new ol.source.GeoImage({
            url: img_path,
            imageCenter:[(img_left+img_right)/2, (img_top+img_bottom)/2],
            imageScale: [scaleX*s0, scaleY*s1],
            imageCrop: [0, 0, img_width, img_height],
            imageRotate: rotate_angle,
            projection: 'EPSG:3857'
        })
        pic_layer.setSource(new_source)
        Opacity = 1-$('#image_opacity').text()/100
        pic_layer.setOpacity(Opacity);
    }, 50)

    // add image layer
    pic_layer = new ol.layer.Image({
        source: new ol.source.GeoImage({
            url: img_path,
            imageCenter:[(img_left+img_right)/2, (img_top+img_bottom)/2],
            imageScale: [scaleX, scaleY],
            imageCrop: [0, 0, img_width, img_height],
            imageRotate: 0,
            projection: 'EPSG:3857'
        })
    })

    pic_layer.setZIndex(106);
    pic_layer.setOpacity(0.5);
    maps[map_ind].addLayer(pic_layer);	
}


// remove image 
function reset_image() {
	
    maps[map_ind].removeLayer(vector_layer)
    maps[map_ind].removeLayer(pic_layer)
    maps[map_ind].removeInteraction(transform)
	if(interval_mp){window.clearInterval(interval_mp);}
    // set button enable
    document.getElementById('upload_image_button').disabled = false
}
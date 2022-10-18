Vue.component('print_file', {
    props: {  // data from outside
        maps: null,
        map_ind: null,
        fun_slug: { type: String, default: 'Func_Use_Share_1_2' },
    },
    data: function () {
        return {
            // 是否已載入字體
            if_load: false,
            // 要截的地圖放大倍率
            amplification: 2.5,
            // 列印按鈕預設開啟
            isDisabled: false,
            // 標題與內容的文字
            title: "",
            content: "",
            // 浮水印、座標、指北針、比例尺是否顯示
            watermark: true,
            coor_lat_lon: true,
            north_indicator: true,
            if_scale: true,
            // 紙張大小與垂直或水平
            size_format: "a4",
            layout_format: "portrait",
            // 預設比例尺
            scale_format: "5000000",
            zoom: 8,
            // 比例尺相關參數
            multiplier: 1,
            olscale: null,
            scalewidth: 0,
            scale: "",
            scalenumber: 0,
            scaleunit: "",
            // 方框
            vector_box: null,
            factor: 0,
            squareWidth: 0,
            squareHeight: 0,
            finalWidth: 0,
            finalHeight: 0,
            // 經緯度文字寬度
            blank_width: 0,
            // 經緯度座標
            lat_lon_coor: null,
            // 四角pixel座標
            points: null,
            // 地圖座標
            geometry: null,
            // 紙張大小
            paper_size: {
                a0: [1189, 841],
                a1: [841, 594],
                a2: [594, 420],
                a3: [420, 297],
                a4: [297, 210],
                a5: [210, 148]
            },
            // 比例尺對應zoom level
            zoomLevel: {
                1000000000: 0,
                500000000: 1,
                200000000: 3,
                100000000: 4,
                50000000: 5,
                20000000: 6,
                10000000: 7,
                5000000: 8,
                2000000: 9,
                1000000: 10,
                500000: 11,
                200000: 13,
                100000: 14,
                50000: 15,
                20000: 16,
                10000: 17,
                5000: 18,
                2000: 19,
                1000: 20,
                500: 21,
                200: 23,
                100: 24,
                50: 25,
                20: 26,
                10: 27,
                5: 28
            }
        }
    },
    created() {
        console.log("printfile create success");
    },
    mounted() {
        const self = this;
        // move rectangle if scale change
        this.maps[this.map_ind].on('wheel', function () {
            self.callDrawRectangle();
        });
        // move rectangle if center of map change
        this.maps[this.map_ind].on('pointerdrag', this.callDrawRectangle);
    },
    methods: {
        // 移除方框
        removeRectangle() {
            this.maps[this.map_ind].getLayers().forEach(function (layer) {
                if (layer != undefined) {
                    if (layer.get('name') != undefined && layer.get('name') === "printRectangle") {
                        this.maps[this.map_ind].removeLayer(layer);
                    }
                }
            });
        },
        // 檢查現在有無開啟列印功能
        callDrawRectangle() {
            let is_active = document.getElementById('Share_1_2').classList.contains('active');
            if (is_active) {
                const self = this;
                this.maps[this.map_ind].once('moveend', () => {
                    self.getScaleParameter(self).then(function (result) {
                        return self.drawRectangle();
                    });
                });
            }
        },
        // 取得圖片 url
        getDataUri(url, callback) {
            let image = new Image();
            image.onload = function () {
                let canvas = document.createElement('canvas');
                canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
                canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
                canvas.getContext('2d').drawImage(this, 0, 0);
                // Get raw image data
                //callback(canvas.todataUri('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

                // ... or get as Data URI
                callback(canvas.toDataURL('image/png'));
            };
            image.src = url;
        },
        // 檢查列印選單是否開啟
        ifDrawRectangle() {
            let is_active = document.getElementById('Share_1_2').classList.contains('active');
            console.log(is_active, " active")
            let self = this;
            if (!is_active) {
                this.getScaleParameter(self).then(function (result) {
                    //self.scale_format = self.scalenumber * self.factor;
                    console.log(self.scale_format, "call scale_format")
                    return self.drawRectangle();
                });
            }
            else {
                // 關閉列印選單後移除方框
                this.removeRectangle();
            }
        },
        // 取得當前比例尺相關參數
        getScaleParameter(self) {
            return new Promise(function (resolve, reject) {
                self.multiplier = 1;
                self.olscale = document.getElementsByClassName('ol-scale-line-inner')[0];
                self.scalewidth = parseInt(window.getComputedStyle(self.olscale).getPropertyValue('width'), 10) * self.multiplier;
                self.scale = self.olscale.textContent;
                self.scalenumber = parseInt(self.scale, 10) * self.multiplier;
                self.scaleunit = self.scale.match(/[Aa-zZ]{1,}/g);
                self.factor = (self.scaleunit == "km") ? 100000 : (self.scaleunit == "m") ? 100 : 0.1;
                self.scale_format = self.scalenumber * self.factor;
                // console.log(self.scalenumber, self.factor)
                // console.log(self.scale_format, "get scale_format")
                resolve('get scale parameter finished');
            });
        },
        // 用來呼叫畫出列印範圍function的function
        drawRectangle() {
            let self = this;
            this.drawRectangle_pre(this).then(function (result) {
                if (result == "zoom")
                    return self.drawRectangle_setZoom()
                else
                    return new Promise(function (resolve, reject) {
                        resolve('no zoom');
                    });
            }).then(function () {
                return self.getScaleParameter(self);
            }).then(function () {
                return self.drawRectangle_subroutine();
            });
        },
        // 如果有需要重設比例，等set zoom 結束之後再往下做
        drawRectangle_setZoom() {
            return new Promise(function (resolve, reject) {
                self.maps[self.map_ind].once('moveend', () => {
                    //console.log(self.maps[self.map_ind].getView().getZoom() + "zoom in draw")
                    resolve('set zoom finished');
                });
            });
        },
        // 檢查需不需要重新設置zoom
        drawRectangle_pre(self) {
            return new Promise(function (resolve, reject) {
                self.zoom = self.zoomLevel[self.scale_format];
                // 從列印選單調整比例尺選項會進來
                if (self.maps[self.map_ind].getView().getZoom() != self.zoom) {
                    console.log(self.scale_format);
                    console.log(self.maps[self.map_ind].getView().getZoom(), "now zoom")
                    console.log(self.zoom, "this zoom")
                    // 1 11 21
                    if (self.scale_format == 500000000) { // 5km include zoom 11 and 12
                        if (self.maps[self.map_ind].getView().getZoom() == 2) {
                            resolve('draw pre finished');
                        }
                        else {
                            self.maps[self.map_ind].getView().setZoom(self.zoom);
                            resolve('zoom');
                        }
                    }
                    else if (self.scale_format == 500000) {
                        if (self.maps[self.map_ind].getView().getZoom() == 12) {
                            resolve('draw pre finished');
                        }
                        else {
                            self.maps[self.map_ind].getView().setZoom(self.zoom);
                            resolve('zoom');
                        }
                    }
                    else if (self.scale_format == 500) {
                        if (self.maps[self.map_ind].getView().getZoom() == 22) {
                            resolve('draw pre finished');
                        }
                        else {
                            self.maps[self.map_ind].getView().setZoom(self.zoom);
                            resolve('zoom');
                        }
                    }
                    else {
                        self.maps[self.map_ind].getView().setZoom(self.zoom);
                        resolve('zoom');
                    }
                }
                // 用滾輪改變比例尺或是拖曳地圖、第一次開啟列印會進來
                else {
                    console.log("mousewheel")
                    resolve('draw pre finished');
                }
            });
        },
        // 正式畫上列印範圍
        drawRectangle_subroutine() {
            // 畫之前先檢查有沒有舊的，有的話移除
            this.removeRectangle();
            // 建立畫布
            let canvas = document.createElement('canvas');
            let cropper = canvas.getContext("2d");
            // 小數點後要保留幾位
            let deg = 4;
            // 經緯度字體大小
            cropper.font = "lighter 8pt sans-serif";
            this.blank_width = Math.ceil(cropper.measureText(23.4056.toFixed(deg).toString()).width);
            //console.log(this.blank_width, "blank")
            let size = this.paper_size[this.size_format];
            // 要截的地圖範圍
            this.squareWidth = (this.layout_format == "portrait") ? (size[1] - 20 - this.blank_width) : (size[0] - 20 - this.blank_width);
            this.squareHeight = (this.layout_format == "portrait") ? (size[0] - 75 - this.blank_width) : (size[1] - 50 - this.blank_width);
            this.squareWidth = Math.ceil(this.squareWidth * this.amplification);
            this.squareHeight = Math.ceil(this.squareHeight * this.amplification);
            // 地圖範圍+經緯度範圍 = 最終要貼上pdf的大小
            this.finalWidth = this.squareWidth + this.blank_width * 2;
            this.finalHeight = this.squareHeight + this.blank_width * 2;

            // 繪製層資料來源
            let source_box = new ol.source.Vector({ wrapX: false });

            this.lat_lon_coor = new Array();
            this.points = new Array();
            let map_center = this.maps[this.map_ind].getView().getCenter();
            let map_pixel = this.maps[this.map_ind].getPixelFromCoordinate(map_center);

            // 轉成經緯度
            //map_center = ol.proj.transform(map_center, 'EPSG:3857', 'EPSG:4326');

            // 取得4邊pixel值
            this.points[0] = map_pixel[0] + this.squareWidth / 2;
            this.points[1] = map_pixel[0] - this.squareWidth / 2;
            this.points[2] = map_pixel[1] + this.squareHeight / 2;
            this.points[3] = map_pixel[1] - this.squareHeight / 2;
            console.log(this.points)
            // 取得4角pixel座標
            this.points = [[this.points[1], this.points[3]],
            [this.points[0], this.points[3]],
            [this.points[1], this.points[2]],
            [this.points[0], this.points[2]]
            ];

            this.geometry = new Array();
            for (let i = 0; i < this.points.length; i++) {
                this.geometry[i] = this.maps[this.map_ind].getCoordinateFromPixel(this.points[i]);
                //經緯度轉成地圖座標
                //this.geometry[i] = ol.proj.transform(this.lat_lon_coor[i], 'EPSG:4326', 'EPSG:3857');
            }
            for (let i = 0; i < this.points.length; i++) {
                // 地圖座標轉經緯度
                this.lat_lon_coor[i] = ol.proj.transform(this.geometry[i], 'EPSG:3857', 'EPSG:4326');
            }
            //console.log(this.lat_lon_coor)
            let multigeom = new ol.geom.MultiLineString([
                [this.geometry[0], this.geometry[1]],
                [this.geometry[0], this.geometry[2]],
                [this.geometry[1], this.geometry[3]],
                [this.geometry[2], this.geometry[3]],
            ]);

            let featureLine = new ol.Feature({
                geometry: multigeom
            });
            // feature:要素，包含地理空間物件的幾何實體
            source_box.addFeature(featureLine);
            // 繪製層，包含繪製層資料來源、樣式
            this.vector_box = new ol.layer.Vector({
                source: source_box,
                name: "printRectangle",
                style: new ol.style.Style({
                    // 邊界內樣式 doesn't work
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 0, 0, 0.3)'
                    }),
                    // // 邊界線
                    stroke: new ol.style.Stroke({
                        color: '#ff0000',
                        width: 2,
                        lineDash: [2, 6]
                    }),

                })
            });
            this.vector_box.setOpacity(0.5)
            this.maps[this.map_ind].addLayer(this.vector_box);
            this.vector_box.setZIndex(draw_box_zindex);
        },
        // 產生螢幕截圖 with lines 
        screenshot_image(element, options = {}) {
            let canvas = document.createElement('canvas');
            let cropper = canvas.getContext("2d");
            // save the passed width and height
            let finalWidth = options.width;
            let finalHeight = options.height;
            let imageWidth = options.width;
            let imageHeight = options.height;
            let scaleBy = 4;

            canvas.width = finalWidth * scaleBy;
            canvas.height = finalHeight * scaleBy;
            canvas.style.width = finalWidth + 'px';
            canvas.style.height = finalHeight + 'px';
            cropper.scale(scaleBy, scaleBy);
            // 改善模糊
            cropper["imageSmoothingEnabled"] = false;
            cropper["mozImageSmoothingEnabled"] = false;
            cropper["oImageSmoothingEnabled"] = false;
            cropper["webkitImageSmoothingEnabled"] = false;
            cropper["msImageSmoothingEnabled"] = false;

            // image lan and lon
            let left = options.left;
            let up = options.up;
            let right = options.right;
            let down = options.down;
            let deg = 4  // 經緯度的小數位
            let space = 5; // 經緯線分幾等分

            cropper.font = "lighter 8pt sans-serif";
            this.blank_width = Math.ceil(cropper.measureText(23.4056.toFixed(deg).toString()).width);
            console.log(this.blank_width, "screen blank")
            // 預留經緯度位置
            imageWidth = imageWidth - this.blank_width * 2;
            imageHeight = imageHeight - this.blank_width * 2;
            console.log(imageHeight, imageWidth, "image 高 寬")
            options.width = imageWidth;
            options.height = imageHeight;

            return html2canvas(element, options).then(c => {
                console.log(finalHeight, finalWidth, "canvas 高 寬")
                cropper.fillStyle = "white";
                cropper.fillRect(0, 0, finalWidth, finalHeight);

                // 把圖畫上畫布
                // 從座標點(this.blank_width, this.blank_width)開始畫上image
                cropper.drawImage(c, this.blank_width, this.blank_width);

                cropper.fillStyle = 'white';
                cropper.strokeStyle = 'black';

                // 開始畫經緯度
                if (this.coor_lat_lon) {
                    // 先畫直線 左到右
                    // 第一條直線
                    cropper.beginPath();
                    cropper.lineWidth = 1;
                    // cropper.fillStyle = "#000000";   // 填滿顏色
                    // cropper.strokeStyle = "#000000"; // 邊框顏色
                    cropper.moveTo(this.blank_width, this.blank_width);  // 起點
                    cropper.lineTo(this.blank_width, imageHeight + this.blank_width);  // 終點
                    cropper.stroke();
                    // 第二條直線
                    cropper.beginPath();
                    cropper.lineWidth = 1;
                    // cropper.fillStyle = "#000000";   // 填滿顏色
                    // cropper.strokeStyle = "#000000"; // 邊框顏色
                    cropper.moveTo(this.blank_width + imageWidth / space, this.blank_width);  // 起點
                    cropper.lineTo(this.blank_width + imageWidth / space, imageHeight + this.blank_width);  // 終點
                    cropper.stroke();
                    // 第三條直線
                    cropper.beginPath();
                    cropper.lineWidth = 1;
                    // cropper.fillStyle = "#000000";   // 填滿顏色
                    // cropper.strokeStyle = "#000000"; // 邊框顏色
                    cropper.moveTo(this.blank_width + imageWidth * 2 / space, this.blank_width);  // 起點
                    cropper.lineTo(this.blank_width + imageWidth * 2 / space, imageHeight + this.blank_width);  // 終點
                    cropper.stroke();
                    // 第四條直線
                    cropper.beginPath();
                    cropper.lineWidth = 1;
                    // cropper.fillStyle = "#000000";   // 填滿顏色
                    // cropper.strokeStyle = "#000000"; // 邊框顏色
                    cropper.moveTo(this.blank_width + imageWidth * 3 / space, this.blank_width);  // 起點
                    cropper.lineTo(this.blank_width + imageWidth * 3 / space, imageHeight + this.blank_width);  // 終點
                    cropper.stroke();
                    // 第五條直線
                    cropper.beginPath();
                    cropper.lineWidth = 1;
                    // cropper.fillStyle = "#000000";   // 填滿顏色
                    // cropper.strokeStyle = "#000000"; // 邊框顏色
                    cropper.moveTo(this.blank_width + imageWidth * 4 / space, this.blank_width);  // 起點
                    cropper.lineTo(this.blank_width + imageWidth * 4 / space, imageHeight + this.blank_width);  // 終點
                    cropper.stroke();
                    // 第六條直線
                    cropper.beginPath();
                    cropper.lineWidth = 1;
                    // cropper.fillStyle = "#000000";   // 填滿顏色
                    // cropper.strokeStyle = "#000000"; // 邊框顏色
                    cropper.moveTo(this.blank_width + imageWidth, this.blank_width);  // 起點
                    cropper.lineTo(this.blank_width + imageWidth, imageHeight + this.blank_width);  // 終點
                    cropper.stroke();
                    // 畫完直線

                    // 開始畫橫線
                    // 第一條橫線
                    cropper.beginPath();
                    cropper.lineWidth = 1;
                    // cropper.fillStyle = "#000000";   // 填滿顏色
                    // cropper.strokeStyle = "#000000"; // 邊框顏色
                    cropper.moveTo(this.blank_width, this.blank_width);  // 起點
                    cropper.lineTo(this.blank_width + imageWidth, this.blank_width);  // 終點
                    cropper.stroke();
                    // 第二條橫線
                    cropper.beginPath();
                    cropper.lineWidth = 1;
                    // cropper.fillStyle = "#000000";   // 填滿顏色
                    // cropper.strokeStyle = "#000000"; // 邊框顏色
                    cropper.moveTo(this.blank_width, this.blank_width + imageHeight / space);  // 起點
                    cropper.lineTo(this.blank_width + imageWidth, this.blank_width + imageHeight / space);  // 終點
                    cropper.stroke();
                    // 第三條橫線
                    cropper.beginPath();
                    cropper.lineWidth = 1;
                    // cropper.fillStyle = "#000000";   // 填滿顏色
                    // cropper.strokeStyle = "#000000"; // 邊框顏色
                    cropper.moveTo(this.blank_width, this.blank_width + imageHeight * 2 / space);  // 起點
                    cropper.lineTo(this.blank_width + imageWidth, this.blank_width + imageHeight * 2 / space);  // 終點
                    cropper.stroke();
                    // 第四條橫線
                    cropper.beginPath();
                    cropper.lineWidth = 1;
                    // cropper.fillStyle = "#000000";   // 填滿顏色
                    // cropper.strokeStyle = "#000000"; // 邊框顏色
                    cropper.moveTo(this.blank_width, this.blank_width + imageHeight * 3 / space);  // 起點
                    cropper.lineTo(this.blank_width + imageWidth, this.blank_width + imageHeight * 3 / space);  // 終點
                    cropper.stroke();
                    // 第五條橫線
                    cropper.beginPath();
                    cropper.lineWidth = 1;
                    // cropper.fillStyle = "#000000";   // 填滿顏色
                    // cropper.strokeStyle = "#000000"; // 邊框顏色
                    cropper.moveTo(this.blank_width, this.blank_width + imageHeight * 4 / space);  // 起點
                    cropper.lineTo(this.blank_width + imageWidth, this.blank_width + imageHeight * 4 / space);  // 終點
                    cropper.stroke();
                    // 第六條橫線
                    cropper.beginPath();
                    cropper.lineWidth = 1;
                    // cropper.fillStyle = "#000000";   // 填滿顏色
                    // cropper.strokeStyle = "#000000"; // 邊框顏色
                    cropper.moveTo(this.blank_width, this.blank_width + imageHeight);  // 起點
                    cropper.lineTo(this.blank_width + imageWidth, this.blank_width + imageHeight);  // 終點
                    cropper.stroke();
                    // 畫完橫線

                    // 開始畫經度 由左到右
                    let count = 0;
                    //第一條經度
                    cropper.fillStyle = 'white';
                    cropper.strokeStyle = 'black';
                    cropper.lineWidth = 1;
                    cropper.font = "lighter 6pt sans-serif";
                    let textHeight = cropper.measureText('M').width * 2;
                    let textWidth = cropper.measureText(left.toFixed(deg).toString()).width;
                    cropper.fillText(left.toFixed(deg).toString(), this.blank_width - textWidth / 2, finalHeight - this.blank_width + textHeight);
                    cropper.strokeText(left.toFixed(deg).toString(), this.blank_width - textWidth / 2, finalHeight - this.blank_width + textHeight);
                    cropper.stroke();
                    // 第二條經度
                    count += 1;
                    cropper.fillStyle = 'white';
                    cropper.strokeStyle = 'black';
                    cropper.lineWidth = 1;
                    cropper.font = "lighter 6pt sans-serif";
                    cropper.fillText((left + (right - left) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth / space - textWidth / 2, finalHeight - this.blank_width + textHeight);
                    cropper.strokeText((left + (right - left) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth / space - textWidth / 2, finalHeight - this.blank_width + textHeight);
                    cropper.stroke();
                    // 第三條經度
                    count += 1;
                    cropper.fillStyle = 'white';
                    cropper.strokeStyle = 'black';
                    cropper.lineWidth = 1;
                    cropper.font = "lighter 6pt sans-serif";
                    cropper.fillText((left + (right - left) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth * count / space - textWidth / 2, finalHeight - this.blank_width + textHeight);
                    cropper.strokeText((left + (right - left) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth * count / space - textWidth / 2, finalHeight - this.blank_width + textHeight);
                    cropper.stroke();
                    // 第四條經度
                    count += 1;
                    cropper.fillStyle = 'white';
                    cropper.strokeStyle = 'black';
                    cropper.lineWidth = 1;
                    cropper.font = "lighter 6pt sans-serif";
                    cropper.fillText((left + (right - left) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth * count / space - textWidth / 2, finalHeight - this.blank_width + textHeight);
                    cropper.strokeText((left + (right - left) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth * count / space - textWidth / 2, finalHeight - this.blank_width + textHeight);
                    cropper.stroke();
                    // 第五條經度
                    count += 1;
                    cropper.fillStyle = 'white';
                    cropper.strokeStyle = 'black';
                    cropper.lineWidth = 1;
                    cropper.font = "lighter 6pt sans-serif";
                    cropper.fillText((left + (right - left) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth * count / space - textWidth / 2, finalHeight - this.blank_width + textHeight);
                    cropper.strokeText((left + (right - left) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth * count / space - textWidth / 2, finalHeight - this.blank_width + textHeight);
                    cropper.stroke();
                    // 第六條經度
                    cropper.fillStyle = 'white';
                    cropper.strokeStyle = 'black';
                    cropper.lineWidth = 1;
                    cropper.font = "lighter 6pt sans-serif";
                    cropper.fillText(right.toFixed(deg).toString(), this.blank_width + imageWidth - textWidth / 2, finalHeight - this.blank_width + textHeight);
                    cropper.strokeText(right.toFixed(deg).toString(), this.blank_width + imageWidth - textWidth / 2, finalHeight - this.blank_width + textHeight);
                    cropper.stroke();
                    // 畫完經度

                    // 開始畫緯度 由上往下畫
                    textHeight = cropper.measureText('24').width;
                    // 第一條緯度
                    count = 0;
                    cropper.fillStyle = 'white';
                    cropper.strokeStyle = 'black';
                    cropper.lineWidth = 1;
                    cropper.font = "lighter 6pt sans-serif";
                    cropper.fillText(up.toFixed(deg).toString(), this.blank_width + imageWidth + textHeight / 2, this.blank_width + textHeight / 4);
                    cropper.strokeText(up.toFixed(deg).toString(), this.blank_width + imageWidth + textHeight / 2, this.blank_width + textHeight / 4);
                    cropper.stroke();
                    // 第二條緯度
                    count += 1;
                    cropper.fillStyle = 'white';
                    cropper.strokeStyle = 'black';
                    cropper.lineWidth = 1;
                    cropper.font = "lighter 6pt sans-serif";
                    cropper.fillText((up + (down - up) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth + textHeight / 2, this.blank_width + imageHeight * count / space + textHeight / 4);
                    cropper.strokeText((up + (down - up) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth + textHeight / 2, this.blank_width + imageHeight * count / space + textHeight / 4);
                    cropper.fill();
                    cropper.stroke();
                    // 第三條緯度
                    count += 1;
                    cropper.fillStyle = 'white';
                    cropper.strokeStyle = 'black';
                    cropper.lineWidth = 1;
                    cropper.font = "lighter 6pt sans-serif";
                    cropper.fillText((up + (down - up) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth + textHeight / 2, this.blank_width + imageHeight * count / space + textHeight / 4);
                    cropper.strokeText((up + (down - up) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth + textHeight / 2, this.blank_width + imageHeight * count / space + textHeight / 4);
                    cropper.stroke();
                    // 第四條緯度
                    count += 1;
                    cropper.fillStyle = 'white';
                    cropper.strokeStyle = 'black';
                    cropper.lineWidth = 1;
                    cropper.font = "lighter 6pt sans-serif";
                    cropper.fillText((up + (down - up) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth + textHeight / 2, this.blank_width + imageHeight * count / space + textHeight / 4);
                    cropper.strokeText((up + (down - up) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth + textHeight / 2, this.blank_width + imageHeight * count / space + textHeight / 4);
                    cropper.stroke();
                    // 第五條緯度
                    count += 1;
                    cropper.fillStyle = 'white';
                    cropper.strokeStyle = 'black';
                    cropper.lineWidth = 1;
                    cropper.font = "lighter 6pt sans-serif";
                    cropper.fillText((up + (down - up) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth + textHeight / 2, this.blank_width + imageHeight * count / space + textHeight / 4);
                    cropper.strokeText((up + (down - up) * count / space).toFixed(deg).toString(), this.blank_width + imageWidth + textHeight / 2, this.blank_width + imageHeight * count / space + textHeight / 4);
                    cropper.stroke();
                    // 第六條緯度
                    count += 1;
                    cropper.fillStyle = 'white';
                    cropper.strokeStyle = 'black';
                    cropper.lineWidth = 1;
                    cropper.font = "lighter 6pt sans-serif";
                    cropper.fillText(down.toFixed(deg).toString(), this.blank_width + imageWidth + textHeight / 2, this.blank_width + imageHeight + textHeight / 4);
                    cropper.strokeText(down.toFixed(deg).toString(), this.blank_width + imageWidth + textHeight / 2, this.blank_width + imageHeight + textHeight / 4);
                    cropper.stroke();
                }
                // return our canvas
                return canvas;
            });
        },
        // 在pdf上畫上比例尺
        WriteScaletoPdf(doc) {
            let paper_height = (this.layout_format == "portrait") ? this.paper_size[this.size_format][0] : this.paper_size[this.size_format][1];
            let paper_width = (this.layout_format == "portrait") ? this.paper_size[this.size_format][1] : this.paper_size[this.size_format][0];
            let scalewidth = this.scalewidth * 1 / 4;
            //Offset from the left
            let x_offset = paper_width - scalewidth * 2 - 10;
            console.log(scalewidth)
            //offset from the bottom
            let y_offset = paper_height - 10;
            let x_first = x_offset + Math.floor(scalewidth * 1 / 8);
            let x_second = x_first + Math.floor(scalewidth * 1 / 8);
            let x_third = x_second + Math.floor(scalewidth * 1 / 8);
            let x_fourth = x_third + Math.floor(scalewidth * 1 / 8);
            let x_fifth = x_fourth + Math.floor(scalewidth * 1 / 2);
            let x_sixth = x_fifth + Math.floor(scalewidth * 1 / 2);
            let x_seventh = x_sixth + Math.floor(scalewidth * 1 / 2);

            doc.setLineWidth(1);
            doc.line(x_offset, y_offset, x_first, y_offset);
            doc.setDrawColor(255, 255, 255);
            doc.line(x_first, y_offset, x_second, y_offset);
            doc.setDrawColor(0, 0, 0);
            doc.line(x_second, y_offset, x_third, y_offset);
            doc.setDrawColor(255, 255, 255);
            doc.line(x_third, y_offset, x_fourth, y_offset);
            doc.setDrawColor(0, 0, 0);
            doc.line(x_fourth, y_offset, x_fifth, y_offset);
            doc.setDrawColor(255, 255, 255);
            doc.line(x_fifth, y_offset, x_sixth, y_offset);
            doc.setDrawColor(0, 0, 0);
            doc.line(x_sixth, y_offset, x_seventh, y_offset);

            doc.setDrawColor(255, 255, 255);
            doc.line(x_offset, y_offset + 1, x_first, y_offset + 1);
            doc.setDrawColor(0, 0, 0);
            doc.line(x_first, y_offset + 1, x_second, y_offset + 1);
            doc.setDrawColor(255, 255, 255);
            doc.line(x_second, y_offset + 1, x_third, y_offset + 1);
            doc.setDrawColor(0, 0, 0);
            doc.line(x_third, y_offset + 1, x_fourth, y_offset + 1);
            doc.setDrawColor(255, 255, 255);
            doc.line(x_fourth, y_offset + 1, x_fifth, y_offset + 1);
            doc.setDrawColor(0, 0, 0);
            doc.line(x_fifth, y_offset + 1, x_sixth, y_offset + 1);
            doc.setDrawColor(255, 255, 255);
            doc.line(x_sixth, y_offset + 1, x_seventh, y_offset + 1);

            // draw border
            doc.setLineWidth(0.01);
            doc.setDrawColor(0, 0, 0);
            // up
            doc.line(x_offset, y_offset - 0.5, x_seventh, y_offset - 0.5);
            // down
            doc.line(x_offset, y_offset + 1.5, x_seventh, y_offset + 1.5);
            // left
            doc.line(x_offset, y_offset - 0.5, x_offset, y_offset + 1.5);
            // right
            doc.line(x_seventh, y_offset - 0.5, x_seventh, y_offset + 1.5);
            doc.setFontSize(7);
            // add scale unit
            doc.text(x_seventh + 1, y_offset + 1.5, this.scaleunit);
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext("2d");
            ctx.font = "2pt times";
            let number_width = ctx.measureText("0".toString()).width / 2;
            // add scale number 1
            doc.text(x_offset - number_width, y_offset - 1.5, "0");

            // add scale number 2  畫的話會太擠
            // let number = this.scalenumber / 4;
            // number_width = ctx.measureText(number.toString()).width / 2;
            // doc.text(x_second - number_width,  y_offset - 1.5, number.toString());

            // add scale number 3
            number = this.scalenumber / 2;
            number_width = ctx.measureText(number.toString()).width / 2;
            doc.text(x_fourth - number_width, y_offset - 1.5, number.toString());
            // add scale number 4
            number_width = ctx.measureText(this.scalenumber.toString()).width / 2;
            doc.text(x_fifth - number_width, y_offset - 1.5, this.scalenumber.toString());
            // add scale number 5
            number = this.scalenumber * 3 / 2;
            number_width = ctx.measureText(number.toString()).width / 2;
            doc.text(x_sixth - number_width, y_offset - 1.5, number.toString());
            // add scale number 6
            number = this.scalenumber * 2;
            number_width = ctx.measureText(number.toString()).width / 2;
            doc.text(x_seventh - number_width, y_offset - 1.5, number.toString());
        },
        print() {
            const self = this;
            this.load_font(self).then(() => {
                document.fonts.ready.then(function () {
                    self.print_out();
                });
            });

        },
        // loading font
        load_font(self) {
            return new Promise(function (resolve, reject) {
                
                if (!self.if_load) {
                    let scriptEle = document.createElement("script");
                    scriptEle.src = "./vue/fonts/font.js";
                    scriptEle.onload = function () {
                        resolve('loading font finished');
                    };
                    document.body.appendChild(scriptEle);
                    self.if_load = true            
                }
                else {
                    resolve('loading font finished');
                }
            });
        },
        print_out() {       
            // 列印按鈕變不可用
            this.isDisabled = true;
            // 截圖前把紅框拿掉
            this.maps[this.map_ind].removeLayer(this.vector_box);
            // 鎖定螢幕
            this.maps[this.map_ind].getInteractions().forEach(function (interaction) {
                interaction.setActive(false);
            }, this);

            html2canvas(document.getElementById('canvas_title'), {
                useCORS: true
            }).then((canvas_obj) => {
                this.$emit('accessPrintFile', this.fun_slug);
                let doc = new jsPDF(this.layout_format, 'mm', this.size_format);
                // 增加自定義字體:思源黑體
                addfont(doc, "bold")
                addfont(doc, "regular")
                // doc.addFont(fileName, fontName, fontStyle);
                doc.addFont('noto_sans_cjk_tc_regular', 'noto_sans_cjk_tc_regular', 'normal')
                doc.addFont('noto_sans_cjk_tc_bold', 'noto_sans_cjk_tc_bold', 'normal')
                //doc.addFont('sourcehansans-normal.ttf', 'sourcehansans-normal', 'normal');

                let size_x = (this.layout_format == "portrait") ? this.paper_size[this.size_format][1] : this.paper_size[this.size_format][0];

                // 地圖要放的位置
                let map_x = Math.floor((size_x - this.finalWidth / this.amplification) / 2);
                let map_y = (this.layout_format == "portrait") ? 65 : 45;
                // 指北針圖片大小
                let image_width = 6;
                let image_height = 10;
                // 指北針要放的位置
                let north_x = Math.floor((map_x + Math.ceil(this.finalWidth / this.amplification) - image_width - this.blank_width / 2));
                let north_y = map_y + this.blank_width / 2;

                this.screenshot_image(document.getElementById("map0"), {
                    x: Math.floor(this.points[0][0]),
                    y: Math.floor(this.points[0][1]),
                    width: this.finalWidth, // final width and height
                    height: this.finalHeight,
                    left: this.lat_lon_coor[0][0],
                    up: this.lat_lon_coor[0][1],
                    right: this.lat_lon_coor[1][0],
                    down: this.lat_lon_coor[2][1],
                    // scale: 2,
                    dpi: 384,
                    allowTaint: false,
                    useCORS: true // you can still pass default html2canvas options
                }).then(canvas => {
                    let canvas_url = canvas.toDataURL();
                    // 把地圖放到pdf上  10 = 4 * 2.5 (畫布放大倍率 * 地圖放大倍率)
                    doc.addImage(canvas_url, 'PNG', map_x, map_y, canvas.width / 10, canvas.height / 10, 1, 'FAST');

                    // add north indicator
                    if (this.north_indicator) {
                        this.getDataUri('../img/north_indicator.png', (dataUri) => {
                            doc.addImage(dataUri, 'PNG', north_x, north_y, image_width, image_height, 3, 'FAST');
                        });
                    }

                    // add logo
                    this.getDataUri('../img/logo.png', (dataUri) => {
                        doc.addImage(dataUri, 'PNG', 10, 10, 25, 25, 2, 'FAST');
                    });

                    // 開始畫浮水印
                    if (this.watermark) {
                        this.getDataUri('../img/watermark.png', (dataUri) => {
                            let x = map_x + 20;
                            let y = 90;
                            let final_x = map_x + this.finalWidth / this.amplification - 20;
                            let final_y = map_y + this.finalHeight / this.amplification - 15;
                            for (i = x; i < final_x; i = i + 51) {
                                for (j = y; j < final_y; j = j + 40) {
                                    if (((j + 10) < final_y) && ((i + 17) < final_x))
                                        // add 
                                        doc.addImage(dataUri, 'PNG', i, j, 17, 10, 4, 'FAST');
                                }
                            }
                        });
                    }
                    html2canvas(document.getElementById('canvas_content'), {
                        useCORS: true
                    }).then((canvas_obj) => {
                        // 把紅框再加回來
                        this.maps[this.map_ind].addLayer(this.vector_box);
                        doc.setFont('noto_sans_cjk_tc_bold');
                        // 當標題字數過多時，可以自動換行
                        let title = doc.splitTextToSize(this.title, size_x - 45);
                        doc.text(40, 24, title);
                        let content_y = (this.layout_format == "portrait") ? 45 : 42;
                        // 當內容字數過多時，可以自動換行
                        let content = doc.splitTextToSize(this.content, size_x - map_x - Math.floor(this.blank_width / this.amplification) - 10);
                        doc.setFont('noto_sans_cjk_tc_regular');
                        doc.text(map_x + Math.floor(this.blank_width / this.amplification), content_y, content);
                        // 如果有勾選比例尺，就畫上比例尺
                        if (this.if_scale)
                            this.WriteScaletoPdf(doc);

                        // 下載pdf    
                        doc.save(this.size_format + '.pdf');

                        // 解除鎖定螢幕
                        this.maps[this.map_ind].getInteractions().forEach(function (interaction) {
                            interaction.setActive(true);
                        }, this);

                        // 恢復列印按鈕
                        this.isDisabled = false;
                    });
                });
            });
        },
        // 另存為圖片  目前沒有用到
        download(src) {
            let a = $("<a>").attr("href", src).attr("download", "img.png").appendTo("body");
            a[0].click();
            a.remove();
        }
    },
    template: `
    <div>
        <div id="Share_1_2" class='title' @click="ifDrawRectangle();">
			<i class='dropdown icon' ></i>列印
		</div>
        <div class='content'>
            <form class='ui form'>
                <div class='field'>
                    <label>標題</label>
                    <input id='print_file_title' type='text' placeholder='標題' v-model="title">
                </div>
                <div class='field'>
                    <label>內容</label>
                    <input id='print_file_content' type='text' placeholder='內容' v-model="content">
                </div>
                <div class='field'>
                    <label>紙張大小</label>
                    <select id='size' v-model="size_format" @change="drawRectangle">
                        <option value="a4">A4 (210mm x 297mm)</option>
                        <option value="a3">A3 (297mm x 420mm)</option>
                    </select>
                </div>
                <div class='field'>
                    <label>版面配置</label>
                    <select id='layout' v-model="layout_format" @change="drawRectangle">
                        <option value="portrait">直向列印</option>
                        <option value="landscape">橫向列印</option>
                    </select>
                </div>
                <div class='field'>
                    <label>比例尺</label>
                    <select id='scale' v-model="scale_format" @change="drawRectangle">
                        <option value="1000000000">1:1000000000</option>
                        <option value="500000000">1:500000000</option>
                        <option value="200000000">1:200000000</option>
                        <option value="100000000">1:100000000</option>
                        <option value="50000000">1:50000000</option>
                        <option value="20000000">1:20000000</option>
                        <option value="10000000">1:10000000</option>
                        <option value="5000000">1:5000000</option>
                        <option value="2000000">1:2000000</option>
                        <option value="1000000">1:1000000</option> 
                        <option value="500000">1:500000</option>
                        <option value="200000">1:200000</option>
                        <option value="100000">1:100000</option>
                        <option value="50000">1:50000</option>
                        <option value="20000">1:20000</option>
                        <option value="10000">1:10000</option>
                        <option value="5000">1:5000</option>
                        <option value="2000">1:2000</option>
                        <option value="1000">1:1000</option>
                        <option value="500">1:500</option>
                        <option value="200">1:200</option>
                        <option value="100">1:100</option>
                        <option value="50">1:50</option>
                        <option value="20">1:20</option>
                        <option value="10">1:10</option>
                        <option value="5">1:5</option>
                    </select>
                </div>
                <div class='field'>
                    <div class="ui toggle mini checkbox">
                        <input id='mark' type='checkbox' v-model="watermark">
                        <label>浮水印&emsp;&emsp;&emsp;&emsp;</label>                       
                    </div>
                    <div class="ui toggle mini checkbox">
                        <input id='coor' type='checkbox' v-model="coor_lat_lon">
                        <label>座標網格</label>
                    </div>
                </div>
                <div class='field'>
                    <div class="ui toggle mini checkbox">
                        <input id='north' type='checkbox' v-model="north_indicator">
                        <label>指北針&emsp;&emsp;&emsp;&emsp;</label>
                    </div>
                    <div class="ui toggle mini checkbox">
                        <input id='scale_select' type='checkbox' v-model="if_scale">
                        <label>比例尺</label>
                    </div>
                </div>
                <button class='ui button' id='print_file' type='button' @click="print" :disabled='isDisabled'>列印</button>
            </form>      
        </div> 
    </div>
`
});
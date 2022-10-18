Vue.component('Toukyoken_houiline', {
    props: {  // data from outside
        maps: null,
        map_ind: null,
        fun_slug: { type: String, default: 'Func_Use_Sup_1_1' },
        //enable_refresh: 0
    },
    data: function () {
        return {
            //houiline
            houiline_enabled: false,
            //北方方位線
            houiline_north_source: null,
            houiline_north_vector: null,
            //其餘的方位線
            houiline_source: null,
            houiline_vector: null,
            houiCount: 4,  // 預設:4方向
            // toukyoken
            toukyoken_enabled: false,
            circle_num: 10,
            maxResolution: 4800,
            baseResolution: 36,
            interval: null,
            toukyoken_source: [],
            toukyoken_vector: [],
            stepSize: 5,
            toukyoken_unit: 1,
            //reposition
            draw_box: null,
            // share
            sup_icon_source: null,
            sup_icon_box: null,
            has_icon: 0,
            sup_modifyInteraction: null,
            sup_line_loc: [ol.proj.transform(this.maps[this.map_ind].getView().getCenter(), 'EPSG:3857', 'EPSG:4326')[1], ol.proj.transform(this.maps[this.map_ind].getView().getCenter(), 'EPSG:3857', 'EPSG:4326')[0]]
        }
    },
    watch: {
        // 變數改變時，呼叫對應function，function內可放改變後的值，及改變前的值
        /*enable_refresh: function () {
            if (this.toukyoken_enabled)
                this.get_toukyoken();
            if (this.houiline_enabled)
                this.get_houiline();
        },*/
        houiCount: function () {
            if (this.houiline_enabled)
                this.get_houiline();
        }
    },
    created() { // doesn't work
        if (this.bus) { /// event bus 事件管理器
            this.bus.$on('cb_enable', () => {   // 綁定事件cb_enable，發生後執行get_toukyoken()
                this.get_toukyoken();
            });
        }
    },
    methods: {
        // houiline functions
        enable_houiline(evt) {
            if (this.houiline_enabled) {
                this.get_houiline();
            } else {
                this.clear_houiline();
            }
        },
        // 1.給初始點的經緯度、方位角(initialBearing)、距離,算出所求的點的經緯度跟方位角(finalBearing)
        vincenty_direct(lat, lng, initialBearing, distance, wrap) {
            //轉換成弧度
            let lat_to_r = lat * Math.PI / 180;//lat.toRadians();    //this * Math.PI / 180
            let lng_to_r = lng * Math.PI / 180;//lng.toRadians();
            let bear_to_r = initialBearing * Math.PI / 180//initialBearing.toRadians();
            let s = distance;
            //constant
            let a = 6378137; //this.datum.ellipsoid.a,
            let b = 6356752.3142; //this.datum.ellipsoid.b,
            let f = 1 / 298.257223563; // this.datum.ellipsoid.f;

            let sin_bear = Math.sin(bear_to_r);
            let cos_bear = Math.cos(bear_to_r);
            //start calculate
            let tanU1 = (1 - f) * Math.tan(lat_to_r);
            let cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1));
            let sinU1 = tanU1 * cosU1;
            let para1 = Math.atan2(tanU1, cos_bear);
            let sinpara4 = cosU1 * sin_bear;
            let cosSqpara4 = 1 - sinpara4 * sinpara4;
            let uSq = cosSqpara4 * (a * a - b * b) / (b * b);
            let A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
            let B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
            //iterate until para5 has no significant change
            let para5 = s / (b * A), para6, iterations = 0;
            let cos2para8;
            let sinpara5;
            let cospara5;
            let para7;
            do {
                cos2para8 = Math.cos(2 * para1 + para5);
                sinpara5 = Math.sin(para5);
                cospara5 = Math.cos(para5);
                para7 = B * sinpara5 * (cos2para8 + B / 4 * (cospara5 * (-1 + 2 * cos2para8 * cos2para8) - B / 6 * cos2para8 * (-3 + 4 * sinpara5 * sinpara5) * (-3 + 4 * cos2para8 * cos2para8)));
                para6 = para5;
                para5 = s / (b * A) + para7;
            } while (Math.abs(para5 - para6) > 1e-12 && ++iterations);

            let x = sinU1 * sinpara5 - cosU1 * cospara5 * cos_bear;
            let para52 = Math.atan2(sinU1 * cospara5 + cosU1 * sinpara5 * cos_bear, (1 - f) * Math.sqrt(sinpara4 * sinpara4 + x * x));  //P2的緯度(in rad)
            let para9 = Math.atan2(sinpara5 * sin_bear, cosU1 * cospara5 - sinU1 * sinpara5 * cos_bear);
            let C = f / 16 * cosSqpara4 * (4 + f * (4 - 3 * cosSqpara4));
            let L = para9 - (1 - C) * f * sinpara4 * (para5 + C * sinpara5 * (cos2para8 + C * cospara5 * (-1 + 2 * cos2para8 * cos2para8)));
            let para92;
            //P2的經度(in rad)
            if (wrap)
                para92 = (lng_to_r + L + 3 * Math.PI) % (2 * Math.PI) - Math.PI; // normalise to -180...+180
            else
                para92 = (lng_to_r + L); // do not normalize
            //P2方位角
            let revAz = Math.atan2(sinpara4, -x);

            return {
                lat: para52 * 180 / Math.PI, //para52.toDegrees(),  //this * 180 / Math.PI
                lng: para92 * 180 / Math.PI, //para92.toDegrees(),  //this * 180 / Math.PI
                finalBearing: revAz * 180 / Math.PI //revAz.toDegrees()  //this * 180 / Math.PI
            };
        },
        // 2.給定兩點,計算兩點間的角度(forward azimuth and backward azimuth)跟距離
        vincenty_inverse(p1_lat, p1_lng, p2_lat, p2_lng) {
            //轉換成弧度
            let lat_to_r = p1_lat * Math.PI / 180;//p1_lat.toRadians(), 
            let lng_to_r = p1_lng * Math.PI / 180;//p1_lng.toRadians();
            let lat_to_r2 = p2_lat * Math.PI / 180;//p2_lat.toRadians(), 
            let lng_to_r2 = p2_lng * Math.PI / 180;//p2_lng.toRadians();
            //constant
            let a = 6378137; //this.datum.ellipsoid.a,
            let b = 6356752.3142; //this.datum.ellipsoid.b,
            let f = 1 / 298.257223563; // this.datum.ellipsoid.f;

            let L = lng_to_r2 - lng_to_r;
            let tanU1 = (1 - f) * Math.tan(lat_to_r);
            let cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1));
            let sinU1 = tanU1 * cosU1;
            let tanU2 = (1 - f) * Math.tan(lat_to_r2);
            let cosU2 = 1 / Math.sqrt((1 + tanU2 * tanU2));
            let sinU2 = tanU2 * cosU2;

            //iterate until para1 converge, para1 may not converge
            let para1 = L;  //λ
            let para1_re;
            let iterations = 0
            let sinpara1;
            let cospara1;
            let sinSq_gg;
            let sin_gg;
            let cos_gg;
            let _gg;
            let sin_zz;
            let cosSq_zz;
            let cos2_kk;
            let C;
            do {
                sinpara1 = Math.sin(para1);
                cospara1 = Math.cos(para1);
                sinSq_gg = (cosU2 * sinpara1) * (cosU2 * sinpara1) + (cosU1 * sinU2 - sinU1 * cosU2 * cospara1) * (cosU1 * sinU2 - sinU1 * cosU2 * cospara1);
                sin_gg = Math.sqrt(sinSq_gg);
                if (sin_gg == 0) return 0; // co-incident points
                cos_gg = sinU1 * sinU2 + cosU1 * cosU2 * cospara1;
                _gg = Math.atan2(sin_gg, cos_gg);
                sin_zz = cosU1 * cosU2 * sinpara1 / sin_gg;
                cosSq_zz = 1 - sin_zz * sin_zz;
                cos2_kk = cos_gg - 2 * sinU1 * sinU2 / cosSq_zz;
                if (isNaN(cos2_kk)) cos2_kk = 0; // equatorial line: cosSq_zz=0 (ﾂｧ6)
                C = f / 16 * cosSq_zz * (4 + f * (4 - 3 * cosSq_zz));
                para1_re = para1;
                para1 = L + (1 - C) * f * sin_zz * (_gg + C * sin_gg * (cos2_kk + C * cos_gg * (-1 + 2 * cos2_kk * cos2_kk)));
            } while (Math.abs(para1 - para1_re) > 1e-12 && ++iterations < 100);

            //para1 cannot converge, fail to calculate the result
            if (iterations >= 100) {
                console.log("Formula failed to converge. Altering target position.");
                return this.vincenty_inverse(p1_lat, p1_lng, p2_lat, p2_lng - 0.01);  //retry after modifying the second point
                //  throw new Error('Formula failed to converge');
            }

            //para1 converge, calculate the distance and azimuth
            let uSq = cosSq_zz * (a * a - b * b) / (b * b);
            let A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
            let B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
            let para2 = B * sin_gg * (cos2_kk + B / 4 * (cos_gg * (-1 + 2 * cos2_kk * cos2_kk) - B / 6 * cos2_kk * (-3 + 4 * sin_gg * sin_gg) * (-3 + 4 * cos2_kk * cos2_kk)));

            let s = b * A * (_gg - para2);

            let fwdAz = Math.atan2(cosU2 * sinpara1, cosU1 * sinU2 - sinU1 * cosU2 * cospara1);
            let revAz = Math.atan2(cosU1 * sinpara1, -sinU1 * cosU2 + cosU1 * sinU2 * cospara1);

            s = Number(s.toFixed(3)); // round to 1mm precision
            return {
                distance: s,
                initialBearing: fwdAz * 180 / Math.PI, //fwdAz.toDegrees(),
                finalBearing: revAz * 180 / Math.PI //revAz.toDegrees()
            };
        },
        // 3.把geo的點加到houiline_source
        add_geo_to_source(geo) {
            let geo2 = []
            for (i = 0; i < geo.length; i++) {
                geo2[i] = [geo[i][1], geo[i][0]];
            }
            // OpenLayers uses [lon, lat], not [lat, lon] for coordinates
            let route = new ol.geom.LineString(geo2);
            // Coordinates need to be in the view's projection, which is
            // 'EPSG:3857' if nothing else is configured for your ol.View instance
            route.transform('EPSG:4326', 'EPSG:3857');

            let routeFeature = new ol.Feature({
                type: 'route',
                geometry: route
            });

            this.houiline_source.addFeature(routeFeature);
        },
        // 4.把geo的點加到this.houiline_north_source
        add_geo_to_north_source(geo) {
            let geo2 = []
            for (i = 0; i < geo.length; i++) {
                geo2[i] = [geo[i][1], geo[i][0]];
            }
            // OpenLayers uses [lon, lat], not [lat, lon] for coordinates
            let route = new ol.geom.LineString(geo2);
            // Coordinates need to be in the view's projection, which is
            // 'EPSG:3857' if nothing else is configured for your ol.View instance
            route.transform('EPSG:4326', 'EPSG:3857');

            let routeFeature = new ol.Feature({
                type: 'route',
                geometry: route
            });

            this.houiline_north_source.addFeature(routeFeature);
        },
        // 5.給定起始點跟終點,產生兩點連線上固定間隔的點
        generate_Geodesic(latlngs, steps) {
            let _geo = [], _geocnt = 0, s, poly, points, pointA, pointB;
            for (poly = 0; poly < latlngs.length; poly++) {
                _geo[_geocnt] = [];
                for (points = 0; points < (latlngs[poly].length - 1); points++) {
                    pointA = latlngs[poly][points];  // start point
                    pointB = latlngs[poly][points + 1];  // end point
                    if (pointA == pointB) {
                        continue;
                    }
                    let inverse = this.vincenty_inverse(pointA[0], pointA[1], pointB.lat, pointB.lng);
                    let prev = pointA;
                    _geo[_geocnt].push(prev);
                    for (s = 1; s <= steps;) {
                        let direct = this.vincenty_direct(pointA[0], pointA[1], inverse.initialBearing, inverse.distance / steps * s, true);
                        let gp = [direct.lat, direct.lng];
                        if (Math.abs(gp[1] - prev[1]) > 180) {
                            _geocnt++;
                            _geo[_geocnt] = [];
                            _geo[_geocnt].push(gp);
                            prev = gp;
                            s++;
                        } else {
                            _geo[_geocnt].push(gp);
                            prev = gp;
                            s++;
                        }
                    }
                }
                _geocnt++;
            }
            return _geo
        },
        // 6.清除方位線
        clear_houiline() {
            //remove houiline
            if (this.houiline_vector) {
                //other
                this.maps[this.map_ind].removeLayer(this.houiline_vector);
                this.houiline_vector.getSource().clear();
                this.houiline_source.clear();
                this.houiline_vector.set('altitudeMode', 'clampToGround');
                this.maps[this.map_ind].addLayer(this.houiline_vector);
                //north
                this.maps[this.map_ind].removeLayer(this.houiline_north_vector);
                this.houiline_north_vector.getSource().clear();
                this.houiline_north_source.clear();
                this.houiline_north_vector.set('altitudeMode', 'clampToGround');
                this.maps[this.map_ind].addLayer(this.houiline_north_vector);
            }
            //check if toukyoken is checked, if not, remove icon
            if (this.sup_icon_box) {
                if (!this.toukyoken_enabled) {
                    this.maps[this.map_ind].removeLayer(this.sup_icon_box);
                    this.sup_icon_box.getSource().clear();
                    this.sup_icon_source.clear();
                    this.sup_icon_box.set('altitudeMode', 'clampToGround');
                    this.maps[this.map_ind].addLayer(this.sup_icon_box);
                    this.maps[this.map_ind].removeInteraction(this.sup_modifyInteraction);
                    this.has_icon = 0;
                } else {
                    this.maps[this.map_ind].removeLayer(this.sup_icon_box);
                    this.sup_icon_box.getSource().clear();
                    this.sup_icon_source.clear();
                    this.sup_icon_box.set('altitudeMode', 'clampToGround');
                    this.maps[this.map_ind].addLayer(this.sup_icon_box);
                    this.maps[this.map_ind].removeInteraction(this.sup_modifyInteraction);
                    //set icon style
                    let iconStyle = new ol.style.Style({
                        image: new ol.style.Icon({
                            anchor: [0.5, 1],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            src: './img/marker_icon.png',
                        })
                    });
                    let sup_marker = this.createMarker(ol.proj.transform([this.sup_line_loc[1], this.sup_line_loc[0]], 'EPSG:4326', 'EPSG:3857'), iconStyle);
                    //sup_marker = createMarker(ol.proj.transform([this.sup_line_loc[1], this.sup_line_loc[0]], 'EPSG:4326', 'EPSG:3857'), iconStyle);

                    this.sup_icon_source = new ol.source.Vector({ wrapX: false });
                    this.sup_icon_source.addFeature(sup_marker);
                    this.sup_icon_box = new ol.layer.Vector({
                        source: this.sup_icon_source
                    });
                    this.sup_icon_box.set('altitudeMode', 'clampToGround');
                    this.maps[this.map_ind].addLayer(this.sup_icon_box);

                    this.sup_modifyInteraction = this.makeMovable(sup_marker);
                    this.maps[this.map_ind].addInteraction(this.sup_modifyInteraction);
                    this.sup_icon_box.setZIndex(10002);
                    this.has_icon = 1;
                }
            }
        },
        // 7.在選定的中心位置建立坐標圖像
        createMarker(location, style) {
            let iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(location)
            });
            iconFeature.setStyle(style);
            return iconFeature
        },
        // 8.產生方位線
        get_houiline() {
            if (!this.houiline_enabled) {
                return;
            }
            //fun_access_log("Func_Use_Sup_1_1");
            this.$emit('accessToukyoken', this.fun_slug);
            //reset houiline
            this.clear_houiline();

            let distance = 19500000;
            let wrap = true;
            let step = 1;

            this.houiline_source = new ol.source.Vector({ wrapX: false });
            this.houiline_north_source = new ol.source.Vector({ wrapX: false });

            //取得各方向的方位線
            for (let step = 1; step < this.houiCount; step++) {
                //先取得與中心位置距離19500000的點result
                let result = this.vincenty_direct(this.sup_line_loc[0], this.sup_line_loc[1], 360 / this.houiCount * step, distance, wrap);
                //產生中心與result連線上固定間隔的點,然後加到houiline_source
                let geo = this.generate_Geodesic([[this.sup_line_loc, result]], 200);
                for (let i = 0; i < geo.length; i++)
                    this.add_geo_to_source(geo[i])
            }

            let styles = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 3,
                    color: "#99FF99"
                })
            });

            this.houiline_vector = new ol.layer.Vector({
                source: this.houiline_source,
                style: styles
            });
            this.houiline_vector.set('altitudeMode', 'clampToGround');
            this.maps[this.map_ind].addLayer(this.houiline_vector);

            step = this.houiCount
            //取得北方方位線
            let result = this.vincenty_direct(this.sup_line_loc[0], this.sup_line_loc[1], 360 / this.houiCount * step, distance, wrap);

            var geo = this.generate_Geodesic([[this.sup_line_loc, result]], 200);
            for (let i = 0; i < geo.length; i++)
                this.add_geo_to_north_source(geo[i])

            styles = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 3,
                    color: "#FF0000"
                })
            });

            this.houiline_north_vector = new ol.layer.Vector({
                source: this.houiline_north_source,
                style: styles
            });
            this.houiline_north_vector.set('altitudeMode', 'clampToGround');
            this.maps[this.map_ind].addLayer(this.houiline_north_vector);

            if (!this.has_icon) {
                let iconStyle = new ol.style.Style({
                    image: new ol.style.Icon(({
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: './img/marker_icon.png',
                    })),
                    text: new ol.style.Text({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        font: 'normal 24px Arial',
                        text: 'N',
                        fill: new ol.style.Fill({ color: '#FF8888', width: 3 }),
                        stroke: new ol.style.Stroke({ color: '#FFFFFF', width: 5 }),
                        offsetX: 0,
                        offsetY: -100,
                        placement: 'point',
                        maxAngle: '0.7853981633974483',
                        rotation: 0.0
                    })
                });

                let sup_marker = this.createMarker(ol.proj.transform([this.sup_line_loc[1], this.sup_line_loc[0]], 'EPSG:4326', 'EPSG:3857'), iconStyle);

                //sup_marker = createMarker(ol.proj.transform([this.sup_line_loc[1], this.sup_line_loc[0]], 'EPSG:4326', 'EPSG:3857'), iconStyle);

                this.sup_icon_source = new ol.source.Vector({ wrapX: false });
                this.sup_icon_source.addFeature(sup_marker);
                this.sup_icon_box = new ol.layer.Vector({
                    source: this.sup_icon_source
                });
                this.sup_icon_box.set('altitudeMode', 'clampToGround');
                this.maps[this.map_ind].addLayer(this.sup_icon_box);

                this.sup_modifyInteraction = this.makeMovable(sup_marker);
                this.maps[this.map_ind].addInteraction(this.sup_modifyInteraction);
                this.has_icon = 1;
            }
            else {
                this.maps[this.map_ind].removeLayer(this.sup_icon_box);
                this.sup_icon_box.getSource().clear();
                this.sup_icon_source.clear();
                this.sup_icon_box.set('altitudeMode', 'clampToGround');
                this.maps[this.map_ind].addLayer(this.sup_icon_box);
                this.maps[this.map_ind].removeInteraction(this.sup_modifyInteraction);
                let iconStyle = new ol.style.Style({
                    image: new ol.style.Icon(({
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: './img/marker_icon.png',
                    })),
                    text: new ol.style.Text({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        font: 'normal 24px Arial',
                        text: 'N',
                        fill: new ol.style.Fill({ color: '#FF8888', width: 3 }),
                        stroke: new ol.style.Stroke({ color: '#FFFFFF', width: 5 }),
                        offsetX: 0,
                        offsetY: -100,
                        placement: 'point',
                        maxAngle: '0.7853981633974483',
                        rotation: 0.0
                    })
                });

                let sup_marker = this.createMarker(ol.proj.transform([this.sup_line_loc[1], this.sup_line_loc[0]], 'EPSG:4326', 'EPSG:3857'), iconStyle);

                this.sup_icon_source = new ol.source.Vector({ wrapX: false });
                this.sup_icon_source.addFeature(sup_marker);
                this.sup_icon_box = new ol.layer.Vector({
                    source: this.sup_icon_source
                });
                this.sup_icon_box.set('altitudeMode', 'clampToGround');
                this.maps[this.map_ind].addLayer(this.sup_icon_box);

                this.sup_modifyInteraction = this.makeMovable(sup_marker);
                this.maps[this.map_ind].addInteraction(this.sup_modifyInteraction);
                this.has_icon = 1;
            }

            // set houiline layer to the highest level ( z-index : 10000 )		
            this.houiline_vector.setZIndex(10000);
            this.houiline_north_vector.setZIndex(10000);
            this.sup_icon_box.setZIndex(10002);

            this.maps[this.map_ind].getView().setZoom(this.maps[this.map_ind].getView().getZoom());
        },

        // toukyoken functions
        enable_toukyoken(evt) {
            if (this.toukyoken_enabled) {
                this.get_toukyoken();
            } else {
                this.clear_toukyoken();
            }
        },
        // 1.拖曳中心時重新產生方位線及等距圈
        makeMovable(feature) {
            let modify = new ol.interaction.Modify({
                features: new ol.Collection([feature])
            });

            modify.on('modifyend', (e) => {
                let c = ol.proj.transform(e.features.getArray()[0].getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
                this.sup_line_loc = [c[1], c[0]];
                //this.$emit('sup_line_loc_changed', [c[1], c[0]]);
                if (this.toukyoken_enabled)
                    this.get_toukyoken();
                // if ($('#houiline_cb').checkbox('is checked')) 
                if (this.houiline_enabled)
                    this.get_houiline();
            });

            return modify;
        },
        // 2.產生等距圈的標示文字(距離 + 單位)
        getText(resolution, circle) {
            let text = '';
            //地圖縮小到一定程度時就不顯示文字
            if (resolution > this.maxResolution) {
                // Origin : disappear
                text = '';
            } else {
                // if ( $('#toukyoken_unit').val() == '1' )
                if (this.toukyoken_unit == '1')
                    text = ((circle + 1) * (interval / 1000)) + ' km';
                else
                    text = ((circle + 1) * interval) + ' m';
            }
            return text;
        },
        // 3.計算等距圈上各點的經緯度
        createLatLngs(radius) {
            let idx = 0;
            let steps = 50;

            let latlngs = [];
            latlngs[idx] = [];
            let numSides = steps;

            let wrap = true;
            // TODO: vincenty_direct is supposed to be tool kit.
            let direct0 = this.vincenty_direct(this.sup_line_loc[0], this.sup_line_loc[1], 0, radius, wrap);  // 從北方(0度)開始
            let prev = [direct0.lat, direct0.lng];

            latlngs[idx].push(prev)
            for (step = 1; step <= numSides;) {
                let direct = this.vincenty_direct(this.sup_line_loc[0], this.sup_line_loc[1], 360 / numSides * step, radius, wrap);
                let gp = [direct.lat, direct.lng];

                if (Math.abs(gp[1] - prev[1]) > 180) {
                    idx++;
                    latlngs[idx] = [];
                    latlngs[idx].push(gp);
                    prev = gp;
                    step++;
                } else {
                    latlngs[idx].push(gp);
                    prev = gp;
                    step++;
                }
            }
            let result = [];
            let prevLatLng = null;
            // TODO: Const should not defined in function
            let MAX_LAT = 85.0511287798;
            let MIN_LAT = -85.0511287798;

            for (let i = 0; i < latlngs.length; i++) {
                let arr = [];
                for (let j = 0; j < latlngs[i].length; j++) {
                    let latlng = latlngs[i][j];

                    if (latlng.lat > MAX_LAT) {
                        result.push(arr);
                        arr = [];
                    }
                    else if (latlng.lat < MIN_LAT) {
                        result.push(arr);
                        arr = [];
                    }
                    else {
                        arr.push(latlng);
                    }

                    prevLatLng = latlng;
                }
                if (arr.length > 0) result.push(arr);
            }
            return result;
        },
        // 4.把result的點加到this.toukyoken_source
        draw_toukyoken(result, circle_id) {
            let input = [];

            for (let i = 0; i < result.length; i++) {
                input[i] = [result[i][1], result[i][0]];
            }

            let route = new ol.geom.LineString(input);
            // Coordinates need to be in the view's projection, which is
            // 'EPSG:3857' if nothing else is configured for your ol.View instance
            route.transform('EPSG:4326', 'EPSG:3857');

            let routeFeature = new ol.Feature({
                type: 'route',
                geometry: route
            });

            routeFeature.setId(circle_id)

            this.toukyoken_source[circle_id].addFeature(routeFeature);
        },
        // 5.清除等距圈
        clear_toukyoken() {
            //remove toukyoken
            if (this.toukyoken_vector[0]) {
                for (var i = 0; i < this.circle_num; i++) {
                    this.maps[this.map_ind].removeLayer(this.toukyoken_vector[i]);
                    this.toukyoken_vector[i].getSource().clear();
                    this.toukyoken_source[i].clear();
                    this.toukyoken_vector[i].set('altitudeMode', 'clampToGround');
                    this.maps[this.map_ind].addLayer(this.toukyoken_vector[i]);
                }
            }
            if (this.sup_icon_box) {
                if (!this.houiline_enabled) {
                    this.maps[this.map_ind].removeLayer(this.sup_icon_box);
                    this.sup_icon_box.getSource().clear();
                    this.sup_icon_source.clear();
                    this.sup_icon_box.set('altitudeMode', 'clampToGround');
                    this.maps[this.map_ind].addLayer(this.sup_icon_box);
                    this.maps[this.map_ind].removeInteraction(this.sup_modifyInteraction);
                    this.has_icon = 0;
                }
            }
            // should change to status change while implementing houiline
            //this.clear_houiline();
        },
        // 6.產生等距圈
        get_toukyoken() {
            if (!this.toukyoken_enabled || this.stepSize <= 0) {
                return;
            }
            // change to event
            // fun_access_log("Func_Use_Sup_1_1"); 

            //第一個參數會是你要綁定的事件名稱
            //第二個是你要透過這事件傳至父層的資料
            this.$emit('accessToukyoken', this.fun_slug); // draw.html col 68, login function
            this.clear_toukyoken();
            // if no icon, create one
            //console.log("has icon" + this.has_icon)

            // interval = $('#toukyoken_StepSize').val();  // 間距(單位：m)
            interval = this.stepSize;  // 間距(單位：m)

            // if ( $('#toukyoken_unit').val() == '1')
            if (this.toukyoken_unit == '1')
                interval = interval * 1000;

            for (var i = 0; i < this.circle_num; i++) {
                this.toukyoken_source[i] = new ol.source.Vector({
                    wrapX: false
                });
            }

            // set style for each circle 
            let StyleFuncArr = []
            for (let curr_dis_label = 0; curr_dis_label < this.circle_num; curr_dis_label++) {
                StyleFuncArr.push((feature, resolution) => {

                    return new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            width: 3,
                            color: "#FF8888"
                        }),
                        text: new ol.style.Text({
                            textAlign: 'center',
                            textBaseline: 'middle',
                            font: 'normal 16px Arial',
                            text: this.getText(resolution, parseInt(feature.getId())),
                            fill: new ol.style.Fill({ color: '#FF8888' }),
                            stroke: new ol.style.Stroke({ color: '#FFFFFF', width: 3 }),
                            offsetX: 0,
                            offsetY: 12,
                            placement: 'point',
                            maxAngle: '0.7853981633974483',
                            rotation: 0.0
                        })
                    });
                })
            }
            //var res = this.maps[this.map_ind].getView().getResolution();        

            // if ( interval <= 1000 )
            //     maxResolution = baseResolution;
            // else
            //     maxResolution = baseResolution * 40 * (interval / 1000);    

            this.maxResolution = 40 * (interval / 1000);

            for (let i = 0; i < this.circle_num; i++) {
                let radius = interval * (i + 1);
                let radiusText = radius;

                if (radius > 21000 * 1000) continue;  // 距離大於21000km就不顯示等距圈
                let latLngs = this.createLatLngs(radius);


                for (let j = 0; j < latLngs.length; j++) {
                    this.draw_toukyoken(latLngs[j], i);
                }

                this.toukyoken_vector[i] = new ol.layer.Vector({
                    source: this.toukyoken_source[i],
                    style: StyleFuncArr[i]  // CircleStyleFunction
                });
                this.toukyoken_vector[i].set('altitudeMode', 'clampToGround');
                this.maps[this.map_ind].addLayer(this.toukyoken_vector[i]);
            }
            if (!this.has_icon) {
                let iconStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: './img/marker_icon.png',  // root = src/
                    })
                });
                let sup_marker = this.createMarker(ol.proj.transform([this.sup_line_loc[1], this.sup_line_loc[0]], 'EPSG:4326', 'EPSG:3857'), iconStyle);

                //sup_marker = createMarker(ol.proj.transform([this.sup_line_loc[1], this.sup_line_loc[0]], 'EPSG:4326', 'EPSG:3857'), iconStyle);

                this.sup_icon_source = new ol.source.Vector({ wrapX: false });
                this.sup_icon_source.addFeature(sup_marker);
                this.sup_icon_box = new ol.layer.Vector({
                    source: this.sup_icon_source
                });
                this.sup_icon_box.set('altitudeMode', 'clampToGround');
                this.sup_icon_box.setZIndex(10002);
                this.maps[this.map_ind].addLayer(this.sup_icon_box);

                this.sup_modifyInteraction = this.makeMovable(sup_marker);
                this.maps[this.map_ind].addInteraction(this.sup_modifyInteraction);
                this.has_icon = 1;
            } else {
                this.sup_icon_box.setZIndex(10002);
            }
            // set toukyoken layer to the highest level ( z-index : 10000 )     
            for (let i = 0; i < this.circle_num; i++)
                this.toukyoken_vector[i].setZIndex(10001);

            this.maps[this.map_ind].getView().setZoom(this.maps[this.map_ind].getView().getZoom());

        },
        // 1.重新定位中心點
        get_supline_center() {
            //console.log("call success")
            document.getElementById("space_lonlat").checked = true;
            //fun_access_log("Func_Use_Sup_1_1");
            this.$emit('accessToukyoken', this.fun_slug);
            clear_map(); // define in tools_fun.js

            createMeasureTooltip(); //define in draw.js

            let source_box = new ol.source.Vector({ wrapX: false });

            let vector_box = new ol.layer.Vector({
                source: source_box,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 255, 255, 0)',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0)'
                        })
                    })
                })
            });
            vector_box.set('altitudeMode', 'clampToGround');
            this.maps[this.map_ind].addLayer(vector_box);
            let value = 'Point';
            let maxPoints = 1;

            this.draw_box = new ol.interaction.Draw({
                source: source_box,
                type: /** @type {ol.geom.GeometryType} */ (value),
                maxPoints: maxPoints
            });

            this.maps[this.map_ind].addInteraction(this.draw_box);

            this.draw_box.on('drawstart', (evt) => {
                btn_disable(); // define in draw.js
            }, this);

            this.draw_box.on('drawend', (e) => {
                // 產生等距圈
                //$('#toukyoken_checked').is(':checked')
                if (this.toukyoken_enabled) {

                    this.clear_toukyoken()  // define in toukyoken.js
                    if (this.sup_icon_box) {
                        this.maps[this.map_ind].removeLayer(this.sup_icon_box);
                        this.sup_icon_box.getSource().clear();
                        this.sup_icon_source.clear();
                        this.sup_icon_box.set('altitudeMode', 'clampToGround');
                        this.maps[this.map_ind].addLayer(this.sup_icon_box);
                        this.maps[this.map_ind].removeInteraction(this.sup_modifyInteraction);
                        this.has_icon = 0;
                    }

                    let format = new ol.format.WKT();
                    let wkt = format.writeGeometry(e.feature.getGeometry());
                    let coor = e.feature.getGeometry().getCoordinates();
                    // 抓起點、終點坐標
                    let Coord = e.feature.getGeometry().getFirstCoordinate();

                    let array = String(Coord).split(",");
                    let start_84 = ol.proj.transform([array[0], array[1]], 'EPSG:3857', 'EPSG:4326');

                    this.sup_line_loc = [start_84[1], start_84[0]];
                    this.get_toukyoken();
                }
                // 產生方位線
                //$('#houiline_checked').is(':checked')
                if (this.houiline_enabled) {

                    this.clear_houiline();
                    if (this.sup_icon_box) {
                        this.maps[this.map_ind].removeLayer(this.sup_icon_box);
                        this.sup_icon_box.getSource().clear();
                        this.sup_icon_source.clear();
                        this.sup_icon_box.set('altitudeMode', 'clampToGround');
                        this.maps[this.map_ind].addLayer(this.sup_icon_box);
                        this.maps[this.map_ind].removeInteraction(this.sup_modifyInteraction);
                        this.has_icon = 0
                    }
                    let format = new ol.format.WKT();
                    let wkt = format.writeGeometry(e.feature.getGeometry());
                    let coor = e.feature.getGeometry().getCoordinates();
                    //抓起點、終點坐標
                    let Coord = e.feature.getGeometry().getFirstCoordinate();

                    let array = String(Coord).split(",");
                    let start_84 = ol.proj.transform([array[0], array[1]], 'EPSG:3857', 'EPSG:4326');

                    this.sup_line_loc = [start_84[1], start_84[0]];

                    this.get_houiline();
                }
                btn_enable(); // define in draw.js
                this.maps[this.map_ind].removeInteraction(this.draw_box);
            }, this);
        }
    },
    template: `
<div>
    <div class='ui secondary menu'>
        <a class='item' id='supportline_button' v-on:click="get_supline_center"><img src='img/paint02.png' alt='重新定位中心點'>重新定位中心點</a>
    </div>
    <div class="ui form">
        <h3 class="ui header"> 方位線 </h3>
        <div class="inline fields">
            <label>方位(紅色線為指北):</label>
            <div class="field">
                <div class="ui radio checkbox" id = "4dir">
                    <input type="radio" name="direction" value="4" v-model.number="houiCount">
                    <label>4方向</label>
                </div>
            </div>
            <div class="field">
                <div class="ui radio checkbox" id = "8dir">
                    <input type="radio" name="direction" value="8" v-model.number="houiCount">
                    <label>8方向</label>
                </div>
            </div>
            <div class="field">
                <div class="ui radio checkbox" id = "16dir">
                    <input type="radio" name="direction" value="16" v-model.number="houiCount">
                    <label>16方向</label>
                </div>
            </div>
        </div>
    </div>
    <div class="ui toggle checkbox"  id = "houiline_cb">
        <input type="checkbox" id='houiline_checked' v-model="houiline_enabled" @change="enable_houiline">
        <label>開啟(中心點採拖曳方式移動)</label>
    </div>
    <div class='ui form' id='toukyoken_menu'>
        <h3 class="ui header"> 等距圈 </h3>
        <div class='fields'>
            <div class="field">
                <input type='text' id='toukyoken_StepSize' @keyup="get_toukyoken" v-model.number="stepSize">
                <label>間距 (請輸入數字)</label>
            </div>
            <div class="field">
                <select id='toukyoken_unit' @change="get_toukyoken" v-model="toukyoken_unit">
                    <option value='0'>m</option>
                    <option value='1'>km</option>
                </select>
                <label>單位</label>
            </div>
        </div>
    </div>
    <div class="ui toggle checkbox"  id = "toukyoken_cb">
        <input type="checkbox" id="toukyoken_checked" v-model="toukyoken_enabled" @change="enable_toukyoken">
        <label>開啟(中心點採拖曳方式移動)</label>
    </div>
</div>
`
});
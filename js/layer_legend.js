var layer_legend_W0 = [];
var layer_legend_W1 = [];
var layer_legend_state = 0;

//var legWins = new dhtmlXWindows();

// 圖例視窗
var Legend_win;


// 例外圖例

var block_legend_list = [
	"httpsgeodacnckuedutwSWCB_LLGIS地質圖kml"
];

$(document).ready(function () {
	
	Legend_win = dhxWins.createWindow("Legend_win", 735, 675, 300, 250);
	Legend_win.setText("圖例");
	Legend_win.hide();

	Legend_win.attachEvent("onClose", function (win) {
		layer_legend_state = 0;
		Legend_win.hide();
		$("#layer_legend_open_close").val("開啟圖例");
	});

});

/**
 * Handle open/close state of 圖例 window
 */
function layer_legend_open_close() {
	if (layer_legend_state == 0) {
		layer_legend_state = 1;
		Legend_win.show();
		$("#layer_legend_open_close").val("關閉圖例");
	} else {
		layer_legend_state = 0;
		Legend_win.hide();
		$("#layer_legend_open_close").val("開啟圖例");
	}

}

/**
 * Handle the update of 圖例 window, call when 
 * - add layer
 * - delete layer
 * - change left / right window
 */
function layer_legend_update() {
	let layer_legend = window[`layer_legend_W${map_ind}`];

	let HTMLString = "<div class='my-legend-table'>";

	for (let i = 0; i < layer_legend.length; i++) {
		if (layer_legend[i].isBlock === 0) {
			HTMLString += "<div class='my-legend-content'>" +
				"<div class='my-legend-center'></div>" +
				"<div class='my-legend-color' style='background-color: " + layer_legend[i].color + ";'></div>" +
				"<div class='my-legend-name'>" + layer_legend[i].name + "</div>" +
				"</div>";
		} else {
			HTMLString += "<div class='my-legend-content'>" +
				"<div class='my-legend-center'></div>" +
				"<div class='my-legend-block' style='background-color: " + layer_legend[i].fillcolor + "; border-color: " +
				layer_legend[i].color + "; '></div>" +
				"<div class='my-legend-name'>" + layer_legend[i].name + "</div>" +
				"</div>";
		}
	}

	HTMLString += "</div>";

	Legend_win.attachHTMLString(HTMLString);

	if (layer_legend_state == 0) {
		layer_legend_state = 1;
		Legend_win.show();
		$("#layer_legend_open_close").val("關閉圖例");
	} else {
		$("#layer_legend_open_close").val("關閉圖例");
	}
}

/**
 * Add new layer's data into layer_legend_W0 / layer_legend_W1
 *
 * @param {string} id
 * @param {string} name
 * @param {string} color
 * @param {string} fill_color
 * @param {number} thickness
 * @param {number} opacity
 * @param {boolean} isKml
 */
function layer_legend_add(id, name, color, fill_color, thickness, opacity, isKml) {
	let layer_legend = window[`layer_legend_W${map_ind}`];
	let isLegendExist = 0;
	let isBlock = 0;

	for (var i = 0; i < block_legend_list.length; i++) {
		if (block_legend_list[i].localeCompare(id) === 0) {
			isBlock = 1;
		} else {
			isBlock = 0;
		}
	}

	var new_obj = {
		id: id,
		name: name,
		color: color,
		fillcolor: fill_color,
		thickness: thickness,
		opacity: opacity,
		isBlock: isBlock
	};

	for (var i = 0; i < layer_legend.length; i++) {

		if (layer_legend[i].id.localeCompare(id) === 0) {
			layer_legend[i].name = name;
			layer_legend[i].color = color;
			layer_legend[i].fillcolor = fill_color;
			layer_legend[i].thickness = thickness;
			layer_legend[i].opacity = opacity;
			isLegendExist = 1;
			break;
		}

	}

	if (isLegendExist == 0) {
		layer_legend.push(new_obj);
	}

	layer_legend_update();
}


/**
 * Remove new layer's data into layer_legend_W0 / layer_legend_W1
 * 
 * @param {string} id
 */
function layer_legend_delete(id) {
	let layer_legend = window[`layer_legend_W${map_ind}`];
	for (var i = 0; i < layer_legend.length; i++) {
		if (layer_legend[i].id.localeCompare(id) === 0) {
			layer_legend.splice(i, 1);
		}
	}

	layer_legend_update();
}

/****************************/

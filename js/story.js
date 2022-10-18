// 主題編輯視窗物件
var Story_W1;
// 主題故事 - 主題分類樹物件
var Story_Tree;
// 主題分鏡編輯 - 分鏡列表
var Frame_List;
// Store data of each frame  
var Frame_Data_List = [];

$(document).ready(function () {
	// Initialize 主題編輯 window
	let dhxWins = new dhtmlXWindows();
	Story_W1 = dhxWins.createWindow("Story_W1", 1200, 100, 500, 700);
	Story_W1.setText("主題化故事(事件)");
	Story_W1.showInnerScroll();
	$.ajax({
		url: 'html/story.html',
		type: 'get',
		async: false,
		success: function (html) {
			let story_html = String(html);
			Story_W1.attachHTMLString(story_html);
		}
	});
	Story_W1.attachEvent("onClose", function (win) {
		Story_W1.hide();
		Story_W1.setModal(false);
		return false;
	});
	Story_W1.hide();

	//觸發縮放
	draw_w1.show();
	draw_w1.hide();

	// Initialize 主題分類樹
	Story_Tree = new dhtmlXTreeObject("story_theme_tree", "100%", "100%", 0);
	Story_Tree.setImagePath("codebase/imgs/dhxtree_material/");
	Story_Tree.enableSmartXMLParsing(true);
	Story_Tree.setSerializationLevel(true, true);
	Story_Tree.enableDragAndDrop(true);
	Story_Tree.setDragBehavior("complex");
	Story_Tree.openAllItems(0);
	// Disable the drop when drop into non-tag content
	Story_Tree.attachEvent("onDragIn", function (sId, tId, id, sObject, tObject) {
		if (Story_Tree.getUserData(tId, "type") != "tag") {
			return false;
		}
		return true;
	});
	Story_Tree.attachEvent("onDrop", async function (sId, tId, id, sObject, tObject) {
		await Set_Story_Data(Story_Tree.serializeTreeToJSON(), 'story_tree');
	});
	// Synchronus tag / main name to change name input value
	Story_Tree.attachEvent("onClick", function (id) {
		$("#new_tree_item_name").val(Story_Tree.getItemText(id));
	})



	// Get user name for story tree 
	if (Login_ID == "") {
		$("#story_theme_author").text("未登入");
		$("#story_win_call").hide();
	}
	else {
		$("#story_theme_author").text(Login_Name + "的主題樹");
		$("#story_win_call").show();
	}


	// Initiailize 分鏡列表
	Frame_List = new dhtmlXList({
		container: "story_frame_list",
		template: function (obj) {
			return `<table style='width: 400px;word-wrap: break-word; table-layout: fixed;'>
						<tbody>
							<tr style='height: 12px;'>
								<td style='width: 350px; height: 12px;'>
									<p>分鏡標題：${obj.title} </p>
									<p>分鏡內容：${obj.content_ten_char} </p>
								</td>
								<td style='width: 100px; height: 12px;'>
									<p style='text-align: right;'>
										<button id='Story_Frame_View_${obj.id}' onclick='Story_Frame_View("${obj.id}",[${obj.lat}],[${obj.lon}],[${obj.zoom_level}],[${obj.rotation}],[${obj.undermap}],${obj.map_idx},${obj.map_mode},${obj.slider_map_val},"${obj.draw_on_map}",${obj.is_3d_map}, "${obj.data_3d_map}")' type='button'>瀏覽分鏡</button>
										<button id='Story_Frame_Edit_${obj.id}' onclick='Story_Frame_Edit("${obj.id}","${obj.main_editor}","${obj.main_name}")' type='button'>編輯分鏡</button>
										<button id='Story_Frame_Record_${obj.id}' onclick='Story_Frame_Record("${obj.id}")' type='button'>記錄圖層</button>
										<button id='Story_Frame_Del_${obj.id}' onclick='Story_Frame_Del("${obj.id}")' type='button'>刪除分鏡</button>
									</p>
								</td>
							</tr>
						</tbody>
					</table>`
		},
		drag: true,
		select: true,
		type: { height: "auto" }
	});
	Frame_List.attachEvent("onItemClick", function (id) {
		$("#story_edit_name").val(Frame_List.getUserData(id, "title"))
		$("#story_edit_annotation").val(Frame_List.getUserData(id, "content"))
	})


	// Initialize 瀏覽分鏡 window
	let dhxWins_1 = new dhtmlXWindows();
	Story_W2 = dhxWins_1.createWindow("Story_W2", 1040, 100, 850, 820);
	Story_W2.setText("瀏覽分鏡");
	Story_W2.showInnerScroll();

	$.ajax({
		url: 'html/story_frame_view.html',
		type: 'get',
		async: false,
		success: function (html) {
			var story_frame_html = String(html);
			Story_W2.attachHTMLString(story_frame_html);
		}
	});

	Story_W2.hide();
	// Prevent Story_W2 can't open again bug
	Story_W2.attachEvent("onClose", function (win) {
		Clear_All_Layer();
		Story_W2.hide();
		Story_W2.setModal(false);
		return false;
	});


	// Initialize 編輯分鏡 window
	let dhxWins_2 = new dhtmlXWindows();
	Story_W3 = dhxWins_2.createWindow("Story_W3", 150, 600, 700, 700);
	Story_W3.setText("編輯分鏡");
	Story_W3.showInnerScroll();

	$.ajax({
		url: 'html/story_frame_edit.html',
		type: 'get',
		async: false,
		success: function (html) {
			var story_frame_html = String(html);
			Story_W3.attachHTMLString(story_frame_html);
		}
	});

	Story_W3.hide();
	// Prevent Story_W2 can't open again bug
	Story_W3.attachEvent("onClose", function (win) {
		Story_W3.hide();
		Story_W3.setModal(false);
		return false;
	});

	$("#story_frame_main").css("display", "none");
	$("#story_frame_main_content").css("display", "none");
	$("#story_share_main").css("display", "none");
	$("#story_share_main_content").css("display", "none");

	$("#story_frame_main").removeClass("active");
	$("#story_frame_main_content").removeClass("active");
	$("#story_share_main").removeClass("active");
	$("#story_share_main_content").removeClass("active");

	// Hide 主題分鏡編輯 & 主題分享設定 when click 主題故事
	$("#story_list_main").click(function () {
		$("#story_frame_main").css("display", "none");
		$("#story_frame_main_content").css("display", "none");
		$("#story_share_main").css("display", "none");
		$("#story_share_main_content").css("display", "none");

		if ($("#story_frame_main").hasClass("active")) {
			$("#story_frame_main").click();
		}
		if ($("#story_share_main").hasClass("active")) {
			$("#story_share_main").click();
		}
		if (!Story_W2.isHidden()) {
			Story_W2.close();
		}
		if (!Story_W3.isHidden()) {
			Story_W3.close();
		}

	});

	// Hide 主題分鏡編輯 & 主題分享設定 when click 主題故事
	$("#story_frame_main").click(function () {
		$("#story_share_main").css("display", "none");
		$("#story_share_main_content").css("display", "none");

		if ($("#story_share_main").hasClass("active")) {
			$("#story_share_main").click();
		}
		if (!Story_W2.isHidden()) {
			Story_W2.close();
		}
		if (!Story_W3.isHidden()) {
			Story_W3.close();
		}
	});

	$("#story_share_main").click(function () {
		if (!Story_W2.isHidden()) {
			Story_W2.close();
		}
		if (!Story_W3.isHidden()) {
			Story_W3.close();
		}
	});

	/* Bind the function with 更新分享權限 button */
	$('#update_story_share_setting').on('click', () => {
		Update_Story_Share_Setting($('input[name=story_view_prm]:checked', '#story_share_main_content').val());
	});
});



$(function () {
	tinyMCE.init({
      height:500,
      selector: "textarea",
      auto_focus: "editor",
      theme: "modern",
      plugins: "advlist autolink link image lists charmap print preview code textcolor", // 套件設定: 進階清單、自動連結、連結、上傳圖片、清單、特殊字元表、列印、預覽
	  toolbar: "undo redo | styleselect |  bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link image | code | forecolor"
    });

	$("#story_frame_view_myCarousel").on("slide.bs.carousel", function (event) {
		const to_index = event.to;
		const item = $("#story_frame_view_carousel_slider").find(
			".carousel-item[data_index='" + to_index + "']"
		);
		const id = $(item).attr("data_id");
		const title = $(item).attr("data_title");
		const lat = $(item).attr("data_lat");
		const lon = $(item).attr("data_lon");
		const zoom_level = $(item).attr("data_zoom_level");
		const rotation = $(item).attr("data_rotation");
		const undermap = $(item).attr("data_undermap");
		const map_idx = $(item).attr("data_map_idx");
		const map_mode = $(item).attr("data_map_mode");
		const slider_map_val = $(item).attr("data_slider_map_val");
		const draw_on_map = $(item).attr("data_draw_on_map");
		const is_3d_map = $(item).attr("data_is_3d_map");
		const data_3d_map = $(item).attr("data_data_3d_map");

		$("#story_frame_view_carousel_title").html(title);
		$("#btn_Edit_Slider").attr("data-edit_index", to_index);
		let data;
		if (Frame_Data_List[id] != undefined) {
			data = Frame_Data_List[id];
		}
		else {
			data = [];
		}
		Change_Map_Layer(data, lat, lon, zoom_level, rotation, undermap, map_idx, map_mode, slider_map_val, draw_on_map, is_3d_map, data_3d_map);
	});
});


function Story_Win_Call() {
	Story_W1.show();
	Story_W1.bringToTop();
}

/**
 * Read story tree from backend
 *
 */
var story_re_read_count = 0;
function Read_Story_Tree() {
	if (Login_ID == "") {
		$("#story_theme_author").text("未登入");
	}
	else {
		$("#story_theme_author").text(Login_Name + "的主題樹");
		$("#story_win_call").show();
		$(function () {
			$.ajax({
				type: 'POST',
				url: 'php/user_data_slug.php',
				data_type: 'json',
				data: {
					req: 1,
					slug: "story_tree"
				},
				async: false,
				success: function (json) {
					/* If hasn't store any story tree before */
					if (json.indexOf('error') > 1) {
						//alert(json);
						console.log("token 讀取失敗");
						story_re_read_count = story_re_read_count + 1;
						if (story_re_read_count < 20) {
							Read_Story_Tree();
						}
					} else {
						let res_json = JSON.parse(JSON.parse(json));
						let story_tree_json;
						if (jQuery.isEmptyObject(res_json)) {
							story_tree_json = Story_Tree.serializeTreeToJSON();
							Set_Story_Data(story_tree_json, "story_tree");
						}
						else {
							story_tree_json = JSON.parse(res_json.profile);
						}
						Story_Tree.parse(story_tree_json, "json");
						Story_Tree.refresh();
					}
				},
				error: function (jqXHR) {
					console.log("Read story tree failed");
					alert(jqXHR);
				}
			});
		});
	}
}

/**
 * 
 * Get data from server
 * @param {string} slug the slug put in the server
 * @returns
 */
async function Get_Story_Data(slug) {
	const form_data = new FormData();
	form_data.append('req', 1);
	form_data.append('slug', slug);

	const res = await fetch('php/user_data_slug.php', {
		method: 'POST',
		body: form_data
	});

	if (res.ok) {
		console.log("Get data success");
		return await res.text();
	}
	else {
		console.log("Get data failed");
		return null;
	}
}

/**
 * Update data to backend
 * @param {object} data the data need to upload to server
 * @param {string} slug the slug put in the server
 */
async function Set_Story_Data(data, slug) {
	let form_data = new FormData();
	form_data.append('req', 2);
	form_data.append('slug', slug);
	form_data.append('profile', JSON.stringify(data));

	const res = await fetch('php/user_data_slug.php', {
		method: 'POST',
		body: form_data
	});
	if (res.ok) {
		console.log("Set data success");
	}
	else {
		console.log("Set data failed");
	}
	return res;
}

/**
 * Delete backend data
 * @param {object} data the data need to upload to server
 * @param {string} slug the slug put in the server
 */
async function Delete_Story_Data(slug) {
	const form_data = new FormData();
	form_data.append("req", 3);
	form_data.append("slug", slug);

	const res = await fetch("php/user_data_slug.php", {
		method: "POST",
		body: form_data
	});
	if (res.ok) {
		console.log(`Delete data ${slug} success`);
	}
	else {
		console.log(`Delete data ${slug} failed`);
	}

}

/**
 * For 更新主題樹 button in 主題故事
 *
 */
async function Update_Story_Tree() {
	let res = await Set_Story_Data(Story_Tree.serializeTreeToJSON(), 'story_tree');

	if (res.status == "200") {
		alert("更新主題樹成功");
	}
	else {
		alert("更新主題樹失敗");
	}
}

/**
 * For 新增標籤 button in 主題故事
 *
 */
async function Story_Tag_Add() {
	let tag_parent_id = Story_Tree.getSelectedItemId();
	let tag_id = "tag_" + new Date().valueOf();
	let tag_name = DOMPurify.sanitize($('#story_tag_name').val());

	if (tag_parent_id == "") {
		Story_Tree.insertNewChild("0",
			tag_id,
			tag_name,
			0,
			'folderClosed.gif',
			'folderClosed.gif',
			'folderClosed.gif',
			'SELECT');
	}
	else {
		Story_Tree.insertNewNext(tag_parent_id,
			tag_id,
			tag_name,
			0,
			'folderClosed.gif',
			'folderClosed.gif',
			'folderClosed.gif',
			'SELECT');
	}

	Story_Tree.setUserData(tag_id, "type", "tag");
	await Set_Story_Data(Story_Tree.serializeTreeToJSON(), 'story_tree');

}


/**
 * For delete data with their child recursively
 *
 * @param {string[]} list
 * @returns
 */
async function Delete_Element_Recursive(list) {
	for (let element of list) {
		if (Story_Tree.hasChildren(element) != 0) {
			await Delete_Element_Recursive(Story_Tree.getAllSubItems(element).split(","));
		}
		if (!element.includes("tag"))
			await Delete_Story_Data(element);
		await Story_Tree.deleteItem(element, true);
	}
	return;
}

/**
 * For 刪除標籤/主題 button in 主題故事
 *
 */
async function Story_Element_Del() {
	const selectedId = Story_Tree.getSelectedItemId();
	if (selectedId == "") {
		alert("請選擇欲刪除之物件");
	}
	else {
		if (Story_Tree.hasChildren(selectedId) != 0) {
			const res = confirm("所選物件有子物件，確定要刪除嗎？");
			if (res == true) {
				await Delete_Element_Recursive(selectedId.split());
				await Set_Story_Data(Story_Tree.serializeTreeToJSON(), "story_tree");
				alert("刪除完畢");
			}
		}
		else {
			if (!selectedId.includes("tag")) {
				await Delete_Story_Data(selectedId);
			}
			await Story_Tree.deleteItem(selectedId, true);
			await Set_Story_Data(Story_Tree.serializeTreeToJSON(), "story_tree");
			alert("刪除完畢");
		}

	}
}

/**
 * For 新增主題 button in 主題故事
 *
 */
async function Story_Theme_Add() {
	let story_parent_id = Story_Tree.getSelectedItemId();
	let story_id = Login_ID + "_" + new Date().valueOf();
	let story_name = DOMPurify.sanitize($('#story_theme_name').val());
	let story_create_time = new Date().toDateString();
	let story_edit_time = new Date().toDateString();
	if (story_parent_id == "") {
		Story_Tree.insertNewChild("0",
			story_id,
			story_name,
			0,
			'leaf.gif',
			'leaf.gif',
			'leaf.gif',
			'SELECT');
	}
	else {
		Story_Tree.insertNewNext(story_parent_id,
			story_id,
			story_name,
			0,
			'leaf.gif',
			'leaf.gif',
			'leaf.gif',
			'SELECT');
	}
	Story_Tree.setUserData(story_id, "type", "main");
	Story_Tree.setUserData(story_id, "create_time", story_create_time);
	Story_Tree.setUserData(story_id, "edit_time", story_edit_time);
	await Set_Story_Data(Story_Tree.serializeTreeToJSON(), 'story_tree');
}

/**
 * For 編輯主題 button in 主題故事
 *
 */
var now_edit_story_id; 	// Store the story id now is editing
var now_edit_story_name; // Store the story name now is editing
function Story_Theme_Edit() {
	now_edit_story_id = Story_Tree.getSelectedItemId();
	now_edit_story_name = Story_Tree.getItemText(now_edit_story_id);
	if (now_edit_story_id == "" || Story_Tree.getUserData(now_edit_story_id, "type") != "main") {
		alert("請選擇一個主題!");
	}
	else {
		Read_Frame_List();
		$("#story_frame_main").css("display", "block");
		$("#story_frame_main_content").css("display", "block");
		$("#story_frame_main").click();
	}
}

/**
 * For 更新名稱 button in 主題故事
 *
 */
async function Update_Tree_Item_Name() {
	let now_selected_item_id = Story_Tree.getSelectedItemId();
	let new_name = DOMPurify.sanitize($("#new_tree_item_name").val());
	if (now_selected_item_id == "") {
		alert("請選擇一個標籤/主題");
	}
	else {
		// If this item is a theme, update it's children's main_name
		if (Story_Tree.getUserData(now_selected_item_id, "type") == "main" || Story_Tree.getUserData(now_selected_item_id, "type") == "tag") {
			const form_data = new FormData();
			form_data.append("req", 1);
			form_data.append("slug", now_selected_item_id);

			const res = await fetch("php/user_data_slug.php", {
				method: "POST",
				body: form_data
			});
			if (res.ok) {
				const res_json = JSON.parse(JSON.parse(await res.text()));
				if (!jQuery.isEmptyObject(res_json)) {
					res_json.profile.forEach((_frame, idx, frame_list) => {
						frame_list[idx].main_name = new_name;
					});
					await Set_Story_Data(res_json.profile, now_selected_item_id);
				}
				Story_Tree.setItemText(now_selected_item_id, decodeURIComponent(new_name));
				await Set_Story_Data(Story_Tree.serializeTreeToJSON(), "story_tree");
			}
		}
	}
}

/**
 * Load frame list from specific story 
 *
 */
function Read_Frame_List() {
	if (Login_ID == "") {
		$("#now_edit_story_name").text("目前編輯主題：");
	}
	else {
		$("#now_edit_story_name").text("目前編輯主題：" + now_edit_story_name);
		$.ajax({
			type: 'POST',
			url: 'php/user_data_slug.php',
			data_type: 'json',
			data: {
				req: 1,
				slug: now_edit_story_id
			},
			async: false,
			success: function (json_str) {
				console.log("Read frame list succeed");
				/* If hasn't store any story tree before */
				let res_json = JSON.parse(JSON.parse(json_str));
				let frame_list_json;
				if (jQuery.isEmptyObject(res_json)) {
					Frame_List.clearAll();
					frame_list_json = Frame_List.serialize();
					Set_Story_Data(frame_list_json, now_edit_story_id);
				}
				else {
					frame_list_json = res_json.profile;
				}
				Frame_List.clearAll();
				Frame_List.parse(frame_list_json, "json");
			},
			error: function (jqXHR) {
				console.log("Read frame list failed");
				alert(jqXHR);
			}
		});
	}
}

/**
 * For 更新主題 button in 主題分鏡編輯
 *
 */
async function Story_Theme_Update() {
	let res = await Set_Story_Data(Frame_List.serialize(), now_edit_story_id);
	if (res.status == "200") {
		console.log("更新主題成功");
	}
	else {
		console.log("更新主題失敗");
	}
}

/**
 * For 新增分鏡 button in 主題分鏡編輯
 *
 */
async function Story_Frame_Add() {
	const frame_id = `${now_edit_story_id}_${new Date().valueOf()}`;

	const frame_data = {
		id: frame_id,
		title: DOMPurify.sanitize($('#story_edit_title').val()),
		content: "",
		content_ten_char: "",
		/* one frame can have upto two undermap, so use list to store it */
		lat: [13466699.513920818, 13466699.513920818],	// default lat, Taiwan will in the center of the map
		lon: [2713733.6078444077, 2713733.6078444077],	// default lon, Taiwan will in the center of the map
		zoom_level: [8, 8],								// default zoom level is 8
		rotation: [0, 0],								// default zoom level is 0
		undermap: [0, 0], 								// default undermap is google map
		map_idx: 0, 									// default map is left map (0: left map, 1: right map)
		map_mode: 0,									// default is single map (0: single map, 1: double map, 2: slider map)
		slider_map_val: 50,								// For map mode slider's value, default is 50
		main_editor: Login_Name,
		main_name: now_edit_story_name,
		draw_on_map: btoa(encodeURI(Get_Draw_Kml_List())),
		is_3d_map: 0,
		data_3d_map: "",
	};
	Frame_List.add(frame_data);
	await Story_Theme_Update();

	const permission = await Get_Story_Share_Permission(now_edit_story_id);
	const layer_res = await Set_Story_Data("{}", frame_id);
	const permission_res = await Update_Data_Permission(frame_id, permission);
	if (layer_res.status == '200' && permission_res.status == '200') {
		console.log("create empty frame success");
	}
	else {
		console.log("create empty frame fail");
	}

}

/**
 * For 檢視故事 button in 主題分鏡編輯
 *
 */
async function Story_View_Play() {
	let list = Frame_List.serialize();
	if (list.length > 0) {
		$("#story_frame_view_topic").text(`主題：${list[0].main_name}`);
		$("#story_frame_view_staff").text(`製作人員：${list[0].main_editor}`);
		await Load_Slider_Content(list);
		Story_W2.show();
	}
}

/**
 *　For 分享設定 button in 主題分鏡編輯
 *
 */
function Story_Share_Setting() {
	$("#story_share_link").val(window.location.href + "?story_id=" + now_edit_story_id);
	$("input[id='story_view_prm_open'][value='0']").attr("checked", true);
	$("#story_share_main").css("display", "block");
	$("#story_share_main_content").css("display", "block");
	$("#story_share_main").click();
}

/**
 * For 瀏覽分鏡 button in each frame of 主題分鏡編輯
 * @param {string} id frame_id for frame to edit
 * @param {string} args frame settings, only usage is pass to function Change_Map_Layer
 */
async function Story_Frame_View(id, ...args) {
	swal({
		title: "請稍後",
		text: "下載分鏡中...",
		icon: "info",
		closeOnClickOutside: false,
		button: false
	});
	const data = await Get_Story_Data(id);
	if (jQuery.isEmptyObject(data)) {
		Set_Story_Data("[]", id);
	}
	Change_Map_Layer(data, ...args);
	swal.close();
}

/**
 * For 編輯分鏡 button in each frame of 主題分鏡編輯
 * @param {string} frame_id frame_id for frame to edit
 * @param {string} main_editor editor of story main contents this frame
 * @param {string} main_name name of story main contents this frame
 */
function Story_Frame_Edit(frame_id, main_editor, main_name) {
	$("#story_frame_edit_topic").text(`主題：${main_name}`);
	$("#story_frame_edit_staff").text(`製作人員：${main_editor}`);
	Edit_Slider(frame_id);
	Story_W3.show();
}

/**
 * For 記錄圖層 button in each frame of 主題分鏡編輯
 * @param {string} frame_id frame_id for frame to edit
 */
async function Story_Frame_Record(id) {
	var stroy_layer_ch = confirm('此動作會覆蓋您原先圖層儲存記錄，是否確定將圖層記錄進行更新？');

if (stroy_layer_ch) {
    alert('您按了確定按鈕，將開始進行儲存更新!');

	const frame_data = Frame_List.get(id);
	frame_data.lat = [maps[0].getView().getCenter()[0], maps[1].getView().getCenter()[0]];
	frame_data.lon = [maps[0].getView().getCenter()[1], maps[1].getView().getCenter()[1]];
	frame_data.zoom_level = [maps[0].getView().getZoom(), maps[1].getView().getZoom()];
	frame_data.rotation = [maps[0].getView().getRotation(), maps[1].getView().getRotation()];
	frame_data.undermap = [map00_layer_ind, map01_layer_ind];
	frame_data.map_idx = map_ind;
	frame_data.map_mode = map_win_change_index;
	frame_data.slider_map_val = $("#swipeSlider").val();
	frame_data.draw_on_map = btoa(encodeURI(Get_Draw_Kml_List()));
	
	frame_data.is_3d_map = model_3Dchange_index;
	
	const center = new ol.proj.transform([map.getView().getCenter()[0], map.getView().getCenter()[1]], 'EPSG:3857', 'EPSG:4326');
	const metersPerUnit = map.getView().getProjection().getMetersPerUnit();
	const visibleMapUnits = map.getView().getResolution() * viewer.canvas.clientHeight;
	const relativeCircumference = Math.cos(Math.abs(Cesium.Math.toRadians(center[1])));
	const visibleMeters = visibleMapUnits * metersPerUnit * relativeCircumference;
	const distance = (visibleMeters / 2) / Math.tan(viewer.camera.frustum.fovy / 2);
	frame_data.data_3d_map = btoa(encodeURIComponent(JSON.stringify({ center: center,
							   heading: -1 * map.getView().getRotation(),
							   tilt: curr_cam_tilt,
							   distance: distance })));

	const frame_res = await Set_Story_Data(Frame_List.serialize(), now_edit_story_id);
	const frame_list = [window[`All_Check_List_W0`], window[`All_Check_List_W1`]];
	const permission = await Get_Story_Share_Permission(now_edit_story_id);
	const layer_res = await Set_Story_Data(JSON.stringify(frame_list), id);
	const permission_res = await Update_Data_Permission(id, permission);
	if (frame_res.status == '200' && layer_res.status == '200' && permission_res.status == '200') {
		$(`#Story_Frame_View_${id}`).attr("onclick", `Story_Frame_View("${id}",
																	  [${frame_data.lat}],
																	  [${frame_data.lon}],
																	  [${frame_data.zoom_level}],
																	  [${frame_data.rotation}],
																	  [${frame_data.undermap}],
																	  ${frame_data.map_idx},
																	  ${frame_data.map_mode},
																	  ${frame_data.slider_map_val},
																	  "${frame_data.draw_on_map}",
																	  ${frame_data.is_3d_map},
																	  "${frame_data.data_3d_map}")`.replace(/(?:\n\s*)/g, ''));
		alert("分鏡圖層紀錄成功");
	}
	else {
		alert("分鏡圖層紀錄失敗");
	}
	} else {
    alert('您取消此次圖層記錄!圖層記錄並未更新!');
	}
}

/**
 * For 刪除分鏡 button in each frame of 主題分鏡編輯
 * @param {string} frame_id frame_id for the frame to delete
 */
async function Story_Frame_Del(frame_id) {
	Frame_List.remove(frame_id);
	try {
		await Delete_Story_Data(frame_id);
		await Story_Theme_Update();
		alert("刪除分鏡成功");
	} catch (e) {
		alert("刪除分鏡失敗");
	}
}

/**
 * Load frame data to story view
 *
 * @param {object[]} list frame data list
 * 
 */
async function Load_Slider_Content(list) {
	Frame_Data_List = {};
	$("#story_frame_view_content").empty();
	$("#story_frame_view_content_list").empty();
	swal({
		title: "請稍後",
		text: "下載故事中...",
		icon: "info",
		closeOnClickOutside: false,
		button: false
	});
	for (let index = 0; index < list.length; index++) {
		let list_data = await Get_Story_Data(list[index].id);

		while (typeof list_data === 'string' || list_data instanceof String)
			list_data = JSON.parse(list_data);
		Frame_Data_List[list[index].id] = list_data;
		let active = "active";
		if (index == 0) {
			$("#story_frame_view_carousel_title").html(list[index].title);
			// $("#story_frame_view_carousel_location").attr("onclick", `maps[${map_ind}].getView().setCenter([${list[index].lat[map_ind]}, ${list[index].lon[map_ind]}])`);

			active = "active";
		} else {
			active = "";
		}
		const content_html =
			'<div class="carousel-item ' + active +
			'" data_id="' + list[index].id +
			'" data_title="' + list[index].title +
			'" data_index="' + index +
			'" data_lat=' + list[index].lat +
			' data_lon=' + list[index].lon +
			' data_zoom_level=' + list[index].zoom_level +
			' data_rotation=' + list[index].rotation +
			' data_undermap=' + list[index].undermap +
			' data_map_idx=' + list[index].map_idx +
			' data_map_mode=' + list[index].map_mode +
			' data_slider_map_val=' + list[index].slider_map_val +
			" data_draw_on_map='" + list[index].draw_on_map +
			"' " +
			' data_is_3d_map=' + list[index].is_3d_map +
			" data_data_3d_map='" + list[index].data_3d_map +
			"' " +
			'>' +
			list[index].content +
			"</div>";
		const content_list_html =
			'<li data-target="#story_frame_view_myCarousel" data-slide-to="' + index +
			'" class="' + active +
			'"></li>';
		$("#story_frame_view_content_list").append(content_list_html);
		$("#story_frame_view_content").append(content_html);
	}
	Change_Map_Layer(Frame_Data_List[list[0].id],
		list[0].lat,
		list[0].lon,
		list[0].zoom_level,
		list[0].rotation,
		list[0].undermap,
		list[0].map_idx,
		list[0].map_mode,
		list[0].slider_map_val,
		list[0].draw_on_map,
		list[0].is_3d_map,
		list[0].data_3d_map);
	swal.close();
}

/**
 * Put the frame data into story fram edit
 *
 * @param {string} frame_id the frame's id to edit
 */
function Edit_Slider(frame_id) {
	let frame_data = Frame_List.get(frame_id);
	$("#story_frame_edit_silder").find("input#story_frame_edit_title").val(frame_data.title);
	$("#story_frame_edit_silder").find("button#story_frame_btn_save").attr("frame_id", frame_id);
	tinyMCE.get("story_frame_editor").setContent(frame_data.content);
}

/**
 * Save the frames data after edit
 *
 */
async function Save_Slider() {
	const frame_id = $("#story_frame_edit_silder").find("button#story_frame_btn_save").attr("frame_id");
	const frame_data = Frame_List.get(frame_id);

	frame_data.title = $("#story_frame_edit_silder").find("input#story_frame_edit_title").val();
	frame_data.content = tinyMCE.get("story_frame_editor").getContent();
	frame_data.content_ten_char = tinyMCE.get("story_frame_editor").getContent({ format: 'text' }).substring(0, 10);

	const res = await Set_Story_Data(Frame_List.serialize(), now_edit_story_id);
	if (res.status == "200") {
		Frame_List.refresh();
		alert("儲存分鏡內容成功");
	}
	else {
		alert("儲存分鏡內容失敗");
	}
}

/**
 * Close the story frame edit window
 *
 */
function Cancel_Slider() {
	$("#story_frame_edit_silder").find("button#story_frame_btn_save").attr("data_index", "");
	$("#story_frame_edit_silder").find("input#story_frame_edit_title").val("");
	tinyMCE.get("story_frame_editor").setContent("");
}

/**
 * Load layers to map by id with setting editable
 * @param {string} frame_id frame_id for the frame to show the map content
 * @param {number} lat latitude of this frame
 * @param {number} lon longtitude of this frame
 * @param {number} zoom_level zoom level of this frame
 */
function Change_Map_Layer(data, lat, lon, zoom_level, rotation, undermap, map_idx, map_mode, slider_map_val, draw_on_map, is_3d_map, data_3d_map) {
	if (typeof lat === 'string' || lat instanceof String)
		lat = lat.split(',');
	if (typeof lon === 'string' || lon instanceof String)
		lon = lon.split(',');
	if (typeof zoom_level === 'string' || zoom_level instanceof String)
		zoom_level = zoom_level.split(',');
	if (typeof rotation === 'string' || rotation instanceof String)
		rotation = rotation.split(',');
	if (typeof undermap === 'string' || undermap instanceof String)
		undermap = undermap.split(',');
	
	Clear_All_Layer();
	Undermap_Remove_Layer();
	Remove_Draw_On_Map();

	// Reset 3D model to 2D
	model_3Dchange_index = 1;
	set_3Dmodel();

	maps[0].getView().setCenter([parseFloat(lat[0]), parseFloat(lon[0])]);
	maps[1].getView().setCenter([parseFloat(lat[1]), parseFloat(lon[1])]);
	maps[0].getView().setZoom(parseFloat(zoom_level[0]));
	maps[1].getView().setZoom(parseFloat(zoom_level[1]));
	if(rotation && rotation!='undefined'){
		
	maps[0].getView().setRotation(parseFloat(rotation[0]));
	maps[1].getView().setRotation(parseFloat(rotation[1]));
	}else{
	maps[0].getView().setRotation(0);
	maps[1].getView().setRotation(0);	
	}
	map00_layer_ind = undermap[0];
	map01_layer_ind = undermap[1];
	
	$("#swipeSlider").val(slider_map_val);
	$("#story_frame_view_carousel_location").attr("onclick", `{
		maps[${map_ind}].getView().setCenter([${parseFloat(lat[map_ind])}, ${parseFloat(lon[map_ind])}]);
		maps[${map_ind}].getView().setZoom(${parseFloat(zoom_level[map_ind])});
	}`.replace(/(?:\n\s*)/g, ''));
	Undermap_Add_Layer();
	map_win_init();

	if (draw_on_map != undefined && draw_on_map != "undefined") {
		import_kml_string(decodeURI(atob(draw_on_map)));
	}

	while (typeof data === 'string' || data instanceof String) {
		data = JSON.parse(data);
	}
	if (!isEmpty(data)) {
		if (typeof data.profile === 'string' || data.profile instanceof String)
			data = JSON.parse(data.profile);

		if (!isEmpty(data)) {
			for (let i = data.length - 1; i >= 0; --i) {
				const layer = data[i];
				if (Array.isArray(layer)) {
					for (let j = layer.length - 1; j >= 0; --j) {
						map_ind = i;
						Add_Layer_To_Map(layer[j]);
					}
				}
				else {
					map_ind = parseInt(map_idx);
					Add_Layer_To_Map(layer);
				}
			}
		}
	}
	map_ind = parseInt(map_idx);
	map_win_change_index = parseInt(map_mode);
	$("#mymainwin_switch")[0].checked = (map_ind == 0) ? false : true;
	handleClick($("#mymainwin_switch")[0]);
	is_3d_map=parseInt(is_3d_map);
	if (is_3d_map&&data_3d_map!='undefined') {
		// enable 3d map
		model_3Dchange_index = 0;
		set_3Dmodel();

		// adjust 3d map setting
		data_3d_map = JSON.parse(decodeURIComponent(atob(data_3d_map)));
		viewer.camera.lookAt(
			Cesium.Cartesian3.fromDegrees(data_3d_map.center[0], data_3d_map.center[1]),
			new Cesium.HeadingPitchRange(
				data_3d_map.heading,		// viewer.camera.heading,
				data_3d_map.tilt,						//viewer.camera.pitch,
				data_3d_map.distance
			)
		);
	}
}

/**
 * View the story by url
 *
 * @param {string} story_id
 */
async function Story_View_By_Url(story_id) {
	const form_data = new FormData();
	form_data.append('req', 1);
	form_data.append('slug', story_id);

	const story_data = JSON.parse(JSON.parse(await Get_Story_Data(story_id))).profile;
	if (story_data && story_data.length > 0) {
		$("#story_frame_view_topic").text(`主題：${story_data[0].main_name}`);
		$("#story_frame_view_staff").text(`製作人員：${story_data[0].main_editor}`);
		await Load_Slider_Content(story_data);
		Story_W2.show();
	}
	else {
		alert("此主題故事未公開分享或是您帳號檢視權限不足!");
	}


}

/**
 * For 更新分享權限 button in 主題分享設定
 *
 * @param {string} permission 
 */
async function Update_Story_Share_Setting(permission) {
	let res_list = [];
	res_list.push(await Update_Data_Permission(now_edit_story_id, permission));
	const frame_list = Frame_List.serialize();
	for (let i = 0; i < frame_list.length; ++i) {
		res_list.push(await Update_Data_Permission(frame_list[i].id, permission));
	}
	if (res_list.every((res) => res.status == "200")) {
		alert("分享更新權限成功");
	}
	else {
		alert("分享更新權限失敗");
	}

}

/**
 * For update data's permission
 *
 * @param {string} id 
 * @param {string} permission
 * @returns {object} Response after update permission, use to check if success
 */
async function Update_Data_Permission(id, permission) {
	const form_data = new FormData();

	form_data.append('req', 5);
	form_data.append('slug', id);
	form_data.append('permission', permission);

	const res = await fetch('php/user_data_slug.php', {
		method: 'POST',
		body: form_data
	});
	return res;
}

/**
 * Get story theme's share permission
 *
 * @param {string} story_id
 * @returns {string} Share permission for the story theme
 */
async function Get_Story_Share_Permission(story_id) {
	const form_data = new FormData();
	form_data.append("req", 1);
	form_data.append('slug', story_id);

	const res = await fetch('php/user_data_slug.php', {
		method: 'POST',
		body: form_data
	});
	const story_data = JSON.parse(JSON.parse(await res.text()));
	return story_data.permission;
}

/**
 * 分享目前地圖上的圖層
 *
 */
async function Create_Single_Share_Frame() {
	const center = new ol.proj.transform([map.getView().getCenter()[0], map.getView().getCenter()[1]], 'EPSG:3857', 'EPSG:4326');
	const metersPerUnit = map.getView().getProjection().getMetersPerUnit();
	const visibleMapUnits = map.getView().getResolution() * viewer.canvas.clientHeight;
	const relativeCircumference = Math.cos(Math.abs(Cesium.Math.toRadians(center[1])));
	const visibleMeters = visibleMapUnits * metersPerUnit * relativeCircumference;
	const distance = (visibleMeters / 2) / Math.tan(viewer.camera.frustum.fovy / 2);
	const frame_data = {
		id: `share_frame_${new Date().valueOf()}`,
		lat: maps[map_ind].getView().getCenter()[0],	// default lat, Taiwan will in the center of the map
		lon: maps[map_ind].getView().getCenter()[1],	// default lon, Taiwan will in the center of the map
		zoom_level: maps[map_ind].getView().getZoom(),
		rotation: maps[map_ind].getView().getRotation(),
		undermap: [map00_layer_ind, map01_layer_ind],
		map_idx: map_ind,
		map_mode: map_win_change_index,
		slider_map_val: $("#swipeSlider").val(),
		draw_on_map: btoa(encodeURI(Get_Draw_Kml_List())),
		is_3d_map: model_3Dchange_index,
		data_3d_map: btoa(encodeURIComponent(JSON.stringify({ 
			center: center,
			heading: -1 * map.getView().getRotation(),
			tilt: curr_cam_tilt,
			distance: distance }))),
		list: [window[`All_Check_List_W0`], window[`All_Check_List_W1`]]
	};

	const layer_res = await Set_Story_Data(frame_data, frame_data.id);
	if (layer_res.status == '200') {
		const copy_link = window.location.href.split("?")[0] + "?share_frame=" + frame_data.id;
		navigator.clipboard.writeText(copy_link);
		swal({
			text: "記錄圖層成功，已複製圖層連結，若複製失敗，請手動複製" + copy_link
		});
		//swal("記錄圖層成功，圖層連結為" + origin_web_link + "?share_frame=" + frame_data.id)
	}
	else {
		alert("分享目前圖層紀錄失敗");
	}
}

/**
 * For checking if the object is empty
 *
 * @param {*} obj Object wait for test
 * @returns
 */
function isEmpty(obj) {

	// null and undefined are "empty"
	if (obj == null) return true;

	// Assume if it has a length property with a non-zero value
	// that that property is correct.
	if (obj.length > 0) return false;
	if (obj.length === 0) return true;

	// If it isn't an object at this point
	// it is empty, but it can't be anything *but* empty
	// Is it empty?  Depends on your application.
	if (typeof obj !== "object") return true;

	// Otherwise, does it have any properties of its own?
	// Note that this doesn't handle
	// toString and valueOf enumeration bugs in IE < 9
	for (var key in obj) {
		if (hasOwnProperty.call(obj, key)) return false;
	}

	return true;
}

function Add_Layer_To_Map(layer) {
	console.log(`layer name: ${layer.FileName}, map_idx: ${map_ind}`);
	const dot_list = window[`Dot_Type_Check_List_W${map_ind}`];
	const vector_list = window[`Vector_Type_Check_List_W${map_ind}`];
	const image_list = window[`Image_Type_Check_List_W${map_ind}`];
	const favor_list = window[`Favor_Type_Check_List_W${map_ind}`];

	const f_idx = favor_list.findIndex(f_layer => f_layer.ID === layer.ID);
	if (f_idx != -1) {
		layer.IsInFavor = 1;
	}
	else {
		layer.IsInFavor = 0;
	}
	const idx_dot = Dot_Label.indexOf(layer.Type, 0);
	const idx_vec = Vector_Label.indexOf(layer.Type, 0);
	const idx_img = Image_Label.indexOf(layer.Type, 0);
	if (idx_dot != -1) {
		layer.ZIndex = 1000 + dot_list.length;
		dot_list.unshift(layer);
	} else if (idx_vec != -1) {
		layer.ZIndex = 600 + vector_list.length;
		vector_list.unshift(layer);
	} else if (idx_img != -1) {
		layer.ZIndex = 300 + image_list.length;
		image_list.unshift(layer);
	} else {
		layer.ZIndex = 300 + image_list.length;
		image_list.unshift(layer);
	}

	if (layer.FileName.localeCompare("loading...") != 0)
		window[`All_Check_List_W${map_ind}`] = dot_list.concat(vector_list.concat(image_list));


	const root = Get_Root_Obj(layer.RootName);
	if (root[0] == "tree") {
		Layer_Tree_Oncheck_Pre(layer.RootName, layer.RowID, layer.IsAddOnMap);
	}
	else if (root[0] == "grid") {
		Layer_Grid_Oncheck_Pre(layer.RootName, layer.RowID, "", layer.IsAddOnMap);
	}
	Layer_Grid_Oncheck(layer.RootName, layer.RowID, "", layer.IsAddOnMap);

}
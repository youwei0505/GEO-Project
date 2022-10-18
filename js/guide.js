let guide = document.getElementById("guide");
guide.style.opacity = 0;
guide.style.display = "none";

function resizeGuidePosition() {
  // step1
  let step1Frame = document.querySelector(".step-1 .step-frame");
  let step1Info = document.querySelector(".step-1 .step-info");
  let baseLayerIcon = document.getElementById("base_layer_icon");
  let baseLayerIconPos = baseLayerIcon.getBoundingClientRect();
  let dataSearchIcon = document.getElementById("data_search");
  let dataSearchIconPos = dataSearchIcon.getBoundingClientRect();

  step1Frame.style.left = baseLayerIconPos.x + "px";
  step1Frame.style.top = baseLayerIconPos.y + "px";
  step1Frame.style.width = baseLayerIconPos.width * 4 + "px";
  step1Frame.style.height = baseLayerIconPos.height + "px";
  step1Info.style.left = dataSearchIconPos.x + "px";
  step1Info.style.top = dataSearchIconPos.height + 10 + "px";

  //step2
  let step2Frame = document.querySelector(".step-2 .step-frame");
  let step2Info = document.querySelector(".step-2 .step-info");
  let step2OtherInfo = document.querySelector(".step-2 .step-other-info");

  let step2OtherInfoDiv = document.querySelectorAll(
    ".step-2 .step-other-info div"
  );
  let accountLoginIcon = document.getElementById("account_login_icon");
  let accountLoginIconPos = accountLoginIcon.getBoundingClientRect();

  step2Frame.style.left = accountLoginIconPos.x + "px";
  step2Frame.style.top = accountLoginIconPos.y + "px";
  step2Frame.style.width = accountLoginIconPos.height + "px";
  step2Frame.style.height = accountLoginIconPos.width * 5 - 25 + "px";
  step2OtherInfo.style.left = accountLoginIconPos.width - 10 + "px";
  step2OtherInfo.style.top = accountLoginIconPos.y + "px";
  step2Info.style.top = accountLoginIconPos.y - 25 + "px";
  let step2OtherItemWidth = accountLoginIconPos.y + 20;

  step2OtherInfoDiv[0].style.top = step2OtherItemWidth + "px";
  step2OtherInfoDiv[1].style.top =
    step2OtherItemWidth + accountLoginIconPos.height + "px";
  step2OtherInfoDiv[2].style.top =
    step2OtherItemWidth + accountLoginIconPos.height * 2 + "px";
  step2OtherInfoDiv[3].style.top =
    step2OtherItemWidth + accountLoginIconPos.height * 3 + "px";
  step2OtherInfoDiv[4].style.top =
    step2OtherItemWidth + accountLoginIconPos.height * 4 + "px";
  step2OtherInfoDiv[5].style.top =
    step2OtherItemWidth + accountLoginIconPos.height * 5 + "px";

  //step3
  let step3Frame = document.querySelector(".step-3 .step-frame");
  let step3Info = document.querySelector(".step-3 .step-info");
  let step3OtherInfo = document.querySelector(".step-3 .step-other-info");
  let streetviewIcon = document.getElementById("model_streetview_id");
  let streetviewIconPos = streetviewIcon.getBoundingClientRect();
  let terrValueBtn = document.getElementById("Terr_value");
  let terrValueBtnPos = terrValueBtn.getBoundingClientRect();
  step3Frame.style.left = streetviewIconPos.x + 5 + "px";
  step3Frame.style.top = streetviewIconPos.y + "px";
  step3Frame.style.width = terrValueBtnPos.x + terrValueBtnPos.width + "px";
  step3Frame.style.height =
    terrValueBtnPos.y -
    streetviewIconPos.y +
    terrValueBtnPos.height +
    10 +
    "px";
  step3OtherInfo.style.left = streetviewIconPos.width + "px";
  step3OtherInfo.style.top = streetviewIconPos.y + "px";
  step3Info.style.left = terrValueBtnPos.x - 25 + "px";
  step3Info.style.top = streetviewIconPos.y - 25 + "px";

  //step4
  let step4Frame = document.querySelector(".step-4 .step-frame");
  let step4Info = document.querySelector(".step-4 .step-info");
  let mainwinSwitchIcon = document.querySelector(".mainwin_switch");
  let mainwinSwitchIconPos = mainwinSwitchIcon.getBoundingClientRect();
  step4Frame.style.left = mainwinSwitchIconPos.x + "px";
  step4Frame.style.top = mainwinSwitchIconPos.y + "px";
  step4Frame.style.width = mainwinSwitchIconPos.width + "px";
  step4Frame.style.height = mainwinSwitchIconPos.height + "px";
  step4Info.style.left =
    mainwinSwitchIconPos.x + mainwinSwitchIconPos.width + "px";
  step4Info.style.top = mainwinSwitchIconPos.y + 10 + "px";

  //step5
  let step5Frame = document.querySelector(".step-5 .step-frame");
  let step5Info = document.querySelector(".step-5 .step-info");
  let dhxslContainer = document.querySelector(".dhxsl_container");
  let dhxslContainerPos = dhxslContainer.getBoundingClientRect();

  step5Frame.style.left = dhxslContainerPos.x + "px";
  step5Frame.style.top = dhxslContainerPos.y - 10 + "px";
  step5Frame.style.width = dhxslContainerPos.width + "px";
  step5Frame.style.height = mainwinSwitchIconPos.height + "px";
  step5Info.style.left = dhxslContainerPos.x + dhxslContainerPos.width + "px";
  step5Info.style.top = dhxslContainerPos.y + "px";

  //step6
  let step6Frame = document.querySelector(".step-6 .step-frame");
  let step6Info = document.querySelector(".step-6 .step-info");
  let undermapLists = document.getElementById("undermap_lists");
  let undermapListsPos = undermapLists.getBoundingClientRect();

  step6Frame.style.left = undermapListsPos.x + "px";
  step6Frame.style.top = undermapListsPos.y + "px";
  step6Frame.style.width = undermapListsPos.width + "px";
  step6Frame.style.height = undermapListsPos.height + "px";
  step6Info.style.left =
    undermapListsPos.x - Math.round(undermapListsPos.width / 2) - 30 + "px";
  step6Info.style.top = undermapListsPos.y + "px";

  //step7
  let step7Frame = document.querySelector(".step-7 .step-frame");
  let step7Info = document.querySelector(".step-7 .step-info");
  let mwtSliderContentIn = document.getElementById("mwt_slider_content_in");
  let mwtSliderContentInPos = mwtSliderContentIn.getBoundingClientRect();

  step7Frame.style.left =
    mwtSliderContentInPos.x - mwtSliderContentInPos.width + "px";
  step7Frame.style.top = mwtSliderContentInPos.y + "px";
  step7Frame.style.width = mwtSliderContentInPos.width + "px";
  step7Frame.style.height = mwtSliderContentInPos.height + "px";
  step7Info.style.left =
    mwtSliderContentInPos.x -
    mwtSliderContentInPos.width +
    Math.round(mwtSliderContentInPos.width / 2) -
    40 +
    "px";
  step7Info.style.top =
    mwtSliderContentInPos.y +
    Math.round(mwtSliderContentInPos.height / 2) -
    40 +
    "px";

  //step8
  let step8Info = document.querySelector(".step-8 .step-info");
  step8Info.style.left = Math.round(document.body.clientWidth / 2) + "px";
  step8Info.style.bottom = Math.round(document.body.clientHeight / 4) + "px";
  
  //step9
  let step9Info = document.querySelector(".step-9 .step-info");
  step9Info.style.left = Math.round(document.body.clientWidth / 2) + "px";
  step9Info.style.bottom = Math.round(document.body.clientHeight /2) + "px";
}

function showGuide() {
  // 觸發已選圖層
  let sliderScroll = document.getElementById("mwt_fb_tab");
  sliderScroll.click();

  // 顯示導覽視窗
  let guide = document.getElementById("guide");
  setTimeout(resizeGuidePosition,120);
  
  guide.style.opacity = 1;
  guide.style.display = "block";
  guide.addEventListener("click", function (e) {
    guide.style.opacity = 0;
    guide.style.display = "none";
    sliderScroll.click();
  });
}
setTimeout(function () { document.getElementById("mwt_fb_tab").click(); }, 2000);
// 視窗改變時觸發
window.addEventListener("resize", function () {
  resizeGuidePosition();
});

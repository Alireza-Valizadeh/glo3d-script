window.onload = function () {
  if (window.jQuery) {
    addStyles();
  }
};
function addStyles() {
  document.head.insertAdjacentHTML(
    "beforeend",
    "<style>" +
      "        .myModalGlo3d  {\n" +
      "          display:flex;  \n" +
      "          position:fixed;  \n" +
      "          margin:0 auto ; \n" +
      "          width:100vw ; \n" +
      "          height:100vh;  \n" +
      "          justify-content:center;  \n" +
      "          top:0;  \n" +
      "          z-index:10000 ; \n" +
      "        }\n" +
      "        .close-iframe  {\n" +
      "          display:flex;  \n" +
      "          position:fixed;  \n" +
      "          margin:3vh auto ; \n" +
      "          width:98vw ; \n" +
      "          left:77vw ; \n" +
      "          top:0;  \n" +
      "          z-index:10000 ; \n" +
      "        }\n" +
      "        .iframe-window-dialog  {\n" +
      "         background-color :white;  \n" +
      "        }\n" +
      "        @media (min-width: 1110.1px) {\n" +
      "  .close-iframe {\n" +
      "               left:82vw;\n" +
      "            }\n" +
      "            .iframe-window-dialog {\n" +
      "               width:70vw;\n" +
      "            }\n" +
      "}\n" +
      "        @media (max-width: 1110px) and (min-width:700.1px) {\n" +
      "  .close-iframe {\n" +
      "               left:94vw;\n" +
      "            }\n" +
      "            .iframe-window-dialog {\n" +
      "               width:94vw;\n" +
      "            }\n" +
      "}\n" +
      "        @media (min-width:300px) and (max-width: 700px)   {\n" +
      "            .iframe-window-dialog {\n" +
      "               width:100vw;\n" +
      "            }\n" +
      "}\n" +
      "</style>"
  );
}
function checkClick() {
  if ($(".btn-tertiary")[0].innerText === "Full Vehicle Details  ") {
    $(".learnMore__wrap").after(
      '<div class="col mt-2 col-md-5 learnMore__wrap"><h2 class="vdp--secondary-title d-none">See 360 Image</h2><div class="text-center">' +
        '<button id="viewIframe"  class="btn btn-tertiary btn-lg btn__learnMore stat-text-link w-100" onclick="checkModelExistance()"  >See 360 Image <svg class="icon svgicon-caret_next"><use xlink:href="#svgicon-caret_next"></use></svg> </button></div></div>'
    );
  }
}
checkClick();
function checkModelExistance() {
  var vin = findVin();
}
function open360Image() {
  const div1 = document.createElement("div");
  div1.classList.add("myModalGlo3d");
  const div2 = document.createElement("div");
  div2.classList.add("close-iframe");
  div2.innerHTML = `<span onclick='closeDialog()'><svg class="icon svgicon-cancel-circle"><use xlink:href="#svgicon-cancel-circle"></use></svg></span>`;
  div1.innerHTML = `<span class='iframe-window-dialog' ><span class='iframe-glo3d'>last content</span></span>`;
  document.body.appendChild(div1);
  document.body.appendChild(div2);
}
function findVin() {
  var vin = $(`span:contains("VIN#:")`)[0].nextSibling.nextSibling.innerText;
  console.log("vin", vin);
  if (vin) {
    getModelDataFromGlo3D(vin);
    return vin;
  } else {
    return "not_found";
  }
  return "";
}
function replaceDefaultImage(shortId) {
  let glo3dIFrame = document.createElement("iframe");
  const wrapper = document.createElement("div");
  wrapper.setAttribute("id", "glo3d-iframe-wrapper");
  wrapper.setAttribute("style", "align-items:center");
  glo3dIFrame.setAttribute(
    "src",
    `https://glo3d.net/iFrame/${shortId}?amp;autoRotate=true&footerGallery=true&condition=true&interior=true&themebgcolor=0x0x0&themetextcolor=white&galleryPositin=Bottom`
  );
  glo3dIFrame.setAttribute("frameborder", "0");
  glo3dIFrame.setAttribute("scrolling", "no");
  glo3dIFrame.setAttribute("allowfullscreen", "true");
  glo3dIFrame.setAttribute("loading", "lazy");
  glo3dIFrame.setAttribute("width", "100%");
  glo3dIFrame.setAttribute("height", "100%");
  glo3dIFrame.setAttribute("style", "min-height: 400px;");
  glo3dIFrame.classList.add("glo3d-iframe-height");
  glo3dIFrame.setAttribute("id", "glo3d-iframe-content");
  wrapper.appendChild(glo3dIFrame);
  $(".iframe-glo3d").replaceWith(wrapper);
  document.head.insertAdjacentHTML(
    "beforeend",
    `
        <style>
          #glo3d-iframe-wrapper {
            display: flex;
            justify-content: center;
            width: 100%;
            height: 100%;
          }
          .glo3d-iframe-height {
            height: 550px;
            min-height: 400px;
            max-width: 800px;
          }
          @media (max-width: 400px) {
            .glo3d-iframe-height {
              height: 300px;
            }
          }
        </style>
        `
  );
}
function getModelDataFromGlo3D(vin_number) {
  var data = { vin_number: vin_number, height: "400" };
  $.ajax({
    type: "POST",
    url: "https://us-central1-glo3d-c338b.cloudfunctions.net/vin",
    data: data,
    dataType: "json",
    error: function (request, status, error) {
      console.error(`Glo3d Javascript Status: ${status}`);
      console.error(`Glo3d Javascript Error: ${request.responseJSON.message}`);
    },
  }).done(function (result) {
    if (!result.short_id || result.privacy === "private") {
      return;
    }
    open360Image();
    replaceDefaultImage(result.short_id);
  });
}
function closeDialog() {
  $(".myModalGlo3d").remove();
  $(".close-iframe").remove();
}

var Glo3dVin = "";
function Glo3DVinExistance(x, counter) {
  const interval = window.setInterval(() => {
    if (findVin() !== "not_found") {
      clearInterval(interval);
    } else {
      counter++;
    }
    if (counter >= 3) {
      clearInterval(interval);
    }
  }, x);
}
function Glo3dCheckClick() {
  $(".carbox__overlay__quickViewCTA").on("mouseup", function () {
    $("#Glo3dAddedBtn").remove();
    Glo3dVin = "";
    console.log("Resetting Vin number");
    Glo3DVinExistance(1000, 0);
  });
}
Glo3dCheckClick();
function Glo3dOpen360Image() {
  const div1 = document.createElement("div");
  div1.classList.add("myModalGlo3d");
  const div2 = document.createElement("div");
  div2.classList.add("close-iframe");
  div2.innerHTML = `<span onclick='Glo3dCloseDialog()'><svg  class="glo3d-close-button icon svgicon-cancel-circle"><use xlink:href="#svgicon-cancel-circle"></use></svg></span>`;
  div1.innerHTML = `<span class='iframe-window-dialog' ><span class='iframe-glo3d'>last content</span></span>`;
  document.body.appendChild(div1);
  document.body.appendChild(div2);
}
function findVin() {
  var vins = document.querySelectorAll(".vehicleIds");
  let popUpVehicleId = "";
  vins = vins.forEach((e) => {
    if (e.classList.length === 1) {
      popUpVehicleId = e;
    }
  });
  var popUpVehicleIdVinChild = Array.from(popUpVehicleId.children)[1];
  var vinWrapperClose = Array.from(popUpVehicleIdVinChild.children)[1];
  let vin = vinWrapperClose.innerText;
  console.log("vin", vin);
  if (vin) {
    Glo3dGetModelData(vin);
    return vin;
  } else {
    return "not_found";
  }
}
function Glo3dReplaceDefaultImage(shortId) {
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
      "         background-color :rgba(0, 0, 0, 0.65);  \n" +
      "         display :flex;  \n" +
      "         justify-content :center;  \n" +
      "         align-items :center;  \n" +
      "        }\n" +
      "        @media (min-width: 1110.1px) {\n" +
      "  .close-iframe {\n" +
      "               left:82vw;\n" +
      "            }\n" +
      "            .iframe-window-dialog {\n" +
      "               width:100vw;\n" +
      "            }\n" +
      "}\n" +
      "        @media (max-width: 1110px) and (min-width:700.1px) {\n" +
      "  .close-iframe {\n" +
      "               left:94vw;\n" +
      "            }\n" +
      "            .iframe-window-dialog {\n" +
      "               width:100vw;\n" +
      "            }\n" +
      "}\n" +
      "        @media (min-width:300px) and (max-width: 700px)   {\n" +
      "            .iframe-window-dialog {\n" +
      "               width:100vw;\n" +
      "            }\n" +
      "}\n" +
      "</style>"
  );
  document.head.insertAdjacentHTML(
    "beforeend",
    ` <style>
          #glo3d-iframe-wrapper {
            display: flex;
            justify-content: center;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(1px);
            background: rgba(0,0,0, 0.5);
            padding-top: 56px;
            margin-right: 18px;
          }
          .glo3d-iframe-height {
            height: 650px;
            min-height: 400px;
            max-width: 733px;
          }
          .glo3d-close-button {
            color: rgba(255, 255, 255, 0.7);
            transform: scale(2);
            position: relative;
            right: 60px;
            transition: all 300ms ease-out;
          }
          .glo3d-close-button:hover {
            cursor: pointer;
            color: rgba(255, 255, 255, 0.98);
            transform: scale(2.2);
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
var Glo3dShortId = "";
function Glo3dGetModelData(vin_number) {
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

    Glo3dShortId = result.short_id;
    Glo3dAdd360Btn();
  });
}
function Glo3dAdd360Btn() {
  $(".learnMore__wrap").after(
    '<div class="col mt-2 col-md-5 learnMore__wrap" id="Glo3dAddedBtn"><h2 class="vdp--secondary-title d-none">Virtual Tour</h2><div class="text-center">' +
      '<button id="viewIframe"  class="btn btn-tertiary btn-lg btn__learnMore stat-text-link w-100" onclick="Glo3dOpenModel()"  >Virtual Tour <svg class="icon svgicon-caret_next"><use xlink:href="#svgicon-caret_next"></use></svg> </button></div></div>'
  );
}
function Glo3dOpenModel() {
  Glo3dOpen360Image();
  Glo3dReplaceDefaultImage(Glo3dShortId);
}
function Glo3dCloseDialog() {
  $(".myModalGlo3d").remove();
  $(".close-iframe").remove();
}

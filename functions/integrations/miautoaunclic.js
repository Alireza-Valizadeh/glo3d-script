jQuery(document).ready(function ($) {
  var vin = findVin();
  if (vin !== "not_found") {
    getModelDataFromGlo3D(vin);
  }

  function replaceDefaultImage(shortId) {
    let glo3dIFrame = document.createElement("iframe");
    const wrapper = document.createElement("div");
    wrapper.setAttribute("id", "glo3d-iframe-wrapper");
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
    $(".stm-car-carousels").replaceWith(wrapper);
    document.head.insertAdjacentHTML(
      "beforeend",
      `
    <style>
      #glo3d-iframe-wrapper {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        margin: 20px 0px;
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

  function findVin() {
    var vin = document.querySelector(".t-vin").innerText;
    console.log("vin", vin);
    if (vin) {
      return vin;
    }
    return "not_found";
  }

  function getModelDataFromGlo3D(vin_number) {
    console.log(36, vin_number);
    var data = { vin_number: vin_number, height: "400" };
    $.ajax({
      type: "POST",
      url: "https://us-central1-glo3d-c338b.cloudfunctions.net/vin",
      data: data,
      dataType: "json",
      error: function (request, status, error) {
        console.error(`Glo3d Javascript Status: ${status}`);
        console.error(
          `Glo3d Javascript Error: ${request.responseJSON.message}`
        );
      },
    }).done(function (result) {
      console.log("sid", result.short_id);
      if (!result.short_id || result.privacy === "private") {
        return;
      }
      replaceDefaultImage(result.short_id);
    });
  }
});

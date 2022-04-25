(async (APILoader) => {
  const API = await APILoader.create("glo3d");
  // Loads a JavaScript file
  API.loadJS(
    "https://cdn.jsdelivr.net/gh/alireza-valizadeh/glo3d-script@2cfa0cfac24e0c7ad4bacdc118731fde99911c1f/functions/integrations/base.js"
  ).then(() => {
    (async APILoader => {
      const API = await APILoader.create("glo3d");
      API.subscribe('vehicle-shown-v1', ev => {
        API.log("ev", ev);
        API.log("event.vin", ev.vin);
      });
    })(window.DDC.APILoader);
    jQuery(document).ready(function ($) {
      console.log("loaded document succesfully");
      const photosElem = document.querySelector("#photos");
      console.log("photosElem", photosElem);
      getModelDataFromGlo3D("1V2MR2CA9KC524271");
      function replaceDefaultImage(shortId) {
        console.log("shortId", shortId);
        let glo3dIFrame = document.createElement("iframe");
        glo3dIFrame.setAttribute(
          "src",
          `https://glo3d.net/iFrame/${shortId}?autoLoad=true&amp;autoRotate=true&footerGallery=true&condition=true&interior=true&themebgcolor=0x0x0&themetextcolor=white&galleryPositin=Bottom`
        );
        glo3dIFrame.setAttribute("frameborder", "0");
        glo3dIFrame.setAttribute("scrolling", "no");
        glo3dIFrame.setAttribute("allowfullscreen", "true");
        glo3dIFrame.setAttribute("loading", "lazy");
        glo3dIFrame.setAttribute("width", "100%");
        glo3dIFrame.setAttribute("height", "100%");
        glo3dIFrame.setAttribute("style", "min-height: 400px;");
        glo3dIFrame.classList.add("glo3d-iframe-height");
        photosElem.replaceWith(glo3dIFrame);
        document.head.insertAdjacentHTML(
          "beforeend",
          `
        <style>
          .glo3d-iframe-height {
            height: 550px;
            min-height: 400px;
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
        console.log("vin_number", vin_number);
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
          console.log("aResult", result);
          if (!result.short_id || result.privacy === "private") {
            return;
          }
          replaceDefaultImage(result.short_id);
        });
      }
    });
  });
})(window.DDC.APILoader);

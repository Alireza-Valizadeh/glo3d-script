(async (APILoader) => {
  const API = await APILoader.create(document.currentScript || "glo3d");
  API.subscribe("vehicle-shown-v1", (ev) => {
    if (ev.payload.vin) {
      const vinNumber = ev.payload.vin;
      let shortId = "";
      console.log("vinNumber", vinNumber);
      var data = { vinNumber: vinNumber, height: "400" };
      $.ajax({
        type: "POST",
        url: "https://us-central1-glo3d-c338b.cloudfunctions.net/vin",
        data: data,
        dataType: "json",
        error: function (request, status, error) {
          console.error(`Glo3D Javascript Status: ${status}`);
          console.error(
            `Glo3D Javascript Error: ${request.responseJSON.message}`
          );
        },
      }).done(function (result) {
        console.log("Glo3D Result", result);
        if (!result.short_id || result.privacy === "private") {
          return;
        }
        shortId = result.short_id;
      });
      API.insert("vehicle-media-container", (elem, meta) => {
        const glo3dIFrame = document.createElement("iframe");
        glo3dIFrame.style =
          "background-color: #fff; height: 550px; min-height: 400px;";
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
        API.append(elem, glo3dIFrame);
      });
    }
  });
})(window.DDC.APILoader);

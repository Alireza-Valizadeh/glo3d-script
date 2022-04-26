(async (APILoader) => {
  const API = await APILoader.create("glo3d");
  // Loads a JavaScript file
  API.loadJS(
    "https://cdn.jsdelivr.net/gh/alireza-valizadeh/glo3d-script@c9b2fe5515ddda226beace24bfeffe9795790d50/functions/integrations/ddc/ddc.js"
  ).then(() => async (APILoader) => {
    console.log("loadeddddddd");
  });
})(window.DDC.APILoader);

(async (APILoader) => {
  const API = await APILoader.create("glo3d");
  // Loads a JavaScript file
  API.loadJS(
    "https://cdn.jsdelivr.net/gh/alireza-valizadeh/glo3d-script@40af3b7ad8b0944ecdb57f125d01aeb9ff35cf29/functions/integrations/ddc/ddc.js"
  ).then(() => async (APILoader) => {
    console.log("loadeddddddd");
  });
})(window.DDC.APILoader);

(async (APILoader) => {
  const API = await APILoader.create("glo3d");
  // Loads a JavaScript file
  API.loadJS(
    "https://cdn.jsdelivr.net/gh/alireza-valizadeh/glo3d-script@24b987df37f75aff9b32bca754a2be73a5232aa9/functions/integrations/ddc/ddc.js"
  ).then(() => async (APILoader) => {
    console.log("loadeddddddd");
  });
})(window.DDC.APILoader);

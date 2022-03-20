/*
Author: Glo3D Inc. glo3d.com glo3d.net glo3dapp.com
Design and Developed by: glo3d.net
*/
window.onload = function () {
  if (window.jQuery) {
      // jQuery is loaded
      console.log("jQuery is loaded")
      addStyles()
  } else {
      // jQuery is not loaded
      addjQuery()
      addStyles()
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function addStyles() {
  document.head.insertAdjacentHTML("beforeend", '<style>' +
      '/* The Modal (background) */\n' +
      '        .myModalGlo3D {\n' +
      '            display: none; /* Hidden by default */\n' +
      '            position: fixed; /* Stay in place */\n' +
      '            z-index: 10000; /* Sit on top */\n' +
      '            padding-top: 100px; /* Location of the box */\n' +
      '            left: 0;\n' +
      '            top: 0;\n' +
      '            width: 100%; /* Full width */\n' +
      '            height: 100%; /* Full height */\n' +
      '            overflow: auto; /* Enable scroll if needed */\n' +
      '            background-color: rgb(0,0,0); /* Fallback color */\n' +
      '            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */\n' +
      '        }\n' +
      '\n' +
      '        /* Modal Content */\n' +
      '        .modal-content-glo3d {\n' +
      '            background-color: #fefefe;\n' +
      '            margin: 100px auto;\n' +
      '            padding: 10px;\n' +
      '            border: 1px solid #888;\n' +
      '            width: 55%;\n' +
      '            text-align: center;\n' +
      '        }\n' +
      '\n' +
      '        /* The Close Button */\n' +
      '        .close-glo {\n' +
      '            color: #aaaaaa;\n' +
      '            float: right;\n' +
      '            font-size: 28px;\n' +
      '            font-weight: bold;\n' +
      '        }\n' +
      '\n' +
      '        .close-glo:hover,\n' +
      '        .close-glo:focus {\n' +
      '            color: #000;\n' +
      '            text-decoration: none;\n' +
      '            cursor: pointer;\n' +
      '        }\n' +
      '\n' +
      '        .modal-btn {\n' +
      '            border: 1px solid #999;\n' +
      '            border-radius: 30px;\n' +
      '            padding: 10px;\n' +
      '            background: #eee;\n' +
      '            color: #222;\n' +
      '        }\n' +
      '\n' +
      '        @media (max-width: 1000px) {\n' +
      '            .myModalGlo3D {\n' +
      '                padding-top: 0;\n' +
      '            }\n' +
      '\n' +
      '            .modal-content-glo3d {\n' +
      '                padding: 5px;\n' +
      '                width: 100%;\n' +
      '                margin-top: 0;\n' +
      '                z-index: 10000;\n' +
      '            }\n' +
      '\n' +
      '            .modal-content-glo3d iframe {\n' +
      '                width: 99%;\n' +
      '                /*height: 100%;*/\n' +
      '            }\n' +
      '\n' +
      '            .close-glo {\n' +
      '                font-size: 30px;\n' +
      '                position: absolute;\n' +
      '                color: #111111;\n' +
      '                right: 10px;\n' +
      '            }\n' +
      '\n' +
      '            .slideshow iframe {\n' +
      '                width: 100%;\n' +
      '                height: 350px;\n' +
      '            }\n' +
      '        }\n' +
      '\n' +
      '        @media (max-width: 400px) {\n' +
      '            .myModalGlo3D {\n' +
      '                padding-top: 100px;\n' +
      '            }\n' +
      '\n' +
      '            .modal-content-glo3d {\n' +
      '                padding: 5px;\n' +
      '                width: 100%;\n' +
      '                z-index: 10000;\n' +
      '            }\n' +
      '\n' +
      '            .modal-content-glo3d iframe {\n' +
      '                width: 99%;\n' +
      '                height: 100%;\n' +
      '            }\n' +
      '\n' +
      '            .close-glo {\n' +
      '                font-size: 20px;\n' +
      '                position: absolute;\n' +
      '                right: 10px;\n' +
      '            }\n' +
      '\n' +
      '            .slideshow iframe {\n' +
      '                width: 100%;\n' +
      '                height: 240px;\n' +
      '            }\n' +
      '        }' +
      '</style>')
}


function addjQuery() {
  // Create the element
  var script = document.createElement("script");
  // Add script content
  script.src = "https://code.jquery.com/jquery-3.5.1.min.js"
// Append
  document.body.appendChild(script);
}

jQuery(document).ready(function ($) {
  var site = window.location.hostname.toLowerCase().replace('www.', '')
  var vin_number = findVin(site)
  if (vin_number != 'not_found') {
      var modelData = getModelDataFromGlo3D(vin_number, site)
  }

  if (site == 'aquascaperoom.ca') {
      return
      getImageThumbsFromGlo3D()
      $('body').on('click', '.quickview', function () {
          // console.log(1111111333333)
          var myElement = $(this)
          var imageUrl = myElement.closest('.card-figure').find('img').attr('src')
          console.log(imageUrl)
          if (imageUrl.includes('glo3d')) {
              console.log(156)
              setTimeout(function () {
                  $('.productView-images').html('<img src="' + imageUrl + '" />')
              }, 2000)
          }
      })
  }

  function getImageThumbsFromGlo3D() {
      $('.card-title').each(function () {
          var myElement = $(this)
          var sku = myElement.text().split('*')[1]
          if (typeof sku !== 'undefined') {
              sku = sku.trim()
              // console.log(157, sku, site)
              var localImage = localStorage.getItem(sku)
              var url = $(myElement).find('a').attr('href')
              var myInterval = setInterval(function () {
                  var imageUrl = $('a[href="' + url + '"]').find('img').attr('src')
                  console.log(175, sku, imageUrl)
                  if (typeof localImage !== 'undefined' && localImage !== null) {
                      $('a[href="' + url + '"]').find('img').attr('src', localImage).removeClass('lazyautosizes ls-is-cached lazyloaded')
                  } else {
                      getModelDataBySkuFromGlo3D(sku, site).then(function (modelData) {
                          localStorage.setItem(sku, modelData.preview_image)
                          if (!modelData.code) {
                              $('a[href="' + url + '"]').find('img').attr('src', modelData.preview_image)
                          }
                      })
                  }
                  if (!imageUrl.includes('ProductDefault.gif') && !imageUrl.includes('loading.svg')) {
                      clearInterval(myInterval)
                      return
                  }
              }, 200)
          }
      })
  }

  function findVin(site) {
      switch (site) {
          case 'aquascaperoom.ca':
              var foundin = $('.productView-desc-content:contains("SKU:")')
              var sku = $('.productView-title').text().split('*')[1].trim()
              if (sku == '') {
                  sku = foundin.find('*:contains("SKU")').text().toUpperCase().split('SKU:')[1].trim()
                  // sku = $(foundin.html()).last().text().toUpperCase().replace('SKU:', '')
              }
/*
              if (sku == '') {
                  sku = foundin.find('*:contains("SKU")').text().toUpperCase().replace(/SKU:/g, '').trim()
              }
*/
              return sku
              break;
          default:
              var foundin = $('*:contains("VIN")');
              $(foundin).each(function () {
                  if ($(this).children().length < 1) {
                      // console.log($(this).text())
                      $(this).siblings().each(function () {
                          vin_number = $(this).text()
                      })
                  }
              })
              if (validateVin(vin_number)) {
                  return vin_number
              }
              break;
      }
      return 'not_found'
  }

  async function getModelDataBySkuFromGlo3D(sku, site) {
      var data = {type: 'sku', vin_number: sku, height: '400'}
      return $.ajax({
          type: 'POST',
          url: 'https://us-central1-glo3d-c338b.cloudfunctions.net/vin',
          data: data,
          dataType: 'json'
      }).done(function (result) {
          if (!result.short_id) {
              return {code: 404, message: 'not found'}
          } else {
              return result
          }
      });

  }

  function getModelDataFromGlo3D(vin_number, site) {
      var data = {vin_number: vin_number, height: '400'}
      if (site == 'aquascaperoom.ca') {
          data.type = 'sku'
      }
      $.ajax({
          type: 'POST',
          url: 'https://us-central1-glo3d-c338b.cloudfunctions.net/vin',
          data: data,
          dataType: 'json'
      }).done(function (result) {
          if (!result.short_id) {
              return
          }
          switch (site) {
              case 'aquascaperoom.ca':
                  addGloModal(result.short_id, "100%", "550px")
                  if (result.preview_image) {
                      // $('.productView-images').append('<img id="glo3d-preview" src="' + result.preview_image + '" />')
                      $('.productView-images').append('<div id="glo3d-preview"></div>')
                  }
                  add360Button(site)
                  replaceDefaultImage(result.short_id);
                  break;
              default:
                  addGloModal(result.short_id, "100%", "550px")
                  add360Button(site)
                  $('.my-gallery')
                      .find('[data-slick-index=1]')
                      .before('<figure class="slick-slide" data-slick-index="1" aria-hidden="true" style="width: 555px;" tabindex="-1" role="option" aria-describedby="slick-slide01">' + result.iframe + '</figure>')
                  $('.slick-slider').slick('reinit')
                  break;
          }
      });
  }

  function add360Button(site) {
      console.log(281, site)
      switch (site) {
          case 'aquascaperoom.ca':
              $('#glo3d-preview').after('<div id="glo3d-360-btn" style="\n' +
                  '    text-align: center;\n' +
                  '    margin-top: 10px;\n' +
                  '    background: #b1e01e;\n' +
                  '    color: #fff;\n' +
                  '    padding: 10px;\n' +
                  '    border-radius: 5px;\n' +
                  '    cursor: pointer;\n' +
                  '">View 360° Photo</div>')
              var script = document.createElement("script");
              script.innerHTML = '' +
                  '    $(\'body\').on(\'click\', \'#glo3d-360-btn\', function () {\n' +
                  '        var modal = document.getElementById(\'myModalGlo3D\');\n' +
                  '        modal.style.display = "block";\n' +
                  '        if (!document.getElementById("my-glo3d-iframe").src.includes(\'?t=\')) {\n' +
                  '            document.getElementById("my-glo3d-iframe").src = document.getElementById("my-glo3d-iframe").src + \'?t=\' + Date.now()\n' +
                  '            setTimeout(function () {\n' +
                  '                document.getElementById("my-glo3d-iframe").style.display = "block"\n' +
                  '            }, 200)\n' +
                  '        }\n' +
                  '    })\n' +
                  '\n' +
                  '    $(document).on(\'click\', \'.close-glo\', function () {\n' +
                  '        var modal = document.getElementById(\'myModalGlo3D\');\n' +
                  '        modal.style.display = "none";\n' +
                  '    })\n' +
                  '\n' +
                  '    // When the user clicks anywhere outside of the modal, close it\n' +
                  '    window.onclick = function (event) {\n' +
                  '        var modal = document.getElementById(\'myModalGlo3D\');\n' +
                  '        if (event.target == modal) {\n' +
                  '            modal.style.display = "none";\n' +
                  '        }\n' +
                  '    }';
              document.body.appendChild(script);
              break;
          default:
              $('.slider-nav').after('<div id="glo3d-360-btn" style="\n' +
                  '    text-align: center;\n' +
                  '    background: #ffb319;\n' +
                  '    color: #fff;\n' +
                  '    padding: 10px;\n' +
                  '    border-radius: 5px;\n' +
                  '    cursor: pointer;\n' +
                  '">View 360° Virtual Tour</div>')
      }
  }
  function replaceDefaultImage(shortId) {
    console.log("Glo3D::::: Starting to replace the gallery", shortId);
    let glo3dIFrame = document.createElement("iframe");
    glo3dIFrame.setAttribute("src", `https://glo3d.net/iFrame/${shortId}?autoLoad=true&amp;autoRotate=true`);
    glo3dIFrame.setAttribute("frameborder", "0");
    glo3dIFrame.setAttribute("width", "100%");
    glo3dIFrame.setAttribute("height", "550px");
    glo3dIFrame.setAttribute("scrolling", "no");
    glo3dIFrame.setAttribute("allowfullscreen", "true");
    glo3dIFrame.setAttribute("loading", "lazy");
    $(".productView-imageCarousel-main").replaceWith(glo3dIFrame);
  }

  function addGloModal(shortId, width, height) {
      $('body').append('<div id="myModalGlo3D" class="myModalGlo3D">\n' +
          '                <!-- Modal content -->\n' +
          '            <div class="modal-content-glo3d">\n' +
          '                <span class="close-glo">×</span>\n' +
          '                <iframe style="display: block; margin: 0 auto; width: ' + width + '; height: ' + height + '; background: url(https://360spin.glo3d.net/loader.gif) center center no-repeat;" id="my-glo3d-iframe" src="https://glo3d.net/iFrame/' + shortId + '?autoLoad=true&amp;autoRotate=true" frameborder="0" scrolling="no"></iframe>\n' +
          '                </div>\n' +
          '                </div>')
  }
})
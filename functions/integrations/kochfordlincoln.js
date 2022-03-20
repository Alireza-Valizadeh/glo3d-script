jQuery(document).ready(function ($) {

    var embedSettingParams = 'speed=Medium&amp;language=English&amp;topBar=true&amp;footerGallery=true&amp;zoom=false&amp;hotspots=true&amp;autoLoad=false&amp;autoRotate=false'
    var aspectRatio = 1
    var site = window.location.hostname.toLowerCase().replace('www.', '')
    console.log(1, site)
    var vin_number = findVin(site)
    console.log(2, vin_number)
    if (vin_number != 'not_found') {
        sleep(500).then(function () {
            if (localStorage.getItem('vin') != vin_number) {
                localStorage.setItem('vin', vin_number)
            }
            getModelDataFromGlo3D(vin_number, site)
        })
    }

    function findVin() {
        var data = $('#product__json').html();
        if (data) {
            try {
                var json = JSON.parse(data);
                vin_number = json.variants[0].barcode
                if (validateVin(vin_number)) {
                    return vin_number
                } else {
                    console.log('no valid vin')
                }
            } catch (e) {
                console.log(e)
            }
        } else {
            console.log('No vin data found on this page!')
        }
        return 'not_found'
    }

    function getModelDataFromGlo3D(vin_number, site) {
        console.log(36, vin_number, site)
        var data = { vin_number: vin_number, height: '400' }
        $.ajax({
            type: 'POST',
            url: 'https://us-central1-glo3d-c338b.cloudfunctions.net/vin',
            data: data,
            dataType: 'json',
            error: function (request, status, error) {
                console.error(`Glo3d Javascript Status: ${status}`);
                console.error(`Glo3d Javascript Error: ${request.responseJSON.message}`)
            }
        }).done(function (result) {
            console.log("aResult", result);
            if (!result.short_id || result.privacy === "private") {
                return
            }
            aspectRatio = result.iFrameRatio
            addGloModal(result.short_id, "100%", "340px")
            // add360Button()
            $('#product-images').html('<iframe allowfullscreen="true" loading="lazy" style="display: block; margin: 0px auto; background: url(&quot;https://360spin.glo3d.net/loader.gif&quot;) center center no-repeat; height: 784.138px;" id="my-glo3d-iframe" src="https://glo3d.net/iFrame/' + result.short_id + '?' + embedSettingParams + '" width="1137" height="720" frameborder="0" scrolling="no"></iframe>')
        })
    }

    function add360Button() {
        $('.product-options__actions-buttons_main').prepend('<a id="glo3d-360-btn" class="btn" style="background-color: #336699!important; text-align: center; color: #fff; width: 100%; height: 50px; margin-bottom: 10px; vertical-align: middle; line-height: 2.8em;">View 360° Virtual Tour</a>')
    }

    function addGloModal(shortId, width, height) {
        $('body').append('<div id="myModalGlo3D" style="padding-top: 30px !important; height:100%; display:none !important; justify-content: center;" class="myModalGlo3D">\n' +
            '                <!-- Modal content -->\n' +
            '            <div class="modal-content-glo3d" style="margin: 0; display: flex !important; flex-direction: column; justify-content:flex-start; align-items:flex-end; height: 80%">\n' +
            '                <span class="close-glo">×</span>\n' +
            '                <iframe loading="lazy" style="display: block; margin: 0; width:100%; height:100vh; background: url(https://360spin.glo3d.net/loader.gif) center center no-repeat;" id="my-glo3d-iframe" src="https://glo3d.net/iFrame/' + shortId + '?' + embedSettingParams + '" frameborder="0" scrolling="no"></iframe>\n' +
            '                </div>\n' +
            '                </div>')
    }

    $(document).on('click', '#glo3d-360-btn', function () {
        var modal = document.getElementById('myModalGlo3D');
        modal.style.display = "flex";
        if (!document.getElementById("my-glo3d-iframe").src.includes('?t=')) {
            console.log("A", parseInt(Date.now() / 600000));
            document.getElementById("my-glo3d-iframe").src = document.getElementById("my-glo3d-iframe").src + '?t=' + parseInt(Date.now() / 600000)
            setTimeout(function () {
                document.getElementById("my-glo3d-iframe").style.display = "flex"
            }, 200)
        }
    })

    $(document).on('click', '.close-glo', function () {
        var modal = document.getElementById('myModalGlo3D');
        modal.style.display = "none";
    })

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        var modal = document.getElementById('myModalGlo3D');
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    function setGloIframeHeight() {
        if (document.getElementById('my-glo3d-iframe')) {
            document.getElementById('my-glo3d-iframe').style.height = (100 + document.getElementById('my-glo3d-iframe').offsetWidth / aspectRatio) + 'px'
        }
        
    }

    window.addEventListener('resize', setGloIframeHeight)
    window.addEventListener('load', setGloIframeHeight)

})

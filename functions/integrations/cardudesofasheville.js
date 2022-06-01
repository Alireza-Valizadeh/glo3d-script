jQuery(document).ready(function ($) {
    var site = window.location.hostname.toLowerCase().replace('www.', '')
    console.log(site)
    if (site != 'cardudesofasheville.com') {
        return
    }
    var vin_number = findVin(site)
    console.log(vin_number)
    if (vin_number != 'not_found') {
        sleep(500).then(function () {
            if (localStorage.getItem('vin') != vin_number) {
                localStorage.setItem('vin', vin_number)
            }
            getModelDataFromGlo3D(vin_number, site)
        })
    }

    function findVin() {
        var data = $('#dws-vdp-schema').html();
        if (data) {
            try {
                var json = JSON.parse(data);
                vin_number = json.makesOffer.itemOffered.vehicleIdentificationNumber
                if (validateVin(vin_number)) {
                    return vin_number
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
        console.log(273, vin_number, site)
        var data = {vin_number: vin_number, height: '400'}
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
            if (!result.short_id) {
                return
            }
            addGloModal(result.short_id, "100%", "550px")
            add360Button()
            $('.dws-vdp-media-slider').slick('slickAdd', '<li>' + result.iframe + '</li>', 0);
            $('.dws-vdp-media-slider-thumbnail').slick('slickAdd', '<li><img src="https://us-central1-glo3d-c338b.cloudfunctions.net/thumb/' + result.short_id + '" style="width:110px" /></li>', 0);
        });
    }

    function add360Button() {
        $('.dws-vehicle-fields').after('<div id="glo3d-360-btn" style="\n' +
            '    text-align: center;\n' +
            '    background: #b22e25;\n' +
            '    color: #fff;\n' +
            '    padding: 10px;\n' +
            '    border-radius: 5px;\n' +
            '    cursor: pointer;\n' +
            '    margin-bottom: 10px;\n' +
            '">View 360° Photo</div>')
    }

    function addGloModal(shortId, width, height) {
        $('body').append('<div id="myModalGlo3D" class="myModalGlo3D">\n' +
            '                <!-- Modal content -->\n' +
            '            <div class="modal-content-glo3d">\n' +
            '                <span class="close-glo">×</span>\n' +
            '                <iframe allowfullscreen="true" loading="lazy" style="display: block; margin: 0 auto; width: ' + width + '; height: ' + height + '; background: url(https://360spin.glo3d.net/loader.gif) center center no-repeat;" id="my-glo3d-iframe" src="https://glo3d.net/iFrame/' + shortId + '?amp;autoRotate=true" frameborder="0" scrolling="no"></iframe>\n' +
            '                </div>\n' +
            '                </div>')
    }

    $(document).on('click', '#glo3d-360-btn', function () {
        var modal = document.getElementById('myModalGlo3D');
        modal.style.display = "block";
        if (!document.getElementById("my-glo3d-iframe").src.includes('?t=')) {
            document.getElementById("my-glo3d-iframe").src = document.getElementById("my-glo3d-iframe").src + '?t=' + Date.now()
            setTimeout(function () {
                document.getElementById("my-glo3d-iframe").style.display = "block"
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

})

jQuery(document).ready(function ($) {
    var site = window.location.hostname.toLowerCase().replace('www.', '')
    console.log(site)
    if (site != 'bumbleauto.com') {
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
        var vin_number = ''
        var foundin = $('*:contains("VIN")');
        $(foundin).each(function () {
            if ($(this).children().length < 1) {
                $(this).siblings().each(function () {
                    vin_number = $(this).text()
                })
            }
        })
        if (validateVin(vin_number)) {
            return vin_number
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
            $('.detail-big-car-gallery').slick('slickAdd', '<figure>' + result.iframe + '</figure>', 0);
            $('.slider-nav').slick('slickAdd', '<figure><img src="https://us-central1-glo3d-c338b.cloudfunctions.net/thumb/' + result.short_id + '" style="width:110px" /></figure>', 1);
        });
    }

    function add360Button() {
                $('.slider-nav').after('<div id="glo3d-360-btn" style="\n' +
                    '    text-align: center;\n' +
                    '    background: #ffb319;\n' +
                    '    color: #fff;\n' +
                    '    padding: 10px;\n' +
                    '    border-radius: 5px;\n' +
                    '    cursor: pointer;\n' +
                    '">View 360° Virtual Tour</div>')
    }

    function addGloModal(shortId, width, height) {
        $('body').append('<div id="myModalGlo3D" class="myModalGlo3D">\n' +
            '                <!-- Modal content -->\n' +
            '            <div class="modal-content-glo3d">\n' +
            '                <span class="close-glo">×</span>\n' +
            '                <iframe allowfullscreen="true" loading="lazy" style="display: block; margin: 0 auto; width: ' + width + '; height: ' + height + '; background: url(https://360spin.glo3d.net/loader.gif) center center no-repeat;" id="my-glo3d-iframe" src="https://glo3d.net/iFrame/' + shortId + '?autoLoad=true&amp;autoRotate=true" frameborder="0" scrolling="no"></iframe>\n' +
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

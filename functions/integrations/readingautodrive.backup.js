jQuery(document).ready(function ($) {
    var site = window.location.hostname.toLowerCase().replace('www.', '')
    console.log(3, site)
    if (site != 'readingautodrive.com') {
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
        $('.dws-theme-bg-1').find('.vc_column-inner').prepend('<div id="glo3d-360-btn" style="\n' +
            '    text-align: center;\n' +
            '    background: #c1272d;\n' +
            '    color: #fff;\n' +
            '    padding: 10px;\n' +
            '    border-radius: 5px;\n' +
            '    cursor: pointer;\n' +
            '    width: 100%;\n' +
            '    position: absolute;\n' +
            '    top: -45px;\n' +
            '    left: 0;\n' +
            '">View 360° Photo</div>')
    }

    function addGloModal(shortId, width, height) {
        $('body').append('<div id="myModalGlo3D" class="myModalGlo3D">\n' +
            '                <!-- Modal content -->\n' +
            '            <div class="modal-content-glo3d">\n' +
            '                <span class="close-glo">×</span>\n' +
            '                <iframe allowfullscreen="true" loading="lazy" style="display: block; margin: 0 auto; width: ' + width + '; height: ' + height + '; background: url(https://360spin.glo3d.net/loader.gif) center center no-repeat;" id="my-glo3d-iframe" src="https://glo3d.net/iFrame/' + shortId + '?amp;autoRotate=true&amp;galleryFooter=true" frameborder="0" scrolling="no"></iframe>\n' +
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

    let multiVinProcess = () => {
        let vins = []
        jQuery('.dws-vehicle-listing-container').find('.dws-vehicle-listing-item').each(
        // jQuery('.dws-vehicle-listing-item').each(
        (key, item) => { 
            let vin = jQuery(item).find('.dws-vlp-modal-control-container').data('vehicle-vin')
            vins.push(vin)
            jQuery(item).find('.dws-vehicle-listing-item-buttons').append('<a aria-label="View 360 Photo" type="button" id="glo-'+vin+'" data-vin="'+vin+'" class="btn btn-sm btn-primary glo-btn glo-'+vin+'"" href="#" style="display: none">VIEW 360 PHOTO</a>')
        })
        jQuery('.dws-vehicle-listing-mobile-container').find('.dws-vehicle-listing-item').each(
        // jQuery('.dws-vehicle-listing-item').each(
        (key, item) => { 
            let vin = jQuery(item).find('.dws-vlp-modal-control-container').data('vehicle-vin')
            // vins.push(vin)
            jQuery(item).find('.dws-vehicle-listing-item-buttons').prepend('<a aria-label="View 360 Photo" type="button" id="glo-'+vin+'" data-vin="'+vin+'" class="btn btn-block btn-primary glo-btn glo-'+vin+'" href="#" style="display: none">VIEW 360 PHOTO</a>')
        })
        console.log(vins.join())
        getModelsDataFromGlo3D(vins.join())
        
        function getModelsDataFromGlo3D(vin_numbers) {
            console.log(118, vin_numbers)
            var data = {vin_numbers: vin_numbers, height: '400'}
            $.ajax({
                type: 'POST',
                url: 'https://us-central1-glo3d-c338b.cloudfunctions.net/vins',
                data: data,
                dataType: 'json'
            }).done(function (result) {
                for (let key in result) {
                    let modelData = result[key]
                    if (modelData.code == 200) {
                        console.log(modelData)
                        addGloModalWithVin(modelData.data.short_id, "100%", "550px", modelData.vin)
                    }
                }
            });
        }
        
        function activate360Button(vin) {
            jQuery('.glo-' + vin).show()
        }
        
        $(document).on('click', '.glo-btn', function () {
                var vin = $(this).data('vin')
                console.log(vin)
                var modal = jQuery('#myModalGlo3D-' + vin)
                modal.show()
                if (!document.getElementById("my-glo3d-iframe-" + vin).src.includes('?t=')) {
                    document.getElementById("my-glo3d-iframe-" + vin).src = document.getElementById("my-glo3d-iframe-" + vin).src + '?t=' + Date.now()
                    setTimeout(function () {
                        $("#my-glo3d-iframe-" + vin).show()
                    }, 200)
                }
            })
            
        function addGloModalWithVin(shortId, width, height, vin) {
                jQuery('.glo-' + vin).show()
                $('body').append('<div id="myModalGlo3D-'+vin+'" class="myModalGlo3D">\n' +
                    '                <!-- Modal content -->\n' +
                    '            <div class="modal-content-glo3d">\n' +
                    '                <span class="close-glo-btn" data-vin="'+vin+'">×</span>\n' +
                    '                <iframe allowfullscreen="true" loading="lazy" style="display: block; margin: 0 auto; width: ' + width + '; height: ' + height + '; background: url(https://360spin.glo3d.net/loader.gif) center center no-repeat;" id="my-glo3d-iframe-'+vin+'" src="https://glo3d.net/iFrame/' + shortId + '?amp;autoRotate=true&amp;galleryFooter=true" frameborder="0" scrolling="no"></iframe>\n' +
                    '                </div>\n' +
                    '                </div>')
            }	
        
            $(document).on('click', '.close-glo-btn', function () {
                var vin = $(this).data('vin')
                var modal = jQuery('#myModalGlo3D-' + vin)
                modal.hide();
            })
        
            // When the user clicks anywhere outside of the modal, close it
            // window.onclick = function (event) {
            //     console.log(event.target.className)
            //     $('#' + event.target.id).hide()
            // }
            
        }
        
    setTimeout(multiVinProcess, 2000)

})

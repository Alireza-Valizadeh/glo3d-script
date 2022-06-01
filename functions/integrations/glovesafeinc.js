let myInterval = setInterval(() => {
    if (window.jQuery) {
        clearInterval(myInterval)
        jQuery(document).ready(function ($) {
            
            $.fn.xpathEvaluate = function (xpathExpression) {
                // NOTE: vars not declared local for debug purposes
                $this = this.first(); // Don't make me deal with multiples before coffee
             
                // Evaluate xpath and retrieve matching nodes
                xpathResult = this[0].evaluate(xpathExpression, this[0], null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
             
                result = [];
                while (elem = xpathResult.iterateNext()) {
                   result.push(elem);
                }
             
                $result = jQuery([]).pushStack( result );
                return $result;
             }

            var aspectRatio = 1
            var site = window.location.hostname.toLowerCase().replace('www.', '')
            console.log(3, site)
            var pin = findVin(site)
            console.log(5, pin)
            if (pin != 'not_found') {
                sleep(500).then(function () {
                    if (localStorage.getItem('pin') != pin) {
                        localStorage.setItem('pin', pin)
                    }
                    getModelDataFromGlo3D(pin, site)
                })
            }
        
            function findVin() {
                var pin = document.title.trim()
                return pin
            }
        
            function getModelDataFromGlo3D(vin_number, site) {
                console.log(36, vin_number, site)
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
                    aspectRatio = result.iFrameRatio
                    addGloModal(result.short_id, "100%", "340px")
                    add360Button()
                    $(document).xpathEvaluate('/html/body/div/div/div[3]/div/main/div/div/div/div[2]/div/div/div/div[1]').html('<iframe allowfullscreen="true" loading="lazy" style="display: block; margin: 0px auto; background: url(&quot;https://360spin.glo3d.net/loader.gif&quot;) center center no-repeat; height: 650px;" id="my-glo3d-iframe" src="https://glo3d.net/iFrame/' + result.short_id + '?amp;autoRotate=true" width="800" height="650" frameborder="0" scrolling="no"></iframe>')
                });
            }
        
            function add360Button() {
                $('.product-options__actions-buttons_main').prepend('<a id="glo3d-360-btn" class="btn" style="background-color: #336699!important; text-align: center; color: #fff; width: 100%; height: 50px; margin-bottom: 10px; vertical-align: middle; line-height: 2.8em;">View 360° Virtual Tour</a>')
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
        
            function setGloIframeHeight() {
                document.getElementById('my-glo3d-iframe').style.height = (100 + document.getElementById('my-glo3d-iframe').offsetWidth / aspectRatio) + 'px'
            }
            
            window.addEventListener('resize', setGloIframeHeight)
            window.addEventListener('load', setGloIframeHeight)
        
        })
        
    }
}, 200)

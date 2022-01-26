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
        console.log("Loading jQuery")
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
        '                margin-top: 135px;\n' +
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
        '#DWSHeaderNav #DWSMainNavBar { position: unset}\n' +
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

function $xp(xPath, $scope) {
    var selector = convertXPath(xPath);
    return $(selector, $scope);
}

function convertXPath(x) {

    //parse //*
    x = replace(x, '//\\*', '');

    //parse id
    x = replace(x, '\\[@id="([^"]*)"\\]', '#$1');

    //parse [1]
    x = replace(x, '\\[1\\]', ':first');

    //parse [n]
    x = replace(x, '\\[([0-9]+)\\]', ':eq($1)');

    //parse :eq's and lower 1
    var z = x.split(':eq(');
    x = z[0];
    if (z.length > 1) {
        for (var i = 1; i < z.length; i++) {
            var end = z[i].indexOf(')');
            var number = parseInt(z[i].substr(0, end)) - 1;
            x = x + ':eq(' + number + z[i].substr(end);
        }
    }

    //parse /
    x = replace(x, '/', ' > ');

    return x;
}

function replace(txt, r, w) {
    var re = new RegExp(r, "g");
    return txt.replace(re, w);
}

function validateVin(vin) {
    return validate(vin);

    // source: https://en.wikipedia.org/wiki/Vehicle_identification_number#Example_Code
    // ---------------------------------------------------------------------------------
    function transliterate(c) {
        return '0123456789.ABCDEFGH..JKLMN.P.R..STUVWXYZ'.indexOf(c) % 10;
    }

    function get_check_digit(vin) {
        var map = '0123456789X';
        var weights = '8765432X098765432';
        var sum = 0;
        for (var i = 0; i < 17; ++i)
            sum += transliterate(vin[i]) * map.indexOf(weights[i]);
        return map[sum % 11];
    }

    function validate(vin) {
        if (typeof vin === 'undefined') return false;
        if (vin.length !== 17) return false;
        return get_check_digit(vin) === vin[8];
    }

    // ---------------------------------------------------------------------------------
}
(function() {
"use strict";

if (!window.doOnReady) {
    (function() { 
        var s = document.createElement('script');
        s.addEventListener('load', function() { doOnReady(varbroSetup); });
        s.src = "https://chrislewis.codes/js/polyfill.js";
        document.head.appendChild(s);
    })();
} else {
    doOnReady(varbroSetup);
}

function varbroSetup() {
    overrideTNJS();
    setupPlaygrounds();
}

function overrideTNJS() {
    //cancel expando/collapse sidebar headers
    document.querySelectorAll('.content-filters h3 a').forEach(function(a) {
        a.addEventListener('click', function(evt) {
            if (this.href) {
                window.location.href = this.href;
                return;
            }
        });
    });
}

function setupPlaygrounds() { 
    document.querySelectorAll('.playground').forEach(function(playground, i) {
        var output = playground.querySelector('.output.frame');
        var html = playground.querySelector('.html.frame');
        var css = playground.querySelector('.css.frame');

        var styleid = 'playground-' + i + '-style';
        var style = document.getElementById(styleid);
        if (!style) {
            style = document.createElement('style');
            document.head.appendChild(style);
        }

        var updatetimeout;
        var oldHTML, oldCSS;
        function update() {
            var newHTML = "<div class='wrapper'>" + html.textContent + "</div>";;
            var newCSS = css.textContent;

            if (oldHTML !== newHTML || oldCSS !== newCSS) {
                output.innerHTML = oldHTML = newHTML;
                style.textContent = oldCSS = css.textContent;
            }

            updatetimeout = null;
        }
        
        playground.addEventListener('keyup', function(evt) {
            if (updatetimeout) {
                clearTimeout(updatetimeout);
            }
            updatetimeout = setTimeout(update, 500);
        });
        
        update();
    });
}

})();
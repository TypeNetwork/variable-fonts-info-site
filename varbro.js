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
    setupExamples();
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

function doOverlay(content) {
    var overlay = document.getElementById('playground-overlay');
    if (overlay) {
        overlay.parentElement.removeChild(overlay);
    }
    overlay = document.createElement('div');
    overlay.id = 'playground-overlay';

    var closeButton = document.createElement('button');
    closeButton.textContent = "×";
    closeButton.className = 'close';
    closeButton.setAttribute('type', 'button');

    if (typeof content === 'string') {
        overlay.innerHTML = content;
    } else {
        overlay.appendChild(content);
    }
    
    closeButton.addEventListener('click', function(evt) {
        overlay.parentElement.removeChild(overlay);
    });
    
    overlay.appendChild(closeButton);

    document.body.appendChild(overlay);
}

function setupExamples() {
/*
<div class='playground'>
    <div class='output frame'>
        <div class='wrapper'></div>
    </div>
    <div class='html frame'>
        <div class='editor' contenteditable></div>
    </div>
    <div class='css frame'>
        <div class='editor' contenteditable></div>
    </div>
</div>
*/
    document.querySelectorAll('button.open-playground').forEach(function(button) {
        var specimen = button.closest('.specimen');
        button.addEventListener('click', function(evt) {
            window.doAjax("/playground-template.html", {
                'complete': function(xhr) {
                    var temp = document.createElement('div');
                    temp.innerHTML = xhr.responseText;
                    var playground = temp.querySelector('.playground');
                    var outputFrame = playground.querySelector('.output.frame .wrapper');
                    var htmlFrame = playground.querySelector('.html.frame .editor');
                    var cssFrame = playground.querySelector('.css.frame .editor');

                    var styles = [];
                    var codes = [];
                    specimen.querySelectorAll('span.rendered').forEach(function(span) {
                        var style = {};
                        var subspec = span.closest('.specimen');
                        style.tag = subspec.tagName.toLowerCase();
                        style.className = subspec.className.replace(/\b(specimen|single-line|editorial|paragraph)\b/g, '').replace(/\s+/g, ' ').trim();
                        style.css = span.getAttribute('style').trim().split(/\s*;\s*/);
                        styles.push(style);
 
                        codes.push('<' + style.tag + ' class="' + style.className + '">\n  ' + span.innerHTML.trim() + '\n</' + style.tag + '>');
                    });
 
                    styles.forEach(function(style, i) {
                        var classes = '.' + style.className.trim().replace(/\s+/g, '.');
                        classes = classes.replace(/\.(specimen|single-line|editorial|paragraph)/g, '');
                        if (classes === '.') {
                            classes = '';
                        }
                        styles[i] = style.tag + classes + ' {\n  ' + style.css.join(";\n  ").replace(/:(\S)/g, ": $1").trim() + ';\n}';
                    });
                    
                    cssFrame.textContent = styles.join("\n\n");

                    htmlFrame.textContent = codes.join("\n\n").replace(/\. \{/g, ' {').replace(/ class=""/g, '');

                    doOverlay(playground);
                    
                    setTimeout(setupPlaygrounds);
                }
            })
        });
    });
}

function setupPlaygrounds() { 
    document.querySelectorAll('.playground').forEach(function(playground, i) {
        if (playground.getAttribute('data-processed') === 'true') {
            return;
        }

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
        
        playground.setAttribute('data-processed', 'true');
    });
}

})();
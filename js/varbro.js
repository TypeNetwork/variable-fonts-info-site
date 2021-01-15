---
---
(function() {
"use strict";

window.fontNames = {{site.data.fonts.names|jsonify}};
window.globalAxes = {{site.data.fonts.axes|jsonify}};

function varbroSetup() {
    overrideTNJS();
    addNav();
    setupSidebar();
    setupExamples();
    window.addEventListener('load', setupFitToWidth);
    window.addEventListener('resize', setupFitToWidth);
    //and once more just to make sure the fonts are loaded
    setTimeout(setupFitToWidth, 1000);
}

//like jQuery function
window.doOnReady = function(func, thisArg) {
    if (thisArg) {
        func = func.bind(thisArg);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', func);
    } else {
        func();
    }
}


doOnReady(varbroSetup);

//handy polyfills and utility functions

// forEach on nodes, from MDN
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

// do NOT use Object.prototype here as it does not play nice with jQuery http://erik.eae.net/archives/2005/06/06/22.13.54/
if (!Object.forEach) {
    Object.forEach = function(o, callback) {
        Object.keys(o).forEach(function(k) {
            callback(o[k], k);
        });
    };
}

// jQuery-style addClass/removeClass are not canon, but more flexible than ClassList
if (!HTMLElement.prototype.hasClass) {
    HTMLElement.prototype.hasClass = function(str) {
        var el = this;
        var words = str.split(/\s+/);
        var found = true;
        words.forEach(function(word) {
            found = found && el.className.match(new RegExp("(^|\\s)" + word + "($|\\s)"));
        });
        return !!found;
    }
}

var spacere = /\s{2,}/g;
if (!HTMLElement.prototype.addClass) {
    HTMLElement.prototype.addClass = function(cls) {
        this.className += ' ' + cls;
        this.className = this.className.trim().replace(spacere, ' ');
        return this;
    }
}

if (!HTMLElement.prototype.removeClass) {
    HTMLElement.prototype.removeClass = function(cls) {
        var i, words = cls.split(/\s+/);
        if (words.length > 1) {
            for (var i=0; i < words.length; i++) {
                this.removeClass(words[i]);
            }
        } else {
            var classre = new RegExp('(^|\\s)' + cls + '($|\\s)', 'g');
            while (classre.test(this.className)) {
                this.className = this.className.replace(classre, ' ').trim().replace(spacere, '');
            }
        }
        return this;
    }
}

//synthetic events
if (!HTMLElement.prototype.trigger) {
    HTMLElement.prototype.trigger = function(type) {
        var evt;
        if (typeof window.Event === "function"){ 
            evt = new Event(type);
        } else { 
            evt = document.createEvent('Event');
            evt.initEvent(type, true, true);
        }
        return this.dispatchEvent(evt);
    }
}

// closest, from MDN
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1); 
        return null;
    };  
}

// not in the spec, but seems weird to be able to do it on elements but not text nodes
if (!Node.prototype.closest) {
    Node.prototype.closest = function(s) {
        return this.parentNode && this.parentNode.closest(s);
    }
}

// my own invention
if (!RegExp.escape) {
    RegExp.escape= function(s) {
        return s.replace(/[\-\/\\\^\$\*\+\?\.\(\)\|\[\]\{\}]/g, '\\$&');
    };
}



// shortcuts to get dimensions of element minus padding, equivalent to jQuery width() and height()
if (!Element.prototype.contentWidth) {
    Element.prototype.contentWidth = function() {
        var fullwidth = this.getBoundingClientRect().width;
        var css = getComputedStyle(this);
        return fullwidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight);
    }
}

if (!Element.prototype.contentHeight) {
    Element.prototype.contentHeight = function() {
        var fullheight = this.getBoundingClientRect().height;
        var css = getComputedStyle(this);
        return fullheight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom);
    }
}


if (!HTMLFormElement.prototype.serialize) {
    HTMLFormElement.prototype.serialize = function() {
        var form = this;
        var req = [];
        form.querySelectorAll('input:enabled').forEach(function(input) {
            if ((input.type === 'checkbox' || input.type === 'radio') && !input.checked) {
                return;
            }
            req.push(encodeURIComponent(input.name) + '=' + encodeURIComponent(input.value));
        });

        form.querySelectorAll('select:enabled').forEach(function(select) {
            var options = select.querySelectorAll('option:checked');
            if (options) {
                options.forEach(function(opt) {
                    req.push(encodeURIComponent(select.name) + '=' + encodeURIComponent(opt.value));
                });
            }
        });
        return req.join("&");
    };
}


window.doAjax = function(url, options) {
    var xhr = new XMLHttpRequest();
    if (options.complete) {
        xhr.addEventListener("load", function() { options.complete(xhr); });
    }
    xhr.open(options.method || 'GET', url);
    
    if (options.data) {
        if (!options.headers) {
            options.headers = {};
        }
        options.headers['Content-type'] = 'application/x-www-form-urlencoded';
    }
    
    if (options.headers) {
        console.log(options);
        Object.forEach(options.headers, function (v, k) {
            xhr.setRequestHeader(k, v);
        });
    }
    xhr.send(options.data);
};

// END POLYFILLS

window.obj2fvs = function(fvs) {
    var clauses = [];
    Object.forEach(fvs, function(v, k) {
        clauses.push('"' + k + '" ' + v);
    });
    return clauses.join(", ");
};

window.fvs2obj = function(css) {
    var result = {};
    if (css === 'normal') {
        return result;
    }
    css.split(',').forEach(function(clause) {
        var m = clause.match(/['"](....)['"]\s+(\-?[0-9\.]+)/);
        if (m) {
            result[m[1]] = parseFloat(m[2]);
        }
    });
    return result;
};

function setupSidebar() {
    // style current link
/*
    document.querySelectorAll('.content-filters li a').forEach(function(a) {
        console.log(a.href, window.location.href);
        if (a.href === window.location.href) {
            a.className += ' current';
        }
    });
*/
}

function getPrimaryFontFamily(ff) {
    // Regex is taken from the String.trim() polyfill then added " and '
    // at the beginning and the end classes.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim#polyfill
    return ff.split(',')[0].replace(/^[\s\uFEFF\xA0"']+|[\s\uFEFF\xA0"']+$/g, '');
}


function setupFitToWidth() {
    var spans = document.querySelectorAll('.specimen.fit-to-width span.rendered');
    var specimens = [];

    //write pass
    spans.forEach(function(span) {
        var specimen = span.closest('.specimen.fit-to-width');
        specimens.push(specimen);
        //specimen.style.overflow = 'hidden';
        span.style.whiteSpace = 'nowrap';
        //make bigger for more accurate math
        span.style.fontSize = "72px";
    });

    var doIt = function() {
        //read pass
        var ratios = [];
        var fvs = [];
        var oldsize = [];
        spans.forEach(function(span, i) {
            var specimen = specimens[i];
            var specimenStyle = getComputedStyle(specimen);
            var spanStyle = getComputedStyle(span);
            var currentWidth = span.getBoundingClientRect().width;
            var fullWidth = specimen.getBoundingClientRect().width - parseFloat(specimenStyle.paddingLeft) - parseFloat(specimenStyle.paddingRight);
            var fitratio = parseFloat(specimen.getAttribute('data-fit-ratio')) || 1.0;
            ratios.push(fullWidth / currentWidth * fitratio);
            fvs.push(spanStyle.fontVariationSettings);
            oldsize.push(parseFloat(spanStyle.fontSize));
        });
        
        //write pass
        spans.forEach(function(span, i) {
            var newsize = Math.floor(oldsize[i] * ratios[i]);
            span.style.fontSize = newsize + "px";
            if (fvs[i].indexOf('opsz') >= 0) {
                span.style.fontVariationSettings = fvs[i].replace(/(.)opsz(.)\s+[\d\.\-]+/g, '$1opsz$2 ' + newsize);
            } else {
                var opszrule = '"opsz" ' + newsize;
                span.style.fontVariationSettings = fvs[i] ? fvs[i] + ', ' + opszrule : opszrule; 
            }
        });
    };
    
    //recalculate a few times because opsz changes width
    doIt();
    doIt();
    doIt();
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

function addNav() {
    //add prev/next links to article pages by walking the sidebar
    var prev, next;
    var links = document.querySelectorAll('aside.content-filters li a');
    if (!links.length) return;
    links.forEach(function(a, i) {
        if (a.href.replace(/#.*$/, '') === window.location.href.replace(/#.*$/, '')) {
            a.addClass('current');
            if (i > 0) {
                prev = links[i-1];
            }
            if (i < links.length-1) {
                next = links[i+1];
            }
        }
    });

    var nav = document.getElementById('varbro-article-nav');
    var ul = document.createElement('ul');
    var li;
    if (prev) {
        li = document.createElement('li');
        li.innerHTML = "<label>Previous</label> ";
        li.appendChild(prev.cloneNode(true));
        ul.appendChild(li);
    }
    if (next) {
        li = document.createElement('li');
        li.innerHTML = "<label>Next</label> ";
        li.appendChild(next.cloneNode(true));
        ul.appendChild(li);
    }
    nav.appendChild(ul);
}

//whether closing the playground should navigate back in the browser history
var playgroundFromHash = false;
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
    document.querySelectorAll('a.open-playground').forEach(function(button) {
        var specimen = document.querySelector(button.getAttribute('href')) || button.closest('.specimen');
        if (!button.id) {
            button.id = 'experiment-' + specimen.id;
        }
        
        button.addEventListener('click', function(evt) {
            evt.preventDefault();
            loadPlayground(button);
        });
        
        if (window.location.hash === '#playground-' + button.id) {
            playgroundFromHash = true;
            loadPlayground(button);
        }
    });
    
    window.addEventListener('popstate', function() {
        console.log("popstate", window.location.hash);
        closeOverlay();
        var m = window.location.hash.match(/^#playground-(.+)$/);
        if (m) {
            playgroundFromHash = true;
            loadPlayground(m[1]);
        }
    });
}


function closeOverlay() {
    var overlay = document.getElementById('playground-overlay');
    if (overlay) {
        overlay.parentElement.removeChild(overlay);
    }
}

function doOverlay(content) {
    closeOverlay();
    var overlay = document.createElement('div');
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
        window.location.hash = '';
        playgroundFromHash = false;
        closeOverlay();
    });
    
    overlay.appendChild(closeButton);

    document.body.appendChild(overlay);
}


function loadPlayground(button) {
    if (typeof button === 'string') {
        button = document[button[0] === '#' ? 'querySelector' : 'getElementById'](button);
    }
    
    if (!(button instanceof HTMLElement)) {
        return;
    }
    
    var specimen = document.querySelector(button.getAttribute('href')) || button.closest('.specimen');
    
    if (!specimen) {
        alert("No specimen found!");
        return;
    }
    
    if (!playgroundFromHash) {
        window.history.pushState({}, '', '#' + 'playground-' + button.id);
    }
    
    window.doAjax("{{site.baseUrl}}/playground-template.html", {
        'complete': function(xhr) {
            var temp = document.createElement('div');
            temp.innerHTML = xhr.responseText;
            var playground = temp.querySelector('#playground');
            var resizeFrame = playground.querySelector('.output.frame .resize-me');
            var outputFrame = playground.querySelector('.output.frame iframe');
            var htmlFrame = playground.querySelector('.html.frame .editor');
            var cssFrame = playground.querySelector('.css.frame .editor');

            var styles = [];
            var codes = [];
            
            outputFrame.addEventListener('load', setupPlayground);
            outputFrame.src = "{{site.baseUrl}}/playground-iframe.html";

            resizeFrame.style.width = 'calc(' + specimen.getBoundingClientRect().width + 'px + 2rem)';
            
            window.makeResizable(resizeFrame);

            var ignoreClasses = /\b(specimen|single-line|editorial|paragraph|has-label|fit-to-width)\b/g;
            specimen.querySelectorAll('span.rendered').forEach(function(span) {
                var style = {};
                var subspec = span.closest('.specimen');
                style.tag = subspec.tagName.toLowerCase();
                style.className = subspec.className.replace(ignoreClasses, '').replace(/\s+/g, ' ').trim();
                style.css = span.getAttribute('style').trim().split(/\s*;\s*/);
                styles.push(style);

                codes.push('<' + style.tag + ' class="' + style.className + '">\n  ' + span.innerHTML.trim() + '\n</' + style.tag + '>');
            });

            styles.forEach(function(style, i) {
                var classes = '.' + style.className.trim().replace(/\s+/g, '.');
                classes = classes.replace(ignoreClasses, '');
                if (classes === '.') {
                    classes = '';
                }
                styles[i] = style.tag + classes + ' {\n  ' + style.css.join(";\n  ").replace(/:(\S)/g, ": $1").trim() + '\n}';
            });
            
            cssFrame.textContent = styles.join("\n\n");

            htmlFrame.textContent = codes.join("\n\n").replace(/\. \{/g, ' {').replace(/ class=""/g, '');

            //some examples have extra styles and JS in the content
            var extraContent = button.closest('.example-links');
            if (extraContent) {
                extraContent = extraContent.previousElementSibling;
            }
            if (extraContent && !extraContent.className.match(/\bexample\b/)) {
                extraContent = null;
            }
            if (extraContent) {
                extraContent = extraContent.querySelector('.extra-content');
            }

            var noRendered = /([\w>~\]\+\)])[ \t]+\.rendered/g;
            if (extraContent) {
                extraContent.querySelectorAll('style').forEach(function(style) {
                    cssFrame.textContent += "\n\n" + style.textContent.trim();
                });
/* //don't include scripts for now as it's causing problems with some examples: https://github.com/TypeNetwork/variable-fonts-info-site/issues/100
                extraContent.querySelectorAll('script').forEach(function(s) {
                    htmlFrame.textContent += "\n\n<script>\n" + s.textContent.trim().replace(noRendered, '$1') + "\n</script>";
                });
*/
            }
            
            //remove .rendered from CSS and JS
            cssFrame.textContent = cssFrame.textContent.replace(noRendered, "$1");

            doOverlay(playground);
        }
    });
}
        
        
function setupPlayground() { 
    var playground = document.querySelector('#playground');
    if (!playground) return;
    if (playground.getAttribute('data-processed') === 'true') {
        return;
    }

    var outputFrame = playground.querySelector('.output.frame iframe');
    var outputDoc = outputFrame.contentWindow.document;

    //if the iframe hasn't loaded yet, come back when it's ready
    if (outputDoc.readyState !== 'complete') {
        return;
    }

    var output = outputDoc.getElementById('playground-output');
    var html = playground.querySelector('.html.frame');
    var css = playground.querySelector('.css.frame');

    var style = outputDoc.createElement('style');
    outputDoc.head.appendChild(style);

    var updatetimeout;
    var oldHTML, oldCSS;
    function update() {
        var newHTML = html.textContent;
        var newCSS = css.textContent.replace(/^.+?\{/gm, function(rules) {
            var newrules = [];
            rules.split(/,/).forEach(function(rule) {
                if (rule.trim().match(/^@/)) {
                    newrules.push(rule);
                } else {
                    newrules.push('#playground-output ' + rule);
                }
            })
            return newrules.join(", ");
        });

        if (oldHTML !== newHTML || oldCSS !== newCSS) {
            output.innerHTML = oldHTML = newHTML;
            style.textContent = oldCSS = newCSS;
            
            //and run any scripts in the input
/* //don't include scripts for now as it's causing problems with some examples: https://github.com/TypeNetwork/variable-fonts-info-site/issues/100
            output.querySelectorAll('script').forEach(function(script) {
                var js = script.textContent;
                script.parentNode.removeChild(script);
                var newscript = outputDoc.createElement('script');
                newscript.textContent = js;
                output.appendChild(newscript);
            });
*/
        }

        updatetimeout = null;
    }
    
    playground.addEventListener('keyup', function(evt) {
        if (updatetimeout) {
            clearTimeout(updatetimeout);
        }
        updatetimeout = setTimeout(update, 500);
    });
    
    setTimeout(update);
    
    playground.setAttribute('data-processed', 'true');
}


window.makeResizable = function(el, options) {
    if (!options) {
        options = {};
    }

    el.addClass('resize-me');

    var handle = document.createElement('div');
    handle.className = 'resize-handle';
    handle.textContent = "⫼";
    el.appendChild(handle);

    var w0;
    window.interact(el).resizable({
        'edges': {right: '.resize-handle'},
/*
        'modifiers': [
            window.parent.interact.modifiers.restrictSize({
                'min': { 'width': parseInt(getComputedStyle(el).minWidth) }
            })
        ]
*/
    }).on('resizestart', function(evt) {
        w0 = evt.target.getBoundingClientRect().width;
        evt.target.style.width = w0 + 'px';
        if (typeof options.start === 'function') {
            options.start(evt);
        }
    }).on('resizemove', function(evt) {
        evt.target.style.width = (w0 + (evt.client.x - evt.clientX0)*2) + 'px';
        if (typeof options.change === 'function') {
            options.change(evt);
        }
    }).on('resizeend', function(evt) {
        if (typeof options.end === 'function') {
            options.end(evt);
        }
    });
};

// CALCULATION STUFF
var calculations = {{site.data.calculations|jsonify}};

//pull axis info from typetools
var composites = {
    'AmstelvarAlpha-VF': {
        "opsz":{
            "10":{"XOPQ":110,"YOPQ":75,"YTLC":525},
            "14":[],
            "72":{"XTRA":300,"YOPQ":12,"YTLC":475}
        },"wdth":{
            "35":{"XTRA":42,"XOPQ":70,"YOPQ":45/* ,"PWDT":60 */},
            "100":[]
        },"wght":{
            "100":{"XOPQ":38,"YOPQ":25,"XTRA":375,"YTSE":8/* ,"PWGT":38 */},
            "400":[],
            "900":{"XOPQ":250,"XTRA":250,"YTLC":525/* ,"PWGT":250 */}
        }
    }
};


//convert a set of axes from blended to all-parametric
window.allParametric = function(font, axes) {
    var axisDeltas = {};
    
    //special case for "relweight" specifying weight as % of default XOPQ
    // back-figure this to a `wght` value
    if ('relweight' in axes) {
        if ('XOPQ' in globalAxes[font] && font in composites) {
            var baseXOPQ = globalAxes[font].XOPQ.default + (axisDeltas.XOPQ || 0);
        
            //not sure if this should be based on the regular-default XOPQ, or the opsz-modified one
        //        var targetXOPQ = Math.round(baseXOPQ * axes.relweight.value/100);
            var targetXOPQ = Math.round(globalAxes[font].XOPQ.default * axes.relweight/100);
        
            //back-figure wght value from XOPQ
            axes.wght = parametricToComposite(font, 'XOPQ', targetXOPQ, 'wght');
        } else if ('wght' in globalAxes[font]) {
            axes.wght = ('wght' in axes ? axes.wght : globalAxes[font].wght.default) * axes.relweight / 100;
        }
        delete axes.relweight;
    }
    
    Object.forEach(axes, function(val, axis) {
        Object.forEach(compositeToParametric(font, axis, val), function(v, k) {
            if (!(k in axisDeltas)) {
                axisDeltas[k] = 0;
            }
            axisDeltas[k] += v - globalAxes[font][k].default;
        });
    });

    var result = {};
    Object.forEach(axisDeltas, function(v, k) {
        result[k] = globalAxes[font][k].default + v;
    });
    
    return result;
};

window.compositeToParametric = function(font, caxis, cvalue) {
    cvalue = parseFloat(cvalue);
    
    if (!(font in composites) || !(caxis in composites[font])) {
        var temp = {};
        temp[caxis] = cvalue;
        return temp;
    }

    //maintain a list of all axes mentioned in the composite, so we can reset them all
    var allAxes = {};   
    
    var lowerPivot, upperPivot;
    var lowerAxes, upperAxes;
    //pivot value and axes
    Object.forEach(composites[font][caxis], function(paxes, pivot) {
        pivot = parseFloat(pivot);
        
        //add any new axes to the list
        Object.forEach(paxes, function(pval, paxis) {
            if (!(paxis in allAxes)) {
                allAxes[paxis] = globalAxes[font][paxis].default;
            }
        });
        
        if (pivot >= cvalue) {
            //first time this happens we can stop
            if (isNaN(upperPivot)) {
                upperPivot = pivot;
                upperAxes = paxes;
            }
        }
        
        if (isNaN(lowerPivot) || isNaN(upperPivot)) {
            //first runthru OR we still haven't found the top of the range
            lowerPivot = pivot;
            lowerAxes = paxes;
        }
    });

    if (isNaN(upperPivot)) {
        upperPivot = lowerPivot;
        upperAxes = lowerAxes;
    }

    var result = {};
    
    Object.forEach(allAxes, function(dflt, axis) {
        var u = axis in upperAxes ? upperAxes[axis] : dflt;
        var l = axis in lowerAxes ? lowerAxes[axis] : dflt;
        var r = upperPivot === lowerPivot ? 0.0 : (cvalue-lowerPivot)/(upperPivot-lowerPivot);
        result[axis] = l + r*(u-l);
        if (globalAxes[font][axis].max - globalAxes[font][axis].min > 50) {
            result[axis] = Math.round(result[axis]);
        }
    });

    return result;
}

//given a value for a parametric axis, back-calculate the composite value that would produce it
window.parametricToComposite = function(font, paxis, pvalue, caxis) {
    if (!(font in composites) || !(caxis in composites[font])) {
        return null;
    }

    pvalue = parseFloat(pvalue);

    var mydefault = globalAxes[font][paxis].default;
    
    var lowerC, upperC;
    var lowerP, upperP;

    //pivot value and axes
    Object.forEach(composites[font][caxis], function(paxes, pivot) {
        pivot = parseFloat(pivot);
        
        var myval = paxis in paxes ? paxes[paxis] : mydefault;

        if (myval >= pvalue) {
            //first time this happens we can stop
            if (isNaN(upperC)) {
                upperC = pivot;
                upperP = myval;
            }
        }
        
        if (isNaN(lowerC) || isNaN(upperC)) {
            //first runthru OR we still haven't found the top of the range
            lowerC = pivot;
            lowerP = myval;
        }
    });

    if (!upperC) {
        upperC = lowerC;
        upperP = lowerP;
    }

    if (upperC === lowerC) {
        return upperC;
    }

    var result = lowerC + (pvalue - lowerP)/(upperP - lowerP) * (upperC - lowerC);

    if (globalAxes[font][caxis].max - globalAxes[font][caxis].min > 50) {
        return Math.round(result);
    }
    
    return result;
}

function interInterpolate(targetX, targetY, theGrid) {
    var numsort = function(a,b) { return a - b; };

    //now we need to find the "anchor" Xs and Ys on either side of the actual X and Y
    // so if our X/Y is 36/600, the anchors might be 14/400 and 72/700
    var Xs = Object.keys(theGrid);
    Xs.sort(numsort);
    Xs.forEach(function(v,i) { Xs[i] = parseInt(v); });

    var lower = [Xs[0], 0], upper = [Xs[Xs.length-1], Infinity];
    var done = false;
    Xs.forEach(function(anchorX) {
        if (done) {
            return;
        }

        var Ys, Ydone;

        if (anchorX <= targetX) {
            //set lower and keep looking
            lower[0] = anchorX;
        }

        if (anchorX >= targetX || anchorX === upper[0]) {
            //found our upper X! Now search Ys
            upper[0] = anchorX;

            //find lower Y
            Ys = Object.keys(theGrid[lower[0]]);
            Ys.sort(numsort);
            Ys.forEach(function(v,i) { Ys[i] = parseInt(v); });
            Ydone = false;
            lower[1] = Ys[0];
            Ys.forEach(function(anchorY) {
                if (Ydone) {
                    return;
                }
                if (anchorY <= targetY) {
                    lower[1] = anchorY;
                }
                if (anchorY >= targetY) {
                    Ydone = true;
                }
            });

            //find upper Y
            Ys = Object.keys(theGrid[upper[0]]);
            Ys.sort(numsort);
            Ys.forEach(function(v,i) { Ys[i] = parseInt(v); });
            Ydone = false;
            upper[1] = Ys[Ys.length-1];
            Ys.forEach(function(anchorY) {
                if (Ydone) {
                    return;
                }
                if (anchorY >= targetY) {
                    upper[1] = anchorY;
                    Ydone = true;
                }
            });
            
            done = true;
        }
    });

    //okay, now we have our lower and upper anchors!

    //how far bewteen lower and upper are we
    var Xratio = upper[0] === lower[0] ? 0 : Math.max(0, Math.min(1, (targetX - lower[0]) / (upper[0] - lower[0])));
    var Yratio = upper[1] === lower[1] ? 0 : Math.max(0, Math.min(1, (targetY - lower[1]) / (upper[1] - lower[1])));
    
    //get axis values for the four corners
    var corners = {
        șẉ: theGrid[lower[0]][lower[1]],
        ŝẉ: theGrid[upper[0]][lower[1]],
        șẇ: theGrid[lower[0]][upper[1]],
        ŝẇ: theGrid[upper[0]][upper[1]]
    };
    
    //now we need to interpolate along the four edges
    var edges = {
        ș: [corners.șẇ, corners.șẉ, Yratio],
        ŝ: [corners.ŝẇ, corners.ŝẉ, Yratio],
        ẉ: [corners.ŝẉ, corners.șẉ, Xratio],
        ẇ: [corners.ŝẇ, corners.șẇ, Xratio]
    };

    Object.forEach(edges, function(hlr, edge) {
        var high = hlr[0];
        var low = hlr[1];;
        var ratio = hlr[2];
        var middle = {};
        if (typeof high === 'number' && typeof low === 'number') {
            edges[edge] = low + (high - low) * ratio;
        } else {
            Object.forEach(high, function(sml, axis) {
                middle[axis] = [];
                for (var i=0; i<3; i++) {
                    middle[axis].push(low[axis][i] + (high[axis][i] - low[axis][i]) * ratio);
                }
            });
            edges[edge] = middle;
        }
    });

    //now we can inter-interpolate between the interpolated edge values
    if (typeof edges.ẉ === 'number') {
        return edges.ẉ + (edges.ẇ - edges.ẉ) * Yratio;
    } else {
        var axes = Object.keys(corners.șẉ);
        var result = {};
        axes.forEach(function(axis) {
            result[axis] = [];
            for (var i=0; i<3; i++) {
                result[axis].push(edges.ẉ[axis][i] + (edges.ẇ[axis][i] - edges.ẉ[axis][i]) * Yratio);
            }
        });
    
        return result;
    }
}

window.getJustificationTolerances = function(font, targetsize, targetweight) {
    return interInterpolate(targetsize, targetweight, calculations.justification[font] || calculations.justification['default']);
};

HTMLElement.prototype.setLineHeight = function() {
    var css = getComputedStyle(this);
    
    var fontfamily = getPrimaryFontFamily(css.fontFamily);
    var fontsize = parseFloat(css.fontSize);

    var boxheight = this.contentHeight();
    var totalChars = this.textContent.trim().length;
    var charsPerLine = totalChars / (boxheight / Math.max(1, parseInt(css.lineHeight)));

    var yopq = fvs2obj(css.fontVariationSettings).YOPQ;
    if (isNaN(yopq) && fontfamily in calculations["line-height"] && fontfamily in globalAxes) {
        yopq = (globalAxes[fontfamily].YOPQ || globalAxes["AmstelvarAlpha-VF"].YOPQ).default;
    }
    if (isNaN(yopq)) {
        yopq = calculations["line-height"].YOPQdefault;
    }

    var yopqMultiplier = interInterpolate(charsPerLine, fontsize, calculations["line-height"][fontfamily] || calculations["line-height"].default);
    var lineHeight = 1 + yopq/1000 * yopqMultiplier;

    //console.log(totalChars, css.lineHeight, boxheight, charsPerLine, yopq, yopqMultiplier);

    this.style.lineHeight = lineHeight;
    this.setAttribute('data-column-width', Math.round(charsPerLine));
    this.setAttribute('data-line-height', Math.round(lineHeight*100)/100);
    this.setAttribute('data-yopq', yopq);
};

window.doLineHeights = function() {
    document.querySelectorAll('.specimen .rendered').forEach(function(el) {
        el.setLineHeight();
    });
}


//JUSTIFICATION!!!

Element.prototype.setFVS = function(k, v) {
//         this.style.fontVariationSettings = '';
    var style = getComputedStyle(this);
    var current = fvs2obj(style.fontVariationSettings);
//         current.opsz = parseFloat(style.fontSize) * 72/96;
    if (k !== undefined && v !== undefined) {
        current[k] = v;
    }
    this.style.fontVariationSettings = obj2fvs(current);
};

window.doJustification = function() {
    document.querySelectorAll('.specimen.justify .rendered').forEach(function(paragraph) {
        var container = paragraph.closest('.specimen.justify');

        var modes = {};
        
        container.className.split(/\s+/).forEach(function(word) {
            modes[word] = true;
        });
    
        var startTime = (window.performance || Date).now();

        //reset paragraph to plain text and remove special styling
        var parastyle = getComputedStyle(paragraph);
        var fontfamily = getPrimaryFontFamily(parastyle.fontFamily);
        var fontsizepx = parseFloat(parastyle.fontSize);
        var fontsize = fontsizepx * 72/96;
        var fvs = fvs2obj(parastyle.fontVariationSettings);
        var relweight;

        if (fvs.XOPQ && globalAxes[fontfamily] && globalAxes[fontfamily].XOPQ) {
            relweight = 100 * fvs.XOPQ / globalAxes[fontfamily].XOPQ.default;
        } else if (parseInt(parastyle.fontWeight)) {
            relweight = 100 * parseInt(parastyle.fontWeight) / 400;
        } else {
            relweight = 100;
        }
        
        var tolerances = getJustificationTolerances(fontfamily, fontsize, relweight);
        
        var words = paragraph.textContent.trim().split(/\s+/);
        
        paragraph.innerHTML = "<span>" + words.join("</span> <span>") + "</span>";
    
        //start at maximum squish and then adjust upward from there
        Object.forEach(tolerances, function(tol, axis) {
            if (axis.length !== 4) {
                return;
            }
            if (axis.toLowerCase() in modes) {
                paragraph.setFVS(axis, tol[0]);
            }
        });
            
        var parabox = paragraph.getBoundingClientRect();
        var spans = paragraph.querySelectorAll("span");
    
        var lastY = false;
        var lines = [], line = [];
    
        spans.forEach(function(word) {
            // var box = word.getBoundingClientRect();
            // var eol = box.left - parabox.left + box.width;
            var y = word.getBoundingClientRect().top;
            if (lastY === false) {
                lastY = y;
            }
            
            if (y === lastY) {
                line.push(word.textContent);
            } else {
                //wrap!
                line = line.join(" ");
                lines.push(line);
                line = [word.textContent];
                // word = word.previousSibling;
                // while (word.previousSibling) {
                //   word = word.previousSibling;
                //   paragraph.removeChild(word.nextSibling);
                // }
                // paragraph.removeChild(word);
                //paragraph.innerHTML = paragraph.innerHTML.trim();
            }
            
            lastY = y;
        });

        if (line.length) {
          lines.push(line.join(" "));
        }
    
        paragraph.innerHTML = "<var>" + lines.join("</var> <var>") + "</var>";

        //now expand width to fit
        paragraph.querySelectorAll("var").forEach(function(line, index) {
            //don't wordspace last line of paragraph
            if (line.nextElementSibling) {
                if (modes.wordspace) {
                    line.addClass("needs-wordspace");
                }
                if (modes.letterspace) {
                    line.addClass('needs-letterspace');
                }
            }

            Object.forEach(tolerances, function(tol, axis) {
                if (axis.length !== 4) {
                    return;
                }
                if (axis.toLowerCase() in modes) {
                    var tries = 0;
                    
                    var cmin = tolerances[axis][0];
                    var cmax = tolerances[axis][2];
                    var cnow = fvs2obj(paragraph.style.fontVariationSettings)[axis];
                    var cnew;
        
                    var dw, tries = 10;
                    
                    while (tries--) {
                        line.setFVS(axis, cnow);
                        line.setAttribute('data-' + axis, Math.round(cnow));
                        dw = parabox.width - line.clientWidth;
                        
                        //console.log(line.textContent.trim().split(' ')[0], dw, cmin, cmax, cnow);
                        
                        if (Math.abs(dw) < 1) {
                            line.removeClass('needs-wordspace');
                            line.setAttribute('data-wordspace', 0);
                            break;
                        }
                        
                        if (dw < 0) {
                            //narrower
                            cnew = (cnow + cmin) / 2;
                            cmax = cnow;
                        } else {
                            cnew = (cnow + cmax) / 2;
                            cmin = cnow;
                        }
                        
                        if (Math.abs(cnew - cnow) / (tolerances[axis][2] - tolerances[axis][0]) < 0.005) {
                            break;
                        }
                        
                        cnow = cnew;
                    }
                }
            });
        });

        if (modes.letterspace && 'letter-spacing' in tolerances) {
            paragraph.querySelectorAll("var.needs-letterspace").forEach(function(line) {
                var dw = parabox.width - line.clientWidth;
                
                var minLS = tolerances['letter-spacing'][0];
                var maxLS = tolerances['letter-spacing'][2];
                var fitLS = dw / line.textContent.length / fontsizepx;

                fitLS = Math.max(minLS, Math.min(maxLS, fitLS));

                line.style.letterSpacing = fitLS + "em";
                
                line.setAttribute('data-letterspace', Math.round(fitLS * 1000));
                
                //console.log(line.textContent.trim().split(' ')[0], dw);
            });
        }

        if (modes.wordspace) {
            paragraph.querySelectorAll("var.needs-wordspace").forEach(function(line) {
                var dw = parabox.width - line.clientWidth;
                var spaces = line.textContent.split(" ").length - 1;
                line.style.wordSpacing = (dw / spaces / fontsizepx) + "em";
                
                line.setAttribute('data-wordspace', Math.round(parseFloat(line.style.wordSpacing) * 1000));
                
                //console.log(line.textContent.trim().split(' ')[0], dw);
            });
        }
            
        //set up param labels
        paragraph.querySelectorAll("var").forEach(function(line) {
            var label = [];
            line.getAttributeNames().forEach(function(attr) {
                var nicename;
                if (attr.substr(0, 5) !== 'data-') {
                    return;
                }
                switch(attr) {
                    case 'data-params': return;
                    case 'data-letterspace': nicename = 'ls'; break;
                    case 'data-wordspace': nicename = 'ws'; break;
                    default: nicename = attr.substr(5); break;
                }
                label.push(nicename + ' ' + line.getAttribute(attr));
            });
            if (label.length) {
                line.setAttribute('data-params', label.join(" "));
            }
            
            line.textContent = line.textContent;
        });
            
        window.doLineHeights();
        
        var endTime = (window.performance || Date).now();
        
        console.log(container.className, "Reflowed in " + Math.round(endTime - startTime) / 1000 + "s");
    });
};

doOnReady(window.doLineHeights);
window.addEventListener('load', window.doLineHeights);

doOnReady(window.doJustification);
window.addEventListener('load', window.doJustification);

var resizeTimeout;
window.addEventListener('resize', function() {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(function() {
        window.doLineHeights();
        window.doJustification();
    }, 500);
});

})();
//attach event listener from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "runFunction") {
        runFunction(request.myVars);
    } else if (request.method == "runFunctionChild") {
        runFunction(request.myVars, 'child');
    } else if (request.method == "setFavIconBadge") {
        setFavIconBadge(request.options);
    } else if (request.snippet) {
        insertTextAtCursor(request.snippet);
    }

});

(function () {
    addScript('/js/purify.min.js', false); //needed for safe html insertion required by FF
    addScript('inject.js', true);
    getFromSyncStorageGlobal("snusettings", function (snusettings) {
        if (snusettings && snusettings.hasOwnProperty('iconallowbadge') && !snusettings.iconallowbadge) return;

        getFromSyncStorage("snuinstancesettings", function (settings) {
            setFavIconBadge(settings);
        });
    });
})();


function addScript(filePath, processSettings) {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL(filePath);
    s.onload = function () {
        if (processSettings) {
            getFromSyncStorageGlobal("snusettings", function (settings) {
                if (!settings) settings = {};
                var script = document.createElement('script');
                script.textContent = 'var snusettings =' + JSON.stringify(settings) + '; snuSettingsAdded()';
                (document.head || document.documentElement).appendChild(script);
                //script.remove();
            });
        }
    };

    (document.head || document.documentElement).appendChild(s);
}

function setFavIconBadge(settings) {
    Tinycon.reset();

    if (!(settings && settings.hasOwnProperty("icontext") && settings.icontext)) return;

    Tinycon.setOptions({
        width: settings.iconwidth,
        height: settings.iconheight,
        font: settings.iconfontsize + 'pt arial',
        color: settings.iconcolortext,
        background: settings.iconcolorbg,
        fallback: true
    });
    Tinycon.setBubble(settings.icontext);
}

function runFunction(f, context) {
    var doc;

    if (context == 'child' && jQuery('#gsft_main').length)
        return;

    if (jQuery('#gsft_main').length)
        doc = jQuery('#gsft_main')[0].contentWindow.document;
    else
        doc = document;

    var script = doc.createElement('script');
    script.appendChild(doc.createTextNode(f));
    doc.body.appendChild(script);

}

//get an instance independent sync parameter
function getFromSyncStorageGlobal(theName, callback) {
    chrome.storage.sync.get(theName, function (result) {
        callback(result[theName]);
    });
}

//get an instance sync parameter
function getFromSyncStorage(theName, callback) {
    var instance = location.host.replace(".service-now.com", "");
    chrome.storage.sync.get(instance + "-" + theName, function (result) {
        callback(result[instance + "-" + theName]);
    });
}

//set an instance independent sync parameter
function setToChromeSyncStorageGlobal(theName, theValue) {
    var myobj = {};
    myobj[theName] = theValue;
    chrome.storage.sync.set(myobj, function () {

    });
}


function insertTextAtCursor(text) {
    var el = document.activeElement;
    var val = el.value;
    var endIndex;
    var range;
    var doc = el.ownerDocument;
    if (typeof el.selectionStart === 'number' &&
        typeof el.selectionEnd === 'number') {
        endIndex = el.selectionEnd;
        el.value = val.slice(0, endIndex) + text + val.slice(endIndex);
        el.selectionStart = el.selectionEnd = endIndex + text.length;
    } else if (doc.selection !== 'undefined' && doc.selection.createRange) {
        el.focus();
        range = doc.selection.createRange();
        range.collapse(false);
        range.text = text;
        range.select();
    }
}


//attach event listener from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "runFunction") {
        runFunction(request.myVars);
    } else if (request.method == "runFunctionChild") {
        runFunction(request.myVars, 'child');
    } else if (request.snippet) {
        insertTextAtCursor(request.snippet);
    }

});

(function () {
    addScript('/js/purify.min.js',false); //needed for safe html insertion required by FF
    addScript('inject.js',true);
})();


function addScript(filePath,processSettings) {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL(filePath);
    s.onload = function () {
        if (processSettings) {
            getFromSyncStorageGlobal("snusettings", function (settings) {

                settings = convertSlashCommands(settings);

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

//temporary check, to convert slashcommands
// var settings = {
//     "slashcommands" : ["i;incdent.do incdentjes hier", "chg;chg.do chamges hier", "prb;prob.do"].join('\n')
// }
function convertSlashCommands(settings) {

    if (typeof settings == 'undefined') return {};
    if (!settings.hasOwnProperty('slashcommands')) return settings;
    if (settings.slashcommands.trim().startsWith('{')) return settings;

    var cmds = {}
    if ((settings.slashcommands).length > 7) {
        var cmdArr = settings.slashcommands.split('\n');
        for (var i = 0; i < cmdArr.length; i++) {
            var cmdSplit = cmdArr[i].split(";");
            if (cmdSplit.length == 2) {
                cmds[cmdSplit[0]] = {
                    "url": cmdSplit[1].split(" ")[0],
                    "hint": cmdSplit[1].split(" ").slice(1).join(" ")

                }
            }
        }

        settings.slashcommands = JSON.stringify(cmds);
        setToChromeSyncStorageGlobal("snusettings", settings);
    }
    return settings;

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


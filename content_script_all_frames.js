var lastCommand = (new Date()).getTime();


//attach event listener from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if ((new Date()).getTime() - lastCommand < 500) {
        //dont trigger twice
    }
    else if (request.method == "runFunction") {
        runFunction(request.myVars);
    } else if (request.method == "setBackgroundScript") {
        runFunction(request.myVars, "background");
    } else if (request.snippet) {
        insertTextAtCursor(request.snippet);
    }

    lastCommand = (new Date()).getTime();

});

(function () {

    //this is a check via the existance of a cookie, to make sure we only add the scripts on actual ServiceNow instances.
    var msg = { 
        "event" : "checkisservicenowinstance",
        "origin" : location.origin 
    }
    chrome.runtime.sendMessage(msg, isServiceNow => {
        if (isServiceNow) {
            addScript('/js/purify.min.js', false); //needed for safe html insertion required by FF
            addScript('inject.js', true);
            if (document.getElementById("filter") != null || location.pathname.startsWith("/now/")) {
                addScript('inject_parent.js');
            }
        
            if (location.pathname.startsWith("/now/") || location.pathname.startsWith("/x/"))
                addScript('inject_next.js', false);
            if (location.pathname.startsWith("/$flow-designer.do"))
                addScript('js/inject_flow.js', false);
            else if (location.pathname == "/sys.scripts.do") {
                setTimeout(function () {
                    addScript('js/monaco/vs/loader.js', false);
                }, 200)
                setTimeout(function () {
                    addScript('js/monaco/libsource.js', false);
                    addScript('js/monaco/bgscript.js', false);
                }, 600)
            }
            else if (location.pathname == "/sys.scripts.modern.do") {
                setTimeout(function () {
                    addScript('js/bgscriptmodern.js', false);
                }, 400)            
            }
            else if (location.pathname.startsWith("/merge_form_")) {
                addScript('js/monaco/compare.js', false);
            }
            if (parent && parent.location.pathname.startsWith("/$studio.do")) {
                addScript('/js/inject_studio.js', false);
            }



        }
    });

})();


function addScript(filePath, processSettings) {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL(filePath);
    s.onload = function () {
        if (processSettings) {
            getFromSyncStorageGlobal("snusettings", function (settings) {
                if (!settings) settings = {};
                settings.extensionUrl = chrome.runtime.getURL('/');
                var detail = {
                    "detail": {
                        "type": "code",
                        "content": 'var snusettings =' + JSON.stringify(settings) + '; snuSettingsAdded()'
                    }
                };
                if (typeof cloneInto != 'undefined') detail = cloneInto(detail, document.defaultView); //required for ff
                var event = new CustomEvent('snuEvent', detail);
                document.dispatchEvent(event);
            });
        }
    };

    (document.head || document.documentElement).appendChild(s);
}

document.addEventListener("snutils-event", function (data) {
    chrome.runtime.sendMessage(data.detail); //forward the customevent message to the bg script.
    return true;
})



function runFunction(f, myType = "code") {
    if (typeof document === 'undefined' || document == null) return;

    let inParent = document.querySelector('iframe#gsft_main') != null && document.querySelector('iframe#gsft_main').contentDocument != null;
    if (inParent) {
        // don't run function meant for content frame if we're not in it
        return;
    }
    var detail = {
        "detail": {
            "type": myType,
            "content": f
        }
    };
    if (typeof cloneInto != 'undefined') detail = cloneInto(detail, document.defaultView); //required for ff
    var event = new CustomEvent('snuEvent', detail);
    document.dispatchEvent(event);

}

//set an instance independent parameter
function setToChromeStorageGlobal(theName, theValue) {
    console.log(theName, theValue)
    var myobj = {};
    myobj[theName] = theValue;
    chrome.storage.local.set(myobj, function () {
    });
}

//get an instance independent global parameter
function getFromChromeStorageGlobal(theName, callback) {
    chrome.storage.local.get(theName, function (result) {
        callback(result[theName]);
    });
}

//get an instance independent sync parameter
function getFromSyncStorageGlobal(theName, callback) {
    chrome.storage.sync.get(theName, function (resSync) {
        var dataSync = resSync[theName];

        if (typeof dataSync !== 'object') { //only objects can become large and merged.
            callback(dataSync);
            return;
        }

        getFromChromeStorageGlobal(theName, function (resLocal) {
            var objLocal = resLocal || {};
            var objMerged = { ...dataSync, ...objLocal };
            callback(objMerged);
        });
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


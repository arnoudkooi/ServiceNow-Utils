var lastCommand = (new Date()).getTime();


//attach event listener from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if ((new Date()).getTime() - lastCommand < 500) {
        //dont trigger twice
    }
    else if (request.method == "runFunction") {
        runFunction(request.myVars);
    } else if (request.method == "runFunctionChild") {
        runFunction(request.myVars, 'child');
    } else if (request.snippet) {
        insertTextAtCursor(request.snippet);
    }

    lastCommand = (new Date()).getTime();

});

(function () {
    addScript('/js/purify.min.js', false); //needed for safe html insertion required by FF
    addScript('inject.js', true);

    if (location.pathname.startsWith("/now/") || location.pathname.startsWith("/x/"))
        addScript('inject_next.js', false);
    else if (location.pathname == "/sys.scripts.do") {
        setTimeout(function(){
            addScript('js/monaco/vs/loader.js', false);
        },200)
        setTimeout(function(){
            addScript('js/monaco/libsource.js', false);
            addScript('js/monaco/monaco.js', false);
        },600)
    }
    else if (location.pathname.startsWith("/merge_form_")) {
        addScript('js/monaco/compare.js', false);
    }

})();


function addScript(filePath, processSettings) {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL(filePath);
    s.onload = function () {
        if (processSettings) {
            getFromSyncStorageGlobal("snusettings", function (settings) {
                if (!settings) settings = {};
                settings.extensionUrl = chrome.runtime.getURL('/');
                if(navigator.userAgent.toLowerCase().includes('firefox')){ //todo: find alternative for Eventdispatching in FF #202
                    var script = document.createElement('script');
                    script.textContent = 'var snusettings =' + JSON.stringify(settings) + '; snuSettingsAdded()';
                    (document.head || document.documentElement).appendChild(script);
                }
                else{
                    var event = new CustomEvent('snuEvent', {
                        detail : { "type" : "code", 
                                   "content" : 'var snusettings =' + JSON.stringify(settings) + '; snuSettingsAdded()'
                                 }
                    });
                    document.dispatchEvent(event);
                }

            });
        }
    };

    (document.head || document.documentElement).appendChild(s);
}


function runFunction(f, context) {
    if (typeof document === 'undefined' || document == null) return;

    let inParent = document.querySelector('iframe#gsft_main') != null && document.querySelector('iframe#gsft_main').contentDocument != null;
    //if (context == 'child' && inParent) { // see issue #171 if this works ok remove all runFunctionChild stuff
    if (inParent) {
        // don't run function meant for content frame if we're not in it
        return;
    }

    let doc = inParent ? document.querySelector('iframe#gsft_main').contentDocument : document;
    let script = doc.createElement('script');
    script.appendChild(doc.createTextNode(f));
    doc.body.appendChild(script);

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
        var objSync = resSync[theName];
        getFromChromeStorageGlobal(theName,function (resLocal) {
            var objLocal = (resLocal && resLocal.hasOwnProperty(theName)) ? resLocal[theName] : {};
            var objMerged = { ...objSync, ...objLocal};
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


setTimeout(() => { //be sure content_script_all_frames.js is loaded first

    getFromSyncStorageGlobal("snusettings", function (snusettings) {
        if (snusettings && snusettings.hasOwnProperty('iconallowbadge') && !snusettings.iconallowbadge) return;

        getFromSyncStorage("snuinstancesettings", function (settings) {
            setFavIconBadge(settings);
        });
    });

},200);


//attach event listener from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getSelection"){
        sendResponse({ selectedText: getSelection() });
        return true;
    }
    else if (request.method == "snuFetch"){
        snuFetch(request.options, (resp)=>{ sendResponse(resp) });
        return true;
    }
    else if (request.method == "setFavIconBadge"){
        setFavIconBadge(request.options);
        return true;
    }
    else if (request.method == "getVars"){
        sendResponse({ myVars: getVars(request.myVars), url: location.origin, frameHref: getFrameHref() });
        return true;
    }
    else if (request.method == "getLocation"){
        sendResponse({ url: location.origin, frameHref: getFrameHref() });
        return true;
    }
    else if (request.method == "toggleSearch") {
        toggleSearch();
        return true;
    } 
    else if (request.method == "snuUpdateSettingsEvent") { //pass settings to page
        if (typeof cloneInto != 'undefined') request = cloneInto(request, document.defaultView); //required for ff
        var event = new CustomEvent(
            request.method, request
        );
        document.dispatchEvent(event);
        return true;
    } 
    return true;
    //else
    //sendResponse({ url: location.origin });

});



function toggleSearch() {
    let nextFocus = (document.activeElement.id == "filter")
        ? "sysparm_search" : "filter";
    document.getElementById(nextFocus).focus();
    document.getElementById(nextFocus).select();
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


//get the selected text, user has selected with mouse.
function getSelection() {

    if (("" + document.activeElement.name).indexOf('label') > -1 ||
        ("" + document.activeElement.name).indexOf('name') > -1)
        return '';

    var result = '' + self.document.getSelection().toString();
    var iframes = document.querySelectorAll("iframe");
    if (!iframes.length && document.querySelector("[global-navigation-config]")) //try to find iframe in case of polaris
        iframes = document.querySelector("[global-navigation-config]").shadowRoot.querySelectorAll("iframe");

    iframes.forEach(frame => {

        try {
            result += frame.contentWindow.getSelection().toString();
        } catch (error) {
            console.log(error);
        }
    });
    return '' + result;
}



//get the href of the contentframe gsft_main
function getFrameHref() {
    var frameHref = document.location.href;
    if (document.querySelectorAll('#gsft_main').length) //ui16
        frameHref = document.getElementById("gsft_main").contentWindow.location.href;
    else if (document.querySelectorAll("[component-id]").length && //polaris ui
             document.querySelector("[component-id]").shadowRoot.querySelectorAll("#gsft_main").length) {
        frameHref = document.querySelector("[component-id]").shadowRoot.querySelector("#gsft_main").contentWindow.location.href;  
    }
    else if (document.querySelectorAll('div.tab-pane.active').length == 1) { //studio
        try{
            frameHref = document.querySelector('div.tab-pane.active iframe').contentWindow.location.href;
        }
        catch(ex){
            
        }
    }
    return frameHref;
}

//initialize g_list variable 
function setGList(doc) {
    var detail = { 
        "detail" : {
            "type" : "code", 
            "content" : "try{ var g_list = GlideList2.get(document.querySelector('#sys_target').value); } catch(err){console.log(err);}"
        }
    };
    if (typeof cloneInto != 'undefined') detail = cloneInto(detail, document.defaultView); //required for ff
    var event = new CustomEvent('snuEvent', detail);
    doc.dispatchEvent(event);
}


//Function to query Servicenow API
function snuFetch(options, callback) {
    var hdrs = {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    if (options.token) //only for instances with high security plugin enabled
        hdrs['X-UserToken'] = options.token; 

    var requestInfo = {
        method : 'get',
        headers : hdrs
    }

    if (options.post){
        requestInfo.method = 'PUT';
        requestInfo.body = options.post;
    }

    fetch(options.url, requestInfo)
    .then(response => response.json())
    .then(data => { 
        callback(data);
    });

}




//try to return the window variables, defined in the comma separated varstring string
function getVars(varstring) {

    var doc = document;
    var ret = {};
    if (document.querySelectorAll('#gsft_main').length) //ui16
        doc = document.querySelector('#gsft_main').contentWindow.document;
    else if (document.querySelectorAll("[component-id]").length && //polaris ui
             document.querySelector("[component-id]").shadowRoot.querySelectorAll("#gsft_main").length) {
        doc = document.querySelector("[component-id]").shadowRoot.querySelector("#gsft_main").contentWindow.document;  
    }
    else if (document.querySelectorAll('div.tab-pane.active').length == 1) { //studio
        try{
            doc = document.querySelector('div.tab-pane.active iframe').contentWindow.document;
            ret.g_ck = doc.querySelector('input#sysparm_ck').value;
        }
        catch(ex){
            doc = document;
        }
    }

    if (varstring.indexOf('g_list') > -1)
        setGList(doc);


    var variables = varstring.replace(/ /g, "").split(",");
    var scriptContent = "";
    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        scriptContent += "try{ if (typeof window." + currVariable + " !== 'undefined') document.body.setAttribute('tmp_" + currVariable.replace(/\./g, "") + "', window." + currVariable + "); } catch(err){console.log(err);}\n"
    }

    var detail = { 
        "detail" : {
            "type" : "code", 
            "content" : scriptContent 
        }
    };
    if (typeof cloneInto != 'undefined') detail = cloneInto(detail, document.defaultView); //required for ff
    var event = new CustomEvent('snuEvent', detail);
    doc.dispatchEvent(event);

    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        ret[currVariable.replace(/\./g, "")] = doc.body.getAttribute("tmp_" + currVariable.replace(/\./g, ""));
        doc.body.removeAttribute("tmp_" + currVariable.replace(/\./g, ""));
    }
    return ret;
}
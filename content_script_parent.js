(function () {

    if (document.getElementById("filter") != null || location.pathname.startsWith("/now/nav/ui/")) {

        //add script to extend search field
        var c = document.createElement('script');
        c.src = chrome.runtime.getURL('inject_parent.js');
        c.onload = function () {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(c);
    }

    getFromSyncStorageGlobal("snusettings", function (snusettings) {
        if (snusettings && snusettings.hasOwnProperty('iconallowbadge') && !snusettings.iconallowbadge) return;

        getFromSyncStorage("snuinstancesettings", function (settings) {
            setFavIconBadge(settings);
        });
    });

})();


//attach event listener from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getSelection")
        sendResponse({ selectedText: getSelection() });
    else if (request.method == "setFavIconBadge")
        setFavIconBadge(request.options);
    else if (request.method == "getVars")
        sendResponse({ myVars: getVars(request.myVars), url: location.origin, frameHref: getFrameHref() });
    else if (request.method == "getLocation")
        sendResponse({ url: location.origin, frameHref: getFrameHref() });
    else if (request.method == "toggleSearch") {
        toggleSearch();
    } 
    else if (request.method == "snuUpdateSettingsEvent") { //pass settings to page
        var event = new CustomEvent(
            request.method, request
        );
        document.dispatchEvent(event);
    } 
    //else
    //sendResponse({ url: location.origin });

});


document.addEventListener("snutils-event", function(data) {
    chrome.runtime.sendMessage(data.detail); //forward the customevent message to the bg script.
    return true;
})



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
    for (var i = 0; !result && i < self.frames.length; i++) {

        try {
            result = self.frames[i].document.getSelection().toString();
        } catch (error) {
            console.log(error);
        }
    }
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
            frameHref = document.querySelector('div.tab-pane.active iframe').contentWindow.ocation.href;
        }
        catch(ex){
            
        }
    }
    return frameHref;
}


//initialize g_list variable 
function setGList(doc) {
    var scriptContent = "try{ var g_list = GlideList2.get(document.querySelector('#sys_target').value); } catch(err){console.log(err);}";
    
    if(navigator.userAgent.toLowerCase().includes('firefox')){ //todo: find alternative for Eventdispatching in FF #202
        var script = doc.createElement('script');
        script.appendChild(doc.createTextNode(scriptContent));
        doc.body.appendChild(script);
    }
    else{
        var event = new CustomEvent('snuEvent', {
            detail : { "type" : "code", 
                       "content" : scriptContent
                     }
        });
        doc.dispatchEvent(event);
    }
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


    if(navigator.userAgent.toLowerCase().includes('firefox')){ //todo: find alternative for Eventdispatching in FF #202
        var script = doc.createElement('script');
        script.id = 'tmpScript';
        script.appendChild(doc.createTextNode(scriptContent));
        doc.body.appendChild(script);
    }
    else{
        var event = new CustomEvent('snuEvent', {
            detail : { "type" : "code", 
                       "content" : scriptContent
                     }
        });
        doc.dispatchEvent(event);
    }

    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        ret[currVariable.replace(/\./g, "")] = $(doc.body).attr("tmp_" + currVariable.replace(/\./g, ""));
        $(doc.body).removeAttr("tmp_" + currVariable.replace(/\./g, ""));
    }

    $(doc.body).find("#tmpScript").remove();

    return ret;
}
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

})();


//attach event listener from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getSelection")
        sendResponse({ selectedText: getSelection() });
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
    var frameHref = '';

    if (document.querySelectorAll('#gsft_main').length)
        frameHref = document.getElementById("gsft_main").contentWindow.location.href;
    else if (document.querySelectorAll('div.tab-pane.active').length == 1) {
        try{
            frameHref = document.querySelectorAll('iframe.activetab')[0].contentWindow.location.href;
        }
        catch (e){
            frameHref = document.location.href;
        }
    }
    else
        frameHref = document.location.href;

    return frameHref;
}


//initialize g_list variable 
function setGList() {

    var doc;
    if ($('#gsft_main').length)
        doc = $('#gsft_main')[0].contentWindow.document;
    else
        doc = document;

    var scriptContent = "try{ var g_list = GlideList2.get(jQuery('#sys_target').val()); } catch(err){console.log(err);}";
    var script = doc.createElement('script');
    script.appendChild(doc.createTextNode(scriptContent));
    doc.body.appendChild(script);

}



//try to return the window variables, defined in the comma separated varstring string
function getVars(varstring) {

    // if(window.frameElement && window.frameElement.nodeName == "IFRAME")
    //     return; //dont run in iframes

    if (varstring.indexOf('g_list') > -1)
        setGList();

    var doc;
    var ret = {};
    if (document.querySelectorAll('#gsft_main').length)
        doc = document.querySelectorAll('#gsft_main')[0].contentWindow.document;
    else if (document.querySelectorAll('div.tab-pane.active').length == 1) {

        try{
        ret.g_ck = jQuery('input#sysparm_ck').val();
        jQuery('iframe').removeClass('activetab');
        jQuery('div.tab-pane.active iframe').addClass('activetab');
        doc = jQuery('iframe.activetab')[0].contentWindow.document;
        }
        catch(ex){
            doc = document;
        }

    }
    else
        doc = document;


    var variables = varstring.replace(/ /g, "").split(",");
    var scriptContent = "";
    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        scriptContent += "try{ if (typeof window." + currVariable + " !== 'undefined') document.body.setAttribute('tmp_" + currVariable.replace(/\./g, "") + "', window." + currVariable + "); } catch(err){console.log(err);}\n"
    }


    var script = doc.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(doc.createTextNode(scriptContent));
    doc.body.appendChild(script);

    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        ret[currVariable.replace(/\./g, "")] = $(doc.body).attr("tmp_" + currVariable.replace(/\./g, ""));
        $(doc.body).removeAttr("tmp_" + currVariable.replace(/\./g, ""));
    }

    $(doc.body).find("#tmpScript").remove();

    return ret;
}
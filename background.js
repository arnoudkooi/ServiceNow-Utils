var onprem = false;
//set onprem true if publishing on prem version, KEEP the onprem var on line 1!!
var tabid;
var cookieStoreId;
var g_ck;
var sysId;
var url;
var instance;
var nme;
var jsnNodes;
var urlFull;
var updateSetTables = [];
var lastCommand = (new Date()).getTime();

var urlContains = ".service-now.com";
var urlPattern = "https://*.service-now.com/*"
if (onprem) {
    urlContains = ".";
    urlPattern = "*://*/*";
}

if (!chrome.contextMenus) chrome.contextMenus = browser.menus; //safari compatability

//Attatch eventlistener, setting extension only active on matching urls
chrome.runtime.onInstalled.addListener(function (details) {
    // firefox uses manifest pageAction.show_matches for the same functionality
    var version = chrome.runtime.getManifest().version;
    if (details.reason == "install" || (details.reason == "update" && version == ("5.6.3.3"))) {
        //openFile("welcome.html");
       
    }
    

    if (typeof chrome.declarativeContent === 'undefined')
        return;

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        urlContains: urlContains
                    },
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

// chrome.runtime.onUpdateAvailable.addListener(function () {
//     chrome.runtime.reload();
//     //clear storage on update (just to keep it clean)
//     chrome.storage.local.clear();
// });

//work in progress, as of 2022-03 prepare to be manifest v3 compliant
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.event == "scriptsync") {
        var cookieStoreId = '';
        if (sender.tab.hasOwnProperty('cookieStoreId')) {
            cookieStoreId = sender.tab.cookieStoreId;
        }
        createScriptSyncTab(cookieStoreId);
    }
    if (message.event == "pop") {
        pop();
    }
    else if (message.event == "codesearch") {
        codeSearch(message, cookieStoreId);
    }
    else if (message.event == "opencodediff") {
        openCodeDiff(message);
    }
    else if (message.event == "opencodeeditor") {
        openCodeEditor(message);
    }
    else if (message.event == "openfile") {
        openFile(message.command);
    }
    else if (message.event == "addslashcommand") {
        getFromSyncStorageGlobal("snusettings", function (settings) {
            if (settings["slashcommands"].length == 0) {
                settings["slashcommands"] = message.command;
            }
            else {
                settings["slashcommands"] = settings["slashcommands"] + "\n" + message.command;
            }
            setToChromeSyncStorageGlobal("snusettings", settings);

            // chrome.tabs.query({ //todo automaticly push new slashcommands to open tabs
            //     url : "https://*.service-now.com/*"
            // }, function (arrayOfTabs) {
            //     for (var i = 0; i < arrayOfTabs.length; i++){
            //         chrome.tabs.executeScript(arrayOfTabs[i].id, { "code": "var tt = 2 " });
            //     }
            // });
        })

    }
    else if (message.event == "viewxml") {
        var createObj = {
            'url': message.command,
        }
        if (sender.tab.hasOwnProperty('cookieStoreId')) {
            createObj.cookieStoreId = sender.tab.cookieStoreId;
        }
        chrome.tabs.create(createObj);
    }
    return true;
});


chrome.commands.onCommand.addListener(function (command) {

    if ((new Date()).getTime() - lastCommand < 500) {
        //dont trigger twice
    }
    else if (command == "show-technical-names")
        addTechnicalNames();
    else if (command == "pop")
        pop();
    else if (command == "toggle-focus-filter")
        sendToggleSearchFocus();
    else if (command == "toggle-atf")
        sendToggleAtfHelper();
    else if (command == "slashcommand-shortcut")
        slashCommand('/shortcut');
    else if (command == "slashcommand")
        slashCommand('');

    lastCommand = (new Date()).getTime();
    return true;

});


var menuItems = [{
    "type": "separator"
},

{
    "id": "goto",
    "contexts": ["selection"],
    "title": "Search / GoTo"
},
{
    "id": "instancesearch",
    "parentId": "goto",
    "title": "Instance Search: %s",
    contexts: ["selection"],
    "onclick": openSearch
},
{
    "id": "codesearch",
    "parentId": "goto",
    "title": "SN Utils Code Search: %s",
    contexts: ["selection"],
    "onclick": contextCodeSearch
},
{
    "id": "openscript",
    "parentId": "goto",
    "title": "Script Include: %s",
    contexts: ["selection"],
    "onclick": openScriptInclude
},
{
    "id": "opentablelist",
    "parentId": "goto",
    "title": "Table list: %s",
    contexts: ["selection"],
    "onclick": openTableList
},
{
    "id": "propertie",
    "parentId": "goto",
    "title": "Property: %s",
    contexts: ["selection"],
    "onclick": openPropertie
},
{
    "id": "tools",
    "contexts": ["all"],
    "title": "Tools"
},
{
    "id": "popinout",
    "parentId": "tools",
    "title": "PopIn / PopOut (/pop)",
    "contexts": ["all"],
    "onclick": pop
},
{
    "id": "shownames",
    "parentId": "tools",
    "title": "Show technical names (/tn)",
    "contexts": ["all"],
    "onclick": addTechnicalNames
},
{
    "id": "unhidefields",
    "parentId": "tools",
    "title": "Show hidden fields and sections (/uh)",
    "contexts": ["all"],
    "onclick": unhideFields
},
{
    "id": "canceltransaction",
    "parentId": "tools",
    "title": "Cancel transactions",
    "contexts": ["all"],
    "onclick": function (e, f) {
        openUrl(e, f, '/cancel_my_transactions.do');
    }
},
{
    "id": "clearcookies",
    "parentId": "tools",
    "title": "Clear cookies (Logout > Refresh page)",
    "contexts": ["all"]
},
{
    "id": "clearcookiessidedoor",
    "parentId": "tools",
    "title": "Clear cookies (Logout > login.do)",
    "contexts": ["all"]
},
//{ "id": "canceltransaction", "parentId": "tools", "title": "Cancel transactions", "contexts": ["all"], "onclick": function (e, f) { cancelTransactions(e); } },
{
    "id": "props",
    "parentId": "tools",
    "title": "Properties (/p)",
    "contexts": ["all"],
    "onclick": function (e, f) {
        openUrl(e, f, '/sys_properties_list.do');
    }
},
{
    "id": "updates",
    "parentId": "tools",
    "title": "Today's Updates",
    "contexts": ["all"],
    "onclick": function (e, f) {
        openUrl(e, f, '/sys_update_xml_list.do?sysparm_query=sys_updated_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^ORDERBYDESCsys_updated_on');
    }
},
{
    "id": "versions",
    "parentId": "tools",
    "title": "Update Versions",
    "contexts": ["all"],
    "onclick": function (e, f) {
        openVersions(e, f);
    }
},
{
    "id": "stats",
    "parentId": "tools",
    "title": "stats.do",
    "contexts": ["all"],
    "onclick": function (e, f) {
        openUrl(e, f, '/stats.do');
    }
},
{
    "id": "codesnippets",
    "contexts": ["editable"],
    "title": "Code Snippets"
},
{
    "id": "worknotesnippets",
    "contexts": ["editable"],
    "title": "Worknote Snippets"
},
{
    "id": "opentabscriptsync",
    "title": "Open ScriptSync Helper Tab",
    "contexts": ["all"],
    "onclick": function (e, f) {
        createScriptSyncTab();
    }
},
{
    "id": "copyselectedcellvalues",
    "title": "Copy Selected Cell Values from List",
    "contexts": ["all"],
    "onclick": function (e, f) {
        slashCommand('copycells');
    }
}
];

var defaultMenuConf = {
    "documentUrlPatterns": [urlPattern]
};
for (var itemIdx = 0; itemIdx < menuItems.length; itemIdx++) {
    chrome.contextMenus.create(Object.assign(menuItems[itemIdx], defaultMenuConf));
}

var snippets = {
    "codesnippet1": ["codesnippets", "GlideAggregate Count", `var count = new GlideAggregate('incident');
    count.addAggregate('COUNT');
    count.query();
    var incidents = 0;
    if(count.next()) 
       incidents = count.getAggregate('COUNT');`],

    "codesnippet2": ["codesnippets", "GlideAggregate Count by", `var count = new GlideAggregate('incident');
    count.addQuery('active','true');
    count.addAggregate('COUNT','category');
    count.query();
    while(count.next()){
      var category = count.category;
      var categoryCount = count.getAggregate('COUNT','category');
      gs.log("The are currently "+ categoryCount +" incidents with a category of "+ category);
    }`],

    "codesnippet3": ["codesnippets", "GlideAggregate Aggregates", `var count = new GlideAggregate('incident');
    count.addAggregate('MIN','sys_mod_count');
    count.addAggregate('MAX','sys_mod_count');
    count.addAggregate('AVG','sys_mod_count');
    count.groupBy('category');
    count.query();
    while(count.next()){
      var min = count.getAggregate('MIN','sys_mod_count');
      var max = count.getAggregate('MAX','sys_mod_count');
      var avg = count.getAggregate('AVG','sys_mod_count');
      var category = count.category.getDisplayValue();
      gs.log(category +" Update counts: MIN = "+ min +" MAX = "+ max +" AVG = "+ avg);
    }`],

    "codesnippet4": ["codesnippets", "gs.getUser", `var ourUser = gs.getUser(); 
    gs.­print(­ourUser.­getFirstName()); //print the first name of the user you are currently logged in as 
    ourUser = ourUser.­getUserByID(­'abel.tuter'); //fetch a different user, using the user_name field or sys_id on the target user record. 
    gs.­print(­ourUser.­getFirstName()); //first name of the user you fetched above 
    gs.­print(­ourUser.­isMemberOf(­'Capacity Mgmt'));`],

    "codesnippet6": ["codesnippets", "Workflow / Scratchpad", `//the run script activity sets a value in the scratchpad
    workflow.scratchpad.important_msg = "scratch me";
     
    //get the workflow script include helper 
    var workflow = new Workflow();
     
    //get the requested items workflow context 
    //this will get all contexts so you'll need to get the proper one if you have multiple workflows for a record 
    var context = workflow.getContexts(current); 
    //make sure we have a valid context 
    if (context.next()) { 
      //get a value from the scratchpad 
      var msg = context.scratchpad.important_msg; 
      //msg now equals "scratch me", that was set in the run script activity
     
      //add or modify a scratchpad value
      context.scratchpad.status = "completed"; 
      //we need to save the context record to save the scratchpad
      context.update(); 
    }`],

    "workenotesnippet1": ["worknotesnippets", "Hyperlink", `[code]<a href="URL" target="_blank">TEXT</a>[/code] `],

    "workenotesnippet2": ["worknotesnippets", "Code", `[code]<pre> 
    </pre>[/code] `]

};

for (var snip in snippets) {
    chrome.contextMenus.create(Object.assign({
        "id": snip,
        "parentId": snippets[snip][0],
        "contexts": ["editable"],
        "title": snippets[snip][1],
        "onclick": insertSnippet
    },
        defaultMenuConf));
}


getFromSyncStorageGlobal("snusettings", function (snusettings) {
    if (!snusettings) snusettings = {};
    if (snusettings.hasOwnProperty("slashcommands")) {
        try {
            var customCommands = JSON.parse(snusettings.slashcommands || "{}");
            Object.keys(customCommands).forEach(function (key) {
                //contexts =  (customCommands[key].url.includes("$0") ? "selection" : "all");
                if (customCommands[key].url.includes("contextmenu")){
                    chrome.contextMenus.create(Object.assign({
                        "id": "sc" + key,
                        "contexts": ["all"],
                        "title": customCommands[key].hint + ":%s",
                        "onclick": function (e, f) {
                            openUrl(e, f, customCommands[key].url);
                        }
                    },
                        defaultMenuConf));
                }
            });
        }
        catch (e) { }
    }
});



function insertSnippet(e, f) {

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        var pretext = '';
        if (snippets[e.menuItemId][2] == "codessnippet")
            pretext = "// Below snippet inserted via SN Utils Chrome Extension\n";

        chrome.tabs.sendMessage(tabs[0].id, {
            "snippet": pretext + snippets[e.menuItemId][2]
        });
    });
}

chrome.contextMenus.onClicked.addListener(function (clickData, tab) {
    if (clickData.menuItemId == "popinout")
        pop();
    else if (clickData.menuItemId == "clearcookies")
        clearCookies(clickData, tabid, "");
    else if (clickData.menuItemId == "clearcookiessidedoor")
        clearCookies(clickData, tabid, "/login.do");
});


function addTechnicalNames() {

    chrome.tabs.query({
        currentWindow: true,
        active: true
    },
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                method: "runFunction",
                myVars: "snuAddTechnicalNames()"
            });
        });

}

function slashCommand(cmd) {

    chrome.tabs.query({
        currentWindow: true,
        active: true
    },
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                method: "runFunction",
                myVars: "snuShowSlashCommand('"+ cmd +"',1)"
            });
        });

}

function unhideFields() {

    chrome.tabs.query({
        currentWindow: true,
        active: true
    },
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                method: "runFunction",
                myVars: "unhideFields()"
            });
        });

}

function sendToggleSearchFocus() {
    chrome.tabs.query({
        currentWindow: true,
        active: true
    },
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                method: "toggleSearch"
            }, {
                frameId: 0
            });
        });
}

function sendToggleAtfHelper() {
    chrome.tabs.query({
        currentWindow: true,
        active: true
    },
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                method: "runFunctionChild",
                myVars: "toggleATFMode()"
            });
        });
}

function codeSearch(message, cookieStoreId) {
    var url = chrome.runtime.getURL("codesearch.html");
    var args = '?query=' + message.command["query"] +
        '&instance=' + message.command["instance"] +
        '&url=' + message.command["url"] +
        '&g_ck=' + message.command["g_ck"];

    var createObj = {
        'url': url + args,
        'active': true
    }
    if (cookieStoreId) createObj.cookieStoreId = cookieStoreId; //only FireFox
    chrome.tabs.create(createObj);
}

function openCodeEditor(message) {
    var url = chrome.runtime.getURL("codeeditor.html");
    var createObj = {
        'url': url,
        'active': true
    }
    chrome.tabs.create(createObj);
}

function openCodeDiff(message) {
    var url = chrome.runtime.getURL("diff.html");
    var createObj = {
        'url': url,
        'active': true
    }
    chrome.tabs.create(createObj);
}

function openFile(link) {
    var url = link.startsWith('http') ? link : chrome.runtime.getURL(link);
    var createObj = {
        'url': url,
        'active': true
    }
    chrome.tabs.create(createObj);
}


function createScriptSyncTab(cookieStoreId) {

    getFromSyncStorageGlobal("synctab", function (tid) {
        if (tid) { //bit of a hack to prvent asking tabs permission, jet prevent opening multiple same tabs
            chrome.tabs.get(tid, function () {
                if (chrome.runtime.lastError) {
                    var url = chrome.runtime.getURL("scriptsync.html");
                    var createObj = {
                        'url': url,
                        'active': false
                    }
                    if (cookieStoreId) createObj.cookieStoreId = cookieStoreId; //only FireFox
                    chrome.tabs.create(createObj, function (t) {
                        setToChromeSyncStorageGlobal("synctab", t.id);
                    });
                } else {
                    chrome.tabs.update(tid, {
                        'active': false
                    });
                }
            });
        } else {
            var url = chrome.runtime.getURL("scriptsync.html");
            var createObj = {
                'url': url,
                'active': false
            }
            if (cookieStoreId) createObj.cookieStoreId = cookieStoreId; //only FireFox
            chrome.tabs.create(createObj,
                function (t) {
                    setToChromeSyncStorageGlobal("synctab", t.id);
                });
        }
    });
}


function openVersions(e, f) {
    var tokens = e.pageUrl.split('/').slice(0, 3);
    var baseurl = tokens.join('/');
    var cookieStoreId = '';
    if (f.hasOwnProperty('cookieStoreId')) {
        cookieStoreId = f.cookieStoreId;
    }

    var url = e.frameUrl || e.pageUrl;
    var urlParts = url.split((/[?/&]+/));
    var msg = "";
    var sys_id = "";
    var updateName = urlParts[2].replace(".do", "_");
    for (var i = 3; i < urlParts.length; i++) {
        if (urlParts[i].startsWith("sys_id")) {
            sys_id = urlParts[i].split("=")[1];
            if (sys_id.length != 32)
                msg = "Invalid sys_id: " + sys_id;

            break;
        }
    }

    if (sys_id) {

        getGck(cookieStoreId, function () {
            sys_id = sysId || sys_id;
            snuFetch(g_ck,
                baseurl + "/api/now/stats/sys_update_version?sysparm_count=true&sysparm_query=name=" + updateName + sys_id,
                null,
                function (jsn) {
                    if (typeof jsn == "undefined" || jsn == "error")
                        alert("No access to Update Versions");
                    else if (Number(jsn.result.stats.count)) {
                        var createObj = {
                            'url': baseurl + "/sys_update_version_list.do?sysparm_query=name=" + updateName + sys_id + "^ORDERBYDESCsys_recorded_at"
                        }
                        if (cookieStoreId) {
                            createObj.cookieStoreId = cookieStoreId;
                        }
                        chrome.tabs.create(createObj);
                    }
                    else
                        alert("No Update versions found for record: " + updateName + sys_id);
                });
        });
    } else
        alert("No table and sys_id found in this page / frame");

}

function cancelTransactions(e) {
    var tokens = e.pageUrl.split('/').slice(0, 3);
    var url = tokens.join('/');
    fetch(url + '/cancel_my_transactions.do', {}, r => {
        alert(r);
    });
}

function pop() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        var pth;
        var u = new URL(tabs[0].url);
        var tid = tabs[0].id;
        var baseUrl = u.origin
        var navToIdx = u.href.indexOf("nav_to.do?uri=") 
        if (navToIdx == -1) navToIdx = u.href.indexOf('now/nav/ui/classic/params/target/');
        if (navToIdx > -1) {
            if (u.href.includes("nav_to.do?uri="))
                pth = decodeURIComponent(u.search.substring(5));
            else { //polaris
                pth = decodeURIComponent(u.pathname.replace("now/nav/ui/classic/params/target/","") + u.search);
            }
            chrome.tabs.update(tid, {
                url: baseUrl + pth
            });
        } else {
            pth = "/nav_to.do?uri=" + encodeURIComponent(u.pathname + u.search);
            chrome.tabs.update(tid, {
                url: baseUrl + pth
            });
        }
    });
}


function clearCookies(e, tabid, target) {

    var tokens = e.pageUrl.split('/').slice(0, 3);
    var url = tokens.join('/');
    var domain = e.pageUrl.split('/')[2];
    chrome.cookies.getAll({
        domain: domain
    }, function (cookies) {
        for (var i = 0; i < cookies.length; i++) {
            chrome.cookies.remove({
                url: url + cookies[i].path,
                name: cookies[i].name
            });
        }
    });
    if (target)
        chrome.tabs.update(tabid, {
            url: url + target
        });
    else
        chrome.tabs.reload(tabid);

}


function openUrl(e, f, u) {

    var url = u.replace(/\$0/g,e.selectionText);
    var tokens = e.pageUrl.split('/').slice(0, 3);
    if (!url.startsWith('http')) url = tokens.join('/') + url;
    var createObj = {
        'url': url
    }
    if (f.hasOwnProperty('cookieStoreId')) {
        createObj.cookieStoreId = f.cookieStoreId;
    }
    chrome.tabs.create(createObj);
}

function openSearch(e, f) {
    var tokens = e.pageUrl.split('/').slice(0, 3);
    var srch = e.selectionText;
    var createObj = {
        'url': tokens.join('/') + "/text_search_exact_match.do?sysparm_search=" + srch
    }
    if (f.hasOwnProperty('cookieStoreId')) {
        createObj.cookieStoreId = f.cookieStoreId;
    }
    if (srch.length < 100) {
        chrome.tabs.create(createObj);
    }

}

function contextCodeSearch(e, f) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        var tid = tabs[0].id;

        chrome.tabs.sendMessage(tid, {
            method: "getVars",
            myVars: "g_ck"
        },
            function (response) {
                g_ck = response.myVars.g_ck || '';
                url = response.url;
                instance = (new URL(url)).host.replace(".service-now.com", "");

                var cookieStoreId;
                if (f.hasOwnProperty('cookieStoreId')) {
                    cookieStoreId = f.cookieStoreId;
                }
                var message = {
                    "event": "codesearch",
                    "command": {
                        "query": e.selectionText,
                        "instance": instance,
                        "url": url,
                        "g_ck": g_ck
                    }
                };
                codeSearch(message, cookieStoreId);
            });

    });


}

function openScriptInclude(e, f) {
    var tokens = e.pageUrl.split('/').slice(0, 3);
    var srch = e.selectionText;
    var createObj = {
        'url': tokens.join('/') + "/sys_script_include.do?sysparm_refkey=name&sys_id=" + srch
    }
    if (f.hasOwnProperty('cookieStoreId')) {
        createObj.cookieStoreId = f.cookieStoreId;
    }
    if (srch.length < 100) {
        chrome.tabs.create(createObj);
    }
}

function openTableList(e, f) {

    var tokens = e.pageUrl.split('/').slice(0, 3);
    var srch = e.selectionText;
    var createObj = {
        'url': tokens.join('/') + "/" + srch + "_list.do?sysparm_query=sys_updated_onONToday@javascript:gs.daysAgoStart(0)@javascript:gs.daysAgoEnd(0)"
    }
    if (f.hasOwnProperty('cookieStoreId')) {
        createObj.cookieStoreId = f.cookieStoreId;
    }
    if (srch.length < 50) {
        chrome.tabs.create(createObj);
    }

}

function openPropertie(e, f) {

    var tokens = e.pageUrl.split('/').slice(0, 3);
    var srch = e.selectionText;
    var createObj = {
        'url': tokens.join('/') + "/sys_properties_list.do?sysparm_query=name=" + srch
    }
    if (f.hasOwnProperty('cookieStoreId')) {
        createObj.cookieStoreId = f.cookieStoreId;
    }
    if (srch.length < 50) {
        chrome.tabs.create(createObj);
    }

}

//This listens for messages from FileSyncer and saves back scripts to the instance.
chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        //console.log(request);
        if (request.details) {
            snuFetch(g_ck,
                url + '/api/now/table/' + request.details[2] + '/' + request.details[4].split('.')[0],
                "{" + request.details[3] + ":" + JSON.stringify(request.details[1]) + "}",
                function (resp) {
                    sendResponse({
                        result: "saved"
                    });
                });
        } else if (request.instance) {
            sendResponse({
                instance: (instance || 'not set')
            });
        }
    });




//get g_ck token from browser, incase it didnt load via popup
function getGck(cookieStoreId, callback) {
    if (g_ck && sysId)
        callback();
    else {
        var queryObj = {
            "active": true,
            "currentWindow": true
        }
        if (cookieStoreId) queryObj.cookieStoreId = cookieStoreId;
        chrome.tabs.query(queryObj,
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    method: "getVars",
                    myVars: "g_ck,NOW.sysId"
                }, function (response) {
                    g_ck = response.myVars.g_ck || '';
                    sysId = response.myVars.NOWsysId || '';
                    callback();
                });
            });
    }
}


//Place the key value pair in the chrome local storage, with metafield for date added.
function setToChromeStorage(theName, theValue) {
    var myobj = {};
    myobj[instance + "-" + theName] = theValue;
    myobj[instance + "-" + theName + "-date"] = new Date().toDateString();
    chrome.storage.local.set(myobj, function () {

    });
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

function setToChromeSyncStorage(theName, theValue) {
    var myobj = {};
    myobj[instance + "-" + theName] = theValue;
    chrome.storage.sync.set(myobj, function () {
    });
}

//get an instance sync parameter
function getFromSyncStorage(theName, callback) {
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

function getParameterByName(name, url) {
    if (!url) url = window.location.href.toLowerCase();
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//Function to query Servicenow API
function snuFetch(token, url, post, callback) {
    var hdrs = {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    if (token) //only for instances with high security plugin enabled
        hdrs['X-UserToken'] = token; 

    var requestInfo = {
        method : 'get',
        headers : hdrs
    }

    if (post){
        requestInfo.method = 'PUT';
        requestInfo.body = post;
    }

    fetch(url, requestInfo)
    .then(response => response.json())
    .then(data => { 
        callback(data);
    });

}

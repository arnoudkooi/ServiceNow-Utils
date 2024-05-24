var onprem = false;
//set onprem true if publishing on prem version, KEEP the onprem var on line 1!!
var tabid;
var cookieStoreId = '';
var g_ck;
var sysId;
var url;
var instance;
var nme;
var jsnNodes;
var urlFull;
var updateSetTables = [];
var lastCommand;
var cmd = {};
let isArc = false;

var urlContains = ".service-now.com";
var urlPattern = "https://*.service-now.com/*"
if (onprem) {
    urlContains = ".";
    urlPattern = "*://*/*";
}

var defaultMenuConf = {
    "documentUrlPatterns": [urlPattern]
};

if (!chrome.contextMenus) chrome.contextMenus = browser.menus; //safari compatibility

chrome.contextMenus.removeAll(initializeContextMenus);

//Attach eventlistener, setting extension only active on matching urls
chrome.runtime.onInstalled.addListener(function (details) {
    // firefox uses manifest pageAction.show_matches for the same functionality
    var version = chrome.runtime.getManifest().version;
    if (details.reason == "install" || (details.reason == "update" && version == ("5.6.3.3"))) {
        //openFile("welcome.html");
    }

    if (typeof chrome.declarativeContent !== 'undefined'){
        chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
            chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [ new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {urlContains: urlContains},
                })],
                actions: [new chrome.declarativeContent.ShowAction()]
            }
            ]);
        });
    }

});

function initializeContextMenus(){

    for (var itemIdx = 0; itemIdx < menuItems.length; itemIdx++) {
        chrome.contextMenus.create(Object.assign(menuItems[itemIdx], defaultMenuConf));
    }

    for (var snip in snippets) {
        chrome.contextMenus.create(Object.assign({
            "id": snip,
            "parentId": snippets[snip][0],
            "contexts": ["editable"],
            "title": snippets[snip][1]
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
                            "title": customCommands[key].hint + ":%s"
                        },
                            defaultMenuConf));
                    }
                });
            }
            catch (e) { }
        }
    });
}
//used for sidepanel maybe can be done different...
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (chrome?.sidePanel){
        await chrome.sidePanel.setOptions({tabId, path: 'sidepanel.html',enabled: true });
    }
    else if (typeof browser !== "undefined" && browser?.sidebarAction){ //Firefox uses sidebarAction API
        await browser.sidebarAction.setPanel(tabId, {panel: "sidepanel.html"});
    }
});




chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if (sender){ //In Firefox the sender object can be empty #420 this construct is around that
       if (sender?.tab?.cookieStoreId) 
            cookieStoreId = sender.tab.cookieStoreId 
    } 

    if (message.event == "checkisservicenowinstance") {
        if (!cookieStoreId && typeof chrome.contextualIdentities != 'undefined' ){
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                cookieStoreId = tabs[0].cookieStoreId || '';
                cookieCheck();
            });
        }
        else 
            cookieCheck();
        
        function cookieCheck(){ //nested function because sender object can be empty in FF
            let params = { 
                "name": "glide_user_route",
                "url": message.origin
            }
            if (cookieStoreId) params['storeId'] = cookieStoreId;

            chrome.cookies.get(params, cookie => { //this is a check via the existence of a cookie, to make sure we only add the scripts on actual ServiceNow instances.
                var isInstance = (cookie) ? true : false || /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                sendResponse(isInstance);
            })
        }
    }
    else if (message.event == "scriptsync") {
        createScriptSyncTab(cookieStoreId);
    }
    else if (message.event == "showsidepanel") {
        if (message?.command?.isArc) isArc = true;
        instance = (new URL(sender.tab.url)).host.replace(".service-now.com", "");
        setToChromeSyncStorage("instancetag", message.command );
        showSidepanel(sender.tab, false);
    }
    else if (message.event == "updateinstancetagconfig") {
        instance = (new URL(sender.tab.url)).host.replace(".service-now.com", "");
        setToChromeSyncStorage("instancetag", message.command );
    }
    else if (message.event == "getinstancetagconfig") {
        instance = (new URL(sender.tab.url)).host.replace(".service-now.com", "");
        //using promise to make sure we get the instance tag config before we send the response
        getFromSyncStorage("instancetag").then( instaceTagConfig => {
            if (!instaceTagConfig) instaceTagConfig = getInitialInstaceTagConfig(instance);
            var details = {
                "action": "updateInstaceTagConfig",
                "instaceTagConfig": instaceTagConfig,
            };
            chrome.tabs.sendMessage(sender.tab.id, {
                "method": "snuUpdateSettingsEvent",
                "detail": details,
            }).then(response => {
                console.log("Response from content script:", response);
                sendResponse(response);
            }).catch(error => {
                sendResponse({error: error});
            });;

        }).catch(error => {
            sendResponse({error: error});
        });
    }
    else if (message.event == "pop") {
        pop();
    }
    else if (message.event == "initializecontextmenus") {
        chrome.contextMenus.removeAll(initializeContextMenus);
    }
    else if (message.event == "codesearch") {
        codeSearch(message, cookieStoreId);
    }
    else if (message.event == "viewdata") {
        viewData(message, cookieStoreId);
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
        if (cookieStoreId) createObj.cookieStoreId = cookieStoreId;
        chrome.tabs.create(createObj);
    }
    return true;
});


chrome.commands.onCommand.addListener(function (command) {
    if (typeof lastCommand !== 'undefined' && (new Date()).getTime() - lastCommand < 500) {
        //dont trigger twice #245
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
    "type": "separator",
    "id" : "sep1"
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
    "contexts": ["selection"]
},
{
    "id": "codesearch",
    "parentId": "goto",
    "title": "SN Utils Code Search: %s",
    "contexts": ["selection"]
},
{
    "id": "openscriptinclude",
    "parentId": "goto",
    "title": "Script Include: %s",
    "contexts": ["selection"]
},
{
    "id": "opentablelist",
    "parentId": "goto",
    "title": "Table list: %s",
    contexts: ["selection"]
},
{
    "id": "propertie",
    "parentId": "goto",
    "title": "Property: %s",
    "contexts": ["selection"]
},
{
    "id": "tools",
    "contexts": ["all"],
    "title": "Tools"
},
{
    "id": "showtechnicalnames",
    "parentId": "tools",
    "title": "Show technical names (/tn)",
    "contexts": ["all"]
},
{
    "id": "popinout",
    "parentId": "tools",
    "title": "PopIn / PopOut (/pop)",
    "contexts": ["all"]
},
{
    "id": "unhidefields",
    "parentId": "tools",
    "title": "Show hidden fields and sections (/uh)",
    "contexts": ["all"]
},
{
    "id": "canceltransaction",
    "parentId": "tools",
    "title": "Cancel transactions",
    "contexts": ["all"]
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
{
    "id": "props",
    "parentId": "tools",
    "title": "Properties (/p)",
    "contexts": ["all"]
},
{
    "id": "updates",
    "parentId": "tools",
    "title": "Today's Updates",
    "contexts": ["all"]
},
{
    "id": "versions",
    "parentId": "tools",
    "title": "Update Versions",
    "contexts": ["all"]
},
{
    "id": "stats",
    "parentId": "tools",
    "title": "stats.do",
    "contexts": ["all"]
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
    "id": "showsidepanel",
    "title": "Configure InstanceTag in Sidepanel",
    "contexts": ["all"]
},
{
    "id": "opentabscriptsync",
    "title": "Open sn-scriptsync Helper Tab",
    "contexts": ["all"]
},
{
    "id": "copyselectedcellvalues",
    "title": "Copy Selected Cell Values from List",
    "contexts": ["all"]
}
];

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

chrome.contextMenus.onClicked.addListener(function (clickData, tab) {
    if (clickData.menuItemId == "popinout")
        pop();
    else if (clickData.menuItemId == "clearcookies")
        clearCookies(clickData, tabid, "");
    else if (clickData.menuItemId == "showtechnicalnames")
        addTechnicalNames();
    else if (clickData.menuItemId == "clearcookiessidedoor")
        clearCookies(clickData, tabid, "/login.do");
    else if (clickData.menuItemId == "instancesearch")
        openSearch(clickData, tab);
    else if (clickData.menuItemId == "codesearch")
        contextCodeSearch(clickData, tab);
    else if (clickData.menuItemId == "openscriptinclude")
        openScriptInclude(clickData, tab);
    else if (clickData.menuItemId == "opentablelist")
        openTableList(clickData, tab);
    else if (clickData.menuItemId == "propertie")
        openPropertie(clickData, tab);
    else if (clickData.menuItemId == "unhidefields")
        unhideFields(clickData, tab);
    else if (clickData.menuItemId == "canceltransaction")
        openUrl(clickData, tab, '/cancel_my_transactions.do');
    else if (clickData.menuItemId == "props")
        openUrl(clickData, tab, '/sys_properties_list.do')
    else if (clickData.menuItemId == "updates")
        openUrl(clickData, tab, '/sys_update_xml_list.do?sysparm_query=sys_updated_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^ORDERBYDESCsys_updated_on');
    else if (clickData.menuItemId == "versions")
        openVersions(clickData, tab);
    else if (clickData.menuItemId == "stats")
        openUrl(clickData, tab, '/stats.do');
    else if (clickData.menuItemId == "showsidepanel"){
        showSidepanel(tab, true);
    }
    else if (clickData.menuItemId == "opentabscriptsync")
        createScriptSyncTab();
    else if (clickData.menuItemId == "copyselectedcellvalues")
        slashCommand('copycells');
    else if (clickData.menuItemId.includes('snippet'))
        insertSnippet(clickData, tab);
    else if (clickData.menuItemId.startsWith('sc')){
        getFromSyncStorageGlobal("snusettings", function (snusettings) {
            if (!snusettings) snusettings = {};
            if (snusettings.hasOwnProperty("slashcommands")) {
                var cmd = clickData.menuItemId.slice(2);
                var cmds = JSON.parse(snusettings.slashcommands);
                openUrl(clickData, tab,cmds[cmd].url);
            }
        })
    }

});


function showSidepanel(tab, viaContextMenu){
    if (chrome?.sidePanel && !isArc) //all that have the api except arc browser
        chrome.sidePanel.open({ windowId: tab.windowId, tabId: tab.id });
    else if (typeof browser !== "undefined" && browser?.sidebarAction && viaContextMenu) { //Firefox
        //Firefox uses sidebarAction API this is must be open via contetxtmenu
        //otherwise fall back to popup
        browser.sidebarAction.open(); 
    }   
    else { //fallback to a popup
        chrome.windows.create({
            url: chrome.runtime.getURL("sidepanel.html") + "?tabid=" + tab.id,
            type: "popup",
            width: 400,
            height: 800
          });
    }
}


function getInitialInstaceTagConfig(instance) {
    //most efficient to do here I guess
    let snuInstanceTagConfig = {
        tagEnabled: true,
        tagLeft: "1000px",
        tagBottom: "0px",
        tagText: instance,
        tagFontSize: "11pt",
        tagTagColor: "#4CAF50",
        tagFontColor: "#FFFFFF",
        tagOpacity: "0.8",
        tagCommand: "/tn",
        tagCommandShift: "/vd",
        tagTextDoubleclick: "/pop"
      };

      if (/^dev\d{5,6}$/.test(instance)) { //matching dev12345 so a PDI
        snuInstanceTagConfig.tagText = "PDI " + instance ;
        snuInstanceTagConfig.tagTagColor = pickRandom(["#FFC107", "#9C27B0", "#03A9F4", "#E91E63", "#00BCD4"]);
      }
      else if (instance == "signon") { 
        snuInstanceTagConfig.tagTagColor = "#DEDEDE";
        snuInstanceTagConfig.tagOpacity = "0.5";
      }
      else if (instance.includes("dev")) {
        snuInstanceTagConfig.tagTagColor = pickRandom(["#FBC02D", "#FFEB3B", "#F57F17", "#FF9800", "#FFC107"]);
        snuInstanceTagConfig.tagFontColor = "#000000";
      }
      else if (instance.includes("test")) {
        snuInstanceTagConfig.tagText = "Test";
        snuInstanceTagConfig.tagTagColor = pickRandom(["#388E3C", "#4CAF50", "#1B5E20", "#689F38", "#8BC34A"]);
        snuInstanceTagConfig.tagFontColor = "#000000";
      }
      else if (instance.includes("sandbox")) {
        snuInstanceTagConfig.tagTagColor = pickRandom(["#607D8B", "#78909C", "#546E7A", "#455A64", "#CFD8DC"]);
        snuInstanceTagConfig.tagFontColor = "#000000";
      }
      else if (instance.includes("demo")) {
        snuInstanceTagConfig.tagTagColor = pickRandom(["#7B1FA2", "#9C27B0", "#4A148C", "#6A1B9A", "#8E24AA"]);
      }
      else { //prod or other
        snuInstanceTagConfig.tagTagColor = pickRandom(["#D32F2F", "#F44336", "#B71C1C", "#0D47A1", "#1976D2"]);
      }
    
      function pickRandom(arr){
        return arr[Math.floor(Math.random() * arr.length)];
      }

      if (instance.includes(".")) snuInstanceTagConfig.tagText = instance.split(".")[0];

     setToChromeSyncStorage("instancetag", snuInstanceTagConfig );

    return snuInstanceTagConfig;

}






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
                myVars: `snuSlashCommandShow('${cmd}',1)`
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

function viewData(message, cookieStoreId) {
    var url = chrome.runtime.getURL("viewdata.html");
    var args = '?tablename=' + message.command["tableName"] +
        '&sysid=' + message.command["sysId"] +
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
    if (cookieStoreId) createObj.cookieStoreId = cookieStoreId; //only FireFox
    chrome.tabs.create(createObj);
}

function openCodeDiff(message) {
    var url = chrome.runtime.getURL("diff.html");
    var createObj = {
        'url': url,
        'active': true
    }
    if (cookieStoreId) createObj.cookieStoreId = cookieStoreId; //only FireFox
    chrome.tabs.create(createObj);
}

function openFile(link) {
    var url = link.startsWith('http') ? link : chrome.runtime.getURL(link);
    var createObj = {
        'url': url,
        'active': true
    }
    if (cookieStoreId) createObj.cookieStoreId = cookieStoreId; //only FireFox
    chrome.tabs.create(createObj);
}


function createScriptSyncTab(cookieStoreId) {
    getFromSyncStorageGlobal("synctab", function (tid) {
        if (tid) { //bit of a hack to prevent asking tabs permission, let prevent opening multiple same tabs
            chrome.tabs.get(tid, tb => {
                if (!tb) {
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
            let pathName = u.pathname.replace(/^\//, ''); //remove leading slash #444
            pth = "/nav_to.do?uri=" + encodeURIComponent(pathName + u.search);
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
    const MAX_SCRIPT_INCLUDE_NAME_LEN = 100;
    if (srch.length <= MAX_SCRIPT_INCLUDE_NAME_LEN) {
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
    const MAX_TABLE_NAME_LEN = 80;
    if (srch.length <= MAX_TABLE_NAME_LEN) {
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
    const MAX_PROPERTY_NAME_LEN = 100;
    if (srch.length <= MAX_PROPERTY_NAME_LEN) {
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
async function getFromSyncStorage(theName, callback) {
    // Define the instance variable if it's not already defined
    // Assuming 'instance' is a global variable or has been defined elsewhere
    const instanceName = instance + "-" + theName;
    
    // If a callback is provided, use the traditional callback approach
    if (callback) {
        chrome.storage.sync.get(instanceName, function (result) {
            callback(result[instanceName]);
        });
    } else {
        // If no callback is provided, return a promise
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(instanceName, function (result) {
                if (chrome.runtime.lastError) {
                    // Reject the promise if there's an error
                    reject(chrome.runtime.lastError);
                } else {
                    // Resolve the promise with the result
                    resolve(result[instanceName]);
                }
            });
        });
    }
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
        var dataSync = resSync[theName];

        if (typeof dataSync !== 'object'){ //only objects can become large and merged.
            callback(dataSync);
            return;
        }

        getFromChromeStorageGlobal(theName,function (resLocal) {
            var objLocal = resLocal || {};
            var objMerged = { ...dataSync, ...objLocal};
            callback(objMerged);
        });
    });
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

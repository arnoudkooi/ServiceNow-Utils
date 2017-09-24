var popup;
var tabid;
var g_ck;
var url;
var instance;
var nme;
var urlFull;

//Attatch eventlistener, setting extension only active on *.service-now.com
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: '.service-now.com' },
                    })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});


chrome.contextMenus.create({"type":"separator"});

chrome.contextMenus.create({"id" : "search", "title": "Search: %s", contexts:["selection"], "onclick" : openSearch });
chrome.contextMenus.create({"id" : "openscript", "title": "Open Script Include: %s", contexts:["selection"], "onclick" : openScriptInclude });
chrome.contextMenus.create({"id" : "opentablelist", "title": "Open Table list: %s", contexts:["selection"], "onclick" : openTableList });
chrome.contextMenus.create({"id" : "popinout", "title": "PopIn / PopOut","onclick" : togglePop});
chrome.contextMenus.create({"id" : "shownames", "title": "Show technical names","onclick" : addTechnicalNames});

chrome.contextMenus.onClicked.addListener(function(clickData, tab) {
  if (clickData.menuItemId == "popinout") 
    togglePop(clickData, tab.id);
});


function addTechnicalNames(){

    chrome.tabs.query(
    { currentWindow: true, active: true },
    function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { method: "runFunction", myVars: "addTechnicalNames();", funtion(){} });

    })

}

function openSearch(e) { 
console.log(e);
    var tokens = e.pageUrl.split('/').slice(0,3),
    URL = tokens.join('/');

    var srch = e.selectionText;
    if (srch.length < 100)
        chrome.tabs.create({ url: URL + "/textsearch.do?sysparm_search=" + srch });
}

function openScriptInclude(e) { 
    var tokens = e.pageUrl.split('/').slice(0,3),
    URL = tokens.join('/');
    var srch = e.selectionText;
    if (srch.length < 40)
        chrome.tabs.create({ url: URL + "/sys_script_include.do?sysparm_refkey=name&sys_id=" + srch });
}

function openTableList(e) { 
    var tokens = e.pageUrl.split('/').slice(0,3),
    URL = tokens.join('/');
    var srch = e.selectionText;
    if (srch.length < 40)
        chrome.tabs.create({ url: URL + "/" + srch + "_list.do?sysparm_query=sys_updated_onONToday@javascript:gs.daysAgoStart(0)@javascript:gs.daysAgoEnd(0)"});
}


function togglePop(clickData, tid) { 

    var frameHref = clickData.frameUrl || '';
    var urlFull = '' + clickData.pageUrl.match(/([^;]*\/){3}/)[0];
    if (frameHref.length > 10) {
        chrome.tabs.update(tid,{
            url: frameHref
        })
    }
    else {
        var newHref = encodeURIComponent(clickData.pageUrl.replace(urlFull, ''));
        var newUrl = urlFull + '/nav_to.do?uri=' + newHref;
        chrome.tabs.update(tid,{
            url: newUrl
        });
    }


}

chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
       //console.log(request);
        if (request.details) {
            loadXMLDoc(g_ck,
                url + '/api/now/table/' + request.details[2] + '/' + request.details[4].split('.')[0],
                "{" + request.details[3] + ":" + JSON.stringify(request.details[1]) + "}",
                function (resp) {
                    sendResponse({ result : "saved"});
                });
        }
        else if (request.instance) {
             sendResponse({instance : (instance || 'not set')});
        }
    });


//Retrieve variables from browser tab, passing them back to popup
function getBrowserVariables(tid) {
    tabid = tid;
    popup = chrome.extension.getViews({ type: "popup" })[0];
    chrome.tabs.sendMessage(tabid, { method: "getVars", myVars: "g_ck,g_user_date_time_format,NOW.user.roles,NOW.user.name,NOW.user_name" }, function (response) {
        g_ck = response.myVars.g_ck || '';
        url = response.url;
        instance = url.replace("https://", "").replace(".service-now.com", "");
        nme = response.myVars.NOWusername || response.myVars.NOWuser_name;
        popup.setBrowserVariables(response);
    });
}


//Try to retrieve current table and syid from browser tab, passing them back to popup
function getRecordVariables(scriptscync) {
    popup = chrome.extension.getViews({ type: "popup" })[0];
    chrome.tabs.sendMessage(tabid, { method: "getVars", myVars: "NOW.targetTable,NOW.sysId,mySysId,document.cookie" }, function (response) {
        popup.setRecordVariables(response, scriptscync);
    });
}

function getGRQuery(varName, template) {

    varName = varName || 'gr';

    popup = chrome.extension.getViews({ type: "popup" })[0];

    chrome.tabs.sendMessage(tabid, { method: "runFunction", myVars: "getListV3Fields()"}, function(){

        chrome.tabs.sendMessage(tabid, { method: "getVars", myVars: "g_list.filter,g_list.tableName,g_list.sortBy,g_list.sortDir,g_list.rowsPerPage,g_list.fields" }, function (response) {
            var tableName = response.myVars.g_listtableName;
            var encQuery = response.myVars.g_listfilter;
            var orderBy = response.myVars.g_listsortBy;
            var isDesc = (response.myVars.g_listsortDir == "DESC");
            var fields = ('' + response.myVars.g_listfields).split(',');
            var rowsPerPage = response.myVars.g_listrowsPerPage;
            var queryStr = "var " + varName + " = new GlideRecord('" + tableName + "');\n";
            queryStr += varName + ".addEncodedQuery(\"" + encQuery + "\");\n";
            if (isDesc)
                queryStr += varName + ".orderByDesc('" + orderBy + "');\n";
            else
                queryStr += varName + ".orderBy('" + orderBy + "');\n";
            queryStr += varName + ".setLimit(" + rowsPerPage + ");\n";
            queryStr += varName + ".query();\n";
            queryStr += "while (" + varName + ".next()) {\n";
            queryStr += "    //"+ varName +".initialize();\n";
            for (var i = 0; i < fields.length; i++) {
                queryStr += "    " + template.replace(/\{0\}/g,varName).replace(/\{1\}/g,fields[i]) + "\n";
            }
            queryStr += "    //"+ varName +".update();\n";
            queryStr += "    //"+ varName +".insert();\n";
            queryStr += "    //"+ varName +".deleteRecord();\n";
            queryStr += "}";
            popup.setGRQuery(queryStr);
        });
     });
}

function getGRQueryForm(varName,template) {

    varName = varName || 'gr';

    popup = chrome.extension.getViews({ type: "popup" })[0];

    chrome.tabs.sendMessage(tabid, { method: "getVars", myVars: "g_form.tableName,NOW.sysId,mySysId,elNames" }, function (response) {
        var tableName = response.myVars.g_formtableName;
        var sysId = response.myVars.NOWsysId || response.myVars.mySysId;
        var fields = ('' + response.myVars.elNames).split(',');
        var queryStr = "var " + varName + " = new GlideRecord('" + tableName + "');\n";
        queryStr += "if (" + varName + ".get('"+ sysId +"')) {\n";
        queryStr += "    //"+ varName +".initialize();\n";
        for (var i = 0; i < fields.length; i++) {
            queryStr += "    " + template.replace(/\{0\}/g,varName).replace(/\{1\}/g,fields[i]) + "\n";
        }
        queryStr += "    //"+ varName +".update();\n";
        queryStr += "    //"+ varName +".insert();\n";
        queryStr += "    //"+ varName +".deleteRecord();\n";
        queryStr += "}";
        popup.setGRQuery(queryStr);
    });
   
}

//Query servicenow for details of user, passhtml string to popup
function getUserDetails(userName) {

    var myurl = url + "/api/now/table/sys_user?sysparm_display_value=all&sysparm_query=user_name%3D" + userName;
    loadXMLDoc(g_ck, myurl, null, function (fetchResult) {
        var listhyperlink = " <a target='_blank' href='" + url + "/sys_user_list.do?sysparm_query=user_nameLIKE" + userName + "%5EORnameLIKE" + userName + "'> <i class='fa fa-list' aria-hidden='true'></i></a>";

        if (fetchResult.result.length > 0) {
            var usr = fetchResult.result[0];
            var html = "<br /><table class='table table-condensed table-bordered table-striped'>" +
                "<tr><th>User details</th><th>" + usr.user_name.display_value + listhyperlink + "</th></tr>" +

                "<tr><td>Name:</td><td><a href='" + url + "/nav_to.do?uri=sys_user.do?sys_id=" +
                usr.sys_id.display_value + "' target='_user'>" +
                usr.name.display_value + "</a></td></tr>" +
                "<tr><td>Active:</td><td>" + usr.active.display_value + "</td></tr>" +
                "<tr><td>Last login:</td><td>" + usr.last_login_time.display_value + "</td></tr>" +
                "<tr><td>Created:</td><td>" + usr.sys_created_on.display_value + "</td></tr>" +
                "<tr><td>Created by:</td><td>" + usr.sys_created_by.display_value + " <a id='createdby' data-username='" + usr.sys_created_by.display_value + "' href='#'> <i class='fa fa-sign-out fa-1' aria-hidden='true'></i></a></td></tr>" +
                "<tr><td>Phone:</td><td>" + usr.phone.display_value + "</td></tr>" +
                "<tr><td>E-mail:</td><td><a href='mailto:" + usr.email.display_value + "'>" + usr.email.display_value + "</a></td></tr></table>";
            popup.setUserDetails(html);
        }
        else {
            var html = "<br /><table class='table table-condensed table-bordered table-striped'><tr><th>User details</th><th>" + userName + listhyperlink + "</th></tr>" +
                "<tr><td>Result:</td><td>No exact match, try clicking the list icon.</td></tr></table>";
            popup.setUserDetails(html);
        }
    });
}


//Query ServiceNow for tables, pass JSON back to popup
function getTables() {
    var myurl = url + '/api/now/table/sys_db_object?sysparm_fields=name,label&sysparm_query=sys_update_nameISNOTEMPTY^nameNOT LIKE00%5EORDERBYlabel';
    loadXMLDoc(g_ck, myurl, null, function (jsn) {
        popup.setTables(jsn.result);
    });
}


//Query ServiceNow for tables, pass JSON back to popup
function getExploreData() {
    
        popup = chrome.extension.getViews({ type: "popup" })[0];
        chrome.tabs.sendMessage(tabid, { method: "getVars", myVars: "g_form.tableName,NOW.sysId,mySysId,elNames" }, function (response) {
        var tableName = response.myVars.g_formtableName;
        var sysId = response.myVars.NOWsysId || response.myVars.mySysId;

        if (!(tableName && sysId))
        {
             popup.setDataExplore([]);
             return true;
        }

        var myurl = url + '/api/now/ui/meta/' + tableName;
        loadXMLDoc(g_ck, myurl, null, function (metaData) {
            var query = '';
            if (sysId)
                query = '&sysparm_query=sys_id%3D' + sysId;
            var myurl = url + '/api/now/table/' + tableName + '?sysparm_display_value=all&sysparm_limit=1' + query;
            loadXMLDoc(g_ck, myurl, null, function (jsn) {

                var rows = jsn.result[0];
                var dataExplore = []
                for (var key in rows) {
                    var propObj = {}
                    if (!rows.hasOwnProperty(key)) continue; 

                    var display_value = rows[key].display_value;
                    var link = propObj.link = rows[key].link;
                    if (link){
                        var linksplit = link.split('/');
                        var href = url + '/' + linksplit[6] + '.do?sys_id=' + linksplit[7];
                        display_value = "<a href='"+ href +"' target='_blank'>" + display_value + "</a>";
                    }


                    propObj.name = key;   
                    propObj.meta =  metaData.result.columns[key];            
                    propObj.display_value = display_value;
                    propObj.value = (display_value != rows[key].value) ? rows[key].value : '';
                    

                    dataExplore.push(propObj);
                }
                popup.setDataExplore(dataExplore);
            });
        });
    });

}

function getScriptFields() {
    var myurl = url + '/api/now/table/sys_dictionary?sysparm_display_value=true&sysparm_fields=name,element,internal_type.name&sysparm_query=internal_type.labelLIKEhtml^ORinternal_type.labelLIKEscript^ORinternal_type.labelLIKExml';
    loadXMLDoc(g_ck, myurl, null, function (jsn) {
        popup.setScriptFields(jsn.result);
    });
}

//Query ServiceNow for updatsets, pass JSON back to popup
function getUpdateSets() {
    var myurl = url + '/api/now/ui/concoursepicker/updateset';
    loadXMLDoc(g_ck, myurl, null, function (jsn) {
        popup.setDataTableUpdateSets(jsn);
    });
}


//Query ServiceNow for updaes by current user, pass JSON back to popup
function getUpdates(username) {
    var myurl = url + '/api/now/table/sys_update_xml?sysparm_display_value=true&sysparm_fields=sys_id%2Ctype%2Cname%2Ctarget_name%2Cupdate_set.name%2Csys_updated_on%2Csys_updated_by&sysparm_query=sys_updated_byLIKE' + username + '%5EORDERBYDESCsys_updated_on&sysparm_limit=20';
    loadXMLDoc(g_ck, myurl, null, function (jsn) {
        popup.setDataTableUpdates(jsn);
    });
}

//Set active updateset and refresh list on popup after it
function setUpdateSet(data) {
    var myurl = url + '/api/now/ui/concoursepicker/updateset';
    loadXMLDoc(g_ck, myurl, data, function (jsn) {
        getUpdateSets();
    });
}

//Query dev14825 instance for message, display it on about tab in popup
function getInfoMessage(mytab) {
    try {
        var myurl = 'https://dev14825.service-now.com/getmessage.do';
        $.ajax({
            url: myurl,
            headers: {
                'Cache-Control': 'no-cache'
            }
        }).done(function (rspns) {
            popup.setInfoMessage(rspns);
        }).fail(function (jqXHR, textStatus) {
            popup.setInfoMessage(textStatus);
        });

    } catch (err) {
        popup.setInfoMessage("No info available");
    }
}

//Function to query Servicenow API
function loadXMLDoc(token, url, post, callback) {

    var hdrs = {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    if (token) //only for instances with high security plugin enabled
        hdrs['X-UserToken'] =  token;

    var method = "GET";
    if (post) method = "PUT";

    $.ajax({
        url: url,
        method: method,
        data: post,
        headers: hdrs
    }).done(function (rspns) {
        callback(rspns);
    }).fail(function (jqXHR, textStatus) {
        callback(textStatus);
    });

};

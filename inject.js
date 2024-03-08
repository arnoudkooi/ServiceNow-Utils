var fields = [];
var mySysId = '';
var snuMaxHints = 10;
var snuPropertyNames = [];
var snuIndex = 0;
var snuSlashLogIndex = -1;
var snuSelection = '';
var snuReceivedCommand = '';
var snuSlashNavigatorData = null;
var snuSlashLogData = null;
var snuLastOpened = (new Date()).getTime();
var snuNav = {
    'loading': 'mustload',
    'loadedLastTime': 0
};
var snuSettingsParsed = false;
var snunumbernav = snuSlashCommandNumberNav();

var snuslashcommands = {
    "acl": {
        "url": "sys_security_acl_list.do?sysparm_query=nameLIKE$1^operationLIKE$2^ORDERBYDESCsys_updated_on",
        "hint": "Filter ACL list <table> <operation>",
        "fields": "name"
    },
    "api": {
        "url": "https://developer.servicenow.com/dev.do#!/search/aspen/Reference/$0",//searching aspen redirects to most recent current family
        "hint": "Search Developer References <search>"
    },
    "app": {
        "url": "sys_scope_list.do?sysparm_query=nameLIKE$0^ORscopeLIKE$0^ORDERBYDESCsys_updated_on",
        "hint": "Filter Applications <name>",
        "fields": "name"
    },
    "aes": {
        "url": "/now/appenginestudio",
        "hint": "Open App Engine Studio"
    },
    "br": {
        "url": "sys_script_list.do?sysparm_query=nameLIKE$0^ORDERBYDESCsys_updated_on",
        "hint": "Filter Business Rules <name>",
        "fields": "name,collection"
    },
    "cancel": {
        "url": "/cancel_my_transactions.do",
        "hint": "Cancel My Running Transactions"
    },
    "code": {
        "url": "*",
        "hint": "Code Search <search>"
    },
    "copycells": {
        "url": "*",
        "hint": "Copy Selected Cell Values from List [-s for SysIDs]"
    },
    "copycolumn": {
        "url": "*",
        "hint": "Copy All Values from Selected Column [-s for SysIDs]"
    },
    "debug": {
        "url": "*",
        "hint": "Open Script Debugger"
    },
    "clearbp": {
        "url": "*",
        "hint": "Clear All Your Log & Breakpoints"
    },
    "bg": {
        "url": "sys.scripts.do",
        "hint": "Background Script"
    },
    "bgc": {
        "url": '/sys.scripts.do?content=var%20current%20%3D%20new%20GlideRecord%28%22$table%22%29%3B%0Aif%20%28current.get%28%22$sysid%22%29%29%7B%0A%20%20%20%20gs.info%28current.getDisplayValue%28%29%29%3B%0A%7D',
        "hint": "Background Script with var current"
    },
    "bgl": {
        "url": "/sys.scripts.do?content=var%20list%20%3D%20new%20GlideRecord%28%22$table%22%29%3B%0Alist.addEncodedQuery%28%22$encodedquery%22%29%3B%0Alist.setLimit%2810%29%3B%0Alist.query%28%29%3B%0Awhile%20%28list.next%28%29%29%7B%0A%20%20%20%20gs.info%28list.getDisplayValue%28%29%29%3B%0A%7D",
        "hint": "Background Script with list gr"
    },
    "bgm": {
        "url": "sys.scripts.modern.do",
        "hint": "Background Script Modern (Washington and up)"
    },
    "cls": {
        "url": "*",
        "hint": "Clear Local Storage" 
    },
    "tab": {
        "url": "/$0",
        "hint": "New tab <page or portal ie. foo.do or csm>"
    },
    "m": {
        "url": "*",
        "hint": "All menu search (Next Experience only) <search>"
    },
    "aw": {
        "url": "/now/workspace/agent/",
        "hint": "Agent Workspace"
    },
    "cheat": {
        "url": "https://www.arnoudkooi.com/cheatsheet/",
        "hint": "Download the latest SN Utils cheatsheet"
    },
    "comm": {
        "url": "https://www.servicenow.com/community/forums/searchpage/tab/message?advanced=false&allow_punctuation=false&q=$0",
        "hint": "Search Community <search>"
    },
    "cs": {
        "url": "sys_script_client_list.do?sysparm_query=nameLIKE$0^ORDERBYDESCsys_updated_on",
        "hint": "Filter Client Scripts <name>",
        "fields": "name"
    },
    "db": {
        "url": "$pa_dashboard.do",
        "hint": "Dashboards"
    },
    "dev": {
        "url": "https://developer.servicenow.com/dev.do#!/search/vancouver/All/$0",
        "hint": "Search developer portal <search>"
    },
    "diff1": {
        "url": "*",
        "hint": "Send XML of record to left side of diff viewer"
    },
    "diff2": {
        "url": "*",
        "hint": "Send XML of record to right side of diff viewer"
    },
    "diffenv": {
        "url": "*",
        "hint": "Compare current record XML with XML of <instance>"
    },
    "docs": {
        "url": "https://docs.servicenow.com/search?q=$0&labelkey=vancouver",
        "hint": "Search Docs <search>"
    },
    "elev": {
        "url": "*",
        "hint": "Toggle Security Admin role <role>"
    },
    "env": {
        "url": "*",
        "hint": "Open this page in <instance>"
    },
    "ec": {
        "url": "/esc",
        "hint": "Employee Center"
    },
    "fd": {
        "url": "/$flow-designer.do",
        "hint": "Open Flow Designer"
    },
    "help": {
        "url": "*",
        "hint": "Open SN Utils info page"
    },
    "itt": {
        "url": "*",
        "hint": "InstanceTag Toggle"
    },
    "lang": {
        "url": "*",
        "hint": "Switch language <lng>"
    },
    "list": {
        "url": "/$table_list.do?sysparm_query=sys_id=$sysid",
        "hint": "Open current record in list view"
    },
    "log": {
        "url": "syslog_list.do?sysparm_query=sys_created_onONToday@javascript:gs.daysAgoStart(0)@javascript:gs.daysAgoEnd(0)^messageLIKE$0^ORsourceLIKE$0",
        "hint": "Filter System Log Created Today <search>"
    },
    "mab": {
        "url": "/now/mobile-app-builder",
        "hint": "Mobile Application Builder"
    },
    "me": {
        "url": "sys_user.do?sys_id=javascript:gs.getUserID()",
        "hint": "Open My User profile"
    },
    "p": {
        "url": "sys_properties_list.do?sysparm_query=nameLIKE$0",
        "hint": "Filter Properties <name>",
        "fields": "name"
    },
    "pad": {
        "url": "/now/process/home",
        "hint": "Process Automation Designer",
        "fields": "name"
    },
    "plug": {
        "url": "$allappsmgmt.do?sysparm_search=$0",
        "hint": "Filter Plugins <search>",
        "fields": "id"
    },
    "pop": {
        "url": "*",
        "hint": "Pop in/out classic UI"
    },
    "ppt": {
        "url": "*",
        "hint": "Polaris Picker Test :)"
    },
    "s2": {
        "url": "*",
        "hint": "Toggle Select2 for Application and update set picker"
    },
    "search": {
        "url": "text_search_exact_match.do?sysparm_search=$0",
        "hint": "Global Instance Search <search>"
    },
    "si": {
        "url": "sys_script_include_list.do?sysparm_orderby=api_name&sysparm_query=api_nameLIKE$0^ORDERBYDESCsys_updated_on",
        "hint": "Filter Script Includes <name>",
        "fields": "api_name"
    },
    "sp": {
        "url": "/sp",
        "hint": "Service Portal"
    },
    "spw": {
        "url": "sp_widget_list.do?sysparm_query=nameLIKE$0^ORDERBYDESCsys_updated_on",
        "hint": "Service Portal Widgets <search>",
        "fields": "name",
        "overwriteurl": "/sp_config?id=widget_editor&sys_id=$sysid",
        "inlineonly": true
    },
    "sa": {
        "url": "*",
        "hint": "Switch Application (10 most recent)"
    },
    "sd": {
        "url": "domain_list.do?sysparm_query=nameLIKE$0^ORDERBYname",
        "hint": "Switch Domain <name>",
        "fields": "name",
        "overwriteurl": "#snu:switchto,domain,value,$sysid",
    },
    "su": {
        "url": "sys_update_set_list.do?sysparm_query=state=in progress^application=javascript:gs.getCurrentApplicationId()^nameLIKE$0^ORDERBYDESCsys_updated_on",
        "hint": "Switch Update set <name>",
        "fields": "name,sys_updated_on",
        "overwriteurl": "#snu:switchto,updateset,sysId,$sysid",
    },
    "rnd": {
        "url": "*",
        "hint": "Fill empty mandatory fields"
    },
    "st": {
        "url": "/$studio.do",
        "hint": "Open Studio"
    },
    "shortcut": {
        "url": "//sa",
        "hint": "Special slashcommand, accessible via extension keyboard shortcut"
    },
    "start": {
        "url": "/nav_to.do",
        "hint": "New tab"
    },
    "sysid": {
        "url": "*",
        "hint": "Instance search <sys_id>"
    },
    "tables": {
        "url": "sys_db_object_list.do?sysparm_query=sys_update_nameISNOTEMPTY^labelLIKE$0^ORnameLIKE$0^ORDERBYname",
        "hint": "Tables sys_db_object <search>",
        "fields": "label,name"
    },
    "tsk": {
        "url": "task.do?sysparm_refkey=name&sys_id=$0",
        "hint": "Open task <number>"
    },
    "tn": {
        "url": "*",
        "hint": "Show Technical Names"
    },
    "token": {
        "url": "*",
        "hint": "Send g_ck token to VS Code"
    },
    "trans": {
        "url": "syslog_transaction_list.do?sysparm_query=sys_created_onONToday@javascript:gs.daysAgoStart(0)@javascript:gs.daysAgoEnd(0)^urlLIKE$0",
        "hint": "Filter Transaction Log <search>"
    },
    "tweets": {
        "url": "https://twitter.com/search?q=from%3Asn_utils%20$0&src=typed_query&f=live",
        "hint": "Search @sn_utils Tweets <search>"
    },
    "u": {
        "url": "sys_user_list.do?sysparm_query=user_nameLIKE$0^ORnameLIKE$0",
        "hint": "Filter Users <search>",
        "fields": "user_name, name"
    },
    "ua": {
        "url": "sys_ui_action_list.do?sysparm_query=nameLIKE$0^ORDERBYDESCsys_updated_on",
        "hint": "Filter UI Actions <name>",
        "fields": "name,table"
    },
    "uh": {
        "url": "*",
        "hint": "Show Hidden Fields"
    },
    "uib": {
        "url": "/now/build/ui/experiences",
        "hint": "Open UI Builder"
    },
    "uibe": {
        "url": "/sys_ux_page_registry_list.do?sysparm_query=root_macroponentISNOTEMPTY^sys_id!=3bfb334573021010e12d1e3014f6a7a9^sys_id!=8f30c79577af00108a370870a810613a^sys_id!=a36cd3837721201079ccdc3f581061b8^sys_id!=ec71a07477a2301079ccdc3f581061e9^titleLIKE$0^ORpathLIKE$0^ORDERBYDESCsys_updated_on",
        "hint": "UIB Experience <search>",
        "fields": "title,path,admin_panel.sys_id",
        "overwriteurl": "/now/build/ui/apps/$admin_panel.sys_id"
    },
    "uis": {
        "url": "sys_ui_script_list.do?sysparm_query=nameLIKE$0^ORDERBYDESCsys_updated_on",
        "hint": "Filter UI Scripts <name>",
        "fields": "name"
    },
    "unimp": {
        "url": "*",
        "hint": "Stop impersonating and reload page"
    },
    "um": {
        "url": "javascript:snuSetAllMandatoryFieldsToFalse()",
        "hint": "UnManadtory; Set all mandatory fields to false (Admin only)"
    },
    "up": {
        "url": "sys_ui_policy_list.do?sysparm_query=short_descriptionLIKE$0^ORDERBYDESCsys_updated_on",
        "hint": "UI Policies <name>",
        "fields": "short_description,sys_updated_on"
    },
    "va": {
        "url": "/$conversation-builder.do",
        "hint": "Virtual Agent Designer"
    },
    "vd": {
        "url": "*",
        "hint": "View data of current record"
    },
    "wf": {
        "url": "/workflow_ide.do?sysparm_nostack=true",
        "hint": "Workflow Editor"
    },
    "ws": {
        "url": "/now/workflow-studio/home/flow",
        "hint": "Workflow Studio"
    },
    "imp": {
        "url": "*",
        "hint": "Impersonate User"
    },
    "xml": {
        "url": "/$table.do?XML=&sys_target=&sys_id=$sysid ",
        "hint": "Open current record's XML view"
    },
    "xmlsrc": {
        "url": "*",
        "hint": "Open current record's XML view with Browser's View Source"
    },
    "json": {
        "url": "/$table.do?JSONv2&sysparm_action=get&sysparm_sys_id=$sysid",
        "hint": "Open current record's JSONv2 view"
    },
    "versions": {
        "url": "/sys_update_version_list.do?sysparm_query=name=$table_$sysid^ORDERBYDESCsys_recorded_at",
        "hint": "Versions of current record",
        "fields": "sys_recorded_at,sys_created_by"
    }

}

var snuslashswitches = {
    "t": { "description": "View Table Structure ➚", "value": "sys_db_object.do?sys_id=$0&sysparm_refkey=name", "type": "link" },
    "n": { "description": "New Record ➚", "value": "$0.do", "type": "link" },
    "r": { "description": "Open Random Record ➚", "value": "&snurandom=true", "type": "querypart" },
    "ra": { "description": "REST API Explorer ➚", "value": "$restapi.do?tableName=$0", "type": "link" },
    "c": { "description": "Table Config ➚", "value": "personalize_all.do?sysparm_rules_table=$0&sysparm_rules_label=$0", "type": "link" },
    "erd": { "description": "View Schema Map ➚", "value": "generic_hierarchy_erd.do?sysparm_attributes=table_history=,table=$0,show_internal=true,show_referenced=true,show_referenced_by=true,show_extended=true,show_extended_by=true,table_expansion=,spacing_x=60,spacing_y=90,nocontext", "type": "link" },

    "a": { "description": "Active is True ∀", "value": "^active=true", "type": "encodedquerypart" },
    "f": { "description": "Filter Only ↝", "value": "&sysparm_filter_only=true&sysparm_filter_pinned=true", "type": "querypart" },
    "ga": { "description": "Group Count Ascending (Grouped Lists Only) ↧", "value": "&sysparm_group_sort=COUNT", "type": "querypart" },
    "gd": { "description": "Group Count Descending (Grouped Lists Only) ↥", "value": "&sysparm_group_sort=COUNTDESC", "type": "querypart" },
    "s": { "description": "Current Scope ∀", "value": "^sys_scope=javascript:gs.getCurrentApplicationId()", "type": "encodedquerypart" },
    "uct": { "description": "Updated or Created Today ∀", "value": "^sys_created_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^ORsys_updated_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()", "type": "encodedquerypart" },
    "ut": { "description": "Updated Today ∀", "value": "^sys_updated_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()", "type": "encodedquerypart" },
    "ct": { "description": "Created Today ∀", "value": "^sys_created_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()", "type": "encodedquerypart" },
    "um": { "description": "Updated by M ∀", "value": "^sys_updated_by=javascript:gs.getUserName()", "type": "encodedquerypart" },
    "cm": { "description": "Created by Me ∀", "value": "^sys_created_by=javascript:gs.getUserName()", "type": "encodedquerypart" },
    "m": { "description": "Updated or Created by Me ∀", "value": "^sys_updated_by=javascript:gs.getUserName()^ORsys_created_by=javascript:gs.getUserName()", "type": "encodedquerypart" },
    "ou": { "description": "Order by Updated Descending ↧", "value": "^ORDERBYDESCsys_updated_on", "type": "encodedquerypart" },
    "oc": { "description": "Order by Created Descending ↧", "value": "^ORDERBYDESCsys_created_on", "type": "encodedquerypart" },
    "pf": { "description": "Use Polaris = False ↝", "value": "&sysparm_use_polaris=false", "type": "querypart" },
    "p": { "description": "Filter Pinned ↝", "value": "&sysparm_filter_pinned=true", "type": "querypart" },
    "pi": { "description": "Pop In - Open in full UI ↝", "value": "/nav_to.do?uri=", "type": "prepend" },
};

var snuslashswitchesvalueoverwrites = { 
    "s.syslog": "^source=javascript:var sc = new GlideRecord('sys_scope'); sc.get(gs.getCurrentApplicationId()); sc.scope;" 
};


var snuOperators = ["%", "^", "=", ">", "<", "ANYTHING", "BETWEEN", "DATEPART", "DYNAMIC", "EMPTY", "ENDSWITH", "GT_FIELD", "GT_OR_EQUALS_FIELD", //"IN", //removed, to common ie: INC00010001
    "ISEMPTY", "ISNOTEMPTY", "LESSTHAN", "LIKE", "LT_FIELD", "LT_OR_EQUALS_FIELD", "MORETHAN", "NOT IN", "NOT LIKE", "NOTEMPTY", "NOTLIKE", "NOTONToday", "NSAMEAS", "ONToday", "RELATIVE", "SAMEAS", "STARTSWITH"];

if (typeof g_ck == 'undefined') g_ck = null;  //prevent not defined errors when not provided in older instances , also see #453


document.addEventListener('snuUpdateSettingsEvent', e => {
    if (e.type == "snuUpdateSettingsEvent") {
        if (e?.detail?.action == "updateSlashCommand") {
            snuslashcommands[e.detail.cmdname] = e.detail.cmd;
            snuSlashCommandShow('/' + e.detail.cmdname + ' ', 0);
        }
        else if (e?.detail?.action == "updateInstaceTagConfig") { //update instance tag settings hanlded in instancetag.js
            if (typeof snuReceiveInstanceTagEvent == 'function')
                    snuReceiveInstanceTagEvent(e);
        }

    }

});

if (typeof jQuery != "undefined") {
    (function() {
        if (typeof angular != "undefined") {
            setTimeout(function () {
                updateReportDesignerQuery();
            }, 2000);

        }

        // We have to call the function twice since we don't know what type of related list loading is selected by a user (with the form or after forms loads).
        snuDoubleClickToSetQueryListV2();
        if (typeof CustomEvent.observe == 'function') {
            CustomEvent.observe('related_lists.ready', function () {
                snuDoubleClickToSetQueryListV2();
            });
        }
        snuDoubleClickToShowFieldOrReload();
        snuCaptureFormClick();
        snuClickToOpenWidget();
        snuMakeReadOnlyContentCopyable();
    })();
}
flowDesignerDoubleClick();

function snuEncodeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/\//g, '&#x2F;');
}

function snuDecodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = DOMPurify.sanitize(html);
    return txt.value;
}

function snuGetTables(shortcut) {

    Object.entries(snuslashcommands).forEach(([key, val]) => {
        if (snuslashcommands[key].hasOwnProperty("type")) { //remove old matches
            delete snuslashcommands[key];
        }
    });

    if (shortcut.length < 3) return;

    var qry = '^nameSTARTSWITH' + shortcut;
    if (shortcut.includes('*')) {
        qry = '^nameLIKE' + shortcut.replace(/\*/g, '');
    }

    var myurl = '/api/now/table/sys_db_object?sysparm_limit=100&sysparm_fields=name,label&sysparm_query=sys_update_nameISNOTEMPTY^nameNOT LIKE$^nameNOT LIKE00' + qry + '^ORDERBYname';
    snuFetchData(g_ck, myurl, null, function (jsn) {

        if (jsn.hasOwnProperty('result')) {
            var results = jsn.result;
            Object.entries(results).forEach(([key, val]) => {
                if (!snuslashcommands.hasOwnProperty(val.name)) {
                    snuslashcommands[val.name] = {
                        "url": val.name + "_list.do?sysparm_filter_pinned=true&sysparm_query=",
                        "hint": "" + val.label + " <encodedquery>",
                        "type": "table"
                    };
                }
            });
            if (results?.length) snuExpandHints(shortcut)
        } else {
            snuSlashCommandInfoText(`<b>Log</b><br />- Tables can not be retrieved.<br />`, true);
        }

    });

}

function snuGetDirectLinks(targeturl, shortcut) {

    var fields = "";
    var overwriteurl = "";
    try {
        fields = (snuslashcommands[shortcut].hasOwnProperty("fields")) ? snuslashcommands[shortcut].fields || "sys_updated_on,sys_updated_by" : "sys_updated_on,sys_updated_by";
    } catch (e) { }

    try {
        overwriteurl = (snuslashcommands[shortcut].hasOwnProperty("overwriteurl")) ? snuslashcommands[shortcut].overwriteurl || "" : "";
    } catch (e) { }

    if (fields) {
        snuSlashCommandInfoText(`Fetching data...`, false);
        snuslashcommands[shortcut].fields
        var url = "api/now/table/" + targeturl.replace("_list.do", "") +
            "&sysparm_display_value=true&sysparm_exclude_reference_link=true&sysparm_suppress_pagination_header=true&sysparm_limit=20" +
            "&sysparm_fields=sys_id," + fields;

        try {
            var table = url.match(/.*\/(.*)\?/)[1]
        } catch (ex) {
            return false;
        }
        snuFetchData(g_ck, url, null, jsn => {
            var directlinks = '';
            if (jsn.hasOwnProperty('result')) {
                var results = jsn.result;
                if (table == 'domain') directlinks = `<span class="dispidx">0</span> <a id="snulnk0" href="#snu:switchto,domain,value,global">global</a><br />`;
                if (results.length == 0) directlinks = `No results found`;
                var idx = 0;
                var dispIdx = 0;
                Object.entries(results).forEach(([key, val]) => {
                    var fieldArr = fields.replace(/ /g, '').split(',');
                    var txtArr = [];
                    for (var i = 0; i < fieldArr.length && i < 2; i++) {
                        txtArr.push(val[fieldArr[i]])
                    }
                    var txt = txtArr.join(' | ');
                    var link = table + ".do?sys_id=" + val.sys_id;
                    var target = "gsft_main"
                    if (overwriteurl) {
                        link = overwriteurl.replace(/\$sysid/g, val.sys_id);
                        for (var i = 0; i < fieldArr.length; i++) {
                            link = link.replaceAll('$' + fieldArr[i], val[fieldArr[i]]);
                        }
                        target = (!overwriteurl.startsWith("http") && !overwriteurl.startsWith("/")) ? "gsft_main" : "_blank";
                    }
                    var idattr
                    if (idx < 10 && (dispIdx !== '>')) {
                        idx++;
                        dispIdx++;
                        dispIdx = dispIdx % 10;
                        idattr = 'id="snulnk' + dispIdx + '"';
                    }
                    else {
                        dispIdx = '>';
                        idattr = '';
                    }
                    directlinks += '<span class="dispidx">' + dispIdx + '</span> <a ' + idattr + '" target="' + target + '" href="' + link + '">' + txt + '</a><br />';
                });
                if (directlinks.length > 50) 
                    directlinks += `<span style="opacity:0.4; font:smaller">Tip: Hit SHIFT to toggle keyboard navigation<br />Results: ${jsn.resultcount}</br><br />`;
                
            }
            else {
                directlinks = `No access to data`;
            }
            window.top.document.getElementById('snudirectlinks').innerHTML = DOMPurify.sanitize(directlinks, { ADD_ATTR: ['target'] });
            window.top.document.getElementById('snudirectlinks');
            window.top.document.querySelectorAll("#snudirectlinks a").forEach(elm => {

                if (elm.hash.startsWith('#snu:')) {
                    var args = elm.hash.substring(5).split(',');
                    elm.addEventListener("click", (evt) => {
                        evt.preventDefault();
                        snuExcuteHashCommand(args);
                    })
                }
                else
                    elm.addEventListener("click", snuSlashCommandHide)

            });

        })
    }
}

function snuExcuteHashCommand(args) {
    if (args.length == 4 && args[0] == 'switchto') {
        snuSwitchTo(args[1], args[2], args[3]);
    }
}

function snuEasyCompareTime() { //for our ITOM friends to easy select compare time range (hit left or right shift when tooltip appears)
    if (location.pathname != "/$sw_topology_map.do") return;
    document.addEventListener("keydown", function (event) {
        if (event.shiftKey) {
            var tt = document.querySelector("text.tlTooltip.compare");
            var elm = document.querySelector("#glide_date_time_sa_history_point" + event.location + "_sa_history_point" + event.location);
            if (!tt || !elm) return;
            elm.value = tt.innerHTML
            elm.dispatchEvent(new Event("change"));
        };
    });
}
snuEasyCompareTime();

function snuAddFilterListener() {
    if (document.getElementById('filter') == null) return;
    document.getElementById('filter').addEventListener('keyup', function (e) {
        var filterValue = e.currentTarget.value.replace(/['" ]+/g, '');
        if (filterValue.match(/^[0-9a-f]{32}$/) != null && e.key == 'Enter') { //is a sys_id
            snuSearchSysIdTables(filterValue);
        }
        //adjusted for polaris compatability, 
        //moved logic to global keydown evnt to dectect '/' in filter
    });
}

function snuSlashCommandAddListener() {
    if (window.top.document.getElementById('snufilter') == null) return;
    if (window.top.document.getElementById('snufilter').classList.contains('snu-slashcommand')) return;
    window.top.document.getElementById('snufilter').classList.add('snu-slashcommand');

    window.top.document.getElementById('snufilter').addEventListener('keydown', function (e) {
        if (e.key == 'Shift') {
            snunumbernav = snuSlashCommandNumberNav(true);
            let dlinks = window.top.document.getElementById('snudirectlinks');
            if (dlinks) {
                if (snunumbernav) dlinks.classList.remove('snudirectlinksdisabled');
                else dlinks.classList.add('snudirectlinksdisabled');
            }
            return;
        }
        if (e.key == 'ArrowUp') {
            e.preventDefault();
            if (snuIndex == 0) { 
                snuSlashLogData = snuSlashLogData || snuSlashLog();
                if (snuSlashLogData.length){
                    snuSlashLogIndex = (snuSlashLogData.length > (snuSlashLogIndex+1)) ? snuSlashLogIndex+1 : 0;
                    this.value = snuSlashLogData[snuSlashLogIndex];
                }
            }
            else {
                (snuIndex == 0) ? snuMaxHints = 10 : snuIndex--; 
            }
        }
        if (e.key == 'ArrowDown') { 
            e.preventDefault(); 
            if (snuSlashLogIndex <= 0 && snuPropertyNames.length > 1){
                snuMaxHints = 1000; 
                snuIndex++; 
            }
            else {
                snuSlashLogData = snuSlashLogData || snuSlashLog();
                if (snuSlashLogData.length){
                    snuSlashLogIndex = (snuSlashLogIndex > 0) ? snuSlashLogIndex-1 : snuSlashLogData.length-1;
                    this.value = snuSlashLogData[snuSlashLogIndex];
                }
            }
        };
        if (isFinite(e.key) && snunumbernav) {
            if (window.top.document.getElementById('snulnk' + e.key)) {
                e.preventDefault();
                window.top.document.getElementById('snulnk' + e.key).dispatchEvent(new MouseEvent('click', { cancelable: true, metaKey : e.metaKey, shiftKey : e.shiftKey, ctrlKey : e.ctrlKey}));
                return;
            }
        }
        if (e.key == 'Meta' || e.key == 'Control' || e.key == 'ArrowLeft') return;
        if (e.currentTarget.selectionStart < e.currentTarget.value.length && e.key == 'ArrowRight') return;
        if (e.key == 'Escape') snuSlashCommandHide(false, e);
        if (e.currentTarget.value.length <= 1 && e.key == 'Backspace') snuSlashCommandHide(true,e);
        var sameWindow = !(e.metaKey || e.ctrlKey) && (window.top.document.getElementById('gsft_main') != null ||
            document.querySelector("[component-id]") != null);
        if (!e.currentTarget.value.startsWith("/")) {
            e.currentTarget.value = "/" + e.currentTarget.value
        }
        var snufilter = e.currentTarget.value.substr(1);
        var thisUrl = window.location.href;
        var thisInstance = window.location.host.split('.')[0];
        var thisHost = window.location.host;
        var thisOrigin = window.location.origin;
        var idx = snufilter.indexOf(' ')
        var noSpace = (snufilter.indexOf(' ') == -1);
        var selectFirst = (e.key == "Tab" || e.key == "Enter") && !snufilter.includes(" ");
        var thisKey = (e.key.trim().length == 1) ? e.key : ""; //we may need to add this as we are capturing keydown
        var thisKeyWithSpace = (e.key.trim().length == 1 || e.key == " ") ? e.key : ""; //now 
        if (e.key == '\\') {
            e.currentTarget.value = (e.currentTarget.value + window.top.document.snuSelection).trim();
            thisKey = "";
            e.preventDefault();
            setTimeout(()=> {
                window.top.document.getElementById('snufilter').dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Shift' }));
            },150)

        }
        if (noSpace) idx = snufilter.length;
        var originalShortcut = ((snufilter.slice(0, idx) + ((noSpace) ? thisKey : ""))).toLowerCase();

        if (e.key == 'Backspace' && noSpace) originalShortcut = originalShortcut.slice(0, -1);
        var shortcut = snufilter.slice(0, idx).toLowerCase();
        if (snuPropertyNames.length > 1 && snuIndex >= 0 && ["ArrowDown", "ArrowUp", "Enter", "Tab", " "].includes(e.key)) {
            shortcut = snuPropertyNames[snuIndex];
            // idx = snufilter.indexOf(' '); //why is this line here?
        }
        var query = snufilter.slice(idx + 1);
        var tmpshortcut = shortcut + (e.key.length == 1 ? e.key : "")
        if (((e.key == 'ArrowRight' && (noSpace || snuPropertyNames.length == 0 )) || ((shortcut || "").length == 3 || snuPropertyNames.length > 99 ||
            tmpshortcut.includes('*')) && e.key.length == 1 && e.key != " " && e.key != "-" && !(shortcut || "").includes("-")) && !query) {
            snuGetTables(tmpshortcut);
        };


        var targeturl = snuslashcommands.hasOwnProperty(shortcut) ? snuslashcommands[shortcut].url || "" : "";
        var inlineOnly = snuslashcommands.hasOwnProperty(shortcut) ? snuslashcommands[shortcut].overwriteurl : false;

        if (typeof g_form == 'undefined') {
            try { //get if in iframe
                g_form =
                    (document.querySelector("#gsft_main") || document.querySelector("[component-id]")
                        .shadowRoot.querySelector("#gsft_main")).contentWindow.g_form;
            } catch (e) { }
        }

        if (targeturl.startsWith("//")) { //enable to use ie '/dev' as a shortcut for '/env acmedev'
            snufilter = snuslashcommands[shortcut].url.substr(2);
            if (snuReceivedCommand) {
                window.top.document.getElementById('snufilter').value = targeturl.substring(1);
                window.top.document.getElementById('snufilter').dispatchEvent(new KeyboardEvent('keydown', { 'key': 'ArrowDown' }));
            }
            idx = snufilter.indexOf(' ');
            if (idx == -1) idx = snufilter.length;
            shortcut = snufilter.slice(0, idx).toLowerCase();
            query = snufilter.slice(idx + 1).replace(/ .*/, '');;
            targeturl = (snuslashcommands[shortcut].url || "");
        }

        targeturl = snuResolveVariables(targeturl).variableString;

        var switchText = '<br /> Switches:<br />';


        if ((targeturl.includes("sysparm_query=") || !snuslashcommands.hasOwnProperty(shortcut)) && snuOperators.some(opp => (query + (e.key.length == 1 ? e.key : "")).includes(opp))) { //detect encodedquery and replace if found
            let encodedQ = query.split('-')[0]; //encodedquery should be first, switches should work #460
            targeturl = targeturl.replace(/sysparm_query=(.*)/g, "sysparm_query=" + encodeURIComponent(encodedQ) + (e.key.length == 1 ? e.key : ""));
            switchText = '<br />Encodedquery detected<br /><br /><br /> Switches:<br />';
        }


        if (targeturl.includes('sysparm_query=') || originalShortcut.startsWith("-")) {
            if (originalShortcut.startsWith("-")) query = shortcut;
            var extraParams = "";
            var unusedSwitches = Object.assign({}, snuslashswitches);
            var switches = (query + thisKey).match(/\-([a-z0-9]*)(\s|$)/g);
            var linkSwitch = false; //determine if this is a switch that converts the entire hyperlink
            if (switches) {
                Object.entries(switches).forEach(([key, val]) => {
                    var prop = val.replace(/\s|\-/g, '');
                    if (snuslashswitches.hasOwnProperty(prop) && !linkSwitch) {
                        var switchValue = snuslashswitches[prop].value;
                        var tableName = targeturl.split("_list.do")[0] || '';
                        if (!tableName){
                            var gsft = (document.querySelector("#gsft_main") || document.querySelector("[component-id]")?.shadowRoot.querySelector("#gsft_main"));
                            var doc = gsft ? gsft.contentWindow : window;
                            if (typeof doc.GlideList2 != 'undefined') tableName = doc.document.querySelector('#sys_target').value;
                            if (typeof doc.g_form != 'undefined') tableName =  g_form.getTableName();
                        }
                        if (!tableName) tableName = '{}';
                        
                        if (snuslashswitchesvalueoverwrites.hasOwnProperty(`${prop}.${tableName}`)){
                            switchValue = snuslashswitchesvalueoverwrites[`${prop}.${tableName}`];
                        }
                        query = query.replace(val, "");
                        if (snuslashswitches[prop].type == "link") {
                            targeturl = switchValue.replace(/\$0/g, tableName);
                            targeturl = targeturl.replace(/\$sysid/, mySysId);
                            targeturl = snuResolveVariables(targeturl).variableString;
                            linkSwitch = true;
                            unusedSwitches = {};
                            switchText = '<br /> Switches:<br />'; //reset switchtext
                        }
                        else if (snuslashswitches[prop].type == "prepend") {
                            targeturl = switchValue + targeturl;
                        }
                        else if (switchValue.startsWith("^")) {
                            targeturl += switchValue;
                        }
                        else {
                            extraParams += switchValue;
                        }
                        switchText += "<div class='cmdlabel'>-" + prop + ": " + snuslashswitches[prop].description + '</div>';
                        delete unusedSwitches[prop];
                    }
                });
                targeturl += extraParams;
            }

            Object.entries(unusedSwitches).forEach(([key, val]) => {
                switchText += "<div class='cmdlabel' style='color:#777777'>-" + key + ": " + val.description + '</div>';
            });

        }
        query = query.trim();


        targeturl = snuResolve$(targeturl, query, e);
        if (e.key == 'ArrowRight' || (e.key == 'Enter' && inlineOnly && !(e.ctrlKey || e.metaKey))) {
            snuSlashLog(true);
            snuGetDirectLinks(targeturl, shortcut);
        }
        else if (e.key == 'Enter') {
            snuSlashLog(true);
            shortcut = shortcut.replace(/\*/g, '');
            snufilter = snufilter.replace(/\*/g, '');
            idx = (snufilter.indexOf(' ') == -1) ? snufilter.length : snufilter.indexOf(' ');
            query = snufilter.slice(idx + 1);

            // if (['nav', 'fav', 'hist'].includes(shortcut)) { //I think this can/should be removed.
            //     e.preventDefault();
            //     return;
            // }
            if (shortcut.replace(/['" ]+/g, '').match(/^[0-9a-f]{32}$/) != null || shortcut == "sysid") {//is a sys_id
                var sysid = (shortcut.replace(/['" ]+/g, '').length == 32) ? shortcut.replace(/['" ]+/g, '') : query;
                if (sysid.length != 32) return;
                snuSearchSysIdTables(sysid);
                //snuSlashCommandHide();
                return;
            }
            else if (/.*_([0-9a-fA-F]{32})$/.test(shortcut)) {//table_name_sysid pattern
                const result = shortcut.split(/_(?=[0-9a-fA-F]{32}$)/);
                window.open(result[0] + ".do?sys_id=" + result[1], '_blank');
                return;
            }
            else if (shortcut == "help") {

                var event = new CustomEvent(
                    "snutils-event",
                    {
                        detail: {
                            event: "openfile",
                            command: "welcome.html"
                        }
                    }
                );
                document.dispatchEvent(event);
                snuSlashCommandHide();
                return;
            }
            else if (shortcut == "sa") {
                snuGetLastScopes(query);
                return;
            }
            else if (shortcut == "cls") {
                snuClearLocalStorage();
                return;
            }
            else if (shortcut == "rnd") {
                snuFillFields(query);
                return;
            }
            else if (shortcut == "imp") {
                e.preventDefault();
                snuGetUsersForImpersonate(query);
                return;
            }
            else if (shortcut == "itt") {
                e.preventDefault();
                snuInstanceTagToggle();
                snuSlashCommandHide();
                return;
            }
            else if (shortcut == "ppt") {
                e.preventDefault();
                snuNextManager.linkPickers(0);
                snuSlashCommandHide();
                return;
            }
            else if (shortcut == "token") {
                snuPostRequestToScriptSync();
                snuSlashCommandInfoText("Trying to send current token to VS Code<br />", false);
                snuSlashCommandHide();
                return;
            }
            else if (shortcut == "debug") {
                if (typeof window.top.launchScriptDebugger != "undefined")
                    window.top.launchScriptDebugger();
                else 
                    snuSlashCommandInfoText("Cannot start debugger from here.");
                return;
            }
            else if (shortcut == "clearbp") {
                snuRemoveBreakpoints();
                return;
            }
            else if (shortcut == "code") {

                var data = {};
                data.instance = window.location.host.split('.')[0];
                data.url = window.location.origin;
                data.g_ck = g_ck;
                data.query = query;
                var event = new CustomEvent(
                    "snutils-event",
                    {
                        detail: {
                            event: "codesearch",
                            command: data
                        }
                    }
                );
                window.top.document.dispatchEvent(event);
                snuSlashCommandHide();
                return;
            }
            else if (shortcut == "vd") {
                let data = {};
                let vars = snuResolveVariables("");
                
                if (vars.tableName && vars.sysId){
                    data.tableName = vars.tableName;
                    data.sysId = vars.sysId;
                    data.instance = window.location.host.split('.')[0];
                    data.url = window.location.origin;
                    data.g_ck = g_ck;
                    let event = new CustomEvent(
                        "snutils-event",
                        {
                            detail: {
                                event: "viewdata",
                                command: data
                            }
                        }
                    );
                    window.top.document.dispatchEvent(event);
                    snuSlashCommandHide();
                }
                else{
                    snuSlashCommandInfoText("No table name and sys_id found...",false)
                }
                return;
            }
            else if (shortcut == "copycells" || shortcut == "copycolumn") {
                snuCopySelectedCellValues(query, shortcut);
                snuSlashCommandHide();
                if (shortcut == "copycells" && !query) {
                    //snuSlashCommandInfoText("You can now try CTRL-C / CMD-C instead of the slashcommand", false);
                }
                return;
            }
            else if (shortcut == "s2") {
                if (typeof snuS2Ify != 'undefined') snuS2Ify();
                snuSlashCommandHide();
                return;
            }
            else if (shortcut == "pop") {
                var event = new CustomEvent(
                    "snutils-event",
                    {
                        detail: {
                            event: "pop",
                            command: ""
                        }
                    }
                );
                window.top.document.dispatchEvent(event);
                snuSlashCommandHide();
                return;
            }
            else if (shortcut == "elev") {
                snuElevate(query);
                return
            }
            else if (shortcut == "env") {
                if (query) {
                    // this allows logic to work with on-premise instances as well
                    if (query.indexOf('.') === -1) query += '.service-now.com';
                    thisUrl = thisUrl.replace(thisHost, query);
                }
                if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                    e.preventDefault();
                    window.location = thisUrl;
                }
                else {
                    window.open(thisUrl, '_blank');
                    snuSlashCommandHide();
                }
                return;
            }
            else if (['diff1', 'diff2'].includes(shortcut)) {
                snuDiffXml(shortcut)
                return;
            }
            else if (shortcut == 'diffenv') {
                if (query.length >= 2) {
                    snuDiffXml('diff1');
                    setTimeout(() => {
                        snuDiffXml('diff2', query);
                    }, 1400)
                }
                return;
            }
            else if (shortcut === 'xmlsrc') {
                if (typeof g_form == 'undefined') {
                    //snuShowAlert("No form found","warning",2000)
                    snuSlashCommandHide();
                    return;
                }
                // prefix URL with 'view-source:' so that browsers are forced to show the actual XML
                // some addons (on Firefox at least) break the XML style when not viewed in Source
                thisUrl = 'view-source:' + thisOrigin + '/' + g_form.getTableName() + '.do?XML=&' +
                    'sys_id=' + g_form.getUniqueValue() + '&sys_target=';
                if (query)
                    thisUrl += query;

                var event = new CustomEvent(
                    "snutils-event",
                    {
                        detail: {
                            event: "viewxml",
                            command: thisUrl
                        }
                    }
                );
                window.top.document.dispatchEvent(event);
                snuSlashCommandHide();
                return;
            }
            else if (shortcut == "tn") {
                var iframes = window.top.document.querySelectorAll("iframe");
                if (!iframes.length && document.querySelector("[global-navigation-config]")) //try to find iframe in case of polaris
                    iframes = document.querySelector("[global-navigation-config]").shadowRoot.querySelectorAll("iframe");

                iframes.forEach((iframe) => {
                    if (typeof iframe.contentWindow.snuAddTechnicalNames != 'undefined')
                        iframe.contentWindow.snuAddTechnicalNames();
                });
                snuAddTechnicalNames();

                window.top.document.getElementById('snufilter').value = '';
                snuSlashCommandHide();
                return;
            }
            else if (shortcut.startsWith("-")) {
                var gsft = (document.querySelector("#gsft_main") || document.querySelector("[component-id]")?.shadowRoot.querySelector("#gsft_main"));
                var doc = gsft ? gsft.contentWindow : window;
                if (typeof doc.GlideList2 != 'undefined') {
                    var qry = doc.GlideList2.get(doc.document.querySelector('#sys_target')?.value);
                    if (typeof qry != 'undefined') {
                        if (targeturl.includes("{}") || linkSwitch) {
                            targeturl = targeturl.replace('{}', qry.getTableName());
                            if (!targeturl.includes("snurandom=true")) window.open(targeturl, '_blank');
                        }
                        else if (targeturl.startsWith("&")) {
                            var myurl = doc.location.href
                            if (targeturl.startsWith("&sysparm_group_sort=COUNT")) {
                                myurl = myurl.replace("&sysparm_group_sort=COUNTDESC", "").replace("&sysparm_group_sort=COUNT", "");
                            }
                            doc.location = DOMPurify.sanitize(myurl + targeturl);
                        }
                        else {
                            var newQ = qry.filter.replace(targeturl, "")
                            qry.setFilterAndRefresh(newQ + targeturl);
                            snuSlashCommandHide();
                            return;
                        }
                    }
                }
                if (targeturl.startsWith("&") && typeof doc?.g_form != 'undefined') {
                    doc.location = DOMPurify.sanitize(doc.location.href + targeturl);
                    snuSlashCommandHide();
                    return;
                }
                if (typeof doc.g_form != 'undefined') {
                    if (targeturl.includes("{}")) {
                        targeturl = targeturl.replace('{}', g_form.getTableName());
                    }
                    else if (!linkSwitch){
                        targeturl = "/" + g_form.getTableName() + "_list.do?sysparm_query=" + targeturl;
                    }
                    if (!targeturl.includes("snurandom=true"))
                        window.open(targeturl, '_blank');
                }
                if (!targeturl.includes("snurandom=true")) {
                    snuSlashCommandHide();
                    return;
                }
            }
            else if (shortcut == "uh") {
                var iframes = window.top.document.querySelectorAll("iframe");
                if (!iframes.length && document.querySelector("[global-navigation-config]")) //try to find iframe in case of polaris
                    iframes = document.querySelector("[global-navigation-config]").shadowRoot.querySelectorAll("iframe");

                iframes.forEach((iframe) => {
                    if (typeof iframe.contentWindow.unhideFields != 'undefined')
                        iframe.contentWindow.unhideFields();
                });
                unhideFields();
                window.top.document.getElementById('snufilter').value = '';
                snuSlashCommandHide();
                return;
            }
            else if (shortcut == "unimp") {
                e.preventDefault();
                var impersonating = snuImpersonater();
                if (impersonating) {
                    snuImpersonate(impersonating);
                    return;
                } else {
                    snuSlashCommandInfoText("You are not impersonating anyone", false);
                }
            }
            else if (shortcut === "lang") {
                if (query.length !== 2) {
                  snuSlashCommandInfoText("Please provide a 2 character language code like 'en'", false);
                  return;
                }
                const headers = {
                  "Accept": "application/json, text/plain, */*",
                  "Cache-Control": "no-cache",
                  "Content-Type": "application/json;charset=UTF-8",
                  "X-UserToken": g_ck || undefined,
                  "X-WantSessionNotificationMessages": true
                };
                fetch("/api/now/ui/concoursepicker/language", {
                  method: "PUT",
                  headers,
                  body: JSON.stringify({ "current": query })
                }).then(response => {
                  if (response.ok) location.reload();
                });
                return;
            }              
            else if (!snuslashcommands.hasOwnProperty(shortcut)) {

                var inIFrame = (shortcut == snufilter.toLowerCase().slice(0, idx) && sameWindow)
                if (e.target.className == "snutils") inIFrame = false;

                if (shortcut.includes('.do')) {
                    if (inIFrame) {
                        (document.querySelector("#gsft_main") || document.querySelector("[component-id]").shadowRoot.querySelector("#gsft_main")).src = shortcut;
                    }
                    else {
                        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                            e.preventDefault();
                            window.location = shortcut;
                        }
                        else {
                            window.open(shortcut, '_blank');
                        }
                    }
                    snuSlashCommandHide();
                    return;
                }
                else if (shortcut.length > 4 ) { //try to open table list if shortcut nnot defined and 5+ charaters
                    
                    var url = 'text_search_exact_match.do?sysparm_search=' + snufilter;
                    if (shortcut.includes('_'))
                        url = shortcut + "_list.do?sysparm_filter_pinned=true&sysparm_query=" + query;

                    if (inIFrame) {
                        (document.querySelector("#gsft_main") || document.querySelector("[component-id]").shadowRoot.querySelector("#gsft_main")).src = url;
                    }
                    else {
                        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                            e.preventDefault();
                            window.location = url;
                        }
                        else {
                            window.open(url, '_blank');
                        }
                    }
                    snuSlashCommandHide();
                    return;
                }
                else {
                    //snuShowAlert("Shortcut not defined: /" + shortcut, "warning");
                    return;
                }
            }

            var inIFrame = !targeturl.startsWith("http") && !targeturl.startsWith("/") && sameWindow;
            if (e.target.className == "snutils") inIFrame = false;
            if (targeturl.includes("snurandom=true")) {
                let searchParams = new URLSearchParams(targeturl.split("?")[1]);
                let q = searchParams.get("sysparm_query") || "";
                let tableName = targeturl.split("_list.do")[0] || "notable";
                targeturl = targeturl.substring(8)
                snuGetRandomRecord(tableName, q, false, res => {
                    targeturl = tableName + ".do?sys_id=" + res;
                    if (inIFrame){
                        var nxtHdr = window.querySelectorShadowDom?.querySelectorDeep("sn-polaris-header");
                        if (nxtHdr){ //next experience
                            nxtHdr.dispatch("NAV_ITEM_SELECTED", {
                                "params": {
                                    "target": targeturl
                                },
                                "route": "classic",
                                "context": {
                                    "experienceName": "Unified Navigation App",
                                    "path": "now/nav/ui"
                                }
                            });
        
                        }
                        else document.querySelector("#gsft_main").src = DOMPurify.sanitize(targeturl);
                    }
                    else
                        window.open(targeturl, '_blank');
                    snuSlashCommandHide();
                })
            }
            else if (inIFrame) {
                var nxtHdr = window.querySelectorShadowDom?.querySelectorDeep("sn-polaris-header");
                if (nxtHdr){ //next experience
                    if (!targeturl.startsWith("javascript:")){
                        nxtHdr.dispatch("NAV_ITEM_SELECTED", {
                            "params": {
                                "target": targeturl
                            },
                            "route": "classic",
                            "context": {
                                "experienceName": "Unified Navigation App",
                                "path": "now/nav/ui"
                            }
                        });
                    }
                    else {
                        window.location = targeturl;
                    }


                }
                else {
                    var gsft = window.top.document.querySelector("#gsft_main");
                    if (gsft) window.top.document.querySelector("#gsft_main").src = DOMPurify.sanitize(targeturl);
                    
                    else {
                        if (window.location.pathname.startsWith("/images") && !targeturl.startsWith("/")) 
                        targeturl = "/" + targeturl; //ui15 adds /images to url
                        window.top.window.open(targeturl, '_blank');
                    }
                }
            }
            else {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                    e.preventDefault();
                    window.location = DOMPurify.sanitize(targeturl);
                }
                else {

                    if (targeturl.startsWith("javascript:")) {
                        window.location = DOMPurify.sanitize(targeturl);
                    }
                    else if (!targeturl.startsWith("//")) {
                        if ((new Date()).getTime() - snuLastOpened > 500) {
                            snuLastOpened = (new Date()).getTime();
                            if (window.location.pathname.startsWith("/images") && !targeturl.startsWith("/")) 
                                targeturl = "/" + targeturl;//ui15 adds /images to url
                            
                            setTimeout(() => { //this prevents opening in a new window. (we wnt a new tab)
                                window.open(targeturl, '_blank');
                            }, 1);
                                
                        }
                        snuLastOpened = (new Date()).getTime();

                    }
                }
            }
            snuSlashCommandHide();
        }
        else {
            if (e.key == " ") idx = shortcut.length;
            else if (e.key == "Backspace") { idx = -1; snuIndex = 0; snuSlashLogIndex = -1};
            snuSlashCommandShowHints(originalShortcut, selectFirst, snufilter + thisKey, switchText, e);
        }
        if (shortcut == 'm') { 
            snuDoSlashNavigatorSearch(query + thisKeyWithSpace);
        }

    });

    window.top.document.getElementById('snufilter').addEventListener('paste', function (e) {
        setTimeout(function () {
            obj = { 'key': 'ArrowRight' };
            window.top.document.getElementById('snufilter').dispatchEvent(new KeyboardEvent('keydown', obj));
        }, 30);

    });
}

function snuSlashCommandShowHints(shortcut, selectFirst, snufilter, switchText, e) {
    if (!["ArrowDown", "ArrowUp", "Enter", "Tab", " "].includes(e.key) || snuIndex > snuPropertyNames.length) {
        snuIndex = 0;
    }
    if ((e.ctrlKey || e.metaKey) && e.key == 'v' && shortcut == 'v') {
        //asume a sys_id when pasting for correct 'autocomplete'
        shortcut = "00000000000000000000000000000000";

        setTimeout(()=> { //this forces a refresh of the hints
            window.top.document.getElementById('snufilter').dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Shift' }));
        },150)

    }

    var startswith = true;
    if (shortcut.includes('*')) { //wildcardsearch when includes *
        shortcut = shortcut.replace(/\*/g, '');
        startswith = false;
    }

    var fltr = window.top.document.getElementById('snufilter');

    snuPropertyNames = Object.keys(snuslashcommands).filter(propertyName => {
        shortcut = shortcut.trim();
        if (startswith)
            return propertyName == shortcut || (propertyName.startsWith(shortcut) && !fltr.value.includes(" ") && e.code != "Space")
        return propertyName.includes(shortcut);
    }).sort(function (a, b) {
        return (snuslashcommands[a].order || 100) - (snuslashcommands[b].order || 100);
    });

    // if (snufilter.trim().split(' ').length > 1) {
    //     snuPropertyNames = [shortcut];
    // }

    if (snuPropertyNames.length > 0 && selectFirst && !snuPropertyNames.includes(shortcut)) { //select first hit when tap or space pressed
        if (e) e.preventDefault();
        shortcut = snuPropertyNames[snuIndex];
        snuPropertyNames = [snuPropertyNames[snuIndex]];
        if (!fltr.value.includes(" ")) {
            fltr.value = "/" + shortcut + ' ';
        }
    }

    var html = "";
    var lastfavorite = 0;
    var arrDigits = [];
    for (i = 0; i < snuPropertyNames.length && i < snuMaxHints; i++) {
        var cssclass = (snuIndex == i) ? 'active' : '';
        var snuPropertyName = snuPropertyNames[i] || '';
        var lbl = ((snuslashcommands[snuPropertyName]?.fields || "") ? "<span>⇲ </span>" : "") + snuEncodeHtml(snuslashcommands[snuPropertyName]?.hint);
        html += `<li id='cmd${snuPropertyName}' data-index='${i}' class='cmdfilter ${cssclass} nth${(snuslashcommands[snuPropertyName]?.order || 100)}' >
                 <span class='cmdkey'>/${snuPropertyName}</span>
                 <span class='cmdlabel'>${lbl}</span></li>`;
        const uniqueDigits = [...new Set(snuPropertyName.match(/\d/g))].map(Number); //get unique digits from the slash command, ie [1] for the /diff1 command
        arrDigits = [...new Set([...arrDigits, ...uniqueDigits])]; //merge unique digits from all slash commands (unlikely to find many)         

        if (fltr.value.includes(" ")) {
            break;
        }
    }

    if (snuPropertyNames.length > snuMaxHints) {
        html += "<li class='cmdexpand' data-shortcut='" + shortcut + "' ><span  class='cmdkey'>+" + (snuPropertyNames.length - snuMaxHints) + "</span> ▼ show all</span></li>";
    }
    else if (!html && shortcut.replace(/['" ]+/g, '').length == 32) {
        html += "<li class='cmdfilter' ><span class='cmdfilter cmdkey'>/sys_id</span> " +
            "<span class='cmdlabel'>Instance search</span></li>"
    }
    else if (!html && /.*_([0-9a-fA-F]{32})$/.test(shortcut)) {
        const result = shortcut.split(/_(?=[0-9a-fA-F]{32}$)/);
        html += "<li class='cmdfilter' ><span class='cmdfilter cmdkey'>/" + result[0] + "</span> " +
            "<span class='cmdlabel'>Open record " + result[1] + "</span></li>"
    }
    else if (!html && shortcut.includes(".do")) {
        html += "<li class='cmdfilter' ><span class='cmdkey'>/" + shortcut + "</span> " +
            "<span class='cmdlabel'>Direct navigation</span></li>"
    }
    if (!html && shortcut.length > 5) {
        // html += "<li class='cmdfilter' ><span class='cmdkey'>/" + shortcut + "</span> " +
        //     "<span class='cmdlabel'>Table search &lt;encodedquery&gt; (hit ► to search tables)</span></li>"
    }
    if (snuPropertyNames.length == 0 && snufilter.length > 3) {
        html += "<li class='cmdfilter' ><span class='cmdfilter cmdkey'>/search</span> " +
                "<span class='cmdlabel'>Search for: " + snufilter + "</span></li>";
    }
    switchText = (switchText.length > 25) ? switchText : ''; //only if string > 25 chars;
    if (!html)
    console.log(html)
    window.top.document.getElementById('snuhelper').innerHTML = DOMPurify.sanitize(html);
    window.top.document.getElementById('snudirectlinks').innerHTML = DOMPurify.sanitize('');
    window.top.document.getElementById('snuswitches').innerHTML = DOMPurify.sanitize(switchText);
    window.top.document.getElementById('snuslashcount').innerHTML = DOMPurify.sanitize(snuPropertyNames.length + "/" + Object.keys(snuslashcommands).length);
    try {
        window.top.document.querySelector('li.nth100').style['margin-top'] = '7px'; //add a visual clue between favorites
    } catch (e) { };

    window.top.document.querySelectorAll("#snuhelper li.cmdfilter").forEach(function (elm) { elm.addEventListener("click", setSnuFilter) });
    window.top.document.querySelectorAll("#snuhelper li.cmdexpand").forEach(function (elm) { elm.addEventListener("click", snuExpandHints) });

    if (snusettings.slashnavigatorsearch && snuPropertyNames.length <= 3 && switchText.length <=25)
        snuDoSlashNavigatorSearch(shortcut + ' ' + snufilter, arrDigits);

}

function setSnuFilter(ev) {
    var slshcmd = this.querySelector('.cmdkey').innerText;
    if (!window.top.document.getElementById('snufilter').value.startsWith(slshcmd)) {
        window.top.document.getElementById('snufilter').focus();
        window.top.document.getElementById('snufilter').value = slshcmd + ' ';
        snuIndex = parseInt(this.dataset.index || 0);
    }
    else {
        obj = { 'key': 'Enter' };
        if (event.ctrlKey || event.metaKey) obj.ctrlKey = true;
        window.top.document.getElementById('snufilter').dispatchEvent(new KeyboardEvent('keydown', obj));
    }
}

function snuDiffXml(shortcut, instance = '') {
    var gsft = (document.querySelector("#gsft_main") || document.querySelector("[component-id]")?.shadowRoot.querySelector("#gsft_main"));
    var doc = gsft ? gsft.contentWindow : window;

    if (!doc.g_form) {
        snuSlashCommandInfoText('Diff only works in classic forms',false);
        return;
    }

    instance = instance.trim();
    let origin = window.location.origin;
    let host = window.location.host;

    // this allows logic to work with on-premise instances as well
    let newinstance = instance;
    if (!instance.includes('.')) {
        newinstance += '.service-now.com';
    }
    if (instance.length > 3) {
        origin = origin.replace(window.location.host, newinstance);
        host = host.replace(window.location.host, newinstance);
    }

    let thisUrl = `${origin}/${doc.g_form.getTableName()}.do?sys_target=&XML=&sys_id=${doc.g_form.getUniqueValue()}`; //adding sys_target returns display values in XML
    let delay = 0;

    if (shortcut == 'diff1') {
        delay = 900;
        let event = new CustomEvent(
            "snutils-event",
            {
                detail: {
                    event: "opencodediff"
                }
            }
        );
        window.top.document.dispatchEvent(event);
    }

    setTimeout(function () {
        let data = {
            url: thisUrl,
            tableName: doc.g_form.getTableName(),
            displayValue: doc.g_form.getDisplayValue(),
            sysId: doc.g_form.getUniqueValue(),
            host: host
        };
        let event = new CustomEvent(
            "snutils-event", {
            detail: {
                event: "fetch" + shortcut,
                command: data
            }
        }
        );
        window.top.document.dispatchEvent(event);
    }, delay);




    snuSlashCommandHide();
    return;
}


function snuResolve$(targeturl, query, e) {
    targeturl = targeturl.replace(/\$0/g, query + (e.key.length == 1 ? e.key : ""));
    if (query.split(" ").length > 0) {  //replace $1,$2 for Xth word in string
        var queryArr = query.split(" ");
        for (var i = 0; i <= queryArr.length; i++) {
            var re = new RegExp("\\$" + (i + 1), "g");
            targeturl = targeturl.replace(re, queryArr[i] || "");
        }
    }
    return targeturl;
}

function snuResolveVariables(variableString){

    let gsft = (document.querySelector("#gsft_main") || document.querySelector("[component-id]")?.shadowRoot.querySelector("#gsft_main"));
    let tableName = '';
    let sysId = '';
    let encodedQuery = '';
    let doc = gsft ? gsft.contentWindow : window;
    if (typeof doc.g_form !== 'undefined') { //get sysid and tablename from classic form
        tableName = doc.g_form.getTableName();
        sysId = doc.g_form.getUniqueValue();
        variableString = variableString.replace(/\$table/g, tableName);
        variableString = variableString.replace(/\$sysid/g, sysId);

        encodedQuery = doc.g_form.getParameter('sysparm_query') || doc.g_form.getParameter('sysparm_record_list');
        variableString = variableString.replace(/\$encodedquery/g, encodedQuery);
    }
    else if (location.pathname == "/sys_report_template.do"){ //report
        let searchParams = new URLSearchParams(window.location.search);
        tableName = "sys_report";
        sysId =(searchParams.get('jvar_report_id') || '').replace(/[^a-f0-9-_]/g, '');
        variableString = variableString.replace(/\$table/g,tableName);
        variableString = variableString.replace(/\$sysid/g,sysId);
    }
    else if (typeof doc.GlideList2 !== 'undefined') { //get tablename and encodequery from classic form
        if (typeof doc.g_form == 'undefined') {
            let listName = doc.document.querySelector('#sys_target')?.value;
            if (listName){
                let qry = doc.GlideList2.get(listName) || {};
                tableName = qry?.tableName || '';
                encodedQuery =  qry?.filter || '';
                variableString = variableString.replace(/\$table/g, tableName);
                variableString = variableString.replace(/\$encodedquery/g,encodedQuery);
            }
        }
    }
    else if (location.pathname == "/$flow-designer.do"){ //flowdesigner
        if (location.hash.startsWith("#/flow-designer/")){
            tableName = "sys_hub_flow";
            sysId =  snuFindReact(document.querySelector("#flow-editor"))?.props?.params?.id?.substring(0,32);
        }
        else if (location.hash.startsWith("#/sub-flow-designer/")){
            tableName = "sys_hub_flow";
            sysId =  snuFindReact(document.querySelector("#flow-editor"))?.props?.params?.id?.substring(0,32);
        }
        else if (location.hash.startsWith("#/action-designer/")){
            tableName = "sys_hub_action_type_definition";
            sysId =  snuFindReact(document.querySelector("#action-editor"))?.props?.editorState?.actionId?.substring(0,32);
        }
        tableName = tableName.replace(/[^a-z0-9-_]/g,'');
        sysId = sysId.replace(/[^a-f0-9-_]/g,'');
        variableString = variableString.replace(/\$table/g,tableName);
        variableString = variableString.replace(/\$sysid/g,sysId);
    }
    else if (location.pathname == "/$conversation-builder.do"){ //flowdesigner
        tableName = "sys_cb_topic";
        var hashParts = location.hash.split("/");
        sysId = hashParts.length > 2 ? hashParts[2] : null;
        variableString = variableString.replace(/\$table/g,tableName);
        variableString = variableString.replace(/\$sysid/g,sysId);
    }
    else { ///get sysid and tablename from portal or workspace
        let searchParams = new URLSearchParams(window.location.search)
        tableName = (searchParams.get('table') || searchParams.get('id') || '').replace(/[^a-z0-9-_]/g, '');
        sysId = (searchParams.get('sys_id') || '').replace(/[^a-f0-9-_]/g, '');
        if (tableName && sysId) { //portal
            variableString = variableString.replace(/\$table/g, tableName);
            variableString = variableString.replace(/\$sysid/g, sysId);
        }
        else { //workspace
            let parts = window.location.pathname.split("/");
            let idx = parts.indexOf("sub") // show subrecord if available
            if (idx != -1) parts = parts.slice(idx);
            idx = parts.indexOf("record")
            if (idx > -1 && parts.length >= idx + 2) {
                tableName = parts[idx + 1] || '';
                sysId = parts[idx + 2] || '';
            }
            variableString = variableString.replace(/\$table/g, tableName);
            variableString = variableString.replace(/\$sysid/g, sysId);
        }
    }
    rtrn = {
        "variableString" : variableString,
        "tableName" : tableName,
        "sysId" : sysId,
        "encodedQuery" : encodedQuery
    }
    return rtrn;
}

function snuExpandHints(shortcut) {
    if (typeof shortcut == "object") shortcut = this.dataset.shortcut;
    shortcut = shortcut || this.dataset.shortcut;
    snuMaxHints = 1000;
    var e = new KeyboardEvent('keypress', { 'key': 'KeyDown' });
    snuSlashCommandShowHints(shortcut, false, '', '', e);
    var elm = window.top.document.getElementById('snufilter');
    elm.focus();
    elm.selectionStart = elm.selectionEnd = elm.value.length;
}

function snuSlashCommandAdd(cmd) {
    var event = new CustomEvent(
        "snutils-event",
        {
            detail: {
                event: "addslashcommand",
                command: cmd
            }
        }
    );
    document.dispatchEvent(event);
    sncWait();
}

function snuSettingsAdded() {
    if (snuSettingsParsed) return;
    snuSettingsParsed = true; //only run once when installed both normal and OnPrem version
    snusettings.nouielements ??= false; //set default values in case property is not set
    snusettings.applybgseditor ??= true;
    snusettings.nopasteimage ??= false;
    snusettings.vsscriptsync ??= true;
    snusettings.codeeditor ??= true;
    snusettings.s2ify ??= true;
    snusettings.highlightdefaultupdateset ??= true;
    snusettings.slashnavigatorsearch ??= true;
    snusettings.slashhistory ??= 50;
    snusettings.addtechnicalnames ??= false;
    snusettings.slashoption ??= 'on';
    snusettings.slashtheme ??= 'dark';
    snusettings.listfields ??= 'sys_updated_on,sys_updated_by,sys_scope,sys_created_on';
    snusettings.slashsswitches ??= '{}';
    snusettings.monacooptions ??= `{ "wordWrap" : "on", "contextmenu" : true }`;
    snusettings.instancetag ??= false;
    
    try { //ignore if not valid json
        let addedslashsswitches = JSON.parse(snusettings.slashsswitches);
        snuslashswitches = {...snuslashswitches, ...addedslashsswitches};
    } catch (ex) { } 


    snuSetShortCuts();

    if (!snusettings.nopasteimage) {
        snuBindPaste(snusettings.nouielements == false);
    }

    if (snusettings.vsscriptsync == true) {
        snuAddFieldSyncButtons();
        snuAddStudioScriptSync();
        snuAddBGScriptButton();
    }
    else if (snusettings.codeeditor == true) {
        snuAddFieldSyncButtons();
    }

    if (snusettings.slashoption != "off") {
        snuAddFilterListener();
        snuSlashCommandAddListener();
    }
    if (snusettings.s2ify) {
        if (typeof snuS2Ify != 'undefined') snuS2Ify();
        if (typeof snuNextManager != 'undefined') snuNextManager.linkPickers(0);
    }
    if (snusettings.nouielements == false) {    
        if (typeof snuAddStudioLink != 'undefined') snuAddStudioLink();
        if (typeof snuAddDblClickToPin != 'undefined') snuAddDblClickToPin();
        snuAddStudioSearch();
        snuAddSgStudioPlatformLink();
        snuEnhanceNotFound();
        snuPaFormulaLinks();
        snuRemoveLinkLess();
        snuTableCollectionLink();
        snuNewFromPopupToTab();
        snuCreateHyperLinkForGlideLists();
        mouseEnterToConvertToHyperlink();
        snuAddGroupSortIcon();
        snuAddListLinks();
        snuAddFormDesignScopeChange();
        snuAddPersonaliseListHandler();
        snuAddLinkToCachDo();
        snuAddInfoButton();
        snuAddSwitchToApplication();
        snuOpenWorkflowLink();
        snuEnterToFilterSlushBucket();
        snuHyperlinkifyWorkNotes();
        snuEasifyAdvancedFilter();
    }

    if (snusettings.hasOwnProperty("slashcommands")) {
        try {
            var customCommands = JSON.parse(snusettings.slashcommands || "{}");
            Object.keys(customCommands).forEach(function (key) {
                snuslashcommands[key] = customCommands[key];
            });

            var sco = {}; //order the object
            Object.keys(snuslashcommands).sort().forEach(function (key) {
                sco[key] = snuslashcommands[key];
            });
            snuslashcommands = sco;
        }
        catch (e) {
            console.log("error while parsing slashcommands:" + snusettings.slashcommands + " " + e)
        }
    }

    if (snusettings.addtechnicalnames == true) {
        snuAddTechnicalNames();
        setTimeout(snuAddTechnicalNamesPortal, 5000);
    }

    if (snusettings.monacooptions){
        try{
            if (typeof GlideEditorMonaco !== 'undefined'){
                let monacooptions = JSON.parse(snusettings.monacooptions);
                let editors = GlideEditorMonaco.getAll()
                editors.forEach(editor => {
                    editor.editor.onMouseDown(function (e) { //Prevent showing the Monaco contextmenu when there is a ServiceNow context menu to show
                        if (e?.target?.element?.classList?.contains("discoverable-text")){ //this class indicates there is a ServiceNow menu
                            let showMonacoContextMenu =  (editor.editor.getRawOptions().contextmenu);
                            if (showMonacoContextMenu) {
                                let selection = editor.editor.getModel().getValueInRange(editor.editor.getSelection());
                                if (!selection){ //if no selection, show the ServiceNow contextmenu
                                    editor.editor.updateOptions({"contextmenu" : false});
                                    setTimeout(() => { //revert back to true after 200ms
                                        editor.editor.updateOptions({"contextmenu" : true});
                                    }, 200);
                                }
                            }
                        };
                    });

                    editor.editor.updateOptions(monacooptions);

                    editor.editor.addAction({
                        id: "snutils",
                        label: "Added by SN Utils...",
                        contextMenuGroupId: "2_info",
                        contextMenuOrder : 0,
                        run: () => {
                            snuSlashCommandInfoText('Contextmenu enabled by SN Utils<br/>Ideas to add options here, give me feedback!',false);
                        },
                    });
                    editor.editor.addAction({
                        id: "wordwrap",
                        label: "Toggle Word wrap",
                        keybindings: [monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyW],
                        contextMenuGroupId: "2_info",
                        contextMenuOrder : 1,
                        run: () => {
                            let ww =  (editor.editor.getRawOptions().wordWrap == "off") ? "on" : "off";
                            editor.editor.updateOptions({"wordWrap" : ww});
                        },
                    });
                    editor.editor.addAction({
                        id: "contextmenu",
                        label: "Toggle Monaco context Menu",
                        keybindings: [monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyM],
                        contextMenuGroupId: "2_info",
                        contextMenuOrder : 2,
                        run: () => {
                            let cm =  !(editor.editor.getRawOptions().contextmenu);
                            editor.editor.updateOptions({"contextmenu" : cm});
                        },
                    });
                    editor.editor.addAction({
                        id: "openbg",
                        label: "Open in BG script...",
                        contextMenuGroupId: "2_info",
                        precondition: "editorHasSelection",
                        contextMenuOrder : 3,
                        run: (editor) => {
                            let selection = editor.getModel().getValueInRange(editor.getSelection());
                            window.open('/sys.scripts.do?content=' + encodeURIComponent(selection));
                        }
                    })
                    editor.editor.addAction({
                        id: "codesearch",
                        label: "Code search...",
                        contextMenuGroupId: "2_info",
                        precondition: "editorHasSelection",
                        contextMenuOrder : 4,
                        run: (editor) => {
                            let selection = editor.getModel().getValueInRange(editor.getSelection());
                            snuSlashCommandShow('/code ' + selection,true);
                        }
                    })
                    editor.editor.addAction({
                        id: "google",
                        label: "Google search...",
                        contextMenuGroupId: "2_info",
                        precondition: "editorHasSelection",
                        contextMenuOrder : 5,
                        run: (editor) => {
                            let selection = editor.getModel().getValueInRange(editor.getSelection());
                            window.open('https://www.google.com/search?q=' + selection);
                        }
                    })


                })
            }
        }catch(ex){};
    }
    if (snusettings.instancetag){ 
        if (window.self === window.top){ //ony parent window
            let script = document.createElement('script');
            script.src = snusettings.extensionUrl + 'js/instancetag.js';
            script.async = false; // This is optional: set to true for asynchronous loading
            document.head.appendChild(script);
        }
    }
}

function snuCreateHyperLinkForGlideLists() {
    try {
        document.querySelectorAll('div[type=glide_list]').forEach(function (elm) {
            var field = elm.id.split('.')[2];
            var fieldId = elm.id.replace('label.', '');
            var isReadOnly = (g_form.getElement(field).getAttribute("class") || "").includes("readonly") || g_form.getElement(field).getAttribute("writeaccess") == "false";
            var table = g_form.getGlideUIElement(field).reference;
            var hasReferenceTable = table && table !== 'null';
            if (!hasReferenceTable) return; // if there's no Reference Table, there's no use adding links, values are to be used as-is 
            elm.nextSibling.querySelector('p').style.display = 'inline'; //polaris fix
            var labels = elm.nextSibling.querySelector('p').innerText.split(', ');
            var values = elm.nextSibling.querySelector('input[type=hidden]').value.split(',');
            if (labels.length != values.length) return; //not a reliable match
            var links = [];
            var sysIDRegex = /[0-9a-f]{32}/i;
            for (var i = 0; i < labels.length; i++) {
                if (values[i] != "") {
                    var rmvBtn = (!isReadOnly) ? `<span style='white-space: nowrap' id='${field}-${values[i]}' data-field="${field}" data-remove="false" data-value="${values[i]}" data-fieldid="${fieldId}"><a title='[SN Utils] Remove' class="remove icon icon-cross" href="#" style="font-size:6pt; color:red; padding-right:3px; vertical-align: middle;" aria-hidden="true"></a>` : "<span>";
                    if (hasReferenceTable && sysIDRegex.test(values[i]))
                        links.push(`${rmvBtn}<a href="/${table}.do?sys_id=${values[i]}" target="_blank" />${labels[i]}</a></span>`);
                    else
                        links.push(`${rmvBtn}${labels[i]}</span>`);
                }
            }
            var html = links.join(', ');
            elm.nextSibling.querySelector('p').innerHTML = DOMPurify.sanitize(html, { ADD_ATTR: ['target'] });
            var newElm = elm.nextSibling.querySelector('p')
            newElm.innerHTML = DOMPurify.sanitize(html, { ADD_ATTR: ['target'] });
            Array.from(newElm.querySelectorAll('.remove')).forEach(function (elm) {
                elm.addEventListener('click', snuRemoveFromList);
            });
        })
    } catch (e) { };
}

function snuRemoveFromList() {
    var elm = this.parentElement;
    var val = elm.getAttribute("data-value");
    var fld = elm.getAttribute("data-field");
    var oldArr = g_form.getValue(fld).split(',');
    var newArr = oldArr.filter(item => item !== val);
    g_form.setValue(fld, newArr.join(','));
    setTimeout(snuCreateHyperLinkForGlideLists, 1000);
}

function snuDoubleClickToShowFieldOrReload() {
    if (typeof g_form != 'undefined' || typeof GlideList2 != 'undefined' || typeof SlushBucket != 'undefined') {
        document.addEventListener('dblclick', event => {
            if (event?.target?.classList?.contains('label-text') || event?.target?.parentElement?.classList.contains('label-text') ||
                event?.target?.parentElement?.classList.contains('sc_editor_label')) {
               event.preventDefault();
                
                var elm;

                var formGroup = event.target.closest('div.form-group');
                if (formGroup) {
                    var id = formGroup.getAttribute('id');
                    if (id) {
                        if (id.startsWith('variable_ni.VE') && formGroup.querySelector('div.slushbucket')) {
                            // List Collector is the most tricky because it has a weird value of the 'for' argument.
                            elm = 'ni.' + id.split('.')[1];
                        } else {
                            // Form fields.
                            elm = id.split('.').slice(2).join('.');
                        }
                    }
                }

                // If the element is still not found it can be a catalog item variable.
                if (!elm) {
                    var forLabel = event.target.parentElement.getAttribute('for');
                    if (forLabel) {
                        var temp = forLabel.split('.');
                        if (temp.length == 3) {
                            // Reference, Requested for (same as the Reference but always references the User table) and Masked catalog variables types.
                            elm = temp.slice(1).join('.');
                        } else {
                            // All other types of catalog item variables.
                            elm = temp.join('.');
                        }
                    }
                }

                // Check if the found value is a valid field/variable.
                var glideUIElement = g_form.getGlideUIElement(elm);
                if (!glideUIElement) {
                    return;
                }

                var val = g_form.getValue(elm);
                var options = "";
                g_form.getOptionControl(elm)?.querySelectorAll('option').forEach(opt =>{
                    options += "\n" + opt.value + ": " + (opt.dataset.snuoriginal || opt.innerText) ;
                });
                if (options) options = "\nOptions:" + options;
                if (NOW.user.roles.split(',').includes('admin') || snuImpersonater(document)) { //only allow admin to change fields
                    var newValue = prompt('[SN Utils]\nField Type: ' + glideUIElement.type + '\nField: ' + elm + options + '\nValue:', val);
                    if (newValue !== null)
                        g_form.setValue(elm, newValue);
                } else {
                    alert('[SN Utils]\nField Type: ' + glideUIElement.type + '\nField: ' + elm + options + '\nValue:' + val);
                }
            } else if (event.target.classList.contains('container-fluid') || event.target.classList.contains('navbar_ui_actions')) {
                location.reload();
            } else if (event.target.classList.contains('breadcrumb_container')) {
                //placeholder maybe move breadcrumb doubleclick here
            } else if (event?.target?.classList?.contains('btn-ref')) { //open refernece record
                let field = event?.target.id.split(".").splice(2).join(".");
                if (field){
                    var refKey = g_form.getGlideUIElement(field)?.referenceKey || 'sys_id';
                    window.open(`${event?.target.dataset.form}?sys_id=${g_form.getValue(field)}&sysparm_refkey=${refKey}`);
                }
                else { //maybe a document ID
                    var data = event?.target?.parentElement.dataset;
                    if (data?.sysid && data?.table)
                        window.open(`${data?.table}.do?sys_id=${data?.sysid}`);
                }
            }
            else if (['div', 'li', 'body'].includes(event.target.localName) && !event.target.parentElement.className.includes('monaco')) {
                if (!window?.snusettings?.nouielements) //disable the doubleclick when SN Utils UI elements off
                    snuAddTechnicalNames();
            }
        }, true);
    }
}

//current only implementation is doubleclick label to edit condition field, or open condition in list with CTRL/CMD
function flowDesignerDoubleClick() {
    if (location.pathname != "/$flow-designer.do") return;
    document.addEventListener('dblclick', event => {
        if (angular && event.path.length > 2 &&
            (event.path[2].classList?.contains('form-group') || event.path[2].classList?.contains('content-container'))) {
            let elm = event.path[2].querySelector('.compounds');
            if (elm) {
                let angElm = angular.element(elm).scope().$parent;
                let oldValue = angElm.filterConfig.encodedQuery;
                if (event.ctrlKey || event.metaKey) {
                    window.open(`${angElm.table}_list.do?sysparm_query=${oldValue}&sysparm_filter_pinned=true`);
                } else {
                    let newValue = prompt('[SN Utils]\nCondition table: ' + angElm.table + '\nValue:', oldValue);
                    if (newValue !== null && newValue != oldValue) {
                        angElm.$emit("snfilter:initialize_query", newValue);
                    }
                }
            }
            else {
                snuSlashCommandInfoText('Flow Designer label doubeleclick only implemented for Condition fields', false);
                setTimeout(snuSlashCommandHide, 4000);
            }
        }
        else if (event?.target?.classList?.contains('form-label')) {
            snuSlashCommandInfoText('Flow Designer label doubeleclick only implemented for Condition fields', false);
            setTimeout(snuSlashCommandHide, 4000);
        }
    })
}


function mouseEnterToConvertToHyperlink() {
    if (typeof g_form != 'undefined') {
        document.querySelectorAll('div[type="glide_list"]').forEach(
            div => div.parentElement.addEventListener('mouseenter',
                snuCreateHyperLinkForGlideLists
            ));
    }
}

function snuAddGroupSortIcon() {
    if (location.pathname.includes("_list.do") && location.search.includes("GROUPBY")) {
        var qry = GlideList2.get(document.querySelector('#sys_target')?.value);
        var gb = qry.getGroupBy().replace("GROUPBY", "");
        var elm = document.querySelector(`th[name="${gb}"] a`);
        var descstyle = location.search.includes("sysparm_group_sort=COUNTDESC") ? 'font-weight:bold; color:blue !important' : '';
        var ascstyle = location.search.includes("sysparm_group_sort=COUNT") && !descstyle ? 'font-weight:bold; color:blue !important' : '';
        elm.innerHTML = DOMPurify.sanitize(elm.innerHTML +
            ` <span data-slashcommand='/-gd' style="${descstyle}" class="icon icon-sort-descending snuexeccmd"></span>
          <span data-slashcommand='/-ga' style="${ascstyle}" class="icon icon-sort-ascending snuexeccmd"></span>`);

        jQuery(`th[name="${gb}"] a span.snuexeccmd`).on('click', function (elm) {
            elm.preventDefault();
            snuSlashCommandShow(elm.currentTarget.dataset.slashcommand, 1);
        })

    }
}

function snuAddListLinks() {
    if (["/syslog_list.do","/sys_update_set.do","/sys_update_xml_list.do","/sys_upgrade_history_log_list.do"].includes(location.pathname)) {
        // Supports for 3 different patterns of script ids being present in logs:
        // table_name:sys_id table_name.sys_id table_name_sys_id
        
        document.querySelectorAll('td.vt:not(.snuified)').forEach((tableCell,tableCellIndex) => {
            var patterns = [
                /(([a-z0-9_]+):([a-z0-9]{32}))/gm, // table_name:sys_id
                /(([a-z0-9_]+)\.([a-z0-9]{32})\.([a-z_]+))/gm, // table_name.sys_id.field
                /(([a-z0-9_]+)_([a-z0-9]{32}))/gm, // table_name_sys_id_field
            ];

            patterns.forEach((pattern, idx) => {
                var splitter = [":", ".", "_"][idx];

                var found = tableCell.innerText.match(pattern);
                if(found != null && !tableCell.innerHTML.startsWith("<a")){
                    found.forEach(find => {
                        var segments = find.split(splitter);
                        var table;
                        var sys_id;
                        if(splitter === "_"){
                            /*
                            Given this line: `com.glide.caller.gen.sys_script_include_b0dee9462f231110c30d2ca62799b62d_script.call(Unknown Source)`
                            Pattern will give this regex match: "sys_script_include_fc70ddc629230010fa9bf7f97d737e2e"
                            `segments` looks like this: ['sys', 'script', 'include', 'fc70ddc629230010fa9bf7f97d737e2e']
                            Hence using slice and join to reconstruct the table name
                            */
                            var sys_id_idx = segments.length - 1;
                            sys_id = segments[sys_id_idx];
                            table = segments.slice(0, sys_id_idx).join(splitter);
                        } else {
                            table = segments[0];
                            sys_id = segments[1];
                        }
                        if (table != 'sys_id'){
                            if (!tableCell.parentElement.innerText.includes('DELETE')) {
                                var newHtml = tableCell.innerHTML.replaceAll(
                                    find,
                                    `<a title="Link via SN Utils" target="_blank" href='/${table}.do?sys_id=${sys_id}'>${find} ➚</a>`
                                );
                                tableCell.innerHTML = DOMPurify.sanitize(newHtml, { ADD_ATTR: ["target"] });
                            }
                        }

                    });
                }
            });
            tableCell.classList.add('snuified');
        });

        setTimeout(snuAddListLinks, 3000); // "recursive" call this incase we navigate to next page.
    }
}




//toggle Select2 for Application and updatesetpicker
function snuS2Ify() {

    if (typeof Select2 == 'undefined') return;
    var setOff = jQuery('#application_picker_select').hasClass('select2-offscreen');

    jQuery('#application_picker_select').select2('destroy');
    jQuery('#update_set_picker_select').select2('destroy');
    jQuery('#domain_picker_select_header').select2('destroy');

    if (setOff) return;

    jQuery('#application_picker_select').select2({ 'dropdownAutoWidth': true })
    jQuery('#application_picker_select').on('change', function (e) {
        setTimeout(function () {
            jQuery('#update_set_picker_select').trigger('change.select2');
        }, 5000);
    });

    jQuery('#update_set_picker_select').select2({ 'dropdownAutoWidth': true });
    jQuery('#update_set_picker_select').on('change', function (e) {
        jQuery('#update_set_picker_select').trigger('change.select2');
    });

    jQuery('#domain_picker_select_header').select2({ 'dropdownAutoWidth': true });
    jQuery('#domain_picker_select_header').on('change', function (e) {
        jQuery('#domain_picker_select_header').trigger('change.select2');
    });
}



function snuAddFormDesignScopeChange() {
    if (location.pathname == "/$ng_fd.do") {
        setTimeout(f => {
            if (document.querySelectorAll('dd-section-item').length) { //recursive until page loaded.
                var section = document.querySelector('dd-section-item[drop-disabled=true]');
                if (section) {
                    var scope = section.getAttribute('form-scope');
                    var urlScope = '/api/now/table/sys_scope?sysparm_fields=sys_id&sysparm_display_value=true&sysparm_query=scope=' + scope;
                    snuFetchData(g_ck, urlScope, null, res => {
                        var scopeId = res.result[0].sys_id;
                        snuSlashCommandInfoText(`<br />Switch to scope of this view: <a id='snuswitcscope' href='#'  >${scope}</a>`);
                        document.querySelector('#snuswitcscope').addEventListener('click', e => {
                            e.preventDefault();
                            snuSwitchTo("application", "app_id", scopeId);
                        });

                    })
                }
            }
            else {
                snuAddFormDesignScopeChange(); //try if its loaded after timeout
            }
        }, 1000);
    }
}

function snuDoubleClickToSetQueryListV2() { //dbl click to view and update filter condition
    jQuery('div.breadcrumb_container').on('dblclick', function (event) {
        if (event.shiftKey) {
            snuSplitContainsToAnd(event);
        } else {
            var listName;
            if (typeof g_form == 'undefined') {
                listName = document.querySelector('#sys_target')?.value;
            } else {
                var breadcrumbs = event.currentTarget.querySelector('span[list_id]');
                if (breadcrumbs) {
                    listName = breadcrumbs.getAttribute('list_id');
                }
            }
            if (!listName) {
                return;
            }
            var qry = GlideList2.get(listName);
            var orderBy = qry.orderBy.length ? '^' + qry.orderBy.join('^') : '';
            var newValue = prompt('[SN Utils]\nFilter condition: ', qry.filter + orderBy);
            if (newValue !== qry.filter && newValue !== null) {
                qry.setFilterAndRefresh(newValue);
            }
        }
    });
    jQuery('div.breadcrumb_container').on('click', function (event) {
        if (event.shiftKey) {
            snuSplitContainsToAnd(event);
        }
    });
}

var qry = '';
var qryDisp = '';
var _qry = {};

function snuClickToOpenWidget() {
    if (location.pathname == "/$pa_dashboard.do" && typeof DashboardMessageHandler != 'undefined') {
        document.querySelectorAll('.grid-widget-header-title').forEach((function (el) {
            el.setAttribute("title", "[SN Utils] CTRL or CMD-Click to open source");
        }));
        document.addEventListener("click", function (event) {
            if ((event.ctrlKey || event.metaKey) && event.target.tagName != 'A'  && event.target.className.includes('title-content')) {
                event.preventDefault();
                try {
                    var lnk = event.target.closest('.grid-stack-item').querySelector('decoration').getAttribute("editlink");
                    window.open(lnk);
                }
                catch (e) {
                    snuSlashCommandInfoText('Editlink not found. CTRL-Click only works in same scope and as admin', false);
                }
                return true;
            }
        });
    }
}

function snuCaptureFormClick() {

    if (typeof g_form != 'undefined') {
        document.addEventListener('click', function (event) {

            if (event.ctrlKey || event.metaKey || event?.target?.className == "dict") {
                var tpe = '';
                var tbl = g_form.getTableName();
                var elm = '';
                var elmDisp = '';
                var val;
                var valDisp = '';
                var operator = '=';
                if (event.target.classList.contains('label-text') || event.target.parentElement.classList.contains('label-text') || event?.target?.className == "dict" ) {
                    elm = event.target.closest('div.form-group').getAttribute('id').split('.').slice(2).join('.');
                    tpe = g_form.getGlideUIElement(elm).type;
                    val = g_form.getValue(elm);
                    elmDisp = event.target.textContent;
                    valDisp = g_form.getDisplayBox(elm) && g_form.getDisplayBox(elm).value || g_form.getValue(elm);
                    if (event?.target?.className == "dict" && !(event.ctrlKey || event.metaKey)){ //clicked the secret link to open dictioonary
                        event.preventDefault();
                        if (!window.NOW.user.roles.split(',').includes('admin')) {
                            snuSlashCommandInfoText("Only available for admin", false);
                            return;
                        }
                        if (elm.includes('.')) {
                            snuSlashCommandInfoText("This trick does not work for dot walked fields :(", false);
                            return;
                        }
                        window.open(`sys_dictionary.do?sysparm_query=name=javascript:new PAUtils().getTableAncestors('${tbl}')^element=${elm}&sysparm_view=advanced`, '_blank');
                        return;
                    }
                } else if (event.target.parentElement.classList.contains('sc_editor_label')) {
                    elm = event.target.closest('tr').getAttribute('id').split('.').slice(1).join('.');
                    tpe = g_sc_form.getSCUIElement(elm).type;
                    // Make no sense to work with labels.
                    if (tpe == 'label') return;
                    val = g_sc_form.getValue(elm);
                    elmDisp = 'Variable.' + event.target.textContent;
                    valDisp = g_sc_form.getDisplayBox(elm) && g_sc_form.getDisplayBox(elm).value || g_sc_form.getValue(elm);
                    var variableID = g_sc_form.nameMap.find((el) => el.realName == elm).questionID;
                    // In the query we must use the variable sys_id.
                    elm = 'variables.' + variableID;
                } else if (event.target.classList.contains('container-fluid')) {
                    elm = 'sys_id';
                    val = g_form.getUniqueValue();

                    elmDisp = 'Sys ID';
                    valDisp = '[record sys_id]';
                }
                if (typeof val == 'undefined') return;

                if (val.length == 0) {
                    val = '';
                    valDisp = '';
                    operator = 'ISEMPTY';
                } else if (tpe == 'glide_list' && elm != 'sys_id') {
                    operator = 'LIKE';
                } else if (tpe == 'currency') {
                    val = (val.split(';').slice(-1)+ '');
                    valDisp = val;
                    val = val.replace(",",".");
                } else if (tpe == 'glide_date_time' || tpe == 'glide_date') {
                    operator = 'ON';
                    var dte = val.substring(0, 10); //do some magic to get encodedquery to generate date
                    valDisp = dte;
                    var userDateFormat = (tpe == 'glide_date_time') ? g_user_date_time_format : g_user_date_format;
                    var dateNumber = getDateFromFormat(val, userDateFormat);
                    var dateJs = new Date(dateNumber);
                    dte = formatDate(dateJs, 'yyyy-MM-dd');
                    val = dte + "@javascript:gs.dateGenerate('" + dte + "','start')@javascript:gs.dateGenerate('" + dte + "','end')";
                } else if (tpe == 'glide_duration') {
                    val = "javascript:gs.getDurationDate('" + val + "')";
                } else if (val.length > 60) {
                    val = val.substring(0, 60);
                    valDisp = val;
                    operator = 'LIKE';
                }

                // The caret is a reserved character used to separate subconditions and must be escaped
                val = val.replace(/\^/g, '^^');
                // Some characters cannot be part of a URL
                val = encodeURIComponent(val);
                // ServiceNow uses CR LF to encode newlines. The only exceptions are script fields - some of them use LF, others use CR LF.
                // But since this feature is mainly used with other types of fields, we can ignore the support of multiline scripts.
                val = val.replace(/%0A/g, '%0D%0A');

                if (event.altKey) {
                    var reverseOperator = {
                        '=': '!=',
                        'LIKE': 'NOT LIKE',
                        'ISEMPTY': 'ISNOTEMPTY',
                        'ON': 'NOTON',
                    };
                    if (operator == '=' || operator == 'LIKE' || operator == 'ON') {
                        val += '^OR' + elm + '=NULL';
                    }
                    operator = reverseOperator[operator];
                }

                _qry = typeof _qry == 'object' ? _qry : {};

                var subCondition = {
                    val: val,
                    valDisp: valDisp,
                    elmDisp: elmDisp,
                    operator: operator
                };

                if (_qry[elm] && _qry[elm].val == subCondition.val && _qry[elm].operator == subCondition.operator) {
                    // Double function call in case of no changes removes the subcondition
                    delete _qry[elm];
                } else if (!_qry[elm] || (_qry[elm].val != subCondition.val || _qry[elm].operator != subCondition.operator)) {
                    _qry[elm] = subCondition;
                }

                var qry = '';
                var qryDisp = '';
                for (var _elm in _qry) {
                    qry += _elm + _qry[_elm].operator + _qry[_elm].val + '^';
                    qryDisp += _qry[_elm].elmDisp + ' ' + _qry[_elm].operator + ' <b>' + snuEncodeHtml(_qry[_elm].valDisp) + '</b> > ';
                }

                var listurl = `/${tbl}_list.do?sysparm_query=${qry}&sysparm_filter_pinned=true`;
                g_form.clearMessages();
                if (qry) {
                    var qryDisp2 = qryDisp.substring(0, qryDisp.length - 3);
                    g_form.addInfoMessage('Filter for ' + tbl + ' <a href="javascript:delQry()">Hide</a> :<a href="' + listurl + '" target="' + tbl + '">List filter: ' + qryDisp2 + '</a>');
                }
            }

            if (event.target.className.includes('scriptSync icon-save')) {
                if (g_form.isNewRecord()) {
                    snuSlashCommandInfoText('This is a new record, try again after saving',false);
                    return true;
                }
                snuPostToScriptSync(event.target.dataset.field, event.target.dataset.fieldtype);
                event.target.style.opacity = 0.3;
            }
            if (event.target.className.includes('scriptSync icon-code')) {
                if (g_form.isNewRecord()) {
                    snuSlashCommandInfoText('This is a new record, try again after saving',false);
                    return true;
                }
                snuPostToMonaco(event.target.dataset.field, event.target.dataset.fieldtype);
                event.target.style.opacity = 0.3;
            }

        }, true);

        //helper to make the secret dictionary a bit visible
        let style = document.createElement('style');
        style.appendChild(document.createTextNode(`span.snuwrap:hover span.pillar { display: none }
        span.snuwrap span.dict { display: none }
        span.snuwrap:hover span.dict { display : inline }`));
        document.head.appendChild(style);

    }
}

function snuEnhanceNotFound(advanced) {
    if (typeof jQuery == 'undefined') return;
    if (!jQuery('#not_the_droids').length) return;
    jQuery('#snutils-suggestions').remove();


    var not_the_droids = jQuery('#not_the_droids').val().replace(/[^a-z0-9\._-]/gi, '');
   // if (not_the_droids != jQuery('#not_the_droids').val()) return;
    var query = not_the_droids.split('_list.do');
    var addedQuery = '_list.do?' + ((query.length > 1) ? query[1] : '');
    var html = '<div id="snutils-suggestions" style="margin-top:20px"><h4>SN Utils \'did you mean\' table suggestions</h4>';
    if (advanced)
        html += 'Mode: <a data-advanced="false" class="snutablesearch" href="#">starts with: ' + query[0] + '</a> | contains: ' + query[0].replace(/_/g, ' & ') + '<br />';
    else
        html += 'Mode: starts with: ' + query[0] + ' | <a data-advanced="true" class="snutablesearch" title="splits by underscore and does a contains for each word" href="#">contains: ' + query[0].replace(/_/g, ' & ') + '</a><br />';

    html += '<br /><ul>';
    var myurl = '/api/now/table/sys_db_object?sysparm_limit=100&sysparm_fields=name,label&sysparm_query=sys_update_nameISNOTEMPTY^nameNOT LIKE00^nameNOT LIKE$^ORDERBYlabel^nameSTARTSWITH' + query[0];


    if (advanced) {
        var queryWords = query[0].split('_');
        myurl += '^NQsys_update_nameISNOTEMPTY^nameNOT LIKE00';
        for (var i = 0; i < queryWords.length; i++) {
            myurl += '^nameLIKE' + queryWords[i] + '^OR' + queryWords[i];
        }
    }

    snuFetchData(g_ck, myurl, null, function (jsn) {
        var results = jsn.result;
        if (results.length == 0) html += '<li>None found...</li>'
        for (var i = 0; i < results.length; i++) {
            html += '<li style="font-size:11pt"><a href="' + results[i].name + addedQuery + '">' + results[i].label + ' [' + results[i].name + ']</a></li>';
        }
        html += '</ul></div>';
        jQuery('.notfound_message').append(DOMPurify.sanitize(html));
        document.querySelectorAll("a.snutablesearch").forEach(a =>{
            a.addEventListener('click', evt =>{
                evt.preventDefault();
                snuEnhanceNotFound(a?.dataset?.advanced == 'true');
            });
        });
    });
}

function snuAddLinkToCachDo() {
    if (location.pathname != "/cache.do") return;

    var elemDiv = document.createElement('div');
    elemDiv.innerHTML = `<hr ><b>[SN Utils] Troubleshooting?</b><br /> Try running the <a id='cmdcls' href='#cls'>/cls</a> slashcommand to clear local storage`;
    document.body.appendChild(elemDiv);
    document.querySelector('#cmdcls').addEventListener('click', evt => { 
        evt.preventDefault();
        snuSlashCommandShow('cls',1);
    });

}

function snuClearLocalStorage() {

    let msg =  `Clearing <br />- localStorage (${localStorage.length}) <br />- sessionStorage (${sessionStorage.length}) <br />`;
    snuSlashCommandInfoText(msg, false);

    localStorage.clear();
    sessionStorage.clear();


    indexedDB.databases().then(dbs => {
        var promises = dbs.map(db => {
            return new Promise((resolve, reject) => {
                var req = indexedDB.deleteDatabase(db.Name);
                req.onsuccess = resolve;
                req.onerror = reject;
                req.onblocked = reject;
            });
        });
        Promise.all(promises).then(console.log).catch(console.error);
    })

 
    //clear serviceworkers
    caches.keys().then(function(names) {
        for (let name of names)
            caches.delete(name);
    });

    snuSlashCommandInfoText('Local storage cleared..', true);

}

function generateATFValues(event) {
    var tpe = '';
    var tbl = g_form.getTableName();
    var elm = '';
    var elmDisp = '';
    var val = 'none';
    var valDisp = '';
    var operator = '=';
    if (jQuery(event.target).hasClass('label-text')) {
        elm = jQuery(event.target).closest('div.form-group').attr('id').split('.').slice(2).join('.');
        tpe = g_form.getGlideUIElement(elm).type;
        //tpe = jQuery(event.target).closest('div.label_spacing').attr('type');
        val = g_form.getValue(elm);

        elmDisp = jQuery(event.target).text();

        if (tpe == "reference")
            valDisp = g_form.getDisplayBox(elm).value;
        else
            valDisp = val;
    }
    if (val == 'none' || val == '') return;

    else if (tpe == 'glide_date_time' || tpe == 'glide_date') {
        //do some magic to get encodedquery to generate date
        var dte = val.substring(0, 10);
        valDisp = dte;
        var dateNumber = getDateFromFormat(g_form.getValue(elm), g_user_date_time_format);
        var dateJs = new Date(dateNumber);
        dte = dateJs.getFullYear() + '-' +
            ("0" + (dateJs.getMonth() + 1)).slice(-2) + '-' +
            ("0" + dateJs.getDate()).slice(-2);
        val = dte;
    } else if (val.length > 60) {
        valDisp = val.substring(0, 60) + '...';
    }
    var idx = qry.indexOf('^' + elm + operator);
    if (idx > -1) {
        qry = qry.replace('^' + elm + operator + val, '');
        qryDisp = qryDisp.replace("- " + elmDisp + ' ' + operator + ' <b>' + valDisp + '</b><br />', '');
    } else {
        qry += '^' + elm + operator + val;
        qryDisp += "- " + elmDisp + ' ' + operator + ' <b>' + valDisp + '</b><br />';
    }
    var listurl = qry.substring(1, 10000);
    g_form.clearMessages();
    if (qry) {
        var qryDisp2 = qryDisp.substring(0, qryDisp.length - 6);
        g_form.addInfoMessage('Input values ' + tbl + ' <a href="javascript:delQry()">delete</a><br />' + qryDisp2 + '<br /><input type="text" class="form-control" value="' + listurl + '"></input>');
    }
}
var vals;

function getFieldStates() {
    vals = {
        "visible": [],
        "not_visible": [],
        "read_only": [],
        "not_read_only": [],
        "not_mandatory": [],
        "mandatory": []
    };
    for (var i = 0; i < g_form.elements.length; i++) {
        var elm = g_form.elements[i];
        var mid = 'div[id="element.' + elm.tableName + '.' + elm.fieldName + '"]';
        if (jQuery(mid).is(":visible") && jQuery(mid).css('visibility') !== 'hidden') {
            vals.visible.push(elm.fieldName);
            if (elm.mandatory)
                vals.mandatory.push(elm.fieldName);
            else
                vals.not_mandatory.push(elm.fieldName);

            if (jQuery(elm.getElement()).is('[readonly]'))
                vals.read_only.push(elm.fieldName);
            else
                vals.not_read_only.push(elm.fieldName);
        } else
            vals.not_visible.push(elm.fieldName);
    }
}

function delQry() {
    qry = '';
    qryDisp = '';
    _qry = {};
    g_form.clearMessages();
}

function snuMakeReadOnlyContentCopyable() { //this solves an issue where e.g. OOTB read-only Script Include content was not copyable
    try {
        if (typeof g_glideEditorArray != 'undefined' && g_glideEditorArray instanceof Array) {
            for (var i = 0; i < g_glideEditorArray.length; i++) {
                if (g_glideEditorArray[i].editor.getOption('readOnly') == 'nocursor')
                    g_glideEditorArray[i].editor.setOption('readOnly', true);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

function snuOpenConditions(fieldName) {
    var tableField = g_form.getControl(fieldName).attributes['data-dependent'].value || null;
    var conditions = g_form.getValue(fieldName);
    var url = '/' + g_form.getValue(tableField) + '_list.do?sysparm_query=' + conditions;
    window.open(url, 'condTable');
}

function snuOpenTable(fieldName) {
    var url = '/' + g_form.getValue(fieldName) + '_list.do';
    window.open(url, 'condTable');
}

function snuViewTranslations(fieldName) {
    var url = '/sys_translated_text_list.do?sysparm_query=tablenameINjavascript:new global.PAUtils().getTableAncestors("' + g_form.getTableName() + '")^fieldname=' + fieldName +
        '^documentkey=' + g_form.getUniqueValue();
    window.open(url, 'translation');
}

function snuViewTranslationsMeta(fieldName) {
    var orig = document.querySelector('*[id^="sys_original"][id$="' + fieldName + '"]').value;
    var url = '/sys_translated_list.do?sysparm_query=nameINjavascript:new global.PAUtils().getTableAncestors("' + g_form.getTableName() + '")^element=' + fieldName +
        '^value=' + orig + '^idISEMPTY^ORid=' + g_form.getUniqueValue()
    window.open(url, 'translation');
}

function unhideFields() {
    if (typeof g_form == 'undefined') return; //only on forms and only if admin
    var sections = g_form.getSectionNames();
    for (var sec = 0; sec < sections.length; sec++) {
        g_form.setSectionDisplay(sections[sec], true);
    }
    for (var ij = 0; ij < g_form.elements.length; ij++) {
        try {
            var bulb = '<span class="icon-lightbulb color-orange" title="Field displayed by SN Utils"></span>';
            var element = g_form.elements[ij];
            var fieldName = element.fieldName;
            var isVariable = fieldName.startsWith('ni.');
            if (!isVariable) {
                if (element.elementParentNode.getAttribute('style').includes('none')) {
                    jQuery(element.elementParentNode).find('label:not(.checkbox-label)').prepend(bulb);
                    g_form.setDisplay(fieldName, true);
                }
                if (element.elementParentNode.getAttribute('style').includes('hidden')) { //unhide via setvisible as well #422
                    bulb = '<span class="icon-lightbulb color-orange" title="Field set visible by SN Utils"></span>';
                    jQuery(element.elementParentNode).find('label:not(.checkbox-label)').prepend(bulb);
                    g_form.setVisible(fieldName, true);
                }
            } else {
                var variableElement = g_sc_form.getSCUIElement(fieldName);
                if (variableElement.getElementParentNode().getAttribute('style').includes('none')) {
                    // Variables have only one label. Unfortunately, in the case of a checkbox, the bulb will be on the right side.
                    jQuery(variableElement.getElementParentNode()).find('label').prepend(bulb);
                    g_form.setDisplay('variables.' + fieldName, true);
                }
                if (variableElement.getElementParentNode().getAttribute('style').includes('hidden')) {
                    bulb = '<span class="icon-lightbulb color-orange" title="Field set visible by SN Utils"></span>';
                    jQuery(variableElement.getElementParentNode()).find('label').prepend(bulb);
                    g_form.setVisible('variables.' + fieldName, true);
                }
            }
        } catch (e) { };
    }
}

function snuShowScratchpad() {

    document.querySelector('.outputmsg_container').style.maxHeight = "none"; //allow full height
    g_form.addInfoMessage("Scratchpad: <br/><pre style='white-space: pre-wrap;'>" + JSON.stringify(g_scratchpad || {}, 2, 2) + "</pre>");
}

function snuToggleLabel() {
    jQuery('span.label-orig, span.label-tech, span.label-snu').toggle();
}

function snuAddTechnicalNamesPortal() {
    if (typeof window?.NOW?.sp != 'undefined') { //basic serviceportal names
        document.querySelectorAll('label.field-label:not(.snuified), span.type-boolean:not(.snuified)').forEach(function (lbl) {
            try {
                var fld = angular.element(lbl).scope().field.name;
                jQuery(lbl).append('<span class="snuwrap"> | <span style="font-family:monospace; font-size:small;">' + fld + '</span></span> ');
                lbl.classList.add('snuified')         
            } catch (e) { }
        })
    }
}

function snuAddTechnicalNames() {

    var hasRun = document.querySelectorAll('.snuwrap').length > 0; //helper var to allow toggle technical names

    if (typeof snuNextManager != 'undefined') snuNextManager.addTechnicalNames();
    if (typeof jQuery == 'undefined') return; //not in studio

    snuAddTechnicalNamesPortal();

    document.querySelectorAll("#related_lists_wrapper h1.navbar-title, h1.navbar-title.embedded, .list_nav_top .navbar-title").forEach(lr => {
        if (!lr.querySelectorAll(".snuwrap").length) {
            lr.style.display = 'inline';
            var dataListId = lr.querySelector('a')?.dataset?.list_id;
            if (!dataListId){ // diffrent dom structure for embedded lists #286
                try {
                    dataListId = lr.closest('div.embedded[tab_list_name_raw]').getAttribute('tab_list_name_raw');
                } catch (e) { dataListId = '-.-' };
            }
            var tbl = (typeof g_form != 'undefined') ? dataListId.split('.')[1] : dataListId; // ? form : list 
            if (tbl?.startsWith("REL:")) {
                tbl = `<a target='_blank' href='sys_relationship.do?sys_id=${tbl.replace('REL:', '')}' >[scripted relation]</a>`;
            }
            lr.innerHTML += DOMPurify.sanitize('<span class="snuwrap">&nbsp;| <span style="font-family:monospace; font-size:small;">' + tbl + '</span></span>', { ADD_ATTR: ['target'] })
        }
    })

    if (typeof g_form != 'undefined') {
        try {
            jQuery('h1.navbar-title div.pointerhand').css("float", "left");
            jQuery("h1.navbar-title:not(:contains('|'))").first().append('<span class="snuwrap">&nbsp;| <span style="font-family:monospace; font-size:small;">' + g_form.getTableName() +
                ' <a onclick="snuShowScratchpad()">[scratchpad]</a><a title="Show the originating table info of fields" onclick="snuExtendedFieldInfo()">[table fields]</a>'+
                '<a title="For easier copying of field names" onclick="snuToggleLabel()">[toggle label]</a> </span></span>');

            jQuery(".label-text:not(:contains('|'))").each(function (index, elem) {
                // jQuery(elem.parentElement).attr('data-for', jQuery(elem.parentElement).attr('for')); //copy for value
                // jQuery(elem.parentElement).removeAttr('for'); //remove to easier select text
                jQuery('label:not(.checkbox-label)').removeAttr('onclick')
                var elm;
                var elmDisp;
                try {
                    elm = jQuery(this).closest('div.form-group').attr('id').split('.').slice(2).join('.');
                    elmDisp = elm;
                } catch (e) {
                    return true; //issue #42
                }

                var fieldType = jQuery(this).closest('[type]').attr('type') || jQuery(this).text().toLowerCase();
                let linkBtn = '', linkAttrs;
                if (fieldType == 'reference' || fieldType == 'glide_list') {
                    var reftable = g_form.getGlideUIElement(elm).reference;
                    linkAttrs = {
                        onclick: "snuOpenReference('" + reftable + "','" + elm + "',event);",
                        title: 'Open reference table list (click) or record (ctrl+click): ' + reftable
                    };

                    if (fieldType == 'reference'  && g_form.getValue(elm)){
                        var valDisp = g_form.getDisplayBox(elm) && g_form.getDisplayBox(elm).value;
                        if (!valDisp){
                            g_form.hideFieldMsg(elm, true);
							g_form.showFieldMsg(elm, `[SN Utils] Deleted or no display value`, 'warning');
                        }
                    }

                }
                else if (fieldType == 'conditions') {
                    linkAttrs = {
                        onclick: "snuOpenConditions('" + elm + "');",
                        title: 'Preview condition in list'
                    };
                }
                else if (fieldType == 'table_name') {
                    linkAttrs = {
                        onclick: 'snuOpenTable(\'' + elm + '\');',
                        title: 'Open table in list'
                    };
                }
                else if (['translated_field'].includes(fieldType)) {
                    linkAttrs = {
                        onclick: 'snuViewTranslationsMeta(\'' + elm + '\');',
                        title: `View translations of ${fieldType} field`
                    };
                    elmDisp = '⚑ ' + elm;
                }
                else if (['translated_text', 'translated_html'].includes(fieldType)) {
                    linkAttrs = {
                        onclick: 'snuViewTranslations(\'' + elm + '\');',
                        title: `View translations of ${fieldType} field`
                    };
                    elmDisp = '⚑ ' + elm;
                }
                if (linkAttrs) {
                    linkBtn = '<a class="" style="margin-left:2px; " onclick="' + linkAttrs.onclick + '" title="' +
                        linkAttrs.title + '" target="_blank">' + elmDisp + '</a>';
                }
                jQuery(this).html('<span style="font-family:monospace; display:none" class="label-tech">' + elmDisp + '</span><span class="label-orig">' + this.innerHTML + '</span><span class="snuwrap"><span class="dict" title="Open dictionary entry">&nbsp;! </span><span class="pillar">&nbsp;| </span><span class="label-snu" style="font-family:monospace; ">' + (linkBtn || elm) + '</span><sup data-element="'+ elm +'"></sup></span>');
                //jQuery(this).closest('a').replaceWith(function () { return jQuery(this).contents(); });
                if (this.closest('a')){
                    elem.closest('label').style.pointerEvents = 'all';
                    jQuery(this).closest('a').replaceWith(function () {
                        var cnt = this.innerHTML; var hl = this; hl.innerHTML = DOMPurify.sanitize("↗"); hl.title = "-SN Utils Original hyperlink-\n" + hl.title; hl.target = "_blank";
                        return DOMPurify.sanitize(hl.outerHTML + " " + cnt, { ADD_ATTR: ['target'] });
                    });
                }
            });

        } catch (error) {

        }
    }

    //add link to UI actions behind UI Action button 
    if (jQuery('.snuiaction').length == 0) {
        jQuery('.action_context').each(function () {
            var si = jQuery(this).attr('gsft_id');
            if (si)
                jQuery("<a class='snuiaction snuwrap' onclick='snuUiActionInfo(event, \"" + si + "\")' title='SN Utils: Click to open UI Action\nCTRL/CMD Click to view sys_id' style='margin-left:-2px'>? </a>").insertAfter(this);
        });
    }

    //add to names list and relatedlist
    jQuery('th.list_hdr, th.table-column-header, th.list_hdrembedded').each(function (index) {
        var tname = jQuery(this).attr('name') || jQuery(this).data('column-name');
        if (!jQuery(this).hasClass("snutn")) {
            jQuery(this).addClass("snutn")
            jQuery(this).find('a.list_hdrcell, a.sort-columns').parent().after(DOMPurify.sanitize('<div class="snuwrap" style="font-family:monospace;font-size:small;margin-left: 25px;margin-top: -3px; font-weight:normal">' + tname + '</div> '));
        }
    });

    //add names to variables in form formatter
    if (typeof g_form != 'undefined') {
        g_form.nameMap.each(vari => {
            var elm = document.querySelector(`div[id$='${vari.realName}'], label[id$='${vari.realName}_label']`);
            if (elm && !elm.classList.contains('snutn')) {
                try {
                    var newElm = document.createElement('span');
                    var sysid = vari.realName.substr(vari.realName.length - 32);
                    var tableName = g_form.getTableName();
                    // The variable definition table in case of the order form and the variable storage table in other cases
                    var linkTableName = tableName == 'ni' ? 'item_option_new' : 'sc_item_option';
                    newElm.innerHTML = "<span class='snuwrap'> | <a target='_blank' href='/" + linkTableName + ".do?sys_id=" + sysid + "'>" + vari.prettyName + "</a></span>"; newElm.style = "font-family:monospace;";
                    if (elm.tagName == 'DIV')
                        elm.querySelector('span.sn-tooltip-basic').appendChild(newElm);
                    else //checkbox
                        elm.appendChild(newElm);
                    elm.classList.add('snutn');
                } catch { }
            }
        })
    }

    //also show viewname
    var viewName = jQuery('input#sysparm_view').val();
    if (viewName && !jQuery('i.viewName').length)
        jQuery('.section-content').first().prepend(DOMPurify.sanitize('<i class="viewName snuwrap">Viewname: ' + viewName.replace(/<\/?[^>]+(>|$)/g, "") + '</i><br /> '));

    snuShowSelectFieldValues();
    snuSearchLargeSelects();
    snuCreateHyperLinkForGlideLists();

    //toggle the Technical names function
    if (hasRun) {
        var display = (document.querySelector('.snuwrap')?.style?.display == 'none') ? '' : 'none';
        document.querySelectorAll('.snuwrap').forEach(cls => {
            cls.style.display = display;
        });
    }

    snuHyperlinkifyWorkNotes();
}

function snuExtendedFieldInfo() {
    document.querySelector('.outputmsg_container').style.maxHeight = "none"; //allow full height
    var tableFields = {};
    var tableName = g_form.getTableName();
    //get all fields and group them by the table they are on.
    snuFetchData(g_ck, `/api/now/table/sys_dictionary?sysparm_query=nameINjavascript:new PAUtils().getTableAncestors('${tableName}')^element!=NULL^ORDERBYname,element^ORDERBYname&sysparm_exclude_reference_link=false&sysparm_suppress_pagination_header=true&sysparm_fields=element%2Cname&sysparm_no_count=true`, null, jsn => {
        jsn.result.forEach(elm => {
            (tableFields[elm.name]) ? tableFields[elm.name].push(elm.element) : tableFields[elm.name] = [elm.element];
        })
        var tables = Object.keys(tableFields);
        if (tables.length == 1) { } // do nothing
        else if (tables.length == 2 && tables[0] == tableName) tables.reverse(); //make sure parent table is first in array;
        
        if (tables.length <= 2) objToHtml(tables, tableFields);
        else { //more tables in hierarchy we need to determine order via a server call
            snuFetchData(g_ck, `/api/now/table/sys_db_object?sysparm_query=nameIN${tables.join(',')}&sysparm_display_value=true&sysparm_fields=name%2Csuper_class.name`, null, tbls => {
                var loop = true;
                var loops = 0;
                var tablesOrdered = [];
                var superSearch = '';
                while (loop && loops < 20) {
                    tbls.result.forEach(res => {
                        if (res["super_class.name"] == superSearch) {
                            tablesOrdered.push(res.name);
                            superSearch = res.name;
                            if (superSearch == tableName) loop = false;
                        }
                    })
                    loops++;
                }
                objToHtml(tablesOrdered, tableFields);
            });

        }
    });

    function objToHtml(tables, tableFields){

        var tblCnt = tables.length;
        if (tblCnt > 0){

            for (let idx = tblCnt -1; idx >= 1; idx--) { //unduplicate the fields arrays
                tableFields[tables[idx]] = tableFields[tables[idx]].filter( ( el ) => !tableFields[tables[idx-1]].includes( el ) );
            }

            for (let idx = 0; idx < tblCnt; idx++) {
                let fields = tableFields[tables[idx]];
                for (let jdx = 0; jdx < fields.length; jdx++) {
                    let elm = document.querySelector(`sup[data-element=${fields[jdx]}]`);
                    if (elm){
                        elm.innerText = idx + 1;
                        elm.title = 'Field from table: ' + tables[idx];
                       
                        try {
                            let pe = g_form.getGlideUIElement(fields[jdx]);
                            let pc = g_form.getControl(fields[jdx]);
                            fields[jdx] = ((g_form.isVisible(pe, pc)) ? '✓ ' : '◌ ') + fields[jdx]; 
                        }
                        catch(e){
                            fields[jdx] = '✓ ' + fields[jdx]; 
                        }
                    }
                    else {
                        fields[jdx] = '✖ ' + fields[jdx]; 
                    }
                }
            };
        }

       

        var tbl = document.createElement('table');
        var th = tbl.createTHead();
        var tb = tbl.createTBody();
        var thr = th.insertRow();
        var tr = tb.insertRow();

        tbl.style.margin = '2px';
        thr.style.fontWeight = 'bold';
        tr.style.verticalAlign = 'top';
        thr.style.padding = '2px';
        tr.style.padding = '2px';
        tables.forEach((tbl, idx) => {
            var hc = thr.insertCell();
            var hct = document.createTextNode(idx+1 + ': ' + tbl);
            hc.appendChild(hct);

            var tc = tr.insertCell();
            var ct = document.createElement('pre');
            ct.style.margin = '2px';

            tc.appendChild(ct);
            ct.innerText = tableFields[tbl].join("\n");
        })

        g_form.addInfoMessage("Fields per table: (On form: ✓ Yes | ✖ No | ◌ Hidden)<br/>" + tbl.outerHTML);

    }

}

function snuUiActionInfo(event, si) {
    if (event.ctrlKey || event.metaKey) {
        event.stopImmediatePropagation();
        prompt("[SN Utils]\nUI Action sys_id", si);
    }
    else {
        window.open('/sys_ui_action.do?sys_id=' + si, 'uiaction');
    }
}

function snuOpenReference(refTable, refField, evt) {
    var sysIds = g_form.getValue(refField);
    var refKey = g_form.getGlideUIElement(refField)?.referenceKey || 'sys_id';
    var url = `/${refTable}_list.do?sysparm_query=${refKey}IN${sysIds}`;
    if ((evt.ctrlKey || evt.metaKey) && sysIds && !sysIds.includes(','))
        url = `/${refTable}.do?sysparm_query=${refKey}IN${sysIds}`;
    window.open(url, 'refTable');
}

function snuShowSelectFieldValues() {
    if (typeof jQuery == 'undefined') return; //not in studio
    if (["/sys_report_template.do", "/$queryBuilder.do"].includes(location.pathname)) return; //not in report or query builder

    jQuery('option').each(function (i, el) {
        if (!el.dataset.snuoriginal)
            el.dataset.snuoriginal = el.text;
        el.innerText = (el.innerText.includes(' | ')) ? el.dataset.snuoriginal : el.text + ' | ' + el.value ;  
        el.title =  el.innerText;  
    });

    jQuery('#tableTreeDiv td.tree_item_text > a').not(":contains('|')").each(function (i, el) {
       el.innerText = el.text + ' | ' + el.value;
    });
}

function snuPaFormulaLinks() {
    if (typeof jQuery == 'undefined') return;
    if (jQuery('#pa_indicators\\.formula').length) {
        setTimeout(snuPaFormulaLinks, 4000);
    }
    else {
        return false;
    }

    jQuery('#snupaformulalinks').remove();
    var snuFormulas = [];

    var matches = g_form.getValue('formula').match(/\[\[(.*?)\]\]|\{\{(.*?)\}\}/g);
    if (matches) {
        matches.forEach((elm) => {
            var nme = elm.replace(/\[\[|\]\]|\{\{|\}\}/g, "").split(/ \/ | > /)[0]
            snuFormulas.push("> <a href='/pa_indicators.do?sysparm_refkey=name&sys_id=" + encodeURI(nme)
                + "' target='formula'>" + nme + "</a>");
        });
    }
    snuFormulas = Array.from(new Set(snuFormulas));
    var formulaHtml = snuFormulas.length ? snuFormulas.join("<br />\n") : "> No Indicators found in formula...<br />";
    jQuery('#pa_indicators\\.formula').after(
        "<div id='snupaformulalinks' style='border:1px solid #e5e5e5; padding:8px;' >Indicators in formula (Shown by SN Utils)<br />" +
        formulaHtml + "</div>");
}

function snuRemoveLinkLess() {
    if (!location.search.includes("&sysparm_link_less=true")) return;
    if (typeof jQuery == 'undefined') return;
    var newUrl = location.href.replace("&sysparm_link_less=true", "");
    jQuery('.form_action_button_container').append(DOMPurify.sanitize("<span style='font-weight:bold; margin-top:15px;' class='>navigation_link action_context default-focus-outline'><a href='" +
        newUrl + "' title='Link added by SN Utils (This is NOT a UI Action!)' >Show Related links</a></span>"));
}

function snuTableCollectionLink() {
    if (location.pathname != "/sys_db_object.do") return;
    if (typeof jQuery == 'undefined') return;
    var tbl = g_form.getValue('name');
    jQuery('.related_links_container').append("<li style='font-weight:bold; margin-top:15px;' class='>navigation_link action_context default-focus-outline'><a href='sys_dictionary.do?sysparm_query=name=" +
        tbl + "^internal_type=collection&sysparm_view=advanced' title='Link added by SN Utils (This is NOT a UI Action!)' >[SN Utils] Collection Dictionary Entry</a></li>");
}

function snuEnterToFilterSlushBucket() {
    if (location.pathname != "/sys_m2m_template.do") return;
    if (typeof acRequest == 'undefined') return; 
    document.addEventListener("keydown", (event) => {
        if (event.key == 'Enter') {
            acRequest();
        }
    });
}

function snuSearchLargeSelects() {

    var mdl = document.querySelector('#list_mechanic .modal-dialog');
    if (mdl) mdl.style = 'width:80% !important; padding:20px'; //give it more width...


    var minItems = 15;

    jQuery('select:not(.list_action_option, .searchified, .select2, .select2-offscreen, #application_picker_select, #update_set_picker_select)').each(function (i, el) {
        try {
            if (jQuery(el).find('option').length >= minItems && (el.id == 'slush_left' || el.id.includes('select_0'))) {
                //document.querySelector('.slushbucket-top').style.display = 'inline';
                var input = document.createElement("input");
                input.type = "text";
                input.placeholder = "Filter choices...";
                input.className = "form-control";
                input.style.marginBottom = "2px";
                input.addEventListener('keyup',evt =>{
                    let select = document.querySelector('select#slush_left, select#select_0, select#field_list_select_0');
                    select.style.display = 'none';
                    let options = select.querySelectorAll('option');
                    options.forEach(option => {
                        option.style.display = (option.innerText.toLowerCase().includes(evt.target.value.toLowerCase())) ? '' : 'none';
                    });
                    select.style.display = '';
                })
                snuInsertAfter(input, document.querySelector('label[for=slush_left], label[for=select_0], label[for=field_list_select_0]'))
                document.querySelector('select#slush_left, select#select_0, select#field_list_select_0').classList.add('searchified');
            }

            if (el.id == 'slush_right' || el.id == 'field_list_select_1') {
                //document.querySelector('.slushbucket-top.slushbody').style.display = 'inline';
                var input = document.createElement("input");
                input.type = "text";
                input.placeholder = "Add dotwalk field (confirm with enter)";
                input.className = "form-control";
                input.style.marginTop = "2px";
                input.style.marginLeft = "2px";
                el.onclick = function (ev) { input.value = ev.target.value + '.'; input.focus() }
                input.onkeydown = function (ev) {
                    if (ev.which == 13) {
                        ev.preventDefault();
                        var opt = document.createElement('option');
                        opt.value = input.value;
                        opt.innerHTML = DOMPurify.sanitize(input.value);
                        el.appendChild(opt);
                    }
                }

                var dv = document.createElement("a");
                dv.innerText = '+ sys_id';
                dv.style = 'height:20px; margin:7px 0; display:block;';
                dv.href='#';
                
                //allow
                if (!document.querySelector('select#slush_right option[value="sys_id"], select#field_list_select_1 option[value="sys_id"]')){
                    dv.title = '[SN Utils] Add sys_id field to first position of list';
                    dv.addEventListener('click', ev => { 
                        ev.preventDefault();
                        if (!document.querySelector('select#slush_right option[value="sys_id"], select#field_list_select_1 option[value="sys_id"]')){
                            var sb = document.querySelector('select#slush_right, select#field_list_select_1');
                            var option = document.createElement("option");
                            option.style.backgroundColor = '#5274FF';
                            option.text = "sys_id";
                            option.value = "sys_id";
                            sb.add(option, sb[0]);
                        }
                    });
                    snuInsertAfter(dv,document.querySelector('label[for="slush_right"]'));
                }

                var elmCount = document.querySelectorAll('.glide-list').length;
                var elmAfter =  document.querySelectorAll('.glide-list')[elmCount -1];
                snuInsertAfter(input, elmAfter );
                jQuery('select#slush_right, select#field_list_select_1').addClass('searchified');
            }
        } catch (e) { } //nice try
    });

}

function snuSetShortCuts() {
    var divstyle;
    if (snusettings.slashtheme == 'light') {
        divstyle = `<style>
        div.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; z-index:10000000000000; font-size:8pt; position: fixed; top: 10px; left: 10px; min-height:50px; padding: 5px; border: 1px solid #E3E3E3; background-color:#FFFFFFF7; border-radius:2px; min-width:320px; }
        div.snuheader {font-weight:bold; margin: -4px; background-color:#e5e5e5}
        ul#snuhelper { list-style-type: none; padding-left: 2px; overflow-y: auto; max-height: 80vh; } 
        ul#snuhelper li {margin-top:2px}
        span.cmdkey { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; border:1pt solid #e3e3e3; background-color:#f3f3f3; min-width: 40px; cursor: pointer; display: inline-block;}
        input.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; outline: none; font-size:10pt; font-weight:bold; width:99%; border: 1px solid #ffffff; margin:8px 2px 4px 2px; background-color:#ffffff }
        span.cmdlabel { color: #333333; font-size:7pt; font-family:verdana, arial }
        a.cmdlink { font-size:10pt; color: #1f8476; }
        span.semihidden { font-size:6pt; color: #999; }
        ul#snuhelper li:hover span.cmdkey, ul#snuhelper li.active span.cmdkey { border-color: #8BB3A2}
        ul#snuhelper li.active span.cmdlabel { color: black}
        div#snudirectlinks {margin: -5px 10px; padding-bottom:10px;}
        div#snudirectlinks a {color:#22885c; text-decoration: none; }
        div#snudirectlinks.snudirectlinksdisabled .dispidx { opacity: 0.3; }
        div#snudirectlinks div { max-width:500px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        div.snutils a.patreon {color:#1f1cd2;}
        div.snufadein { animation: snuFadeIn 0.5s; }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        </style>`;
    }
    else if (snusettings.slashtheme == 'stealth') {
        divstyle = `<style>
        div.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; z-index:1000000000000; font-size:10pt; position: fixed; top: 1px; left: 1px; padding: 0px; border: 0px; min-width:30px; }
        div.snuheader {display:none}
        ul#snuhelper { display:none } 
        ul#snuhelper li {display:none}
        span.cmdkey {display:none}
        input.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; outline: none; font-size:8pt; background: transparent; text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white; width:100%; border: 0px; margin:8px 2px 4px 2px; }
        span.cmdlabel { display:none }
        a.cmdlink { display:none }
        span.semihidden { display:none }
        div#snudirectlinks {display:none;}
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        </style>`;
    }
    else {
        divstyle = `<style>
        div.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; color:#ffffff; z-index:1000000000000; font-size:8pt; position: fixed; top: 10px; left: 10px; min-height:50px; padding: 5px; border: 1px solid #030303; background-color:#000000F7; border-radius:2px; min-width:320px; border: #333333 1pt solid; border-radius:  10px;}
        div.snuheader {font-weight:bold; margin: -4px; background-color:#333333; border-radius:  10px 10px 0px 0px;}
        ul#snuhelper { list-style-type: none; padding-left: 2px; overflow-y: auto; max-height: 80vh;} 
        ul#snuhelper li {margin-top:2px}
        span.cmdkey { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; border:1pt solid #00e676; background-color:#00e676; color: #000000; min-width: 40px; cursor: pointer; display: inline-block;}
        input.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; outline: none; font-size:10pt; color:#00e676; font-weight:bold; width:99%; border: 1px solid #000000; margin:8px 2px 4px 2px; background-color:#000000F7 }
        span.cmdlabel { color: #FFFFFF; font-size:7pt; }
        a.cmdlink { font-size:10pt; color: #1f8476; } 
        span.semihidden { font-size:6pt; color: #999; }
        ul#snuhelper li:hover span.cmdkey, ul#snuhelper li.active span.cmdkey  { border-color: yellow}
        ul#snuhelper li.active span.cmdlabel { color: yellow}
        div#snudirectlinks {margin: -5px 10px; padding-bottom:10px;}
        div#snudirectlinks a {color:#1cad6e; text-decoration: none; }
        div#snudirectlinks.snudirectlinksdisabled .dispidx { opacity: 0.3; }
        div#snudirectlinks div { max-width:500px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        div.snutils a.patreon {color:#0cffdd;}
        div.snufadein { animation: snuFadeIn 0.5s; }
        @keyframes snuFadeIn { 0% { opacity: 0; } 30% { opacity: 0; } 100% { opacity: 1; } }
        </style>`;
    }

    var htmlFilter = document.createElement('div');
    var snudirectlinks = (snunumbernav) ? '' : 'snudirectlinksdisabled';
    var cleanHTML = DOMPurify.sanitize(divstyle +
        `<div class="snutils" style="display:none;"><div class="snuheader"><a id='cmdhidedot' class='cmdlink'  href="#">
    <svg style="height:16px; width:16px;"><circle cx="8" cy="8" r="5" fill="#FF605C" /></svg></a> Slashcommands <span id="snuslashcount" style="font-weight:normal;"></span><span style="float:right; font-size:8pt; line-height: 16pt;">&nbsp;</span></div>
    <input id="snufilter" name="snufilter" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-autocomplete="both" aria-haspopup="false" class="snutils" type="text" placeholder='SN Utils Slashcommand' > </input>
    <ul id="snuhelper"></ul>
    <div id="snudirectlinks" class="${snudirectlinks}"></div>
    <div id="snuswitches"></div>
    </div>`, { FORCE_BODY: true, ADD_ATTR: ['target'] });
    htmlFilter.innerHTML = cleanHTML
    if (!window.top.document.querySelectorAll('#snufilter').length) { //prevent reinject 
        window.top.document.body.appendChild(htmlFilter);
        window.top.document.getElementById('cmdhidedot').addEventListener('click', evt => { snuSlashCommandHide(false, evt) });
        window.top.document.getElementById('snufilter').addEventListener('focus', function () { this.select() });
    }
    snuSlashCommandAddListener();

    document.addEventListener("keydown", function (event) {
        if (event.key == '/') {
            if (snusettings.slashoption == 'off') return;
            let eventPath = event.path || (event.composedPath && event.composedPath());
            if (eventPath[0]?.className?.includes('CodeMirror-code')) return; //allow commenting wit ctrl-/
            var isActive = ((location.host.includes("service-now.com") || g_ck) && snusettings.slashoption == 'on') || event.ctrlKey || event.metaKey || event.altKey; //add altkey for Washington compatability
            if (isActive) {
                var path = event.path || (event.composedPath && event.composedPath());
                if (!["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName) && !event.target.hasAttribute('contenteditable') && !event.target.tagName.includes("-") ||
                    (event.ctrlKey || event.metaKey) ||
                    path[0].id == 'filter' && path[0].value == ''
                ) { //not when form element active, except filter

                    if (path.length > 8 && path[2]?.className.includes('CodeMirror')) return //not in codemirror
                    event.preventDefault();
                    //in some browsers the event KEYBOARD_SHORTCUTS_BEHAVIOR#MODAL_OPENED event can't be captured. this is a temporary fallback
                    var showingPopup = window.top?.querySelectorShadowDom?.querySelectorDeep('.keyboard-shortcuts-modal'); //washington shortcuts popup 
                    if (showingPopup) event.preventDefault(); //don show when already visible
                    setTimeout(() => {
                        var showingPopup = window.top?.querySelectorShadowDom?.querySelectorDeep('.keyboard-shortcuts-modal'); //washington shortcuts popup 
                        if (showingPopup) {
                            snuSlashCommandHide(); //hide when shown by keyboard combo
                        }
                    },200)
                    //end fallback
                    snuSlashCommandShow('', false);
                }
            }
        }

        //a few specific for forms
        if (typeof g_form != 'undefined') {
            mySysId = g_form.getUniqueValue();
            var action;
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() == "s") { //cmd-s

                event.preventDefault();
                var doInsertStay = false;
                if (event.shiftKey) {
                    doInsertStay = document.querySelectorAll('#sysverb_insert_and_stay').length;
                    if (!doInsertStay) {
                        g_form.addWarningMessage("Insert and Stay not available for this record (SN Utils Extension)");
                        return false;
                    }
                }
                try { document.activeElement.blur(); } catch (e) { } // #235 dont think this throws error, but to be sure...
                action = (g_form.newRecord || doInsertStay) ? "sysverb_insert_and_stay" : "sysverb_update_and_stay";
                if (gel(action)) gsftSubmit(gel(action));
                else gsftSubmit(null, g_form.getFormElement(), action);

                return false;
            }
            else if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key == 'u') { //cmd-shift-u 
                unhideFields();
            }
            else if ((event.ctrlKey || event.metaKey) && event.key == '[') {
                if (snusettings.nouielements) return //way to disable this shortcut
                var prev = document.querySelector('button[onclick*=sysverb_record_prev]'); //previous record
                if (prev) prev.click();
            }
            else if ((event.ctrlKey || event.metaKey) && event.key == ']') {
                if (snusettings.nouielements) return //way to disable this shortcut
                var next = document.querySelector('button[onclick*=sysverb_record_next]'); //next record
                if (next) next.click();
            }
        }
    }, false);
}

function snuSplitContainsToAnd(event) {
    var listName;
    if (typeof g_form == 'undefined') {
        listName = document.querySelector('#sys_target')?.value;
    } else {
        var breadcrumbs = event.currentTarget.querySelector('span[list_id]');
        if (breadcrumbs) {
            listName = breadcrumbs.getAttribute('list_id');
        }
    }
    if (!listName) {
        return;
    }
    var qry = GlideList2.get(listName);
    var qa = qry.filter.split('^');
    var qaNew = [];
    for (var i = 0; i < qa.length; i++) {
        var re = qa[i].match(/LIKE(.*)/);
        if (re) {
            var words = re[1].split(' ');
            for (var j = 0; j < words.length; j++) {
                var qs = re.input.substring(0, re.index) + 'LIKE' + words[j];
                qaNew.push(qs);
            }
        } else
            qaNew.push(qa[i]);
    }
    qry.setFilterAndRefresh(qaNew.join('^'));
}

function snuAddInfoButton()
{

    if (typeof g_form == 'undefined') return ; 

    let trgt = document.querySelector('.navbar-right .navbar-btn');
    if (!trgt) return;
    let btn = document.createElement("button");
    btn.type = "submit";
    btn.id = "formBtn";
    btn.title = "[SN Utils] Show created/updated info about this record \n (Who the heck edited this?)\nDoubleclick to view data in new tab";
    btn.classList = "btn btn-icon glyphicon glyphicon-question-sign navbar-btn";
    btn.addEventListener('click', (e) => { snuLoadInfoMessage() });
    btn.addEventListener('dblclick', (e) => { snuSlashCommandShow('/vd',true) });
    trgt.after(btn);

}

function snuAddSwitchToApplication() {

    let msg =  window.querySelectorShadowDom?.querySelectorDeep('now-alert-content');
    
    if (!location.pathname.includes('.do')) return; 
    let elm = document.querySelector('.outputmsg_nav_inner, #scope_alert_msg');
    if (!elm) return; 

    let lnk = elm.querySelector('a'); //get the first link...
    let scopeId =  (lnk.href.split('=').length == 2) ? lnk.href.split('=')[1] : '';
    if (!scopeId) return; 
    let scopeVal = lnk.innerHTML;

    let spn = document.createElement("span");
    spn.innerHTML = `&nbsp; [SN Utils] Switch to ${scopeVal} click `;
    spn.title = "Application switch function is added by SN Utils";

    let a = document.createElement("a");
    a.innerText = "here";
    a.addEventListener('click', (e) => { snuSwitchTo("application", "app_id", scopeId); });
    spn.append(a);
    elm.append(spn);


}

function snuOpenWorkflowLink(){
    
        if (location.pathname != '/context_workflow.do') return; 
        let sysId = document.querySelector('#tab1')?.attributes['ontabactivate'].value.match(/\b[a-f\d]{32}\b/)[0];
        if (!sysId) return;

        snuFetchData(g_ck, '/api/now/table/wf_context/' +sysId + '?sysparm_display_value=false&sysparm_exclude_reference_link=true&sysparm_fields=workflow_version', null, res => {
            let wfv = res.result.workflow_version;
            let nbar = document.querySelector('h1.navbar-title');
            let a = document.createElement("a");
            a.innerText = "[SN Utils] Edit Workflow";
            a.href = "/workflow_ide.do?sysparm_sys_id=" + wfv;
            a.title = "Link added by SN Utils";
            a.target = "_blank";
            nbar.append(a);
        })

}

function snuBindPaste(showIcon) {

// disable #474
//    //this is test to be able to use default copy event to copy cell values, without the need use /copycells
//     document.querySelector('body').addEventListener("copy", (event) => {
//         if (typeof g_list_edit_grid != 'undefined') { //list or form
//             if (!snuGetSelectionText())
//                 snuCopySelectedCellValues();
//         }
//     });

    if (typeof g_form != 'undefined') {

        document.querySelector('body').addEventListener('paste', (e) => {
            if (e.clipboardData.items.length > 0 && e.clipboardData.items[0].kind == "file") {
                if (g_form.isNewRecord()) {
                    g_form.clearMessages();
                    g_form.addWarningMessage('Please save record before pasting...');
                    return false;
                }
                g_form.addInfoMessage('<span class="icon icon-loading"></span> Pasted image being processed...');
                snuDoPaste(e.clipboardData.items[0].getAsFile(), g_form.getTableName(), g_form.getUniqueValue());

            }
        });
    }
    else { //try determine record in workspace
        document.querySelector('body').addEventListener('paste', (e) => {
            var tableName; var sysId;
            var parts = document.location.pathname.split("/");
            var idx = parts.indexOf("sub") // show subrecord if available
            if (idx != -1) parts = parts.slice(idx);
            idx = parts.indexOf("record")
            if (idx > -1 && parts.length >= idx + 2) {
                tableName = parts[idx + 1];
                sysId = parts[idx + 2];
            }
            if (tableName && sysId) {
                if (e.clipboardData.items.length > 0 && e.clipboardData.items[0].kind == "file") {
                    snuDoPaste(e.clipboardData.items[0].getAsFile(), tableName, sysId);
                }
            }
        });

    }

    function snuDoPaste(fileInfo, tableName, sysId) {
        var fr = new FileReader();
        fr.onloadend = function () {
            var imgData = getBlob(fr.result);
            snuSaveImage(imgData, fileInfo, tableName, sysId);
        };
        fr.readAsDataURL(fileInfo);
    }
}

//Because we dont like creating records in a popup with sys_ref_list view
function snuNewFromPopupToTab() {
    return //buggy
    if (typeof jQuery == 'undefined') return; //not in studio

    if (typeof g_form != 'undefined') {

        if (window.opener && window.opener !== window && !window.location.href.includes("snutils=true")) {
            var newUrl = window.location.href.replace("sysparm_view=sys_ref_list", "sysparm_view=default") + "&snutils=true";
            var html = "<span title='Helper link by SN Utils' style='margin-left:5px;'><a href='" + newUrl + "' style='font-weight:lighter' target='_blank'>Open in new tab</a></span>"
            jQuery('.navbar-header').after(html);
        }
    }
}

function snuLoadInfoMessage() {

    if (document.querySelector('#snuinfo')) {
        g_form.clearMessages();
        return;
    }

    if (g_form.isNewRecord()){
        g_form.addInfoMessage("Nobody edited this, You are on a new record :)");
        return;
    }

    let reqUrl = `/api/now/table/${g_form.getTableName()}/${g_form.getUniqueValue()}?sysparm_display_value=true&sysparm_fields=sys_updated_on,sys_updated_by,sys_created_on,sys_created_by,sys_mod_count,sys_scope`;

    g_form.clearMessages();
    g_form.addInfoMessage(`<span style='font-size:9pt'>[SN Utils] Loading record info...`);


    snuFetchData(g_ck, reqUrl, null, res => {

        let flds = res?.result;
        let html;
        if (flds) {
            html = `<span id='snuinfo' style='font-size:10pt'>[SN Utils] Record info for: ${g_form.getTableName()} - ${g_form.getUniqueValue()}
            <div style='margin:5px; padding: 5px; font-size:9pt; font-family: Menlo, Monaco, Consolas, "Courier New", monospace;'>
            <div><span style='font-size:8pt; display: inline-block; width: 90px; float: left;'>Created by :</span> ${flds?.sys_created_by}</div>
            <div><span style='font-size:8pt; display: inline-block; width: 90px; float: left;'>Created on :</span> ${flds?.sys_created_on}</div>
            <div><span style='font-size:8pt; display: inline-block; width: 90px; float: left;'>Updated by :</span> ${flds?.sys_updated_by}</div>
            <div><span style='font-size:8pt; display: inline-block; width: 90px; float: left;'>Updated on :</span> ${flds?.sys_updated_on}</div>
            <div><span style='font-size:8pt; display: inline-block; width: 90px; float: left; white-space: pre;'>Updates    :</span> ${flds?.sys_mod_count}</div>`;

            if (flds?.sys_scope?.display_value) html += `
            <div><span style='font-size:8pt; display: inline-block; width: 90px; float: left; white-space: pre;'>Scope      :</span> ${flds?.sys_scope?.display_value || 'n/a'}</div>`;
            
            html += `</div>
            <div>Slash commands: <a href="javascript:snuSlashCommandShow('/u user_name=${flds?.sys_created_by}',0)" >/u ${flds?.sys_created_by}</a> &nbsp;&nbsp;`;

            if (flds?.sys_created_by != flds?.sys_updated_by && flds?.sys_updated_by != 'system')
                html += ` <a href="javascript:snuSlashCommandShow('/u user_name=${flds?.sys_updated_by}',0)" >/u ${flds?.sys_updated_by}</a>&nbsp;&nbsp; `;

            if (flds?.sys_scope?.display_value && flds?.sys_mod_count != "0")
                html += ` <a href="javascript:snuSlashCommandShow('/versions',0)" >/versions</a>`;

            
            html += ` <a href="javascript:snuSlashCommandShow('/vd',1)" >/vd</a> &nbsp; [🌟 New: Use /vd (View Data) to show all record data in a new tab]&nbsp;
            </div>
            Shortcuts: CTRL-V: Paste screenshot | CTRL-S: Save record | Double-click: Toggle Technical Names | 
            More: <a href="https://www.arnoudkooi.com/cheatsheet/" target="_blank">cheatsheet</a></span>
            `;
        }
        else html = 'Data could not be loaded...';

        g_form.clearMessages();
        g_form.addInfoMessage(html);

    });

}

function getBlob(encoded) {
    encoded = encoded.replace(/^data:image\/(png|jpeg);base64,/, "");
    var sliceSize = 1024;
    var byteCharacters = atob(encoded);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, {
        type: "image/png"
    });
}

async function snuSaveImage(imgData, fileInfo, tableName, sysId) {
    const pad2 = n => n < 10 ? '0' + n : n;
    const date = new Date();
    const fileName = `screenshot_${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}_${pad2(date.getHours())}${pad2(date.getMinutes())}${pad2(date.getSeconds())}.png`;

    const URL = `/api/now/attachment/file?table_name=${tableName}&table_sys_id=${sysId}&file_name=${fileName}`;
    const headers = {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': fileInfo.type,
        'X-UserToken': g_ck || undefined
    };

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers,
            body: imgData
        });

        if (response.ok) {
            const r = await response.json();
            if (typeof g_form !== 'undefined') {
                g_form.clearMessages();
                g_form.addInfoMessage(
                    `<span>Pasted image added as attachment<br /><a href='/${r.result.sys_id}.iix' target='myimg'><img src='${r.result.sys_id}.iix?t=small' alt='upload' style='display:inline!important; padding:20px;'/></a><br />` +
                    `<div class="input-group">
                    <input id='tbxImageName' onKeyUp='if (event.keyCode == 13) renamePasted("${r.result.sys_id}")' type="text" value="${r.result.file_name.replace('.png', '')}" style='width:260px;' class="form-control" placeholder="Image name">
                    <span class="input-group-btn" style="display: inline; ">
                    <button class="btn btn-primary" onClick='renamePasted("${r.result.sys_id}")' style="width: 80px;" type="button">.png Save..</button>
                    </span>
                    </div><span id='divRenamed'></span></form>`
                );
                const inputElem = document.getElementById('tbxImageName');
                inputElem.focus();
                inputElem.select();
            }
        }
    } catch (error) {
        console.log(error);
        if (typeof g_form !== 'undefined') {
            g_form.clearMessages();
            g_form.addErrorMessage(error.responseJSON?.error?.detail || 'An error occurred');
        }
    }
}


function renamePasted(sysID, check) {

    if (!$j('#tbxImageName').val()) {
        alert("Please insert a valid filename.");
        return false;
    }
    var requestBody = {
        "file_name": $j('#tbxImageName').val() + ".png"
    };
    var client = new XMLHttpRequest();
    client.open("put", "/api/now/table/sys_attachment/" + sysID);
    client.setRequestHeader('Accept', 'application/json');
    client.setRequestHeader('Content-Type', 'application/json');
    if (g_ck) client.setRequestHeader('X-UserToken', g_ck);

    client.onreadystatechange = function () {
        if (this.readyState == this.DONE) {
            if (this.status == 200)
                document.getElementById("divRenamed").textContent = " Filename saved!";
            else
                document.getElementById("divRenamed").textContent = this.status + this.response;
        }
    };
    client.send(JSON.stringify(requestBody));
}

function updateReportDesignerQuery() {
    if (location.pathname != "/sys_report_template.do") return;
    jQuery('div.breadcrumb-container').on("dblclick", function (event) {
        var qry = angular.element('#run-report').scope().main.report.sysparm_query;
        var newValue = prompt('[SN Utils]\Filter condition:', qry);

        if (newValue !== qry && newValue !== null) {
            angular.element('#run-report').scope().main.report.sysparm_query = newValue || '';
            setTimeout(function () {
                angular.element('#run-report').scope().main.runReport(true, 'run');
                angular.element('#run-report').scope().$broadcast('snfilter:initialize_query', newValue);
            }, 300);
        }
    });
}

function loadIframe(url) {
    var $iframe = jQuery('#' + iframeId);
    if ($iframe.length) {
        $iframe.attr('src', url);
        return false;
    }
    return true;
}

var elNames = ''; //used in background.js

function snuGetFormElementNames() {
    if (typeof g_form !== 'undefined') {
        var elArr = [];
        for (i = 0; i < g_form.elements.length; i++) {
            elArr.push(g_form.elements[i].fieldName);
        }
        elNames = (elArr.toString());
    }

}
snuGetFormElementNames();

/**
 * Removes all breakpoints for current user and reloads the active tabs editor's breakpoints gracefully.
 * First grabs all the break and logpoints for the user via the table API, then generates a batch request for each breakpoint and logpoint.
 * We use the same endpoint as the debugger does, since there is some session caching, so mutations with the table api take a
 * significant amount of time to propagate to the debugger/code editors.
 * 
 * Once the batch requests are generated, we execute them and check if all requests were successful, and if so, we reload the breakpoints
 * via the editors loadPoints function. For CodeMirror editors, we have to manually remove the line highlights, since they are not removed. 
 */
snuRemoveBreakpoints = function () {
    //Check if user has admin or script_debugger role
    if (!snuHasRoles(['admin', 'script_debugger'])) {
        snuSlashCommandInfoText('You do not have the required roles to remove breakpoints.<br />', false);
        return;
    }

    new Promise((resolve, reject) => {
        //Get session token, this was the more direct way I found it on the jsDebugger page.
        var token = g_ck || window?.document?.childNodes[1]?.childNodes[1]?.childNodes[1]?.contentWindow.g_ck;
        if (!token) {
            snuSlashCommandInfoText('No session token found<br />', false);
            reject()
            return;
        }

        //Fetch breakpoints and logpoints for current user.
        var breakpoints = snuFetchData(token, `/api/now/table/sys_js_breakpoint?sysparm_query=userDYNAMIC90d1921e5f510100a9ad2572f2b477fe&sysparm_field=script_id,script_field,line,script_type`);
        var logpoints = snuFetchData(token, `/api/now/table/sys_js_logpoint?sysparm_query=userDYNAMIC90d1921e5f510100a9ad2572f2b477fe&sysparm_field=script_id,script_field,line,script_type`);

        //We need to wait on both requests so we can handle the responses together
        Promise.all([breakpoints, logpoints])
            .then((values) => {
                //Generate batch requests for breakpoints and logpoints
                //We don't need the session token on the sub-requests, since the batch request will handle that.
                var batchHeaders = [
                    { name: 'Accept', value: 'application/json' },
                    { name: 'Content-Type', value: 'application/json' },
                ];
                var batchRequests = snuGenerateBatchRequests('POST', batchHeaders, '/api/now/js/debugger/breakpoint/$script_type/$script_id/$script_field/$line', values[0].result);
                batchRequests = batchRequests.concat(snuGenerateBatchRequests('POST', batchHeaders, '/api/now/js/debugger/logpoint/$script_type/$script_id/$script_field/$line', values[1].result));

                //If no breakpoints were found, resolve the promise and return false
                if (batchRequests.length == 0) return false;

                //Otherwise, execute the batch request
                return snuBatchRequest(token, batchRequests);
            })
            .then((response) => {
                //If the response is false, no breakpoints were found, so we resolve the promise and return
                if (response === false) {
                    snuSlashCommandInfoText('No breakpoints found<br />', false);
                    resolve();
                    return;
                }

                //Parse batch responses and check if all requests were successful
                var batchOutcomes = response.serviced_requests.map((response) => {
                    if (response.error_message) {
                        console.error(response.error_message);
                        return false;
                    }
                    if (response.status_code != 200) {
                        return false;
                    }
                    return true;
                })

                //Count the successful requests
                var successfulRequests = batchOutcomes.filter((outcome) => outcome).length;

                //If not all requests were successful, log the errors and resolve the promise
                if (successfulRequests != batchOutcomes.length) {
                    snuSlashCommandInfoText(`Encountered errors, removed ${successfulRequests} breakpoints<br />`, false);
                    console.error("Encountered errors while removing breakpoints", response)
                }
                else {
                    snuSlashCommandInfoText(`Removed ${successfulRequests} breakpoints<br />`, false);
                }
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    }).then(() => {
        //We then need to update the loadPoints function on the active tab's editor.
        //Breakpoints are not removed from the editor until the page is reloaded, only debugger has a record watcher
        try {
            if (location.pathname.startsWith("/$jsdebugger.do")) return; //Debugger has its own record watchers.

            //Our editors are likely in a iframe or macroponent, so we need to find them
            let iframes = window.top.document.querySelectorAll("iframe");
            if (!iframes.length && document.querySelector("[global-navigation-config]")) //try to find iframe in case of polaris
                iframes = document.querySelector("[global-navigation-config]").shadowRoot.querySelectorAll("iframe");

            //We first check all iframes
            Array.from(iframes).forEach(function (frame) {
                updateBreakpointsOnEditors(frame.contentWindow);
            });

            //We then check the window object
            updateBreakpointsOnEditors(window);

            /**
             * Updates all code editors, monaco or codemirror, in the target window.
             * TODO: Code mirror won't render the changes if the element isn't visible. We can force a redraw with .refresh() call so in the future we can do that like we do for the studio script editor fix. 
             * @param {*} targetWindow The window object to update editors in, either window or frame.contentWindow
             */
            function updateBreakpointsOnEditors(targetWindow) {
                //All the editors are stored in g_glideEditorArray regardless of type
                let editorList = targetWindow.g_glideEditorArray;
                if (typeof editorList != 'undefined' && Array.isArray(editorList)) {
                    editorList.forEach((editor) => {
                        //If the editor is a monaco editor, we can just call loadPoints
                        if (editor.monacoCommmon) editor.monacoCommmon.loadPoints();

                        //Otherwise its a codemirror editor, and we have to manually remove the line highlights.
                        else {
                            var breakpoints = targetWindow.GlideEditorJSBreakpoints.getBreakPoints();
                            var logpoints = targetWindow.GlideEditorJSLogpoints.getLogPoints();
                            var points = Object.keys(breakpoints).concat(Object.keys(logpoints));
                            for (point of points) {
                                editor.editor.removeLineClass(point - 1, "background", "Debugger-breakpoints-highlight");
                            }
                            targetWindow.GlideEditorJSCommon.loadPoints(editor.id, editor.editor);
                        }
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }
    }).catch((error) => {
        snuSlashCommandInfoText('Failed to remove breakpoints<br />', false);
        console.error(error);
    });
};

/**
 * Generates an array of batch requests for a single endpoint.
 * This is useful for endpoints where only one action can be performed at a time (e.g., delete, remove breakpoints).
 * It replaces $<variable_id> with the corresponding property from objects in the parameters array.
 * The 'body' property for is placed into the REST body for POST requests.
 *
 * @param {String} method - The HTTP method for all requests.
 * @param {Object[]} headers - The headers for all requests. Session token goes on batch call.
 * @param {string} headers[].name - The name of the header.
 * @param {string} headers[].value - The value of the header.
 * @param {string} urlTemplate - The URL template for all requests. $variables are replaced with the corresponding value in the parameters array.
 * @param {Object[]} parameters - The parameters for all requests. Properties are replaced with the replacement keys $<key>.
 * @param {Boolean} excludeResponseHeaders - Whether to exclude response headers, reducing the size of the response. Defaults to true.
 * @returns {Object[]} An array of batch requests for the ServiceNow batch endpoint.
 */
function snuGenerateBatchRequests(method, headers, urlTemplate, parameters, excludeResponseHeaders) {

    //Default excludeResponseHeaders to true
    excludeResponseHeaders = typeof excludeResponseHeaders != 'undefined' ? excludeResponseHeaders : true;

    //Generate batch requests
    var restRequests = parameters.map((substitutionObj) => {
        var id = Math.random().toString(36).substring(7);

        //Replace $variables in the URL template, excluding body
        let result = urlTemplate;
        for (let key in substitutionObj) {
            if (key == 'body') continue;
            result = result.replace(new RegExp('\\$' + key, 'g'), substitutionObj[key]);
        }

        //Create the batch request and add body if necessary
        var restRequest = {
            id: id,
            method: method,
            headers: headers,
            url: result,
            exclude_response_headers: excludeResponseHeaders,
        };
        if (method == 'POST' && substitutionObj.body) {
            restRequest.body = substitutionObj.body;
        }
        return restRequest;
    });
    return restRequests;
};

/**
 * Makes an call to the batch api endpoint, dramatically improving performance for multiple requests
 * @param {String} token Glide session token
 * @param {Array} requests Array of requests to be made
 * @param {Function} callback Callback function
 * @returns {Promise} Promise object representing the response
 */
function snuBatchRequest(token, requests, callback) {
    return new Promise(async (resolve, reject) => {
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-UserToken': token,
        };

        try {
            const response = await fetch('/api/now/v1/batch', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    batch_request_id: 'snu' + Math.random().toString(36).substring(7),
                    rest_requests: requests,
                }),
            });
            const data = response.ok ? await response.json() : reject("Error in batch request");
            if (callback) callback(data);
            resolve(data);
        } catch (error) {
            if (callback) callback(error);
            reject(error);
        }
    });
}


async function snuFetchData(token, url, post, callback) {
    return new Promise(async (resolve, reject) => {
      const headers = {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-UserToken': token || undefined
      };
      try {
        const response = await fetch(url, {
          method: post ? 'PUT' : 'GET',
          headers,
          body: post ? JSON.stringify(post) : null
        });
        let data = response.ok ? await response.json() : response;
        data.resultcount = response.headers.get("X-Total-Count");
        if (callback) callback(data);
        resolve(data);
      } catch (error) {
        if (callback) callback(error);
        reject(error);
      }
    });
  }
  

/**
 * @function snuStartBackgroundScript
 * @param  {String} script   {the script that should be executed}
 * @param  {Function} callback {the function that's called after successful execution (function takes 1 argument: response)}
 * @return {undefined}
 */
function snuStartBackgroundScript(script, callback) {
    try {
        fetch('sys.scripts.do', {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                script: script,
                runscript: "Run script",
                sysparm_ck: g_ck,
                sys_scope: "e24e9692d7702100738dc0da9e6103dd",
                quota_managed_transaction: "on"
            }).toString()
        }).then(response => response.text())
            .then(data => {
                callback(data);
            }).catch(error => {
                snuSlashCommandInfoText('Background Script failed (' + error + ')<br />', true);
            });
    } catch (error) {
        snuSlashCommandInfoText('Background Script failed (' + error + ')<br />', true);
    }
}

/**
 * @function snuShowAlert
 * @param  {String} msg  {Message to show}
 * @param  {String} type {types: success, info, warning, danger (defaults to 'info')}
 * @param  {Integer} timeout {time to close the flash message in ms (defaults to '3000')}
 * @return {undefined}
 */
function snuShowAlert(msg, type, timeout) {

    if (window.top.document.getElementById('filter') == null || typeof jQuery == 'undefined') {
        alert("FALLBACK MESSAGE GO TO CLASSIC UI FOR FORMATTED MESSAGE\n\n" + msg.replace(/<br \/>/g, "\n"));
        return false;
    }

    msg = '<a href="javascript:snuHideAlert()">[x] </a> SN Utils: ' + msg;
    if (typeof type == 'undefined') type = 'info';
    if (typeof timeout == 'undefined') timeout = 3000;
    window.top.jQuery('.service-now-util-alert>div>span').html(DOMPurify.sanitize(msg, { ADD_ATTR: ['target'] }));
    window.top.jQuery('.service-now-util-alert').addClass('visible').show();
    window.top.jQuery('.service-now-util-alert>.notification').addClass('notification-' + type);
    window.top.setTimeout(function () {
        window.top.jQuery('.service-now-util-alert').removeClass('visible').hide();
        window.top.jQuery('.service-now-util-alert>.notification').removeClass('notification-' + type);
    }, timeout);
}

function snuHideAlert() {
    jQuery('.service-now-util-alert').removeClass('visible');
}
function snuSlashCommandHide(navFocus = false, evt) {

    snuSlashNavigatorData = null;
    snuSlashLogData = null;
    snuMaxHints = 10;

    var storeSlashLog = true;
    if (evt) {
        evt.preventDefault();
        if (['Backspace','Escape'].includes(evt?.key)) storeSlashLog = false;
    }

    if (storeSlashLog) snuSlashLog(true);

    window.top.document.snuSelection = '';
    if (window.top.document.querySelector('div.snutils') != null) {
        window.top.document.querySelector('div.snutils').style.display = 'none';
        window.top.document.querySelector('div.snutils').classList.remove("snufadein");

        if (navFocus === true) {
            if (window.top.document.getElementById('filter') != null) {
                try {
                    if (event.currentTarget.value.length <= 1) {
                        var flt = window.top.document.querySelector('#filter');
                        if (flt) flt.focus();
                    }
                } catch (e) { }
            }
            if (typeof window.top?.querySelectorShadowDom != 'undefined') {
                let tab = window.top.querySelectorShadowDom.querySelectorDeep('div#all.sn-polaris-tab');
                if (tab) tab.click();
                setTimeout(() => {
                    var fltr = window.top.querySelectorShadowDom.querySelectorDeep(`.sn-polaris-nav.all input#filter`);
                    if (fltr) fltr.select();
                }, 400);
            }
        }
    }
    return false;
}

function snuSlashCommandShow(initialCommand, autoRun) {
    snuReceivedCommand = initialCommand;
    snuSlashNavigatorData = null; //force refreshing menu data
    snuSlashLogData = null; 
    snuSlashLogIndex = -1;
    snuIndex = 0;
    window.top.document.snuSelection = snuGetSelectionText();
    if (window.top.document.querySelector('div.snutils') != null) {
        window.top.document.querySelector('div.snutils').style.display = '';
        window.top.document.querySelector('div.snutils').classList.add("snufadein");
        window.top.document.getElementById('snufilter').value = initialCommand || '/';
        window.top.document.getElementById('snufilter').focus();
        snuSlashCommandShowHints((initialCommand || "").substring(1), false, "", "", false);
        if (initialCommand && autoRun) {
            window.top.document.getElementById('snufilter').dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Enter' }));
            setTimeout(function () {
                window.top.document.getElementById('snufilter').selectionStart =
                    window.top.document.getElementById('snufilter').selectionEnd = 10000;
            }, 10);
        }
        else {
            setTimeout(function () {
                window.top.document.getElementById('snufilter').selectionStart =
                    window.top.document.getElementById('snufilter').selectionEnd = 10000;
                if (autoRun === 0)
                    window.top.document.getElementById('snufilter').dispatchEvent(new KeyboardEvent('keydown', { 'key': 'ArrowRight' }));
            }, 10);
        }
    }
}

function snuGetSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function snuSlashCommandInfoText(msg, addText) {
    window.top.document.querySelector('div.snutils').style.display = '';
    var txt = addText ? window.top.document.getElementById('snudirectlinks').innerHTML : "";
    window.top.document.getElementById('snudirectlinks').innerHTML = DOMPurify.sanitize(txt + msg, { ADD_ATTR: ['target'] });
}

/**
 * Check all available window/iframes for the specified role(s).
 * @param {String[]} roleArray An array of roles to check for
 * @param {Boolean} [matchAll] Whether all provided roles must be present, or just one, defaults to false
 * @param {Boolean} [permitImpersonator] Whether an active impersonater can bypass the check, defaults to false
 * @returns {Boolean} Whether the user has met the specified conditions
 */
function snuHasRoles(roleArray, matchAll, permitImpersonator) {
    if (typeof window.g_user != 'undefined' || window.ux_globals != 'undefined')
        return snuHasRolesOnWindow(window, roleArray, matchAll, permitImpersonator);
    else {
        var iFrames = snuLocateIFrames();
        for (i = 0; i < iFrames.length; i++) {
            if (typeof iFrames[i].contentWindow.g_user != 'undefined' | typeof iFrames[i].contentWindow.ux_globals != 'undefined') {
                return snuHasRolesOnWindow(iFrames[i].contentWindow, roleArray, matchAll, permitImpersonator);
            }
        }
    }
    return false;
}


/**
 * Checks the target windows' roles for the specified role(s).
 * @param {String[]} roleArray An array of roles to check for
 * @param {Window} targetWindow The window object to check, either window or frame.contentWindow
 * @param {Boolean} [matchAll] Whether all provided roles must be present, or just one, defaults to false
 * @param {Boolean} [permitImpersonator] Whether an active impersonater can bypass the check, defaults to false
 * @returns {Boolean} Whether the user has met the specified conditions
 */
function snuHasRolesOnWindow(targetWindow, roleArray, matchAll, permitImpersonator) {
    //Grab the roles from the target window and the role array
    if (!roleArray.length) return false;

    //Default matchAll and permitImpersonator to false
    var matchAll = matchAll || false;
    var permitImpersonator = permitImpersonator || false;

    var userRoles = [];
    if (typeof targetWindow.g_user != 'undefined') userRoles = targetWindow.g_user.roles;
    else if (typeof targetWindow.ux_globals != 'undefined') userRoles = ux_globals.session.output.user.roles;

    //We check if the user has each role, and store the result in an array
    var hasRole = roleArray.map(role => userRoles.includes(role));
    var pass = matchAll ? (hasRole.every(r => r) && roleArray.length) : hasRole.some(r => r);

    //If impersonation bypass is enabled, we check if the user is impersonating
    if (permitImpersonator && snuImpersonater(document)) pass = true;
    return pass;
}

/**
 * Locates the iframes present on a page, and returns them in an array.
 * Many places, such as studio and polaris platforms, use iframes to load content.
 * @returns {Array} Array of iframes on the page
 */
function snuLocateIFrames() {
    var iframes = window.top.document.querySelectorAll("iframe");
    if (!iframes.length && document.querySelector("[global-navigation-config]")) //try to find iframe in case of polaris
        iframes = document.querySelector("[global-navigation-config]").shadowRoot.querySelectorAll("iframe");
    return iframes;
}


function snuFillFields(query) {

    if (location.search.includes("sc_cat_item") && location.search.includes("id=")) {
        snuSetRandomPortal(query, 0);
        return;
    }

    if (typeof window.g_form != 'undefined' && location.pathname != '/nav_to.do' && !location.pathname.startsWith('/now/nav/ui/classic/params/target/')) {
        if (!(window.NOW.user.roles.split(',').includes('admin') || snuImpersonater(document))) {
            snuSlashCommandInfoText("Only available for admin, or when impersonating", false);
            return;
        }
        var manFields = window.g_form.getMissingFields();

        // if(['-xss'].includes(query) ){ //todo determine fieldtypes too fill
        //     manFields = elNames.split(',');
        // }


        if (window.g_form.getTableName() != 'ni')
            setRandom(window.g_form.getTableName(), manFields, window);
        else
            snuSlashCommandInfoText(`<b>Log</b><br />- /rnd Not supported in classic Service Catalog, try in Portal.<br />`, false);
    }
    else {
        var iframes = window.top.document.querySelectorAll("iframe");
        if (!iframes.length && document.querySelector("[global-navigation-config]")) //try to find iframe in case of polaris
            iframes = document.querySelector("[global-navigation-config]").shadowRoot.querySelectorAll("iframe");
        Array.from(iframes).forEach(function (frm) {
            if (typeof frm.contentWindow.g_form != 'undefined') {
                if (!(frm.contentWindow.NOW.user.roles.split(',').includes('admin') || snuImpersonater(frm.contentWindow))) {
                    snuSlashCommandInfoText("Only available for admin, or when impersonating", false);
                    return;
                }
                var manFields = frm.contentWindow.g_form.getMissingFields();
                if (g_form.getTableName() != 'ni'){
                    setRandom(g_form.getTableName(), manFields, frm.contentWindow);
                    //setRandomAll(g_form.getTableName(), frm.contentWindow);
                }
                else
                    snuSlashCommandInfoText(`<b>Log</b><br />- /rnd Not supported in classic Service Catalog.<br />`, false);

            }
        });
    }

    function setRandomAll(tbl, doc) {


        snuSlashCommandInfoText(`<b>Log</b><br />- ${flds.length} Empty mandatory fields found.<br />`, false);

        flds.push("");
        var encQ = flds.join("ISNOTEMPTY^");
        flds.pop();
        snuGetRandomRecord(tbl, encQ, true, res => {
            flds.forEach(fld => {
                snuSlashCommandInfoText(`- Applying data to mandatory field`, true);

                var val = ((doc.g_form.getGlideUIElement(fld).type.includes("string") && doc.g_form.getControl(fld).tagName != "SELECT") ? "RANDOM TEST DATA " : "") + res[fld].value;
                doc.g_form.setValue(fld, val, res[fld].display_value);
                setTimeout(snuSlashCommandHide, 3000);
            })
        })
    }

    function setRandom(tbl, flds, doc) {

        if (!flds.length) {
            snuSlashCommandInfoText(`<b>Log</b><br />- No empty mandatory fields found.<br />`, false);
            return;
        }
        snuSlashCommandInfoText(`<b>Log</b><br />- ${flds.length} Empty mandatory fields found.<br />`, false);

        flds.push("");
        var encQ = flds.join("ISNOTEMPTY^");
        flds.pop();
        snuGetRandomRecord(tbl, encQ, true, res => {
            flds.forEach(fld => {
                snuSlashCommandInfoText(`- Applying data to mandatory field`, true);

                var val = ((doc.g_form.getGlideUIElement(fld).type.includes("string") && doc.g_form.getControl(fld).tagName != "SELECT") ? "RANDOM TEST DATA " : "") + res[fld].value;
                doc.g_form.setValue(fld, val, res[fld].display_value);
                setTimeout(snuSlashCommandHide, 3000);
            })
        })
    }
};

function snuCopySelectedCellValues(copySysIDs, shortcut = "copycells") {
    var hasCopied = false;
    var selCells = window.top.document.querySelectorAll('.list_edit_selected_cell, .list_edit_cursor_cell');
    if (selCells.length > 0) {
        doCopy(selCells);
        hasCopied = true;
    } else {
        var iframes = window.top.document.querySelectorAll("iframe");
        if (!iframes.length && window.top.document.querySelector("[global-navigation-config]")) //try to find iframe in case of polaris
            iframes = window.top.document.querySelector("[global-navigation-config]").shadowRoot.querySelectorAll("iframe");

        Array.from(iframes).forEach(function (frm) {
            selCells = frm.contentWindow.document.querySelectorAll('.list_edit_selected_cell, .list_edit_cursor_cell');
            if (selCells.length > 0) {
                doCopy(selCells, frm);
                hasCopied = true;
            }
        });
    }
    if (!hasCopied) alert("Nothing copied, consider the CopyTables extension for more control");
    function doCopy(selCells, frm) {
        var str = '';
        var wdw = (frm) ? frm.contentWindow : window;

        if (shortcut == "copycolumn") {
            let firstCell = selCells[0]; 
            let columnIndex = Array.from(firstCell.parentElement.children).indexOf(firstCell);
            let rows = firstCell.closest('table').querySelectorAll('tr');
            selCells = Array.from(rows).map(row => row.cells[columnIndex]).filter(td => td !== undefined && td.classList.contains('vt') && td.innerText);
        }

        selCells.forEach(function (cElem) {
            if (copySysIDs) {
                if (cElem.querySelector('a')) {
                    //str += cElem.querySelector('a[sys_id]').getAttribute('sys_id') + ',';
                    var match = RegExp('[?&]' + "sys_id" + '=([^&]*)').exec(cElem.querySelector('a').getAttribute('href'));
                    str += match && decodeURIComponent(match[1].replace(/\+/g, '')) + ',';
                }
            }
            else {
                var oTitle = cElem.getAttribute("data-original-title");
                if (oTitle !== null){
                    if (oTitle.length == 1000)
                        str +=  cElem.innerText.replace(/"/g, '""') + ' [TRUNCATED]\n';
                    else if (/\r|\n/.exec(oTitle)) //do not enclose in quotes if multiline #458
                        str += '"' + oTitle.replace(/"/g, '""') + '"\n';
                    else 
                        str += oTitle.replace(/"/g, '""') + '\n';
                }
                else
                    str += cElem.innerText.replace(' ➚','') + '\n';
            }
                
        });
        if (str.endsWith(',')) str = str.substring(0, str.length - 1);

        setTimeout(() => {
            if (typeof snuLastCopied == 'undefined' || new Date().getTime() - snuLastCopied > 500) {
                snuLastCopied = new Date().getTime();
                wdw.copyToClipboard(str);
            }
        },1);
        return;
    }
};

async function snuPostRequestToScriptSync(requestType) {

    snuScriptSync();

    var instance = {};
    instance.name = window.location.host.split('.')[0];
    instance.url = window.location.origin;
    instance.g_ck = g_ck;
    var data = {};

    data.instance = instance;
    if (requestType == 'widget') {
        var angularObject = angular.element(document.getElementById('vscode-btn')).scope().$parent;
        var angularData = angularObject.data;
        if (angularObject.c.readOnly) {
            alert("This is a Readonly widget, and can not be edited in VS Code. Please Clone the widget first");
            return;
        }

        data.action = 'saveWidget';
        data.tableName = 'sp_widget';
        data.name = angularData.title;
        data.sys_id = angularData.sys_id;
        data.widget = angularData.f._fields;
        if (!data.widget.hasOwnProperty('sys_scope')){
            let resp = await snuFetchData(g_ck,"/api/now/table/sp_widget/" + data.sys_id +
            "?sysparm_display_value=all&sysparm_exclude_reference_link=true&sysparm_fields=sys_scope");
            data.widget.sys_scope = resp?.result?.sys_scope || '';
        }
        if (data.widget.hasOwnProperty('data_table'))
            if (data.widget.data_table.hasOwnProperty('choices'))
                data.widget.data_table.choices = []; //skip useless data

    }
    snuScriptSyncPostData(data);
}

function snuPostToMonaco(field, fieldType) {
    if (event && typeof event.preventDefault !== 'undefined') event?.preventDefault();
    snuScriptEditor();
    sncWait(900);
    var data = {};
    var instance = {};
    instance.name = window.location.host.split('.')[0];
    instance.url = window.location.origin;
    instance.g_ck = g_ck;

    data.action = 'openFieldInMonaco';
    data.instance = instance;
    data.snusettings = snusettings;

    g_form.clearMessages();
    data.field = field;
    data.table = g_form.getTableName();
    data.sys_id = g_form.getUniqueValue();
    data.content = g_form.getValue(field);
    data.fieldType = fieldType;
    data.scope = g_form.getValue('sys_scope') || 'global';
    data.name = g_form.getDisplayValue().replace(/[^a-z0-9_\-+]+/gi, '-');

    let evt = new CustomEvent(
        "snutils-event",
        {
            detail: {
                event: "fillcodeeditor",
                command: data
            }
        }
    );
    window.top.document.dispatchEvent(evt);

}

function snuPostToScriptSync(field, fieldType) {
    if (event && typeof event.preventDefault !== 'undefined') event?.preventDefault();
    snuScriptSync();
    var data = {};
    var instance = {};
    instance.name = window.location.host.split('.')[0];
    instance.url = window.location.origin;
    instance.g_ck = g_ck;

    data.action = 'saveFieldAsFile';
    data.instance = instance;


    if (fieldType == 'flowaction') {
        data.field = field.actionName;
        data.table = 'flow_action_scripts'
        data.scope = field.scope;
        data.sys_id = field.sysId;
        data.content = field.script;
        data.fieldType = 'script';
        data.name = field.scriptName;
    }
    else if (field) {
        g_form.clearMessages();
        data.field = field;
        data.table = g_form.getTableName();
        data.sys_id = g_form.getUniqueValue();
        data.content = g_form.getValue(field);
        data.fieldType = fieldType;
        data.scope = g_form.getValue('sys_scope');
        data.name = g_form.getDisplayValue();  

    }
    else { //bgscript


        let date = new Date();
        let my_id = (date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + '-' + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds()));
        function pad2(n) { return n < 10 ? '0' + n : n } //helper for date id
        data.field = 'bg';
        data.table = 'background'
        data.sys_id = my_id;
        data.content = '// sn-scriptsync - Received from background script tab via SN Utils. (delete file after usage.)\n\n' + document.getElementById('runscript').value;
        data.fieldType = 'script';
        data.name = 'script'; //(new Date()).toISOString().slice(0,10).replace(/-/g,"");
    }

    snuScriptSyncPostData(data);

}

function snuPostLinkRequestToScriptSync(field) {
    snuScriptSync();

    var instance = {};
    instance.name = window.location.host.split('.')[0];
    instance.url = window.location.origin;
    instance.g_ck = g_ck;

    var ngScope = angular.element(document.getElementById('explorer-editor-wrapper')).scope()
    var data = {};
    data.action = 'linkAppToVSCode';
    data.instance = instance;
    data.appId = ngScope.ProjectConfig.APP_ID;
    data.appName = ngScope.ProjectConfig.APP_NAME;
    data.appScope = ngScope.ProjectConfig.APP_SCOPE;

    snuScriptSyncPostData(data);
}

function snuAddFieldSyncButtons() {

    var fieldTypes = ["script", "xml", "html", "template", "json", "css", "condition_string", "graphql_schema", "expression", "json_translations", "script_client"];
    if (typeof jQuery == 'undefined') return; //not in studio

    if (typeof g_form != 'undefined') {
        //if (g_form.isNewRecord()) return;
        var tableName = g_form.getTableName();
        var isSysTable = tableName.startsWith('sys_');
        jQuery(".label-text").each(function (index, value) {
            try {
                var elm = jQuery(this).closest('div.form-group').attr('id').split('.').slice(2).join('.');
                var fieldType = g_form.getGlideUIElement(elm).type || jQuery(this).closest('[type]').attr('type') || jQuery(this).text().toLowerCase();
                var txt = this.innerText.toLowerCase();
                // Old instances still use String type for the Business Rule.Condition field.
                var isBusinessRuleCondition = tableName == 'sys_script' && elm == 'condition';

                if (txt == 'script' || txt == 'css' || fieldTypes.includes(fieldType) || isBusinessRuleCondition) {
                    jQuery(this).after(getBtns(elm, fieldType));
                    return true;
                }
                if (isSysTable && fieldType.includes('string')) { //probably a JSON file
                    var len = 0;
                    try {
                        var el = document.getElementById(tableName + '.' + elm);
                        len = Number(el.dataset.length);
                    } catch (e) { }
                    if (len >= 4000) {
                        jQuery(this).after(getBtns(elm, fieldType));
                        return true;
                    }
                }

                if (fieldType != 'boolean'){ //true false fields dont need this
                    for (var i = 0; i < fieldTypes.length; i++) {
                        if (fieldType.includes(fieldTypes[i]) || elm.startsWith(fieldTypes[i])) {
                            fieldType = fieldTypes[i];
                            jQuery(this).after(getBtns(elm, fieldType));
                            break;
                        }
                    }
                }

                function getBtns(elm, fieldType) {
                    var btns = '';
                    if (snusettings.vsscriptsync == true)
                        btns += `<span style="color: rgb(var(--now-button--bare_primary--color,41,62,64)); cursor:pointer; margin-left:2px;" data-field="${elm}" data-fieldtype="${fieldType}" title='[SN Utils] Send script to VS Code via sn-scriptsync' class="icon scriptSync icon-save"></span>`;
                    if (snusettings.codeeditor == true)
                        btns += `<span style="color: rgb(var(--now-button--bare_primary--color,41,62,64)); cursor:pointer; margin-left:2px;" data-field="${elm}" data-fieldtype="${fieldType}" title='[SN Utils] Send script to Monaco Code editor in a new tab' class="icon scriptSync icon-code"></span>`;
                    return btns;
                }

            } catch (error) { }
        });
    } else if (location.href.includes("sp_config/?id=widget_editor") ||
        location.href.includes("sp_config?id=widget_editor")) {
        var $body = angular.element(document.body); // 1
        var $rootScope = $body.scope().$root;
        $rootScope.$watch("loadingIndicator", function (newValue, oldValue) {
            if (!newValue) {
                setTimeout(function () {
                    $('#vscode-btn').remove()
                    let btn = `<button id='vscode-btn' class="btn btn-info btn-group" onclick="snuPostRequestToScriptSync('widget')" title="Edit widget in VS Code (SN ScriptSync)">
                    <span class="glyphicon glyphicon-floppy-save"></span></button>`;
                    if (!$('#vscode-btn').length) $('button[type=submit]').before(btn);
                }, 500);
            }
        });
    }
}

function snuAddBGScriptButton() {
    if (!location.href.includes("/sys.scripts.do")) return; //only in bg script
    g_ck = document.getElementsByName('sysparm_ck')[0]?.value;
    window.top.window.g_ck = g_ck;
    if (g_ck) {
        document.getElementsByTagName('label')[0].insertAdjacentHTML('afterend', " <a href='javascript:snuPostToScriptSync();'>[Mirror in sn-scriptsync]</a>");
    }
}

function snuSetAllMandatoryFieldsToFalse() {

    var iframes = window.top.document.querySelectorAll("iframe");
    if (!iframes.length && document.querySelector("[global-navigation-config]")) //try to find iframe in case of polaris
        iframes = document.querySelector("[global-navigation-config]").shadowRoot.querySelectorAll("iframe");

    iframes.forEach((iframe) => { 
        if (typeof iframe.contentWindow.unhideFields != 'undefined')
            iframe.contentWindow.snuSetAllMandatoryFieldsToFalse(); 
    });

    if (typeof g_form != 'undefined' && typeof g_user != 'undefined') {
        if (g_user.hasRole('admin')) {
            var fields = g_form.getEditableFields();
            for (var x = 0; x < fields.length; x++) {
                g_form.setMandatory(fields[x], false);
            }
            snuShowAlert('Removed mandatory restriction from all fields.', 'success');
        } else {
            snuShowAlert('Admin rights required.', 'danger');
        }
    }
}

function snuAddSgStudioPlatformLink() {
    if (!location.href.includes("$sg-studio.do")) return; //only in studio
    if (location.hash.split("/").length < 2) return;

    setTimeout(function () {

        var match = {
            "application": "sys_sg_application",
            "applet": "sys_sg_screen",
            "button": "sys_sg_button",
            "smartButton": "sys_sg_button",
            "navigation": "sys_sg_button",
            "dataItem": "sys_sg_data_item",
            "appletLauncherPage": "sys_sg_applet_launcher"
        }

        var arr = location.hash.split("/");
        if (match.hasOwnProperty(arr[1])) {

            var sysId = arr[2];
            if (sysId.includes("{")) {
                try {
                    sysId = JSON.parse(decodeURIComponent(sysId))['sysId'];
                } catch (e) {
                    console.log(e);
                };
            }

            var elm = document.querySelector("h1");
            if (elm)
                elm.innerHTML = DOMPurify.sanitize("<a class='snu-platformlink' title='Open in platform (Link by SN Utils)' target='_blank' href='/" + match[arr[1]] + ".do?sys_id=" + sysId + "'>" + elm.innerText + "</a>");

        }

        if (!document.querySelector('.snu-platformlink'))
            snuAddSgStudioPlatformLink(); //do again until loaded

    }, 2000);
}

//Enable sluchbucket doubleclick in studio to select fields in 
function snuAddDblClick() {
    $("div[class^='FieldMappingBucket__field']").each(function () {
        var $elm = $(this);
        $elm.css('userSelect', 'none');
        $elm.find('.sg-dot-walk-picker').on('dblclick', function () {
            $elm.find('.add-rm-btn:first').click();
        });
        $elm.find('.selected-fieldsBox').on('dblclick', function () {

            $elm.find('.add-rm-btn:eq(1)').click();
        });
    });
    $('.snu-add-dblclick').text('Doubleblclick enabled');
}

function snuSortStudioLists() {
    snuDoGroupSearch(""); //call to remove var__m_ from flowdesigner 

    var elULs = document.querySelectorAll('.app-explorer-tree ul.file-section :not(a) > ul');

    Array.prototype.forEach.call(elULs, function (ul) {

        var nestedUls = ul.querySelectorAll('ul.file-section');
        if (nestedUls.length > 0) {
            Array.prototype.forEach.call(nestedUls, function (nu) {
                sortList(nu);
            });
        }
        else
            sortList(ul);
    });

    function sortList(list) {
        var i, switching, b, shouldSwitch;
        switching = true;
        while (switching) {
            switching = false;
            b = list.getElementsByTagName("li");
            for (i = 0; i < (b.length - 1); i++) {
                shouldSwitch = false;
                if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                b[i].parentNode.insertBefore(b[i + 1], b[i]);
                switching = true;
            }
        }
    }
}

function snuAddStudioSearch() {
    if (!location.href.includes("$studio.do")) return; //only in studio
    if (!g_ck) {
        if (typeof InitialState != 'undefined') {
            g_ck = InitialState.userToken;
        }
    }
    if (document.querySelectorAll('header.app-explorer-header').length == 0) return;
    var snuGroupFilter = '<input autocomplete="off" onfocus="snuSortStudioLists(); this.select();" onkeyup="snuDoGroupSearch(this.value)" id="snuGroupFilter" type="search" style="background: transparent; outline:none; color:white; border:1pt solid #e5e5e5; margin:5px 5px; padding:2px" placeholder="Filter navigator (Groups / Files[,Files])">'
    document.querySelectorAll('header.app-explorer-header')[0].insertAdjacentHTML('afterend', snuGroupFilter);
}

function snuAddStudioScriptSync() {

    if (!location.href.includes("$studio.do")) return; //only in studio
    if (!g_ck) {
        if (typeof InitialState != 'undefined') {
            g_ck = InitialState.userToken;
        }
    }

    if (document.querySelectorAll('header.app-explorer-header').length == 0) return;

    var snuScriptSyncLink = '<a style="color:white; margin-left:10px;" href="javascript:snuPostLinkRequestToScriptSync();"> <span class="icon icon-save"></span> Link VS Code via sn-scriptsync</a>'
    document.querySelectorAll('header.app-explorer-header')[0].insertAdjacentHTML('afterend', snuScriptSyncLink);
}

//Some magic to filter the file tree in studio
function snuDoGroupSearch(search) {
    //expand all when searching
    Array.prototype.forEach.call(document.querySelectorAll('.app-explorer-tree li.collapsed'), function (el, i) {
        el.classList.remove('collapsed');
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-view-count]'), function (el, i) {
        el.dataset.viewCount = 0;
        el.dataset.searching = false;
        el.parentElement.style.display = "";
    });

    search = search.split(',');
    var srch = search[0].toLowerCase();

    //filter based on item text.
    var elms = document.querySelectorAll('.app-explorer-tree li:not(.nav-group)');

    Array.prototype.forEach.call(elms, function (el, i) {

        var parents = snuGetParents(el, 'ul').reverse();
        el.setAttribute("title", el.innerText);
        var text = (search.length == 1) ? el.innerText.toLowerCase() + ' ' : '';
        var pars = [];
        Array.prototype.forEach.call(parents, function (par, i) {
            par.dataset.searching = true;
            text += par.parentElement.getElementsByTagName('span')[0].innerText.toLowerCase() + ' ';
            pars.push(par);
            for (par of pars) {
                if (text.includes(srch) && !text.includes("var__m_")) {
                    par.dataset.viewCount = (Number(par.dataset.viewCount) || 0) + 1;
                }
                else {
                    par.dataset.viewCount = (Number(par.dataset.viewCount) || 0);
                    el.style.display = "none";
                }
            }

            if (text.includes(srch) && !text.includes("var__m_")) {
                el.style.display = "";
            }
            else
                el.style.display = "none";
        });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-view-count]'), function (el, i) {
        if (el.dataset.viewCount == "0" && el.dataset.searching == "true")
            el.parentElement.style.display = "none";
    });


    if (search.length > 1) {
        srch = search[1];
        var elms = document.querySelectorAll('.app-explorer-tree li:not(.nav-group)');
        Array.prototype.forEach.call(elms, function (el, i) {
            el.style.display = el.innerText.toLowerCase().includes(srch.toLowerCase()) ? "" : "none";
        });
    }
}



function snuScriptEditor() {
    let event = new CustomEvent(
        "snutils-event",
        {
            detail: {
                event: "opencodeeditor"
            }
        }
    );
    window.top.document.dispatchEvent(event);
}

function snuScriptSync() {
    var event = new CustomEvent(
        "snutils-event",
        {
            detail: {
                event: "scriptsync",
                command: ""
            }
        }
    );
    window.top.document.dispatchEvent(event);
    sncWait();
}

function snuScriptSyncPostData(data) {
    var event = new CustomEvent(
        "snutils-event",
        {
            detail: {
                event: "scriptsyncpostdata",
                command: data
            }
        }
    );
    window.top.document.dispatchEvent(event);
}

function sncWait(ms) { //dirty. but just need to wait a sec...
    var start = Date.now(),
        now = start;
    while (now - start < (ms || 1000)) {
        now = Date.now();
    }
}

function snuSearchSysIdTables(sysId) {
    try {
        snuSlashCommandInfoText("Searching for sys_id. This may take a few seconds...<br />", false);
        var script = `      
            function findSysID(sysId) {
                var tbls = ['sys_metadata', 'task', 'cmdb_ci', 'sys_user'];
                var rtrn;
                var i = 0;
                while (tbls[i]) {
                    rtrn = findClass(tbls[i], sysId);
                    i++;

                    if (rtrn) {
                        gs.print("###" + rtrn + "###")
                        return
                    };
                }

                var tblsGr = new GlideRecord("sys_db_object");
                tblsGr.addEncodedQuery("super_class=NULL^sys_update_nameISNOTEMPTY^nameNOT LIKE00^nameNOT LIKE$^nameNOT INsys_metadata,task,cmdb_ci,sys_user,cmdb_ire_partial_payloads_index^scriptable_table=false^ORscriptable_tableISEMPTY");
                tblsGr.query();
                while (tblsGr.next()) {
                    var tableName = tblsGr.getValue('name');
                    var forbiddenPrefixes = ['ts_', 'sysx_', 'v_', 'sys_rollback_', 'pa_'];
                    var hasForbiddenPrefix = forbiddenPrefixes.some(function(forbiddenPrefix) {
                        return tableName.startsWith(forbiddenPrefix);
                    });
                    if (hasForbiddenPrefix) {
                        continue;
                    }
                    rtrn = findClass(tableName, sysId);
                    if (rtrn) {
                        gs.print("###" + rtrn + "###")
                        return
                    };
                }
                function findClass(t, sysId) {
                    try {
                        var s = new GlideRecord(t);
                        s.addQuery('sys_id', sysId);
                        // Order is important: setWorkflow must be before setLimit.
                        s.setWorkflow(false);
                        s.setLimit(1);
                        s.queryNoDomain();
                        s.query();
                        if (s.hasNext()) {
                            s.next();
                            return s.getRecordClassName() + "^" 
                            + s.getClassDisplayValue() + " - " 
                            + s.getDisplayValue() ;
                        }
                    } catch(err) {  }
                    return false;
                }
            }
            findSysID('`+ sysId + `')
        `;
        snuStartBackgroundScript(script, function (rspns) {
            answer = rspns.match(/###(.*)###/);
            if (rspns.length == 0)
                snuSlashCommandInfoText('Could not search for sys_id. (are you an Admin?)<br />', true);
            else if (answer != null && answer[1]) {
                var table = answer[1].split('^')[0];
                var url = table + '.do?sys_id=' + sysId;
                snuSlashCommandInfoText(`Opening in new tab: <a target='_blank' href='${url}'>${table}<br />`, true);
                window.open(url, '_blank');
            } else {
                snuSlashCommandInfoText('sys_id was not found...<br />', true);
            }
        });
    } catch (error) {
        snuSlashCommandInfoText(error + "<br />", true);
    }
}

function snuDoFileSearch(srch) {

    //expand all when searching
    Array.prototype.forEach.call(document.querySelectorAll('.app-explorer-tree li.collapsed'), function (el, i) {
        el.classList.remove('collapsed');
    });

    //filter based on item text.
    var elms = document.querySelectorAll('.app-explorer-tree li:not(.nav-group)');
    Array.prototype.forEach.call(elms, function (el, i) {
        el.style.display = el.innerText.toLowerCase().includes(srch.toLowerCase()) ? "" : "none";
    });
}

/**
 * Get all of an element's parent elements up the DOM tree
 * @param  {Node}   elem     The element
 * @param  {String} selector Selector to match against [optional]
 * @return {Array}           The parent elements
 */
var snuGetParents = function (elem, selector) {
    // Setup parents array
    var parents = [];
    // Get matching parent elements
    for (; elem && elem !== document; elem = elem.parentNode) {

        // Add matching parents to array
        if (selector) {
            if (elem.matches(selector)) {
                parents.push(elem);
            }
        } else {
            parents.push(elem);
        }
    }
    return parents;
};

function snuInsertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


function snuGetElevateRoles() {
    let headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        'X-WantSessionNotificationMessages': false            
    };
    if (g_ck) headers['X-UserToken'] = g_ck
    fetch(`/api/now/ui/impersonate/role`, {
        "method": 'GET',
        "headers": headers
        })
        .then(response => response.json())
        .then(data => {
            if (data?.error)
                snuSlashCommandInfoText('Error switching:' + data.error.detail, false);
            else {
                console.log(data);
            }
        })
        .catch((error) => {
            snuSlashCommandInfoText('Error switching:', error, false);
        });

}

async function snuElevate(roles) {
    try {
      roles = roles || "security_admin";
      const res = await fetch(`/api/now/ui/impersonate/role`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-UserToken': g_ck || ''
        },
        body: JSON.stringify({"roles": roles })
      });
      if (res.ok) {
        location.reload();
        snuSlashCommandHide();
      } else {
         snuSlashCommandInfoText(`Failed: ${res.status} ${res.statusText}`,false);
      }
    } catch (err) {
        snuSlashCommandInfoText(`Error: ${err}`,false);
    }
    return;
}




function snuGetUsersForImpersonate(query) {

    var impersonating = snuImpersonater();


    var client = new XMLHttpRequest();
    if (query)
        client.open("get", "api/now/table/sys_user?sysparm_display_value=true&sysparm_exclude_reference_link=true&sysparm_suppress_pagination_header=true&sysparm_limit=20&" +
            `sysparm_fields=sys_id,user_name,name&sysparm_query=active=true^user_nameLIKE${query}^ORnameLIKE${query}`);
    else
        try {
            client.open("get", "/api/now/ui/impersonate/recent");
        }
        catch (e) {
            snuSlashCommandInfoText("No access to Impersonations (admin only)", false);
        }
    client.setRequestHeader('Accept', 'application/json');
    client.setRequestHeader('Content-Type', 'application/json');
    if (g_ck) client.setRequestHeader("X-UserToken", g_ck);
    client.onreadystatechange = function () {
        if (this.readyState == this.DONE) {
            var idx = 0;
            var dispIdx = (impersonating) ? 1 : 0;
            var res = JSON.parse(this.response);
            var impDirectLinks = '';

            if (impersonating)
                impDirectLinks += `Currently Impersonating<br /><span class="dispidx">1</span> <a id="snulnk1" class="snuimp" href="#${impersonating}">Stop Impersonating</a> <span class="semihidden">${impersonating}</span><br />\n`;

            if (query)
                impDirectLinks += 'Found users (remove filter for recent impersonations)<br />';
            else
                impDirectLinks += 'Recent impersonated (add filter to search users)<br />';

            if (!res.result.length)
                impDirectLinks += '- No results found<br />';

            res.result.forEach(imp => {
                var idattr
                if (idx < 10 && (dispIdx !== '>')) {
                    idx++;
                    dispIdx++;
                    dispIdx = dispIdx % 10;
                    idattr = 'id="snulnk' + dispIdx + '"';
                }
                else {
                    dispIdx = '>';
                    idattr = '';
                }
                impDirectLinks += `<span class="dispidx">${dispIdx}</span> <a  ${idattr} class="snuimp" href="#${imp.user_name}">${imp.user_display_value || imp.name}</a> <span class="semihidden">${imp.user_name}</span><br />\n`;
            }
            );

            window.top.document.getElementById('snudirectlinks').innerHTML = DOMPurify.sanitize(impDirectLinks);

            document.querySelectorAll('a.snuimp').forEach(item => {
                item.addEventListener('click', event => {
                    event.preventDefault();
                    snuImpersonate(event.target.hash.substring(1));
                })
            })
        }
    };
    client.send();
}

async function snuImpersonate(userName) {
    try {
      const res = await fetch(`/api/now/ui/impersonate/${userName}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-UserToken': g_ck || ''
        }
      });
      if (res.ok) {
        location.reload();
        snuSlashCommandHide();
      } else {
         snuSlashCommandInfoText(`Failed: ${res.status} ${res.statusText}`,false);
      }
    } catch (err) {
        snuSlashCommandInfoText(`Error: ${err}`,false);
    }
}
  
function snuGetLastScopes(query) {
    var urlPref = "/api/now/table/sys_user_preference?sysparm_limit=10&sysparm_fields=sys_id,name,sys_updated_on&sysparm_display_value=true&sysparm_query=nameSTARTSWITHupdateSetForScope^userDYNAMIC90d1921e5f510100a9ad2572f2b477fe^ORDERBYDESCsys_updated_on";
    snuFetchData(g_ck, urlPref, null, res => {
        snuSlashCommandInfoText(`<b>Log</b><br />- Looking up recent scopes in preferences.<br />`, false);

        var scopes = []
        var scopesObj = {}
        res.result.forEach(scp => {
            scopes.push(scp.name.substring(17))
            scopesObj[scp.name.substring(17)] = scp.sys_updated_on;
        })
        if (scopes.length < 2 && !query) {
            snuSlashCommandInfoText(`- No results found.<br />`, true);
            return;
        }
        var urlScope = "/api/now/table/sys_scope?sysparm_fields=sys_id,scope,name&sysparm_display_value=true&sysparm_query=sys_idIN" + scopes.join(',');
        if (query) {
            urlScope = `/api/now/table/sys_scope?sysparm_fields=sys_id,scope,name&sysparm_display_value=true&sysparm_query=nameLIKE${query}^ORscopeLIKE${query}`;
        }
        snuFetchData(g_ck, urlScope, null, res => {

            //this is a addition to support searching for scopes, instead of displaying last 10
            if (query) {
                res.result.forEach(scp => {
                    scopes.push(scp.sys_id)
                    scopesObj[scp.sys_id] = '';
                })
            }

            var returnScopes = {};
            var idx = 0;
            var dispIdx = 0;
            snuSlashCommandInfoText(`- Fetching scope details.<br />`, false);

            res.result.forEach(scp => returnScopes[scp.sys_id] = scp);

            //var lastScopes = []
            var scopeDirectLinks = '';
            scopes = [...new Set(scopes)]; //remove duplicates
            scopes.forEach(scp => {
                if (returnScopes.hasOwnProperty(scp)) {
                    returnScopes[scp]['date'] = scopesObj[scp];
                    //lastScopes.push(returnScopes[scp]);
                    var idattr
                    if (idx < 10 && (dispIdx !== '>')) {
                        idx++;
                        dispIdx++;
                        dispIdx = dispIdx % 10;
                        idattr = 'id="snulnk' + dispIdx + '"';
                    }
                    else {
                        dispIdx = '>';
                        idattr = '';
                    }
                    scopeDirectLinks += '<span class="dispidx">' + dispIdx + '</span> <a ' + idattr + ' class="snuscopeswitch" href="#' + scp + '">' + returnScopes[scp].name + '</a> <span class="semihidden">' + returnScopes[scp].date + '</span><br />\n';
                }
            })
            window.top.document.getElementById('snudirectlinks').innerHTML = DOMPurify.sanitize(scopeDirectLinks);

            document.querySelectorAll('a.snuscopeswitch').forEach(item => {
                item.addEventListener('click', event => {
                    event.preventDefault();
                    snuSwitchTo("application", "app_id", event.target.hash.substring(1));
                })
            })
        })
    })

}

function snuSwitchTo(switchType, key, val) {

    //prevent caching issues, showing old values form localstoragecache after switching
    Object.keys(localStorage).filter(key => key.includes('.available')).forEach(k => {
        localStorage.removeItem(k);
    });

    let payload = {}
    payload[key] = val; //
    let headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        'X-WantSessionNotificationMessages': false            
    };
    if (g_ck) headers['X-UserToken'] = g_ck
    fetch(`/api/now/ui/concoursepicker/${switchType}`, {
        "method": 'PUT',
        "headers": headers,
        "body": JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            if (data?.error)
                snuSlashCommandInfoText('Error switching:' + data.error.detail, false);
            else {
                localStorage.setItem("snuPickerUpdated", new Date().getTime()); //this will help sync picker across tabs
                snuSlashCommandInfoText('Reloading page...', false);
                setTimeout(() => {
                    window.top.location.reload();
                }, 1600);
            }


        })
        .catch((error) => {
            snuSlashCommandInfoText('Error switching:', error, false);
        });
}

async function snuGetRandomRecord(table, query, fullRecord, callback) {
    const headers = {
      'Cache-Control': 'no-cache',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-UserToken': g_ck || undefined
    };
    
    let url = `/api/now/table/${table}?sysparm_limit=1&sysparm_fields=sys_id&sysparm_display_value=false&sysparm_query=${query}`;
    let response = await fetch(url, { headers });
    const rows = response.headers.get("X-Total-Count");
    const rnd = Math.floor(Math.random() * rows);
    
    if (fullRecord) {
      if (Number(rows))
        snuSlashCommandInfoText(`- Found ${rows} matching rows<br />- Fetching data from match ${rnd}<br />`, true);
      else {
        snuSlashCommandInfoText(`- No template found, try setting some values and run again<br />`, true);
        return;
      }
    }
  
    url = `/api/now/table/${table}?sysparm_limit=1&${fullRecord ? "" : "sysparm_fields=sys_id&"}sysparm_display_value=all&sysparm_query=${query}&sysparm_offset=${rnd}`;
    const res = await (await fetch(url, { headers })).json();
    const result = res.result[0] ? (fullRecord ? res.result[0] : res.result[0].sys_id.value) : 0;
    callback(result);
  }
  


function snuSetRandomPortal(allFields, iteration) {
    if (!iteration && !g_user_is_admin) {
        if (!snuImpersonater()) {
            snuSlashCommandInfoText("Only available for admin or when impersonating<br />", false);
            return;
        }
    }
    var cnt = 0;
    if (!iteration)
        snuSlashCommandInfoText("Setting random values<br />", iteration)
    else
        snuSlashCommandInfoText(`Rerunning set random values Iteration:${iteration}<br />`, iteration)
    var gf = angular.element(document.querySelectorAll('label.field-label, span.type-boolean')[0]).scope().getGlideForm();
    gf.getEditableFields().forEach(fldName => {
        var fld = gf.getField(fldName);
        if ((fld.mandatory || allFields) && fld.visible && !fld.value) {
            if (fld.type.includes("date")) {
                snuSlashCommandInfoText(`- Setting random future date to field ${fldName}<br />`, true);
                var today = new Date();
                gf.setValue(fldName, "")
                today.setHours(today.getHours() + Math.floor(Math.random() * 240) + 1)
                gf.setValue(fldName, today)
                cnt++;
            }
            else if (["reference", "glide_list"].includes(fld.type)) {
                snuGetRandomRecord(fld.ed.reference, fld.ed.qualifier, false, res => {
                    if (res)
                        snuSlashCommandInfoText(`- Setting random value to ${fld.type} field ${fldName}<br />`, true);
                    else
                        snuSlashCommandInfoText(`- PROBLEM no value found for ${fld.type} field ${fldName}<br />`, true);
                    gf.setValue(fldName, res);
                    cnt++;
                })

            }
            else if (["choice", "multiple_choice"].includes(fld.type)) {
                snuSlashCommandInfoText(`- Setting random text ${fld.type} field ${fldName}<br />`, true);
                gf.setValue(fldName, fld.choices[Math.floor(Math.random() * fld.choices.length)].value);
                cnt++;
            }
            else if (["string", "html", "textarea"].includes(fld.type)) {
                snuSlashCommandInfoText(`- Setting filler value to ${fld.type} field ${fldName}<br />`, true);
                var rndString = "Lorem Ipsum SN Utils Dolar /rnd Slashcommand";
                if (allFields == "-xss") {
                    rndString = `alert(“SNUTILS-XSS-TEST”)“>SNUTILS XSS TEST</a><img src=“a.jpg” onerror=“javascript:alert(“SNUTILS-XSS-TEST”)“/>` +
                        `<img src=x onError=alert(“SNUTILS-XSS-TEST”)`;
                }
                gf.setValue(fldName, rndString);
                cnt++;
            }
            else if (["email"].includes(fld.type)) {
                snuSlashCommandInfoText(`- Setting filler value to email field ${fldName}<br />`, true);
                gf.setValue(fldName, "snutils@rocks.dummy");
                cnt++;
            }
            else {
                snuSlashCommandInfoText(`- Field ${fldName} of type ${fld.type} not supported to randomfill<br />`, true);
            }
        }
    })

    if (cnt && iteration < 20) {
        setTimeout(() => { snuSetRandomPortal(allFields, ++iteration) }, 800);
    }
    else {
        setTimeout(() => {
            if (!window.top.document.getElementById('snudirectlinks').innerHTML.includes("- PROBLEM"))
                snuSlashCommandHide();
        }, 5000);
    }

}

//try to get userid of original user when impersonating
function snuImpersonater(doc) {
    doc = doc || document;
    var impersonatingUser = '';
    try {
        var scrptArr = Array.from(doc.querySelectorAll('script[type="text/javascript"]')).filter(
            scrp => scrp.innerText.includes("user.impersonation")
        );
        if (scrptArr.length) {
            impersonatingUser = scrptArr[0].innerHTML.match(/(\'user.impersonation\', \')([^&]*)\'\)/)[2];
        }
    }
    catch (e) { }

    if (!impersonatingUser) {
        try {
            var client = new XMLHttpRequest();
            client.open("get", "notfoundthispage.do", false); //false makes it sync
            client.send();
            impersonatingUser = client.response.match(/(\'user.impersonation\', \')([^&]*)\'\)/)[2];
        } catch (e) { }
    }
    return impersonatingUser;
}

function snuAddPersonaliseListHandler() {

    if (typeof GlideList2 == 'undefined') return;

    let wrapper = document.querySelector('#related_lists_wrapper'); //add buttons to async loaded related lists on moeuseenter
    if (wrapper) wrapper.addEventListener("mouseenter", snuAddPersonaliseListHandler);

    let relatedListsButtons = document.querySelectorAll('[data-type="list_mechanic2_open"]:not(.snuified)');

    if (!relatedListsButtons) return;
    relatedListsButtons.forEach(rlb => {
        let tableName = rlb?.dataset?.table;
        if (!tableName) return;
        let g_list = GlideList2.get(rlb?.dataset?.list_id);
        let missingFields = snusettings.listfields.split(',').filter(x => !g_list.fields.split(',').includes(x)).join(',');
        if (!missingFields || (missingFields == 'sys_scope' && !g_list.tableName.startsWith('sys_'))) return; //do not show if not needed, fields already in list (best try)

        let icon = document.createElement('i');
        icon.className = 'snuPersonaliseList icon-endpoint btn btn-icon table-btn-lg';
        icon.title = `[SN Utils] Try to quick add:\n ${missingFields}\nto the list. \nHold ctrl/cmd to keep modal open, hold shift to add sys_id to beginning of list`;
        icon.role = 'button';
        icon.addEventListener('click', evt => {
            let autoclose = !(evt.metaKey || evt.ctrlKey);
            snuPersonaliseList(rlb, autoclose, evt.shiftKey);
        });
        rlb.parentNode.insertBefore(icon, rlb.nextSibling);
        rlb.classList.add('snuified');

    })

}


function snuListFilterHelper() {

    if (typeof GlideList2 == 'undefined') return;

    let relatedListsButtons = document.querySelectorAll('[data-type="list_mechanic2_open"]:not(.snuified)');

    if (!relatedListsButtons) return;
    relatedListsButtons.forEach(rlb => {
        let tableName = rlb?.dataset?.table;
        if (!tableName) return;
         g_list = GlideList2.get(rlb?.dataset?.list_id);
    })

}
snuListFilterHelper()

function snuPersonaliseList(btn, autoclose, addsysid) {
    if (btn) btn.click();
    else return true;

    let loops = 0 //check if options are (async) loaded
    loop();

    function loop() {
        setTimeout(() => {
            if (document.querySelectorAll(`#slush_left option, #slush_right option`).length < 3 && loops < 10) {
                loops++;
                loop(); //not loaded, try again after xx ms
                return;
            }

            if (addsysid){
                if (!document.querySelector('select#slush_right option[value="sys_id"], select#field_list_select_1 option[value="sys_id"]')){
                    var sb = document.querySelector('select#slush_right, select#field_list_select_1');
                    var option = document.createElement("option");
                    option.style.backgroundColor = '#5274FF';
                    option.text = "sys_id";
                    option.value = "sys_id";
                    sb.add(option, sb[0]);
                }
            }

            let add = snusettings.listfields.split(',');
            let addCount = 0;
            add.each(fld => {
                let option = document.querySelector(`#slush_left option[value=${fld}]`)
                if (option) {
                    option.style.backgroundColor = '#5274FF';
                    document.querySelector('#slush_right').appendChild(option);
                    addCount++;
                }
            })
            if (autoclose && addCount) setTimeout(actionOK, 500);


        }, 300);
    }

}

document.addEventListener('snuEvent', function (e) {
    if (e.detail.type == "code" && (location.host.includes('service-now') || g_ck || location.pathname.endsWith('.do'))) { //basic check for servicenow instance
        var script = document.createElement('script');
        script.textContent = e.detail.content;
        (document.head || document.documentElement).appendChild(script);
    }
});

//menu handling inside
function snuGetSlashNavigatorData(){ //get JSON from loacal storage and prepare
    var prtl = Object.entries(localStorage)
    .filter(ent => ent[0].includes((window?.NOW?.user?.userID || window?.NOW?.user_id || '') + '.headerMenuItems'));
    if (prtl.length){
        try { 
            const lang = prtl[0][0].slice(-2);
            let preflat = JSON.parse(prtl[0][1]).value;

            try {
            preflat[0].order = 3; //try swap and reorder to have history and favorites before all
            preflat[2].order = 1;
            preflat = preflat.sort((a, b) => a.order - b.order);
            } catch (r) {}

            let menu = snuFlatten({ "subItems" : preflat});
            let idx = 0;
            menu.forEach(elm => {
                if (elm?.subItems) { //shape the JSON by adding parent and fulltext prop
                    let subIds = elm.subItems.map(si => si.id);
                    let subItems = menu.filter(e => subIds.includes(e.id));
                    subItems.forEach(si => {
                        si.parent = elm.id
                        si.fulltext = (elm.fulltext ?  elm.fulltext + ' > ' : '') + (si?.label || '') + (si?.description ? ' ' + si.description + ' - ' : '') ;
                        if (si?.route || si?.actionType) {
                            const timeAgoString = si.createdTimestamp ? snuTimeAgo(si.createdTimestamp, lang) : '';
                            si.displaygroup = elm.fulltext;
                            si.fulltext = elm.fulltext + ' > ' + (si?.label || '') + (si?.description ? ' - ' + si.description : ' ') + timeAgoString;
                            if (si?.route)
                                si.target = si?.route?.params?.target || si?.route.external?.url || si?.route?.external?.target || si?.route?.context?.path || '';
                            else if (si?.actionType == "SCRIPT")
                                si.target = si?.command || '';    
                            if (si?.target)           
                                si.fulltext = si.fulltext + ' ' +  si?.target?.match(/[^.]*/)[0];
                            //if ((si?.fulltext || '').includes("undefined")) debugger;
                            if (si.description) si.label = si.label + ' 🛈 ' + si.description + ' '; 
                            si.labelnotime = si.label;
                            if (timeAgoString && !si?.actionType) si.label = si.label + ' ◷ ' + timeAgoString; 
                        }
                        idx++;
                    });
                }
            })
            
            menu = menu.filter(m => !m.subItems && m.label);

            const tmpMenu = new Set(); //deduplicate based on group, label and target
            menu = menu.filter(mnu => {
                if (tmpMenu.has(mnu.displaygroup + mnu.labelnotime + mnu.target)) {
                    return false;
                }
                tmpMenu.add(mnu.displaygroup + mnu.labelnotime + mnu.target);
                return true;
            });
            return menu; 

        } catch(e) { return null;};
    }
    return null

    function snuFlatten(head, returnArray = [], key = 'subItems') {
        if (head) {
            returnArray.push(head);
            head[key]?.forEach((item) => snuFlatten(item, returnArray, key));
        }
        return returnArray;
    }
    
}

function snuTimeAgo (timestamp, locale = 'en') {
    let value;
    const diff = (new Date().getTime() - timestamp) / 1000;
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  
    if (years > 0) value = rtf.format(0 - years, "year");
    else if (months > 0) value = rtf.format(0 - months, "month");
    else if (days > 0) value = rtf.format(0 - days, "day");
    else if (hours > 0) value = rtf.format(0 - hours, "hour");
    else value = rtf.format(0 - minutes, "minute");

    return value;
  }

function snuDoSlashNavigatorSearch(search, arrDigits = []) {
    const MAXROWS = 25;
    
    if (search.trim().length < 2) return;
    snuSlashNavigatorData = snuSlashNavigatorData || snuGetSlashNavigatorData(); //store in memory after first call
    if (!snuSlashNavigatorData) return;
    let words = [...new Set(search.toLowerCase().split(' '))].filter((n) => n.length > 1).reduce(
        (unique, item) => ( unique.filter(e => item.includes(item)).length > 5 ? unique : [...unique, item]),[],); //todo check undouble

    let directlinks = '<div style="font-weight:bold; margin-bottom:5px; padding-top:5px;">&#128269; Navigator search</div>Tip: Hit SHIFT to toggle keyboard navigation<br />';
    let idx = 1;
    let dispIdx = 0;
    let lastgroup = '';
    let filtered = snuSlashNavigatorData.filter(itm => containsWords(itm.fulltext));
    if (!filtered.length) directlinks = "";
    filtered.forEach(res => {
        let link = res?.route?.params?.target || res?.route?.external?.url || res?.route?.external?.target || '';
        //var target = "gsft_main";
        let target = "_blank";
        let idattr
        if (idx <=10 && (!arrDigits.includes(idx % 10))) { 
            dispIdx = idx % 10;
            idattr = 'id="snulnk' + dispIdx + '"';
        }
        else {
            dispIdx = '>';
            idattr = '';
        }
        
        if (idx <= MAXROWS ){
            let displaygroup = (res.displaygroup == lastgroup) ? `` : res.displaygroup;
            let label = res.label;

            for (let word of words){
                displaygroup = displaygroup.replace( new RegExp(word, 'gi'), str => { return '<u>'+str+'</u>' });
                label = label.replace( new RegExp(word, 'gi'), str => { return '<u>'+str+'</u>' });
            }

            if (displaygroup) displaygroup = `<div style="margin-top:7px;">${displaygroup}</div>`;

            directlinks +=  `<div>${displaygroup}<span class="dispidx">${dispIdx}</span> <a ${idattr} data-idx="${idx}" target="${target}" title="${label}" href="${link}">${label}</a></div>`;
            lastgroup = res.displaygroup;
        }
        idx++;

    })

    function containsWords(text){   
        for (let word of words){
            if (!(text?.toLowerCase().includes(word))) return false;
        }
        return true;
    }

    window.top.document.getElementById('snudirectlinks').innerHTML = DOMPurify.sanitize(directlinks, { ADD_ATTR: ['target'] });
    window.top.document.getElementById('snudirectlinks');
    window.top.document.getElementById('snuswitches').innerHTML = DOMPurify.sanitize('');
    window.top.document.querySelectorAll("#snudirectlinks a").forEach(elm => {
        if (filtered[Number(elm.dataset.idx)-1]?.route) {
            elm.addEventListener("click", (evt) =>{
                var nxtHdr = window?.querySelectorShadowDom?.querySelectorDeep("sn-polaris-header");
                if (nxtHdr && !(evt.shiftKey || evt.ctrlKey || evt.metaKey)){
                    evt.preventDefault();
                        nxtHdr.dispatch("NAV_ITEM_SELECTED", filtered[Number(elm.dataset.idx)-1].route);
                }
                snuSlashLog(true);
                snuSlashCommandHide();
            })
        }
        else {
            elm.href = filtered[Number(elm.dataset.idx)]?.command;
            elm.target = '';
        }
    });

}

function snuSlashLog(addValue = false) {
    var slashLog = JSON.parse(localStorage.getItem('snuslashlog')) || [];
    if (addValue) {
        var value = window.top.document.querySelector('#snufilter')?.value;
        if (value.length < 2 || value == '/undefined') return slashLog;
        slashLog.unshift(value);
        slashLog = [...new Set(slashLog)];
        slashLog = slashLog.splice(0, snusettings.slashhistory);
        try {
            localStorage.setItem('snuslashlog', JSON.stringify(slashLog));
        } catch (ex){
            localStorage.clear(); 
            localStorage.setItem('snuslashlog', JSON.stringify(slashLog));
        }
    }
    return slashLog;
}


/**
 * Generates an array of batch requests for a single endpoint.
 * This is useful for endpoints where only one action can be performed at a time (e.g., delete, remove breakpoints).
 * It replaces $<variable_id> with the corresponding property from objects in the parameters array.
 * The 'body' property for is placed into the REST body for POST requests.
 *
 * @param {String} method - The HTTP method for all requests.
 * @param {Object[]} headers - The headers for all requests. Session token goes on batch call.
 * @param {string} headers[].name - The name of the header.
 * @param {string} headers[].value - The value of the header.
 * @param {string} urlTemplate - The URL template for all requests. $variables are replaced with the corresponding value in the parameters array.
 * @param {Object[]} parameters - The parameters for all requests. Properties are replaced with the replacement keys $<key>.
 * @param {Boolean} excludeResponseHeaders - Whether to exclude response headers, reducing the size of the response. Defaults to true.
 * @returns {Object[]} An array of batch requests for the ServiceNow batch endpoint.
 */
function snuGenerateBatchRequests(method, headers, urlTemplate, parameters, excludeResponseHeaders = true) {

    //Generate batch requests
    var restRequests = parameters.map((substitutionObj) => {
        var id = Math.random().toString(36).substring(7);

        //Replace $variables in the URL template, excluding body
        let result = urlTemplate;
        for (let key in substitutionObj) {
            if (key == 'body') continue;
            result = result.replace(new RegExp('\\$' + key, 'g'), substitutionObj[key]);
        }

        //Create the batch request and add body if necessary
        var restRequest = {
            id: id,
            method: method,
            headers: headers,
            url: result,
            exclude_response_headers: excludeResponseHeaders,
        };
        if (method == 'POST' && substitutionObj.body) {
            restRequest.body = substitutionObj.body;
        }
        return restRequest;
    });
    return restRequests;
};

/**
 * Makes an call to the batch api endpoint, dramatically improving performance for multiple requests
 * @param {String} token Glide session token
 * @param {Array} requests Array of requests to be made
 * @param {Function} callback Callback function
 * @returns {Promise} Promise object representing the response
 */
function snuBatchRequest(token, requests, callback) {
    return new Promise(async (resolve, reject) => {
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-UserToken': token,
        };

        try {
            const response = await fetch('/api/now/v1/batch', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    batch_request_id: 'snu' + Math.random().toString(36).substring(7),
                    rest_requests: requests,
                }),
            });
            const data = response.ok ? await response.json() : reject("Error in batch request");
            if (callback) callback(data);
            resolve(data);
        } catch (error) {
            if (callback) callback(error);
            reject(error);
        }
    });
}


function snuHyperlinkifyWorkNotes() {
    let activityLabel = document.querySelector('.activity-stream-label:not(.snuified)')
    if (activityLabel) {
        activityLabel.classList.add('snuified');
        activityLabel.title = "[SN Utils] Mouseover adds hyperlinks in activity stream";
        activityLabel.addEventListener("mouseover", snuHyperlinkifyWorkNotes);
    }

    let urlRegex = /(?<!href=")(https?:\/\/[^\s]+)/g;
    document.querySelectorAll('div.sn-card-component .sn-widget-textblock-body:not(.snuified)').forEach(crd => {
        let newContent =  crd.innerHTML.replace(urlRegex, function (url) {
            return '<a href="' + url + '" target="_blank" title="[SN Utils] Converted to hyperlink">' + url + '</a>';
        });
        let purifyContent = DOMPurify.sanitize(newContent, { ADD_ATTR: ['target'] }); 
        if (newContent && (purifyContent.length == newContent.length)) //dont apply when empty after regex or purify changed it, can happen when work note uses [code] tag
            crd.innerHTML = newContent;
        crd.classList.add('snuified');
    })
}


function snuTest(){

    var batchHeaders = [
        { name: 'Accept', value: 'application/json' },
        { name: 'Content-Type', value: 'application/json' },
    ];
    var batchRequests = snuGenerateBatchRequests('POST', batchHeaders, '/api/now/js/debugger/breakpoint/$script_type/$script_id/$script_field/$line', values[0].result);
    batchRequests = batchRequests.concat(snuGenerateBatchRequests('POST', batchHeaders, '/api/now/js/debugger/logpoint/$script_type/$script_id/$script_field/$line', values[1].result));
    
    //If no breakpoints were found, resolve the promise and return false
    if (batchRequests.length == 0) return false;
    
    //Otherwise, execute the batch request
    return snuBatchRequest(token, batchRequests);

}

//can be a pain to add condition when the searchbar is hidden, this tries to relief that by adding a stub condition on click of icon behind the fieldname
function snuEasifyAdvancedFilter(){
    if (!location.pathname.endsWith("_list.do")) return; //for now only in lists
    if (typeof GlideList2 == 'undefined') return;
    
    let listName = document.querySelector('[tab_list_name_raw]')?.getAttribute('tab_list_name_raw');
    if (!listName) return;
    if (document.querySelectorAll('th[name="search"] div.disabled').length !== 1) return; //Only when 1 searchrow disabled
    
    document.querySelectorAll('th.list_hdr, th.table-column-header, th.list_hdrembedded').forEach(elm => {

        let field = elm.getAttribute('name') || elm.getAttribute('data-column-name');
        let lblA = elm.querySelector('a.list_hdrcell');
        let displayField = document.querySelector('tr.list_header_search_row td[name="' + field + '"]')?.dataset?.glideReferenceName || '';
        let searchField = field + ((displayField) ? "." + displayField : '');
        let addA = document.createElement('a');
        let title = '[SN Utils] Click to add condition for field: ' + searchField + ' and pin filter. ';
        if (displayField) title += 'Hold SHIFT for reference field. (' + field + ')';
        addA.innerText = "⨮";
        addA.title = title;
        addA.href = '#';
        addA.addEventListener('click', ev => {
            ev.preventDefault();
            if (document.querySelector('.list_filter').style.visibility == 'hidden') GlideListWidget.get(listName).toggleFilter(); //show when hidden         
            let searchFieldSelected = (ev.shiftKey) ? field : searchField;
            
            const intervalId = setInterval(function() {
                const element = document.querySelector('tbody[id*=QUERYPART]');
                if (element) {
                    clearInterval(intervalId);
                    document.querySelectorAll('tbody[id*=QUERYPART]').forEach(qp =>{
                        addConditionSpec(listName,qp.id,searchFieldSelected,'','',''); 
                    })
                    if (!GlideListWidget.get(listName)?.pinned) GlideListWidget.get(listName).togglePin(); //pin if not pinned
                }
            }, 250);
        });
        lblA.parentNode.insertBefore(addA, lblA.nextSibling);

    });
    
}


async function snuCheckFamily(){
	let family = '';
	try{
        let storedfamily = JSON.parse(localStorage.getItem('snufamily')) || {}; //once a day check version (use /cls to clear cache)
        if (storedfamily?.checked == new Date().toISOString().substring(0,10)) 
            return storedfamily?.family;

		let fetchd = await snuFetchData(g_ck, '/api/now/table/sys_properties?sysparm_limit=1&sysparm_fields=value&sysparm_query=name=com.glide.embedded_help.version');
		family = fetchd?.result[0]?.value;
        storedfamily = { family: family, checked: new Date().toISOString().substring(0,10) };
        localStorage.setItem('snufamily', JSON.stringify(storedfamily));
	}
	catch(e){
		family = 'unknown';
	}
	return family;
}

function snuSlashCommandNumberNav(toggle){
    let snunumbernav = localStorage.getItem('snunumbernav');
    snunumbernav = snunumbernav ? JSON.parse(snunumbernav) : true;
    
    if (toggle) {
        snunumbernav = !snunumbernav;
        localStorage.setItem('snunumbernav', snunumbernav);
    }
    return snunumbernav;
}

function snuInstanceTagToggle(){
    if (typeof snuInstanceTag == 'undefined') 
        snuSlashCommandInfoText('Please enable InstanceTag in the settings first', false);
    else {
        snuInstanceTagConfig.tagEnabled = !snuInstanceTagConfig.tagEnabled;
        document.documentElement.style.setProperty("--snu-instancetag-tag-display", snuInstanceTagConfig.tagEnabled ? "" : "none");
        snuDispatchBackgroundEvent("updateinstancetagconfig", snuInstanceTagConfig);
    }
}

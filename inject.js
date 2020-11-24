var fields = [];
var mySysId = '';
var snuMaxHints = 10;
var snuPropertyNames = [];
var snuIndex = 0;
var snuSelection = '';
var snuNav = {
    'loading': 'mustload',
    'loadedLastTime': 0
};

var snuslashcommands = {
    "acl": {
        "url": "sys_security_acl_list.do?sysparm_query=nameLIKE$1^operationLIKE$2",
        "hint": "Filter ACL list <table> <operation>",
        "fields": "name"
    },
    "app": {
        "url": "sys_scope_list.do?sysparm_query=nameLIKE$0^scopeLIKE$0",
        "hint": "Filter Applications <name>",
        "fields": "name"
    },
    "br": {
        "url": "sys_script_list.do?sysparm_query=nameLIKE$0",
        "hint": "Filter Business Rules <name>",
        "fields": "name"
    },
    "cancel": {
        "url": "/cancel_my_transactions.do",
        "hint": "Cancel My Running Transactions"
    },
    "code": {
        "url": "*",
        "hint": "Code Search <search>"
    },
    "nav": {
        "url": "*",
        "hint": "[Beta] Navigator <search> or <application,item>"
    },
    "fav": {
        "url": "*",
        "hint": "[Beta] Favorites <search>"
    },
    "tab": {
        "url": "/$0",
        "hint": "New tab <pag or portal ie. foo.do or csm>"
    },
    "hist": {
        "url": "*",
        "hint": "[Beta] History <search>"
    },
    "aw": {
        "url": "/now/workspace/agent/noc",
        "hint": "Agent Workspace"
    },
    "comm": {
        "url": "https://community.servicenow.com/community?id=community_search&q=$0&spa=1",
        "hint": "Search Community <search>"
    },
    "cs": {
        "url": "sys_script_client_list.do?sysparm_query=nameLIKE$0",
        "hint": "Filter Client Scripts <name>",
        "fields": "name"
    },
    "db": {
        "url": "$pa_dashboard.do",
        "hint": "Dashboards"
    },
    "dev": {
        "url": "https://developer.servicenow.com/dev.do#!/search/orlando/All/$0",
        "hint": "Search developer portal <search>"
    },
    "docs": {
        "url": "https://docs.servicenow.com/search?q=$0&labelkey=orlando",
        "hint": "Search Docs <search>"
    },
    "env": {
        "url": "*",
        "hint": "Open this page in <instance>"
    },
    "fd": {
        "url": "/$flow-designer.do",
        "hint": "Open Flow Designer"
    },
    "help": {
        "url": "*",
        "hint": "Open SN Utils info page"
    },
    "lang": {
        "url": "*",
        "hint": "Switch language <lng>"
    },
    "log": {
        "url": "syslog_list.do?sysparm_query=sys_created_onONToday@javascript:gs.daysAgoStart(0)@javascript:gs.daysAgoEnd(0)^messageLIKE$0^ORsourceLIKE$0",
        "hint": "Filter System Log Created Today <search>"
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
    "plug": {
        "url": "v_plugin_list.do?sysparm_query=nameLIKE$0^ORidLIKE$0",
        "hint": "Filter Plugins <search>",
        "fields": "id"
    },
    "pop": {
        "url": "*",
        "hint": "Pop in/out classic UI"
    },
    "s2": {
        "url": "*",
        "hint": "Toggle Select2 for Application and Updateset picker"
    },
    "search": {
        "url": "text_search_exact_match.do?sysparm_search=$0",
        "hint": "Global Instance Search <search>"
    },
    "si": {
        "url": "sys_script_include_list.do?sysparm_orderby=api_name&sysparm_query=nameLIKE$0^api_nameLIKE$0",
        "hint": "Filter Script Includes <name>",
        "fields": "api_name"
    },
    "sp": {
        "url": "/sp",
        "hint": "Service Portal"
    },
    "st": {
        "url": "/$studio.do",
        "hint": "Open Studio"
    },
    "start": {
        "url": "/nav_to.do",
        "hint": "New tab"
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
        "url": "https://twitter.com/sn_utils",
        "hint": "Show @sn_utils Tweets"
    },
    "u": {
        "url": "sys_user_list.do?sysparm_query=user_nameLIKE$0^ORnameLIKE$0",
        "hint": "Filter Users <search>",
        "fields": "user_name"
    },
    "ua": {
        "url": "sys_ui_action_list.do?sysparm_query=nameLIKE$0",
        "hint": "Filter UI Actions <name>",
        "fields": "name"
    },
    "uh": {
        "url": "*",
        "hint": "Show Hidden Fields"
    },
    "uis": {
        "url": "sys_ui_script_list.do?sysparm_query=script_nameLIKE$0",
        "hint": "Filter UI Scripts <name>",
        "fields": "name"
    },
    "unimp": {
        "url": "*",
        "hint": "Stop impersonating and reload page"
    },
    "up": {
        "url": "sys_ui_policy_list.do?sysparm_query=nameLIKE$0",
        "hint": "UI Policies <name>",
        "fields": "name"
    },
    "va": {
        "url": "/$conversation-builder.do",
        "hint": "Virtual Agent Designer"
    },
    "wf": {
        "url": "/workflow_ide.do?sysparm_nostack=true",
        "hint": "Workflow Editor"
    },
    "imp": {
        "url": "impersonate_dialog.do",
        "hint": "Open Impersonate Form"
    },
    "xml": {
        "url": "/$table.do?XML=&sys_id=$sysid ",
        "hint": "Open current record's XML view"
    },
    "xmlsrc": {
        "url": "*",
        "hint": "Open current record's XML view with Browser's View Source"
    },
    "json": {
        "url": "/$table.do?JSONv2&sysparm_action=get&sysparm_sys_id=$sysid",
        "hint": "Open current record's JSONv2 view"
    }

}

var snuslashswitches = {
    "t": { "description": "View Table Structure", "value": "sys_db_object.do?sys_id=$0&sysparm_refkey=name", "type": "link" },
    "n": { "description": "New Record", "value": "$0.do", "type": "link" },
    "c": { "description": "Table Config", "value": "personalize_all.do?sysparm_rules_table=$0&sysparm_rules_label=$0", "type": "link" },
    "erd": { "description": "View Schema Map", "value": "generic_hierarchy_erd.do?sysparm_attributes=table_history=,table=$0,show_internal=true,show_referenced=true,show_referenced_by=true,show_extended=true,show_extended_by=true,table_expansion=,spacing_x=60,spacing_y=90,nocontext", "type": "link" },

    "a": { "description": "Active is True", "value": "^active=true", "type": "encodedquerypart" },
    "f": { "description": "Filter only", "value": "&sysparm_filter_only=true&sysparm_filter_pinned=true", "type": "querypart" },
    "s": { "description": "Current Scope", "value": "^sys_scope=javascript:gs.getCurrentApplicationId()", "type": "encodedquerypart" },
    "uct": { "description": "Updated or Created Today", "value": "^sys_created_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^ORsys_updated_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()", "type": "encodedquerypart" },
    "ut": { "description": "Updated Today", "value": "^sys_updated_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()", "type": "encodedquerypart" },
    "ct": { "description": "Created Today", "value": "^sys_created_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()", "type": "encodedquerypart" },
    "um": { "description": "Updated by Me", "value": "^sys_updated_by=javascript:gs.getUserName()", "type": "encodedquerypart" },
    "cm": { "description": "Created by Me", "value": "^sys_created_by=javascript:gs.getUserName()", "type": "encodedquerypart" },
    "m": { "description": "Updated or Created by Me", "value": "^sys_updated_by=javascript:gs.getUserName()^ORsys_created_by=javascript:gs.getUserName()", "type": "encodedquerypart" },
    "ou": { "description": "Order by Updated Descending", "value": "^ORDERBYDESCsys_updated_on", "type": "encodedquerypart" },
    "oc": { "description": "Order by Created Descending", "value": "^ORDERBYDESCsys_created_on", "type": "encodedquerypart" },
}

var snuOperators = ["%", "^", "=", ">", "<", "ANYTHING", "BETWEEN", "DATEPART", "DYNAMIC", "EMPTY", "ENDSWITH", "GT_FIELD", "GT_OR_EQUALS_FIELD",
    "IN", "ISEMPTY", "ISNOTEMPTY", "LESSTHAN", "LIKE", "LT_FIELD", "LT_OR_EQUALS_FIELD", "MORETHAN", "NOT IN", "NOT LIKE", "NOTEMPTY", "NOTLIKE", "NOTONToday", "NSAMEAS", "ONToday", "RELATIVE", "SAMEAS", "STARTSWITH"];


if (typeof jQuery != "undefined") {
    jQuery(function () {
        if (typeof angular != "undefined") {
            setTimeout(function () {
                getListV3Fields();
                updateReportDesignerQuery();
            }, 2000);

        }
        else
            doubleClickToSetQueryListV2();

        doubleClickToShowFieldOrReload();
        clickToList();
        makeReadOnlyContentCopyable();
    });
}

function snuEncodeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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

    var myurl = '/api/now/table/sys_db_object?sysparm_limit=100&sysparm_fields=name,label&sysparm_query=sys_update_nameISNOTEMPTY^nameNOT LIKE00' + qry + '^EORDERBYname' + shortcut;
    loadXMLDoc(g_ck, myurl, null, function (jsn) {

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
        } else {
            snuslashcommands[shortcut] = {
                "url": "",
                "hint": "Could not load results",
                "type": "table"
            };
        }
        snuExpandHints(shortcut)

    });

}

function snuGetDirectLinks(targeturl, shortcut) {

    var fields = "";
    try {
        var fields = (snuslashcommands[shortcut].hasOwnProperty("fields")) ? snuslashcommands[shortcut].fields || "" : "";
    } catch (e) { }

    if (fields) {
        snuslashcommands[shortcut].fields
        var url = "api/now/table/" + targeturl.replace("_list.do", "") +
            "&sysparm_display_value=true&sysparm_exclude_reference_link=true&sysparm_suppress_pagination_header=true&sysparm_limit=10" +
            "&sysparm_fields=sys_id," + fields;

        var table = url.match(/.*\/(.*)\?/)[1]
        loadXMLDoc(g_ck, url, null, function (jsn) {
            var directlinks = '';
            var results = jsn.result;
            if (jsn.hasOwnProperty('result')) {
                Object.entries(results).forEach(([key, val]) => {
                    directlinks += '> <a target="gsft_main" href="' + table + ".do?sys_id=" + val.sys_id + '">' + val[fields] + '</a><br />';
                });
            }
            window.top.document.getElementById('snudirectlinks').innerHTML = DOMPurify.sanitize(directlinks, { ADD_ATTR: ['target'] });
            window.top.document.getElementById('snudirectlinks');
            window.top.document.querySelectorAll("#snudirectlinks a").forEach(function (elm) { elm.addEventListener("click", hideSlashCommand) });

        })
    }
}


function addFilterListener() {
    if (document.getElementById('filter') == null) return;
    document.getElementById('filter').addEventListener('keyup', function (e) {
        if (e.currentTarget.value.match(/^[0-9a-f]{32}$/) != null && e.key == 'Enter') {//is a sys_id
            searchSysIdTables(e.currentTarget.value);
        }
        else if (e.currentTarget.value == "/") {
            e.preventDefault();
            e.currentTarget.value = "";
            showSlashCommand();
        }
    });
}
function addSlashCommandListener() {
    if (window.top.document.getElementById('snufilter') == null) return;
    if (window.top.document.getElementById('snufilter').classList.contains('snu-slashcommand')) return;
    window.top.document.getElementById('snufilter').classList.add('snu-slashcommand');

    window.top.document.getElementById('snufilter').addEventListener('keydown', function (e) {
        if (e.key == 'ArrowDown') { e.preventDefault(); snuMaxHints = 1000; snuIndex++; };
        if (e.key == 'ArrowUp') {
            e.preventDefault();
            if (snuIndex == 0)
                snuMaxHints = 10;
            else
                snuIndex--;
        }

        if (e.key == 'Meta' || e.key == 'Control' || e.key == 'ArrowLeft') return;
        if (e.currentTarget.selectionStart < e.currentTarget.value.length && e.key == 'ArrowRight') return;
        if (e.key == 'Escape' || (e.currentTarget.value.length <= 1 && e.key == 'Backspace')) hideSlashCommand();
        var sameWindow = !(e.metaKey || e.ctrlKey) && (window.top.document.getElementById('gsft_main') != null);
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
        var selectFirst = (e.key == " " || e.key == "Tab" || e.key == "Enter") && !snufilter.includes(" ");
        var thisKey = (e.key.trim().length == 1) ? e.key : ""; //we may need to add this as we are capturing keydown
        if (e.key == '\\') {
            e.currentTarget.value = (e.currentTarget.value + window.top.document.snuSelection).trim();
            thisKey = "";
            e.preventDefault();
        }
        if (noSpace) idx = snufilter.length;
        var originalShortcut = ((snufilter.slice(0, idx) + ((noSpace) ? thisKey : ""))).toLowerCase();

        if (e.key == 'Backspace' && noSpace) originalShortcut = originalShortcut.slice(0, -1);
        var shortcut = snufilter.slice(0, idx).toLowerCase();
        if (snuPropertyNames.length > 1 && snuIndex >= 0 && ["ArrowDown", "ArrowUp", "Enter", "Tab", " "].includes(e.key)) {
            shortcut = snuPropertyNames[snuIndex];
            idx = snufilter.indexOf(' ');
        }
        var query = snufilter.slice(idx + 1);
        var tmpshortcut = shortcut + (e.key.length == 1 ? e.key : "")
        if (e.key == 'ArrowRight' || ((shortcut.length == 3 || tmpshortcut.includes('*')) && e.key.length == 1 && e.key != " ") && !query) { snuGetTables(tmpshortcut) };


        var targeturl = snuslashcommands.hasOwnProperty(shortcut) ? snuslashcommands[shortcut].url || "" : "";

        if (typeof g_form == 'undefined') {
            try { //get if in iframe
                g_form = document.getElementById('gsft_main').contentWindow.g_form;
            } catch (e) { }
        }
        if (typeof g_form !== 'undefined') {
            targeturl = targeturl.replace(/\$table/g, g_form.getTableName());
            targeturl = targeturl.replace(/\$sysid/g, g_form.getUniqueValue());
        }


        if (targeturl.startsWith("//")) { //enable to use ie '/dev' as a shortcut for '/env acmedev'
            snufilter = snuslashcommands[shortcut].url.substr(2);
            var idx = snufilter.indexOf(' ')
            if (idx == -1) idx = snufilter.length;
            shortcut = snufilter.slice(0, idx).toLowerCase();
            query = snufilter.slice(idx + 1).replace(/ .*/, '');;
            targeturl = (snuslashcommands[shortcut].url || "");
        }

        var switchText = '<br /> Options:<br />';
        if (['nav', 'fav', 'hist'].includes(shortcut)) {

            snuGetNav(shortcut);
            switchText = snuGetNavHints(shortcut, query + thisKey);
        }
        if (targeturl.includes('sysparm_query=') || originalShortcut.startsWith("-")) {
            if (originalShortcut.startsWith("-")) query = shortcut;
            var extraParams = "";
            var unusedSwitches = Object.assign({}, snuslashswitches);
            var switches = (query + thisKey).match(/\-([a-z]*)(\s|$)/g);
            var linkSwitch = false; //determine if this is a switch that converts the entire hyperlink
            if (switches) {
                Object.entries(switches).forEach(([key, val]) => {
                    var prop = val.replace(/\s|\-/g, '');
                    if (snuslashswitches.hasOwnProperty(prop) && !linkSwitch) {
                        query = query.replace(val, "");
                        if (snuslashswitches[prop].type == "link") {
                            var tableName = targeturl.split("_list.do")[0] || "{}";
                            targeturl = snuslashswitches[prop].value.replace(/\$0/, tableName);
                            linkSwitch = true;
                            unusedSwitches = {};
                            switchText = '<br /> Options:<br />'; //reset switchtext
                        }
                        else if (snuslashswitches[prop].value.startsWith("^")) {
                            targeturl += snuslashswitches[prop].value;
                        }
                        else {
                            extraParams += snuslashswitches[prop].value;
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

        if ((targeturl.includes("sysparm_query=") || !snuslashcommands.hasOwnProperty(shortcut)) && snuOperators.some(opp => (query + (e.key.length == 1 ? e.key : "")).includes(opp))) { //detect encodedquery and replace if found
            targeturl = targeturl.replace(/sysparm_query=(.*)/g, "sysparm_query=" + query + (e.key.length == 1 ? e.key : ""));
            switchText = '<br />Encodedquery detected<br /><br />'
        }
        targeturl = targeturl.replace(/\$0/g, query + (e.key.length == 1 ? e.key : ""));
        //if (e.key != 'Enter' && (query.length > 1 || e.key == 'ArrowRight' )) snuGetDirectLinks(targeturl, shortcut);
        if (e.key == 'ArrowRight') snuGetDirectLinks(targeturl, shortcut);

        if (e.key == 'Enter') {
            shortcut = shortcut.replace(/\*/g, '');
            snufilter = snufilter.replace(/\*/g, '');
            idx = (snufilter.indexOf(' ') == -1) ? snufilter.length : snufilter.indexOf(' ');
            query = snufilter.slice(idx + 1);

            if (['nav', 'fav', 'hist'].includes(shortcut)) {
                e.preventDefault();
                return;
            }
            if (shortcut.match(/^[0-9a-f]{32}$/) != null) {//is a sys_id

                searchSysIdTables(shortcut);
                hideSlashCommand();
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
                hideSlashCommand();
                return;

                // var outp = "Please review in the new Slaschcommands tab in the popup";
                // showAlert("Slashcommands <a href='https://www.youtube.com/watch?v=X6HLCV_ptQM&list=PLTyELlWS-zjSIPIs4ukRCrqc4LRHva6-L' target='_blank'>Playlist on YouTube</a><br />Start with a slash command ie '/br parent' for business Rules containing parent in name<br />" +
                //     "Go to settings tab in popup to manage custom / commands <br />" +
                //     "Current commands:<pre contenteditable='true' spellcheck='false'>" + outp + "</pre>", "info", 100000);

            }
            else if (shortcut == "token") {
                postRequestToScriptSync();
                showAlert("Trying to send current token to VS Code", "info");
                hideSlashCommand();
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
                hideSlashCommand();
                return;
            }
            else if (shortcut == "s2") {
                if (typeof snuS2Ify != 'undefined') snuS2Ify();
                hideSlashCommand();
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
                hideSlashCommand();
                return;
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
                }
                return;
            }
            else if (shortcut === 'xmlsrc') {

                if (typeof g_form == 'undefined') {
                    //showAlert("No form found","warning",2000)
                    hideSlashCommand();
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
                hideSlashCommand();
                return;
            }
            else if (shortcut == "tn") {
                var iframes = window.top.document.querySelectorAll("iframe");
                iframes.forEach((iframe) => {
                    if (typeof iframe.contentWindow.addTechnicalNames != 'undefined')
                        iframe.contentWindow.addTechnicalNames();
                });
                addTechnicalNames();

                window.top.document.getElementById('snufilter').value = '';
                hideSlashCommand();
                return;
            }
            else if (shortcut.startsWith("-")) {
                var doc = document.gsft_main || document;
                if (typeof doc.GlideList2 != 'undefined') {
                    var qry = doc.GlideList2.get(doc.jQuery('#sys_target').val());
                    if (typeof qry != 'undefined') {
                        if (targeturl.includes("{}")) {
                            targeturl = targeturl.replace('{}', qry.getTableName());
                            window.open(targeturl, '_blank');
                        }
                        else {
                            var newQ = qry.filter.replace(targeturl, "")
                            qry.setFilterAndRefresh(newQ + targeturl);
                        }
                        hideSlashCommand();
                        return;
                    }
                }
                if (typeof doc.g_form != 'undefined') {
                    if (targeturl.includes("{}")) {
                        targeturl = targeturl.replace('{}', g_form.getTableName());
                    }
                    else {
                        targeturl = "/" + g_form.getTableName() + "_list.do?sysparm_query=" + targeturl;
                    }
                    window.open(targeturl, '_blank');
                }
                hideSlashCommand();
                return;

            }
            else if (shortcut == "uh") {
                var iframes = window.top.document.querySelectorAll("iframe");
                iframes.forEach((iframe) => {
                    if (typeof iframe.contentWindow.unhideFields != 'undefined')
                        iframe.contentWindow.unhideFields();
                });
                unhideFields();
                window.top.document.getElementById('snufilter').value = '';
                hideSlashCommand();
                return;
            }
            else if (shortcut == "unimp") {
                e.preventDefault();
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        location.reload();
                    }
                };
                xhttp.open("POST", "sys_unimpersonate.do", true);
                xhttp.setRequestHeader("X-UserToken", g_ck);
                xhttp.send();
                return;
            }
            else if (shortcut == "lang") {
                {

                    if (query.length != 2) {
                        alert("Please provide a 2 character language code like 'en'");
                        return;
                    }
                    var payload = { "current": query };

                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4) {
                            location.reload();
                        }
                    };
                    xhttp.open("PUT", "/api/now/ui/concoursepicker/language", true);
                    xhttp.setRequestHeader("Accept", "application/json, text/plain, */*");
                    xhttp.setRequestHeader("Cache-Control", "no-cache");
                    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    xhttp.setRequestHeader("X-UserToken", g_ck);
                    xhttp.setRequestHeader("X-WantSessionNotificationMessages", true)
                    xhttp.send(JSON.stringify(payload));

                    return;
                }
            }
            else if (!snuslashcommands.hasOwnProperty(shortcut)) {

                var inIFrame = (shortcut == snufilter.slice(0, idx) && sameWindow)
                if (e.target.className == "snutils") inIFrame = false;

                if (shortcut.includes('.do')) {
                    if (inIFrame) {
                        jQuery('#gsft_main').attr('src', shortcut);
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
                    hideSlashCommand();
                    return;
                }
                else if (shortcut.length > 4) { //try to open table list if shortcut nnot defined and 5+ charaters
                    var url = shortcut + "_list.do?sysparm_filter_pinned=true&sysparm_query=" + query;

                    if (inIFrame) {
                        jQuery('#gsft_main').attr('src', url);
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
                    hideSlashCommand();
                    return;
                }
                else {
                    //showAlert("Shortcut not defined: /" + shortcut, "warning");
                    return;
                }
            }

            var inIFrame = !targeturl.startsWith("http") && !targeturl.startsWith("/") && sameWindow;
            if (e.target.className == "snutils") inIFrame = false;

            if (query.split(" ").length > 0) {  //replace $1,$2 for Xth word in string
                var queryArr = query.split(" ");
                for (var i = 0; i <= queryArr.length; i++) {
                    var re = new RegExp("\\$" + (i + 1), "g");
                    targeturl = targeturl.replace(re, queryArr[i] || "");
                }
            }

            if (inIFrame) {
                jQuery('#gsft_main').attr('src', targeturl);
            }
            else {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                    e.preventDefault();
                    window.location = targeturl;
                }
                else {
                    window.open(targeturl, '_blank');
                }
            }
            hideSlashCommand();
        }
        else {
            snuShowSlashCommandHints(originalShortcut, selectFirst, switchText, e);
        }

    });
}

function snuShowSlashCommandHints(shortcut, selectFirst, switchText, e) {

    if (!["ArrowDown", "ArrowUp", "Enter", "Tab", " "].includes(e.key) || snuIndex > snuPropertyNames.length) {
        snuIndex = 0;
    }

    if ((e.ctrlKey || e.metaKey) && e.key == 'v' && shortcut == 'v') {
        //asume a sys_id when pasting for correct 'autocomplete'
        shortcut = "00000000000000000000000000000000";
    }

    var startswith = true;
    if (shortcut.includes('*')) { //wildcardsearch when includes *
        shortcut = shortcut.replace(/\*/g, '');
        startswith = false;
    }

    snuPropertyNames = Object.keys(snuslashcommands).filter(function (propertyName) {
        if (startswith)
            return propertyName.indexOf(shortcut) === 0;
        return propertyName.indexOf(shortcut) > -1;
    }).sort();


    var fltr = window.top.document.getElementById('snufilter');

    // if (snuPropertyNames.length == 0 && fltr.value.includes(" ")){
    //     snuPropertyNames = ["nav"];
    //     shortcut = "nav"
    //     fltr.value = "/nav " + fltr.value.replace("/","");
    // }

    if (snuPropertyNames.length > 0 && selectFirst) { //select first hit when tap or space pressed
        if (e) e.preventDefault();
        shortcut = snuPropertyNames[snuIndex];
        snuPropertyNames = [snuPropertyNames[snuIndex]];
        if (!fltr.value.includes(" ")) {
            fltr.value = "/" + shortcut + ' ';
        }
    }

    var html = "";
    for (i = 0; i < snuPropertyNames.length && i < snuMaxHints; i++) {
        var cssclass = (snuIndex == i) ? 'active' : '';
        var lbl = ((snuslashcommands[snuPropertyNames[i]].fields || "") ? "<span>⇲ </span>" : "") + snuEncodeHtml(snuslashcommands[snuPropertyNames[i]].hint);
        html += "<li id='cmd" + snuPropertyNames[i] + "' data-index='" + i + "' class='cmdfilter " + cssclass + "' ><span class='cmdkey'>/" + snuPropertyNames[i] + "</span> " +
            "<span class='cmdlabel'>" + lbl + "</span></li>"
        if (fltr.value.includes(" ")) {
            break;
        }
    }

    if (snuPropertyNames.length > snuMaxHints) {
        html += "<li class='cmdexpand' data-shortcut='" + shortcut + "' ><span  class='cmdkey'>+" + (snuPropertyNames.length - snuMaxHints) + "</span> ▼ show all</span></li>";
    }

    if (!html && shortcut.replace(/ /g, '').length == 32) {
        html += "<li class='cmdfilter' ><span class='cmdfilter cmdkey'>/sys_id</span> " +
            "<span class='cmdlabel'>Instance search</span></li>"
    }
    if (!html && shortcut.includes(".do")) {
        html += "<li class='cmdfilter' ><span class='cmdkey'>/" + shortcut + "</span> " +
            "<span class='cmdlabel'>Direct navigation</span></li>"
    }
    if (!html && shortcut.length > 5) {
        html += "<li class='cmdfilter' ><span class='cmdkey'>/" + shortcut + "</span> " +
            "<span class='cmdlabel'>Table search &lt;encodedquery&gt; (hit ► to search tables)</span></li>"
    }
    switchText = (switchText.length > 25) ? switchText : ''; //only if string > 25 chars;
    window.top.document.getElementById('snuhelper').innerHTML = DOMPurify.sanitize(html);
    window.top.document.getElementById('snudirectlinks').innerHTML = DOMPurify.sanitize('');
    window.top.document.getElementById('snuswitches').innerHTML = DOMPurify.sanitize(switchText);

    window.top.document.querySelectorAll("#snuhelper li.cmdfilter").forEach(function (elm) { elm.addEventListener("click", setSnuFilter) });
    window.top.document.querySelectorAll("#snuhelper li.cmdexpand").forEach(function (elm) { elm.addEventListener("click", snuExpandHints) });

}

function setSnuFilter() {
    var elm = this;
    if (elm.innerText.length > window.top.document.getElementById('snufilter').value.length) {
        window.top.document.getElementById('snufilter').focus();
        window.top.document.getElementById('snufilter').value = elm.querySelector('.cmdkey').innerText + ' ';
        snuIndex = parseInt(this.dataset.index || 0);
    }
}

function snuExpandHints(shortcut) {
    shortcut = shortcut || this.dataset.shortcut;
    snuMaxHints = 1000;
    var e = new KeyboardEvent('keypress', { 'key': 'KeyDown' });
    snuShowSlashCommandHints(shortcut, false, '', e);
    var elm = window.top.document.getElementById('snufilter');
    elm.focus();
    elm.selectionStart = elm.selectionEnd = elm.value.length;
}


function snuAddSlashCommand(cmd) {
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
    if (typeof snusettings.nouielements == 'undefined') snusettings.nouielements = false;
    if (typeof snusettings.nopasteimage == 'undefined') snusettings.nopasteimage = false;
    if (typeof snusettings.s2ify == 'undefined') snusettings.s2ify = false;
    if (typeof snusettings.addtechnicalnames == 'undefined') snusettings.addtechnicalnames = false;
    if (typeof snusettings.slashoption == 'undefined') snusettings.slashoption = 'on';
    if (typeof snusettings.slashtheme == 'undefined') snusettings.slashtheme = 'dark';

    setShortCuts();

    if (!snusettings.nopasteimage) {
        bindPaste(snusettings.nouielements == false);
    }
    if (snusettings.vsscriptsync == true) {
        addFieldSyncButtons();
        addStudioScriptSync();
        addBGScriptButton();
    }
    if (snusettings.slashoption != "off") {
        addFilterListener();
        addSlashCommandListener();
    }
    if (snusettings.s2ify) {
        if (typeof snuS2Ify != 'undefined') snuS2Ify();
    }

    if (snusettings.nouielements == false) {
        if (typeof addStudioLink != 'undefined') addStudioLink();
        addStudioSearch();
        addSgStudioPlatformLink();
        enhanceNotFound();
        snuPaFormulaLinks();
        snuRemoveLinkLess();
        snuTableCollectionLink();
        newFromPopupToTab();
        createHyperLinkForGlideLists();
        enhanceTinMCE();

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
        addTechnicalNames();
        setTimeout(addTechnicalNamesPortal, 5000);
    }

}

function createHyperLinkForGlideLists() {
    try {
        document.querySelectorAll('div[type=glide_list]').forEach(function (elm) {
            var field = elm.id.split('.')[2];
            var table = g_form.getGlideUIElement(field).reference;
            var hasReferenceTable = table && table !== 'null';
            // if there's no Reference Table, there's no use adding links, values are to be used as-is 
            if (!hasReferenceTable) return;
            var labels = elm.nextSibling.querySelector('p').innerText.split(', ');
            var values = elm.nextSibling.querySelector('input[type=hidden]').value.split(',');
            if (labels.length != values.length) return; //not a reliable match
            var links = [];
            var sysIDRegex = /[0-9a-f]{32}/i;
            for (var i = 0; i < labels.length; i++) {
                if (hasReferenceTable && sysIDRegex.test(values[i]))
                    links.push(`<a href="/${table}.do?sys_id=${values[i]}" target="_blank" />${labels[i]}</a>`);
                else
                    links.push(values[i]);
            }
            var html = links.join(', ');
            elm.nextSibling.querySelector('p').innerHTML = DOMPurify.sanitize(html, { ADD_ATTR: ['target'] });
        })
    } catch (e) { };
}




function doubleClickToShowFieldOrReload() {
    if (typeof g_form != 'undefined') {
        document.addEventListener("dblclick", function (event) {
            if (event.target.classList.contains('label-text') || event.target.parentElement.classList.contains('label-text')) {
                var elm = jQuery(event.target).closest('div.form-group').attr('id').split('.').slice(2).join('.');
                var val = g_form.getValue(elm);
                if (NOW.user.roles.includes('admin')) { //only allow "admin" ti change fields
                    var newValue = prompt('[SN Utils]\nValue of ' + elm, val);
                    if (newValue !== null)
                        g_form.setValue(elm, newValue);
                }
                else {
                    alert('Value of ' + elm + "\n\n" + val);
                }
            }

            else if (jQuery(event.target).hasClass('container-fluid')) {
                location.reload();
            }

        }, true);
    }
}

function doubleClickToSetQueryListV2() {
    //dbl click to view and update filter condition
    jQuery('div.breadcrumb_container').on("dblclick", function (event) {

        if (event.shiftKey) {
            splitContainsToAnd();
        } else {

            var qry = GlideList2.get(jQuery('#sys_target').val());
            var newValue = prompt('[SN Utils]\nFilter condition: ', qry.filter);
            if (newValue !== qry.filter && newValue !== null) {
                qry.setFilterAndRefresh(newValue);
            }
        }
    });

    jQuery('div.breadcrumb_container').on("click", function (event) {
        if (event.shiftKey) {
            splitContainsToAnd();
        }
    });
}

var qry = '';
var qryDisp = '';

function clickToList() {



    if (typeof g_form != 'undefined') {
        document.addEventListener("click", function (event) {

            if ((event.ctrlKey || event.metaKey)) {
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

                    valDisp = g_form.getDisplayBox(elm) ? g_form.getDisplayBox(elm).value : g_form.getValue(elm);

                }
                if (jQuery(event.target).hasClass('container-fluid')) {
                    elm = 'sys_id';
                    val = g_form.getUniqueValue();

                    elmDisp = 'DisplayValue';
                    valDisp = g_form.getDisplayValue();
                }
                if (val == 'none') return;

                if (tpe == 'glide_list' && elm != 'sys_id') {
                    operator = 'LIKE';
                } else if (val.length == 0) {
                    val = '';
                    valDisp = '';
                    operator = 'ISEMPTY';
                } else if (tpe == 'glide_date_time' || tpe == 'glide_date') {

                    operator = 'ON';
                    //do some magic to get encodedquery to generate date
                    var dte = val.substring(0, 10);
                    valDisp = dte;
                    var dateNumber = getDateFromFormat(g_form.getValue(elm), g_user_date_time_format);
                    var dateJs = new Date(dateNumber);
                    dte = dateJs.getFullYear() + '-' +
                        ("0" + (dateJs.getMonth() + 1)).slice(-2) + '-' +
                        ("0" + dateJs.getDate()).slice(-2);

                    val = dte + "@javascript:gs.dateGenerate('" + dte + "','start')@javascript:gs.dateGenerate('" + dte + "','end')";

                } else if (val.length > 60) {
                    val = val.substring(0, 60);
                    valDisp = val;
                    operator = 'LIKE';
                }


                var idx = qry.indexOf(elm + operator);
                if (idx > -1) {
                    qry = qry.replace(elm + operator + val + '^', '');
                    qryDisp = qryDisp.replace(elmDisp + ' ' + operator + ' <b>' + valDisp + '</b> > ', '');
                } else {
                    qry += elm + operator + val + '^';
                    qryDisp += elmDisp + ' ' + operator + ' <b>' + valDisp + '</b> > ';
                }

                var listurl = '/' + tbl + '_list.do?sysparm_query=' + qry;
                g_form.clearMessages();
                if (qry) {
                    var qryDisp2 = qryDisp.substring(0, qryDisp.length - 3);
                    g_form.addInfoMessage('Filter for ' + tbl + ' <a href="javascript:delQry()">delete</a> :<a href="' + listurl + '" target="' + tbl + '">List filter: ' + qryDisp2 + '</a>');
                }
            }
        }, true);
    }
}

function enhanceNotFound(advanced) {

    if (typeof jQuery == 'undefined') return;
    if (!jQuery('#not_the_droids').length) return;
    jQuery('#snutils-suggestions').remove();


    var not_the_droids = jQuery('#not_the_droids').val();
    var query = not_the_droids.split('_list.do');
    var addedQuery = '_list.do' + ((query.length > 1) ? query[1] : '');
    var html = '<div id="snutils-suggestions" style="margin-top:20px"><h4>SN Utils \'did you mean\' table suggestions</h4>';
    if (advanced)
        html += 'Mode: <a href="javascript:enhanceNotFound(0)">starts with: ' + query[0] + '</a> | contains: ' + query[0].replace(/_/g, ' & ') + '<br />';
    else
        html += 'Mode: starts with: ' + query[0] + ' | <a title="splits by underscore and does a contains for each word" href="javascript:enhanceNotFound(1)">contains: ' + query[0].replace(/_/g, ' & ') + '</a><br />';

    html += '<br /><ul>';
    var myurl = '/api/now/table/sys_db_object?sysparm_limit=100&sysparm_fields=name,label&sysparm_query=sys_update_nameISNOTEMPTY^nameNOT LIKE00^EORDERBYlabel^nameSTARTSWITH' + query[0];


    if (advanced) {
        var queryWords = query[0].split('_');
        myurl += '^NQsys_update_nameISNOTEMPTY^nameNOT LIKE00';
        for (var i = 0; i < queryWords.length; i++) {
            myurl += '^nameLIKE' + queryWords[i] + '^OR' + queryWords[i];
        }
    }


    loadXMLDoc(g_ck, myurl, null, function (jsn) {
        var results = jsn.result;
        if (results.length == 0) html += '<li>None found...</li>'
        for (var i = 0; i < results.length; i++) {
            html += '<li style="font-size:11pt"><a href="' + results[i].name + addedQuery + '">' + results[i].label + ' [' + results[i].name + ']</a></li>';
        }
        html += '</ul></div>';
        jQuery('.notfound_message').append(html);

    });






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

        //operator = 'ON';
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
    g_form.clearMessages();
}

/**
 * this solves an issue where e.g. OOTB read-only Script Include content was not copyable
 */
function makeReadOnlyContentCopyable() {
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

function openReference(event, refTable, refField) {
    var url = '/' + refTable + '_list.do?sysparm_query=sys_idIN' + g_form.getValue(refField);
    if ((event.ctrlKey || event.metaKey) && event.keyCode == 83)
        url = '/' + refTable + '?sysparm_query=sys_idIN' + g_form.getValue(refField);
    window.open(url, 'refTable');
}

function openConditions(fieldName) {
    var tableField = g_form.getControl(fieldName).attributes['data-dependent'].value || null;
    var conditions = g_form.getValue(fieldName);
    var url = '/' + g_form.getValue(tableField) + '_list.do?sysparm_query=' + conditions;
    window.open(url, 'condTable');
}

function openTable(fieldName) {
    var url = '/' + g_form.getValue(fieldName) + '_list.do';
    window.open(url, 'condTable');
}


function unhideFields() {
    if (typeof g_form == 'undefined') return; //only on forms and only if admin
    var bulb = '<span class="icon-lightbulb color-orange" title="Field displayed by SN Utils"></span>';
    var sections = g_form.getSectionNames();
    for (var sec = 0; sec < sections.length; sec++) {
        g_form.setSectionDisplay(sections[sec], true);
    }
    for (var ij = 0; ij < g_form.elements.length; ij++) {
        try {


            var hidden = g_form.elements[ij].elementParentNode.getAttribute("style").includes("none");
            if (hidden) {

                jQuery(g_form.elements[ij].elementParentNode).find('label:not(.checkbox-label)').prepend(bulb);
                g_form.setDisplay(g_form.elements[ij].fieldName, true);
            }
        } catch (e) { };
    }
}

function snuShowScratchpad() {
    g_form.addInfoMessage("Scratchpad: <br/><pre style='white-space: pre-wrap;'>" + JSON.stringify(g_scratchpad || {}, 2, 2) + "</pre>");
}

function toggleLabel() {
    jQuery('span.label-orig, span.label-tech, span.label-snu').toggle();
}

function addTechnicalNamesPortal() {
    if (typeof window?.NOW?.sp != 'undefined') { //basic serviceportal names
        document.querySelectorAll('label.field-label, span.type-boolean').forEach(function (lbl) {
            try {
                var fld = angular.element(lbl).scope().field.name;
                if (!lbl.innerText.includes('|')) {
                    jQuery(lbl).append(' | <span style="font-family:monospace; font-size:small;">' + fld + '</span> ');
                }
            } catch (e) { }
        })
    }
}


function addTechnicalNames() {

    addTechnicalNamesWorkspace();

    if (typeof jQuery == 'undefined') return; //not in studio

    addTechnicalNamesPortal();

    if (typeof g_form != 'undefined') {
        try {
            jQuery('h1.navbar-title div.pointerhand').css("float", "left");
            jQuery("h1.navbar-title:not(:contains('|'))").append('&nbsp;| <span style="font-family:monospace; font-size:small;">' + g_form.getTableName() +
                ' <a onclick="snuShowScratchpad()">[scratchpad]</a><a title="For easier copying of field names" onclick="toggleLabel()">[toggle label]</a> </span>');
            jQuery(".label-text:not(:contains('|'))").each(function (index, value) {
                jQuery('label:not(.checkbox-label)').removeAttr('for'); //remove to easier select text
                jQuery('label:not(.checkbox-label)').removeAttr('onclick')
                try {
                    var elm = jQuery(this).closest('div.form-group').attr('id').split('.').slice(2).join('.');
                } catch (e) {
                    return true; //issue #42
                }

                var fieldType = jQuery(this).closest('[type]').attr('type') || jQuery(this).text().toLowerCase();
                let linkBtn = '', linkAttrs;
                if (fieldType == 'reference' || fieldType == 'glide_list') {
                    var reftable = g_form.getGlideUIElement(elm).reference;
                    linkAttrs = {
                        onclick: "openReference('" + reftable + "','" + elm + "',event);",
                        title: 'Open reference table list (click) or record (ctrl+click): ' + reftable
                    };
                }
                else if (fieldType == 'conditions') {
                    linkAttrs = {
                        onclick: "openConditions('" + elm + "');",
                        title: 'Preview condition in list'
                    };
                }
                else if (fieldType == 'table_name') {
                    linkAttrs = {
                        onclick: 'openTable(\'' + elm + '\');',
                        title: 'Open table in list'
                    };
                }
                if (linkAttrs) {
                    linkBtn = '<a class="" style="margin-left:2px; " onclick="' + linkAttrs.onclick + '" title="' +
                        linkAttrs.title + '" target="_blank">' + elm + '</a>';
                }
                jQuery(this).html('<span style="font-family:monospace; display:none" class="label-tech">' + elm + '</span><span class="label-orig">' + this.innerHTML + ' | </span><span class="label-snu" style="font-family:monospace; ">' + (linkBtn || elm) + '</span>');
                //jQuery(this).closest('a').replaceWith(function () { return jQuery(this).contents(); });
                jQuery(this).closest('a').replaceWith(function () {
                    var cnt = this.innerHTML; var hl = this; hl.innerHTML = DOMPurify.sanitize("↗"); hl.title = "-SN Utils Original hyperlink-\n" + hl.title; hl.target = "_blank";
                    return DOMPurify.sanitize(hl.outerHTML + " " + cnt, { ADD_ATTR: ['target'] });
                });
            });



        } catch (error) {

        }
    }

    if (jQuery('.snuiaction').length == 0) {
        jQuery('.action_context').each(function () {
            var si = jQuery(this).attr('gsft_id');
            if (si)
                jQuery("<a class='snuiaction' onclick='snuUiActionInfo(event, \"" + si + "\")' title='SN Utils: Click to open UI Action\nCTRL/CMD Click to view sys_id' style='margin-left:-2px'>? </a>").insertAfter(this);
        });
    }

    jQuery('th.list_hdr, th.table-column-header').each(function (index) {
        var tname = jQuery(this).attr('name') || jQuery(this).data('column-name');
        if (jQuery(this).find('a.list_hdrcell, a.sort-columns').text().indexOf('|') == -1)
            jQuery(this).find('a.list_hdrcell, a.sort-columns').append(' | <span style="font-family:monospace; font-size:small;">' + tname + '</span> ');
    });

    //also show viewname
    var viewName = jQuery('input#sysparm_view').val();
    if (viewName && !jQuery('i.viewName').length)
        jQuery('.section-content').first().prepend('<i class="viewName">Viewname: ' + viewName + '</i><br /> ');

    showSelectFieldValues();
    searchLargeSelects();
    createHyperLinkForGlideLists();
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

function openReference(refTable, refField, evt) {
    var sysIds = g_form.getValue(refField);
    var url = '/' + refTable + '_list.do?sysparm_query=sys_idIN' + sysIds;
    if ((evt.ctrlKey || evt.metaKey || !sysIds.includes(',')) && sysIds)
        url = '/' + refTable + '.do?sysparm_query=sys_idIN' + sysIds;
    window.open(url, 'refTable');
}

function showSelectFieldValues() {
    if (typeof jQuery == 'undefined') return; //not in studio
    if (location.pathname == "/sys_report_template.do") return; //not in report builder

    jQuery('option').not(":contains('|')").each(function (i, el) {
        var jqEl = jQuery(el);
        jqEl.html(el.text + ' | ' + el.value);
    });

    jQuery('#tableTreeDiv td.tree_item_text > a').not(":contains('|')").each(function (i, el) {
        var jqEl = jQuery(el);
        jqEl.html(el.text + ' | ' + el.name);
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
    jQuery('.form_action_button_container').append("<span style='font-weight:bold; margin-top:15px;' class='>navigation_link action_context default-focus-outline'><a href='" +
        newUrl + "' title='Link added by SN Utils (This is NOT a UI Action!)' >Show Related links</a></span>");
}


function snuTableCollectionLink() {
    if (location.pathname != "/sys_db_object.do") return;
    if (typeof jQuery == 'undefined') return;
    var tbl = g_form.getValue('name');
    jQuery('.related_links_container').append("<li style='font-weight:bold; margin-top:15px;' class='>navigation_link action_context default-focus-outline'><a href='sys_dictionary.do?sysparm_query=name=" +
        tbl + "^internal_type=collection^' title='Link added by SN Utils (This is NOT a UI Action!)' >Collection Dictionary Entry</a></li>");

}



function searchLargeSelects() {

    if (typeof jQuery.fn.filterByText == 'undefined') {
        jQuery.fn.filterByText = function (textbox, selectSingleMatch) {
            return this.each(function () {
                var select = this;
                var options = [];
                jQuery(select).find('option').each(function () {
                    options.push({
                        value: jQuery(this).val(),
                        text: jQuery(this).text()
                    });
                });
                jQuery(select).data('options', options);
                jQuery(textbox).bind('change keyup', function () {
                    var options = jQuery(select).empty().data('options');
                    var search = jQuery.trim(jQuery(this).val());
                    var regex = new RegExp(search, "gi");

                    jQuery.each(options, function (i) {
                        var option = options[i];
                        if (option.text.match(regex) !== null) {
                            jQuery(select).append(
                                jQuery('<option>').text(option.text).val(option.value)
                            );
                        }
                    });
                    if (selectSingleMatch === true && jQuery(select).children().length === 1) {
                        jQuery(select).children().get(0).selected = true;
                    }
                });
            });
        };
    }


    var minItems = 25;

    jQuery('select:not(.searchified, .select2, .select2-offscreen, #application_picker_select, #update_set_picker_select)').each(function (i, el) {
        if (jQuery(el).find('option').length >= minItems && el.id != 'slush_right') {
            var input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Filter choices...";
            input.className = "form-control";
            input.style.marginBottom = "2px";

            jQuery(el).before(input).filterByText(input, true).addClass('searchified');
        }

        if (el.id == 'slush_right') {
            var input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Add dotwalk field";
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
            jQuery(el).after(input).addClass('searchified');
        }

    });
}


function setShortCuts() {


    var divstyle;

    if (snusettings.slashtheme == 'light') {
        divstyle = `<style>
        div.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; z-index:1000000000; font-size:8pt; position: fixed; top: 10px; left: 10px; min-height:50px; padding: 5px; border: 1px solid #E3E3E3; background-color:#FFFFFFF7; border-radius:2px; min-width:320px; }
        div.snuheader {font-weight:bold; margin: -4px; background-color:#e5e5e5}
        ul#snuhelper { list-style-type: none; padding-left: 2px; overflow-y: auto; max-height: 80vh; } 
        ul#snuhelper li {margin-top:2px}
        span.cmdkey { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; border:1pt solid #e3e3e3; background-color:#f3f3f3; min-width: 40px; cursor: pointer; display: inline-block;}
        input.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; outline: none; font-size:10pt; font-weight:bold; width:99%; border: 1px solid #ffffff; margin:8px 2px 4px 2px; background-color:#ffffff }
        span.cmdlabel { color: #333333; font-size:7pt; font-family:verdana, arial }
        a.cmdlink { font-size:10pt; color: #1f8476; }
        ul#snuhelper li:hover span.cmdkey, ul#snuhelper li.active span.cmdkey { border-color: #8BB3A2}
        ul#snuhelper li.active span.cmdlabel { color: black}
        div#snudirectlinks {margin: -5px 10px;}
        div#snudirectlinks a {color:#22885c;}
        </style>`;
    }
    else if (snusettings.slashtheme == 'stealth') {
        divstyle = `<style>
        div.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; z-index:1000000000; font-size:10pt; position: fixed; top: 1px; left: 1px; padding: 0px; border: 0px; min-width:30px; }
        div.snuheader {display:none}
        ul#snuhelper { display:none } 
        ul#snuhelper li {display:none}
        span.cmdkey {display:none}
        input.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; outline: none; font-size:8pt; background: transparent; text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white; width:100%; border: 0px; margin:8px 2px 4px 2px; }
        span.cmdlabel { display:none }
        a.cmdlink { display:none }
        div#snudirectlinks {display:none;}
        </style>`;
    }
    else {
        divstyle = `<style>
        div.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; color:#ffffff; z-index:1000000000; font-size:8pt; position: fixed; top: 10px; left: 10px; min-height:50px; padding: 5px; border: 1px solid #030303; background-color:#000000F7; border-radius:2px; min-width:320px; }
        div.snuheader {font-weight:bold; margin: -4px; background-color:#333333}
        ul#snuhelper { list-style-type: none; padding-left: 2px; overflow-y: auto; max-height: 80vh;} 
        ul#snuhelper li {margin-top:2px}
        span.cmdkey { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; border:1pt solid #00e676; background-color:#00e676; color: #000000; min-width: 40px; cursor: pointer; display: inline-block;}
        input.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; outline: none; font-size:10pt; color:#00e676; font-weight:bold; width:100%; border: 1px solid #000000; margin:8px 2px 4px 2px; background-color:#000000F7 }
        span.cmdlabel { color: #FFFFFF; font-size:7pt; }
        a.cmdlink { font-size:10pt; color: #1f8476; }
        ul#snuhelper li:hover span.cmdkey, ul#snuhelper li.active span.cmdkey  { border-color: yellow}
        ul#snuhelper li.active span.cmdlabel { color: yellow}
        div#snudirectlinks {margin: -5px 10px;}
        div#snudirectlinks a {color:#1cad6e;}
        </style>`;
    }



    var htmlFilter = document.createElement('div');
    var cleanHTML = DOMPurify.sanitize(divstyle +
        `<div class="snutils" style="display:none;"><div class="snuheader"><a id='cmdhidedot' class='cmdlink'  href="#">
    <svg style="height:16px; width:16px;"><circle cx="8" cy="8" r="5" fill="#FF605C" /></svg></a> SN Utils Slashcommands<span style="float:right; font-size:6pt; line-height: 16pt;"><a href="https://twitter.com/sn_utils" target="_blank">@sn_utils</a>&nbsp;</span></div>
    <input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" id="snufilter" name="snufilter" class="snutils" type="text" placeholder='SN Utils Slashcommand' > </input>
    <ul id="snuhelper"></ul>
    <div id="snudirectlinks"></div>
    <div id="snuswitches"></div>
    </div>`, { FORCE_BODY: true });
    htmlFilter.innerHTML = cleanHTML
    if (!window.top.document.querySelectorAll('#snufilter').length) { //prevent reinject 
        window.top.document.body.appendChild(htmlFilter);
        window.top.document.getElementById('cmdhidedot').addEventListener('click', hideSlashCommand);
        window.top.document.getElementById('snufilter').addEventListener('focus', function () { this.select() });
    }
    addSlashCommandListener();

    document.addEventListener("keydown", function (event) {

        if (event.key == '/') {
            if (snusettings.slashoption == 'off') return;
            var isActive = (location.host.includes("service-now.com") && snusettings.slashoption == 'on') || event.ctrlKey || event.metaKey;
            if (isActive) {
                if (!["INPUT", "TEXTAREA", "SELECT"].includes(event.srcElement.tagName) && !event.srcElement.hasAttribute('contenteditable') && !event.srcElement.tagName.includes("-") ||
                    (event.ctrlKey || event.metaKey) && !event.srcElement.hasAttribute('aria-describedby')) { //not when form element active
                    event.preventDefault();
                    showSlashCommand();
                }
            }
        }

        //a few specific for forms
        if (typeof g_form != 'undefined') {
            mySysId = g_form.getUniqueValue();
            var action;
            if ((event.ctrlKey || event.metaKey) && event.keyCode == 83) { //cmd-s

                event.preventDefault();
                var doInsertStay = false;
                if (event.shiftKey) {
                    doInsertStay = document.querySelectorAll('#sysverb_insert_and_stay').length;
                    if (!doInsertStay) {
                        g_form.addWarningMessage("Insert and Stay not available for this record (SN Utils Exentsion)");
                        return false;
                    }
                }
                action = (g_form.newRecord || doInsertStay) ? "sysverb_insert_and_stay" : "sysverb_update_and_stay";
                gsftSubmit(null, g_form.getFormElement(), action);
                return false;
            }
            else if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.keyCode == 85) { //cmd-shift-u 
                unhideFields();
            }
            else if ((event.ctrlKey || event.metaKey) && event.keyCode == 85) { //cmd-u 
                event.preventDefault();
                action = (g_form.newRecord) ? "sysverb_insert" : "sysverb_update";
                gsftSubmit(null, g_form.getFormElement(), action);
                return false;
            }

        }

    }, false);

}

function splitContainsToAnd() {
    var qry = GlideList2.get(jQuery('#sys_target').val());
    var qa = qry.filter.split("^");
    var qaNew = [];
    for (var i = 0; i < qa.length; i++) {
        var re = qa[i].match(/LIKE(.*)/);
        if (re) {
            var words = re[1].split(" ");
            for (var j = 0; j < words.length; j++) {
                var qs = re.input.substring(0, re.index) + "LIKE" + words[j];
                qaNew.push(qs);
            }
        } else
            qaNew.push(qa[i]);
    }
    qry.setFilterAndRefresh(qaNew.join("^"));

}

function enhanceTinMCE() {
    if (typeof (tinymce) == 'undefined') return;
    var editor = tinymce.activeEditor;
    if (typeof editor === 'undefined' || editor == null) return;
    if (editor.buttons.hasOwnProperty('snexp')) return;
    editor.addButton('snexp', {
        text: '+/-',
        title: 'SN Utils: Add template to expand collapse content',
        onclick: function () {
            editor.insertContent('<details style="padding-bottom:10px; padding-top:10px"><summary style="font-size:14pt; font-weight:bold;">SubTitle</summary><p>Expand and collapse this block.</p></details>');
        }
    });

    var bg = editor.theme.panel.find('toolbar buttongroup')[editor.theme.panel.find('toolbar buttongroup').length - 1];
    bg._lastRepaintRect = bg._layoutRect;
    bg.append(editor.buttons['snexp']);
}

function bindPaste(showIcon) {

    if (typeof g_form != 'undefined') {

        if (showIcon && jQuery != 'undefined')
            jQuery('#header_add_attachment').after('<button id="header_paste_image" title="Paste screenshot as attachment" class="btn btn-icon glyphicon glyphicon-paste navbar-btn" aria-label="Paste Image as Attachments" data-original-title="Paste Image as Attachments" onclick="tryPaste()"></button>');
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
function newFromPopupToTab() {
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



function tryPaste() {
    if (!document.execCommand('paste')) {
        g_form.clearMessages();
        g_form.addInfoMessage("Please hit cmd-v or ctrl-v if you want to paste a copied screenshot as attachment to this record. (SN Utils Exentsion)");
    }
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

function snuSaveImage(imgData, fileInfo, tableName, sysId) {

    var URL = "/api/now/attachment/file?table_name=" +
        tableName + "&table_sys_id=" + sysId + "&file_name=" + fileInfo.name;



    var request = new XMLHttpRequest();
    request.open("POST", URL, true);
    request.setRequestHeader('Cache-Control', 'no-cache');
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', fileInfo.type);
    if (g_ck) request.setRequestHeader('X-UserToken', g_ck);

    request.onload = function (resp) {
        if (this.status >= 200 && this.status < 400) {
            var r = JSON.parse(this.response);
            if (typeof g_form != 'undefined') {
                g_form.clearMessages();
                g_form.addInfoMessage("<span>Pasted image added as attachment<br /><a href='/" + r.result.sys_id + ".iix' target='myimg'><img src='" + r.result.sys_id + ".iix?t=small' alt='upload' style='display:inline!important; padding:20px;'/></a><br />" +
                    `<div class="input-group">
                <input id='tbxImageName' onKeyUp='if (event.keyCode == 13) renamePasted("` + r.result.sys_id + `")' type="text" value="` + r.result.file_name.replace('.png', '') + `" style='width:200px;'class="form-control" placeholder="Image name">
                <span class="input-group-btn" style="display: inline; ">
                <button class="btn btn-primary" onClick='renamePasted("` + r.result.sys_id + `")' style="width: 80px;" type="button">.png Save..</button>
                </span>
            </div><span id='divRenamed'></span></form>`);
                jQuery('#tbxImageName').focus().select();
            }
        } else {
            //callback(this);
        }
    };
    request.onerror = function (error) {
        console.log(error);
        if (typeof g_form != 'undefined') {
            g_form.clearMessages();
            g_form.addErrorMessage(error.responseJSON.error.detail);
        }
    };
    request.send(imgData);
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
    if (typeof g_ck != 'undefined')
        client.setRequestHeader('X-UserToken', g_ck);

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

function getListV3Fields() {
    try {
        //g_list.filter,g_list.tableName,g_list.sortBy,g_list.sortDir,g_list.,g_list.fields

        if (document.getElementsByClassName('list-container').length == 0) return false;
        if (document.getElementById('related_lists_wrapper') != null) return false; //not on form with related lists

        var ang = angular.element('.list-container').scope().$parent.$parent;


        for (var i = 0; i < ang.data.columns.length; i++) {
            fields.push(ang.data.columns[i].name);
        }
        g_list = {
            "filter": ang.queryString,
            "tableName": ang.table,
            "sortBy": ang.data.filterWidgetConfig.sort[0].column_name,
            "sortDir": ang.data.filterWidgetConfig.sort[0].ascending ? "ASC" : "DESC",
            "rowsPerPage": ang.parameters.sysparm_limit,
            "fields": fields.toString()

        };
        //dbl click to view and update filter condition
        jQuery('div.breadcrumb-container').on("dblclick", function (event) {
            var qry = angular.element('.list-container').scope().$parent.$parent.queryString;
            var newValue = prompt('[SN Utils]\Filter condition:', qry);
            if (newValue !== qry && newValue !== null) {
                qry = angular.element('.list-container').scope().$parent.$parent.queryString = newValue || '';
                setTimeout(function () {
                    angular.element('.list-container').scope().$parent.$parent.updateList();
                }, 300);
            }
        });

    } catch (err) {
        console.log(err);

    }
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

function getFormElementNames() {
    if (typeof g_form !== 'undefined') {
        var elArr = [];
        for (i = 0; i < g_form.elements.length; i++) {
            elArr.push(g_form.elements[i].fieldName);
        }
        elNames = (elArr.toString());
    }

}
getFormElementNames();

function loadXMLDoc(token, url, post, callback) {
    try {

        var method = "GET";
        if (post) method = "PUT";

        var request = new XMLHttpRequest();
        request.open(method, url, true);
        request.setRequestHeader('Cache-Control', 'no-cache');
        request.setRequestHeader('Accept', 'application/json');
        request.setRequestHeader('Content-Type', 'application/json');
        if (token) request.setRequestHeader('X-UserToken', token);

        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                callback(JSON.parse(this.response));
            } else {
                callback(this);
            }
        };
        request.onerror = function () {
            // There was a connection error of some sort
        };
        request.send();

    } catch (error) {
        console.log('Server Request failed (' + error + ')');
    }
}

/**
 * @function startBackgroundScript
 * @param  {String} script   {the script that should be executed}
 * @param  {Function} callback {the function that's called after successful execution (function takes 1 argument: response)}
 * @return {undefined}
 */
function startBackgroundScript(script, callback) {
    try {
        jQuery.ajax({
            url: 'sys.scripts.do',
            method: 'GET', //POST does not work somehow
            headers: {
                'X-UserToken': g_ck,
                'Cache-Control': 'no-cache',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                script: script,
                runscript: "Run script",
                sysparm_ck: g_ck,
                sys_scope: 'e24e9692d7702100738dc0da9e6103dd'
            }
        }).done(function (rspns) {
            callback(rspns);
        }).fail(function (jqXHR, textStatus) {
            showAlert('Background Script failed (' + jqXHR.statusText + ')', 'danger');
        });
    } catch (error) {
        showAlert('Background Script failed (' + error + ')', 'danger');
    }
}

/**
 * @function showAlert
 * @param  {String} msg  {Message to show}
 * @param  {String} type {types: success, info, warning, danger (defaults to 'info')}
 * @param  {Integer} timeout {time to close the flash message in ms (defaults to '3000')}
 * @return {undefined}
 */
function showAlert(msg, type, timeout) {

    if (window.top.document.getElementById('filter') == null || typeof jQuery == 'undefined') {
        alert("FALLBACK MESSAGE GO TO CLASSIC UI FOR FORMATTED MESSAGE\n\n" + msg.replace(/<br \/>/g, "\n"));
        return false;
    }


    msg = '<a href="javascript:hideAlert()">[x] </a> SN Utils: ' + msg;
    if (typeof type == 'undefined') type = 'info';
    if (typeof timeout == 'undefined') timeout = 3000;
    window.top.jQuery('.service-now-util-alert>div>span').html(msg);
    window.top.jQuery('.service-now-util-alert').addClass('visible').show();
    window.top.jQuery('.service-now-util-alert>.notification').addClass('notification-' + type);
    window.top.setTimeout(function () {
        window.top.jQuery('.service-now-util-alert').removeClass('visible').hide();
        window.top.jQuery('.service-now-util-alert>.notification').removeClass('notification-' + type);
    }, timeout);
}

function hideAlert() {
    jQuery('.service-now-util-alert').removeClass('visible');
}
function hideSlashCommand() {
    window.top.document.snuSelection = '';
    if (window.top.document.querySelector('div.snutils') != null) {
        window.top.document.querySelector('div.snutils').style.display = 'none';
        if (window.top.document.getElementById('filter') != null) {
            try {
                if (event.currentTarget.value.length <= 1) {
                    window.top.document.getElementById('filter').focus();
                }
            } catch (e) { }
        }
    }
    return true;
}

function showSlashCommand() {
    window.top.document.snuSelection = getSelectionText();
    if (window.top.document.querySelector('div.snutils') != null) {
        window.top.document.querySelector('div.snutils').style.display = '';
        window.top.document.getElementById('snufilter').value = '/';
        window.top.document.getElementById('snufilter').focus();
        snuShowSlashCommandHints("", false, "", false);
        setTimeout(function () { window.top.document.getElementById('snufilter').setSelectionRange(2, 2); }, 10);
    }
}

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function postRequestToScriptSync(requestType) {

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
        if (data.widget.hasOwnProperty('data_table'))
            if (data.widget.data_table.hasOwnProperty('choices'))
                data.widget.data_table.choices = []; //skip useless data

    }

    var client = new XMLHttpRequest();
    client.open("post", "http://127.0.0.1:1977");
    client.onreadystatechange = function (m) {
        if (client.readyState == 4 && client.status != 200)
            g_form.addErrorMessage(client.responseText);
    };
    client.onerror = function (e) {
        alert("Error, please check if VS Code with SN SriptSync is running");
    };
    client.send(JSON.stringify(data));
}


function postToScriptSync(field) {

    snuScriptSync();
    var data = {};
    var instance = {};
    instance.name = window.location.host.split('.')[0];
    instance.url = window.location.origin;
    instance.g_ck = g_ck;

    data.action = 'saveFieldAsFile';
    data.instance = instance;

    if (field) {
        g_form.clearMessages();
        data.field = field;
        data.table = g_form.getTableName();
        data.sys_id = g_form.getUniqueValue();
        data.content = g_form.getValue(field);
        data.fieldType = g_form.getGlideUIElement(field).type;
        data.name = g_form.getDisplayValue().replace(/[^a-z0-9_\-+]+/gi, '-');
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

    var client = new XMLHttpRequest();
    client.open("post", "http://127.0.0.1:1977");
    client.onreadystatechange = function (m) {
        // if (client.readyState == 4 && client.status != 200)
        //     g_form.addErrorMessage(client.responseText);
    };
    client.onerror = function (e) {
        var msg = "Error, please check if VS Code with SN SriptSync is running";
        try {
            g_form.addErrorMessage(msg);
        } catch (e) { alert(msg); }

    };
    client.send(JSON.stringify(data));

}


function postLinkRequestToScriptSync(field) {

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

    var client = new XMLHttpRequest();
    client.open("post", "http://127.0.0.1:1977");
    client.onreadystatechange = function (m) {
        // if (client.readyState == 4 && client.status != 200)
        //     g_form.addErrorMessage(client.responseText);
    };
    client.onerror = function (e) {
        alert("Error, please check if VS Code with SN SriptSync is running");
    };
    client.send(JSON.stringify(data));
}

function addFieldSyncButtons() {

    var fieldTypes = ["script", "xml", "html", "template", "json", "css"];
    if (typeof jQuery == 'undefined') return; //not in studio

    if (typeof g_form != 'undefined') {
        if (g_form.isNewRecord()) return;
        jQuery(".label-text").each(function (index, value) {
            try {

                var elm = jQuery(this).closest('div.form-group').attr('id').split('.').slice(2).join('.');
                var fieldType = jQuery(this).closest('[type]').attr('type') || jQuery(this).text().toLowerCase();
                var txt = this.innerText.toLowerCase();
                if (txt == 'script' || txt == 'css') {
                    jQuery(this).after(' <span style="color: #293E40; cursor:pointer" data-field="' + elm + '" class="icon scriptSync icon-save"></span>');
                    return true;
                }
                for (var i = 0; i < fieldTypes.length; i++) {
                    if (fieldType.indexOf(fieldTypes[i]) > -1) {
                        jQuery(this).after(' <span style="color: #293E40; cursor:pointer" data-field="' + elm + '" class="icon scriptSync icon-save"></span>');
                        break;
                    }
                }
            } catch (error) {

            }
        });
        jQuery('span.scriptSync').on('click', function () {
            postToScriptSync(jQuery(this).data('field'));
            jQuery(this).css('color', '#81B5A1');
        });

    } else if (location.href.includes("sp_config/?id=widget_editor") ||
        location.href.includes("sp_config?id=widget_editor")) {

        var $body = angular.element(document.body); // 1
        var $rootScope = $body.scope().$root;
        $rootScope.$watch("loadingIndicator", function (newValue, oldValue) {
            if (!newValue) {
                setTimeout(function () {
                    $('#vscode-btn').remove()
                    let btn = `<button id='vscode-btn' class="btn btn-info btn-group" onclick="postRequestToScriptSync('widget')" title="Edit widget in VS Code (SN ScriptSync)">
                    <span class="glyphicon glyphicon-floppy-save"></span></button>`;
                    $('button[type=submit]').before(btn);
                }, 500);
            }
        });
    }
}


function addBGScriptButton() {
    if (!location.href.includes("/sys.scripts.do")) return; //only in bg script
    g_ck = document.getElementsByName('sysparm_ck')[0].value;
    document.getElementsByTagName('label')[0].insertAdjacentHTML('afterend', " <a href='javascript:postToScriptSync();'>[Mirror in sn-scriptsync]</a>");
}

function setAllMandatoryFieldsToFalse() {
    if (typeof g_form != 'undefined' && typeof g_user != 'undefined') {
        if (g_user.hasRole('admin')) {
            var fields = g_form.getEditableFields();
            for (var x = 0; x < fields.length; x++) {
                g_form.setMandatory(fields[x], false);
            }
            showAlert('Removed mandatory restriction from all fields.', 'success');
        } else {
            showAlert('Admin rights required.', 'danger');
        }
    }
}


function addSgStudioPlatformLink() {
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
                elm.innerHTML = DOMPurify.sanitize("<a class='snu-platformlink' title='Open in platform (Link by SN Utils)' target='_blank' href='/" + match[arr[1]] + "?sys_id=" + sysId + "'>" + elm.innerText + "</a>");

        }

        if (!document.querySelector('.snu-platformlink'))
            addSgStudioPlatformLink(); //do again until loaded

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

function sortStudioLists() {

    doGroupSearch(""); //call to remove var__m_ from flowdesigner 

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

function addStudioSearch() {

    if (!location.href.includes("$studio.do")) return; //only in studio

    if (typeof g_ck == 'undefined') {
        if (typeof InitialState != 'undefined') {
            g_ck = InitialState.userToken;
        }
    }

    if (document.querySelectorAll('header.app-explorer-header').length == 0) return;

    var snuGroupFilter = '<input autocomplete="off" onfocus="sortStudioLists(); this.select();" onkeyup="doGroupSearch(this.value)" id="snuGroupFilter" type="search" style="background: transparent; outline:none; color:white; border:1pt solid #e5e5e5; margin:5px 5px; padding:2px" placeholder="Filter navigator (Groups / Files[,Files])">'
    document.querySelectorAll('header.app-explorer-header')[0].insertAdjacentHTML('afterend', snuGroupFilter);
}

function addStudioScriptSync() {

    if (!location.href.includes("$studio.do")) return; //only in studio
    if (typeof g_ck == 'undefined') {
        if (typeof InitialState != 'undefined') {
            g_ck = InitialState.userToken;
        }
    }

    if (document.querySelectorAll('header.app-explorer-header').length == 0) return;

    var snuScriptSyncLink = '<a style="color:white; margin-left:10px;" href="javascript:postLinkRequestToScriptSync();"> <span class="icon icon-save"></span> Link VS Code via sn-scriptsync</a>'
    document.querySelectorAll('header.app-explorer-header')[0].insertAdjacentHTML('afterend', snuScriptSyncLink);
}

//Some magic to filter the file tree in studio
function doGroupSearch(search) {
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

        var parents = getParents(el, 'ul').reverse();
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

function sncWait(ms) { //dirty. but just need to wait a sec...
    var start = Date.now(),
        now = start;
    while (now - start < (ms || 1000)) {
        now = Date.now();
    }
}

function searchSysIdTables(sysId) {
    try {
        showAlert('Searching for sys_id. This could take some seconds...')
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
                tblsGr.addEncodedQuery("super_class=NULL^sys_update_nameISNOTEMPTY^nameNOT LIKEts_^nameNOT LIKEsysx_^nameNOT LIKE00^nameNOT LIKEv_^nameNOT LIKEsys_rollback_^nameNOT LIKEpa_^nameNOT INsys_metadata,task,cmdb_ci,sys_user")
                tblsGr.query();
                while (tblsGr.next()) {
                    rtrn = findClass(tblsGr.getValue('name'), sysId);
                    if (rtrn) {
                        gs.print("###" + rtrn + "###")
                        return
                    };
                }
                function findClass(t, sysId) {
                    var s = new GlideRecord(t);
                    s.addQuery('sys_id', sysId);
                    s.setLimit(1);
                    s.queryNoDomain();
                    s.query();
                    if (s.hasNext()) {
                        s.next();
                        return s.getRecordClassName() + "^" 
                        + s.getClassDisplayValue() + " - " 
                        + s.getDisplayValue() ;
                    }
                    return false;
                }
            }
            findSysID('`+ sysId + `')
        `;
        startBackgroundScript(script, function (rspns) {
            answer = rspns.match(/###(.*)###/);
            if (answer != null && answer[1]) {
                showAlert('Opening in new tab: ' + answer[1].split('^')[1], 'success');
                var table = answer[1].split('^')[0];
                var url = table + '.do?sys_id=' + sysId;
                window.open(url, '_blank');
            } else {
                showAlert('sys_id was not found in the system.', 'warning');
            }
        });
    } catch (error) {
        showAlert(error, 'danger');
    }
}

function doFileSearch(srch) {

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
var getParents = function (elem, selector) {
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
var xx;

function snuGetNav(shortcut) {

    if (shortcut == 'hist' && ((new Date()).getTime() - snuNav.loadedLastTime) > 60000) snuNav.loading = 'mustload';
    snuNav.loadedLastTime = (new Date()).getTime(); //in case of history refresh every 60sec

    if (snuNav.loading != 'mustload' || !g_ck) return;
    snuNav.loading = 'loading';
    var xhttp = new XMLHttpRequest();
    xhttp.responseType = 'json';
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            var resp = this.response.result;
            xx = resp;
            var navArr = [];
            Object.entries(resp['applications']).forEach(([key, val]) => {
                Object.entries(val.modules).forEach(([key2, val2]) => {
                    if (val2.type == "SEPARATOR") {
                        Object.entries(val2.modules).forEach(([key3, val3]) => {
                            navArr.push({ "app": (val.title + " - " + (val2.title || "")).replace("  ", " "), "item": val3.title, "uri": val3.uri })
                        });
                    }
                    else {
                        navArr.push({ "app": val.title, "item": val2.title, "uri": val2.uri })
                    }
                });
            });
            snuNav['applications'] = navArr;

            navArr = [];
            Object.entries(resp['favorites']).forEach(([key, val]) => {
                Object.entries(val.favorites).forEach(([key2, val2]) => {
                    if (val2.separator) {
                        Object.entries(val2.favorites).forEach(([key3, val3]) => {
                            navArr.push({ "app": (val.title + " - " + (val2.title || "")).replace("  ", " "), "item": val3.title, "uri": val3.url })
                        });
                    }
                    else {
                        navArr.push({ "app": val.title, "item": val2.title, "uri": val2.url })
                    }
                });
            });
            snuNav['favorites'] = navArr;

            navArr = [];
            Object.entries(resp['history']).forEach(([key, val]) => {

                navArr.push({ "app": val.title, "item": val.description || val.title, "uri": val.url })

            });
            snuNav['history'] = navArr;

            snuNav.loading = 'loaded';

        }
    };
    xhttp.open("GET", "api/now/ui/navigator/favorites", true);
    xhttp.send();
}

function snuGetNavHints(shortcut, srch) {
    var navObjName = ({ "nav": "applications", "hist": "history", "fav": "favorites" })[shortcut];
    if (!snuNav.hasOwnProperty(navObjName)) return '';
    var nav = snuNav[navObjName];
    var html = "";
    var lastApp = "";
    var srchArr = srch.toLowerCase().split(","); srchArr.push(srchArr[0]);
    var hits = 80; var hit = 0// maximum results
    for (var ix = 0; ix < nav.length && hit < hits; ix++) {
        var srchApp = srchArr[0].trim(); var srchItem = srchArr[1].trim()
        if ((srchArr.length == 3 && (nav[ix].app.toLowerCase().includes(srchApp) && nav[ix].item.toLowerCase().includes(srchItem))) ||
            (srchArr.length == 2 && (nav[ix].app.toLowerCase().includes(srchApp) || nav[ix].item.toLowerCase().includes(srchItem)))) {
            if (lastApp != nav[ix].app) {
                html += "<div>" + nav[ix].app.replace(new RegExp(srchApp || "!", "gi"), (match) => `<u>${match}</u>`) + "</div>";
            }
            html += "- <a target='_blank' href='" + nav[ix].uri + "'>" + nav[ix].item.replace(new RegExp(srchItem || "!", "gi"), (match) => `<u>${match}</u>`) + "</a><br />"
            lastApp = nav[ix].app;
            hit++;
        }
    }
    return '<br />' + hit + ' Matches:<br />' + html;
}




function addTechnicalNamesWorkspace() {
    //in workspace, iterate through the components, and dive into their shadowroots.
    document.querySelectorAll("sn-workspace-content").forEach(function (elm1) {
        elm1.shadowRoot.querySelectorAll("now-record-form-connected").forEach(function (elm2) {
            elm2.shadowRoot.querySelectorAll("sn-form-internal-workspace-form-layout").forEach(function (elm3) {

                //add link after the UI action
                elm3.shadowRoot.querySelector("sn-form-internal-header-layout").
                    shadowRoot.querySelector("now-record-common-uiactionbar").
                    shadowRoot.querySelectorAll("now-button").forEach(function (uiact) {
                        var lnk = document.createElement("A");
                        lnk.textContent = '?';
                        lnk.href = '/sys_ui_action.do?sys_id=' + uiact.appendToPayload.item.sysId;
                        lnk.target = 'uia';
                        lnk.title = 'SN Utils - Open the UI Action definition';
                        insertAfter(lnk,uiact);
                        console.dir(uiact);
                    });

                elm3.shadowRoot.querySelectorAll("now-record-form-blob").forEach(function (elm4) {
                    elm4.shadowRoot.querySelectorAll("sn-form-internal-tabs").forEach(function (elm5) {
                        elm5.shadowRoot.querySelectorAll("sn-form-internal-tab-contents").forEach(function (elm6) {
                            elm6.shadowRoot.querySelectorAll("now-record-form-section-column-layout").forEach(function (elm7) {
                                elm7.shadowRoot.querySelectorAll("*").forEach(function (elm8) {
                                    if (elm8.nodeName.includes('-')) {
                                        var lbl = elm8.shadowRoot.querySelector('.sn-control-label');
                                        if (lbl && !lbl.innerHTML.includes('|')) {
                                            var btn = document.createElement("A");
                                            btn.textContent = elm8.name;
                                            btn.href = 'javascript:void(0);';
                                            btn.title = 'SN Utils - Doubleclick to edit';
                                            btn.addEventListener('dblclick', function () { snuWsGetValue(elm4, elm8.name) }, false);
                                            lbl.textContent = lbl.textContent + ' | ';
                                            lbl.appendChild(btn);
                                        }
                                        console.dir(elm8)
                                        elm8.shadowRoot.querySelectorAll("*").forEach(function (elm9) {
                                            if (elm9.nodeName.includes('-')) {
                                                var lbl = elm9.shadowRoot.querySelector('.sn-control-label');
                                                if (lbl && !lbl.innerHTML.includes('|')) {
                                                    var btn = document.createElement("A");
                                                    btn.textContent = elm8.name;
                                                    btn.href = 'javascript:void(0);';
                                                    btn.title = 'SN Utils - Doubleclick to edit';
                                                    btn.addEventListener('dblclick', function () { snuWsGetValue(elm4, elm8.name) }, false);
                                                    lbl.textContent = lbl.textContent + ' | ';
                                                    lbl.appendChild(btn);
                                                }
                                            }
                                        })
                                    }
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    function snuWsGetValue(frm, field) {
        var newval = prompt("SNU", frm.fields[field].value);

        if (newval != null) {
            frm.dispatch("GFORM#SET_VALUE",
                {
                    fieldName: field,
                    value: newval
                });
        }
    }

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

}
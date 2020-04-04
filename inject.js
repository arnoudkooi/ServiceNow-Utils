var fields = [];
var mySysId = '';


var snuslashcommands = {
    "help": "* Show help",
    "add": "* Add or overwrite slashcommand <cmd> <My Desc>",
    "tn": "* Show technical names",
    "uh": "* Show hidden fields",
    "env": "* Open this page in <instance>",
    "token": "* Send g_ck token to VS Code",
    "lang": "* Switch language <lng>",
    "code": "* Beta <search>",
    "pop": "* Pop in/out classic UI",
    "search": "text_search_exact_match.do?sysparm_search=$0 Global search <search>",
    "s2": "* Toggle Select2 for Application and Updateset picker",
    "start": "/nav_to.do New tab",
    "db": "$pa_dashboard.do Dashboards",
    "plug": "v_plugin_list.do?sysparm_query=nameLIKE$0^ORidLIKE$0 Plugins",
    "acl": "sys_security_acl_list.do?sysparm_query=nameLIKE$1^operationLIKE$2 Open ACL list <table> <operation>",
    "br": "sys_script_list.do?sysparm_query=nameLIKE$0 Business Rules <name>",
    "si": "sys_script_include_list.do?sysparm_query=nameLIKE$0 Script Includes <name>",
    "cs": "sys_script_client_list.do?sysparm_query=nameLIKE$0 Client Scripts <name>",
    "ua": "sys_ui_action_list.do?sysparm_query=nameLIKE$0 UI Actions <name>",
    "up": "sys_ui_policy_list.do?sysparm_query=nameLIKE$0 UI Policies <name>",
    "uis": "sys_ui_script_list.do?sysparm_query=script_nameLIKE$0 UI Script <name>",
    "p": "sys_properties_list.do?sysparm_query=nameLIKE$0 Properties <name>",
    "log": "syslog_list.do?sysparm_query=sys_created_onONToday@javascript:gs.daysAgoStart(0)@javascript:gs.daysAgoEnd(0)^messageLIKE$0 System log <search>",
    "trans": "syslog_transaction_list.do?sysparm_query=sys_created_onONToday@javascript:gs.daysAgoStart(0)@javascript:gs.daysAgoEnd(0)^urlLIKE$0 Transaction Log <search>",
    "u": "sys_user_list.do?sysparm_query=user_nameLIKE$0^ORnameLIKE$0 Users <search>",
    "me": "sys_user.do?sys_id=javascript:gs.getUserID() My User profile",
    "docs": "https://docs.servicenow.com/search?q=$0&labelkey=orlando Search Docs <search>",
    "comm": "https://community.servicenow.com/community?id=community_search&q=$0&spa=1 Search Community <search>",
    "dev": "https://developer.servicenow.com/dev.do#!/search/orlando/All/$0 Search developer portal <search>",
    "fd": "/$flow-designer.do Open Flow Designer",
    "va": "/$conversation-builder.do Open Virtual Agent",
    "st": "/$studio.do Open Studio",
    "sp": "/sp Open Service Portal",
    "tweets": "https://twitter.com/sn_utils Show @sn_utils Tweets",
    "unimpersonate": "* Stop impersonating and reload page",
    "wf": "/workflow_ide.do?sysparm_nostack=true Open Workflow Editor",
    "app": "sys_scope_list.do?sysparm_query=nameLIKE$0^scopeLIKE$0 Open Application <name>",
    "imp": "impersonate_dialog.do Impersonate User page",
}

var snuslashswitches = {
    "a": { "description": "Active is True", "value": "^active=true" },
    "s": { "description": "Current Scope", "value": "^sys_scope=javascript:gs.getCurrentApplicationId()" },
    "ut": { "description": "Updated Today", "value": "^sys_updated_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()" },
    "ct": { "description": "Created Today", "value": "^sys_created_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()" },
    "um": { "description": "Updated by Me", "value": "^sys_updated_by=javascript:gs.getUserName()" },
    "cm": { "description": "Created by Me", "value": "^sys_created_by=javascript:gs.getUserName()" },
    "m": { "description": "Updated or Created by Me", "value": "^sys_updated_by=javascript:gs.getUserName()^ORsys_created_by=javascript:gs.getUserName()" },
    "ou": { "description": "Order by Updated Descending", "value": "^ORDERBYDESCsys_updated_on" },
    "oc": { "description": "Order by Created Descending", "value": "^ORDERBYDESCsys_created_on" },
}



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
        if (e.key == 'Meta' || e.key == 'Control') return;
        if (e.key == 'Escape' || (e.currentTarget.value.length <= 1 && e.key == 'Backspace')) hideSlashCommand();
        var sameWindow = !(e.metaKey || e.ctrlKey) && (window.top.document.getElementById('gsft_main') != null);
        if (!e.currentTarget.value.startsWith("/")) {
            e.currentTarget.value = "/" + e.currentTarget.value
        }
            var snufilter = e.currentTarget.value.substr(1);
            var thisUrl = window.location.href;
            var thisInstance = window.location.host.split('.')[0];
            var thisHost = window.location.host;
            var idx = snufilter.indexOf(' ')
            var noSpace = (snufilter.indexOf(' ') == -1);
            var selectFirst = (e.key == " " || e.key == "Tab") && !snufilter.includes(" ");
            var thisKey = (e.key.trim().length == 1) ? e.key : ""; //we may need to add this as we are capturing keydown
            if (noSpace) idx = snufilter.length;
            var originalShortcut = ((snufilter.slice(0, idx) + ((noSpace) ? thisKey : ""))).toLowerCase();

            if (e.key == 'Backspace') originalShortcut = originalShortcut.slice(0, -1);
            var shortcut = snufilter.slice(0, idx).toLowerCase();
            var query = snufilter.slice(idx + 1);


            var targeturl = (snuslashcommands[shortcut] || "").split(" ")[0];

            if (targeturl.startsWith("//")) { //enable to use ie '/dev' as a shortcut for '/env acmedev'
                snufilter = snuslashcommands[shortcut].substr(2);
                var idx = snufilter.indexOf(' ')
                if (idx == -1) idx = snufilter.length;
                shortcut = snufilter.slice(0, idx).toLowerCase();
                query = snufilter.slice(idx + 1).replace(/ .*/, '');;
                targeturl = (snuslashcommands[shortcut] || "");
            }
            var switchText = '<br /> Options:<br />';
            if (targeturl.includes('sysparm_query=')) {
                var unusedSwitches = Object.assign({}, snuslashswitches);
                var switches = (query + thisKey).match(/\-([a-z]*)(\s|$)/g);
                if (switches) {
                    Object.entries(switches).forEach(([key, val]) => {
                        var prop = val.replace(/\s|\-/g, '');
                        if (snuslashswitches.hasOwnProperty(prop)) {
                            query = query.replace(val, "");
                            targeturl += snuslashswitches[prop].value;
                            switchText += "<div class='cmdlabel'>-" + prop + ": " + snuslashswitches[prop].description + '</div>';
                            delete unusedSwitches[prop];
                        }
                    });
                }

                Object.entries(unusedSwitches).forEach(([key, val]) => {
                    switchText += "<div class='cmdlabel' style='color:#777777'>-" + key + ": " + val.description + '</div>';
                });

            }

            targeturl = targeturl.replace(/\$0/g, query);

            if (e.key == 'Enter') {
                if (shortcut.match(/^[0-9a-f]{32}$/) != null) {//is a sys_id
                    e.preventDefault();
                    searchSysIdTables(shortcut);
                    hideSlashCommand();
                    return;
                }
                else if (shortcut == "help") {
                    var outp = "";
                    for (cmd in snuslashcommands) {
                        outp += cmd + ";" + snuslashcommands[cmd] + "\n";
                    }

                    showAlert("Slashcommands <a href='https://www.youtube.com/watch?v=X6HLCV_ptQM&list=PLTyELlWS-zjSIPIs4ukRCrqc4LRHva6-L' target='_blank'>Playlist on YouTube</a><br />Start with a slash command ie '/br parent' for business Rules containing parent in name<br />" +
                        "Go to settings tab in popup to manage custom / commands <br />" +
                        "Current commands:<pre contenteditable='true' spellcheck='false'>" + outp + "</pre>", "info", 100000);

                    hideSlashCommand();
                    return;
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
                        thisUrl = thisUrl.replace(thisHost, query + ".service-now.com");
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
                else if (shortcut == "add") {

                    query = query.trim();

                    if (query.length < 1 || query == "") {
                        alert("Please define one word command name followed by a short description\nexample:\n/add mycommand My Description");
                        return;
                    }

                    var url;
                    if (typeof jQuery != "undefined")
                        url = jQuery('#gsft_main').attr('src');

                    url = (url || window.location.href.replace(window.location.origin, "")) + " " + query.split(" ").slice(1).join(" ");

                    var cmd = prompt("Set new Slashcommand (takes affect after reloading tab)\nCommand: /" + query.split(" ")[0], url);
                    if (cmd != null) {
                        cmd = query.split(" ")[0].toLowerCase() + ";" + cmd;
                        snuAddSlashCommand(cmd);
                    }
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
                else if (shortcut == "unimpersonate") {
                    {
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function () {
                            if (this.readyState == 4) {
                                location.reload();
                            }
                        };
                        xhttp.open("POST", "sys_unimpersonate.do", true);
                        xhttp.setRequestHeader("X-UserToken", g_ck);
                        xhttp.send();
                    }
                }
                else if (shortcut == "lang") {
                    {
                        
                        if (query.length != 2){
                            alert("Please provide a 2 character language code like 'en'");
                            return;
                        }
                        var payload = {"current": query};
                        
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function () {
                            if (this.readyState == 4 ) {
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
                    if (shortcut.length > 4) { //try to open table list if shortcut nnot defined and 5+ charaters
                        showAlert("Shortcut not defined, trying to open table: /" + shortcut, "info");
                        var url = shortcut + "_list.do?sysparm_filter_only=true&sysparm_filter_pinned=true&sysparm_query=name" + query;
                        var inIFrame = (shortcut == snufilter.slice(0, idx) && sameWindow)
                        if (e.target.className == "snutils") inIFrame = false;
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
                        showAlert("Shortcut not defined: /" + shortcut, "warning");
                        return;
                    }
                }


                var inIFrame = (shortcut == snufilter.slice(0, idx)) && !targeturl.startsWith("http") && !targeturl.startsWith("/") && sameWindow;
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

    if ((e.ctrlKey || e.metaKey) && e.key == 'v' && shortcut == 'v') {
        //asume a sys_id when pasting for correct 'autocomplete'
        shortcut = "00000000000000000000000000000000";
    }

    var propertyNames = Object.keys(snuslashcommands).filter(function (propertyName) {
        return propertyName.indexOf(shortcut) === 0;
    }).sort();

    var fltr = window.top.document.getElementById('snufilter');

    if (propertyNames.length > 0 && selectFirst) { //select first hit when tap or space pressed
        if (e) e.preventDefault();
        shortcut = propertyNames[0];
        propertyNames.splice(1);
        if (!fltr.value.includes(" ")) {
            fltr.value = "/" + shortcut + ' ';
        }
    }

    var html = "";
    for (i = 0; i < propertyNames.length && i < 10; i++) {
        html += "<li><span onclick='setSnuFilter(this)' class='cmdkey'>/" + propertyNames[i] + "</span> " +
            "<span class='cmdlabel'>" + snuslashcommands[propertyNames[i]].split(" ").slice(1).join(" ")
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;') + "</span></li>"
        if (fltr.value.includes(" ")) {
            break;
        }
    }
    if (!html && shortcut.replace(/ /g, '').length == 32) {
        html += "<li><span onclick='setSnuFilter(this)' class='cmdkey'>/sys_id</span> " +
            "<span class='cmdlabel'>Instance search</span></li>"
    }
    if (!html && shortcut.length > 5) {
        html += "<li><span onclick='setSnuFilter(this)' class='cmdkey'>/" + shortcut + "</span> " +
            "<span class='cmdlabel'>Table search</span></li>"
    }
    switchText = (switchText.length > 25) ? switchText : ''; //only if string > 25 chars;
    window.top.document.getElementById('snuhelper').innerHTML = html + switchText;
}

function setSnuFilter(elm) {
    if (elm.innerText.length > window.top.document.getElementById('snufilter').value.length) {
        window.top.document.getElementById('snufilter').focus();
        window.top.document.getElementById('snufilter').value = elm.innerText + ' ';
    }
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
    if (typeof snusettings.addtechnicalnames == 'undefined') snusettings.addtechnicalnames = false;
    if (typeof snusettings.slashoption == 'undefined') snusettings.slashoption = 'on';
    if (typeof snusettings.slashtheme == 'undefined') snusettings.slashtheme = 'dark';

    setShortCuts();

    if (!snusettings.nopasteimage){
        bindPaste(snusettings.nouielements == false);
    }

    if (snusettings.vsscriptsync == true) {
        addFieldSyncButtons();
        addStudioScriptSync();
    }

    if (snusettings.slashoption != "off") {
        addFilterListener();
        addSlashCommandListener();
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

    }

    if (snusettings.hasOwnProperty("slashcommands")) {

        try {
            if (("" + snusettings.slashcommands).length > 10) {
                var cmdArr = snusettings.slashcommands.split('\n');
                for (var i = 0; i < cmdArr.length; i++) {
                    var cmdSplit = cmdArr[i].split(";");
                    if (cmdSplit.length == 2) {
                        snuslashcommands[cmdSplit[0]] = cmdSplit[1];
                    }
                }
            }

            var sco = {}; //order the object
            Object.keys(snuslashcommands).sort().forEach(function (key) {
                sco[key] = snuslashcommands[key];
            });

            snuslashcommands = sco;

        }
        catch (e) {
            console.log("error while parsing slashcommands:" + snusettings.slashcommands)
        }
    }

    if (snusettings.addtechnicalnames == true) {
        addTechnicalNames();
    }

}




function doubleClickToShowFieldOrReload() {
    if (typeof g_form != 'undefined') {
        document.addEventListener("dblclick", function (event) {
            if (jQuery(event.target).hasClass('label-text')) {
                var elm = jQuery(event.target).closest('div.form-group').attr('id').split('.').slice(2).join('.');
                var val = g_form.getValue(elm);
                if (NOW.user.roles.includes('admin')) { //only allow "admin" ti change fields
                    var newValue = prompt('Value of ' + elm, val);
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
            var newValue = prompt('Filter condition: ', qry.filter);
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


function loadScript(url) {
    return new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        script.onload = resolve;
        script.onerror = reject;
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    });
}

function loadjQuery() {
    if (window.jQuery) {
        // already loaded and ready to go
        return Promise.resolve();
    } else {
        return loadScript('//code.jquery.com/jquery-latest.min.js');
    }
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
    if (typeof g_form == 'undefined' || !g_user.hasRole('admin')) return; //only on forms and only if admin
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

function addTechnicalNames() {

    if (typeof jQuery == 'undefined') return; //not in studio

    if (typeof g_form != 'undefined') {
        try {
            jQuery(".navbar-title-display-value:not(:contains('|'))").append(' | <span style="font-family:monospace; font-size:small;">' + g_form.getTableName() + '</span>');
            jQuery(".label-text:not(:contains('|'))").each(function (index, value) {
                jQuery('label:not(.checkbox-label)').removeAttr('for'); //remove to easier select text
                jQuery('label:not(.checkbox-label)').removeAttr('onclick')
                try {
                    var elm = jQuery(this).closest('div.form-group').attr('id').split('.').slice(2).join('.');
                } catch (e) {
                    return true; //issue #42
                }
                jQuery(this).closest('a').replaceWith(function () { return jQuery(this).contents(); });
                var fieldType = jQuery(this).closest('[type]').attr('type') || jQuery(this).text().toLowerCase();
                var btn = '';
                if (fieldType == 'reference' || fieldType == 'glide_list') {
                    var reftable = g_form.getGlideUIElement(elm).reference;
                    elm = ' <a onclick="openReference(\'' + reftable + '\',\'' + elm + '\');"  title="Reference table: ' + reftable + '" target="_blank">' + elm + '</a>';
                }
                else if (fieldType == 'conditions') {
                    elm = '<a onclick="openConditions(\'' + elm + '\');"  title="Preview condition in list" target="_blank">' + elm + '</a>';
                }
                else if (fieldType == 'table_name') {
                    elm = '<a onclick="openTable(\'' + elm + '\');"  title="Open table in list" target="_blank">' + elm + '</a>';
                }
                jQuery(this).append(' | <span style="font-family:monospace; font-size:small;">' + elm + '</span> ');
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
}

function snuUiActionInfo(event, si) {

    if (event.ctrlKey || event.metaKey) {
        event.stopImmediatePropagation();
        prompt("UI Action sys_id", si);
    }
    else {
        window.open('/sys_ui_action.do?sys_id=' + si, 'uiaction');
    }
}

function openReference(refTable, refField) {
    var url = '/' + refTable + '_list.do?sysparm_query=sys_idIN' + g_form.getValue(refField);
    if (event.ctrlKey || event.metaKey)
        url = '/' + refTable + '?sysparm_query=sys_idIN' + g_form.getValue(refField);
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
                    opt.innerHTML = input.value;
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
        div.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; z-index:10000; font-size:8pt; position: fixed; top: 10px; left: 10px; min-height:50px; padding: 5px; border: 1px solid #E3E3E3; background-color:#FFFFFFF7; border-radius:2px; min-width:320px; }
        div.snuheader {font-weight:bold; margin: -4px; background-color:#e5e5e5}
        ul#snuhelper { list-style-type: none; padding-left: 2px; } 
        ul#snuhelper li {margin-top:2px}
        span.cmdkey { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; border:1pt solid #e3e3e3; background-color:#f3f3f3; min-width: 40px; cursor: pointer; display: inline-block;}
        input.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; outline: none; font-size:10pt; font-weight:bold; width:99%; border: 1px solid #ffffff; margin:8px 2px 4px 2px; background-color:#ffffff }
        span.cmdlabel { color: #222222; font-size:7pt; font-family:verdana, arial }
        a.cmdlink { font-size:10pt; color: #1f8476; }
        </style>`;
    }
    else if (snusettings.slashtheme == 'stealth'){
        divstyle = `<style>
        div.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; z-index:10000; font-size:10pt; position: fixed; top: 1px; left: 1px; padding: 0px; border: 0px; min-width:30px; }
        div.snuheader {display:none}
        ul#snuhelper { display:none } 
        ul#snuhelper li {display:none}
        span.cmdkey {display:none}
        input.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; outline: none; font-size:8pt; background: transparent; text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white; width:100%; border: 0px; margin:8px 2px 4px 2px; }
        span.cmdlabel { display:none }
        a.cmdlink { display:none }
        </style>`; 
    }
    else {
        divstyle = `<style>
        div.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; color:#ffffff; z-index:10000; font-size:8pt; position: fixed; top: 10px; left: 10px; min-height:50px; padding: 5px; border: 1px solid #030303; background-color:#000000F7; border-radius:2px; min-width:320px; }
        div.snuheader {font-weight:bold; margin: -4px; background-color:#333333}
        ul#snuhelper { list-style-type: none; padding-left: 2px; } 
        ul#snuhelper li {margin-top:2px}
        span.cmdkey { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; border:1pt solid #00e676; background-color:#00e676; color: #000000; min-width: 40px; cursor: pointer; display: inline-block;}
        input.snutils { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; outline: none; font-size:10pt; color:#00e676; font-weight:bold; width:100%; border: 1px solid #000000; margin:8px 2px 4px 2px; background-color:#000000F7 }
        span.cmdlabel { color: #FFFFFF; font-size:7pt; }
        a.cmdlink { font-size:10pt; color: #1f8476; }
        </style>`;
    }



    var htmlFilter = document.createElement('div');
    htmlFilter.innerHTML = divstyle +
        `<div class="snutils" style="display:none;"><div class="snuheader"><a class='cmdlink'  href="javascript:hideSlashCommand()">
    <svg height="16" width="16"><circle cx="8" cy="8" r="5" fill="#FF605C" /></svg></a> SN Utils Slashcommands<br /></div>
    <input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" id="snufilter" onfocus="this.select();" name="snufilter" class="snutils" type="text" placeholder='SN Utils Slashcommand' > </input>
    <ul id="snuhelper"></ul></div>`
    window.top.document.body.appendChild(htmlFilter);
    addSlashCommandListener();

    document.addEventListener("keydown", function (event) {



        if (event.key == '/') {
            if (snusettings.slashoption == 'off') return;
            var isActive = (location.host.includes("service-now.com") && snusettings.slashoption == 'on') || event.ctrlKey || event.metaKey;
            if (isActive) {
                if (!["INPUT", "TEXTAREA", "SELECT"].includes(event.srcElement.tagName) && !event.srcElement.hasAttribute('contenteditable') ||
                    event.ctrlKey || event.metaKey) { //not when form element active
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

function bindPaste(showIcon) {

    if (typeof jQuery == 'undefined') return; //not in studio

    if (typeof g_form != 'undefined') {

        if (showIcon)
            jQuery('#header_add_attachment').after('<button id="header_paste_image" title="Paste screenshot as attachment" class="btn btn-icon glyphicon glyphicon-paste navbar-btn" aria-label="Paste Image as Attachments" data-original-title="Paste Image as Attachments" onclick="tryPaste()"></button>');


        jQuery('body').bind('paste', function (e) {
            if (e.originalEvent.clipboardData.items.length > 0 && e.originalEvent.clipboardData.items[0].kind == "file") {
                if (g_form.isNewRecord()) {
                    g_form.clearMessages();
                    g_form.addWarningMessage('Please save record before pasting...');
                    return false;
                }
                g_form.addInfoMessage('<span class="icon icon-loading"></span> Pasted image being processed...');

                var fileInfo = e.originalEvent.clipboardData.items[0].getAsFile();
                var fr = new FileReader();
                fr.onloadend = function () {
                    var imgData = getBlob(fr.result);
                    saveImage(imgData, fileInfo);
                };
                fr.readAsDataURL(fileInfo);
            }
        });

    }
}

//Because we dont like creating records in a popup with sys_ref_list view
function newFromPopupToTab() {

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

function saveImage(imgData, fileInfo) {

    if (typeof jQuery == 'undefined') return; //not in studio

    //var fileName = prompt("Filename to use:", fileInfo.name) || fileInfo.name;


    var URL = "/api/now/attachment/file?table_name=" +
        g_form.getTableName() + "&table_sys_id=" + g_form.getUniqueValue() + "&file_name=" + fileInfo.name;

    jQuery.ajax({
        url: URL,
        type: 'POST',
        data: imgData,
        processData: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': fileInfo.type,
            'Access-Control-Allow-Origin': '*',
            'X-UserToken': (typeof g_ck === 'undefined') ? '' : g_ck
        },
        contentType: 'application/json; charset=utf-8',
        success: function (r) {
            g_form.clearMessages();
            console.log(r);
            g_form.addInfoMessage("<span>Pasted image added as attachment<br /><a href='/" + r.result.sys_id + ".iix' target='myimg'><img src='" + r.result.sys_id + ".iix?t=small' alt='upload' style='display:inline!important; padding:20px;'/></a><br />" +
                `<div class="input-group">
        <input id='tbxImageName' onKeyUp='if (event.keyCode == 13) renamePasted("` + r.result.sys_id + `")' type="text" value="` + r.result.file_name.replace('.png', '') + `" style='width:200px;'class="form-control" placeholder="Image name">
        <span class="input-group-btn" style="display: inline; ">
          <button class="btn btn-primary" onClick='renamePasted("` + r.result.sys_id + `")' style="width: 80px;" type="button">.png Save..</button>
        </span>
      </div><span id='divRenamed'></span></form>`);
            $j('#tbxImageName').focus().select();

        },
        error: function (error) {
            console.log(error);
            g_form.clearMessages();
            g_form.addErrorMessage(error.responseJSON.error.detail);

        }
    });

}

function renamePasted(sysID, check) {

    if (!$j('#tbxImageName').val()) {
        alert("Please insert a valid filename.");
        return false;
    }


    var requestBody = {
        "file_name": $j('#tbxImageName').val()
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
            var newValue = prompt('Filter condition:', qry);
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
        var newValue = prompt('Filter condition:', qry);

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

var elNames = '';

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

// if (typeof g_form !== 'undefined') {
//     // The ID of the extension we want to talk to.
//     //var chUtilsId = "pebbidlifabkglkbebloodgglcpcljgb"; //dev
//     var chUtilsId = "jgaodbdddndbaijmcljdbglhpdhnjobg"; //prod

//     // Make a simple request:
//     chrome.runtime.sendMessage(chUtilsId, { "table": g_form.tableName, "g_ck": g_ck },
//         function (response) {
//             console.log(response)
//         });
// }



//Query ServiceNow for tables and set to chrome storage
function setUpdateSetTables() {

    var myurl = "/api/now/table/sys_dictionary?sysparm_fields=name&sysparm_query=" +
        "name=javascript:new PAUtils().getTableDecendants('sys_metadata')^internal_type=collection^attributesNOT LIKEupdate_synch=false^NQattributesLIKEupdate_synch=true";
    loadXMLDoc(g_ck, myurl, null, function (jsn) {

        var tbls = [];
        for (var t in jsn.result) {
            if (jsn.result[t].name.length > 1)
                tbls.push(jsn.result[t].name);
        }
        localStorage.setItem("updatesettables", JSON.stringify(tbls));
        //updateSetTables = tbls;
    });
}

//Function to query Servicenow API
function loadXMLDoc(token, url, post, callback) {
    try {
        var hdrs = {
            'Cache-Control': 'no-cache',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (token) //only for instances with high security plugin enabled
            hdrs['X-UserToken'] = token;

        var method = "GET";
        if (post) method = "PUT";

        jQuery.ajax({
            url: url,
            method: method,
            data: post,
            headers: hdrs
        }).success(function (rspns, s) {
            callback(rspns, s);
        }).fail(function (jqXHR, textStatus) {
            showAlert('Server Request failed (' + jqXHR.statusText + ')', 'danger');
            callback(textStatus);
        });
    } catch (error) {
        showAlert('Server Request failed (' + error + ')', 'danger');
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
    window.top.jQuery('.service-now-util-alert').addClass('visible');
    window.top.jQuery('.service-now-util-alert>.notification').addClass('notification-' + type);
    window.top.setTimeout(function () {
        window.top.jQuery('.service-now-util-alert').removeClass('visible');
        window.top.jQuery('.service-now-util-alert>.notification').removeClass('notification-' + type);
    }, timeout);
}

function hideAlert() {
    jQuery('.service-now-util-alert').removeClass('visible');
}
function hideSlashCommand() {
    if (window.top.document.querySelector('div.snutils') != null) {
        window.top.document.querySelector('div.snutils').style.display = 'none';
        if (window.top.document.getElementById('filter') != null) {
            if (event.currentTarget.value.length <= 1) {
                window.top.document.getElementById('filter').focus();
            }
        }
    }
    return true;
}

function showSlashCommand() {
    if (window.top.document.querySelector('div.snutils') != null) {
        window.top.document.querySelector('div.snutils').style.display = '';
        window.top.document.getElementById('snufilter').value = '/';
        window.top.document.getElementById('snufilter').focus();
        snuShowSlashCommandHints("", false, "", false);
        setTimeout(function () { window.top.document.getElementById('snufilter').setSelectionRange(2, 2); }, 10);
    }
    else {

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

    g_form.clearMessages();
    var instance = {};
    instance.name = window.location.host.split('.')[0];
    instance.url = window.location.origin;
    instance.g_ck = g_ck;

    var data = {};
    data.action = 'saveFieldAsFile';
    data.instance = instance;
    data.table = g_form.getTableName();
    data.sys_id = g_form.getUniqueValue();
    data.field = field;
    data.content = g_form.getValue(field);
    data.fieldType = g_form.getGlideUIElement(field).type;
    data.name = g_form.getDisplayValue().replace(/[^a-z0-9_\-+]+/gi, '-');

    var client = new XMLHttpRequest();
    client.open("post", "http://127.0.0.1:1977");
    client.onreadystatechange = function (m) {
        // if (client.readyState == 4 && client.status != 200)
        //     g_form.addErrorMessage(client.responseText);
    };
    client.onerror = function (e) {
        g_form.addErrorMessage("Error, please check if VS Code with SN SriptSync is running");
    };
    client.send(JSON.stringify(data));

    // var syncPage = jQuery("#snUtils").data("syncpage");
    // window.open(syncPage, syncPage);

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

    // var syncPage = jQuery("#snUtils").data("syncpage");
    // window.open(syncPage, syncPage);

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
            console.log(arr)
            if (sysId.includes("{")) {
                try {
                    sysId = JSON.parse(decodeURIComponent(sysId))['sysId'];
                } catch (e) {
                    console.log(e);
                };
            }

            var elm = document.querySelector("h1");
            if (elm)
                elm.innerHTML = "<a class='snu-platformlink' title='Open in platform (Link by SN Utils)' target='_blank' href='/" + match[arr[1]] + "?sys_id=" + sysId + "'>" + elm.innerText + "</a>";

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

    // if (search.length == 0) {
    //     var elms = document.querySelectorAll('.app-explorer-tree li:not(.nav-group)');
    //     Array.prototype.forEach.call(elms, function (el, i) {
    //         el.style.display = "";
    //     });
    //     return;
    // }

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

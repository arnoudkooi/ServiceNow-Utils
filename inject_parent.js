//Initialize Typeahead Data
var bloodhound = {};
var autoCompletionLimit = 3000;
var autoComletionMinLength = 2;
var iframeId = 'gsft_main';
var applicationFilterId = 'filter';
var globalSearchId = 'sysparm_search';
var searchMode = 'default';

if (typeof jQuery != "undefined") {
    var applicationFilterEl = jQuery('#' + applicationFilterId);
    var globalSearchEl = jQuery('#' + globalSearchId);

    makeUpdateSetIconClickable();

    jQuery(function () {
        initializeAutocomplete();
        setSearch();

        //Initialize Alert
        var alertContainer = '<div class="notification-container service-now-util-alert" role="alert" style="top: 20px;"><div class="notification outputmsg outputmsg_has_text"><span class="outputmsg_text role="alert"></span></div></div>';
        jQuery('header').prepend(alertContainer);
    });
}

function initializeAutocomplete(array) {
    if (typeof Bloodhound == 'undefined') return;

    bloodhound = new Bloodhound({
        local: array || [],
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        datumTokenizer: Bloodhound.tokenizers.whitespace
    });
    //Activate autocomplete for technical table names
    applicationFilterEl.typeahead({
        minLength: autoComletionMinLength,
        highlight: true,
        classNames: {
            'cursor': 'mark'
        }
    }, {
            name: 'my-dataset',
            limit: autoCompletionLimit,
            source: bloodhound
        });
}

function makeUpdateSetIconClickable() {
    if (!jQuery("a.icon-document-multiple[href*='sys_update_set']").length) { //starting Jakarta this is oob
        jQuery('update-set-picker')
            .find('.icon-document-multiple')
            .first()
            .css('color', 'red')
            .wrap("<a name='openupdateset' href='#' ></a>");


        jQuery("[name='openupdateset']").on('click', function (e) {
            var ussysid = jQuery("[name='update_set_picker_select']").val().replace('string:', '');
            var url = '/sys_update_set.do?sys_id=' + ussysid;

            if (e.shiftKey || e.ctrlKey || e.metaKey)
                jQuery("<a>").attr("href", url).attr("target", "_blank")[0].click();
            else
                jQuery('#' + iframeId).attr('src', url);
        });
    }
}


function setSearch() {

    document.addEventListener("keydown", function (event) {


        if (applicationFilterEl && document.activeElement.id == applicationFilterId) {
            if (event.keyCode == 220) { //back slash
                event.preventDefault();
                setSearchMode('default');
            }
            else if (event.keyCode == 191) { //forward slash
                event.preventDefault();
                setSearchMode('tables');
            }
            else if (event.keyCode == 190) { //dot
                event.preventDefault();
                setSearchMode('extension');
            }
            else if (event.keyCode == 13) { //return
                var value = applicationFilterEl.val();
                var listurl = '';
                var query = [];
                var table = value.substr(0, value.indexOf('.'));
                var action = value.substr(value.indexOf('.') + 1);
                var orderAttr = 'sys_updated_on';

                applicationFilterEl.val('');
                if (action != '') {
                    //Restrict records to today for certain tables
                    if (['sys_update_version', 'syslog'].indexOf(table) > -1) {
                        query.push('sys_created_onONToday@javascript:gs.daysAgoStart(0)@javascript:gs.daysAgoEnd(0)');
                        orderAttr = 'sys_created_on';
                    }
                    //set url for all actions
                    if (action.toLowerCase() == 'do') {
                        listurl = '/' + table + '.do';
                    }
                    else if (action.toLowerCase() == 'list') {
                        listurl = '/' + table + '_list.do' + getSysParmAppendix(query, orderAttr);
                    }
                    else if (action.toLowerCase() == 'mine') {
                        query.push('sys_created_by=' + window.NOW.user.name + '^ORsys_updated_by=' + window.NOW.user.name);
                        listurl = '/' + table + '_list.do' + getSysParmAppendix(query, orderAttr);
                    }
                    else if (action.toLowerCase() == 'today') {
                        listurl = '/' + table + '_list.do?sysparm_query=sys_updated_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^ORDERBYDESCsys_updated_on';
                    }
                    else if (action.toLowerCase() == 'struct') {
                        listurl = '/sys_db_object.do?sysparm_query=name=' + table;
                    }
                    else if (action.toLowerCase() == 'config') {
                        listurl = '/personalize_all.do?sysparm_rules_table=' + table + '&sysparm_rules_label=' + table;
                    }

                    else {
                        return;
                    }
                    //open window if action is applicable
                    if (action == action.toUpperCase()) {
                        window.open(listurl, table)
                    } else {
                        loadIframe(listurl);
                    }
                }
            } else {
                var value = globalSearchEl.val();
                if (value.match(/^[a-z0-9]{32,32}$/g) != null && value.length == 32) {
                    event.preventDefault();
                    searchSysIdTables(value);
                }
            }

        }





    }, false);
}

    function setSearchMode(searchmode){
        
        if (searchMode == searchmode) return;
        searchMode = searchmode;

        if (searchMode == 'default') {
            applicationFilterEl.typeahead('destroy');
            setFilterPlaceHolder();
        }

        else if (searchMode == 'tables') {
            setFilterPlaceHolder("Search tables by starts with");
            var value = applicationFilterEl.val();
            applicationFilterEl.typeahead('destroy');
            var myurl = '/api/now/table/sys_db_object?sysparm_fields=name&sysparm_query=sys_update_nameISNOTEMPTY^nameNOT LIKE00%5EORDERBYname&sysparm_limit=' + autoCompletionLimit;
            loadXMLDoc(g_ck, myurl, null, function (json) {
                applicationFilterEl.typeahead('destroy');
                json = (json.result.map(function (t) { return t.name }));
                initializeAutocomplete(json);

                applicationFilterEl.focus();
                applicationFilterEl.select();
                setTimeout(function () {
                    applicationFilterEl.prop({
                        'selectionStart': value.length,
                        'selectionEnd': value.length
                    });
                }, 10);
            });
            
        }
        if (searchMode == 'extension') {
            
            //var value = applicationFilterEl.val();
            var value = ($j('.tt-suggestion:first').text() || applicationFilterEl.val() ) + '.';
            //value = value.substr(0, value.indexOf('.'));
            
            applicationFilterEl.typeahead('destroy');
            appendices = ['list', 'LIST', 'struct', 'STRUCT', 'mine', 'MINE', 'today', 'TODAY', 'config', 'CONFIG', 'do', 'DO'];
            initializeAutocomplete(appendices.map(function (a) { return value + a }));
            applicationFilterEl.typeahead('val', value );
            applicationFilterEl.focus();
            applicationFilterEl.select();
            setTimeout(function () {
                applicationFilterEl.prop({
                    'selectionStart': value.length,
                    'selectionEnd': value.length
                });
            }, 10);
        }

    }

    function setFilterPlaceHolder(ph) {

        if (document.getElementById(applicationFilterId)) {

            if (!ph) {
                var ky = (window.navigator.platform.startsWith("Mac")) ? "(CMD-SHIFT-F)" : "(CTRL-SHIFT-F)";
                document.getElementById(applicationFilterId).placeholder = "Filter navigator " + ky;
            }
            else
                document.getElementById(applicationFilterId).placeholder = ph;

        }
    }
    setFilterPlaceHolder();



    function getSysParmAppendix(encodedQueryArr, orderAttr) {
        if (typeof orderAttr == 'undefined') orderAttr = 'sys_updated_on';
        var orderQuery = 'sysparm_order=' + orderAttr + '&sysparm_order_direction=desc';
        if (encodedQueryArr.length > 0) {
            return '?sysparm_query=' + encodedQueryArr.join('^') + '&' + orderQuery;
        }
        return '?' + orderQuery;
    }

    function searchSysIdTables(sysId) {
        try {
            showAlert('Searching for sys_id. This could take some seconds...')
            var script = 'function findSysID(e){var s,d,n=new GlideRecord("sys_db_object");n.addEncodedQuery("' +
                [
                    'super_class=NULL', //do not include extended tables 
                    'sys_update_nameISNOTEMPTY',
                    'nameNOT LIKEts_',
                    'nameNOT LIKEsysx_',
                    'nameNOT LIKEv_',
                    'nameNOT LIKE00',
                    'nameNOT LIKEsys_rollback_',
                    'nameNOT LIKEpa_',
                ].join('^') +
                '"),n.query();for(var a=[];n.next();)d=n.name+"",(s=new GlideRecord(d)).isValid()&&(s.addQuery("sys_id",e),s.queryNoDomain(),s.setLimit(1),s.query(),s.hasNext()&&a.push(d));gs.print("###"+a+"###")}findSysID("' + sysId + '");'
            startBackgroundScript(script, function (rspns) {
                answer = rspns.match(/###(.*)###/);
                if (answer != null && answer[1]) {
                    showAlert('Success! All found records will be opened in a separate browser tab.', 'success');
                    var tables = answer[1].split(',');
                    var url;
                    for (var i = 0; i < tables.length; i++) {
                        url = tables[i] + '.do?sys_id=' + sysId;
                        window.open(url, '_blank');
                    }
                } else {
                    showAlert('sys_id was not found in the system.', 'warning');
                }
            });
        } catch (error) {
            showAlert(error, 'danger');
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


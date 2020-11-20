var tableIndex = 0;
var statisticsObj

(function initialize() {
    // var url = getUrlVars()["url"];
    // var table = getUrlVars()["table"];
    // var searchTerm = getUrlVars()["searchTerm"];
    // var gck = getUrlVars()["gck"];
    // executeCodeSearch(url, gck, searchTerm, table);

    chrome.runtime.onMessage.addListener(function (message) {
        var command = message.message.command;
        window.location = '?query=' + command["query"] + '&instance=' + command["instance"] + '&url=' + command["url"] + '&g_ck=' +command["g_ck"];

    });


    if (getUrlVars("g_ck")) {
        jQuery('#query').val(getUrlVars("query"));    
        jQuery('#spnInstance').text(getUrlVars("instance"));
        document.title = getUrlVars("instance") + " - Codesearch";
        executeCodeSearch(getUrlVars("url"), getUrlVars("g_ck"), getUrlVars("query"), "");
    }

    jQuery('#btnSearch').on('click', doSearch);
    jQuery('#query').keypress(function (e) {
        if (e.which == '13') {
            e.preventDefault();
            doSearch();
        }
    });

})();

function doSearch() {
    executeCodeSearch(getUrlVars("url"), getUrlVars("g_ck"), jQuery('#query').val(), "");
}

function renderResults(url, result, searchTerm, locations) {


    var resultHtml = ''; //'<div class="accordion" id="searchCodeAccordion">';

    resultHtml += generateHtmlForCodeSearchEntry(result.result, url, searchTerm, statisticsObj);

    //resultHtml += '</div>';



    if (tableIndex == 0) jQuery('#searchcontent').html('');
    jQuery('#searchcontent').append(resultHtml);
}

function generateHtmlForCodeSearchEntry(data, url, searchTerm, statisticsObj) {
    if (!data || !data.hits || data.hits.length == 0) {
        return '';
    }

    var header = '' +
        '<div class="card">' +
        '<div class="card-header" id="head_' + data.recordType + '">' +
        '<h5 class="mb-0"><button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse_' + data.recordType + '" aria-expanded="true" aria-controls="collapse_' + data.recordType + '">' +
        data.tableLabel + ' [' + data.recordType + '] (' + data.hits.length + ')' + '</button>' +
        '</h5></div>' +
        '<div id="collapse_' + data.recordType + '" class="collapse show" aria-labelledby="' + data.recordType + '" idata-parent="#searchCodeAccordion">' +
        '<div class="card-body">';

    var footer =
        '</div> <!--card-body-->' +
        '</div> <!--collapse-->' +
        '</div> <!--card--><br />';


    statisticsObj.tables += 1;
    var tableAccordion = '<div class="accordion" id="searchCodeTableAccordion_' + data.recordType + '">';

    jQuery.each(data.hits, function (idx, hit) {
        var recordHeader = '' +
            '<div class="card">' +
            '<div class="card-header" id="head_' + hit.sysId + '">' +
            '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse_' + hit.sysId + '" aria-expanded="true" aria-controls="collapse_' + hit.sysId + '">' +
            hit.name + ' (' + hit.matches.length + ')' +
            '</button>' +
            ' <span class="smaller">[<a href="' + url + '/' + data.recordType + '.do?sys_id=' + hit.sysId + '" target="_blank">Open</a>]</span>' +
            '</div>' +
            '<div id="collapse_' + hit.sysId + '" class="collapse show" aria-labelledby="' + hit.sysId + '" idata-parent="#searchCodeTableAccordion_' + data.recordType + '">' +
            '<div class="card-body">';

        var text = '<ul class="record">';
        statisticsObj.hits += 1;

        jQuery.each(hit.matches, function (indx, match) {
            text += "<li><span>Field: " + match.fieldLabel + "</span>";
            text += "<pre><code>";
            jQuery.each(match.lineMatches, function (ix, fieldMatch) {
                if (fieldMatch.escaped.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                    statisticsObj.lines += 1;
                    var fieldMatchHighlighted = fieldMatch.escaped.replace(new RegExp(searchTerm, 'gi'), function (m) { return '<strong>' + m + '</strong>' });
                    text += fieldMatch.line + " | " + fieldMatchHighlighted + "\n";
                }
            });
            text += "</code></pre></li>";
        });
        text += "</ul>";


        var recordFooter = '' +
            '</div> <!--card-body-->' +
            '</div> <!--collapse-->' +
            '</div> <!--card-->';

        tableAccordion += recordHeader + text + recordFooter;
    });

    tableAccordion += "</div>";

    var rtrn = header + tableAccordion + footer;
    console.log(rtrn);
    return rtrn;
}


function executeCodeSearch(url, gck, searchTerm, table) {

    if (searchTerm.length < 4) {
        jQuery('#searchmsg').html("Searchterm must be 4 characters or more");
        return;
    }


    var endpoint = url + '/api/sn_codesearch/code_search/search?term=' + searchTerm + '&limit=500&search_all_scopes=true&search_group=sn_codesearch.Default Search Group';

    var locations = [];
    if (typeof table != 'string' || (typeof table == 'string' && table.trim() == '')) {
        locations = [
            'sys_script',
            'sys_ui_macro',
            'sys_ui_page',
            'sys_trigger',
            'sys_ui_script',
            'sys_processor',
            'sys_script_include',
            'sys_ui_action',
            'sys_ui_policy',
            'sys_script_client',
            'process_step_approval',
            'sysevent_in_email_action',
            'sys_ui_style',
            'sys_installation_exit',
            'sys_script_validator',
            'sysauto_script',
            'sys_relationship',
            'sys_ui_macro',
            'sys_script_ajax',
            'sys_transform_script',
            'sysevent_email_action',
            'ecc_agent_script_include',
            'sys_security_acl',
            'cmn_map_page',
            'wf_activity_definition',
            'kb_navons',
            'sys_transform_map',
            'content_block_programmatic',
            'sysevent_email_template',
            'bsm_action',
            'sys_widgets',
            'sysevent_script_action'
        ];
    } else {
        locations.push(table);
    }


    function searchLocation(idx) {

        if (idx == 0) {
            jQuery('#searchcontent').html("");
            statisticsObj = {
                tables: 0,
                hits: 0,
                lines: 0
            };
        }
        jQuery('#searchmsg').html("Searching table: " + locations[idx] + "...");


        loadXMLDoc(gck, endpoint + '&table=' + locations[idx], null).then((results) => {
            renderResults(url, results, searchTerm, locations);
            if ((tableIndex + 1) < locations.length) {
                tableIndex++;
                searchLocation(tableIndex);
            } else {
                tableIndex = 0

                var html = 'Result of last search: <u>' + jQuery('#query').val() + '</u>' +
                    ' | Tables: <u>' + statisticsObj.tables + '</u>' +
                    ' | Records: <u>' + statisticsObj.hits + '</u>' +
                    ' | Hits: <u>' + statisticsObj.lines + '</u>'
                jQuery('#searchmsg').html(html);

            };

        });
    };
    searchLocation(tableIndex);

}

function loadXMLDoc(token, url, post) {

    var hdrs = {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    if (token) //only for instances with high security plugin enabled
        hdrs['X-UserToken'] = token;

    var method = "GET";
    if (post) method = "PUT";

    return new Promise(function (resolve, reject) {
        $.ajax({
            url: url,
            method: method,
            data: post,
            headers: hdrs
        }).done(function (rspns) {
            resolve(rspns);
        }).fail(function (jqXHR, textStatus) {
            reject(textStatus);
        });
    });
};

function getUrlVars(key) {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = decodeURIComponent(value);
        });
    return vars[key];
}
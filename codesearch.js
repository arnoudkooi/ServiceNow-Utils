(function initialize() {
    // var url = getUrlVars()["url"];
    // var table = getUrlVars()["table"];
    // var searchTerm = getUrlVars()["searchTerm"];
    // var gck = getUrlVars()["gck"];
    // executeCodeSearch(url, gck, searchTerm, table);

    chrome.runtime.onMessage.addListener(function(message){
       var command = message.message.command
        jQuery('#query').val(command["query"]);
        jQuery('#instance').val(command["instance"]);
        jQuery('#url').val(command["url"]);
        jQuery('#g_ck').val(command["g_ck"]);

        jQuery('#spnInstance').text(command["instance"]);

        window.title = command["instance"] + " - Codesearch";
        if (command["g_ck"]){
            executeCodeSearch(command.url, command.g_ck, command.query, "");
        }
      });

      jQuery('#btnSearch').on('click', doSearch);
      
})();

function doSearch(){
    executeCodeSearch(jQuery('#url').val(), jQuery('#g_ck').val(), jQuery('#query').val(), "");
}

function renderResults(url, result, searchTerm, locations) {
    var statisticsObj = {
        tables: 0,
        hits: 0,
        lines: 0
    };

    var resultHtml = ''; //'<div class="accordion" id="searchCodeAccordion">';
    for (var i = 0; i < result.length; i++) {
        if(!result[i].result.hits) console.log(locations[i]);
        resultHtml += generateHtmlForCodeSearchEntry(result[i].result, url, searchTerm, statisticsObj);
    }
    //resultHtml += '</div>';

    // var html =  
    //     'Tables: ' + statisticsObj.tables + 
    //     '<br />Records: ' + statisticsObj.hits + 
    //     '<br />Hits: ' + statisticsObj.lines +  
    //     '<hr />' + resultHtml;

    jQuery('#searchcontent').html(resultHtml);
}

function generateHtmlForCodeSearchEntry(data, url, searchTerm, statisticsObj) {
    if (!data || !data.hits || data.hits.length == 0) {
        return '';
    }

    var header = '' +
        '<div class="card">' +
        '<div class="card-header" id="head_' + data.recordType + '">' +
        '<h5 class="mb-0"><button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse_' + data.recordType + '" aria-expanded="true" aria-controls="collapse_' + data.recordType + '">' +
        data.tableLabel + ' [' + data.recordType + '] (' + data.hits.length + ')' +'</button>' +
        '</h5></div>' +
        '<div id="collapse_' + data.recordType + '" class="collapse show" aria-labelledby="' + data.recordType + '" idata-parent="#searchCodeAccordion">' + 
        '<div class="card-body">';

    var footer = 
        '</div> <!--card-body-->' +
        '</div> <!--collapse-->' +
        '</div> <!--card--><br />';


    statisticsObj.tables += 1;
    var tableAccordion = '<div class="accordion" id="searchCodeTableAccordion_' + data.recordType + '">';

    jQuery.each(data.hits, function(idx, hit) {
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

        jQuery.each(hit.matches, function(indx, match) {
            text += "<li><span>Field: " + match.fieldLabel + "</span>";
            text += "<pre><code>";
            jQuery.each(match.lineMatches, function(ix, fieldMatch) {
                if (fieldMatch.escaped.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                    statisticsObj.lines += 1;
                    var fieldMatchHighlighted = fieldMatch.escaped.replace(new RegExp(searchTerm, 'gi'), function(m) { return '<strong>' + m + '</strong>' });
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

    var rtrn =  header + tableAccordion + footer;
    console.log(rtrn);
    return rtrn; 
}


function executeCodeSearch(url, gck, searchTerm, table) {

    if (searchTerm.length < 4){
        jQuery('#searchcontent').html("Searchterm must be 4 characters or more");
        return;
    }
    jQuery('#searchcontent').html("Searching, please wait...");

	var endpoint = url + '/api/sn_codesearch/code_search/search?term=' + searchTerm + '&search_all_scopes=true&search_group=sn_devstudio.Studio Search Group';
	var locations = [];
	if(typeof table != 'string' || (typeof table == 'string' && table.trim() == '')) {
		 locations = [
            'sys_trigger',
            'sys_ui_style',
            'sys_ui_macro',
            'sys_ui_page',
            'sysevent_email_action',
            'sys_script_client',
            'sys_script',
            'sysevent_in_email_action',
            'sys_processor',
            'sysevent_script_action',
            'sys_script_include',
            'sys_ui_action',
            'sys_ui_script',
            'sysevent_email_template',
            'sys_transform_map',
            'sp_widget',
            'sysauto_script',
            'sys_relationship',
            'sys_security_acl',
            'cmn_map_page',
            'sys_ui_policy'
        ];
	} else {
		locations.push(table);
    }

    var locationRequests = [];
    locations.forEach(function(l) {
        locationRequests.push(loadXMLDoc(gck, endpoint + '&table=' + l, null));
    });

    //Iterate through all tables and fill result object
    Q.all(locationRequests).done(function(results) {
        renderResults(url, results, searchTerm, locations);
    });
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

    return new Promise(function(resolve, reject) {
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

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function(m, key, value) {
            vars[key] = decodeURIComponent(value);
        });
    return vars;
}
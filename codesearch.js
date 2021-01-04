var tableIndex = 0;
var statisticsObj;
var tables = [
    'sys_script',
    'sys_ui_action',
    'sys_trigger',
    'sys_ui_page',
    'sys_ui_script',
    'sys_processor',
    'sys_script_include',
    'sys_ui_policy',
    'sys_script_client',
    'sys_ui_macro',
    'process_step_approval',
    'sysevent_in_email_action',
    'sys_ui_style',
    'sys_installation_exit',
    'sys_script_validator',
    'sysauto_script',
    'sys_relationship',
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


var header = document.getElementById("fixheader");
var sticky = 30; //header.offsetTop;

(function initialize() {

    window.onscroll = function() {scrolling()};


    if (getUrlVars("g_ck")) {
        jQuery('#query').val(getUrlVars("query"));
        jQuery('#spnInstance').text(getUrlVars("instance"));
        //
        document.title = getUrlVars("instance") + " - Codesearch";
        var url = getUrlVars("url")
        jQuery('#hreftables').attr('href', url + '/sn_codesearch_table_list.do?sysparm_query=search_group%3D9a44f352d7120200b6bddb0c82520376');
        var endpoint = url + '/api/now/table/sn_codesearch_table?sysparm_query=search_group=9a44f352d7120200b6bddb0c82520376&sysparm_display_value=false&sysparm_fields=table';
        var g_ck = getUrlVars("g_ck");
        var query = getUrlVars("query");
        loadXMLDoc(g_ck, endpoint, null).then((results) => {
            results.result.forEach(res => {
                if (!tables.includes(res.table)) tables.unshift(res.table);
            })

            if (query)
                executeCodeSearch(url, g_ck, query);

        });
    }

    jQuery('#btnSearch').on('click', doSearch);
    jQuery('input#query').on('keyup', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            doSearch();
        }
    });


})();

function doSearch() {
    executeCodeSearch(getUrlVars("url"), getUrlVars("g_ck"), jQuery('#query').val());
}

function renderResults(url, result, searchTerm, tables) {
    var resultHtml = generateHtmlForCodeSearchEntry(result.result, url, searchTerm, statisticsObj);
    if (tableIndex == 0) jQuery('#searchcontent').html('');
    jQuery('#searchcontent').append(resultHtml);
    jQuery('#searchmsgtablelinks').html(statisticsObj.tableNames || "");

}

function generateHtmlForCodeSearchEntry(data, url, searchTerm, statisticsObj) {
    if (!data || !data.hits || data.hits.length == 0) {
        return '';
    }

    var header =
        // '<div class="card"> <a class="anchor" name="'+ data.recordType+'"></a>' +
        // '<div class="card-header" id="head_' + data.recordType + '">' +
        // '<h5 class="mb-0"><button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse_' + data.recordType + '" aria-expanded="true" aria-controls="collapse_' + data.recordType + '">' +
        // data.tableLabel + ' [' + data.recordType + '] (' + data.hits.length + ')' + '</button>' +
        // '</h5></div>' +
        // '<div id="collapse_' + data.recordType + '" class="collapse show" aria-labelledby="' + data.recordType + '" idata-parent="#searchCodeAccordion">' +
        // '<div class="card-body">';<i class="fas fa-chevron-circle-down"></i>
        '<div class="card"> <a class="anchor" name="'+ data.recordType+'"></a>' +
        '<div class="card-header" id="head_' + data.recordType + '">' +
        '<h5 class="mb-0"><button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse_' + data.recordType + '" aria-expanded="true" aria-controls="collapse_' + data.recordType + '">' +
        '<i class="fas fa-chevron-circle-right"></i></button> ' + data.tableLabel + ' [' + data.recordType + '] | Hits:' + data.hits.length +
        '</h5></div>' +
        '<div id="collapse_' + data.recordType + '" class="tablecollapse collapse show" aria-labelledby="' + data.recordType + '" idata-parent="#searchCodeAccordion">' +
        '<div class="card-body">';

    var footer =
        '</div> <!--card-body-->' +
        '</div> <!--collapse-->' +
        '</div> <!--card--><br />';


    statisticsObj.tables += 1;
    statisticsObj.tableNames += "<a href='#" + data.recordType +"'>"+ data.tableLabel +"</a>" ;
    
    
    var tableAccordion = '<div class="accordion" id="searchCodeTableAccordion_' + data.recordType + '">';

    jQuery.each(data.hits, function (idx, hit) {
        var recordHeader = '' +
            '<div class="card">' +
            '<div class="card-header" id="head_' + hit.sysId + '">' +
            '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse_' + hit.sysId + '" aria-expanded="true" aria-controls="collapse_' + hit.sysId + '"><i class="fas fa-chevron-circle-right"></i></button>' +
            ' <span class="bigger"><a href="' + url + '/' + data.recordType + '.do?sys_id=' + hit.sysId + '" target="_blank">'+
            hit.name + ' (' + hit.matches.length + ')' +
            '</a></span>' +
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
    return rtrn;
}


function executeCodeSearch(url, gck, searchTerm) {

    if (searchTerm.length < 4) {
        jQuery('#searchmsg').html("Searchterm must be 4 characters or more");
        return;
    }


    var endpoint = url + '/api/sn_codesearch/code_search/search?term=' + searchTerm + '&limit=500&search_all_scopes=true&search_group=sn_codesearch.Default Search Group';



    function searchLocation(idx) {

        if (idx == 0) {
            jQuery('#searchcontent').html("");
            statisticsObj = {
                tables: 0,
                hits: 0,
                lines: 0,
                tableNames : ''
            };
        }
        jQuery('#searchmsg').html("Searching table: " + tables[idx] + "...");


        loadXMLDoc(gck, endpoint + '&table=' + tables[idx], null).then((results) => {
            renderResults(url, results, searchTerm, tables);
            if ((tableIndex + 1) < tables.length) {
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



function scrolling() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}
var bgPage;
var tabid;
var g_ck;
var url;
var instance;
var urlFull;
var userName;
var roles;
var dtUpdateSets;
var dtUpdates;
var dtNodes;
var dtTables;
var dtDataExplore;
var tablesloaded = false;
var nodesloaded = false;
var dataexploreloaded = false;
var userloaded = false;
var updatesetsloaded = false;
var updatesloaded = false;
var myFrameHref;
var datetimeformat;
var table;
var sys_id;
var isNoRecord = true;



document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        tabid = tabs[0].id;
        urlFull = tabs[0].url;
        bgPage = chrome.extension.getBackgroundPage();
        bgPage.getBrowserVariables(tabid);


    });
    document.querySelector('#firefoxoptions').href = chrome.runtime.getURL("options.html");

});

function setIcon(icon){
    chrome.pageAction.setIcon({
    tabId: tabid,
    path : icon
    });
}

//Set variables, called by BG page after calling getRecordVariables
function setRecordVariables(obj) {

    isNoRecord = !obj.myVars.hasOwnProperty('NOWsysId');
    sys_id = obj.myVars.NOWsysId || obj.myVars.mySysId;
    table = obj.myVars.NOWtargetTable;

    if (!table)
        table = (myFrameHref || urlFull).match(/com\/(.*).do/)[1].replace('_list', '');
    if (!sys_id)
        sys_id = (getParameterByName('sys_id',myFrameHref || urlFull));


    var xmllink = url + '/' + obj.myVars.NOWtargetTable + '.do?sys_id=' + obj.myVars.NOWsysId + '&sys_target=&XML';
    $('#btnviewxml').click(function () {
        chrome.tabs.create({ "url" : xmllink , "active": false});
    }).prop('disabled', isNoRecord);



    $('#btnupdatesets').click(function () {
        chrome.tabs.create({ "url" : url + '/sys_update_set_list.do?sysparm_query=state%3Din%20progress' , "active": false});
    });


    $('#waitinglink, #waitingscript').hide();

}


//Place the key value pair in the chrome local storage, with metafield for date added.
function setToChromeStorage(theName, theValue) {
    var myobj = {};
    myobj[instance + "-" + theName] = theValue;
    myobj[instance + "-" + theName + "-date"] = new Date().toDateString();
    chrome.storage.local.set(myobj, function () {

    });
}

//Place the key value pair in the chrome sync storage.
function setToChromeSyncStorage(theName, theValue) {
    var myobj = {};
    myobj[instance + "-" + theName] = theValue;
    chrome.storage.sync.set(myobj, function () {

    });
}

//Try to get saved form state and set it
function setFormFromSyncStorage(callback) {
    var query = instance + "-formvalues";
    chrome.storage.sync.get(query, function (result) {
        if (query in result) {
            $('form').deserialize(result[query]);
        }
        callback();
    });
}

//Try to get json with servicenow tables, first from chrome storage, else via REST api
function prepareJsonTable() {
    var dataset = $('#slctdataset').val();
    var query = [instance + "-tables-" + dataset , instance + "-tables-" + dataset+ "-date"];
    chrome.storage.local.get(query, function (result) {
        try {
            var thedate = new Date().toDateString();
            if (thedate == result[query[1]].toString()) {
                setDataTableTables(result[query[0]]);
            }
            else
                bgPage.getTables(dataset);
        }
        catch (err) {
            bgPage.getTables(dataset);
        }
    });
}

//Try to get json with instance nodes, first from chrome storage, else via REST api
function prepareJsonNodes() {
    var query = [instance + "-nodes", instance + "-nodes-date"];
    chrome.storage.local.get(query, function (result) {
        try {
            var thedate = new Date().toDateString();
            if (thedate == result[query[1]].toString()) {
                bgPage.getActiveNode(result[query[0]]);
            }
            else
                bgPage.getNodes($('#btnrefreshtables').val());
        }
        catch (err) {
            bgPage.getNodes($('#btnrefreshtables').val());
        }
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



//Set variables, called by BG page after calling getBrowserVariables
//Also attach event handlers.
function setBrowserVariables(obj) {
    
    g_ck = obj.myVars.g_ck || '';
    url = obj.url;
    instance = (new URL(url)).host.replace(".service-now.com", "");
    userName = obj.myVars.NOWusername || obj.myVars.NOWuser_name;
    //roles = obj.myVars.NOWuserroles ;
    datetimeformat = obj.myVars.g_user_date_time_format;
    myFrameHref = obj.frameHref;

    setFormFromSyncStorage(function () {
        $('.nav-tabs a[data-target="' + $('#tbxactivetab').val() + '"]').tab('show');
    });

    //Attach eventlistners
    $('#btnGetUser').click(function () {
        getUserDetails(false);
    });
    //Attach eventlistners
    $('#btncreatefiles').click(function () {
        sendToSnuFileSync();
    });
    $('#tbxname').keypress(function (e) {
        if (e.which == '13') {
            e.preventDefault();
            getUserDetails(false);
        }
    });
    $('#btnrefreshtables').click(function () {
        $('#waitingtables').show();
        bgPage.getTables($('#slctdataset').val());
    });
    $('#slctdataset').on('change', function() {
        $('#waitingtables').show();
        bgPage.getTables(this.value);
        console.log(this.value);
    });
    $('#btnSendXplore').click(function () {
        var script = $('#txtgrquery').val();
        var win = chrome.tabs.create({ "url" : url + "/snd_xplore.do"  , "active" : !(event.ctrlKey||event.metaKey) }); //window.open('');
        jQuery(win).bind('load', function(){
            win.snd_xplore_editor.setValue(script);
        });
    });

    $('.snu-setting').change(function() {
        setSettings();
    });

    
    $('#btnrefreshnodes').click(function () {
        $('#waitingnodes').show();
        bgPage.getNodes();
    });

    $('input').on('blur', function () {
        setToChromeSyncStorage("formvalues", $('form .sync').serialize());
    });

    $('select').on('change', function () {
        setToChromeSyncStorage("formvalues", $('form .sync').serialize());
    });

    $('#btnSetGRName').click(function () {
        getGRQuery();
    });
    $('#tbxgrname').keypress(function (e) {
        if (e.which == '13') {
            e.preventDefault();
            getGRQuery();
        }
    });
    $('#tbxgrtemplate, #cbxtemplatelines').change(function (e) {
        getGRQuery();
    });

    $('a.popuplinks').click(function () {
        event.preventDefault();
        chrome.tabs.create({ "url" : $(this).attr('href')  , "active" : !(event.ctrlKey||event.metaKey) });
    });


    $.fn.dataTable.moment('DD-MM-YYYY HH:mm:ss');
    $.fn.dataTable.moment(datetimeformat);

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).data("target"); // activated tab

        $('#tbxactivetab').val(target);
        setToChromeSyncStorage("formvalues", $('form .sync').serialize());

        switch (target) {
            case "#tabupdatesets":
                if (!updatesetsloaded) {
                    $('#waitingupdatesets').show();
                    bgPage.getUpdateSets();
                    updatesetsloaded = true;
                }
                $('#tbxupdatesets').focus(function () {
                    $(this).select();
                });
                break;
            case "#tabupdates":
                if (!updatesloaded) {
                    $('#waitingupdates').show();
                    bgPage.getUpdates(userName);

                    updatesloaded = true;
                }
                $('#tbxupdates').focus(function () {
                    $(this).select();
                });
                break;
            case "#tabnodes":
                if (!nodesloaded) {
                    $('#waitingnodes').show();
                    prepareJsonNodes();
                    nodesloaded = true;
                }
                $('#tbxnodes').focus(function () {
                    $(this).select();
                });
                break;   
            case "#tabtables":
                $('#tbxtables').focus(function () {
                    $(this).select();
                }).focus();
                if (!tablesloaded) {
                    $('#waitingtables').show();
                    prepareJsonTable();
                    tablesloaded = true;
                }

                break;
            case "#tabdataexplore":
                if (!dataexploreloaded) {
                    $('#waitingdataexplore').show();
                     bgPage.getExploreData();
                     dataexploreloaded = true;
                }
                $('#tbxdataexplore').focus(function () {
                    $(this).select();
                });
                break;        
            case "#tablink":
                $('#waitinglink').show();
                bgPage.getRecordVariables();
                break;
            case "#tabgr":
                getGRQuery();
                break;         
            case "#tabuser":
                if (!userloaded) {
                    if ($('#tbxname').val().length > 0)
                        getUserDetails(false);
                    userloaded = true;
                }
                $('#tbxname').focus(function () {
                    $(this).select();
                });
                break;
            case "#tabsettings":
                if (typeof InstallTrigger !== 'undefined'){
                    jQuery(".hide-in-chrome").css('display','inline');
                }
                getSettings();
                break;
        }

    });

    chrome.tabs.sendMessage(tabid, { method: "getSelection" }, function (selresponse) {
        var selectedText = ('' + selresponse.selectedText).trim();
        if (selectedText.length > 0 && selectedText.length <= 30)
            getUserDetails(selectedText);

    });


}

//Set message, on about tab, callback from getInfoMessage
function setInfoMessage(html) {
    $('#livemessage').html(html);
}

function getSettings(){
    bgPage.getFromSyncStorageGlobal("snusettings", function(settings){
        for (var setting in settings){
            
            if (typeof settings[setting] == "boolean")
                document.getElementById(setting).checked = settings[setting];
            else
                document.getElementById(setting).value = settings[setting];
        };
    })
}

function setSettings(){
    var snusettings = {};
    $('.snu-setting').each(function (index, item) {
        if (this.type == 'checkbox'){
            snusettings[this.id] = this.checked;
        }
        else {
            snusettings[this.id] = this.value;
        }

    });
    bgPage.setToChromeSyncStorageGlobal("snusettings",snusettings);
}

function getGRQuery() {

    var newHref = myFrameHref || urlFull;
    if ((newHref.split('?')[0]).indexOf('_list.do') > 1) {
        bgPage.getGRQuery($('#tbxgrname').val(),$('#tbxgrtemplate').val(), document.getElementById('cbxtemplatelines').checked);
    }
    else {
        bgPage.getGRQueryForm($('#tbxgrname').val(),$('#tbxgrtemplate').val(),document.getElementById('cbxtemplatelines').checked);
    }
}

function setGRQuery(gr) {
    if (gr.indexOf("GlideRecord('undefined')")  > -1) gr = "This only works in forms and lists.";
        $('#txtgrquery').val(gr).select();
}






//Initiate Call to servicenow rest api
function getUserDetails(usr) {
    if (!usr) usr = $('#tbxname').val();
    $('#tbxname').val(usr);
    $('#waitinguser').show();
    bgPage.getUserDetails(usr);
}

//Set the user details table
function setUserDetails(html) {
    $('#rspns').html(html);

    if ($('#createdby').length > 0) {
        $('.nav-tabs a[data-target="#tabuser"]').tab('show');
        $('#createdby').click(function () {
            var usr = $(this).data('username');
            $('#tbxname').val(usr).focus(function () {
                $(this).select();
            });

            bgPage.getUserDetails(usr);
        });
    }
    else
        $('#tbxname').val('');

    $('#waitinguser').hide();
}

//set or refresh datatable with ServiceNow updatesets
function setDataTableUpdateSets(nme) {

    if (nme == 'error'){
        $('#updatesets').hide().after('<br /><div class="alert alert-danger">Data can not be retrieved, are you Admin?</div>');
        $('#waitingupdatesets').hide();
        return false;
    }

    $('#btnnewupdateset').attr('href', url + '/nav_to.do?uri=%2Fsys_update_set.do%3Fsys_id%3D');
    $('#btnopenupdatesets').attr('href', url + '/nav_to.do?uri=%2Fsys_update_set_list.do?sysparm_query=state%3Din%20progress');

    if (dtUpdateSets) dtUpdateSets.destroy();
    dtUpdateSets = $('#updatesets').DataTable({
        "aaData": nme.result.updateSet,
        "aoColumns": [
            { "mDataProp": "name" },
            {
                mRender: function (data, type, row) {
                    var iscurrent = "";
                    if (row.sysId == nme.result.current.sysId) iscurrent = "iscurrent";
                    return "<a class='updatesetlist' href='" + url + "/nav_to.do?uri=sys_update_set.do?sys_id=" + row.sysId + "' title='Table definition' ><i class='fa fa-list' aria-hidden='true'></i></a> " +
                        "<a class='setcurrent " + iscurrent + "' data-post='{name: \"" + row.name + "\", sysId: \"" + row.sysId + "\"}' href='#" + row.sysId + "' title='Set current updateset'><i class='fa fa-dot-circle-o' aria-hidden='true'></i></a> ";
                },
                "searchable": false
            }
        ],
        "drawCallback": function () {
            var row0 = $("#updatesets tbody tr a.iscurrent").closest('tr').clone();
            $('#updatesets tbody tr:first').before(row0.css('background-color', '#5ebeff'));
        },
        "language": {
            "info": "Matched: _TOTAL_ of _MAX_ updatesets | Hold down CMD or CTRL to keep window open after clicking a link",
            "infoFiltered": "",
            "infoEmpty": "No matches found"
        },
        "bLengthChange": false,
        "bSortClasses": false,
        "scrollY": "200px",
        "scrollCollapse": true,
        "paging": false

    });

    $('#tbxupdatesets').keyup(function () {
        dtUpdateSets.search($(this).val()).draw();
    }).focus().trigger('keyup');

    $('a.updatesetlist').click(function () {
        event.preventDefault();
        chrome.tabs.create({ "url" : $(this).attr('href')  , "active" : !(event.ctrlKey||event.metaKey) });
    });

    $('a.setcurrent').click(function () {
        $('#waitingupdatesets').show();
        bgPage.setUpdateSet($(this).data('post'));
    });

    $('#waitingupdatesets').hide();

}


function setNodes(jsn) {

    if (typeof jsn == "undefined" || jsn == "error"){
        $('#instancenodes').hide().after('<br /><div class="alert alert-danger">Nodes data can not be retrieved, are you Admin?</div>');
        $('#waitingnodes').hide();
        return false;
    }

    setToChromeStorage("nodes", jsn);
    bgPage.getActiveNode(jsn);
}

//set or refresh datatable with ServiceNow updatesets
function setDataTableNodes(nme, node) {


    if (dtNodes) dtNodes.destroy();
    dtNodes = $('#instancenodes').DataTable({
        "aaData": nme,
        "aoColumns": [
            {
                mRender: function (data, type, row) {
                    return row.node.display_value.split(":")[1];
                }
            },
            { "mDataProp": "node.display_value" },
            {
                mRender: function (data, type, row) {
                    var iscurrent =  (row.node.value == node); 
                    return "<a class='setnode " + (iscurrent ? "iscurrent" : "")+ "' data-node='" + row.node.display_value + "' href='#' id='" + row.node.value + "' title='Switch to Node'><i class='fa fa-dot-circle-o' aria-hidden='true'></i>"+ (iscurrent ? " Active Node" : " Set Active")+"</a> ";
                },
                "searchable": false
            }
        ],
        "bLengthChange": false,
        "bSortClasses": false,
        "scrollY": "200px",
        "scrollCollapse": true,
        "paging": false

    });

    $('#tbxnodes').keyup(function () {
        dtNodes.search($(this).val()).draw();
    }).focus().trigger('keyup');

    $('a.setnode').click(function () {  
        bgPage.setActiveNode(this.id, $(this).attr('data-node'));
    });

    $('#waitingnodes').hide();

}

//set or refresh datatable with ServiceNow tables
function setDataTableUpdates(nme) {

    if (nme == 'error'){
        $('#updts').hide().after('<br /><div class="alert alert-danger">Data can not be retrieved, are you Admin?</div>');
        $('#waitingupdates').hide();
        return false;
    }

    if (dtUpdates) dtUpdates.destroy();

    dtUpdates = $('#updts').DataTable({
        "aaData": nme.result,
        "aoColumns": [
            { "mDataProp": "type" },
            { "mDataProp": "target_name" },
            { "mDataProp": "sys_updated_on" },
            { "mDataProp": "update_set\\.name" },
            {
                mRender: function (data, type, row) {
                    var i = row.name.lastIndexOf("_");
                    return "<a class='updatetarget' href='" + url + "/" + row.name.substr(0, i) + ".do?sys_id=" + row.name.substr(i + 1) + "' title='Open related record' ><i class='fa fa-pencil-square-o' aria-hidden='true'></i></a> " +
                        "<a class='updatetarget' href='" + url + "/sys_update_xml.do?sys_id=" + row.sys_id + "' title='View update' ><i class='fa fa-history' aria-hidden='true'></i></a> ";
                },
                "searchable": false
            }
        ],
        "language": {
            "info": "Matched: _TOTAL_ of _MAX_ updates | Hold down CMD or CTRL to keep window open after clicking a link",
            "infoFiltered": "",
            "infoEmpty": "No matches found"
        },
        "bLengthChange": false,
        "bSortClasses": false,
        "scrollY": "200px",
        "scrollCollapse": true,
        "order": [[2, "desc"]],
        "paging": false

    });


    $('a.updatetarget').click(function () {
        event.preventDefault();
        chrome.tabs.create({ "url" : $(this).attr('href')  , "active" : !(event.ctrlKey||event.metaKey) });
    });

    $('#tbxupdates').keyup(function () {
        dtUpdates.search($(this).val()).draw();
    }).focus().trigger('keyup');


    $('#waitingupdates').hide();
}


//add object to storage and refresh datatable
function setTables(dataset, jsn) {
    setToChromeStorage("tables-" + dataset, jsn);
    setDataTableTables(jsn);
}



//set or refresh datatable with ServiceNow tables
function setDataTableTables(nme) {

    if (dtTables) {
        dtTables.destroy();
        $('#tbls thead tr .dyna').remove();
        $('#tbls tbody tr').remove();
    }

    var columnDefs =  [
        { "width": "46%", "targets": 0 },
        { "width": "47%", "targets": 1 },
        { "width": "7%", "targets": 2 }
      ];

    var aoColumns = [
        { "mDataProp": "label" },
        { "mDataProp": "name" },
        {
            mRender: function (data, type, row) {
                return "<a class='tabletargetlist' href='" + url + '/' + row.name + "_list.do' title='Go to List (Using query selected below)' ><i class='fa fa-table' aria-hidden='true'></i></a> " +
                    "<a class='tabletarget' href='" + url + "/nav_to.do?uri=sys_db_object.do?sys_id=" + row.name + "%26sysparm_refkey=name' title='Go to table definition' ><i class='fa fa-cog' aria-hidden='true'></i></a> " +
                    "<a class='tabletarget' href='" + url + "/generic_hierarchy_erd.do?sysparm_attributes=table_history=,table=" + row.name + ",show_internal=true,show_referenced=true,show_referenced_by=true,show_extended=true,show_extended_by=true,table_expansion=,spacing_x=60,spacing_y=90,nocontext' title='Show Schema Map'><i class='fa fa-sitemap' aria-hidden='true'></i></a>";
            },
            "searchable": false
        }
    ]

    if (nme.length){
        if (nme[0].hasOwnProperty("super_classname")){
            aoColumns.splice(2, 0, { "mDataProp": "super_classname" });
            aoColumns.splice(3, 0, { "mDataProp": "sys_scopescope" });
            $('th#thaction').after('<th class="dyna">Extends</th><th class="dyna">Scope</th>');

            var columnDefs =  [
                { "width": "25%", "targets": 0 },
                { "width": "25%", "targets": 1 },
                { "width": "25%", "targets": 2 },
                { "width": "18%", "targets": 3 },
                { "width": "7%", "targets": 4 }
              ];

        }
    }

    dtTables = $('#tbls').DataTable({
        "aaData": nme,
        "columnDefs": columnDefs,
        "aoColumns": aoColumns,
        "bAutoWidth": false,
        "language": {
            "info": "Matched: _TOTAL_ of _MAX_ tables, showing max 250 | Hold down CMD or CTRL to keep window open after clicking a link ",
            "infoFiltered": "",
            "infoEmpty": "No matches found"
        },
        "bLengthChange": false,
        "bSortClasses": false,
        "scrollY": "200px",
        "scrollCollapse": true,
        "pageLength": 250,
        //"paging": false,
        "dom": 'rti<"btns"B>',
        "buttons": [
        "copyHtml5"
        ]

    });

    dtTables.on( 'draw.dt', function () {
        $('a.tabletargetlist:not(.evented)').click(function () {
            event.preventDefault();
            var url = $(this).attr('href') + "?sysparm_query=" + $('#slctlistquery').val();
            if (url.indexOf("syslog") > 1){
                url = url.replace(/sys_updated_on/g, 'sys_created_on'); //syslog tables have no updated columnn.
            }
            chrome.tabs.create({ "url" : url  , "active" : !(event.ctrlKey||event.metaKey) });
        }).addClass('evented');
    
        $('a.tabletarget:not(.evented)').click(function () {
            event.preventDefault();
            chrome.tabs.create({ "url" : $(this).attr('href')  , "active" : !(event.ctrlKey||event.metaKey) });
        }).addClass('evented');
    } );
    

    $('#tbxtables').keyup(function () {
        dtTables.search($(this).val()).draw();
    }).focus().trigger('keyup');


    $('#waitingtables').hide();
}


//set or refresh datatable with ServiceNow tables
function setDataExplore(nme) {

    if (dtDataExplore) dtTables.destroy();
//$('#dataexplore').html(nme);
    dtDataExplore = $('#dataexplore').DataTable({
        "aaData": nme,
        "aoColumns": [

            { "mDataProp": "meta.label"},
            { "mDataProp": "name"},
            { "mDataProp": "meta.type"},
            { "mDataProp": "value"},
            { "mDataProp": "display_value"}
        ],
        "language": {
            "info": "Matched: _TOTAL_ of _MAX_ fields | Hold down CMD or CTRL to keep window open after clicking a link",
            "infoFiltered": "",
            "infoEmpty": "No matches found"
        },
        "bLengthChange": false,
        "bSortClasses": false,
        "scrollY": "200px",
        "scrollCollapse": true,
        "paging": false,
        "dom": 'rti<"btns"B>',
        "buttons": [
        "copyHtml5",  
            {
                text: 'Toggle Type',
                action: function ( e, dt, node, config ) {
                    var vis = !dtDataExplore.column(2).visible();
                    dtDataExplore.column(2).visible(vis);

                }
            }
        ]

    });

    $('#tbxdataexplore').keyup(function () {
        dtDataExplore.search($(this).val()).draw();
    }).focus().trigger('keyup');

    $('a.referencelink').click(function () {
        event.preventDefault();
        chrome.tabs.create({ "url" : $(this).attr('href')  , "active" : !(event.ctrlKey||event.metaKey) });
    });


    $('#waitingdataexplore').hide();

}


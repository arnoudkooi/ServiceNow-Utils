let url = getUrlVars('url');
let g_ck = getUrlVars('g_ck');
let tableName = getUrlVars('tablename');
let sysId = getUrlVars('sysid');
let dtViewData;

getViewData();

function getViewData() {

    if (!tableName) { //try to find table and sys_id in workspace
        let myurl = new URL(response.frameHref)
        let parts = myurl.pathname.split("/");
        let idx = parts.indexOf("sub") // show subrecord if available
        if (idx != -1) parts = parts.slice(idx);
        idx = parts.indexOf("record")
        if (idx > -1 && parts.length >= idx + 2) {
            tableName = parts[idx + 1];
            sysId = parts[idx + 2];
        }
    }


    if (!(tableName && sysId)) {
        setViewData([]);
        return true;
    }

    let myurl = url + '/api/now/ui/meta/' + tableName;
    snuFetch(g_ck, myurl, null, function (metaData) {
        let query = '';
        if (sysId)
            query = '&sysparm_query=sys_id%3D' + sysId;
        let myurl = url + '/api/now/table/' + tableName + '?sysparm_display_value=all&sysparm_limit=1' + query;
        snuFetch(g_ck, myurl, null, function (jsn) {

            let dataView = [];
            let propObj = {};
            propObj.name = "#TABLE / SYS_ID";
            propObj.meta = {
                "label": "#TABLE / SYS_ID",
                "type": "TABLE"
            };
            propObj.display_value = "<a class='referencelink' href='" + url + "/" + tableName + ".do?sys_id=" + sysId + "' target='_blank'>" + tableName + " / " + sysId + "</a>";
            propObj.link = url + "/" + tableName + ".do?sys_id=" + sysId;
            propObj.value = tableName + " / " + sysId;
            dataView.push(propObj);

            let rows = {}

            try {
                rows = jsn.result[0];
            } catch (e) {
                rows = { "Error": { "display_value": e.message, "value": "Record data not retrieved." } };
            }

            let whotheheck = `Table: <a href="${url}/${tableName}.do?sys_id=${sysId}" target="_blank">${tableName}</a> 
            | Created: <a href="${url}/sys_user.do?sys_id=${rows?.sys_created_by?.value}&sysparm_refkey=user_name" target="_blank">${rows?.sys_created_by?.display_value}</a> 
              - ${rows?.sys_created_on?.display_value} 
            | Updated: <a href="${url}/sys_user.do?sys_id=${rows?.sys_updated_by?.value}&sysparm_refkey=user_name" target="_blank">${rows?.sys_updated_by?.display_value}</a> 
              - ${rows?.sys_updated_on?.display_value}`;
            document.querySelector('#whotheheck').innerHTML = whotheheck;

            for (let key in rows) {
                let propObj = {};
                if (!rows.hasOwnProperty(key)) continue;

                let display_value = rows[key].display_value;
                let link = propObj.link = rows[key].link;
                if (link) {
                    let linksplit = link.split('/');
                    let href = url + '/' + linksplit[6] + '.do?sys_id=' + linksplit[7];
                    if (!display_value) display_value = '[Deleted reference or empty display value]';
                    display_value = "<a href='" + href + "' target='_blank'>" + display_value + "</a>";
                }

                propObj.name = key;
                propObj.meta = (metaData && metaData != "error") ? metaData.result.columns[key] : { "label": "Error" };
                propObj.display_value = display_value;
                propObj.value = (display_value != rows[key].value) ? rows[key].value : '';


                dataView.push(propObj);
            }

            setViewData(dataView);
        });
    });
}


//set or refresh datatable with ServiceNow tables
function setViewData(nme) {

    Object.entries(nme).forEach( // add check of empty fields to be able to filter out
        ([key, obj]) => {
            nme[key].hasdata = (obj.value || obj.display_value) ? "hasdata" : "";
            if (!nme[key].link ) {
                let escpd = escape(nme[key].display_value);
                if (nme[key].display_value != escpd)
                    nme[key].display_value = '<pre style="white-space: pre-wrap; max-width:600px;"><code>' + escpd + '</code></pre>'
            }
        }
    );

    if (dtViewData) dtTables.destroy();
    //$('#dataexplore').html(DOMPurify.sanitize(nme));
    dtViewData = $('#dataexplore').DataTable({

        "aaData": nme,
        "createdRow": function (row, data, index) {
           // console.log(row, data, index);
        },
        "aoColumns": [

            { "mDataProp": "meta.label" },
            { "mDataProp": "name" },
            {
                mRender: function (data, type, row) {
                    let reference = "<div class='refname'>" + row?.meta?.reference + "</div>";
                    if (reference.includes('undefined')) reference = '';
                    return row?.meta?.type + reference;
                },

                "bSearchable": true,
                "mDataProp": "meta.type"

            },
            { "mDataProp": "value" },
            { "mDataProp": "display_value" },
            { "mDataProp": "hasdata" }
        ],
        "language": {
            "info": "Matched: _TOTAL_ of _MAX_ fields | Hold down CMD or CTRL to keep window open after clicking a link &nbsp;&nbsp;",
            "infoFiltered": "",
            "infoEmpty": "No matches found"
        },
        "bLengthChange": false,
        "bSortClasses": false,
        "scrollY": "75vh",
        "scrollCollapse": true,
        "paging": false,
        "dom": 'rti<"btns"B>',
        "buttons": [
            "copyHtml5"
        ]

    });

    dtViewData.column(5).visible(false);

    $('#tbxdataexplore').keyup(function () {
        let srch = ($('#cbxhideempty').prop('checked') ? "hasdata " : "") + $('#tbxdataexplore').val();
        dtViewData.search(srch, true).draw();
    }).focus().trigger('keyup');


    $('#cbxhideempty').change(function (e) {
        let srch = ($('#cbxhideempty').prop('checked') ? "hasdata " : "") + $('#tbxdataexplore').val();
        dtViewData.search(srch, true).draw();
    });

    $('a.referencelink').click(function () {
        event.preventDefault();
        chrome.tabs.create({ "url": $(this).attr('href'), "active": !(event.ctrlKey || event.metaKey) });
    });

    $('#waitingdataexplore').hide();

}

//Function to query Servicenow API
function snuFetch(token, url, post, callback) {
    let hdrs = {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    if (token) //only for instances with high security plugin enabled
        hdrs['X-UserToken'] = token;

    let requestInfo = {
        method: 'get',
        headers: hdrs
    }

    if (post) {
        requestInfo.method = 'PUT';
        requestInfo.body = post;
    }

    fetch(url, requestInfo)
        .then(response => response.json())
        .then(data => {
            callback(data);
        });

}

function getUrlVars(key) {
    let vars = {};
    let parts = window.location.href.replace(
        /[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = decodeURIComponent(value);
        }
    );
    return vars[key];
}

function escape(htmlStr) {
    if (!htmlStr) return '';
    return htmlStr.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");        
 
 }


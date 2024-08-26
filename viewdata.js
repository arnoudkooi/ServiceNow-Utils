let url = getUrlVars('url');
let g_ck = getUrlVars('g_ck');
let tableName = getUrlVars('tablename');
let sysId = getUrlVars('sysid');
let dtViewData;

getViewData();

async function getViewData() {
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
    let metaUrl = url + '/api/now/ui/meta/' + tableName;
    let dataUrl = url + '/api/now/table/' + tableName + '?sysparm_display_value=all&sysparm_limit=1&sysparm_query=sys_id%3D' + sysId;

    try {
        const [metaData, recordData] = await Promise.all([snuFetch(g_ck, metaUrl), snuFetch(g_ck, dataUrl)]);

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
        let rows = {};
        try {
            rows = recordData.result[0];
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
    } catch (error) {
        console.error('Error fetching data:', error);
        setViewData([]);
    }
}

// Function to query Servicenow API
function snuFetch(token, url, post) {
    return new Promise(async (resolve, reject) => {
        const headers = {
            'Cache-Control': 'no-cache',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-UserToken': token || undefined
        };
        try {
            const response = await fetch(url, {
                method: post ? post?.method : 'GET',
                headers,
                body: post ? JSON.stringify(post?.body) : null
            });
            let data = response.ok ? await response.json() : response;
            data.resultcount = Number(response.headers.get("X-Total-Count"));
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}

// Function to query Servicenow API
function snuFetch(token, url, post) {
    return new Promise(async (resolve, reject) => {
        const headers = {
            'Cache-Control': 'no-cache',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-UserToken': token || undefined
        };
        try {
            const response = await fetch(url, {
                method: post ? post?.method : 'GET',
                headers,
                body: post ? JSON.stringify(post?.body) : null
            });
            let data = response.ok ? await response.json() : response;
            data.resultcount = Number(response.headers.get("X-Total-Count"));
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}


//set or refresh datatable with ServiceNow tables
function setViewData(nme) {

    Object.entries(nme).forEach( // add check of empty fields to be able to filter out
        ([key, obj]) => {
            nme[key].hasdata = (obj.value || obj.display_value) ? "hasdata" : "";
            if (!nme[key].link) {
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
                    let choices = (row?.meta?.choices?.length > 0) ? `<span class='choices'> ${row?.meta?.choices?.length}</span>` : "*";
                    if (reference.includes('undefined')) reference = '';
                    return `${row?.meta?.type} <a class='fielddetailsa' data-field="${row?.meta?.name}" href="#">${choices}</a>${reference}`;
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
        ],
        "initComplete": function (settings, json) {
            document.querySelectorAll('a.fielddetailsa').forEach(a => {
                a.addEventListener('click', function (ev) {
                    ev.preventDefault();
                    let fieldName = a.dataset.field;
                    let fieldData = nme.filter((field) => field.meta.name == fieldName)[0];
                    parseAndShowFieldModal(fieldData.meta);
                });
            });
        }

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
                method: post ? post?.method : 'GET',
                headers,
                body: post ? JSON.stringify(post?.body) : null
            });
            let data = response.ok ? await response.json() : response;
            data.resultcount = Number(response.headers.get("X-Total-Count"));
            if (callback) callback(data);
            resolve(data);
        } catch (error) {
            if (callback) callback(error);
            reject(error);
        }
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



// Function to convert JSON to a modern HTML table
function parseAndShowFieldModal(obj) {

    let html = ``;


    let choices = obj.choices;
    delete obj.choices;

    if (choices) {
        console.log(choices);
        html += `<h5>Choices</h5>
        <table class="fieldmodal">
            <thead>
                <tr>
                    <th>Label</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>`;

        choices.forEach(item => {
            html += `<tr>
            <td>${item.label}</td>
            <td>${item.value}</td>
         </tr>`;
        });
        html += `</tbody></table>`;
    }

    html += `<h5>Field properties</h5>
        <table class="fieldmodal">
                    <thead>
                <tr>
                    <th>Property</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>`;
    for (let key in obj) {

        if (obj.hasOwnProperty(key)) {
            let value = obj[key];

            if (typeof value === 'object' && value !== null) {

                if (Array.isArray(value)) {
                    html += `<tr><td>${key}</td><td>`;
                    html += '<table><tr>';
                    let headers = Object.keys(value[0] || {});
                    headers.forEach(header => html += `<th>${header}</th>`);
                    html += '</tr>';
                    value.forEach(item => {
                        html += '<tr>';
                        headers.forEach(header => {
                            html += `<td>${typeof item[header] == 'object' ? '<pre>' + JSON.stringify(item[header], null, 2) + '</pre>' : item[header]}</td>`;
                        });
                        html += '</tr>';
                    });
                    html += '</table>';
                    html += '</td></tr>';
                } else {
                    console.log(key, value);
                    html += `<tr><td>${key}</td><td>${JSON.stringify(value, null, 2)}</td></tr>`;
                }
            } else {
                html += `<tr><td>${key}</td><td>${value}</td></tr>`;
            }
        }
    }

    html += '</table>';

    let dictUrl = `${url}/sys_dictionary.do?sysparm_query=name=javascript:new PAUtils().getTableAncestors('${tableName}')^element=${obj.name}&sysparm_view=advanced`;

    document.getElementById("fieldmodalTableHeader").innerHTML = `Field details: ${obj.label} | <span class="code">${obj.name}</span>  <a href="${dictUrl}" title="Open dictionary entry" target="_blank">&#9881;</a>`;
    document.getElementById("fieldmodalTableContent").innerHTML = html;
    $('#fieldDetailsModal').modal('show');
}
var t;

$(document).ready(function () {
    t = $('#synclog').DataTable({
        columnDefs: [{
                render: $.fn.dataTable.render.moment('X', 'HH:mm:ss'),
                targets: 0
            },
            {
                width: 50,
                targets: [0, 1]
            }
        ],
        "bLengthChange": false,
        "bSortClasses": false,
        "scrollY": "100%",
        "scrollCollapse": true,
        "paging": false,
        "order": [
            [0, "desc"]
        ]
    });
    $('#addRow').on('click', function () {
        t.row.add([
            new Date(), 'click', '', '', '', ''
        ]).draw(false);
    });



    ws = new WebSocket("ws://127.0.0.1:1978");


    ws.onerror = function (evt) {
        t.row.add([
            new Date(), 'WebSocket', '<b>Could not connect to WebSocket.</b><br />Check if VS Code is running and reload the page<br />' + 
            '<a target="_blank" href="https://marketplace.visualstudio.com/items?itemName=arnoudkooicom.sn-scriptsync">Get sn-scriptsync from Visual Code Marketplace</a>'
        ]).draw(false);
        increaseTitlecounter();
        flashFavicon('images/iconred48.png', 3);
        setTimeout(function () { location.reload(true); }, 30000);
    };

    ws.onclose = function (evt) {
        t.row.add([
            new Date(), 'WebSocket', '<b>Connection to WebSocket lost, reload page to reconnect</b>'
        ]).draw(false);
        increaseTitlecounter();
        flashFavicon('images/iconred48.png', 3);
    };

    ws.onmessage = function (evt) {
        var wsObj = JSON.parse(evt.data);
        if ('contentLength' in wsObj) {
            t.row.add([
                new Date(), 'ServiceNow', 'Opened in VS Code: <b>' + wsObj.name + '</b><br /><span class="code">Instance: ' +
                wsObj.instance.name + ' | Field: ' + wsObj.table + '.' + wsObj.field +
                ' | Characters: ' + wsObj.contentLength + '</code>'
            ]).draw(false);
            flashFavicon('images/icongreen48.png', 4);
            increaseTitlecounter();
        } else if (wsObj.action == 'requestRecord') {
            requestRecord(wsObj);
        } else if (wsObj.action == 'requestRecords') {
            requestRecords(wsObj);
        } else if ('instance' in wsObj) {
            updateRecord(wsObj);
        } else {
            t.row.add([
                new Date(), 'WebSocket', JSON.parse(evt.data)
            ]).draw(false);
            increaseTitlecounter();
            if (evt.data.indexOf('error') > 0) {
                flashFavicon('images/iconred48.png', 3);
                ws.send(wsObj);
            }

        }
    };

    window.onbeforeunload = function () {
        ws.onclose = function () {};
        ws.close();
        return "Are you sure you want to navigate away?";
    };

});

function requestRecord(requestJson) {
    var client = new XMLHttpRequest();
    client.open("get", requestJson.instance.url + '/api/now/table/' +
        requestJson.tableName + '/' + requestJson.sys_id);

    client.setRequestHeader('Accept', 'application/json');
    client.setRequestHeader('Content-Type', 'application/json');
    client.setRequestHeader('X-UserToken', requestJson.instance.g_ck);

    client.onreadystatechange = function () {
        if (this.readyState == this.DONE) {
            var resp = JSON.parse(this.response);

            if (resp.hasOwnProperty('result')) {
                t.row.add([
                    new Date(), 'VS Code', 'Received from ServiceNow: <b>' + requestJson.name + '</b><br /><span class="code">Instance: ' +
                    requestJson.instance.name + ' | Table: ' + requestJson.tableName + '</span>'

                ]).draw(false);
                increaseTitlecounter();
                requestJson.type = "requestRecord";
                requestJson.responses = this.response;
                ws.send(requestJson);

            } else {
                t.row.add([
                    new Date(), 'VS Code', this.response
                ]).draw(false);
                increaseTitlecounter();
                ws.send(this.response);
            }
        }
    };
    client.send();
}

function requestRecords(requestJson) {
    var client = new XMLHttpRequest();
    client.open("get", requestJson.instance.url + '/api/now/table/' +
        requestJson.tableName + '?' + requestJson.queryString);

    client.setRequestHeader('Accept', 'application/json');
    client.setRequestHeader('Content-Type', 'application/json');
    client.setRequestHeader('X-UserToken', requestJson.instance.g_ck);

    client.onreadystatechange = function () {
        if (this.readyState == this.DONE) {
            var resp = JSON.parse(this.response);

            if (resp.hasOwnProperty('result')) {
                t.row.add([
                    new Date(), 'VS Code', 'Received from ServiceNow: <b>' + resp.result.length + ' records</b><br /><span class="code">Instance: ' +
                    requestJson.instance.name + ' | Table: ' + requestJson.tableName + '</span>'

                ]).draw(false);
                increaseTitlecounter();
                requestJson.type = "requestRecords";
                requestJson.results = resp.result;
                ws.send(JSON.stringify(requestJson));

            } else {
                t.row.add([
                    new Date(), 'VS Code', this.response
                ]).draw(false);
                increaseTitlecounter();
                ws.send(JSON.stringify(resp));
            }
        }
    };
    client.send();
}


function updateRecord(scriptObj) {
    var client = new XMLHttpRequest();
    client.open("put", scriptObj.instance.url + '/api/now/table/' +
        scriptObj.tableName + '/' + scriptObj.sys_id +
        '?sysparm_fields=sys_id');
    var data = {};
    data[scriptObj.fieldName] = scriptObj.content;

    client.setRequestHeader('Accept', 'application/json');
    client.setRequestHeader('Content-Type', 'application/json');
    client.setRequestHeader('X-UserToken', scriptObj.instance.g_ck);

    client.onreadystatechange = function () {
        if (this.readyState == this.DONE) {
            var resp = JSON.parse(this.response);

            if (resp.hasOwnProperty('result')) {
                t.row.add([
                    new Date(), 'VS Code', 'Saved to ServiceNow: <b>' + scriptObj.name + '</b><br /><span class="code">Instance: ' +
                    scriptObj.instance.name + ' | Field: ' + scriptObj.tableName + '.' + scriptObj.fieldName +
                    ' | Characters: ' + scriptObj.content.length + '</span>'

                ]).draw(false);
                flashFavicon('images/icongreen48.png', 4);
                increaseTitlecounter();

                if (scriptObj.hasOwnProperty('testUrls')) {
                    for (var i = 0; i < scriptObj.testUrls.length; i++) {
                        chrome.tabs.query({
                            url: scriptObj.testUrls[i]
                        }, function (arrayOfTabs) {
                            if (arrayOfTabs.length)
                                chrome.tabs.reload(arrayOfTabs[0].id);
                        });
                    }
                }


            } else {
                t.row.add([
                    new Date(), 'VS Code', this.response
                ]).draw(false);
                flashFavicon('images/iconred48.png', 3);
                increaseTitlecounter();
                ws.send(this.response);

            }
        }
    };
    client.send(JSON.stringify(data));
}

var favIconIsFlashing = false;

function flashFavicon(src, flashes) {

    setIntervalX(function () {
        currentsource = favIconIsFlashing ? '/images/icon32.png' : src;
        changeFavicon(currentsource);
        favIconIsFlashing = !favIconIsFlashing;
    }, 900, flashes);

}

function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {

        callback();

        if (++x === repetitions) {
            window.clearInterval(intervalID);
            favIconIsFlashing = false;
        }
    }, delay);
}
var eventCount = 0;

function increaseTitlecounter() {
    document.title = "[" + (++eventCount) + "] Scriptsync ServiceNow Utils by arnoudkooi.com";
}

function changeFavicon(src) {
    var link = document.createElement('link'),
        oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = src;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
}
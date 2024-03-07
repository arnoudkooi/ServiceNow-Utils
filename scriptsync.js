let t;
let realTimeUpdating = false;
let msg;
let msgCnt = 0;
let msgShown = false;
let scriptTabCreated = false;
let ws;
let thistabid
let scriptsyncinstances;

chrome.tabs.getCurrent(tab => { thistabid = tab.id });

//this replaces the  webserver port 1977 communication to proxy ecverything through websocket/helpertab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.event == "scriptsyncpostdata") {

        let instanceurl = message?.command?.instance?.url;
        if (instanceurl && scriptsyncinstances?.allowed?.includes(instanceurl))
            ws.send(JSON.stringify(message.command));
        else if (instanceurl && scriptsyncinstances?.blocked?.includes(instanceurl)) {
            t.row.add([
                new Date(), 'ServiceNow', 'Received from blocked source: <b>' + instanceurl + '</b><br />Message ignored'

            ]).draw(false);
            flashFavicon('images/iconred48.png', 3);
        }
        else if (instanceurl) {
            msg = message;
            document.querySelector('#instanceurl').innerText = instanceurl
            document.querySelector('#instanceapprovediv').classList.remove("hidden");
            flashFavicon('images/iconred48.png', 3);
            let audio = new Audio('/images/alert.mp3');
            audio.play();
            document.title = "[" + (++eventCount) + "] SN-SCRIPTSYNC ATTENTION";
        }
        else {
            t.row.add([
                new Date(), 'ServiceNow', 'Unkown message<br />Message ignored, check browser console'
            ]).draw(false);
            flashFavicon('images/iconred48.png', 3);
            console.log(message);
        }

    }
});




$(document).ready(function () {

    document.querySelector('#instanceallow').addEventListener('click', (e) => {
        let instanceurl = msg?.command?.instance?.url;
        scriptsyncinstances.allowed.push(instanceurl);
        setToChromeStorageGlobal('scriptsyncinstances', scriptsyncinstances);
        document.querySelector('#instanceapprovediv').classList.add("hidden");
        t.row.add([
            new Date(), 'Helper tab', 'Allowed source: <b>' + instanceurl + '</b><br />Message send to VS Code sn-scriptsync'
        ]).draw(false);
        ws.send(JSON.stringify(msg.command));
        increaseTitlecounter();
        flashFavicon('images/icongreen48.png', 1);
        msg = null;
        setInstanceLists();
    })

    document.querySelector('#instanceblock').addEventListener('click', (e) => {
        let instanceurl = msg?.command?.instance?.url;
        scriptsyncinstances.blocked.push(instanceurl);
        setToChromeStorageGlobal('scriptsyncinstances', scriptsyncinstances);
        document.querySelector('#instanceapprovediv').classList.add("hidden");

        t.row.add([
            new Date(), 'Helper tab', 'Blocked source: <b>' + instanceurl + '</b><br />Message ignored'

        ]).draw(false);
        increaseTitlecounter();
        msg = null;
        setInstanceLists();

    })

    getFromChromeStorageGlobal('scriptsyncinstances', c => {
        scriptsyncinstances = c || { allowed: [], blocked: [] }
        setInstanceLists();
    });

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


    function connect() {

        ws = new WebSocket("ws://127.0.0.1:1978");


        ws.onerror = function (evt) {

            if (msgShown) {
                return;
            }
            msgShown = true;

            t.row.add([
                new Date(), 'WebSocket', '<b>Could not connect to WebSocket.</b><br />Check if VS Code is running and wait for connection or reload the page.<br />' +
                '<a target="_blank" href="https://marketplace.visualstudio.com/items?itemName=arnoudkooicom.sn-scriptsync">Get sn-scriptsync from Visual Code Marketplace</a>'
            ]).draw(false);
            increaseTitlecounter();
            flashFavicon('images/iconred48.png', 3);
            //setTimeout(function () { location.reload(true); }, 30000);
        };

        ws.onclose = function (evt) {
            if (msgCnt > 0) {
                t.row.add([
                    new Date(), 'WebSocket', '<b>Connection to WebSocket lost, check if sn-scriptsync runs and wait for connection or reload page.</b>'
                ]).draw(false);
                increaseTitlecounter();
                flashFavicon('images/iconred48.png', 3);
                msgCnt = 0;
            }

            setTimeout(function () {
                connect();
            }, 1000);
        };

        ws.onmessage = function (evt) {
            msgCnt++;
            let wsObj = JSON.parse(evt.data);
            let instanceurl = wsObj?.instance?.url;
            if (instanceurl && scriptsyncinstances?.allowed?.includes(instanceurl)) {
                // cleared!
            }
            else if (instanceurl && scriptsyncinstances?.blocked?.includes(instanceurl)) {
                t.row.add([
                    new Date(), 'VS Code', 'Received from blocked source: <b>' + instanceurl + '</b><br />Message ignored'

                ]).draw(false);
                flashFavicon('images/iconred48.png', 3);
                return false;
            }
            else if (instanceurl) {
                t.row.add([
                    new Date(), 'VS Code', 'Unknown source: <b>' + instanceurl + '</b><br />' +
                    'The last SN Utils update requires approval per instance, please run /token from the instance to approve or block.<br />' +
                    '<b>Message not processed</b>'

                ]).draw(false);
                flashFavicon('images/iconred48.png', 3);
                let audio = new Audio('/images/alert.mp3');
                audio.play();
                document.title = "[" + (++eventCount) + "] SN-SCRIPTSYNC ATTENTION";
                return false;
            }

            if (wsObj.hasOwnProperty('liveupdate')) {
                updateRealtimeBrowser(wsObj);
            }
            else if (wsObj.hasOwnProperty('mirrorbgscript')) {
                mirrorBgScript(wsObj);
            }
            else if (wsObj.hasOwnProperty('refreshedtoken')) {
                refreshedToken(wsObj);
                flashFavicon('images/icongreen48.png', 4);
                increaseTitlecounter();
            }
            else {
                realTimeUpdating = false;
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
                } else if (wsObj.action == 'requestAppMeta') {
                    requestAppMeta(wsObj);
                } else if (wsObj.action == 'bannerMessage') {
                    setBannerMessage(wsObj);
                } else if (wsObj.action == 'updateVar') {
                    updateVar(wsObj);
                } else if (wsObj.action == 'executeBackgroundScript') {
                    snuStartBackgroundScript(wsObj.content, wsObj.instance, wsObj.action);
                } else if ('instance' in wsObj) {
                    if (wsObj.tableName == 'flow_action_scripts') {
                        updateActionScript(wsObj);
                    }
                    else
                        updateRecord(wsObj, true);
                } else {
                    increaseTitlecounter();
                    if (evt.data.includes('error') || evt.data.includes('errno')) {

                        var data = JSON.parse(evt.data);

                        if (data?.errno == -30 || data?.errno == -4048) { //-30 mac -4048 windows
                            t.row.add([
                                new Date(), 'VS Code', `Error, could not create sub folder. Please check the following:<br />
                                <ol>
                                    <li>Do you have full write access to the current folder in VS Code.</li>
                                    <li>If you have opened a workspace with multiple (virtual)folders, close the workspace and open the folder direct in VS Code.</li>
                                    <li>Restart sn-scriptsync in VS Code by clicking the sn-scriptsync in the bottom bar in VS Code twice.</li>
                                </ol>
                                It is recommended to create a folder named scriptsync in your documents folder and open that in VS Code. <br />
                                Follow instructions in <a href='https://youtu.be/ZDDminMjGTA?t=40' target='_blank'>this video</a>.`
                            ]).draw(false);
                        }
                        else {
                            t.row.add([
                                new Date(), '', `<pre> ${JSON.stringify(data, 4, 4)}</pre>`
                            ]).draw(false);
                            t.row.add([
                                new Date(), 'VS Code', "Error, please check browser console or message below to review error details. Follow instructions in <a href='https://youtu.be/ZDDminMjGTA?t=40' target='_blank'>this video</a>"
                            ]).draw(false);
                        }

                        console.dir(data);
                        flashFavicon('images/iconred48.png', 3);
                        ws.send(wsObj);
                    }
                    else {
                        t.row.add([
                            new Date(), 'WebSocket', JSON.parse(evt.data)
                        ]).draw(false);
                        flashFavicon('/images/icon32.png', 1);
                    }
                }
            }
        };

        window.onbeforeunload = function () {
            ws.onclose = function () { };
            ws.close();
            return "Are you sure you want to navigate away?";
        };
    }
    connect();

});

async function requestRecord(requestJson) {
    try {
        const response = await fetch(`${requestJson.instance.url}/api/now/table/${requestJson.tableName}/${requestJson.sys_id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-UserToken': requestJson.instance.g_ck
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const resp = await response.json();

        if (resp.hasOwnProperty('result')) {
            if (requestJson.hasOwnProperty('actionGoal') && requestJson.actionGoal !== 'updateCheck') {
                t.row.add([new Date(), 'VS Code', `Received from ServiceNow: <b>${requestJson.name}</b><br /><span class="code">Instance: ${requestJson.instance.name} | Table: ${requestJson.tableName}</span>`
                ]).draw(false);
            }
            increaseTitlecounter();
            requestJson.type = "requestRecord";
            requestJson.result = resp.result;
            ws.send(JSON.stringify(requestJson));
        } else {
            t.row.add([new Date(), 'VS Code', resp
            ]).draw(false);
            increaseTitlecounter();
            ws.send(JSON.stringify(resp));
        }
    } catch (error) {
        t.row.add([new Date(), 'VS Code', `An error occurred: ${error}`]).draw(false);
        increaseTitlecounter();
        ws.send(JSON.stringify({ error: error.message }));
    }
}


function setBannerMessage(wsObj) {
    let bnr = document.querySelector('#bannermessage');
    bnr.innerHTML = wsObj.message;
    bnr.className = wsObj.class;
}



async function requestToken(scriptObj) {
    try {
        t.row.add([
            new Date(), 'WebSocket', 'Trying to acquire new token from instance'
        ]).draw(false);
        const response = await fetch(`${scriptObj.instance.url}/sn_devstudio_/v1/get_publish_info.do`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'BasicCustom'
            }
        });

        if (!response.ok) {
            t.row.add([new Date(), 'WebSocket', `Error: ${JSON.stringify(resp)}`
            ]).draw(false);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const resp = await response.json();

        if (resp.hasOwnProperty('ck')) {
            scriptObj.instance.g_ck = resp.ck;
            const data = {
                "action": "writeInstanceSettings",
                "instance": scriptObj.instance
            };
            increaseTitlecounter();
            ws.send(JSON.stringify(data));

            t.row.add([new Date(), 'WebSocket', `New token acquired from: ${scriptObj.instance.name}`
            ]).draw(false);

            updateRecord(scriptObj, false);
        } else {
            t.row.add([new Date(), 'WebSocket', `Error: ${JSON.stringify(resp)}`
            ]).draw(false);
        }
    } catch (error) {
        t.row.add([new Date(), 'WebSocket', `An error occurred: ${error}`
        ]).draw(false);
    }
}


async function requestRecords(requestJson) {
    try {
        const url = `${requestJson.instance.url}/api/now/table/${requestJson.tableName}?${requestJson.queryString}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-UserToken': requestJson.instance.g_ck
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const resp = await response.json();
        if (resp.hasOwnProperty('result')) {
            t.row.add([
                new Date(), 'VS Code', `Received from ServiceNow: <b>${resp.result.length} records</b><br /><span class="code">Instance: ${requestJson.instance.name} | Table: ${requestJson.tableName}</span>`
            ]).draw(false);

            increaseTitlecounter();
            requestJson.type = "requestRecords";
            requestJson.results = resp.result;
            ws.send(JSON.stringify(requestJson));
        } else {
            t.row.add([new Date(), 'VS Code', JSON.stringify(resp)
            ]).draw(false);
            increaseTitlecounter();
            ws.send(JSON.stringify(resp));
        }
    } catch (error) {
        t.row.add([new Date(), 'VS Code', `An error occurred: ${error}`
        ]).draw(false);
        increaseTitlecounter();
    }
}


async function requestAppMeta(requestJson) {
    try {
        const url = `${requestJson.instance.url}/_sn/sn_devstudio_/v1/ds?sysparm_transaction_scope=${requestJson.appId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-UserToken': requestJson.instance.g_ck
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const resp = await response.json();
        if (resp.hasOwnProperty('artifacts')) {
            t.row.add([new Date(), 'VS Code', `Received Scope artifacts from app: <b>${requestJson.appName}</b><br /><span class="code">Instance: ${requestJson.instance.name} | scope: ${requestJson.appScope}</span>`
            ]).draw(false);
            increaseTitlecounter();
            requestJson.type = "requestRecord";
            requestJson.result = resp;
            ws.send(JSON.stringify(requestJson));
        } else {
            t.row.add([
                new Date(), 'VS Code', JSON.stringify(resp)
            ]).draw(false);
            increaseTitlecounter();
            ws.send(JSON.stringify(resp));
        }
    } catch (error) {
        t.row.add([new Date(), 'VS Code', `An error occurred: ${error}`
        ]).draw(false);
        increaseTitlecounter();
    }
}

function updateRealtimeBrowser(scriptObj) {
    if (!realTimeUpdating) {
        t.row.add([
            new Date(), 'VS Code', 'Realtime updating widget CSS'
        ]).draw(false);
        realTimeUpdating = true;
    }

    chrome.tabs.query({
        currentWindow: true,
        active: true
    },
        function (tabs) {
            if (tabs[0].id == thistabid) return;
            chrome.tabs.sendMessage(tabs[0].id, {
                method: "runFunction",
                myVars: "document.getElementById('v" + scriptObj.sys_id + "-s').innerHTML = `" + DOMPurify.sanitize(scriptObj.css) + "`"
            });
        }
    );

}

function mirrorBgScript(scriptObj) {
    if (!realTimeUpdating) {
        t.row.add([
            new Date(), 'VS Code', 'Realtime updating Background Script'
        ]).draw(false);
        realTimeUpdating = true;
    }


    chrome.tabs.query({ //in iframe
        url: scriptObj.instance.url + "/*sys.scripts.do*"
    }, function (arrayOfTabs) {


        if (arrayOfTabs.length) {
            scriptTabCreated = false;
            var prefix = "document.";
            if (arrayOfTabs[0].url.includes("nav_to.do?uri=%2Fsys.scripts.do")) prefix = "gsft_main.document.";
            else if (arrayOfTabs[0].url.includes("now/nav/ui/classic/params/target/sys.scripts.do")) prefix = "document.querySelector('[component-id]').shadowRoot.querySelector('#gsft_main').contentDocument.";

            console.log(arrayOfTabs);
            chrome.tabs.sendMessage(arrayOfTabs[0].id, {
                method: "setBackgroundScript",
                myVars: scriptObj
            });
        }
        else if (!scriptTabCreated) {
            var createObj = {
                'url': scriptObj.instance.url + "/sys.scripts.do",
                'active': true
            }
            chrome.tabs.create(createObj,
                function (tab) {
                    console.log(tab);
                    chrome.tabs.sendMessage(tab.id, {
                        method: "setBackgroundScript",
                        myVars: scriptObj
                    });
                }
            );

            t.row.add([
                new Date(), 'VS Code', 'Opening new Background Script tab'
            ]).draw(false);

            scriptTabCreated = true;
        }

    });

}

function refreshedToken(instanceObj) {
    t.row.add([
        new Date(), 'VS Code', instanceObj.response
    ]).draw(false);
}

function refreshToken(instanceObj) { //todo check mv3 compatability

    t.row.add([
        new Date(), 'WebSocket', "Invalid token, trying to get new g_ck token from instance: " + instanceObj.name
    ]).draw(false);


    chrome.tabs.query({
        url: instanceObj.url + "/*"
    }, function (arrayOfTabs) {
        if (arrayOfTabs.length) {
            chrome.tabs.executeScript(arrayOfTabs[0].id, { "code": "document.getElementById('sn_gck').value" },
                function (g_ck) {
                    console.log(g_ck)
                });
        }
        else {
            t.row.add([
                new Date(), 'WebSocket', "Request g_ck failed, please open a new session " + instanceObj.name
            ]).draw(false);
        }
    });
}



async function updateRecord(scriptObj, canRefreshToken) {
    try {
        const scope = scriptObj?.scope ? `&sysparm_transaction_scope=${scriptObj.scope}` : '';
        const url = `${scriptObj.instance.url}/api/now/table/${scriptObj.tableName}/${scriptObj.sys_id}?sysparm_fields=sys_id${scope}`;
        const data = {
            [scriptObj.fieldName]: scriptObj.content
        };

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-UserToken': scriptObj.instance.g_ck
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const resp = await response.json();

        if (resp.hasOwnProperty('result')) {
            t.row.add([
                new Date(), 'VS Code', 'Saved to ServiceNow: <b>' + scriptObj.name + '</b><br /><span class="code">Instance: ' +
                scriptObj.instance.name +
                ' | Field: ' + scriptObj.tableName + '.' + scriptObj.fieldName +
                ' | Save source: ' + (scriptObj.saveSource || "unknown") +
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
            if (document.querySelector('#reloadactivetab').checked) {
                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function (arrayOfTabs) {
                    console.log(arrayOfTabs[0]);
                    console.log(scriptObj);

                    if (arrayOfTabs.length && arrayOfTabs[0].hasOwnProperty("url") && arrayOfTabs[0].url.startsWith(scriptObj.instance.url))
                        chrome.tabs.reload(arrayOfTabs[0].id);
                });
            }
        }
        else {
            resp = JSON.parse(this.response);
            if (resp.hasOwnProperty('error')) {
                if (resp.error.hasOwnProperty('message')) {
                    // if (resp.error.message == "User Not Authenticated"){
                    //     if (canRefreshToken){
                    //         requestToken(scriptObj);
                    //         return;
                    //     }
                    // }
                }
            }
            t.row.add([
                new Date(), 'VS Code', this.response
            ]).draw(false);
            flashFavicon('images/iconred48.png', 3);
            increaseTitlecounter();
            ws.send(this.response);
        }
    } catch (error) {
        // Handle error
    }
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
    document.title = "[" + (++eventCount) + "] sn-scriptsync SN Utils by arnoudkooi.com";
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




// async function snuFetch(pathToResource) {
// todo: move rest api call to fetch api / async functions


//       const response = await fetch(pathToResource,  { headers: snuHeaders });
//       console.log(response);
//       return response;
//   }

/**
 * @function snuStartBackgroundScript
 * @param  {String} script   {the script that should be executed}
 * @param  {String} instance   {instance info required for communication}
 * @param  {String} action {name of the action)}
 * @return {undefined}
 */
function snuStartBackgroundScript(script, instance, callback) {
    document.querySelector('base').setAttribute('href', instance.url + '/');

    try {
        fetch(instance.url + '/sys.scripts.do', {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                script: script,
                runscript: "Run script",
                sysparm_ck: instance.g_ck,
                sys_scope: instance?.scope || "e24e9692d7702100738dc0da9e6103dd",
                quota_managed_transaction: "on"
            }).toString()
        }).then(response => response.text())
            .then((data) => {
                let data = data.replace("<HTML><BODY>", "").replace("</BODY><HTML>", "");
                if (action == "executeBackgroundScript"){ 
                    let response = {
                        action : "responseFromBackgroundScript",
                        instance,
                        data
                    }
                    ws.send(JSON.stringify(response));
                    data = "View response in VS Code";
                };
                increaseTitlecounter();
                t.row.add([
                    new Date(), 'VS Code', 'Background Script Executed: <br />' + data
                ]).draw(false);
            })
            .catch((error) => {
                console.log(error);
                t.row.add([
                    new Date(), 'VS Code', 'Background Script failed (' + error + ')<br />'
                ]).draw(false);
            });

    } catch (error) {
        t.row.add([
            new Date(), 'VS Code', 'Background Script failed (' + error + ')<br />'
        ]).draw(false);
    }
}

function updateActionScript(wsObj) {

    var field = 'script';
    var val = wsObj.content || "";
    val = JSON.stringify(val).slice(1, -1);

    var scrpt = `
    //set state of action to draft
    var grAction = new GlideRecord('sys_hub_action_type_definition');
    grAction.addEncodedQuery("RLQUERYsys_hub_step_instance.action,>=1^sys_id=${wsObj.sys_id}^ENDRLQUERY");
    grAction.query();
    while (grAction.next()) {
        grAction.setValue('state','draft');
        grAction.update();
    }
    //update the variable
    var grVar = new GlideRecord('sys_variable_value');
    grVar.addEncodedQuery("document_key=${wsObj.sys_id}^variable.element=${field}");
    grVar.setLimit(1);
    grVar.query();
    while (grVar.next()) {
        grVar.setValue('value', "${val}");
        grVar.update();
    }
    `;
    snuStartBackgroundScript(scrpt, wsObj.instance);
}

function updateVar(wsObj) {

    var val = wsObj.content || "";
    val = JSON.stringify(val).slice(1, -1);
    var scrpt = `
    var grVar = new GlideRecord('sys_variable_value');
    grVar.addEncodedQuery("document_key=${wsObj.sys_id}^variable.element=${wsObj.fieldName}");
    grVar.setLimit(1);
    grVar.query();
    while (grVar.next()) {
        grVar.setValue('value', "${val}");
        grVar.update();
    }
    //keep the updates in sync...
    var rec = new GlideRecord('${wsObj.tableName}');
    rec.get('${wsObj.sys_id}');
    var um = new GlideUpdateManager2();
    um.saveRecord(rec);`;
    snuStartBackgroundScript(scrpt, wsObj.instance);

}

function getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}

//set an instance independent parameter
function setToChromeStorageGlobal(theName, theValue) {
    console.log(theName, theValue)
    var myobj = {};
    myobj[theName] = theValue;
    chrome.storage.local.set(myobj, function () {
    });
}

//get an instance independent global parameter
function getFromChromeStorageGlobal(theName, callback) {
    chrome.storage.local.get(theName, function (result) {
        callback(result[theName]);
    });
}

function setInstanceLists() {

    setInstanceList("allowed", scriptsyncinstances.allowed);
    setInstanceList("blocked", scriptsyncinstances.blocked);
    function setInstanceList(listtype, arr) {
        let cntnt = ''
        arr.forEach(instance => {
            cntnt += `<li>${instance} <a href='#' data-url='${instance}' class='${listtype}'>❌</a></li>`;
        })
        document.querySelector('#intanceslist' + listtype).innerHTML = cntnt || '<li>-none-</li>';

        document.querySelectorAll('#intanceslist' + listtype + ' a')?.forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                deleteInstance(a.className, a.dataset.url);
            });
        });
    }
}

function deleteInstance(listtype, instance) {
    if (confirm(`Delete ${instance} from ${listtype} list?`)) {
        let newlist = scriptsyncinstances[listtype].filter(item => item !== instance);
        scriptsyncinstances[listtype] = newlist;
        setToChromeStorageGlobal('scriptsyncinstances', scriptsyncinstances);
        setInstanceLists();
    }
}
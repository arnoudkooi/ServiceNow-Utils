let hasLoaded = false;
let data;
let editor;
let versionid;
let theme;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.event == 'fillcodeeditor') {

        if (hasLoaded) return;
        hasLoaded = true; //only reply to first incoming event.

        data = message.command;

        var monacoUrl = chrome.runtime.getURL('/') + 'js/monaco/vs';
        // if (navigator.userAgent.toLowerCase().includes('firefox')){ //fix to allow autocomplete issue FF #134
        //     monacoUrl = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs';
        // }

        require.config({
            paths: {
                'vs': monacoUrl
            }
        });

        let theme = (message.command.snusettings?.slashtheme == "light") ? "vs-light" : "vs-dark";
        require(['vs/editor/editor.main'], () => {
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                noLib: true,
                allowNonTsExtensions: true
            });

            if (data.table.includes('client') || data.field.includes('client')){ //best shot to determine if it is a client script
                monaco.languages.typescript.javascriptDefaults.addExtraLib(client);
            }
            else { //it is server
                if (data.scope == 'global')
                    monaco.languages.typescript.javascriptDefaults.addExtraLib(serverglobal);
                else 
                    monaco.languages.typescript.javascriptDefaults.addExtraLib(serverscoped);
                monaco.languages.typescript.javascriptDefaults.addExtraLib(glidequery);
            }

            //monaco.languages.typescript.typescriptDefaults.setExtraLibs(libs.serverglobal); //doesnt work...

            var lang = '';
            if (message.command.fieldType.includes('script')) lang = 'javascript';
            else if (message.command.fieldType.includes('css')) lang = 'scss';
            else if (message.command.fieldType.includes('xml')) lang = 'xml';
            else if (message.command.fieldType.includes('html')) lang = 'html';

            editor = monaco.editor.create(document.getElementById('container'), {
                automaticLayout: true,
                value: message.command.content,
                language: lang,
                theme: theme
            });

            const blockContext = "editorTextFocus && !suggestWidgetVisible && !renameInputVisible && !inSnippetMode && !quickFixWidgetVisible";
            editor.addAction({
                id: "updateRecord",
                label: "Save",
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
                contextMenuGroupId: "2_execution",
                precondition: blockContext,
                run: () => {
                    updateRecord();
                },
            });

            editor.addAction({
                id: "google",
                label: "Search Google",
                contextMenuGroupId: "2_execution",
                precondition : "editorHasSelection",
                run: (editor) => {
                    let selection = editor.getModel().getValueInRange(editor.getSelection());
                    window.open('https://www.google.com/search?q=' + selection);
                }
            })

            
            editor.addAction({
                id: "1_javascript",
                label: "Set to Javascript",
                contextMenuGroupId: "3_lang",
                run: (editor) => {
                    monaco.editor.setModelLanguage(editor.getModel(), "javascript");
                }
            })
            editor.addAction({
                id: "2_json",
                label: "Set to JSON",
                contextMenuGroupId: "3_lang",
                run: (editor) => {
                    monaco.editor.setModelLanguage(editor.getModel(), "json");
                }
            })
            editor.addAction({
                id: "3_html",
                label: "Set to HTML",
                contextMenuGroupId: "3_lang",
                run: (editor) => {
                    monaco.editor.setModelLanguage(editor.getModel(), "html");
                }
            })
            editor.addAction({
                id: "4_xml",
                label: "Set to XML",
                contextMenuGroupId: "3_lang",
                run: (editor) => {
                    monaco.editor.setModelLanguage(editor.getModel(), "xml");
                }
            })
            editor.addAction({
                id: "5_scss",
                label: "Set to CSS",
                contextMenuGroupId: "3_lang",
                run: (editor) => {
                    monaco.editor.setModelLanguage(editor.getModel(), "scss");
                }
            })
            editor.addAction({
                id: "5_plain",
                label: "Set to Plain text",
                contextMenuGroupId: "3_lang",
                run: (editor) => {
                    monaco.editor.setModelLanguage(editor.getModel(), "plain");
                }
            })

            editor.focus();
            versionid = editor.getModel().getAlternativeVersionId();
        });

        document.querySelector('#header').classList.add(theme);
        document.querySelector('#title').innerHTML = generateHeader(message.command, sender.tab);
        document.querySelector('.record-meta').innerHTML = generateFooter(message.command, sender.tab);

        let a = document.querySelector('a.callingtab');
        a.addEventListener('click', e => {
            e.preventDefault();
            let tabId = Number(a.hash.replace('#', ''));
            chrome.tabs.update(tabId, {
                active: true
            });
        })

        document.querySelector('button#save').addEventListener('click', e => {
            updateRecord();
        });

        document.title = data.instance.name + ' ' + data.table + ' ' + data.name;
        changeFavicon(sender.tab.favIconUrl);

    }
});


function generateHeader(data, tab) {
    return `
    <h3>
        <img id='favicon-img' class='favicon' src='${tab.favIconUrl}' onerror='/images/icon16.png' alt='instance favicon'>
        ${data.name} 
        <a href='#${tab.id}' class='callingtab'>goto tab &#8599;</a>
    </h3>`;
}

function generateFooter(data, tab) {
    return ` 
        <label class="record-meta--label">Instance: </label><span class="record-meta--detail"><a href='${data.instance.url}' title='Open Instance' target='_blank'>${data.instance.name}</a></span>
        <label class="record-meta--label">Record: </label><span class="record-meta--detail">${data.table} - ${data.sys_id}</span>
        <label class="record-meta--label">Field: </label><span class="record-meta--detail">${data.field}</span>`;
}


const changeFavicon = link => {
    let $favicon = document.querySelector('link[rel="icon"]')
    // If a <link rel="icon"> element already exists,
    // change its href to the given link.
    if ($favicon !== null) {
        $favicon.href = link
        // Otherwise, create a new element and append it to <head>.
    } else {
        $favicon = document.createElement("link")
        $favicon.rel = "icon"
        $favicon.href = link
        document.head.appendChild($favicon)
    }
}


function updateRecord() {

    //check for errors, exclude service portal client script first line
    var errorCount = monaco.editor.getModelMarkers().filter(function (marker) {
        return marker.severity > 3 && !(marker.startLineNumber == 1 && marker.code == '1003');
    }).length;

    if (errorCount){
        if (!confirm('Your code has errors!\nContinue with save action?')) return;
    }



    var client = new XMLHttpRequest();
    client.open("put", data.instance.url + '/api/now/table/' +
        data.table + '/' + data.sys_id +
        '?sysparm_fields=sys_id');
    var postData = {};
    postData[data.field] = editor.getModel().getValue();

    client.setRequestHeader('Accept', 'application/json');
    client.setRequestHeader('Content-Type', 'application/json');
    client.setRequestHeader('X-UserToken', data.instance.g_ck);

    client.onreadystatechange = function () {
        if (this.readyState == this.DONE) {
            var resp = JSON.parse(this.response);
            if (resp.hasOwnProperty('result')) {
                document.querySelector('#response').innerHTML = 'Saved: ' + new Date().toLocaleTimeString();
                versionid = editor.getModel().getAlternativeVersionId();
            } else {
                var resp = JSON.parse(this.response);
                if (resp.hasOwnProperty('error')) {
                    document.querySelector('#response').innerHTML = 'Error: ' + new Date().toLocaleTimeString() + '<br />' +
                        JSON.stringify(resp.error);
                }
            }
        }
    };
    client.send(JSON.stringify(postData));
}


window.onbeforeunload = function (e) {
    if(versionid == editor.getModel().getAlternativeVersionId()) return null
    e = e || window.event;
    return 'Closing tab will loose unsaved work, continue?';
};
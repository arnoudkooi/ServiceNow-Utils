let hasLoaded = false;
let data;
let editor;
let theme;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.event == 'fillcodeeditor') {

        data = message.command;
        if (hasLoaded) return;
        hasLoaded = true; //only reply to first incoming event.

        var monacoUrl = chrome.runtime.getURL('/') + 'js/monaco/vs';
        if (navigator.userAgent.toLowerCase().includes('firefox')){ //fix to allow autocomplete issue FF #134
            monacoUrl = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs';
        }

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
            monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource);

            var lang = '';
            if (message.command.fieldType.includes('script')) lang = 'javascript';
            else if (message.command.fieldType.includes('css')) lang = 'scss';
            else if (message.command.fieldType.includes('xml')) lang = 'xml';
            else if (message.command.fieldType.includes('html')) lang = 'html';

            editor = monaco.editor.create(document.getElementById('container'), {
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
        });

        document.querySelector('#header').classList.add(theme);
        document.querySelector('#title').innerHTML = getMessage(message.command, sender.tab);
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

        document.title = data.instance.name + ' ' + data.table + ' ' + data.instance.name;
        changeFavicon(sender.tab.favIconUrl);

        // console.log(message);
        // console.log(sender);

    }
});

function getMessage(data, tab) {
    return ` 
        <h3><img class='favicon' src='${tab.favIconUrl}' alt='favicon' />${data.name} <a href='#${tab.id}' class='callingtab'>goto tab &#8599;</a></h3>
        <label>Instance: </label><span>${data.instance.name}</span><br />
        <label>Record: </label><span>${data.table} - ${data.sys_id}</span><br />
        <label>Field: </label><span>${data.field}</span>`;
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
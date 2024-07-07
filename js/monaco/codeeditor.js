let hasLoaded = false;
let data;
let editor;
let versionid;
let theme;
let language = '';

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message);
    if (message.event == 'fillcodeeditor') {

        if (hasLoaded) return;
        hasLoaded = true; //only reply to first incoming event.

        data = message.command;

        var monacoUrl = chrome.runtime.getURL('/') + 'js/monaco/vs';

        require.config({
            paths: {
                'vs': monacoUrl
            }
        });


        theme = (message.command.snusettings?.slashtheme == "light") ? "vs-light" : "vs-dark";
        require(['vs/editor/editor.main'], () => {
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                noLib: true,
                allowNonTsExtensions: true
            });

            monaco.languages.registerColorProvider('json', {
                provideColorPresentations: (model, colorInfo) => {
                    var color = colorInfo.color;
                    var red256 = Math.round(color.red * 255);
                    var green256 = Math.round(color.green * 255);
                    var blue256 = Math.round(color.blue * 255);
                    var label = [red256, green256, blue256].join(',');
            
                    return [{
                        label: label
                    }];
                },
            
                provideDocumentColors(model) {
                    const crgbCallRegex = /( *\d{1,3} *),( *\d{1,3} *),( *\d{1,3} *)/;
                    const regexp = new RegExp(crgbCallRegex, 'g');
                    const matches = model.findMatches(regexp.source, true, true, false, null, true);
                    const colorMarkers = [];
                    for (const {
                            range,
                            matches: groups
                        } of matches) {
            
                        colorMarkers.push({
                            color: rgbToMonaco(groups),
                            range: range,
                        });
            
                    }
                    return colorMarkers;
                }
            });
            




            if (data.table.includes('client') || data.field.includes('client')) { //best shot to determine if it is a client script
                monaco.languages.typescript.javascriptDefaults.addExtraLib(client);
            } else { //it is server
                if (data.scope == 'global')
                    monaco.languages.typescript.javascriptDefaults.addExtraLib(serverglobal);
                else
                    monaco.languages.typescript.javascriptDefaults.addExtraLib(serverscoped);
                monaco.languages.typescript.javascriptDefaults.addExtraLib(glidequery);
            }

            //monaco.languages.typescript.typescriptDefaults.setExtraLibs(libs.serverglobal); //doesnt work...

            
            if (message.command.fieldType.includes('script')) language = 'javascript';
            else if (message.command.fieldType.includes('json')) language = 'json';
            else if (message.command.fieldType.includes('css')) language = 'scss';
            else if (message.command.fieldType.includes('xml')) language = 'xml';
            else if (message.command.fieldType.includes('html')) language = 'html';
            else if (message.command.name.endsWith('psm1')) language = 'powershell';

            changeToEditor(message.command.content);

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

        loadVersionSelect();

    }
});

function addActions(editor) {

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
        precondition: "editorHasSelection",
        run: (editor) => {
            let selection = getEditor().getModel().getValueInRange(editor.getSelection());
            window.open('https://www.google.com/search?q=' + selection);
        }
    })


    editor.addAction({
        id: "1_javascript",
        label: "Set to Javascript",
        contextMenuGroupId: "3_lang",
        run: (editor) => {
            monaco.editor.setModelLanguage(getEditor().getModel(), "javascript");
        }
    })
    editor.addAction({
        id: "2_json",
        label: "Set to JSON",
        contextMenuGroupId: "3_lang",
        run: (editor) => {
            monaco.editor.setModelLanguage(getEditor().getModel(), "json");
        }
    })
    editor.addAction({
        id: "3_html",
        label: "Set to HTML",
        contextMenuGroupId: "3_lang",
        run: (editor) => {
            monaco.editor.setModelLanguage(getEditor().getModel(), "html");
        }
    })
    editor.addAction({
        id: "4_xml",
        label: "Set to XML",
        contextMenuGroupId: "3_lang",
        run: (editor) => {
            monaco.editor.setModelLanguage(getEditor().getModel(), "xml");
        }
    })
    editor.addAction({
        id: "5_scss",
        label: "Set to CSS",
        contextMenuGroupId: "3_lang",
        run: (editor) => {
            monaco.editor.setModelLanguage(getEditor().getModel(), "scss");
        }
    })
    editor.addAction({
        id: "6_graphql",
        label: "Set to GraphQL",
        contextMenuGroupId: "3_lang",
        run: (editor) => {
            monaco.editor.setModelLanguage(getEditor().getModel(), "graphql");
        }
    })
    editor.addAction({
        id: "7_powershell",
        label: "Set to Powershell",
        contextMenuGroupId: "3_lang",
        run: (editor) => {
            monaco.editor.setModelLanguage(getEditor().getModel(), "powershell");
        }
    })
    editor.addAction({
        id: "8_plain",
        label: "Set to Plain text",
        contextMenuGroupId: "3_lang",
        run: (editor) => {
            monaco.editor.setModelLanguage(getEditor().getModel(), "plain");
        }
    })

}


function getEditor() {
    return (typeof editor.getValue !== 'undefined' )? 
        editor : editor.getModifiedEditor();
}

async function loadVersionSelect(){
    let myurl = data.instance.url + '/api/now/table/sys_update_version?sysparm_limit=250&sysparm_display_value=true&sysparm_fields=sys_id,sys_updated_on,sys_updated_by&sysparm_query=name=' +
    data.table + '_' + data.sys_id +'^ORDERBYDESCsys_updated_on';
    let res =  await snuFetchData(data.instance.g_ck, myurl);

    let versions = res?.result || {};

    const fragment = document.createDocumentFragment();
    const selectElement = document.querySelector('select.versions');

    let opt = document.createElement('option');
    let versionIndex = versions.length;
    opt.value = '' ;
    opt.textContent = `Compare: --None-- (${versions.length})` ;
    fragment.appendChild(opt);  

    versions.forEach(v => {
    opt = document.createElement('option');
    opt.value = v.sys_id;
    opt.textContent = `${versionIndex--}: ${v.sys_updated_on} | ${v.sys_updated_by}` ;
    fragment.appendChild(opt);
    });

    selectElement.appendChild(fragment);

    selectElement.addEventListener('change', async e => {
        let selected = e.target.value;
        let fieldValue;
        if (selected){
            let url = data.instance.url + '/api/now/table/sys_update_version/' + selected + '?sysparm_fields=payload';
            let res = await snuFetchData(data.instance.g_ck, url);
            let payload = res.result.payload;

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(payload, "text/xml");
            
            // Locate the <script> element
            fieldValue = xmlDoc.getElementsByTagName(data.field)[0];
            
            if (fieldValue) {
                const fieldContent = fieldValue.textContent;
                changeToDiffEditor(fieldContent);
                if (!e.target.selectedOptions[0].innerHTML.includes('*'))
                    e.target.selectedOptions[0].innerHTML = e.target.selectedOptions[0].innerHTML + '*';

            }
        }
        else {
            changeToEditor(getEditor().getValue());
            console.log(`No ${data.field}  element found`);
        }
    });

 }


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


async function updateRecord() {
    // Check for errors, exclude service portal client script first line
    const errorCount = monaco.editor.getModelMarkers().filter(marker => 
        marker.severity > 3 && !(marker.startLineNumber === 1 && marker.code === '1003')
    ).length;

    if (errorCount) {
        if (!confirm('Your code has errors!\nContinue with save action?')) return;
    }
    try {
        const url = `${data.instance.url}/api/now/table/${data.table}/${data.sys_id}?sysparm_fields=sys_id`;
        const postData = {
            [data.field]: getEditor().getModel().getValue()
        };

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-UserToken': data.instance.g_ck
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const resp = await response.json();
        if (resp.hasOwnProperty('result')) {
            document.querySelector('#response').innerHTML = `Saved: ${new Date().toLocaleTimeString()}`;
            versionid = getEditor().getModel().getAlternativeVersionId();
        } else {
            if (resp.hasOwnProperty('error')) {
                document.querySelector('#response').innerHTML = `<span style="font-size:8pt; color:red" >Error: ${new Date().toLocaleTimeString()} | ${JSON.stringify(resp.error)}</span>`;
            }
        }
    } catch (error) {
        // Handle error
        document.querySelector('#response').innerHTML = `<span style="font-size:8pt; color:red" >Error: ${new Date().toLocaleTimeString()} | ${error.message}</span>`;
    }
}

function changeToEditor(editorContent) {

    //let currentText = getEditor().getValue();
    if (editor) editor.dispose();
    editor = monaco.editor.create(document.getElementById('container'), {
        automaticLayout: true,
        value: editorContent,
        language: language,
        theme: theme,
        colorDecorators: true,
        "bracketPairColorization.enabled": true
    });

    addActions(editor);

    editor.focus();
    versionid = getEditor().getModel().getAlternativeVersionId();
}

function changeToDiffEditor(versionText) {

    let currentText = getEditor().getValue();
    
    if (editor) editor.dispose();

    const currentModel = monaco.editor.createModel(currentText, language);
    const oldVersionModel = monaco.editor.createModel(versionText, language);
    
    const editorContainer = document.getElementById('container'); // Ensure this is the correct ID of your editor's container

    editor = monaco.editor.createDiffEditor(editorContainer, {
        enableSplitViewResizing: true,
        renderSideBySide: true
    });

    editor.setModel({
        original: oldVersionModel,
        modified: currentModel,
    });

    addActions(editor.getOriginalEditor());
    addActions(editor.getModifiedEditor());
}


function rgbToMonaco(groups) {
    return {
        red: parseInt(groups[1]) / 255,
        green: parseInt(groups[2]) / 255,
        blue: parseInt(groups[3]) / 255,
        alpha: 1,
    };
}

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

window.onbeforeunload = function (e) {
    if (versionid == getEditor().getModel().getAlternativeVersionId()) return null
    e = e || window.event;
    return 'Closing tab will loose unsaved work, continue?';
};
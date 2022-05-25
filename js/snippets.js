let data;
let editor;
let versionid;
let theme = "vs-dark";

var monacoUrl = chrome.runtime.getURL('/') + 'js/monaco/vs';
// if (navigator.userAgent.toLowerCase().includes('firefox')) { //fix to allow autocomplete issue FF #134, didnt work :(
//     monacoUrl = 'https://snutils.com/js/monaco/0.33/vs';
// }


require.config({
    paths: {
        'vs': monacoUrl
    }
});


require(['vs/editor/editor.main'], () => {
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        noLib: true,
        allowNonTsExtensions: true
    });


    monaco.languages.typescript.javascriptDefaults.addExtraLib(client);
    monaco.languages.typescript.javascriptDefaults.addExtraLib(serverscoped);
    monaco.languages.typescript.javascriptDefaults.addExtraLib(glidequery);

    editor = monaco.editor.create(document.getElementById('container'), {
        automaticLayout: true,
        value: '',
        language: 'javascript',
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
        precondition: "editorHasSelection",
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
        id: "7_powershell",
        label: "Set to Powershell",
        contextMenuGroupId: "3_lang",
        run: (editor) => {
            monaco.editor.setModelLanguage(editor.getModel(), "powershell");
        }
    })
    editor.addAction({
        id: "7_plain",
        label: "Set to Plain text",
        contextMenuGroupId: "3_lang",
        run: (editor) => {
            monaco.editor.setModelLanguage(editor.getModel(), "plain");
        }
    })

    editor.focus();
    versionid = editor.getModel().getAlternativeVersionId();
});



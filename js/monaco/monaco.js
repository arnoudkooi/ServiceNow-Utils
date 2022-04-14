//do some magic on sys.script.do to add monaco editor and autocomplete (beta)

var s = document.body.firstChild;
var editor;
var div = document.createElement('div');
var divInfo = document.createElement('div');
divInfo.innerText = 'CTRL/CMD Enter to Execute | Slashcommand /bg to open this page | Editor and shortcut added by SN Utils';
divInfo.style.fontSize = '9pt'; 
divInfo.style.fontFamily = 'SourceSansPro, "Helvetica Neue", Arial';
var scrpt = document.getElementById('runscript');

if (snusettings.applybgseditor && scrpt) {

	var monacoUrl = snusettings.extensionUrl + 'js/monaco/vs';
	// if (navigator.userAgent.toLowerCase().includes('firefox')){ //fix to allow autocomplete issue FF #134, didnt work :(
	// 	monacoUrl = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs';
	// }

	require.config({
		paths: {
			'vs': monacoUrl
		}
	});

	div.setAttribute("id", "container");
	div.setAttribute("style", "height:400px; border:1pt solid #cccccc");


	scrpt.parentNode.insertBefore(divInfo, scrpt);
	scrpt.parentNode.insertBefore(div, scrpt);
	scrpt.style.display = "none";
	
	require(['vs/editor/editor.main'], () => {

		monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ noLib: true, allowNonTsExtensions: true });
		monaco.languages.typescript.javascriptDefaults.addExtraLib(serverglobal);
		monaco.languages.typescript.javascriptDefaults.addExtraLib(glidequery);

        var theme = (snusettings?.slashtheme == "light") ? "vs-light" : "vs-dark";

		editor = monaco.editor.create(document.getElementById('container'), {
			value: scrpt.value ,
			theme: theme,
			lineNumbers: "on",
			language: "javascript"
		});

		editor.onDidChangeModelContent((e) => {
			scrpt.value = editor.getModel().getValue();
		});

        const blockContext = "editorTextFocus && !suggestWidgetVisible && !renameInputVisible && !inSnippetMode && !quickFixWidgetVisible";

        editor.addAction({
            id: "runScript",
            label: "Run script",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
            contextMenuGroupId: "2_execution",
            precondition: blockContext,
            run: () => {
                document.querySelector('input[name="runscript"]').click();
            },
        });
		editor.focus();
	});
}

//do some magic on sys.script.do to add monaco editor and autocomplete (beta)

var s = document.body.firstChild;
var editor;
var div = document.createElement('div');
var divInfo = document.createElement('div');
divInfo.innerText = 'CTRL/CMD Enter to Execute | Slashcommand /bg to open this page | Editor and shortcut added by SN Utils';
divInfo.style.fontSize = '9pt';
divInfo.style.fontFamily = 'SourceSansPro, "Helvetica Neue", Arial';
var scrpt = document.getElementById('runscript');
document.querySelector('form').setAttribute('onsubmit', '');

let leftSide, resizer, rightSide, result, timerInterval;

const urlparams = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

if (snusettings.applybgseditor && scrpt) {

	devidePage();
	
	var monacoUrl = snusettings.extensionUrl + 'js/monaco/vs';
	if (navigator.userAgent.toLowerCase().includes('firefox')) { //fix to allow autocomplete issue FF #134, didnt work :(
		monacoUrl = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs';
	}

	require.config({
		paths: {
			'vs': monacoUrl
		}
	});

	div.setAttribute("id", "container");
	
	scrpt.parentNode.insertBefore(divInfo, scrpt);
	scrpt.parentNode.insertBefore(div, scrpt);
	scrpt.style.display = "none";

	require(['vs/editor/editor.main'], () => {

		monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
			noLib: true,
			allowNonTsExtensions: true
		});
		monaco.languages.typescript.javascriptDefaults.addExtraLib(serverglobal);
		monaco.languages.typescript.javascriptDefaults.addExtraLib(glidequery);

		var theme = (snusettings?.slashtheme == "light") ? "vs-light" : "vs-dark";
		scrpt.value = scrpt.value || urlparams.content;

		editor = monaco.editor.create(document.getElementById('container'), {
			value: scrpt.value,
			theme: theme,
			lineNumbers: "on",
			language: "javascript",
			wordWrap: "on",
			automaticLayout: true
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

document.addEventListener('snuEvent', function (e) {
	if (e.detail.type == "background") { //basic check for servicenow instance
		document.getElementById('runscript').value = e.detail.content.content;
		if (typeof editor != 'undefined') editor.getModel().setValue(e.detail.content.content);

		if (e.detail.content?.executeScript) {
			//document.querySelector('form').setAttribute('target','_blank');

			setTimeout(() => {
				document.querySelector('input[name=runscript]').click()
			}, 500);
		}
	}
});



function devidePage() {

	//make post async
	document.addEventListener('submit', (e) => {

		document.querySelector('input[name=runscript]').disabled = true;
		startStopWatch();
		top.document.title ="🔴 BG script running.."
		
		const form = e.target;
		var postData = new URLSearchParams(new FormData(form));
		postData.append('runscript', 'Run script');

		fetch(form.action, {
				method: form.method,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: postData.toString()
			}).then(response => response.text())
			.then((response) => {
				clearInterval(timerInterval);
				top.document.title ="🟢 BG script finished.."
				result.innerHTML = response.replace('<HTML><BODY>','').replace('</BODY></HTML>','');
				resizer.style.height = document.body.scrollHeight + 'px';
				document.querySelector('input[name=runscript]').disabled = false;

				//add downloadlink
				let text = document.querySelector('.result pre').innerText;
				if (text.length > 10) { 
					let oldLink = document.querySelector('.result a');
					let lnk = document.createElement('a');
					let linkText = document.createTextNode("download result");
					lnk.appendChild(linkText);
					lnk.href = "#";
					lnk.style.display = "block";
					lnk.title = 'Added via SN Utils'
					lnk.addEventListener('click', evt => {
						downloadResult();
					});
					oldLink.append(lnk);
				}

			})
		e.preventDefault();
	});


	//devide page and add panel

	var link = document.createElement("link");
	link.href = `${snusettings.extensionUrl}css/background.css`
	link.type = "text/css";
	link.rel = "stylesheet";
	document.getElementsByTagName("head")[0].appendChild(link);

	content = document.querySelector('body').children
	var container = document.createElement('div');
	container.className = 'container';

	leftSide = document.createElement('div');
	leftSide.className = 'container__left';
	container.appendChild(leftSide)
	while (content.length > 0) {
		leftSide.appendChild(content[0]);
	}

	resizer = document.createElement('div');
	resizer.className = 'resizer';
	resizer.id = 'dragMe';
	container.appendChild(resizer)

	rightSide = document.createElement('div');
	rightSide.className = 'container__right';
	result = document.createElement('div');
	result.className = 'result';
	result.id = 'result';
	rightSide.appendChild(result)
	container.appendChild(rightSide)

	document.querySelector('body').append(container);
	result.innerHTML = 'SN Utils - Background script result pane.<hr />'
		

	// Attach the handler
	resizer.addEventListener('mousedown', mouseDownHandler);

}


function downloadResult() {

    function pad2(n) { return n < 10 ? '0' + n : n } //helper for date id
	var instance = window.location.hostname.split('.')[0];
    var date = new Date();
    fileName = 'bgscript_' + instance + '_' + date.getFullYear().toString() +
        pad2(date.getMonth() + 1) + pad2(date.getDate()) + '_' +
        pad2(date.getHours()) + pad2(date.getMinutes()) +
        pad2(date.getSeconds()) + '.txt';

	var link = document.querySelector('.result a').href;
    var text = document.querySelector('.result pre').innerText;

	text = 'Backgroundscript result exported via SN Utils\n' + link + '\n\n' + text;

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }



// The current position of mouse
let x = 0;
let y = 0;
let leftWidth = 0;

// Handle the mousedown event
// that's triggered when user drags the resizer
function mouseDownHandler(e) {
	// Get the current mouse position
	x = e.clientX;
	y = e.clientY;
	leftWidth = leftSide.getBoundingClientRect().width;
	

	// Attach the listeners to `document`
	document.addEventListener('mousemove', mouseMoveHandler);
	document.addEventListener('mouseup', mouseUpHandler);
};

function mouseMoveHandler(e) {
	// How far the mouse has been moved
	const dx = e.clientX - x;
	const dy = e.clientY - y;

	const newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
	leftSide.style.width = `${newLeftWidth}%`;
	rightSide.style.width = `${100-newLeftWidth}%`;

	resizer.style.cursor = 'col-resize';
	document.body.style.cursor = 'col-resize';

	leftSide.style.userSelect = 'none';
	leftSide.style.pointerEvents = 'none';

	rightSide.style.userSelect = 'none';
	rightSide.style.pointerEvents = 'none';
};

function mouseUpHandler() {
	resizer.style.removeProperty('cursor');
	document.body.style.removeProperty('cursor');

	leftSide.style.removeProperty('user-select');
	leftSide.style.removeProperty('pointer-events');

	rightSide.style.removeProperty('user-select');
	rightSide.style.removeProperty('pointer-events');

	// Remove the handlers of `mousemove` and `mouseup`
	document.removeEventListener('mousemove', mouseMoveHandler);
	document.removeEventListener('mouseup', mouseUpHandler);
};

function startStopWatch() {
	var startTime = Date.now();
	timerInterval = setInterval(function() {
		var elapsedTime = Date.now() - startTime;
		result.innerHTML = (elapsedTime / 1000).toFixed(3) + ' - Background script running... <a href="/cancel_my_transaction.do" target="_blink" title="Cancel running this backgrundscript">cancel</a><hr />';
	}, 100);
}

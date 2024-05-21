//do some magic on sys.script.do to add monaco editor and autocomplete (beta)

let s = document.body.firstChild;
let editor;
let snuLoadedResult = '';
let div = document.createElement('div');
let divInfo = document.createElement('div');
top.document.title ="⚪ BG script not started"
divInfo.innerText = 'CTRL/CMD SHIFT Enter to Execute | Slashcommand /bg to open this page | Editor and shortcut added by SN Utils';
divInfo.style.fontSize = '9pt';
divInfo.style.fontFamily = 'SourceSansPro, "Helvetica Neue", Arial';
let scrpt = document.getElementById('runscript');
document.querySelector('form').setAttribute('onsubmit', '');

let leftSide, resizer, rightSide, result, timerInterval;

const urlparams = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

//If washington instance redirect to the modern page.
(async function () {
	let snuFamily = await snuCheckFamily();
	if (snuFamily == 'washingtondc'){
		location.href = location.href.replace('sys.scripts.do','sys.scripts.modern.do');
	}
})();


if (snusettings.applybgseditor && scrpt) {

	devidePage();
	
	let monacoUrl = snusettings.extensionUrl + 'js/monaco/vs';
	// if (navigator.userAgent.toLowerCase().includes('firefox')) { //fix to allow autocomplete issue FF #134, didnt work :(
	// 	monacoUrl = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs';
	// }

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

		let theme = (snusettings?.slashtheme == "light") ? "vs-light" : "vs-dark";
		scrpt.value = scrpt.value || urlparams.content;

		editor = monaco.editor.create(document.getElementById('container'), {
			value: scrpt.value,
			theme: theme,
			lineNumbers: "on",
			language: "javascript",
			wordWrap: "on",
			automaticLayout: true,
			"bracketPairColorization.enabled": true,
			minimap: { enabled: false }
			
		});

		editor.onDidChangeModelContent((e) => {
			scrpt.value = editor.getModel().getValue();
		});

		const blockContext = "editorTextFocus && !suggestWidgetVisible && !renameInputVisible && !inSnippetMode && !quickFixWidgetVisible";

		editor.addAction({
			id: "runScript",
			label: "Run script",
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter],
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
		result.innerHTML = '<span id="timer"></span> - Background script running... <a href="/cancel_my_transactions.do" target="_blank" title="Cancel running this backgroundscript">cancel</a><hr />';
		startStopWatch();
		top.document.title ="🔴 BG script running.."
		
		const form = e.target;
		let postData = new URLSearchParams(new FormData(form));
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
				resizer.style.height = Math.max(leftSide.scrollHeight, rightSide.scrollHeight) + 'px';
				document.querySelector('input[name=runscript]').disabled = false;

				//add download and copy link
				let text = document.querySelector('.result pre').innerText;
				snuLoadedResult = text;
				if (text.length > 10) {
					let divBar = document.createElement('div');
					divBar.id = 'resultbar';
					divBar.innerHTML = `
					<a href="#" title="[SN Utils] Toggle prefix" onclick="snuTogglePrefix()">
						<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"/>
						</svg>
				  	</a>
					<a href="#" title="[SN Utils] Download result" onclick="snuDownloadResult()" >
						<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
						</svg>
					</a>
					<a href="#" title="[SN Utils] Copy result to clipboard" onclick="snuCopyResult()" >
						<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
							<path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z"/>
						</svg>
					</a>
					<span id="actionResult">Click icon to toggle prefix or download / copy result</span>
					`;
					let preElement = document.querySelector('.result pre');
					preElement.parentNode.insertBefore(divBar, preElement);

				}

			})
		e.preventDefault();
	});


	//devide page and add panel

	let link = document.createElement("link");
	link.href = `${snusettings.extensionUrl}css/background.css`
	link.type = "text/css";
	link.rel = "stylesheet";
	document.getElementsByTagName("head")[0].appendChild(link);

	content = document.querySelector('body').children
	let container = document.createElement('div');
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
	result.innerHTML = 'SN Utils - Background script result pane. ' +
	'<a href="/sys_script_execution_history_list.do?sysparm_query=^ORDERBYDESCstarted" target="_blank" >history</a><hr />';
		

	// Attach the handler
	resizer.addEventListener('mousedown', mouseDownHandler);

}


function snuDownloadResult() {

    function pad2(n) { return n < 10 ? '0' + n : n } //helper for date id
	let instance = window.location.hostname.split('.')[0];
    let date = new Date();
    fileName = 'bgscript_' + instance + '_' + date.getFullYear().toString() +
        pad2(date.getMonth() + 1) + pad2(date.getDate()) + '_' +
        pad2(date.getHours()) + pad2(date.getMinutes()) +
        pad2(date.getSeconds()) + '.txt';

	let link = document.querySelector('.result a').href;
    let text = document.querySelector('.result pre').innerText;

	text = 'Backgroundscript result exported via SN Utils\n' + link + '\n\n' + text;

    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
	document.querySelector('#actionResult').innerText = 'Downloaded ' + text.length + ' characters';
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
	let startTime = Date.now();
	timerInterval = setInterval(function() {
		let elapsedTime = Date.now() - startTime;
		let timer = result.querySelector('#timer');
		if (timer) timer.innerHTML = (elapsedTime / 1000).toFixed(3);
	}, 100);
}

async function snuCopyResult() {
	try {
		// Get the <pre> element
		const pre = document.querySelector('.result pre');

		// Use the navigator clipboard API to copy text
		await navigator.clipboard.writeText(pre.innerText);
		console.log('Text copied successfully!');
		document.querySelector('#actionResult').innerText = 'Copied ' + pre.innerText.length + ' characters to clipboard';

	} catch (err) {
		document.querySelector('#actionResult').innerText = 'Failed to copy text: ' + err.message;
	}
}


function snuTogglePrefix() {
    const pre = document.querySelector('.result pre');

    if (pre.innerText.length < snuLoadedResult.length) {
        pre.innerText = snuLoadedResult;
        return;
    }

    let prefix = '*** Script';
    let scopeName = document.querySelector('select[name=sys_scope]').selectedOptions[0].text;
    if (scopeName !== 'global') {
        prefix = scopeName;
    }

    // Escape the prefix to safely use it in the regular expression
    let escapedPrefix = escapeRegExp(prefix);
    let regex = new RegExp(`^${escapedPrefix}:\\s*`, 'gm');

    pre.innerText = pre.innerText.replace(regex, '');

	function escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}
	

}

//WIP do some magic on sys.script.modern.do to add split screen
let snuEditor;
let snuDiv = document.createElement('div');
let snuDivInfo = document.createElement('div');
top.document.title = "⚪ BG script not started"
snuDivInfo.innerText = 'CTRL/CMD Enter to Execute | Slashcommand /bgm to open this page | Shortcut and split screen added by SN Utils | ';
snuDivInfo.style.fontSize = '9pt';
snuDivInfo.style.fontFamily = 'SourceSansPro, "Helvetica Neue", Arial';
let snuScript = document.querySelector('div.script-container');
document.querySelector('form').setAttribute('onsubmit', '');

let snuLeftSide, snuResizer, snuRightSide, snuResult, snuResultWrapper, snuTimerInterval;

const snuUrlparams = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

if (snusettings.applybgseditor && snuScript) {


	let glideEditor = GlideEditorMonaco.get('script');
	if (glideEditor) {
		snuEditor = glideEditor.editor;
		snuDividePage();
		snuMakePostAsync();
		snuEnhanceMonaco();
	
		snuDiv.setAttribute("id", "container");
		snuScript.parentNode.insertBefore(snuDivInfo, snuScript);

		if (snusettings.vsscriptsync){
			let a = document.createElement('a');
			a.innerText = 'Open in VS Code';
			a.title = '[SN Utils] Open in VS Code via sn-scriptsync';
			a.addEventListener('click', (ev) =>{
				ev.preventDefault();
				snuPostToScriptSync();
			});
			snuDivInfo.appendChild(a);
		}



	}

}

function snuMakePostAsync() {
	//make post async
	document.addEventListener('submit', (e) => {

		e.preventDefault();

		//document.querySelector('button[type="submit"]').disabled = true;
		snuResult = document.querySelector('#result');
		snuResult.innerHTML = '<span id="timer"></span> - Background script running... <a href="/cancel_my_transactions.do" target="_blank" title="Cancel running this backgroundscript">cancel</a><hr />';
		snuStartStopWatch();
		top.document.title = "🔴 BG script running.."

		const form = e.target;
		let postData = new URLSearchParams(new FormData(form));
		postData.append('script', snuEditor.getValue());


		fetch(form.action, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: postData.toString()
		}).then(response => response.text())
			.then((response) => {
				clearInterval(snuTimerInterval);
				top.document.title = "🟢 BG script finished.."
				snuResult.innerHTML = response.replace('<HTML><BODY>', '').replace('</BODY></HTML>', '');
				snuResizer.style.height = document.body.scrollHeight + 'px';
				document.querySelector('button[type="submit"]').disabled = false;

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
						snuDownloadResult();
					});
					oldLink.append(lnk);
				}

			})

	});
}


function snuDividePage() {
	//devide page and add panel

	let link = document.createElement("link");
	link.href = `${snusettings.extensionUrl}css/background.css`
	link.type = "text/css";
	link.rel = "stylesheet";
	document.getElementsByTagName("head")[0].appendChild(link);

	content = document.querySelector('body').children
	let container = document.createElement('div');
	container.className = 'container';

	snuLeftSide = document.createElement('div');
	snuLeftSide.className = 'container__left';
	container.appendChild(snuLeftSide)
	while (content.length > 0) {
		snuLeftSide.appendChild(content[0]);
	}

	snuResizer = document.createElement('div');
	snuResizer.className = 'resizer';
	snuResizer.id = 'dragMe';
	container.appendChild(snuResizer)

	snuRightSide = document.createElement('div');
	snuRightSide.className = 'container__right';
	snuResultWrapper = document.createElement('div');
	snuResultWrapper.className = 'result_wrapper';
	snuResultWrapper.id = 'result_wrapper';
	snuRightSide.appendChild(snuResultWrapper)
	container.appendChild(snuRightSide)

	document.querySelector('body').append(container);
	snuResultWrapper.innerHTML = `
	<div class="result_header">
		SN Utils - Background script result pane.&nbsp;
		<a href="/sys_script_execution_history_list.do?sysparm_query=^ORDERBYDESCstarted" target="_blank" >history</a>
	</div>
	<hr />
	<div id="result" class=result>Results will show here.</div>`;

	document.querySelectorAll('.row').forEach(el => {
		el.style.setProperty('margin-inline-start', '-8px', 'important'); //remove unneded padding
		el.style.setProperty('margin-inline-end', '-8px', 'important');
		el.style.setProperty('margin-bottom', '5px');
		el.style.setProperty('min-height', '29px');

	});
	snuResizer.addEventListener('mousedown', mouseDownHandler);
}

function snuEnhanceMonaco() {

	const blockContext = "editorTextFocus && !suggestWidgetVisible && !renameInputVisible && !inSnippetMode && !quickFixWidgetVisible";
	snuEditor.addAction({
		id: "runScript",
		label: "Run script",
		keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
		contextMenuGroupId: "2_info",
		precondition: blockContext,
		run: () => {
			document.querySelector('button[type="submit"]').click();
		},
	});

	snuEditor.setValue(snuUrlparams.content || '');
	snuEditor.focus();
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
	leftWidth = snuLeftSide.getBoundingClientRect().width;


	// Attach the listeners to `document`
	document.addEventListener('mousemove', mouseMoveHandler);
	document.addEventListener('mouseup', mouseUpHandler);
};

function mouseMoveHandler(e) {
	// How far the mouse has been moved
	const dx = e.clientX - x;
	const dy = e.clientY - y;

	const newLeftWidth = ((leftWidth + dx) * 100) / snuResizer.parentNode.getBoundingClientRect().width;
	snuLeftSide.style.width = `${newLeftWidth}%`;
	snuRightSide.style.width = `${100 - newLeftWidth}%`;

	snuResizer.style.cursor = 'col-resize';
	document.body.style.cursor = 'col-resize';

	snuLeftSide.style.userSelect = 'none';
	snuLeftSide.style.pointerEvents = 'none';

	snuRightSide.style.userSelect = 'none';
	snuRightSide.style.pointerEvents = 'none';
};

function mouseUpHandler() {
	snuResizer.style.removeProperty('cursor');
	document.body.style.removeProperty('cursor');

	snuLeftSide.style.removeProperty('user-select');
	snuLeftSide.style.removeProperty('pointer-events');

	snuRightSide.style.removeProperty('user-select');
	snuRightSide.style.removeProperty('pointer-events');

	// Remove the handlers of `mousemove` and `mouseup`
	document.removeEventListener('mousemove', mouseMoveHandler);
	document.removeEventListener('mouseup', mouseUpHandler);
};

function snuStartStopWatch() {
	let startTime = Date.now();
	snuTimerInterval = setInterval(function () {
		let elapsedTime = Date.now() - startTime;
		let timer = snuResult.querySelector('#timer');
		if (timer) timer.innerHTML = (elapsedTime / 1000).toFixed(3);
	}, 100);
}

let hasLoaded = false;
let editor;
let leftXml;
let theme;
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    {
        var monacoUrl = chrome.runtime.getURL('/') + 'js/monaco/vs';
        // if (navigator.userAgent.toLowerCase().includes('firefox')){ //fix to allow autocomplete issue FF #134
        //     monacoUrl = 'https://snutils.com/js/monaco/0.33/vs';
        // }

        require.config({
            paths: {
                'vs': monacoUrl
            }
        });

        if (message.event == 'fillcodediff') {
            if (hasLoaded) return;
            hasLoaded = true; //only reply to first incoming event.

            document.querySelector('#left').innerText = message.command.leftTitle;
            document.querySelector('#right').innerText = message.command.rightTitle;

            let compareDetails = document.querySelector('#compare-details');
            let detailsHeight = parseFloat(getComputedStyle(compareDetails, null).height.replace("px", ""));

            let theme = (message.command.snusettings?.slashtheme == "light") ? "vs-light" : "vs-dark";
            compareDetails.classList.add(theme);
            document.querySelector('section.actions').classList.add(theme);

            // compensate for the details page space
            document.querySelector('#container').style.height = `calc(100% - ${detailsHeight}px)`;

            require(['vs/editor/editor.main'], () => {
                editor = monaco.editor.createDiffEditor(document.getElementById('container'), {
                    theme: theme,
                    automaticLayout: true,
                    readOnly: true
                });

                var lang = '';
                if (message.command.fieldName.includes('script')) lang = 'javascript';
                else if (message.command.fieldName.includes('css')) lang = 'scss';
                else if (message.command.fieldName.includes('xml')) lang = 'xml';
                else if (message.command.fieldName.includes('html')) lang = 'html';

                let originalModel = monaco.editor.createModel(message.command.leftBody, lang);
                let modifiedModel = monaco.editor.createModel(message.command.rightBody, lang);

                editor.setModel({
                    original: originalModel,
                    modified: modifiedModel
                });

                document.querySelector('.inline-it').addEventListener('change', (e) => {
                    editor.updateOptions({
                        renderSideBySide: !e.target.checked
                    });
                });

                var swapit = true;
                document.querySelector('.swap-it').addEventListener('click', (e) => {
                    e.preventDefault();
                    editor.setModel({
                        original: swapit ? modifiedModel : originalModel,
                        modified: swapit ? originalModel : modifiedModel
                    })

                    var leftHeader = document.querySelector('#left').innerHTML;
                    var rightHeader = document.querySelector('#right').innerHTML;
                    document.querySelector('#left').innerHTML = rightHeader;
                    document.querySelector('#right').innerHTML = leftHeader;
                    swapit = !swapit
                });
            });

        } else if (message.event == 'fetchdiff1') {

            document.querySelector('#left').innerHTML = getMessage(message.command, sender.tab);
            document.querySelector('#right').innerHTML = '<h3>Use /diff2 from instance to compare other version.</h3>';

            let compareDetails = document.querySelector('#compare-details');
            let detailsHeight = parseFloat(getComputedStyle(compareDetails, null).height.replace("px", ""));
            // compensate for the details page space
            document.querySelector('#container').style.height = `calc(100% - ${detailsHeight}px)`;

            theme = (message.command.snusettings?.slashtheme == "light") ? "vs-light" : "vs-dark";
            compareDetails.classList.add(theme);
            document.querySelector('section.actions').classList.add(theme);

            fetch(message.command.url)
                .then(response => response.text())
                .then(data => { //this needs a proper async await...                
                    leftXml = data;
                });

        } else if (message.event == 'fetchdiff2') {
            fetch(message.command.url)
                .then(response => response.text())
                .then(data => { //this needs a proper async await...

                    document.querySelector('#right').innerHTML = getMessage(message.command, sender.tab);
                    document.title = 'Diff Loaded!';

                    document.querySelectorAll('a.callingtab').forEach(a => {
                        a.addEventListener('click', e =>{
                            e.preventDefault();
                            let tabId = Number(a.hash.replace('#',''));
                            chrome.tabs.update(tabId, { active: true });
                        })
                    });

                    require(['vs/editor/editor.main'], () => {
                        editor = monaco.editor.createDiffEditor(document.getElementById('container'), {
                            theme: theme,
                            automaticLayout: true,
                            readOnly: true
                        });

                        let originalModel = monaco.editor.createModel(leftXml, 'xml');
                        let modifiedModel = monaco.editor.createModel(data, 'xml');

                        editor.setModel({
                            original: originalModel,
                            modified: modifiedModel
                        });

                        document.querySelector('.inline-it').addEventListener('change', (e) => {
                            editor.updateOptions({
                                renderSideBySide: !e.target.checked
                            });
                        });

                        var swapit = true;
                        document.querySelector('.swap-it').addEventListener('click', (e) => {
                            e.preventDefault();
                            editor.setModel({
                                original: swapit ? modifiedModel : originalModel,
                                modified: swapit ? originalModel : modifiedModel
                            })

                            var leftHeader = document.querySelector('#left').innerHTML;
                            var rightHeader = document.querySelector('#right').innerHTML;
                            document.querySelector('#left').innerHTML = rightHeader;
                            document.querySelector('#right').innerHTML = leftHeader;
                            swapit = !swapit
                        });
                    });
                })
        }

    }
});

function getMessage(data, tab){
    return ` 
        <h3><img class='favicon' src='${tab.favIconUrl}' alt='favicon' />${data.displayValue} <a href='#${tab.id}' class='callingtab'>goto tab</a></h3>
        <label sty>Instance: </label><span>${data.host}</span><br />
        <label>Record: </label><span>${data.tableName} - ${data.sysId}</span>
    `;
}
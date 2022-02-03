chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    {

        require.config({
            paths: {
                'vs': chrome.runtime.getURL('/') + 'js/monaco/vs'
            }
        });
        require(['vs/editor/editor.main'], () => {
            const editor = monaco.editor.createDiffEditor(document.getElementById('container'));
            editor.setModel({
                original: monaco.editor.createModel(message.command.leftBody, 'javascript'),
                modified: monaco.editor.createModel(message.command.rightBody, 'javascript'),
            });

            document.querySelector('.inline-it').addEventListener('change', (e) => {
                editor.updateOptions({
                    renderSideBySide: !e.target.checked
                });
            });
        });

    }
});
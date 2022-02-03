chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    $('#titles > #left').text(message.command.leftTitle);
    $('#titles > #right').text(message.command.rightTitle);

    let detailsHeight = $('#compare-details').height();
    let theme = (message.command.snusettings?.slashtheme == "light") ? "vs-light" : "vs-dark";

    // compensate for the details page space
    $('#container').css('height', `calc(100% - ${detailsHeight}px)`);
    $('#compare-details').addClass(theme);


    {
        require.config({
            paths: {
                'vs': chrome.runtime.getURL('/') + 'js/monaco/vs'
            }
        });
        require(['vs/editor/editor.main'], () => {

            const editor = monaco.editor.createDiffEditor(document.getElementById('container'), {
                theme: theme
            });
            editor.setModel({
                original: monaco.editor.createModel(message.command.leftBody, 'javascript'),
                modified: monaco.editor.createModel(message.command.rightBody, 'javascript')
            });

            document.querySelector('.inline-it').addEventListener('change', (e) => {
                editor.updateOptions({
                    renderSideBySide: !e.target.checked
                });
            });
        });
    }
});
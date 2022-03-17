let hasLoaded = false;
let editor;
let leftXml;
let theme;


require.config({
    paths: {
        'vs': chrome.runtime.getURL('/') + 'js/monaco/vs'
    }
});

require(['vs/editor/editor.main'], () => {

    editor = monaco.editor.create(document.getElementById('container'), {
        value: "function hello() {\n\talert('Hello world!');\n}",
        language: 'javascript',
        theme : theme
    });
    
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    {

        if (hasLoaded) return;
        hasLoaded = true; //only reply to first incoming event.

        document.querySelector('#editor').innerText = message.command.title;

        let compareDetails = document.querySelector('#compare-details');
        let detailsHeight = parseFloat(getComputedStyle(compareDetails, null).height.replace("px", ""));

        let theme = (message.command.snusettings?.slashtheme == "light") ? "vs-light" : "vs-dark";
        compareDetails.classList.add(theme);
        document.querySelector('section.actions').classList.add(theme);

        // compensate for the details page space
        document.querySelector('#container').style.height = `calc(100% - ${detailsHeight}px)`;

        require.config({
            paths: {
                'vs': chrome.runtime.getURL('/') + 'js/monaco/vs'
            }
        });


    }
});

function getMessage(data, tab) {
    return ` 
        <h3><img class='favicon' src='${tab.favIconUrl}' alt='favicon' />${data.displayValue} <a href='#${tab.id}' class='callingtab'>goto tab</a></h3>
        <label sty>Instance: </label><span>${data.host}</span><br />
        <label>Record: </label><span>${data.tableName} - ${data.sysId}</span>
    `;
}
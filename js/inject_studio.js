//ServiceNow provides this function to add a function to run after the page is loaded, 
//We should always be injected after full load but just in case, we'll check
if (window.self.loaded) {
    setTimeout(snuFixBlankStudioScripts, 0);
}
else if (typeof g_afterPageLoadedFunctions !== 'undefined') {
    g_afterPageLoadedFunctions.push(snuFixBlankStudioScripts);
}


function snuFixBlankStudioScripts() {
    //Every record with a script field has this issue, so we need to match any script field
    //They all have their script element divs in a div with an id of element.<record type>.<field_name>
    //We can't know the field name, but we can match against the field type, which is always script or script_plain
    var recordType = location.pathname.match(/\/(.*?)\.do/) ? location.pathname.match(/\/(.*?)\.do/)[1] : null;
    var scriptElements = document.querySelectorAll(`div[id^='element\\.${recordType}'] > div[type='script'], div[id^='element\\.${recordType}'] > div[type='script_plain']`);


    scriptElements.forEach((scriptElement) => {
        //Every script field has a script to initiate it, init_<record_type>_<field>_editor
        //And stores the GlideEditor object in a variable named <record_type>_<field>_editor
        var parentElement = scriptElement.parentElement;
        var scriptName = parentElement.id.match(/element\.(.*)/)[1].replace(/\./g, '_');

        var initScript = `init_${scriptName}_editor`;
        var editorName = `${scriptName}_editor`;

        //If the init script isn't defined or the editor is already defined, we don't need to do anything
        if (typeof window[initScript] === 'undefined' || typeof window[editorName] !== 'undefined') return;


        //If the script isn't defined at this point, it's because CodeMirror was hidden when it tried to initialize
        //CodeMirror cannot be initialized when it's hidden, so we need to wait until it's visible
        //The SN implementation of this checks if its hidden, and if not gives up
        //We now have IntersectionObserver, so we can wait until it's visible and then initialize it
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    window[initScript]();
                    if (window[editorName]) {
                        //TODO: Some kind of badge or something indicating that the script was fixed
                        observer.disconnect();
                    }
                }
            });
        });
        observer.observe(parentElement);
    });
}
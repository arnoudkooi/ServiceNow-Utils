addEventListener('hashchange', event => {  
    snuAddActionScriptSyncButton();
    setTimeout(snuAddActionScriptSyncButton, 5000); //try twice
});
setTimeout(snuAddActionScriptSyncButton, 5000);

function snuAddActionScriptSyncButton(){
    if (!snusettings?.vsscriptsync) return;
    if (location.hash.startsWith('#/action-designer/')){
        if (document.querySelectorAll('#snuSyncActionScripts').length) return; //only once
        let panel = document.querySelector('#header_right_buttons div');
        if (!panel) return;
        let snubtn = document.createElement("button");
        snubtn.id = 'snuSyncActionScripts'
        snubtn.className = 'btn btn btn-default btn-sync';
        snubtn.innerText = 'scriptsync'
        snubtn.title = '[SN Utils] Send Action scripts to sn-scriptsync'
        snubtn.addEventListener('click', snuActionSendScriptsToScriptSync);
        panel.prepend(snubtn);
    }
}


function snuActionSendScriptsToScriptSync(){

    let actionReact = snuFindReact(document.querySelector("#action-editor"));
    if (!actionReact?.props?.propertiesState?.data.security?.can_write !== false){
        snuSlashCommandInfoText('Can not edit read only action'); 
        return 
    }


    let sidePanelReact = snuFindReact(document.querySelector(".actionOutline.pn-content"));
    let scope = sidePanelReact?.props?.editorState?.actProps.scope;
    let actSteps = sidePanelReact?.props?.editorState?.actSteps;
    let allSteps = sidePanelReact?.props?.allSteps; //the sys_id of the sys_hub_step_instance record only found here
    
    if (!allSteps) { 
        snuSlashCommandInfoText('No action steps found'); 
        return 
    };
    if (!allSteps.filter(f => ['SCRIPT', 'POWERSHELL'].includes(f.DB_TYPE)).length){
        snuSlashCommandInfoText('No script steps found'); 
        return 
    }
    if (actSteps.length != allSteps.length) { // mismatch in length of objects
        snuSlashCommandInfoText('Cannot sync scripts'); 
        return 
    }; 
    var pushed = 0;
    for (let step = 0; step < allSteps.length; step++) {
        if (['SCRIPT', 'POWERSHELL'].includes(allSteps[step].DB_TYPE)){
            if (allSteps[step]?.cid !== actSteps[step]?.cid) continue; //extra check for same step id
            if (allSteps[step]?.readonly) continue; 
            let data = {
                "sysId" : actSteps[step].step_id,
                "scope" : scope,
                "script" : allSteps[step].data?.script || allSteps[step].data?.command,
                "actionName" : allSteps[step].type_name.replace(/[^a-z0-9_\-+]+/gi, '-'),
                "scriptName" : allSteps[step].step_name.replace(/[^a-z0-9_\-+]+/gi, '-')
            }
            snuPostToScriptSync(data, 'flowaction')
            pushed++;
        }
    }
    if (pushed){
        let snubtn = document.querySelector('#snuSyncActionScripts');
        if (!snubtn) return;
        if (document.querySelectorAll('#snualertdiv').length) return;
        let snudiv = document.createElement("div");
        snudiv.id = 'snualertdiv'
        snudiv.style.border = '1pt solid #d9534f';
        snudiv.style.margin = '10px 30px';
        snudiv.style.padding = '7px 15px';
        snudiv.style.fontWeight = 'bold';
        snudiv.style.backgroundColor = '#f0ad4e';
        snudiv.style.borderRadius = '3px';
        snudiv.innerText = `[SN Utils] sn-scriptsync active. Edit and save ${pushed} script${(pushed > 1) ? 's' : '' } in VS Code, reload page to see results`;
        snubtn.parentElement.parentElement.prepend(snudiv);
    }
}

//from stackoverflow to get properties from react components
function snuFindReact(dom, traverseUp = 0) {
    const key = Object.keys(dom).find(key=>{
        return key.startsWith("__reactFiber$") // react 17+
            || key.startsWith("__reactInternalInstance$"); // react <17
    });
    const domFiber = dom[key];
    if (domFiber == null) return null;

    // react <16
    if (domFiber._currentElement) {
        let compFiber = domFiber._currentElement._owner;
        for (let i = 0; i < traverseUp; i++) {
            compFiber = compFiber._currentElement._owner;
        }
        return compFiber._instance;
    }

    // react 16+
    const GetCompFiber = fiber=>{
        //return fiber._debugOwner; // this also works, but is __DEV__ only
        let parentFiber = fiber.return;
        while (typeof parentFiber.type == "string") {
            parentFiber = parentFiber.return;
        }
        return parentFiber;
    };
    let compFiber = GetCompFiber(domFiber);
    for (let i = 0; i < traverseUp; i++) {
        compFiber = GetCompFiber(compFiber);
    }
    return compFiber.stateNode;
}


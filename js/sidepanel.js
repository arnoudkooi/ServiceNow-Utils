let instance;
let tabId;
let snuInstanceTagConfig;

document.addEventListener('DOMContentLoaded', function () {
    const themeSwitch = document.getElementById('themeSwitch');
    const body = document.body;

    themeSwitch.addEventListener('change', function() {
        body.classList.toggle('dark-mode');
    });

    const tagEnabled = document.getElementById('tagEnabled');
    const tagText = document.getElementById('tagText');
    const tagFontSize = document.getElementById('tagFontSize');
    const tagTagColor = document.getElementById('tagTagColor');
    const tagFontColor = document.getElementById('tagFontColor');
    const tagOpacity = document.getElementById('tagOpacity');
    const tagTextDoubleclick = document.getElementById('tagTextDoubleclick');
    const tagCommand = document.getElementById('tagCommand');
    const tagCommandShift = document.getElementById('tagCommandShift');

    /* Set for initial active tab when open the sidepanel */


    chrome.tabs.query({active: true, currentWindow: true}, async tabs =>{
        const tab = tabs[0];
        tabId = tab.id;
        instance = (new URL(tab.url)).host.replace(".service-now.com", "");
        snuInstanceTagConfig = await getFromSyncStorage("instancetag");
        snuInstanceTagConfig = snuInstanceTagConfig;

        if (snuInstanceTagConfig) {
            tagEnabled.checked = snuInstanceTagConfig.tagEnabled;
            tagText.value = snuInstanceTagConfig.tagText;
            tagFontSize.value = parseInt(snuInstanceTagConfig.tagFontSize, 10);
            tagTagColor.value = snuInstanceTagConfig.tagTagColor;
            tagFontColor.value = snuInstanceTagConfig.tagFontColor;
            tagOpacity.value = parseFloat(snuInstanceTagConfig.tagOpacity);
            tagTextDoubleclick.value = snuInstanceTagConfig.tagTextDoubleclick;
            tagCommand.value = snuInstanceTagConfig.tagCommand;
            tagCommandShift.value = snuInstanceTagConfig.tagCommandShift;
        }        
    });

    document.querySelectorAll('input').forEach(inp => { 
        ['change','keyup'].forEach( async evtname => {  

            inp.addEventListener(evtname, async ev => {

                let snuInstanceTagConfigPosition = await getFromSyncStorage("instancetag"); 
                snuInstanceTagConfig.tagBottom = snuInstanceTagConfigPosition.tagBottom;
                snuInstanceTagConfig.tagLeft = snuInstanceTagConfigPosition.tagLeft;

                snuInstanceTagConfig.tagEnabled = tagEnabled.checked;
                snuInstanceTagConfig.tagText = tagText.value;
                snuInstanceTagConfig.tagFontSize = tagFontSize.value + 'pt';    
                snuInstanceTagConfig.tagTagColor = tagTagColor.value;
                snuInstanceTagConfig.tagFontColor = tagFontColor.value;
                snuInstanceTagConfig.tagOpacity = parseFloat(tagOpacity.value);
                snuInstanceTagConfig.tagTextDoubleclick = tagTextDoubleclick.value;
                snuInstanceTagConfig.tagCommand = tagCommand.value;
                snuInstanceTagConfig.tagCommandShift = tagCommandShift.value;
                setToChromeSyncStorage("instancetag", snuInstanceTagConfig);

                chrome.tabs.sendMessage(tabId, {
                    "method": "snuUpdateSettingsEvent",
                    "detail": {
                        "action": "updateInstaceTagConfig",
                        "instaceTagConfig": snuInstanceTagConfig,
                    }
                })
            });
        });
    });


    //run after pageload, to trigger repositioning after the sidepanel showed.
    chrome.tabs.sendMessage(tabId, {
        "method": "snuUpdateSettingsEvent",
        "detail": {
            "action": "updateInstaceTagConfig",
            "instaceTagConfig": snuInstanceTagConfig,
        }
    })

    
  
});


function setToChromeSyncStorage(theName, theValue) {
    let myobj = {};
    myobj[instance + "-" + theName] = theValue;
    chrome.storage.sync.set(myobj, function () {
    });
}

//get an instance sync parameter
async function getFromSyncStorage(theName, callback) {
    // Define the instance variable if it's not already defined
    // Assuming 'instance' is a global variable or has been defined elsewhere
    const instanceName = instance + "-" + theName;
    
    // If a callback is provided, use the traditional callback approach
    if (callback) {
        chrome.storage.sync.get(instanceName, function (result) {
            callback(result[instanceName]);
        });
    } else {
        // If no callback is provided, return a promise
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(instanceName, function (result) {
                if (chrome.runtime.lastError) {
                    // Reject the promise if there's an error
                    reject(chrome.runtime.lastError);
                } else {
                    // Resolve the promise with the result
                    resolve(result[instanceName]);
                }
            });
        });
    }
}
let instance;

document.addEventListener('DOMContentLoaded', function () {
    const themeSwitch = document.getElementById('themeSwitch');
    const body = document.body;

    themeSwitch.addEventListener('change', function() {
        body.classList.toggle('dark-mode');
    });

    const textInput = document.getElementById('textInput');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const colorPicker = document.getElementById('colorPicker');

    fontSizeSlider.addEventListener('input', function() {
        textInput.style.fontSize = fontSizeSlider.value + 'px';
    });

    colorPicker.addEventListener('input', function() {
        textInput.style.color = colorPicker.value;
    });

    /* Set for initial active tab when open the sidepanel */
    (async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        instance = (new URL(tab.url)).host.replace(".service-now.com", "");
        document.querySelector('#instanceButton').innerHTML = JSON.stringify(await getFromSyncStorage("instancebutton"));
    })();
  

    

});


function setToChromeSyncStorage(theName, theValue) {
    var myobj = {};
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
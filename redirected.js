(function () {
    // When being redirected to Single Sign On generate a link to login.do and keep it in local storage for use by the popup

    //get the request url
    var oldUrl = window.location.toString();

    //decode uri component until it stops changing
    var changed = true;
    while (changed) {
        newUrl = decodeURIComponent(oldUrl);
        changed = !(newUrl === oldUrl);
        oldUrl = newUrl;
    }

    //regex to test that the decoded url does contain &RelayState= and does not contain auth_redirect or fromURI
    var regex = /^(?=.*&RelayState=)(?!.*auth_redirect|.*fromURI).*/;
    if (!regex.test(oldUrl)) {
        //regex didn't match so send a message to background script to remove the url from local storage
        chrome.runtime.sendMessage({
            from: 'redirected'
        });
    } else {
        //regex matched so send a message to background script to add the url to local storage

        //extract the instance url from the request url
        newUrl = oldUrl.replace(/(^.*&RelayState=)(https:\/\/.*\.service-now.com)(.*$)/, '$2/login.do');
        chrome.runtime.sendMessage({
            from: 'redirected',
            url: newUrl
        });
    }
})();
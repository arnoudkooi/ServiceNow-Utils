
setTimeout(function () { //be sure dompurify is loaded
    //Initialize Alert
    var parent = document.querySelector('body');
    var alertContainer = document.createElement('div');
    alertContainer.innerHTML = DOMPurify.sanitize('<input id="sn_gck" type="hidden" value="' + (g_ck || '') + '" /><div style="display:none" class="notification-container service-now-util-alert" role="alert" ><div class="notification outputmsg outputmsg_has_text" style="top: 20px;"><span class="outputmsg_text role="alert"></span></div></div>');
    parent.insertBefore(alertContainer, parent.firstChild);
}, 1500);


function snuAddDblClickToPin(cntr = 0) {
    if (typeof querySelectorShadowDom !== 'undefined') {        
        setTimeout( () => {
            attatchDblClickEvent();
        }, 2000);
        function attatchDblClickEvent(){
            let menus = querySelectorShadowDom.querySelectorAllDeep(".sn-polaris-tab:not(.tab-overflow)")
            if (menus.length == 0 && cntr <= 7)  snuAddDblClickToPin(++cntr); //try up to 8x to give dom time to load.
            menus.forEach(div => {
                div.title = '[SN Utils] Doubleclick to pin';
                div.addEventListener('dblclick', evt => {
                    evt.preventDefault();
                    let snuHeader = querySelectorShadowDom.querySelectorDeep("sn-polaris-header");
                    if (snuHeader){
                        snuHeader.dispatch('MAIN_MENU#PINNED', {
                            "isPrimary": false,
                            "primaryMenuId": "all",
                            "secondaryMenuId": div.id,
                            "doPinning": true
                        })
                    };
                })
            })
        }
    }
}


function snuAddStudioLink() {

    if (typeof jQuery == 'undefined') return;
    waitForEl('#concourse_application_tree li', function () {

        var addStudio = jQuery('a[href*="$studio.do"]').length;
        var isUI16 = jQuery('.navpage-header-content').length > 0;
        var widgetHtml;
        if (!isUI16) return;

        if (addStudio) {
            widgetHtml = '<div class="navpage-header-content">' +
                '<button data-placement="auto" class="btn btn-icon icon-cards"' +
                ' title="Quick Application Switch (By SN Utils)\nSlashcommand: /sa" data-original-title="Studio" onclick="snuSlashCommandShow(\'/sa\',1);">' +
                '<span class="sr-only">Studio</span>' +
                '</button>' +
                '<button data-placement="auto" class="btn btn-icon icon-script"' +
                ' title="Open Studio IDE (Link by SN Utils)\nSlashcommand: /st" data-original-title="Studio" onclick="window.open(\'/$studio.do\', \'_blank\');">' +
                '<span class="sr-only">Studio</span>' +
                '</button></div>';
            jQuery('#sysparm_search').parents('div.navpage-header-content').first().after(widgetHtml);


        }
    });
}

function waitForEl(selector, callback) {
    if (document.querySelectorAll(selector).length) {
        callback();
    } else {
        setTimeout(function () {
            waitForEl(selector, callback);
        }, 300);
    }
};







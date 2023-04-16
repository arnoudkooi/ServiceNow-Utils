
setTimeout(function () { //be sure dompurify is loaded
    //Initialize Alert
    var parent = document.querySelector('body');
    var alertContainer = document.createElement('div');
    alertContainer.innerHTML = DOMPurify.sanitize('<input id="sn_gck" type="hidden" value="' + (g_ck || '') + '" /><div style="display:none" class="notification-container service-now-util-alert" role="alert" ><div class="notification outputmsg outputmsg_has_text" style="top: 20px;"><span class="outputmsg_text role="alert"></span></div></div>');
    parent.insertBefore(alertContainer, parent.firstChild);
},1500);


function addDblClickToPin(){

    setTimeout(function () {
        var snuHeader = document.querySelector("macroponent-f51912f4c700201072b211d4d8c26010")?.
        shadowRoot?.querySelector("sn-polaris-layout")?.
        shadowRoot?.querySelector("sn-polaris-header");
        snuHeader?.shadowRoot?.querySelectorAll(".sn-polaris-tab:not(.tab-overflow)").forEach(div => {
            div.title = '[SN Utils] Doubleclick to pin';
            div.addEventListener('dblclick', evt => {
                evt.preventDefault();
                snuHeader.dispatch('MAIN_MENU#PINNED', { "isPrimary": false,
                    "primaryMenuId": "all",
                    "secondaryMenuId": div.id,
                    "doPinning": true})
            })
        })
    },6500);
}


function addStudioLink() {

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







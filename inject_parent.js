if (typeof jQuery != "undefined") {


    jQuery(function () {
        //Initialize Alert
        var alertContainer = '<div class="notification-container service-now-util-alert" role="alert" style="top: 20px;"><div class="notification outputmsg outputmsg_has_text"><span class="outputmsg_text role="alert"></span></div></div>';
        jQuery('header').prepend(alertContainer);

    });
}

function addStudioLink() {

    waitForEl('#concourse_application_tree li', function() {

        var addStudio = jQuery('a[href*="$studio.do"]').length;

        var isUI16 = jQuery('.navpage-header-content').length > 0;
        var title = "Open Studio IDE (Link by SN Utils)";

        var contextMenu = '<ul class="dropdown-menu" role="menu" style="z-index: 10000; display: block; position: absolute; ">' +
            '<li><a href="#" >View Current</a></li>' +
            '<li class="divider"></li>'+
            '<li><a href="#" target="">Import from Remote</a></li></ul>';

        var widgetHtml;

        if (addStudio) {
            if (isUI16) {
                widgetHtml = '<div class="navpage-header-content">' +
                    '<button data-placement="auto" class="btn btn-icon icon-script"' +
                    ' title="' + title + '" data-original-title="Studio" onclick="window.open(\'/$studio.do\', \'_blank\');">' +
                    '<span class="sr-only">Studio</span>' +
                    '</button></div>' //+ contextMenu;
                jQuery('#sysparm_search').parents('div.navpage-header-content').first().after(widgetHtml);
            }
        }
    });
}


function waitForEl (selector, callback) {
    if (jQuery(selector).length) {
      callback();
    } else {
      setTimeout(function() {
        waitForEl(selector, callback);
      }, 300);
    }
};

function searchSysIdTables(sysId) {
    try {
        showAlert('Searching for sys_id. This could take some seconds...')
        var script = 'function findSysID(e){var s,d,n=new GlideRecord("sys_db_object");n.addEncodedQuery("' +
            [
                'super_class=NULL', //do not include extended tables 
                'sys_update_nameISNOTEMPTY',
                'nameNOT LIKEts_',
                'nameNOT LIKEsysx_',
                'nameNOT LIKEv_',
                'nameNOT LIKE00',
                'nameNOT LIKEsys_rollback_',
                'nameNOT LIKEpa_',
            ].join('^') +
            '"),n.query();for(var a=[];n.next();)d=n.name+"",(s=new GlideRecord(d)).isValid()&&(s.addQuery("sys_id",e),s.queryNoDomain(),s.setLimit(1),s.query(),s.hasNext()&&a.push(d));gs.print("###"+a+"###")}findSysID("' + sysId + '");'
        startBackgroundScript(script, function (rspns) {
            answer = rspns.match(/###(.*)###/);
            if (answer != null && answer[1]) {
                showAlert('Success! All found records will be opened in a separate browser tab.', 'success');
                var tables = answer[1].split(',');
                var url;
                for (var i = 0; i < tables.length; i++) {
                    url = tables[i] + '.do?sys_id=' + sysId;
                    window.open(url, '_blank');
                }
            } else {
                showAlert('sys_id was not found in the system.', 'warning');
            }
        });
    } catch (error) {
        showAlert(error, 'danger');
    }
}
  
  



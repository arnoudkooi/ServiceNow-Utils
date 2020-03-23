
//document.addEventListener("DOMContentLoaded", function () {
    //Initialize Alert
    var parent = document.querySelector('body');
    var alertContainer = document.createElement('div');
    alertContainer.innerHTML = '<input id="sn_gck" type="hidden" value="' + (g_ck || '') + '" /><div class="notification-container service-now-util-alert" role="alert" style="top: 20px;"><div class="notification outputmsg outputmsg_has_text"><span class="outputmsg_text role="alert"></span></div></div>';
    parent.insertBefore(alertContainer, parent.firstChild);
//});



function addStudioLink() {

    waitForEl('#concourse_application_tree li', function () {

        var addStudio = jQuery('a[href*="$studio.do"]').length;
        var isUI16 = jQuery('.navpage-header-content').length > 0;
        var widgetHtml;
        if (!isUI16) return;

        if (addStudio) {
                widgetHtml = '<div class="navpage-header-content">' +
                    '<button data-placement="auto" class="btn btn-icon icon-script"' +
                    ' title="Open Studio IDE (Link by SN Utils)" data-original-title="Studio" onclick="window.open(\'/$studio.do\', \'_blank\');">' +
                    '<span class="sr-only">Studio</span>' +
                    '</button></div>';
                jQuery('#sysparm_search').parents('div.navpage-header-content').first().after(widgetHtml);
            
        }

        // if (typeof Select2 != 'undefined') {
        //     //convert the updatset and application picker to select2
        //     var s2ify = 
        //     '<span data-placement="auto" onclick="snS2Ify(this)" style="position: absolute; top: 10px; margin-left: -11px;" class="icon icon-ellipsis-vertical" title="Toggle App select normal / enhanced" />';
        //     jQuery('#update_set_picker_select').after(s2ify);
        //     jQuery('#application_picker_select').after(s2ify);

        //     // jQuery('#application_picker_select').select2({ 'dropdownAutoWidth': true })
        //     // jQuery('#application_picker_select').on('change', function (e) {
        //     //     setTimeout(function () {
        //     //         jQuery('#update_set_picker_select').trigger('change.select2');
        //     //     }, 5000);

        //     // }); 

        //     // jQuery('#update_set_picker_select').select2({ 'dropdownAutoWidth': true });
        //     // jQuery('#update_set_picker_select').on('change', function (e) {
        //     //     jQuery('#update_set_picker_select').trigger('change.select2');
        //     // });
        // }



    });
}

//toggle Select2 for Application and updatesetpicker
function snuS2Ify(){

    if (typeof Select2 == 'undefined') return;
    
    var setOff = jQuery('#application_picker_select').hasClass('select2-offscreen'); 

    jQuery('#application_picker_select').select2('destroy'); 
    jQuery('#update_set_picker_select').select2('destroy'); 

    if (setOff) return;
    
    jQuery('#application_picker_select').select2({ 'dropdownAutoWidth': true })
    jQuery('#application_picker_select').on('change', function (e) {
        setTimeout(function () {
            jQuery('#update_set_picker_select').trigger('change.select2');
        }, 5000);

    }); 

    jQuery('#update_set_picker_select').select2({ 'dropdownAutoWidth': true });
    jQuery('#update_set_picker_select').on('change', function (e) {
        jQuery('#update_set_picker_select').trigger('change.select2');
    });

}


function waitForEl(selector, callback) {
    if (jQuery(selector).length) {
        callback();
    } else {
        setTimeout(function () {
            waitForEl(selector, callback);
        }, 300);
    }
};

function searchSysIdTables(sysId) {
    try {
        showAlert('Searching for sys_id. This could take some seconds...')
        var script = `      
            function findSysID(sysId) {
                var tbls = ['sys_metadata', 'task', 'cmdb_ci', 'sys_user'];
                var rtrn;
                var i = 0;
                while (tbls[i]) {
                    rtrn = findClass(tbls[i], sysId);
                    i++;

                    if (rtrn) {
                        gs.print("###" + rtrn + "###")
                        return
                    };
                }

                var tblsGr = new GlideRecord("sys_db_object");
                tblsGr.addEncodedQuery("super_class=NULL^sys_update_nameISNOTEMPTY^nameNOT LIKEts_^nameNOT LIKEsysx_^nameNOT LIKE00^nameNOT LIKEv_^nameNOT LIKEsys_rollback_^nameNOT LIKEpa_^nameNOT INsys_metadata,task,cmdb_ci,sys_user")
                tblsGr.query();
                while (tblsGr.next()) {
                    rtrn = findClass(tblsGr.getValue('name'), sysId);
                    if (rtrn) {
                        gs.print("###" + rtrn + "###")
                        return
                    };
                }
                function findClass(t, sysId) {
                    var s = new GlideRecord(t);
                    s.addQuery('sys_id', sysId);
                    s.setLimit(1);
                    s.queryNoDomain();
                    s.query();
                    if (s.hasNext()) {
                        s.next();
                        return s.getRecordClassName() + "^" 
                        + s.getClassDisplayValue() + " - " 
                        + s.getDisplayValue() ;
                    }
                    return false;
                }
            }

            findSysID('`+ sysId +`')
        `;
        startBackgroundScript(script, function (rspns) {
            answer = rspns.match(/###(.*)###/);
            if (answer != null && answer[1]) {
                showAlert('Opening in new tab: ' + answer[1].split('^')[1], 'success');
                var table = answer[1].split('^')[0];
                var url = table + '.do?sys_id=' + sysId;
                window.open(url, '_blank');   
            } else {
                showAlert('sys_id was not found in the system.', 'warning');
            }
        });
    } catch (error) {
        showAlert(error, 'danger');
    }
}





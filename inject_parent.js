
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
    });
}

//toggle Select2 for Application and updatesetpicker
function snuS2Ify(){

    if (typeof Select2 == 'undefined') return;
    
    var setOff = jQuery('#application_picker_select').hasClass('select2-offscreen'); 

    jQuery('#application_picker_select').select2('destroy'); 
    jQuery('#update_set_picker_select').select2('destroy'); 
    jQuery('#domain_picker_select_header').select2('destroy'); 

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

    
    jQuery('#domain_picker_select_header').select2({ 'dropdownAutoWidth': true });
    jQuery('#domain_picker_select_header').on('change', function (e) {
        jQuery('#domain_picker_select_header').trigger('change.select2');
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







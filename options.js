
document.addEventListener('DOMContentLoaded', function () {

    $('#cbxredirect').click(function () {
				// Enable SSO redirect detection checkbox click handler
        var cbxval = $('#cbxredirect').prop('checked');
        chrome.storage.sync.set({'cbxredirected': cbxval});
		});

			//get the value of Enable SSO redirect detection checkbox and set the checkbox to match
			chrome.storage.sync.get('cbxredirected', function(result){
        if (result.cbxredirected) {
            //check the checkbox
            $('#cbxredirect').attr('checked', true); 
        }
		});
});


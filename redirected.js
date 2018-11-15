(function () {
	// when being redirected to single sign on, this creates a link back to login.do

	//get the request url
	var oldUrl =  window.location.toString(); 
	
	//decode uri component until it stops changing
	var changed = true;
	while (changed) { 
		newUrl = decodeURIComponent(oldUrl);
		changed = !(newUrl === oldUrl);
		oldUrl = newUrl;
	}

	//extract the instance url from the request url
	newUrl = oldUrl.replace(/(^.*&RelayState=)(https:\/\/.*\.service-now.com)(.*$)/,'$2/login.do');
	
	//create a new element
	var link = document.createElement("div");
	link.setAttribute("class", "dedirect");
	link.innerHTML = '<div>You got redirected, click here to go to <a href="' + newUrl + '">login.do</a><div>';//double level of nesting
	
	//insert the new element at the top of the dom
	//on some SSO pages this will be covered by existing content
	$(document.body).prepend(link);

	//Wait for the page to finish loading
	$(document).ready(function(){
		//move the new element to the end of the DOM
		$('.dedirect').appendTo(document.body);

		//set the position to absolute. The object is now at the front on everything else on page
		$('.dedirect').css("position","absolute"); 

		//set the top and left to 0px so the link is in the top left corner
		$('.dedirect').css("left", "0px");
		$('.dedirect').css("top", "0px");

	});
})();
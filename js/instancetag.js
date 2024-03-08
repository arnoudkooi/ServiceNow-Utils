// Configuration object (can be replaced with a JSON object)
let snuInstanceTagConfig; // defined in background.js, specific values stored in sync storage

snuDispatchBackgroundEvent("getinstancetagconfig");


const snuContainer = document.createElement('div');
snuContainer.innerHTML = `
<div id="snuInstanceTag">
  <div class="snuWrapper">
    <div id="snuDragHandle" title="Click an hold to drag">&#8942;&NonBreakingSpace;</div>
    <span id="snuInstanceTagSettings" title="Click to configure InstanceTag, SHIFT Click to disable">&#9881;&NonBreakingSpace;</span>
    <span id="snuCommand" title="Click to execute command /tn, hold SHIFT for /vd">&#9656;&NonBreakingSpace;</span>
    <span id="snuTagText" title="Doubleclick to run command /pop "> InstanceName</span>
  </div>
</div>
`;
document.body.append(snuContainer);


const snuStyle = document.createElement('style');
snuStyle.textContent = `

:root {
  --snu-instancetag-font-size: 12pt;
  --snu-instancetag-font-color: #FFFFFF;
  --snu-instancetag-tag-color: #4CAF50;
  --snu-instancetag-tag-opacity: 0.01; /* Initial hidden */
  --snu-instancetag-tag-display: block;
}

#snuInstanceTag {
  position: fixed;
  display: var(--snu-instancetag-tag-display);
  right: 0px;
  bottom: 70%; /* Adjust bottom position to around 70% */
  background-color: var(--snu-instancetag-tag-color);
  color: var(--snu-instancetag-font-color);
  opacity: var(--snu-instancetag-tag-opacity);
  padding: 5px 8px;
  cursor: pointer;
  z-index: 100000001;
  /* min-width: 100px; */
  /* width: fit-content; Adjust width to fit the content */
  text-align: center;
  font-size: var(--snu-instancetag-font-size);
  user-select: none;  
}

#snuInstanceTag span{
  color: var(--snu-instancetag-font-color) ;
}


#snuInstanceTag:hover {
  opacity: 1;
}

.snuWrapper {
  display: flex;
  flex-direction: row;
}
.snuWrapper.btm {
  flex-direction: column;
}

/* Default border radius */
#snuInstanceTag.normal {
  border-radius: 5px;
}

/* Left side border radius */
#snuInstanceTag.left {
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

/* Right side border radius */
#snuInstanceTag.right {
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}

#snuInstanceTag.bottom {
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

#snuDragHandle {
  cursor: move;
  user-select: none;
}

.snuVertical {
  transform: rotate(90deg); /* Rotate the button for snuVertical orientation */
}



`;

document.head.append(snuStyle);

let actualButtonWidth = document.getElementById("snuInstanceTag").clientWidth;

// set button properties based on configuration
function snuSetInstanceTagProperties() {
  document.documentElement.style.setProperty("--snu-instancetag-tag-display", snuInstanceTagConfig.tagEnabled ? "" : "none");
  if (snuInstanceTagConfig?.tagText) 
    document.getElementById("snuTagText").innerText = snuInstanceTagConfig.tagText;
  if (snuInstanceTagConfig?.tagFontSize) 
    document.documentElement.style.setProperty("--snu-instancetag-font-size", snuInstanceTagConfig.tagFontSize);
  if (snuInstanceTagConfig?.tagFontColor)
    document.documentElement.style.setProperty("--snu-instancetag-font-color", snuInstanceTagConfig.tagFontColor);
  if (snuInstanceTagConfig?.tagTagColor)
    document.documentElement.style.setProperty("--snu-instancetag-tag-color", snuInstanceTagConfig.tagTagColor);
  if (snuInstanceTagConfig?.tagOpacity)
    document.documentElement.style.setProperty("--snu-instancetag-tag-opacity", snuInstanceTagConfig.tagOpacity);
}

// Initialize and handle dragging
let snuIsDragging = false;
const snuInstanceTag = document.getElementById("snuInstanceTag");
const snuDragHandle = snuInstanceTag.querySelector("#snuDragHandle");



snuDragHandle.addEventListener("mousedown", function (e) {
  // Record the initial mouse position and element position
  let startX = e.clientX;
  let startY = e.clientY;
  let startButtonX = snuDragHandle.offsetLeft;
  let startButtonY = snuDragHandle.offsetTop;

  snuIsDragging = true;
  //e.preventDefault(); // Prevent unwanted text selection

  // Create the overlay
  let overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.zIndex = '10000000';
  overlay.style.cursor = 'move';
  overlay.style.backgroundColor = '#000000';
  overlay.style.opacity = '0.05';
  document.body.appendChild(overlay);

  // Define the mouse move handler within this scope
  function overlayMouseMoveHandler(moveEvent) {
    if (!snuIsDragging) return;
    // Calculate the new position
    let deltaX = moveEvent.clientX - startX;
    let deltaY = moveEvent.clientY - startY;

    // Set the new position
    snuDragHandle.style.left = startButtonX + deltaX + 'px';
    snuDragHandle.style.top = startButtonY + deltaY + 'px';
  }

  // Attach mousemove and mouseup event listeners to the overlay
  overlay.addEventListener("mousemove", overlayMouseMoveHandler);
  overlay.addEventListener("mouseup", function () {
    snuIsDragging = false;
    snuInstanceTagConfig.tagLeft = snuInstanceTag.style.left;
    snuInstanceTagConfig.tagBottom = snuInstanceTag.style.bottom;
    overlay.removeEventListener("mousemove", overlayMouseMoveHandler);
    document.body.removeChild(overlay);
    snuDispatchBackgroundEvent("updateinstancetagconfig", snuInstanceTagConfig);

  });

});



document.querySelector("#snuInstanceTagSettings").addEventListener("click", ev => {
  ev.preventDefault();
  ev.stopPropagation();
  if (ev.shiftKey) snuSlashCommandShow('/itt',true); //shift click to disable
  else {

    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
      snuSlashCommandInfoText('In Firefox please use context menu to show Side panel', false);
      return;
    }
    snuDispatchBackgroundEvent("showsidepanel", snuInstanceTagConfig);
  }
});

document.querySelector("#snuCommand").addEventListener("click", ev => {
  ev.preventDefault();
  ev.stopPropagation();
  if (ev.shiftKey) snuSlashCommandShow(snuInstanceTagConfig.tagCommandShift,true);
  else snuSlashCommandShow(snuInstanceTagConfig.tagCommand,true);
});

document.querySelector("#snuTagText").addEventListener("dblclick", ev => {
  ev.preventDefault();
  ev.stopPropagation();
  snuSlashCommandShow(snuInstanceTagConfig.tagTextDoubleclick,true);
});

function snuDispatchBackgroundEvent(eventName, payload) {
  var event = new CustomEvent(
      "snutils-event",
      {
          detail: {
              event: eventName,
              command: payload
          }
      }
  );
  window.top.document.dispatchEvent(event);
}

function snuReceiveInstanceTagEvent(e){
  snuInstanceTagConfig = e.detail.instaceTagConfig;
  snuParsePosition();
}


document.addEventListener("mousemove", function (e) {
  if (snuIsDragging) {
    // Calculate new position
    let x = e.clientX;
    let y = e.clientY;

    // Get window dimensions
    const windowWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight - 100;
    // Limit x to be within the window bounds
    x = Math.max(0, Math.min(x, windowWidth - snuInstanceTag.offsetWidth));

    // Limit y to be within the window bounds and stay above the top boundary
    y = Math.max(0, Math.min(y, viewportHeight - snuInstanceTag.offsetHeight));

    // Update button position
    snuInstanceTag.style.left = x + "px";
    snuInstanceTag.style.bottom = viewportHeight - y + "px";

    // Snap to edge while dragging
    snuSnapToEdge(x, y);
  }
});


// Note: Credit for Mirza Talha via Fiverr and thanks to Patreon supporters :)
function snuParsePosition() {

  snuSetInstanceTagProperties();
  const viewportHeight = document.documentElement.clientHeight - 100;

  snuInstanceTag.style.right = "auto";
  snuInstanceTag.style.left = snuInstanceTagConfig.tagLeft;

  let x = viewportHeight - parseFloat(snuInstanceTagConfig.tagBottom);
  if (parseFloat(snuInstanceTagConfig.tagBottom) <= 0) {
    snuInstanceTagConfig.tagLeft = snuInstanceTag.style.left;
    snuInstanceTagConfig.tagBottom = parseFloat(snuInstanceTagConfig.tagBottom) + x + "px";
  } else {
    snuInstanceTagConfig.tagLeft = snuInstanceTag.style.left;
    snuInstanceTagConfig.tagBottom = parseFloat(snuInstanceTagConfig.tagBottom) + "px";
  }
  if (parseFloat(snuInstanceTagConfig.tagBottom) <= 45) {
    snuInstanceTagConfig.tagLeft = snuInstanceTag.style.left;
    snuInstanceTagConfig.tagBottom =  "45px";
  }

  snuInstanceTag.style.bottom = snuInstanceTagConfig.tagBottom;
  snuSnapToEdge(
    parseInt(snuInstanceTagConfig.tagLeft, 10),
    parseInt(snuInstanceTagConfig.tagBottom, 10)
  );
};


// Update snuSnapToEdge function
function snuSnapToEdge(clientX, clientY) {

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const shouldSnapLeft = clientX < windowWidth / 2;
  const shouldSnapBottom = windowHeight - clientY < 200;
  let InstanceTagHeight = snuInstanceTag.clientHeight;

  if (isNaN(clientX) || clientX < 20) clientX = 20;

  let pos = Math.round(1.4375 * InstanceTagHeight);

  if (shouldSnapLeft && !shouldSnapBottom) {
    snuInstanceTag.style.left = `-${actualButtonWidth / 2 - 10}px`; // Snap to the left edge based on height
    snuInstanceTag.style.right = "auto";
    snuInstanceTag.classList.add("snuVertical", "left"); // Add left class
    snuInstanceTag.classList.remove("right", "normal", "bottom"); // Remove right and normal classes
    snuRotateText(0); // Rotate text to 0 degrees
  } else if (!shouldSnapBottom) {
    snuInstanceTag.style.right = `-${actualButtonWidth / 2 - 10}px`; // Snap to the right edge based on height
    snuInstanceTag.style.left = "auto";
    snuInstanceTag.classList.add("snuVertical", "right"); // Add right class
    snuInstanceTag.classList.remove("left", "normal", "bottom"); // Remove left and normal classes
    snuRotateText(-180); // Rotate text to -180 degrees
  }

  let x = document.querySelector(".snuWrapper");
  if (shouldSnapLeft && !shouldSnapBottom) {
    x.style.flexDirection = "row";
  } else {
    x.style.flexDirection = "row";
    snuRotateText(0);
  }

  if (shouldSnapBottom) {
    snuInstanceTag.style.right = "auto";
    if (parseFloat(snuInstanceTag.style.left) <= 25) {
      snuInstanceTag.style.left = "25px";
    }

    snuInstanceTag.style.left = clientX + "px";
    // Fix for Bottom Right overflow
    if (windowWidth - clientX <= 64) {
      snuInstanceTag.style.left = clientX - 64 + "px";
    }

    snuInstanceTag.style.bottom = "0px";
    snuInstanceTag.classList.add("bottom");
    snuInstanceTag.classList.remove("left", "normal");
    snuInstanceTag.classList.remove("right", "normal");
    snuInstanceTag.classList.remove("snuVertical");
  }

  if (window.innerWidth - parseFloat(snuInstanceTag.style.left) <= 45) {
    snuInstanceTag.style.left = "auto";
    snuInstanceTag.style.right = "45px";
  }

  //this section adjust position if the button is off screen, ie bevcause of text length or font size
  const rect = snuInstanceTag.getBoundingClientRect();
  const offLeft = Math.round(rect.left); 
  const offRight = Math.round(rect.right - window.innerWidth + 10);
  if (shouldSnapLeft && !shouldSnapBottom && offLeft != 0)
    snuInstanceTag.style.left = parseInt(snuInstanceTag.style.left, 10) - offLeft + "px";
  else if (!shouldSnapBottom && offRight != 0)
    snuInstanceTag.style.right = parseInt(snuInstanceTag.style.right, 10) + offRight + "px";

}

function snuRotateText(degrees) {
  const snuTagText = document.getElementById("snuTagText");
  snuTagText.style.transform = `rotate(${degrees}deg)`;
}

//snuParsePosition();
/**
 * Create the UI: create variable rows for each command
 */
async function createUI() {

    if (typeof browser !== 'undefined') {
        document.querySelector('#chrome_warning').hidden = true;
    } else {
        // chrome
        return;
    }

    let commands = await browser.commands.getAll();
    let form = document.querySelector("#shortcuts");
    for (command of commands) {
        let line = document.createElement("div");
        line.classList.add("key-line");
        form.appendChild(line);

        let label = document.createElement("label");
        let labelText = document.createTextNode(command.description || command.name);
        label.append(labelText);
        line.appendChild(label);

        let input = document.createElement("input");
        input.id = command.name;
        input.value = command.shortcut;
        line.appendChild(input);

        let update = document.createElement("button");
        update.id = command.name + "_update";
        update.addEventListener('click', updateShortcut);
        line.appendChild(update);
        let updateText = document.createTextNode("Update");
        update.append(updateText);

        let reset = document.createElement("button");
        reset.id = command.name + "_reset";
        reset.addEventListener('click', resetShortcut);
        line.appendChild(reset);
        let resetText = document.createTextNode("Reset");
        reset.append(resetText);
    }
}

/**
 * Update the UI: set the value of the shortcut textbox.
 */
async function updateUI() {
    let commands = await browser.commands.getAll();
    for (command of commands) {
        let input = document.querySelector('#'+command.name);
        input.value = command.shortcut;
    }
}

/**
 * Update the shortcut based on the value in the textbox.
 */
async function updateShortcut(e) {
    let shortcut = e.target.parentElement.querySelector('input').id;
    await browser.commands.update({
        name: shortcut,
        shortcut: document.querySelector('#'+shortcut).value
    });
}

/**
 * Reset the shortcut and update the textbox.
 */
async function resetShortcut(e) {
    let shortcut = e.target.parentElement.querySelector('input').id;
    await browser.commands.reset(shortcut);
    updateUI();
}

/**
 * Update the UI when the page loads.
 */
document.addEventListener('DOMContentLoaded', createUI);

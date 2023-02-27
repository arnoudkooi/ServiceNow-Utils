document.querySelectorAll("td.left[onclick]").forEach(td => {
    let field = td.id.replace('td-pulled-', '');
    let lnk = document.createElement('a');
    let linkText = document.createTextNode(" [SN Utils Compare]");
    lnk.appendChild(linkText);
    lnk.href = "#";
    lnk.style = 'font-size:7pt; display:block'
    lnk.addEventListener('click', evt => {
        openMonaceDiff(field);

    });
    td.previousSibling.append(lnk);
});

document.querySelectorAll("td.left:not([onclick]):not(.spacer)").forEach(td => {
    let field = td.id.replace('td-pulled-', '');
    let fieldSplit = field.split('.');
    if (fieldSplit.length > 2) {
        setupForNonEditableFields(
            ['dummy', fieldSplit[1], fieldSplit[2]].join('.'),
            [fieldSplit[1], fieldSplit[2]].join('.'),
            field,
            td
        );
    }
});

function setupForNonEditableFields(leftElementId, rightElementId, field, td) {
    let leftBody = document.getElementById(leftElementId)?.value || '';
    let rightBody = document.getElementById(rightElementId)?.value || ''

    if (leftBody == rightBody && (leftBody.length < 25 || rightBody.length < 25)) return;

    let lnk = document.createElement('a');
    let linkText = document.createTextNode(" [SN Utils Compare]");
    lnk.appendChild(linkText);
    lnk.href = "#";
    lnk.style = 'font-size:7pt; display:block'
    lnk.addEventListener('click', evt => {
        openMonaceDiff(field, {
            leftBody: leftBody,
            rightBody: rightBody
        });
    });
    td.previousSibling.append(lnk);
}

function getCompareNames() {
    let nodeList = [...document.querySelectorAll("thead th.main")].map(el => el.innerHTML);

    return {
        originalTitle: nodeList[0],
        modifiedTitle: nodeList[1]
    };
}


function openMonaceDiff(fieldName, context) {
    let event = new CustomEvent(
        "snutils-event", {
            detail: {
                event: "opencodediff"
            }
        }
    );
    window.top.document.dispatchEvent(event);

    setTimeout(function () {
        // ServiceNow shows the original on modified on the left and the original on the right,
        // however this looks wrong in a diff tool so we need to swap the values to show the correct diff
        let originalBody = context ? context.rightBody : gel(fieldName).value;
        let modifiedBody = context ? context.leftBody : _getElementByPrefix('pulled', fieldName).value;

        let names = getCompareNames();
        let data = {
            fieldName : fieldName,
            leftBody: originalBody,
            leftTitle: names.originalTitle,
            rightBody: modifiedBody,
            rightTitle: names.modifiedTitle,
            snusettings: snusettings
        };
        let event = new CustomEvent(
            "snutils-event", {
                detail: {
                    event: "fillcodediff",
                    command: data
                }
            }
        );
        window.top.document.dispatchEvent(event);
    }, 1500);


}
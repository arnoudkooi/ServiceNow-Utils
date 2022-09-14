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
        leftTitle: nodeList[0],
        rightTitle: nodeList[1]
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
        let rightBody = context ? context.rightBody : gel(fieldName).value;
        let leftBody = context ? context.leftBody : _getElementByPrefix('pulled', fieldName).value;

        let names = getCompareNames();
        let data = {
            fieldName : fieldName,
            leftBody: leftBody,
            leftTitle: names.leftTitle,
            rightBody: rightBody,
            rightTitle: names.rightTitle,
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
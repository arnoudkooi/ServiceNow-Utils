document.querySelectorAll("td.left[onclick]").forEach(td => {

    let field = td.id.replace('td-pulled-', '');
    let lnk = document.createElement('a');
    let linkText = document.createTextNode("[SN Utils Compare]");
    lnk.appendChild(linkText);
    lnk.href = "#";
    lnk.addEventListener('click', evt => {
        openMonaceDiff(field);

    })
    td.previousSibling.append(lnk);

})

function openMonaceDiff(field_name) {


    var event = new CustomEvent(
        "snutils-event", {
            detail: {
                event: "opencodediff"
            }
        }
    );
    window.top.document.dispatchEvent(event);

    setTimeout(function () {
        var rightBody = gel(field_name).value;
        var leftBody = _getElementByPrefix('pulled', field_name).value;

        var data = {
            rightBody: rightBody,
            leftBody: leftBody
        }
        var event = new CustomEvent(
            "snutils-event", {
                detail: {
                    event: "fillcodediff",
                    command: data
                }
            }
        );
        window.top.document.dispatchEvent(event);

    }, 400)


}
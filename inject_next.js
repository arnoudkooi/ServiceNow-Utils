
class SnuNextManager {
    "use strict";
    constructor() {
        document.addEventListener('dblclick', evt => {
            let eventPath = evt.path || (evt.composedPath && evt.composedPath());
            //console.dir(eventPath);
            if (['textarea', 'input', 'select'].includes(eventPath[0].localName)) return; //not in form elements
            if (eventPath[0]?.className?.includes('snunodblclk') || eventPath[1]?.className?.includes('snunodblclk')) return; //not in list header with classname
            if (!eventPath[0]?.className?.includes('snuelm'))
                if (!this._snuShowUpdateFieldNext(eventPath))
                    this.addTechnicalNames();
            // snuSetInfoText('No dblclick action found', false);
            // setTimeout(snuHideSlashCommand, 2500);

        });
    }

    addTechnicalNames() {
        let namesAdded = 0;
        let frms = querySelectorShadowDom.querySelectorAllDeep('sn-form-data-connected, sn-form-data-connected');
        frms.forEach(frm => {
            if (!querySelectorShadowDom.querySelectorAllDeep('.snufrm',frm).length){ //only add once
                let uiab = querySelectorShadowDom.querySelectorAllDeep('.uiaction-bar-wrapper',frm);
                let div = document.createElement("div");
                let view = querySelectorShadowDom.querySelectorDeep('now-record-form-section-column-layout',frm)?.view || frm.view; 
                div.className = 'snutn snufrm snunodblclk';
                div.style = 'margin-left: 4px; font-size:9pt; text-decration:none';
                div.innerHTML = `<a title='SN Utils - Open view in platform' href='/${frm.table}.do?sys_id=${frm.nowRecordFormBlob.sysId}&sysparm_view=${view}' target='_blank'>${frm.table} - ${view}</a>
                <a id='snureload' title='SN Utils - Reload this form' href='#' >⟳</a>
                <a id='snuconsole' title='SN Utils - Show object data in console' href='#' >↷</a>`;
                frm.insertBefore(div, frm.firstChild );
                frm.querySelector('#snureload').addEventListener('click' , e =>{
                    e.preventDefault();
                    frm.nowRecordFormBlob.gForm.reload();
                })
                frm.querySelector('#snuconsole').addEventListener('click' , e =>{
                    e.preventDefault();
                    console.log('SN Utils: sn-form-data-connected');
                    console.dir(frm);
                    console.log('SN Utils: sn-form-data-connected.nowRecordFormBlob');
                    console.dir(frm.nowRecordFormBlob);
                    console.log('SN Utils: sn-form-data-connected.nowRecordFormBlob.gForm');
                    console.dir(frm.nowRecordFormBlob.gForm);
                })
            }
            let elms = querySelectorShadowDom.collectAllElementsDeep('*', frm);
            elms.forEach(elm => {
                if (elm['dictionary']) {

                    //console.dir(elm);
                    let lbl = querySelectorShadowDom.querySelectorDeep('label:not(.snutnwrap)', elm);
                    if (lbl) {
                        let tmplt =
                            `<style> @import "${snusettings.extensionUrl}css/inject.css"; </style>
                    <details class="snupopover snuelm">
                      <summary>⚙ </summary>
                      <div>
                        <div>
                        [SN Utils] Field Info: <br />
                          <a class='snuelm' target='dictionary' href="/sys_dictionary.do?sysparm_query=nameINjavascript:new PAUtils().getTableAncestors('${elm.referringTable}')^element=${elm.dictionary.name}">Dictionary</a> 
                        </div>
                        <div>
                          Fieldtype: ${elm.dictionary?.type } 
                        </div>
                      </div>
                    </details>`
                        let spn = document.createElement("span");
                        spn.style = 'display:none';
                        spn.className = 'snutn snuelm'
                        spn.innerHTML = `<span class='snuwrapper snuelm'>&nbsp;| ${tmplt} </span><span class='snuelement snuelm'>
                        <a class='snuelm' href='javascript:snuNextManager.labelClick("${frm.componentId}","${elm.name}")'>${elm.name}</a></span>`;
                        lbl.append(spn)
                        lbl.classList.add("snutnwrap");
                        namesAdded++;
                    }
                }
            })

            if (frm.nowRecordFormBlob.fieldElements.forEach(elm => {
                if (elm.choices) {
                    elm.choices.forEach(choice => {
                        if (!choice.snuOrigValue) { //firsttime
                            choice.snuOrigValue = "" + choice.displayValue;
                            choice.displayValue = "" + choice.displayValue + ' | ' + choice.value;
                        } else if (choice.displayValue == choice.snuOrigValue) { //toggle //doesnt work :(
                            choice.displayValue = "" + choice.displayValue + ' | ' + choice.value;
                        } else {
                            choice.displayValue = "" + choice.snuOrigValue;
                        }
                    });
                    let val = frm.nowRecordFormBlob.gForm.getValue(elm.name);
                    frm.nowRecordFormBlob.gForm.setValue(elm.name, val, 'refresh') //refresh dispalyvalue
                }
            }));

             
        })

        namesAdded += this.addTechnicalNamesLists();  

        //toogle visibility
        querySelectorShadowDom.querySelectorAllDeep('.snutn').forEach(cls => {
            cls.style.display = (namesAdded || cls.style.display) ? '' : 'none';
        });

        return (frms.length == 0);
    }

    addTechnicalNamesLists() {
        let namesAdded = 0;
        let lists = querySelectorShadowDom.querySelectorAllDeep("now-record-list-connected, now-record-list-connected-related");
        lists.forEach(list => {
            if (!querySelectorShadowDom.querySelectorAllDeep('.snulist', list).length) {
                querySelectorShadowDom.querySelectorAllDeep('th:not(.snuth)', list).forEach(th => {
                    let name = th.id.substring(0, th.id.lastIndexOf("_"));
                    let div = document.createElement("div");
                    div.className = 'snutn snuelm';
                    div.style = 'margin-left: 18px; font-weight: lighter; font-size: 9pt; margin-top: -10pt;'
                    div.innerText = name;
                    th.append(div);
                    th.classList.add('snuth','snunodblclk');
                    namesAdded++;
                })
            }
        })
        return namesAdded;
    }


    createLabelLink(elm){
        let linkBtn = '', linkAttrs;
        if (fieldType == 'reference' || fieldType == 'glide_list') {
            var reftable = g_form.getGlideUIElement(elm).reference;
            linkAttrs = {
                onclick: `snuOpenReference('${elm.referringTable}','${elm.dictionary.name}',event);`,
                title: 'Open reference table list (click) or record (ctrl+click): ' + elm.referringTable
            };
        }
        else if (fieldType == 'conditions') {
            linkAttrs = {
                onclick: "snuOpenConditions('" + elm + "');",
                title: 'Preview condition in list'
            };
        }
        else if (fieldType == 'table_name') {
            linkAttrs = {
                onclick: 'snuOpenTable(\'' + elm + '\');',
                title: 'Open table in list'
            };
        }
        else if (['translated_field'].includes(fieldType)) {
            linkAttrs = {
                onclick: 'snuViewTranslationsMeta(\'' + elm + '\');',
                title: `View translations of ${fieldType} field`
            };
            elm = '⚑ ' + elm;
        }
        else if (['translated_text','translated_html'].includes(fieldType)) {
            linkAttrs = {
                onclick: 'snuViewTranslations(\'' + elm + '\');',
                title: `View translations of ${fieldType} field`
            };
            elm = '⚑ ' + elm;
        }
        if (linkAttrs) {
            linkBtn = `<a class="snuelm" style="margin-left:2px;" onclick="${linkAttrs.onclick}" title="${linkAttrs.title}" target="_blank">${elm}</a>`;
        }
        else linkBtn = elm;

        return linkBtn;


    }

    labelClick(componentId,fieldName) {
        alert(`[SN Utils] You clicked label: ${fieldName} \nthis still needs to be implemented`)
        console.log(componentId);
        console.log(fieldName);
    }


    _snuShowUpdateFieldNext(eventPath) {

        if (eventPath[0].localName != 'span') return false; //labels are a span, stop if not a span

        let dict, form;
        for (let elm of eventPath) {
            if (elm.className?.includes('snuwrapper')) break; //not in a SN Utils added elemet
            if (elm['dictionary'] && !dict)
                dict = elm.dictionary
            else if (elm['nowRecordFormBlob'] && !form)
                form = elm.nowRecordFormBlob
            if (dict && form)
                break;
        }

        if (dict && form) {
            let val = form.gForm.getValue(dict.name);
            let newValue = prompt('[SN Utils]\nField Type: ' + dict.type + '\nField: ' + dict.name + '\nValue:', val);
            if (newValue !== null)
                form.gForm.setValue(dict.name, newValue);
            return true;
        }
        return false;
    }



    //find closest travel 'above' current webcomponent
    closestElement(
        selector, // selector like in .closest()
        base = this, // extra functionality to skip a parent
        __Closest = (el, found = el && el.closest(selector)) =>
        !el || el === document || el === window ?
        null // standard .closest() returns null for non-found selectors also
        :
        found ?
        found // found a selector INside this element
        :
        __Closest(el.getRootNode().host) // recursion!! break out to parent DOM
    ) {
        return __Closest(base);
    }
}
const snuNextManager = new SnuNextManager();


//from NPM package query-selector-shadow-dom to be able to select elememnt within components
var querySelectorShadowDom = function (e) {
    "use strict";

    function r(e, u, s, a) {
        void 0 === a && (a = null), e = function (e) {
            function t() {
                r && (0 < u.length && /^[~+>]$/.test(u[u.length - 1]) && u.push(" "), u.push(r))
            }
            var n, r, l, o, u = [],
                s = [0],
                a = 0,
                h = /(?:[^\\]|(?:^|[^\\])(?:\\\\)+)$/,
                i = /^\s+$/,
                c = [/\s+|\/\*|["'>~+[(]/g, /\s+|\/\*|["'[\]()]/g, /\s+|\/\*|["'[\]()]/g, null, /\*\//g];
            for (e = e.trim();;) {
                if (r = "", (l = c[s[s.length - 1]]).lastIndex = a, !(n = l.exec(e))) {
                    r = e.substr(a), t();
                    break
                }
                if ((o = a) < (a = l.lastIndex) - n[0].length && (r = e.substring(o, a - n[0].length)), s[s.length - 1] < 3) {
                    if (t(), "[" === n[0]) s.push(1);
                    else if ("(" === n[0]) s.push(2);
                    else if (/^["']$/.test(n[0])) s.push(3), c[3] = new RegExp(n[0], "g");
                    else if ("/*" === n[0]) s.push(4);
                    else if (/^[\])]$/.test(n[0]) && 0 < s.length) s.pop();
                    else if (/^(?:\s+|[~+>])$/.test(n[0]) && (0 < u.length && !i.test(u[u.length - 1]) && 0 === s[s.length - 1] && u.push(" "), 1 === s[s.length - 1] && 5 === u.length && "=" === u[2].charAt(u[2].length - 1) && (u[4] = " " + u[4]), i.test(n[0]))) continue;
                    u.push(n[0])
                } else u[u.length - 1] += r, h.test(u[u.length - 1]) && (4 === s[s.length - 1] && (u.length < 2 || i.test(u[u.length - 2]) ? u.pop() : u[u.length - 1] = " ", n[0] = ""), s.pop()), u[u.length - 1] += n[0]
            }
            return u.join("").trim()
        }(e);
        var t = s.querySelector(e);
        return document.head.createShadowRoot || document.head.attachShadow ? !u && t ? t : h(e, ",").reduce(function (e, t) {
            if (!u && e) return e;
            var g, d, p, n = h(t.replace(/^\s+/g, "").replace(/\s*([>+~]+)\s*/g, "$1"), " ").filter(function (e) {
                    return !!e
                }).map(function (e) {
                    return h(e, ">")
                }),
                r = n.length - 1,
                l = i(n[r][n[r].length - 1], s, a),
                o = (g = n, d = r, p = s, function (e) {
                    for (var t, n = d, r = e, l = !1; r && (t = r).nodeType !== Node.DOCUMENT_FRAGMENT_NODE && t.nodeType !== Node.DOCUMENT_NODE;) {
                        var o = !0;
                        if (1 === g[n].length) o = r.matches(g[n]);
                        else
                            for (var u = [].concat(g[n]).reverse(), s = r, a = u, h = Array.isArray(a), i = 0, a = h ? a : a[Symbol.iterator]();;) {
                                var c;
                                if (h) {
                                    if (i >= a.length) break;
                                    c = a[i++]
                                } else {
                                    if ((i = a.next()).done) break;
                                    c = i.value
                                }
                                var f = c;
                                if (!s || !s.matches(f)) {
                                    o = !1;
                                    break
                                }
                                s = v(s, p)
                            }
                        if (o && 0 === n) {
                            l = !0;
                            break
                        }
                        o && n--, r = v(r, p)
                    }
                    return l
                });
            return u ? e = e.concat(l.filter(o)) : (e = l.find(o)) || null
        }, u ? [] : null) : u ? s.querySelectorAll(e) : t
    }

    function h(e, n) {
        return e.match(/\\?.|^$/g).reduce(function (e, t) {
            return '"' !== t || e.sQuote ? "'" !== t || e.quote ? e.quote || e.sQuote || t !== n ? e.a[e.a.length - 1] += t : e.a.push("") : (e.sQuote ^= 1, e.a[e.a.length - 1] += t) : (e.quote ^= 1, e.a[e.a.length - 1] += t), e
        }, {
            a: [""]
        }).a
    }

    function v(e, t) {
        var n = e.parentNode;
        return n && n.host && 11 === n.nodeType ? n.host : n === t ? null : n
    }

    function i(t, e, n) {
        void 0 === t && (t = null), void 0 === n && (n = null);
        var l = [];
        if (n) l = n;
        else {
            var r = function e(t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    l.push(r), r.shadowRoot && e(r.shadowRoot.querySelectorAll("*"))
                }
            };
            e.shadowRoot && r(e.shadowRoot.querySelectorAll("*")), r(e.querySelectorAll("*"))
        }
        return t ? l.filter(function (e) {
            return e.matches(t)
        }) : l
    }
    return e.querySelectorAllDeep = function (e, t, n) {
        return void 0 === t && (t = document), void 0 === n && (n = null), r(e, !0, t, n)
    }, e.querySelectorDeep = function (e, t, n) {
        return void 0 === t && (t = document), void 0 === n && (n = null), r(e, !1, t, n)
    }, e.collectAllElementsDeep = i, e
}({});
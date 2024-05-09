
class SnuNextManager {
    "use strict";
    constructor() {
        document.addEventListener('dblclick', evt => {
            let eventPath = evt.path || (evt.composedPath && evt.composedPath());
            if (eventPath[0].tagName == "svg") return;
            if (['textarea', 'input', 'select'].includes(eventPath[0]?.localName)) return; //not in form elements
            if (eventPath[0]?.className?.includes('snunodblclk') || eventPath[1]?.className?.includes('snunodblclk')) return; //not in list header with classname
            if (!eventPath[0]?.className?.includes('snuelm'))
                if (!window?.snusettings?.nouielements) //disable the doubleclick when SN Utils UI elements off
                    if (!this._snuShowUpdateFieldNext(eventPath))
                        this.addTechnicalNames();

        });
        document.addEventListener('mouseup', evt => {
            let eventPath = evt.path || (evt.composedPath && evt.composedPath());
            try {
                if (eventPath[0].tagName == "svg") return;
                if (eventPath[0]?.className.includes('sn-polaris-tab')) { //save a click, select input
                    setTimeout(() => { tryFocus(0) }, 200);
                }
            } catch (ex) { };

            function tryFocus(num) { //wait till element exists
                var fltr = querySelectorShadowDom.querySelectorAllDeep(`.sn-polaris-nav input#filter`);
                if (fltr.length == 1) fltr[0].select(); //only when 1 match #328
                else if (fltr.length == 0 && num < 20) setTimeout(() => { tryFocus(++num) }, 200);
            }

        });

        document.addEventListener("NOW_UI_EVENT", (e)=> { 
            if(e?.detail?.action?.type == "CONCOURSE_PICKER#ITEM_SELECTED") { //watch for picker events, set a timestamp to localstorage
                localStorage.setItem("snuPickerUpdated", new Date().getTime());
                setTimeout(() => { this.addClassToPickerDivs() }, 2000);
            }
            else if (e?.detail?.action?.type == "KEYBOARD_SHORTCUTS_BEHAVIOR#MODAL_OPENED"){ //In Washington prevent showing Slashcommands when Shortcuts Popup wants to show.           
                setTimeout(() => {
                    let gridDiv = querySelectorShadowDom.querySelectorDeep('div.shortcut-container');
                    if (gridDiv && !gridDiv.querySelector('.snuified')) {
                        let key = navigator.userAgent.includes('Mac') ? 'ctrl' : 'alt';
                        let shrtcutDiv = document.createElement('div');
                        shrtcutDiv.className = 'shortcut snuified';
                        shrtcutDiv.innerHTML =`
                            <span>
                             <span class="label">[SN Utils] Slash commands popup</span>
                             <span class="hint">Open the SN Utils Slash commands popup</span>
                            </span>
                            <span>
                             <div>
                              <span class="shortcut-btn small">${key}</span><span class="small">+</span><span class="shortcut-btn small">/</span>
                             </div>
                            </span>`
                        gridDiv.appendChild(shrtcutDiv);
                    }             
                }, 200);
                snuSlashCommandHide();                
            }
        });
        
        window.addEventListener('storage', function(e) {  //watch for localstorage changes, if it's our timestamp, update pickers
            if (e.key === "snuPickerUpdated") {
                snuNextManager.updateNextPickers();
            }
        });

        //specfic for UI builder, enable save button on mouseenter, as it sometimes doesnt get enabled after a propertie change
        setTimeout(() => {
            querySelectorShadowDom = window.querySelectorShadowDom;
            let elm = querySelectorShadowDom.querySelectorDeep('.sn-ui-builder-comps-page-header--save');
            if (elm) {
                elm.addEventListener('mouseenter', evt => {
                    elm.disabled = false;
                })
            }
        }, 2500);
    }

    async addTechnicalNames() {
        this.snuAddFilterToTrees(); //add filter to now-content-tree components

        let namesAdded = 0;
        let frms = querySelectorShadowDom.querySelectorAllDeep('sn-form-data-connected');
        frms.forEach(frm => {
            if (!querySelectorShadowDom.querySelectorAllDeep('.snufrm', frm).length) { //only add once
                let uiab = querySelectorShadowDom.querySelectorAllDeep('.uiaction-bar-wrapper', frm);
                let div = document.createElement("div");
                let view = querySelectorShadowDom.querySelectorDeep('now-record-form-section-column-layout', frm)?.view || frm.view;
                div.className = 'snutn snufrm snunodblclk';
                div.style = 'margin-left: 4px; font-size:9pt; text-decration:none';
                div.innerHTML = `<a title='SN Utils - Open view in platform' href='/${frm?.table}.do?sys_id=${frm?.nowRecordFormBlob?.sysId}&sysparm_view=${view}' target='_blank'>${frm?.table} - ${view}</a>
                <a id='snureload' title='SN Utils - Reload this form' href='#' >⟳</a>
                <a id='snuconsole' title='SN Utils - Show object data in console' href='#' >↷</a>`;
                frm.insertBefore(div, frm.firstChild);
                frm.querySelector('#snureload').addEventListener('click', e => {
                    e.preventDefault();
                    frm.nowRecordFormBlob.gForm.reload();
                })
                frm.querySelector('#snuconsole').addEventListener('click', e => {
                    e.preventDefault();
                    console.log('SN Utils: sn-form-data-connected');
                    console.dir(frm);
                    console.log('SN Utils: sn-form-data-connected.nowRecordFormBlob');
                    console.dir(frm.nowRecordFormBlob);
                    console.log('SN Utils: sn-form-data-connected.nowRecordFormBlob.gForm, available as g_form');
                    window.g_form = frm.nowRecordFormBlob.gForm;
                    console.dir(g_form);
                })
            }

            if (frm?.nowRecordFormBlob?.fieldElements.forEach(elm => {
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

        //there is async loading with document fragments going on
        // looping over the fieldElements seem to render this, but we need to wait a bit before we can access
        // the dictionary property of the elements
        await this.wait(200); 

        // with the usage of slots, cannot iterate over the frms anymore
        let elms = querySelectorShadowDom.querySelectorAllDeep(`sn-record-choice-connected,sn-record-currency-connected,sn-record-email,
        sn-record-input-connected,sn-record-phone-connected,sn-record-reference-connected,sn-record-url,sn-record-annotation,
        sn-record-choice-search,sn-record-choice-search-dropdown,now-record-date-picker,
        sn-record-dropdown-internal,sn-record-duration,sn-record-input,sn-record-input-group,sn-record-link,sn-record-pill,
        now-record-typeahead-multiple,sn-record-time`);

        elms.forEach(elm => {
            let lbl = querySelectorShadowDom.querySelectorDeep('span.will-truncate:not(.snutnwrap)', elm);
            if (lbl && elm?.fieldType) {
                let tmplt =
                `   <style> @import "${snusettings.extensionUrl}css/inject.css"; </style>
                    <details class="snupopover snuelm">
                        <summary>⚙ </summary>
                        <div>
                            <div>
                            [SN Utils] Field Info: <br />
                                <a class='snuelm' target='dictionary' href="/sys_dictionary.do?sysparm_query=nameINjavascript:new PAUtils().getTableAncestors('${elm.referringTable}')^element=${elm.dictionary.name}">Dictionary</a> 
                            </div>
                            <div>
                                Fieldtype: ${elm.fieldType} 
                            </div>
                        </div>
                    </details>
                `
                let spn = document.createElement("span");
                spn.style = 'display:none';
                spn.className = 'snutn snuelm'
                spn.innerHTML = `<span class='snuwrapper snuelm'>&nbsp;| ${tmplt} </span><span class='snuelement snuelm'>
                <a class='snuelm' href='javascript:snuNextManager.labelClick("","${elm.name}")'>${elm.name}</a></span>`;
                lbl.insertAdjacentElement('afterend', spn); 
                spn.querySelector('details').addEventListener('toggle', ev => this.toggleDetails(ev) );
                lbl.style.display = 'inline';
                lbl.classList.add("snutnwrap");
                namesAdded++;
            } 
        });

        namesAdded += this.addTechnicalNamesLists();
        namesAdded += this.playbookContextRemoveHelper();

        //toggle visibility
        querySelectorShadowDom.querySelectorAllDeep('.snutn').forEach(cls => {
            cls.style.display = (namesAdded || cls.style.display) ? '' : 'none';                
        });

        return (frms.length == 0);
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
      
    toggleDetails(event) {
        const popoverContent = event.target.querySelector('summary + *');
        setTimeout(() => { // Delay to allow the browser to render changes
            const rect = popoverContent.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                popoverContent.style.right = 'auto';
                popoverContent.style.left = '100';
            }
            if (rect.left < 0) {
                popoverContent.style.left = 'auto';
                popoverContent.style.right = '0';
            }
        }, 1);
    }

    addTechnicalNamesLists() {
        let namesAdded = 0;
        let lists = querySelectorShadowDom.querySelectorAllDeep("now-record-list-connected, now-record-list-connected-related, now-record-list-connected-snapshot");
        lists.forEach(list => {
            if (!querySelectorShadowDom.querySelectorAllDeep('.snulist', list).length) {
                //add column names below label
                querySelectorShadowDom.querySelectorAllDeep('th:not(.snuth)', list).forEach(th => {
                    let name = th.id.substring(0, th.id.lastIndexOf("_"));
                    let div = document.createElement("div");
                    div.className = 'snutn snuelm';
                    div.style = 'margin-left: 18px; font-weight: lighter; font-size: 9pt; margin-top: -10pt;'
                    div.innerText = name;
                    th.append(div);
                    th.classList.add('snuth', 'snunodblclk');
                    namesAdded++;
                })


                //add tablename and clickable encodeqquery above list
                let lst = querySelectorShadowDom.querySelectorDeep('div.sn-list-grid-container:not(.snutable)', list);
                if (lst) {
                    
                    let div = document.createElement("div");
                    div.classList.add('snutn','snuactiondiv');
                    div.title = '[SN Utils] Utility functions added via SN Utils';
                    div.style = 'margin-left: 10px; padding:5px; width: max-content; gap: 5px; align-items: center;';
                    
                    
                    let diveq = document.createElement("div");
                    diveq.style = 'margin-right: 5px; display:inline';
                    let btneq = document.createElement("now-button");
                    btneq.icon = 'filter-outline';
                    btneq.variant = 'secondary';
                    btneq.size= 'sm';
                    btneq.title = '[SN Utils]] Click to view/edit encodedquery';
                    btneq.addEventListener('click', () => {
                        let newValue = prompt(`[SN Utils]\nEncodedquery\nTable: ${list.table}\nFixedquery: ${list.fixedQuery}\nComplete encodedquery`, (list.fixedQuery + (list.fixedQuery) ? '^' : '' +  list.query).replace('^^','^'));
                        if (newValue !== null)
                            list.query = newValue.replace(list.fixedQuery, "");
                        return true;
                    })
                    diveq.appendChild(btneq);
                    div.appendChild(diveq);

                    let divol = document.createElement("div");
                    divol.style = 'margin-right: 5px; display:inline';
                    let btnol = document.createElement("now-button");
                    btnol.icon = 'score-list-outline';
                    btnol.variant = 'secondary';
                    btnol.size= 'sm';
                    btnol.title = '[SN Utils]] Click to open in classic list';
                    btnol.style = 'padding-right: 5px; margin-left: 5px;';
                    btnol.addEventListener('click', () => {
                       window.open((`/${list.table}_list.do?sysparm_query=${list.fixedQuery + (list.fixedQuery) ? '^' : '' + list.query}&sysparm_view=${list.view}`).replace('^^','^'));
                    })
                    divol.appendChild(btnol);
                    div.appendChild(divol);
                    
                    let spn = document.createElement("span");
                    spn.innerText = list.table;
                    spn.title = '[SN Utils] Source table of list';
                    spn.style = 'margin-left: 5px;';
                    spn.classList.add('snunodblclk');
                    div.appendChild(spn);
                    
                    let parentElm = lst.parentNode;
                    parentElm.insertBefore(div, lst);
                    lst.classList.add('snutable', 'snunodblclk');

                }

            }
        })
        return namesAdded;
    }
    
    updateNextPickers() {
        setTimeout(() => {
            let snuHeader = querySelectorShadowDom.querySelectorDeep("sn-polaris-header");
            if (snuHeader)
                snuHeader.dispatch('CONCOURSE_FETCHER#CURRENT_DATA_REQUESTED', { "options": {} });
            setTimeout(() => { this.addClassToPickerDivs() }, 2500);
        }, 1500);
    }
    

    playbookContextRemoveHelper(){

        if (!snusettings?.applybgseditor) return 0; //only when bg scripts use monaco editor


        let namesAdded = 0;

        let playbooks  = querySelectorShadowDom.querySelectorAllDeep('now-collapse-trigger.playbook-heading');

        playbooks.forEach(pb =>{
            let h2 = querySelectorShadowDom.querySelectorDeep('h2:not(.snuified)',pb);
            
            if (h2) {
                let contextSsysId = pb.appendToPayload.playbookContextId
                let prnt = this.closestElement('now-playbook-experience-connected',h2);
                var template = `// SN Utils helper script to delete playbook contexts (Execute in global scope)
// DO NOT use in prodoction, only for test / development.
var grSPC = new GlideRecord('sys_pd_context');
grSPC.addQuery("sys_id","${contextSsysId}")
// // Uncomment line below to delete all contexts for this playbook
// .addOrCondition("process_definition", "${prnt?.playbookExperienceId}") // ${h2?.innerText}
// // Uncomment line below to delete all contexts from this record
// .addOrCondition("input_record", "${prnt?.parentSysId}"); 
// // Comment or change below to remove 25 context records linit
grSPC.setLimit("25");
grSPC.orderByDesc("sys_created_on");
grSPC.query();
grSPC.deleteMultiple();`;

                h2.classList.add('snuified');

                let lnk = document.createElement('a');
                lnk.innerText = ' ❌';
                lnk.style.fontSize = '9pt';
                lnk.style.textDecoration = 'none';
                lnk.title = '[SN Utils] Prefill backgroundscript to delete sys_pd_context record';
                lnk.href = '/sys.scripts.do?content=' + encodeURIComponent(template);
                lnk.target = '_blank';
                lnk.className = 'snutn';
                h2.append(lnk);

                namesAdded++;
            }

    })



        return namesAdded;

    }

    createLabelLink(elm) {
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
        else if (['translated_text', 'translated_html'].includes(fieldType)) {
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

    labelClick(componentId, fieldName) {
        alert(`[SN Utils] You clicked label: ${fieldName} \nthis still needs to be implemented`)
        console.log(componentId);
        console.log(fieldName);
    }


    _snuShowUpdateFieldNext(eventPath) {

        if (eventPath[0].localName != 'span') return false; //labels are a span, stop if not a span

        let dict, form;
        let isgrid = false;
        for (let elm of eventPath) {
            if (elm.localName == 'now-grid') isgrid = true; //not when in a grid (aka list)
            if (elm.className?.includes('snuwrapper')) break; //not in a SN Utils added elemet
            if (elm['dictionary'] && !dict)
                dict = elm.dictionary
            else if (elm['nowRecordFormBlob'] && !form)
                form = elm.nowRecordFormBlob
            if (dict && form)
                break;
        }

        if (isgrid) return true; //not when in a grid (aka list) #463

        if (dict && form) {

            let roles = form?.currentUser?.user?.roles || [];
            
            let val = form.gForm.getValue(dict.name);

            if (roles.includes('admin')){
                let newValue = prompt('[SN Utils]\nField Type: ' + dict.type + '\nField: ' + dict.name + '\nValue:', val);
                if (newValue !== null)
                    form.gForm.setValue(dict.name, newValue);
                return true;
            }
            else {
                alert('[SN Utils]\nField Type: ' + dict.type + '\nField: ' + dict.name + '\nValue:' + val);
                return true;
            }


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

    linkPickers(cnt) {
        var tooltip = querySelectorShadowDom.querySelectorDeep('#concourse-pickers-tooltip div');
        var searchContainer = querySelectorShadowDom.querySelectorDeep('.sn-global-typeahead-control-container, div.search-combobox--header')
        var searchInput = querySelectorShadowDom.querySelectorDeep('input.sn-global-typeahead-input, input.input-container__input');

        if (!(!!tooltip * !!searchContainer * !!searchInput)) { //if not all exist, try again afte3 500ms
            if (cnt < 30)
                setTimeout(() => { this.linkPickers(++cnt) }, 600);
            return;
        }
        var searchContainerParent = querySelectorShadowDom.querySelectorDeep('.search-container');
        if (searchContainerParent) searchContainerParent.style.alignItems = 'center';

        var snuStyle = document.createElement('style');
        snuStyle.innerHTML = `
        div.snupicker {
            max-width:350px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
        }
        div.snupicker:hover {
            background-color: RGB(var(--now-unified-nav_nav-menu-trigger--background-color--hover,83, 82, 106));
        }

        div.snudefault, div.snudefault:hover {
            background-color: red;
            color: yellow;
        }
        `;

        searchInput.addEventListener('focus', (event) => {
            querySelectorShadowDom.querySelectorDeep('.sn-global-typeahead-control-container, .search-combobox--header').style.width = '';
            querySelectorShadowDom.querySelectorDeep('#snuSpacer').style.display = 'none';
        }, true);
        searchInput.addEventListener('blur', (event) => {
            if (searchInput.value == '') {
                setTimeout(() => {
                    querySelectorShadowDom.querySelectorDeep('.sn-global-typeahead-control-container, .search-combobox--header').style.width = '32px';
                    querySelectorShadowDom.querySelectorDeep('#snuSpacer').style.display = 'inline';
                }, 100);
            }
        }, true);
        var snuSpacer = document.createElement('div');
        snuSpacer.id = 'snuSpacer'
        snuSpacer.title = '[SN Utils] Hold CTRL for Slashcommand switcher'
        snuSpacer.appendChild(snuStyle);
        snuSpacer.appendChild(tooltip) //move the tooltip to the headerbar
        snuSpacer.style.whiteSpace = 'nowrap';
        snuSpacer.style.overflow = 'hidden';
        snuSpacer.style.textOverflow = 'ellipsis';
        snuSpacer.style.color = 'RGB(var(--now-unified-nav_utility-menu-trigger--color, 255,255,255))';
        snuSpacer.style.margin = '0 0 0 7px'


        snuInsertAfter(snuSpacer,
            querySelectorShadowDom.querySelectorDeep('div.polaris-search'));

        

        setTimeout(() => { this.addClassToPickerDivs(snuSpacer) }, 4000);

        snuSpacer.addEventListener('mouseover', () => {
            this.addClassToPickerDivs();
        })

        var wrpr = querySelectorShadowDom.querySelectorDeep('sn-search-input-wrapper');
        if (wrpr) wrpr.windowSize = 'collapsed'; //show icon instead of small input


        //domain picker can be loaded later, determine the clicked div at runtime
        snuSpacer.addEventListener('click', evt => {
            let eventPath = evt.path || (evt.composedPath && evt.composedPath());
            var idx = Number(eventPath[0]?.dataset?.index) || 1; //determine number of clicked element

            evt.preventDefault();
            evt.stopPropagation();
            this.showPicker(idx, evt, eventPath[0]);

        });

    }

    addClassToPickerDivs(snuSpacer) {

        let defUpd = querySelectorShadowDom.querySelectorDeep('.snudefault');
        if (defUpd) defUpd.classList.remove('snudefault')

        snuSpacer = snuSpacer || querySelectorShadowDom.querySelectorDeep('#snuSpacer');
        let pickerDivs = snuSpacer.querySelector('div').querySelectorAll('div');
        pickerDivs.forEach((div, idx) => {
            div.className = 'snupicker';
            div.dataset.index = ++idx;

            if (window?.snusettings?.highlightdefaultupdateset && div.innerText.includes('Default [')){
                div.className = 'snupicker snudefault';
                div.title = '[SN Utils] You may be working in the default Update set! (Disable this warning in settings)'
            }
        });

        const element = querySelectorShadowDom.querySelectorDeep('div.header-avatar-button'); 
        if (element) { //if avatar is outside viewport, make the pickerdivs smaller
            const rect = element.getBoundingClientRect();
            const overflowRight = rect.right - (window.innerWidth || document.documentElement.clientWidth);
            if (overflowRight > -12) {
                snuSpacer.style.maxWidth = (snuSpacer.offsetWidth - overflowRight - 12) + 'px';
            }
        }

        
    }

    showPicker(pickerindex, evt, elm) {
        try {
            if (evt.ctrlKey || evt.metaKey) {
                var txt = elm.innerText.toLowerCase();
                if (txt.startsWith('domain')) snuSlashCommandShow('/sd ', true);
                else if (txt.startsWith('application')) snuSlashCommandShow('/sa ', true);
                else if (txt.startsWith('update')) snuSlashCommandShow('/su ', true);
                return;
            }

            var back = querySelectorShadowDom.querySelectorDeep('div.concourse-pickers-body span.go-back-button');
            if (back) back.click();
            else querySelectorShadowDom.querySelectorDeep('span.contextual-zone-button.concourse-pickers').click();
            clickPicker(0, pickerindex)

        } catch (ex) { };

        function clickPicker(num, pickerindex) {
            let lbls = querySelectorShadowDom.querySelectorAllDeep('sn-drilldown-list span.label');
            let lbl; //make clicked label independent of available pickers but based on index #260
            if (lbls.length >= pickerindex) lbl = querySelectorShadowDom.querySelectorAllDeep('sn-drilldown-list span.label')[pickerindex - 1];
            if (lbl) {
                lbl.click();
                tryOpenList(0);
            }
            else if (num < 20) {
                setTimeout(() => {
                    clickPicker(++num, pickerindex);
                }, 200);
            }
        }

        function tryOpenList(num) { //try till element exists, max 20x
            var fltr = querySelectorShadowDom.querySelectorDeep('div.concourse-pickers-body input#filter');
            if (fltr) {
                fltr.classList.add('has-focus');
                fltr.focus();
            }
            else if (num < 20) {
                setTimeout(() => {
                    tryOpenList(++num);
                }, 200)
            }
        }
    }

    snuFilterTree(tree, search) {
        if (!tree.hasOwnProperty('original_items_' + tree.componentName))
            tree['original_items_' + tree.componentName] = structuredClone(tree.items);

        let newItems = tree['original_items_' + tree.componentName];

        function copy(o) {
            return Object.assign({}, o)
        }

        search.split(" ").forEach(wrd => {
            newItems = newItems.map(copy).filter(function f(o) {
                if (o.displayValue.toLowerCase().includes(wrd)) return true

                if (o.children) {
                    return (o.children = o.children.map(copy).filter(f)).length
                }
            })
        });

        tree.items = newItems;
        tree.searchTerm = search;
    }

    snuAddFilterToTrees() {
        let trees = querySelectorShadowDom.querySelectorAllDeep('now-content-tree:not(.snuified)')
        trees.forEach(tree => {
            if (tree?.items[0]?.displayValue) {

                let inp = document.createElement("input");
                inp.type = "search";
                inp.placeholder = "[SN Utils] filter";
                inp.spellcheck = false;
                inp.classList.add('snutn', 'search-combobox');
                inp.style.border = 'var(--now-form-control--border-width,1px) solid RGB(var(--now-color_divider--tertiary,var(--now-color--neutral-3,209,214,214)))';
                inp.style.borderRadius = '3px';
                inp.style.outline = 'none';
                inp.style.padding = '3px';
                inp.style.width = '100%';
                inp.style.backgroundColor = 'hsla(0, 0%, 0%, 0)';
                inp.style.color = 'RGB(var(--now-form-field--color,var(--now-color_text--primary,var(--now-color--neutral-18,22,27,28))))';
                inp.addEventListener('keyup', () => this.snuFilterTree(tree, inp.value));
                let parentElm = tree.parentNode;
                parentElm.insertBefore(inp, tree);
                tree.classList.add("snuified");
            }
        })

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
            for (e = e.trim(); ;) {
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
                            for (var u = [].concat(g[n]).reverse(), s = r, a = u, h = Array.isArray(a), i = 0, a = h ? a : a[Symbol.iterator](); ;) {
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
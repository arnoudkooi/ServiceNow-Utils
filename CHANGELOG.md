# CHANGELOG.md

## 7.1.4.4 (2023-10-03)
Fixes / changes:
 - Prevent showing the Monaco editor context menu, when there is a ServiceNow context menu available
 - Fix keyboardshortcut for Monaco function: Toggle Monaco context Menu (ALT-SHIFT-M)
 - Fix keyboardshortcut for Monaco function: Toggle Word wrap (ALT-SHIFT-W)

## 7.1.4.1 (2023-09-25 FF OnPrem only)
Fixes / changes:
 - Modify the publish.sh build script (Issue #437)

## 7.1.4.0 (2023-09-23)
Fixes / changes:
 - Support javascript: in Next Experience slash commands
 - Try to deduplicate tsWorker.js so it can be embedded in FireFox version (Issue #437 and Issue #3915 in Mozilla Add-ons linter and Monaco Editor Issue #4184)
 - CSS adjustmenst slash command window (dark mode)
 - Setting the default for show pickers in Next UI to true (Requested by Jorn)
 - Remove commented function snuFetch from inject.js
 - Upgrade Monaco editor to 43.0
 - Upgrade jQuery to 3.7.1
 - Upgrade Bootstrap to 5.3.2
 - Upgrade DOMPurify to 3.0.5

## 7.1.3.6 (2023-09-15)
Fixes / changes:
 - Add optional chaning to a technical names function
 - Disable adding links to lists from last update when first column. (already a reference link in this case) (Issue #435)

## 7.1.3.4 (2023-09-07)
Fixes / changes:
 - Expand the fucntion to add link to syslog table to sys_update_xml name field
 - Renamed function snuAddErrorLogScriptLinks to snuAddListLinks for this reason
 - Updated links that open XML in monaco editor so it shows XML attributes like displayvalue

## 7.1.3.3 (2023-09-06)
Fixes / changes:
 - Rewrite multiple function in scriptsync.js to use fetch instead of XMLHttpRequest
 - Refactor some code in inject.js 
 - Diff viewer (/diff1 /diff2) now show display values in the XML
- Show navigator items in slash commands when < 3 slash commands

## 7.1.3.0 (2023-09-04)
Fixes / changes:
 - Embed /bgc script inside if statement for the .get function
 - Add a link to the workflow editor from a workflow context
 - Improve dispatching slashcommand in Next Experience (adding context to payload)
 - Prevent showing duplicates in /sa (Switch Application) slash command
 - Rewrite multiple function in inject.js to use fetch instead of XMLHttpRequest
 - Remove no longer used snuGetNav and snuShowSlashCommand functions
 - Rename snuLoadXMLDoc function to snuFetchData in inject.js
 - Removing some console.log statements in inject.js
 - Update Utah slash commands to Vancouver
 - Add link to linkedin post in popup info page


## 7.1.2.0 (2023-08-22)
Features:
 - Add swapbutton and improvements to diff editor (Issue #429 / PR #430 PromoFaux)
Fixes / changes:
 - Improve finding variable names for /tn function in formatter on forms


## 7.1.1.3 (2023-08-15)
Fixes / changes:
 - Remove scriptsync name clean regex (scriptsync issue #87)

## 7.1.1.2 (2023-08-14)
Fixes / changes:
 - Resolve reports for tablename and sysid on sys_report_template.do (enables View Data and for example /list command)
 - Add the link: [SN Utils] Switch to SCOPENAME application click here to cases without sys_scope on the form, when on a page in different scope.

## 7.1.1.0 (2023-08-11)
Features:
 - Add in a context menu item to swap panes in the code diff viewer (PR #425)
Fixes / changes:
 - Remove beta warning from scriptsync actions sync
 - Adding scope sysid to payload on scriptsync of Action scripts
 - Change the /debug slash command to a scripted command, so it works more consitent.


## 7.1.0.0 (2023-08-02)
Features:
 - Clicking the pillar | on a form field when Technical Names is active, will open the dictionary in advanced view. A hover over the pillar shows a ! to give users a clue. Does not work for non admin and dotwalked fields. Besides it does not work when CMD or CTRL is pressed. (This still builds a filter)
Fixes / changes:
 - Changes VS Code button color to --now-button--bare_primary--color
 

## 7.0.9.0 (2023-08-02)
Fixes / changes:
 - Change collection link on sys_db_object record link to always open advanced view
 - Allow slash command that have a encodedquery as argument to work with additional switches
 - Add a symbol to switch text to give an indication what it does:  
    - ∀ add a filter condition
    - ↧ Add list sorting 
    - ↝ Add a sysparm
    - ➚ Open page in new tab
 - Fix for showing setVisible(false) fields with the /uh command #422 

## 7.0.8.6 (2023-08-01)
Fixes / changes:
 - sn-scriptsync and Monaco icons now show on new records, and show a message when clicked.
 - Fix for direct calling a slash command switch that opens a link, such as /-ra to open the REST Api explorer from a record.

## 7.0.8.4 (2023-07-29)
Fixes / changes:
 - Fix for display value in View Data (Issue: #421)

## 7.0.8.3 (2023-07-28)
Remark: For Chrome this version is published as 7.0.8.1
Fixes / changes:
 - Escape display value in View Data (Issue: #421)
 - Added function to scriptsync page to set banner message from sn-scriptsync

## 7.0.8.1 (2023-07-26 Firefox only)
Fixes / changes:
 - Workaround for issue #420 releated to Firefox containers compatability
 - Added wildcard in scriptsync condition

## 7.0.8.0 (2023-07-19)
Fixes / changes:
 - Upgrade Monaco editor to version 0.40.0
 - Remove List v3 support
 - Enabled bracketPairColorization in BG Script and SN Utils codeeditor
 - Disabled minimap in BG Script
 - Mark not started BG script with title: ⚪ BG script not started

## 7.0.7.0 (2023-07-18)
Fixes / changes:
 - Add link to switch to scope of current record (Discussion #416)
 - Additional fix for opening links from popup in correct Firefox container.

## 7.0.6.0 (2023-07-18)
Fixes / changes:
 - Changing snuFetch in popup.js to fix support for Firefox containers, this is routed via the content page (Issue #415)
 (Work in Progress)
 - Applying css variable to picker hover state
 - Heads up message on sriptsync page regarding upcoming changes

## 7.0.5.0 (2023-06-22)
Features:
  - Adding context menu items: Open in BG Script, Code Search and Google search to the Monaco editor context menu.
Fixes / changes:
 - Fix genertaing GlideRecord template for tables ending with _list (Issue #407)
 - Better escaping in GlideRecord template generation (Issue #409)

## 7.0.4.0 (2023-06-21)
Fixes / changes:
 - Improved switching of app / updateset, clearing relevant cache, to show the new value after pge reload

## 7.0.3.1 (2023-06-16) Firefox only
Fixes / changes:
 - Replace InstallTrigger check to useragent check to detect Firefox #406

## 7.0.3.0 (2023-06-12)
Fixes / changes:
 - Automate clearing local cache for tables in the popup when data expired  via fucntion clearInvalidatedLocalStorageCache()
 - Added xmlstats.do to manifest for Firefox so that it renders correct. (Discussion #403)
 - Assign global g_form when dump variables is clicked in workspace
 - Changes to nodeswitching, detecting ADCv2 load balancing (will try to find a way to support node switching in this case)

## 7.0.2.0 (2023-05-26)
Features:
  - Monaco editor gets the setting Wordwrap true and contextmenu true applied on page load. Settings can be configured via a JSON string in the settings tab for Monaco editor.
  - Added shortcuts to monaco editor to toggle wordwrap (ALT-SHIFT-W) and contextmenu (ALT-SHIFT-M)

Fixes / changes:
 - Fix slash commands not working when no tablename or syId can be resolved.
 - Added grey border around Slash command popup in dark mode.


## 7.0.0.3 (2023-05-12)
Fixes / changes:
 - Updated tokyo slash commands (/docs and /dev) to utah
 - Fixed / added links in info tab of popup
 - Fixed slash comand problem where javascript: commands did not work when not outside iframe (These may not work in Firefox anyway) (Issue: #395)

 
## 7.0.0.0 (2023-05-06)
Fixes / changes:
 - 🎉 7 year annniversary => version bump to 7.0.0.0
 - Fix where the cancel transaction on BG script page did not work.
 - Show text and value as title for List selector options, after /tn is activated, so that whole text can be viewed when text is wider then the select
 - List selectors (slushbucket) search function is now case insensitive
 - Optimized List selectors (slushbucket) search function (Details: https://youtu.be/x39p9fR2hM4)
 - Updates to PRIVACY.md
 - Added LinkedIn post links and link to edge on info page of popup
 - Update the DoubleClick to pin function for next experience menus

## 6.4.1.1 (2023-04-18 published for Safari only)
Features:
  - Update purify.min.js to 3.0.2 and removed redundant copy in root folder

## 6.4.1.0 (2023-04-13)
Features:
  - Viewdata, new page with record info similar to the viedata tab in the popup, can be opened via slashcommand /vd

Fixes / changes:
 - Renamed Slash command related functions ie snuShowSlashCommand to snuSlashCommandShow
 - Extended function snuResolveVariables to return object instead of string

## 6.4.0.8 (2023-04-13)
Fixes / changes:
 - Restore label click function / technical names (Issue: #388)

## 6.4.0.7 (2023-04-11)
Fixes / changes:
 - Bugfix technical names (Issue: #385)


## 6.4.0.5 (2023-04-10)
Fixes / changes:
  - Code cleanup, improvements and typo fixes following CodeQL findings
  - Added PRIVACY.md and CONTRIBUTING.md
  - scriptsync and monaco button in forms now use a next experience css variable (to better support dark theme)
  - Node switching regex update BIGipServerpool cookie regex update
  - Node switching show alert if nodeswitching not supported


## 6.4.0.0 (2023-04-07)
Features:
  - sn-scriptsync can save files when instances has a diffrent scope selected, requires sn-scriptsync >= 2.7.0

Fixes / changes:
  - Prevent Technical Names toggle on doubleclick inside Monaco editor
  - Replaced switch -l with slash command /list (Issue #377)
  - Node switch adjustments for on prem instances 
  - Set sys_property length limit to 100 + typo fixes (Issue #380 / PR #381)
  - Rearranged /moved code to add inject_parent.js, inside the cookiecheck
  - Updated Purify js from 2.4.0 to 3.0.1

## 6.3.9.0 (2023-03-27)
Features:
- Added ability to generate delete script for sys_pd_context records, from within playbooks, linked to the Technical Names function.
- Added approval step in sn-scriptsync helper tab. First time a instance is used, approval is now required.

Fixes / changes:
  - Fix quoute encodening /bgc /bgl command (PR #373)
  - Double click to enable technical namers disabled when Don't Show UI elements is checked
  - Call for reviews on about tab
  - Link to /tn deepdive on Linkedin in popup, replaces cheatsheet link.
  - Upgrade bootstrap from 4.6.0 to 5.2.3 and made needed adjustments to poput.html and others
  - Upgrade datatables from 1.10.20 to 1.13.4
  - Upgrade jQuery from 3.6.0 to 3.6.4
  - Renamed occurences of SN ScriptSync to sn-scriptsync

## 6.3.7.7 (2023-03-11)
Fixes / changes:
  - Change /plug command to use the Plugins UI Page
  - Fixed typo in inject.js syparm_refkey to sysparm_refkey to support non sys_id ref button doubleclicks
  - Hide review request on scriptsync page
  - Update for the checkisservicenowinstance Safari check.
  - Added .do to the Mobile Studio links
  - Remove outdated comment
  - Added /bgl to generate scipt template (Earlier annouced but was missing)
  - Excluded true/false fields from scriptsync buttons.

## 6.3.7.0 (2023-03-06)
Fixes / changes:
  - Add message to the who the heck edited button (wthetb), in case it is a new record.
  - include name in the /u command fields
  - Add slash command links for created / updated / version to the "wthetb"
  - Removed the setting "Prevent loss of work when scope is switched from another tab" as it could cause issues

## 6.3.6.6 (2023-03-01)
Fixes / changes:
  - Bugfix diffviewer #370

## 6.3.6.5 (2023-02-28)
Fixes / changes:
  - Monaco editor better parsing of RGB values with spaces in JSON CSS
  - Monaco diff editor: In case of uncomitted update show current version in left pane (Issue #370)
  - Prevent double Technical Names on variables in portal
  - Added link to sys_script_execution_history on BG script

## 6.3.6.2 (2023-02-18)
Fixes / changes:
  - Removed function / setting "Allow saving metadata after scope has changed"

## 6.3.6.1 (2023-02-15 Safari only)
Features:
- Bypass cookie instance check in Safari (not supported)

## 6.3.6.0 (2023-02-14)
Features:
- Added easier way to add sys_id field to customized list (Discussion: #364)

## 6.3.5.9 (2023-02-13)
Fixes / changes:
 - Minimumlength /diffenv decreased (Issue #363)
 - Showfields fucntion now works better with base tables.

## 6.3.5.8 (2023-02-11)
Fixes / changes:
  - CTRL-click on dashboard to open source report now only listens to header click (Discussion #350)
  - Clarified the message  on classic responsive dashboards when ctrl-click does not work 
  - Improved /diff1 / diff2 handling (Issue #359)

## 6.3.5.5 (2023-02-06)
Fixes / changes:
  - Bugfix slashcommand not working slash commands

## 6.3.5.4 (2023-02-03)
Fixes / changes:
  - Improved resolving of variables for slashcommands inside Next Experience or classic UI
  - Add resolving of $encodedquery slashcommand variable in form view

## 6.3.5.2 (2023-02-02)
Features:
  - Added Missing reference, or no display value check in classic UI Reference fields
Fixes / changes:
  - Message: [Deleted reference or empty display value] in view data when displayvalue empty (Issue #353, PR #354)

  Fixes / changes:
  - Review message on scripsync page
  - Basic Form label click to list query support for currency fields

## 6.3.4.8 (2023-01-25, Edge only)
Fixes / changes:
  - Prevent autocomplete popup for slash commands (Issue #352)

## 6.3.4.7 (2023-01-17, Safari only)

Fixes / changes:
  - Temporary fix for Safari, that disabled the cookie check added in 6.3.3.0

## 6.3.4.6 (2023-01-14)
Fixes / changes:
  - Adding table name and sysid to new form infomessage
  - New variable for slashcommands that resolves in classic lists: $encodedquery
  - Usage of new $encodedquery variable in sample slashcommand /bgl

## 6.3.4.3 (2023-01-13)
Fixes / changes:
  - Improvements to the new info addmessage

## 6.3.4.0 (2023-01-12)
Features:
  - Added info button in classic form header that shows updated / created info in a addinfomessage, as well as basic shortcut info.

Fixes / changes:
  - Removed paste (screenshot) button in classic form
  - Renamed setShortCuts to snuSetShortCuts in inject.js

## 6.3.3.0 (2023-01-11)
Fixes / changes:
  - Before scripts are added to the page, a check is done for the existance of cookie glide_user_route. This makes sure scripts are only added to actual ServiceNow instances.

## 6.3.2.7 (2023-01-09)
Fixes / changes:
  - Add support for "click to list" in case when Reference Key Dictionary attribute is set (other then sys_id)
  - Next Experience picker text color now follows CSS variable --now-unified-nav_utility-menu-trigger--color

## 6.3.2.5 (2022-12-21)
Fixes / changes:
  - Fix classname for the NiceError update

## 6.3.2.4 (2022-12-13)
Fixes / changes:
  - Improved guidance / errormessage on the ScriptSync helper tab

## 6.3.2.3 (2022-12-10)
Fixes / changes:
  - Make refrences in NiceError errors clickable (Discussion #325, PR #332 / #334 by VanWeapon, version 6.3.2.2 published for FF only)
  - FireFox containers support for codesearch (Issue #333)
  - Fix for slashcommand switches type link, such as -c to work when using /-c

## 6.3.2.0 (2022-12-03)
Fixes / changes:
  - Reinitialize contextmenus from background.js at each startup to prevent loosing menus in FireFox
  - Reinitialize contextmenus after slashcommand save, to immidiate see slashcommands containing #contextmenu
  - Ability to add switch overwrites per table, specific for -s for the syslog table (Discussion #329)
  - Bugfix for focus on filter input when opening navigator menu in Next UI
  
## 6.3.1.7 (2022-11-30)
Fixes / changes:
  - Change searchmode in datatables in popup to allow regex, ie | for or. (Discussion #331)
  - Change so that g_form.setLabelOf keeps working when /tn is active (it does remove the technical name now)

## 6.3.1.5 (2022-11-22)
Fixes / changes:
  - Only select Unfied Nav filter input when one input with id #filter is present (Issue #328)
  - Add option to not mark default update set
  - Fixing a few typos (Updateset => Update set)


## 6.3.1.2 (2022-11-21)
Fixes / changes:
  - Delete localstorage when full, to prevent errors.
  - Fixes to prevent console errors for next experience and new navigator feature.
  - Add error handling in tables tab of popup.
  - Add a red markation in SN Utils Next UI Update set picker when in default update set (Request: SN Devs / wiz0floyd)

## 6.3.0.6 (2022-11-17)
Fixes / changes:
  - Allow explicit navigator search with /m command, even when setting is off (Issue 326)

## 6.3.0.5 (2022-11-16)
Fixes / changes:
  - Restore showing switches to current table i.e. slashcommand:  /-t
  - Restore always opening commands in a new tab when gsft_main is not present.

## 6.3.0.3 (2022-11-15)
Fixes / changes:
  - Prevent adding underscore to the new search highlighting in HTML Tags
  - Support for actiontype script in new navigator
  - Prevent showing undefined in new navigator
  - Set objects to null when slashcommand popup opens /closes to force refresh

## 6.3.0.0 (2022-11-14)
Features:
  - Integrated navigator search in slashcommands (Only when Next Experience is anabled)
  - Option to local store last slashcommands per instance, scroll through them with arrow up, down key

Fixes / changes:
  - Improve copycells for cells with long text content (Issue #318)
  - Fix scriptsync icons click event inside forms in studio (Issue #319)
  - Fix slushbucket when filtered to not loose eventhandlers (issue #322)
  - Removed hist / nav / fav slashcommands
  - Improved way of handling slashcommands when opening page in current window
  - Removed space to complete slashcommand, to not interfere with new serach function (tab still works)

## 6.2.1.0 (2022-11-03)
Fixes / changes:
  - Updated icons, color refresh and better quality
  - Added different OnPrem icons (Discussion #317)


## 6.2.0.3 (2022-10-27)
Fixes / changes:
  - encodeURIComponent encodedquery in slashcommands
  - minor improvement adding pickers inan Next Experience
  - Fix for table suggestions on "404" page (Issue #315)
  - Add /tables slashcommand
  
## 6.2.0.0 (2022-10-22)
Features:
  - added CHANGELOG.md to maintain a changelog :)
  - added filter to list page in workspace activated via Technical Names (/tn or doubleclick)
  - added edit encodedquery, link to classic list and tablename to lists in workspace. Also activated via Technical Names
  - indicate running(🔴 BG script running..) and finishing(🟢 BG script finished..) BG scripts in the tab title

Fixes / changes:
  - renamed script added to BG script page from monaco.js to bgscript.js
  - removed method snuAddTechnicalNamesWorkspace from inject.js for legacy workspace
  - Leverage Microsoft Edge Addons API for NodeJS to auto publish Edge version
 (code with keys not on github)

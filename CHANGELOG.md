# CHANGELOG.md

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

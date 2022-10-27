# CHANGELOG.md

## 6.2.0.4 (2022-10-27)

Features:

  - None

Fixes / changes:

  - encodeURIComponent encodedquery in slashcommands
  - minor improvement adding pickers in Next Experience
  - Fix for table suugestions on "404" page (Issue #315)
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

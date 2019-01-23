#!/bin/bash
rm -f publish/*.zip
rm -f publish/*.xpi
var=$(sed '6!d' manifest.json) #get version from main
sed -i '' "6s/.*/$var/" publish/manifest-firefox.json #sync version to other
sed -i '' "6s/.*/$var/" publish/manifest-onprem.json
zip -r publish/chrome-snutils.zip . -x "*.DS_Store" -x "*.git*" -x ".jshintrc"  -x "*.sh" -x "*.md" -x "*publish*"
mv manifest.json publish/manifest-chrome.json
mv publish/manifest-firefox.json manifest.json
zip -r publish/firefox-snutils.xpi . -x "*.DS_Store" -x "*.git*" -x ".jshintrc"  -x "*.sh" -x "*.md" -x "*publish*"
mv manifest.json publish/manifest-firefox.json
mv publish/manifest-onprem.json manifest.json
sed -i '' "1s/.*/var onprem = true;/" background.js
zip -r publish/onprem-snutils.zip . -x "*.DS_Store" -x "*.git*" -x ".jshintrc"  -x "*.sh" -x "*.md" -x "*publish*"
sed -i '' "1s/.*/var onprem = false;/" background.js
mv manifest.json publish/manifest-onprem.json
mv publish/manifest-chrome.json manifest.json
var='    "version": "0.0.0.0",'
sed -i '' "6s/.*/$var/" publish/manifest-firefox.json #sync version to other
sed -i '' "6s/.*/$var/" publish/manifest-onprem.json

node publish/publish.js

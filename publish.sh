#!/bin/bash

networksetup -setairportpower en0 off #disable wifi while packaging, to prevent iCloud sync issues

rm -f publish/*.zip
rm -f publish/*.xpi
var=$(sed '6!d' manifest.json) #get version from main manifest.json (content of line 6)
sed -i '' "6s/.*/$var/" publish/manifest-firefox.json #sync version to other
sed -i '' "6s/.*/$var/" publish/manifest-onprem.json
sed -i '' "6s/.*/$var/" publish/manifest-firefox-onprem.json
sed -i '' "6s/.*/$var/" publish/manifest-edge.json
zip -r publish/snutils-chrome-base.zip . -x "*.DS_Store" -x "*.git*" -x ".jshintrc" -x ".docx" -x "*.sh" -x "*.md" -x "*publish*"
mv manifest.json publish/manifest-chrome.json

sed -i '' "1s/.*/var onprem = true;/" background.js
mv publish/manifest-onprem.json manifest.json
zip -r publish/snutils-chrome-onprem.zip . -x "*.DS_Store" -x "*.git*" -x ".jshintrc" -x ".docx" -x "*.sh" -x "*.md" -x "*publish*"
mv manifest.json publish/manifest-onprem.json

mv publish/manifest-firefox.json manifest.json
mv js/monaco/vs/language/typescript/tsWorker.js publish/tsWorker.js 
mv publish/tsWorkerFF.js js/monaco/vs/language/typescript/tsWorker.js
zip -r publish/snutils-firefox-base.xpi . -x "*.DS_Store" -x "*.git*" -x ".jshintrc" -x ".docx" -x "*.sh" -x "*.md" -x "*publish*"
mv manifest.json publish/manifest-firefox.json

mv publish/manifest-firefox-onprem.json manifest.json
zip -r publish/snutils-firefox-onprem.xpi . -x "*.DS_Store" -x "*.git*" -x ".jshintrc" -x ".docx" -x "*.sh" -x "*.md" -x "*publish*"
mv js/monaco/vs/language/typescript/tsWorker.js publish/tsWorkerFF.js
mv publish/tsWorker.js js/monaco/vs/language/typescript/tsWorker.js
mv manifest.json publish/manifest-firefox-onprem.json

mv publish/manifest-edge.json manifest.json
zip -r publish/snutils-edge-base.zip . -x "*.DS_Store" -x "*.git*" -x ".jshintrc" -x ".docx" -x "*.sh" -x "*.md" -x "*publish*"
mv manifest.json publish/manifest-edge.json

mv publish/manifest-chrome.json manifest.json
sed -i '' "1s/.*/var onprem = false;/" background.js
var='    "version": "0.0.0.0",'
sed -i '' "6s/.*/$var/" publish/manifest-firefox.json #sync version to other
sed -i '' "6s/.*/$var/" publish/manifest-onprem.json
sed -i '' "6s/.*/$var/" publish/manifest-firefox-onprem.json
sed -i '' "6s/.*/$var/" publish/manifest-edge.json

#publishing same version# to Chrome is a pain, adding a check..
currentversion=$(sed '6!d' manifest.json) #get version from main manifest.json (content of line 6)
lastpublishedversion=`cat publish/lastpublishedversion.txt`

networksetup -setairportpower en0 on
sleep 6

if [ "$lastpublishedversion" = "$currentversion" ]; then
    echo "Can not publish, version not updated in manifest.json: $currentversion"
else
    node publish/publish.mjs
    echo "Publishing: $currentversion"
    echo "$currentversion" > publish/lastpublishedversion.txt #write version to file
fi



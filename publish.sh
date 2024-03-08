#!/bin/bash
rm -f publish/*.zip
rm -f publish/*.xpi
var=$(sed '6!d' manifest.json) #get version from main manifest.json (content of line 6)
sed -i '' "6s/.*/$var/" publish/manifest-firefox.json #sync version to other
sed -i '' "6s/.*/$var/" publish/manifest-onprem.json
sed -i '' "6s/.*/$var/" publish/manifest-firefox-onprem.json
sed -i '' "6s/.*/$var/" publish/manifest-edge.json
zip -r publish/chrome-snutils.zip . -x "*.DS_Store" -x "*.git*" -x ".jshintrc" -x ".docx" -x "*.sh" -x "*.md" -x "*publish*"
mv manifest.json publish/manifest-chrome.json
mv publish/manifest-firefox.json manifest.json
mv js/monaco/vs/language/typescript/tsWorker.js publish/tsWorker.js 
mv publish/tsWorkerFF.js js/monaco/vs/language/typescript/tsWorker.js
zip -r publish/firefox-snutils.xpi . -x "*.DS_Store" -x "*.git*" -x ".jshintrc" -x ".docx" -x "*.sh" -x "*.md" -x "*publish*"
echo "1th"
mv js/monaco/vs/language/typescript/tsWorker.js publish/tsWorkerFF.js
mv publish/tsWorker.js js/monaco/vs/language/typescript/tsWorker.js
mv manifest.json publish/manifest-firefox.json

mv publish/manifest-edge.json manifest.json
zip -r publish/edge-snutils.zip . -x "*.DS_Store" -x "*.git*" -x ".jshintrc" -x ".docx" -x "*.sh" -x "*.md" -x "*publish*"
mv manifest.json publish/manifest-edge.json

sed -i '' "1s/.*/var onprem = true;/" background.js
mv publish/manifest-onprem.json manifest.json
zip -r publish/onprem-snutils.zip . -x "*.DS_Store" -x "*.git*" -x ".jshintrc" -x ".docx" -x "*.sh" -x "*.md" -x "*publish*"
mv manifest.json publish/manifest-onprem.json

mv publish/manifest-firefox-onprem.json manifest.json
mv js/monaco/vs/language/typescript/tsWorker.js publish/tsWorker.js 
mv publish/tsWorkerFF.js js/monaco/vs/language/typescript/tsWorker.js
zip -r publish/onprem-firefox-snutils.xpi . -x "*.DS_Store" -x "*.git*" -x ".jshintrc" -x ".docx" -x "*.sh" -x "*.md" -x "*publish*"
echo "2nd"
mv js/monaco/vs/language/typescript/tsWorker.js publish/tsWorkerFF.js
mv publish/tsWorker.js js/monaco/vs/language/typescript/tsWorker.js
mv manifest.json publish/manifest-firefox-onprem.json

mv publish/manifest-chrome.json manifest.json
sed -i '' "1s/.*/var onprem = false;/" background.js
var='    "version": "0.0.0.0",'
sed -i '' "6s/.*/$var/" publish/manifest-firefox.json #sync version to other
sed -i '' "6s/.*/$var/" publish/manifest-onprem.json
sed -i '' "6s/.*/$var/" publish/manifest-firefox-onprem.json
sed -i '' "6s/.*/$var/" publish/manifest-edge.json


#Remove the chrome extension and reunpack it
rm -rf publish/chrome-snutils
unzip publish/chrome-snutils.zip -d publish/chrome-snutils
open "http://reload.extensions/"
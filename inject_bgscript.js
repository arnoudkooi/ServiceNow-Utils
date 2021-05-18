var cssId = 'myCss';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'styles/GlideEditor5Includes.cssx';
    link.media = 'all';
    head.appendChild(link);
}

var editor;

var options = {
    "indentUnit": 4,
    "mode":  "javascript",
    "softTabs": true,
    "theme": "snc",
    "height": 257,
    "lineWrapping": true,
    "matchBrackets": true,
    "indentWithTabs": true,
    "matchTags": {
        "bothTags": true
    },
    "readOnly": false,
    "styleActiveLine": true,
    "extraKeys": {},
    "viewportMargin": 10,
    "mode": "javascript",
    "lineNumbers": true,
    "enableMacros": true,
    "foldGutter": true,
    "gutters": [
        "CodeMirror-linenumbers",
        "CodeMirror-foldgutter"
    ],
    "autoCloseBrackets": true,
    "eslintConfig": {
        "rules": {
            "constructor-super": "warn",
            "no-case-declarations": "warn",
            "no-class-assign": "warn",
            "no-compare-neg-zero": "warn",
            "no-cond-assign": "warn",
            "no-console": "warn",
            "no-const-assign": "warn",
            "no-constant-condition": "warn",
            "no-control-regex": "warn",
            "no-debugger": "warn",
            "no-delete-var": "warn",
            "no-dupe-args": "warn",
            "no-dupe-class-members": "warn",
            "no-dupe-keys": "warn",
            "no-duplicate-case": "warn",
            "no-empty-character-class": "warn",
            "no-empty-pattern": "warn",
            "no-empty": [
                "warn",
                {
                    "allowEmptyCatch": true
                }
            ],
            "no-ex-assign": "warn",
            "no-extra-boolean-cast": "warn",
            "no-extra-semi": "warn",
            "semi": "warn",
            "no-fallthrough": "warn",
            "no-func-assign": "warn",
            "no-global-assign": "warn",
            "no-inner-declarations": "warn",
            "no-invalid-regexp": "warn",
            "no-irregular-whitespace": "warn",
            "no-mixed-spaces-and-tabs": "warn",
            "no-new-symbol": "warn",
            "no-obj-calls": "warn",
            "no-octal": "warn",
            "no-redeclare": "warn",
            "no-regex-spaces": "warn",
            "no-self-assign": "warn",
            "no-sparse-arrays": "warn",
            "no-this-before-super": "warn",
            "no-undef": "off",
            "no-unexpected-multiline": "warn",
            "no-unreachable": "warn",
            "no-unsafe-finally": "warn",
            "no-unsafe-negation": "warn",
            "no-unused-labels": "warn",
            "no-unused-vars": "off",
            "no-useless-escape": "warn",
            "require-yield": "warn",
            "use-isnan": "warn",
            "valid-typeof": "warn"
        }
    }
}
var script = document.createElement('script');
script.onload = function () {

    var script2 = document.createElement('script');
    script2.onload = function () {

        editor = CodeMirror.fromTextArea(document.getElementById('runscript'), options);
        
    };
    script2.src = "/scripts/GlideEditor5Includes.jsx";
    document.head.appendChild(script2);
    
};
script.src = "/scripts/doctype/js_includes_doctype.jsx";
document.head.appendChild(script);



function snuSettingsAdded() {
}

function getMessage(x){
    return "fake";
}

var NOW = {
    dateFormat: {
        "timeAgo": false,
        "dateBoth": false,
        "dateStringFormat": "yyyy-MM-dd",
        "timeStringFormat": "HH:mm:ss"
    }
}
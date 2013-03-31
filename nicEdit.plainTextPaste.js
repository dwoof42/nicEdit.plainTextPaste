/*globals bkClass, nicEditors */
/*jslint browser: true, plusplus: true, eqeq: true */

"use strict";

var nicPlainTextPaste = bkClass.extend({

    construct: function (nicEditor) {
        this.ne = nicEditor;
        nicEditor.addEvent('add', this.add.closureListener(this));
        this.pasteCache = '';
    },

    add: function (instance) {
        this.elm = instance.elm;
        this.elm.addEvent('paste', this.initPasteClean.closureListener(this));
    },

    cleanup: function (ni) {
        
    },

    initPasteClean: function () {
        this.pasteCache = this.elm.innerHTML;
        setTimeout(this.pasteClean.closure(this), 100);
    },

    pasteClean: function () {
        var matchedHead = "",
			matchedTail = "",
			newContent = this.elm.innerHTML,
			newContentStart = 0,
			newContentFinish = 0,
			newSnippet = "",
			i;

        this.ne.fireEvent("get", this);

        /* Find start of both strings that matches */

        for (newContentStart = 0; newContent.charAt(newContentStart) === this.pasteCache.charAt(newContentStart); newContentStart++) {
            matchedHead += this.pasteCache.charAt(newContentStart);
        }

        /* If newContentStart is inside a HTML tag, move to opening brace of tag */
        for (i = newContentStart; i >= 0; i--) {
            if (this.pasteCache.charAt(i) == "<") {
                newContentStart = i;
                matchedHead = this.pasteCache.substring(0, newContentStart);

                break;
            } else if (this.pasteCache.charAt(i) === ">") {
                break;
            }
        }

        newContent = this.reverse(newContent);
        this.pasteCache = this.reverse(this.pasteCache);

        /* Find end of both strings that matches */
        for (newContentFinish = 0; newContent.charAt(newContentFinish) == this.pasteCache.charAt(newContentFinish); newContentFinish++) {
            matchedTail += this.pasteCache.charAt(newContentFinish);
        }

        /* If newContentFinish is inside a HTML tag, move to closing brace of tag */
        for (i = newContentFinish; i >= 0; i--) {
            if (this.pasteCache.charAt(i) == ">") {
                newContentFinish = i;
                matchedTail = this.pasteCache.substring(0, newContentFinish);

                break;
            } else if (this.pasteCache.charAt(i) == "<") {
                break;
            }
        }

        matchedTail = this.reverse(matchedTail);

        /* If there's no difference in pasted content */
        if (newContentStart == newContent.length - newContentFinish) {
            return false;
        }

        newContent = this.reverse(newContent);
        newSnippet = newContent.substring(newContentStart, newContent.length - newContentFinish);
        newSnippet = this.cleanPaste(newSnippet);

        this.content = matchedHead + newSnippet + matchedTail;
        this.ne.fireEvent("set", this);
        this.elm.innerHTML = this.content;
    },

    reverse: function (sentString) {
        var theString = "", i;
        for (i = sentString.length - 1; i >= 0; i--) {
            theString += sentString.charAt(i);
        }
        return theString;
    },

    cleanPaste: function (snippet) {
        var div = document.createElement('div'),
            text;
        div.innerHTML = snippet;
        text = div.text;
        document.removeElement(div);
        return text;
    }

});

nicEditors.registerPlugin(nicPlainTextPaste);


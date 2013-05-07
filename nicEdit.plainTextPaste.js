/*globals bkClass, nicEditors */
/*jslint browser: true, plusplus: true, eqeq: true */

/* 

	nicEdit.plainTextPaste.js version 0.05 

	The basic structure of this is taken from 
		https://bitbucket.org/pykello/nicedit-improved/commits/05a42fe5ab60 and from 
		 Clean Word Paste Mod by Billy Flaherty (www.billyswebdesign.com/)

	You may consider any code by me (dwoof42@gmail.com) to be in the public domain.

	usage is trivial.  Include this file after nicEdit, and by default all html pasted into a nicEditor will be replaced by plain text.  You
	may set the options.plainTextMode property when creating the nicEditor to control this 

	   options.plainTextMode = 'ignore', do nothing
	   options.plainTextMode = 'plain' (default) : replace all pasted text with plain text (by using element.innerText)
	   options.plainTextMode = 'allowHtml':   NOT YET IMPLEMENTED: parse the pasted text, 
											allowing only those tags that are allowed by the current nicEditor

*/

(function (nicEditors) {
	"use strict";

	/* 
	*/


	var div;

	nicEditors.registerPlugin(bkClass.extend({

		construct: function (nicEditor) {
			if (nicEditor.options.pasteMode !== 'allow') {
				this.ne = nicEditor;
				nicEditor.addEvent('add', this.add.closureListener(this));
				this.pasteCache = '';
			}
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
			var div, text;
			if (!div) {
				div = document.createElement('div');
			}
			div.innerHTML = snippet;
			return div.innerText || div.textContent;
		}

	}));


}(nicEditors));



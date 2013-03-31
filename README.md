nicEdit.pastePlainText
==================================================


I needed a script to prevent users from pasting in html into a [nicEdit](http://nicEdit.com).   While this seems to be a pretty
common need and I found a lot of code snippets lying around, nothing was packaged into a simple plugin that
I could simply drop into my page.  

Thus, this project, which is a pretty simple implementation of the concept.   Rather than parsing the html and stripping
out unwanted tags, I'm just letting the browser do the work, setting the innerHTML of a div to the pasted text then replacing
the text with the innerText property.   

The basic idea of attaching to the paste event comes from a (Billy Flaherty)[http://www.billyswebdesign.com] and some of the looping was 
influenced by the (nicEdit-improved)[https://bitbucket.org/pykello/nicedit-improved] repository at bitbucket.   

Use this code any way you want.  



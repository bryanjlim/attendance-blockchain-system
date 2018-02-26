// On Ready
$(document).ready(function()
{
    // Populate Club List
    for(let i=clubList.length - 1; i >= 0; i--)
    {
        var prependString = '<div class="clubLink" shorthand="'+clubList[i].shortHandName+'">'+clubList[i].clubName+'<hr class="mb-4"></div>'; 
        $(".clubList").prepend(prependString); 
    }

	// Sort clubs alphabetically
	li = $(".clubList div");
    li.sort(function(a,b)
    {
		return a.textContent.localeCompare(b.textContent);
	});
    li.detach().prependTo($(".clubList"));
	
	// Add purple highlight on hover
	$('.clubList div').prepend("<div class='wrapInner'></div>");
	// Select text box on start of page
	$("#selectClub").focus().select();
});


// Search Method 
var removedLast = 0;
var lastVFilter = "";
function search() {
    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById('selectClub');
    filter = input.value.toUpperCase();
    ul = document.getElementById("clubList");
    li = $(".clubList div").not(".wrapInner");
    // Loop through all list items, and hide those which don't match the search query

	var remove = [];
    for (i = 0; i < li.length; i++) {
        a = li.get(i);
		
        if (a.textContent.toUpperCase().indexOf(filter) > -1) {
            li.get(i).style.display = "";
        } else {
			remove.push(li.get(i));			
        }
    }
	if(remove.length <li.length){	
		lastVFilter = filter;	
		if(removedLast != remove.length){
			if(li.length - remove.length > 0){
				for(i = 0; i < remove.length; i++){
					remove[i].style.display = "none";
				}
			}		
			li.sort(function(a,b){
				var aIndex = a.textContent.toUpperCase().indexOf(filter);
				var bIndex = b.textContent.toUpperCase().indexOf(filter);
				if(aIndex == bIndex){
					return a.textContent.localeCompare(b.textContent);
				}

				return aIndex > bIndex ? 1 : -1;
			});
		}
	}
	li.unhighlight();
	li.highlight(lastVFilter);
	li.detach().prependTo($(".clubList"));
	removedLast = remove.length;
	return li.filter(function(i){
		return $(this).css("display").toLowerCase() != "none";
	}).first().attr("shorthand");
	
}


jQuery.extend({
    highlight: function (node, re, nodeName, className) 
    {
        if (node.nodeType === 3) 
        {
            var match = node.data.match(re);
            if (match)
            {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) 
                { // skip if already highlighted
                    for (var i = 0; i < node.childNodes.length; i++) 
                    {
                        i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
                    }
                }
        return 0;
    }
});


jQuery.fn.unhighlight = function (options) 
{
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () 
    {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};


jQuery.fn.highlight = function (words, options) 
{
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);
    if (words.constructor === String) 
    {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i)
    {
      return word != '';
    });
    words = jQuery.map(words, function(word, i) 
    {
      return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) 
    {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);

    return this.each(function () 
    {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};

$(".clubList").scroll(function()
{
	var scrollNum = $(".clubList").scrollTop();
	$('.fadeout').css({bottom: -scrollNum - 2 +"px"});
	$(".fadeout").redraw();
});

$.fn.redraw = function() 
{
    return this.hide( 0, function() 
    {
        $( this ).show();
    });
}

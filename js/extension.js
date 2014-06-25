$(document).ready(function() {
    const MAX_INDEX = 30; // including the "More" line - next page
    const HN_BASE_URL = "https://news.ycombinator.com";

    var index = 1; // global arrow index
    var arrow_on = false;

    // add additional td before index to make space for pointer
    for(var i = 1; i <= MAX_INDEX; ++i) {
        $("td").filter(function() {
            return $.text([this]) == i + '.';
        }).before('<td></td>');
    }

    // adjust the colspan of the space filler to compensate 
    // the additional td so that the summary area
    // shows right underneath title area
    $('td[colspan=2]').attr("colspan", 3);

    document.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            /* start arrow mode */
            case 9: // tab key pressed
                if(!arrow_on) {
                    event.preventDefault();
                    move_arrow_to(index);
                    arrow_on = true;
                }
            break;

            /* go down one entry */
            case 40: // down arrow key
                if(arrow_on) {
                    if(index < MAX_INDEX) {
                        event.preventDefault();
                        ++index;
                        move_arrow_to(index);
                    }
                }
            break;

            /* go up one entry */
            case 38: // up arrow key
                if(arrow_on) {
                    if(index > 1) {
                        event.preventDefault();
                        --index;
                        move_arrow_to(index);
                    }
                }
            break;

            /* escape arrow mode */
            case 27: // esc key
                arrow_on = false;
                $('.arrow-right').remove();

                // remove focus
                $("td").filter(function() {
                    return $.text([this]) == index + '.';
                }).parent().find('td.title a').blur();
            break;

            /* go to first entry */
            case 49: // key "1"
                if(arrow_on) {
                    index = 1;
                    move_arrow_to(index);
                }

            /* next page */
            case 39: // right arrow key
                var next_page_link_part = $("td").filter(function() {
                    return $.text([this]) == 'More';
                }).find('a').attr('href');
                var next_page_link_full = HN_BASE_URL + next_page_link_part;
                window.location.href = next_page_link_full;
            break;

            /* upvote */
            case 86: // "v" key
                if(arrow_on) {
                    // get a handle of the anchor
                    var vote_node = $("td").filter(function() {
                        return $.text([this]) == index + '.';
                    }).parent().find('td:nth-of-type(3) a');

                    // hide the upvote arrow
                    $("td").filter(function() {
                        return $.text([this]) == index + '.';
                    }).parent().find('.votearrow').hide();

                    var ping = new Image();
                    ping.src = vote_node.attr('href');
                }
            break;

            default:
            break;
        }

        // ABANDONED, reason: stopped hijacking enter key keydown event
        // open link in background by simulating ctrl+click
        // code: http://stackoverflow.com/questions/10812628/open-a-new-tab-in-the-background
        function open_in_background(link){
            var a = document.createElement("a");
            a.href = link;
            var evt = document.createEvent("MouseEvents");
            //the tenth parameter of initMouseEvent sets ctrl key
            evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
                                        true, false, false, true, 0, null);
            a.dispatchEvent(evt);
        }

        function move_arrow_to(index) {
            $('.arrow-right').remove();
            $("td").filter(function() {
                return $.text([this]) == index + '.';
            }).prev('td').html('<div class="arrow-right"></div>');

            // focus on corresponding link
            $("td").filter(function() {
                return $.text([this]) == index + '.';
            }).parent().find('td.title a').focus();
        }

    });

});
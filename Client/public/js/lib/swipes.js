
function swipes (object) {

    var start = {},
	delta = {},
	swipeLeft = new Event('swipeLeft'),
	swipeRight = new Event('swipeRight');

    object.addEventListener('touchstart', touchStart);
    object.addEventListener('touchmove', touchMove);
    object.addEventListener('touchend', evalSwipe);
    
    object.addEventListener('mousedown', mousedown);
    object.addEventListener('mousemove', mousemove);
    object.addEventListener('mouseup', evalSwipe);

    function touchStart (e) {

	start = {
	    x: e.touches[0].pageX,
	    y: e.touches[0].pageY,
	    time : new Date
	};

	delta = {};
    }

    function touchMove (e) {

	delta = {
	    x: e.touches[0].pageX - start.x,
	    y: e.touches[0].pageY - start.y
	};
    }

    function mousedown (e) {

	start = {
	    x: e.pageX,
	    y: e.pageY,
	    time : new Date
	};

	delta = {};
    }

    function mousemove (e) {

	delta = {
	    x: e.pageX - start.x,
	    y: e.pageY - start.y
	};
    }

    function evalSwipe (e) {
	
	var duration = new Date - start.time,
	    isSwipe = false;

	if(e.type == 'touchend') isSwipe = duration < 500 && Math.abs(delta.x) > 70;
	if(e.type == 'mouseup') isSwipe = duration < 250 && Math.abs(delta.x) > 20;
	
	if(isSwipe && delta.x < 0) object.dispatchEvent(swipeLeft);
	if(isSwipe && delta.x > 0) object.dispatchEvent(swipeRight);
    }
}

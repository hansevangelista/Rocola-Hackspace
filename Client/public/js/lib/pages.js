
function Pages (container, options) {

    var time = options.time || 500,
        type = options.type || 'single',
        pos = 0 || options.init,
        pages,
        device,
        nextPageClass = options.nextPageClass;

    function setup () {
	
	pages = container.children;
	
        goTo(pos);
        
	animation();

	swipes(container);
        
	container.addEventListener('swipeLeft', next);

	container.addEventListener('swipeRight', prev);
    } 

    function next () {

        if(pos < pages.length - 1){

	    pos++;
	    
	    goTo(pos);
        }
    }

    function prev () {

        if(pos > 0){
	    
	    pos--;
	    
	    goTo(pos);
        }
    }

    function goTo (pos) {
	
        for (var i = 0; i < pages.length; i++) {

	    var style = pages[i].style;

	    style.webkitTransform =
                'translate(' + pos * -100 + '%,0)' + 'translateZ(0)';
	    style.msTransform =
                style.MozTransform =
                style.OTransform = 'translateX(' + pos * -100 + '%)';
        }
    }

    function animation () {

        for (var i = 0; i < pages.length; i++) {
	    
	    var style = pages[i].style;

	    style.webkitTransitionProperty =
	        style.MozTransitionProperty =
	        style.msTransitionProperty =
	        style.OTransitionProperty =
	        style.transitionProperty = 'transform';

	    style.webkitTransitionDuration =
	        style.MozTransitionDuration =
	        style.msTransitionDuration =
	        style.OTransitionDuration =
	        style.transitionDuration = time + 'ms';
        }
    }

    setup();

    return {
        next: next,
        prev: prev
    };
} 

window.addEventListener('scroll', function(e) {
    palletetown.scrollcontrol(10, 'navbar-fixed-top', 'moved-header', true);    
});
function moveScroll(scrollObj, interval, direction){

    var scrollDirection = "-=50px";
    if(direction == "left"){
        scrollDirection = "-="+interval+"px";
    }
    else if(direction == "right"){
        scrollDirection = "+="+interval+"px";
    }
    $(scrollObj).animate({ scrollLeft: scrollDirection}, "slow");
}
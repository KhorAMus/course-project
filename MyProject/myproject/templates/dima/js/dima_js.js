

window.onscroll = function() {
  var scrolled = window.pageYOffset || document.documentElement.scrollTop;

  var menu = document.getElementById('menu');
  var intro_video = document.getElementById('intro_video');
  var menu_rect = menu.getBoundingClientRect();
  var intro_video_rect = intro_video.getBoundingClientRect();

  if(intro_video_rect.bottom >= 0){
    menu.style.position = 'fixed';
    menu.style.top = intro_video_rect.bottom + 'px';
  }
  else{
    menu.style.position = 'fixed';
    menu.style.top = '0%';
    menu.style.right = '0%';
  }
}

function getTopScroll(){
	var doc = document.documentElement;
  var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
  return top;
}

function getLeftScroll(){
  var doc = document.documentElement;
  var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  return left;
}
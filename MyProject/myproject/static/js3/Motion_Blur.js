var filters = document.querySelector(".filters"), // SVG, который содержить фильтры
  defs = filters.querySelector("defs"), // элемент внутри SVG
  blur = defs.querySelector("#blur"), // фильтр размытия
  blurFilter = blur.firstElementChild; // feGaussianBlur


  // проходим через все объекты, которым нужен фильтр размытия
$(".js-blur").each(function(i){
  // клонируем фильтр
  var blurClone=blur.cloneNode(true);

  // создаем и назначаем новый ID, чтобы использовать фильтр в CSS
  var blurId="blur"+i;
  blurClone.setAttribute("id",blurId);

  defs.appendChild(blurClone);

  // назначаем CSS
  var filter="url(#"+blurId+")";
  $(this)
    .css({
      webkitFilter:filter,
      filter:filter
    })
    // храним упоминание фильтра
    .data("blur",blurClone)
  ;
});


// элемент, к которому применяем эффект
var $element=$(".selector");
// храним последнее положение, чтобы измерить изменения
var lastPos=$element.offset();
// коэффициент для контроля за интенсивностью эффекта
var multiplier=0.25;

// помощь в назначении размытия
function setBlur(x,y){
  blurFilter.setAttribute("stdDeviation",x+","+y);
}

(function updateMotionBlur(){
  // получаем текущее положение элемента
  var currentPos=$element.offset();

  // считаем изменения с момента последнего кадра и меняем коэффциент
  var xDiff=Math.abs(currentPos.left-lastPos.left)*multiplier;
  var yDiff=Math.abs(currentPos.top-lastPos.top)*multiplier;

  // назначаем размытие
  setBlur(xDiff,yDiff);

  // храним текущее положение для следующего кадра
  lastPos=currentPos;

  // обновляем следующий кадр
  requestAnimationFrame(updateMotionBlur);
})();
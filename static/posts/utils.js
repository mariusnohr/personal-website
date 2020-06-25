// scale canvas
function scaleCanvas(canvas) {
  // Get the device pixel ratio, falling back to 1.
  const dpr = window.devicePixelRatio || 1;
  // Get the size of the canvas in CSS pixels.
  const rect = canvas.getBoundingClientRect();
  // Give the canvas pixel dimensions of their CSS
  // size * the device pixel ratio.
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.
  ctx.scale(dpr, dpr);
  return ctx;
}

// normalized device coordinates from -1 to +1
function getNDC(pos) {
  const x = (pos[0] / window.innerWidth) * 2 - 1;
  const y = (pos[1] / window.innerHeight) * 2 - 1;
  return [x, y];
}

// get touch device
function isTouchDevice() {
  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  const mq = function (query) {
    return window.matchMedia(query).matches;
  };

  if (
    'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(
    ''
  );
  return mq(query);
}

const isTouch = isTouchDevice();

function clickable(el, handler) {
  const evt = isTouch ? 'touchstart' : 'mousedown';
  el.addEventListener(evt, function (evt) {
    let x = isTouch ? evt.targetTouches[0].pageX : evt.pageX;
    let y = isTouch ? evt.targetTouches[0].pageY : evt.pageY;
    return handler(x, y);
  });
}

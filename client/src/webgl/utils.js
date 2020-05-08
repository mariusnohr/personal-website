import toPX from 'to-px';

// get the visible viewport height at a certain depth in 3D space
export function visibleHeightAtZDepth(depth, camera) {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if (depth < cameraOffset) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = (camera.fov * Math.PI) / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
}

export function visibleWidthAtZDepth(depth, camera) {
  const height = visibleHeightAtZDepth(depth, camera);
  return height * camera.aspect;
}

// convert from screen coords to normalized device coordinates (-1 -> +1)
export function screenToNDC(pos) {
  const x = (pos[0] / window.innerWidth) * 2 - 1;
  const y = -(pos[1] / window.innerHeight) * 2 + 1;
  return [x, y];
}

// check if touch device
export function isTouch() {
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

export function mouseWheelListen(element, callback, noScroll) {
  if (typeof element === 'function') {
    noScroll = !!callback;
    callback = element;
    element = window;
  }
  let lineHeight = toPX('ex', element);
  let listener = function (ev) {
    let dx = ev.deltaX || 0;
    let dy = ev.deltaY || 0;
    let dz = ev.deltaZ || 0;
    let mode = ev.deltaMode;
    let scale = 1;
    switch (mode) {
      case 1:
        scale = lineHeight;
        break;
      case 2:
        scale = window.innerHeight;
        break;
    }
    dx *= scale;
    dy *= scale;
    dz *= scale;
    if (dx || dy || dz) {
      return callback(dx, dy, dz, ev);
    }
  };
  element.addEventListener('wheel', listener, { passive: false });
  return listener;
}

export function inViewPort(camera, object) {
  const frustum = new THREE.Frustum();
  const cameraViewProjectionMatrix = new THREE.Matrix4();

  // every time the camera or objects change position (or every frame)
  camera.updateMatrixWorld(); // make sure the camera matrix is updated
  camera.matrixWorldInverse.getInverse(camera.matrixWorld);
  cameraViewProjectionMatrix.multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );
  frustum.setFromMatrix(cameraViewProjectionMatrix);

  // frustum is now ready to check all the objects you need
  console.log(frustum.intersectsObject(object));
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
